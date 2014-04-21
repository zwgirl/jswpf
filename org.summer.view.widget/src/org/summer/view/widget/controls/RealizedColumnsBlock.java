package org.summer.view.widget.controls;

/// <summary>
	///     Struct which holds block of realized column indices.
	/// </summary>
	/*internal*/ public class RealizedColumnsBlock 
	{
	    public RealizedColumnsBlock(int startIndex, int endIndex, int startIndexOffset) 
	    { 
	    	this();
	        StartIndex = startIndex;
	        EndIndex = endIndex; 
	        StartIndexOffset = startIndexOffset;
	    }
	
	    /// <summary> 
	    ///     Starting index of the block
	    /// </summary> 
	    public int StartIndex 
	    {
	        get; private set; 
	    }
	
	    /// <summary>
	    ///     Ending index of the block 
	    /// </summary>
	    public int EndIndex 
	    { 
	        get; private set;
	    } 
	
	    /// <summary>
	    ///     The count of realized columns before this block
	    /// </summary> 
	    public int StartIndexOffset
	    { 
	        get; private set; 
	    }
	}

