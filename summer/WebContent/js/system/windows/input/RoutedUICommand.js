/**
 * RoutedUICommand
 */

define(["dojo/_base/declare", "system/Type", "input/RoutedCommand"], 
		function(declare, Type, RoutedCommand){
	var RoutedUICommand = declare("RoutedUICommand", RoutedCommand,{
	 	"-chains-": {
	      constructor: "manual"
	    },
		constructor:function(text){
			if(text === undefined){
	            this._text = String.Empty; 
			}else{
				this._text = text;
			}
		},
		
	       /// <summary>
        ///    Fetches the text by invoking the GetUIText function on the owning type.
        /// </summary>
        /// <returns>The text for the command</returns> 
//        private string 
		GetText:function()
        { 
            if(OwnerType == typeof(ApplicationCommands)) 
            {
                return ApplicationCommands.GetUIText(CommandId); 
            }
            else if(OwnerType == typeof(NavigationCommands))
            {
                return NavigationCommands.GetUIText(CommandId); 
            }
            else if(OwnerType == typeof(MediaCommands)) 
            { 
                return MediaCommands.GetUIText(CommandId);
            } 
            else if(OwnerType == typeof(ComponentCommands))
            {
                return ComponentCommands.GetUIText(CommandId);
            } 
            return null;
        } 
	});
	
	Object.defineProperties(RoutedUICommand.prototype,{
		 /// <summary>
        ///     Descriptive and localizable text for the command. 
        /// </summary> 
//        public string 
        Text:
        { 
            get:function()
            {
                if(this._text == null)
                { 
                	this._text = GetText();
                } 
                return _text; 
            },
            set:function(value) 
            {
                if (value == null)
                {
                    throw new ArgumentNullException("value"); 
                }
                this._text = value; 
            } 
        }  
	});
	
	Object.defineProperties(RoutedUICommand,{
		  
	});
	
	RoutedUICommand.Build = function(){
		var obj = new RoutedUICommand();
		RoutedCommand.prototype.constructor.call(obj, null, null, null);
		return obj;
	};
	
	RoutedUICommand.BuildSST = function(/*string*/ text, /*string*/ name, /*Type*/ ownerType){
		var obj = new RoutedUICommand(text);
		RoutedCommand.prototype.constructor.call(obj, name, ownerType, null);
		return obj;
	};
	
	RoutedUICommand.BuildSTC = function(/*string*/ name, /*Type*/ ownerType, /*byte*/ commandId){
		var obj = new RoutedUICommand(null);
		RoutedCommand.prototype.constructor.call(obj, name, ownerType, commandId);
		return obj;
	};
	
	RoutedUICommand.BuildSSTI = function(/*string*/ text, /*string*/ name, /*Type*/ ownerType, /*InputGestureCollection*/ inputGestures){
		var obj = new RoutedUICommand(text);
		RoutedCommand.prototype.constructor.call(obj, name, ownerType, inputGestures);
		return obj;
	};
	
	RoutedUICommand.Type = new Type("RoutedUICommand", RoutedUICommand, [RoutedCommand.Type]);
	return RoutedUICommand;
});


