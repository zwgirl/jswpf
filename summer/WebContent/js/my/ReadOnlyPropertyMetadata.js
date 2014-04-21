/**
 * ReadOnlyPropertyMetadata
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ReadOnlyPropertyMetadata = declare("ReadOnlyPropertyMetadata", PropertyMetadata,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(ReadOnlyPropertyMetadata.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	ReadOnlyPropertyMetadata.Type = new Type("ReadOnlyPropertyMetadata", ReadOnlyPropertyMetadata, [PropertyMetadata.Type]);
	return ReadOnlyPropertyMetadata;
});

using System; 

namespace System.Windows
{
    internal class ReadOnlyPropertyMetadata : PropertyMetadata 
    {
        public ReadOnlyPropertyMetadata(object defaultValue, 
                                        GetReadOnlyValueCallback getValueCallback, 
                                        PropertyChangedCallback propertyChangedCallback) :
                                        base(defaultValue, propertyChangedCallback) 
        {
            _getValueCallback = getValueCallback;
        }
 
        internal override GetReadOnlyValueCallback GetReadOnlyValueCallback
        { 
            get 
            {
                return _getValueCallback; 
            }
        }

        private GetReadOnlyValueCallback _getValueCallback; 
    }
} 
 

