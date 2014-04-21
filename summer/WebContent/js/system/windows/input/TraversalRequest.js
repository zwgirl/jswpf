/**
 * TraversalRequest
 */

define(["dojo/_base/declare", "system/Type", "input/FocusNavigationDirection"], 
		function(declare, Type, FocusNavigationDirection){
	var TraversalRequest = declare("TraversalRequest", Object,{
		constructor:function(/*FocusNavigationDirection*/ focusNavigationDirection)
        { 
            if (focusNavigationDirection != FocusNavigationDirection.Next && 
                 focusNavigationDirection != FocusNavigationDirection.Previous &&
                 focusNavigationDirection != FocusNavigationDirection.First && 
                 focusNavigationDirection != FocusNavigationDirection.Last &&
                 focusNavigationDirection != FocusNavigationDirection.Left &&
                 focusNavigationDirection != FocusNavigationDirection.Right &&
                 focusNavigationDirection != FocusNavigationDirection.Up && 
                 focusNavigationDirection != FocusNavigationDirection.Down)
            { 
                throw new InvalidEnumArgumentException("focusNavigationDirection", focusNavigationDirection, typeof(FocusNavigationDirection)); 
            }
 
            this._focusNavigationDirection = focusNavigationDirection;
//            private bool 
            this._wrapped = false; 
        }
	});
	
	Object.defineProperties(TraversalRequest.prototype,{
	    /// <summary> 
        /// true if reached the end of child elements that should have focus
        /// </summary> 
//        public bool 
        Wrapped: 
        {
            get:function(){return this._wrapped;}, 
            set:function(value){this._wrapped = value;}
        },
        
        /// <summary> 
        /// Determine how to move the focus
        /// </summary> 
//        public FocusNavigationDirection 
        FocusNavigationDirection: { get:function() { return this._focusNavigationDirection; } } 
	});
	
	Object.defineProperties(TraversalRequest,{
		  
	});
	
	TraversalRequest.Type = new Type("TraversalRequest", TraversalRequest, [Object.Type]);
	return TraversalRequest;
}); 

 
