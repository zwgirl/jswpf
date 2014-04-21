
/**
 * SetterBase
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SetterBase = declare("SetterBase", null,{
		constructor:function(){

	        this._sealed = false; 
		},
 
//        internal virtual void 
        Seal:function()
        {
            this._sealed = true;
        },

        /// <summary> 
        ///  Subclasses need to call this method before any changes to their state. 
        /// </summary>
//        protected void 
        CheckSealed:function() 
        {
            if ( this._sealed )
            {
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SetterBase")); 
            }
        } 
	});
	
	Object.defineProperties(SetterBase.prototype,{

        /// <summary> 
        ///     Returns the sealed state of this object.  If true, any attempt
        /// at modifying the state of this object will trigger an exception. 
        /// </summary>
//        public bool 
        IsSealed:
        {
            get:function() 
            {
                return this._sealed; 
            } 
        }

	});
	
	SetterBase.Type = new Type("SetterBase", SetterBase, [Object.Type]);
	return SetterBase;
});
