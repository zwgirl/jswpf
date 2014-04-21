/**
 * FreezableDefaultValueFactory
 */

define(["dojo/_base/declare", "system/Type", "internal/DefaultValueFactory",
        "system/Delegate", "windows/Freezable"], 
		function(declare, Type, DefaultValueFactory,
				Delegate, Freezable){
	
	 /// <summary>
    ///     The FreezableDefaultPromoter observes the mutable defaults we hand out
    ///     for changed events.  If the default is ever modified this class will 
    ///     promote it to a local value by writing it to the local store and
    ///     clear the cached default value so we will generate a new default 
    ///     the next time the property system is asked for one. 
    /// </summary>
//    private class 
	var FreezableDefaultPromoter = declare(Object,  
    {
        constructor:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property)
        {
//            Debug.Assert(owner != null && property != null, 
//                "Caller is responsible for ensuring that owner and property are non-null.");
//            Debug.Assert(!(owner is Freezable) || !((Freezable)owner).IsFrozen, 
//                "We should not be observing mutables on a frozen owner."); 
//            Debug.Assert(property.GetMetadata(owner.DependencyObjectType).UsingDefaultValueFactory,
//                "How did we end up observing a mutable if we were not registered for the factory pattern?"); 

            // We hang on to the property and owner so we can write the default
            // value back to the local store if it changes.  See also
            // OnDefaultValueChanged. 
            this._owner = owner;
            this._property = property; 
        }, 

//        internal void 
        OnDefaultValueChanged:function(/*object*/ sender, /*EventArgs*/ e) 
        {
//            Debug.Assert(_mutableDefaultValue != null,
//                "Promoter's creator should have called SetFreezableDefaultValue.");

            var metadata = this._property.GetMetadata(this._owner.DependencyObjectType);

            // Remove this value from the DefaultValue cache so we stop 
            // handing it out as the default value now that it has changed.
            metadata.ClearCachedDefaultValue(this._owner, this._property); 

            // Since Changed is raised when the user freezes the default
            // value, we need to check before removing our handler.
            // (If the value is frozen, it will remove it's own handlers.) 
            if (!this._mutableDefaultValue.IsFrozen)
            { 
            	this._mutableDefaultValue.Changed.Remove(new Delegate(this, this.OnDefaultValueChanged)); 
            }

            // If someone else hasn't already written a local local value,
            // promote the default value to local.
            if (this._owner.ReadLocalValue(this._property) == Type.UnsetValue)
            { 
            	this._owner.SetMutableDefaultValue(this._property, this._mutableDefaultValue);
            } 
        }, 

//        private readonly DependencyObject _owner; 
//        private readonly DependencyProperty _property;

        // The creator of a FreezableDefaultValuePromoter should call this method
        // so that we can verify that the changed sender is the mutable default 
        // value we handed out. 
//        internal void 
        SetFreezableDefaultValue:function(/*Freezable*/ mutableDefaultValue)
        { 
            this._mutableDefaultValue = mutableDefaultValue;
        }


//        private Freezable _mutableDefaultValue;

    });
    
	var FreezableDefaultValueFactory = declare("FreezableDefaultValueFactory", DefaultValueFactory,{
		constructor:function(/*Freezable*/ defaultValue){
//            Debug.Assert(defaultValue != null,
//            "Null can not be made mutable.  Do not use FreezableDefaultValueFactory.");
//            Debug.Assert(defaultValue.CanFreeze, 
//            "The defaultValue prototype must be freezable.");

			this._defaultValuePrototype = defaultValue.GetAsFrozen(); 
		},
 
        /// <summary>
        ///     If the DO is frozen, we'll return our frozen sentinel. Otherwise we'll make 
        ///     an unfrozen copy. 
        /// </summary>
//        internal override object 
		CreateDefaultValue:function(/*DependencyObject*/ owner, /*DependencyProperty*/ property) 
        {
//            Debug.Assert(owner != null && property != null,
//                "It is the caller responsibility to ensure that owner and property are non-null.");
 
            /*Freezable*/var result = this._defaultValuePrototype;
            /*Freezable*/var ownerFreezable = owner instanceof Freezable ? owner : null; 
 
            // If the owner is frozen, just return the frozen prototype.
            if (ownerFreezable != null && ownerFreezable.IsFrozen) 
            {
                return result;
            }
 
            result = this._defaultValuePrototype.Clone();
 
            // Wire up a FreezableDefaultPromoter to observe the default value we 
            // just created and automatically promote it to local if it is modified.
            /*FreezableDefaultPromoter*/var promoter = new FreezableDefaultPromoter(owner, property); 
            promoter.SetFreezableDefaultValue(result);
            result.Changed.Combine(new Delegate(this, promoter.OnDefaultValueChanged));

            return result; 
        }
	});
	
	Object.defineProperties(FreezableDefaultValueFactory.prototype,{
        /// <summary>
        ///     Returns our frozen sentinel
        /// </summary>
//        internal override object 
		DefaultValue: 
        {
            get:function() 
            { 
//                Debug.Assert(_defaultValuePrototype.IsFrozen);
 
                return this._defaultValuePrototype;
            }
        }  
	});
	
	Object.defineProperties(FreezableDefaultValueFactory,{
		  
	});
	
	FreezableDefaultValueFactory.Type = new Type("FreezableDefaultValueFactory", 
			FreezableDefaultValueFactory, [DefaultValueFactory.Type]);
	return FreezableDefaultValueFactory;
});


