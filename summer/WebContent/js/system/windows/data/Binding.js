/**
 * Second Check 12-27
 * Binding
 */
/// <summary> 
///  Describes an instance of a Binding, binding a target 
///  (DependencyObject, DependencyProperty) to a source (object, property)
/// </summary> 
define(["dojo/_base/declare", "system/Type", "data/BindingBase",
        "data/BindingFlags", "windows/PropertyPath", "data/BindingExpression", "internal.data/ExplicitObjectRef",
        "data/BindingStatusInternal", "windows/DependencyProperty", "data/BindingFlags", "data/BindingMode",
        "data/UpdateSourceTrigger", "internal.controls/ValidationRuleCollection", "internal.data/ElementObjectRef"
        ], 
		function(declare, Type, BindingBase,
				BindingFlags, PropertyPath, BindingExpression, ExplicitObjectRef,
				BindingStatusInternal, DependencyProperty, BindingFlags, BindingMode,
				UpdateSourceTrigger, ValidationRuleCollection, ElementObjectRef){
	
    // Which source property is in use 
    var SourceProperties = { None:0, RelativeSource:1, ElementName:2, Source:3, StaticSource:4, InternalSource:5 };
//    SourceProperties.Type = new Type("SourceProperties", SourceProperties, [Object.Type]);
    
    var Feature = BindingBase.Feature;
	var Binding = declare("Binding", BindingBase, { 
		constructor:function(path){
			if(arguments.length == 1){
                this.Path = new PropertyPath(path); 
			}
			
			this._sourceInUse = SourceProperties.None;

//	        ObjectRef           
	        this._source = Binding.UnsetSource; 

//	        bool               
	        this._isAsync = false; 
//	        bool                
	        this._bindsDirectlyToSource = false;
//	        bool                
	        this._doesNotTransferDefaultValue = false;   // initially = false

//	        int                 
	        this._attachedPropertiesInPath = 0; 
		},

        /// <summary> 
        /// Create an appropriate expression for this Binding, to be attached
        /// to the given DependencyProperty on the given DependencyObject. 
        /// </summary> 
//		internal override BindingExpressionBase
        CreateBindingExpressionOverride:function(/*DependencyObject*/ target, /*DependencyProperty*/ dp, /*BindingExpressionBase*/ owner)
        { 
            return BindingExpression.CreateBindingExpression(target, dp, this, owner);
        },

//        internal override ValidationRule 
        LookupValidationRule:function(/*Type*/ type) 
        {
            return BindingBase.LookupValidationRule(type, this.ValidationRulesInternal); 
        },
//        internal object 
        DoFilterException:function(/*object*/ bindExpr, /*Exception*/ exception) 
        { 
            /*UpdateSourceExceptionFilterCallback*/
        	var callback = this.GetValue(Feature.ExceptionFilterCallback, null);
            if (callback != null) 
                return callback(bindExpr, exception);

            return exception;
        },

        // called by BindingExpression when the Binding doesn't specify a path. 
        // (Can't use Path setter, since that replaces the BindingExpression.) 
//        internal void 
        UsePath:function(/*PropertyPath*/ path)
        { 
            this._ppath = path;
            this.SetFlag(BindingFlags.PathGeneratedInternally);
        },
 
 
        /*internal override BindingBase */
        CreateClone:function()
        { 
            return new Binding(); 
        },
 
        /*internal override void */
        InitializeClone:function(/*BindingBase*/ baseClone, /*BindingMode*/ mode)
        {
            var clone = baseClone;
 
            clone._ppath = this._ppath;
            CopyValue(Feature.XPath, clone); 
            clone._source = _source; 
            CopyValue(Feature.Culture, clone);
            clone._isAsync = _isAsync; 
            CopyValue(Feature.AsyncState, clone);
            clone._bindsDirectlyToSource = _bindsDirectlyToSource;
            clone._doesNotTransferDefaultValue = _doesNotTransferDefaultValue;
            CopyValue(Feature.ObjectSource, clone); 
            CopyValue(Feature.RelativeSource, clone);
            CopyValue(Feature.Converter, clone); 
            CopyValue(Feature.ConverterParameter, clone); 
            clone._attachedPropertiesInPath = _attachedPropertiesInPath;
            CopyValue(Feature.ValidationRules, clone); 

            base.InitializeClone(baseClone, mode);
        },

        // determine the source property currently in use 
//        /*void*/ 
        DetermineSource:function()
        { 
            this._sourceInUse = 
                (this._source == Binding.UnsetSource)                ? SourceProperties.None :
                (this.HasValue(Feature.RelativeSource))      ? SourceProperties.RelativeSource : 
                (this.HasValue(Feature.ElementSource))       ? SourceProperties.ElementName :
                (this.HasValue(Feature.ObjectSource))        ? SourceProperties.Source :
                (this._source == Binding.StaticSourceRef)            ? SourceProperties.StaticSource :
                                                          SourceProperties.InternalSource; 
        }

	});
	
	Object.defineProperties(Binding.prototype,{
		
        /// <summary>
        ///     Collection&lt;ValidationRule&gt; is a collection of ValidationRule 
        ///     implementations on either a Binding or a MultiBinding.  Each of the rules
        ///     is run by the binding engine when validation on update to source
        /// </summary>
        /*public Collection<ValidationRule> */
		ValidationRules: 
        {
            get:function() 
            { 
                if (!this.HasValue(Feature.ValidationRules))
                	this.SetValue(Feature.ValidationRules, new ValidationRuleCollection()); 

                return this.GetValue(Feature.ValidationRules, null);
            }
 
        },
        /// <summary> True if an exception during source updates should be considered a validation error.</summary>
        /*public bool*/ 
        ValidatesOnExceptions:
        {
            get:function()
            { 
                return this.TestFlag(BindingFlags.ValidatesOnExceptions);
            } ,
            set:function(value) 
            {
                var currentValue = this.TestFlag(BindingFlags.ValidatesOnExceptions); 
                if (currentValue != value)
                {
                	this.CheckSealed();
                	this.ChangeFlag(BindingFlags.ValidatesOnExceptions, value); 
                }
            } 
        }, 

        /// <summary> True if a data error in the source item should be considered a validation error.</summary> 
        /*public bool*/ 
        ValidatesOnDataErrors:
        {
            get :function()
            {
                return this.TestFlag(BindingFlags.ValidatesOnDataErrors); 
            }, 
            set:function(value)
            { 
                var currentValue = this.TestFlag(BindingFlags.ValidatesOnDataErrors);
                if (currentValue != value)
                {
                	this.CheckSealed(); 
                	this.ChangeFlag(BindingFlags.ValidatesOnDataErrors, value);
                } 
            } 
        },
 
        /// <summary> True if a data error from INotifyDataErrorInfo source item should be considered a validation error.</summary>
//        [DefaultValue(true)]
        /*public bool*/ 
        ValidatesOnNotifyDataErrors:
        { 
            get:function()
            { 
                return this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors); 
            },
            set:function(value) 
            {
                var currentValue = this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors);
                if (currentValue != value)
                { 
                	this.CheckSealed();
                	this.ChangeFlag(BindingFlags.ValidatesOnNotifyDataErrors, value); 
                } 
            }
        }, 


        /// <summary> The source path (for CLR bindings).</summary>
        /*public PropertyPath*/ 
        Path: 
        {
            get:function() { return this._ppath; }, 
            set:function(value) 
            {
            	this.CheckSealed(); 

            	this._ppath = value;
            	this._attachedPropertiesInPath = -1;
            	this.ClearFlag(BindingFlags.PathGeneratedInternally); 

                if (this._ppath != null && this._ppath.StartsWithStaticProperty) 
                { 
                    if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.StaticSource)
                    { 
                    	this.SourceReference = this.StaticSourceRef;
                    }
                    else
                        throw new Error("InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.StaticSource, _sourceInUse)"); 
                }
            } 
        },
        
////        [DefaultValue(null)]
//        /*public string*/ 
        XPath:
        { 
            get:function() { return this.GetValue(Feature.XPath, null); },
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.XPath, value, null); } 
        }, 

        /// <summary> Binding mode </summary> 
