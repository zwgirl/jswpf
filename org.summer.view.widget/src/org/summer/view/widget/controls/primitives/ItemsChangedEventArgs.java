package org.summer.view.widget.controls.primitives;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.collection.NotifyCollectionChangedAction;

/// <summary>
/// The ItemsChanged event is raised by an ItemContainerGenerator to inform
/// layouts that the items collection has changed.
/// </summary> 
public class ItemsChangedEventArgs extends EventArgs
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    /*internal*/public ItemsChangedEventArgs(NotifyCollectionChangedAction action, 
                                    GeneratorPosition position,
                                    GeneratorPosition oldPosition, 
                                    int itemCount, 
                                    int itemUICount)
    { 
        _action = action;
        _position = position;
        _oldPosition = oldPosition;
        _itemCount = itemCount; 
        _itemUICount = itemUICount;
    } 

    /*internal*/ public ItemsChangedEventArgs(NotifyCollectionChangedAction action,
                                    GeneratorPosition position, 
                                    int itemCount,
                                    int itemUICount) 

    { 
    	this(action, position, new GeneratorPosition(-1, 0), itemCount, itemUICount);
    }

    //------------------------------------------------------ 
    //
    //  Public Properties 
    //
    //-----------------------------------------------------

    /// <summary> What happened </summary> 
    public NotifyCollectionChangedAction Action { get { return _action; } }

    /// <summary> Where it happened </summary> 
    public GeneratorPosition Position       { get { return _position; } }

    /// <summary> Where it happened </summary>
    public GeneratorPosition OldPosition    { get { return _oldPosition; } }

    /// <summary> How many items were involved </summary> 
    public int ItemCount                    { get { return _itemCount; } }

    /// <summary> How many UI elements were involved </summary> 
    public int ItemUICount                  { get { return _itemUICount; } }


    //------------------------------------------------------
    //
    //  Private Fields 
    //
    //------------------------------------------------------ 

    NotifyCollectionChangedAction  _action;
    GeneratorPosition       _position; 
    GeneratorPosition       _oldPosition;
    int                     _itemCount;
    int                     _itemUICount;
} 

/// <summary> 
///     The delegate to use for handlers that receive ItemsChangedEventArgs. 
/// </summary>
//public delegate void ItemsChangedEventHandler(object sender, ItemsChangedEventArgs e); 

