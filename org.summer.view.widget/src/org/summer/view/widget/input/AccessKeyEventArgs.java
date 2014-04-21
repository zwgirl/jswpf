package org.summer.view.widget.input;

import org.summer.view.widget.EventArgs;

/// <summary> 
    /// Information pertaining to when the access key associated with an element is pressed 
    /// </summary>
    public class AccessKeyEventArgs extends EventArgs 
    {
        /// <summary>
        ///
        /// </summary> 
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used 
        ///            for security purposes later. 
        /// </SecurityNote>
//        [SecurityCritical] 
        /*internal*/ public AccessKeyEventArgs(String key, boolean isMultiple, boolean userInitiated)
        {
            _key = key;
            _isMultiple = isMultiple; 
            _userInitiated = new SecurityCriticalDataForSet<Boolean>(userInitiated);
        } 
 
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used 
        ///            for security purposes later.
        /// TreatAsSafe: Resets the user initiated bit
        /// </SecurityNote>
//        [SecurityCritical,SecurityTreatAsSafe] 
        /*internal*/ public void ClearUserInitiated()
        { 
            _userInitiated.Value = false; 
        }
        /// <summary> 
        /// The key that was pressed which invoked this access key
        /// </summary>
        /// <value></value>
        public String Key 
        {
            get { return _key; } 
        } 

        /// <summary> 
        /// Were there other elements which are also invoked by this key
        /// </summary>
        /// <value></value>
        public boolean IsMultiple 
        {
            get { return _isMultiple; } 
        } 

        /*internal*/ public boolean UserInitiated 
        {
            get { return _userInitiated.Value; }
        }
 

        private String _key; 
        private boolean _isMultiple; 
        /// <SecurityNote>
        /// Critical -  This is critical for set, setting this boolean can cause the spoofing of paste 
        /// </SecurityNote>
        private SecurityCriticalDataForSet<Boolean >_userInitiated;

    } 