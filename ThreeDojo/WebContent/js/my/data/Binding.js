define([ "dojo/_base/declare", "dojo/_base/lang", "my/data/Feature" ], function(declare, lang, Feature) {
	var Binding = declare(BindingBase, {
	    // Which source property is in use 
		//    enum 
	    SourceProperties : 
	    { None:0, RelativeSource:1, ElementName:2, Source:3, StaticSource:4, InternalSource:5 },
	
	    /// <summary>
	    /// Convenience constructor.  Sets most fields to default values. 
	    /// </summary> 
	    /// <param name="path">source path </param>
	//    public Binding(string path) 
	    constructor:function(path){
	        if (path != null)
	        {
	            if (System.Windows.Threading.Dispatcher.CurrentDispatcher == null) 
	                throw new Error("InvalidOperationException");  // This is actually never called since CurrentDispatcher will throw if null.
	
	            this.Path = new PropertyPath(path); 
	        }
	    },
	
	
	    /// <summary>
	    ///     A source property or a converter can return Binding.DoNothing
	    ///     to instruct the binding engine to do nothing (i.e. do not transfer
	    ///     a value to the target, do not move to the next Binding in a 
	    ///     PriorityBinding, do not use the fallback or default value).
	    /// </summary> 
	//    public static readonly object DoNothing = new NamedObject("Binding.DoNothing"); 
	//
	//    /// <summary> 
	//    ///     This string is used as the PropertyName of the
	//    ///     PropertyChangedEventArgs to indicate that an indexer property
	//    ///     has been changed.
	//    /// </summary> 
	//    public const string IndexerName = "Item[]";
	
	    //----------------------------------------------------- 
	    //
	    //  Protected Methods 
	    //
	    //------------------------------------------------------
	
	    /// <summary> 
	    /// Create an appropriate expression for this Binding, to be attached
	    /// to the given DependencyProperty on the given DependencyObject. 
	    /// </summary> 
	//    internal override BindingExpressionBase 
	    CreateBindingExpressionOverride:function(/*DependencyObject*/ target, /*DependencyProperty*/ dp, /*BindingExpressionBase*/ owner)
	    { 
	        return BindingExpression.CreateBindingExpression(target, dp, this, owner);
	    },
	
	//    internal override ValidationRule 
	    LookupValidationRule:function(/*Type*/ type) 
	    {
	        return this.LookupValidationRule(type, ValidationRulesInternal); 
	    }, 
	
	
	    /*internal object */
	    DoFilterException:function(/*object*/ bindExpr, /*Exception*/ exception) 
	    { 
	        /*UpdateSourceExceptionFilterCallback*/ var callback = /*(UpdateSourceExceptionFilterCallback)*/GetValue(Feature.ExceptionFilterCallback, null);
	        if (callback != null) 
	            return callback(bindExpr, exception);
	
	        return exception;
	    }, 
	
	    // called by BindingExpression when the Binding doesn't specify a path. 
	    // (Can't use Path setter, since that replaces the BindingExpression.) 
	    /*internal void */
	    UsePath:function(/*PropertyPath*/ path)
	    { 
	        this._ppath = path;
	        this.SetFlag(BindingFlags.PathGeneratedInternally);
	    },
	
	
	    // determine the source property currently in use 
	    /*void */DetermineSource:function()
	    { 
	        this._sourceInUse = 
	            (this._source == UnsetSource)                ? SourceProperties.None :
	            (HasValue(Feature.RelativeSource))      ? SourceProperties.RelativeSource : 
	            (HasValue(Feature.ElementSource))       ? SourceProperties.ElementName :
	            (HasValue(Feature.ObjectSource))        ? SourceProperties.Source :
	            (this._source == StaticSourceRef)            ? SourceProperties.StaticSource :
	                                                      SourceProperties.InternalSource; 
	    }
	});
    //----------------------------------------------------- 
    //
    //  Private Fields 
    //
    //-----------------------------------------------------

//    SourceProperties    _sourceInUse; 
//
//    PropertyPath        _ppath; 
//    ObjectRef           _source = UnsetSource; 
//
//    bool                _isAsync; 
//    bool                _bindsDirectlyToSource;
//    bool                _doesNotTransferDefaultValue;   // initially = false
//
//    int                 _attachedPropertiesInPath; 
//
//    static readonly ObjectRef UnsetSource = new ExplicitObjectRef(null); 
//    static readonly ObjectRef StaticSourceRef = new ExplicitObjectRef(BindingExpression.StaticSource); 


	/// The SourceUpdated event is raised whenever a value is transferred from the target to the source,
	/// but only for Bindings that have requested the event by setting BindFlags.NotifyOnSourceUpdated.
	/// </summary> 
//	public static readonly RoutedEvent SourceUpdatedEvent =
	Binding.SourceUpdatedEvent = 
		EventManager.RegisterRoutedEvent("SourceUpdated", 
                                    RoutingStrategy.Bubble, 
                                    typeof(EventHandler/*<DataTransferEventArgs>*/),
                                    typeof(Binding)); 

    /// <summary>
    ///     Adds a handler for the SourceUpdated attached event
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void AddSourceUpdatedHandler(DependencyObject element, EventHandler<DataTransferEventArgs> handler) 
	Binding.AddSourceUpdatedHandler = function(element, handler){
        FrameworkElement.AddHandler(element, SourceUpdatedEvent, handler); 
    }

    /// <summary>
    ///     Removes a handler for the SourceUpdated attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param> 
//    public static void RemoveSourceUpdatedHandler(DependencyObject element, EventHandler<DataTransferEventArgs> handler)
    Binding.RemoveSourceUpdatedHandler = function(element, handler){ 
        FrameworkElement.RemoveHandler(element, SourceUpdatedEvent, handler);
    }

    /// <summary> 
    /// The TargetUpdated event is raised whenever a value is transferred from the source to the target,
    /// but only for Bindings that have requested the event by setting BindFlags.NotifyOnTargetUpdated. 
    /// </summary> 
//    public static readonly RoutedEvent TargetUpdatedEvent =
    Binding.TargetUpdatedEvent = EventManager.RegisterRoutedEvent("TargetUpdated", 
                                    RoutingStrategy.Bubble,
                                    typeof(EventHandler/*<DataTransferEventArgs>*/),
                                    typeof(Binding));

    /// <summary>
    ///     Adds a handler for the TargetUpdated attached event 
    /// </summary> 
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param> 
//    public static void AddTargetUpdatedHandler(DependencyObject element, EventHandler<DataTransferEventArgs> handler)
    Binding.AddTargetUpdatedHandler = function(element, handler){
        FrameworkElement.AddHandler(element, TargetUpdatedEvent, handler);
    } 

    /// <summary> 
    ///     Removes a handler for the TargetUpdated attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param> 
    /// <param name="handler">Event Handler to be removed</param>
//    public static void RemoveTargetUpdatedHandler(DependencyObject element, EventHandler<DataTransferEventArgs> handler)
    Binding.RemoveTargetUpdatedHandler = function(element, handler){
        FrameworkElement.RemoveHandler(element, TargetUpdatedEvent, handler); 
    }
    
    Binding.DoNothing = new NamedObject("Binding.DoNothing"); 
    
    Binding./*public const string */IndexerName = "Item[]";
    
	Object.defineProperties(Binding.prototype, {
		/// <summary> True if an exception during source updates should be considered a validation error.</summary>
		//[DefaultValue(false)] 
		/*public bool */
		ValidatesOnExceptions:
		{
		  get:function(){ 
		      return TestFlag(BindingFlags.ValidatesOnExceptions);
		  } ,
		  set:function(value){
		      /*bool*/var currentValue = this.TestFlag(BindingFlags.ValidatesOnExceptions); 
		      if (currentValue != value)
		      {
		    	  this.CheckSealed();
		    	  this.ChangeFlag(BindingFlags.ValidatesOnExceptions, value); 
		      }
		  } 
		} ,
		
		/// <summary> True if a data error in the source item should be considered a validation error.</summary> 
		//[DefaultValue(false)]
		/*public bool */
		ValidatesOnDataErrors:
		{
		  get:function(){
		      return this.TestFlag(BindingFlags.ValidatesOnDataErrors); 
		  } ,
		  set:function(value){ 
		      /*bool*/var currentValue = this.TestFlag(BindingFlags.ValidatesOnDataErrors);
		      if (currentValue != value)
		      {
		    	  this.CheckSealed(); 
		    	  this.ChangeFlag(BindingFlags.ValidatesOnDataErrors, value);
		      } 
		  } 
		},
		
		/// <summary> True if a data error from INotifyDataErrorInfo source item should be considered a validation error.</summary>
		//[DefaultValue(true)]
		/*public bool*/ 
		ValidatesOnNotifyDataErrors:
		{ 
		  get:function(){ 
		      return this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors); 
		  },
		  set :function(value){
		      /*bool*/var currentValue = this.TestFlag(BindingFlags.ValidatesOnNotifyDataErrors);
		      if (currentValue != value)
		      { 
		    	  this.CheckSealed();
		    	  this.ChangeFlag(BindingFlags.ValidatesOnNotifyDataErrors, value); 
		      } 
		  }
		} ,
		
		
		/// <summary> The source path (for CLR bindings).</summary>
		/*public PropertyPath*/ 
		Path:
		{
		  get:function() { return this._ppath; } ,
		  set:function(value){
			  this.CheckSealed(); 
		
		      this._ppath = value;
		      this._attachedPropertiesInPath = -1;
		      this.ClearFlag(BindingFlags.PathGeneratedInternally); 
		
		      if (this._ppath != null && this._ppath.StartsWithStaticProperty) 
		      { 
		          if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.StaticSource)
		          { 
		              SourceReference = StaticSourceRef;
		          }
		          else
		              throw new InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.StaticSource, this._sourceInUse)); 
		      }
		  } 
		} ,
		
		
		/// <summary> The XPath path (for XML bindings).</summary>
		//[DefaultValue(null)]
