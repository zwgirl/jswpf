/**
 * TimelineGroup
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var TimelineGroup = declare(null,{
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
	
	Object.defineProperties(TimelineGroup.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	TimelineGroup.Type = new Type("TimelineGroup", TimelineGroup, [Object.Type]);
	return TimelineGroup;
});

//---------------------------------------------------------------------------- 
// <copyright file="TimelineGroup.cs" company="Microsoft">
//    Copyright (C) Microsoft Corporation.  All rights reserved.
// </copyright>
//--------------------------------------------------------------------------- 

 
using System.ComponentModel; 
using System.Diagnostics;
using System.Runtime.InteropServices; 
using System.Windows.Markup;

using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID; 

namespace System.Windows.Media.Animation 
{ 
    /// <summary>
    /// This class represents base class for Timelines that have functionality 
    /// related to having Children.
    /// </summary>
    public abstract partial class TimelineGroup : Timeline, IAddChild 
    {
        /// <summary>
        /// Creates a TimelineGroup with default properties. 
        /// </summary>
        protected TimelineGroup()
            : base()
        { 
        }
 
        /// <summary> 
        /// Creates a TimelineGroup with the specified BeginTime.
        /// </summary> 
        /// <param name="beginTime">
        /// The scheduled BeginTime for this TimelineGroup.
        /// </param>
        protected TimelineGroup(Nullable<TimeSpan> beginTime) 
            : base(beginTime)
        { 
        } 

        /// <summary> 
        /// Creates a TimelineGroup with the specified begin time and duration.
        /// </summary>
        /// <param name="beginTime">
        /// The scheduled BeginTime for this TimelineGroup. 
        /// </param>
        /// <param name="duration"> 
        /// The simple Duration of this TimelineGroup. 
        /// </param>
        protected TimelineGroup(Nullable<TimeSpan> beginTime, Duration duration) 
            : base(beginTime, duration)
        {
        }
 
        /// <summary>
        /// Creates a TimelineGroup with the specified BeginTime, Duration and RepeatBehavior. 
        /// </summary> 
        /// <param name="beginTime">
        /// The scheduled BeginTime for this TimelineGroup. 
        /// </param>
        /// <param name="duration">
        /// The simple Duration of this TimelineGroup.
        /// </param> 
        /// <param name="repeatBehavior">
        /// The RepeatBehavior for this TimelineGroup. 
        /// </param> 
        protected TimelineGroup(Nullable<TimeSpan> beginTime, Duration duration, RepeatBehavior repeatBehavior)
            : base(beginTime, duration, repeatBehavior) 
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        protected internal override Clock AllocateClock()
        { 
            return new ClockGroup(this);
        } 
 
        /// <summary>
        /// Creates a new ClockGroup using this TimelineGroup. 
        /// </summary>
        /// <returns>A new ClockGroup.</returns>
        new public ClockGroup CreateClock()
        { 
            return (ClockGroup)base.CreateClock();
        } 
 

        /// <summary>
        /// Adds a child object to this TimelineGroup. 
        /// </summary>
        /// <param name="child"> 
        /// The child object to add. 
        /// </param>
        /// <remarks> 
        /// A Timeline only accepts another Timeline (or derived class) as
        /// a child.
        /// </remarks>
        void IAddChild.AddChild(object child) 
        {
            WritePreamble(); 
 
            if (child == null)
            { 
                throw new ArgumentNullException("child");
            }

            AddChild(child); 

            WritePostscript(); 
        } 

        /// <summary> 
        /// This method performs the core functionality of the AddChild()
        /// method on the IAddChild interface.  For a Timeline this means
        /// determining adding the child parameter to the Children collection
        /// if it's a Timeline. 
        /// </summary>
        /// <remarks> 
        /// This method is the only core implementation.  It does not call 
        /// WritePreamble() or WritePostscript().  It also doesn't throw an
        /// ArgumentNullException if the child parameter is null.  These tasks 
        /// are performed by the interface implementation.  Therefore, it's OK
        /// for a derived class to override this method and call the base
        /// class implementation only if they determine that it's the right
        /// course of action.  The derived class can rely on Timeline's 
        /// implementation of IAddChild.AddChild or implement their own
        /// following the Freezable pattern since that would be a public 
        /// method. 
        /// </remarks>
        /// <param name="child">An object representing the child that 
        /// should be added.  If this is a Timeline it will be added to the
        /// Children collection; otherwise an exception will be thrown.</param>
        /// <exception cref="ArgumentException">The child parameter is not a
        /// Timeline.</exception> 
        protected virtual void AddChild(object child) 
        { 
            Timeline timelineChild = child as Timeline;
 
            if (timelineChild == null)
            {
                throw new ArgumentException(SR.Get(SRID.Timing_ChildMustBeTimeline), "child");
            } 
            else
            { 
                Children.Add(timelineChild); 
            }
        } 

        /// <summary>
        /// Adds a text string as a child of this Timeline.
        /// </summary> 
        /// <param name="childText">
        /// The text to add. 
        /// </param> 
        /// <remarks>
        /// A Timeline does not accept text as a child, so this method will 
        /// raise an InvalididOperationException unless a derived class has
        /// overridden the behavior to add text.
        /// </remarks>
        /// <exception cref="ArgumentNullException">The childText parameter is 
        /// null.</exception>
        void IAddChild.AddText(string childText) 
        { 
            WritePreamble();
 
            if (childText == null)
            {
                throw new ArgumentNullException("childText");
            } 

            AddText(childText); 
 
            WritePostscript();
        } 

        /// <summary>
        /// This method performs the core functionality of the AddText()
        /// method on the IAddChild interface.  For a Timeline this means 
        /// throwing and InvalidOperationException because it doesn't
        /// support adding text. 
        /// </summary> 
        /// <remarks>
        /// This method is the only core implementation.  It does not call 
        /// WritePreamble() or WritePostscript().  It also doesn't throw an
        /// ArgumentNullException if the childText parameter is null.  These tasks
        /// are performed by the interface implementation.  Therefore, it's OK
        /// for a derived class to override this method and call the base 
        /// class implementation only if they determine that it's the right
        /// course of action.  The derived class can rely on Timeline's 
        /// implementation of IAddChild.AddChild or implement their own 
        /// following the Freezable pattern since that would be a public
        /// method. 
        /// </remarks>
        /// <param name="childText">A string representing the child text that
        /// should be added.  If this is a Timeline an exception will be
        /// thrown.</param> 
        /// <exception cref="InvalidOperationException">Timelines have no way
        /// of adding text.</exception> 
        protected virtual void AddText(string childText)
        { 
            throw new InvalidOperationException(SR.Get(SRID.Timing_NoTextChildren));
        }

        /// <summary>
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience. 
        /// </summary>
        public new TimelineGroup Clone() 
        {
            return (TimelineGroup)base.Clone();
        }
 
        /// <summary>
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience. 
        /// </summary>
        public new TimelineGroup CloneCurrentValue() 
        {
            return (TimelineGroup)base.CloneCurrentValue();
        }
 
        /// <summary>
        ///     Children - TimelineCollection.  Default value is new FreezableDefaultValueFactory(TimelineCollection.Empty). 
        /// </summary>
        public TimelineCollection Children 
        { 
            get
            { 
                return (TimelineCollection) GetValue(ChildrenProperty);
            }
            set
            { 
                SetValueInternal(ChildrenProperty, value);
            } 
        } 

        /// <summary>
        ///     The DependencyProperty for the TimelineGroup.Children property.
        /// </summary> 
        public static readonly DependencyProperty ChildrenProperty;
 
        internal static TimelineCollection s_Children = TimelineCollection.Empty;
 
        static TimelineGroup()
        { 
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272) 
            //
            Debug.Assert(s_Children == null || s_Children.IsFrozen, 
                "Detected context bound default value TimelineGroup.s_Children (See OS Bug #947272)."); 

 
            // Initializations
            Type typeofThis = typeof(TimelineGroup);
            ChildrenProperty =
                  RegisterProperty("Children", 
                                   typeof(TimelineCollection),
                                   typeofThis, 
                                   new FreezableDefaultValueFactory(TimelineCollection.Empty), 
                                   null,
                                   null, 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
        }
    }
} 

