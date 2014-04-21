package org.summer.view.widget;

import org.summer.view.widget.media.animation.Storyboard;
 /// <summary>
    ///     A visual state that can be transitioned into.
    /// </summary>
//    [ContentProperty("Storyboard")] 
//    [RuntimeNameProperty("Name")]
    public class VisualState extends DependencyObject 
    { 
        /// <summary>
        ///     The name of the VisualState. 
        /// </summary>
        public String Name
        {
            get; 
            set;
        } 
 
        private static final DependencyProperty StoryboardProperty =
            DependencyProperty.Register( 
            "Storyboard",
            typeof(Storyboard),
            typeof(VisualState));
 
        /// <summary>
        ///     Storyboard defining the values of properties in this visual state. 
        /// </summary> 
        public Storyboard Storyboard
        { 
            get { return (Storyboard)GetValue(StoryboardProperty); }
            set { SetValue(StoryboardProperty, value); }
        }
    } 