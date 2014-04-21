/**
 * ResourcesChangeInfo
 */

define(["dojo/_base/declare", "system/Type", "generic/List"], 
		function(declare, Type, List){
	
//	 private enum 
	var PrivateFlags =declare(null, {});
	PrivateFlags.IsThemeChange                   = 0x01;
	PrivateFlags.IsTreeChange                    = 0x02; 
	PrivateFlags.IsStyleResourceChange           = 0x04;
	PrivateFlags.IsTemplateResourceChange        = 0x08;
	PrivateFlags.IsSysColorsOrSettingsChange     = 0x10;
	PrivateFlags.IsCatastrophicDictionaryChange  = 0x20; 
	 
	var ResourcesChangeInfo = declare("ResourcesChangeInfo", Object,{
		constructor:function() 
        {
			if(arguments.length == 1){
	            this._oldDictionaries = null; 
	            this._newDictionaries = null; 
	            this._key = arguments[0];
	            this._container = null; 
	            this._flags = 0;
			}else if(arguments.length == 2){
				this._oldDictionaries = null;
	             if (arguments[0] != null)
	             {
	            	 this._oldDictionaries = new List/*<ResourceDictionary>*/(1); 
	            	 this._oldDictionaries.Add(oldDictionary);
	             } 
		 
	             this._newDictionaries = null;
	             if (arguments[1] != null) 
	             {
	            	 this._newDictionaries = new List/*<ResourceDictionary>*/(1);
	            	 this._newDictionaries.Add(newDictionary);
	             } 

	             this._key = null; 
	             this._container = null; 
	             this._flags = 0;				
			}else if(arguments.length == 4){
	             this._oldDictionaries = arguments[0]; 
	             this._newDictionaries = arguments[1];
	             this._key = null; 
	             this._container = arguments[4]; 
	             this._flags = 0;
	             this.IsStyleResourcesChange = arguments[2]; 
	             this.IsTemplateResourcesChange = arguments[3];
			}

        },
		
	       // Says if either the old or the new dictionaries contain the given key
//        internal bool 
		Contains:function(/*object*/ key, /*bool*/ isImplicitStyleKey)
        { 
            if (this.IsTreeChange || this.IsCatastrophicDictionaryChange)
            { 
                return true; 
            }
            else if (this.IsThemeChange || this.IsSysColorsOrSettingsChange) 
            {
                // Implicit Styles are not fetched from the Themes.
                // So we do not need to respond to theme changes.
                // This is a performance optimization. 

                return !isImplicitStyleKey; 
            } 

//            Debug.Assert(_oldDictionaries != null || _newDictionaries != null || _key != null, "Must have a dictionary or a key that has changed"); 

            if (this._key != null)
            {
                if (Object.Equals(this._key, key)) 
                {
                    return true; 
                } 
            }
 
            if (this._oldDictionaries != null)
            {
                for (var i=0; i<this._oldDictionaries.Count; i++)
                { 
                    if (this._oldDictionaries.Get(i).Contains(key))
                    { 
                        return true; 
                    }
                } 
            }

            if (this._newDictionaries != null)
            { 
                for (var i=0; i<this._newDictionaries.Count; i++)
                { 
                    if (this._newDictionaries.Get(i).Contains(key)) 
                    {
                        return true; 
                    }
                }
            }
 
            return false;
        }, 
 
//        private void 
		WritePrivateFlag:function(/*PrivateFlags*/ bit, /*bool*/ value)
        { 
            if (value)
            { 
            	this._flags |= bit; 
            }
            else 
            {
            	this._flags &= ~bit;
            }
        }, 

//        private bool 
        ReadPrivateFlag:function(/*PrivateFlags*/ bit) 
        { 
            return (this._flags & bit) != 0;
        } 
	});
	
	Object.defineProperties(ResourcesChangeInfo.prototype,{

        // This flag is used to indicate that a theme change has occured
//        internal bool  
		IsThemeChange:
        { 
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsThemeChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsThemeChange, value); } 
        }, 

        // This flag is used to indicate that a tree change has occured 
//        internal bool  
		IsTreeChange:
        {
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsTreeChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsTreeChange, value); } 
        },
 
        // This flag is used to indicate that a style has changed 
//        internal bool  
		IsStyleResourcesChange:
        { 
            get:function() { return this.ReadPrivateFlag(PrivateFlags.IsStyleResourceChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsStyleResourceChange, value); }
        },
 
        // This flag is used to indicate that this resource change was triggered from a Template change
//        internal bool 
		IsTemplateResourcesChange: 
        { 
            get:function() {return this.ReadPrivateFlag(PrivateFlags.IsTemplateResourceChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsTemplateResourceChange, value); } 
        },

        // This flag is used to indicate that a system color or settings change has occured
//        internal bool 
		IsSysColorsOrSettingsChange: 
        {
            get:function() {return this.ReadPrivateFlag(PrivateFlags.IsSysColorsOrSettingsChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsSysColorsOrSettingsChange, value); } 
        },
 
        // This flag is used to indicate that a catastrophic dictionary change has occured
//        internal bool 
		IsCatastrophicDictionaryChange:
        {
            get:function() {return this.ReadPrivateFlag(PrivateFlags.IsCatastrophicDictionaryChange); },
            set:function(value) { this.WritePrivateFlag(PrivateFlags.IsCatastrophicDictionaryChange, value); }
        }, 
 
        // This flag is used to indicate if the current operation is an effective add operation
//        internal bool 
		IsResourceAddOperation: 
        {
            get:function() { return this._key != null || (this._newDictionaries != null && this._newDictionaries.Count > 0); }
        },
 
        // This member is used to identify the container when a style change happens
//        internal DependencyObject 
		Container: 
        { 
            get:function() { return this._container; }
        } 		  
	});
	
	Object.defineProperties(ResourcesChangeInfo,{
		/// <summary>
        ///     This is a static accessor for a ResourcesChangeInfo that is used 
        ///     for theme change notifications
        /// </summary>
//        internal static ResourcesChangeInfo 
		ThemeChangeInfo:
        { 
            get:function()
            { 
                var info = new ResourcesChangeInfo(); 
                info.IsThemeChange = true;
                return info; 
            }
        },

        /// <summary> 
        ///     This is a static accessor for a ResourcesChangeInfo that is used
        ///     for tree change notifications 
        /// </summary> 
//        internal static ResourcesChangeInfo 
		TreeChangeInfo:
        { 
            get:function()
            {
                var info = new ResourcesChangeInfo();
                info.IsTreeChange = true; 
                return info;
            } 
        }, 

        /// <summary> 
        ///     This is a static accessor for a ResourcesChangeInfo that is used
        ///     for system colors or settings change notifications
        /// </summary>
//        internal static ResourcesChangeInfo
		SysColorsOrSettingsChangeInfo: 
        {
            get:function() 
            { 
                var info = new ResourcesChangeInfo();
                info.IsSysColorsOrSettingsChange = true; 
                return info;
            }
        },
 
        /// <summary>
        ///     This is a static accessor for a ResourcesChangeInfo that is used 
        ///     for any ResourceDictionary operations that we aren't able to provide 
        ///     the precise 'key that changed' information
        /// </summary> 
//        internal static ResourcesChangeInfo 
		CatastrophicDictionaryChangeInfo:
        {
            get:function()
            { 
                var info = new ResourcesChangeInfo();
                info.IsCatastrophicDictionaryChange = true; 
                return info; 
            }
        },   
	});
	
	ResourcesChangeInfo.Type = new Type("ResourcesChangeInfo", ResourcesChangeInfo, [Object.Type]);
	return ResourcesChangeInfo;
});
 
