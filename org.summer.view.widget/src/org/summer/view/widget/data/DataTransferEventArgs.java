package org.summer.view.widget.data;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.RoutedEventArgs;

/// <summary>
/// Arguments for DataTransfer events such as TargetUpdated or SourceUpdated. 
/// </summary>
/// <remarks>
/// <p>The TargetUpdated event is raised whenever a value is transferred from the source to the target,
/// (but only for bindings that have requested the event, by setting BindFlags.NotifyOnTargetUpdated).</p> 
/// <p>The SourceUpdated event is raised whenever a value is transferred from the target to the source,
/// (but only for bindings that have requested the event, by setting BindFlags.NotifyOnSourceUpdated).</p> 
/// </remarks> 
public class DataTransferEventArgs extends RoutedEventArgs
{ 
    //-----------------------------------------------------
    //
    //  Constructors
    // 
    //-----------------------------------------------------

    /*internal*/ public DataTransferEventArgs(DependencyObject targetObject, DependencyProperty dp) 
    {
    	super();
        _targetObject = targetObject; 
        _dp = dp;
    }

    //------------------------------------------------------ 
    //
    //  Public Properties 
    // 
    //-----------------------------------------------------

    /// <summary>
    /// The target object of the binding that raised the event.
    /// </summary>
    public DependencyObject TargetObject 
    {
        get { return _targetObject; } 
    } 

    /// <summary> 
    /// The target property of the binding that raised the event.
    /// </summary>
    public DependencyProperty Property
    { 
        get { return _dp; }
    } 

    //------------------------------------------------------
    // 
    //  Protected Methods
    //
    //------------------------------------------------------

    /// <summary>
    ///     The mechanism used to call the type-specific handler on the 
    ///     target. 
    /// </summary>
    /// <param name="genericHandler"> 
    ///     The generic handler to call in a type-specific way.
    /// </param>
    /// <param name="genericTarget">
    ///     The target to call the handler on. 
    /// </param>
    protected /*override*/ void InvokeEventHandler(Delegate genericHandler, Object genericTarget) 
    { 
        EventHandler<DataTransferEventArgs> handler = (EventHandler<DataTransferEventArgs>) genericHandler;

        handler(genericTarget, this);
    }

    //----------------------------------------------------- 
    //
    //  Private Fields 
    // 
    //------------------------------------------------------

    private DependencyObject _targetObject;
    private DependencyProperty _dp;
}