package org.summer.view.widget.controls;
/*internal*/ public class HeaderedContentModelTreeEnumerator extends ModelTreeEnumerator
    { 
        /*internal*/ public HeaderedContentModelTreeEnumerator(HeaderedContentControl headeredContentControl,
        		Object content, Object header) 
        {
        	super(header);
//            Debug.Assert(headeredContentControl != null, "headeredContentControl should be non-null."); 
//            Debug.Assert(header != null, "Header should be non-null. If Header was null, the base ContentControl enumerator should have been used.");

            _owner = headeredContentControl;
            _content = content; 
        }
 
        protected /*override*/ Object Current 
        {
            get 
            {
                if ((Index == 1) && (_content != null))
                {
                    return _content; 
                }
 
                return super.Current; 
            }
        } 

        protected /*override*/ boolean MoveNext()
        {
            if (_content != null) 
            {
                if (Index == 0) 
                { 
                    // Moving from the header to content
                    Index++; 
                    VerifyUnchanged();
                    return true;
                }
                else if (Index == 1) 
                {
                    // Going from content to the end 
                    Index++; 
                    return false;
                } 
            }

            return super.MoveNext();
        } 

        protected /*override*/ boolean IsUnchanged 
        { 
            get
            { 
                Object header = Content;    // Header was passed to the base so that it would appear in index 0
                return Object.ReferenceEquals(header, _owner.Header) &&
                       Object.ReferenceEquals(_content, _owner.Content);
            } 
        }
 
        private HeaderedContentControl _owner; 
        private Object _content;
    } 