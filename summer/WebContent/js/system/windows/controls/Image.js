/**
 * Image
 */

define(["dojo/_base/declare", "system/Type", "windows/FrameworkElement", "windows/FlowDirection",
        "windows/EventManager"], 
		function(declare, Type, FrameworkElement, FlowDirection, EventManager){
	var Image = declare("Image", FrameworkElement,{
		constructor:function(){
			this._dom = window.document.createElement('img');
//			this._dom.setAttribute("src","http://drwpf.com/blog/Portals/0/logo.gif");  
			this._dom._source = this;
			
			this.AddEventListeners();
		},
		
		AddEventListeners:function(){
			EventListenerManager.AddEventListeners(this);
		},

//        private void 
        OnSourceDownloaded:function(/*object*/ sender, /*EventArgs*/ e)
        {
            DetachBitmapSourceEvents(); 
            InvalidateMeasure();
            InvalidateVisual(); //ensure re-rendering 
        },

//        private void 
        OnSourceFailed:function(/*object*/ sender, /*ExceptionEventArgs*/ e) 
        {
            DetachBitmapSourceEvents();
            SetCurrentValue(SourceProperty, null);
            RaiseEvent(new ExceptionRoutedEventArgs(ImageFailedEvent, this, e.ErrorException)); 
        },
 
//        private void 
        AttachBitmapSourceEvents:function(/*BitmapSource*/ bitmapSource) 
        {
            DownloadCompletedEventManager.AddHandler(bitmapSource, OnSourceDownloaded); 
            DownloadFailedEventManager.AddHandler(bitmapSource, OnSourceFailed);
            DecodeFailedEventManager.AddHandler(bitmapSource, OnSourceFailed);

            _bitmapSource = bitmapSource; 
        },
 
//        private void 
        DetachBitmapSourceEvents:function() 
        {
            if (_bitmapSource != null) 
            {
                DownloadCompletedEventManager.RemoveHandler(_bitmapSource, OnSourceDownloaded);
                DownloadFailedEventManager.RemoveHandler(_bitmapSource, OnSourceFailed);
                DecodeFailedEventManager.RemoveHandler(_bitmapSource, OnSourceFailed); 
                _bitmapSource = null;
            } 
        },
        
        /// <summary> 
        /// Says if the type can provide fallback value for the given property
        /// </summary>
//        bool IProvidePropertyFallback.
        CanProvidePropertyFallback:function(/*string*/ property)
        { 
            if (String.CompareOrdinal(property, "Source") == 0)
            { 
                return true; 
            }
 
            return false;
        },

        /// <summary> 
        /// Returns the fallback value for the given property.
        /// </summary> 
//        object IProvidePropertyFallback.
        ProvidePropertyFallback:function(/*string*/ property, /*Exception*/ cause) 
        {
            if (String.CompareOrdinal(property, "Source") == 0) 
            {
                this.RaiseEvent(new ExceptionRoutedEventArgs(ImageFailedEvent, this, cause));
            }
 
            // For now we do not have a static that represents a bad-image, so just return a null.
            return null; 
        } 
	});
	
	Object.defineProperties(Image.prototype,{
	      /// <summary> 
        /// Gets/Sets the Source on this Image.
        /// 
        /// The Source property is the ImageSource that holds the actual image drawn. 
        /// </summary>
//        public ImageSource 
        Source:
        {
            get:function() { return this.GetValue(Image.SourceProperty); },
            set:function(value) { this.SetValue(Image.SourceProperty, value); }
        }, 

        /// <summary> 
        /// Gets/Sets the Stretch on this Image. 
        /// The Stretch property determines how large the Image will be drawn.
        /// </summary> 
        /// <seealso cref="Image.StretchProperty" />
//        public Stretch 
        Stretch:
        {
            get:function() { return this.GetValue(Image.StretchProperty); }, 
            set:function(value) { this.SetValue(Image.StretchProperty, value); }
        }, 
 
        /// <summary>
        /// Gets/Sets the stretch direction of the Viewbox, which determines the restrictions on 
        /// scaling that are applied to the content inside the Viewbox.  For instance, this property
        /// can be used to prevent the content from being smaller than its native size or larger than
        /// its native size.
        /// </summary> 
        /// <seealso cref="Viewbox.StretchDirectionProperty" />
//        public StretchDirection 
        StretchDirection: 
        { 
            get:function() { return this.GetValue(Image.StretchDirectionProperty); },
            set:function(value) { this.SetValue(Image.StretchDirectionProperty, value); } 
        },
        
        /// <summary>
        ///    Implementation for BaseUri 
        /// </summary>
//        protected virtual Uri 
        BaseUri:
        {
            get:function() 
            {
                return this.GetValue(BaseUriHelper.BaseUriProperty); 
            }, 
            set:function(value)
            { 
                this.SetValue(BaseUriHelper.BaseUriProperty, value);
            }
        }
	});
	
	Object.defineProperties(Image, {

        /// <summary>
        /// DependencyProperty for Image Source property. 
        /// </summary>
        /// <seealso cref="Image.Source" /> 
//        public static readonly DependencyProperty 
        SourceProperty:
        {
        	get:function(){
        		if(Image._SourceProperty === undefined){
        			Image._SourceProperty =
                        DependencyProperty.Register( 
                                "Source",
                                String.Type,
                                Image.Type,
                                /*new FrameworkPropertyMetadata( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnSourceChanged), 
                                        null)*/
                                FrameworkPropertyMetadata.Build4( 
                                        null,
                                        FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, 
                                        new PropertyChangedCallback(null, OnSourceChanged), 
                                        null),
                                null); 

        		}
        		
        		return Image._SourceProperty;
        	}
        },

        /// <summary>
        /// DependencyProperty for Stretch property. 
        /// </summary>
        /// <seealso cref="Viewbox.Stretch" /> 
//        public static readonly DependencyProperty 
        StretchProperty:
        {
        	get:function(){
        		if(Image._StretchProperty === undefined){
        			Image._StretchProperty =
                        Viewbox.StretchProperty.AddOwner(Image.Type); 

        		}
        		
        		return Image._StretchProperty;
        	}
        }, 

        /// <summary>
        /// DependencyProperty for StretchDirection property.
        /// </summary> 
        /// <seealso cref="Viewbox.Stretch" />
//        public static readonly DependencyProperty 
        StretchDirectionProperty:
        {
        	get:function(){
        		if(Image._StretchDirectionProperty === undefined){
        			Image._StretchDirectionProperty= 
                        Viewbox.StretchDirectionProperty.AddOwner(Image.Type); 

        		}
        		
        		return Image._StretchDirectionProperty;
        	}
        }, 

 
        /// <summary>
        /// ImageFailedEvent is a routed event.
        /// </summary>
//        public static readonly RoutedEvent 
        ImageFailedEvent:
        {
        	get:function(){
        		if(Image._ImageFailedEvent === undefined){
        			Image._ImageFailedEvent  = 
        	            EventManager.RegisterRoutedEvent(
                                "ImageFailed", 
                                RoutingStrategy.Bubble, 
                                EventHandler.Type/*typeof(EventHandler<ExceptionRoutedEventArgs>)*/,
                                Image.Type); 

        		}
        		
        		return Image._ImageFailedEvent;
        	}
        },
	});
	
//    private static Style 
    function CreateDefaultStyles()
    { 
        /*Style*/var style = new Style(Image.Type, null);
        style.Setters.Add (new Setter(Image.FlowDirectionProperty, FlowDirection.LeftToRight)); 
        style.Seal(); 
        return style;
    }
    
//    private static void 
    function OnSourceChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        if (!e.IsASubPropertyChange)
        {
//            /*Image*/var image = d; 
//            /*ImageSource*/var oldValue = e.OldValue;
//            /*ImageSource*/var newValue = e.NewValue; 
//
//            UpdateBaseUri(d, newValue);
//
//            image.DetachBitmapSourceEvents();
//
//            /*BitmapSource*/
//            var newBitmapSource = newValue instanceof BitmapSource ? newValue : null;
//            if (newBitmapSource != null && newBitmapSource.CheckAccess() && !newBitmapSource.IsFrozen) 
//            {
//                image.AttachBitmapSourceEvents(newBitmapSource); 
//            } 
        }
    }

//    private static void 
    function UpdateBaseUri(/*DependencyObject*/ d, /*ImageSource*/ source)
    {
        if ((source instanceof IUriContext) && (!source.IsFrozen) && (/*((IUriContext)source)*/source.BaseUri == null)) 
        {
            /*Uri*/var baseUri = BaseUriHelper.GetBaseUriCore(d); 
            if (baseUri != null) 
            {
                /*((IUriContext)source)*/source.BaseUri = BaseUriHelper.GetBaseUriCore(d); 
            }
        }
    }
	
	Image.Type = new Type("Image", Image, [FrameworkElement.Type]);
	return Image;
});

