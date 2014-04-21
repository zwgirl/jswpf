package org.summer.view.widget.media.animation;

import org.summer.view.widget.DependencyProperty;

public interface IAnimatable {
     void ApplyAnimationClock(
        DependencyProperty dp,
        AnimationClock clock);

     void ApplyAnimationClock(
        DependencyProperty dp, 
        AnimationClock clock,
        HandoffBehavior handoffBehavior);


     void BeginAnimation(DependencyProperty dp, AnimationTimeline animation) ;
     void BeginAnimation(DependencyProperty dp, AnimationTimeline animation, HandoffBehavior handoffBehavior);

    public boolean HasAnimatedProperties 
    {
        get;
    }

     Object GetAnimationBaseValue(DependencyProperty dp) ;
}
