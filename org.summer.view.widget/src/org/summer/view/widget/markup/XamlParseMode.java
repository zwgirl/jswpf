package org.summer.view.widget.markup;
enum XamlParseMode 
{
    /// <summary> 
    /// Not initialized
    /// </summary>
    Uninitialized,

    /// <summary>
    /// [....] 
    /// </summary> 
    Synchronous,

    /// <summary>
    /// Async
    /// </summary>
    Asynchronous, 
}