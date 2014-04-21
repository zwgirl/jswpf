/**
 * ContentOperations
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var ContentOperations = declare("ContentOperations", Object,{
		constructor:function(){
		}
	});
	
	 /// <summary> 
    /// Get the Visual parent of this ContentElement.
    /// </summary> 
//    public static DependencyObject 
	ContentOperations.GetParent = function(/*ContentElement*/ reference)
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
//    public static void 
    ContentOperations.SetParent = function(/*ContentElement*/ reference, /*DependencyObject*/ parent)
    { 
        if(reference == null)
        { 
            throw new ArgumentNullException("reference"); 
        }

        var oldParent = reference._parent;
        reference._parent = parent;

        // Raise content parent changed notification 
        reference.OnContentParentChanged(oldParent);
    };
	
	ContentOperations.Type = new Type("ContentOperations", ContentOperations, [Object.Type]);
	return ContentOperations;
});

