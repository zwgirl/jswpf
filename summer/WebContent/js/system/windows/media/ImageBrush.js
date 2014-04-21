/**
 * ImageBrush
 */
/// <summary> 
/// ImageBrush - This TileBrush defines its content as an Image
/// </summary> 
define(["dojo/_base/declare", "system/Type", "media/TileBrush"], 
		function(declare, Type, TileBrush){
	var ImageBrush = declare("ImageBrush", TileBrush,{
		constructor:function(/*ImageSource*/ image) 
        {
			if(image === undefined){
				image = null;
			}
			
            this.ImageSource = image;
		},
		
		/// <summary> 
        /// Obtains the current bounds of the brush's content
        /// </summary>
        /// <param name="contentBounds"> Output bounds of content </param>
//        protected override void 
		GetContentBounds:function(/*out Rect */contentBounds) 
        {
            // Note, only implemented for DrawingImages. 
 
//            contentBounds = Rect.Empty;
//            DrawingImage di = ImageSource as DrawingImage; 
//            if (di != null)
//            {
//                Drawing drawing = di.Drawing;
//                if (drawing != null) 
//                {
//                    contentBounds = drawing.Bounds; 
//                } 
//            }
        },
        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ImageBrush 
        Clone:function()
        {
            return /*(ImageBrush)*/base.Clone();
        }, 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
//        public new ImageBrush 
        CloneCurrentValue:function()
        {
            return /*(ImageBrush)*/base.CloneCurrentValue();
        },
        
        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>.
        /// </summary> 
        /// <returns>The new Freezable.</returns> 
//        protected override Freezable 
        CreateInstanceCore:function()
        { 
            return new ImageBrush();
        }
	});
	
	Object.defineProperties(ImageBrush.prototype,{
        /// <summary> 
        ///     ImageSource - ImageSource.  Default value is null. 
        /// </summary>
//        public ImageSource 
		ImageSource:
        {
            get:function()
            {
                return this.GetValue(ImageBrush.ImageSourceProperty); 
            },
            set:function(value) 
            { 
            	this.SetValueInternal(ImageBrush.ImageSourceProperty, value);
            } 
        }  
	});
	
	Object.defineProperties(ImageBrush,{
		  
	});
	
//    private static void 
	function ImageSourcePropertyChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
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


//        ImageBrush target = ((ImageBrush) d);
//
//
//        ImageSource oldV = (ImageSource) e.OldValue;
//        ImageSource newV = (ImageSource) e.NewValue; 
//        System.Windows.Threading.Dispatcher dispatcher = target.Dispatcher; 
//
//        if (dispatcher != null) 
//        {
//            DUCE.IResource targetResource = (DUCE.IResource)target;
//            using (CompositionEngineLock.Acquire())
//            { 
//                int channelCount = targetResource.GetChannelCount();
//
//                for (int channelIndex = 0; channelIndex < channelCount; channelIndex++) 
//                {
//                    DUCE.Channel channel = targetResource.GetChannel(channelIndex); 
//                    Debug.Assert(!channel.IsOutOfBandChannel);
//                    Debug.Assert(!targetResource.GetHandle(channel).IsNull);
//                    target.ReleaseResource(oldV,channel);
//                    target.AddRefResource(newV,channel); 
//                }
//            } 
//        } 

        d.PropertyChanged(ImageBrush.ImageSourceProperty); 
    }
	
//	 static ImageBrush() 
     function Initialize(){
         // We check our static default fields which are of type Freezable
         // to make sure that they are not mutable, otherwise we will throw
         // if these get touched by more than one thread in the lifetime 
         // of your app.  (Windows OS Bug #947272)
         // 


         // Initializations 
         ImageBrush.ImageSourceProperty =
               RegisterProperty("ImageSource",
                                /*typeof(ImageSource)*/String, 
                                ImageBrush.Type,
                                null, 
                                new PropertyChangedCallback(null, ImageSourcePropertyChanged), 
                                null,
                                /* isIndependentlyAnimated  = */ false, 
                                /* coerceValueCallback */ null);
     }
	
	ImageBrush.Type = new Type("ImageBrush", ImageBrush, [TileBrush.Type]);
	return ImageBrush;
});

