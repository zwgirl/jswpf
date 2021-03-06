package org.summer.view.widget;
//[System.Runtime.InteropServices.ComVisible(true)]
//#if !FEATURE_CORECLR 
//    [SecurityPermissionAttribute(SecurityAction.InheritanceDemand, Flags=SecurityPermissionFlag.UnmanagedCode)] // Don't call Object::MemberwiseClone.
//#endif 
//    [Serializable] 
    public class WeakReference<T> implements ISerializable {
        // If you fix bugs here, please fix them in WeakReference<T> at the same time. 

        // This field is not a regular GC handle. It can have a special values that are used to prevent ----s between setting the target and finalization.
        /*internal*/ IntPtr m_handle;
 
//#if FEATURE_CORECLR
//        // Migrating InheritanceDemands requires this default ctor, so we can mark it SafeCritical 
//        [SecuritySafeCritical] 
//        protected WeakReference() {
//            Contract.Assert(false, "WeakReference's protected default ctor should never be used!"); 
//            throw new NotImplementedException();
//        }
//#endif
 
        // Creates a new WeakReference that keeps track of target.
        // Assumes a Short Weak Reference (ie TrackResurrection is false.) 
        // 
        public WeakReference(Object target)
        { 
        	 this(target, false);
        }

        //Creates a new WeakReference that keeps track of target.
        // 
        public WeakReference(Object target, boolean trackResurrection) {
            Create(target, trackResurrection); 
        } 

        protected WeakReference(SerializationInfo info, StreamingContext context) { 
            if (info==null) {
                throw new ArgumentNullException("info");
            }
            Contract.EndContractBlock(); 

            Object target = info.GetValue("TrackedObject",typeof(Object)); 
            boolean trackResurrection = info.Getbooleanean("TrackResurrection"); 

            Create(target, trackResurrection); 
        }

        //Determines whether or not this instance of WeakReference still refers to an object
        //that has not been collected. 
        //
        public /*extern*/ /*virtual*/ boolean IsAlive { 
//            [ResourceExposure(ResourceScope.None)] 
//            [MethodImplAttribute(MethodImplOptions./*internal*/Call)]
//            [SecuritySafeCritical] 
            get;
         }

        //Returns a booleanean indicating whether or not we're tracking objects until they're collected (true) 
        //or just until they're finalized (false).
        // 
        public /*virtual*/ boolean TrackResurrection { 
            // We need to call IsTrackResurrection non-/*virtual*/ly in GetObjectData, and so the /*virtual*/ property cannot be FCall directly
            get { return IsTrackResurrection(); } 
        }

        //Gets the Object stored in the handle if it's accessible.
        // Or sets it. 
        //
        public /*extern*/ /*virtual*/ Object Target { 
//            [ResourceExposure(ResourceScope.None)] 
//            [MethodImplAttribute(MethodImplOptions./*internal*/Call)]
//            [SecuritySafeCritical] 
            get;
//            [ResourceExposure(ResourceScope.None)]
//            [MethodImplAttribute(MethodImplOptions./*internal*/Call)]
//            [SecuritySafeCritical] 
            set;
        } 
 
        // Free all system resources associated with this reference.
        // 
        // Note: The WeakReference finalizer is not actually run, but
        // treated specially in gc.cpp's ScanForFinalization
        // This is needed for subclasses deriving from WeakReference, however.
        // Additionally, there may be some cases during shutdown when we run this finalizer. 
//        [ResourceExposure(ResourceScope.None)]
//        [MethodImplAttribute(MethodImplOptions./*internal*/Call)] 
//        [SecuritySafeCritical] 
//        extern ~WeakReference();
// 
//        [SecurityCritical]
        public /*virtual*/ void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            if (info==null) { 
                throw new ArgumentNullException("info");
            } 
            Contract.EndContractBlock(); 
            info.AddValue("TrackedObject", Target, typeof(Object));
            info.AddValue("TrackResurrection", IsTrackResurrection()); 
        }

//        [ResourceExposure(ResourceScope.None)]
//        [MethodImplAttribute(MethodImplOptions./*internal*/Call)] 
//        [SecuritySafeCritical]
        private /*extern*/ void Create(Object target, boolean trackResurrection); 
 
//        [ResourceExposure(ResourceScope.None)]
//        [MethodImplAttribute(MethodImplOptions./*internal*/Call)] 
//        [SecuritySafeCritical]
        private /*extern*/ boolean IsTrackResurrection();
    }