/**
 * second check 12-07
 * three check 12-12
 * ItemContainerGenerator
 */

define(["dojo/_base/declare", "system/Type", "primitives/IRecyclingItemContainerGenerator", "collections/Queue", "primitives/GeneratorDirection",
        "specialized/INotifyCollectionChanged", "objectmodel/ReadOnlyCollection", "controls/MapChangedHandler",
        "primitives/ItemsChangedEventHandler", "primitives/GeneratorPosition", "specialized/NotifyCollectionChangedAction", 
        "primitives/GeneratorStatus", "primitives/ItemsChangedEventArgs", "data/CollectionViewGroup",
        "windows/FrameworkPropertyMetadata", "windows/DependencyProperty", "controls/GroupItem",
        "internal/ListOfObject"], 
		function(declare, Type, IRecyclingItemContainerGenerator, Queue, GeneratorDirection,
				INotifyCollectionChanged, ReadOnlyCollection, MapChangedHandler, 
				ItemsChangedEventHandler, GeneratorPosition, NotifyCollectionChangedAction,
				GeneratorStatus, ItemsChangedEventArgs, CollectionViewGroup,
				FrameworkPropertyMetadata, DependencyProperty, GroupItem,
				ListOfObject){

    // cached state of the factory's item map (updated by factory)
    // used to speed up calls to Generate
//    private struct 
    var GeneratorState = declare("GeneratorState", Object, {
    	constructor:function(){
//          private ItemBlock   
            this._block = null;     // some block in the map (most recently used)
//            private int         
            this._offset = 0;    // offset with the block
//            private int         
            this._count = 0;     // cumulative item count of blocks before the cached one
//            private int         
            this._itemIndex = 0; // index of current item 
    	}
    });
    
    Object.defineProperties(GeneratorState.prototype, {
//        public ItemBlock 
        Block:  
        { 
        	get:function() { return this._block; },
        	set:function(value) { this._block = value; } 
        },
//        public int 
        Offset:       
        { 
        	get:function() { return this._offset; },  
        	set:function(value) { this._offset = value; } 
        }, 
//        public int 
        Count:        
        { 
        	get:function() { return this._count; },
        	set:function(value) { this._count = value; } 
        }, 
//        public int 
        ItemIndex:    
        { 
        	get:function() { return this._itemIndex; },
        	set:function(value) { this._itemIndex = value; } 
        },
    });
    
    GeneratorState.Type = new Type("GeneratorState", GeneratorState, [Object.Type]);
    
    /// <summary>
    ///     Generator is the object that generates UI on behalf of an ItemsControl, 
    ///     working under the supervision of an ItemContainerGenerator.
    /// </summary> 
//    private class 
    var Generator = declare("Generator", IDisposable, {
    	constructor:function(/*ItemContainerGenerator*/ factory, /*GeneratorPosition*/ position, 
    			/*GeneratorDirection*/ direction, /*bool*/ allowStartAtRealizedItem) 
        { 
    		this._cachedState = new GeneratorState();
            this._factory = factory;
            this._direction = direction; 

            this._factory.MapChanged.Combine(new MapChangedHandler(this, this.OnMapChanged));

            this._factory.MoveToPosition(position, direction, allowStartAtRealizedItem, /*ref*/ this._cachedState); 
            this._done = (this._factory.ItemsInternal.Count == 0);

            this._factory.SetStatus(GeneratorStatus.GeneratingContainers); 
        },
 
        /// <summary> Generate UI for the next item or group</summary> 
//        public DependencyObject 
        GenerateNext:function(/*bool*/ stopAtRealized, /*out bool isNewlyRealized*/isNewlyRealizedOut)
        {
        	
            /*DependencyObject*/var container = null;
            isNewlyRealizedOut.isNewlyRealized = false; 

            while (container == null) 
            { 
                /*UnrealizedItemBlock*/var uBlock = this._cachedState.Block instanceof UnrealizedItemBlock ? 
                		this._cachedState.Block : null;
                /*IList*/var items = this._factory.ItemsInternal; 
                var itemIndex = this._cachedState.ItemIndex;
                var incr = (this._direction == GeneratorDirection.Forward) ? +1 : -1;

                if (this._cachedState.Block == this._factory._itemMap) 
                	this._done = true;            // we've reached the end of the list

                if (uBlock == null && stopAtRealized) 
                	this._done = true;

                if (!(0 <= itemIndex && itemIndex < items.Count))
                	this._done = true;

                if (this._done) 
                {
                	isNewlyRealizedOut.isNewlyRealized = false; 
                    return null; 
                }

                /*object*/var item = items.Get(itemIndex);
                
                if (uBlock != null)
                { 
                    // We don't have a realized container for this item.  Try to use a recycled container
                    // if possible, otherwise generate a new container. 

                	isNewlyRealizedOut.isNewlyRealized = true;
                    /*CollectionViewGroup*/var group = item instanceof CollectionViewGroup ? item : null; 

                    // DataGrid needs to generate DataGridRows for special items like NewItemPlaceHolder and when adding a new row.
                    // Generate a new container for such cases.
                    var isNewItemPlaceHolderWhenGrouping = (this._factory._generatesGroupItems && group == null); 

                    if (this._factory._recyclableContainers.Count > 0 
                    		&& !this._factory.Host.IsItemItsOwnContainer(item) && !isNewItemPlaceHolderWhenGrouping) 
                    { 
                        container = this._factory._recyclableContainers.Dequeue();
                        isNewlyRealizedOut.isNewlyRealized = false; 
                    }
                    else
                    {
                        if (group == null || !this._factory.IsGrouping) 
                        {
                            // generate container for an item 
                            container = this._factory.Host.GetContainerForItem(item); 
                        }
                        else 
                        {
                            // generate container for a group
                            container = this._factory.ContainerForGroup(group);
                        } 
                    }

                    // add the (item, container) to the current block 
                    if (container != null)
                    { 
                        ItemContainerGenerator.LinkContainerToItem(container, item);

                        this._factory.Realize(uBlock, this._cachedState.Offset, item, container);

                        // set AlternationIndex on the container (and possibly others)
                        this._factory.SetAlternationIndex(this._cachedState.Block, this._cachedState.Offset, this._direction); 
                    } 
                }
                else 
                {
                    // return existing realized container
                	isNewlyRealizedOut.isNewlyRealized = false;
                    /*RealizedItemBlock*/var rib = this._cachedState.Block; 
                    container = rib.ContainerAt(this._cachedState.Offset);
                } 

                // advance to the next item
                this._cachedState.ItemIndex = itemIndex; 
                if (this._direction == GeneratorDirection.Forward)
                {
                	this._cachedState.Block.MoveForward(/*ref*/ this._cachedState, true);
                } 
                else
                { 
                	this._cachedState.Block.MoveBackward(/*ref*/ this._cachedState, true); 
                }
            } 

            return container;
        },

        /// <summary> Dispose this generator. </summary>
//        void IDisposable.
        Dispose:function()
        { 
            if (this._factory != null)
            { 
            	this._factory.MapChanged.Remove(new MapChangedHandler(this, this.OnMapChanged)); 
            	this._done = true;
                if (!this._factory._isGeneratingBatches) 
                {
                	this._factory.SetStatus(GeneratorStatus.ContainersGenerated);
                }
                this._factory._generator = null; 
                this._factory = null;
            } 

//            GC.SuppressFinalize(this);
        },
        

        // The map data structure has changed, so the state must change accordingly.
        // This is called in various different ways. 
        //  A. Items were moved within the data structure, typically because
        //  items were realized or un-realized.  In this case, the args are:
        //      block - the block from where the items were moved
        //      offset - the offset within the block of the first item moved 
        //      count - how many items moved
        //      newBlock - the block to which the items were moved 
        //      newOffset - the offset within the new block of the first item moved 
        //      deltaCount - the difference between the cumululative item counts
        //                  of newBlock and block 
        //  B. An item was added or removed from the data structure.  In this
        //  case the args are:
        //      block - null  (to distinguish case B from case A)
        //      offset - the index of the changed item, w.r.t. the entire item list 
        //      count - +1 for insertion, -1 for deletion
        //      newBlock - block where item was inserted (null for deletion) 
        //  C. Refresh: all items are returned to a single unrealized block. 
        //  In this case, the args are:
        //      block - null 
        //      offset - -1 (to distinguish case C from case B)
        //      newBlock = the single unrealized block
        //      others - unused
//        void 
        OnMapChanged:function(/*ItemBlock*/ block, /*int*/ offset, /*int*/ count, 
                        /*ItemBlock*/ newBlock, /*int*/ newOffset, /*int*/ deltaCount)
        { 
            // Case A.  Items were moved within the map data structure 
            if (block != null)
            { 
                // if the move affects this generator, update the cached state
                if (block == this._cachedState.Block && offset <= this._cachedState.Offset &&
                		this._cachedState.Offset < offset + count)
                { 
                	this._cachedState.Block = newBlock;
                	this._cachedState.Offset += newOffset - offset; 
                	this._cachedState.Count += deltaCount; 
                }
            } 
            // Case B.  An item was inserted or deleted
            else if (offset >= 0)
            {
                // if the item occurs before my block, update my item count 
                if (offset < this._cachedState.Count ||
                    (offset == this._cachedState.Count && newBlock != null && newBlock != this._cachedState.Block)) 
                { 
                	this._cachedState.Count += count;
                	this._cachedState.ItemIndex += count; 
                }
                // if the item occurs within my block before my item, update my offset
                else if (offset < this._cachedState.Count + this._cachedState.Offset)
                { 
                	this._cachedState.Offset += count;
                	this._cachedState.ItemIndex += count; 
                } 
                // if the item occurs at my position, ...
                else if (offset == this._cachedState.Count + this._cachedState.Offset) 
                {
                    if (count > 0)
                    {
                        // for insert, update my offset 
                    	this._cachedState.Offset += count;
                    	this._cachedState.ItemIndex += count; 
                    } 
                    else if (_cachedState.Offset == this._cachedState.Block.ItemCount)
                    { 
                        // if deleting last item in the block, advance to the next block
                    	this._cachedState.Block = this._cachedState.Block.Next;
                    	this._cachedState.Offset = 0;
                    } 
                }
            } 
            // Case C.  Refresh 
            else
            { 
            	this._cachedState.Block = newBlock;
            	this._cachedState.Offset += this._cachedState.Count;
            	this._cachedState.Count = 0;
            } 
        }
    }); //: IDisposable 


//    private class 
    var BatchGenerator = declare("BatchGenerator", IDisposable, {
    	constructor:function(/*ItemContainerGenerator*/ factory)
        { 
    		this._factory = factory;
    		this._factory._isGeneratingBatches = true; 
    		this._factory.SetStatus(GeneratorStatus.GeneratingContainers); 
        },
        

//        void IDisposable.
        Dispose:function()
        {
            if (this._factory != null)
            { 
            	this._factory._isGeneratingBatches = false;
            	this._factory.SetStatus(GeneratorStatus.ContainersGenerated); 
            	this._factory = null; 
            }
//            GC.SuppressFinalize(this); 
        }
    }); // : IDisposable

    //------------------------------------------------------ 
    //
    //  Private Nested Classes 
    // 
    //-----------------------------------------------------

    // The ItemContainerGenerator uses the following data structure to maintain
    // the correspondence between items and their containers.  It's a doubly-linked
    // list of ItemBlocks, with a sentinel node serving as the header.
    // Each node maintains two counts:  the number of items it holds, and 
    // the number of containers.
    // 
    // There are two kinds of blocks - one holding only "realized" items (i.e. 
    // items that have been generated into containers) and one holding only
    // unrealized items.  The container count of a realized block is the same 
    // as its item count (one container per item);  the container count of an
    // unrealized block is zero.
    //
    // Unrealized blocks can hold any number of items.  We only need to know 
    // the count.  Realized blocks have a fixed-sized array (BlockSize) so
    // they hold up to that many items and their corresponding containers.  When 
    // a realized block fills up, it inserts a new (empty) realized block into 
    // the list and carries on.
    // 
    // This data structure was chosen with virtualization in mind.  The typical
    // state is a long block of unrealized items (the ones that have scrolled
    // off the top), followed by a moderate number (<50?) of realized items
    // (the ones in view), followed by another long block of unrealized items 
    // (the ones that have not yet scrolled into view).  So the list will contain
    // an unrealized block, followed by 3 or 4 realized blocks, followed by 
    // another unrealized block.  Fewer than 10 blocks altogether, so linear 
    // searching won't cost that much.  Thus we don't need a more sophisticated
    // data structure.  (If profiling reveals that we do, we can always replace 
    // this one.  It's totally private to the ItemContainerGenerator and its
    // Generators.)

    // represents a block of items 
    
//    private class 1
    var ItemBlock = declare("ItemBlock", Object, {
    	constructor:function(){
            this._count= 0; 
            this._prev=null;
            this._next = null; 
    	},
    	
//        public void 
        InsertAfter:function(/*ItemBlock*/ prev)
        { 
            this.Next = prev.Next;
            this.Prev = prev;

            this.Prev.Next = this; 
            this.Next.Prev = this;
        }, 

//        public void 
        InsertBefore:function(/*ItemBlock*/ next)
        { 
            this.InsertAfter(next.Prev);
        },

//        public void 
        Remove:function() 
        {
        	this.Prev.Next = this.Next; 
        	this.Next.Prev = this.Prev; 
        },

////        public void 
//        MoveForward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem)
//        {
//        	
//            if (this.IsMoveAllowed(allowMovePastRealizedItem))
//            { 
//            	state.ItemIndex += 1;
//                if (++state.Offset >= this.ItemCount) 
//                { 
//                	state.Block = this.Next;
//                	state.Offset = 0; 
//                	state.Count += this.ItemCount;
//                }
//            }
//        }, 
////      public int 
//        MoveForward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem, /*int*/ count)
//        {
//            if (this.IsMoveAllowed(allowMovePastRealizedItem)) 
//            {
//                if (count < this.ItemCount - state.Offset) 
//                { 
//                	state.Offset += count;
//                } 
//                else
//                {
//                    count = this.ItemCount - state.Offset;
//                    state.Block = this.Next; 
//                    state.Offset = 0;
//                    state.Count += this.ItemCount; 
//                } 
//
//                state.ItemIndex += count; 
//            }
//
//            return count;
//        }, 
        
//      public int 
        MoveForward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem, /*int*/ count)
        {
        	if(arguments.length === 3){
                if (this.IsMoveAllowed(allowMovePastRealizedItem)) 
                {
                    if (count < this.ItemCount - state.Offset) 
                    { 
                    	state.Offset += count;
                    } 
                    else
                    {
                        count = this.ItemCount - state.Offset;
                        state.Block = this.Next; 
                        state.Offset = 0;
                        state.Count += this.ItemCount; 
                    } 

                    state.ItemIndex += count; 
                }

                return count;
        	}else if(arguments.length === 2){
                if (this.IsMoveAllowed(allowMovePastRealizedItem))
                { 
                	state.ItemIndex += 1;
                    if (++state.Offset >= this.ItemCount) 
                    { 
                    	state.Block = this.Next;
                    	state.Offset = 0; 
                    	state.Count += this.ItemCount;
                    }
                }
        	}
        }, 

////        public void 
//        MoveBackward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem) 
//        { 
//            if (this.IsMoveAllowed(allowMovePastRealizedItem))
//            { 
//                if (--state.Offset < 0)
//                {
//                	state.Block = Prev;
//                	state.Offset = state.Block.ItemCount - 1; 
//                	state.Count -= state.Block.ItemCount;
//                } 
//                state.ItemIndex -= 1; 
//            }
//        }, 
//
////        public int 
//        MoveBackward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem, /*int*/ count) 
//        { 
//            if (this.IsMoveAllowed(allowMovePastRealizedItem))
//            { 
//                if (count <= state.Offset)
//                {
//                	state.Offset -= count;
//                } 
//                else
//                { 
//                    count = state.Offset + 1; 
//                    state.Block = Prev;
//                    state.Offset = state.Block.ItemCount - 1; 
//                    state.Count -= state.Block.ItemCount;
//                }
//
//                state.ItemIndex -= count; 
//            }
//
//            return count; 
//        },
        
//        public int 
        MoveBackward:function(/*ref GeneratorState*/ state, /*bool*/ allowMovePastRealizedItem, /*int*/ count) 
        { 
        	if(arguments.length === 3){
                if (this.IsMoveAllowed(allowMovePastRealizedItem))
                { 
                    if (count <= state.Offset)
                    {
                    	state.Offset -= count;
                    } 
                    else
                    { 
                        count = state.Offset + 1; 
                        state.Block = this.Prev;
                        state.Offset = state.Block.ItemCount - 1; 
                        state.Count -= state.Block.ItemCount;
                    }

                    state.ItemIndex -= count; 
                }

                return count; 	
        	}else if(arguments.length === 2){
                if (this.IsMoveAllowed(allowMovePastRealizedItem))
                { 
                    if (--state.Offset < 0)
                    {
                    	state.Block = this.Prev;
                    	state.Offset = state.Block.ItemCount - 1; 
                    	state.Count -= state.Block.ItemCount;
                    } 
                    state.ItemIndex -= 1; 
                }       		
        	}
        },

//        protected virtual bool 
        IsMoveAllowed:function(/*bool*/ allowMovePastRealizedItem)
        {
            return allowMovePastRealizedItem;
        },
        

//        public virtual DependencyObject 
        ContainerAt:function(/*int*/ index) { return null; },
//        public virtual object 
        ItemAt:function(/*int*/ index) { return null; }
    });
    
    Object.defineProperties(ItemBlock.prototype, {
//        public int 
        ItemCount: { get:function() { return this._count; }, set:function(value) { this._count = value; } }, 
//        public ItemBlock 
        Prev: { get:function() { return this._prev; }, set:function(value) { this._prev = value; } },
//        public ItemBlock 
        Next: { get:function() { return this._next; }, set:function(value) { this._next = value; } },
        
//        public virtual int 
        ContainerCount: { get:function() { return Number.MAX_INT; } } 
    });
    
    ItemBlock.Type = new Type("ItemBlock", ItemBlock, [Object.Type]);
    
//  public const int 
    ItemBlock.BlockSize = 16; 

    // represents a block of unrealized (ungenerated) items
//    private class 
    var UnrealizedItemBlock =declare("UnrealizedItemBlock", ItemBlock, {
//        protected override bool 
        IsMoveAllowed:function(/*bool*/ allowMovePastRealizedItem) 
        { 
            return true;
        } 
    });
    
    Object.defineProperties(UnrealizedItemBlock.prototype, {
//        public override int 
        ContainerCount: { get:function() { return 0; } } 
    });
    
    UnrealizedItemBlock.Type = new Type("UnrealizedItemBlock", UnrealizedItemBlock, [ItemBlock.Type]);

    // represents a block of realized (generated) items
//    private class 
    var RealizedItemBlock =declare("RealizedItemBlock", ItemBlock, {
    	constructor:function(){

//            BlockEntry[] 
            this._entry = []; //new BlockEntry[BlockSize]; 
            for(var i = 0; i<ItemBlock.BlockSize; i++){
            	this._entry[i] = new BlockEntry();
            }
    	},
//    	public override DependencyObject 
    	ContainerAt:function(/*int*/ index)
        { 
            return this._entry[index].Container;
        },

//        public override object 
        ItemAt:function(/*int*/ index) 
        {
            return this._entry[index].Item; 
        }, 

//        public void 
        CopyEntries:function(/*RealizedItemBlock*/ src, /*int*/ offset, /*int*/ count, /*int*/ newOffset) 
        {
            /*int*/var k;
            // choose which direction to copy so as not to clobber existing
            // entries (in case the source and destination blocks are the same) 
            if (offset < newOffset)
            { 
                // copy right-to-left 
                for (k = count - 1;  k >= 0;  --k)
                { 
                    this._entry[newOffset + k] = src._entry[offset + k];
                }

                // clear vacated entries, to avoid leak 
                if (src != this)
                { 
                    src.ClearEntries(offset, count); 
                }
                else 
                {
                    src.ClearEntries(offset, newOffset - offset);
                }
            } 
            else
            { 
                // copy left-to-right 
                for (k = 0;  k < count;  ++k)
                { 
                	this._entry[newOffset + k] = src._entry[offset + k];
                }

                // clear vacated entries, to avoid leak 
                if (src != this)
                { 
                    src.ClearEntries(offset, count); 
                }
                else 
                {
                    src.ClearEntries(newOffset + count, offset - newOffset);
                }
            } 
        },
        
//        public void 
        ClearEntries:function(/*int*/ offset, /*int*/ count) 
        {
            for (var i=0; i<count; ++i) 
            {
            	this._entry[offset + i].Item = null;
            	this._entry[offset + i].Container = null;
            } 
        },

//        public void 
        RealizeItem:function(/*int*/ index, /*object*/ item, /*DependencyObject*/ container) 
        {
        	this._entry[index].Item = item; 
        	this._entry[index].Container = container;
        },

//        public int 
        OffsetOfItem:function(/*object*/ item) 
        {
            for (var k=0; k < this.ItemCount; ++k) 
            { 
                if (Object.Equals(this._entry[k].Item, item))
                    return k; 
            }

            return -1;
        }    
    });
    
    Object.defineProperties(RealizedItemBlock.prototype, {
//        public override int 
    	ContainerCount: { get:function() { return this.ItemCount; } } 
    });
    
    RealizedItemBlock.Type = new Type("RealizedItemBlock", RealizedItemBlock, [ItemBlock.Type]);

    // an entry in the table maintained by RealizedItemBlock 
//    private struct 
    var BlockEntry = declare("BlockEntry", null, {
    	constructor:function(){
//            private object      
            this._item = null; 
//            private DependencyObject   
            this._container = null; 
    	}
    });
    
    Object.defineProperties(BlockEntry.prototype, {
//        public object 
        Item:
        { 
        	get:function() { return this._item; },
    		set:function(value) { this._item = value; } 
        },
//        public DependencyObject 
        Container:
        { 
        	get:function() { return this._container; },
        	set:function(value) { this._container = value; } 
        } 
    });



    // The EmptyGroupItem class is used for the HidesIfEmpty grouping feature.
    // It takes the place of a regular GroupItem for an empty group, but is never 
    // returned to layout/panel as a real container.
//    private class 
    var EmptyGroupItem = declare("EmptyGroupItem", GroupItem, {
//        public void 
        SetGenerator:function(/*ItemContainerGenerator*/ generator) 
        {
            this.Generator = generator; 
            generator.ItemsChanged.Combine(new ItemsChangedEventHandler(this, this.OnItemsChanged)); 
        },

//        private void 
        OnItemsChanged:function(/*object*/ sender, /*ItemsChangedEventArgs*/ e)
        {
            /*CollectionViewGroup*/var group = GetValue(ItemContainerGenerator.ItemForItemContainerProperty);

            // if the group becomes non-empty, un-hide the UI
            if (group.ItemCount > 0) 
            { 
                /*ItemContainerGenerator*/var generator = this.Generator;
                generator.ItemsChanged.Remove(new ItemsChangedEventHandler(this, this.OnItemsChanged)); 
                generator.Parent.OnSubgroupBecameNonEmpty(this, group);
            }
        }
    });
	
	var ItemContainerGenerator = declare("ItemContainerGenerator", [IRecyclingItemContainerGenerator, IWeakEventListener],{
		constructor:function(){
			
//	        private Generator       _generator; 
//	        private ItemBlock       _itemMap;
//	        private GeneratorStatus 
			this._status = GeneratorStatus.NotStarted;
//	        private IList           _items;
//	        private ReadOnlyCollection<object> _itemsReadOnly; 
//	        private GroupStyle      _groupStyle;
//	        private ArrayList       _emptyGroupItems;
//	        private Type            _containerType;     // type of containers on the recycle queue 
//	        private int             
	        this._itemsGenerated = 0; 
//	        private int             
	        this._startIndexForUIFromItem = 0;
	  
//	        private int             
	        this._alternationCount = 0; 
//	        private Queue<DependencyObject> 
	        this._recyclableContainers = new Queue(); 
//	        private bool            
	        this._generatesGroupItems = false; // Flag to indicate that this generates GroupItems 
//	        private bool            
	        this._isGeneratingBatches = false;
	        
			var parent= null, host= null, peer= null, level= null;
	        if(arguments.length==1){
	        	parent = null;
	        	host = arguments[0];
	        	peer = host instanceof DependencyObject ? host : null;
	        	level = 0;
	        	
//	            CollectionChangedEventManager.AddHandler(host.View, OnCollectionChanged); 
	            host.View.CollectionChanged.Combine(new Delegate(this, this.OnCollectionChanged));
	        }else if(arguments.length==2){
	        	parent = arguments[0];
	        	host = parent.Host;
	        	peer = arguments[1];
	        	level = parent.Level + 1;
	        	
	        }else if(arguments.length==4){
	        	parent = arguments[0]; //parent;
	        	host = arguments[1]; 
	        	peer = arguments[2]; 
	        	level = arguments[3];
	        }
	        
	        this.initialized(parent, host, peer, level);

		},
		
//        private ItemContainerGenerator
        initialized:function(/*ItemContainerGenerator*/ parent, /*IGeneratorHost*/ host, /*DependencyObject*/ peer, /*int*/ level)
        { 
            this._parent = parent;
            this._host = host; 
            this._peer = peer; 
            this._level = level;
            this.OnRefresh(); 
        },
		
        //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647 
//        private void 
        SetStatus:function(/*GeneratorStatus*/ value) 
        {
            if (value != this._status) 
            {
            	this._status = value;

                switch (this._status) 
                {
                    case GeneratorStatus.GeneratingContainers: 
                    {
                        this._itemsGenerated = Number.MIN_INT; 
                        break; 
                    }

                    case GeneratorStatus.ContainersGenerated:
                    {
                        /*string*/var label = null;
                        if (this._itemsGenerated >= 0)   // this implies that tracing is enabled 
                        {
                            /*DependencyObject*/var d = this.Host instanceof DependencyObject ? this.Host : null; 
                            if (d != null) 
                                label = d.GetValue(FrameworkElement.NameProperty);
                            if (label == null || label.length == 0) 
                                label = this.Host.GetHashCode().toString(10/*CultureInfo.InvariantCulture*/);
                        } 
                        break; 
                    }
                } 

                if (this.StatusChanged != null) 
                    this.StatusChanged.Invoke(this, EventArgs.Empty);
            }
        },

        /// <summary>
        /// Return the ItemContainerGenerator appropriate for use by the given panel 
        /// </summary>
//        ItemContainerGenerator IItemContainerGenerator.
        GetItemContainerGeneratorForPanel:function(/*Panel*/ panel)
        {
            if (!panel.IsItemsHost) 
                throw new ArgumentException(SR.Get(SRID.PanelIsNotItemsHost), "panel");
 
            // if panel came from an ItemsPresenter, use its generator 
            /*ItemsPresenter*/var ip = ItemsPresenter.FromPanel(panel);
            if (ip != null) 
                return ip.Generator;

            // if panel came from a style, use the main generator
            if (panel.TemplatedParent != null) 
                return this;
 
            // otherwise the panel doesn't have a generator 
            return null;
        },

        /// <summary> Begin generating at the given position and direction </summary>
        /// <remarks>
        /// This method must be called before calling GenerateNext.  It returns an 
        /// IDisposable object that tracks the lifetime of the generation loop.
        /// This method sets the generator's status to GeneratingContent;  when 
        /// the IDisposable is disposed, the status changes to ContentReady or 
        /// Error, as appropriate.
        /// </remarks> 
////        IDisposable IItemContainerGenerator.
//        StartAt:function(/*GeneratorPosition*/ position, /*GeneratorDirection*/ direction)
//        {
//            return /*((IItemContainerGenerator)this)*/this.StartAt(position, direction, false);
//        } 

        /// <summary> Begin generating at the given position and direction </summary> 
        /// <remarks> 
        /// This method must be called before calling GenerateNext.  It returns an
        /// IDisposable object that tracks the lifetime of the generation loop. 
        /// This method sets the generator's status to GeneratingContent;  when
        /// the IDisposable is disposed, the status changes to ContentReady or
        /// Error, as appropriate.
        /// </remarks> 
//        IDisposable IItemContainerGenerator.
        StartAt:function(/*GeneratorPosition*/ position, /*GeneratorDirection*/ direction, /*bool*/ allowStartAtRealizedItem)
        { 
        	if(allowStartAtRealizedItem === undefined){
        		allowStartAtRealizedItem = false;
        	}
            if (this._generator != null) 
                throw new InvalidOperationException(SR.Get(SRID.GenerationInProgress));
 
            this._generator = new Generator(this, position, direction, allowStartAtRealizedItem);
            return this._generator;
        },
 
//        public IDisposable 
        GenerateBatches:function()
        { 
            if (this._isGeneratingBatches) 
                throw new InvalidOperationException(SR.Get(SRID.GenerationInProgress));
 
            return new BatchGenerator(this);
        },

////        DependencyObject IItemContainerGenerator.
//        GenerateNext:function() 
//        {
//            var isNewlyRealized; 
//            if (this._generator == null) 
//                throw new InvalidOperationException(SR.Get(SRID.GenerationNotInProgress));
//            
//            return this._generator.GenerateNext(true, /*out isNewlyRealized*/{"isNewlyRealized" : isNewlyRealized});
//        },

//        DependencyObject IItemContainerGenerator.
        GenerateNext:function(/*out bool isNewlyRealized*/isNewlyRealizedOut) 
        {
            if (this._generator == null) 
                throw new InvalidOperationException(SR.Get(SRID.GenerationNotInProgress)); 
            
        	if(isNewlyRealizedOut === undefined){
        		isNewlyRealizedOut = {"isNewlyRealized" : false};
        		return this._generator.GenerateNext(true, /*out isNewlyRealized*/isNewlyRealizedOut);
        	}else {
                return this._generator.GenerateNext(false, /*out isNewlyRealized*/isNewlyRealizedOut); 
        	}
        },

        /// <summary>
        /// Prepare the given element to act as the container for the 
        /// corresponding item.  This includes applying the container style,
        /// forwarding information from the host control (ItemTemplate, etc.), 
        /// and other small adjustments. 
        /// </summary>
        /// <remarks> 
        /// This method must be called after the element has been added to the
        /// visual tree, so that resource references and inherited properties
        /// work correctly.
        /// </remarks> 
        /// <param name="container"> The container to prepare.
        /// Normally this is the result of the previous call to GenerateNext. 
        /// </param> 
//        void IItemContainerGenerator.
        PrepareItemContainer:function(/*DependencyObject*/ container)
        { 
            /*object*/var item = container.ReadLocalValue(ItemContainerGenerator.ItemForItemContainerProperty);
            this.Host.PrepareItemContainer(container, item);
        },
 
//        /// <summary>
//        /// Remove generated elements. 
//        /// </summary> 
//        void IItemContainerGenerator.Remove(GeneratorPosition position, int count)
//        { 
//            Remove(position, count, /*isRecycling = */ false);
//        }
        /// <summary> 
        /// Remove generated elements.
        /// </summary> 
//        private void 
        Remove:function(/*GeneratorPosition*/ position, /*int*/ count, /*bool*/ isRecycling) 
        {
        	if(isRecycling === undefined){
        		isRecycling = false;
        	}
        	
            if (position.Offset != 0) 
                throw new ArgumentException(SR.Get(SRID.RemoveRequiresOffsetZero, position.Index, position.Offset), "position");
            if (count <= 0)
                throw new ArgumentException(SR.Get(SRID.RemoveRequiresPositiveCount, count), "count");
 
            var index = position.Index;
            /*ItemBlock*/var block; 
 
            // find the leftmost item to remove
            var offsetL = index; 
            for (block = this._itemMap.Next;  block != this._itemMap;  block = block.Next)
            {
                if (offsetL < block.ContainerCount)
                    break; 

                offsetL -= block.ContainerCount; 
            } 
            /*RealizedItemBlock*/var blockL = block instanceof RealizedItemBlock ? block : null;
            
            // find the rightmost item to remove
            var offsetR = offsetL + count - 1;
            for (; block != this._itemMap;  block = block.Next)
            { 
                if (!(block instanceof RealizedItemBlock))
                    throw new InvalidOperationException(SR.Get(SRID.CannotRemoveUnrealizedItems, index, count)); 
 
                if (offsetR < block.ContainerCount)
                    break; 

                offsetR -= block.ContainerCount;
            }
            /*RealizedItemBlock*/var blockR = block instanceof RealizedItemBlock ? block : null; 

            // de-initialize the containers that are being removed 
            /*RealizedItemBlock*/var rblock = blockL; 
            var offset = offsetL;
            while (rblock != blockR || offset <= offsetR) 
            {
                /*DependencyObject*/var container = rblock.ContainerAt(offset);

                ItemContainerGenerator.UnlinkContainerFromItem(container, rblock.ItemAt(offset)); 
                // DataGrid generates non-GroupItem for NewItemPlaceHolder
                // Dont recycle in this case. 
                /*bool*/var isNewItemPlaceHolderWhenGrouping = this._generatesGroupItems && !(container instanceof GroupItem); 

                if (isRecycling && !isNewItemPlaceHolderWhenGrouping) 
                {
//                    Debug.Assert(!_recyclableContainers.Contains(container), "trying to add a container to the collection twice");

                    if (this._containerType == null) 
                    {
                    	this._containerType = container.GetType(); 
                    } 
                    else if (this._containerType != container.GetType())
                    { 
                        throw new InvalidOperationException(SR.Get(SRID.CannotRecyleHeterogeneousTypes));
                    }

                    this._recyclableContainers.Enqueue(container); 
                }
 
                if (++offset >= rblock.ContainerCount && rblock != blockR) 
                {
                    rblock = rblock.Next instanceof RealizedItemBlock ? rblock.Next : null; 
                    offset = 0;
                }
            }
            
            // see whether the range hits the edge of a block on either side,
            // and whether the a`butting block is an unrealized gap 
            var edgeL = (offsetL == 0); 
            var edgeR = (offsetR == blockR.ItemCount-1);
            var abutL = edgeL && (blockL.Prev instanceof UnrealizedItemBlock); 
            var abutR = edgeR && (blockR.Next instanceof UnrealizedItemBlock);

            // determine the target (unrealized) block,
            // the offset within the target at which to insert items, 
            // and the intial change in cumulative item count
            /*UnrealizedItemBlock*/var blockT; 
            /*ItemBlock*/var predecessor = null; 
            var offsetT;
            var deltaCount; 
            
            if (abutL)
            {
                blockT = /*(UnrealizedItemBlock)*/blockL.Prev; 
                offsetT = blockT.ItemCount;
                deltaCount = -blockT.ItemCount; 
            } 
            else if (abutR)
            { 
                blockT = /*(UnrealizedItemBlock)*/blockR.Next;
                offsetT = 0;
                deltaCount = offsetL;
            } 
            else
            { 
                blockT = new UnrealizedItemBlock(); 
                offsetT = 0;
                deltaCount = offsetL; 

                // remember where the new block goes, so we can insert it later
                predecessor = (edgeL) ? blockL.Prev : blockL;
            } 
            
            // move items within the range to the target block 
            for (block = blockL;  block != blockR;  block = block.Next) 
            {
                var itemCount = block.ItemCount; 
                this.MoveItems(block, offsetL, itemCount-offsetL,
                            blockT, offsetT, deltaCount);
                offsetT += itemCount-offsetL;
                offsetL = 0; 
                deltaCount -= itemCount;
                if (block.ItemCount == 0) 
                    block.Remove(); 
            }
 
            // the last block in the range is a little special...
            // Move the last unrealized piece.
            var remaining = block.ItemCount - 1 - offsetR;
            this.MoveItems(block, offsetL, offsetR - offsetL + 1, 
                        blockT, offsetT, deltaCount);
 
            // Move the remaining realized items 
            /*RealizedItemBlock*/var blockX = blockR;
            if (!edgeR) 
            {
                if (blockL == blockR && !edgeL)
                {
                    blockX = new RealizedItemBlock(); 
                }
 
                this.MoveItems(block, offsetR+1, remaining, 
                            blockX, 0, offsetR+1);
            } 

            // if we created any new blocks, insert them in the list
            if (predecessor != null)
                blockT.InsertAfter(predecessor); 
            if (blockX != blockR)
                blockX.InsertAfter(blockT); 
 
            this.RemoveAndCoalesceBlocksIfNeeded(block);
 
        },
        
        /// <summary>
        /// Remove all generated elements. 
        /// </summary>
//        void IItemContainerGenerator.
        RemoveAll:function() 
        { 
            this.RemoveAllInternal(false /*saveRecycleQueue*/);
        },

//        internal void 
        RemoveAllInternal:function(/*bool*/ saveRecycleQueue)
        {
            // Take _itemMap offline, to protect against reentrancy (bug 1285179) 
            /*ItemBlock*/var itemMap = this._itemMap;
            this._itemMap = null; 
 
            try
            { 
                // de-initialize the containers that are being removed
                if (itemMap != null)
                {
                    for (/*ItemBlock*/var block = itemMap.Next;  block != itemMap;  block = block.Next) 
                    {
                        /*RealizedItemBlock*/var rib = block instanceof RealizedItemBlock ? block : null; 
                        if (rib != null) 
                        {
                            for (var offset = 0; offset < rib.ContainerCount; ++offset) 
                            {
                            	ItemContainerGenerator.UnlinkContainerFromItem(rib.ContainerAt(offset), rib.ItemAt(offset));
                            }
                        } 
                    }
                } 
            } 
            finally
            { 
                this.PrepareGrouping();

                // re-initialize the data structure
                this._itemMap = new ItemBlock(); 
                this._itemMap.Prev = this._itemMap.Next = this._itemMap;
 
                /*UnrealizedItemBlock*/var uib = new UnrealizedItemBlock(); 
                uib.InsertAfter(this._itemMap);
                uib.ItemCount = this.ItemsInternal.Count; 

                if (!saveRecycleQueue)
                {
                	this.ResetRecyclableContainers(); 
                }
 
                this.SetAlternationCount(); 

                // tell generators what happened 
                if (this.MapChanged != null)
                {
                	this.MapChanged.Invoke(null, -1, 0, uib, 0, 0);
                } 
            }
        }, 
 
//        private void 
        ResetRecyclableContainers:function()
        { 
        	this._recyclableContainers = new Queue/*<DependencyObject>*/();
        	this._containerType = null;
        	this._generatesGroupItems = false;
        }, 

//        void IRecyclingItemContainerGenerator.
        Recycle:function(/*GeneratorPosition*/ position, /*int*/ count) 
        { 
            this.Remove(position, count, /*isRecyling = */ true);
        },

        /// <summary>
        /// Map an index into the items collection to a GeneratorPosition.
        /// </summary> 
//        GeneratorPosition IItemContainerGenerator.
        GeneratorPositionFromIndex:function(/*int*/ itemIndex)
        { 
            /*GeneratorPosition*/var position; 
            /*ItemBlock*/var itemBlock;
            var offsetFromBlockStart; 

            var positionOut = {
            	"position" : position	
            };
            
            var itemBlockOut = {
            	"itemBlock" : itemBlock	
            };
            
            var offsetFromBlockStartOut = {
            	"offsetFromBlockStart" : offsetFromBlockStart	
            };
            
            this.GetBlockAndPosition(itemIndex, /*out position*/positionOut, 
            		/*out itemBlock*/itemBlockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut);
            position = positionOut.position;
            itemBlock = itemBlockOut.itemBlock;
            offsetFromBlockStart = offsetFromBlockStartOut.offsetFromBlockStart;
            
            if (itemBlock == this._itemMap && position.Index == -1) 
                ++position.Offset;
 
            return position; 
        },
 
        /// <summary>
        /// Map a GeneratorPosition to an index into the items collection.
        /// </summary>
//        int IItemContainerGenerator.
        IndexFromGeneratorPosition:function(/*GeneratorPosition*/ position) 
        {
            var index = position.Index; 
 
            if (index == -1)
            { 
                // offset is relative to the fictitious boundary item
                if (position.Offset >= 0)
                {
                    return position.Offset - 1; 
                }
                else 
                { 
                    return this.ItemsInternal.Count + position.Offset;
                } 
            }

            if (this._itemMap != null)
            { 
                var itemIndex = 0;      // number of items we've skipped over
 
                // locate container at the given index 
                for (/*ItemBlock*/var block = this._itemMap.Next;  block != this._itemMap;  block = block.Next)
                { 
                    if (index < block.ContainerCount)
                    {
                        // container is within this block.  return the answer
                        return itemIndex + index + position.Offset; 
                    }
                    else 
                    { 
                        // skip over this block
                        itemIndex += block.ItemCount; 
                        index -= block.ContainerCount;
                    }
                }
            } 

            return -1; 
        }, 
        
        /// <summary>
        /// Return the item corresponding to the given UI element.
        /// If the element was not generated as a container for this generator's 
        /// host, the method returns DependencyProperty.UnsetValue.
        /// </summary> 
//        public object 
        ItemFromContainer:function(/*DependencyObject*/ container) 
        {
            if (container == null) 
                throw new ArgumentNullException("container");

            /*object*/var item = container.ReadLocalValue(ItemContainerGenerator.ItemForItemContainerProperty);
 
            if (item != DependencyProperty.UnsetValue)
            { 
                // verify that the element really belongs to the host 
                if (!this.Host.IsHostForItemContainer(container))
                    item = DependencyProperty.UnsetValue; 
            }

            return item;
        },

        /// <summary> 
        /// Return the UI element corresponding to the given item. 
        /// Returns null if the item does not belong to the item collection,
        /// or if no UI has been generated for it. 
        /// </summary>
//        public DependencyObject 
        ContainerFromItem:function(/*object*/ item)
        {
            /*object*/var dummy; 
            /*DependencyObject*/var container;
            /*int*/var index; 
            
            var dummyOut = {
            	"item" : dummy
            };
            
            var containerOut = {
            	"container":container	
            };
            
            var indexOut = {
            	"itemIndex":index	
            };
            this.DoLinearSearch(
                /*delegate*/function(/*object*/ o, /*DependencyObject*/ d) { return Object.Equals(o, item); }, 
                /*out dummy*/dummyOut, /*out container*/containerOut, /*out index*/indexOut, false);
            container = containerOut.container;
            
            return container;
        }, 

        /// <summary> 
        /// Given a generated UI element, return the index of the corresponding item 
        /// within the ItemCollection.
        /// </summary> 
//        public int 
//        IndexFromContainer:function(/*DependencyObject*/ container)
//        {
//            return this.IndexFromContainer(container, false);
//        }, 

        /// <summary> 
        /// Given a generated UI element, return the index of the corresponding item 
        /// within the ItemCollection.
        /// </summary> 
//        public int 
        IndexFromContainer:function(/*DependencyObject*/ container, /*bool*/ returnLocalIndex)
        {
        	if(returnLocalIndex === undefined){
        		returnLocalIndex = false;
        	}
        	
            if (container == null)
            { 
                throw new ArgumentNullException("container");
            } 
 
            var index;
            /*object*/var item; 
            /*DependencyObject*/var dummy;

            var indexOut = {"itemIndex" : index};
            this.DoLinearSearch(
                /*delegate*/function(/*object*/ o, /*DependencyObject*/ d) { return (d == container); }, 
                /*out item*/{"item" : item}, /*out dummy*/{"container" : dummy}, /*out index*/indexOut, returnLocalIndex);
            index = indexOut.itemIndex;
 
            return index; 
        },
 
        // expose DoLinearSearch to internal code
//        internal bool 
        FindItem:function(/*Func<object, DependencyObject, bool>*/ match,
                /*out DependencyObject container*/containerOut, /*out int itemIndex*/itemIndexOut)
        { 
            /*object*/var item;
            return this.DoLinearSearch(match, /*out item*/{"item" : item}, /*out container*/containerOut, /*out itemIndex*/itemIndexOut, false); 
        }, 

        /// <summary> 
        ///     Performs a linear search for an (item, container) pair that
        ///     matches a given predicate.
        /// </summary>
        /// <remarks> 
        ///     There's no avoiding a linear search, which leads to O(n^2) performance
        ///     if someone calls ContainerFromItem or IndexFromContainer for every item. 
        ///     To mitigate this, we start each search at _startIndexForUIFromItem, and 
        ///     heuristically set this in various places to where we expect the next
        ///     call to occur. 
        ///
        ///     For example, after a successul search, we set it to the resulting
        ///     index, hoping that the next call will query either the same item or
        ///     the one after it.  And after inserting a new item, we expect a query 
        ///     about the new item.  Etc.
        /// 
        ///     Saving this as an index instead of a (block, offset) pair, makes it 
        ///     more robust during insertions/deletions.  If the index ends up being
        ///     wrong, the worst that happens is a full search (as opposed to following 
        ///     a reference to a block that's no longer in use).
        ///
        ///     To re-use the search code for two methods, please read the description
        ///     of the parameters. 
        /// </remarks>
        /// <param name="match"> 
        ///     The predicate with which to test each (item, container). 
        /// </param>
        /// <param name="returnLocalIndex"> 
        ///     If true, only search at the current level and return an index
        ///         in local coordinates (w.r.t. the current level).
        ///     If false, search subgroups, and return an index in global coordinates.
        /// </param> 
        /// <param name="item">
        ///     The matching item, or null 
        /// </param> 
        /// <param name="container">
        ///     The matching container, or null 
        /// </param>
        /// <param name="itemIndex">
        ///     The index of the matching pair, or -1
        /// </param> 
        /// <returns>
        ///     true if found, false otherwise. 
        /// </returns> 
//        private bool 
        DoLinearSearch:function(/*Func<object, DependencyObject, bool>*/ match,
                /*out object item*/itemOut, /*out DependencyObject container*/containerOut, /*out int itemIndex*/itemIndexOut, 
                /*bool*/ returnLocalIndex)
        {
        	itemOut.item = null;
            containerOut.container = null; 
            itemIndexOut.itemIndex = 0;
 
            if (this._itemMap == null) 
            {
                // _itemMap can be null if we re-enter the generator.  Scenario:  user calls RemoveAll(), we Unlink every container, fire 
                // ClearContainerForItem for each, and someone overriding ClearContainerForItem decides to look up the container.
//                goto NotFound;
            	itemIndexOut.itemIndex = -1; 
                itemOut.item = null;
                containerOut.container = null;
                return false;
            }
 
            // Move to the starting point of the search
            /*ItemBlock*/var startBlock = this._itemMap.Next; 
            var index = 0;      // index of first item in current block 
            /*RealizedItemBlock*/var rib;
            var startOffset; 

            while (index <= this._startIndexForUIFromItem && startBlock != this._itemMap)
            {
                index += startBlock.ItemCount; 
                startBlock = startBlock.Next;
            } 
            startBlock = startBlock.Prev; 
            index -= startBlock.ItemCount;
            rib = startBlock instanceof RealizedItemBlock ? startBlock : null; 

            if (rib != null)
            {
                startOffset = this._startIndexForUIFromItem - index; 
                if (startOffset >= rib.ItemCount)
                { 
                    // we can get here if items get removed since the last 
                    // time we saved _startIndexForUIFromItem - so the
                    // saved offset is no longer meaningful.  To make the 
                    // search work, we need to make sure the first loop
                    // does at least one iteration.  Setting startOffset to 0
                    // does exactly that.
                    startOffset = 0; 
                }
            } 
            else 
            {
                startOffset = 0; 
            }
            
            // search for the desired item, wrapping around the end
            /*ItemBlock*/var block = startBlock; 
            var offset = startOffset;
            var endOffset = startBlock.ItemCount; 
            while (true) 
            {
                // search the current block (only need to search realized blocks) 
                if (rib != null)
                {
                    for (; offset < endOffset; ++offset)
                    { 
                        /*CollectionViewGroup*/var group;
                        var con = rib.ContainerAt(offset);
                        var found = match(rib.ItemAt(offset), con); 
//                        var found = match(rib.ItemAt(offset), rib.ContainerAt(offset)); 
 
                        if (found)
                        { 
                        	itemOut.item = rib.ItemAt(offset);
                        	containerOut.container = rib.ContainerAt(offset);
                        }
                        else if (!returnLocalIndex && this.IsGrouping 
                        		&& ((group = (rib.ItemAt(offset) instanceof CollectionViewGroup ? rib.ItemAt(offset) : null)) != null)) 
                        {
                            // found a group;  see if the group contains the item 
                            /*GroupItem*/var groupItem = rib.ContainerAt(offset); 
                            var indexInGroup;
                            var indexInGroupOut = {
                            	"itemIndex" : indexInGroup
                            };
                            found = groupItem.Generator.DoLinearSearch(match, /*out item*/itemOut, /*out container*/containerOut, 
                            		/*out indexInGroup*/indexInGroupOut, false); 
                            indexInGroup =indexInGroupOut.itemIndex;
                            if (found)
                            {
                            	itemIndexOut.itemIndex = indexInGroup;
                            } 
                        }
 
                        if (found) 
                        {
                            // found the item;  update state and return 
                        	this._startIndexForUIFromItem = index + offset;
                        	itemIndexOut.itemIndex += this.GetRealizedItemBlockCount(rib, offset, returnLocalIndex) + this.GetCount(block, returnLocalIndex);
                            return true;
                        } 
                    }
 
                    // check for termination 
                    if (block == startBlock && offset == startOffset)
                    { 
                        break;  // not found
                    }
                }
 
                // advance to next block
                index += block.ItemCount; 
                offset = 0; 
                block = block.Next;
 
                // if we've reached the end, wrap around
                if (block == this._itemMap)
                {
                    block = block.Next; 
                    index = 0;
                } 
 
                // prepare to search the block
                endOffset = block.ItemCount; 
                rib = block instanceof RealizedItemBlock ? block : null;

                // check for termination
                if (block == startBlock) 
                {
                    if (rib != null) 
                    { 
                        endOffset = startOffset;    // search first part of block
                    } 
                    else
                    {
                        break;  // not found
                    } 
                }
            } 
 
        NotFound:
        	itemIndexOut.itemIndex = -1; 
            itemOut.item = null;
            containerOut.container = null;
            return false;
        },

//        private int GetCount() 
//        { 
//            return GetCount(_itemMap);
//        } 
//
//        private int GetCount(ItemBlock stop)
//        {
//            return GetCount(stop, false); 
//        }
 
//        private int 
        GetCount:function(/*ItemBlock*/ stop, /*bool*/ returnLocalIndex) 
        {
        	if(stop ===undefined){
        		stop = this._itemMap;
        	}
        	
        	if(returnLocalIndex === undefined){
        		returnLocalIndex = false;
        	}
        	
            var count = 0; 
            /*ItemBlock*/var start = this._itemMap;
            /*ItemBlock*/var block = start.Next;

            while (block != stop) 
            {
                count += block.ItemCount; 
                block = block.Next; 
            }
 
            if (!returnLocalIndex && this.IsGrouping)
            {
                var n = count;
                count = 0; 

                for (var i=0; i<n; ++i) 
                { 
                    /*CollectionViewGroup*/var group = this.Items.Get(i);
                    group = group instanceof CollectionViewGroup ? group : null;
                    count += (group == null) ? 1 : group.ItemCount; 
                }
            }

            return count; 
        },
 
//        private int 
        GetRealizedItemBlockCount:function(/*RealizedItemBlock*/ rib, /*int*/ end, /*bool*/ returnLocalIndex) 
        {
            if (!this.IsGrouping || returnLocalIndex) 
            {
                // when the UI is not grouping, each item counts as 1, even
                // groups (bug 1761421)
                return end; 
            }
 
            var count = 0; 

            for (var offset = 0; offset < end; ++offset) 
            {
                /*CollectionViewGroup*/var group = rib.ItemAt(offset);
                group = group instanceof CollectionViewGroup ? group : null;
                if (group != null)
                { 
                    // found a group, count the group
                    count += group.ItemCount; 
                } 
                else
                { 
                    count++;
                }
            }
 
            return count;
        },
 
        /// <summary>
        /// Return the UI element corresponding to the item at the given index 
        /// within the ItemCollection.
        /// </summary>
//        public DependencyObject 
        ContainerFromIndex:function(/*int*/ index)
        { 
            var subIndex = 0;
 
            // if we're grouping, determine the appropriate child
            if (this.IsGrouping)
            {
                var n; 
                subIndex = index;
                for (index=0, n=this.ItemsInternal.Count;  index < n;  ++index) 
                { 
                    /*CollectionViewGroup*/var group = this.ItemsInternal.Get(index);
                    group = group instanceof CollectionViewGroup ? group : null;
                    var size = (group == null) ? 1 : group.ItemCount; 

                    if (subIndex < size)
                        break;
                    else 
                        subIndex -= size;
                } 
            } 

            // search the table for the item 

            for (/*ItemBlock*/var block = this._itemMap.Next; block != this._itemMap; block = block.Next)
            {
                if (index < block.ItemCount) 
                {
                    /*DependencyObject*/var container = block.ContainerAt(index); 
                    /*GroupItem*/var groupItem = container instanceof GroupItem ? container : null; 

                    if (groupItem != null) 
                    {
                        container = groupItem.Generator.ContainerFromIndex(subIndex);
                    }
                    return container;
                }

                index -= block.ItemCount; 
            }
 
            return null;  // *not* throw new IndexOutOfRangeException(); - bug 890195 
        },
        
        // regenerate everything
//        internal void 
        Refresh:function()
        {
            this.OnRefresh(); 
        },
 
        // called when this generator is no longer needed 
//        internal void 
        Release:function()
        { 
            /*((IItemContainerGenerator)this)*/this.RemoveAll();
        },

        // called when GenerateNext returns null when the caller wasn't expecting null. 
        // This is a clue that the underlying collection or collection-view may
        // have raised the wrong CollectionChange events.  If there's evidence 
        // that this has happened, throw an exception. 
//        internal void 
        
        Verify:function()
        { 
            if (this._itemMap == null)
                return;

            /*List<string>*/var errors = new List/*<string>*/(); 

            // compute accumulated count = sum of block counts 
            var accumulatedCount = 0; 
            for (/*ItemBlock*/var block = this._itemMap.Next;  block != this._itemMap;  block = block.Next)
            { 
            	accumulatedCount += block.ItemCount;
            }

            // compare accumulated count to actual count 
            if (accumulatedCount != this._items.Count)
            { 
                errors.Add(SR.Get(SRID.Generator_CountIsWrong, accumulatedCount, _items.Count)); 
            }
 
            // compare items
            var badItems=0, reportedItems=0;
            var blockIndex=0;
            for (/*ItemBlock*/var block = this._itemMap.Next;  block != this._itemMap;  block = block.Next) 
            {
                /*RealizedItemBlock*/var rib = block instanceof RealizedItemBlock ? block : null; 
                if (rib != null) 
                {
                    for (var offset=0; offset<rib.ItemCount; ++offset) 
                    {
                        var index = blockIndex + offset;
                        /*object*/var genItem = rib.ItemAt(offset);
                        /*object*/var actualItem = (index < this._items.Count) ? this._items.Get(index) : null; 
                        if (!Object.Equals(genItem, actualItem))
                        { 
                            if (reportedItems < 3) 
                            {
                                errors.Add(SR.Get(SRID.Generator_ItemIsWrong, index, genItem, actualItem)); 
                                ++ reportedItems;
                            }
                            ++ badItems;
                        } 
                    }
                } 
                blockIndex += block.ItemCount; 
            }
 
            if (badItems > reportedItems)
            {
                errors.Add(SR.Get(SRID.Generator_MoreErrors, badItems - reportedItems));
            } 

            // if we found errors, throw an exception 
            if (errors.Count > 0) 
            {
                /*CultureInfo*/var enUS = System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS; 

                // get the identifying information for the ItemsControl
                /*DependencyObject*/var peer = this.Peer;
                /*string*/var name = peer.GetValue(FrameworkElement.NameProperty); 
                if (String.IsNullOrWhiteSpace(name))
                { 
                    name = SR.Get(SRID.Generator_Unnamed); 
                }
 
                // get the sources involved in CollectionChanged events
                /*List<string>*/var sources = new List/*<string>*/();
                this.GetCollectionChangedSources(0, FormatCollectionChangedSource, sources);
 
                // describe the details of the problem
                /*StringBuilder*/var sb = new StringBuilder(); 
                sb.AppendLine(SR.Get(SRID.Generator_Readme0));                          // Developer info: 
                sb.Append    (SR.Get(SRID.Generator_Readme1, peer, name));              // The exception is thrown because...
                sb.Append("  "); 
                sb.AppendLine(SR.Get(SRID.Generator_Readme2));                          // The following differences...
                for/*each*/ (/*string*/var s in errors)
                {
                    sb.AppendFormat(enUS, "  {0}", s); 
                    sb.AppendLine();
                } 
                sb.AppendLine(); 

                sb.AppendLine(SR.Get(SRID.Generator_Readme3));                          // The following sources... 
                for/*each*/ (var s in sources)
                {
                    sb.AppendFormat(enUS, "  {0}", s);
                    sb.AppendLine(); 
                }
                sb.AppendLine(SR.Get(SRID.Generator_Readme4));                          // Starred sources are considered more likely 
                sb.AppendLine(); 

                sb.AppendLine(SR.Get(SRID.Generator_Readme5));                          // The most common causes... 
                sb.AppendLine();

                sb.Append    (SR.Get(SRID.Generator_Readme6)); sb.Append("  ");         // Stack trace describes detection...
                sb.Append    (SR.Get(SRID.Generator_Readme7,                            // To get better detection... 
                                "PresentationTraceSources.TraceLevel", "High"));
                sb.Append    ("  "); 
                sb.AppendLine(SR.Get(SRID.Generator_Readme8,                            // One way to do this ... 
                                "System.Diagnostics.PresentationTraceSources.SetTraceLevel(myItemsControl.ItemContainerGenerator, System.Diagnostics.PresentationTraceLevel.High)"));
                sb.AppendLine(SR.Get(SRID.Generator_Readme9));                          // This slows down the app. 

                // use an inner exception to hold the details.  There's a lot of
                // information, but it's only interesting to a developer.
                /*Exception*/var exception = new Exception(sb.ToString()); 

                // throw the exception 
                throw new InvalidOperationException(SR.Get(SRID.Generator_Inconsistent), exception); 
            }
        },

//        void 
        FormatCollectionChangedSource:function(/*int*/ level, /*object*/ source, /*bool?*/ isLikely, /*List<string>*/ sources)
        {
            /*Type*/var sourceType = source.GetType(); 

            if (!isLikely.HasValue) 
            { 
                // if the type doesn't come from WPF or DevDiv (e.g. ObservableCollection<T>),
                // mark it as "more likely to be at fault".   I'm not saying we're always right, 
                // just that 3rd parties are more likely to be wrong than we are.
                isLikely = true;

                /*const string*/var PublicKeyToken = "PublicKeyToken="; 
                /*string*/var aqn = sourceType.AssemblyQualifiedName;
                var index = aqn.LastIndexOf(PublicKeyToken); 
                if (index >= 0) 
                {
                    /*string*/var token = aqn.Substring(index + PublicKeyToken.Length); 
                    if (String.Compare(token, MS.Internal.PresentationFramework.BuildInfo.WCP_PUBLIC_KEY_TOKEN, StringComparison.OrdinalIgnoreCase) == 0 ||
                        String.Compare(token, MS.Internal.PresentationFramework.BuildInfo.DEVDIV_PUBLIC_KEY_TOKEN, StringComparison.OrdinalIgnoreCase) == 0)
                    {
                        isLikely = false; 
                    }
                } 
            } 

            /*char*/var c = (isLikely == true) ? '*' : ' '; 
            var indent = new String(' ', level);
            sources.Add(String.Format(System.Windows.Markup.TypeConverterHelper.InvariantEnglishUS, "{0} {1} {2}",
                                        c, indent, sourceType.FullName));
        }, 

//        void 
        GetCollectionChangedSources:function(/*int*/ level, /*Action<int, object, bool?, List<string>>*/ format, /*List<string>*/ sources) 
        { 
            format(level, this, false, sources);
            Host.View.GetCollectionChangedSources(level+1, format, sources); 
        },

//        // called when the host's AlternationCount changes
////        internal void 
//        ChangeAlternationCount:function() 
//        {
//            // update my AlternationCount and adjust my containers 
//            this.SetAlternationCount(); 
//
//            // propagate to subgroups, if necessary 
//            if (this.IsGrouping && this.GroupStyle != null)
//            {
//                /*ItemBlock*/var block = this._itemMap.Next;
//                while (block != this._itemMap) 
//                {
//                    for (var offset = 0;  offset < block.ContainerCount;  ++offset) 
//                    { 
//                        /*GroupItem*/var gi = block.ContainerAt(offset);
//                        gi = gi instanceof GroupItem ? gi : null;
//                        if (gi != null) 
//                        {
//                            gi.Generator.ChangeAlternationCount();
//                        }
//                    } 
//
//                    block = block.Next; 
//                } 
//            }
//        },
//
//        // update AlternationIndex on each container to reflect the new AlternationCount
////        void 
//        ChangeAlternationCount:function(/*int*/ newAlternationCount)
//        { 
//            if (this._alternationCount == newAlternationCount)
//                return; 
// 
//            // find the first realized container (need this regardless of what happens)
//            /*ItemBlock*/var block = this._itemMap.Next; 
//            var offset = 0;
//            while (offset == block.ContainerCount)
//            {
//                block = block.Next; 
//            }
// 
//            // if there are no realized containers, there's nothing to do 
//            if (block != this._itemMap)
//            { 
//                // if user is requesting alternation, reset each container's AlternationIndex
//                if (newAlternationCount > 0)
//                {
//                	this._alternationCount = newAlternationCount; 
//                    this.SetAlternationIndex(block, offset, GeneratorDirection.Forward);
//                } 
//                // otherwise, clear each container's AlternationIndex 
//                else if (this._alternationCount > 0)
//                { 
//                    while (block != this._itemMap)
//                    {
//                        for (offset = 0;  offset < block.ContainerCount;  ++offset)
//                        { 
//                            ItemsControl.ClearAlternationIndex(block.ContainerAt(offset));
//                        } 
// 
//                        block = block.Next;
//                    } 
//                }
//            }
//
//            this._alternationCount = newAlternationCount; 
//        },
        
        // update AlternationIndex on each container to reflect the new AlternationCount
//      void 
      ChangeAlternationCount:function(/*int*/ newAlternationCount)
      { 
    	  if(arguments.length == 0){
    		// update my AlternationCount and adjust my containers 
              this.SetAlternationCount(); 

              // propagate to subgroups, if necessary 
              if (this.IsGrouping && this.GroupStyle != null)
              {
                  /*ItemBlock*/var block = this._itemMap.Next;
                  while (block != this._itemMap) 
                  {
                      for (var offset = 0;  offset < block.ContainerCount;  ++offset) 
                      { 
                          /*GroupItem*/var gi = block.ContainerAt(offset);
                          gi = gi instanceof GroupItem ? gi : null;
                          if (gi != null) 
                          {
                              gi.Generator.ChangeAlternationCount();
                          }
                      } 

                      block = block.Next; 
                  } 
              }
    	  }else{
    		  if (this._alternationCount == newAlternationCount)
                  return; 

              // find the first realized container (need this regardless of what happens)
              /*ItemBlock*/var block = this._itemMap.Next; 
              var offset = 0;
              while (offset == block.ContainerCount)
              {
                  block = block.Next; 
              }

              // if there are no realized containers, there's nothing to do 
              if (block != this._itemMap)
              { 
                  // if user is requesting alternation, reset each container's AlternationIndex
                  if (newAlternationCount > 0)
                  {
                  	this._alternationCount = newAlternationCount; 
                      this.SetAlternationIndex(block, offset, GeneratorDirection.Forward);
                  } 
                  // otherwise, clear each container's AlternationIndex 
                  else if (this._alternationCount > 0)
                  { 
                      while (block != this._itemMap)
                      {
                          for (offset = 0;  offset < block.ContainerCount;  ++offset)
                          { 
                              ItemsControl.ClearAlternationIndex(block.ContainerAt(offset));
                          } 

                          block = block.Next;
                      } 
                  }
              }

              this._alternationCount = newAlternationCount; 
    	  }
      },
 
//        internal void 
        OnPanelChanged:function()
        { 
            if (this.PanelChanged != null)
                this.PanelChanged.Invoke(this, EventArgs.Empty);
        },
        
//        void 
        MoveToPosition:function(/*GeneratorPosition*/ position, /*GeneratorDirection*/ direction, /*bool*/ allowStartAtRealizedItem, 
        		/*ref GeneratorState*/ state) 
        { 
            /*ItemBlock*/var block = this._itemMap;
            if (block == null) 
                return;         // this can happen in event-leapfrogging situations (Dev11 283413)

            var itemIndex = 0;
 
            // first move to the indexed (realized) item
            if (position.Index != -1) 
            { 
                // find the right block
                var itemCount = 0; 
                var index = position.Index;
                block = block.Next;
                while (index >= block.ContainerCount)
                { 
                    itemCount += block.ItemCount;
                    index -= block.ContainerCount; 
                    itemIndex += block.ItemCount; 
                    block = block.Next;
                } 

                // set the position
                state.Block = block;
                state.Offset = index; 
                state.Count = itemCount;
                state.ItemIndex = itemIndex + index; 
            } 
            else
            { 
                state.Block = block;
                state.Offset = 0;
                state.Count = 0;
                state.ItemIndex = itemIndex - 1; 
            }
 
            // adjust the offset - we always set the state so it points to the next 
            // item to be generated.
            var offset = position.Offset; 
            if (offset == 0 && (!allowStartAtRealizedItem || state.Block == this._itemMap))
            {
                offset = (direction == GeneratorDirection.Forward) ? 1 : -1;
            } 

            // advance the state according to the offset 
            if (offset > 0) 
            {
                state.Block.MoveForward(/*ref*/ state, true); 
                -- offset;

                while (offset > 0)
                { 
                    offset -= state.Block.MoveForward(/*ref*/ state, allowStartAtRealizedItem, offset);
                } 
            } 
            else if (offset < 0)
            { 
                if (state.Block == this._itemMap)
                {
                    state.ItemIndex = state.Count = this.ItemsInternal.Count;
                } 

                state.Block.MoveBackward(/*ref*/ state, true); 
                ++ offset; 

                while (offset < 0) 
                {
                    offset += state.Block.MoveBackward(/*ref*/ state, allowStartAtRealizedItem, -offset);
                }
            } 
        },
 
        // "Realize" the item in a block at the given offset, to be 
        // the given item with corresponding container.  This means updating
        // the item map data structure so that the item belongs to a Realized block. 
        // It also requires updating the state of every generator to track the
        // changes we make here.
//        void 
        Realize:function(/*UnrealizedItemBlock*/ block, /*int*/ offset, /*object*/ item, /*DependencyObject*/ container)
        { 
            /*RealizedItemBlock*/var prevR, nextR;
 
            /*RealizedItemBlock*/var newBlock; // new location of the target item 
            var newOffset;              // its offset within the new block
            var deltaCount;             // diff between cumulative item count of block and newBlock 

            // if we're realizing the leftmost item and there's room in the
            // previous block, move it there
            if (offset == 0 && 
                (prevR = (block.Prev instanceof RealizedItemBlock ? block.Prev : null)) != null &&
                prevR.ItemCount < ItemBlock.BlockSize) 
            { 
                newBlock = prevR;
                newOffset = prevR.ItemCount; 
                this.MoveItems(block, offset, 1, newBlock, newOffset, -prevR.ItemCount);
                this.MoveItems(block, 1, block.ItemCount, block, 0, +1);
            }
 
            // if we're realizing the rightmost item and there's room in the
            // next block, move it there 
            else if (offset == block.ItemCount - 1 && 
                (nextR = block.Next instanceof RealizedItemBlock ? block.Next : null) != null &&
                nextR.ItemCount < ItemBlock.BlockSize) 
            {
                newBlock = nextR;
                newOffset = 0;
                this.MoveItems(newBlock, 0, newBlock.ItemCount, newBlock, 1, -1); 
                this.MoveItems(block, offset, 1, newBlock, newOffset, offset);
            } 
 
            // otherwise we need a new block for the target item
            else 
            {
                newBlock = new RealizedItemBlock();
                newOffset = 0;
                deltaCount = offset; 

                // if target is leftmost item, insert it before remaining items 
                if (offset == 0) 
                {
                    newBlock.InsertBefore(block); 
                    this.MoveItems(block, offset, 1, newBlock, newOffset, 0);
                    this.MoveItems(block, 1, block.ItemCount, block, 0, +1);
                }
 
                // if target is rightmost item, insert it after remaining items
                else if (offset == block.ItemCount - 1) 
                { 
                    newBlock.InsertAfter(block);
                    this.MoveItems(block, offset, 1, newBlock, newOffset, offset); 
                }

                // otherwise split the block into two, with the target in the middle
                else 
                {
                    /*UnrealizedItemBlock*/var newUBlock = new UnrealizedItemBlock(); 
                    newUBlock.InsertAfter(block); 
                    newBlock.InsertAfter(block);
                    this.MoveItems(block, offset+1, block.ItemCount-offset-1, newUBlock, 0, offset+1); 
                    this.MoveItems(block, offset, 1, newBlock, 0, offset);
                }
            }
 
            this.RemoveAndCoalesceBlocksIfNeeded(block);
 
            // add the new target to the map 
            newBlock.RealizeItem(newOffset, item, container);
        }, 

//        void 
        RemoveAndCoalesceBlocksIfNeeded:function(/*ItemBlock*/ block)
        {
            if (block != null && block != this._itemMap && block.ItemCount == 0) 
            {
                block.Remove(); 
 
                // coalesce adjacent unrealized blocks
                if (block.Prev instanceof UnrealizedItemBlock && block.Next instanceof UnrealizedItemBlock) 
                {
                    this.MoveItems(block.Next, 0, block.Next.ItemCount, block.Prev, block.Prev.ItemCount, -block.Prev.ItemCount-1);
                    block.Next.Remove();
                } 
            }
        }, 
 
        // Move 'count' items starting at position 'offset' in block 'block'
        // to position 'newOffset' in block 'newBlock'.  The difference between 
        // the cumulative item counts of newBlock and block is given by 'deltaCount'.
//        void 
        MoveItems:function(/*ItemBlock*/ block, /*int*/ offset, /*int*/ count,
                        /*ItemBlock*/ newBlock, /*int*/ newOffset, /*int*/ deltaCount)
        { 
            /*RealizedItemBlock*/var ribSrc = block instanceof RealizedItemBlock ? block : null;
            /*RealizedItemBlock*/var ribDst = newBlock instanceof RealizedItemBlock ? newBlock : null; 
 
            // when both blocks are Realized, entries must be physically copied
            if (ribSrc != null && ribDst != null) 
            {
                ribDst.CopyEntries(ribSrc, offset, count, newOffset);
            }
            // when the source block is Realized, clear the vacated entries - 
            // to avoid leaks.  (No need if it's now empty - the block will get GC'd).
            else if (ribSrc != null && ribSrc.ItemCount > count) 
            { 
                ribSrc.ClearEntries(offset, count);
            } 

            // update block information
            block.ItemCount -= count;
            newBlock.ItemCount += count; 

            // tell generators what happened 
            if (this.MapChanged != null) 
            	this.MapChanged.Invoke(block, offset, count, newBlock, newOffset, deltaCount);
        },

        // Set the AlternationIndex on a newly-realized container.  Also, reset
        // the AlternationIndex on other containers to maintain the adjacency
        // criterion. 
//        void 
        SetAlternationIndex:function(/*ItemBlock*/ block, /*int*/ offset, /*GeneratorDirection*/ direction)
        { 
            // If user doesn't request alternation, don't do anything 
            if (this._alternationCount <= 0)
                return; 

            var index;
            /*RealizedItemBlock*/var rib;
 
            // Proceed in the direction of generation.  This tends to reach the
            // end sooner (often in one step). 
            if (direction != GeneratorDirection.Backward) 
            {
                // Forward.  Back up one container to determine the starting index 
                -- offset;
                while (offset < 0 || block instanceof UnrealizedItemBlock)
                {
                    block = block.Prev; 
                    offset = block.ContainerCount - 1;
                } 
 
                rib = block instanceof RealizedItemBlock ? block : null;
                index = (block == this._itemMap) ? -1 : ItemsControl.GetAlternationIndex(rib.ContainerAt(offset)); 

                // loop through the remaining containers, resetting each AlternationIndex
                for (;;)
                { 
                    // advance to next realized container
                    ++offset; 
                    while (offset == block.ContainerCount) 
                    {
                        block = block.Next; 
                        offset = 0;
                    }

                    // exit if we've reached the end 
                    if (block == this._itemMap)
                        break; 
 
                    // advance the AlternationIndex
                    index = (index + 1) % this._alternationCount; 

                    // assign it to the container
                    rib = block instanceof RealizedItemBlock ? block : null;
                    ItemsControl.SetAlternationIndex(rib.ContainerAt(offset), index); 
                }
            } 
            else 
            {
                // Backward.  Advance one container to determine the starting index 
                ++ offset;
                while (offset >= block.ContainerCount || block instanceof UnrealizedItemBlock)
                {
                    block = block.Next; 
                    offset = 0;
                } 
 
                rib = block instanceof RealizedItemBlock ? block : null;
 
                // Get the alternation index for the advanced container. Use value 1 if no container
                // is found, so that 0 gets used for actual container in question.
                index = (block == this._itemMap) ? 1 : ItemsControl.GetAlternationIndex(rib.ContainerAt(offset));
 
                // loop through the remaining containers, resetting each AlternationIndex
                for (;;) 
                { 
                    // retreat to next realized container
                    --offset; 
                    while (offset < 0)
                    {
                        block = block.Prev;
                        offset = block.ContainerCount - 1; 
                    }
 
                    // exit if we've reached the end 
                    if (block == this._itemMap)
                        break; 

                    // retreat the AlternationIndex
                    index = (this._alternationCount + index - 1) % this._alternationCount;
 
                    // assign it to the container
                    rib = block instanceof RealizedItemBlock ? block : null; 
                    ItemsControl.SetAlternationIndex(rib.ContainerAt(offset), index); 
                }
            } 
        },

        // create a group item for the given group
//        DependencyObject 
        ContainerForGroup:function(/*CollectionViewGroup*/ group) 
        {
        	this._generatesGroupItems = true; 
            if (!this.ShouldHide(group)) 
            {
                // normal group - link a new GroupItem 
                /*GroupItem*/var groupItem = new GroupItem();

                ItemContainerGenerator.LinkContainerToItem(groupItem, group);
 
                // create the generator
                groupItem.Generator = new ItemContainerGenerator(this, groupItem); 
 
                return groupItem;
            } 
            else
            {
                // hidden empty group - link a new EmptyGroupItem
            	this.AddEmptyGroupItem(group); 

                // but don't return it to layout 
                return null; 
            }
        }, 

        // prepare the grouping information.  Called from RemoveAll.
//        void 
        PrepareGrouping:function()
        { 
            /*GroupStyle*/var groupStyle;
            /*IList*/var items; 
 
            if (this.Level == 0)
            { 
                groupStyle = this.Host.GetGroupStyle(null, 0);

                if (groupStyle == null)
                { 
                    items = this.Host.View;
                } 
                else 
                {
                    /*CollectionView*/var cv = this.Host.View.CollectionView; 
                    items = (cv == null) ? null : cv.Groups;
                    if (items == null)
                    {
                        items = this.Host.View; 

                        // When there are no groups, we should ignore GroupStyle 
                        // and use the host's ItemsPanel (see Dev11 203247 and 5600). 
                        // But this breaks Nero (Win8 770178, Dev11 423101) because
                        // their ItemsPanel can only be used at the leaf level of 
                        // a real grouping scenario.  It null-refs if used with
                        // an empty collection, which happens during the first layout.
                        // So for compat we let the bogus GroupStyle.Panel leak through
                        // when the Items collection is empty. 
                        if (items.Count > 0)
                        { 
                            groupStyle = null; 
                        }
                    } 
                }
            }
            else
            { 
                /*GroupItem*/var groupItem = /*(GroupItem)*/this.Peer;
                /*CollectionViewGroup*/var group = groupItem.ReadLocalValue(ItemContainerGenerator.ItemForItemContainerProperty);
                group = group instanceof CollectionViewGroup ? group : null; 
 
                if (group != null)
                { 
                    if (group.IsBottomLevel)
                    {
                        groupStyle = null;
                    } 
                    else
                    { 
                        groupStyle = this.Host.GetGroupStyle(group, this.Level); 
                    }
 
                    items = group.Items;
                }
                else
                { 
                    // GroupItem has been recycled.
                    groupStyle = null; 
                    items = this.Host.View; 
                }
            } 

            this.GroupStyle = groupStyle;
            this.ItemsInternal = items;
 
            if ((this.Level == 0) && (this.Host != null))
            { 
                // Notify the host of a change in IsGrouping 
                this.Host.SetIsGrouping(this.IsGrouping);
            } 
        },
        
//        void 
        SetAlternationCount:function()
        { 
            var alternationCount;
 
            if (this.IsGrouping && this.GroupStyle != null) 
            {
                if (this.GroupStyle.IsAlternationCountSet) 
                {
                    alternationCount = this.GroupStyle.AlternationCount;
                }
                else if (this._parent != null) 
                {
                    alternationCount = this._parent._alternationCount; 
                } 
                else
                { 
                    alternationCount = this.Host.AlternationCount;
                }
            }
            else 
            {
                alternationCount = this.Host.AlternationCount; 
            } 

            this.ChangeAlternationCount(alternationCount); 
        },
        
        // should the given group be hidden?
//        bool 
        ShouldHide:function(/*CollectionViewGroup*/ group) 
        {
            return this.GroupStyle.HidesIfEmpty &&      // user asked to hide 
                    group.ItemCount == 0;           // group is empty 
        },
 
        // create an empty-group placeholder item
//        void 
        AddEmptyGroupItem:function(/*CollectionViewGroup*/ group)
        {
            /*EmptyGroupItem*/var emptyGroupItem = new EmptyGroupItem(); 

            ItemContainerGenerator.LinkContainerToItem(emptyGroupItem, group); 
 
            emptyGroupItem.SetGenerator(new ItemContainerGenerator(this, emptyGroupItem));
 
            // add it to the list of placeholder items (this keeps it from being GC'd)
            if (this._emptyGroupItems == null)
            	this._emptyGroupItems = new ArrayList();
            this._emptyGroupItems.Add(emptyGroupItem); 
         },
        
         // notification that a subgroup has become non-empty 
	//      void 
	     OnSubgroupBecameNonEmpty:function(/*EmptyGroupItem*/ groupItem, /*CollectionViewGroup*/ group)
	     { 
	    	 if(arguments.length == 2){
		          // Discard placeholder container.
	    		 ItemContainerGenerator.UnlinkContainerFromItem(groupItem, group);
	    		 if (this._emptyGroupItems != null)
		          	this._emptyGroupItems.Remove(groupItem); 
		
	    		 // inform layout as if the group just got added 
	    		 if (this.ItemsChanged != null) 
	    		 {
	    			 /*GeneratorPosition*/var position = this.PositionFromIndex(this.ItemsInternal.IndexOf(group)); 
	    			 this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Add, position, 1, 0));
	    		 } 
	    	 }else{
	    		 if (this.ShouldHide(group))
	    		 { 
		              /*GeneratorPosition*/var position = this.PositionFromIndex(this.ItemsInternal.IndexOf(group));
		
		              // if the group is realized, un-realize it and notify layout
		              if (position.Offset == 0 && position.Index >= 0) 
		              {
		                  // un-realize 
		                  /*((IItemContainerGenerator)this)*/this.Remove(position, 1); 
		
		                  // inform layout as if the group just got removed 
		                  if (this.ItemsChanged != null)
		                  {
		                  	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Remove, position, 1, 1));
		                  } 
		
		                  // create the placeholder 
		                  this.AddEmptyGroupItem(group); 
		              }
	    		 }  
	    	 }
	     },
	
