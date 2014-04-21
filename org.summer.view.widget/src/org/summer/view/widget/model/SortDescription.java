package org.summer.view.widget.model;

/// <summary>
/// Defines a property and direction to sort a list by. 
/// </summary> 
public class SortDescription
{ 
    //-----------------------------------------------------
    //
    //  Public Constructors
    // 
    //-----------------------------------------------------

//    #region Public Constructors 

    /// <summary> 
    /// Create a sort description.
    /// </summary>
    /// <param name="propertyName">Property to sort by</param>
    /// <param name="direction">Specifies the direction of sort operation</param> 
    /// <exception cref="InvalidEnumArgumentException"> direction is not a valid value for ListSortDirection </exception>
    public SortDescription(String propertyName, ListSortDirection direction) 
    { 
        if (direction != ListSortDirection.Ascending && direction != ListSortDirection.Descending)
            throw new InvalidEnumArgumentException("direction", (int)direction, typeof(ListSortDirection)); 

        _propertyName = propertyName;
        _direction = direction;
        _sealed = false; 
    }

//    #endregion Public Constructors 


    //------------------------------------------------------
    //
    //  Public Properties
    // 
    //-----------------------------------------------------

//    #region Public Properties 

    /// <summary> 
    /// Property name to sort by.
    /// </summary>
    public String PropertyName
    { 
        get { return _propertyName; }
        set 
        { 
            if (_sealed)
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 

            _propertyName = value;
        }
    } 

    /// <summary> 
    /// Sort direction. 
    /// </summary>
    public ListSortDirection Direction 
    {
        get { return _direction; }
        set
        { 
            if (_sealed)
                throw new InvalidOperationException(SR.Get(SRID.CannotChangeAfterSealed, "SortDescription")); 

            if (value < ListSortDirection.Ascending || value > ListSortDirection.Descending)
                throw new InvalidEnumArgumentException("value", (int) value, typeof(ListSortDirection)); 

            _direction = value;
        }
    } 

    /// <summary> 
    /// Returns true if the SortDescription is in use (sealed). 
    /// </summary>
    public boolean IsSealed 
    {
        get { return _sealed; }
    }

//    #endregion Public Properties

    //------------------------------------------------------ 
    //
    //  Public methods 
    //
    //------------------------------------------------------

//    #region Public Methods 

    /// <summary> Override of Object.Equals </summary> 
    public /*override*/ boolean Equals(Object obj) 
    {
        return (obj is SortDescription) ? (this == (SortDescription)obj) : false; 
    }

    /// <summary> Equality operator for SortDescription. </summary>
    public static boolean operator==(SortDescription sd1, SortDescription sd2) 
    {
        return  sd1.PropertyName == sd2.PropertyName && 
                sd1.Direction == sd2.Direction; 
    }

    /// <summary> Inequality operator for SortDescription. </summary>
    public static boolean operator!=(SortDescription sd1, SortDescription sd2)
    {
        return !(sd1 == sd2); 
    }

    /// <summary> Override of Object.GetHashCode </summary> 
    public /*override*/ int GetHashCode()
    { 
        int result = Direction.GetHashCode();
        if (PropertyName != null)
        {
            result = unchecked(PropertyName.GetHashCode() + result); 
        }
        return result; 
    } 

//    #endregion Public Methods 

    //-----------------------------------------------------
    //
    //  Internal methods 
    //
    //------------------------------------------------------ 

//    #region Internal Methods

    /*internal*/ void Seal()
    {
        _sealed = true;
    } 

//    #endregion Internal Methods 

    //-----------------------------------------------------
    // 
    //  Private Fields
    //
    //-----------------------------------------------------

//    #region Private Fields

    private String              _propertyName; 
    private ListSortDirection   _direction;
    boolean                        _sealed; 

//    #endregion Private Fields
}

