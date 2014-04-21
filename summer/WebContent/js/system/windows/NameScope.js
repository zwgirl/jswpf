/**
 * Second Check 14-01-03
 * NameScope
 */
/// <summary> 
/// Used to store mapping information for names occuring
/// within the logical tree section. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "markup/INameScope", "specialized/HybridDictionary",
        "collections/KeyValuePairs", "windows/DependencyProperty", "collections/IEnumerator"], 
		function(declare, Type, INameScope, HybridDictionary,
				KeyValuePairs, DependencyProperty, IEnumerator){
	
//	class 
	var Enumerator =declare(IEnumerator/*<KeyValuePair<string, object>>*/,
    { 
//        IDictionaryEnumerator _enumerator;

        constructor:function(/*HybridDictionary*/ nameMap)
        {
            this._enumerator = null;

            if (nameMap != null)
            { 
            	this._enumerator = nameMap.GetEnumerator(); 
            }
        },

//        public void 
        Dispose:function()
        {
//            GC.SuppressFinalize(this); 
        },

//        public bool 
        MoveNext:function()
        {
            if (this._enumerator == null)
            { 
                return false;
            } 
            return this._enumerator.MoveNext(); 
        },

//        void IEnumerator.
        Reset:function() 
        {
            if (this._enumerator != null)
            {
            	this._enumerator.Reset(); 
            }
        } 
    });
	
	Object.defineProperties(Enumerator.prototype, {
//	       public KeyValuePair<string, object> 
		Current: 
        {
            get:function() 
            {
                if (_enumerator == null)
                {
                    return null; //default(KeyValuePair<string, object>); 
                }
                return new KeyValuePair/*<string, object>*/(/*(string)*/this._enumerator.Key, this._enumerator.Value); 
            } 
        }
	});
	
    
	var NameScope = declare("NameScope", INameScope, {
		constructor:function(){
			this._nameMap = null;
		} ,
		
        Get:function(/*string*/ key)
        {
            if (key == null)
            { 
                throw new Error('ArgumentNullException("key")');
            } 
            return this.FindName(key); 
        },
		
        Set:function(/*string*/ key, /*Objeect*/ value) 
        {
            if (key == null)
            {
                throw new Error('ArgumentNullException("key")');
            }

            if (value == null) 
            {
                throw new Error('ArgumentNullException("value")');
            }

            this.RegisterName(key, value);
        },
		
		 /// <summary> 
        /// Register Name-Object Map
        /// </summary> 
        /// <param name="name">name to be registered</param>
        /// <param name="scopedElement">object mapped to name</param>
//        public void 
        RegisterName:function(/*string*/ name, /*object*/ scopedElement)
        { 
            if (name == null)
                throw new ArgumentNullException("name"); 
 
            if (scopedElement == null)
                throw new ArgumentNullException("scopedElement"); 

            if (name == String.Empty)
                throw new ArgumentException(SR.Get(SRID.NameScopeNameNotEmptyString));
 
            if (!NameValidationHelper.IsValidIdentifierName(name))
            { 
                throw new ArgumentException(SR.Get(SRID.NameScopeInvalidIdentifierName, name)); 
            }
 
            if (this._nameMap == null)
            {
            	this._nameMap = new HybridDictionary();
            	this._nameMap.Set(name, scopedElement); 
            }
            else 
            { 
                /*object*/var nameContext = this._nameMap.Get(name);
                // first time adding the Name, set it 
                if (nameContext == null)
                {
                	this._nameMap.Set(name, scopedElement);
                } 
                else if (scopedElement != nameContext)
                { 
                    throw new Error('ArgumentException(SR.Get(SRID.NameScopeDuplicateNamesNotAllowed, name)'); 
                }
            } 
        }, 
        
        /// <summary>
        /// Unregister Name-Object Map
        /// </summary> 
        /// <param name="name">name to be registered</param>
//        public void 
        UnregisterName:function(/*string*/ name) 
        { 
            if (name == null)
                throw new Error('ArgumentNullException("name")'); 

            if (name == String.Empty)
                throw new Error('ArgumentException(SR.Get(SRID.NameScopeNameNotEmptyString)');
 
            if (this._nameMap != null && this._nameMap[name] != null)
            { 
            	this._nameMap.Remove(name); 
            }
            else 
            {
                throw new Error('ArgumentException(SR.Get(SRID.NameScopeNameNotFound, name)');
            }
        },

        /// <summary>
        /// Find - Find the corresponding object given a Name 
        /// </summary>
        /// <param name="name">Name for which context needs to be retrieved</param> 
        /// <returns>corresponding Context if found, else null</returns> 
//        public object 
        FindName:function(/*string*/ name)
        { 
            if (this._nameMap == null || name == null || name == String.Empty)
                return null;

            return this._nameMap.Get(name); 
        },

//        IEnumerator<KeyValuePair<string, object>> 
        GetEnumerator:function() 
        {
            return new Enumerator(this._nameMap);
        },
 
//        public void 
        Add:function(/*string*/ key, /*object*/ value) 
        {
        	if(arguments.length == 1){
        		var item = key;
        		if (item.Key == null)
                { 
                    throw new ArgumentException(SR.Get(SRID.ReferenceIsNull, "item.Key"), "item");
                } 
                if (item.Value == null) 
                {
                    throw new ArgumentException(SR.Get(SRID.ReferenceIsNull, "item.Value"), "item"); 
                }

                this.Add(item.Key, item.Value);
        	}else if(arguments.length == 2){
                if (key == null) 
                {
                    throw new Error('ArgumentNullException("key")');
                }
     
                this.RegisterName(key, value);
        	}
        },
//        public void 
        Clear:function() 
        {
            this._nameMap = null; 
        },

//        public void 
        CopyTo:function(/*KeyValuePair<string, object>[]*/ array, /*int*/ arrayIndex) 
        {
            if (this._nameMap == null)
            {
                array = null; 
                return;
            } 
 
            for(var i=0; i<this._nameMap.Count; i++) //foreach (DictionaryEntry entry in _nameMap)
            { 
            	var entry = this._nameMap.Get(i);
                array[arrayIndex++] = new KeyValuePair/*<string, object>*/(entry.Key, entry.Value);
            }
        },

//        public bool 
        Contains:function(/*KeyValuePair<string, object>*/ item) 
        { 
            if (item.Key == null)
            { 
                throw new ArgumentException(SR.Get(SRID.ReferenceIsNull, "item.Key"), "item");
            }
            return this.ContainsKey(item.Key);
        }, 
//        public bool 
        ContainsKey:function(/*string*/ key)
        { 
            if (key == null)
            {
                throw new Error('ArgumentNullException("key")');
            } 

            /*object*/var value = FindName(key); 
            return (value != null); 
        },
//        public bool 
        Remove:function(/*string*/ key)
        {
            if (!this.ContainsKey(key))
            { 
                return false;
            } 
            this.UnregisterName(key); 
            return true;
        },
        
//        public bool Remove(KeyValuePair<string, object> item)
//        { 
//            if (!Contains(item)) 
//            {
//                return false; 
//            }
//
//            if (item.Value != this[item.Key])
//            { 
//                return false;
//            } 
//            return Remove(item.Key); 
//        }

//        public bool 
        TryGetValue:function(/*string*/ key, valueOut/*out object value*/)
        {
            if (!this.ContainsKey(key)) 
            {
            	valueOut.value = null; 
                return false; 
            }
            valueOut.value = this.FindName(key); 
            return true;
        }
        
	});
	
	Object.defineProperties(NameScope.prototype, {
//		public int 
		Count:
        {
            get:function() 
            {
                if (this._nameMap == null) 
                { 
                    return 0;
                } 
                return this._nameMap.Count;
            }
        },
 
//        public bool 
		IsReadOnly:
        { 
            get:function() 
            {
                return false; 
            }
        },
        
//        public ICollection<string> 
        Keys: 
        {
            get:function() 
            { 
                if (this._nameMap == null)
                { 
                    return null;
                }

                var list = new List/*<string>*/(); 
                for(var i=0; i<this._nameMap.Keys.Count; i++) //foreach (string key in _nameMap.Keys)
                { 
                	var key = this._nameMap.Keys.Get(i);
                    list.Add(key); 
                }
                return list; 
            }
        },

//        public ICollection<object> 
        Values:
        {
            get:function() 
            { 
                if (this._nameMap == null)
                { 
                    return null;
                }

                var list = new List/*<object>*/(); 
                for(var i=0; i<this._nameMap.Keys.Values; i++) //foreach (object value in _nameMap.Values)
                { 
                	var value = this._nameMap.Values.Get(i);
                    list.Add(value); 
                }
                return list; 
            }
        }
	});
	
	Object.defineProperties(NameScope, {
        /// <summary>
        /// NameScope property. This is an attached property. 
        /// This property allows the dynamic attachment of NameScopes
        /// </summary> 
//        public static readonly DependencyProperty 
        NameScopeProperty:
        {
        	get:function(){
        		if(NameScope._NameScopeProperty === undefined){
        			NameScope._NameScopeProperty = DependencyProperty.RegisterAttached(
                            "NameScope", 
                            INameScope.Type,
                            NameScope.Type);
        		}
        		
        		return NameScope._NameScopeProperty;
        	}
        }
                                                  
	});
	
//    internal static INameScope 
    NameScope.NameScopeFromObject = function(/*object*/ obj)
    {
//        /*INameScope*/var nameScope = obj instanceof INameScope ? obj : null; 
    	/*INameScope*/var nameScope = INameScope.Type.IsInstanceOfType(obj) ? obj : null; 
        if (nameScope == null)
        { 
            /*DependencyObject*/var objAsDO = obj instanceof DependencyObject ? obj : null; 
            if (objAsDO != null)
            { 
                nameScope = NameScope.GetNameScope(objAsDO);
            }
        }

        return nameScope;
    };
	
    /// <summary> 
    /// Helper for setting NameScope property on a DependencyObject.
    /// </summary> 
    /// <param name="dependencyObject">Dependency Object  to set NameScope property on.</param> 
    /// <param name="value">NameScope property value.</param>
//    public static void 
    NameScope.SetNameScope = function(/*DependencyObject*/ dependencyObject, /*INameScope*/ value) 
    {
        if (dependencyObject == null)
        {
            throw new Error('ArgumentNullException("dependencyObject")'); 
        }

        dependencyObject.SetValue(NameScope.NameScopeProperty, value); 
    };

    /// <summary>
    /// Helper for reading NameScope property from a DependencyObject.
    /// </summary>
    /// <param name="dependencyObject">DependencyObject to read NameScope property from.</param> 
    /// <returns>NameScope property value.</returns>
//    public static INameScope 
    NameScope.GetNameScope = function(/*DependencyObject*/ dependencyObject) 
    {
        if (dependencyObject == null) 
        {
            throw new Error('ArgumentNullException("dependencyObject")');
        }

        return (/*(INameScope)*/dependencyObject.GetValue(NameScope.NameScopeProperty));
    }; 
	
	NameScope.Type = new Type("NameScope", NameScope, [INameScope.Type]);
	return NameScope;
});

//    public class NameScope : INameScopeDictionary
//    { 
//        // This is a HybridDictionary of Name-Object maps 
//        private HybridDictionary _nameMap;



