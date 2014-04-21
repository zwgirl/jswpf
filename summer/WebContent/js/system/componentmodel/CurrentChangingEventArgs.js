/**
 * CurrentChangingEventArgs
 */

define(["dojo/_base/declare", "system/Type", "system/EventArgs"], function(declare, Type, EventArgs){
	var CurrentChangingEventArgs = declare("CurrentChangingEventArgs", EventArgs,{
		constructor:function(/*bool*/ isCancelable){
			if(isCancelable === undefined){
				isCancelable = true;
			}
			this._isCancelable = isCancelable; 
			
			this._cancel = false;
		},
		
	});
	
	Object.defineProperties(CurrentChangingEventArgs.prototype,{
	    /// <summary> 
        /// If this event can be canceled.  When this is False, setting Cancel to True will cause an InvalidOperationException to be thrown.
        /// </summary>
//        public bool 
        IsCancelable:
        { 
            get:function() { return this._isCancelable; }
        }, 
 
        /// <summary>
        /// When set to true, this event will be canceled. 
        /// </summary>
        /// <remarks>
        /// If IsCancelable is False, setting this value to True will cause an InvalidOperationException to be thrown.
        /// </remarks> 
//        public bool 
        Cancel:
        { 
            get:function() { return this._cancel; }, 
            set:function(value)
            { 
                if (this.IsCancelable)
                {
                	this._cancel = value;
                } 
                else if (value)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CurrentChangingCannotBeCanceled)); 
                }
            } 
        }
	});
	
	CurrentChangingEventArgs.Type = new Type("CurrentChangingEventArgs", CurrentChangingEventArgs, [EventArgs.Type]);
	return CurrentChangingEventArgs;
});