//        [DefaultValue(BindingMode.Default)]
        /*public BindingMode*/ 
        Mode:
        {
            get:function() 
            {
                switch (this.GetFlagsWithinMask(BindingFlags.PropagationMask)) 
                { 
                    case BindingFlags.OneWay:           return BindingMode.OneWay;
                    case BindingFlags.TwoWay:           return BindingMode.TwoWay; 
                    case BindingFlags.OneWayToSource:   return BindingMode.OneWayToSource;
                    case BindingFlags.OneTime:          return BindingMode.OneTime;
                    case BindingFlags.PropDefault:      return BindingMode.Default;
                } 
//                Invariant.Assert(false, "Unexpected BindingMode value");
                return 0; 
            }, 
            set:function(value)
            { 
            	this.CheckSealed();

                var flags = BindingBase.FlagsFromBindingMode(value);
                if (flags == BindingFlags.IllegalInput) 
                    throw new Error("InvalidEnumArgumentException('value', (int) value, typeof(BindingMode)");
 
                this.ChangeFlagsWithinMask(BindingFlags.PropagationMask, flags); 
            }
        }, 

        /// <summary> Update type </summary>
//        [DefaultValue(UpdateSourceTrigger.Default)]
        /*public UpdateSourceTrigger*/ 
        UpdateSourceTrigger: 
        {
            get:function() 
            { 
                switch (this.GetFlagsWithinMask(BindingFlags.UpdateMask))
                { 
                    case BindingFlags.UpdateOnPropertyChanged: return UpdateSourceTrigger.PropertyChanged;
                    case BindingFlags.UpdateOnLostFocus:    return UpdateSourceTrigger.LostFocus;
                    case BindingFlags.UpdateExplicitly:     return UpdateSourceTrigger.Explicit;
                    case BindingFlags.UpdateDefault:        return UpdateSourceTrigger.Default; 
                }
//                Invariant.Assert(false, "Unexpected UpdateSourceTrigger value"); 
                return 0; 
            },
            set:function(value)  
            {
            	this.CheckSealed();

                var flags = BindingBase.FlagsFromUpdateSourceTrigger(value); 
                if (flags == BindingFlags.IllegalInput)
                    throw new Error("InvalidEnumArgumentException('value', (int) value, typeof(UpdateSourceTrigger)"); 
 
                this.ChangeFlagsWithinMask(BindingFlags.UpdateMask, flags);
            } 
        },

        /// <summary> Raise SourceUpdated event whenever a value flows from target to source </summary>
