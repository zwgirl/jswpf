package org.summer.view.window;

import org.summer.view.widget.UIElement;
import org.summer.view.widget.Visibility;

/*internal*/public abstract class LayoutQueue 
{

    //size of the pre-allocated free list
    private /*const*/static final int PocketCapacity = 153; 
    //when this many elements remain in the free list,
    //queue will switch to invalidating up and adding only the root 
    private /*const*/ static final int PocketReserve = 8; 

    /*internal*/ public abstract Request getRequest(UIElement e); 
    /*internal*/ public abstract void setRequest(UIElement e, Request r);
    /*internal*/ public abstract boolean canRelyOnParentRecalc(UIElement parent);
    /*internal*/ public abstract void invalidate(UIElement e);

    /*internal*/ public class Request
    { 
        /*internal*/ public UIElement Target; 
        /*internal*/ public Request Next;
        /*internal*/ public Request Prev; 
    }

    /*internal*/ public LayoutQueue()
    { 
        Request r;
        for(int i=0; i<PocketCapacity; i++) 
        { 
            r = new Request();
            r.Next = _pocket; 
            _pocket = r;
        }
        _pocketSize = PocketCapacity;
    } 

    private void _addRequest(UIElement e) 
    { 
        Request r = _getNewRequest(e);

        if(r != null)
        {
            r.Next = _head;
            if(_head != null) _head.Prev = r; 
            _head = r;

            setRequest(e, r); 
        }
    } 

    /*internal*/ public void Add(UIElement e)
    {
        if(getRequest(e) != null) return; 
        if(e.CheckFlagsAnd(VisualFlags.IsLayoutSuspended)) return;

        RemoveOrphans(e); 

        UIElement parent = e.GetUIParentWithinLayoutIsland(); 
        if(parent != null && canRelyOnParentRecalc(parent)) return;

        ContextLayoutManager layoutManager = ContextLayoutManager.From(e.Dispatcher);

        if(layoutManager._isDead) return;

        //10 is arbitrary number here, simply indicates the queue is 
        //about to be filled. If not queue is not almost full, simply add
        //the element to it. If it is almost full, start conserve entries 
        //by escalating invalidation to all the ancestors until the top of
        //the visual tree, and only add root of visula tree to the queue.
        if(_pocketSize > PocketReserve)
        { 
            _addRequest(e);
        } 
        else 
        {
            //walk up until we are the topmost UIElement in the tree. 
            //on each step, mark the parent dirty and remove it from the queues
            //only leave a single node in the queue - the root of visual tree
            while(e != null)
            { 
                UIElement p = e.GetUIParentWithinLayoutIsland();

                invalidate(e); //invalidate in any case 

                if (p != null && p.Visibility != Visibility.Collapsed) //not yet a root or a collapsed node 
                {
                    Remove(e);
                }
                else //root of visual tree or a collapsed node 
                {
                    if (getRequest(e) == null) 
                    { 
                        RemoveOrphans(e);
                        _addRequest(e); 
                    }
                }
                e = p;
            } 
        }

        layoutManager.NeedsRecalc(); 
    }

    /*internal*/ public void Remove(UIElement e)
    {
        Request r = getRequest(e);
        if(r == null) return; 
        _removeRequest(r);
        setRequest(e, null); 
    } 

    /*internal*/ public void RemoveOrphans(UIElement parent) 
    {
        Request r = _head;
        while(r != null)
        { 
            UIElement child = r.Target;
            Request next = r.Next; 
            ulong parentTreeLevel = parent.TreeLevel; 

            if(   (child.TreeLevel == parentTreeLevel + 1) 
               && (child.GetUIParentWithinLayoutIsland() == parent))
            {
                _removeRequest(getRequest(child));
                setRequest(child, null); 
            }

            r = next; 
        }
    } 

    /*internal*/ public boolean IsEmpty { get { return (_head == null); }}

    /*internal*/ public UIElement GetTopMost() 
    {
        UIElement found = null; 
        ulong treeLevel = ulong.MaxValue; 

        for(Request r = _head; r != null; r = r.Next) 
        {
            UIElement t = r.Target;
            ulong l = t.TreeLevel;

            if(l < treeLevel)
            { 
                treeLevel = l; 
                found = r.Target;
            } 
        }

        return found;
    } 

    private void _removeRequest(Request entry) 
    { 
        if(entry.Prev == null) _head = entry.Next;
        else entry.Prev.Next = entry.Next; 

        if(entry.Next != null) entry.Next.Prev = entry.Prev;

        ReuseRequest(entry); 
    }

    private Request _getNewRequest(UIElement e) 
    {
        Request r; 
        if(_pocket != null)
        {
            r = _pocket;
            _pocket = r.Next; 
            _pocketSize--;
            r.Next = r.Prev = null; 
        } 
        else
        { 
            ContextLayoutManager lm = ContextLayoutManager.From(e.Dispatcher);
            try
            {
                r = new Request(); 
            }
            catch(/*System.*/OutOfMemoryException ex) 
            { 
                if(lm != null)
                    lm.setForceLayout(e); 
                throw ex;
            }
        }

        r.Target = e;
        return r; 
    } 

    private void ReuseRequest(Request r) 
    {
        r.Target = null; //let target die

        if (_pocketSize < PocketCapacity) 
        {
            r.Next = _pocket; 
            _pocket = r; 
            _pocketSize++;
        } 
    }

    private Request _head;
    private Request _pocket; 
    private int     _pocketSize;
} 