package org.summer.view.widget;

import org.summer.view.widget.collection.Collection;
/// <summary>
///     A collection of SetterBase objects to be used
///     in Template and its trigger classes
/// </summary> 
public /*sealed*/ class SetterBaseCollection extends Collection<SetterBase>
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
    protected /*override*/ void InsertItem(int index, SetterBase item)
    { 
        CheckSealed();
        SetterBaseValidation(item); 
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
    protected /*override*/ void SetItem(int index, SetterBase item) 
    {
        CheckSealed(); 
        SetterBaseValidation(item); 
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

    /*internal*/ public  void Seal() 
    {
        _sealed = true; 

        // Seal all the setters
        for (int i=0; i<Count; i++) 
        {
            this[i].Seal();
        }
    } 

//    #endregion InternalMethods 

//    #region PrivateMethods

    private void CheckSealed()
    {
        if (_sealed)
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.CannotChangeAfterSealed, "SetterBaseCollection")*/);
        } 
    } 

    private void SetterBaseValidation(SetterBase setterBase) 
    {
        if (setterBase == null)
        {
            throw new ArgumentNullException("setterBase"); 
        }
    } 

//    #endregion PrivateMethods

//    #region Data

    private boolean _sealed;

//    #endregion Data
}