/**
 * ControlTemplate
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkTemplate", "windows/TriggerCollection"], 
		function(declare, Type, FrameworkTemplate, TriggerCollection){
	var ControlTemplate = declare("ControlTemplate", FrameworkTemplate, {
		constructor:function(/*Type*/ targetType) 
		{
			
//	        private Type                    
	        this._targetType = null; 
//	        private TriggerCollection       
	        this._triggers = null;
			if(targetType!== undefined){
				this.ValidateTargetType(targetType, "targetType");
				this._targetType = targetType;
			}
			
		},
		
        /// <summary>
        ///     Validate against the following rules
        ///     1. One cannot use a ControlTemplate to template a FrameworkContentElement
        ///     2. One cannot use a ControlTemplate to template a FrameworkElement other than a Control 
        ///     3. One cannot use a ControlTemplate to template a Control that isn't associated with it
        /// </summary> 
//        protected override void 
        ValidateTemplatedParent:function(/*FrameworkElement*/ templatedParent) 
        {
            // Must have a non-null feTemplatedParent 
            if (templatedParent == null)
            {
                throw new Error('ArgumentNullException("templatedParent")');
            } 

            // The target type of a ControlTemplate must match the 
            // type of the Control that it is being applied to 
            if (this._targetType != null && !this._targetType.IsInstanceOfType(templatedParent))
            { 
                throw new Error('ArgumentException(SR.Get(SRID.TemplateTargetTypeMismatch, _targetType.Name, templatedParent.GetType().Name)');
            }

            // One cannot use a ControlTemplate to template a Control that isn't associated with it 
            if (templatedParent.TemplateInternal != this)
            { 
                throw new Error('ArgumentException(SR.Get(SRID.MustNotTemplateUnassociatedControl)'); 
            }
        },
        
        // Validate against two rules
        //  1. targetType must not null 
        //  2. targetType must be a Control or a subclass of it 
//        private void 
        ValidateTargetType:function(/*Type*/ targetType, /*string*/ argName)
        { 
            if (targetType == null)
            {
                throw new Error('ArgumentNullException(argName)');
            } 
            if (!/*typeof(Control)*/Control.Type.IsAssignableFrom(targetType) &&
                !/*typeof(Page)*/Page.Type.IsAssignableFrom(targetType) 
                // cym commnt 
//                && 
//                !/*typeof(PageFunctionBase)*/PageFunctionBase.Type.IsAssignableFrom(targetType)
                ) 
            {
                throw new Error('ArgumentException(SR.Get(SRID.InvalidControlTemplateTargetType, targetType.Name)'); 
            }
        },
        
        
        // Subclasses must provide a way for the parser to directly set the 
        // target type.
//        internal override void 
        SetTargetTypeInternal:function(/*Type*/ targetType) 
        {
            this.TargetType = targetType;
        }

	});
	
	Object.defineProperties(ControlTemplate.prototype,{
		 
        /// <summary>
        ///     TargetType for this ControlTemplate 
        /// </summary> 
//        [Ambient]
//        [DefaultValue(null)] 
//        public Type 
        TargetType:
        {
            get:function() {  return this._targetType; },
            set:function(value) 
            {
                this.ValidateTargetType(value, "value"); 
                this.CheckSealed(); 
                this._targetType = value;
            } 
        },
        
      //
      //  TargetType for ControlTemplate. This is override is 
      //  so FrameworkTemplate can see this property.
      //
//        internal override Type 
		TargetTypeInternal:
		{ 
		    get:function()
		    { 
		        if (this.TargetType != null) 
		        {
		            return this.TargetType; 
		        }
		        return ControlTemplate.DefaultTargetType;
		     } 
		},

        /// <summary>
        ///     Collection of Triggers 
        /// </summary>
        Triggers: 
        {
            get:function()
            {
                if (this._triggers == null) 
                {
                	this._triggers = new TriggerCollection(); 
 
                    // If the template has been sealed prior to this the newly
                    // created TriggerCollection also needs to be sealed 
                    if (this.IsSealed)
                    {
                    	this._triggers.Seal();
                    } 
                }
                return this._triggers; 
            } 
        },
        
        //
        //  Collection of Triggers for a ControlTemplate. This is 
        //  override is so FrameworkTemplate can see this property. 
        //
//        internal override TriggerCollection 
        TriggersInternal: 
        {
            get:function() { return this.Triggers; }
        }
	});
	
	Object.defineProperties(ControlTemplate, {
//	    internal static readonly Type 
		DefaultTargetType:
		{
			get:function(){
				if(ControlTemplate._defaultTargetType === undefined){
					ControlTemplate._defaultTargetType = Control.Type; 
				}
				
				return ControlTemplate._defaultTargetType;
			}
		}
	});
	
	ControlTemplate.Type = new Type("ControlTemplate", ControlTemplate, [FrameworkTemplate.Type]);
	
	return ControlTemplate;
});
