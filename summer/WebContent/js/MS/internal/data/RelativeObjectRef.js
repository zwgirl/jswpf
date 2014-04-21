/**
 * Second Check 12-27
 * RelativeObjectRef
 */
/// <summary> Object reference relative to the target element. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "internal.data/ObjectRef"/*, "windows/FrameworkElement"*/,
        "windows/DependencyObject", "data/RelativeSourceMode"/*, "internal/FrameworkObject"*/], 
		function(declare, Type, ObjectRef, /*FrameworkElement,*/
				DependencyObject, RelativeSourceMode/*, FrameworkObject*/){
	var RelativeObjectRef = declare("RelativeObjectRef", ObjectRef,{
		constructor:function(/*RelativeSource*/ relativeSource ){
	        if (relativeSource == null)
	            throw new Error('ArgumentNullException("relativeSource")');

	        this._relativeSource = relativeSource; 
		},
		
	    /*public override string */
		ToString:function() 
	    {
	        var s; 
	        switch (this._relativeSource.Mode) 
	        {
	            case RelativeSourceMode.FindAncestor: 
	                s = String.Format(CultureInfo.InvariantCulture,
	                    "RelativeSource {0}, AncestorType='{1}', AncestorLevel='{2}'",
	                    this._relativeSource.Mode,
	                    this._relativeSource.AncestorType, 
	                    this._relativeSource.AncestorLevel);
	                break; 
	            default: 
	                s = String.Format(CultureInfo.InvariantCulture,
	                    "RelativeSource {0}", _relativeSource.Mode); 
	                break;
	        }

	        return s; 
	    },
	    

	    /// <summary> Returns the referenced object. </summary> 
	    /// <param name="d">Element defining context for the reference. </param>
	    /// <param name="args">See ObjectRefArgs </param> 
	    /// <exception cref="ArgumentNullException"> d is a null reference </exception>
	    /*internal override object */
	    GetObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args)
	    {
	        return this.GetDataObjectImpl(d, args); 
	    },

	    /// <summary> Returns the data object associated with the referenced object. 
	    /// Often this is the same as the referenced object.
	    /// </summary> 
	    /// <param name="d">Element defining context for the reference. </param>
	    /// <param name="args">See ObjectRefArgs </param>
	    /// <exception cref="ArgumentNullException"> d is a null reference </exception>
	    /*internal override object */
	    GetDataObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args) 
	    {
	        var o = this.GetDataObjectImpl(d, args); 
	        var el = o instanceof DependencyObject ? o : null; 

	        if (el != null && this.ReturnsDataContext) 
	        {
	            // for generated wrappers, use the ItemForContainer property instead
	            // of DataContext, since it's always set by the generator
	            o = el.GetValue(ItemContainerGenerator.ItemForItemContainerProperty); 
	            if (o == null)
	                o = el.GetValue(FrameworkElement.DataContextProperty); 
	        } 

	        return o; 
	    },

	    /*private object */
	    GetDataObjectImpl:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args)
	    { 
	        if (d == null)
	            return null; 

	        switch (this._relativeSource.Mode)
	        { 
	            case RelativeSourceMode.Self:
	                break;              // nothing to do

	            case RelativeSourceMode.TemplatedParent: 
	                d = Helper.GetTemplatedParent(d);
	                break; 

	            case RelativeSourceMode.PreviousData:
	                return GetPreviousData(d); 

	            case RelativeSourceMode.FindAncestor:
	                d = this.FindAncestorOfType(this._relativeSource.AncestorType, this._relativeSource.AncestorLevel, d, args.IsTracing);
	                if (d == null) 
	                {
	                    return DependencyProperty.UnsetValue;   // we fell off the tree 
	                } 
	                break;

	            default:
	                return null;
	        }

	        return d; 
	    },

	    /// <summary> true if the ObjectRef really needs the tree context </summary>
	    /*protected override bool */
	    ProtectedTreeContextIsRequired:function(/*DependencyObject*/ target) 
	    {
	        return  (   (this._relativeSource.Mode == RelativeSourceMode.FindAncestor 
	                ||  (this._relativeSource.Mode == RelativeSourceMode.PreviousData))); 
	    },

	    /*internal override string */
	    Identify:function()
	    { 
	        return String.Format(/*System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS,*/
	            "RelativeSource ({0})", this._relativeSource.Mode);
	    },

	    /*private object */
	    GetPreviousData:function(/*DependencyObject*/ d)
	    {
	        // move up to the next containing DataContext scope 
	        for (; d != null; d = FrameworkElement.GetFrameworkParent1(d))
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
	                /*FrameworkElement*/var parent, child;
	                /*ContentPresenter*/var cp;

	                if ((cp = d instanceof ContentPresenter ? d : null) != null) 
	                {
	                    child = cp; 
	                    parent = cp.TemplatedParent instanceof FrameworkElement ? cp.TemplatedParent : null; 
	                    if (!(parent instanceof ContentControl || parent instanceof HeaderedItemsControl))
	                    { 
	                        parent = cp.Parent instanceof /*System.Windows.Controls.Primitives.*/GridViewRowPresenterBase ? cp.Parent : null;
	                    }
	                }
	                else 
	                {
	                    child = d instanceof FrameworkElement ? d : null;
	                    var temp = ((child != null) ? child.Parent : null);
	                    parent = temp instanceof /*System.Windows.Controls.Primitives.*/GridViewRowPresenterBase ? temp : null; 
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
	        /*Visual*/var v = d instanceof Visual ? d : null; 
	        /*DependencyObject*/var layout = (v != null) ? VisualTreeHelper.GetParent(v) : null;
	        /*ItemsControl*/var ic = ItemsControl.GetItemsOwner(layout); 
	        if (ic == null) 
	        {
//	            if (TraceData.IsEnabled) 
//	                TraceData.Trace(TraceEventType.Error, TraceData.RefPreviousNotInContext);
	            return null;
	        }

	        // now look up the wrapper's previous sibling within the
	        // layout's children collection 
	        /*Visual*/var v2 = layout instanceof Visual ? layout : null; 
	        /*int*/var count = (v2 != null) ? v2.InternalVisualChildrenCount : 0;
	        /*int*/var j = -1; 
	        /*Visual*/var prevChild = null;   //child at j-1th index
	        if (count != 0)
	        {
	        	var prevChildObj = {
	        		"prevChild" : prevChild 
	        	};
	            j = IndexOf(v2, v, prevChildObj/*out prevChild*/); 
	            prevChild = prevChildObj.prevChild;
	        }
	        if (j > 0) 
	        { 
	            d = prevChild;
	        } 
	        else
	        {
	            d = null;
//	            if ((j < 0) && TraceData.IsEnabled) 
//	                TraceData.Trace(TraceEventType.Error, TraceData.RefNoWrapperInChildren);
	        } 
	        return d; 
	    },

	    /*private DependencyObject*/ 
	    FindAncestorOfType:function(/*Type*/ type, /*int*/ level, /*DependencyObject*/ d, /*bool*/ isTracing)
	    {
	        if (type == null)
	        { 
	            return null; 
	        }
	        if (level < 1) 
	        {
	            return null; 
	        }

	        // initialize search to start at the parent of the given DO 
	        /*FrameworkObject*/var fo = new FrameworkObject(d);
	        fo.Reset(fo.GetPreferVisualParent(true).DO); 

	        while (fo.DO != null)
	        {
	            if (type.IsInstanceOfType(fo.DO))   // found it!
	            { 
	                if (--level <= 0)
	                    break; 
	            } 

	            fo.Reset(fo.PreferVisualParent.DO); 
	        }

	        return fo.DO;
	    },

	    /*private int */
	    IndexOf:function(/*Visual*/ parent, /*Visual*/ child, prevChildObj/*out Visual prevChild*/) 
	    { 
	        /*Visual*/var temp;
	        /*bool*/var foundIndex = false; 
	        prevChildObj.prevChild = null;
	        /*int*/var count = parent.InternalVisualChildrenCount;
	        /*int*/var i;
	        for(i = 0; i < count; i++) 
	        {
	            temp = parent.InternalGetVisualChild(i); 
	            if(child == temp) 
	            {
	                foundIndex = true; 
	                break;
	            }
	            prevChildObj.prevChild = temp;
	        } 
	        if (foundIndex) return i;
	        else return -1; 
	    } 
	    
	});
	
	Object.defineProperties(RelativeObjectRef.prototype,{
	    /*internal bool */
		ReturnsDataContext: 
	    {
	        get:function() { return (this._relativeSource.Mode == RelativeSourceMode.PreviousData); } 
	    },
	    
	    /*protected override bool */
	    ProtectedUsesMentor:
	    {
	        get:function()
	        { 
	            switch (this._relativeSource.Mode)
	            { 
	                case RelativeSourceMode.TemplatedParent: 
	                case RelativeSourceMode.PreviousData:
	                    return true; 

	                default:
	                    return false;
	            } 
	        }
	    } 
	});
	
	RelativeObjectRef.Type = new Type("RelativeObjectRef", RelativeObjectRef, [ObjectRef.Type]);
	return RelativeObjectRef;
});