//	      // notification that a subgroup has become empty
//	//      void 
//	      OnSubgroupBecameEmpty:function(/*CollectionViewGroup*/ group) 
//	      { 
//	          if (this.ShouldHide(group))
//	          { 
//	              /*GeneratorPosition*/var position = this.PositionFromIndex(this.ItemsInternal.IndexOf(group));
//	
//	              // if the group is realized, un-realize it and notify layout
//	              if (position.Offset == 0 && position.Index >= 0) 
//	              {
//	                  // un-realize 
//	                  /*((IItemContainerGenerator)this)*/this.Remove(position, 1); 
//	
//	                  // inform layout as if the group just got removed 
//	                  if (this.ItemsChanged != null)
//	                  {
//	                  	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Remove, position, 1, 1));
//	                  } 
//	
//	                  // create the placeholder 
//	                  this.AddEmptyGroupItem(group); 
//	              }
//	          } 
//	      },
	 
//        // notification that a subgroup has become non-empty 
////        void 
//        OnSubgroupBecameNonEmpty:function(/*EmptyGroupItem*/ groupItem, /*CollectionViewGroup*/ group)
//        { 
//            // Discard placeholder container.
//        	ItemContainerGenerator.UnlinkContainerFromItem(groupItem, group);
//            if (this._emptyGroupItems != null)
//            	this._emptyGroupItems.Remove(groupItem); 
//
//            // inform layout as if the group just got added 
//            if (this.ItemsChanged != null) 
//            {
//                /*GeneratorPosition*/var position = this.PositionFromIndex(this.ItemsInternal.IndexOf(group)); 
//                this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Add, position, 1, 0));
//            }
//        },
// 
//        // notification that a subgroup has become empty
////        void 
//        OnSubgroupBecameEmpty:function(/*CollectionViewGroup*/ group) 
//        { 
//            if (this.ShouldHide(group))
//            { 
//                /*GeneratorPosition*/var position = this.PositionFromIndex(this.ItemsInternal.IndexOf(group));
//
//                // if the group is realized, un-realize it and notify layout
//                if (position.Offset == 0 && position.Index >= 0) 
//                {
//                    // un-realize 
//                    /*((IItemContainerGenerator)this)*/this.Remove(position, 1); 
//
//                    // inform layout as if the group just got removed 
//                    if (this.ItemsChanged != null)
//                    {
//                    	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Remove, position, 1, 1));
//                    } 
//
//                    // create the placeholder 
//                    this.AddEmptyGroupItem(group); 
//                }
//            } 
//        },
        
        

        // convert an index (into Items) into a GeneratorPosition
