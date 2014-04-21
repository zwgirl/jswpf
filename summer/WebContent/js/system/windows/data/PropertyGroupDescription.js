/**
 * PropertyGroupDescription
 */

define(["dojo/_base/declare", "system/Type", "componentmodel/GroupDescription"], 
		function(declare, Type, GroupDescription){
	var PropertyGroupDescription = declare("PropertyGroupDescription", GroupDescription,{
		constructor:function(/*string*/ propertyName,
                /*IValueConverter*/ converter,
                /*StringComparison*/ stringComparison) 
        {
			if(propertyName === undefined){
				propertyName =null;
			}
			
			if(converter === undefined){
				converter = null;
			}
			
			if(stringComparison === undefined){
				stringComparison = null;
			}
			
			if(propertyName != null){
	            this.UpdatePropertyName(propertyName);	
			}

            this._converter = converter;
            this._stringComparison = stringComparison; 
            
//            PropertyPath        
            this._propertyPath = null;
		},
		
		 /// <summary> 
        /// Return the group name(s) for the given item
        /// </summary>
//        public override object 
		GroupNameFromItem:function(/*object*/ item, /*int*/ level, /*CultureInfo*/ culture)
        { 
            var value;
//            var xmlValue; 
 
            // get the property value
            if (String.IsNullOrEmpty(this.PropertyName)) 
            {
                value = item;
            }
//            else if (AssemblyHelper.TryGetValueFromXmlNode(item, PropertyName, out xmlValue)) 
//            {
//                value = xmlValue; 
//            } 
            else if (item != null)
            { 
//comment cym
//                using (_propertyPath.SetContext(item))
//                {
//                    value = _propertyPath.GetValue();
//                } 
            	
            	value = item[this.PropertyName];
            }
            else 
            { 
                value = null;
            } 

            // apply the converter to the value
            if (this.Converter != null)
            { 
                value = this.Converter.Convert(value, Object.Type, level, culture);
            } 
 
            return value;
        },

        /// <summary>
        /// Return true if the names match (i.e the item should belong to the group).
        /// </summary> 
//        public override bool 
        NamesMatch:function(/*object*/ groupName, /*object*/ itemName)
        { 
            var s1 = typeof(groupName) == "string" ? groupName : null; 
            var s2 = typeof(itemName) == "string" ? itemName : null;
 
            if (s1 != null && s2 != null)
            {
                return String.Equals(s1, s2, StringComparison);
            } 
            else
            { 
                return Object.Equals(groupName, itemName); 
            }
        },

//        private void 
        UpdatePropertyName:function(/*string*/ propertyName) 
        { 
            this._propertyName = propertyName;
//            this._propertyPath = !String.IsNullOrEmpty(propertyName) ? new PropertyPath(propertyName) : null;  // cym comment
        },

//        private void 
        OnPropertyChanged:function(/*string*/ propertyName)
        { 
        	GroupDescription.prototype.OnPropertyChanged.call(this, new PropertyChangedEventArgs(propertyName));
        } 
	});
	
	Object.defineProperties(PropertyGroupDescription.prototype,{
		/// The name of the property whose value is used to determine which group(s)
        /// an item belongs to.
        /// If PropertyName is null, the item itself is used. 
        /// </summary>
//        public string 
		PropertyName: 
        {
            get:function() { return this._propertyName; },
            set:function(value)
            {
            	this.UpdatePropertyName(value);
            	this.OnPropertyChanged("PropertyName"); 
            }
        }, 
 
        /// <summary>
        /// This converter is applied to the property value (or the item) to 
        /// produce the final value used to determine which group(s) an item
        /// belongs to.
        /// If the delegate returns an ICollection, the item is added to
        /// multiple groups - one for each member of the collection. 
        /// </summary>
//        public IValueConverter 
        Converter: 
        {
            get:function() { return this._converter; }, 
            set:function(value) { this._converter = value; this.OnPropertyChanged("Converter"); }
        },

        /// <summary> 
        /// This governs the comparison between an item's value (as determined
        /// by PropertyName and Converter) and a group's name. 
        /// It is ignored unless both comparands are strings. 
        /// The default value is StringComparison.Ordinal.
        /// </summary> 
//        public StringComparison 
        StringComparison:
        {
            get:function() { return this._stringComparison; }, 
            set:function(value) { this._stringComparison = value; this.OnPropertyChanged("StringComparison"); }
        } 
	  
	});
	
	PropertyGroupDescription.Type = new Type("PropertyGroupDescription", PropertyGroupDescription, [GroupDescription.Type]);
	return PropertyGroupDescription;
});
