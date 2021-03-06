/**
 * ContentOperations
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var ContentOperations = declare("ContentOperations", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(ContentOperations.prototype,{
		  
	});
	
	Object.defineProperties(ContentOperations,{
		  
	});
	
	ContentOperations.Type = new Type("ContentOperations", ContentOperations, [Object.Type]);
	return ContentOperations;
});



namespace System.Windows 
{
    /// <summary>
    /// This interface defines the common methods and services available from a ContentElement.
    /// </summary> 
    public static class ContentOperations
    { 
        /// <summary> 
        /// Get the Visual parent of this ContentElement.
        /// </summary> 
        public static DependencyObject GetParent(ContentElement reference)
        {
            if(reference == null)
            { 
                throw new ArgumentNullException("reference");
            } 
 
            return reference._parent;
        } 

        /// <summary>
        /// Set the Visual parent of this ContentElement.
        /// </summary> 
        /// <remarks>
        ///     This is different than Visuals.  For Visuals, you have to 
        ///     Add/Remove the visual from a children collection to change 
        ///     the parent.  I think it is a better model, but I don't
        ///     know if we want to expose a full children collection for 
        ///     content elements.
        /// </remarks>
        public static void SetParent(ContentElement reference, DependencyObject parent)
        { 
            if(reference == null)
            { 
                throw new ArgumentNullException("reference"); 
            }
 
            DependencyObject oldParent = reference._parent;
            reference._parent = parent;

            // Raise content parent changed notification 
            reference.OnContentParentChanged(oldParent);
        } 
    } 
}

