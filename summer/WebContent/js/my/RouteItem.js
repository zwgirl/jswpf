/**
 * EntryIndex
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var EntryIndex = declare(null,{
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
	
	Object.defineProperties(EntryIndex.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	EntryIndex.Type = new Type("EntryIndex", EntryIndex, [Object.Type]);
	return EntryIndex;
});

using System; 

namespace System.Windows
{
    // An item in the EventRoute 
    //
    // RouteItem constitutes 
    // the target object and 
    // list of RoutedEventHandlerInfo that need
    // to be invoked upon the target object 
    internal struct RouteItem
    {
        #region Construction
 
        // Constructor for RouteItem
        internal RouteItem(object target, RoutedEventHandlerInfo routedEventHandlerInfo) 
        { 
            _target = target;
            _routedEventHandlerInfo = routedEventHandlerInfo; 
        }

        #endregion Construction
 
        #region Operations
 
        // Returns target 
        internal object Target
        { 
            get {return _target;}
        }

        // Invokes the associated RoutedEventHandler 
        // on the target object with the given
        // RoutedEventArgs 
        internal void InvokeHandler(RoutedEventArgs routedEventArgs) 
        {
            _routedEventHandlerInfo.InvokeHandler(_target, routedEventArgs); 
        }

        /*
        Commented out to avoid "uncalled private code" fxcop violation 

        /// <summary> 
        ///     Cleanup all the references within the data 
        /// </summary>
        internal void Clear() 
        {
            _target = null;
            _routedEventHandlerInfo.Clear();
        } 
        */
 
        /// <summary> 
        ///     Is the given object equals the current
        /// </summary> 
        public override bool Equals(object o)
        {
            return Equals((RouteItem)o);
        } 

        /// <summary> 
        ///     Is the given RouteItem equals the current 
        /// </summary>
        public bool Equals(RouteItem routeItem) 
        {
            return (
                routeItem._target == this._target &&
                routeItem._routedEventHandlerInfo == this._routedEventHandlerInfo); 
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
        public static bool operator== (RouteItem routeItem1, RouteItem routeItem2)
        {
            return routeItem1.Equals(routeItem2);
        } 

        /// <summary> 
        ///     NotEquals operator overload 
        /// </summary>
        public static bool operator!= (RouteItem routeItem1, RouteItem routeItem2) 
        {
            return !routeItem1.Equals(routeItem2);
        }
 
        #endregion Operations
 
        #region Data 

        private object _target; 
        private RoutedEventHandlerInfo _routedEventHandlerInfo;

        #endregion Data
    } 
}
 
