/**
 * KeyGesture
 */

define(["dojo/_base/declare", "system/Type", "input/InputGesture", "input/ModifierKeys", "input/Key"], 
		function(declare, Type, InputGesture, ModifierKeys, Key){
	
//    private const string 
    var MULTIPLEGESTURE_DELIMITER = ";";
//    private static TypeConverter _keyGestureConverter = new KeyGestureConverter(); 
    
	var KeyGesture = declare("KeyGesture", InputGesture,{
		constructor:function(/*Key*/ key, /*ModifierKeys*/ modifiers, 
				/*string displayString or bool validateGesture*/ par){
			if(modifiers === undefined){
				modifiers = ModifierKeys.None;
			}
			
			if(typeof(par) == "boolean"){
				initialize(key, modifiers, String.Empty, true);
			}else if(typeof(par) == "string"){
				initialize(key, modifiers, displayString, true);
			}
		},
		
	      /// <summary>
        /// Private constructor that does the real work. 
        /// </summary> 
        /// <param name="key">Key</param>
        /// <param name="modifiers">Modifiers</param> 
        /// <param name="displayString">display string</param>
        /// <param name="validateGesture">If true, throws an exception if the key and modifier are not valid</param>
//        private 
		initialize:function(/*Key*/ key, /*ModifierKeys*/ modifiers, /*string*/ displayString, /*bool*/ validateGesture)
        { 
            if(!this.ModifierKeysConverter.IsDefinedModifierKeys(modifiers))
                throw new InvalidEnumArgumentException("modifiers", modifiers, typeof(ModifierKeys)); 
 
            if(!this.IsDefinedKey(key))
                throw new InvalidEnumArgumentException("key", key, typeof(Key)); 

            if (displayString == null)
                throw new ArgumentNullException("displayString");
 
            if(validateGesture && !this.IsValid(key, modifiers))
            { 
                throw new NotSupportedException(SR.Get(SRID.KeyGesture_Invalid, modifiers, key)); 
            }
 
            this._modifiers = modifiers;
            this._key = key;
            this._displayString = displayString;
        }, 
		
        /// <summary>
        /// Returns a string that can be used to display the KeyGesture.  If the
        /// DisplayString was set by the constructor, it is returned.  Otherwise
        /// a suitable string is created from the Key and Modifiers, with any 
        /// conversions being governed by the given CultureInfo.
        /// </summary> 
        /// <param name="culture">the culture used when creating a string from Key and Modifiers</param> 
//        public string
		GetDisplayStringForCulture:function(/*CultureInfo*/ culture)
        { 
            // return the DisplayString, if it was set by the ctor
            if (!String.IsNullOrEmpty(this._displayString))
            {
                return this._displayString; 
            }
 
            // otherwise use the type converter 
            return this._keyGestureConverter.ConvertTo(null, culture, this, String.Type);
        }, 

        /// <summary>
        /// Compares InputEventArgs with current Input
        /// </summary> 
        /// <param name="targetElement">the element to receive the command</param>
        /// <param name="inputEventArgs">inputEventArgs to compare to</param> 
        /// <returns>True - KeyGesture matches, false otherwise. 
        /// </returns>
//        public override bool
		Matches:function(/*object*/ targetElement, /*InputEventArgs*/ inputEventArgs) 
        {
            /*KeyEventArgs*/
			var keyEventArgs = inputEventArgs instanceof KeyEventArgs ? inputEventArgs : null;
            if(keyEventArgs != null && IsDefinedKey(keyEventArgs.Key))
            { 
                return ( ( Key == keyEventArgs.RealKey ) && ( this.Modifiers == Keyboard.Modifiers ) );
            } 
            return false; 
        },
 
        // Check for Valid enum, as any int can be casted to the enum.
//        internal static bool 
		IsDefinedKey:function(/*Key*/ key)
        {
            return (key >= Key.None && key <= Key.OemClear); 
        },
 
        ///<summary> 
        /// Is Valid Keyboard input to process for commands 
        ///</summary>
//        internal static bool 
		IsValid:function(/*Key*/ key, /*ModifierKeys*/ modifiers) 
        {
            //
            //  Don't enforce any rules on the Function keys or on the number pad keys.
            // 
            if(!( ( key >= Key.F1 && key <= Key.F24 ) || ( key >= Key.NumPad0 && key <= Key.Divide ) ))
            { 
                // 
                //  We check whether Control/Alt/Windows key is down for modifiers. We don't check
                //  for shift at this time as Shift with any combination is already covered in above check. 
                //  Shift alone as modifier case, we defer to the next condition to avoid conflicing with
                //  TextInput.

                if(( modifiers & ( ModifierKeys.Control | ModifierKeys.Alt | ModifierKeys.Windows ) ) != 0) 
                {
                    switch(key) 
                    { 
                        case Key.LeftCtrl:
                        case Key.RightCtrl: 
                        case Key.LeftAlt:
                        case Key.RightAlt:
                        case Key.LWin:
                        case Key.RWin: 
                            return false;
 
                        default: 
                            return true;
                    } 
                }
                else if(( key >= Key.D0 && key <= Key.D9 ) || ( key >= Key.A && key <= Key.Z ))
                {
                    return false; 
                }
            } 
            return true; 
        }
        
        
	});
	
	Object.defineProperties(KeyGesture.prototype,{
	     /// <summary> 
        /// Modifier
        /// </summary> 
//        public ModifierKeys 
		Modifiers: 
        {
            get:function() 
            {
                return this._modifiers;
            }
        }, 

        /// <summary> 
        /// Key 
        /// </summary>
//        public Key 
        Key: 
        {
            get:function()
            {
                return this._key; 
            }
        },
 
        /// <summary>
        /// DisplayString 
        /// </summary>
//        public string 
        DisplayString:
        {
            get:function() 
            {
                return this._displayString; 
            } 
        }  
	});
	
	Object.defineProperties(KeyGesture,{
		  
	});
	
    /// <summary>
    /// Decode the strings keyGestures and displayStrings, creating a sequence
    /// of KeyGestures.  Add each KeyGesture to the given InputGestureCollection.
    /// The two input strings typically come from a resource file. 
    /// </summary>
//    internal static void 
	KeyGesture.AddGesturesFromResourceStrings = function(/*string*/ keyGestures, /*string*/ displayStrings, 
			/*InputGestureCollection*/ gestures) 
    { 
        while (!String.IsNullOrEmpty(keyGestures))
        { 
        	var keyGestureToken;
        	var keyDisplayString;

            // break apart first gesture from the rest 
            var index = keyGestures.IndexOf(MULTIPLEGESTURE_DELIMITER, StringComparison.Ordinal);
            if (index >= 0) 
            {   // multiple gestures exist 
                keyGestureToken  = keyGestures.Substring(0, index);
                keyGestures   = keyGestures.Substring(index + 1); 
            }
            else
            {
                keyGestureToken = keyGestures; 
                keyGestures = String.Empty;
            } 

            // similarly, break apart first display string from the rest
            index = displayStrings.IndexOf(MULTIPLEGESTURE_DELIMITER, StringComparison.Ordinal); 
            if (index >= 0)
            {   // multiple display strings exist
                keyDisplayString  = displayStrings.Substring(0, index);
                displayStrings   = displayStrings.Substring(index + 1); 
            }
            else 
            { 
                keyDisplayString = displayStrings;
                displayStrings = String.Empty; 
            }

            /*KeyGesture*/var keyGesture = CreateFromResourceStrings(keyGestureToken, keyDisplayString);

            if (keyGesture != null)
            { 
                gestures.Add(keyGesture); 
            }
        } 
    };

//    internal static KeyGesture 
    KeyGesture.CreateFromResourceStrings = function(/*string*/ keyGestureToken, /*string*/ keyDisplayString)
    { 
        // combine the gesture and the display string, producing a string
        // that the type converter will recognize 
        if (!String.IsNullOrEmpty(keyDisplayString)) 
        {
            keyGestureToken += KeyGestureConverter.DISPLAYSTRING_SEPARATOR + keyDisplayString; 
        }

        var r = this._keyGestureConverter.ConvertFromInvariantString(keyGestureToken);
        return  r = r instanceof KeyGesture ? r : null;
    };
	
	KeyGesture.Type = new Type("KeyGesture", KeyGesture, [InputGesture.Type]);
	return KeyGesture;
});



