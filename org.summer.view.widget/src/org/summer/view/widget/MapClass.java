package org.summer.view.widget;
// this class is used to wrap the Map struct into an Object so
// that we can use it with the UncommonField infrastructure. 
/*internal*/ class MapClass
{ 
    /*internal*/ MapClass() 
    {
        _map_ofBrushes = new DUCE.Map<boolean>(); 
    }

    /*internal*/ boolean IsEmpty
    { 
        get
        { 
            return _map_ofBrushes.IsEmpty(); 
        }
    } 

    public DUCE.Map<boolean> _map_ofBrushes;
}
