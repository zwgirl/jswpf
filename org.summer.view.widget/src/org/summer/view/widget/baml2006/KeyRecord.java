package org.summer.view.widget.baml2006;

import org.summer.view.widget.Type;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.xaml.XamlNodeList;
import org.summer.view.widget.xaml.XamlSchemaContext;
import org.summer.view.widget.xaml.XamlType;

//[DebuggerDisplay("{DebuggerString}")] 
/*internal*/ public class KeyRecord
{
    public KeyRecord(boolean shared, boolean sharedSet, int valuePosition, Type keyType)         
    {
    	this(shared, sharedSet, valuePosition);
        _data = keyType; 
    } 

    public KeyRecord(boolean shared, boolean sharedSet, int valuePosition, String keyString) 
    {
    	this(shared, sharedSet, valuePosition);
        _data = keyString;
    } 

    public KeyRecord(boolean shared, boolean sharedSet, int valuePosition, XamlSchemaContext context)
    {
        this(shared, sharedSet, valuePosition) ;
        _data = new XamlNodeList(context, 8); 
    }

    private KeyRecord(boolean shared, boolean sharedSet, int valuePosition)
    { 
        _shared = shared;
        _sharedSet = sharedSet; 
        ValuePosition = valuePosition; 
    }

    public boolean Shared { get { return _shared; } }
    public boolean SharedSet { get { return _sharedSet; } }
    public long ValuePosition { get; set; }
    public int ValueSize { get; set; } 
    public byte Flags { get; set; }

    // This can either be a StaticResource or an OptimizedStaticResource 
    // Since they don't share anything in common, we've made this a list of objects.
    public List<Object> StaticResources 
    {
        get
        {
            if (_resources == null) 
            {
                _resources = new List<Object>(); 
            } 

            return _resources; 
        }
    }

    public boolean HasStaticResources 
    {
        get { return (_resources != null && _resources.Count > 0); } 
    } 

    public StaticResource LastStaticResource 
    {
        get
        {
            Debug.Assert(StaticResources[StaticResources.Count - 1] is StaticResource); 
            return StaticResources[StaticResources.Count - 1] as StaticResource;
        } 
    } 

    public String KeyString 
    {
        get { return _data as String; }
    }

    public Type KeyType
    { 
        get { return _data as Type; } 
    }

    public XamlNodeList KeyNodeList
    {
        get
        { 
            return _data as XamlNodeList;
        } 
    } 

    private List<Object> _resources; 
    private Object _data;
    boolean _shared;
    boolean _sharedSet;
} 


