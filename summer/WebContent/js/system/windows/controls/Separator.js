/**
 * Second check 2014-01-07
 * Separator
 */
/// <summary>
///     Separator control is a simple Control subclass that is used in different styles
/// depend on container control. Common usage is inside ListBox, ComboBox, MenuItem and ToolBar. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "controls/Control", "windows/UIElement", "windows/FrameworkElement",
        "windows/HorizontalAlignment", "windows/DependencyObjectType", "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, Control, UIElement, FrameworkElement,
				HorizontalAlignment, DependencyObjectType, FrameworkPropertyMetadata){
//	private static DependencyObjectType 
	var _dType = null;
	var Separator = declare("Separator", Control,{
		constructor:function(){

		}
	});
	
	Object.defineProperties(Separator.prototype,{
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
//        internal override DependencyObjectType 
        DTypeThemeStyleKey:
        { 
            get:function() { return _dType; }
        }

	});
	
//    internal static void 
    Separator.PrepareContainer = function(/*Control*/ container)
    { 
        if (container != null)
        {
            // Disable the control and set the alignment to stretch
            container.IsEnabled = false; 
            container.HorizontalContentAlignment = HorizontalAlignment.Stretch;
        } 
    }; 
    
//  static Separator() 
	function Initialize()
    {
        FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(Separator.Type, 
        		/*new FrameworkPropertyMetadata(Separator.Type)*/
        		FrameworkPropertyMetadata.BuildWithDV(Separator.Type));
        _dType = DependencyObjectType.FromSystemTypeInternal(Separator.Type);
        
        UIElement.IsEnabledProperty.OverrideMetadata(Separator.Type, 
        		/*new FrameworkPropertyMetadata(false)*/
        		FrameworkPropertyMetadata.BuildWithDV(false));
    }; 
	
	Separator.Type = new Type("Separator", Separator, [Control.Type]);
	Initialize();
	
	return Separator;
});