//        [DefaultValue(false)] 
        /*public bool*/ 
        NotifyOnSourceUpdated:
        { 
            get:function() 
            {
                return this.TestFlag(BindingFlags.NotifyOnSourceUpdated); 
            },
            set:function(value)
            {
                var currentValue = this.TestFlag(BindingFlags.NotifyOnSourceUpdated); 
                if (currentValue != value)
                { 
                	this.CheckSealed(); 
                	this.ChangeFlag(BindingFlags.NotifyOnSourceUpdated, value);
                } 
            }
        },

 
        /// <summary> Raise TargetUpdated event whenever a value flows from source to target </summary>
//        [DefaultValue(false)] 
        /*public bool*/ 
        NotifyOnTargetUpdated: 
        {
            get:function() 
            {
                return this.TestFlag(BindingFlags.NotifyOnTargetUpdated);
            },
            set:function(value) 
            {
                var currentValue = this.TestFlag(BindingFlags.NotifyOnTargetUpdated); 
                if (currentValue != value) 
                {
                	this.CheckSealed(); 
                	this.ChangeFlag(BindingFlags.NotifyOnTargetUpdated, value);
                }
            }
        }, 

        /// <summary> Raise ValidationError event whenever there is a ValidationError on Update</summary> 
//        [DefaultValue(false)] 
       /* public bool*/ 
        NotifyOnValidationError:
        { 
            get:function()
            {
                return this.TestFlag(BindingFlags.NotifyOnValidationError);
            }, 
            set:function(value) 
            { 
                var currentValue = this.TestFlag(BindingFlags.NotifyOnValidationError); 
                if (currentValue != value)
                { 
                	this.CheckSealed();
                	this.ChangeFlag(BindingFlags.NotifyOnValidationError, value);
                }
            } 
        },
 
        /// <summary> The Converter to apply </summary> 
