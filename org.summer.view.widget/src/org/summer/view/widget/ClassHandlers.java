package org.summer.view.widget;

//Stores ClassHandlers for the given RoutedEvent
/*internal*/ public class ClassHandlers
{ 
//    #region Operations

    /// <summary> 
    ///     Is the given Object equals the current
    /// </summary> 
    public /*override*/ boolean Equals(Object o)
    {
        return Equals((ClassHandlers)o);
    } 

    /// <summary> 
    ///     Is the given ClassHandlers struct equals the current 
    /// </summary>
    public boolean Equals(ClassHandlers classHandlers) 
    {
        return (
            classHandlers.RoutedEvent == this.RoutedEvent &&
            classHandlers.Handlers == this.Handlers); 
    }

    /// <summary> 
    ///     Serves as a hash function for a particular type, suitable for use in
    ///     hashing algorithms and data structures like a hash table 
    /// </summary>
    public /*override*/ int GetHashCode()
    {
        return super.GetHashCode(); 
    }

    /// <summary> 
    ///     Equals operator overload
    /// </summary> 
    public static boolean operator== (ClassHandlers classHandlers1, ClassHandlers classHandlers2)
    {
        return classHandlers1.Equals(classHandlers2);
    } 

    /// <summary> 
    ///     NotEquals operator overload 
    /// </summary>
    public static boolean operator!= (ClassHandlers classHandlers1, ClassHandlers classHandlers2) 
    {
        return !classHandlers1.Equals(classHandlers2);
    }

//    #endregion Operations

//    #region Data 

    /*internal*/ public RoutedEvent RoutedEvent; 
    /*internal*/ public RoutedEventHandlerInfoList Handlers;
    /*internal*/ public boolean HasSelfHandlers;

//    #endregion Data 
}