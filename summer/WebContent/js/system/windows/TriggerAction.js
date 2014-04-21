/**
 * TriggerAction
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObject", "internal/InheritanceContextHelper"], 
		function(declare, Type, DependencyObject, InheritanceContextHelper){
	var TriggerAction = declare("TriggerAction", DependencyObject,{
		constructor:function(){
//	        private TriggerBase 
	        this._containingTrigger = null;
	        
	        // Fields to implement DO's inheritance context
//	        private DependencyObject 
	        this._inheritanceContext = null;
//	        private bool 
	        this._hasMultipleInheritanceContexts = false;
		},
		
	       /// <summary>
        ///     Seal this TriggerAction to prevent further updates 
        /// </summary>
        /// <remarks> 
        ///     TriggerActionCollection will call this method to seal individual 
        /// TriggerAction objects.  We do some check here then call the
        /// parameter-less Seal() so subclasses can also do what they need to do. 
        /// </remarks>
//        internal void 
        Seal:function( /*TriggerBase*/ containingTrigger )
        {
            if( this.IsSealed )
            {
                throw new InvalidOperationException(SR.Get(SRID.TriggerActionAlreadySealed));
            } 
            
        	if(containingTrigger !== undefined){
                this._containingTrigger = containingTrigger;
        	}

            DependencyObject.prototype.Seal.call(this);
        },
 
        /// <summary>
        ///     Checks sealed status and throws exception if object is sealed 
        /// </summary>
//        internal void 
        CheckSealed:function()
        {
            if( this.IsSealed ) 
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "TriggerAction")); 
            } 
        },
 

        // Receive a new inheritance context (this will be a FE/FCE)
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        {
        	var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.AddInheritanceContext(context,
                                                              this,
                                                              /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                              /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;
        },
 
        // Remove an inheritance context (this will be a FE/FCE)
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        {
        	var hasMultipleInheritanceContextsRef={
            		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
            	};
            	
            	var inheritanceContextRef = {
            		"inheritanceContext" : this._inheritanceContext	
            	};
            InheritanceContextHelper.RemoveInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;
        },
	});
	
	Object.defineProperties(TriggerAction.prototype,{
        /// <summary> 
        ///     The EventTrigger object that contains this action.
        /// </summary> 
        /// <remarks> 
        ///     A TriggerAction may need to get back to the Trigger that
        /// holds it, this is the back-link to allow that.  Also, this allows 
        /// us to verify that each TriggerAction is associated with one and
        /// only one Trigger.
        /// </remarks>
//        internal TriggerBase 
        ContainingTrigger: 
        {
            get:function() 
            { 
                return this._containingTrigger;
            } 
        },
        
        // Define the DO's inheritance context

//        internal override DependencyObject 
        InheritanceContext:
        { 
            get:function() { return this._inheritanceContext; }
        },
        
        /// <summary>
        ///     Says if the current instance has multiple InheritanceContexts 
        /// </summary>
//        internal override bool 
        HasMultipleInheritanceContexts:
        {
            get:function() { return this._hasMultipleInheritanceContexts; } 
        },
 
	});
	
	TriggerAction.Type = new Type("TriggerAction", TriggerAction, [DependencyObject.Type]);
	return TriggerAction;
});
//    /// <summary>
//    ///   A class that describes an action to perform for a trigger
//    /// </summary>
//    public abstract class TriggerAction : DependencyObject 
//    {
// 
//        /// <summary>
//        ///     Called when all conditions have been satisfied for this action to be 
//        /// invoked.  (Conditions are not described on this TriggerAction object, 
//        /// but on the Trigger object holding it.)
//        /// </summary> 
//        /// <remarks>
//        ///     This variant is called when the Trigger lives in a Style, and
//        /// hence given a reference to its corresponding Style object.
//        /// </remarks> 
//        internal abstract void Invoke( FrameworkElement fe,
//                                      FrameworkContentElement fce, 
//                                      Style targetStyle, 
//                                      FrameworkTemplate targetTemplate,
//                                      Int64 layer); 
//
//        /// <summary>
//        ///     Called when all conditions have been satisfied for this action to be
//        /// invoked.  (Conditions are not described on this TriggerAction object, 
//        /// but on the Trigger object holding it.)
//        /// </summary> 
//        /// <remarks> 
//        ///     This variant is called when the Trigger lives on an element, as
//        /// opposed to Style, so it is given only the reference to the element. 
//        /// </remarks>
//        internal abstract void Invoke( FrameworkElement fe );

 
