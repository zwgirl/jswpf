package org.summer.view.widget.controls;

/*internal*/ public class ContentModelTreeEnumerator extends ModelTreeEnumerator
{ 
    /*internal*/ public ContentModelTreeEnumerator(ContentControl contentControl, Object content) 
    { 
    	super(content)
//        Debug.Assert(contentControl != null, "contentControl should be non-null."); 

        _owner = contentControl; 
    }

    protected /*override*/ boolean IsUnchanged
    { 
        get
        { 
            return Object.ReferenceEquals(Content, _owner.Content); 
        }
    } 

    private ContentControl _owner;
}