//        [DefaultValue(null)]
        /*public IValueConverter*/ 
        Converter:
        {
            get:function() { return /*(IValueConverter)*/this.GetValue(Feature.Converter, null); },
            set:function(value)  { this.CheckSealed(); this.SetValue(Feature.Converter, value, null); }
        }, 

        /// <summary> 
        /// The parameter to pass to converter. 
        /// </summary>
        /// <value></value> 
//        [DefaultValue(null)]
        /*public object */
        ConverterParameter:
        {
            get:function() { return this.GetValue(Feature.ConverterParameter, null); }, 
            set:function(value)  { this.CheckSealed(); this.SetValue(Feature.ConverterParameter, value, null); }
        }, 
 
        /// <summary> Culture in which to evaluate the converter </summary>
//        [DefaultValue(null)] 
//        [TypeConverter(typeof(System.Windows.CultureInfoIetfLanguageTagConverter))]
        /*public CultureInfo */
        ConverterCulture:
        {
            get:function() { return /*(CultureInfo)*/this.GetValue(Feature.Culture, null); }, 
            set:function(value)  { this.CheckSealed(); this.SetValue(Feature.Culture, value, null); }
        }, 
 
        /// <summary> object to use as the source </summary>
        /// <remarks> To clear this property, set it to DependencyProperty.UnsetValue. </remarks> 
        /*public object */
        Source:
        {
            get:function()
            { 
//                WeakReference<object> wr = (WeakReference<object>)GetValue(Feature.ObjectSource, null);
//                if (wr == null) 
//                    return null; 
//                else
//                { 
//                    object target;
//                    return wr.TryGetTarget(out target) ? target : null;
//                }
            	
                return this.GetValue(Feature.ObjectSource, null);
            }, 
            set:function(value) 
            { 
            	this.CheckSealed(); 

                if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.Source) 
                {
                    if (value != DependencyProperty.UnsetValue)
                    {
//                    	this.SetValue(Feature.ObjectSource, new WeakReference<object>(value)); 
                    	this.SetValue(Feature.ObjectSource, value); 
                    	this.SourceReference = new ExplicitObjectRef(value);
                    } 
                    else 
                    {
                    	this.ClearValue(Feature.ObjectSource); 
                    	this.SourceReference = null;
                    }
                }
                else 
                    throw new Error("InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.Source, _sourceInUse)");
            } 
        },
        
        /// <summary> 
        /// Description of the object to use as the source, relative to the target element.
        /// </summary> 
//        [DefaultValue(null)] 
        /*public RelativeSource */
        RelativeSource:
        { 
            get:function() { return /*(RelativeSource)*/this.GetValue(Feature.RelativeSource, null); },
            set:function(value) 
            {
            	this.CheckSealed(); 

                if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.RelativeSource) 
                { 
                	this.SetValue(Feature.RelativeSource, value, null);
                	this.SourceReference = (value != null) ? new RelativeObjectRef(value) : null; 
                }
                else
                    throw new Error("InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.RelativeSource, _sourceInUse)");
            } 
        },
 
        /// <summary> Name of the element to use as the source </summary> 
//        [DefaultValue(null)]
        /*public string */
        ElementName :
        {
            get:function() { return this.GetValue(Feature.ElementSource, null); },
            set:function(value) 
            { 
            	this.CheckSealed();
 
                if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.ElementName) 
                {
                	this.SetValue(Feature.ElementSource, value, null); 
                	this.SourceReference = (value != null) ? new ElementObjectRef(value) : null;
                }
                else
                    throw new Error("InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.ElementName, _sourceInUse)"); 
            }
        }, 
 
        /// <summary> True if Binding should get/set values asynchronously </summary>
