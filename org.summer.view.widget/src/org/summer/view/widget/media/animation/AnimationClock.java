package org.summer.view.widget.media.animation;
/// <summary> 
///
/// </summary> 
public class AnimationClock extends Clock 
{
    /// <summary> 
    /// Creates a new empty AnimationClock to be used in a Clock
    /// tree.
    /// </summary>
    /// <param name="animation">The Animation used to define the new 
    /// AnimationClock.</param>
    protected /*internal*/ AnimationClock(AnimationTimeline animation) 
    {
        super(animation);
    } 

    /// <summary>
    /// Gets the Animation object that holds the description controlling the
    /// behavior of this clock. 
    /// </summary>
    /// <value> 
    /// The Animation object that holds the description controlling the 
    /// behavior of this clock.
    /// </value> 
    public /*new*/ AnimationTimeline Timeline
    {
        get
        { 
            return (AnimationTimeline)base.Timeline;
        } 
    } 

    /// <summary> 
    /// Returns the current value of this AnimationClock.
    /// </summary>
    /// <param name="defaultOriginValue"></param>
    /// <param name="defaultDestinationValue">The unanimated property value or the current 
    /// value of the previous AnimationClock in a list.</param>
    /// <returns>The current value of this AnimationClock.</returns> 
    public Object GetCurrentValue(Object defaultOriginValue, Object defaultDestinationValue) 
    {
        return ((AnimationTimeline)base.Timeline).GetCurrentValue(defaultOriginValue, defaultDestinationValue, this); 
    }



    /// <summary>
    /// Returns true if this timeline needs continuous frames. 
    /// This is a hint that we should keep updating our time during the active period. 
    /// </summary>
    /// <returns></returns> 
    /*internal*/ public /*override*/ boolean NeedsTicksWhenActive
    {
        get
        { 
            return true;
        } 
    } 
}