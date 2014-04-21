/**
 * ComponentResourceKey
 */
/// <summary> 
///     Key class for custom components to define the names of their resources to be loaded by SystemResources.
/// </summary> 
define(["dojo/_base/declare", "system/Type", "windows/ResourceKey"], 
		function(declare, Type, ResourceKey){
	var ComponentResourceKey = declare("ComponentResourceKey", ResourceKey,{
		constructor:function(/*Type*/ typeInTargetAssembly, /*object*/ resourceId) 
        {
			if(arguments.length == 2){
	            if (typeInTargetAssembly == null) 
	            {
	                throw new ArgumentNullException("typeInTargetAssembly");
	            }
	            if (resourceId == null) 
	            {
	                throw new ArgumentNullException("resourceId"); 
	            } 

	            this._typeInTargetAssembly = typeInTargetAssembly; 
	            this._typeInTargetAssemblyInitialized = true;

	            this._resourceId = resourceId;
	            this._resourceIdInitialized = true; 
			}
		},
		
		/// <summary>
        ///     Determines if the passed in object is equal to this object.
        ///     Two keys will be equal if they both have equal Types and IDs.
        /// </summary> 
        /// <param name="o">The object to compare with.</param>
        /// <returns>True if the objects are equal. False otherwise.</returns> 
//        public override bool 
		Equals:function(/*object*/ o) 
        {
            var key = o instanceof ComponentResourceKey ? o : null; 

            if (key != null)
            {
                return ((key._typeInTargetAssembly != null) ? key._typeInTargetAssembly.Equals(this._typeInTargetAssembly) : (this._typeInTargetAssembly == null)) && 
                    ((key._resourceId != null) ? key._resourceId.Equals(this._resourceId) : (this._resourceId == null));
            } 
 
            return false;
        }, 

        /// <summary>
        ///     Serves as a hash function for a particular type.
        /// </summary> 
//        public override int 
		GetHashCode:function()
        { 
            return ((this._typeInTargetAssembly != null) ? this._typeInTargetAssembly.GetHashCode() : 0) ^ ((this._resourceId != null) ? this._resourceId.GetHashCode() : 0); 
        },
 
        /// <summary>
        ///     return string representation of this key
        /// </summary>
        /// <returns>the string representation of the key</returns> 
//        public override string 
        ToString:function()
        { 
            var strBuilder = new StringBuilder(256); 
            strBuilder.Append("TargetType=");
            strBuilder.Append((_typeInTargetAssembly != null) ? _typeInTargetAssembly.FullName : "null"); 
            strBuilder.Append(" ID=");
            strBuilder.Append((_resourceId != null) ? _resourceId.ToString() : "null");
            return strBuilder.ToString();
        } 
	});
	
	Object.defineProperties(ComponentResourceKey.prototype,{
		/// <summary> 
        ///     The Type associated with this resources. Must be in assembly where the resource is located.
        /// </summary> 
//        public Type 
		TypeInTargetAssembly:
        {
            get:function()
            { 
                return this._typeInTargetAssembly;
            }, 
 
            set:function(value)
            { 
                if (value == null)
                {
                    throw new ArgumentNullException("value");
                } 
                if (this._typeInTargetAssemblyInitialized)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.ChangingTypeNotAllowed)); 
                }
                this._typeInTargetAssembly = value; 
                this._typeInTargetAssemblyInitialized = true;
            }
        },
 
        /// <summary>
        ///     Used to determine where to look for the resource dictionary that holds this resource. 
        /// </summary> 
//        public override Assembly 
        Assembly:
        { 
            get:function()
            {
                return (this._typeInTargetAssembly != null) ? this._typeInTargetAssembly.Assembly : null;
            } 
        },
 
        /// <summary> 
        ///     A unique Id to differentiate this key from other keys associated with the same type.
        /// </summary> 
//        public object 
        ResourceId:
        {
            get:function()
            { 
                return this._resourceId;
            }, 
 
            set:function(value)
            { 
                if (this._resourceIdInitialized)
                {
                    throw new InvalidOperationException(SR.Get(SRID.ChangingIdNotAllowed));
                } 
                this._resourceId = value;
                this._resourceIdInitialized = true; 
            } 
        }  
	});
	
	ComponentResourceKey.Type = new Type("ComponentResourceKey", ComponentResourceKey, [ResourceKey.Type]);
	return ComponentResourceKey;
});
