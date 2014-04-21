package org.summer.view.widget.data;

/// <summary> Async request to get the value of a property on an item. </summary>
/*internal*/ 
public class AsyncGetValueRequest extends AsyncDataRequest
    { 
        //-----------------------------------------------------
        // 
        //  Constructors 
        //
        //------------------------------------------------------ 

        /// <summary> Constructor. </summary>
        /*internal*/ public AsyncGetValueRequest( Object item,
                            String propertyName, 
                            Object bindingState,
                            AsyncRequestCallback workCallback, 
                            AsyncRequestCallback completedCallback, 
                            /*params*/ Object[] args
                            ) 
        {
        	super(bindingState, workCallback, completedCallback, args);
            _item = item;
            _propertyName = propertyName; 
        }
 
        //------------------------------------------------------ 
        //
        //  Public Properties 
        //
        //-----------------------------------------------------

        /// <summary> The item whose property is being requested </summary> 
        public Object SourceItem { get { return _item; } }
 
        /* unused by default scheduler.  Restore for custom schedulers. 
        /// <summary> The name of the property being requested </summary>
        public String PropertyName { get { return _propertyName; } } 
        */

        //------------------------------------------------------
        // 
        //  Private data
        // 
        //----------------------------------------------------- 

        Object _item; 
        String _propertyName;
    }

 
