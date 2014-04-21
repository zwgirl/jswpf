package org.summer.view.widget;
// 
// This struct represents a list of actions associated with a trigger whose
//  conditions have fired but could not execute immediately.  The original 
//  motivation is to address the scenario where the actions want to manipulate 
//  the templated children but the template expansion hasn't happened yet.
// 
/*internal*/ public  class DeferredAction
{
    /*internal*/ public  TriggerBase TriggerBase;
    /*internal*/ public  TriggerActionCollection TriggerActionCollection; 
}