/**
 * Second Check 12-27
 * ExplicitObjectRef
 */
define(["dojo/_base/declare", "system/Type", "internal.data/ObjectRef"], 
		function(declare, Type, ObjectRef){
	var ExplicitObjectRef = declare("ExplicitObjectRef", ObjectRef, {
		constructor:function( o ){
			this._object = o; 
		},

        /// <summary> Returns the referenced object. </summary> 
        /// <param name="d">Element defining context for the reference. </param>
        /// <param name="args">See ObjectRefArgs </param>
        /*internal override object */
		GetObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args)
        { 
            return this._object;
        }, 
 
        /*internal override string */
        Identify:function()
        { 
            return "Source";
        }
	});
	
	Object.defineProperties(ExplicitObjectRef.prototype,{
        /// <summary>
        /// true if the ObjectRef uses the mentor of the target element, 
        /// rather than the target element itself.
        /// </summary>
        /*protected override bool*/ 
		ProtectedUsesMentor:
        { 
            get:function() { return false; }
        } 
	});
	
	ExplicitObjectRef.Type = new Type("ExplicitObjectRef", ExplicitObjectRef, [ObjectRef.Type]);
	return ExplicitObjectRef;
});
