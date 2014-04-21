 	/// <summary> 
    /// Information pertaining to when the access key associated with an element is pressed 
    /// </summary>
    public class AccessKeyEventArgs : EventArgs 
    {
        /// <summary>
        ///
        /// </summary> 
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used 
        ///            for security purposes later. 
        /// </SecurityNote>
        [SecurityCritical] 
        internal AccessKeyEventArgs(string key, bool isMultiple, bool userInitiated)
        {
            _key = key;
            _isMultiple = isMultiple; 
            _userInitiated = new SecurityCriticalDataForSet<bool>(userInitiated);
        } 
 
        /// <SecurityNote>
        /// Critical - sets the userInitiated bit on a command, which is used 
        ///            for security purposes later.
        /// TreatAsSafe: Resets the user initiated bit
        /// </SecurityNote>
        [SecurityCritical,SecurityTreatAsSafe] 
        internal void ClearUserInitiated()
        { 
            _userInitiated.Value = false; 
        }
        /// <summary> 
        /// The key that was pressed which invoked this access key
        /// </summary>
        /// <value></value>
        public string Key 
        {
            get { return _key; } 
        } 

        /// <summary> 
        /// Were there other elements which are also invoked by this key
        /// </summary>
        /// <value></value>
        public bool IsMultiple 
        {
            get { return _isMultiple; } 
        } 

        internal bool UserInitiated 
        {
            get { return _userInitiated.Value; }
        }
 

        private string _key; 
        private bool _isMultiple; 
        /// <SecurityNote>
        /// Critical -  This is critical for set, setting this bool can cause the spoofing of paste 
        /// </SecurityNote>
        private SecurityCriticalDataForSet<bool >_userInitiated;

    } 