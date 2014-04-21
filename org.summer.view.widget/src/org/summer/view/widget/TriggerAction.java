package org.summer.view.widget;

import org.summer.view.widget.internal.InheritanceContextHelper;

/// <summary>
///   A class that describes an action to perform for a trigger
/// </summary>
public abstract class TriggerAction extends DependencyObject 
{
    /// <summary> 
    ///     Internal constructor - nobody is supposed to ever create an instance 
    /// of this class.  Use a derived class instead.
    /// </summary> 
    /*internal*/ public  TriggerAction()
    {
    }

    /// <summary>
    ///     Called when all conditions have been satisfied for this action to be 
    /// invoked.  (Conditions are not described on this TriggerAction Object, 
    /// but on the Trigger Object holding it.)
    /// </summary> 
    /// <remarks>
    ///     This variant is called when the Trigger lives in a Style, and
    /// hence given a reference to its corresponding Style Object.
    /// </remarks> 
    /*internal*/ public  abstract void Invoke( FrameworkElement fe,
                                  FrameworkContentElement fce, 
                                  Style targetStyle, 
                                  FrameworkTemplate targetTemplate,
                                  Int64 layer); 

    /// <summary>
    ///     Called when all conditions have been satisfied for this action to be
    /// invoked.  (Conditions are not described on this TriggerAction Object, 
    /// but on the Trigger Object holding it.)
    /// </summary> 
    /// <remarks> 
    ///     This variant is called when the Trigger lives on an element, as
    /// opposed to Style, so it is given only the reference to the element. 
    /// </remarks>
    /*internal*/ public  abstract void Invoke( FrameworkElement fe );

    /// <summary> 
    ///     The EventTrigger Object that contains this action.
    /// </summary> 
    /// <remarks> 
    ///     A TriggerAction may need to get back to the Trigger that
    /// holds it, this is the back-link to allow that.  Also, this allows 
    /// us to verify that each TriggerAction is associated with one and
    /// only one Trigger.
    /// </remarks>
    /*internal*/ public  TriggerBase ContainingTrigger 
    {
        get 
        { 
            return _containingTrigger;
        } 
    }

    /// <summary>
    ///     Seal this TriggerAction to prevent further updates 
    /// </summary>
    /// <remarks> 
    ///     TriggerActionCollection will call this method to seal individual 
    /// TriggerAction objects.  We do some check here then call the
    /// parameter-less Seal() so subclasses can also do what they need to do. 
    /// </remarks>
    /*internal*/ public  void Seal( TriggerBase containingTrigger )
    {
        if( IsSealed && containingTrigger != _containingTrigger ) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.TriggerActionMustBelongToASingleTrigger)*/); 
        } 
        _containingTrigger = containingTrigger;
        Seal(); 
    }

    /// <summary>
    ///     A derived class overrideing Seal() should set Object state such 
    /// that further changes are not allowed.  This is also a time to make
    /// validation checks to see if all parameters make sense. 
    /// </summary> 
    /*internal*/ public  /*override*/ void Seal()
    { 
        if( IsSealed )
        {
            throw new InvalidOperationException(/*SR.Get(SRID.TriggerActionAlreadySealed)*/);
        } 
        super.Seal();
    } 

    /// <summary>
    ///     Checks sealed status and throws exception if Object is sealed 
    /// </summary>
    /*internal*/ public  void CheckSealed()
    {
        if( IsSealed ) 
        {
            throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "TriggerAction")*/); 
        } 
    }

    // Define the DO's inheritance context

    /*internal*/ public  /*override*/ DependencyObject InheritanceContext
    { 
        get { return _inheritanceContext; }
    } 

    // Receive a new inheritance context (this will be a FE/FCE)
    /*internal*/ public  /*override*/ void AddInheritanceContext(DependencyObject context, DependencyProperty property) 
    {
        InheritanceContextHelper.AddInheritanceContext(context,
                                                          this,
                                                          /*ref*/ _hasMultipleInheritanceContexts, 
                                                          /*ref*/ _inheritanceContext);
    } 

    // Remove an inheritance context (this will be a FE/FCE)
    /*internal*/ public  /*override*/ void RemoveInheritanceContext(DependencyObject context, DependencyProperty property) 
    {
        InheritanceContextHelper.RemoveInheritanceContext(context,
                                                              this,
                                                              /*ref*/ _hasMultipleInheritanceContexts, 
                                                              /*ref*/ _inheritanceContext);
    } 

    /// <summary>
    ///     Says if the current instance has multiple InheritanceContexts 
    /// </summary>
    /*internal*/ public  /*override*/ boolean HasMultipleInheritanceContexts
    {
        get { return _hasMultipleInheritanceContexts; } 
    }


    private TriggerBase _containingTrigger = null;

    // Fields to implement DO's inheritance context
    private DependencyObject _inheritanceContext = null;
    private boolean _hasMultipleInheritanceContexts = false;
} 