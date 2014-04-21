package org.summer.view.widget.media;
 /// <summary> 
    /// States that can be applied to the media element automatically when the
    /// MediaElement is loaded or unloaded.
    /// </summary>
    public enum MediaState : int 
    {
        /// <summary> 
        /// The media element should be controlled manually, either by its associated 
        /// clock, or by directly calling the Play/Pause etc. on the media element.
        /// </summary> 
        Manual = 0,

        /// <summary>
        /// The media element should play. 
        /// </summary>
        Play = 1, 
 
        /// <summary>
        /// The media element should close. This stops all media processing and releases 
        /// any video memory held by the media element.
        /// </summary>
        Close = 2,
 
        /// <summary>
        /// The media element should pause. 
        /// </summary> 
        Pause = 3,
 
        /// <summary>
        /// The media element should stop.
        /// </summary>
        Stop = 4 
    }
 
    /// <summary> 
    /// Media Element
    /// </summary> 
    [Localizability(LocalizationCategory.NeverLocalize)]
    