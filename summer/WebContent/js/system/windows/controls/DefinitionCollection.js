/**
 * DefinitionCollection
 */

define(["dojo/_base/declare", "system/Type", "collections/ICollection", "controls/ColumnDefinition",
        "collections/IEnumerator"], 
		function(declare, Type, ICollection, ColumnDefinition,
				IEnumerator){
	
//	internal struct 
	var Enumerator = declare(IEnumerator, {
//		private DefinitionCollection _collection;
//		private int _index;
//		private int _version;
//		private object _currentElement;

		
		constructor:function(/*DefinitionCollection*/ collection)
		{
			this._collection = collection;
			this._index = -1;
			this._version = ((this._collection != null) ? this._collection._version : -1);
			this._currentElement = collection;
		},
//		public bool 
		MoveNext:function()
		{
			if (this._collection == null)
			{
				return false;
			}
			this.Validate();
			if (this._index < this._collection._size - 1)
			{
				this._index++;
				this._currentElement = this._collection.Get(this._index);
				return true;
			}
			this._currentElement = this._collection;
			this._index = this._collection._size;
			return false;
		},
//		public void 
		Reset:function()
		{
			if (this._collection == null)
			{
				return;
			}
			this.Validate();
			this._currentElement = this._collection;
			this._index = -1;
		},
//		private void 
		Validate:function()
		{
			if (this._currentElement == null)
			{
				throw new InvalidOperationException(SR.Get("EnumeratorCollectionDisposed"));
			}
			if (this._version != this._collection._version)
			{
				throw new InvalidOperationException(SR.Get("EnumeratorVersionChanged"));
			}
		}
	});
	
	Object.defineProperties(Enumerator.prototype, {
//		public ColumnDefinition 
		Current:
		{
			get:function()
			{
				if (this._currentElement != this._collection)
				{
					return this._currentElement;
				}
				if (this._index == -1)
				{
					throw new InvalidOperationException(SR.Get("EnumeratorNotStarted"));
				}
				throw new InvalidOperationException(SR.Get("EnumeratorReachedEnd"));
			}
		}
	});
	
	var DefinitionCollection = declare("DefinitionCollection", ICollection, {
		constructor:function(/*Grid*/ owner, definitionType)
		{
			this._owner = owner;
			this._definitionType = definitionType;
			this.OnModified();
			
//			private int 
			this._size = 0;
//			private int 
			this._version = 0;
		},
		
//		public ColumnDefinition 
		Get:function(/*int*/ index)
		{
			if (index < 0 || index >= this._size)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionOutOfRange"));
			}
			return this._items[index];

		},
		
		Set:function(index, value)
		{
			this.ValidateAddition(value);
			if (index < 0 || index >= this._size)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionOutOfRange"));
			}
			this.DisconnectChild(this._items[index]);
			this._items[index] = value;
			this.ConnectChild(index, value);
		},
		
//		public void 
		CopyTo:function(/*ColumnDefinition[]*/ array, /*int*/ index)
		{
			if (array == null)
			{
				throw new ArgumentNullException("array");
			}
			if (index < 0)
			{
				throw new ArgumentOutOfRangeException(SR.Get("GridCollection_DestArrayInvalidLowerBound", ["index"]));
			}
			if (array.Length - index < this._size)
			{
				throw new ArgumentException(SR.Get("GridCollection_DestArrayInvalidLength", ["array"]));
			}
			if (this._size > 0)
			{
				Array.Copy(this._items, 0, array, index, this._size);
			}
		},
		
//		int IList.
		Add:function(/*object*/ value)
		{
			this.ValidateAddition(value);
			this.InternalInsert(this._size, value);
			return this._size - 1;
		},

//		public void 
		Clear:function()
		{
			this.OnModified();
			for (var i = 0; i < this._size; i++)
			{
				this.DisconnectChild(this._items[i]);
			}
			this._size = 0;
			this._items.length = 0;
		},
//		public bool 
		Contains:function(/*ColumnDefinition*/ value)
		{
			return value != null && value.Parent == this._owner;
		},
//		public int 
		IndexOf:function(/*ColumnDefinition*/ value)
		{
			if (value == null || value.Parent != this._owner)
			{
				return -1;
			}
			return value.Index;
		},
		

//		public void 
		Insert:function(/*int*/ index, /*ColumnDefinition*/ value)
		{
			if (index < 0 || index > this._size)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionOutOfRange"));
			}
			this.ValidateAddition(value);
			this.InternalInsert(index, value);
		},

//		public bool 
		Remove:function(/*ColumnDefinition*/ value)
		{
			var flag = this.ValidateRemoval(value);
			if (flag)
			{
				this.InternalRemove(value);
			}
			return flag;
		},
		
//		public void 
		RemoveAt:function(/*int*/ index)
		{
			if (index < 0 || index >= this._size)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionOutOfRange"));
			}
			this.InternalRemove(this._items[index]);
		},
		
