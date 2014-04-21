package org.summer.view.window.automation.peer;
public enum AutomationEvents
    {
        /// 
        ToolTipOpened,
        /// 
        ToolTipClosed, 
        ///
        MenuOpened, 
        ///
        MenuClosed,
        ///
        AutomationFocusChanged, 
        ///
        InvokePatternOnInvoked, 
        /// 
        SelectionItemPatternOnElementAddedToSelection,
        /// 
        SelectionItemPatternOnElementRemovedFromSelection,
        ///
        SelectionItemPatternOnElementSelected,
        /// 
        SelectionPatternOnInvalidated,
        /// 
        TextPatternOnTextSelectionChanged, 
        ///
        TextPatternOnTextChanged, 
        ///
        AsyncContentLoaded,
        ///
        PropertyChanged, 
        ///
        StructureChanged, 
        /// 
        InputReachedTarget,
        /// 
        InputReachedOtherElement,
        ///
        InputDiscarded,
    } 

 
    ///<summary> This is a helper class to facilate the storage of Security critical data ( aka "Plutonium") 
    /// It's primary purpose is to do put a [SecurityCritical] on all access to the data.
    /// What is "critical data" ? This is any data created that required an Assert for it's creation. 
    ///</summary> As an example - the passage of hosted Hwnd between some AutomationPeer and UIA infrastructure.
    public sealed class HostedWindowWrapper
    {
        /// <summary> 
        /// This is the only public constructor on this class.
        /// It requires "Full Trust" level of security permissions to be executed, since this 
        /// class is wrappign an HWND direct access to which is a critical asset. 
        /// </summary>
        /// <SecurityNote> 
        /// Critical - as this accesses _hwnd which is Critical.
        /// Safe - as the caller already got the critical value.
        /// In addition, we prevent creating this class by external callers who does not have UnmanagedCode permission.
        /// </SecurityNote> 
        [SecurityCritical, SecurityTreatAsSafe]
        public HostedWindowWrapper(IntPtr hwnd) 
        { 
            (new SecurityPermission(SecurityPermissionFlag.UnmanagedCode)).Demand();
            _hwnd = hwnd; 
        }

        // <SecurityNote>
        //    Critical "by definition" - this class is intended to store critical data. 
        // </SecurityNote>
        [SecurityCritical] 
        private HostedWindowWrapper() 
        {
            _hwnd = IntPtr.Zero; 
        }

        // <SecurityNote>
        //    Critical "by definition" - this class is intended to store critical data. 
        // </SecurityNote>
        [SecurityCritical] 
        internal static HostedWindowWrapper CreateInternal(IntPtr hwnd) 
        {
            HostedWindowWrapper wrapper = new HostedWindowWrapper(); 
            wrapper._hwnd = hwnd;
            return wrapper;
        }
 
        // <SecurityNote>
        //    Critical "by definition" - this class is intended to store critical data. 
        // </SecurityNote> 
        internal IntPtr Handle
        { 
            [SecurityCritical]
            get
            {
                return _hwnd; 
            }
        } 
 
        /// <SecurityNote>
        /// Critical - by definition as this is a wrapper for Critical data. 
        /// </SecurityNote>
        [SecurityCritical]
        private IntPtr _hwnd;
    } 

 
    /// 
    