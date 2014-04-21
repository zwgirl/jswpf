/**
 * Second Check 12-27
 * ObjectRef
 */
/// <summary> Abstract object reference. </summary>
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ObjectRef = declare("ObjectRef", null,{
		constructor:function( ){

		},
		 
        /// <summary> Returns the referenced object. </summary>
        /// <param name="d">Element defining context for the reference. </param> 
        /// <param name="args">See ObjectRefArgs </param> 
        /*internal virtual object */
		GetObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args)
        { 
            return null;
        },

        /// <summary> Returns the data object associated with the referenced object. 
        /// Often this is the same as the referenced object.
        /// </summary> 
        /// <param name="d">Element defining context for the reference. </param> 
        /// <param name="args">See ObjectRefArgs </param>
        /*internal virtual object */
        GetDataObject:function(/*DependencyObject*/ d, /*ObjectRefArgs*/ args) 
        {
            return this.GetObject(d, args);
        },
 
        /// <summary> true if the ObjectRef really needs the tree context </summary>
        /*internal bool */
        TreeContextIsRequired:function(/*DependencyObject*/ target) 
        { 
            return this.ProtectedTreeContextIsRequired(target);
        }, 

        /// <summary> true if the ObjectRef really needs the tree context </summary>
        /*protected virtual bool */
        ProtectedTreeContextIsRequired:function(/*DependencyObject*/ target)
        { 
            return false;
        },
 
 
        /// <summary>
        /// identify this ObjectRef to the user - used by extended tracing 
        /// </summary>
        /*internal abstract string */
        Identify:function(){
        	
        }
	});
	
	Object.defineProperties(ObjectRef.prototype,{
	       /// <summary>
        /// true if the ObjectRef uses the mentor of the target element, 
        /// rather than the target element itself.
        /// </summary>
        /*internal bool */
		UsesMentor:
        { 
            get:function() { return this.ProtectedUsesMentor; }
        }, 
 
        /// <summary>
        /// true if the ObjectRef uses the mentor of the target element, 
        /// rather than the target element itself.
        /// </summary>
        /*protected virtual bool*/ 
        ProtectedUsesMentor:
        { 
            get:function() { return true; }
        } 
 
	});
	
	ObjectRef.Type = new Type("ObjectRef", ObjectRef, [Object.Type]);
	return ObjectRef;
});
