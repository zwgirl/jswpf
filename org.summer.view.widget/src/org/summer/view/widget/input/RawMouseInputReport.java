package org.summer.view.widget.input;

import org.summer.view.internal.SecurityCriticalData;
import org.summer.view.widget.PresentationSource;
import org.summer.view.window.interop.IntPtr;

/// <summary>
    ///     The RawMouseInputReport class encapsulates the raw input provided
    ///     from a mouse.
    /// </summary> 
    /// <remarks>
    ///     It is important to note that the InputReport class only contains 
    ///     blittable types.  This is required so that the report can be 
    ///     marshalled across application domains.
    /// </remarks> 
//    [FriendAccessAllowed]
    /*internal*/ public class RawMouseInputReport extends InputReport
    {
        /// <summary> 
        ///     Constructs ad instance of the RawMouseInputReport class.
        /// </summary> 
        /// <param name="mode"> 
        ///     The mode in which the input is being provided.
        /// </param> 
        /// <param name="timestamp">
        ///     The time when the input occured.
        /// </param>
        /// <param name="inputSource"> 
        ///     The PresentationSource over which the mouse is moved.
        /// </param> 
        /// <param name="actions"> 
        ///     The set of actions being reported.
        /// </param> 
        /// <param name="x">
        ///     If horizontal position being reported.
        /// </param>
        /// <param name="y"> 
        ///     If vertical position being reported.
        /// </param> 
        /// <param name="wheel"> 
        ///     If wheel delta being reported.
        /// </param> 
        /// <param name="extraInformation">
        ///     Any extra information being provided along with the input.
        /// </param>
        /// <SecurityNote> 
        ///     Critical:This handles critical data in the form of PresentationSource and ExtraInformation
        ///     TreatAsSafe:There are demands on the  critical data(PresentationSource/ExtraInformation) 
        /// </SecurityNote> 
//        [SecurityCritical, SecurityTreatAsSafe]
        public RawMouseInputReport( 
            InputMode mode,
            int timestamp,
            PresentationSource inputSource,
            RawMouseActions actions, 
            int x,
            int y, 
            int wheel, 
            IntPtr extraInformation)
        { 
        	super(inputSource, InputType.Mouse, mode, timestamp);
            if (!IsValidRawMouseActions(actions))
                throw new System.ComponentModel.InvalidEnumArgumentException("actions", (int)actions, typeof(RawMouseActions));

            /* we pass a null state from MouseDevice.PreProcessorInput, so null is valid value for state */ 
            _actions = actions;
            _x = x; 
            _y = y; 
            _wheel = wheel;
            _extraInformation = new SecurityCriticalData<IntPtr>(extraInformation); 
        }

        /// <summary>
        ///     Read-only access to the set of actions that were reported. 
        /// </summary>
        public RawMouseActions Actions {get {return _actions;}} 
 
        /// <summary>
        ///     Read-only access to the horizontal position that was reported. 
        /// </summary>
        public int X {get {return _x;}}

        /// <summary> 
        ///     Read-only access to the vertical position that was reported.
        /// </summary> 
        public int Y {get {return _y;}} 

        /// <summary> 
        ///     Read-only access to the wheel delta that was reported.
        /// </summary>
        public int Wheel {get {return _wheel;}}
 
        /// <summary>
        ///     Read-only access to the extra information was provided along 
        ///     with the input. 
        /// </summary>
        /// <SecurityNote> 
        ///     Critical: This data was got under an elevation. There exists a link demand to
        ///     block access. The critical exists to catch new callers too.
        /// </SecurityNote>
        public IntPtr ExtraInformation 
        {
//            [SecurityCritical] 
            get 
            {
                return _extraInformation.Value; 
            }
        }

        // IsValid Method for RawMouseActions. Relies on the enum being flags. 
        /*internal*/ public static boolean IsValidRawMouseActions(RawMouseActions actions)
        { 
            if (actions == RawMouseActions.None) 
                return true;
 
            if ((( RawMouseActions.AttributesChanged | RawMouseActions.Activate | RawMouseActions.Deactivate |
                  RawMouseActions.RelativeMove | RawMouseActions.AbsoluteMove | RawMouseActions.VirtualDesktopMove |
                  RawMouseActions.Button1Press | RawMouseActions.Button1Release |
                  RawMouseActions.Button2Press | RawMouseActions.Button2Release | 
                  RawMouseActions.Button3Press | RawMouseActions.Button3Release |
                  RawMouseActions.Button4Press | RawMouseActions.Button4Release | 
                  RawMouseActions.Button5Press | RawMouseActions.Button5Release | 
                  RawMouseActions.VerticalWheelRotate | RawMouseActions.HorizontalWheelRotate |
                  RawMouseActions.CancelCapture | 
                  RawMouseActions.QueryCursor) & actions) == actions)
            {
                if (!(((RawMouseActions.Deactivate & actions) == actions && RawMouseActions.Deactivate != actions ) ||
                      (((RawMouseActions.Button1Press | RawMouseActions.Button1Release) & actions) == (RawMouseActions.Button1Press | RawMouseActions.Button1Release)) || 
                      (((RawMouseActions.Button2Press | RawMouseActions.Button2Release) & actions) == (RawMouseActions.Button2Press | RawMouseActions.Button2Release)) ||
                      (((RawMouseActions.Button3Press | RawMouseActions.Button3Release) & actions) == (RawMouseActions.Button3Press | RawMouseActions.Button3Release)) || 
                      (((RawMouseActions.Button4Press | RawMouseActions.Button4Release) & actions) == (RawMouseActions.Button4Press | RawMouseActions.Button4Release)) || 
                      (((RawMouseActions.Button5Press | RawMouseActions.Button5Release) & actions) == (RawMouseActions.Button5Press | RawMouseActions.Button5Release))))
                { 
                    return true;
                }
            }
            return false; 
        }
 
        private RawMouseActions _actions; 
        private int _x;
        private int _y; 
        private int _wheel;

        /*internal*/ public boolean _isSynchronize; // Set from MouseDevice.Synchronize.
 
        /// <SecurityNote>
        ///     Critical:This data was got under an elevation and is not safe to expose. 
        /// </SecurityNote> 
        private SecurityCriticalData<IntPtr> _extraInformation;
    }