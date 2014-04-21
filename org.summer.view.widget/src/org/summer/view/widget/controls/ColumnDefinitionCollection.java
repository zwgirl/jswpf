package org.summer.view.widget.controls;
  /// <summary>
    /// Array collection of definitions.
    /// </summary>
    public class ColumnDefinitionCollection extends ArrayCollectionBase
    {
        /// <summary>
        /// Gets a column definition by index.
        /// </summary>
        /// <param name="index">Index into array.</param>
        /// <value>Column definition at index location.</value>
        public ColumnDefinition this[int index]
        {
            get { return (ColumnDefinition)this.collection[index]; }
        }
        /// <summary>
        /// Adds a column definition to the collection.
        /// </summary>
        /// <param name="columnDefinition">Column definition to add to array.</param>
        public void Add(ColumnDefinition columnDefinition)
        {
            this.collection.Add(columnDefinition);
        }
    }