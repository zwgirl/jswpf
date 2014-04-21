/**
 * PopupRoot
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement"], 
		function(declare, Type, FrameworkElement){
	var PopupRoot = declare("PopupRoot", FrameworkElement,{
		constructor:function(){
			this.Initialize();
		},
		

//        private void 
		Initialize:function()
        {
            // Popup root has a decorator used for 
            // applying the transforms
            this._transformDecorator = new Decorator(); 
 
            this.AddVisualChild(this._transformDecorator);
 
            // Clip so animations do not extend beyond its bounds
            this._transformDecorator.ClipToBounds = true;

            // Under the transfrom decorator is an Adorner 
            // decorator that handles rendering adorners
            // and the animated popup translations 
            this._adornerDecorator = new NonLogicalAdornerDecorator(); 
            this._transformDecorator.Child = this._adornerDecorator;
        },
        
        /// <summary> 
        /// Returns the child at the specified index.
        /// </summary> 
//        protected override Visual 
        GetVisualChild:function(/*int*/ index) 
        {
            if (index != 0) 
            {
                throw new ArgumentOutOfRangeException("index", index, SR.Get(SRID.Visual_ArgumentOutOfRange));
            }
 
            return this._transformDecorator;
        }, 

        /// <summary>
        ///     Invoked when remeasuring the control is required.
        /// </summary> 
        /// <param name="constraint">The control cannot return a size larger than the constraint.</param>
        /// <returns>The size of the child restricted to 75% of screen</returns> 
//        protected override Size 
        MeasureOverride:function(/*Size*/ constraint) 
        {
            // Measure with no constraints to see how big the content wants to be. 
//            Size desiredSize = new Size(Double.PositiveInfinity, Double.PositiveInfinity);
            var popup = this.Parent instanceof Popup ? this.Parent : null;

            try 
            {
            	this._transformDecorator.Measure(desiredSize); 
            } 
            catch (/*Exception*/ e)
            { 
                // there have been many reports of a NullReference exception in
                // Popup.OnWindowResize (633371, 764558, 780033, 835588, 899575, 915649, etc.).
                // This arises when an exception aborts Measure, and the exception is caught;
                // the next time layout runs, it delivers a resize request to the popup, 
                // which never initialized its _positionInfo.
                // The catch hides the real problem (which is often the app's fault). 
                // By the time the null-ref happens, all the evidence is long gone. 
                // To help developers and users identify the real problem, store the
                // exception, so that it can be reported when the crashing null-ref 
                // occurs.
                if (popup != null)
                {
                    popup.SavedException = e; 
                }
 
//                throw; 
            }
 
//            desiredSize = _transformDecorator.DesiredSize;

//            if (popup != null)
//            { 
//                // If the parent is a Popup, then the desired size may need to be restricted to satisfy placement constraints.
//                bool restrictWidth; 
//                bool restrictHeight; 
//                Size restrictedSize = GetPopupSizeRestrictions(popup, desiredSize, out restrictWidth, out restrictHeight);
// 
//                // If no restrictions are needed, fall through & use the original desired size.
//                if (restrictWidth || restrictHeight)
//                {
//                    if (restrictWidth == restrictHeight) 
//                    {
//                        // If we need to restrict in both dimensions, re-measure at the restricted size & use the result as our desiredSize. 
//                        desiredSize = Get2DRestrictedDesiredSize(restrictedSize); 
//                    }
//                    else 
//                    {
//                        // If we need to restrict in only one dimension, re-measure with no constraint on the other dimension.
//                        // This will give the content a chance to wrap.
//                        Size restricted1DDesiredSize = new Size(restrictWidth ? restrictedSize.Width : Double.PositiveInfinity, 
//                                                                restrictHeight ? restrictedSize.Height : Double.PositiveInfinity);
// 
//                        _transformDecorator.Measure(restricted1DDesiredSize); 
//                        desiredSize = _transformDecorator.DesiredSize;
// 
//                        // Restricting in one dimension may increase the size in the other dimension, so we need to restrict again
//                        // to satisfy placement constraints.
//                        restrictedSize = GetPopupSizeRestrictions(popup, desiredSize, out restrictWidth, out restrictHeight);
// 
//                        if (restrictWidth || restrictHeight)
//                        { 
//                            // If a restriction is still in place, we cannot satisfy both desiredSize and placement constraints, 
//                            // so respect the placement constraints & clip the content.
//                            desiredSize = Get2DRestrictedDesiredSize(restrictedSize); 
//                        }
//                    }
//                }
//            } 
//
//            return desiredSize; 
        }, 

        /// <summary> 
        ///     Gets teh restricted size of a popup & computes which dimensions were affected.
        /// </summary>
