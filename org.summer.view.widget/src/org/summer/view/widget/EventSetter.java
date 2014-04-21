package org.summer.view.widget;
/// <summary> 
///     TargetType event setting class. 
/// </summary>
public class EventSetter extends SetterBase 
{
    /// <summary>
    ///     EventSetter construction
    /// </summary> 
    public EventSetter()
    { 
    } 

    /// <summary> 
    ///     EventSetter construction
    /// </summary>
    public EventSetter(RoutedEvent routedEvent, Delegate handler)
    { 
        if (routedEvent == null)
        { 
            throw new IllegalArgumentException("routedEvent"); 
        }
        if (handler == null) 
        {
            throw new IllegalArgumentException("handler");
        }

        _event = routedEvent;
        _handler = handler; 
    } 

    /// <summary> 
    ///    Event that is being set by this setter
    /// </summary>
    public RoutedEvent Event
    { 
        get { return _event; }
        set 
        { 
            if (value == null)
            { 
                throw new IllegalArgumentException("value");
            }

            CheckSealed(); 
            _event = value;
        } 
    } 

    /// <summary> 
    ///    Handler delegate that is being set by this setter
    /// </summary>
//    [TypeConverter(typeof(System.Windows.Markup.EventSetterHandlerConverter))]
    public Delegate Handler 
    {
        get { return _handler; } 
        set 
        {
            if (value == null) 
            {
                throw new IllegalArgumentException("value");
            }

            CheckSealed();
            _handler = value; 
        } 
    }

    /// <summary>
    ///     HandledEventsToo flag that is being set by this setter
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean HandledEventsToo
    { 
        get { return _handledEventsToo; } 
        set
        { 
            CheckSealed();
            _handledEventsToo = value;
        }
    } 


    // 
    //  Do the error checking that we can only do once all of the properties have been
    //  set, then call up to base. 
    //

    /*internal*/ /*override*/public void Seal()
    { 

        if (_event == null) 
        { 
            throw new IllegalArgumentException(/*SR.Get(SRID.NullPropertyIllegal, "EventSetter.Event")*/);
        } 
        if (_handler == null)
        {
            throw new IllegalArgumentException(/*SR.Get(SRID.NullPropertyIllegal, "EventSetter.Handler")*/);
        } 
        if (_handler.GetType() != _event.HandlerType)
        { 
            throw new IllegalArgumentException(/*SR.Get(SRID.HandlerTypeIllegal)*/); 
        }

        super.Seal();

    }


    private RoutedEvent    _event; 
    private Delegate       _handler; 
    private boolean        _handledEventsToo;
} 