//		public string 
		XPath:
		{ 
		  get:function() { return /*(string)*/this.GetValue(Feature.XPath, null); },
		  set:function(value) { CheckSealed(); this.SetValue(Feature.XPath, value, null); } 
		},
	    /// <summary> Binding mode </summary> 
//	    [DefaultValue(BindingMode.Default)]
	    /*public BindingMode */
		Mode:
	    {
	        get:function() 
	        {
	            switch (GetFlagsWithinMask(BindingFlags.PropagationMask)) 
	            { 
	                case BindingFlags.OneWay:           return BindingMode.OneWay;
	                case BindingFlags.TwoWay:           return BindingMode.TwoWay; 
	                case BindingFlags.OneWayToSource:   return BindingMode.OneWayToSource;
	                case BindingFlags.OneTime:          return BindingMode.OneTime;
	                case BindingFlags.PropDefault:      return BindingMode.Default;
	            } 
	            Invariant.Assert(false, "Unexpected BindingMode value");
	            return 0; 
	        },
	        set:function(value)
	        { 
	            CheckSealed();

	            /*BindingFlags*/var flags = FlagsFrom(value);
	            if (flags == BindingFlags.IllegalInput) 
	                throw new InvalidEnumArgumentException("value", /*(int)*/ value, typeof(BindingMode));

	            this.ChangeFlagsWithinMask(BindingFlags.PropagationMask, flags); 
	        }
	    },

	    /// <summary> Update type </summary>
