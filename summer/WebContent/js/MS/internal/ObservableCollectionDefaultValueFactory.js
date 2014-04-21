/**
 * ObservableCollectionDefaultValueFactory
 */

define(["dojo/_base/declare", "system/" +
		"Type", "objectmodel/ObservableCollection", "internal/DefaultValueFactory",
        "windows/DependencyProperty", "system/Delegate"], 
		function(declare, Type, ObservableCollection, DefaultValueFactory,
				DependencyProperty, Delegate){
	
	/// <summary>
    ///     The ObservableCollectionDefaultPromoter observes the mutable defaults we hand out
    ///     for changed events.  If the default is ever modified this class will 
    ///     promote it to a local value by writing it to the local store and
    ///     clear the cached default value so we will generate a new default 
    ///     the next time the property system is asked for one. 
    /// </summary>
//    private class 
    var ObservableCollectionDefaultPromoter =declare(null, {
    	constructor:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property, /*ObservableCollection<T>*/ collection)
        {
//            Debug.Assert(owner != null && property != null, 
//                "Caller is responsible for ensuring that owner and property are non-null.");
//            Debug.Assert(property.GetMetadata(owner.DependencyObjectType).UsingDefaultValueFactory, 
//                "How did we end up observing a mutable if we were not registered for the factory pattern?"); 

            // We hang on to the property and owner so we can write the default 
            // value back to the local store if it changes.  See also
            // OnDefaultValueChanged.
            this._owner = owner;
            this._property = property; 
            this._collection = collection;
            this._collection.CollectionChanged.Combine(new Delegate(this, OnDefaultValueChanged)); 
        },
        
//        internal void 
        OnDefaultValueChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e) 
        {
            /*PropertyMetadata*/var metadata = this._property.GetMetadata(this._owner.DependencyObjectType);

            // Remove this value from the DefaultValue cache so we stop 
            // handing it out as the default value now that it has changed.
            metadata.ClearCachedDefaultValue(this._owner, this._property); 

            // If someone else hasn't already written a local value,
            // promote the default value to local. 
            if (this._owner.ReadLocalValue(this._property) == DependencyProperty.UnsetValue)
            {
                // Read-only properties must be set using the Key
                if (this._property.ReadOnly) 
                {
                	this._owner.SetValue(this._property.DependencyPropertyKey, this._collection); 
                } 
                else
                { 
                	this._owner.SetValue(this._property, this._collection);
                }
            }

            // Unhook the change handler because we're finsihed promoting
            this._collection.CollectionChanged.Remove(new Delegate(this, OnDefaultValueChanged)); 
        } 
    });

	
	var ObservableCollectionDefaultValueFactory = declare("ObservableCollectionDefaultValueFactory", DefaultValueFactory,{
		constructor:function(){
            this._default = new ObservableCollection/*<T>*/();
		},
		
		/// <summary>
        /// </summary>
//        internal override object 
        CreateDefaultValue:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property) 
        {
//            Debug.Assert(owner != null && property != null, 
//                "It is the caller responsibility to ensure that owner and property are non-null."); 

            var result = new ObservableCollection/*<T>*/(); 

            // Wire up a ObservableCollectionDefaultPromoter to observe the default value we
            // just created and automatically promote it to local if it is modified.
            // NOTE: We do not holding a reference to this because it should have the same lifetime as 
            // the collection.  It will not be immediately GC'ed because it hooks the collections change event.
            new ObservableCollectionDefaultPromoter(owner, property, result); 
 
            return result;
        } 
	});
	
	Object.defineProperties(ObservableCollectionDefaultValueFactory.prototype,{
        /// <summary>
        ///     This is used for Sealed objects.  ObservableCollections are inherently mutable, so they shouldn't 
        ///     be used with sealed objects.  The PropertyDescriptor calls this, so we'll just return the same empty collection.
        /// </summary>
//        internal override object 
        DefaultValue:
        { 
            get:function()
            { 
                return this._default; 
            }
        }
	});
	
	ObservableCollectionDefaultValueFactory.Type = new Type("ObservableCollectionDefaultValueFactory", 
			ObservableCollectionDefaultValueFactory, [DefaultValueFactory.Type]);
	return ObservableCollectionDefaultValueFactory;
});

