/**
 * SourceItem
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SourceItem = declare("SourceItem", null,{
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
	
	Object.defineProperties(SourceItem.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	SourceItem.Type = new Type("SourceItem", SourceItem, [Object.Type]);
	return SourceItem;
});

using System; 

namespace System.Windows
{
    // An item in the source context 
    internal struct SourceItem
    { 
        #region Construction 

        // Constructor for SourceItem 
        internal SourceItem(int startIndex, object source)
        {
            _startIndex = startIndex;
            _source = source; 
        }
 
        #endregion Construction 

        #region Operations 

        // Gettor for StartIndex
        internal int StartIndex
        { 
            get { return _startIndex; }
        } 
 
        // Gettor for Source
        internal object Source 
        {
            get { return _source; }
        }
 
        /*
        Commented out to avoid "uncalled private code" fxcop violation 
 
        /// <summary>
        ///     Cleanup all the references within the data 
        /// </summary>
        internal void Clear()
        {
            _startIndex = -1; 
            _source = null;
        } 
        */ 

        /// <summary> 
        ///     Is the given object equals the current
        /// </summary>
        public override bool Equals(object o)
        { 
            return Equals((SourceItem)o);
        } 
 
        /// <summary>
        ///     Is the given SourceItem equals the current 
        /// </summary>
        public bool Equals(SourceItem sourceItem)
        {
            return ( 
                sourceItem._startIndex == this._startIndex &&
                sourceItem._source == this._source); 
        } 

        /// <summary> 
        ///     Serves as a hash function for a particular type, suitable for use in
        ///     hashing algorithms and data structures like a hash table
        /// </summary>
        public override int GetHashCode() 
        {
            return base.GetHashCode(); 
        } 

        /// <summary> 
        ///     Equals operator overload
        /// </summary>
        public static bool operator== (SourceItem sourceItem1, SourceItem sourceItem2)
        { 
            return sourceItem1.Equals(sourceItem2);
        } 
 
        /// <summary>
        ///     NotEquals operator overload 
        /// </summary>
        public static bool operator!= (SourceItem sourceItem1, SourceItem sourceItem2)
        {
            return !sourceItem1.Equals(sourceItem2); 
        }
 
        #endregion Operations 

        #region Data 

        private int _startIndex;
        private object _source;
 
        #endregion Data
    } 
} 

