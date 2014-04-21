/**
 * FocusWithinProperty
 */

define(["dojo/_base/declare", "system/Type", "windows/ReverseInheritProperty", "windows/CoreFlags",
        "windows/DependencyPropertyChangedEventArgs"], 
		function(declare, Type, ReverseInheritProperty, CoreFlags,
				DependencyPropertyChangedEventArgs){
	
	var UIElement =null;
	function EnsureUIElement(){
		if(UIElement == null){
			UIElement = using("windows/UIElement");
		}
		return UIElement;
	}
	
	var FocusWithinProperty = declare("FocusWithinProperty", ReverseInheritProperty,{
   	 	"-chains-": {
  	      constructor: "manual"
  	    },
		constructor:function(){
			ReverseInheritProperty.prototype.constructor.call(this, 
					EnsureUIElement().IsKeyboardFocusWithinPropertyKey, 
		            CoreFlags.IsKeyboardFocusWithinCache,
		            CoreFlags.IsKeyboardFocusWithinChanged);
		},
		
//		internal override void 
		FireNotifications:function(element, /*bool*/ oldValue)
        { 
            var args =
                    /*new DependencyPropertyChangedEventArgs( 
                        UIElement.IsKeyboardFocusWithinProperty, 
                        BooleanBoxes.Box(oldValue),
                        BooleanBoxes.Box(!oldValue)); */
            	DependencyPropertyChangedEventArgs.BuildPOO(
            			UIElement.IsKeyboardFocusWithinProperty, 
                        oldValue,
                        !oldValue);

            element.RaiseIsKeyboardFocusWithinChanged(args);
        }
		
	});
	
	FocusWithinProperty.Type = new Type("FocusWithinProperty", FocusWithinProperty, [ReverseInheritProperty.Type]);
	return FocusWithinProperty;
});

