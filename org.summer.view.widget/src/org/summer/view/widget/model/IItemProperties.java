package org.summer.view.widget.model;

import org.summer.view.widget.collection.ReadOnlyCollection;

/// <summary>
/// IItemProperties is an interface that a collection view
/// can implement to expose information about the properties available on
/// items in the underlying collection.
/// </summary>
public interface IItemProperties
{
    /// <summary>
    /// Returns information about the properties available on items in the
    /// underlying collection.  This information may come from a schema, from
    /// a type descriptor, from a representative item, or from some other source
    /// known to the view.
    /// </summary>
    ReadOnlyCollection<ItemPropertyInfo>    ItemProperties { get; }
}
  
/// <summary>
/// Information about a property.  Returned by <seealso cref="IItemProperties.ItemProperties">
/// </seealso></summary>