//        private Size 
        GetPopupSizeRestrictions:function(/*Popup*/ popup, /*Size*/ desiredSize, 
        		/*out bool restrictWidth*/restrictWidthOut, /*out bool restrictHeight*/restrictHeightOut)
        { 
//            Size restrictedSize = popup.RestrictSize(desiredSize);
//            restrictWidth = Math.Abs(restrictedSize.Width - desiredSize.Width) > Popup.Tolerance; 
//            restrictHeight = Math.Abs(restrictedSize.Height - desiredSize.Height) > Popup.Tolerance; 
//            return restrictedSize;
        }, 

        /// <summary>
        ///     Measures the _transformDecorator at the restricted size to determine a new desired size.
        /// </summary> 
//        private Size 
        Get2DRestrictedDesiredSize:function(/*Size*/ restrictedSize)
        { 
//            _transformDecorator.Measure(restrictedSize); 
//            Size restricted2DDesiredSize = _transformDecorator.DesiredSize;
//            return new Size(Math.Min(restrictedSize.Width, restricted2DDesiredSize.Width), 
//                            Math.Min(restrictedSize.Height, restricted2DDesiredSize.Height));

        },
 
        /// <summary>
        ///     ArrangeOverride allows for the customization of the positioning of children. 
        /// </summary> 
        /// <param name="arrangeSize">The final size that element should use to arrange itself and its children.</param>
//        protected override Size 
        ArrangeOverride:function() 
        {
        	this._transformDecorator.Arrange(new Rect(arrangeSize));
            return arrangeSize;
        }, 

        /// <summary> 
        ///     Sets up bindings between (Min/Max)Width/Height properties on Popup and PopupRoot. 
        /// </summary>
        /// <param name="popup">The parent Popup.</param> 
//        internal void 
        SetupLayoutBindings:function(/*Popup*/ popup)
        {
            var binding = new Binding("Width");
            binding.Mode = BindingMode.OneWay; 
            binding.Source = popup;
            _adornerDecorator.SetBinding(WidthProperty, binding); 
 
            binding = new Binding("Height");
            binding.Mode = BindingMode.OneWay; 
            binding.Source = popup;
            _adornerDecorator.SetBinding(HeightProperty, binding);

            binding = new Binding("MinWidth"); 
            binding.Mode = BindingMode.OneWay;
            binding.Source = popup; 
            _adornerDecorator.SetBinding(MinWidthProperty, binding); 

            binding = new Binding("MinHeight"); 
            binding.Mode = BindingMode.OneWay;
            binding.Source = popup;
            _adornerDecorator.SetBinding(MinHeightProperty, binding);
 
            binding = new Binding("MaxWidth");
            binding.Mode = BindingMode.OneWay; 
            binding.Source = popup; 
            _adornerDecorator.SetBinding(MaxWidthProperty, binding);
 
            binding = new Binding("MaxHeight");
            binding.Mode = BindingMode.OneWay;
            binding.Source = popup;
            _adornerDecorator.SetBinding(MaxHeightProperty, binding); 
        },
 
        // Popup is transparent, change opacity of root 
//        internal void 
        SetupFadeAnimation:function(/*Duration*/ duration, /*bool*/ visible)
        { 
            var anim = new DoubleAnimation(visible ? 0.0 : 1.0, visible ? 1.0 : 0.0, duration, FillBehavior.HoldEnd);
            BeginAnimation(PopupRoot.OpacityProperty, anim);
        },
 
        // Popup is transparent, we can leave popup size alone
        // and animate the translation of the popup 
