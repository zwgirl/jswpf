package org.summer.view.widget;

import org.summer.view.widget.collection.FrugalStructList;
// 
//  Disable warnings about fields never being assigned to. The structs in this
//  section are designed to function with its fields starting at their default
//  values and without the need of surfacing a constructor other than the default.
// 

// 
//  Stores a list of all those properties that need to be invalidated whenever 
//  a trigger driver property is invalidated on the source node.
// 
/*internal*/ public  class TriggerSourceRecord
{
    public FrugalStructList<ChildPropertyDependent> ChildPropertyDependents;
} 