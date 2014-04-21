/**
 * Run
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "markup/IAddChild", "controls/Control", 
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions"], 
		function(declare, Type, FrameworkElement, IAddChild, Control, 
				FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions){
	var Run = declare("Run", [FrameworkElement, IAddChild], {
		constructor:function(text){
			if(text === undefined){
				text = null;
			}
			this._dom = document.createTextNode(String.Empty);
			
			this.Data = text;
		},
		
	       ///<summary> 
        /// This method is called to Add the object as a child of the DOMElement.  This method is used primarily
        /// by the parser; a more direct way of adding a child to a DOMElement is to use the <see cref="Child" />
        /// property.
        ///</summary> 
        ///<param name="value">
        /// The object to add as a child; it must be a UIElement. 
        ///</param> 
//        void IAddChild.
        AddChild:function(/*Object*/ value)
        { 
        	if(value === undefined || value === null){
        		throw new Error('argument value may notbe null!');
        	}
        	
        	if(typeof value != "string"){
        		throw new Error('Expect the value is a string type!');
        	}
            
        	this.Data = this.Data + value;
        },
        
        ///<summary>
        /// This method is called by the parser when text appears under the tag in markup. 
        /// As Decorators do not support text, calling this method has no effect if the text 
        /// is all whitespace.  For non-whitespace text, throw an exception.
        ///</summary> 
        ///<param name="text">
        /// Text to add as a child.
        ///</param>
//        public void /*IAddChild.*/
        AddText:function (/*String*/ text) 
        {
        	this.AddChild(text);
        }, 
        
        /// <summary>
        ///     Notification that a specified property has been changed 
        /// </summary>
        /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
//        protected override void 
        OnPropertyChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
            /*DependencyProperty*/var dp = e.Property;
 
