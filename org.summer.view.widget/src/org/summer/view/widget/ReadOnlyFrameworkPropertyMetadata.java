package org.summer.view.widget;
/*internal*/ public class ReadOnlyFrameworkPropertyMetadata extends FrameworkPropertyMetadata 
{
    public ReadOnlyFrameworkPropertyMetadata(Object defaultValue, GetReadOnlyValueCallback getValueCallback)  
    {
    	super(defaultValue);
        _getValueCallback = getValueCallback; 
    }

    /*internal*/ public /*override*/ GetReadOnlyValueCallback GetReadOnlyValueCallback
    { 
        get
        { 
            return _getValueCallback; 
        }
    } 

    private GetReadOnlyValueCallback _getValueCallback;
}