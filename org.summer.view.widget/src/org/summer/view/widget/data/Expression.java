package org.summer.view.widget.data;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.DependencySource;
import org.summer.view.widget.InvalidOperationException;
/// <summary> 
///     Modes for expressions 
/// </summary>
//CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)] 
/*internal*/ enum ExpressionMode
{
	/**
    * No options 
    */
    None  ,//  = 0, 

    /**
     *  Expression may not be set in multiple places 
     *  Even if a non-shareable Expression has been attached and
    ///     then detached, it still may not be reused 
     */
    NonSharable, 

    /**
     * Expression forwards invalidations to the property on which it is set.
     * 
     * This option implies <see cref="NonSharable"/> as well.
     *  Whenever the expression is notified of an invalidation of one 
     *  of its sources via OnPropertyInvalidation, it
     *  promises to invalidate the property on which it is set, so the
     *  property engine doesn't have to. 
     *  The property engine does not 
     *  need to keep a reference to the target <see cref="DependencyObject"/>
     *  in this case, which can allow the target to be garbage-collected
     *  when it is no longer in use.
     */
    ForwardsInvalidations,

    /**
     * Expression supports DependencySources on a different Dispatcher.
     * 
     * This option implies <see cref="ForwardsInvalidations"/> as well.
     * When set, it suppresses the property engine's check that the
     * DependencyObject to which the expression is attached belongs to 
     * the same Thread as all its DependencySources, and allows
     * OnPropertyInvalidation notifications to arrive on the "wrong" 
     * Thread.  It is the expression's responsibility to handle these 
     * correctly, typically by marshalling them to the right Thread.
     * Note:  The check is only suppressed when the source isn't owned 
     * by any Thread (i.e. source.Dispatcher == null).
     */
    SupportsUnboundSources
} 


/// <summary> 
///     Expressions are used to define dependencies between properties
/// </summary> 
/// <remarks>
///     When a property's computed value is no longer considered valid, the
///     property must be invalidated. The property engine propagates these
///     invalidations to all dependents.<para/> 
///
///     An Expression can be set per-instance per-property via SetValue. 
/// </remarks> 
//CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//[TypeConverter(typeof(ExpressionConverter))] 
public class Expression
{
    /// <summary>
    ///     Expression construction 
    /// </summary>
    /*internal*/public Expression() 
    { 
    	this(ExpressionMode.None);
    }

    /// <summary>
    ///     Expression construction
    /// </summary>
    /*internal*/public Expression(ExpressionMode mode) 
    {
        _flags = 0; 

        switch(mode)
        { 
            case /*ExpressionMode.*/None:
                break;

            case /*ExpressionMode.*/NonSharable: 
                _flags |= InternalFlags.NonShareable;
                break; 

            case /*ExpressionMode.*/ForwardsInvalidations:
                _flags |= InternalFlags.ForwardsInvalidations; 
                _flags |= InternalFlags.NonShareable;
                break;

            case /*ExpressionMode.*/SupportsUnboundSources: 
                _flags |= InternalFlags.ForwardsInvalidations;
                _flags |= InternalFlags.NonShareable; 
                _flags |= InternalFlags.SupportsUnboundSources; 
                break;

            default:
                throw new ArgumentException(/*SR.Get(SRID.UnknownExpressionMode)*/);
        }
    } 


    // We need this Clone method to copy a binding during Freezable.Copy.  We shouldn't be taking 
    // the target Object/dp parameters here, but Binding.ProvideValue requires it.  (Binding
    // could probably be re-factored so that we don't need this). 
//    [FriendAccessAllowed] // Used by Freezables
    /*internal*/ /*virtual*/public Expression Copy( DependencyObject targetObject, DependencyProperty targetDP )
    {
        // By default, just use the same copy. 
        return this;
    } 


    /// <summary> 
    ///     List of sources of the Expression
    /// </summary>
    /// <returns>Sources list</returns>
    /*internal*/ /*virtual*/ public DependencySource[] GetSources() 
    {
        return null; 
    } 

    /// <summary> 
    ///     Called to evaluate the Expression value
    /// </summary>
    /// <param name="d">DependencyObject being queried</param>
    /// <param name="dp">Property being queried</param> 
    /// <returns>Computed value. Unset if unavailable.</returns>
    /*internal*/ /*virtual*/ public Object GetValue(DependencyObject d, DependencyProperty dp) 
    { 
        return DependencyProperty.UnsetValue;
    } 

