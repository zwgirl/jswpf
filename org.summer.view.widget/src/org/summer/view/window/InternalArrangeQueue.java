package org.summer.view.window;
/*internal*/public class InternalArrangeQueue extends  LayoutQueue 
{
    /*internal*/ public /*override*/ void setRequest(UIElement e, Request r) 
    {
        e.ArrangeRequest = r;
    }

    /*internal*/ public /*override*/ Request getRequest(UIElement e)
    { 
        return e.ArrangeRequest; 
    }

    /*internal*/ public /*override*/ boolean canRelyOnParentRecalc(UIElement parent)
    {
        return !parent.IsArrangeValid
            && !parent.ArrangeInProgress; //if parent's arrange is in progress, we might have passed this child already 
    }

    /*internal*/ public /*override*/ void invalidate(UIElement e) 
    {
        e.InvalidateArrangeInternal(); 
    }

}