//        GeneratorPosition 
        PositionFromIndex:function(/*int*/ itemIndex) 
        {
            /*GeneratorPosition*/var position = null; 
            /*ItemBlock*/var itemBlock = null; 
            var offsetFromBlockStart = null;
            
            var positionOut = {"position" : position};
            
            var itemBlockOut = {"block" : itemBlock};
            
            var offsetFromBlockStartOut = {"offsetFromBlockStart" : offsetFromBlockStart};
 
            this.GetBlockAndPosition(itemIndex, /*out position*/positionOut, 
            		/*out itemBlock*/itemBlockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut);
            position = positionOut.position;

            return position;
        }, 

 
////        void 
//        GetBlockAndPosition:function(/*object*/ item, /*int*/ itemIndex, /*bool*/ deletedFromItems, 
//        		/*out GeneratorPosition position*/positionOut, /*out ItemBlock block*/blockOut, 
//        		/*out int offsetFromBlockStart*/offsetFromBlockStartOut, /*out int correctIndex*/correctIndexOut) 
//        {
//            if (itemIndex >= 0) 
//            {
//                this.GetBlockAndPosition(itemIndex, positionOut, blockOut, offsetFromBlockStartOut);
//                correctIndexOut.correctIndex = itemIndex;
//            } 
//            else
//            { 
//                this.GetBlockAndPosition(item, deletedFromItems, positionOut, blockOut, offsetFromBlockStartOut, correctIndexOut); 
//            }
//        },
// 
////        void 
//        GetBlockAndPosition:function(/*int*/ itemIndex, /*out GeneratorPosition position*/positionOut, 
//        		/*out ItemBlock block*/blockOut, /*out int offsetFromBlockStart*/offsetFromBlockStartOut)
//        { 
//        	positionOut.position = new GeneratorPosition(-1, 0);
//        	blockOut.block = null; 
//            offsetFromBlockStartOut.offsetFromBlockStart = itemIndex; 
//
//            if (this._itemMap == null || itemIndex < 0) 
//                return;
//
//            var containerIndex = 0;
// 
//            for (blockOut.block = this._itemMap.Next;  blockOut.block != this._itemMap;  blockOut.block = blockOut.block.Next)
//            { 
//                if (offsetFromBlockStartOut.offsetFromBlockStart >= blockOut.block.ItemCount) 
//                {
//                    // item belongs to a later block, increment the containerIndex 
//                    containerIndex += blockOut.block.ContainerCount;
//                    offsetFromBlockStartOut.offsetFromBlockStart -= blockOut.block.ItemCount;
//                }
//                else 
//                {
//                    // item belongs to this block.  Determine the container index and offset 
//                    if (blockOut.block.ContainerCount > 0) 
//                    {
//                        // block has realized items 
//                    	positionOut.position = new GeneratorPosition(containerIndex + offsetFromBlockStartOut.offsetFromBlockStart, 0);
//                    }
//                    else
//                    { 
//                        // block has unrealized items
//                    	positionOut.position = new GeneratorPosition(containerIndex-1, offsetFromBlockStartOut.offsetFromBlockStart+1); 
//                    } 
//
//                    break; 
//                }
//            }
//        },
// 
////        void 
//        GetBlockAndPosition:function(/*object*/ item, /*bool*/ deletedFromItems, 
//        		/*out GeneratorPosition position*/positionOut, /*out ItemBlock block*/blockOut, 
//        		/*out int offsetFromBlockStart*/offsetFromBlockStartOut, /*out int correctIndex*/correctIndexOut)
//        { 
//        	correctIndexOut.correctIndex = 0; 
//            var containerIndex = 0;
//            offsetFromBlockStartOut.offsetFromBlockStart = 0; 
//            var deletionOffset = deletedFromItems ? 1 : 0;
//            positionOut.position = new GeneratorPosition(-1, 0);
//
//            for (blockOut.block = this._itemMap.Next;  blockOut.block != this._itemMap;  blockOut.block = blockOut.block.Next) 
//            {
//                /*UnrealizedItemBlock*/var uib; 
//                /*RealizedItemBlock*/var rib = blockOut.block instanceof RealizedItemBlock ? blockOut.block : null; 
//
//                if (rib != null) 
//                {
//                    // compare realized items with item for which we are searching
//                	offsetFromBlockStartOut.offsetFromBlockStart = rib.OffsetOfItem(item);
//                    if (offsetFromBlockStartOut.offsetFromBlockStart >= 0) 
//                    {
//                    	positionOut.position = new GeneratorPosition(containerIndex + offsetFromBlockStartOut.offsetFromBlockStart, 0); 
//                        correctIndexOut.correctIndex += offsetFromBlockStartOut.offsetFromBlockStart; 
//                        break;
//                    } 
//                }
//                else if ((uib = (blockOut.block instanceof UnrealizedItemBlock ? blockOut.block : null)) != null)
//                {
//                    // if the item isn't realized, we can't find it 
//                    // directly.  Instead, look for indirect evidence that it
//                    // belongs to this block by checking the indices of 
//                    // nearby realized items. 
//
//
//                    var itemIsInCurrentBlock = false;
//                    rib = blockOut.block.Next instanceof RealizedItemBlock ? blockOut.block.Next : null;
//                    if (rib != null && rib.ContainerCount > 0) 
//                    {
//                        // if the index of the next realized item is off by one, 
//                        // the deleted item likely comes from the current 
//                        // unrealized block.
//                        itemIsInCurrentBlock = 
//                                Object.Equals(rib.ItemAt(0),
//                                    this.ItemsInternal.Get(correctIndex + blockOut.block.ItemCount - deletionOffset));
//                    }
//                    else if (blockOut.block.Next == this._itemMap) 
//                    {
//                        // similarly if we're at the end of the list and the 
//                        // overall count is off by one, or if the current block 
//                        // is the only block, the deleted item likely
//                        // comes from the current (last) unrealized block 
//                        itemIsInCurrentBlock = blockOut.block.Prev == this._itemMap ||
//                            (this.ItemsInternal.Count == correctIndexOut.correctIndex + blockOut.block.ItemCount - deletionOffset);
//                    }
// 
//                    if (itemIsInCurrentBlock)
//                    { 
//                        // we don't know where it is in this block, so assume 
//                        // it's the very first item.
//                    	offsetFromBlockStartOut.offsetFromBlockStart = 0; 
//                        positionOut.position = new GeneratorPosition(containerIndex-1, 1);
//                        break;
//                    }
//                } 
//
//                correctIndexOut.correctIndex += blockOut.block.ItemCount; 
//                correctIndexOut.containerIndex += blockOut.block.ContainerCount; 
//            }
// 
//            if (blockOut.block == this._itemMap)
//            {
//                // There's no way of knowing which unrealized block it belonged to, so
//                // the data structure can't be updated correctly.  Sound the alarm. 
//                throw new InvalidOperationException(SR.Get(SRID.CannotFindRemovedItem));
//            } 
//        }, 
        
