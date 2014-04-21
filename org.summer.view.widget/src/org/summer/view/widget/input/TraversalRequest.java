package org.summer.view.widget.input;

import org.summer.view.widget.threading.InvalidEnumArgumentException;

/// <summary> 
    /// Represents a request to an element to move focus to another control.
    /// </summary> 
//    [Serializable()] 
    public class TraversalRequest
    { 
        /// <summary>
        /// Constructor that requests passing FocusNavigationDirection
        /// </summary>
        /// <param name="focusNavigationDirection">Type of focus traversal to perform</param> 
        public TraversalRequest(FocusNavigationDirection focusNavigationDirection)
        { 
            if (focusNavigationDirection != FocusNavigationDirection.Next && 
                 focusNavigationDirection != FocusNavigationDirection.Previous &&
                 focusNavigationDirection != FocusNavigationDirection.First && 
                 focusNavigationDirection != FocusNavigationDirection.Last &&
                 focusNavigationDirection != FocusNavigationDirection.Left &&
                 focusNavigationDirection != FocusNavigationDirection.Right &&
                 focusNavigationDirection != FocusNavigationDirection.Up && 
                 focusNavigationDirection != FocusNavigationDirection.Down)
            { 
                throw new InvalidEnumArgumentException("focusNavigationDirection" /*, (int)focusNavigationDirection, typeof(FocusNavigationDirection)*/); 
            }
 
            _focusNavigationDirection = focusNavigationDirection;
        }

        /// <summary> 
        /// true if reached the end of child elements that should have focus
        /// </summary> 
        public boolean Wrapped 
        {
            get{return _wrapped;} 
            set{_wrapped = value;}
        }

        /// <summary> 
        /// Determine how to move the focus
        /// </summary> 
        public FocusNavigationDirection FocusNavigationDirection { get { return _focusNavigationDirection; } } 

        private boolean _wrapped; 
        private FocusNavigationDirection _focusNavigationDirection;

    }