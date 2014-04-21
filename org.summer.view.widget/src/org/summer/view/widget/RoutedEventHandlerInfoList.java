package org.summer.view.widget;
/// <summary> 
///     This data-structure represents a linked list of all
///     the Class Handlers for a type and its base types. 
/// </summary>
/*internal*/ public class RoutedEventHandlerInfoList
{
    /*internal*/ public RoutedEventHandlerInfo[] Handlers; 
    /*internal*/ public RoutedEventHandlerInfoList Next;

    /*internal*/ public boolean Contains(RoutedEventHandlerInfoList handlers) 
    {
        RoutedEventHandlerInfoList tempHandlers = this; 
        while (tempHandlers != null)
        {
            if (tempHandlers == handlers)
            { 
                return true;
            } 

            tempHandlers = tempHandlers.Next;
        } 

        return false;
    }
}