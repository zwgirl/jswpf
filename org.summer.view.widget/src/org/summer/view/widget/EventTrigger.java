package org.summer.view.widget;

import org.summer.view.widget.markup.IAddChild;

/// <summary>
///   A class that controls a set of actions to activate in response to an event
/// </summary>
//[ContentProperty("Actions")] 
public class EventTrigger extends TriggerBase implements IAddChild
{ 
    /////////////////////////////////////////////////////////////////////// 
    // Public members

    /// <summary>
    ///     Build an empty instance of the EventTrigger Object
    /// </summary>
    public EventTrigger() 
    {
    } 

    /// <summary>
    ///     Build an instance of EventTrigger associated with the given event 
    /// </summary>
    public EventTrigger( RoutedEvent routedEvent )
    {
        RoutedEvent = routedEvent; 
    }

    /// <summary> 
    ///  Add an Object child to this trigger's Actions
    /// </summary> 
//    public void IAddChild.AddChild(Object value)
//    {
//        AddChild(value);
//    } 

    /// <summary> 
    ///  Add an Object child to this trigger's Actions 
    /// </summary>
    public /*virtual*/ void AddChild(Object value) 
    {
        TriggerAction action = value as TriggerAction;
        if (action == null)
        { 
            throw new ArgumentException(/*SR.Get(SRID.EventTriggerBadAction, value.GetType().Name)*/);
        } 
        Actions.Add(action); 
    }

    /// <summary>
    ///  Add a text String to this trigger's Actions.  Note that this
    ///  is not supported and will result in an exception.
    /// </summary> 
//    void IAddChild.AddText(String text)
//    { 
//        AddText(text); 
//    }

    /// <summary>
    ///  Add a text String to this trigger's Actions.  Note that this
    ///  is not supported and will result in an exception.
    /// </summary> 
    public /*virtual*/ void AddText(String text)
    { 
        XamlSerializerUtil.ThrowIfNonWhiteSpaceInAddText(text, this); 
    }

    /// <summary>
    ///     The Event that will activate this trigger - one must be specified
    /// before an event trigger is meaningful.
    /// </summary> 
    public RoutedEvent RoutedEvent
    { 
        get 
        {
            return _routedEvent; 
        }
        set
        {
            if ( value == null ) 
            {
                throw new IllegalArgumentException("value"); 
            } 

            if( IsSealed ) 
            {
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger")*/);
            }

            // When used as an element trigger, we don't actually need to seal
            //  to ensure cross-thread usability.  However, if we *are* fixed on 
            //  listening to an event already, don't allow this change. 
            if( _routedEventHandler != null )
            { 
                // Recycle the Seal error message.
                throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger")*/);
            }

            _routedEvent = value;
        } 
    } 

    /// <summary> 
    ///     The x:Name of the Object whose event shall trigger this
    /// EventTrigger.   If null, then this is the Object being Styled
    /// and not anything under its Style.VisualTree.
    /// </summary> 
//    [DefaultValue(null)]
    public String SourceName 
    { 
        get
        { 
            return _sourceName;
        }
        set
        { 
            if( IsSealed )
            { 
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "EventTrigger")); 
            }