//	    [DefaultValue(UpdateSourceTrigger.Default)]
	    /*public UpdateSourceTrigger */
	    UpdateSourceTrigger: 
	    {
	        get:function() 
	        { 
	            switch (GetFlagsWithinMask(BindingFlags.UpdateMask))
	            { 
	                case BindingFlags.UpdateOnPropertyChanged: return UpdateSourceTrigger.PropertyChanged;
	                case BindingFlags.UpdateOnLostFocus:    return UpdateSourceTrigger.LostFocus;
	                case BindingFlags.UpdateExplicitly:     return UpdateSourceTrigger.Explicit;
	                case BindingFlags.UpdateDefault:        return UpdateSourceTrigger.Default; 
	            }
	            Invariant.Assert(false, "Unexpected UpdateSourceTrigger value"); 
	            return 0; 
	        },
	        set:function(value) 
	        {
	        	this.CheckSealed();

	            /*BindingFlags*/var flags = this.FlagsFromBindingFlags(value); 
	            if (flags == BindingFlags.IllegalInput)
	                throw new InvalidEnumArgumentException("value", /*(int)*/ value, typeof(UpdateSourceTrigger)); 

	            this.ChangeFlagsWithinMask(BindingFlags.UpdateMask, flags);
	        } 
	    },

	    /// <summary> Raise SourceUpdated event whenever a value flows from target to source </summary>
//	    [DefaultValue(false)] 
//	    public bool 
	    NotifyOnSourceUpdated:
	    { 
	        get:function() 
	        {
	            return this.TestFlag(BindingFlags.NotifyOnSourceUpdated); 
	        },
	        set:function(value)
	        {
	            /*bool*/var currentValue = this.TestFlag(BindingFlags.NotifyOnSourceUpdated); 
	            if (currentValue != value)
	            { 
	            	this.CheckSealed(); 
	            	this.ChangeFlag(BindingFlags.NotifyOnSourceUpdated, value);
	            } 
	        }
	    },


	    /// <summary> Raise TargetUpdated event whenever a value flows from source to target </summary>
