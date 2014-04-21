/**
 * ParallelTimeline
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ParallelTimeline = declare("ParallelTimeline", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(ParallelTimeline.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	ParallelTimeline.Type = new Type("ParallelTimeline", ParallelTimeline, [Object.Type]);
	return ParallelTimeline;
});

/// <summary> 
    /// This class represents a group of Timelines where the children
    /// become active according to the value of their Begin property rather 
    /// than their specific order in the Children collection. Children
    /// are also able to overlap and run in parallel with each other.
    /// </summary>
    public partial class ParallelTimeline : TimelineGroup 
    {
        /// <summary>
        /// Creates a ParallelTimeline with default properties. 
        /// </summary>
        public ParallelTimeline()
            : base()
        { 
        }
 
        /// <summary> 
        /// Creates a ParallelTimeline with the specified BeginTime.
        /// </summary> 
        /// <param name="beginTime">
        /// The scheduled BeginTime for this ParallelTimeline.
        /// </param>
        public ParallelTimeline(TimeSpan? beginTime) 
            : base(beginTime)
        { 
        } 

        /// <summary> 
        /// Creates a ParallelTimeline with the specified begin time and duration.
        /// </summary>
        /// <param name="beginTime">
        /// The scheduled BeginTime for this ParallelTimeline. 
        /// </param>
        /// <param name="duration"> 
        /// The simple Duration of this ParallelTimeline. 
        /// </param>
        public ParallelTimeline(TimeSpan? beginTime, Duration duration) 
            : base(beginTime, duration)
        {
        }
 
        /// <summary>
        /// Creates a ParallelTimeline with the specified BeginTime, Duration and RepeatBehavior. 
        /// </summary> 
        /// <param name="beginTime">
        /// The scheduled BeginTime for this ParallelTimeline. 
        /// </param>
        /// <param name="duration">
        /// The simple Duration of this ParallelTimeline.
        /// </param> 
        /// <param name="repeatBehavior">
        /// The RepeatBehavior for this ParallelTimeline. 
        /// </param> 
        public ParallelTimeline(TimeSpan? beginTime, Duration duration, RepeatBehavior repeatBehavior)
            : base(beginTime, duration, repeatBehavior) 
        {
        }
 
        /// <summary>
        /// Return the duration from a specific clock 
        /// </summary>
        /// <param name="clock">
        /// The Clock whose natural duration is desired.
        /// </param> 
        /// <returns>
        /// A Duration quantity representing the natural duration. 
        /// </returns> 
        protected override Duration GetNaturalDurationCore(Clock clock)
        { 
            Duration simpleDuration = TimeSpan.Zero;

            ClockGroup clockGroup = clock as ClockGroup;
 
            if (clockGroup != null)
            { 
                List<Clock> children = clockGroup.InternalChildren; 

                // The container ends when all of its children have ended at least 
                // one of their active periods.
                if (children != null)
                {
                    bool hasChildWithUnresolvedDuration = false; 

                    for (int childIndex = 0; childIndex < children.Count; childIndex++) 
                    { 
                        Duration childEndOfActivePeriod = children[childIndex].EndOfActivePeriod;
 
                        if (childEndOfActivePeriod == Duration.Forever)
                        {
                            // If we have even one child with a duration of forever
                            // our resolved duration will also be forever. It doesn't 
                            // matter if other children have unresolved durations.
                            return Duration.Forever; 
                        } 
                        else if (childEndOfActivePeriod == Duration.Automatic)
                        { 
                            hasChildWithUnresolvedDuration = true;
                        }
                        else if (childEndOfActivePeriod > simpleDuration)
                        { 
                            simpleDuration = childEndOfActivePeriod;
                        } 
                    } 

                    // We've iterated through all our children. We know that at this 
                    // point none of them have a duration of Forever or we would have
                    // returned already. If any of them still have unresolved
                    // durations then our duration is also still unresolved and we
                    // will return automatic. Otherwise, we'll fall out of the 'if' 
                    // block and return the simpleDuration as our final resolved
                    // duration. 
                    if (hasChildWithUnresolvedDuration) 
                    {
                        return Duration.Automatic; 
                    }
                }
            }
 
            return simpleDuration;
        } 
 
        /// <summary>
        /// SlipBehavior Property 
        /// </summary> 
        public static readonly DependencyProperty SlipBehaviorProperty =
            DependencyProperty.Register( 
                "SlipBehavior",
                typeof(SlipBehavior),
                typeof(ParallelTimeline),
                new PropertyMetadata( 
                    SlipBehavior.Grow,
                    new PropertyChangedCallback(ParallelTimeline_PropertyChangedFunction)), 
                new ValidateValueCallback(ValidateSlipBehavior)); 

 
        private static bool ValidateSlipBehavior(object value)
        {
            return TimeEnumHelper.IsValidSlipBehavior((SlipBehavior)value);
        } 

        /// <summary> 
        /// Returns the SlipBehavior for this ClockGroup 
        /// </summary>
        public SlipBehavior SlipBehavior
        {
            get
            { 
                return (SlipBehavior)GetValue(SlipBehaviorProperty);
            } 
            set 
            {
                SetValue(SlipBehaviorProperty, value); 
            }
        }

        internal static void ParallelTimeline_PropertyChangedFunction(DependencyObject d, 
                                                                      DependencyPropertyChangedEventArgs e)
        { 
            ((ParallelTimeline)d).PropertyChanged(e.Property); 
        }
        /// <summary>
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience. 
        /// </summary>
        public new ParallelTimeline Clone() 
        {
            return (ParallelTimeline)base.Clone();
        }
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience. 
        /// </summary>
        public new ParallelTimeline CloneCurrentValue() 
        {
            return (ParallelTimeline)base.CloneCurrentValue();
        }

        /// <summary> 
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns> 
        protected override Freezable CreateInstanceCore()
        {
            return new ParallelTimeline();
        } 
