package org.summer.view.widget.internal;

import java.awt.Desktop.Action;

import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.reflection.MethodInfo;

/*internal*/public class SynchronizationInfo 
{
    public SynchronizationInfo(Object context, CollectionSynchronizationCallback callback)
    {
        if (callback == null) 
        {
            // 80% case:  no callback - use the context as target of lock(). 
            // For this case, just store the context directly - we ask people 
            // not to use a lock Object that hold references.
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
            Object target = callback.Target;
            _callbackTarget = (target != null)? new WeakReference(target) : ViewManager.StaticWeakRef; 
        } 
    }

    public boolean IsSynchronized
    {
        get { return _context != null || _callbackMethod != null; }
    } 

    public void AccessCollection(IEnumerable collection, Action accessMethod, boolean writeAccess) 
    { 
        if (_callbackMethod != null)
        { 
            // make sure the callback's target is still available
            Object target = _callbackTarget.Target;
            if (target == null)
                throw new InvalidOperationException(/*SR.Get(SRID.CollectionView_MissingSynchronizationCallback, collection)*/); 

            // invoke the callback 
            if (_callbackTarget == ViewManager.StaticWeakRef) 
                target = null;          // static method

            WeakReference wrContext = _context as WeakReference;
            Object context = (wrContext != null)? wrContext.Target : _context;
            _callbackMethod.Invoke(target, new Object[]{collection, context, accessMethod, writeAccess});
        } 
        else if (_context != null)
        { 
            /*lock*/synchronized(_context) 
            {
                accessMethod(); 
            }
        }
        else
        { 
            accessMethod();
        } 
    } 

    public boolean IsAlive 
    {
        get
        {
            return (_callbackMethod != null && _callbackTarget.IsAlive) || 
                    (_callbackMethod == null && _context != null);
        } 
    } 


    public static final SynchronizationInfo None = new SynchronizationInfo(null, null);

    Object _context;
    MethodInfo _callbackMethod; 
    WeakReference _callbackTarget;

} 