package org.summer.view.widget;
/*internal*/ public class SingleChildEnumerator implements IEnumerator 
{
    /*internal*/ public SingleChildEnumerator(Object Child)
    {
        _child = Child; 
        _count = Child == null ? 0 : 1;
    } 

    Object IEnumerator.Current
    { 
        get { return (_index == 0) ? _child : null; }
    }

    boolean IEnumerator.MoveNext() 
    {
        _index++; 
        return _index < _count; 
    }

    void IEnumerator.Reset()
    {
        _index = -1;
    } 

    private int _index = -1; 
    private int _count = 0; 
    private Object _child;
}