    /// <summary>
    ///     Allows Expression to store set values
    /// </summary> 
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param> 
    /// <param name="value">Value being set</param> 
    /// <returns>true if Expression handled storing of the value</returns>
    /*internal*/ /*virtual*/ public boolean SetValue(DependencyObject d, DependencyProperty dp, Object value) 
    {
        return false;
    }

    /// <summary>
    ///     Notification that the Expression has been set as a property's value 
    /// </summary> 
    /// <param name="d">DependencyObject being set</param>
    /// <param name="dp">Property being set</param> 
    /*internal*/ /*virtual*/ public void OnAttach(DependencyObject d, DependencyProperty dp)
    {
    }

    /// <summary>
    ///     Notification that the Expression has been removed as a property's value 
    /// </summary> 
    /// <param name="d">DependencyObject being cleared</param>
    /// <param name="dp">Property being cleared</param> 
    /*internal*/ /*virtual*/ public void OnDetach(DependencyObject d, DependencyProperty dp)
    {
    }

    /// <summary>
    ///     Notification that a Dependent that this Expression established has 
    ///     been invalidated as a result of a Source invalidation 
    /// </summary>
    /// <param name="d">DependencyObject that was invalidated</param> 
    /// <param name="args">Changed event args for the property that was invalidated</param>
    /*internal*/ /*virtual*/ public void OnPropertyInvalidation(DependencyObject d, DependencyPropertyChangedEventArgs args)
    {
    } 


    /// <summary> 
    ///     Dynamically change this Expression sources (availiable only for NonShareable
    ///     Expressions) 
    /// </summary>
    /// <remarks>
    ///     Expression must be in use on provided DependencyObject/DependencyProperty.
    ///     GetSources must reflect the old sources to be replaced by the provided newSources. 
    /// </remarks>
    /// <param name="d">DependencyObject whose sources are to be updated</param> 
    /// <param name="dp">The property that the Expression is set to</param> 
    /// <param name="newSources">New sources</param>
    /*internal*/public void ChangeSources(DependencyObject d, DependencyProperty dp, DependencySource[] newSources) 
    {
        if (d == null && !ForwardsInvalidations)
        {
            throw new IllegalArgumentException("d"); 
        }

        if (dp == null && !ForwardsInvalidations) 
        {
            throw new IllegalArgumentException("dp"); 
        }

        if (Shareable)
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.ShareableExpressionsCannotChangeSources)*/);
        } 

        DependencyObject.ValidateSources(d, newSources, this);

        // Additional validation in callee
        if (ForwardsInvalidations)
        {
            DependencyObject.ChangeExpressionSources(this, null, null, newSources); 
        }
        else 
        { 
            DependencyObject.ChangeExpressionSources(this, d, dp, newSources);
        } 
    }


    // Determines if Expression can be attached: 
    //    1) If Shareable
    //    2) If NonShareable and not HasBeenAttached 
    /*internal*/ public boolean Attachable 
    {
        // Once a NonShareable has been Attached, it can't be used anywhere 
        // else again (even if it's been Detached)
        get { return Shareable || !HasBeenAttached; }
    }

    /*internal*/public boolean Shareable
    { 
        get { return (_flags & InternalFlags.NonShareable) == 0; } 
    }

    /*internal*/ public boolean ForwardsInvalidations
    {
        get { return (_flags & InternalFlags.ForwardsInvalidations) != 0; }
    } 

    /*internal*/ public boolean SupportsUnboundSources 
    { 
        get { return (_flags & InternalFlags.SupportsUnboundSources) != 0; }
    } 

    /*internal*/public boolean HasBeenAttached
    {
        get { return (_flags & InternalFlags.Attached) != 0; } 
    }

    /*internal*/ public boolean HasBeenDetached 
    {
        get { return (_flags & InternalFlags.Detached) != 0; } 
    }

    /*internal*/ public void MarkAttached()
    { 
        _flags |= InternalFlags.Attached;
    } 

    /*internal*/ public void MarkDetached()
    { 
        _flags |= InternalFlags.Detached;
    }

    /// <summary> 
    /// Expression.GetValue can return NoValue to indicate that
    /// the property engine should obtain the value some other way. 
    /// </summary> 
//    [FriendAccessAllowed]
    /*internal*/ public static final Object NoValue = new Object(); 

    private InternalFlags _flags;

//    [Flags] 
    /*private*/ enum InternalFlags
    { 
        None        ,// = 0x0, 
        NonShareable ,//= 0x1,
        ForwardsInvalidations ,//= 0x2, 
        SupportsUnboundSources ,//= 0x4,
        Attached    ,//= 0x8,
        Detached    ,//= 0x10,
    } 

} 