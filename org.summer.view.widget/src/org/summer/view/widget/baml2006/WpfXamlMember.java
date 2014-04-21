package org.summer.view.widget.baml2006;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.markup.XamlReader;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MemberInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.xaml.XamlMember;
import org.summer.view.widget.xaml.XamlSchemaContext;
import org.summer.view.widget.xaml.XamlType;
import org.summer.view.widget.xaml.schema.XamlMemberInvoker;
import org.summer.view.widget.xaml.schema.XamlValueConverter;

/*internal*/ public class WpfXamlMember extends XamlMember implements IProvideValueTarget 
{
//    [Flags]
    /*private*/ enum BoolMemberBits
    { 
        UseV3Rules = 0x0001,
        BamlMember = 0x0002, 
        UnderlyingMemberIsKnown = 0x0004, 
        ApplyGetterFallback = 0x0008,
    } 

    public WpfXamlMember(DependencyProperty dp, boolean isAttachable)
    { 
        super(dp.Name,
                /*System.Windows.Markup.*/XamlReader.BamlSharedSchemaContext.GetXamlType(dp.OwnerType), 
                isAttachable);
        DependencyProperty = dp; 
        _useV3Rules = true;
        _isBamlMember = true; 
        _underlyingMemberIsKnown = false;
    }

    public WpfXamlMember(RoutedEvent re, boolean isAttachable) 
    {
        super(re.Name,
                System.Windows.Markup.XamlReader.BamlSharedSchemaContext.GetXamlType(re.OwnerType), 
                isAttachable) ;
        RoutedEvent = re; 
        _useV3Rules = true;
        _isBamlMember = true;
        _underlyingMemberIsKnown = false;
    } 

    public WpfXamlMember(DependencyProperty dp, 
        MethodInfo getter, 
        MethodInfo setter,
        XamlSchemaContext schemaContext, 
        boolean useV3Rules)
    {
        super(dp.Name, getter, setter, schemaContext);
        DependencyProperty = dp; 
        _useV3Rules = useV3Rules;
        _underlyingMemberIsKnown = true; 
    } 

    public WpfXamlMember(DependencyProperty dp, 
        PropertyInfo property,
        XamlSchemaContext schemaContext,
        boolean useV3Rules)
    {
        super (property, schemaContext) ;
        DependencyProperty = dp; 
        _useV3Rules = useV3Rules; 
        _underlyingMemberIsKnown = true;
    } 

    public WpfXamlMember(RoutedEvent re,
        MethodInfo setter,
        XamlSchemaContext schemaContext, 
        boolean useV3Rules)
    { 
    	super(re.Name, setter, schemaContext) ;
        RoutedEvent = re;
        _useV3Rules = useV3Rules; 
        _underlyingMemberIsKnown = true;
    }

    public WpfXamlMember(RoutedEvent re, 
        EventInfo eventInfo,
        XamlSchemaContext schemaContext, 
        boolean useV3Rules) 
    { 
    	 super(eventInfo, schemaContext);
        RoutedEvent = re;
        _useV3Rules = useV3Rules;
        _underlyingMemberIsKnown = true;
    } 

    // Protected ctor that is called by WpfKnownMember for known properties that aren't DPs 
    protected WpfXamlMember(String name, XamlType declaringType, boolean isAttachable) 
    { 
    	 super(name, declaringType, isAttachable);
        _useV3Rules = true;
        _isBamlMember = true;
        _underlyingMemberIsKnown = false;
    } 

    public DependencyProperty DependencyProperty { get; set; } 
    public RoutedEvent RoutedEvent { get; set; } 

    /*internal*/ public boolean ApplyGetterFallback 
    {
        get { return WpfXamlType.GetFlag(ref _bitField, (byte)BoolMemberBits.ApplyGetterFallback); }
        private set { WpfXamlType.SetFlag(ref _bitField, (byte)BoolMemberBits.ApplyGetterFallback, value); }
    } 

    // v3 parser had a fallback for retrieved DP content properties. If the DP was null, it would 
    // call the CLR property getter, in case the property was lazily initialized. If necessary, 
    // we return a version of this property with the fallback logic.
    /*internal*/ public WpfXamlMember AsContentProperty 
    {
        get
        {
            if (_asContentProperty == null) 
            {
                _asContentProperty = GetAsContentProperty(); 
            } 
            return _asContentProperty;
        } 
    }

    protected /*virtual*/ WpfXamlMember GetAsContentProperty()
    { 
        if (DependencyProperty == null)
        { 
            // Not a DP, no fallback needed 
            return this;
        } 
        Debug.Assert(!IsAttachable && !IsEvent);
        WpfXamlMember result = null;
        if (_underlyingMemberIsKnown)
        { 
            PropertyInfo underlyingProperty = UnderlyingMember as PropertyInfo;
            if (underlyingProperty == null) 
            { 
                // No underlying CLR property, no fallback needed
                return this; 
            }
            result = new WpfXamlMember(DependencyProperty, underlyingProperty, DeclaringType.SchemaContext, _useV3Rules);
        }
        else 
        {
            result = new WpfXamlMember(DependencyProperty, false /*isAttachable*/); 
        } 
        result.ApplyGetterFallback = true;
        return result; 
    }

    protected /*override*/ XamlType LookupType()
    { 
        if (DependencyProperty != null)
        { 
            if (_isBamlMember) 
            {
                return System.Windows.Markup.XamlReader.BamlSharedSchemaContext.GetXamlType(DependencyProperty.PropertyType); 
            }
            else
            {
                return System.Windows.Markup.XamlReader.GetWpfSchemaContext().GetXamlType(DependencyProperty.PropertyType); 
            }
        } 
        else if (RoutedEvent != null) 
        {
            if (_isBamlMember) 
            {
                return System.Windows.Markup.XamlReader.BamlSharedSchemaContext.GetXamlType(RoutedEvent.HandlerType);
            }
            else 
            {
                return System.Windows.Markup.XamlReader.GetWpfSchemaContext().GetXamlType(RoutedEvent.HandlerType); 
            } 
        }
        else 
        {
            return base.LookupType();
        }
    } 

    protected /*override*/ MemberInfo LookupUnderlyingMember() 
    { 
        MemberInfo member = base.LookupUnderlyingMember();
        if (member == null) 
        {
            if (BaseUnderlyingMember != null)
            {
                member = BaseUnderlyingMember.UnderlyingMember; 
            }
        } 
        _underlyingMemberIsKnown = true; 
        return member;
    } 

    protected /*override*/ MethodInfo LookupUnderlyingSetter()
    {
        // Want to look up the base's UnderlyingSetter in case it's already there 
        MethodInfo setter = base.LookupUnderlyingSetter();
        if (setter == null) 
        { 
            if (BaseUnderlyingMember != null)
            { 
                setter = BaseUnderlyingMember.Invoker.UnderlyingSetter;
            }
        }
        _underlyingMemberIsKnown = true; 
        return setter;
    } 

    protected /*override*/ MethodInfo LookupUnderlyingGetter()
    { 
        // Want to look up the base's UnderlyingSetter in case it's already there
        MethodInfo getter = base.LookupUnderlyingGetter();
        if (getter == null)
        { 
            if (BaseUnderlyingMember != null)
            { 
                getter = BaseUnderlyingMember.Invoker.UnderlyingGetter; 
            }
        } 
        _underlyingMemberIsKnown = true;
        return getter;
    }

    protected /*override*/ boolean LookupIsReadOnly()
    { 
        if (DependencyProperty != null) 
        {
            return DependencyProperty.ReadOnly; 
        }
        return base.LookupIsReadOnly();
    }

    protected /*override*/ boolean LookupIsEvent()
    { 
        if (RoutedEvent != null) 
        {
            return true; 
        }
        return false;
    }

    protected /*override*/ XamlMemberInvoker LookupInvoker()
    { 
        return new WpfMemberInvoker(this); 
    }

    protected /*override*/ boolean LookupIsUnknown()
    {
        return false;
    } 

    // The Markup compiler doesn't support XamlDeferringLoader so we don't need to look it up in BAML scenarios. 
    protected /*override*/ XamlValueConverter<XamlDeferringLoader>  LookupDeferringLoader() 
    {
        if (_useV3Rules) 
        {
            return null;
        }
        else 
        {
            return base.LookupDeferringLoader(); 
        } 
    }

    private boolean _useV3Rules
    {
        get { return WpfXamlType.GetFlag(ref _bitField, (byte)BoolMemberBits.UseV3Rules); }
        set { WpfXamlType.SetFlag(ref _bitField, (byte)BoolMemberBits.UseV3Rules, value); } 
    }
    private boolean _isBamlMember 
    { 
        get { return WpfXamlType.GetFlag(ref _bitField, (byte)BoolMemberBits.BamlMember); }
        set { WpfXamlType.SetFlag(ref _bitField, (byte)BoolMemberBits.BamlMember, value); } 
    }
    private boolean _underlyingMemberIsKnown
    {
        get { return WpfXamlType.GetFlag(ref _bitField, (byte)BoolMemberBits.UnderlyingMemberIsKnown); } 
        set { WpfXamlType.SetFlag(ref _bitField, (byte)BoolMemberBits.UnderlyingMemberIsKnown, value); }
    } 

//    #region IProvideValueTarget Members

    Object /*System.Windows.Markup.IProvideValueTarget.*/TargetObject
    {
        get { throw new NotSupportedException(); }
    } 

    Object /*System.Windows.Markup.IProvideValueTarget.*/TargetProperty 
    { 
        get
        { 
            if (DependencyProperty != null)
            {
                return DependencyProperty;
            } 
            else
            { 
                return UnderlyingMember; 
            }
        } 
    }

//    #endregion

    private XamlMember BaseUnderlyingMember
    { 
        get 
        {
            if (_baseUnderlyingMember == null) 
            {
                WpfXamlType wpfXType = DeclaringType as WpfXamlType;

                _baseUnderlyingMember = wpfXType.FindBaseXamlMember(Name, IsAttachable); 

                if (_baseUnderlyingMember == null) 
                { 
                    // Find the attached or regular property
                    _baseUnderlyingMember = wpfXType.FindBaseXamlMember(Name, !IsAttachable); 
                }

            }

            return _baseUnderlyingMember;
        } 
    } 

    private byte _bitField; 
    private XamlMember _baseUnderlyingMember;
    private WpfXamlMember _asContentProperty;
}