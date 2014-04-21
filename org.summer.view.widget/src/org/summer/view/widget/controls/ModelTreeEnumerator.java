package org.summer.view.widget.controls;

import org.summer.view.widget.collection.IEnumerable;
 /*internal*/ public abstract class ModelTreeEnumerator implements IEnumerable
    {
        /*internal*/ public ModelTreeEnumerator(Object content) 
        {
            _content = content; 
        } 

//        #region IEnumerator 

//        Object IEnumerator.Current
//        {
//            get 
//            {
//                return this.Current; 
//            } 
//        }
 
//        boolean /*IEnumerator.*/MoveNext()
//        {
//            return this.MoveNext();
//        } 

//        void /*IEnumerator.*/Reset() 
//        { 
//            this.Reset();
//        } 

//        #endregion

//        #region Protected 

        protected Object Content 
        { 
            get
            { 
                return _content;
            }
        }
 
        protected int Index
        { 
            get 
            {
                return _index; 
            }

            set
            { 
                _index = value;
            } 
        } 

        protected /*virtual*/ Object Current 
        {
            get
            {
                // Don't VerifyUnchanged(); According to MSDN: 
                //     If the collection is modified between MoveNext and Current,
                //     Current will return the element that it is set to, even if 
                //     the enumerator is already invalidated. 

                if (_index == 0) 
                {
                    return _content;
                }
 
//#pragma warning disable 1634 // about to use PreSharp message numbers - unknown to C#
                // Fall through -- can't enumerate (before beginning or after end) 
//#pragma warning suppress 6503 
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorInvalidOperation));
                // above exception is part of the IEnumerator.Current contract when moving beyond begin/end 
//#pragma warning restore 1634
            }
        }
 
        protected /*virtual*/ boolean MoveNext()
        { 
            if (_index < 1) 
            {
                // Singular content, can move next to 0 and that's it. 
                _index++;

                if (_index == 0)
                { 
                    // don't call VerifyUnchanged if we're returning false anyway.
                    // This permits users to change the Content after enumerating 
                    // the content (e.g. in the invalidation callback of an inherited 
                    // property).  See bug 955389.
 
                    VerifyUnchanged();
                    return true;
                }
            } 

            return false; 
        } 

        protected /*virtual*/ void Reset() 
        {
            VerifyUnchanged();
            _index = -1;
        } 

        protected abstract boolean IsUnchanged 
        { 
            get;
        } 

        protected void VerifyUnchanged()
        {
            // If the content has changed, then throw an exception 
            if (!IsUnchanged)
            { 
                throw new InvalidOperationException(SR.Get(SRID.EnumeratorVersionChanged)); 
            }
        } 

//        #endregion

//        #region Data 

        private int _index = -1; 
        private Object _content; 

//        #endregion 
    }