//            base.OnPropertyChanged(e); 
            UIElement.prototype.OnPropertyChanged.call(this, e); 

            if (e.IsAValueChange || e.IsASubPropertyChange) 
            {
                //
                // Try to fire the Loaded event on the root of the tree
                // because for this case the OnParentChanged will not 
                // have a chance to fire the Loaded event.
                // 
                if (dp != null /*&& dp.OwnerType == typeof(PresentationSource)*/ && dp.Name == "RootSource") 
                {
                    this.TryFireInitialized(); 
                }

                //
                // Invalidation propagation for Styles
                //
 
                // Regardless of metadata, the Style/Template/DefaultStyleKey properties are never a trigger drivers
                if (dp != FrameworkElement.StyleProperty && dp != Control.TemplateProperty &&
                		dp != FrameworkElement.DefaultStyleKeyProperty) 
                { 
                    // Note even properties on non-container nodes within a template could be driving a trigger
                    if (this.TemplatedParent != null) 
                    {
//                        FrameworkElement 
                        var feTemplatedParent = this.TemplatedParent instanceof FrameworkElement ? this.TemplatedParent : null;

                        /*FrameworkTemplate*/
                        var frameworkTemplate = feTemplatedParent.TemplateInternal; 
                        if (frameworkTemplate != null)
                        { 
                        	StyleHelper.OnTriggerSourcePropertyInvalidated(null, frameworkTemplate, this.TemplatedParent, dp, e, false /*invalidateOnlyContainer*/, 
                                /*ref*/ frameworkTemplate.TriggerSourceRecordFromChildIndex, 
                                /*ref*/ frameworkTemplate.PropertyTriggersWithActions,
                            		 this.TemplateChildIndex /*sourceChildIndex*/);
                        } 
                    }

                    // Do not validate Style during an invalidation if the Style was
                    // never used before (dependents do not need invalidation) 
                    if (this.Style != null)
                    { 
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(this.Style, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            /*ref*/ this.Style.TriggerSourceRecordFromChildIndex, 
                            /*ref*/this.Style.PropertyTriggersWithActions,
                        		 0 /*sourceChildIndex*/); // Style can only have triggers that are driven by properties on the container
                    } 

                    // Do not validate Template during an invalidation if the Template was
                    // never used before (dependents do not need invalidation)
                    if (this.TemplateInternal != null) 
                    {
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(null, this.TemplateInternal, this, dp, e, !this.HasTemplateGeneratedSubTree /*invalidateOnlyContainer*/, 
                            /*ref*/ this.TemplateInternal.TriggerSourceRecordFromChildIndex, 
                            /*ref*/ this.TemplateInternal.PropertyTriggersWithActions, 
                            0 /*sourceChildIndex*/); // These are driven by the container 
                    }
 
                    // There may be container dependents in the ThemeStyle. Invalidate them.
                    if (this.ThemeStyle != null && this.Style != this.ThemeStyle)
                    {
                    	StyleHelper.OnTriggerSourcePropertyInvalidated(this.ThemeStyle, null, this, dp, e, true /*invalidateOnlyContainer*/, 
                            /*ref*/ this.ThemeStyle.TriggerSourceRecordFromChildIndex,
                            /*ref*/ this.ThemeStyle.PropertyTriggersWithActions, 
                            0 /*sourceChildIndex*/); // ThemeStyle can only have triggers that are driven by properties on the container
                    }
                } 
            }
 
            /*FrameworkPropertyMetadata*/ 
            var fmetadata = e.Metadata instanceof FrameworkPropertyMetadata ? e.Metadata : null;

            //
            // Invalidation propagation for Groups and Inheritance 
            //
 
            // Metadata must exist specifically stating propagate invalidation 
            // due to group or inheritance
            if (fmetadata != null) 
            {
                //
                // Inheritance
                // 
                if (fmetadata.Inherits) 
                { 
                    // Invalidate Inheritable descendents only if instance is not a TreeSeparator
                    // or fmetadata.OverridesInheritanceBehavior is set to override separated tree behavior 
                    if ((this.InheritanceBehavior == InheritanceBehavior.Default || fmetadata.OverridesInheritanceBehavior) &&
                        (!DependencyObject.IsTreeWalkOperation(e.OperationType) || this.PotentiallyHasMentees))
                    {
                        /*EffectiveValueEntry*/
                    	var newEntry = e.NewEntry; 
                        /*EffectiveValueEntry*/
                        var oldEntry = e.OldEntry;
                        if (oldEntry.BaseValueSourceInternal > newEntry.BaseValueSourceInternal) 
                        { 
                            // valuesource == Inherited && value == UnsetValue indicates that we are clearing the inherited value
                            newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Inherited); 
                        }
                        else
                        {
                            newEntry = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved); 
                            newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                        } 
 
                        if (oldEntry.BaseValueSourceInternal != BaseValueSourceInternal.Default || oldEntry.HasModifiers)
                        { 
                            oldEntry = oldEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
                            oldEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                        }
                        else 
                        {
                            // we use an empty EffectiveValueEntry as a signal that the old entry was the default value 
                            oldEntry = new EffectiveValueEntry(); 
                        }
 
                        /*InheritablePropertyChangeInfo*/
                        var info =
                                new InheritablePropertyChangeInfo(
                                        this,
                                        dp, 
                                        oldEntry,
                                        newEntry); 
 
                        // Don't InvalidateTree if we're in the middle of doing it.
                        if (!DependencyObject.IsTreeWalkOperation(e.OperationType)) 
                        {
                            TreeWalkHelper.InvalidateOnInheritablePropertyChange(this, null, info, true);
                        }
 
                        // Notify mentees if they exist
                        if (this.PotentiallyHasMentees) 
                        { 
                            TreeWalkHelper.OnInheritedPropertyChanged(this, info/*ref info*/, InheritanceBehavior);
                        } 
                    }
                }

                if (e.IsAValueChange || e.IsASubPropertyChange) 
                {
                    // 
                    // Layout invalidation 
                    //
 
                    // Skip if we're traversing an Visibility=Collapsed subtree while
                    //  in the middle of an invalidation storm due to ancestor change
                    if( !(this.AncestorChangeInProgress && this.InVisibilityCollapsedTree) )
                    { 
                        /*UIElement*/var layoutParent = null;
 
                        /*bool*/var affectsParentMeasure = fmetadata.AffectsParentMeasure; 
                        /*bool*/var affectsParentArrange = fmetadata.AffectsParentArrange;
                        /*bool*/var affectsMeasure = fmetadata.AffectsMeasure; 
                        /*bool*/var affectsArrange = fmetadata.AffectsArrange;
                        if (affectsMeasure || affectsArrange || affectsParentArrange || affectsParentMeasure)
                        {
                        	var v = VisualTreeHelper.GetParent(this);
                            // Locate nearest Layout parent 
                            for (/*Visual*/ v instanceof Visual ? v : null;
                                 v != null; 
                                 v = VisualTreeHelper.GetParent(v)/* as Visual*/) 
                            {
                                layoutParent = v instanceof UIElement ? v : null; 
                                if (layoutParent != null)
                                {
                                    //let incrementally-updating FrameworkElements to mark the vicinity of the affected child
                                    //to perform partial update. 
                                    if(FrameworkElement.DType.IsInstanceOfType(layoutParent))
                                        layoutParent.ParentLayoutInvalidated(this); 
 
                                    if (affectsParentMeasure)
                                    { 
                                        layoutParent.InvalidateMeasure();
                                    }

                                    if (affectsParentArrange) 
                                    {
                                        layoutParent.InvalidateArrange(); 
                                    } 

                                    break; 
                                }
                            }
                        }
 
                        if (fmetadata.AffectsMeasure)
                        { 
                            // 
                            if (!this.BypassLayoutPolicies || !((dp == FrameworkElement.WidthProperty) || (dp == FrameworkElement.HeightProperty)))
                            {
                            	this.InvalidateMeasure(); 
                            }
                        } 
 
                        if (fmetadata.AffectsArrange)
                        { 
                        	this.InvalidateArrange();
                        	
                            //cym added
                        	if(!String.IsNullOrEmpty(e.NewValue)){
                        		this._dom[dp._domProp] = e.NewValue;
                        	}else{
                        		this._dom[dp._domProp] = String.Empty;
                        	}
                        }

                        if (fmetadata.AffectsRender && 
                            (e.IsAValueChange || !fmetadata.SubPropertiesDoNotAffectRender))
                        { 
                        	this.InvalidateVisual(); 
                        	
                            //cym added
                        	if(!String.IsNullOrEmpty(e.NewValue)){
                        		this._dom.style.setProperty(dp._cssName, e.NewValue);
                        	}else{
                        		this._dom.style.setProperty(dp._cssName, "");
                        	}
                        }
                    } 
                }
            }
        },

	});
	
	Object.defineProperties(Run.prototype,{
		Data:
		{
			get:function(){ return this.GetValue(Run.DataProperty);},
			set:function(value) {this.SetValue(Run.DataProperty, value); }
		},
	});
	
	Object.defineProperties(Run,{
//		data	
//      public static readonly DependencyProperty 
		DataProperty:
		{
			get:function(){
				if(Run._DataProperty === undefined){
					Run._DataProperty= DependencyProperty.Register("Data", String.Type, Run.Type, 
                          FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsArrange)); 
					Run._DataProperty._domProp = "data";
				}
				return Run._DataProperty;
			}
		},
	});
	
	Run.Type = new Type("Run", Run, [FrameworkElement.Type, IAddChild.Type]);
	return Run;
});