//        [DefaultValue(false)] 
        /*public bool */
        IsAsync:
        {
            get:function() { return this._isAsync; },
            set:function(value)  { this.CheckSealed();  this._isAsync = value; } 
        },
 
        /// <summary> Opaque data passed to the asynchronous data dispatcher </summary> 
//        [DefaultValue(null)]
        /*public object */
        AsyncState :
        {
            get:function() { return this.GetValue(Feature.AsyncState, null); },
            set:function(value) { this.CheckSealed(); this.SetValue(Feature.AsyncState, value, null); }
        },

        /// <summary> True if Binding should interpret its path relative to 
        /// the data item itself. 
        /// </summary>
        /// <remarks> 
        /// The normal behavior (when this property is false)
        /// includes special treatment for a data item that implements IDataSource.
        /// In this case, the path is treated relative to the object obtained
        /// from the IDataSource.Data property.  In addition, the binding listens 
        /// for the IDataSource.DataChanged event and reacts accordingly.
        /// Setting this property to true overrides this behavior and gives 
        /// the binding access to properties on the data source object itself. 
        /// </remarks>
//        [DefaultValue(false)] 
        /*public bool */
        BindsDirectlyToSource:
        {
            get:function() { return this._bindsDirectlyToSource; },
            set:function(value)  { this.CheckSealed();  this._bindsDirectlyToSource = value; } 
        },
 
        /// <summary> 
        /// called whenever any exception is encountered when trying to update
        /// the value to the source. The application author can provide its own 
        /// handler for handling exceptions here. If the delegate returns
        ///     null - don't throw an error or provide a ValidationError.
        ///     Exception - returns the exception itself, we will fire the exception using Async exception model.
        ///     ValidationError - it will set itself as the BindingInError and add it to the element's Validation errors. 
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
        /*public UpdateSourceExceptionFilterCallback */
        UpdateSourceExceptionFilter :
        {
            get:function() { return /*(UpdateSourceExceptionFilterCallback)*/this.GetValue(Feature.ExceptionFilterCallback, null); }, 
            set:function(value)  { this.SetValue(Feature.ExceptionFilterCallback, value, null); }
        },
        

        /*internal override CultureInfo */
        ConverterCultureInternal:
        {
            get:function() { return this.ConverterCulture; } 
        },
 
        /*internal ObjectRef */
        SourceReference :
        {
            get:function() { return (this._source == Binding.UnsetSource) ? null : this._source; }, 
            set:function(value)  { this.CheckSealed();  this._source = value;  this.DetermineSource(); }
        },

        /*internal bool */
        TreeContextIsRequired: 
        {
            get:function() 
            { 
                var treeContextIsRequired;
 
                // attached properties in the property path (like "(DockPanel.Dock)")
                // need inherited value of XmlAttributeProperties properties for namespaces,
                // unless the properties are pre-resolved by the parser
                if (this._attachedPropertiesInPath < 0) 
                {
                    if (this._ppath != null) 
                    { 
                    	this._attachedPropertiesInPath = this._ppath.ComputeUnresolvedAttachedPropertiesInPath();
                    } 
                    else
                    {
                    	this._attachedPropertiesInPath = 0;
                    } 
                }
                treeContextIsRequired = (this._attachedPropertiesInPath > 0); 
 
                // namespace prefixes in the XPath need an XmlNamespaceManager
                if (!treeContextIsRequired && this.HasValue(Feature.XPath) && this.XPath.IndexOf(':') >= 0) 
                {
                    treeContextIsRequired = true;
                }
 
                return treeContextIsRequired;
            } 
        }, 

        // same as the public ValidationRules property, but 
        // doesn't try to create an instance if there isn't one there
        /*internal override Collection<ValidationRule> */
        ValidationRulesInternal:
        {
            get:function() 
            {
                return /*(ValidationRuleCollection)*/this.GetValue(Feature.ValidationRules, null); 
            } 
        },
 
        // when the source property has its default value, this flag controls
        // whether the binding transfers the value anyway, or simply "hides"
        // so that the property engine obtains the target value some other way.
        /*internal bool */
        TransfersDefaultValue: 
        {
            get:function() { return !this._doesNotTransferDefaultValue; }, 
            set:function(value)  { this.CheckSealed();  this._doesNotTransferDefaultValue = !value; } 
        },
 
        ValidatesOnNotifyDataErrorsInternal:
        {
            get:function() { return this.ValidatesOnNotifyDataErrors; }
        } 

	});
	
	
	var _sourceUpdatedEvent = null, _targetUpdatedEvent =null,
		_xmlNamespaceManagerProperty=null;
	
	Object.defineProperties(Binding, {
		 /// <summary>
        /// The SourceUpdated event is raised whenever a value is transferred from the target to the source,
        /// but only for Bindings that have requested the event by setting BindFlags.NotifyOnSourceUpdated.
        /// </summary> 
//        public static readonly RoutedEvent 
		SourceUpdatedEvent:{
			get:function(){
				if(_SourceUpdatedEvent == null){
					_SourceUpdatedEvent=
						EventManager.RegisterRoutedEvent("SourceUpdated", 
                                RoutingStrategy.Bubble, 
                                EventHandler.Type,
                                Binding.Type); 
				}
				
				return _SourceUpdatedEvent;
			}
		},
		TargetUpdatedEvent:{
			get:function(){
				if(_targetUpdatedEvent==null){
					_targetUpdatedEvent=
			            EventManager.RegisterRoutedEvent("TargetUpdated", 
                                RoutingStrategy.Bubble,
                                EventHandler.Type,
                                Binding.Type); 
				}
				
				return _targetUpdatedEvent;
			}
		},
		
        /// <summary> 
        /// The TargetUpdated event is raised whenever a value is transferred from the source to the target,
        /// but only for Bindings that have requested the event by setting BindFlags.NotifyOnTargetUpdated. 
        /// </summary> 
//        public static readonly RoutedEvent 
		TargetUpdatedEvent:{
			get:function(){
				if(_TargetUpdatedEvent==null){
					_TargetUpdatedEvent=
			            EventManager.RegisterRoutedEvent("TargetUpdated", 
                                RoutingStrategy.Bubble,
                                EventHandler.Type,
                                Binding.Type); 
				}
				
				return _TargetUpdatedEvent;
			}
		},
		XmlNamespaceManagerProperty:
		{
			get:function(){
				if(_xmlNamespaceManagerProperty == null){
					_xmlNamespaceManagerProperty =
				          DependencyProperty.RegisterAttached("XmlNamespaceManager", 
				        		  Object.Type, Binding.Type, 
                                  /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits)*/
				        		  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.Inherits), 
                                  new ValidateValueCallback(null, IsValidXmlNamespaceManager));
				}
				
				return _xmlNamespaceManagerProperty;
			}
		},
		

        /// <summary>
        /// The XmlNamespaceManager to use to perform Namespace aware XPath queries in XmlData bindings
        /// </summary> 
