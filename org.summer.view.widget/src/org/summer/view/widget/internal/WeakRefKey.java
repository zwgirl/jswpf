package org.summer.view.widget.internal;
// for use as the key to a hashtable, when the "real" key is an Object 
    // that we should not keep alive by a strong reference.
    /*internal*/ class WeakRefKey 
    {
        //-----------------------------------------------------
        //
        //  Constructors 
        //
        //------------------------------------------------------ 
 
        /*internal*/ WeakRefKey(Object target)
        { 
            _weakRef = new WeakReference(target);
            _hashCode = (target != null) ? target.GetHashCode() : 314159;
        }
 
        //-----------------------------------------------------
        // 
        //  Internal Properties 
        //
        //------------------------------------------------------ 

        /*internal*/ Object Target
        {
            get { return _weakRef.Target; } 
        }
 
        //------------------------------------------------------ 
        //
        //  Public Methods 
        //
        //-----------------------------------------------------

        public /*override*/ int GetHashCode() 
        {
            return _hashCode; 
        } 

        public /*override*/ boolean Equals(Object o) 
        {
            if (o is WeakRefKey)
            {
                WeakRefKey ck = (WeakRefKey)o; 
                Object c1 = Target;
                Object c2 = ck.Target; 
 
                if (c1!=null && c2!=null)
                    return (c1 == c2); 
                else
                    return (_weakRef == ck._weakRef);
            }
            else 
            {
                return false; 
            } 
        }
 
        // overload operator for ==, to be same as Equal implementation.
        public static boolean operator ==(WeakRefKey left, WeakRefKey right)
        {
            if ((Object)left == null) 
                return (Object)right == null;
 
            return left.Equals(right); 
        }
 
        // overload operator for !=, to be same as Equal implementation.
        public static boolean operator !=(WeakRefKey left, WeakRefKey right)
        {
            return !(left == right); 
        }
 
        //------------------------------------------------------ 
        //
        //  Private Fields 
        //
        //-----------------------------------------------------

        WeakReference   _weakRef; 
        int             _hashCode;  // cache target's hashcode, lest it get GC'd out from under us
    } 
 
//#endregion WeakRefKey