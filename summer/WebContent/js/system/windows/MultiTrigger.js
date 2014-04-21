/**
 * MultiTrigger
 */

define(["dojo/_base/declare", "system/Type", "windows/TriggerBase", "markup/IAddChild"], 
		function(declare, Type, TriggerBase){
	var MultiTrigger = declare("MultiTrigger", TriggerBase,{
		constructor:function(){
//	        private ConditionCollection 
			this._conditions = new ConditionCollection(); 
//	        private SetterBaseCollection
			this.setters = null;
		},
		
		 ///<summary>
        /// This method is called to Add a Setter object as a child of the Style. 
        ///</summary>
        ///<param name="value">
        /// The object to add as a child; it must be a Setter or subclass.
        ///</param> 
//        void IAddChild.
		AddChild:function (/*Object*/ value)
        { 
            // Verify Context Access 
            VerifyAccess();
 
            Setters.Add(Trigger.CheckChildIsSetter(value));
        },

        ///<summary> 
        /// This method is called by the parser when text appears under the tag in markup.
        /// As default Styles do not support text, calling this method has no effect. 
        ///</summary> 
        ///<param name="text">
        /// Text to add as a child. 
        ///</param>
//        void IAddChild.
        AddText:function (/*string*/ text)
        {
            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },
 
//        internal override void 
        Seal:function()
        {
            if (this.IsSealed)
            { 
                return;
            } 
 
            // Process the _setters collection: Copy values into PropertyValueList and seal the Setter objects.
            this.ProcessSettersCollection(this._setters); 

            if (this._conditions.Count > 0)
            {
                // Seal conditions 
            	this._conditions.Seal(ValueLookupType.Trigger);
            } 
 
            // Build conditions array from collection
            this.TriggerConditions = []; // new TriggerCondition[_conditions.Count]; 

            for (var i = 0; i < TriggerConditions.length; i++)
            {
                TriggerConditions[i] = new TriggerCondition( 
                		this._conditions.Get(i).Property,
                    LogicalOp.Equals, 
                    this._conditions.Get(i).Value, 
                    (this._conditions.Get(i).SourceName != null) ? this._conditions.Get(i).SourceName : StyleHelper.SelfName);
            } 

            // Set conditions array for all property triggers
            for (var i = 0; i < this.PropertyValues.Count; i++)
            { 
                var propertyValue = this.PropertyValues.Get(i);
                propertyValue.Conditions = this.TriggerConditions; 
                // Put back modified struct 
                PropertyValues.Set(i, propertyValue);
            } 

            base.Seal();
        },
 
        // evaluate the current state of the trigger
//        internal override bool
        GetCurrentState:function(/*DependencyObject*/ container, /*UncommonField<HybridDictionary[]>*/ dataField) 
        { 
            var retVal = TriggerConditions.length > 0;
 
            for( var i = 0; retVal && i < this.TriggerConditions.length; i++ )
            {
//                Debug.Assert( TriggerConditions[i].SourceChildIndex == 0,
//                    "This method was created to handle properties on the containing object, more work is needed to handle templated children too." ); 

                retVal = this.TriggerConditions[i].Match(container.GetValue(this.TriggerConditions[i].Property)); 
            } 

            return retVal; 
        }
	});
	
	Object.defineProperties(MultiTrigger.prototype,{
        /// <summary> 
        ///     Conditions collection
        /// </summary>
//        public ConditionCollection 
		Conditions:
        {
            get:function() 
            { 
                return this._conditions;
            }
        },
        

        /// <summary> 
        /// Collection of Setter objects, which describes what to apply 
        /// when this trigger is active.
        /// </summary> 
//        public SetterBaseCollection 
        Setters:
        {
            get:function()
            {
                if( this._setters == null ) 
                {
                	this._setters = new SetterBaseCollection();
                }
                return this._setters; 
            }
        } 
	});
	
	Object.defineProperties(MultiTrigger,{
		  
	});
	
	MultiTrigger.Type = new Type("MultiTrigger", MultiTrigger, [TriggerBase.Type, IAddChild.Type]);
	return MultiTrigger;
});


