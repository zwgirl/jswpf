package org.summer.view.widget.data;
/// <summary> Type for the work and completion delegates of an AsyncDataRequest </summary> 
//    /*internal*/ public delegate Object AsyncRequestCallback(AsyncDataRequest request);
 
    /// <summary> Status of an async data request. </summary>
    /*internal*/ public enum AsyncRequestStatus
    {
        /// <summary> Request has not been started </summary> 
        Waiting,
        /// <summary> Request is in progress </summary> 
        Working, 
        /// <summary> Request has been completed </summary>
        Completed, 
        /// <summary> Request was cancelled </summary>
        Cancelled,
        /// <summary> Request failed </summary>
        Failed 
    }
 
