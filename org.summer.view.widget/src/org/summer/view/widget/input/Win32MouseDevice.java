package org.summer.view.widget.input;
/// <summary>
    ///     The Win32MouseDevice class implements the platform specific
    ///     MouseDevice features for the Win32 platform
    /// </summary> 
    /*internal*/ public /*sealed*/ class Win32MouseDevice extends MouseDevice
    { 
        /// <summary> 
        ///
        /// </summary> 
        /// <param name="inputManager">
        /// </param>
        /// <SecurityNote>
        /// Critical - This is code that elevates AND creates the mouse device which 
        ///             happens to hold the callback to filter mouse messages
        /// TreatAsSafe: This constructor handles critical data but does not expose it 
        ///             It stores instance but there are demands on the instances. 
        /// </SecurityNote>
//        [SecurityCritical,SecurityTreatAsSafe] 
        /*internal*/ public Win32MouseDevice(InputManager inputManager)
        {
        	super(inputManager);
        } 

        /// <summary> 
        ///     Gets the current state of the specified button from the device from the underlying system 
        /// </summary>
        /// <param name="mouseButton"> 
        ///     The mouse button to get the state of
        /// </param>
        /// <returns>
        ///     The state of the specified mouse button 
        /// </returns>
        /// <SecurityNote> 
        ///     Critical: Makes calls to UnsafeNativeMethods (GetKeyState) 
        ///     TreatAsSafe: Only returns the current state of the specified button
        /// </SecurityNote> 
//        [SecurityCritical,SecurityTreatAsSafe]
        /*internal*/ public /*override*/ MouseButtonState GetButtonStateFromSystem(MouseButton mouseButton)
        {
            MouseButtonState mouseButtonState = MouseButtonState.Released; 

            // Security Mitigation: do not give out input state if the device is not active. 
            if(IsActive) 
            {
                int virtualKeyCode = 0; 

                switch( mouseButton )
                {
                    case MouseButton.Left: 
                        virtualKeyCode = NativeMethods.VK_LBUTTON;
                        break; 
                    case MouseButton.Right: 
                        virtualKeyCode = NativeMethods.VK_RBUTTON;
                        break; 
                    case MouseButton.Middle:
                        virtualKeyCode = NativeMethods.VK_MBUTTON;
                        break;
                    case MouseButton.XButton1: 
                        virtualKeyCode = NativeMethods.VK_XBUTTON1;
                        break; 
                    case MouseButton.XButton2: 
                        virtualKeyCode = NativeMethods.VK_XBUTTON2;
                        break; 
                }

                mouseButtonState = ( UnsafeNativeMethods.GetKeyState(virtualKeyCode) & 0x8000 ) != 0 ? MouseButtonState.Pressed : MouseButtonState.Released;
            } 

            return mouseButtonState; 
        } 
    }