package org.summer.view.widget.internal;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkObject;
import org.summer.view.widget.Type;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.ItemContainerGenerator;
import org.summer.view.widget.controls.ItemsControl;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.data.RelativeSource;
import org.summer.view.widget.data.RelativeSourceMode;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.media.VisualTreeHelper;

//#region RelativeObjectRef
/// <summary> Object reference relative to the target element. 
/// </summary>
/*internal*/public final class RelativeObjectRef extends ObjectRef 
{ 
    //-----------------------------------------------------
    // 
    //  Constructors
    //
    //------------------------------------------------------

    /// <summary> Constructor. </summary>
    /// <param name="relativeSource">RelativeSource. </param> 
    /// <exception cref="ArgumentNullException"> relativeSource is a null reference </exception> 
    /*internal*/public RelativeObjectRef(RelativeSource relativeSource)
    { 
        if (relativeSource == null)
            throw new ArgumentNullException("relativeSource");

        _relativeSource = relativeSource; 
    }

    //----------------------------------------------------- 
    //
    //  Public Methods 
    //
    //------------------------------------------------------

    public /*override*/ String ToString() 
    {
        String s; 
        switch (_relativeSource.Mode) 
        {
            case /*RelativeSourceMode.*/FindAncestor: 
                s = String.Format(CultureInfo.InvariantCulture,
                    "RelativeSource {0}, AncestorType='{1}', AncestorLevel='{2}'",
                    _relativeSource.Mode,
                    _relativeSource.AncestorType, 
                    _relativeSource.AncestorLevel);
                break; 
            default: 
                s = String.Format(CultureInfo.InvariantCulture,
                    "RelativeSource {0}", _relativeSource.Mode); 
                break;
        }

        return s; 
    }

    /// <summary> Returns the referenced Object. </summary> 
    /// <param name="d">Element defining context for the reference. </param>
    /// <param name="args">See ObjectRefArgs </param> 
    /// <exception cref="ArgumentNullException"> d is a null reference </exception>
    /*internal*/ /*override*/ public Object GetObject(DependencyObject d, ObjectRefArgs args)
    {
        return GetDataObjectImpl(d, args); 
    }

    /// <summary> Returns the data Object associated with the referenced Object. 
    /// Often this is the same as the referenced Object.
    /// </summary> 
    /// <param name="d">Element defining context for the reference. </param>
    /// <param name="args">See ObjectRefArgs </param>
    /// <exception cref="ArgumentNullException"> d is a null reference </exception>
    /*internal*/ /*override*/ public Object GetDataObject(DependencyObject d, ObjectRefArgs args) 
    {
        Object o = GetDataObjectImpl(d, args); 
        DependencyObject el = o as DependencyObject; 

        if (el != null && ReturnsDataContext) 
        {
            // for generated wrappers, use the ItemForContainer property instead
            // of DataContext, since it's always set by the generator
            o = el.GetValue(ItemContainerGenerator.ItemForItemContainerProperty); 
            if (o == null)
                o = el.GetValue(FrameworkElement.DataContextProperty); 
        } 

        return o; 
    }

    private Object GetDataObjectImpl(DependencyObject d, ObjectRefArgs args)
    { 
        if (d == null)
            return null; 

        switch (_relativeSource.Mode)
        { 
            case /*RelativeSourceMode.*/Self:
                break;              // nothing to do

            case /*RelativeSourceMode.*/TemplatedParent: 
                d = Helper.GetTemplatedParent(d);
                break; 

            case /*RelativeSourceMode.*/PreviousData:
                return GetPreviousData(d); 

            case /*RelativeSourceMode.*/FindAncestor:
                d = FindAncestorOfType(_relativeSource.AncestorType, _relativeSource.AncestorLevel, d, args.IsTracing);
                if (d == null) 
                {
                    return DependencyProperty.UnsetValue;   // we fell off the tree 
                } 
                break;

            default:
                return null;
        }

//        if (args.IsTracing)
//        { 
//            TraceData.Trace(TraceEventType.Warning, 
//                                TraceData.RelativeSource(
//                                    _relativeSource.Mode, 
//                                    TraceData.Identify(d)));
//        }

        return d; 
    }

    /*internal*/ public boolean ReturnsDataContext 
    {
        get { return (_relativeSource.Mode == RelativeSourceMode.PreviousData); } 
    }

    /// <summary> true if the ObjectRef really needs the tree context </summary>
    protected /*override*/ boolean ProtectedTreeContextIsRequired(DependencyObject target) 
    {
        return  (   (_relativeSource.Mode == RelativeSourceMode.FindAncestor 
                ||  (_relativeSource.Mode == RelativeSourceMode.PreviousData))); 
    }

    protected /*override*/ boolean ProtectedUsesMentor
    {
        get
        { 
            switch (_relativeSource.Mode)
            { 
                case /*RelativeSourceMode.*/TemplatedParent: 
                case /*RelativeSourceMode.*/PreviousData:
                    return true; 

                default:
                    return false;
            } 
        }
    } 

    /*internal*/ /*override*/ String Identify()
    { 
        return String.Format(/*System.Windows.Markup.*/TypeConverterHelper.InvariantEnglishUS,
            "RelativeSource ({0})", _relativeSource.Mode);
    }

    //------------------------------------------------------
    // 
    //  Private Method 
    //
    //----------------------------------------------------- 

    private Object GetPreviousData(DependencyObject d)
    {
        // move up to the next containing DataContext scope 
        for (; d != null; d = FrameworkElement.GetFrameworkParent(d))
        { 
            if (BindingExpression.HasLocalDataContext(d)) 
            {
                // special case:  if the element is a ContentPresenter 
                // whose templated parent is a ContentControl or
                // HeaderedItemsControl, and both have the same
                // DataContext, we'll use the parent instead of the
                // ContentPresenter.  In this case, the DataContext 
                // of the CP is set by various forwarding rules, and
                // shouldn't count as a new scope. 
                // Similarly, do the same for a FE whose parent 
                // is a GridViewRowPresenter;  this enables Previous bindings
                // inside ListView. 
                FrameworkElement parent, child;
                ContentPresenter cp;

                if ((cp = d as ContentPresenter) != null) 
                {
                    child = cp; 
                    parent = cp.TemplatedParent as FrameworkElement; 
                    if (!(parent is ContentControl || parent is HeaderedItemsControl))
                    { 
                        parent = cp.Parent as System.Windows.Controls.Primitives.GridViewRowPresenterBase;
                    }
                }
                else 
                {
                    child = d as FrameworkElement; 
                    parent = ((child != null) ? child.Parent : null) as GridViewRowPresenterBase; 
                }

                if (child != null && parent != null &&
                    Object.Equals(child.DataContext, parent.DataContext))
                {
                    d = parent; 
                    if (!BindingExpression.HasLocalDataContext(parent))
                    { 
                        continue; 
                    }
                } 

                break;
            }
        } 

        if (d == null) 
            return DependencyProperty.UnsetValue;   // we fell off the tree 

        // this only makes sense within generated content.  If this 
        // is the case, then d is now the wrapper element, its visual
        // parent is the layout element, and the layout's ItemsOwner
        // is the govening ItemsControl.
        Visual v = d as Visual; 
        DependencyObject layout = (v != null) ? VisualTreeHelper.GetParent(v) : null;
        ItemsControl ic = ItemsControl.GetItemsOwner(layout); 
        if (ic == null) 
        {
//            if (TraceData.IsEnabled) 
//                TraceData.Trace(TraceEventType.Error, TraceData.RefPreviousNotInContext);
            return null;
        }

        // now look up the wrapper's previous sibling within the
        // layout's children collection 
        Visual v2 = layout as Visual; 
        int count = (v2 != null) ? v2.InternalVisualChildrenCount : 0;
        int j = -1; 
        Visual prevChild = null;   //child at j-1th index
        if (count != 0)
        {
            j = IndexOf(v2, v, out prevChild); 
        }
        if (j > 0) 
        { 
            d = prevChild;
        } 
        else
        {
            d = null;
//            if ((j < 0) && TraceData.IsEnabled) 
//                TraceData.Trace(TraceEventType.Error, TraceData.RefNoWrapperInChildren);
        } 
        return d; 
    }

    private DependencyObject FindAncestorOfType(Type type, int level, DependencyObject d, boolean isTracing)
    {
        if (type == null)
        { 
//            if (TraceData.IsEnabled)
//                TraceData.Trace(TraceEventType.Error, TraceData.RefAncestorTypeNotSpecified); 
            return null; 
        }
        if (level < 1) 
        {
//            if (TraceData.IsEnabled)
//                TraceData.Trace(TraceEventType.Error, TraceData.RefAncestorLevelInvalid);
            return null; 
        }

        // initialize search to start at the parent of the given DO 
        FrameworkObject fo = new FrameworkObject(d);
        fo.Reset(fo.GetPreferVisualParent(true).DO); 

        while (fo.DO != null)
        {
//            if (isTracing) 
//            {
//                TraceData.Trace(TraceEventType.Warning, 
//                                    TraceData.AncestorLookup( 
//                                        type.Name,
//                                        TraceData.Identify(fo.DO))); 
//            }

            if (type.IsInstanceOfType(fo.DO))   // found it!
            { 
                if (--level <= 0)
                    break; 
            } 

            fo.Reset(fo.PreferVisualParent.DO); 
        }

        return fo.DO;
    } 

    private int IndexOf(Visual parent, Visual child, /*out*/ Visual prevChild) 
    { 
        Visual temp;
        boolean foundIndex = false; 
        prevChild = null;
        int count = parent.InternalVisualChildrenCount;
        int i;
        for(i = 0; i < count; i++) 
        {
            temp = parent.InternalGetVisualChild(i); 
            if(child == temp) 
            {
                foundIndex = true; 
                break;
            }
            prevChild = temp;
        } 
        if (foundIndex) return i;
        else return -1; 
    } 

    //------------------------------------------------------ 
    //
    //  Private Fields
    //
    //----------------------------------------------------- 

    RelativeSource _relativeSource; 
} 