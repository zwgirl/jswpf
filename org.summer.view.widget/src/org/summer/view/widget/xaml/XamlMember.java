package org.summer.view.widget.xaml;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.markup.ValueSerializer;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MemberInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.xaml.schema.XamlMemberInvoker;
import org.summer.view.widget.xaml.schema.XamlValueConverter;

public class XamlMember //implements IEquatable<XamlMember>
{
	public XamlMember (EventInfo eventInfo, XamlSchemaContext schemaContext)
	{
		this (eventInfo, schemaContext, null);
	}

	public XamlMember (EventInfo eventInfo, XamlSchemaContext schemaContext, XamlMemberInvoker invoker)
	{
		this (schemaContext, invoker);
		if (eventInfo == null)
			throw new ArgumentNullException ("eventInfo");
		Name = eventInfo.Name;
		underlying_member = eventInfo;
		DeclaringType = schemaContext.GetXamlType (eventInfo.DeclaringType);
		target_type = DeclaringType;
		UnderlyingSetter = eventInfo.GetAddMethod ();
		is_event = true;
	}

	public XamlMember (PropertyInfo propertyInfo, XamlSchemaContext schemaContext)
	{
		this (propertyInfo, schemaContext, null);
	}

	public XamlMember (PropertyInfo propertyInfo, XamlSchemaContext schemaContext, XamlMemberInvoker invoker)
	{
		this (schemaContext, invoker);
		if (propertyInfo == null)
			throw new ArgumentNullException ("propertyInfo");
		Name = propertyInfo.Name;
		underlying_member = propertyInfo;
		DeclaringType = schemaContext.GetXamlType (propertyInfo.DeclaringType);
		target_type = DeclaringType;
		UnderlyingGetter = propertyInfo.GetGetMethod (true);
		UnderlyingSetter = propertyInfo.GetSetMethod (true);
	}

	public XamlMember (String attachableEventName, MethodInfo adder, XamlSchemaContext schemaContext)
	{
		this (attachableEventName, adder, schemaContext, null);
	}

	public XamlMember (String attachableEventName, MethodInfo adder, XamlSchemaContext schemaContext, XamlMemberInvoker invoker)
	{
		this (schemaContext, invoker);
		if (attachableEventName == null)
			throw new ArgumentNullException ("attachableEventName");
		if (adder == null)
			throw new ArgumentNullException ("adder");
		Name = attachableEventName;
		VerifyAdderSetter (adder);
		underlying_member = adder;
		DeclaringType = schemaContext.GetXamlType (adder.DeclaringType);
		target_type = schemaContext.GetXamlType (typeof (Object));
		UnderlyingSetter = adder;
		is_event = true;
		is_attachable = true;
	}

	public XamlMember (String attachablePropertyName, MethodInfo getter, MethodInfo setter, XamlSchemaContext schemaContext)
	{
		this (attachablePropertyName, getter, setter, schemaContext, null);
	}

	public XamlMember (String attachablePropertyName, MethodInfo getter, MethodInfo setter, XamlSchemaContext schemaContext, XamlMemberInvoker invoker)
	{
		this (schemaContext, invoker);
		if (attachablePropertyName == null)
			throw new ArgumentNullException ("attachablePropertyName");
		if (getter == null && setter == null)
			throw new ArgumentNullException ("getter", "Either property getter or setter must be non-null.");
		Name = attachablePropertyName;
		VerifyGetter (getter);
		VerifyAdderSetter (setter);
		underlying_member = getter ?? setter;
		DeclaringType = schemaContext.GetXamlType (underlying_member.DeclaringType);
		target_type = schemaContext.GetXamlType (typeof (Object));
		UnderlyingGetter = getter;
		UnderlyingSetter = setter;
		is_attachable = true;
	}

	public XamlMember (String name, XamlType declaringType, boolean isAttachable)
	{
		if (name == null)
			throw new ArgumentNullException ("name");
		if (declaringType == null)
			throw new ArgumentNullException ("declaringType");
		Name = name;
		this.invoker = new XamlMemberInvoker (this);
		context = declaringType.SchemaContext;
		DeclaringType = declaringType;
		target_type = DeclaringType;
		is_attachable = isAttachable;
	}

	XamlMember (XamlSchemaContext schemaContext, XamlMemberInvoker invoker)
	{
		if (schemaContext == null)
			throw new ArgumentNullException ("schemaContext");
		context = schemaContext;
		this.invoker = invoker ?? new XamlMemberInvoker (this);
	}

	/*internal*/ public XamlMember (boolean isDirective, String ns, String name)
	{
		directive_ns = ns;
		Name = name;
		is_directive = isDirective;
	}

