package org.summer.view.widget.data;
/// <summary>
    /// Status of the Binding
    /// </summary>
    public enum BindingStatus
    {
        /// <summary> Binding has not yet been attached to its target </summary>
        Unattached,
        /// <summary> Binding has not yet been activated </summary>
        Inactive,
        /// <summary> Binding has been successfully activated </summary>
        Active,
        /// <summary> Binding has been detached from its target </summary>
        Detached,
        /// <summary> Binding is waiting for an async operation to complete</summary>
        AsyncRequestPending,
        /// <summary> error - source path could not be resolved </summary>
        PathError,
        /// <summary> error - a legal value could not be obtained from the source</summary>
        UpdateTargetError,
        /// <summary> error - the value could not be sent to the source </summary>
        UpdateSourceError,
    }