//      void 
//        GetBlockAndPosition:function(/*int*/ itemIndex, /*out GeneratorPosition position*/positionOut, 
//        		/*out ItemBlock block*/blockOut, /*out int offsetFromBlockStart*/offsetFromBlockStartOut)
//        GetBlockAndPosition:function(/*object*/ item, /*bool*/ deletedFromItems, 
//        		/*out GeneratorPosition position*/positionOut, /*out ItemBlock block*/blockOut, 
//        		/*out int offsetFromBlockStart*/offsetFromBlockStartOut, /*out int correctIndex*/correctIndexOut)
//        {
        GetBlockAndPosition:function(/*object*/ item, /*int*/ itemIndex, /*bool*/ deletedFromItems, 
        		/*out GeneratorPosition position*/positionOut, /*out ItemBlock block*/blockOut, 
        		/*out int offsetFromBlockStart*/offsetFromBlockStartOut, /*out int correctIndex*/correctIndexOut) 
        {
        	if(arguments.length == 7){
                if (itemIndex >= 0) 
                {
                    this.GetBlockAndPosition(itemIndex, positionOut, blockOut, offsetFromBlockStartOut);
                    correctIndexOut.correctIndex = itemIndex;
                } 
                else
                { 
                    this.GetBlockAndPosition(item, deletedFromItems, positionOut, blockOut, offsetFromBlockStartOut, correctIndexOut); 
                }
        	}else if(arguments.length == 6){
        		
        		correctIndexOut = offsetFromBlockStartOut;
        		offsetFromBlockStartOut= blockOut;
        		blockOut = positionOut;
        		positionOut = deletedFromItems;
        		deletedFromItems = itemIndex;
        		
        		correctIndexOut.correctIndex = 0; 
                var containerIndex = 0;
                offsetFromBlockStartOut.offsetFromBlockStart = 0; 
                var deletionOffset = deletedFromItems ? 1 : 0;
                positionOut.position = new GeneratorPosition(-1, 0);

                for (blockOut.block = this._itemMap.Next;  blockOut.block != this._itemMap;  blockOut.block = blockOut.block.Next) 
                {
                    /*UnrealizedItemBlock*/var uib; 
                    /*RealizedItemBlock*/var rib = blockOut.block instanceof RealizedItemBlock ? blockOut.block : null; 

                    if (rib != null) 
                    {
                        // compare realized items with item for which we are searching
                    	offsetFromBlockStartOut.offsetFromBlockStart = rib.OffsetOfItem(item);
                        if (offsetFromBlockStartOut.offsetFromBlockStart >= 0) 
                        {
                        	positionOut.position = new GeneratorPosition(containerIndex + offsetFromBlockStartOut.offsetFromBlockStart, 0); 
                            correctIndexOut.correctIndex += offsetFromBlockStartOut.offsetFromBlockStart; 
                            break;
                        } 
                    }
                    else if ((uib = (blockOut.block instanceof UnrealizedItemBlock ? blockOut.block : null)) != null)
                    {
                        // if the item isn't realized, we can't find it 
                        // directly.  Instead, look for indirect evidence that it
                        // belongs to this block by checking the indices of 
                        // nearby realized items. 


                        var itemIsInCurrentBlock = false;
                        rib = blockOut.block.Next instanceof RealizedItemBlock ? blockOut.block.Next : null;
                        if (rib != null && rib.ContainerCount > 0) 
                        {
                            // if the index of the next realized item is off by one, 
                            // the deleted item likely comes from the current 
                            // unrealized block.
                            itemIsInCurrentBlock = 
                                    Object.Equals(rib.ItemAt(0),
                                        this.ItemsInternal.Get(correctIndex + blockOut.block.ItemCount - deletionOffset));
                        }
                        else if (blockOut.block.Next == this._itemMap) 
                        {
                            // similarly if we're at the end of the list and the 
                            // overall count is off by one, or if the current block 
                            // is the only block, the deleted item likely
                            // comes from the current (last) unrealized block 
                            itemIsInCurrentBlock = blockOut.block.Prev == this._itemMap ||
                                (this.ItemsInternal.Count == correctIndexOut.correctIndex + blockOut.block.ItemCount - deletionOffset);
                        }
     
                        if (itemIsInCurrentBlock)
                        { 
                            // we don't know where it is in this block, so assume 
                            // it's the very first item.
                        	offsetFromBlockStartOut.offsetFromBlockStart = 0; 
                            positionOut.position = new GeneratorPosition(containerIndex-1, 1);
                            break;
                        }
                    } 

                    correctIndexOut.correctIndex += blockOut.block.ItemCount; 
                    correctIndexOut.containerIndex += blockOut.block.ContainerCount; 
                }
     
                if (blockOut.block == this._itemMap)
                {
                    // There's no way of knowing which unrealized block it belonged to, so
                    // the data structure can't be updated correctly.  Sound the alarm. 
                    throw new InvalidOperationException(SR.Get(SRID.CannotFindRemovedItem));
                } 
        	}else if(arguments.length == 4){
        		offsetFromBlockStartOut= positionOut;
        		blockOut = deletedFromItems;
        		positionOut = itemIndex;
        		itemIndex = item;
        		
        		
        		positionOut.position = new GeneratorPosition(-1, 0);
            	blockOut.block = null; 
                offsetFromBlockStartOut.offsetFromBlockStart = itemIndex; 

                if (this._itemMap == null || itemIndex < 0) 
                    return;

                var containerIndex = 0;
     
                for (blockOut.block = this._itemMap.Next;  blockOut.block != this._itemMap;  blockOut.block = blockOut.block.Next)
                { 
                    if (offsetFromBlockStartOut.offsetFromBlockStart >= blockOut.block.ItemCount) 
                    {
                        // item belongs to a later block, increment the containerIndex 
                        containerIndex += blockOut.block.ContainerCount;
                        offsetFromBlockStartOut.offsetFromBlockStart -= blockOut.block.ItemCount;
                    }
                    else 
                    {
                        // item belongs to this block.  Determine the container index and offset 
                        if (blockOut.block.ContainerCount > 0) 
                        {
                            // block has realized items 
                        	positionOut.position = new GeneratorPosition(containerIndex + offsetFromBlockStartOut.offsetFromBlockStart, 0);
                        }
                        else
                        { 
                            // block has unrealized items
                        	positionOut.position = new GeneratorPosition(containerIndex-1, offsetFromBlockStartOut.offsetFromBlockStart+1); 
                        } 

                        break; 
                    }
                }
        	}

        },

