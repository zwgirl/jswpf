package org.summer.view.widget.utils;
// These classes implement a frugal storage model for key/value pair data
    // structures. The keys are integers, and the values objects.
    // Performance measurements show that Avalon has many maps that contain a
    // single key/value pair. Therefore these classes are structured to prefer
    // a map that contains a single key/value pair and uses a conservative
    // growth strategy to minimize the steady state memory footprint. To enforce
    // the slow growth the map does not allow the user to set the capacity.
    // Also note that the map uses one fewer objects than the BCL HashTable and
    // does no allocations at all until an item is inserted into the map.
    //
    // The code is also structured to perform well from a CPU standpoint. Perf
    // analysis of DependencyObject showed that we used a single entry 63% of
    // the time and growth tailed off quickly. Average access times are 8 to 16
    // times faster than a BCL Hashtable.
    //
    // FrugalMap is appropriate for small maps or maps that grow slowly. Its
    // primary focus is for maps that contain fewer than 64 entries and that
    // usually start with no entries, or a single entry. If you know your map
    // will always have a minimum of 64 or more entires FrugalMap *may* not
    // be the best choice. Choose your collections wisely and pay particular
    // attention to the growth patterns and search methods.
 
    // This enum controls the growth to successively more complex storage models
    /*internal*/ enum FrugalMapStoreState
    {
        Success,
        ThreeObjectMap,
        SixObjectMap,
        Array,
        SortedArray,
        Hashtable
    }
 
    /// <summary>
    ///     FrugalMapIterationCallback
    /// </summary>
    internal delegate void FrugalMapIterationCallback(ArrayList list, int key, object value);