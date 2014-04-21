/**
 * ValueSource
 */

define(["dojo/_base/declare", "system/Type", "windows/BaseValueSourceInternal"], 
		function(declare, Type, BaseValueSourceInternal){
	/// <summary>
    /// This struct contains the information returned from 
    /// DependencyPropertyHelper.GetValueSource.
    /// </summary> 
//    public struct 
	var ValueSource = declare("ValueSource", Object,{
		constructor:function(/*BaseValueSourceInternal*/ source, 
				/*bool*/ isExpression, /*bool*/ isAnimated, /*bool*/ isCoerced, /*bool*/ isCurrent) 
        {
            // this cast is justified because the public BaseValueSource enum
            // values agree with the internal BaseValueSourceInternal enum values.
            this._baseValueSource = source; 

            this._isExpression = isExpression; 
            this._isAnimated = isAnimated; 
            this._isCoerced = isCoerced;
            this._isCurrent = isCurrent; 
        },
        /// <summary> 
        /// Return the hash code for this ValueSource.
        /// </summary>
//        public override int 
        GetHashCode:function()
        { 
            return this._baseValueSource.GetHashCode();
        }, 
 
        /// <summary>
        /// True if this ValueSource equals the argument. 
        /// </summary>
//        public override bool 
        Equals:function(/*object*/ o)
        {
            if (o instanceof ValueSource) 
            {
                return  this._baseValueSource == o._baseValueSource &&
                        this._isExpression == o._isExpression && 
                        this._isAnimated == o._isAnimated &&
                        this._isCoerced == o._isCoerced;
            }
            else 
            {
                return false; 
            } 
        }
        
	});
	
	Object.defineProperties(ValueSource.prototype,{
	       /// <summary>
        /// The base value source. 
        /// </summary>
//        public BaseValueSource 
		BaseValueSource: 
        { 
            get:function() { return this._baseValueSource; }
        }, 

        /// <summary>
        /// True if the value came from an Expression.
        /// </summary> 
//        public bool 
        IsExpression:
        { 
            get:function() { return this._isExpression; } 
        },
 
        /// <summary>
        /// True if the value came from an animation.
        /// </summary>
//        public bool 
        IsAnimated: 
        {
            get:function() { return this._isAnimated; } 
        }, 

        /// <summary> 
        /// True if the value was coerced.
        /// </summary>
//        public bool 
        IsCoerced:
        { 
            get:function() { return this._isCoerced; }
        }, 
 
        /// <summary>
        /// True if the value was set by SetCurrentValue. 
        /// </summary>
//        public bool 
        IsCurrent:
        {
            get:function() { return this._isCurrent; } 
        }	  
	});
	
	Object.defineProperties(ValueSource,{
		  
	});
	
	ValueSource.Type = new Type("ValueSource", ValueSource, [Object.Type]);
	return ValueSource;
});