	XamlType type, target_type;
	MemberInfo underlying_member;
	MethodInfo underlying_getter, underlying_setter;
	XamlSchemaContext context;
	XamlMemberInvoker invoker;
	boolean is_attachable, is_event, is_directive;
	boolean is_predefined_directive = XamlLanguage.InitializingDirectives;
	String directive_ns;

	/*internal*/ public MethodInfo UnderlyingGetter {
		get { return LookupUnderlyingGetter (); }
		private set { underlying_getter = value; }
	}
	/*internal*/ public MethodInfo UnderlyingSetter {
		get { return LookupUnderlyingSetter (); }
		private set { underlying_setter = value; }
	}

	public XamlType DeclaringType { get; private set; }
	public String Name { get; private set; }

	public String PreferredXamlNamespace {
		get { return directive_ns ?? (DeclaringType == null ? null : DeclaringType.PreferredXamlNamespace); }
	}

//#if !NET_2_1
//	public DesignerSerializationVisibility SerializationVisibility {
//		get {
//			var c= GetCustomAttributeProvider ();
//			var a = c == null ? null : c.GetCustomAttribute<DesignerSerializationVisibilityAttribute> (false);
//			return a != null ? a.Visibility : DesignerSerializationVisibility.Visible;
//		}
//	}
//#endif

	public boolean IsAttachable {
		get { return is_attachable; }
	}

	public boolean IsDirective {
		get { return is_directive; }
	}

	public boolean IsNameValid {
		get { return XamlLanguage.IsValidXamlName (Name); }
	}

	public XamlValueConverter<XamlDeferringLoader> DeferringLoader {
		get { return LookupDeferringLoader (); }
	}

	static final XamlMember [] empty_members = new XamlMember [0];

	public IList<XamlMember> DependsOn {
		get { return LookupDependsOn () ?? empty_members; }
	}

	public XamlMemberInvoker Invoker {
		get { return LookupInvoker (); }
	}
	public boolean IsAmbient {
		get { return LookupIsAmbient (); }
	}
	public boolean IsEvent {
		get { return LookupIsEvent (); }
	}
	public boolean IsReadOnly {
		get { return LookupIsReadOnly (); }
	}
	public boolean IsReadPublic {
		get { return LookupIsReadPublic (); }
	}
	public boolean IsUnknown {
		get { return LookupIsUnknown (); }
	}
	public boolean IsWriteOnly {
		get { return LookupIsWriteOnly (); }
	}
	public boolean IsWritePublic {
		get { return LookupIsWritePublic (); }
	}
	public XamlType TargetType {
		get { return LookupTargetType (); }
	}
	public XamlType Type {
		get { return LookupType (); }
	}
	public XamlValueConverter<TypeConverter> TypeConverter {
		get { return LookupTypeConverter (); }
	}
	public MemberInfo UnderlyingMember {
		get { return LookupUnderlyingMember (); }
	}
	public XamlValueConverter<ValueSerializer> ValueSerializer {
		get { return LookupValueSerializer (); }
	}

	public static boolean operator == (XamlMember left, XamlMember right)
	{
		return IsNull (left) ? IsNull (right) : left.Equals (right);
	}

	static boolean IsNull (XamlMember a)
	{
		return Object.ReferenceEquals (a, null);
	}

	public static boolean operator != (XamlMember left, XamlMember right)
	{
		return !(left == right);
	}

	public /*override*/ boolean Equals (Object other)
	{
		XamlMember x = other as XamlMember;
		return Equals (x);
	}

	public boolean Equals (XamlMember other)
	{
		// this should be in general correct; XamlMembers are almost not comparable.
		if (Object.ReferenceEquals (this, other))
			return true;
		// It does not compare XamlSchemaContext.
		return !IsNull (other) &&
			underlying_member == other.underlying_member &&
			underlying_getter == other.underlying_getter &&
			underlying_setter == other.underlying_setter &&
			Name == other.Name &&
			PreferredXamlNamespace == other.PreferredXamlNamespace &&
			directive_ns == other.directive_ns &&
			is_attachable == other.is_attachable;
	}

	public /*override*/ int GetHashCode ()
	{
		return ToString ().GetHashCode (); // should in general work.
	}

//	[MonoTODO ("there are some patterns that return different kind of value: e.g. List<int>.Capacity")]
	public /*override*/ String ToString ()
	{
		if (is_attachable || String.IsNullOrEmpty (PreferredXamlNamespace)) {
			if (DeclaringType == null)
				return Name;
			else
				return String.Concat (DeclaringType.UnderlyingType.FullName, ".", Name);
		}
		else
			return String.Concat ("{", PreferredXamlNamespace, "}", DeclaringType.Name, ".", Name);
	}

	public /*virtual*/ IList<String> GetXamlNamespaces ()
	{
		throw new NotImplementedException ();
	}

	// lookups

