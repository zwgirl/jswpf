/**
 * Second Check 12-06
 * ItemInfo
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
//    internal class 
    var ItemInfo = declare("ItemInfo", Object, {
    	constructor:function(/*object*/ item, /*DependencyObject*/ container/*=null*/, /*int*/ index/*=-1*/)
        { 
    		if(container === undefined){
    			container = null;
    		}
    		
    		if(index === undefined){
    			index = -1;
    		}
    		
            this.Item = item;
            this.Container = container;
            this.Index = index;
    	},
    	
//        public override int 
        GetHashCode:function() 
        {
            return (this.Item != null) ? this.Item.GetHashCode() : 314159; 
        }, 
        
//        internal ItemInfo 
        Clone:function()
        {
            return new ItemInfo(this.Item, this.Container, this.Index);
        }, 

//        public override bool 
        Equals:function(/*object*/ o) 
        {
            if (o === /*(object)*/this)
                return true;

            /*ItemInfo*/var that = o instanceof ItemInfo ? o : null;
            if (that == null) 
                return false; 

            return Equals(that, /*matchUnresolved:*/false); 
        },

//        internal bool 
        Equals:function(/*ItemInfo*/ that, /*bool*/ matchUnresolved)
        { 
            // Removed matches nothing
            if (this.IsRemoved || that.IsRemoved) 
                return false; 

            // items must match (the paranoia for UnsetValue is to avoid problems with 
            // classes that implement Object.Equals poorly, as in Dev11 439664)
            if (this.Item == DependencyProperty.UnsetValue && that.Item != DependencyProperty.UnsetValue)
                return false;
            if (that.Item == DependencyProperty.UnsetValue && this.Item != DependencyProperty.UnsetValue) 
                return false;
            if (!Object.Equals(this.Item, that.Item)) 
                return false; 

            // Key matches anything, except Unresolved when matchUnresovled is false 
            if (this.Container == ItemInfo.KeyContainer)
                return matchUnresolved || that.Container != ItemInfo.UnresolvedContainer;
            else if (that.Container == ItemInfo.KeyContainer)
                return matchUnresolved || this.Container != ItemInfo.UnresolvedContainer; 

            // Unresolved matches nothing 
            if (this.Container == ItemInfo.UnresolvedContainer || that.Container == ItemInfo.UnresolvedContainer) 
                return false;

            return
                (this.Container == that.Container)
                 ?  (this.Container == ItemInfo.SentinelContainer)
                     ?  (this.Index == that.Index)      // Sentinel => negative indices are significant 
                     :  (this.Index < 0 || that.Index < 0 ||
                            this.Index == that.Index)   // ~Sentinel => ignore negative indices 
                 :  (this.Container == ItemInfo.SentinelContainer) ||    // sentinel matches non-sentinel 
                    (that.Container == ItemInfo.SentinelContainer) ||
                    (   (this.Container == null || that.Container == null) &&   // null matches non-null 
                        (this.Index < 0 || that.Index < 0 ||                    // provided that indices match
                            this.Index == that.Index));
        },

        // update container and index with current values 
//        internal ItemInfo 
        Refresh:function(/*ItemContainerGenerator*/ generator) 
        {
            if (this.Container == null && this.Index < 0) 
            {
            	this.Container = generator.ContainerFromItem(this.Item);
            }

            if (this.Index < 0 && this.Container != null)
            { 
            	this.Index = generator.IndexFromContainer(this.Container); 
            }

            if (this.Container == null && this.Index >= 0)
            {
            	this.Container = generator.ContainerFromIndex(this.Index);
            } 

            if (this.Container == ItemInfo.SentinelContainer && this.Index >= 0) 
            { 
            	this.Container = null;   // caller explicitly wants null container
            } 

            return this;
        },

        // Don't call this on entries used in hashtables - it changes the hashcode
//        internal void 
        Reset:function(/*object*/ item) 
        { 
            this.Item = item;
        } 
    });
    
    Object.defineProperties(ItemInfo.prototype, {
//        internal object 
        Item: { get:function(){return this._item;}, /*private*/ set:function(value){this._item = value;} },
//        internal DependencyObject 
        Container: { get:function(){return this._container;}, set:function(value){this._container = value;} }, 
//        internal int 
        Index: { get:function(){return this._index;}, set:function(value){this._index = value;} },
        
//        internal bool 
        IsResolved: { get:function() { return this.Container != ItemInfo.UnresolvedContainer; } }, 
//        internal bool 
        IsKey: { get:function() { return this.Container == ItemInfo.KeyContainer; } },
//        internal bool 
        IsRemoved: { get:function() { return this.Container == ItemInfo.RemovedContainer; } }
    });
    
    Object.defineProperties(ItemInfo, {
//    	 internal static readonly DependencyObject 
    	SentinelContainer:
    	{
    		get:function(){
    			if(ItemInfo._SentinelContainer === undefined){
    				ItemInfo._SentinelContainer = new DependencyObject();
    			}
    			
        		return ItemInfo._SentinelContainer;
    		}
    	},
//         internal static readonly DependencyObject 
    	UnresolvedContainer:
    	{
    		get:function(){
    			if(ItemInfo._UnresolvedContainer === undefined){
    				ItemInfo._UnresolvedContainer = new DependencyObject();
    			}
        		return ItemInfo._UnresolvedContainer;
    		}
    	}, 
//         internal static readonly DependencyObject 
        KeyContainer:
    	{
    		get:function(){
    			if(ItemInfo._KeyContainer === undefined){
    				ItemInfo._KeyContainer = new DependencyObject();
    			}
        		return ItemInfo._KeyContainer;
    		}
    	},
//         internal static readonly DependencyObject 
        RemovedContainer:
    	{
    		get:function(){
    			if(ItemInfo._RemovedContainer === undefined){
    				ItemInfo._RemovedContainer = new DependencyObject();
    			}
        		return ItemInfo._RemovedContainer;
    		}
    	}
    });
//    internal static ItemInfo 
    ItemInfo.Key = function(/*ItemInfo*/ info) 
    { 
        return (info.Container == ItemInfo.UnresolvedContainer)
            ? new ItemInfo(info.Item, ItemInfo.KeyContainer, -1) 
            : info;
    };
    
    ItemInfo.Type = new Type("ItemInfo", ItemInfo, [Object.Type]);
    return ItemInfo;
});
