package org.summer.view.widget.documents;
 /// <summary> 
    /// Enum for the state of the undo manager
    /// </summary> 
    /// <ExternalAPI Inherit="true"/> 
    internal enum UndoState
    { 
        /// <summary>
        /// Ready to accept new undo units; not currently undoing or redoing
        /// </summary>
        /// <ExternalAPI/> 
        Normal,
 
        /// <summary> 
        /// In the process of undoing
        /// </summary> 
        /// <ExternalAPI/>
        Undo,

        /// <summary> 
        /// In the process of redoing
        /// </summary> 
        /// <ExternalAPI/> 
        Redo,
 
        /// <summary>
        /// In the process of rolling back an aborted undo unit
        /// </summary>
        /// <ExternalAPI/> 
        Rollback
    }; 
 
  