	/*internal*/ public ICustomAttributeProvider GetCustomAttributeProvider ()
	{
		return LookupCustomAttributeProvider ();
	}

	protected /*virtual*/ ICustomAttributeProvider LookupCustomAttributeProvider ()
	{
		return UnderlyingMember;
	}

	protected /*virtual*/ XamlValueConverter<XamlDeferringLoader> LookupDeferringLoader ()
	{
		// FIXME: use XamlDeferLoadAttribute.
		return null;
	}

	static final XamlMember [] empty_list = new XamlMember [0];

	protected /*virtual*/ IList<XamlMember> LookupDependsOn ()
	{
		return empty_list;
	}

	protected /*virtual*/ XamlMemberInvoker LookupInvoker ()
	{
		return invoker;
	}
	protected /*virtual*/ boolean LookupIsAmbient ()
	{
		Type t = Type != null ? Type.UnderlyingType : null;
		return t != null && t.GetCustomAttributes (typeof (AmbientAttribute), false).Length > 0;
	}

	protected /*virtual*/ boolean LookupIsEvent ()
	{
		return is_event;
	}

	protected /*virtual*/ boolean LookupIsReadOnly ()
	{
		return UnderlyingGetter != null && UnderlyingSetter == null;
	}
	protected /*virtual*/ boolean LookupIsReadPublic ()
	{
		if (underlying_member == null)
			return true;
		if (UnderlyingGetter != null)
			return UnderlyingGetter.IsPublic;
		return false;
	}

	protected /*virtual*/ boolean LookupIsUnknown ()
	{
		return underlying_member == null;
	}

	protected /*virtual*/ boolean LookupIsWriteOnly ()
	{
		PropertyInfo pi = underlying_member as PropertyInfo;
		if (pi != null)
			return !pi.CanRead && pi.CanWrite;
		return UnderlyingGetter == null && UnderlyingSetter != null;
	}

	protected /*virtual*/ boolean LookupIsWritePublic ()
	{
		if (underlying_member == null)
			return true;
		if (UnderlyingSetter != null)
			return UnderlyingSetter.IsPublic;
		return false;
	}

	protected /*virtual*/ XamlType LookupTargetType ()
	{
		return target_type;
	}

	protected /*virtual*/ XamlType LookupType ()
	{
		if (type == null)
			type = context.GetXamlType (DoGetType ());
		return type;
	}


	Type DoGetType ()
	{
		PropertyInfo pi = underlying_member as PropertyInfo;
		if (pi != null)
			return pi.PropertyType;
		EventInfo ei = underlying_member as EventInfo;
		if (ei != null)
			return ei.EventHandlerType;
		if (underlying_setter != null)
			return underlying_setter.GetParameters () [1].ParameterType;
		if (underlying_getter != null)
			return underlying_getter.GetParameters () [0].ParameterType;
		return typeof (Object);
	}

	protected /*virtual*/ XamlValueConverter<TypeConverter> LookupTypeConverter ()
	{
		Type t = Type.UnderlyingType;
		if (t == null)
			return null;
		if (t == typeof (Object)) // it is different from XamlType.LookupTypeConverter().
			return null;

		ICustomAttributeProvider a = GetCustomAttributeProvider ();
		var ca = a != null ? a.GetCustomAttribute<TypeConverterAttribute> (false) : null;
		if (ca != null)
			return context.GetValueConverter<TypeConverter> (System.Type.GetType (ca.ConverterTypeName), Type);

		return Type.TypeConverter;
	}

	protected /*virtual*/ MethodInfo LookupUnderlyingGetter ()
	{
		return underlying_getter;
	}

	protected /*virtual*/ MemberInfo LookupUnderlyingMember ()
	{
		return underlying_member;
	}

	protected /*virtual*/ MethodInfo LookupUnderlyingSetter ()
	{
		return underlying_setter;
	}

	protected /*virtual*/ XamlValueConverter<ValueSerializer> LookupValueSerializer ()
	{
		if (is_predefined_directive) // FIXME: this is likely a hack.
			return null;
		if (Type == null)
			return null;

		return XamlType.LookupValueSerializer (Type, LookupCustomAttributeProvider ()) ?? Type.ValueSerializer;
	}

	void VerifyGetter (MethodInfo method)
	{
		if (method == null)
			return;
		if (method.GetParameters ().Length != 1 || method.ReturnType == typeof (void))
			throw new ArgumentException (String.Format ("Property getter for {0} must have exactly one argument and must have non-void return type.", Name));
	}

	void VerifyAdderSetter (MethodInfo method)
	{
		if (method == null)
			return;
		if (method.GetParameters ().Length != 2)
			throw new ArgumentException (String.Format ("Property getter or event adder for {0} must have exactly one argument and must have non-void return type.", Name));
	}
}