/**
 * Adorner
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement"], 
		function(declare, Type, FrameworkElement){
	var Adorner = declare("Adorner", FrameworkElement,{
		constructor:function(/*UIElement*/ adornedElement)
        { 
            if (adornedElement == null) 
                throw new ArgumentNullException("adornedElement");
 
            this._adornedElement = adornedElement;
            this._isClipEnabled = false;

            // Bug 1383424: We need to make sure our FlowDirection is always that of our adorned element. 
            // Need to allow derived class constructor to execute first
            Dispatcher.CurrentDispatcher.BeginInvoke(DispatcherPriority.Normal, new DispatcherOperationCallback(CreateFlowDirectionBinding), this); 
        },
        
        /// <summary>
        /// Measure adorner.  Default behavior is to size to match the adorned element.
        /// </summary>
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint) 
        {
            var desiredSize; 
 
            desiredSize = new Size(AdornedElement.RenderSize.Width, AdornedElement.RenderSize.Height);
 
            var count = this.VisualChildrenCount;
            for (var i = 0; i < count; i++)
            {
                var ch = this.GetVisualChild(i);
                ch = ch instanceof UIElement ? ch : null; 
                if (ch != null)
                { 
                    ch.Measure(desiredSize); 
                }
            } 

            return desiredSize;
        },
 
        /// <summary>
        /// Override of <seealso cref="UIElement.GetLayoutClip"/>. 
        /// </summary> 
        /// <returns>null</returns>
        /// <remarks> 
        /// Clip gets generated before transforms are applied, which means that
        /// Adorners can get inappropriately clipped if they draw outside of the bounding rect
        /// of the element they're adorning.  This is against the Adorner philosophy of being
        /// topmost, so we choose to ignore clip instead.</remarks> 
//        protected override Geometry 
        GetLayoutClip:function(/*Size*/ layoutSlotSize)
        { 
            return null; 
        },

        /// <summary>
        /// Adorners don't always want to be transformed in the same way as the elements they
        /// adorn.  Adorners which adorn points, such as resize handles, want to be translated 
        /// and rotated but not scaled.  Adorners adorning an object, like a marquee, may want
        /// all transforms.  This method is called by AdornerLayer to allow the adorner to 
        /// filter out the transforms it doesn't want and return a new transform with just the 
        /// transforms it wants applied.  An adorner can also add an additional translation
        /// transform at this time, allowing it to be positioned somewhere other than the upper 
        /// left corner of its adorned element.
        /// </summary>
        /// <param name="transform">The transform applied to the object the adorner adorns</param>
        /// <returns>Transform to apply to the adorner</returns> 
//        public virtual GeneralTransform 
        GetDesiredTransform:function(/*GeneralTransform*/ transform)
        { 
            return transform; 
        },
        /// <summary>
        /// Says if the Adorner needs update based on the 
        /// previously cached size if the AdornedElement. 
        /// </summary>
//        internal virtual bool 
        NeedsUpdate:function(/*Size*/ oldSize) 
        {
            return !DoubleUtil.AreClose(AdornedElement.RenderSize, oldSize);
        }
	});
	
	Object.defineProperties(Adorner.prototype,{
	    /// <summary>
        /// Gets or sets the clip of this Visual. 
        /// Needed by AdornerLayer
        /// </summary> 
//        internal Geometry 
		AdornerClip: 
        {
            get:function() 
            {
                return Clip;
            },
            set:function(value) 
            {
                Clip = value; 
            } 
        },
 

        /// <summary>
        /// Gets or sets the transform of this Visual.
        /// Needed by AdornerLayer 
        /// </summary>
//        internal Transform 
        AdornerTransform: 
        { 
            get:function()
            { 
                return RenderTransform;
            },
            set:function(value)
            { 
                RenderTransform = value;
            } 
        }, 

        /// <summary> 
        /// UIElement this Adorner adorns.
        /// </summary>
//        public UIElement 
        AdornedElement:
        { 
            get:function() { return _adornedElement; }
        }, 
 
        /// <summary>
        /// If set to true, the adorner will be clipped using the same clip geometry as the 
        /// AdornedElement.  This is expensive, and therefore should not normally be used.
        /// Defaults to false.
        /// </summary>
//        public bool 
        IsClipEnabled: 
        {
            get:function() 
            { 
                return _isClipEnabled;
            },
            set:function(value)
            {
                _isClipEnabled = value; 
                InvalidateArrange();
                AdornerLayer.GetAdornerLayer(_adornedElement).InvalidateArrange(); 
            } 
        }  
	});
	
	Object.defineProperties(Adorner,{
		  
	});
	
    // Callback for binding the FlowDirection property.
//    private static object 
	function CreateFlowDirectionBinding(/*object*/ o)
    { 
        var binding = new Binding("FlowDirection"); 
        binding.Mode = BindingMode.OneWay; 
        binding.Source = o.AdornedElement;
        adorner.SetBinding(FlowDirectionProperty, binding); 

        return null;
    }
	
	Adorner.Type = new Type("Adorner", Adorner, [FrameworkElement.Type]);
	return Adorner;
});

