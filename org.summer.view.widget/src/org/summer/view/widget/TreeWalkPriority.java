package org.summer.view.widget;
/// <summary>
    ///     Enum specifying whether visual tree needs
    ///     to be travesed first or the logical tree
    /// </summary> 
    /*internal*/ public enum TreeWalkPriority
    { 
        /// <summary> 
        ///     Traverse Logical Tree first
        /// </summary> 
        LogicalTree,

        /// <summary>
        ///     Traverse Visual Tree first 
        /// </summary>
        VisualTree 
    } 