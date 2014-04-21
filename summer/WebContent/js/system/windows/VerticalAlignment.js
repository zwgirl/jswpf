/**
 * VerticalAlignment
 */
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	
    var VerticalAlignment = declare("VerticalAlignment", Object, { 
    });	
    
    VerticalAlignment.Top = 0; 
    
    /// <summary>
    /// Center - Center element horizontally. 
    /// </summary>
    VerticalAlignment.Center = 1;

    /// <summary> 
    /// Right - Align element towards the right of a parent's layout slot.
    /// </summary> 
    VerticalAlignment.Bottom = 2;

    /// <summary> 
    /// Stretch - Stretch element horizontally within a parent's layout slot.
    /// </summary>
    VerticalAlignment.Stretch = 3;

//    HorizontalAlignment.Type = new Type("HorizontalAlignment", HorizontalAlignment, [Object.Type]);
    return VerticalAlignment;
});
//    /// <summary> 
//    /// VerticalAlignment - The VerticalAlignment enum is used to describe 
//    /// how element is positioned or stretched vertically within a parent's layout slot.
//    /// </summary> 
//    [Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)]
//    public enum VerticalAlignment
//    {
//        /// <summary> 
//        /// Top - Align element towards the top of a parent's layout slot.
//        /// </summary> 
//        Top = 0, 
//
//        /// <summary> 
//        /// Center - Center element vertically.
//        /// </summary>
//        Center = 1,
// 
//        /// <summary>
//        /// Bottom - Align element towards the bottom of a parent's layout slot. 
//        /// </summary> 
//        Bottom = 2,
// 
//        /// <summary>
//        /// Stretch - Stretch element vertically within a parent's layout slot.
//        /// </summary>
//        Stretch = 3, 
//    }