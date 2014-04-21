/**
 * GroupBox
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl", "input/TraversalRequest",
        "input/FocusNavigationDirection"], 
		function(declare, Type, HeaderedContentControl, TraversalRequest,
				FocusNavigationDirection){
	var GroupBox = declare("GroupBox", HeaderedContentControl,{
		constructor:function(){
		},
		
        /// <summary> 
        /// The Access key for this control was invoked. 
        /// </summary>
//        protected override void 
        OnAccessKey:function(/*AccessKeyEventArgs*/ e) 
        {
            this.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
        }
	});
	
//    private static void 
    function OnAccessKeyPressed(/*object*/ sender, /*AccessKeyPressedEventArgs*/ e)
    { 
        if (!e.Handled && e.Scope == null && e.Target == null) 
        {
            e.Target = sender instanceof GroupBox ? sender : null; 
        }
    }
    
//    static GroupBox() 
    function Initialize()
    {
    	UIElement.FocusableProperty.OverrideMetadata(GroupBox.Type,
    			/*new FrameworkPropertyMetadata(false)*/FrameworkPropertyMetadata.BuildWithDV(false)); 
    	Control.IsTabStopProperty.OverrideMetadata(GroupBox.Type, 
    			/*new FrameworkPropertyMetadata(false)*/FrameworkPropertyMetadata.BuildWithDV(false)); 
    	FrameworkElement.DefaultStyleKeyProperty.OverrideMetadata(GroupBox.Type, 
    			/*new FrameworkPropertyMetadata(GroupBox.Type)*/FrameworkPropertyMetadata.BuildWithDV(GroupBox.Type));
//        EventManager.RegisterClassHandler(GroupBox.Type, AccessKeyManager.AccessKeyPressedEvent, 
//        		new AccessKeyPressedEventHandler(null, OnAccessKeyPressed)); 
    };
	
	GroupBox.Type = new Type("GroupBox", GroupBox, [HeaderedContentControl.Type]);
	Initialize();
	
	return GroupBox;
});
