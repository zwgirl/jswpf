/**
 * SynchronizationInfo
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SynchronizationInfo = declare("SynchronizationInfo", null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(SynchronizationInfo.prototype,{

	});
	
	SynchronizationInfo.Type = new Type("SynchronizationInfo", SynchronizationInfo, [Object.Type]);
	return SynchronizationInfo;
});
internal struct SynchronizationInfo 
{
    public SynchronizationInfo(object context, CollectionSynchronizationCallback callback)
    {
        if (callback == null) 
        {
            // 80% case:  no callback - use the context as target of lock(). 
            // For this case, just store the context directly - we ask people 
            // not to use a lock object that hold references.
            _context = context; 
            _callbackMethod = null;
            _callbackTarget = null;
        }
        else 
        {
            // General case: invoke the callback to gain access. 
            // In this case, both the context and the callback's target 
            // belong to the app and should not be kept alive by WPF.
            _context = new WeakReference(context); 
            _callbackMethod = callback.Method;

            // distinguish static methods (target = null) from methods whose
            // target gets GC'd 
            object target = callback.Target;
            _callbackTarget = (target != null)? new WeakReference(target) : ViewManager.StaticWeakRef; 
        } 
    }

    public bool IsSynchronized
    {
        get { return _context != null || _callbackMethod != null; }
    } 

    public void AccessCollection(IEnumerable collection, Action accessMethod, bool writeAccess) 
    { 
        if (_callbackMethod != null)
        { 
            // make sure the callback's target is still available
            object target = _callbackTarget.Target;
            if (target == null)
                throw new InvalidOperationException(SR.Get(SRID.CollectionView_MissingSynchronizationCallback, collection)); 

            // invoke the callback 
            if (_callbackTarget == ViewManager.StaticWeakRef) 
                target = null;          // static method

            WeakReference wrContext = _context as WeakReference;
            object context = (wrContext != null)? wrContext.Target : _context;
            _callbackMethod.Invoke(target, new object[]{collection, context, accessMethod, writeAccess});
        } 
        else if (_context != null)
        { 
            lock(_context) 
            {
                accessMethod(); 
            }
        }
        else
        { 
            accessMethod();
        } 
    } 

    public bool IsAlive 
    {
        get
        {
            return (_callbackMethod != null && _callbackTarget.IsAlive) || 
                    (_callbackMethod == null && _context != null);
        } 
    } 


    public static readonly SynchronizationInfo None = new SynchronizationInfo(null, null);

    object _context;
    MethodInfo _callbackMethod; 
    WeakReference _callbackTarget;

} 