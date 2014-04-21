package org.summer.view.widget.baml2006;

/*internal*/public class OptimizedStaticResource 
{
    public OptimizedStaticResource(byte flags, short keyId)
    {
        _isType = (flags & TypeExtensionValueMask) != 0; 
        _isStatic = (flags & StaticExtensionValueMask) != 0;

        KeyId = keyId; 
    }

    public short KeyId { get; set; }

    public Object KeyValue { get; set; }

    public boolean IsKeyStaticExtension
    { 
        get { return _isStatic; } 
    }
    public boolean IsKeyTypeExtension 
    {
        get { return _isType; }
    }

    private boolean _isStatic;
    private boolean _isType; 

    private static final byte TypeExtensionValueMask = 0x01;
    private static final byte StaticExtensionValueMask = 0x02; 
}