            _sourceName = value;
        }
    }

    /// <summary>
    ///     Internal method to get the childId corresponding to the public 
    /// sourceId. 
    /// </summary>
    /*internal*/ public  int TriggerChildIndex 
    {
        get
        {
            return _childId; 
        }
        set 
        { 
            _childId = value;
        } 
    }

    /// <summary>
    ///     The collection of actions to activate when the Event occurs. 
    /// At least one action is required for the trigger to be meaningful.
    /// </summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)] 
    public TriggerActionCollection Actions
    { 
        get
        {
            if( _actions == null )
            { 
                _actions = new TriggerActionCollection();

                // Give the collection a back-link, this is used for the inheritance context 
                _actions.Owner = this;
            } 
            return _actions;
        }
    }


    /// <summary> 
    ///     If we get a new inheritance context (or it goes to null) 
    ///     we need to tell actions about it.
    /// </summary> 
    /*internal*/ public  /*override*/ void OnInheritanceContextChangedCore(EventArgs args)
    {
        super.OnInheritanceContextChangedCore(args);

        if (_actions == null)
        { 
            return; 
        }

        for (int i=0; i<_actions.Count; i++)
        {
            DependencyObject action = _actions[i] as DependencyObject;
            if (action != null && action.InheritanceContext == this) 
            {
                action.OnInheritanceContextChanged(args); 
            } 
        }
    } 

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized. 
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeActions() 
    {
        return ( _actions != null && _actions.Count > 0 ); 
    }

    ///////////////////////////////////////////////////////////////////////
    // Internal members 

    /*internal*/ public  /*sealed*/ /*override*/ void Seal() 
    { 
        if( PropertyValues.Count > 0 )
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.EventTriggerDoNotSetProperties)*/);
        }

        // EnterActions/ExitActions aren't meaningful on event triggers. 
        if( HasEnterActions || HasExitActions )
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.EventTriggerDoesNotEnterExit)*/); 
        }

        if (_routedEvent != null && _actions != null && _actions.Count > 0)
        {
            _actions.Seal(this);  // TriggerActions need a link back to me to fetch the childId corresponding the sourceId String.
        } 

        super.Seal(); // Should be almost a no-op given lack of PropertyValues 
    } 

    /////////////////////////////////////////////////////////////////////// 
    // Private members

    // Event that will fire this trigger
    private RoutedEvent _routedEvent = null; 

    // Name of the Style.VisualTree node whose event to listen to. 
    //  May remain the default value of null, which  means the Object being 
    //  Styled is the target instead of something within the Style.VisualTree.
    private String _sourceName = null; 

    // Style childId corresponding to the SourceName String
    private int _childId = 0;

    // Actions to invoke when this trigger is fired
    private TriggerActionCollection _actions = null; 

    ///////////////////////////////////////////////////////////////////////
    // Storage attached to other objects to support triggers 
    //  Some of these can be moved to base class as necessary.

    //  Exists on objects that have information in their [Class].Triggers collection property. (Currently root FrameworkElement only.)
    /*internal*/ public  static final UncommonField<TriggerCollection> TriggerCollectionField = new UncommonField<TriggerCollection>(null); 

    // This is the listener that we hook up to the SourceId element. 
    RoutedEventHandler _routedEventHandler = null; 

    // This is the SourceId-ed element. 
    FrameworkElement _source;



    ///////////////////////////////////////////////////////////////////////
    // Internal static methods to process event trigger information stored 
    //  in attached storage of other objects. 
    //
    // Called when the FrameworkElement and the tree structure underneath it has been 
    //  built up.  This is the earliest point we can resolve all the child
    //  node identification that may exist in a Trigger Object.
    // This should be moved to base class if PropertyTrigger support is added.
    /*internal*/ public  static void ProcessTriggerCollection( FrameworkElement triggersHost ) 
    {
        TriggerCollection triggerCollection = TriggerCollectionField.GetValue(triggersHost); 
        if( triggerCollection != null ) 
        {
            // Don't seal the collection, because we allow it to change.  We will, 
            // however, seal each of the triggers.

            for( int i = 0; i < triggerCollection.Count; i++ )
            { 
                ProcessOneTrigger( triggersHost, triggerCollection[i] );
            } 
        } 
    }


    ////////////////////////////////////////////////////////////////////////
    // ProcessOneTrigger
    // 
    // Find the target element for this trigger, and set a listener for
    // the event into (pointing back to the trigger). 

    /*internal*/ public  static void ProcessOneTrigger( FrameworkElement triggersHost, TriggerBase triggerBase )
    { 
        // This code path is used in the element trigger case.  We don't actually
        //  need these guys to be usable cross-thread, so we don't really need
        //  to freeze/seal these objects.  The only one expected to cause problems
        //  is a change to the RoutedEvent.  At the same time we remove this 
        //  Seal(), the RoutedEvent setter will check to see if the handler has
        //  already been created and refuse an update if so. 
        // triggerBase.Seal(); 

        EventTrigger eventTrigger = (EventTrigger) (triggerBase instanceof EventTrigger ? triggerBase : null); 
        if( eventTrigger != null )
        {
//            Debug.Assert( eventTrigger._routedEventHandler == null && eventTrigger._source == null);

            // PERF: Cache this result if it turns out we're doing a lot of lookups on the same name.
            eventTrigger._source = FrameworkElement.FindNamedFrameworkElement( triggersHost, eventTrigger.SourceName ); 

            // Create a statefull event delegate (which keeps a ref to the FE).
            EventTriggerSourceListener listener = new EventTriggerSourceListener( eventTrigger, triggersHost ); 


            // Store the RoutedEventHandler & target for use in DisconnectOneTrigger
            eventTrigger._routedEventHandler = new RoutedEventHandler(listener.Handler); 
            eventTrigger._source.AddHandler( eventTrigger.RoutedEvent, eventTrigger._routedEventHandler,
                                             false /* HandledEventsToo */ ); 
        } 
        else
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.TriggersSupportsEventTriggersOnly)*/);
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // 
    // DisconnectAllTriggers 
    //
    // Call DisconnectOneTrigger for each trigger in the Triggers collection. 

    /*internal*/ public  static void DisconnectAllTriggers( FrameworkElement triggersHost )
    {
        TriggerCollection triggerCollection = TriggerCollectionField.GetValue(triggersHost); 

        if( triggerCollection != null ) 
        { 
            for( int i = 0; i < triggerCollection.Count; i++ )
            { 
                DisconnectOneTrigger( triggersHost, triggerCollection[i] );
            }

        } 
    }

    //////////////////////////////////////////////////////////////////////// 
    //
    // DisconnectOneTrigger 
    //
    // In ProcessOneTrigger, we connect an event trigger to the element
    // which it targets.  Here, we remove the event listener to clean up.

    /*internal*/ public  static void DisconnectOneTrigger( FrameworkElement triggersHost, TriggerBase triggerBase )
    { 
        EventTrigger eventTrigger = triggerBase as EventTrigger; 

        if( eventTrigger != null ) 
        {
            eventTrigger._source.RemoveHandler( eventTrigger.RoutedEvent, eventTrigger._routedEventHandler);
            eventTrigger._routedEventHandler = null;
        } 
        else
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.TriggersSupportsEventTriggersOnly)*/); 
        }
    } 
}