//        private void 
        UnlinkContainerFromItem:function(/*DependencyObject*/ container, /*object*/ item) 
        { 
        	ItemContainerGenerator.UnlinkContainerFromItem(container, item, this._host);
        }, 

 
        /// <summary>
        /// Handle events from the centralized event table 
        /// </summary>
//        bool IWeakEventListener.
        ReceiveWeakEvent:function(/*Type*/ managerType, /*object*/ sender, /*EventArgs*/ e)
        {
            return false;   // this method is no longer used (but must remain, for compat) 
        },
 
//        void 
        OnGroupStylePropertyChanged:function(/*object*/ sender, /*PropertyChangedEventArgs*/ e) 
        {
            if (e.PropertyName == "Panel") 
            {
                this.OnPanelChanged();
            }
            else 
            {
                this.OnRefresh(); 
            } 
        },
 
//        void 
        ValidateAndCorrectIndex:function(/*object*/ item, /*ref int index*/indexRef)
        {
            if (indexRef.index >= 0)
            { 
                // this check is expensive - Items[index] potentially iterates through
                // the collection.  So trust the sender to tell us the truth in retail bits. 
//                Debug.Assert(Object.Equals(item, ItemsInternal[index]), "Event contains the wrong index"); 
            }
            else 
            {
            	indexRef.index = this.ItemsInternal.IndexOf(item);
                if (indexRef.index < 0)
                    throw new InvalidOperationException(SR.Get(SRID.CollectionAddEventMissingItem, item)); 
            }
        },
 
        /// <summary>
        /// Forward a CollectionChanged event 
        /// </summary>
        // Called  when items collection changes.