//  
//
//
//        /// <summary>
//        /// Raised when there is a failure in image.
//        /// </summary> 
//        public event EventHandler<ExceptionRoutedEventArgs> ImageFailed
//        { 
//            add { AddHandler(ImageFailedEvent, value); } 
//            remove { RemoveHandler(ImageFailedEvent, value); }
//        } 
//
// 
// 
//        private BitmapSource _bitmapSource;
// 
//        static Image()
//        { 
//            Style style = CreateDefaultStyles();
//            StyleProperty.OverrideMetadata(Image.Type, new FrameworkPropertyMetadata(style)); 
// 
//            //
//            // The Stretch & StretchDirection properties are AddOwner'ed from a class which is not 
//            // base class for Image so the metadata with flags get lost. We need to override them
//            // here to make it work again.
//            //
//            StretchProperty.OverrideMetadata( 
//                Image.Type,
//                new FrameworkPropertyMetadata( 
//                    Stretch.Uniform, 
//                    FrameworkPropertyMetadataOptions.AffectsMeasure
//                    ) 
//                );
//
//            StretchDirectionProperty.OverrideMetadata(
//                Image.Type, 
//                new FrameworkPropertyMetadata(
//                    StretchDirection.Both, 
//                    FrameworkPropertyMetadataOptions.AffectsMeasure 
//                    )
//                ); 
//        }
//
//
//
//  
//
//        
// 
//  
//
//        /// <summary> 
//        /// Manager for the BitmapSource.DownloadCompleted event.
//        /// </summary> 
//        private class DownloadCompletedEventManager : WeakEventManager 
//        {
//            //
//            //  Constructors
//            // 
//
//            private DownloadCompletedEventManager() 
//            { 
//            }
// 
// 
//            //
//            //  Public Methods 
//            // 
//
//            /// <summary> 
//            /// Add a handler for the given source's event.
//            /// </summary>
//            public static void AddHandler(BitmapSource source, EventHandler<EventArgs> handler)
//            { 
//                if (handler == null)
//                    throw new ArgumentNullException("handler"); 
// 
//                CurrentManager.ProtectedAddHandler(source, handler);
//            } 
//
//            /// <summary>
//            /// Remove a handler for the given source's event.
//            /// </summary> 
//            public static void RemoveHandler(BitmapSource source, EventHandler<EventArgs> handler)
//            { 
//                if (handler == null) 
//                    throw new ArgumentNullException("handler");
// 
//                CurrentManager.ProtectedRemoveHandler(source, handler);
//            }
//
//            //
//            //  Protected Methods 
//            //
//
//            /// <summary>
//            /// Return a new list to hold listeners to the event. 
//            /// </summary>
//            protected override ListenerList NewListenerList() 
//            { 
//                return new ListenerList<EventArgs>();
//            } 
//
//            /// <summary>
//            /// Listen to the given source for the event.
//            /// </summary> 
//            protected override void StartListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                typedSource.DownloadCompleted += new EventHandler(OnDownloadCompleted);
//            } 
//
//            /// <summary>
//            /// Stop listening to the given source for the event.
//            /// </summary> 
//            protected override void StopListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                if (typedSource.CheckAccess() && !typedSource.IsFrozen)
//                { 
//                    typedSource.DownloadCompleted -= new EventHandler(OnDownloadCompleted);
//                }
//            }
// 
//            // 
//            //  Private Properties
//            //
//
//            // get the event manager for the current thread 
//            private static DownloadCompletedEventManager CurrentManager
//            { 
//                get 
//                {
//                    Type managerType = typeof(DownloadCompletedEventManager); 
//                    DownloadCompletedEventManager manager = (DownloadCompletedEventManager)GetCurrentManager(managerType);
//
//                    // at first use, create and register a new manager
//                    if (manager == null) 
//                    {
//                        manager = new DownloadCompletedEventManager(); 
//                        SetCurrentManager(managerType, manager); 
//                    }
// 
//                    return manager;
//                }
//            }
// 
//
//            // 
//            //  Private Methods
//            //
//
//            // event handler for DownloadCompleted event 
//            private void OnDownloadCompleted(object sender, EventArgs args)
//            { 
//                DeliverEvent(sender, args); 
//            }
// 
//        }
//
//        /// <summary> 
//        /// Manager for the BitmapSource.DownloadFailed event.
//        /// </summary> 
//        private class DownloadFailedEventManager : WeakEventManager 
//        {
//            //
//            //  Constructors
//            // 
//
//            private DownloadFailedEventManager() 
//            { 
//            }
// 
// 
//            //
//            //  Public Methods 
//            // 
//
//            /// <summary> 
//            /// Add a handler for the given source's event.
//            /// </summary>
//            public static void AddHandler(BitmapSource source, EventHandler<ExceptionEventArgs> handler)
//            { 
//                if (handler == null)
//                    throw new ArgumentNullException("handler"); 
// 
//                CurrentManager.ProtectedAddHandler(source, handler);
//            } 
//
//            /// <summary>
//            /// Remove a handler for the given source's event.
//            /// </summary> 
//            public static void RemoveHandler(BitmapSource source, EventHandler<ExceptionEventArgs> handler)
//            { 
//                if (handler == null) 
//                    throw new ArgumentNullException("handler");
// 
//                CurrentManager.ProtectedRemoveHandler(source, handler);
//            }
//
//            //
//            //  Protected Methods 
//            //
//
//            /// <summary>
//            /// Return a new list to hold listeners to the event. 
//            /// </summary>
//            protected override ListenerList NewListenerList() 
//            { 
//                return new ListenerList<ExceptionEventArgs>();
//            } 
//
//            /// <summary>
//            /// Listen to the given source for the event.
//            /// </summary> 
//            protected override void StartListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                typedSource.DownloadFailed += new EventHandler<ExceptionEventArgs>(OnDownloadFailed);
//            } 
//
//            /// <summary>
//            /// Stop listening to the given source for the event.
//            /// </summary> 
//            protected override void StopListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                if (typedSource.CheckAccess() && !typedSource.IsFrozen)
//                { 
//                    typedSource.DownloadFailed -= new EventHandler<ExceptionEventArgs>(OnDownloadFailed);
//                }
//            }
// 
//            // 
//            //  Private Properties
//            //
//
//            // get the event manager for the current thread 
//            private static DownloadFailedEventManager CurrentManager
//            { 
//                get 
//                {
//                    Type managerType = typeof(DownloadFailedEventManager); 
//                    DownloadFailedEventManager manager = (DownloadFailedEventManager)GetCurrentManager(managerType);
//
//                    // at first use, create and register a new manager
//                    if (manager == null) 
//                    {
//                        manager = new DownloadFailedEventManager(); 
//                        SetCurrentManager(managerType, manager); 
//                    }
// 
//                    return manager;
//                }
//            }
// 
//            // 
//            //  Private Methods
//            //
//
//            // event handler for DownloadFailed event 
//            private void OnDownloadFailed(object sender, ExceptionEventArgs args)
//            { 
//                DeliverEvent(sender, args); 
//            }
// 
//        }
//
//        /// <summary> 
//        /// Manager for the BitmapSource.DecodeFailed event.
//        /// </summary> 
//        private class DecodeFailedEventManager : WeakEventManager 
//        {
//
//            //
//            //  Constructors
//            // 
//
//            private DecodeFailedEventManager() 
//            { 
//            }
// 
//            //
//            //  Public Methods 
//            // 
//
//            /// <summary> 
//            /// Add a handler for the given source's event.
//            /// </summary>
//            public static void AddHandler(BitmapSource source, EventHandler<ExceptionEventArgs> handler)
//            { 
//                if (handler == null)
//                    throw new ArgumentNullException("handler"); 
// 
//                CurrentManager.ProtectedAddHandler(source, handler);
//            } 
//
//            /// <summary>
//            /// Remove a handler for the given source's event.
//            /// </summary> 
//            public static void RemoveHandler(BitmapSource source, EventHandler<ExceptionEventArgs> handler)
//            { 
//                if (handler == null) 
//                    throw new ArgumentNullException("handler");
// 
//                CurrentManager.ProtectedRemoveHandler(source, handler);
//            }
//
//            //
//            //  Protected Methods 
//            //
//
//            /// <summary>
//            /// Return a new list to hold listeners to the event. 
//            /// </summary>
//            protected override ListenerList NewListenerList() 
//            { 
//                return new ListenerList<ExceptionEventArgs>();
//            } 
//
//            /// <summary>
//            /// Listen to the given source for the event.
//            /// </summary> 
//            protected override void StartListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                typedSource.DecodeFailed += new EventHandler<ExceptionEventArgs>(OnDecodeFailed);
//            } 
//
//            /// <summary>
//            /// Stop listening to the given source for the event.
//            /// </summary> 
//            protected override void StopListening(object source)
//            { 
//                BitmapSource typedSource = (BitmapSource)source; 
//                if (typedSource.CheckAccess() && !typedSource.IsFrozen)
//                { 
//                    typedSource.DecodeFailed -= new EventHandler<ExceptionEventArgs>(OnDecodeFailed);
//                }
//            }
// 
//            // 
//            //  Private Properties
//            //
//
//            // get the event manager for the current thread 
//            private static DecodeFailedEventManager CurrentManager
//            { 
//                get 
//                {
//                    Type managerType = typeof(DecodeFailedEventManager); 
//                    DecodeFailedEventManager manager = (DecodeFailedEventManager)GetCurrentManager(managerType);
//
//                    // at first use, create and register a new manager
//                    if (manager == null) 
//                    {
//                        manager = new DecodeFailedEventManager(); 
//                        SetCurrentManager(managerType, manager); 
//                    }
// 
//                    return manager;
//                }
//            }
// 
//            // 
//            //  Private Methods
//            //
//
//            // event handler for DecodeFailed event 
//            private void OnDecodeFailed(object sender, ExceptionEventArgs args)
//            { 
//                DeliverEvent(sender, args); 
//            }
// 
//        }
//
//    }
//} 
// 