//		public void 
		RemoveRange:function(/*int*/ index, /*int*/ count)
		{
			if (index < 0 || index >= this._size)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionOutOfRange"));
			}
			if (count < 0)
			{
				throw new ArgumentOutOfRangeException(SR.Get("TableCollectionCountNeedNonNegNum"));
			}
			if (this._size - index < count)
			{
				throw new ArgumentException(SR.Get("TableCollectionRangeOutOfRange"));
			}
			this.OnModified();
			if (count > 0)
			{
				for (var i = index + count - 1; i >= index; i--)
				{
					this.DisconnectChild(this._items[i]);
				}
				this._size -= count;
				for (var j = index; j < this._size; j++)
				{
					this._items[j] = this._items[j + count];
					this._items[j].Index = j;
//					this._items[j + count] = null;
				}
				
				this._items.splice(index, count);
			}
			
		},
		
//		IEnumerator IEnumerable.
		GetEnumerator:function()
		{
			return new Enumerator(this);
		},
		
//		private void 
		ValidateAddition:function(/*object*/ value)
		{
			if (value == null)
			{
				throw new ArgumentNullException("value");
			}
			var definition = value instanceof DefinitionBase ? value : null;
			if (definition == null)
			{
				throw new ArgumentException(SR.Get("GridCollection_MustBeCertainType", ["DefinitionCollection",
				                                                    					"Definition"]));
			}
			if (definition.Parent != null)
			{
				throw new ArgumentException(SR.Get("GridCollection_InOtherCollection", ["value",
				                                                    					"DefinitionCollection"]));
			}
		},
		
//		private bool 
		ValidateRemoval:function(/*object*/ value)
		{
			if (value == null)
			{
				throw new ArgumentNullException("value");
			}
			var definition = value instanceof this.DefinitionType.Constructor ? value :null;
			if (definition == null)
			{
				throw new ArgumentException(SR.Get("GridCollection_MustBeCertainType", ["DefinitionCollection",
				                                                    					"Definition"]));
			}
			return columnDefinition.Parent == this._owner;
		},
		
//		private void 
		ConnectChild:function(/*int*/ index, /*DefinitionBase*/ definitionBase)
		{
			definitionBase.Index = index;
			this._owner.AddLogicalChild(definitionBase);
			definitionBase.OnEnterParentTree();
		},
		
//		private void 
		DisconnectChild:function(/*DefinitionBase*/ definitionBase)
		{
			definitionBase.OnExitParentTree();
			definitionBase.Index = -1;
			this._owner.RemoveLogicalChild(definitionBase);
		},
		
//		private void 
		InternalInsert:function(/*int*/ index, /*DefinitionBase*/ definitionBase)
		{
			this.OnModified();
			if (this._items == null)
			{
				this._items = [];
			}
			this._items.splice(index, 0, definitionBase);
			this._size++;
			this.ConnectChild(index, definitionBase);
		},
		
//		private void 
		InternalRemove:function(/*DefinitionBase*/ definitionBase)
		{
			this.OnModified();
			var index = value.Index;
			this.DisconnectChild(definitionBase);
			this._size--;
			this._items.splice(index, 1);
			
		},
		
//		private void 
		OnModified:function()
		{
			this._version++;
			
			if(this._definitionType.Constructor === ColumnDefinition){
				this._owner.ColumnDefinitionCollectionDirty = true;
			}else{
				this._owner.RowDefinitionCollectionDirty = true;
			}
			
			this._owner.Invalidate();
		}
	});
	
	Object.defineProperties(DefinitionCollection.prototype,{
		DefinitionType:
		{
			get:function(){
				return this._definitionType;
			}
		},
//		public int 
		Count:
		{
			get:function()
			{
				return this._size;
			}
		},
//		bool IList.
		IsFixedSize:
		{
			get:function()
			{
				return this._owner.MeasureOverrideInProgress || this._owner.ArrangeOverrideInProgress;
			}
		},
//		public bool 
		IsReadOnly:
		{
			get:function()
			{
				return this._owner.MeasureOverrideInProgress || this._owner.ArrangeOverrideInProgress;
			}
		},
	
//		internal int 
		InternalCount:
		{
			get:function()
			{
				return this._size;
			}
		},
//		internal DefinitionBase[] 
		InternalItems:
		{
			get:function()
			{
				return this._items;
			}
		}  
	});
	
	DefinitionCollection.Type = new Type("DefinitionCollection", DefinitionCollection, 
			[ICollection.Type]);
	DefinitionCollection.Enumerator = Enumerator;
	return DefinitionCollection;
});