//        public static readonly DependencyProperty 
		XmlNamespaceManagerProperty:
		{
			get:function(){
				if(_XmlNamespaceManagerProperty == null){
					_XmlNamespaceManagerProperty =
				          DependencyProperty.RegisterAttached("XmlNamespaceManager", 
				        		  Object.Type, Binding.Type, 
                                  /*new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits)*/
				        		  FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.Inherits), 
                                  new ValidateValueCallback(null, IsValidXmlNamespaceManager));
				}
				
				return _XmlNamespaceManagerProperty;
			}
		},
 
		
//	    /*static readonly ObjectRef*/ 
//	    UnsetSource:
//	    {
//	    	get:function(){
//	    		if(Binding._UnsetSource === undefined){
//	    			Binding._UnsetSource= new ExplicitObjectRef(null); 
//	    		}
//	    		
//	    		return Binding._UnsetSource;
//	    	}
//	    },
//	    /*static readonly ObjectRef*/ 
//	    StaticSourceRef:
//	    {
//	    	get:function(){
//	    		if(Binding._StaticSourceRef === undefined){
//	    			Binding._UnsetSource = new ExplicitObjectRef(BindingExpression.StaticSource); 
//	    		}
//	    		
//	    		return Binding._StaticSourceRef;
//	    	}
//	    }
		
	});

    /// <summary>
    ///     Adds a handler for the SourceUpdated attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
    /*public static void */
    Binding.AddSourceUpdatedHandler = function(/*DependencyObject*/ element, /*EventHandler<DataTransferEventArgs>*/ handler) 
    {
        FrameworkElement.AddHandler(element, Binding.SourceUpdatedEvent, handler); 
    };

    /// <summary>
    ///     Removes a handler for the SourceUpdated attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
