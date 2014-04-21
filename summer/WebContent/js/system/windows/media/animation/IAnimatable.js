/**
 * IAnimatable
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	var IAnimatable = declare("IAnimatable", Object,{
//		void 
		ApplyAnimationClock:function(/*DependencyProperty*/ dp, /*AnimationClock*/ clock){},
//		void 
		ApplyAnimationClock:function(/*DependencyProperty*/ dp, /*AnimationClock*/ clock, /*HandoffBehavior*/ handoffBehavior){},
//		void 
		BeginAnimation:function(/*DependencyProperty*/ dp, /*AnimationTimeline*/ animation){},
//		void 
		BeginAnimation:function(/*DependencyProperty*/ dp, /*AnimationTimeline*/ animation, /*HandoffBehavior*/ handoffBehavior){},
//		object 
		GetAnimationBaseValue:function(/*DependencyProperty*/ dp){},
	});
	
	Object.defineProperties(IAnimatable.prototype,{
//		bool 
		HasAnimatedProperties:
		{
			get:function(){}
		}
	});
	
	IAnimatable.Type = new Type("IAnimatable", IAnimatable, [Object.Type], true);
	return IAnimatable;
});
