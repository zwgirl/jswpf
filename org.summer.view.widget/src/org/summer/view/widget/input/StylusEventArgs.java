package org.summer.view.widget.input;

import org.summer.view.widget.Delegate;
import org.summer.view.widget.IInputElement;
import org.summer.view.widget.Point;

///////////////////////////////////////////////////////////////////////// 
    /// <summary> 
    ///     The StylusEventArgs class provides access to the logical
    ///     Stylus device for all derived event args. 
    /// </summary>
    public class StylusEventArgs extends InputEventArgs
    {
        ///////////////////////////////////////////////////////////////////// 
        /// <summary>
        ///     Initializes a new instance of the StylusEventArgs class. 
        /// </summary> 
        /// <param name="stylus">
        ///     The logical Stylus device associated with this event. 
        /// </param>
        /// <param name="timestamp">
        ///     The time when the input occured.
        /// </param> 
        public StylusEventArgs(StylusDevice stylus, int timestamp) 
        { 
        	super(stylus, timestamp);
            if( stylus == null ) 
            {
                throw new System.ArgumentNullException("stylus"); 
            }
        }

        ///////////////////////////////////////////////////////////////////// 
        /// <summary>
        ///     Read-only access to the stylus device associated with this 
        ///     event. 
        /// </summary>
        public StylusDevice StylusDevice 
        {
            get
            {
                return (StylusDevice)this.Device; 
            }
        } 
 
        /////////////////////////////////////////////////////////////////////
        /// <summary> 
        ///     Calculates the position of the stylus relative to a particular element.
        /// </summary>
        public Point GetPosition(IInputElement relativeTo)
        { 
            return StylusDevice.GetPosition(relativeTo);
        } 
 
        /////////////////////////////////////////////////////////////////////
        /// <summary> 
        ///		Indicates the stylus is not touching the surface.
        /// </summary>
        public boolean InAir
        { 
            get
            { 
                return StylusDevice.InAir; 
            }
        } 

        /////////////////////////////////////////////////////////////////////
        /// <summary>
        ///		Indicates stylusDevice is in the inverted state. 
        /// </summary>
        public boolean Inverted 
        { 
            get
            { 
                return StylusDevice.Inverted;
            }
        }
 
        /////////////////////////////////////////////////////////////////////
        /// <summary> 
        ///		Returns a StylusPointCollection for processing the data from input. 
        ///		This method creates a new StylusPointCollection and copies the data.
        /// </summary> 
        public StylusPointCollection GetStylusPoints(IInputElement relativeTo)
        {
            return StylusDevice.GetStylusPoints(relativeTo);
        } 

        ///////////////////////////////////////////////////////////////////// 
        /// <summary> 
        ///		Returns a StylusPointCollection for processing the data from input.
        ///		This method creates a new StylusPointCollection and copies the data. 
        /// </summary>
        public StylusPointCollection GetStylusPoints(IInputElement relativeTo, StylusPointDescription subsetToReformatTo)
        {
            return StylusDevice.GetStylusPoints(relativeTo, subsetToReformatTo); 
        }
 
        ///////////////////////////////////////////////////////////////////// 
        /// <summary>
        ///     The mechanism used to call the type-specific handler on the 
        ///     target.
        /// </summary>
        /// <param name="genericHandler">
        ///     The generic handler to call in a type-specific way. 
        /// </param>
        /// <param name="genericTarget"> 
        ///     The target to call the handler on. 
        /// </param>
        protected override void InvokeEventHandler(Delegate genericHandler, object genericTarget) 
        {
            StylusEventHandler handler = (StylusEventHandler) genericHandler;
            handler(genericTarget, this);
        } 

        ///////////////////////////////////////////////////////////////////// 
 
        /*internal*/ public RawStylusInputReport InputReport
        { 
            get { return _inputReport;  }
            set { _inputReport = value; }
        }
 
        /////////////////////////////////////////////////////////////////////
 
        RawStylusInputReport    _inputReport; 
    }