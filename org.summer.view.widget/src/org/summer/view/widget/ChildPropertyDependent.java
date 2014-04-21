package org.summer.view.widget;
//
//  Each item in the ChildPropertyDependents list and the ResourceDependents 
//  list is of this type.
//
//  PERF: Name is used only when storing a ResourceDependent.
//       Listener is used only when a Trigger has an invalidation listener 
//  Both are relatively rare.  Is there an optimization here?
/*internal*/ public  class ChildPropertyDependent 
{ 
    public int                          ChildIndex;
    public DependencyProperty           Property; 
    public Object                       Name; // When storing ResourceDependent, the name of the resource.
}