/*    public static void */
    Binding.RemoveSourceUpdatedHandler = function(/*DependencyObject*/ element, /*EventHandler<DataTransferEventArgs>*/ handler)
    { 
        FrameworkElement.RemoveHandler(element, Binding.SourceUpdatedEvent, handler);
    };


    /// <summary>
    ///     Adds a handler for the TargetUpdated attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
    /*public static void */
    Binding.AddTargetUpdatedHandler = function(/*DependencyObject*/ element, /*EventHandler<DataTransferEventArgs>*/ handler)
    {
        FrameworkElement.AddHandler(element, Binding.TargetUpdatedEvent, handler);
    } ;

    /// <summary> 
    ///     Removes a handler for the TargetUpdated attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
    /*public static void */
    Binding.RemoveTargetUpdatedHandler = function(/*DependencyObject*/ element, /*EventHandler<DataTransferEventArgs>*/ handler)
    {
        FrameworkElement.RemoveHandler(element, Binding.TargetUpdatedEvent, handler); 
    };


    /// <summary> Static accessor for XmlNamespaceManager property </summary>
    /// <exception cref="ArgumentNullException"> DependencyObject target cannot be null </exception>
    /*public static XmlNamespaceManager */
    Binding.GetXmlNamespaceManager = function(/*DependencyObject*/ target)
    { 
        if (target == null)
            throw new Error('new ArgumentNullException("target")'); 

        return /*(XmlNamespaceManager)*/target.GetValue(Binding.XmlNamespaceManagerProperty);
    };

    /// <summary> Static modifier for XmlNamespaceManager property </summary>
    /// <exception cref="ArgumentNullException"> DependencyObject target cannot be null </exception>
    /*public static void */
    Binding.SetXmlNamespaceManager = function(/*DependencyObject*/ target, /*XmlNamespaceManager*/ value) 
    {
        if (target == null) 
            throw new Error('ArgumentNullException("target")'); 

        target.SetValue(Binding.XmlNamespaceManagerProperty, value); 
    };

    /*private static bool */
    function IsValidXmlNamespaceManager(/*object*/ value)
    { 
        return (value == null) || SystemXmlHelper.IsXmlNamespaceManager(value);
    } 

    /// <summary>
    ///     A source property or a converter can return Binding.DoNothing
    ///     to instruct the binding engine to do nothing (i.e. do not transfer
    ///     a value to the target, do not move to the next Binding in a 
    ///     PriorityBinding, do not use the fallback or default value).
    /// </summary> 
    /*public static readonly object*/ 
    Binding.DoNothing = Type.DoNothing ;//{name:"Binding.DoNothing"}; 

    /// <summary> 
    ///     This string is used as the PropertyName of the
    ///     PropertyChangedEventArgs to indicate that an indexer property
    ///     has been changed.
    /// </summary> 
    /*public const string */
    Binding.IndexerName = Type.IndexerName ;//"Item[]";
    
//    static final ObjectRef 
    Binding.UnsetSource = new ExplicitObjectRef(null); 
//    static final ObjectRef 
    Binding.StaticSourceRef = new ExplicitObjectRef(BindingExpression.StaticSource); 
	
	Binding.Type = new Type("Binding", Binding, [BindingBase.Type]);
	return Binding;
});



 





