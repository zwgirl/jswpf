package org.summer.view.widget.internal;
/*internal*/ public enum SynchronizedInputStates
{ 
    NoOpportunity  ,//= 0x01, 
    HadOpportunity ,//= 0x02,
    Handled        ,//= 0x04, 
    Discarded      ,//= 0x08
};