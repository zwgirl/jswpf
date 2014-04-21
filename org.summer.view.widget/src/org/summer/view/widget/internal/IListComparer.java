package org.summer.view.widget.internal;

import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.IComparer;
//    #region Internal Types

    // this comparer is used to insert an item into a group in a position consistent
    // with a given IList.  It only works when used in the pattern that FindIndex 
    // uses, namely first call Reset(), then call Compare(item, x) any number of
    // times with the same item (the new item) as the first argument, and a sequence 
    // of x's as the second argument that appear in the IList in the same sequence. 
    // This makes the total search time linear in the size of the IList.  (To give
    // the correct answer regardless of the sequence of arguments would involve 
    // calling IndexOf and leads to O(N^2) total search time.)

    /*internal*/public class IListComparer implements IComparer
    { 
        /*internal*/ public IListComparer(IList list)
        { 
            ResetList(list); 
        }

        /*internal*/public void Reset()
        {
            _index = 0;
        } 

        /*internal*/public void ResetList(IList list) 
        { 
            _list = list;
            _index = 0; 
        }

        public int Compare(Object x, Object y)
        { 
            if (Object.Equals(x, y))
                return 0; 

            // advance the index until seeing one x or y
            int n = (_list != null) ? _list.Count : 0; 
            for (; _index < n; ++_index)
            {
                Object z = _list[_index];
                if (Object.Equals(x, z)) 
                {
                    return -1;  // x occurs first, so x < y 
                } 
                else if (Object.Equals(y, z))
                { 
                    return +1;  // y occurs first, so x > y
                }
            }

            // if we don't see either x or y, declare x > y.
            // This has the effect of putting x at the end of the list. 
            return + 1; 
        }

        int _index;
        IList _list;
    }
