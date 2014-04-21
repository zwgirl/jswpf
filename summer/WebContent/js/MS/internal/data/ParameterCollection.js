/**
 * ParameterCollection
 */

define(["dojo/_base/declare", "system/Type", "objectmodel/Collection", "collections/IList"], 
		function(declare, Type, Collection, IList){
	var ParameterCollection = declare([Collection, IList],{
		constructor:function(/*ParameterCollectionChanged*/ parametersChanged)
        {
            this._parametersChanged = parametersChanged; 
            
            Collection.prototype.constructor.call(this);
		},
		
//	    protected override void 
	    ClearItems:function() 
        {
            this.CheckReadOnly();
            Collection.prototype.ClearItems.call(this);
            this.OnCollectionChanged(); 
        },
 
//        protected override void 
        InsertItem:function(/*int*/ index, /*object*/ value) 
        {
        	this.CheckReadOnly(); 
        	Collection.prototype.InsertItem.call(this, index, value);
            this.OnCollectionChanged();
        },
 
//        protected override void 
        RemoveItem:function(/*int*/ index)
        { 
        	this.CheckReadOnly(); 
        	Collection.prototype.RemoveItem.call(this, index);
            this.OnCollectionChanged(); 
        },

//        protected override void 
        SetItem:function(/*int*/ index, /*object*/ value)
        { 
        	this.CheckReadOnly();
        	Collection.prototype.SetItem.call(this, index, value); 
            this.OnCollectionChanged(); 
        },

        /// <summary>
        /// sets whether the collection is read-only 
        /// </summary> 
//        internal void 
        SetReadOnly:function(/*bool*/ isReadOnly)
        { 
            this.IsReadOnly = isReadOnly;
        },

        /// <summary> 
        /// silently clear the list.
        /// </summary> 
        /// <remarks> 
        /// this internal method is not affected by the state of IsReadOnly.
        /// </remarks> 
//        internal void 
        ClearInternal:function()
        {
        	Collection.prototype.ClearItems.call(this);
        }, 

 
//        private void 
        CheckReadOnly:function() 
        {
            if (this.IsReadOnly) 
            {
                throw new Error('InvalidOperationException(SR.Get(SRID.ObjectDataProviderParameterCollectionIsNotInUse)');
            }
        }, 

        /// <summary> 
        /// notify ObjectDataProvider that the parameters have changed 
        /// </summary>
//        private void 
        OnCollectionChanged:function() 
        {
            this._parametersChanged.Invoke(this);
        }
	});
	
	Object.defineProperties(ParameterCollection.prototype,{

//        protected virtual bool 
        IsReadOnly:
        {
            get:function() 
            {
                return this._isReadOnly; 
            },
            set:function(value)
            { 
            	this._isReadOnly = value;
            }
        },
 
//        protected bool 
        IsFixedSize:
        { 
            get:function() 
            {
                return this.IsReadOnly; 
            }
        }
	});
	
	ParameterCollection.Type = new Type("ParameterCollection", ParameterCollection, [Collection.Type, IList.Type]);
	return ParameterCollection;
});