//	    [DefaultValue(false)] 
//	    public bool 
	    NotifyOnTargetUpdated: 
	    {
	        get:function() 
	        {
	            return this.TestFlag(BindingFlags.NotifyOnTargetUpdated);
	        },
	        set:function(value) 
	        {
	            /*bool*/var currentValue = this.TestFlag(BindingFlags.NotifyOnTargetUpdated); 
	            if (currentValue != value) 
	            {
	            	this.CheckSealed(); 
	            	this.ChangeFlag(BindingFlags.NotifyOnTargetUpdated, value);
	            }
	        }
	    }, 

	    /// <summary> Raise ValidationError event whenever there is a ValidationError on Update</summary> 
//	    [DefaultValue(false)] 
//	    public bool 
	    NotifyOnValidationError:
	    { 
	        get:function()
	        {
	            return this.TestFlag(BindingFlags.NotifyOnValidationError);
	        }, 
	        set:function(value)
	        { 
	            /*bool*/var currentValue = this.TestFlag(BindingFlags.NotifyOnValidationError); 
	            if (currentValue != value)
	            { 
	            	this.CheckSealed();
	            	this.ChangeFlag(BindingFlags.NotifyOnValidationError, value);
	            }
	        } 
	    },

	    /// <summary> The Converter to apply </summary> 
//	    [DefaultValue(null)]
//	    public IValueConverter 
	    Converter: 
	    {
	        get:function() { return /*(IValueConverter)*/this.GetValue(Feature.Converter, null); },
	        set:function(value) { this.CheckSealed(); this.SetValue(Feature.Converter, value, null); }
	    }, 

	    /// <summary> 
	    /// The parameter to pass to converter. 
	    /// </summary>
	    /// <value></value> 
//	    [DefaultValue(null)]
//	    public object 
	    ConverterParameter:
	    {
	        get:function() { return this.GetValue(Feature.ConverterParameter, null); }, 
	        set:function(value) { this.CheckSealed(); this.SetValue(Feature.ConverterParameter, value, null); }
	    }, 

	    /// <summary> Culture in which to evaluate the converter </summary>
//	    [DefaultValue(null)] 
//	    [TypeConverter(typeof(System.Windows.CultureInfoIetfLanguageTagConverter))]
//	    public CultureInfo 
	    ConverterCulture:
	    {
	        get:function() { return /*(CultureInfo)*/this.GetValue(Feature.Culture, null); }, 
	        set:function(value) { this.CheckSealed(); this.SetValue(Feature.Culture, value, null); }
	    }, 

	    /// <summary> object to use as the source </summary>
	    /// <remarks> To clear this property, set it to DependencyProperty.UnsetValue. </remarks> 
//	    public object 
	    Source:
	    {
	        get:function()
	        { 
	            /*WeakReference<object>*/ var wr = /*(WeakReference<object>)*/this.GetValue(Feature.ObjectSource, null);
	            if (wr == null) 
	                return null; 
	            else
	            { 
	                /*object*/ var target;
	                return wr.TryGetTarget(/*out*/ target) ? target : null;
	            }
	        },
	        set:function(value)
	        { 
	            CheckSealed(); 

	            if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.Source) 
	            {
	                if (value != DependencyProperty.UnsetValue)
	                {
	                	this.SetValue(Feature.ObjectSource, new WeakReference<object>(value)); 
	                    this.SourceReference = new ExplicitObjectRef(value);
	                } 
	                else 
	                {
	                	this.ClearValue(Feature.ObjectSource); 
	                    this.SourceReference = null;
	                }
	            }
	            else 
	                throw new InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.Source, _sourceInUse));
	        } 
	    },
	    //------------------------------------------------------
	    // 
	    //  Internal Properties 
	    //
	    //----------------------------------------------------- 

	    /*internal override CultureInfo */
	    ConverterCultureInternal:
	    {
	        get:function() { return this.ConverterCulture; } 
	    },

//	    internal ObjectRef 
	    SourceReference: 
	    {
	        get:function() { return (this._source == UnsetSource) ? null : this._source; }, 
	        set:function(value) { CheckSealed();  this._source = value;  this.DetermineSource(); }
	    },

