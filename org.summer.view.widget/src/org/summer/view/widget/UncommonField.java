package org.summer.view.widget;
/// <summary>
/// 
/// </summary>
//CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft./*internal*/ public.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//[FriendAccessAllowed] // Built into Base, used by Core and Framework
/*internal*/ public class UncommonField<T> 
{
    /// <summary> 
    ///     Create a new UncommonField. 
    /// </summary>
    public UncommonField()  
    {
    	this(default(T));
    }

    /// <summary> 
    ///     Create a new UncommonField.
    /// </summary> 
    /// <param name="defaultValue">The default value of the field.</param> 
    public UncommonField(T defaultValue)
    { 
        _defaultValue = defaultValue;
        _hasBeenSet = false;

        /*lock*/synchronized (DependencyProperty.Synchronized) 
        {
            _globalIndex = DependencyProperty.GetUniqueGlobalIndex(null, null); 

            DependencyProperty.RegisteredPropertyList.Add();
        } 
    }

    /// <summary>
    ///     Write the given value onto a DependencyObject instance. 
    /// </summary>
    /// <param name="instance">The DependencyObject on which to set the value.</param> 
    /// <param name="value">The value to set.</param> 
    public void SetValue(DependencyObject instance, T value)
    { 
        if (instance != null)
        {
            EntryIndex entryIndex = instance.LookupEntry(_globalIndex);

            // Set the value if it's not the default, otherwise remove the value.
            if (!Object.ReferenceEquals(value, _defaultValue)) 
            { 
                instance.SetEffectiveValue(entryIndex, null /* dp */, _globalIndex, null /* metadata */, value, BaseValueSourceInternal.Local);
                _hasBeenSet = true; 
            }
            else
            {
                instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */); 
            }
        } 
        else 
        {
            throw new IllegalArgumentException("instance"); 
        }
    }

    /// <summary> 
    ///     Read the value of this field on a DependencyObject instance.
    /// </summary> 
    /// <param name="instance">The DependencyObject from which to get the value.</param> 
    /// <returns></returns>
    public T GetValue(DependencyObject instance) 
    {
        if (instance != null)
        {
            if (_hasBeenSet) 
            {
                EntryIndex entryIndex = instance.LookupEntry(_globalIndex); 

                if (entryIndex.Found)
                { 
                    Object value = instance.EffectiveValues[entryIndex.Index].LocalValue;

                    if (value != DependencyProperty.UnsetValue)
                    { 
                        return (T)value;
                    } 
                } 
                return _defaultValue;
            } 
            else
            {
                return _defaultValue;
            } 
        }
        else 
        { 
            throw new IllegalArgumentException("instance");
        } 
    }


    /// <summary> 
    ///     Clear this field from the given DependencyObject instance.
    /// </summary> 
    /// <param name="instance"></param> 
    public void ClearValue(DependencyObject instance)
    { 
        if (instance != null)
        {
            EntryIndex entryIndex = instance.LookupEntry(_globalIndex);

            instance.UnsetEffectiveValue(entryIndex, null /* dp */, null /* metadata */);
        } 
        else 
        {
            throw new IllegalArgumentException("instance"); 
        }
    }

    /*internal*/ public int GlobalIndex 
    {
        get 
        { 
            return _globalIndex;
        } 
    }

//    #region Private Fields

    private T _defaultValue;
    private int _globalIndex; 
    private boolean _hasBeenSet; 

//    #endregion 
}