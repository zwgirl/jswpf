/**
 * HorizontalAlignment
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var HorizontalAlignment = declare("HorizontalAlignment", Object, { 
    });	
    
    HorizontalAlignment.Left = 0; 
    
    /// <summary>
    /// Center - Center element horizontally. 
    /// </summary>
    HorizontalAlignment.Center = 1;

    /// <summary> 
    /// Right - Align element towards the right of a parent's layout slot.
    /// </summary> 
    HorizontalAlignment.Right = 2;

    /// <summary> 
    /// Stretch - Stretch element horizontally within a parent's layout slot.
    /// </summary>
    HorizontalAlignment.Stretch = 3;

//    HorizontalAlignment.Type = new Type("HorizontalAlignment", HorizontalAlignment, [Object.Type]);
    return HorizontalAlignment;
});
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] 
//    public enum HorizontalAlignment
//    {
//        /// <summary>
//        /// Left - Align element towards the left of a parent's layout slot. 
//        /// </summary>
//        Left = 0, 
// 
//        /// <summary>
//        /// Center - Center element horizontally. 
//        /// </summary>
//        Center = 1,
//
//        /// <summary> 
//        /// Right - Align element towards the right of a parent's layout slot.
//        /// </summary> 
//        Right = 2, 
//
//        /// <summary> 
//        /// Stretch - Stretch element horizontally within a parent's layout slot.
//        /// </summary>
//        Stretch = 3,
//    } 