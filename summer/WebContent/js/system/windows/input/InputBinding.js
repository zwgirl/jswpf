/**
 * InputBinding
 */

define(["dojo/_base/declare", "system/Type", "windows/Freezable", "input/ICommandSource", "internal/InheritanceContextHelper", 
        "windows/IInputElement", "input/ICommand", "windows/DependencyProperty", "windows/UIPropertyMetadata",
        "windows/PropertyChangedCallback"], 
		function(declare, Type, Freezable, ICommandSource, InheritanceContextHelper,
				IInputElement, ICommand, DependencyProperty, UIPropertyMetadata,
				PropertyChangedCallback){
	var InputBinding = declare("InputBinding", [Freezable,ICommandSource], {
		constructor:function(/*ICommand*/ command, /*InputGesture*/ gesture){
            if (command === undefined){
            	command = null;
            }
 
            if (gesture === undefined){
            	gesture = null;
			}

            this.Command = command;
            this._gesture = gesture;
            
            // Fields to implement DO's inheritance context
//            private DependencyObject 
            this._inheritanceContext = null; 
//            private bool 
            this._hasMultipleInheritanceContexts = false;
		},
		
        ///     Freezable override to create the instance (used for cloning). 
        /// </summary>
//        protected override Freezable 
        CreateInstanceCore:function()
        {
            return new InputBinding(); 
        },


        ///     Receive a new inheritance context
        /// </summary>
//        internal override void 
        AddInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        {
            
        	var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.AddInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;
        },

        /// <summary>
        ///     Remove an inheritance context 
        /// </summary>
//        internal override void 
        RemoveInheritanceContext:function(/*DependencyObject*/ context, /*DependencyProperty*/ property) 
        { 
        	var hasMultipleInheritanceContextsRef={
        		"hasMultipleInheritanceContexts" : this._hasMultipleInheritanceContexts
        	};
        	
        	var inheritanceContextRef = {
        		"inheritanceContext" : this._inheritanceContext	
        	};
            InheritanceContextHelper.RemoveInheritanceContext(context,
                                                                  this,
                                                                  /*ref _hasMultipleInheritanceContexts*/hasMultipleInheritanceContextsRef, 
                                                                  /*ref _inheritanceContext*/inheritanceContextRef);
            this._hasMultipleInheritanceContexts =hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts;
            this._inheritanceContext =inheritanceContextRef.inheritanceContext;              
        }
        
	});
	
	Object.defineProperties(InputBinding.prototype,{
        /// <summary>
        /// Command Object associated
        /// </summary> 
        /// <SecurityNote>
        /// Critical - may associate a secure command with a gesture, in 
        ///            these cases we need to demand the appropriate permission. 
        /// PublicOk - Calls CheckSecureCommand which does the appropriate demand.
        /// </SecurityNote> 
//        public ICommand 
        Command:
        { 
            get:function()
            { 
                return this.GetValue(InputBinding.CommandProperty); 
            },
            set:function(value) 
            {
            	this.SetValue(InputBinding.CommandProperty, value);
            }
        },
        
        /// <summary> 
        ///     A parameter for the command.
        /// </summary>
//        public object 
        CommandParameter:
        { 
            get:function()
            { 
                return this.GetValue(InputBinding.CommandParameterProperty); 
            },
            set:function(value)
            {
            	this.SetValue(InputBinding.CommandParameterProperty, value);
            }
        },
        
        /// <summary>
        ///     Where the command should be raised. 
        /// </summary>
//        public IInputElement 
        CommandTarget: 
        { 
            get:function()
            { 
                return this.GetValue(InputBinding.CommandTargetProperty);
            },
            set:function(value)
            { 
            	this.SetValue(InputBinding.CommandTargetProperty, value);
            } 
        },
        
        /// <summary>
        ///     Define the DO's inheritance context
        /// </summary> 
//        internal override DependencyObject 
        InheritanceContext:
        { 
            get:function() { return this._inheritanceContext; } 
        },
 
        /// <summary>
        ///     Says if the current instance has multiple InheritanceContexts 
        /// </summary> 
//        internal override bool 
        HasMultipleInheritanceContexts:
        { 
            get:function() { return this._hasMultipleInheritanceContexts; }
        },
        
        /// <summary> 
        /// InputGesture associated with the Command
        /// </summary>
        /// <SecurityNote>
        /// Critical - may associate a secure command with a gesture, in 
        ///            these cases we need to demand the appropriate permission.
        /// PublicOk - Calls CheckSecureCommand which does the appropriate demand. 
        /// </SecurityNote> 
//        public virtual InputGesture 
        Gesture:
        { 
            // We would like to make this getter non-virtual but that's not legal
            // in C#.  Luckily there is no security issue with leaving it virtual.
            get:function()
            { 
                return this._gesture; 
            },

            set:function(value)
            {
                if (value == null) 
                    throw new Error('ArgumentNullException("value")');
 
                this._gesture = value; 
                this.WritePostscript();
            } 
        }
	});
	
	Object.defineProperties(InputBinding,{
		/// <summary>
        ///     Dependency Property for Command property 
        /// </summary> 
//        public static readonly DependencyProperty 
        CommandProperty:
        {
        	get:function(){
        		if(InputBinding._CommandProperty === undefined){
        			InputBinding._CommandProperty =
        	            DependencyProperty.Register("Command", ICommand.Type, InputBinding.Type,
        	            new UIPropertyMetadata(null, new PropertyChangedCallback(InputBinding, OnCommandPropertyChanged)));
        		}
        		
        		return InputBinding._CommandProperty;
        	}
        },
        /// <summary>
        ///     Dependency Property for Command Parameter 
        /// </summary>
//        public static readonly DependencyProperty 
        CommandParameterProperty:
        {
        	get:function(){
        		if(InputBinding._CommandProperty === undefined){
        			InputBinding._CommandProperty = 
        	            DependencyProperty.Register("CommandParameter", Object.Type, InputBinding.Type); 
        		}
        		
        		return InputBinding._CommandProperty;
        	}
        },
        
        
        /// <summary> 
        ///     Dependency property for command target 
        /// </summary>
//        public static readonly DependencyProperty 
        CommandTargetProperty:
        {
        	get:function(){
        		if(InputBinding._CommandProperty === undefined){
        			InputBinding._CommandProperty = 
        	            DependencyProperty.Register("CommandTarget", IInputElement.Type, InputBinding.Type);
        		}
        		
        		return InputBinding._CommandProperty;
        	}
        }

	});
	
    ///     Property changed callback for Command property 
    /// </summary>
    /// <SecurityNote> 
    /// Critical - may associate a secure command with a gesture, in
    ///            these cases we need to demand the appropriate permission.
    /// TreatAsSafe - Calls CheckSecureCommand which does the appropriate demand.
    /// </SecurityNote> 
//    private static void 
    function OnCommandPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.CheckSecureCommand(e.NewValue, d.Gesture); 
    }
	
	InputBinding.Type = new Type("InputBinding", InputBinding, [Freezable.Type, ICommandSource.Type]);
	return InputBinding;
});
