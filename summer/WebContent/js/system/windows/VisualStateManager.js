/**
 * VisualStateManager
 */

define(["dojo/_base/declare", "system/Type", "system/IEquatable", "internal/ObservableCollectionDefaultValueFactory"], 
		function(declare, Type, IEquatable, ObservableCollectionDefaultValueFactory){
	
	// specifies a token to uniquely identify a Timeline object
//    private struct 
    var TimelineDataToken =declare(IEquatable/*<TimelineDataToken>*/, {
    	constructor:function(/*Timeline*/ timeline)
        { 
            this._target = Storyboard.GetTarget(timeline);
            this._targetName = Storyboard.GetTargetName(timeline);
            this._targetProperty = Storyboard.GetTargetProperty(timeline);
        }, 

//        public bool 
        Equals:function(/*TimelineDataToken*/ other) 
        { 
            var targetsEqual = false;
            if (this._targetName != null) 
            {
                targetsEqual = other._targetName == this._targetName;
            }
            else if (this._target != null) 
            {
                targetsEqual = other._target == this._target; 
            } 
            else
            { 
                targetsEqual = (other._target == null && other._targetName == null);
            }

            if (targetsEqual && 
                (other._targetProperty.Path == this._targetProperty.Path) &&
                (other._targetProperty.PathParameters.Count == this._targetProperty.PathParameters.Count)) 
            { 
                var paramsEqual = true;

                for (var i = 0, count = this._targetProperty.PathParameters.Count; i < count; i++)
                {
                    if (other._targetProperty.PathParameters[i] != this._targetProperty.PathParameters[i])
                    { 
                        paramsEqual = false;
                        break; 
                    } 
                }

                return paramsEqual;
            }

            return false; 
        },

//        public override int 
        GetHashCode:function() 
        {
            // 
            // The below code has some limitations.  We don't handle canonicalizing property paths, so
            // having two paths that target the same object/property can easily get different hash codes.
            //
            // For example the Opacity can be specified either from a string "Opacity" or via the string "(0)" 
            // and a parameter Visual.OpacityPropety.  These wont match as far as VSM is concerned.
            // 
            var targetHash = this._target != null ? this._target.GetHashCode() : 0; 
            var targetNameHash = this._targetName != null ? this._targetName.GetHashCode() : 0;
            var targetPropertyHash = (this._targetProperty != null && this._targetProperty.Path != null) 
                 ? this._targetProperty.Path.GetHashCode() : 0; 

            return ((this._targetName != null) ? targetNameHash : targetHash) ^ targetPropertyHash;
        }

//        private DependencyObject _target;
//        private string _targetName; 
//        private PropertyPath _targetProperty;
    });

    
    
    
	var VisualStateManager = declare("VisualStateManager", DependencyObject,{
	});
	
	Object.defineProperties(VisualStateManager,{
//	    private static readonly DependencyPropertyKey 
	    VisualStateGroupsPropertyKey:
	    {
	    	get:function(){
	    		if(VisualStateManager._VisualStateGroupsPropertyKey === undefined){
	    			VisualStateManager._VisualStateGroupsPropertyKey =
	    		        DependencyProperty.RegisterAttachedReadOnly(
	    		    	        "VisualStateGroups",
	    		    	        IList.Type, 
	    		    	        VisualStateManager.Type,
	    		    	        new FrameworkPropertyMetadata(new ObservableCollectionDefaultValueFactory/*<VisualStateGroup>*/())); 
	    		}
	    		
	    		return VisualStateManager._VisualStateGroupsPropertyKey;
	    	}
	    },

	    /// <summary>
	    ///     Read only VisualStateGroups property 
	    /// </summary>
//	    public static readonly DependencyProperty 
	    VisualStateGroupsProperty:
	    {
	    	get:function(){
	    		if(VisualStateManager._VisualStateGroupsProperty === undefined){
	    			VisualStateManager._VisualStateGroupsProperty =
	    				VisualStateManager.VisualStateGroupsPropertyKey.DependencyProperty;
	    		}
	    		
	    		return VisualStateManager._VisualStateGroupsProperty;
	    	}
	    },
	    

//	    public static readonly DependencyProperty 
	    CustomVisualStateManagerProperty:
	    {
	    	get:function(){
	    		if(VisualStateManager._CustomVisualStateManagerProperty === undefined){
	    			VisualStateManager._CustomVisualStateManagerProperty  = 
	    		        DependencyProperty.RegisterAttached( 
	    		    	        "CustomVisualStateManager",
	    		    	        VisualStateManager.Type, 
	    		    	        VisualStateManager.Type,
	    		    	        null);
	    		}
	    		
	    		return VisualStateManager._CustomVisualStateManagerProperty;
	    	}
	    },

	});
	
	/// <summary> 
    ///     Transitions a control's state.
    /// </summary> 
    /// <param name="control">The control who's state is changing.</param> 
    /// <param name="stateGroupsRoot">The element to get the VSG & customer VSM from.</param>
    /// <param name="stateName">The new state that the control is in.</param> 
    /// <param name="useTransitions">Whether to use transition animations.</param>
    /// <returns>true if the state changed successfully, false otherwise.</returns>
//    private static bool 
    function GoToStateCommon(/*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot,
    		/*string*/ stateName, /*bool*/ useTransitions)
    { 
        if (stateName == null)
        { 
            throw new ArgumentNullException("stateName"); 
        }

        if (stateGroupsRoot == null)
        {
            return false; // Ignore state changes if a stateGroupsRoot doesn't exist yet
        } 

        /*IList<VisualStateGroup>*/
        var groups = VisualStateManager.GetVisualStateGroupsInternal(stateGroupsRoot); 
        if (groups == null) 
        {
            return false; 
        }

        /*VisualState*/var state;
        /*VisualStateGroup*/var group; 
        VisualStateManager.TryGetState(groups, stateName, /*out group*/groupOut, /*out state*/stateOut);

        // Look for a custom VSM, and call it if it was found, regardless of whether the state was found or not. 
        // This is because we don't know what the custom VSM will want to do. But for our default implementation,
        // we know that if we haven't found the state, we don't actually want to do anything. 
        /*VisualStateManager*/var customVsm = GetCustomVisualStateManager(stateGroupsRoot);
        if (customVsm != null)
        {
            return customVsm.GoToStateCore(control, stateGroupsRoot, stateName, group, state, useTransitions); 
        }
        else if (state != null) 
        { 
            return GoToStateInternal(control, stateGroupsRoot, group, state, useTransitions);
        } 

        return false;
    }

    /// <summary>
    ///     Transitions a control's state. 
    /// </summary> 
    /// <param name="control">The control who's state is changing.</param>
    /// <param name="stateName">The new state that the control is in.</param> 
    /// <param name="useTransitions">Whether to use transition animations.</param>
    /// <returns>true if the state changed successfully, false otherwise.</returns>
//    public static bool 
    VisualStateManager.GoToState = function(/*FrameworkElement*/ control, /*string*/ stateName, /*bool*/ useTransitions)
    { 
        if (control == null)
        { 
            throw new ArgumentNullException("control"); 
        }

        /*FrameworkElement*/var stateGroupsRoot = control.StateGroupsRoot;

        return GoToStateCommon(control, stateGroupsRoot, stateName, useTransitions);
    };

    /// <summary> 
    ///     Transitions a control's state. 
    /// </summary>
    /// <param name="control">The control who's state is changing.</param> 
    /// <param name="stateName">The new state that the control is in.</param>
    /// <param name="useTransitions">Whether to use transition animations.</param>
    /// <returns>true if the state changed successfully, false otherwise.</returns>
//    public static bool 
    VisualStateManager.GoToElementState = function(/*FrameworkElement*/ stateGroupsRoot, /*string*/ stateName, /*bool*/ useTransitions) 
    {
        if (stateGroupsRoot == null) 
        { 
            throw new ArgumentNullException("stateGroupsRoot");
        } 

        return GoToStateCommon(null, stateGroupsRoot, stateName, useTransitions);
    };

    /// <summary>
    ///     Allows subclasses to override the GoToState logic. 
    /// </summary> 
//    protected virtual bool 
    VisualStateManager.GoToStateCore = function(/*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot, 
    		/*string*/ stateName, /*VisualStateGroup*/ group, /*VisualState*/ state, /*bool*/ useTransitions)
    { 
        return GoToStateInternal(control, stateGroupsRoot, group, state, useTransitions);
    };



//    public static VisualStateManager 
    VisualStateManager.GetCustomVisualStateManager = function(/*FrameworkElement*/ obj) 
    {
        if (obj == null) 
        { 
            throw new ArgumentNullException("obj");
        } 

        var r = obj.GetValue(VisualStateManager.CustomVisualStateManagerProperty)
        return r instanceof VisualStateManager ? r : null;
    };

//    public static void 
    VisualStateManager.SetCustomVisualStateManager = function(/*FrameworkElement*/ obj, /*VisualStateManager*/ value)
    { 
        if (obj == null) 
        {
            throw new ArgumentNullException("obj"); 
        }

        obj.SetValue(VisualStateManager.CustomVisualStateManagerProperty, value);
    };



//    internal static Collection<VisualStateGroup> 
    VisualStateManager.GetVisualStateGroupsInternal = function(/*FrameworkElement*/ obj)
    { 
        if (obj == null) 
        {
            throw new ArgumentNullException("obj"); 
        }

        // We don't want to get the default value because it will create/return an empty colleciton.
        var hasModifiers; 
        /*BaseValueSourceInternal*/
        var source = obj.GetValueSource(VisualStateManager.VisualStateGroupsProperty, null, /*out hasModifiers*/{
        		"hasModifiers" : hasModifiers });
        
        if (source != BaseValueSourceInternal.Default) 
        { 
            var r = obj.GetValue(VisualStateManager.VisualStateGroupsProperty);
            return r instanceof Collection/*<VisualStateGroup>*/ ? r : null;
        } 

        return null;
    };

//    public static IList 
    VisualStateManager.GetVisualStateGroups = function(/*FrameworkElement*/ obj) 
    { 
        if (obj == null)
        { 
            throw new ArgumentNullException("obj");
        }

        var result = obj.GetValue(VisualStateManager.VisualStateGroupsProperty);
        return result instanceof IList ? result : null; 
    };


//    internal static bool 
    VisualStateManager.TryGetState = function(/*IList<VisualStateGroup>*/ groups, /*string*/ stateName, 
    		/*out VisualStateGroup group*/groupOut, /*out VisualState state*/stateOut)
    {
        for (var groupIndex = 0; groupIndex < groups.Count; ++groupIndex) 
        {
            /*VisualStateGroup*/var g = groups[groupIndex]; 
            /*VisualState*/var s = g.GetState(stateName); 
            if (s != null)
            { 
                group = g;
                state = s;
                return true;
            } 
        }

        group = null; 
        state = null;
        return false; 
    };

//    private static bool 
    function GoToStateInternal(/*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot, 
    		/*VisualStateGroup*/ group, /*VisualState*/ state, /*bool*/ useTransitions)
    { 
        if (stateGroupsRoot == null)
        { 
            throw new ArgumentNullException("stateGroupsRoot"); 
        }

        if (state == null)
        {
            throw new ArgumentNullException("state");
        } 

        if (group == null) 
        { 
            throw new InvalidOperationException();
        } 

        /*VisualState*/var lastState = group.CurrentState;
        if (lastState == state)
        { 
            return true;
        } 

        // Get the transition Storyboard. Even if there are no transitions specified, there might
        // be properties that we're rolling back to their default values. 
        /*VisualTransition*/var transition = useTransitions ? VisualStateManager.GetTransition(stateGroupsRoot, group, lastState, state) : null;

        // Generate dynamicTransition Storyboard
        /*Storyboard*/var dynamicTransition = GenerateDynamicTransitionAnimations(stateGroupsRoot, group, state, transition); 

        // If the transition is null, then we want to instantly snap. The dynamicTransition will 
        // consist of everything that is being moved back to the default state. 
        // If the transition.Duration and explicit storyboard duration is zero, then we want both the dynamic
        // and state Storyboards to happen in the same tick, so we start them at the same time. 
        if (transition == null || (transition.GeneratedDuration == DurationZero &&
                                        (transition.Storyboard == null || transition.Storyboard.Duration == DurationZero)))
        {
            // Start new state Storyboard and stop any previously running Storyboards 
            if (transition != null && transition.Storyboard != null)
            { 
                group.StartNewThenStopOld(stateGroupsRoot, transition.Storyboard, state.Storyboard); 
            }
            else 
            {
                group.StartNewThenStopOld(stateGroupsRoot, state.Storyboard);
            }

            // Fire both CurrentStateChanging and CurrentStateChanged events
            group.RaiseCurrentStateChanging(stateGroupsRoot, lastState, state, control); 
            group.RaiseCurrentStateChanged(stateGroupsRoot, lastState, state, control); 
        }
        else 
        {
            // In this case, we have an interstitial storyboard of duration > 0 and/or
            // explicit storyboard of duration >0 , so we need
            // to run them first, and then we'll run the state storyboard. 
            // we have to wait for both storyboards to complete before
            // starting the steady state animations. 
            transition.DynamicStoryboardCompleted = false; 

            // Hook up generated Storyboard's Completed event handler 
            dynamicTransition.Completed.Combine(new Delegate(null, function(/*object*/ sender, /*EventArgs*/ e)
            {
                if (transition.Storyboard == null || transition.ExplicitStoryboardCompleted)
                { 
                    if (ShouldRunStateStoryboard(control, stateGroupsRoot, state, group))
                    { 
                        group.StartNewThenStopOld(stateGroupsRoot, state.Storyboard); 
                    }

                    group.RaiseCurrentStateChanged(stateGroupsRoot, lastState, state, control);
                }

                transition.DynamicStoryboardCompleted = true; 
            }));

            if (transition.Storyboard != null && transition.ExplicitStoryboardCompleted == true) 
            {
                /*EventHandler*/var transitionCompleted = null; 
                transitionCompleted = new EventHandler(null, function(/*object*/ sender, /*EventArgs*/ e)
                {
                    if (transition.DynamicStoryboardCompleted)
                    { 
                        if (ShouldRunStateStoryboard(control, stateGroupsRoot, state, group))
                        { 
                            group.StartNewThenStopOld(stateGroupsRoot, state.Storyboard); 
                        }

                        group.RaiseCurrentStateChanged(stateGroupsRoot, lastState, state, control);
                    }

                    transition.Storyboard.Completed -= transitionCompleted; 
                    transition.ExplicitStoryboardCompleted = true;
                }); 

                // hook up explicit storyboard's Completed event handler
                transition.ExplicitStoryboardCompleted = false; 
                transition.Storyboard.Completed += transitionCompleted;
            }

            // Start transition and dynamicTransition Storyboards 
            // Stop any previously running Storyboards
            group.StartNewThenStopOld(stateGroupsRoot, transition.Storyboard, dynamicTransition); 

            group.RaiseCurrentStateChanging(stateGroupsRoot, lastState, state, control);
        } 

        group.CurrentState = state;

        return true; 
    }

    /// <summary> 
    ///   If the stateGroupsRoot or control is removed from the tree, then the new
    ///   storyboards will not be able to resolve target names. Thus, 
    ///   if the stateGroupsRoot or control is not in the tree, don't start the new
    ///   storyboards. Also if the group has already changed state, then
    ///   don't start the new storyboards.
    /// </summary> 
    /// <SecurityNote>
    ///     Critical - Accesses the PresentationSource 
    ///     TreatAsSafe - Does not expose any part of the PresentationSource to user input. 
    /// </SecurityNote>
//    private static bool 
    function ShouldRunStateStoryboard(/*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot, 
    		/*VisualState*/ state, /*VisualStateGroup*/ group)
    {
        var controlInTree = true;
        var stateGroupsRootInTree = true; 

        // We cannot simply check control.IsLoaded because the control may not be in the visual tree 
        // even though IsLoaded is true.  Instead we will check that it can find a PresentationSource 
        // which would tell us it's in the visual tree.
        if (control != null) 
        {
            // If it's visible then it's in the visual tree, so we don't even have to look for a
            // PresentationSource
            if (!control.IsVisible) 
            {
                controlInTree = (PresentationSource.CriticalFromVisual(control) != null); 
            } 
        }

        if (stateGroupsRoot != null)
        {
            if (!stateGroupsRoot.IsVisible)
            { 
                stateGroupsRootInTree = (PresentationSource.CriticalFromVisual(stateGroupsRoot) != null);
            } 
        } 

        return (controlInTree && stateGroupsRootInTree && (state == group.CurrentState)); 
    }

//    protected void 
    RaiseCurrentStateChanging = function(/*VisualStateGroup*/ stateGroup, /*VisualState*/ oldState, 
    		/*VisualState*/ newState, /*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot)
    { 
        if (stateGroup == null)
        { 
            throw new ArgumentNullException("stateGroup"); 
        }

        if (newState == null)
        {
            throw new ArgumentNullException("newState");
        } 

        if (stateGroupsRoot == null) 
        { 
            return; // Ignore if a ControlTemplate hasn't been applied
        } 

        stateGroup.RaiseCurrentStateChanging(stateGroupsRoot, oldState, newState, control);
    };

//    protected void 
    RaiseCurrentStateChanged = function(/*VisualStateGroup*/ stateGroup, /*VisualState*/ oldState, 
    		/*VisualState*/ newState, /*FrameworkElement*/ control, /*FrameworkElement*/ stateGroupsRoot)
    { 
        if (stateGroup == null) 
        {
            throw new ArgumentNullException("stateGroup"); 
        }

        if (newState == null)
        { 
            throw new ArgumentNullException("newState");
        } 

        if (stateGroupsRoot == null)
        { 
            return; // Ignore if a ControlTemplate hasn't been applied
        }

        stateGroup.RaiseCurrentStateChanged(stateGroupsRoot, oldState, newState, control); 
    };

//    private static Storyboard 
    function GenerateDynamicTransitionAnimations(/*FrameworkElement*/ root, /*VisualStateGroup*/ group, /*VisualState*/ newState, 
    		/*VisualTransition*/ transition)
    {
        /*IEasingFunction*/var easingFunction = null; 
        /*Storyboard*/var dynamic = new Storyboard();

        if (transition != null) 
        {
            if (transition.GeneratedDuration != null) 
            {
                dynamic.Duration = transition.GeneratedDuration;
            }

            easingFunction = transition.GeneratedEasingFunction;
        } 
        else 
        {
            dynamic.Duration = new Duration(TimeSpan.Zero); 
        }

        /*Dictionary<TimelineDataToken, Timeline>*/var currentAnimations = FlattenTimelines(group.CurrentStoryboards);
        /*Dictionary<TimelineDataToken, Timeline>*/var transitionAnimations = FlattenTimelines(transition != null ? transition.Storyboard : null); 
        /*Dictionary<TimelineDataToken, Timeline>*/var newStateAnimations = FlattenTimelines(newState.Storyboard);

        // Remove any animations that the transition already animates. 
        // There is no need to create an interstitial animation if one already exists.
        for/*each*/ (/*KeyValuePair<TimelineDataToken, Timeline>*/var pair in transitionAnimations) 
        {
            currentAnimations.Remove(pair.Key);
            newStateAnimations.Remove(pair.Key);
        } 

        // Generate the "to" animations 
        for/*each*/ (/*KeyValuePair<TimelineDataToken, Timeline>*/var pair in newStateAnimations) 
        {
            // The new "To" Animation -- the root is passed as a reference point for name 
            // lookup.
            /*Timeline*/var toAnimation = GenerateToAnimation(root, pair.Value, easingFunction, true);

            // If the animation is of a type that we can't generate transition animations 
            // for, GenerateToAnimation will return null, and we should just keep going.
            if (toAnimation != null) 
            { 
                toAnimation.Duration = dynamic.Duration;
                dynamic.Children.Add(toAnimation); 
            }

            // Remove this from the list of current state animations we have to consider next
            currentAnimations.Remove(pair.Key); 
        }

        // Generate the "from" animations 
        for/*each*/ (/*KeyValuePair<TimelineDataToken, Timeline>*/var pair in currentAnimations)
        { 
            /*Timeline*/var fromAnimation = GenerateFromAnimation(root, pair.Value, easingFunction);
            if (fromAnimation != null)
            {
                fromAnimation.Duration = dynamic.Duration; 
                dynamic.Children.Add(fromAnimation);
            } 
        } 

        return dynamic; 
    }

//    private static Timeline 
    function GenerateFromAnimation(/*FrameworkElement*/ root, /*Timeline*/ timeline, /*IEasingFunction*/ easingFunction)
    { 
        /*Timeline*/var result = null;

        if (timeline instanceof ColorAnimation || timeline instanceof ColorAnimationUsingKeyFrames) 
        {
            result = new ColorAnimation();
//            { EasingFunction = easingFunction }; 
            result.EasingFunction = easingFunction;
        }
        else if (timeline instanceof DoubleAnimation || timeline instanceof DoubleAnimationUsingKeyFrames)
        {
            result = new DoubleAnimation();
//            { EasingFunction = easingFunction }; 
            result.EasingFunction = easingFunction;
        }
        else if (timeline instanceof PointAnimation || timeline instanceof PointAnimationUsingKeyFrames) 
        { 
            result = new PointAnimation();
//            { EasingFunction = easingFunction };
            result.EasingFunction = easingFunction;
        } 

        if (result != null)
        {
            CopyStoryboardTargetProperties(root, timeline, result); 
        }

        // All other animation types are ignored. We will not build transitions for them, 
        // but they will end up being executed.
        return result; 
    }

//    private static Timeline 
    function GenerateToAnimation(/*FrameworkElement*/ root, /*Timeline*/ timeline, /*IEasingFunction*/ easingFunction, /*bool*/ isEntering)
    { 
        /*Timeline*/var result = null;

        /*Color?*/var targetColor = GetTargetColor(timeline, isEntering); 
        if (targetColor.HasValue)
        { 
            /*ColorAnimation*/var ca = new ColorAnimation();
//            { To = targetColor, EasingFunction = easingFunction };
            ca.To = targetColor;
            ca.EasingFunction = easingFunction;
            
            result = ca;
        }

        if (result == null)
        { 
            /*double?*/var targetDouble = GetTargetDouble(timeline, isEntering); 
            if (targetDouble.HasValue)
            { 
                /*DoubleAnimation*/var da = new DoubleAnimation();
//                { To = targetDouble, EasingFunction = easingFunction };
                da.To = targetDouble;
                da.EasingFunction = easingFunction;
                
                result = da;
            }
        } 

        if (result == null) 
        { 
            /*Point?*/var targetPoint = GetTargetPoint(timeline, isEntering);
            if (targetPoint.HasValue) 
            {
                /*PointAnimation*/var pa = new PointAnimation();
//                { To = targetPoint, EasingFunction = easingFunction };
                pa.To = targetPoint;
                pa.EasingFunction = easingFunction
                result = pa;
            } 
        }

        if (result != null) 
        {
            CopyStoryboardTargetProperties(root, timeline, result); 
        }

        return result;
    } 

//    private static void 
    function CopyStoryboardTargetProperties(/*FrameworkElement*/ root, /*Timeline*/ source, /*Timeline*/ destination) 
    { 
        if (source != null || destination != null)
        { 
            // Target takes priority over TargetName
            var targetName = Storyboard.GetTargetName(source);
            /*DependencyObject*/var target = Storyboard.GetTarget(source);
            /*PropertyPath*/var path = Storyboard.GetTargetProperty(source); 

            if (target == null && !string.IsNullOrEmpty(targetName)) 
            { 
                target = root.FindName(targetName) ;
                target = target instanceof DependencyObject ? target : null;
            } 

            if (targetName != null)
            {
                Storyboard.SetTargetName(destination, targetName); 
            }

            if (target != null) 
            {
                Storyboard.SetTarget(destination, target); 
            }

            if (path != null)
            { 
                Storyboard.SetTargetProperty(destination, path);
            } 
        } 
    }

    /// <summary>
    /// Get the most appropriate transition between two states.
    /// </summary>
    /// <param name="element">Element being transitioned.</param> 
    /// <param name="group">Group being transitioned.</param>
    /// <param name="from">VisualState being transitioned from.</param> 
    /// <param name="to">VisualState being transitioned to.</param> 
    /// <returns>
    /// The most appropriate transition between the desired states. 
    /// </returns>
//    internal static VisualTransition 
    GetTransition = function(/*FrameworkElement*/ element, /*VisualStateGroup*/ group, /*VisualState*/ from, /*VisualState*/ to)
    {
        if (element == null) 
        {
            throw new ArgumentNullException("element"); 
        } 

        if (group == null) 
        {
            throw new ArgumentNullException("group");
        }

        if (to == null)
        { 
            throw new ArgumentNullException("to"); 
        }

        /*VisualTransition*/var best = null;
        /*VisualTransition*/var defaultTransition = null;
        var bestScore = -1;

        /*IList<VisualTransition>*/var transitions = group.Transitions;
        if (transitions != null) 
        { 
            for/*each*/ (/*VisualTransition*/var transition in transitions)
            { 
                if (defaultTransition == null && transition.IsDefault)
                {
                    defaultTransition = transition;
                    continue; 
                }

                var score = -1; 

                var transitionFromState = group.GetState(transition.From); 
                var transitionToState = group.GetState(transition.To);

                if (from == transitionFromState)
                { 
                    score += 1;
                } 
                else if (transitionFromState != null) 
                {
                    continue; 
                }

                if (to == transitionToState)
                { 
                    score += 2;
                } 
                else if (transitionToState != null) 
                {
                    continue; 
                }

                if (score > bestScore)
                { 
                    bestScore = score;
                    best = transition; 
                } 
            }
        } 

        return best == null ? defaultTransition : best;
    }

    // These methods are used when generating a transition animation between states. 
    // The timeline is the "to" state, and we need to find the To value for the
    // animation we're generating.
//    private static Color? 
    function GetTargetColor(/*Timeline*/ timeline, /*bool*/ isEntering)
    { 
        /*ColorAnimation*/var  ca = timeline instanceof ColorAnimation ? timeline : null;
        if (ca != null) 
        { 
            return ca.From.HasValue ? ca.From : ca.To;
        } 

        /*ColorAnimationUsingKeyFrames*/var cak = timeline instanceof ColorAnimationUsingKeyFrames ? timeline : null;
        if (cak != null)
        { 
            if (cak.KeyFrames.Count == 0)
            { 
                return null; 
            }

            /*ColorKeyFrame*/var keyFrame = cak.KeyFrames[isEntering ? 0 : cak.KeyFrames.Count - 1];
            return keyFrame.Value;
        }

        return null;
    } 

//    private static double? 
    function GetTargetDouble(/*Timeline*/ timeline, /*bool*/ isEntering)
    { 
        /*DoubleAnimation*/var da = timeline instanceof DoubleAnimation ? timeline : null;
        if (da != null)
        {
            return da.From.HasValue ? da.From : da.To; 
        }

        /*DoubleAnimationUsingKeyFrames*/var dak = timeline instanceof DoubleAnimationUsingKeyFrames ? timeline : null; 
        if (dak != null)
        { 
            if (dak.KeyFrames.Count == 0)
            {
                return null;
            } 

            /*DoubleKeyFrame*/var keyFrame = dak.KeyFrames[isEntering ? 0 : dak.KeyFrames.Count - 1]; 
            return keyFrame.Value; 
        }

        return null;
    }

//    private static Point?
    function GetTargetPoint(/*Timeline*/ timeline, /*bool*/ isEntering) 
    {
        /*PointAnimation*/var pa = timeline instanceof PointAnimation ? timeline : null; 
        if (pa != null) 
        {
            return pa.From.HasValue ? pa.From : pa.To; 
        }

        /*PointAnimationUsingKeyFrames*/var pak = timeline instanceof PointAnimationUsingKeyFrames ? timeline : null;
        if (pak != null) 
        {
            if (pak.KeyFrames.Count == 0) 
            { 
                return null;
            } 

            /*PointKeyFrame*/var keyFrame = pak.KeyFrames[isEntering ? 0 : pak.KeyFrames.Count - 1];
            return keyFrame.Value;
        } 

        return null; 
    } 

    // These methods exist to put extract all animations from a Storyboard, and store them in 
    // a Dictionary keyed on what element:property is being animated. Storyboards can contain
    // Storyboards, hence the "Flatten". 
//    private static Dictionary<TimelineDataToken, Timeline> 
    function FlattenTimelines(/*Storyboard*/ storyboard) 
    {
        /*Dictionary<TimelineDataToken, Timeline>*/var result = new Dictionary/*<TimelineDataToken, Timeline>*/(); 

        FlattenTimelines(storyboard, result);

        return result; 
    }

//    private static Dictionary<TimelineDataToken, Timeline> 
    function FlattenTimelines(/*Collection<Storyboard>*/ storyboards) 
    {
        /*Dictionary<TimelineDataToken, Timeline>*/var result = new Dictionary/*<TimelineDataToken, Timeline>*/(); 

        for (var index = 0; index < storyboards.Count; ++index)
        {
            FlattenTimelines(storyboards[index], result); 
        }

        return result; 
    }

//    private static void 
    function FlattenTimelines(/*Storyboard*/ storyboard, /*Dictionary<TimelineDataToken, Timeline>*/ result)
    {
        if (storyboard == null)
        { 
            return;
        } 

        for (var index = 0; index < storyboard.Children.Count; ++index)
        { 
            var child = storyboard.Children[index];
            var childStoryboard = child instanceof Storyboard ? child : null;
            if (childStoryboard != null)
            { 
                FlattenTimelines(childStoryboard, result);
            } 
            else 
            {
                result[new TimelineDataToken(child)] = child; 
            }
        }
    }
	
	VisualStateManager.Type = new Type("VisualStateManager", VisualStateManager, [DependencyObject.Type]);
	return VisualStateManager;
});
        
//        private static readonly Duration DurationZero = new Duration(TimeSpan.Zero);
 


