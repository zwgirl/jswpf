/**
 * GeometryGroup
 */

define(["dojo/_base/declare", "system/Type", "media/Geometry"], 
		function(declare, Type, Geometry){
	var GeometryGroup = declare("GeometryGroup", Geometry,{
		constructor:function(){
		},
        /// <summary> 
        /// GetPathGeometryData - returns a struct which contains this Geometry represented 
        /// as a path geometry's serialized format.
        /// </summary> 
//        internal override PathGeometryData 
		GetPathGeometryData:function()
        {
            PathGeometry pathGeometry = GetAsPathGeometry();
 
            return pathGeometry.GetPathGeometryData();
        }, 
 
//        internal override PathGeometry 
        GetAsPathGeometry:function()
        { 
            var pg = new PathGeometry();
            pg.AddGeometry(this);

            pg.FillRule = FillRule; 

//            Debug.Assert(pg.CanFreeze); 
 
            return pg;
        },
        
//        internal override PathFigureCollection 
        GetTransformedFigureCollection:function(/*Transform*/ transform)
        { 
            // Combine the transform argument with the internal transform 
            var combined = new MatrixTransform(GetCombinedMatrix(transform));
 
            var result = new PathFigureCollection();
            /*GeometryCollection*/var children = this.Children;

            if (children != null) 
            {
                for (var i = 0; i < children.Count; i++) 
                { 
                    /*PathFigureCollection*/var pathFigures = children.Internal_GetItem(i).GetTransformedFigureCollection(combined);
                    if (pathFigures != null) 
                    {
                        var count = pathFigures.Count;
                        for (var j = 0; j < count; ++j)
                        { 
                            result.Add(pathFigures[j]);
                        } 
                    } 
                }
            } 

            return result;
        },
 
        /// <summary>
        /// Returns true if this geometry is empty 
        /// </summary>
//        public override bool 
        IsEmpty:function()
        {
            /*GeometryCollection*/var children = this.Children; 
            if (children == null)
            { 
                return true; 
            }
 
            for (var i=0; i<children.Count; i++)
            {
                if (!children.Get(i).IsEmpty())
                { 
                    return false;
                } 
            } 

            return true; 
        },

//        internal override bool 
        IsObviouslyEmpty:function()
        { 
            /*GeometryCollection*/var children = this.Children;
            return (children == null) || (children.Count == 0); 
        }, 

        /// <summary>
        /// Returns true if this geometry may have curved segments
        /// </summary> 
//        public override bool 
        MayHaveCurves:function()
        { 
            /*GeometryCollection*/var children = this.Children; 
            if (children == null)
            { 
                return false;
            }

            for (var i = 0; i < children.Count; i++) 
            {
                if (children.Get(i).MayHaveCurves()) 
                { 
                    return true;
                } 
            }

            return false;
        },

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GeometryGroup 
        Clone:function()
        {
            return base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new GeometryGroup 
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
            return new GeometryGroup();
        } 
	});
	
	Object.defineProperties(GeometryGroup.prototype,{
		 /// <summary>
        ///     FillRule - FillRule.  Default value is FillRule.EvenOdd.
        /// </summary> 
//        public FillRule 
		FillRule:
        { 
            get:function() 
            {
                return this.GetValue(GeometryGroup.FillRuleProperty); 
            },
            set:function(value)
            {
            	this.SetValueInternal(GeometryGroup.FillRuleProperty, value); 
            }
        },
 
        /// <summary>
        ///     Children - GeometryCollection.  Default value is new FreezableDefaultValueFactory(GeometryCollection.Empty). 
        /// </summary>
//        public GeometryCollection 
        Children:
        {
            get:function() 
            {
                return this.GetValue(GeometryGroup.ChildrenProperty); 
            },
            set:function(value)
            { 
            	this.SetValueInternal(GeometryGroup.ChildrenProperty, value);
            }
        }  
	});
	
	Object.defineProperties(GeometryGroup,{
		  
	});
	
//	private static void 
	function FillRulePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        GeometryGroup target = ((GeometryGroup) d);
        d.PropertyChanged(GeometryGroup.FillRuleProperty); 
    }
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


//        GeometryGroup target = ((GeometryGroup) d); 
//
//
//        // If this is both non-null and mutable, we need to unhook the Changed event.
//        GeometryCollection oldCollection = null; 
//        GeometryCollection newCollection = null;
//
//        if ((e.OldValueSource != BaseValueSourceInternal.Default) || e.IsOldValueModified) 
//        {
//            oldCollection = (GeometryCollection) e.OldValue; 
//            if ((oldCollection != null) && !oldCollection.IsFrozen)
//            {
//                oldCollection.ItemRemoved -= target.ChildrenItemRemoved;
//                oldCollection.ItemInserted -= target.ChildrenItemInserted; 
//            }
//        } 
//
//        // If this is both non-null and mutable, we need to hook the Changed event.
//        if ((e.NewValueSource != BaseValueSourceInternal.Default) || e.IsNewValueModified) 
//        {
//            newCollection = (GeometryCollection) e.NewValue;
//            if ((newCollection != null) && !newCollection.IsFrozen)
//            { 
//                newCollection.ItemInserted += target.ChildrenItemInserted;
//                newCollection.ItemRemoved += target.ChildrenItemRemoved; 
//            } 
//        }
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
        d.PropertyChanged(GeometryGroup.ChildrenProperty);
    }
	
//	internal const FillRule 
	var c_FillRule = FillRule.EvenOdd; 
//	internal static GeometryCollection 
	var s_Children = GeometryCollection.Empty;

//	static GeometryGroup()
	function Initialize()
	{
	    // We check our static default fields which are of type Freezable 
	    // to make sure that they are not mutable, otherwise we will throw 
	    // if these get touched by more than one thread in the lifetime
	    // of your app.  (Windows OS Bug #947272) 
	    //
//	    Debug.Assert(s_Children == null || s_Children.IsFrozen,
//	        "Detected context bound default value GeometryGroup.s_Children (See OS Bug #947272).");
		GeometryGroup.FillRuleProperty =
	          RegisterProperty("FillRule", 
	                           Number.Type,
	                           GeometryGroup.Type,
	                           FillRule.EvenOdd,
	                           new PropertyChangedCallback(null, FillRulePropertyChanged), 
	                           new ValidateValueCallback(System.Windows.Media.ValidateEnums.IsFillRuleValid),
	                           /* isIndependentlyAnimated  = */ false, 
	                           /* coerceValueCallback */ null); 
	    GeometryGroup.ChildrenProperty =
	          RegisterProperty("Children", 
	                           GeometryCollection.Type,
	                           GeometryGroup.Type,
	                           new FreezableDefaultValueFactory(null, GeometryCollection.Empty),
	                           new PropertyChangedCallback(ChildrenPropertyChanged), 
	                           null,
	                           /* isIndependentlyAnimated  = */ false, 
	                           /* coerceValueCallback */ null); 
	}	  
	
	GeometryGroup.Type = new Type("GeometryGroup", GeometryGroup, [Geometry.Type]);
	return GeometryGroup;
});
 
   
 