//        internal void 
        SetupTranslateAnimations:function(/*PopupAnimation*/ animationType, 
        		/*Duration*/ duration, /*bool*/ animateFromRight, /*bool*/ animateFromBottom) 
        {
            /*UIElement*/var child = this.Child; 

            if (child == null)
                return;
 
            var transform = this._adornerDecorator.RenderTransform instanceof TranslateTransform ? _adornerDecorator.RenderTransform : null;
 
            if (transform == null) 
            {
                transform = new TranslateTransform(); 
                this._adornerDecorator.RenderTransform = transform;
            }

            if (animationType == PopupAnimation.Scroll) 
            {
                // If the flow direction of the child is different than ours, animate in opposite direction 
                FlowDirection childFlowDirection = (FlowDirection)child.GetValue(FlowDirectionProperty); 
                FlowDirection thisFlowDirection = FlowDirection;
 
                if (childFlowDirection != thisFlowDirection)
                {
                    animateFromRight = !animateFromRight;
                } 

                double width = _adornerDecorator.RenderSize.Width; 
                DoubleAnimation xAnim = new DoubleAnimation(animateFromRight ? width : -width, 0.0, duration, FillBehavior.Stop); 
                transform.BeginAnimation(TranslateTransform.XProperty, xAnim);
            } 

            double height = _adornerDecorator.RenderSize.Height;
            DoubleAnimation yAnim = new DoubleAnimation(animateFromBottom ? height : -height, 0.0, duration, FillBehavior.Stop);
            transform.BeginAnimation(TranslateTransform.YProperty, yAnim); 
        },
 
        // Clear animations on this and _adorner 
//        internal void 
        StopAnimations:function()
        { 
            BeginAnimation(PopupRoot.OpacityProperty, null);

            var transform = _adornerDecorator.RenderTransform instanceof TranslateTransform ? _adornerDecorator.RenderTransform : null;
            if (transform != null) 
            {
                transform.BeginAnimation(TranslateTransform.XProperty, null); 
                transform.BeginAnimation(TranslateTransform.YProperty, null); 
            }
        },
//        internal override bool 
        IgnoreModelParentBuildRoute:function(/*RoutedEventArgs*/ e) 
        { 
            // We do not want QueryCursor event to bubble up past this node
            if(e instanceof QueryCursorEventArgs) 
            {
                return true;
            }
 
            // Defer to the child to determine if we should route events up the logical tree.
            var child = this.Child instanceof FrameworkElement ? this.Child : null; 
            if(child != null) 
            {
                return child.IgnoreModelParentBuildRoute(e); 
            }
            else
            {
                return base.IgnoreModelParentBuildRoute(e); 
            }
 
        } 
	});
	
	Object.defineProperties(PopupRoot.prototype,{
        /// <summary>
        /// Returns the Visual children count. 
        /// </summary> 
//        protected override int 
		VisualChildrenCount:
        { 
            get:function() { return 1; }
        },
        
//        internal UIElement 
        Child:
        { 
            get:function() 
            {
                return  _adornerDecorator.Child; 
            },
            set:function(value)
            {
                 _adornerDecorator.Child = value; 
            }
        }, 
 
//        internal Vector 
        AnimationOffset:
        { 
            get:function()
            {
                var transform = _adornerDecorator.RenderTransform instanceof TranslateTransform ? _adornerDecorator.RenderTransform : null;
 
                if (transform != null)
                { 
                    return new Vector(transform.X, transform.Y); 
                }
 
                return new Vector();
            }
        },
 
        /// <summary>
        ///     This is the transform matrix that the popup content "inherits" from the placement target. 
        /// </summary> 
//        internal Transform 
        Transform:
        { 
            set:function()
            {
               _transformDecorator.LayoutTransform = value;
            } 
        }
	});
	
	Object.defineProperties(PopupRoot,{
		  
	});
	
	 
//    static PopupRoot() 
	function Initialize()
    {
        SnapsToDevicePixelsProperty.OverrideMetadata(PopupRoot.Type, new FrameworkPropertyMetadata(true)); 
    }

	
	PopupRoot.Type = new Type("PopupRoot", PopupRoot, [FrameworkElement.Type]);
	return PopupRoot;
});

//        private Decorator _transformDecorator;  // The decorator used to apply animations 
//        private AdornerDecorator _adornerDecorator;


