/**
 * EventTrigger
 */

define(["dojo/_base/declare", "system/Type", "windows/TriggerBase", "markup/IAddChild", "windows/TriggerAction",
        "windows/UncommonField"], 
		function(declare, Type, TriggerBase, IAddChild, TriggerAction,
				UncommonField){
	

//    internal class 
    var EventTriggerSourceListener = declare("EventTriggerSourceListener", [TriggerBase, IAddChild], {
		constructor:function(/*EventTrigger*/ trigger, /*FrameworkElement*/ host ) 
        { 
            this._owningTrigger = trigger;
            this._owningTriggerHost = host; 
        },
        
//        internal void 
        Handler : function(/*object*/ sender, /*RoutedEventArgs*/ e)
        { 
            // Invoke all actions of the associated EventTrigger object.
            /*TriggerActionCollection*/
        	var actions = _owningTrigger.Actions; 
            for( var j = 0; j < actions.Count; j++ ) 
            {
                actions[j].Invoke(this._owningTriggerHost); 
            }
        }
    	
    }); 
	
	var EventTrigger = declare("EventTrigger", [TriggerBase, IAddChild], {
		constructor:function(/*RoutedEvent*/ routedEvent )
        {
			if(routedEvent !== undefined){
	            this.RoutedEvent = routedEvent; 
			}
        },
        
        /// <summary> 
        ///  Add an object child to this trigger's Actions 
        /// </summary>
//        protected virtual void 
        AddChild:function(/*object*/ value) 
        {
            /*TriggerAction*/
        	var action = value instanceof TriggerAction ? value : null;
            if (action == null)
            { 
                throw new ArgumentException(SR.Get(SRID.EventTriggerBadAction, value.GetType().Name));
            } 
            this.Actions.Add(action); 
        },
        /// <summary>
        ///  Add a text string to this trigger's Actions.  Note that this
        ///  is not supported and will result in an exception.
        /// </summary> 
//        protected virtual void 
        AddText:function(/*string*/ text)
        { 
//            XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
        },
        
        /// <summary> 
        ///     If we get a new inheritance context (or it goes to null) 
        ///     we need to tell actions about it.
        /// </summary> 
//        internal override void 
        OnInheritanceContextChangedCore:function(/*EventArgs*/ args)
        {
        	TriggerBase.prototype.OnInheritanceContextChangedCore.call(this, args);
 
            if (_actions == null)
            { 
                return; 
            }
 
            for (var i=0; i<this._actions.Count; i++)
            {
                /*DependencyObject*/
            	var action = this._actions[i] instanceof DependencyObject ? this._actions[i] : null;
                if (action != null && action.InheritanceContext == this) 
                {
                    action.OnInheritanceContextChanged(args); 
                } 
            }
        },

        ///////////////////////////////////////////////////////////////////////
        // Internal members 

//        internal sealed override void 
        Seal:function() 
        { 
            if( this.PropertyValues.Count > 0 )
            { 
                throw new InvalidOperationException(SR.Get(SRID.EventTriggerDoNotSetProperties));
            }

            // EnterActions/ExitActions aren't meaningful on event triggers. 
            if( this.HasEnterActions || this.HasExitActions )
            { 
                throw new InvalidOperationException(SR.Get(SRID.EventTriggerDoesNotEnterExit)); 
            }
 
            if (this._routedEvent != null && this._actions != null && this._actions.Count > 0)
            {
            	this._actions.Seal(this);  // TriggerActions need a link back to me to fetch the childId corresponding the sourceId string.
            } 

            base.Seal(); // Should be almost a no-op given lack of PropertyValues 
        },
        
        
	});
	
	Object.defineProperties(EventTrigger.prototype,{
	      /// <summary>
        ///     The Event that will activate this trigger - one must be specified
        /// before an event trigger is meaningful.
        /// </summary> 
//        public RoutedEvent 
        RoutedEvent:
        { 
            get:function() 
            {
                return this._routedEvent; 
            },
            set:function(value)
            {
                if ( value == null ) 
                {
                    throw new ArgumentNullException("value"); 
                } 

                if( this.IsSealed ) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger"));
                }
 
                // When used as an element trigger, we don't actually need to seal
                //  to ensure cross-thread usability.  However, if we *are* fixed on 
                //  listening to an event already, don't allow this change. 
                if( this._routedEventHandler != null )
                { 
                    // Recycle the Seal error message.
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger"));
                }
 
                this._routedEvent = value;
            } 
        },

        /// <summary> 
        ///     The x:Name of the object whose event shall trigger this
        /// EventTrigger.   If null, then this is the object being Styled
        /// and not anything under its Style.VisualTree.
        /// </summary> 
//        public string 
        SourceName: 
        { 
            get:function()
            { 
                return this._sourceName;
            },
            set:function(value)
            { 
                if( this.IsSealed )
                { 
                    throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger")); 
                }
 
                this._sourceName = value;
            }
        },
 
        /// <summary>
        ///     Internal method to get the childId corresponding to the public 
        /// sourceId. 
        /// </summary>
//        internal int 
        TriggerChildIndex: 
        {
            get:function()
            {
                return this._childId; 
            },
            set:function(value)
            { 
            	this._childId = value;
            } 
        },

        /// <summary>
        ///     The collection of actions to activate when the Event occurs. 
        /// At least one action is required for the trigger to be meaningful.
        /// </summary> 
//        public TriggerActionCollection 
        Actions:
        { 
            get:function()
            {
                if( this._actions == null )
                { 
                	this._actions = new TriggerActionCollection();
 
                    // Give the collection a back-link, this is used for the inheritance context 
                	this._actions.Owner = this;
                } 
                return this._actions;
            }
        }
	});
	
	Object.defineProperties(EventTrigger, {
		   //  Exists on objects that have information in their [Class].Triggers collection property. (Currently root FrameworkElement only.)
//        internal static readonly UncommonField<TriggerCollection> 
        TriggerCollectionField:
        {
        	get:function(){
            	if(EventTrigger._TriggerCollectionField === undefined){
            		EventTrigger._TriggerCollectionField = new UncommonField/*<TriggerCollection>*/(null); 
            	}
            	return EventTrigger._TriggerCollectionField;
        	}

        },
        	
	});
	
	
    ///////////////////////////////////////////////////////////////////////
    // Internal static methods to process event trigger information stored 
    //  in attached storage of other objects. 
    //
    // Called when the FrameworkElement and the tree structure underneath it has been 
    //  built up.  This is the earliest point we can resolve all the child
    //  node identification that may exist in a Trigger object.
    // This should be moved to base class if PropertyTrigger support is added.
//    internal static void 
	EventTrigger.ProcessTriggerCollection = function( /*FrameworkElement*/ triggersHost ) 
    {
        /*TriggerCollection*/var triggerCollection = EventTrigger.TriggerCollectionField.GetValue(triggersHost); 
        if( triggerCollection != null ) 
        {
            // Don't seal the collection, because we allow it to change.  We will, 
            // however, seal each of the triggers.

            for( var i = 0; i < triggerCollection.Count; i++ )
            { 
            	EventTrigger.ProcessOneTrigger( triggersHost, triggerCollection[i] );
            } 
        } 
    };


    ////////////////////////////////////////////////////////////////////////
    // ProcessOneTrigger
    // 
    // Find the target element for this trigger, and set a listener for
    // the event into (pointing back to the trigger). 

//    internal static void 
    EventTrigger.ProcessOneTrigger = function( /*FrameworkElement*/ triggersHost, /*TriggerBase*/ triggerBase )
    { 
        // This code path is used in the element trigger case.  We don't actually
        //  need these guys to be usable cross-thread, so we don't really need
        //  to freeze/seal these objects.  The only one expected to cause problems
        //  is a change to the RoutedEvent.  At the same time we remove this 
        //  Seal(), the RoutedEvent setter will check to see if the handler has
        //  already been created and refuse an update if so. 
        // triggerBase.Seal(); 

        /*EventTrigger*/var eventTrigger = triggerBase instanceof EventTrigger ? triggerBase : null; 
        if( eventTrigger != null )
        {
//            Debug.Assert( eventTrigger._routedEventHandler == null && eventTrigger._source == null);

            // PERF: Cache this result if it turns out we're doing a lot of lookups on the same name.
            eventTrigger._source = FrameworkElement.FindNamedFrameworkElement( triggersHost, eventTrigger.SourceName ); 

            // Create a statefull event delegate (which keeps a ref to the FE).
            /*EventTriggerSourceListener*/
            var listener = new EventTriggerSourceListener( eventTrigger, triggersHost ); 


            // Store the RoutedEventHandler & target for use in DisconnectOneTrigger
            eventTrigger._routedEventHandler = new RoutedEventHandler(listener.Handler); 
            eventTrigger._source.AddHandler( eventTrigger.RoutedEvent, eventTrigger._routedEventHandler,
                                             false /* HandledEventsToo */ ); 
        } 
        else
        { 
            throw new InvalidOperationException(SR.Get(SRID.TriggersSupportsEventTriggersOnly));
        }
    };

    ////////////////////////////////////////////////////////////////////////
    // 
    // DisconnectAllTriggers 
    //
    // Call DisconnectOneTrigger for each trigger in the Triggers collection. 

//    internal static void 
    EventTrigger.DisconnectAllTriggers = function( /*FrameworkElement*/ triggersHost )
    {
        /*TriggerCollection*/var triggerCollection = EventTrigger.TriggerCollectionField.GetValue(triggersHost); 

        if( triggerCollection != null ) 
        { 
            for( var i = 0; i < triggerCollection.Count; i++ )
            { 
            	EventTrigger.DisconnectOneTrigger( triggersHost, triggerCollection[i] );
            }

        } 
    };

    //////////////////////////////////////////////////////////////////////// 
    //
    // DisconnectOneTrigger 
    //
    // In ProcessOneTrigger, we connect an event trigger to the element
    // which it targets.  Here, we remove the event listener to clean up.

//    internal static void 
    EventTrigger.DisconnectOneTrigger = function( /*FrameworkElement*/ triggersHost, /*TriggerBase*/ triggerBase )
    { 
        /*EventTrigger*/
    	var eventTrigger = triggerBase instanceof EventTrigger ? triggerBase : null; 

        if( eventTrigger != null ) 
        {
            eventTrigger._source.RemoveHandler( eventTrigger.RoutedEvent, eventTrigger._routedEventHandler);
            eventTrigger._routedEventHandler = null;
        } 
        else
        { 
            throw new InvalidOperationException(SR.Get(SRID.TriggersSupportsEventTriggersOnly)); 
        }
    };
    
	
	EventTrigger.Type = new Type("EventTrigger", EventTrigger, [TriggerBase.Type, IAddChild.Type]);
	return EventTrigger;
});

//
//        /////////////////////////////////////////////////////////////////////// 
//        // Private members
//
//        // Event that will fire this trigger
//        private RoutedEvent _routedEvent = null; 
//
//        // Name of the Style.VisualTree node whose event to listen to. 
//        //  May remain the default value of null, which  means the object being 
//        //  Styled is the target instead of something within the Style.VisualTree.
//        private string _sourceName = null; 
//
//        // Style childId corresponding to the SourceName string
//        private int _childId = 0;
// 
//        // Actions to invoke when this trigger is fired
//        private TriggerActionCollection _actions = null; 
// 
//        ///////////////////////////////////////////////////////////////////////
//        // Storage attached to other objects to support triggers 
//        //  Some of these can be moved to base class as necessary.
//
//     
//
//        // This is the listener that we hook up to the SourceId element. 
//        RoutedEventHandler _routedEventHandler = null; 
//
//        // This is the SourceId-ed element. 
//        FrameworkElement _source;


 
  



 
