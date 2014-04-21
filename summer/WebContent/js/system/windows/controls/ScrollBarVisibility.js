 /**
  * from ScrollViewer
 * ScrollBarVisibility
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ScrollBarVisibility = declare("ScrollBarVisibility", null,{

	});
	
	ScrollBarVisibility.Disabled = 0;
	ScrollBarVisibility.Auto = 1;
	ScrollBarVisibility.Hidden = 0;
	ScrollBarVisibility.Visible = 1;
	
//	ScrollBarVisibility.Type = new Type("ScrollBarVisibility", ScrollBarVisibility, [Object.Type]);
	return ScrollBarVisibility;
});

//	/// <summary> 
//    /// ScrollBarVisibilty defines the visibility behavior of a scrollbar.
//    /// </summary>
//    public enum ScrollBarVisibility
//    { 
//        /// <summary>
//        /// No scrollbars and no scrolling in this dimension. 
//        /// </summary> 
//        Disabled = 0,
//        /// <summary> 
//        /// The scrollbar should be visible only if there is more content than fits in the viewport.
//        /// </summary>
//        Auto,
//        /// <summary> 
//        /// The scrollbar should never be visible.  No space should ever be reserved for the scrollbar.
//        /// </summary> 
//        Hidden, 
//        /// <summary>
//        /// The scrollbar should always be visible.  Space should always be reserved for the scrollbar. 
//        /// </summary>
//        Visible,
//
//        // NOTE: if you add or remove any values in this enum, be sure to update ScrollViewer.IsValidScrollBarVisibility() 
//    }