//        void 
        OnCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ args)
        { 
            if (sender != this.ItemsInternal && args.Action != NotifyCollectionChangedAction.Reset)
                return;     // ignore events (except Reset) from ItemsCollection when we're listening to group's items. 
 
            switch (args.Action)
            { 
                case NotifyCollectionChangedAction.Add:
                    if (args.NewItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    this.OnItemAdded(args.NewItems.Get(0), args.NewStartingIndex); 
                    break;
 
                case NotifyCollectionChangedAction.Remove: 
                    if (args.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    this.OnItemRemoved(args.OldItems.Get(0), args.OldStartingIndex);
                    break;

                case NotifyCollectionChangedAction.Replace: 
                    if (args.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported)); 
                    this.OnItemReplaced(args.OldItems.Get(0), args.NewItems.Get(0), args.NewStartingIndex); 
                    break;
 
                case NotifyCollectionChangedAction.Move:
                    if (args.OldItems.Count != 1)
                        throw new NotSupportedException(SR.Get(SRID.RangeActionsNotSupported));
                    this.OnItemMoved(args.OldItems.Get(0), args.OldStartingIndex, args.NewStartingIndex); 
                    break;
 
                case NotifyCollectionChangedAction.Reset: 
                	this.OnRefresh();
                    break; 

                default:
                    throw new NotSupportedException(SR.Get(SRID.UnexpectedCollectionChangeAction, args.Action));
            } 

//            PresentationTraceLevel traceLevel = PresentationTraceSources.GetTraceLevel(this); 
//            if (traceLevel >= PresentationTraceLevel.High) 
//            {
//                Verify(); 
//            }
        },
        
        // Called when an item is added to the items collection 
//        void 
        OnItemAdded:function(/*object*/ item, /*int*/ index)
        { 
        	var indexRef = {"index" : index};
        	this.ValidateAndCorrectIndex(item, /*ref index*/indexRef); 
        	index = indexRef.index;

            /*GeneratorPosition*/var position = new GeneratorPosition(-1,0); 

            // find the block containing the new item
            /*ItemBlock*/var block = this._itemMap.Next;
            var offset = index; 
            while (block != this._itemMap && offset >= block.ItemCount)
            { 
                offset -= block.ItemCount; 
                position.Index += block.ContainerCount;
                block = block.Next; 
            }

            position.Offset = offset + 1;
 
            // if it's an unrealized block, add the item by bumping the count
            /*UnrealizedItemBlock*/var uib = block instanceof UnrealizedItemBlock ? block : null; 
            if (uib != null) 
            {
            	this.MoveItems(uib, offset, 1, uib, offset+1, 0); 
                ++ uib.ItemCount;
            }

            // if the item can be added to a previous unrealized block, do so 
            else if ((offset == 0 || block == this._itemMap) &&
                    ((uib = (block.Prev instanceof UnrealizedItemBlock ? block.Prev : null)) != null)) 
            { 
                ++ uib.ItemCount;
            } 

            // otherwise, create a new unrealized block
            else
            { 
                uib = new UnrealizedItemBlock();
                uib.ItemCount = 1; 
 
                // split the current realized block, if necessary
                /*RealizedItemBlock*/var rib; 
                if (offset > 0 && (rib = (block instanceof RealizedItemBlock ? block : null)) != null)
                {
                    /*RealizedItemBlock*/var newBlock = new RealizedItemBlock();
                    this.MoveItems(rib, offset, rib.ItemCount - offset, newBlock, 0, offset); 
                    newBlock.InsertAfter(rib);
                    position.Index += block.ContainerCount; 
                    position.Offset = 1; 
                    block = newBlock;
                } 

                uib.InsertBefore(block);
            }
            
            // tell generators what happened
            if (this.MapChanged != null) 
            { 
            	this.MapChanged.Invoke(null, index, +1, uib, 0, 0);
            } 

            // tell layout what happened
            if (this.ItemsChanged != null)
            { 
            	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Add, position, 1, 0));
            } 
        }, 
 
        // Called when an item is removed from the items collection
