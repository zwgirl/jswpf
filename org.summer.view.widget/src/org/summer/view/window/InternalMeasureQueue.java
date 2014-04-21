package org.summer.view.window;

import org.summer.view.widget.UIElement;
import org.summer.view.window.ContextLayoutManager.LayoutQueue;
import org.summer.view.window.ContextLayoutManager.LayoutQueue.Request;

/*internal*/public class InternalMeasureQueue extends  LayoutQueue
{ 
    /*internal*/ public /*override*/ void setRequest(UIElement e, Request r)
    {
        e.MeasureRequest = r;
    } 

    /*internal*/ public /*override*/ Request getRequest(UIElement e) 
    { 
        return e.MeasureRequest;
    } 

    /*internal*/ public /*override*/ boolean canRelyOnParentRecalc(UIElement parent)
    {
        return !parent.IsMeasureValid 
            && !parent.MeasureInProgress; //if parent's measure is in progress, we might have passed this child already
    } 

    /*internal*/ public /*override*/ void invalidate(UIElement e)
    { 
        e.InvalidateMeasureInternal();
    }

}