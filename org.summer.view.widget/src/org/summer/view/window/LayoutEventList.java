package org.summer.view.window;
/*internal*/public class LayoutEventList 
    {
        //size of the pre-allocated free list
        private /*const*/ static final int PocketCapacity = 153;
 
        /*internal*/  class ListItem extends  WeakReference
        { 
            /*internal*/ public ListItem()
            {
            	super(null) ;
            	
            } 
            /*internal*/ public ListItem Next;
            /*internal*/ public ListItem Prev; 
            /*internal*/ public boolean     InUse;
        }

        /*internal*/ public LayoutEventList() 
        {
            ListItem t; 
            for(int i=0; i<PocketCapacity; i++) 
            {
                t = new ListItem(); 
                t.Next = _pocket;
                _pocket = t;
            }
            _pocketSize = PocketCapacity; 
        }
 
        /*internal*/ public ListItem Add(Object target) 
        {
            ListItem t = getNewListItem(target); 

            t.Next = _head;
            if(_head != null) _head.Prev = t;
            _head = t; 

           _count++; 
            return t; 
        }
 
        /*internal*/ public void Remove(ListItem t)
        {
            //already removed item can be passed again
            //(once removed by handler and then by firing code) 
            if(!t.InUse) return;
 
            if(t.Prev == null) _head = t.Next; 
            else t.Prev.Next = t.Next;
 
            if(t.Next != null) t.Next.Prev = t.Prev;

            reuseListItem(t);
            _count--; 
        }
 
        private ListItem getNewListItem(Object target) 
        {
            ListItem t; 
            if(_pocket != null)
            {
                t = _pocket;
                _pocket = t.Next; 
                _pocketSize--;
                t.Next = t.Prev = null; 
            } 
            else
            { 
                t = new ListItem();
            }

            t.Target = target; 
            t.InUse = true;
            return t; 
        } 

        private void reuseListItem(ListItem t) 
        {
            t.Target = null; //let target die
            t.Next = t.Prev = null;
            t.InUse = false; 

            if (_pocketSize < PocketCapacity) 
            { 
                t.Next = _pocket;
                _pocket = t; 
                _pocketSize++;
            }
        }
 
        /*internal*/ public ListItem[] CopyToArray()
        { 
            ListItem [] copy = new ListItem[_count]; 
            ListItem t = _head;
            int cnt = 0; 
            while(t != null)
            {
                copy[cnt++] = t;
                t = t.Next; 
            }
            return copy; 
        } 

        /*internal*/ public int Count 
        {
            get
            {
                return _count; 
            }
        } 
 
        private ListItem _head;
        private ListItem _pocket; 
        private int      _pocketSize;
        private int      _count;
    }