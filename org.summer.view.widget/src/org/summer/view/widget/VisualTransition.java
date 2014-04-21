package org.summer.view.widget;
/// <summary>
    /// Defines a transition between VisualStates. 
    /// </summary> 
//    [ContentProperty("Storyboard")]
    public class VisualTransition extends DependencyObject 
    {
        public VisualTransition()
        {
            DynamicStoryboardCompleted = true; 
            ExplicitStoryboardCompleted = true;
        } 
 
        /// <summary>
        /// Name of the state to transition from. 
        /// </summary>
        public String From
        {
            get; 
            set;
        } 
 
        /// <summary>
        /// Name of the state to transition to. 
        /// </summary>
        public String To
        {
            get; 
            set;
        } 
 
        /// <summary>
        /// Storyboard providing fine grained control of the transition. 
        /// </summary>
        public Storyboard Storyboard
        {
            get; 
            set;
        } 
 
        /// <summary>
        /// Duration of the transition. 
        /// </summary>
//        [TypeConverter(typeof(System.Windows.DurationConverter))]
        public Duration GeneratedDuration
        { 
            get { return _generatedDuration; }
            set { _generatedDuration = value; } 
        } 

        /// <summary> 
        /// Easing Function for the transition
        /// </summary>
        public IEasingFunction GeneratedEasingFunction
        { 
            get;
            set; 
        } 

        /*internal*/ public boolean IsDefault 
        {
            get { return From == null && To == null; }
        }
 
        /*internal*/ public boolean DynamicStoryboardCompleted
        { 
            get; 
            set;
        } 

        /*internal*/ public boolean ExplicitStoryboardCompleted
        {
            get; 
            set;
        } 
 
        private Duration _generatedDuration = new Duration(new TimeSpan());
    }