/**
 * TransformGroup
 */

define(["dojo/_base/declare", "system/Type", "media/Transform"], 
		function(declare, Type, Transform){
	var TransformGroup = declare("TransformGroup", Transform,{
		constructor:function(){
		},
//		internal override bool 
		CanSerializeToString:function() { return false; },
		 
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TransformGroup 
		Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new TransformGroup 
        CloneCurrentValue:function()
        {
            return base.CloneCurrentValue();
        },
        
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns>
//        protected override Freezable 
        CreateInstanceCore:function() 
        { 
            return new TransformGroup();
        } 
	});
	
	Object.defineProperties(TransformGroup.prototype,{
		///<summary>
        /// Return the current transformation value.
        ///</summary>
//        public override Matrix 
		Value:
        {
            get:function() 
            { 
            	this.ReadPreamble();
 
                /*TransformCollection*/var children = this.Children;
                if ((children == null) || (children.Count == 0))
                {
                    return new Matrix(); 
                }
 
                var transform = children.Internal_GetItem(0).Value; 

                for (var i = 1; i < children.Count; i++) 
                {
                    transform *= children.Internal_GetItem(i).Value;
                }
 
                return transform;
            } 
        },
        
        ///<summary>
        /// Returns true if transformation matches the identity transform.
        ///</summary> 
//        internal override bool 
        IsIdentity:
        { 
            get:function() 
            {
                /*TransformCollection*/var children = this.Children; 
                if ((children == null) || (children.Count == 0))
                {
                    return true;
                } 

                for (var i = 0; i < children.Count; i++) 
                { 
                    if (!children.Internal_GetItem(i).IsIdentity)
                    { 
                        return false;
                    }
                }
 
                return true;
            } 
        },
        /// <summary> 
        ///     Children - TransformCollection.  Default value is new FreezableDefaultValueFactory(TransformCollection.Empty).
        /// </summary> 
//        public TransformCollection 
        Children: 
        {
            get:function() 
            {
                return this.GetValue(TransformGroup.ChildrenProperty);
            },
            set:function(value) 
            {
                this.SetValueInternal(TransformGroup.ChildrenProperty, value); 
            } 
        }
        
	});
	
	Object.defineProperties(TransformGroup,{
		  
	});
	
//    private static void 
	function ChildrenPropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        // The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children)
        // will promote the property value from a default value to a local value. This is technically a sub-property 
        // change because the collection was changed and not a new collection set (GeometryGroup.Children. 
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled
        // the default value to the compositor. If the property changes from a default value, the new local value 
        // needs to be marshalled to the compositor. We detect this scenario with the second condition
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange && 
           (e.OldValueSource == e.NewValueSource))
        { 
            return; 
        }


        var target = d;


        // If this is both non-null and mutable, we need to unhook the Changed event.
        var oldCollection = null; 
        var newCollection = null; 

        if ((e.OldValueSource != BaseValueSourceInternal.Default) || e.IsOldValueModified) 
        {
            oldCollection = e.OldValue;
            if ((oldCollection != null) && !oldCollection.IsFrozen)
            { 
                oldCollection.ItemRemoved -= target.ChildrenItemRemoved;
                oldCollection.ItemInserted -= target.ChildrenItemInserted; 
            } 
        }

        // If this is both non-null and mutable, we need to hook the Changed event.
        if ((e.NewValueSource != BaseValueSourceInternal.Default) || e.IsNewValueModified)
        {
            newCollection = (TransformCollection) e.NewValue; 
            if ((newCollection != null) && !newCollection.IsFrozen)
            { 
                newCollection.ItemInserted += target.ChildrenItemInserted; 
                newCollection.ItemRemoved += target.ChildrenItemRemoved;
            } 
        }
//        if (oldCollection != newCollection && target.Dispatcher != null)
//        {
//            using (CompositionEngineLock.Acquire()) 
//            {
//                DUCE.IResource targetResource = (DUCE.IResource)target; 
//                int channelCount = targetResource.GetChannelCount(); 
//
//                for (int channelIndex = 0; channelIndex < channelCount; channelIndex++) 
//                {
//                    DUCE.Channel channel = targetResource.GetChannel(channelIndex);
//                    Debug.Assert(!channel.IsOutOfBandChannel);
//                    Debug.Assert(!targetResource.GetHandle(channel).IsNull); 
//                    // resource shouldn't be null because
//                    // 1) If the field is one of our collections, we don't allow null elements 
//                    // 2) Codegen already made sure the collection contains DUCE.IResources 
//                    // ... so we'll Assert it
//
//                    if (newCollection != null)
//                    {
//                        int count = newCollection.Count;
//                        for (int i = 0; i < count; i++) 
//                        {
//                            DUCE.IResource resource = newCollection.Internal_GetItem(i) as DUCE.IResource; 
//                            Debug.Assert(resource != null); 
//                            resource.AddRefOnChannel(channel);
//                        } 
//                    }
//
//                    if (oldCollection != null)
//                    { 
//                        int count = oldCollection.Count;
//                        for (int i = 0; i < count; i++) 
//                        { 
//                            DUCE.IResource resource = oldCollection.Internal_GetItem(i) as DUCE.IResource;
//                            Debug.Assert(resource != null); 
//                            resource.ReleaseOnChannel(channel);
//                        }
//                    }
//                } 
//            }
//        } 
        target.PropertyChanged(TransformGroup.ChildrenProperty); 
    }
    
//    internal static TransformCollection
    var s_Children = TransformCollection.Empty;

//    static TransformGroup() 
    function Initialize()
    {
        // We check our static default fields which are of type Freezable 
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime
        // of your app.  (Windows OS Bug #947272) 
        //
//        Debug.Assert(s_Children == null || s_Children.IsFrozen,
//            "Detected context bound default value TransformGroup.s_Children (See OS Bug #947272).");

        // Initializations 
    	TransformGroup.ChildrenProperty =
              RegisterProperty("Children", 
                               TransformCollection.Type,
                               TransformGroup.Type,
                               new FreezableDefaultValueFactory(null, TransformCollection.Empty),
                               new PropertyChangedCallback(null, ChildrenPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null); 
    }
	
	TransformGroup.Type = new Type("TransformGroup", TransformGroup, [Transform.Type]);
	Initialize();
	
	return TransformGroup;
});

 


