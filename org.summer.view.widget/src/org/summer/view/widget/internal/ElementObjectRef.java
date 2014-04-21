package org.summer.view.widget.internal;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.FrameworkElement;
import org.summer.view.widget.FrameworkObject;
import org.summer.view.widget.InheritanceBehavior;
import org.summer.view.widget.LogicalTreeHelper;
import org.summer.view.widget.controls.ContentControl;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.Panel;
import org.summer.view.widget.markup.IComponentConnector;
import org.summer.view.widget.media.VisualTreeHelper;

//#region ElementObjectRef 
    /// <summary> Object reference to a DependencyObject via its Name. </summary>
    /*internal*/public final class ElementObjectRef extends ObjectRef 
    {
        //------------------------------------------------------
        //
        //  Constructors 
        //
        //------------------------------------------------------ 
 
        /// <summary> Constructor. </summary>
        /// <param name="name">Name of the referenced Element.</param> 
        /// <exception cref="ArgumentNullException"> name is a null reference </exception>
        /*internal*/public ElementObjectRef(String name)
        {
            if (name == null) 
                throw new ArgumentNullException("name");
 
            _name = name.Trim(); 
        }
 
        //-----------------------------------------------------
        //
        //  Public Methods
        // 
        //------------------------------------------------------
 
        /// <summary> Returns the referenced Object. </summary> 
        /// <param name="d">Element defining context for the reference. </param>
        /// <param name="args">See ObjectRefArgs </param> 
        /*internal*/ /*override*/public Object GetObject(DependencyObject d, ObjectRefArgs args)
        {
            if (d == null)
                throw new ArgumentNullException("d"); 

            Object o = null; 
            if (args.ResolveNamesInTemplate) 
            {
                // look in container's template (if any) first 
                FrameworkElement fe = d as FrameworkElement;
                if (fe != null && fe.TemplateInternal != null)
                {
                    o = Helper.FindNameInTemplate(_name, d); 

//                    if (args.IsTracing) 
//                    { 
//                        TraceData.Trace(TraceEventType.Warning,
//                                            TraceData.ElementNameQueryTemplate( 
//                                                _name,
//                                                TraceData.Identify(d)));
//                    }
                } 

                if (o == null) 
                { 
                    args.NameResolvedInOuterScope = true;
                } 
            }

            FrameworkObject fo = new FrameworkObject(d);
            while (o == null && fo.DO != null) 
            {
                DependencyObject scopeOwner; 
                o = fo.FindName(_name, /*out*/ scopeOwner); 

                // if the original element is a scope owner, supports IComponentConnector, 
                // and has a parent, don't use the result of FindName.  The
                // element is probably an instance of a Xaml-subclassed control;
                // we want to resolve the name starting in the next outer scope.
                // (bug 1669408) 
                // Also, if the element's NavigationService property is locally
                // set, the element is the root of a navigation and should use the 
                // inner scope (bug 1765041) 
                if (d == scopeOwner && d instanceof IComponentConnector &&
                    d.ReadLocalValue(/*System.Windows.Navigation.*/NavigationService.NavigationServiceProperty) == DependencyProperty.UnsetValue) 
                {
                    DependencyObject parent = LogicalTreeHelper.GetParent(d);
                    if (parent == null)
                    { 
                        parent = Helper.FindMentor(d.InheritanceContext);
                    } 
 
                    if (parent != null)
                    { 
                        o = null;
                        fo.Reset(parent);
                        continue;
                    } 
                }
 
//                if (args.IsTracing) 
//                {
//                    TraceData.Trace(TraceEventType.Warning, 
//                                        TraceData.ElementNameQuery(
//                                            _name,
//                                            TraceData.Identify(fo.DO)));
//                } 

                if (o == null) 
                { 
                    args.NameResolvedInOuterScope = true;
 
                    // move to the next outer namescope.
                    // First try TemplatedParent of the scope owner.
                    FrameworkObject foScopeOwner = new FrameworkObject(scopeOwner);
                    DependencyObject dd = foScopeOwner.TemplatedParent; 

                    // if that doesn't work, we could be at the top of 
                    // generated content for an ItemsControl.  If so, use 
                    // the (visual) parent - a panel.
                    if (dd == null) 
                    {
                        Panel panel = fo.FrameworkParent.DO as Panel;
                        if (panel != null && panel.IsItemsHost)
                        { 
                            dd = panel;
                        } 
                    } 

                    // if the logical parent is a ContentControl whose content 
                    // points right back, move to the ContentControl.   This is the
                    // m---- equivalent of having the ContentControl as the TemplatedParent.
                    // (The InheritanceBehavior clause prevents this for cases where the
                    // parent ContentControl imposes a barrier, e.g. Frame) 
                    if (dd == null && scopeOwner == null)
                    { 
                        ContentControl cc = LogicalTreeHelper.GetParent(fo.DO) as ContentControl; 
                        if (cc != null && cc.Content == fo.DO && cc.InheritanceBehavior == InheritanceBehavior.Default)
                        { 
                            dd = cc;
                        }
                    }
 
                    // next, see if we're in a logical tree attached directly
                    // to a ContentPresenter.  This is the m---- equivalent of 
                    // having the ContentPresenter as the TemplatedParent. 
                    if (dd == null && scopeOwner == null)
                    { 
                        // go to the top of the logical subtree
                        DependencyObject parent;
                        for (dd = fo.DO;;)
                        { 
                            parent = LogicalTreeHelper.GetParent(dd);
                            if (parent == null) 
                            { 
                                parent = Helper.FindMentor(dd.InheritanceContext);
                            } 

                            if (parent == null)
                                break;
 
                            dd = parent;
                        } 
 
                        // if it's attached to a ContentPresenter, move to the CP
                        ContentPresenter cp = VisualTreeHelper.IsVisualType(dd) ? VisualTreeHelper.GetParent(dd) as ContentPresenter : null; 
                        dd = (cp != null && cp.TemplateInternal.CanBuildVisualTree) ? cp : null;
                    }

                    fo.Reset(dd); 
                }
            } 
 
            if (o == null)
            { 
                o = DependencyProperty.UnsetValue;
                args.NameResolvedInOuterScope = false;
            }
 
            return o;
        } 
 
        public /*override*/ String ToString()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                    "ElementName={0}", _name);
        }
 
        /*internal*/ /*override*/ String Identify()
        { 
            return "ElementName"; 
        }
 
        //-----------------------------------------------------
        //
        //  Private Fields
        // 
        //-----------------------------------------------------
 
        String _name; 
    }
 
//#endregion ElementObjectRef