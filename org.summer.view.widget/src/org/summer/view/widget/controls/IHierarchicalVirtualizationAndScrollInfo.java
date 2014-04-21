package org.summer.view.widget.controls;


public interface IHierarchicalVirtualizationAndScrollInfo {

    HierarchicalVirtualizationConstraints Constraints 
    {
        get;
    } 

    HierarchicalVirtualizationHeaderDesiredSizes HeaderDesiredSizes
    { 
        get;
    }

    HierarchicalVirtualizationItemDesiredSizes ItemDesiredSizes
    {
        get;
    }

    Panel ItemsHost 
    {
        get;
    }

    boolean MustDisableVirtualization
    { 
        get;
    } 

    boolean InBackgroundLayout 
    {
        get ;
    } 
}