//        void 
        OnItemRemoved:function(/*object*/ item, /*int*/ itemIndex)
        {
            /*DependencyObject*/var container = null;    // the corresponding container 
            var containerCount = 0;
 
            // search for the deleted item 
            /*GeneratorPosition*/var position = null;
            /*ItemBlock*/var block = null; 
            var offsetFromBlockStart = null;
            var correctIndex = null;
            var positionOut ={"position" :position};
            var blockOut = {"block" : block};
			var offsetFromBlockStartOut = {"offsetFromBlockStart" : offsetFromBlockStart};
			var correctIndexOut = {"correctIndex" : correctIndex};
            
            this.GetBlockAndPosition(item, itemIndex, true,/* out position*/positionOut, 
            		/*out block*/blockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut, /*out correctIndex*/correctIndexOut);
            position=positionOut.position;
            block=blockOut.block;
            offsetFromBlockStart=offsetFromBlockStartOut.offsetFromBlockStart;
            correctIndex=correctIndexOut.correctIndex;
 
            /*RealizedItemBlock*/var rib = block instanceof RealizedItemBlock ? block : null;
            if (rib != null) 
            { 
                containerCount = 1;
                container = rib.ContainerAt(offsetFromBlockStart); 
            }

            // remove the item, and remove the block if it's now empty
            this.MoveItems(block, offsetFromBlockStart + 1, block.ItemCount - offsetFromBlockStart - 1, block, offsetFromBlockStart, 0); 
            --block.ItemCount;
            if (rib != null) 
            { 
                // fix up the alternation index before removing an empty block, while
                // we still have a valid block and offset 
            	this.SetAlternationIndex(block, offsetFromBlockStart, GeneratorDirection.Forward);
            }
            this.RemoveAndCoalesceBlocksIfNeeded(block);
 
            // tell generators what happened
            if (this.MapChanged != null) 
            { 
            	this.MapChanged.Invoke(null, itemIndex, -1, null, 0, 0);
            } 

            // tell layout what happened
            if (this.ItemsChanged != null)
            { 
            	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Remove, position, 1, containerCount));
            } 
 
            // unhook the container.  Do this after layout has (presumably) removed it from
            // the UI, so that it doesn't inherit DataContext falsely. 
            if (container != null)
            {
            	this.UnlinkContainerFromItem(container, item);
            } 

            // detect empty groups, so they can be hidden if necessary 
            if (this.Level > 0 && this.ItemsInternal.Count == 0) 
            {
                /*GroupItem*/var groupItem = this.Peer; 
                /*CollectionViewGroup*/var group = groupItem.ReadLocalValue(ItemContainerGenerator.ItemForItemContainerProperty);
                group = group instanceof CollectionViewGroup ? group : null;

                // the group could be null if the parent generator has already
                // unhooked its container 
                if (group != null)
                { 
                    this.Parent.OnSubgroupBecameEmpty(group); 
                }
            } 
        },
        
//        void 
        OnItemReplaced:function(/*object*/ oldItem, /*object*/ newItem, /*int*/ index)
        { 
            // search for the replaced item
            /*GeneratorPosition*/var position = null;
            /*ItemBlock*/var block = null; 
            var offsetFromBlockStart = null;
            var correctIndex = null;
            var positionOut ={"position" :position};
            var blockOut = {"block" : block};
			var offsetFromBlockStartOut = {"offsetFromBlockStart" : offsetFromBlockStart};
			var correctIndexOut = {"correctIndex" : correctIndex};
            
            GetBlockAndPosition(oldItem, index, false,/* out position*/positionOut, 
            		/*out block*/blockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut, /*out correctIndex*/correctIndexOut);
            position=positionOut.position;
            block=blockOut.block;
            offsetFromBlockStart=offsetFromBlockStartOut.offsetFromBlockStart;
            correctIndex=correctIndexOut.correctIndex;

            // If the item is in an UnrealizedItemBlock, then this change need not
            // be made to the _itemsMap as we are replacing an unrealized item with another unrealized 
            // item in the same place.
            /*RealizedItemBlock*/var rib = block instanceof RealizedItemBlock ? block : null; 
            if (rib != null) 
            {
                /*DependencyObject*/var container = rib.ContainerAt(offsetFromBlockStart); 

                if (oldItem != container && !this._host.IsItemItsOwnContainer(newItem))
                {
                    // if we can re-use the old container, just relink it to the 
                    // new item
                    rib.RealizeItem(offsetFromBlockStart, newItem, container); 
                    ItemContainerGenerator.LinkContainerToItem(container, newItem); 
                    this._host.PrepareItemContainer(container, newItem);
                } 
                else
                {
                    // otherwise, we need a new container
                    /*DependencyObject*/var newContainer = this._host.GetContainerForItem(newItem); 
                    rib.RealizeItem(offsetFromBlockStart, newItem, newContainer);
                    ItemContainerGenerator.LinkContainerToItem(newContainer, newItem); 
 
                    if (this.ItemsChanged != null)
                    { 
                    	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Replace, position, 1, 1));
                    }

                    // after layout has removed the old container, unlink it 
                    this.UnlinkContainerFromItem(container, oldItem);
                } 
            } 
        },
        
