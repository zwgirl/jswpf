package org.summer.view.widget;

import org.summer.view.widget.collection.FrugalStructList;

// 
//  Each Binding that appears in a condition of a data trigger has
//  supporting information that appears in this record. 
//
/*internal*/ public  class DataTriggerRecord
{
    public FrugalStructList<ChildPropertyDependent> Dependents = new FrugalStructList<ChildPropertyDependent>(); 
}