package org.summer.view.widget.documents;
/// <summary> 
/// Represents a certain content's position. This position is content
/// specific.
/// </summary>
public abstract class ContentPosition 
{
    /// <summary> 
    /// Static representation of a non-existent ContentPosition. 
    /// </summary>
    public static final ContentPosition Missing = new MissingContentPosition(); 

//    #region Missing

    /// <summary> 
    /// Representation of a non-existent ContentPosition.
    /// </summary> 
    private class MissingContentPosition extends ContentPosition 
	 {
	    	
	 } 

//    #endregion Missing 
}