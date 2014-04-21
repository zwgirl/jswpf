package org.summer.view.widget.data;

import org.summer.view.widget.Type;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.threading.Dispatcher;

/*internal*/ public /*sealed*/ class AccessorTable
{ 
    /*internal*/ public AccessorTable() 
    {
    } 

    // map (SourceValueType, type, name) to (accessor, propertyType, args)
    /*internal*/ public AccessorInfo this[SourceValueType sourceValueType, Type type, String name]
    { 
        get
        { 
            if (type == null || name == null) 
                return null;

            AccessorInfo info = (AccessorInfo)_table[new AccessorTableKey(sourceValueType, type, name)];

            if (info != null)
            { 
//#if DEBUG
//                // record the age of cache hits 
//                int age = _generation - info.Generation; 
//
//                if (age >= _ages.Length) 
//                {
//                    int[] newAges = new int[2*age];
//                    _ages.CopyTo(newAges, 0);
//                    _ages = newAges; 
//                }
//
//                ++ _ages[age]; 
//                ++ _hits;
//#endif 
                info.Generation = _generation;
            }
//#if DEBUG
//            else 
//            {
//                ++ _misses; 
//            } 
//#endif
            return info; 
        }
        set
        {
            if (type != null && name != null) 
            {
                value.Generation = _generation; 
                _table[new AccessorTableKey(sourceValueType, type, name)] = value; 

                if (!_cleanupRequested) 
                    RequestCleanup();
            }
        }
    } 

    // request a cleanup pass 
    private void RequestCleanup() 
    {
        _cleanupRequested = true; 
        Dispatcher.CurrentDispatcher.BeginInvoke(DispatcherPriority.ContextIdle, new DispatcherOperationCallback(CleanupOperation), null);
    }

    // run a cleanup pass 
    private Object CleanupOperation(Object arg)
    { 
        // find entries that are sufficiently old 
        Object[] keysToRemove = new Object[_table.Count];
        int n = 0; 
        IDictionaryEnumerator ide = _table.GetEnumerator();
        while (ide.MoveNext())
        {
            AccessorInfo info = (AccessorInfo)ide.Value; 
            int age = _generation - info.Generation;
            if (age >= AgeLimit) 
            { 
                keysToRemove[n++] = ide.Key;
            } 
        }

//#if DEBUG
//        if (_traceSize) 
//        {
//            Console.WriteLine("After generation {0}, removing {1} of {2} entries from AccessorTable, new count is {3}", 
//                _generation, n, _table.Count, _table.Count - n); 
//        }
//#endif 

        // remove those entries
        for (int i=0; i<n; ++i)
        { 
            _table.Remove(keysToRemove[i]);
        } 

        ++ _generation;

        _cleanupRequested = false;
        return null;
    }

    // print data about how the cache behaved
    /*internal*/ public void PrintStats() 
    { 
//#if DEBUG
//        if (_generation == 0 || _hits == 0) 
//        {
//            Console.WriteLine("No stats available for AccessorTable.");
//            return;
//        } 
//
//        Console.WriteLine("AccessorTable had {0} hits, {1} misses ({2,2}%) in {3} generations.", 
//                    _hits, _misses, (100*_hits)/(_hits+_misses), _generation); 
//        Console.WriteLine("  Age   Hits   Pct   ----");
//        int cumulativeHits = 0; 
//        for (int i=0; i<_ages.Length; ++i)
//        {
//            if (_ages[i] > 0)
//            { 
//                cumulativeHits += _ages[i];
//                Console.WriteLine("{0,5} {1,6} {2,5} {3,5}", 
//                                i, _ages[i], 100*_ages[i]/_hits, 100*cumulativeHits/_hits); 
//            }
//        } 
//#endif
    }

    /*internal*/ public boolean TraceSize 
    {
        get { return _traceSize; } 
        set { _traceSize = value; } 
    }

    private /*const*/static final int   AgeLimit = 10;      // entries older than this get removed.

    private Hashtable   _table = new Hashtable();
    private int         _generation; 
    private boolean        _cleanupRequested;
    boolean                _traceSize; 
//#if DEBUG 
//    private int[]       _ages = new int[10];
//    private int         _hits, _misses; 
//#endif

    private class AccessorTableKey
    { 
        public AccessorTableKey(SourceValueType sourceValueType, Type type, String name)
        { 
//            Invariant.Assert(type != null && type != null); 

            _sourceValueType = sourceValueType; 
            _type = type;
            _name = name;
        }

        public /*override*/ boolean Equals(Object o)
        { 
            if (o instanceof AccessorTableKey) 
                return this == (AccessorTableKey)o;
            else 
                return false;
        }

        public static boolean operator==(AccessorTableKey k1, AccessorTableKey k2) 
        {
            return  k1._sourceValueType == k2._sourceValueType 
                &&  k1._type == k2._type 
                &&  k1._name == k2._name;
        } 

        public static boolean operator!=(AccessorTableKey k1, AccessorTableKey k2)
        {
            return !(k1 == k2); 
        }

        public /*override*/ int GetHashCode() 
        {
            return unchecked(_type.GetHashCode() + _name.GetHashCode()); 
        }

        SourceValueType _sourceValueType;
        Type            _type; 
        String          _name;
    } 
} 