package org.summer.view.widget.utils;
// These classes implement a frugal storage model for lists of <t>.
    // Performance measurements show that many lists contain a single item.
    // Therefore this list is structured to prefer a list that contains a single
    // item, and does conservative growth to minimize the memory footprint.
 
    // This enum controls the growth to successively more complex storage models
 public   enum FrugalListStoreState
    {
        Success,
        SingleItemList,
        ThreeItemList,
        SixItemList,
        Array
    }
