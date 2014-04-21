package org.summer.view.widget.data;
/// <summary> This enum describes how the data flows through a given Binding
    /// </summary> 
    public enum BindingMode
    {
        /// <summary> Data flows from source to target and vice-versa </summary>
        TwoWay, 
        /// <summary> Data flows from source to target, source changes cause data flow </summary>
        OneWay, 
        /// <summary> Data flows from source to target once, source changes are ignored </summary> 
        OneTime,
        /// <summary> Data flows from target to source, target changes cause data flow </summary> 
        OneWayToSource,
        /// <summary> Data flow is obtained from target property default </summary>
        Default
    } 

    /// <summary> This enum describes when updates (target-to-source data flow) 
    /// happen in a given Binding. 
    /// </summary>
    