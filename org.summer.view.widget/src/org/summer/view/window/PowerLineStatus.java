package org.summer.view.window;
/// <summary>
    /// Indicates whether the system power is online, or that the system power status is unknown.
    /// </summary>
    public enum PowerLineStatus 
    {
        /// <summary> 
        /// The system is offline. 
        /// </summary>
        Offline ,//= 0x00, 

        /// <summary>
        /// The system is online.
        /// </summary> 
        Online ,//= 0x01,
 
        /// <summary> 
        /// The power status of the system is unknown.
        /// </summary> 
        Unknown ,//= 0xFF,
    }


    