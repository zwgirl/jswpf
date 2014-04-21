/**
 * TemplateKey
 */

define(["dojo/_base/declare", "system/Type", "windows/ResourceKey", "componentmodel/ISupportInitialize"], 
		function(declare, Type, ResourceKey, ISupportInitialize){
	
    /// <summary> The different types of templates that use TemplateKey </summary>
//    protected enum 
	var TemplateType = declare(null, {});
        /// <summary> DataTemplate </summary> 
	TemplateType.DataTemplate = 0;
        /// <summary> TableTemplate </summary> 
	TemplateType.TableTemplate= 1;
	
    
	var TemplateKey = declare("TemplateKey", [ResourceKey, ISupportInitialize],{
		constructor:function(/*TemplateType*/ templateType, /*object*/ dataType)
        { 
			if(dataType === undefined){
				dataType = null;
			}
            var ex = TemplateKey.ValidateDataType(dataType, "dataType");
            if (ex != null) 
                throw ex; 

            this._dataType = dataType; 
            this._templateType = templateType;
            this._initializing = false;
        },
        
        /// <summary>Begin Initialization</summary> 
//        void ISupportInitialize.
        BeginInit:function() 
        {
            this._initializing = true; 
        },

        /// <summary>End Initialization, verify that internal state is consistent</summary>
//        void ISupportInitialize.
        EndInit:function() 
        {
            if (this._dataType == null) 
            { 
                throw new InvalidOperationException(SR.Get(SRID.PropertyMustHaveValue, "DataType", this.GetType().Name));
            } 

            this._initializing = false;
        },
        
        /// <summary> Override of Object.GetHashCode() </summary>
//        public override int 
        GetHashCode:function() 
        {
            // note that the hash code can change, but only during intialization 
            // and only once (DataType can only be changed once, from null to 
            // non-null, and that can only happen during [Begin/End]Init).
            // Technically this is still a violation of the "constant during 
            // lifetime" rule, however in practice this is acceptable.  It is
            // very unlikely that someone will put a TemplateKey into a hashtable
            // before it is initialized.
 
            var hashcode = this._templateType;
 
            if (this._dataType != null) 
            {
                hashcode += this._dataType.GetHashCode(); 
            }

            return hashcode;
        },

        /// <summary> Override of Object.Equals() </summary> 
//        public override bool 
        Equals:function(/*object*/ o) 
        {
            var key = o instanceof TemplateKey ? o : null; 
            if (key != null)
            {
                return  this._templateType == key._templateType &&
                        Object.Equals(this._dataType, key._dataType); 
            }
            return false; 
        } 
        
	});
	
	Object.defineProperties(TemplateKey.prototype,{
	       /// <summary> 
        /// The type for which the template is designed.  This is either
        /// a Type (for object data), or a string (for XML data).  In the latter 
        /// case the string denotes the XML tag name.
        /// </summary>
//        public object 
		DataType:
        { 
            get:function() { return this._dataType; },
            set:function(value) 
            { 
                if (!this._initializing)
                    throw new InvalidOperationException(SR.Get(SRID.PropertyIsInitializeOnly, "DataType", this.GetType().Name)); 
                if (_dataType != null && value != _dataType)
                    throw new InvalidOperationException(SR.Get(SRID.PropertyIsImmutable, "DataType", this.GetType().Name));

                var ex = ValidateDataType(value, "value"); 
                if (ex != null)
                    throw ex; 
 
                this._dataType = value;
            } 
        },
        /// <summary>
        ///     Allows SystemResources to know which assembly the template might be defined in.
        /// </summary> 
//        public override Assembly 
        Assembly:
        { 
            get:function() 
            {
                var type = this._dataType instanceof Type ? this._dataType : null; 
                if (type != null)
                {
                    return type.Assembly;
                } 

                return null; 
            } 
        }
	});
	
    // Validate against these rules
    //  1. dataType must not be null (except at initialization, which is tested at EndInit)
    //  2. dataType must be either a Type (object data) or a string (XML tag name)
    //  3. dataType cannot be typeof(Object) 
//    internal static Exception 
	TemplateKey.ValidateDataType = function(/*object*/ dataType, /*string*/ argName)
    { 
        var result = null; 

        if (dataType == null) 
        {
            result = new ArgumentNullException(argName);
        }
        else if (!(dataType instanceof Type) && !(typeof(dataType) == "string")) 
        {
            result = new ArgumentException(SR.Get(SRID.MustBeTypeOrString, dataType.GetType().Name), argName); 
        } 
        else if (Object.Type.Equals(dataType))
        { 
            result = new ArgumentException(SR.Get(SRID.DataTypeCannotBeObject), argName);
        }

        return result; 
    };
	
	TemplateKey.Type = new Type("TemplateKey", TemplateKey, [ResourceKey.Type, ISupportInitialize.Type]);
	TemplateKey.TemplateType = TemplateType;
	return TemplateKey;
});

