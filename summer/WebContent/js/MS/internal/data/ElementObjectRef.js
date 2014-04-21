/**
 * Second Check 12-27
 * ElementObjectRef
 */
/// <summary> Object reference to a DependencyObject via its Name. </summary>
define(["dojo/_base/declare", "system/Type", "internal/Helper", "media/VisualTreeHelper",
        "internal.data/ObjectRef", "windows/FrameworkElement", "windows/LogicalTreeHelper",
        "markup/IComponentConnector"], 
		function(declare, Type, Helper, VisualTreeHelper,
				ObjectRef, FrameworkElement, LogicalTreeHelper,
				IComponentConnector){
	var ElementObjectRef = declare("ElementObjectRef", ObjectRef, {
		constructor:function(name ){
            if (name == null) 
                throw new Error("ArgumentNullException('name')");
 
            this._name = name.Trim(); 
		},

        /// <summary> Returns the referenced object. </summary> 
        /// <param name="d">Element defining context for the reference. </param>
        /// <param name="args">See ObjectRefArgs </param> 
        /*internal override object */
		GetObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args)
        {
            if (d == null)
                throw new Error('ArgumentNullException("d")'); 

            var o = null; 
            if (args.ResolveNamesInTemplate) 
            {
                // look in container's template (if any) first 
                var fe = d instanceof FrameworkElement ? d : null;
                if (fe != null && fe.TemplateInternal != null)
                {
                    o = Helper.FindNameInTemplate(_name, d); 
                } 

                if (o == null) 
                { 
                    args.NameResolvedInOuterScope = true;
                } 
            }

            var fo = new FrameworkObject(d);
            while (o == null && fo.DO != null) 
            {
                
                var scopeOwnerOut = {
                	"scopeOwner" : null,
                };
                o = fo.FindName(this._name, scopeOwnerOut/*out scopeOwner*/); 
                /*DependencyObject*/
                var scopeOwner = scopeOwnerOut.scopeOwner; 

                // if the original element is a scope owner, supports IComponentConnector, 
                // and has a parent, don't use the result of FindName.  The
                // element is probably an instance of a Xaml-subclassed control;
                // we want to resolve the name starting in the next outer scope.
                // (bug 1669408) 
                // Also, if the element's NavigationService property is locally
                // set, the element is the root of a navigation and should use the 
                // inner scope (bug 1765041) 
                if (d == scopeOwner && d instanceof IComponentConnector &&
                    d.ReadLocalValue(/*System.Windows.Navigation.*/NavigationService.NavigationServiceProperty) == Type.UnsetValue) 
                {
                    /*DependencyObject*/var parent = LogicalTreeHelper.GetParent(d);
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
                if (o == null) 
                { 
                    args.NameResolvedInOuterScope = true;
 
                    // move to the next outer namescope.
                    // First try TemplatedParent of the scope owner.
                    /*FrameworkObject*/
                    var foScopeOwner = new FrameworkObject(scopeOwner);
                    /*DependencyObject*/
                    var dd = foScopeOwner.TemplatedParent; 

                    // if that doesn't work, we could be at the top of 
                    // generated content for an ItemsControl.  If so, use 
                    // the (visual) parent - a panel.
                    if (dd == null) 
                    {
                        var panel = fo.FrameworkParent.DO instanceof Panel ? fo.FrameworkParent.DO : null;
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
                    	var temp = LogicalTreeHelper.GetParent(fo.DO);
                        /*ContentControl*/var cc = temp instanceof ContentControl ? temp : null; 
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
                        /*DependencyObject*/var parent;
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
                        var temp = VisualTreeHelper.GetParent(dd);
                        /*ContentPresenter*/
                        var cp = VisualTreeHelper.IsVisualType(dd) ? (temp instanceof ContentPresenter ? temp : null ): null; 
                        dd = (cp != null && cp.TemplateInternal.CanBuildVisualTree) ? cp : null;
                    }

                    fo.Reset(dd); 
                }
            } 
 
            if (o == null)
            { 
                o = Type.UnsetValue;
                args.NameResolvedInOuterScope = false;
            }
 
            return o;
        }, 
 
        /*public override string*/ 
        ToString:function()
        { 
            return String.Format(CultureInfo.InvariantCulture,
                    "ElementName={0}", this._name);
        },
 
        /*internal override string */
        Identify:function()
        { 
            return "ElementName"; 
        }
 
	});
	
	ElementObjectRef.Type = new Type("ElementObjectRef", ElementObjectRef, [ObjectRef.Type]);
	return ElementObjectRef;
});

 