//        void 
        OnItemMoved:function(/*object*/ item, /*int*/ oldIndex, /*int*/ newIndex)
        {
            /*DependencyObject*/var container = null;    // the corresponding container
            var containerCount = 0; 
            /*UnrealizedItemBlock*/var uib;
 
            // search for the moved item 
            /*GeneratorPosition*/var position = null; 
            /*ItemBlock*/var block = null; 
            var offsetFromBlockStart = null;
            var correctIndex = null;
            var positionOut = { "position" :position };
            var blockOut = {"block" :block};
            var offsetFromBlockStartOut ={"offsetFromBlockStart" :offsetFromBlockStart};
            var correctIndexOut ={"correctIndex" :correctIndex};
            
            this.GetBlockAndPosition(item, oldIndex, true,/* out position*/positionOut, 
            		/*out block*/blockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut, /*out correctIndex*/correctIndexOut);
            position=positionOut.position;
            block=blockOut.block;
            offsetFromBlockStart=offsetFromBlockStartOut.offsetFromBlockStart;
            correctIndex=correctIndexOut.correctIndex;
 
            /*GeneratorPosition*/var oldPosition = position;
 
            /*RealizedItemBlock*/var rib = block instanceof RealizedItemBlock ? block : null; 
            if (rib != null)
            { 
                containerCount = 1;
                container = rib.ContainerAt(offsetFromBlockStart);
            }
 
            // remove the item, and remove the block if it's now empty
            this.MoveItems(block, offsetFromBlockStart + 1, block.ItemCount - offsetFromBlockStart - 1, block, offsetFromBlockStart, 0); 
            --block.ItemCount; 
            this.RemoveAndCoalesceBlocksIfNeeded(block);
 
            //
            // now insert into the new spot.
            //
 
            position = new GeneratorPosition(-1,0);
            block = this._itemMap.Next; 
            offsetFromBlockStart = newIndex; 
            while (block != this._itemMap && offsetFromBlockStart >= block.ItemCount)
            { 
                offsetFromBlockStart -= block.ItemCount;
                if (block.ContainerCount > 0)
                {
                    position.Index += block.ContainerCount; 
                    position.Offset = 0;
                } 
                else 
                {
                    position.Offset += block.ItemCount; 
                }
                block = block.Next;
            }
 
            position.Offset += offsetFromBlockStart + 1;
 
            // if it's an unrealized block, add the item by bumping the count 
            uib = block instanceof UnrealizedItemBlock ? block : null;
            if (uib != null) 
            {
            	this.MoveItems(uib, offsetFromBlockStart, 1, uib, offsetFromBlockStart+1, 0);
                ++ uib.ItemCount;
            } 

            // if the item can be added to a previous unrealized block, do so 
            else if ((offsetFromBlockStart == 0 || block == this._itemMap) && 
                    ((uib = (block.Prev instanceof UnrealizedItemBlock ? block.Prev : null)) != null))
            { 
                ++ uib.ItemCount;
            }

            // otherwise, create a new unrealized block 
            else
            { 
                uib = new UnrealizedItemBlock(); 
                uib.ItemCount = 1;
 
                // split the current realized block, if necessary
                if (offsetFromBlockStart > 0 && (rib = (block instanceof RealizedItemBlock ? block : null)) != null)
                {
                    /*RealizedItemBlock*/var newBlock = new RealizedItemBlock(); 
                    this.MoveItems(rib, offsetFromBlockStart, rib.ItemCount - offsetFromBlockStart, newBlock, 0, offsetFromBlockStart);
                    newBlock.InsertAfter(rib); 
                    position.Index += block.ContainerCount; 
                    position.Offset = 1;
                    offsetFromBlockStart = 0; 
                    block = newBlock;
                }

                uib.InsertBefore(block); 
            }
 
            /*DependencyObject*/var parent = VisualTreeHelper.GetParentInternal(container); 

            // tell layout what happened 
            if (this.ItemsChanged != null)
            {
            	this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Move, position, oldPosition, 1, containerCount));
            } 

            // unhook the container.  Do this after layout has (presumably) removed it from 
            // the UI, so that it doesn't inherit DataContext falsely. 
            if (container != null)
            { 
                if (parent == null || VisualTreeHelper.GetParentInternal(container) != parent)
                {
                	this.UnlinkContainerFromItem(container, item);
                } 
                else
                { 
                    // If the container has the same visual parent as before then that means that 
                    // the container was just repositioned within the parent's VisualCollection.
                    // we don't need to unlink the container, but we do need to re-realize the block. 
                    this.Realize(uib, offsetFromBlockStart, item, container);
                }
            }
 
            // fix up the AlternationIndex on containers affected by the move
            if (this._alternationCount > 0) 
            { 
                // start with the smaller of the two positions, and proceed forward.
                // This tends to preserve the AlternatonIndex on containers at the 
                // front of the list, as users expect
                var index = Math.min(oldIndex, newIndex);
                this.GetBlockAndPosition(index, /*out position*/positionOut, /*out block*/blockOut, /*out offsetFromBlockStart*/offsetFromBlockStartOut);
                position = positionOut.position;
                block = blockOut.block;
                offsetFromBlockStart=offsetFromBlockStartOut.offsetFromBlockStart;
                
                this.SetAlternationIndex(block, offsetFromBlockStart, GeneratorDirection.Forward); 
            }
        }, 
        
        // Called when the items collection is refreshed
//        void 
        OnRefresh:function() 
        {
            /*((IItemContainerGenerator)this)*/this.RemoveAll();

            // tell layout what happened 
            if (this.ItemsChanged != null)
            { 
                /*GeneratorPosition*/var position = new GeneratorPosition(0, 0); 
                this.ItemsChanged.Invoke(this, new ItemsChangedEventArgs(NotifyCollectionChangedAction.Reset, position, 0, 0));
            } 
        }
	});
	
	Object.defineProperties(ItemContainerGenerator.prototype,{
		
        /// <summary>
        /// The ItemsChanged event is raised by a ItemContainerGenerator to inform 
        /// layouts that the items collection has changed.
        /// </summary>
//        public event ItemsChangedEventHandler 
        ItemsChanged:
        {
        	get:function(){
        		if(this._ItemsChanged === undefined){
        			this._ItemsChanged = new ItemsChangedEventHandler();
        		}
        		
        		return this._ItemsChanged;
        	}
        },
 
        /// <summary>
        /// The StatusChanged event is raised by a ItemContainerGenerator to inform 
        /// controls that its status has changed. 
        /// </summary>
//        public event EventHandler 
        StatusChanged:
        {
        	get:function(){
        		if(this._StatusChanged === undefined){
        			this._StatusChanged = new EventHandler();
        		}
        		
        		return this._StatusChanged;
        	}
        }, 
        
//        internal event EventHandler 
        PanelChanged:
        {
        	get:function(){
        		if(this._PanelChanged === undefined){
        			this._PanelChanged = new EventHandler();
        		}
        		
        		return this._PanelChanged;
        	}
        }, 
        
//        event MapChangedHandler 
        MapChanged:
        {
        	get:function(){
        		if(this._MapChanged === undefined){
        			this._MapChanged = new MapChangedHandler();
        		}
        		
        		return this._MapChanged;
        	}
        },

        /// <summary> The status of the generator </summary> 
//        public GeneratorStatus 
        Status:
        {
            get:function() { return this._status; }
        }, 
 
        /// <summary>
        /// Read-only access to the list of items. 
        /// <summary> 
        /// <notes>
        /// The returned collection is only valid until the next Refresh.  Users 
        /// should not cache a reference to this collection.
        /// </notes>
//        public ReadOnlyCollection<object> 
        Items:
        { 
            get:function()
            { 
                // lazy creation 
                if (this._itemsReadOnly == null && this._items != null)
                { 
                	this._itemsReadOnly = new ReadOnlyCollection(new ListOfObject(this._items));
                }

                return this._itemsReadOnly; 
            }
        }, 

        // ItemsControl sometimes needs access to the recyclable containers. 
        // For eg. DataGrid needs to mark recyclable containers dirty for measure when DataGridColumn.Visibility changes.
//        internal IEnumerable 
        RecyclableContainers:
        {
            get:function() 
            {
                return this._recyclableContainers; 
            } 
        },

//        internal ItemContainerGenerator 
        Parent: 
        {
            get:function() { return this._parent;} 
        }, 

//        internal int 
        Level:
        {
            get:function() { return this._level;}
        },
 
        // The group style that governs the generation of UI for the items.
//        internal GroupStyle 
        GroupStyle: 
        { 
            get:function() { return this._groupStyle; },
            set:function(value) 
            {
                if (this._groupStyle != value)
                {
                    if (this._groupStyle instanceof INotifyPropertyChanged) 
                    {
//                        PropertyChangedEventManager.RemoveHandler(this._groupStyle, this.OnGroupStylePropertyChanged, String.Empty); 
                    	this._groupStyle.PropertyChanged.Remove(new PropertyChangedEventHandler(this, this.OnGroupStylePropertyChanged));
                    } 

                    this._groupStyle = value; 

                    if (this._groupStyle instanceof INotifyPropertyChanged)
                    {
//                        PropertyChangedEventManager.AddHandler(this._groupStyle, this.OnGroupStylePropertyChanged, String.Empty); 
                    	this._groupStyle.PropertyChanged.Combine(new PropertyChangedEventHandler(this, this.OnGroupStylePropertyChanged));
                    }
                } 
            } 
        },
 
        // The collection of items, as IList
//        internal IList 
        ItemsInternal:
        {
            get:function() { return this._items; }, 
            set:function(value)
            { 
                if (this._items != value) 
                {
                    /*INotifyCollectionChanged*/var incc = this._items instanceof INotifyCollectionChanged ? this._items : null; 
                    if (this._items != this.Host.View && incc != null)
                    {
//                        CollectionChangedEventManager.RemoveHandler(incc, this.OnCollectionChanged);
                    	incc.CollectionChanged.Remove(new NotifyCollectionChangedEventHandler(this, this.OnCollectionChanged));
                    } 

                    this._items = value; 
                    this._itemsReadOnly = null; 

                    incc = this._items instanceof INotifyCollectionChanged ? this._items : null; 
                    if (this._items != this.Host.View && incc != null)
                    {
//                        CollectionChangedEventManager.AddHandler(incc, this.OnCollectionChanged);
                    	incc.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.OnCollectionChanged));
                    } 
                }
            } 
        }, 

//        IGeneratorHost 
        Host: { get:function() { return this._host; } },
 
        // The DO for which this generator was created.  For normal generators,
        // this is the ItemsControl.  For subgroup generators, this is 
        // the GroupItem. 
//        DependencyObject 
        Peer:
        { 
            get:function() { return this._peer; }
        },

//        bool 
        IsGrouping:
        {
            get:function() { return (this.ItemsInternal != this.Host.View); } 
        } 
  
	});
	
	Object.defineProperties(ItemContainerGenerator, {

        /// <summary> 
        ///     ItemForItemContainer DependencyProperty
        /// </summary>
        // This is an attached property that the generator sets on each container
        // (generated or direct) to point back to the item. 
//        internal static readonly DependencyProperty 
        ItemForItemContainerProperty:
        {
        	get:function(){
        		if(ItemContainerGenerator._ItemForItemContainerProperty === undefined){
        			ItemContainerGenerator._ItemForItemContainerProperty = 
        				 DependencyProperty.RegisterAttached("ItemForItemContainer", Object.Type, ItemContainerGenerator.Type, 
                                 /*new FrameworkPropertyMetadata(null)*/
        						 FrameworkPropertyMetadata.BuildWithDV(null)); 
        		}
        		
        		return ItemContainerGenerator._ItemForItemContainerProperty;
        	}
        }
  
	});
	
    // establish the link from the container to the corresponding item
//    internal static void 
	ItemContainerGenerator.LinkContainerToItem = function(/*DependencyObject*/ container, /*object*/ item)
    {
        // always set the ItemForItemContainer property 
        container.ClearValue(ItemContainerGenerator.ItemForItemContainerProperty);
        container.SetValue(ItemContainerGenerator.ItemForItemContainerProperty, item); 

        // for non-direct items, set the DataContext property
        if (container != item) 
        {
            container.SetValue(FrameworkElement.DataContextProperty, item);
        }
    }; 


//    internal static void 
    ItemContainerGenerator.UnlinkContainerFromItem = function(/*DependencyObject*/ container, /*object*/ item, /*IGeneratorHost*/ host)
    {
        // When a container is removed from the tree, its future takes one of 
        // two forms:
        //      a) [normal mode] the container becomes eligible for GC 
        //      b) [recycling mode] the container joins the recycled list, and 
        //          possibly re-enters the tree at some point, usually with a
        //          different item. 
        //
        // As Dev10 bug 452669 and some "subtle issues" that arose in the
        // container recycling work illustrate, it's important that the container
        // and its subtree sever their connection to the data item.  Otherwise 
        // you can get aliasing - a dead container reacting to the same item as a live
        // container.  Even without aliasing, it's a perf waste for a dead container 
        // to continue reacting to its former data item. 
        //
        // On the other hand, it's a perf waste to spend too much effort cleaning 
        // up the container and its subtree, since they will often just get GC'd
        // in the near future.
        //
        // WPF initially did a full cleanup of the container, removing all properties 
        // that were set in PrepareContainerForItem.  This avoided aliasing, but
        // was deemed too expensive, especially for scrolling.  For Windows OS Bug 
        // 1445288, all this cleanup work was removed.  This sped up scrolling, but 
        // introduced the problems cited in Dev10 452669 and the recycling "subtle
        // issues".  A compromise is needed. 
        //
        // The compromise is tell the container to attach to a sentinel item
        // BindingExpressionBase.DisconnectedItem.  We allow this to propagate into the
        // conainer's subtree through properties like DataContext and 
        // ContentControl.Content that are normally set by PrepareItemForContainer.
        // A Binding that sees the sentinel as the data item will disconnect its 
        // event listeners from the former data item, but will not change its 
        // own value or invalidate its target property.  This avoids the cost
        // of re-measuring most of the subtree. 

        container.ClearValue(ItemContainerGenerator.ItemForItemContainerProperty);

        // TreeView virtualization requires that we call ClearContainer before setting 
        // the DataContext to "Disconnected".  This gives the TreeViewItems a chance
        // to save "Item values" in the look-aside table, before that table is 
        // discarded.   (See Dev10 628778) 
        host.ClearContainerForItem(container, item);

        if (container != item)
        {
            /*DependencyProperty*/var dp = FrameworkElement.DataContextProperty;

            container.SetValue(dp, BindingExpressionBase.DisconnectedItem); 
        }
    };

	
	ItemContainerGenerator.Type = new Type("ItemContainerGenerator", ItemContainerGenerator, 
			[IRecyclingItemContainerGenerator.Type, IWeakEventListener.Type,]);
	return ItemContainerGenerator;
});





        
 

