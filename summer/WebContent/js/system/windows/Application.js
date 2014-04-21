/**
 * Application
 */

define(["dojo/_base/declare", "system/Type", "windows/ResourceDictionary", "markup/IHaveResources"], 
		function(declare, Type, ResourceDictionary, IHaveResources){
	var Application = declare("Application", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
//	        private ResourceDictionary          
	        this._resources = null;

//	        private bool                        
	        this._hasImplicitStylesInResources = false;
		},
	
	    /// <summary>
	    ///     Searches for a resource with the passed resourceKey and returns it
	    /// </summary>
	    /// <remarks> 
	    ///     If the sources is not found on the App, SystemResources are searched.
	    /// </remarks> 
	    /// <param name="resourceKey">Name of the resource</param> 
	    /// <returns>The found resource.</returns>
	    /// <exception cref="ResourceReferenceKeyNotFoundException"> if the key is not found.</exception> 
//	    public object 
	    FindResource:function(/*object*/ resourceKey)
	    {
	        /*ResourceDictionary*/var resources = this._resources;
	        /*object*/var resource = null; 
	
	        if (resources != null) 
	        { 
	            resource = resources.Get(resourceKey);
	        } 
	
	        if (resource == Type.UnsetValue  || resource == null)
	        {
	            // This is the top of the tree, try the system resource collection 
	            // Safe from multithreading issues, SystemResources uses the SyncRoot lock to access the resource
	            resource = SystemResources.FindResourceInternal(resourceKey); 
	        } 
	
	        if (resource == null) 
	        {
	            Helper.ResourceFailureThrow(resourceKey);
	        }
	
	        return resource;
	    },
	
	    /// <summary>
	    ///     Searches for a resource with the passed resourceKey and returns it 
	    /// </summary>
	    /// <remarks>
	    ///     If the sources is not found on the App, SystemResources are searched.
	    /// </remarks> 
	    /// <param name="resourceKey">Name of the resource</param>
	    /// <returns>The found resource.  Null if not found.</returns> 
//	    public object
	    TryFindResource:function(/*object*/ resourceKey) 
	    {
	        /*ResourceDictionary*/var resources = this._resources; 
	        /*object*/var resource = null;
	
	        if (resources != null)
	        { 
	            resource = resources.Get(resourceKey);
	        } 
	
	        if (resource == Type.UnsetValue  || resource == null)
	        { 
	            // This is the top of the tree, try the system resource collection
	            // Safe from multithreading issues, SystemResources uses the SyncRoot lock to access the resource
	            resource = SystemResources.FindResourceInternal(resourceKey);
	        } 
	        return resource;
	    },
	
	    //
	    // Internal routine only look up in application resources 
	    //
//	    internal object 
	    FindResourceInternal:function(/*object*/ resourceKey)
	    {
	        // Call Forwarded 
	        return this.FindResourceInternal(resourceKey, false /*allowDeferredResourceReference*/, false /*mustReturnDeferredResourceReference*/);
	    },
	
//	    internal object 
	    FindResourceInternal:function(/*object*/ resourceKey, /*bool*/ allowDeferredResourceReference, /*bool*/ mustReturnDeferredResourceReference)
	    { 
	        /*ResourceDictionary*/var resources = this._resources;
	
	        if (resources == null)
	        { 
	            return null;
	        } 
	        else 
	        {
//	            bool canCache; 
	            return resources.FetchResource(resourceKey, allowDeferredResourceReference, 
	            		mustReturnDeferredResourceReference, {"canCache" : null} /*out canCache*/);
	        }
	    }

	});
	
	Object.defineProperties(Application.prototype,{
	     /// <summary> 
        ///     Current locally defined Resources
        /// </summary>
//        public ResourceDictionary 
        Resources: 
        {
            //Don't use  VerifyAccess() here since Resources can be set from any thread. 
            //We synchronize access using _globalLock 

            get:function()
            {
                /*ResourceDictionary*/var resources;
                /*bool*/var needToAddOwner = false;
 
                if (this._resources == null) 
                {
                    // Shouldn't return null for property of type collection. 
                    // It enables the Mort scenario: application.Resources.Add();
                	this._resources = new ResourceDictionary();
                    needToAddOwner = true;
                } 

                resources = this._resources; 

                if (needToAddOwner) 
                {
                    resources.AddOwner(this);
                }
 
                return resources;
            },
            set:function(value) 
            {
                /*bool*/var invalidateResources = false; 
                /*ResourceDictionary*/var oldValue;

                oldValue = this._resources;
                this._resources = value; 

                if (oldValue != null) 
                {
                    // This app is no longer an owner for the old RD
                    oldValue.RemoveOwner(this);
                } 

                if (value != null) 
                { 
                    if (!value.ContainsOwner(this))
                    { 
                        // This app is an owner for the new RD
                        value.AddOwner(this);
                    }
                } 

                if (oldValue != value) 
                { 
                    invalidateResources = true;
                } 

                if (invalidateResources)
                {
                    InvalidateResourceReferences(new ResourcesChangeInfo(oldValue, value)); 
                }
            } 
        },

        // Says if App.Resources has any implicit styles
//        internal bool 
        HasImplicitStylesInResources: 
        { 
            get:function() { return this._hasImplicitStylesInResources; },
            set:function(value) { this._hasImplicitStylesInResources = value; } 
        },
 

        /// <summary>
        /// Gets the property Hashtable.
        /// </summary> 
        /// <returns>IDictionary interface</returns>
        /// <remarks> 
        /// This property is accessible from any thread 
        /// </remarks>
//        public IDictionary 
        Properties:
        {
            get:function()
            {
                if (this._htProps === undefined) 
                {
                	this._htProps = {};
                } 
                return this._htProps;
            } 
        }
	});
	
	Object.defineProperties(Application, {
        /// <summary>
        ///     The Current property enables the developer to always get to the application in 
        ///     AppDomain in which they are running.
        /// </summary>
//        static public Application 
        Current:
        { 
            get:function()
            { 
            	if(Application._appInstance === undefined){
            		Application._appInstance = new Application();
            	}
                return Application._appInstance;
            }
        } 
	});
	
    /// <summary>
    /// Gets the cookie for the uri. It will work only for site of origin. 
    /// </summary>
    /// <param name="uri">The uri for which the cookie is to be read</param>
    /// <returns>The cookie, if it exsits, else an exception is thrown.</returns>
    /// <Remarks> 
    ///     Callers must have FileIOPermission(FileIOPermissionAccess.Read) or WebPermission(NetworkAccess.Connect) for the Uri, depending on whether the Uri is a file Uri or not, to call this API.
    /// </Remarks> 
//    public static string 
    Application.GetCookie = function(/*Uri*/ uri) 
    {
        return CookieHandler.GetCookie(uri, true/*throwIfNoCookie*/); 
    };

    /// <summary>
    /// Sets the cookie for the uri. It will work only for site of origin. 
    /// </summary>
    /// <param name="uri">The uri for which the cookie is to be set</param> 
    /// <param name="value">The value of the cookie. Should be name=value, but "value-only" cookies are also allowed. </param> 
    /// <Remarks>
    ///     Callers must have FileIOPermission(FileIOPermissionAccess.Read) or WebPermission(NetworkAccess.Connect) for the Uri, depending on whether the Uri is a file Uri or not, to call this API. 
    /// </Remarks>
//    public static void 
    Application.SetCookie = function(/*Uri*/ uri, /*string*/ value)
    {
        CookieHandler.SetCookie(uri, value); 
    };
	
	Application.Type = new Type("Application", Application, [DispatcherObject.Type, IHaveResources.Type]);
	return Application;
});
