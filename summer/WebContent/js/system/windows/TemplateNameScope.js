/**
 * TemplateNameScope
 */

define(["dojo/_base/declare", "system/Type", "markup/INameScope"], function(declare, Type, INameScope){
	var TemplateNameScope = declare("TemplateNameScope", INameScope,{
		constructor:function(
                /*DependencyObject*/ templatedParent, 
                /*List<DependencyObject>*/ affectedChildren,
                /*FrameworkTemplate*/ frameworkTemplate ) 
		{ 
			if(affectedChildren === undefined){
				affectedChildren =null;
			}
			
			if(frameworkTemplate === undefined){
				frameworkTemplate =null;
			}
			
			this._affectedChildren = affectedChildren;
			
			this._frameworkTemplate = frameworkTemplate; 
			
			this._templatedParent = templatedParent; 
			
			this._isTemplatedParentAnFE = true;
		
		},
		
	       /// <summary> 
        /// Registers the name - element combination
        /// </summary> 
        /// <param name="name">Name of the element</param>
        /// <param name="scopedElement">Element where name is defined</param>
//        void INameScope.
        RegisterName:function(/*string*/ name, /*object*/ scopedElement)
        { 
            // We register FrameworkElements and FrameworkContentElements in FrameworkTemplate.cs
            // Since we register them during object creation, we don't need to process it the second 
            // time it shows up. 
            if (!(scopedElement instanceof FrameworkContentElement || scopedElement instanceof FrameworkElement))
            { 
                this.RegisterNameInternal(name, scopedElement);
            }
        },
        
//        internal void 
        RegisterNameInternal:function(/*string*/ name, /*object*/ scopedElement) 
        {
            /*FrameworkElement*/ fe; 
            /*FrameworkContentElement*/ fce; 

            Helper.DowncastToFEorFCE( scopedElement instanceof DependencyObject ? scopedElement : null, 
                                      /*out fe*/feOut, /*out fce*/fceOut,
                                      false /*throwIfNeither*/ );

            var childIndex; 

 
            // First, though, do we actually have a templated parent?  If not, 
            // then we'll just set the properties directly on the element
            // (this is the serialization scenario). 

            if( this._templatedParent == null )
            {
                if (this._nameMap == null) 
                {
                	this._nameMap = new HybridDictionary(); 
                } 

                this._nameMap[name] = scopedElement; 

                // No, we don't have a templated parent.  Loop through
                // the shared values (assuming this is an FE/FCE), and set them
                // directly onto the element. 

                if( fe != null || fce != null ) 
                { 
                    SetTemplateParentValues( name, scopedElement );
                } 

            }

            // We have a templated parent, but is this not a FE/FCE? 

            else if (fe == null && fce == null) 
            { 
                // All we need to do is update the _templatedNonFeChildren list
 
                /*Hashtable*/var nonFeChildren = this._templatedNonFeChildrenField.GetValue(this._templatedParent);
                if (nonFeChildren == null)
                {
                    nonFeChildren = new Hashtable(1); 
                    this._templatedNonFeChildrenField.SetValue(this._templatedParent, nonFeChildren);
                } 
 
                nonFeChildren[name] = scopedElement;
 
            }

            // Otherwise, we need to hook this FE/FCE up to the template.
 
            else
            { 
                // Update the list on the templated parent of the named FE/FCEs.
            	this._affectedChildren.Add(scopedElement instanceof DependencyObject ? scopedElement : null);

                // Update the TemplatedParent, IsTemplatedParentAnFE, and TemplateChildIndex.
                if( fe != null )
                { 
                    fe._templatedParent = this._templatedParent; 
                    fe.IsTemplatedParentAnFE = this._isTemplatedParentAnFE;
 
                    childIndex = fe.TemplateChildIndex = this._frameworkTemplate.ChildIndexFromChildName[name];
                }
                else
                { 
                    fce._templatedParent = this._templatedParent;
                    fce.IsTemplatedParentAnFE = this._isTemplatedParentAnFE; 
                    childIndex = fce.TemplateChildIndex = this._frameworkTemplate.ChildIndexFromChildName[name]; 
                }
 
//                // Entries into the NameScope MUST match the location in the AffectedChildren list
//                Debug.Assert(_affectedChildren.Count == childIndex);

                // Make updates for the Loaded/Unloaded event listeners (if they're set). 
                /*HybridDictionary*/
                var templateChildLoadedDictionary = this._frameworkTemplate._TemplateChildLoadedDictionary; 
 
                /*FrameworkTemplate.TemplateChildLoadedFlags*/
                var templateChildLoadedFlags
                        = templateChildLoadedDictionary.Get(childIndex);
                templateChildLoadedFlags = templateChildLoadedFlags instanceof FrameworkTemplate.TemplateChildLoadedFlags ? templateChildLoadedFlags : null; 

                if( templateChildLoadedFlags != null )
                {
                    if( templateChildLoadedFlags.HasLoadedChangedHandler || templateChildLoadedFlags.HasUnloadedChangedHandler ) 
                    {
                        BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry((fe != null) ? 
                        		/*(DependencyObject)*/fe : /*(DependencyObject)*/fce); 
                    } 
                }
 

                // Establish databinding instance data.
                StyleHelper.CreateInstanceDataForChild( 
                                StyleHelper.TemplateDataField,
                                this._templatedParent, 
                                (fe!=null) ? /*(DependencyObject)*/fe : /*(DependencyObject)*/fce, 
                                childIndex,
                                this._frameworkTemplate.HasInstanceValues, 
                                /*ref*/ this._frameworkTemplate.ChildRecordFromChildIndex);
            }

        }, 

        /// <summary> 
        /// Unregisters the name - element combination 
        /// </summary>
        /// <param name="name">Name of the element</param> 
//        void INameScope.
        UnregisterName:function(/*string*/ name)
        {
//            Debug.Assert(false, "Should never be trying to unregister via this interface for templates");
        },

        /// <summary> 
        /// Find the element given name 
        /// </summary>
//        object INameScope.
        FindName:function(/*string*/ name) 
        {
            // _templatedParent is null if template.LoadContent() was responsible
            if (this._templatedParent != null)
            { 
                /*FrameworkObject*/var fo = new FrameworkObject(this._templatedParent);
 
//                Debug.Assert(fo.IsFE); 
                if (fo.IsFE)
                { 
                    return StyleHelper.FindNameInTemplateContent(fo.FE, name, fo.FE.TemplateInternal);
                }
                else
                { 
                    return null;
                } 
            } 
            else
            { 
                if (this._nameMap == null || name == null || name == String.Empty)
                    return null;

                return this._nameMap[name]; 
            }
        },
        
//      //+---------------------------------------------------------------------------------------------------------------
//      // 
//      //  SetTemplateParentValues
//      // 
//      //  This method takes the "template parent values" (those that look like local values in the template), which 
//      //  are ordinarily shared, and sets them as local values on the FE/FCE that was just created.  This is used
//      //  during serialization. 
//      //
//      //+----------------------------------------------------------------------------------------------------------------
//
//        private void 
        SetTemplateParentValues:function( /*string*/ name, /*object*/ element ) 
        {
        	FrameworkTemplate.SetTemplateParentValues( name, element, this._frameworkTemplate, /*ref*/ this._provideValueServiceProvider ); 
        } 
	});
	
	Object.defineProperties(TemplateNameScope, {
//      // This is the table of Name->NonFE mappings
//      private static UncommonField<Hashtable> 
		_templatedNonFeChildrenField:
		{
			get:function(){
				if(TemplateNameScope.__templatedNonFeChildrenField === undefined){
					TemplateNameScope.__templatedNonFeChildrenField = StyleHelper.TemplatedNonFeChildrenField;
				}
				
				return TemplateNameScope.__templatedNonFeChildrenField;
			}
		}
	})
	
	TemplateNameScope.Type = new Type("TemplateNameScope", TemplateNameScope, [INameScope.Type]);
	return TemplateNameScope;
});


// 
//        // This is a HybridDictionary of Name->FE(FCE) mappings 
//        private List<DependencyObject> _affectedChildren;
// 

//
//        // The templated parent we're instantiating for 
//        private DependencyObject       _templatedParent;
// 
//        // The template we're instantiating 
//        private FrameworkTemplate      _frameworkTemplate;
// 
//        // Is templated parent an FE or an FCE?
//        private bool                   _isTemplatedParentAnFE;
//
//        ProvideValueServiceProvider    _provideValueServiceProvider; 
//
//        // This is a HybridDictionary of Name-Object maps 
//        private HybridDictionary _nameMap; 



