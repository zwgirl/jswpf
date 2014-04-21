/**
 * Second check 12-07
 * NotifyCollectionChangedEventArgs
 */ 

define(["dojo/_base/declare", "system/Type", "system/EventArgs", "specialized/NotifyCollectionChangedAction", "collections/ArrayList"], 
		function(declare, Type, EventArgs, NotifyCollectionChangedAction, ArrayList){
	var NotifyCollectionChangedEventArgs = declare("NotifyCollectionChangedEventArgs", EventArgs, {
		constructor:function( ){
//	        private int 
			this._newStartingIndex = -1;
//	        private int 
			this._oldStartingIndex = -1;
		},
 
//	    private void 
	    InitializeAddOrRemove:function(/*NotifyCollectionChangedAction*/ action, /*IList*/ changedItems, /*int*/ startingIndex)
        { 
            if (action == NotifyCollectionChangedAction.Add)
                this.InitializeAdd(action, changedItems, startingIndex);
            else if (action == NotifyCollectionChangedAction.Remove)
                this.InitializeRemove(action, changedItems, startingIndex); 
            else
                Contract.Assert(false, String.Format("Unsupported action: {0}", action.ToString())); 
        },

//        private void 
        InitializeAdd:function(/*NotifyCollectionChangedAction*/ action, /*IList*/ newItems, /*int*/ newStartingIndex) 
        {
            this._action = action;
            this._newItems = (newItems == null) ? null : newItems; //ArrayList.ReadOnly(newItems);
            this._newStartingIndex = newStartingIndex; 
        },
 
//        private void 
        InitializeRemove:function(/*NotifyCollectionChangedAction*/ action, /*IList*/ oldItems, /*int*/ oldStartingIndex) 
        {
        	this._action = action; 
        	this._oldItems = (oldItems == null) ? null : oldItems; //ArrayList.ReadOnly(oldItems);
        	this._oldStartingIndex= oldStartingIndex;
        },
 
//        private void 
        InitializeMoveOrReplace:function(/*NotifyCollectionChangedAction*/ action, /*IList*/ newItems, /*IList*/ oldItems, 
        		/*int*/ startingIndex, /*int*/ oldStartingIndex)
        { 
        	this.InitializeAdd(action, newItems, startingIndex); 
        	this.InitializeRemove(action, oldItems, oldStartingIndex);
        } 
	});
	
	Object.defineProperties(NotifyCollectionChangedEventArgs.prototype,{
        /// <summary>
        /// The action that caused the event. 
        /// </summary>
//        public NotifyCollectionChangedAction 
        Action:
        {
            get:function() { return this._action; } 
        },
 
        /// <summary> 
        /// The items affected by the change.
        /// </summary> 
//        public IList 
        NewItems:
        {
            get:function() { return this._newItems; }
        },

        /// <summary> 
        /// The old items affected by the change (for Replace events). 
        /// </summary>
//        public IList 
        OldItems:
        {
            get:function() { return this._oldItems; }
        },
 
        /// <summary>
        /// The index where the change occurred. 
        /// </summary> 
//        public int 
        NewStartingIndex:
        { 
            get:function() { return this._newStartingIndex; }
        },

        /// <summary> 
        /// The old index where the change occurred (for Move events).
        /// </summary> 
//        public int 
        OldStartingIndex:
        {
            get:function() { return this._oldStartingIndex; } 
        },
	});
	
    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a reset change.
    /// </summary> 
    /// <param name="action">The action that caused the event (must be Reset).</param>
	NotifyCollectionChangedEventArgs.BuildWithA = function(/*NotifyCollectionChangedAction*/ action)
    {
        if (action != NotifyCollectionChangedAction.Reset) 
            throw new ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Reset), "action");
        var result = new NotifyCollectionChangedEventArgs();

        result.InitializeAdd(action, null, -1); 
        
        return result;
    };

    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs that describes a one-item change.
    /// </summary>
    /// <param name="action">The action that caused the event; can only be Reset, Add or Remove action.</param> 
    /// <param name="changedItem">The item affected by the change.</param>
	NotifyCollectionChangedEventArgs.BuildWithAO = function(/*NotifyCollectionChangedAction*/ action, /*object*/ changedItem) 
    { 
        if ((action != NotifyCollectionChangedAction.Add) && (action != NotifyCollectionChangedAction.Remove)
                && (action != NotifyCollectionChangedAction.Reset)) 
            throw new ArgumentException(SR.GetString(SR.MustBeResetAddOrRemoveActionForCtor), "action");

        var result = new NotifyCollectionChangedEventArgs();
        if (action == NotifyCollectionChangedAction.Reset)
        { 
            if (changedItem != null)
                throw new ArgumentException(SR.GetString(SR.ResetActionRequiresNullItem), "action"); 
            

            result.InitializeAdd(action, null, -1);
        } 
        else
        {
        	 var changedItems = new ArrayList();
             changedItems.Add(changedItem);
        	result.InitializeAddOrRemove(action, changedItems, -1);
        } 
        
        return result;
    };

    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a one-item change.
    /// </summary> 
    /// <param name="action">The action that caused the event.</param>
    /// <param name="changedItem">The item affected by the change.</param>
    /// <param name="index">The index where the change occurred.</param>
	NotifyCollectionChangedEventArgs.BuildWithAOI = function(/*NotifyCollectionChangedAction*/ action,
			/*object*/ changedItem, /*int*/ index) 
    {
        if ((action != NotifyCollectionChangedAction.Add) && (action != NotifyCollectionChangedAction.Remove) 
                && (action != NotifyCollectionChangedAction.Reset)) 
            throw new Error('ArgumentException(SR.GetString(SR.MustBeResetAddOrRemoveActionForCtor), "action")');

        var result = new NotifyCollectionChangedEventArgs();
        if (action == NotifyCollectionChangedAction.Reset)
        {
            if (changedItem != null)
                throw new Error('ArgumentException(SR.GetString(SR.ResetActionRequiresNullItem), "action")'); 
            if (index != -1)
                throw new Error('ArgumentException(SR.GetString(SR.ResetActionRequiresIndexMinus1), "action")'); 

            result.InitializeAdd(action, null, -1);
        } 
        else
        {
            var changedItems = new ArrayList();
            changedItems.Add(changedItem);
        	result.InitializeAddOrRemove(action, changedItems, index);
        } 
        
        return result;
    };

    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a multi-item change.
    /// </summary> 
    /// <param name="action">The action that caused the event.</param>
    /// <param name="changedItems">The items affected by the change.</param>
	NotifyCollectionChangedEventArgs.Build2WithAL = function(/*NotifyCollectionChangedAction*/ action, /*IList*/ changedItems)
    { 
        if ((action != NotifyCollectionChangedAction.Add) && (action != NotifyCollectionChangedAction.Remove)
                && (action != NotifyCollectionChangedAction.Reset)) 
            throw new Error('ArgumentException(SR.GetString(SR.MustBeResetAddOrRemoveActionForCtor), "action")'); 

        var result = new NotifyCollectionChangedEventArgs();
        if (action == NotifyCollectionChangedAction.Reset) 
        {
            if (changedItems != null)
                throw new Error('ArgumentException(SR.GetString(SR.ResetActionRequiresNullItem), "action")');

            result.InitializeAdd(action, null, -1);
        } 
        else 
        {
            if (changedItems == null) 
                throw new Error('ArgumentNullException("changedItems")');

            result.InitializeAddOrRemove(action, changedItems, -1);
        } 
        return result;
    };

    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a multi-item change (or a reset).
    /// </summary> 
    /// <param name="action">The action that caused the event.</param>
    /// <param name="changedItems">The items affected by the change.</param>
    /// <param name="startingIndex">The index where the change occurred.</param>
    NotifyCollectionChangedEventArgs.BuildWithALI = function(/*NotifyCollectionChangedAction*/ action,
    		/*IList*/ changedItems, /*int*/ startingIndex) 
    {
        if ((action != NotifyCollectionChangedAction.Add) && (action != NotifyCollectionChangedAction.Remove) 
                && (action != NotifyCollectionChangedAction.Reset)) 
            throw new Error('ArgumentException(SR.GetString(SR.MustBeResetAddOrRemoveActionForCtor), "action")');

        var result = new NotifyCollectionChangedEventArgs();
        if (action == NotifyCollectionChangedAction.Reset)
        {
            if (changedItems != null)
                throw new Error('ArgumentException(SR.GetString(SR.ResetActionRequiresNullItem), "action")'); 
            if (startingIndex != -1)
                throw new Error('ArgumentException(SR.GetString(SR.ResetActionRequiresIndexMinus1), "action")'); 

            result.InitializeAdd(action, null, -1);
        } 
        else
        {
            if (changedItems == null)
                throw new Error('ArgumentNullException("changedItems")'); 
            if (startingIndex < -1)
                throw new Error('ArgumentException(SR.GetString(SR.IndexCannotBeNegative), "startingIndex")'); 

            result.InitializeAddOrRemove(action, changedItems, startingIndex);
        } 
        
        return result;
    };

    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs that describes a one-item Replace event. 
    /// </summary>
    /// <param name="action">Can only be a Replace action.</param> 
    /// <param name="newItem">The new item replacing the original item.</param> 
    /// <param name="oldItem">The original item that is replaced.</param>
    NotifyCollectionChangedEventArgs.BuildWithAOO = function(/*NotifyCollectionChangedAction*/ action, 
    		/*object*/ newItem, /*object*/ oldItem) 
    {
        if (action != NotifyCollectionChangedAction.Replace)
            throw new Error('ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Replace), "action")');

        var result = new NotifyCollectionChangedEventArgs();
        var newItems = new ArrayList(), oldItems = new ArrayList();
        newItems.Add(newItem);
        oldItems.Add(oldItem);
        
        result.InitializeMoveOrReplace(action, newItems, oldItems, -1, -1);
    }; 

    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs that describes a one-item Replace event. 
    /// </summary>
    /// <param name="action">Can only be a Replace action.</param>
    /// <param name="newItem">The new item replacing the original item.</param>
    /// <param name="oldItem">The original item that is replaced.</param> 
    /// <param name="index">The index of the item being replaced.</param>
    NotifyCollectionChangedEventArgs.BuildWithAOOI = function(/*NotifyCollectionChangedAction*/ action, 
    		/*object*/ newItem, /*object*/ oldItem, /*int*/ index) 
    { 
        if (action != NotifyCollectionChangedAction.Replace)
            throw new Error('ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Replace), "action")'); 

        var result = new NotifyCollectionChangedEventArgs();
        var newItems = new ArrayList(), oldItems = new ArrayList();
        newItems.Add(newItem);
        oldItems.Add(oldItem);
        
        result.InitializeMoveOrReplace(action, newItems, oldItems, index, index);
        return result;
    };

    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs that describes a multi-item Replace event. 
    /// </summary> 
    /// <param name="action">Can only be a Replace action.</param>
    /// <param name="newItems">The new items replacing the original items.</param> 
    /// <param name="oldItems">The original items that are replaced.</param>
    NotifyCollectionChangedEventArgs.BuildWithALL = function(/*NotifyCollectionChangedAction*/ action, 
    		/*IList*/ newItems, /*IList*/ oldItems)
    {
        if (action != NotifyCollectionChangedAction.Replace) 
            throw new Error('ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Replace), "action")');
        if (newItems == null) 
            throw new Error('ArgumentNullException("newItems")'); 
        if (oldItems == null)
            throw new Error('ArgumentNullException("oldItems")'); 

        var result = new NotifyCollectionChangedEventArgs();
        result.InitializeMoveOrReplace(action, newItems, oldItems, -1, -1);
        return result;
    };

    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs that describes a multi-item Replace event. 
    /// </summary> 
    /// <param name="action">Can only be a Replace action.</param>
    /// <param name="newItems">The new items replacing the original items.</param> 
    /// <param name="oldItems">The original items that are replaced.</param>
    /// <param name="startingIndex">The starting index of the items being replaced.</param>
    NotifyCollectionChangedEventArgs.BuildWithALLI = function(/*NotifyCollectionChangedAction*/ action, 
    		/*IList*/ newItems, /*IList*/ oldItems, /*int*/ startingIndex)
    { 
        if (action != NotifyCollectionChangedAction.Replace)
            throw new Error('ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Replace), "action")'); 
        if (newItems == null) 
            throw new Error('ArgumentNullException("newItems")');
        if (oldItems == null) 
            throw new Error('ArgumentNullException("oldItems")');

        var result = new NotifyCollectionChangedEventArgs();
        result.InitializeMoveOrReplace(action, newItems, oldItems, startingIndex, startingIndex);
        return result;
    }; 

    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a one-item Move event. 
    /// </summary>
    /// <param name="action">Can only be a Move action.</param> 
    /// <param name="changedItem">The item affected by the change.</param>
    /// <param name="index">The new index for the changed item.</param>
    /// <param name="oldIndex">The old index for the changed item.</param>
    NotifyCollectionChangedEventArgs.BuildWithAOII = function(/*NotifyCollectionChangedAction*/ action, 
    		/*object*/ changedItem, /*int*/ index, /*int*/ oldIndex) 
    {
        if (action != NotifyCollectionChangedAction.Move) 
            throw new Error('ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Move), "action")'); 
        if (index < 0)
            throw new Error('ArgumentException(SR.GetString(SR.IndexCannotBeNegative), "index")'); 
        var result = new NotifyCollectionChangedEventArgs();
//        object[] changedItems= new object[] {changedItem};
        var changedItems= new ArrayList();
        changedItems.Add(changedItem);
        result.InitializeMoveOrReplace(action, changedItems, changedItems, index, oldIndex);
        return result;
    }; 

    /// <summary> 
    /// Construct a NotifyCollectionChangedEventArgs that describes a multi-item Move event. 
    /// </summary>
    /// <param name="action">The action that caused the event.</param> 
    /// <param name="changedItems">The items affected by the change.</param>
    /// <param name="index">The new index for the changed items.</param>
    /// <param name="oldIndex">The old index for the changed items.</param>
    NotifyCollectionChangedEventArgs.BuildWithALII = function(/*NotifyCollectionChangedAction*/ action, 
    		/*IList*/ changedItems, /*int*/ index, /*int*/ oldIndex) 
    {
        if (action != NotifyCollectionChangedAction.Move) 
            throw new ArgumentException(SR.GetString(SR.WrongActionForCtor, NotifyCollectionChangedAction.Move), "action"); 
        if (index < 0)
            throw new ArgumentException(SR.GetString(SR.IndexCannotBeNegative), "index"); 
        var result = new NotifyCollectionChangedEventArgs();
        result.InitializeMoveOrReplace(action, changedItems, changedItems, index, oldIndex);
        return result;
    };
    
    /// <summary>
    /// Construct a NotifyCollectionChangedEventArgs with given fields (no validation). Used by WinRT marshaling. 
    /// </summary> 
//    internal NotifyCollectionChangedEventArgs
    NotifyCollectionChangedEventArgs.BuildWithALLII = function(/*NotifyCollectionChangedAction*/ action, /*IList*/ newItems, 
    		/*IList*/ oldItems, /*int*/ newIndex, /*int*/ oldIndex)
    { 
        this._action = action;
        this._newItems = (newItems == null) ? null : newItems; //ArrayList.ReadOnly(newItems);
        this._oldItems = (oldItems == null) ? null : oldItems; //ArrayList.ReadOnly(oldItems);
        this._newStartingIndex = newIndex; 
        this._oldStartingIndex = oldIndex;
    }; 


	NotifyCollectionChangedEventArgs.Type = new Type("NotifyCollectionChangedEventArgs", 
			NotifyCollectionChangedEventArgs, [EventArgs.Type]);
	return NotifyCollectionChangedEventArgs;
});

 

