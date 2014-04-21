package org.summer.view.widget;

import org.summer.view.widget.collection.Collection;

/// <summary>
///     A collection of Condition objects to be used
///     in Template and its trigger classes
/// </summary> 
public /*sealed*/ class ConditionCollection extends Collection<Condition>
{ 
//    #region ProtectedMethods 

    /// <summary> 
    ///     ClearItems /*override*/
    /// </summary>
    protected /*override*/ void ClearItems()
    { 
        CheckSealed();
        super.ClearItems(); 
    } 

    /// <summary> 
    ///     InsertItem /*override*/
    /// </summary>
    protected /*override*/ void InsertItem(int index, Condition item)
    { 
        CheckSealed();
        ConditionValidation(item); 
        super.InsertItem(index, item); 
    }

    /// <summary>
    ///     RemoveItem /*override*/
    /// </summary>
    protected /*override*/ void RemoveItem(int index) 
    {
        CheckSealed(); 
        super.RemoveItem(index); 
    }

    /// <summary>
    ///     SetItem /*override*/
    /// </summary>
    protected /*override*/ void SetItem(int index, Condition item) 
    {
        CheckSealed(); 
        ConditionValidation(item); 
        super.SetItem(index, item);
    } 

//    #endregion ProtectedMethods

//    #region PublicMethods 

    /// <summary> 
    ///     Returns the sealed state of this object.  If true, any attempt 
    ///     at modifying the state of this object will trigger an exception.
    /// </summary> 
    public boolean IsSealed
    {
        get
        { 
            return _sealed;
        } 
    } 

//    #endregion PublicMethods 

//    #region InternalMethods

    /*internal*/ public  void Seal(ValueLookupType type) 
    {
        _sealed = true; 

        // Seal all the conditions
        for (int i=0; i<Count; i++) 
        {
            this[i].Seal(type);
        }
    } 

//    #endregion InternalMethods 

//    #region PrivateMethods

    private void CheckSealed()
    {
        if (_sealed)
        { 
            throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "ConditionCollection"));
        } 
    } 

    private void ConditionValidation(Object value) 
    {
        if (value == null)
        {
            throw new ArgumentNullException("value"); 
        }

        Condition condition = value as Condition; 
        if (condition == null)
        { 
            throw new ArgumentException(SR.Get(SRID.MustBeCondition));
        }
    }

//    #endregion PrivateMethods

//    #region Data 

    private boolean _sealed; 

//    #endregion Data

} 