//	    internal bool 
	    TreeContextIsRequired: 
	    {
	        get:function() 
	        { 
	            /*bool*/var treeContextIsRequired;

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
	                    _attachedPropertiesInPath = 0;
	                } 
	            }
	            treeContextIsRequired = (this._attachedPropertiesInPath > 0); 

	            // namespace prefixes in the XPath need an XmlNamespaceManager
	            if (!treeContextIsRequired && this.HasValue(Feature.XPath) && XPath.IndexOf(':') >= 0) 
	            {
	                treeContextIsRequired = true;
	            }

	            return treeContextIsRequired;
	        } 
	    }, 

	    // same as the public ValidationRules property, but 
	    // doesn't try to create an instance if there isn't one there
//	    internal override Collection<ValidationRule> 
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
//	    internal bool 
	    TransfersDefaultValue: 
	    {
	        get:function() { return !this._doesNotTransferDefaultValue; }, 
	        set:function(value) { this.CheckSealed();  this._doesNotTransferDefaultValue = !value; } 
	    },

//	    internal override bool
	    ValidatesOnNotifyDataErrorsInternal:
	    {
	        get:function() { return this.ValidatesOnNotifyDataErrors; }
	    },
	    
	    /// <summary>
	    ///     Collection&lt;ValidationRule&gt; is a collection of ValidationRule 
	    ///     implementations on either a Binding or a MultiBinding.  Each of the rules
	    ///     is run by the binding engine when validation on update to source
	    /// </summary>
//	    public Collection<ValidationRule> 
	    ValidationRules:
	    {
	        get:function() 
	        { 
	            if (!this.HasValue(Feature.ValidationRules))
	            	this.SetValue(Feature.ValidationRules, new ValidationRuleCollection()); 

	            return /*(ValidationRuleCollection)*/this.GetValue(Feature.ValidationRules, null);
	        }

	    },

	    /// <summary> 
	    /// Description of the object to use as the source, relative to the target element.
	    /// </summary> 
//	    [DefaultValue(null)] 
//	    public RelativeSource 
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
	                throw new InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.RelativeSource, _sourceInUse));
	        } 
	    },

	    /// <summary> Name of the element to use as the source </summary> 
//	    [DefaultValue(null)]
//	    public string 
	    ElementName: 
	    {
	        get:function() { return (string)GetValue(Feature.ElementSource, null); },
	        set:function(value)
	        { 
	        	this.CheckSealed();

	            if (this._sourceInUse == SourceProperties.None || this._sourceInUse == SourceProperties.ElementName) 
	            {
	            	this.SetValue(Feature.ElementSource, value, null); 
	                this.SourceReference = (value != null) ? new ElementObjectRef(value) : null;
	            }
	            else
	                throw new InvalidOperationException(SR.Get(SRID.BindingConflict, SourceProperties.ElementName, _sourceInUse)); 
	        }
	    }, 

	    /// <summary> True if Binding should get/set values asynchronously </summary>
//	    [DefaultValue(false)] 
//	    public bool 
	    IsAsync:
	    {
	        get:function() { return this._isAsync; },
	        set:function(value) { this.CheckSealed();  this._isAsync = value; } 
	    },

	    /// <summary> Opaque data passed to the asynchronous data dispatcher </summary> 
//	    [DefaultValue(null)]
//	    public object 
	    AsyncState: 
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
//	    [DefaultValue(false)] 
//	    public bool 
	    BindsDirectlyToSource:
	    {
	        get:function() { return this._bindsDirectlyToSource; },
	        set:function(value) { this.CheckSealed();  this._bindsDirectlyToSource = value; } 
	    },

	    /// <summary> 
	    /// called whenever any exception is encountered when trying to update
	    /// the value to the source. The application author can provide its own 
	    /// handler for handling exceptions here. If the delegate returns
	    ///     null - don't throw an error or provide a ValidationError.
	    ///     Exception - returns the exception itself, we will fire the exception using Async exception model.
	    ///     ValidationError - it will set itself as the BindingInError and add it to the element's Validation errors. 
	    /// </summary>
//	    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
//	    public UpdateSourceExceptionFilterCallback 
	    UpdateSourceExceptionFilter: 
	    {
	        get:function() { return /*(UpdateSourceExceptionFilterCallback)*/this.GetValue(Feature.ExceptionFilterCallback, null); }, 
	        set:function(value) { this.SetValue(Feature.ExceptionFilterCallback, value, null); }
	    }
	});
});