package org.summer.view.widget;

import java.lang.reflect.Array;
import java.util.Locale;

import org.omg.CORBA.TypeCode;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.reflection.Assembly;
import org.summer.view.widget.reflection.Binder;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MemberInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.xml.InvalidCastException;

//[Serializable]
//	[ClassInterface (ClassInterfaceType.None)]
//	[ComVisible (true)]
//	[ComDefaultInterface (typeof (_Type))]
//	[StructLayout (LayoutKind.Sequential)]
//#if MOBILE
//	public abstract class Type : MemberInfo, IReflect {
//#else
	public abstract class Type extends MemberInfo implements IReflect, _Type {
//#endif

		/*internal*/ public RuntimeTypeHandle _impl;

		public static final char Delimiter = '.';
		public static final Type[] EmptyTypes = {};
		public static final MemberFilter FilterAttribute = new MemberFilter (FilterAttribute_impl);
		public static final MemberFilter FilterName = new MemberFilter (FilterName_impl);
		public static final MemberFilter FilterNameIgnoreCase = new MemberFilter (FilterNameIgnoreCase_impl);
		public static final Object Missing = System.Reflection.Missing.Value;

		/*internal*/ public /*const*/ static final BindingFlags DefaultBindingFlags =
		BindingFlags.Public | BindingFlags.Static | BindingFlags.Instance;

		/* implementation of the delegates for MemberFilter */
		static boolean FilterName_impl (MemberInfo m, Object filterCriteria)
		{
			String name = (String) filterCriteria;
			if (name == null || name.Length == 0 )
				return false; // because m.Name cannot be null or empty

			if (name [name.Length - 1] == '*')
				return m.Name.StartsWithOrdinalUnchecked (name.Substring (0, name.Length - 1));

			return m.Name == name;
		}

		static boolean FilterNameIgnoreCase_impl (MemberInfo m, Object filterCriteria)
		{
			String name = (String) filterCriteria;
			if (name == null || name.Length == 0 )
				return false; // because m.Name cannot be null or empty

			if (name [name.Length - 1] == '*')
				return m.Name.StartsWithOrdinalCaseInsensitiveUnchecked (name.Substring (0, name.Length - 1));

			return String.CompareOrdinalCaseInsensitiveUnchecked (m.Name, name) == 0;
		}

		static boolean FilterAttribute_impl (MemberInfo m, Object filterCriteria)
		{
			if (!(filterCriteria is int))
				throw new InvalidFilterCriteriaException ("Int32 value is expected for filter criteria");

			int flags = (int) filterCriteria;
			if (m is MethodInfo)
				return ((int)((MethodInfo)m).Attributes & flags) != 0;
			if (m is FieldInfo)
				return ((int)((FieldInfo)m).Attributes & flags) != 0;
			if (m is PropertyInfo)
				return ((int)((PropertyInfo)m).Attributes & flags) != 0;
			if (m is EventInfo)
				return ((int)((EventInfo)m).Attributes & flags) != 0;
			return false;
		}

		protected Type ()
		{
		}

		/// <summary>
		///   The assembly where the type is defined.
		/// </summary>
		public abstract Assembly Assembly {
			get;
		}

		/// <summary>
		///   Gets the fully qualified name for the type including the
		///   assembly name where the type is defined.
		/// </summary>
		public abstract String AssemblyQualifiedName {
			get;
		}

		/// <summary>
		///   Returns the Attributes associated with the type.
		/// </summary>
		public TypeAttributes Attributes {
			get {
				return GetAttributeFlagsImpl ();
			}
		}

		/// <summary>
		///   Returns the basetype for this type
		/// </summary>
		public abstract Type BaseType {
			get;
		}

		/// <summary>
		///   Returns the class that declares the member.
		/// </summary>
		public /*override*/ Type DeclaringType {
			get {
				return null;
			}
		}

		/// <summary>
		///
		/// </summary>
		public static Binder DefaultBinder {
			get {
				return Binder.DefaultBinder;
			}
		}

		/// <summary>
		///    The full name of the type including its namespace
		/// </summary>
		public abstract String FullName {
			get;
		}

		public abstract Guid GUID {
			get;
		}

		public boolean HasElementType {
			get {
				return HasElementTypeImpl ();
			}
		}

		public boolean IsAbstract {
			get {
				return (Attributes & TypeAttributes.Abstract) != 0;
			}
		}

		public boolean IsAnsiClass {
			get {
				return (Attributes & TypeAttributes.StringFormatMask)
				== TypeAttributes.AnsiClass;
			}
		}

		public boolean IsArray {
			get {
				return IsArrayImpl ();
			}
		}

		public boolean IsAutoClass {
			get {
				return (Attributes & TypeAttributes.StringFormatMask) == TypeAttributes.AutoClass;
			}
		}

		public boolean IsAutoLayout {
			get {
				return (Attributes & TypeAttributes.LayoutMask) == TypeAttributes.AutoLayout;
			}
		}

		public boolean IsByRef {
			get {
				return IsByRefImpl ();
			}
		}

		public boolean IsClass {
			get {
				if (IsInterface)
					return false;

				return !IsValueType;
			}
		}

		public boolean IsCOMObject {
			get {
				return IsCOMObjectImpl ();
			}
		}

//#if NET_4_5
		public /*virtual*/ boolean IsConstructedGenericType {
			get {
				throw new NotImplementedException ();
			}
		}
//#endif

		public boolean IsContextful {
			get {
				return IsContextfulImpl ();
			}
		}

		public
//#if NET_4_0
//		/*virtual*/
//#endif
		boolean IsEnum {
			get {
				return IsSubclassOf (typeof (Enum));
			}
		}

		public boolean IsExplicitLayout {
			get {
				return (Attributes & TypeAttributes.LayoutMask) == TypeAttributes.ExplicitLayout;
			}
		}

		public boolean IsImport {
			get {
				return (Attributes & TypeAttributes.Import) != 0;
			}
		}

		public boolean IsInterface {
			get {
				return (Attributes & TypeAttributes.ClassSemanticsMask) == TypeAttributes.Interface;
			}
		}

		public boolean IsLayoutSequential {
			get {
				return (Attributes & TypeAttributes.LayoutMask) == TypeAttributes.SequentialLayout;
			}
		}

		public boolean IsMarshalByRef {
			get {
				return IsMarshalByRefImpl ();
			}
		}

		public boolean IsNestedAssembly {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedAssembly;
			}
		}

		public boolean IsNestedFamANDAssem {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedFamANDAssem;
			}
		}

		public boolean IsNestedFamily {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedFamily;
			}
		}

		public boolean IsNestedFamORAssem {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedFamORAssem;
			}
		}

		public boolean IsNestedPrivate {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedPrivate;
			}
		}

		public boolean IsNestedPublic {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NestedPublic;
			}
		}

		public boolean IsNotPublic {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.NotPublic;
			}
		}

		public boolean IsPointer {
			get {
				return IsPointerImpl ();
			}
		}

		public boolean IsPrimitive {
			get {
				return IsPrimitiveImpl ();
			}
		}

		public boolean IsPublic {
			get {
				return (Attributes & TypeAttributes.VisibilityMask) == TypeAttributes.Public;
			}
		}

		public boolean IsSealed {
			get {
				return (Attributes & TypeAttributes.Sealed) != 0;
			}
		}

		public
//#if NET_4_0
		/*virtual*/
//#endif
		boolean IsSerializable {
			get {
				if ((Attributes & TypeAttributes.Serializable) != 0)
					return true;

				// Enums and delegates are always serializable

				Type type = UnderlyingSystemType;
				if (type == null)
					return false;

				// Fast check for system types
				if (type.IsSystemType)
					return type_is_subtype_of (type, typeof (Enum), false) || type_is_subtype_of (type, typeof (Delegate), false);

				// User defined types depend on this behavior
				do {
					if ((type == typeof (Enum)) || (type == typeof (Delegate)))
						return true;

					type = type.BaseType;
				} while (type != null);

				return false;
			}
		}

		public boolean IsSpecialName {
			get {
				return (Attributes & TypeAttributes.SpecialName) != 0;
			}
		}

		public boolean IsUnicodeClass {
			get {
				return (Attributes & TypeAttributes.StringFormatMask) == TypeAttributes.UnicodeClass;
			}
		}

		public boolean IsValueType {
			get {
				return IsValueTypeImpl ();
			}
		}

		public /*override*/ MemberTypes MemberType {
			get {
				return MemberTypes.TypeInfo;
			}
		}

		public abstract /*override*/ Module Module {
			get;
		}

		public abstract String Namespace {get;}

		public /*override*/ Type ReflectedType {
			get {
				return null;
			}
		}

		public /*virtual*/ RuntimeTypeHandle TypeHandle {
			get { throw new ArgumentException ("Derived class must provide implementation."); }
		}

//		[ComVisible (true)]
		public ConstructorInfo TypeInitializer {
			get {
				return GetConstructorImpl (
					BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static,
					null,
					CallingConventions.Any,
					EmptyTypes,
					null);
			}
		}

		/*
		 * This has NOTHING to do with getting the base type of an enum. Use
		 * Enum.GetUnderlyingType () for that.
		 */
		public abstract Type UnderlyingSystemType {get;}

		public override boolean Equals (Object o)
		{
//#if NET_4_0
//			return Equals (o as Type);
//#else
			if (o == this)
				return true;

			Type me = UnderlyingSystemType;
			if (me == null)
				return false;
			return me.EqualsInternal (o as Type);
//#endif
		}

//#if NET_4_0
//		public /*virtual*/ boolean Equals (Type o)
//		{
//			if ((Object)o == (Object)this)
//				return true;
//			if ((Object)o == null)
//				return false;
//			Type me = UnderlyingSystemType;
//			if ((Object)me == null)
//				return false;
//
//			o = o.UnderlyingSystemType;
//			if ((Object)o == null)
//				return false;
//			if ((Object)o == (Object)this)
//				return true;
//			return me.EqualsInternal (o);
//		}		
//#else
		public boolean Equals (Type o)
		{

			if (o == this)
				return true;
			if (o == null)
				return false;
			Type me = UnderlyingSystemType;
			if (me == null)
				return false;
			return me.EqualsInternal (o.UnderlyingSystemType);
		}
//#endif
//#if NET_4_0
//		[MonoTODO ("Implement it properly once 4.0 impl details are known.")]
		public static boolean operator == (Type left, Type right)
		{
			return Object.ReferenceEquals (left, right);
		}

//		[MonoTODO ("Implement it properly once 4.0 impl details are known.")]
		public static boolean operator != (Type left, Type right)
		{
			return !Object.ReferenceEquals (left, right);
		}

//		[MonoInternalNote ("Reimplement this in MonoType for bonus speed")]
		public /*virtual*/ Type GetEnumUnderlyingType () {
			if (!IsEnum)
				throw new ArgumentException ("Type is not an enumeration", "enumType");

			var fields = GetFields (BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

			if (fields == null || fields.Length != 1)
				throw new ArgumentException ("An enum must have exactly one instance field", "enumType");

			return fields [0].FieldType;
		}

//		[MonoInternalNote ("Reimplement this in MonoType for bonus speed")]
		public /*virtual*/ String[] GetEnumNames () {
			if (!IsEnum)
				throw new ArgumentException ("Type is not an enumeration", "enumType");

			var fields = GetFields (BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

			String [] names = new String [fields.Length];
			if (0 != names.Length) {
				for (int i = 0; i < fields.Length; ++i)
					names [i] = fields [i].Name;

				var et = GetEnumUnderlyingType ();
				var values = Array.CreateInstance (et, names.Length);
				for (int i = 0; i < fields.Length; ++i)
					values.SetValue (fields [i].GetValue (null), i);
				MonoEnumInfo.SortEnums (et, values, names);
			}

			return names;
		}

		static NotImplementedException CreateNIE () {
			return new NotImplementedException ();
		}

		public /*virtual*/ Array GetEnumValues () {
			if (!IsEnum)
				throw new ArgumentException ("Type is not an enumeration", "enumType");

			throw CreateNIE ();
		}

		boolean IsValidEnumType (Type type) {
			return (type.IsPrimitive && type != typeof (boolean) && type != typeof (double) && type != typeof (float)) || type.IsEnum;
		}

//		[MonoInternalNote ("Reimplement this in MonoType for bonus speed")]
		public /*virtual*/ String GetEnumName (Object value) {
			if (value == null)
				throw new ArgumentException ("Value is null", "value");
			if (!IsValidEnumType (value.GetType ()))
				throw new ArgumentException ("Value is not the enum or a valid enum underlying type", "value");
			if (!IsEnum)
				throw new ArgumentException ("Type is not an enumeration", "enumType");

			Object obj = null;
			var fields = GetFields (BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

			for (int i = 0; i < fields.Length; ++i) {
				var fv = fields [i].GetValue (null);
				if (obj == null) {
					try {
						//XXX we can't use 'this' as argument as it might be an UserType
						obj = Enum.ToObject (fv.GetType (), value);
					} catch (OverflowException) {
						return null;
					} catch (InvalidCastException) {
						throw new ArgumentException ("Value is not valid", "value");
					}
				}
				if (fv.Equals (obj))
					return fields [i].Name;
			}

			return null;
		}

//		[MonoInternalNote ("Reimplement this in MonoType for bonus speed")]
		public /*virtual*/ boolean IsEnumDefined (Object value) {
			if (value == null)
				throw new ArgumentException ("Value is null", "value");
			if (!IsEnum)
				throw new ArgumentException ("Type is not an enumeration", "enumType");

			Type vt = value.GetType ();
			if (!IsValidEnumType (vt) && vt != typeof (String))
				throw new InvalidOperationException ("Value is not the enum or a valid enum underlying type");

			var fields = GetFields (BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);

			if (value is String) {
				for (int i = 0; i < fields.Length; ++i) {
					if (fields [i].Name.Equals (value))
						return true;
				}
			} else {
				if (vt != this && vt != GetEnumUnderlyingType ())
					throw new ArgumentException ("Value is not the enum or a valid enum underlying type", "value");

				Object obj = null;
				for (int i = 0; i < fields.Length; ++i) {
					var fv = fields [i].GetValue (null);
					if (obj == null) {
						try {
							//XXX we can't use 'this' as argument as it might be an UserType
							obj = Enum.ToObject (fv.GetType (), value);
						} catch (OverflowException) {
							return false;
						} catch (InvalidCastException) {
							throw new ArgumentException ("Value is not valid", "value");
						}
					}
					if (fv.Equals (obj))
						return true;
				}
			}
			return false;
		}

		public static Type GetType (String typeName, Func<AssemblyName,Assembly> assemblyResolver, Func<Assembly,String,boolean,Type> typeResolver)
		{
			return GetType (typeName, assemblyResolver, typeResolver, false, false);
		}

		public static Type GetType (String typeName, Func<AssemblyName,Assembly> assemblyResolver, Func<Assembly,String,boolean,Type> typeResolver, boolean throwOnError)
		{
			return GetType (typeName, assemblyResolver, typeResolver, throwOnError, false);
		}

		public static Type GetType (String typeName, Func<AssemblyName,Assembly> assemblyResolver, Func<Assembly,String,boolean,Type> typeResolver, boolean throwOnError, boolean ignoreCase)
		{
			TypeSpec spec = TypeSpec.Parse (typeName);
			return spec.Resolve (assemblyResolver, typeResolver, throwOnError, ignoreCase);
		}

		public /*virtual*/ boolean IsSecurityTransparent
		{
			get { throw CreateNIE (); }
		}

		public /*virtual*/ boolean IsSecurityCritical
		{
			get { throw CreateNIE (); }
		}

		public /*virtual*/ boolean IsSecuritySafeCritical
		{
			get { throw CreateNIE (); }
		}
//#endif
		
//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public /*extern*/ boolean EqualsInternal (Type type);
		
//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		private static /*extern*/ Type internal_from_handle (IntPtr handle);
		
//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		private static /*extern*/ Type internal_from_name (String name, boolean throwOnError, boolean ignoreCase);

		public static Type GetType(String typeName)
		{
			if (typeName == null)
				throw new ArgumentNullException ("TypeName");

			return internal_from_name (typeName, false, false);
		}

		public static Type GetType(String typeName, boolean throwOnError)
		{
			if (typeName == null)
				throw new ArgumentNullException ("TypeName");

			Type type = internal_from_name (typeName, throwOnError, false);
			if (throwOnError && type == null)
				throw new TypeLoadException ("Error loading '" + typeName + "'");

			return type;
		}

		public static Type GetType(String typeName, boolean throwOnError, boolean ignoreCase)
		{
			if (typeName == null)
				throw new ArgumentNullException ("TypeName");

			Type t = internal_from_name (typeName, throwOnError, ignoreCase);
			if (throwOnError && t == null)
				throw new TypeLoadException ("Error loading '" + typeName + "'");

			return t;
		}

		public static Type[] GetTypeArray (Object[] args) {
			if (args == null)
				throw new ArgumentNullException ("args");

			Type[] ret;
			ret = new Type [args.Length];
			for (int i = 0; i < args.Length; ++i)
				ret [i] = args[i].GetType ();
			return ret;
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public extern static TypeCode GetTypeCodeInternal (Type type);

//#if NET_4_0
//		protected /*virtual*/
//#endif
		TypeCode GetTypeCodeImpl () {
			Type type = this;
			if (type is MonoType)
				return GetTypeCodeInternal (type);
//#if !FULL_AOT_RUNTIME
//			if (type is TypeBuilder)
//				return ((TypeBuilder)type).GetTypeCodeInternal ();
//#endif

			type = type.UnderlyingSystemType;

			if (!type.IsSystemType)
				return TypeCode.Object;
			else
				return GetTypeCodeInternal (type);
		}

		public static TypeCode GetTypeCode (Type type) {
			if (type == null)
				/* MS.NET returns this */
				return TypeCode.Empty;
			return type.GetTypeCodeImpl ();
		}

//#if !FULL_AOT_RUNTIME
//		private static Dictionary<Guid, Type> clsid_types;
//		private static AssemblyBuilder clsid_assemblybuilder;
//#endif

//		[MonoTODO("COM servers only work on Windows")]
		public static Type GetTypeFromCLSID (Guid clsid)
		{
			return GetTypeFromCLSID (clsid, null, true);
		}

//		[MonoTODO("COM servers only work on Windows")]
		public static Type GetTypeFromCLSID (Guid clsid, boolean throwOnError)
		{
			return GetTypeFromCLSID (clsid, null, throwOnError);
		}

//		[MonoTODO("COM servers only work on Windows")]
		public static Type GetTypeFromCLSID (Guid clsid, String server)
		{
			return GetTypeFromCLSID (clsid, server, true);
		}

//		[MonoTODO("COM servers only work on Windows")]
		public static Type GetTypeFromCLSID (Guid clsid, String server, boolean throwOnError)
		{
#if !FULL_AOT_RUNTIME
			Type result;

			if (clsid_types == null)
			{
				Dictionary<Guid, Type> new_clsid_types = new Dictionary<Guid, Type> ();
				Interlocked.CompareExchange<Dictionary<Guid, Type>>(
					ref clsid_types, new_clsid_types, null);
			}

			lock (clsid_types) {
				if (clsid_types.TryGetValue(clsid, out result))
					return result;

				if (clsid_assemblybuilder == null)
				{
					AssemblyName assemblyname = new AssemblyName ();
					assemblyname.Name = "GetTypeFromCLSIDDummyAssembly";
					clsid_assemblybuilder = AppDomain.CurrentDomain.DefineDynamicAssembly (
						assemblyname, AssemblyBuilderAccess.Run);
				}
				ModuleBuilder modulebuilder = clsid_assemblybuilder.DefineDynamicModule (
					clsid.ToString ());

				TypeBuilder typebuilder = modulebuilder.DefineType ("System.__ComObject",
					TypeAttributes.Public | TypeAttributes.Class, typeof(System.__ComObject));

				Type[] guidattrtypes = new Type[] { typeof(String) };

				CustomAttributeBuilder customattr = new CustomAttributeBuilder (
					typeof(GuidAttribute).GetConstructor (guidattrtypes),
					new Object[] { clsid.ToString () });

				typebuilder.SetCustomAttribute (customattr);

				customattr = new CustomAttributeBuilder (
					typeof(ComImportAttribute).GetConstructor (EmptyTypes),
					new Object[0] {});

				typebuilder.SetCustomAttribute (customattr);

				result = typebuilder.CreateType ();

				clsid_types.Add(clsid, result);

				return result;
			}
#else
			throw new NotImplementedException ();
#endif
		}

		public static Type GetTypeFromHandle (RuntimeTypeHandle handle)
		{
			if (handle.Value == IntPtr.Zero)
				// This is not consistent with the other GetXXXFromHandle methods, but
				// MS.NET seems to do this
				return null;

			return internal_from_handle (handle.Value);
		}

//		[MonoTODO("Mono does not support COM")]
		public static Type GetTypeFromProgID (String progID)
		{
			throw new NotImplementedException ();
		}

//		[MonoTODO("Mono does not support COM")]
		public static Type GetTypeFromProgID (String progID, boolean throwOnError)
		{
			throw new NotImplementedException ();
		}

//		[MonoTODO("Mono does not support COM")]
		public static Type GetTypeFromProgID (String progID, String server)
		{
			throw new NotImplementedException ();
		}

//		[MonoTODO("Mono does not support COM")]
		public static Type GetTypeFromProgID (String progID, String server, boolean throwOnError)
		{
			throw new NotImplementedException ();
		}

		public static RuntimeTypeHandle GetTypeHandle (Object o)
		{
			if (o == null)
				throw new ArgumentNullException ();

			return o.GetType().TypeHandle;
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public static /*extern*/ boolean type_is_subtype_of (Type a, Type b, boolean check_interfaces);

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public static /*extern*/ boolean type_is_assignable_from (Type a, Type b);

		public /*new*/ Type GetType ()
		{
			return base.GetType ();
		}

//		[ComVisible (true)]
		public /*virtual*/ boolean IsSubclassOf (Type c)
		{
			if (c == null || c == this)
				return false;

			// Fast check for system types
			if (IsSystemType)
				return c.IsSystemType && type_is_subtype_of (this, c, false);

			// User defined types depend on this behavior
			for (Type type = BaseType; type != null; type = type.BaseType)
				if (type == c)
					return true;

			return false;
		}

		public /*virtual*/ Type[] FindInterfaces (TypeFilter filter, Object filterCriteria)
		{
			if (filter == null)
				throw new ArgumentNullException ("filter");

			var ifaces = new List<Type> ();
			foreach (Type iface in GetInterfaces ()) {
				if (filter (iface, filterCriteria))
					ifaces.Add (iface);
			}

			return ifaces.ToArray ();
		}

		public Type GetInterface (String name) {
			return GetInterface (name, false);
		}

		public abstract Type GetInterface (String name, boolean ignoreCase);

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public static /*extern*/ void GetInterfaceMapData (Type t, Type iface, /*out*/ MethodInfo[] targets, /*out*/ MethodInfo[] methods);

//		[ComVisible (true)]
		public /*virtual*/ InterfaceMapping GetInterfaceMap (Type interfaceType) {
			if (!IsSystemType)
				throw new NotSupportedException ("Derived classes must provide an implementation.");
			if (interfaceType == null)
				throw new ArgumentNullException ("interfaceType");
			if (!interfaceType.IsSystemType)
				throw new ArgumentException ("interfaceType", "Type is an user type");
			InterfaceMapping res;
			if (!interfaceType.IsInterface)
				throw new ArgumentException (Locale.GetText ("Argument must be an interface."), "interfaceType");
			if (IsInterface)
				throw new ArgumentException ("'this' type cannot be an interface itself");
			res.TargetType = this;
			res.InterfaceType = interfaceType;
			GetInterfaceMapData (this, interfaceType, out res.TargetMethods, out res.InterfaceMethods);
			if (res.TargetMethods == null)
				throw new ArgumentException (Locale.GetText ("Interface not found"), "interfaceType");

			return res;
		}

		public abstract Type[] GetInterfaces ();

		public /*virtual*/ boolean IsAssignableFrom (Type c)
		{
			if (c == null)
				return false;

			if (Equals (c))
				return true;

#if !FULL_AOT_RUNTIME
			if (c is TypeBuilder)
				return ((TypeBuilder)c).IsAssignableTo (this);
#endif

			/* Handle user defined type classes */
			if (!IsSystemType) {
				Type systemType = UnderlyingSystemType;
				if (!systemType.IsSystemType)
					return false;

				Type other = c.UnderlyingSystemType;
				if (!other.IsSystemType)
					return false;

				return systemType.IsAssignableFrom (other);
			}

			if (!c.IsSystemType) {
				Type underlyingType = c.UnderlyingSystemType;
				if (!underlyingType.IsSystemType)
					return false;
				return IsAssignableFrom (underlyingType);
			}

			return type_is_assignable_from (this, c);
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ static boolean IsInstanceOfType (Type type, Object o);

		public /*virtual*/ boolean IsInstanceOfType (Object o)
		{
			Type type = UnderlyingSystemType;
			if (!type.IsSystemType)
				return false;
			return IsInstanceOfType (type, o);
		}

		public /*virtual*/ int GetArrayRank ()
		{
			throw new NotSupportedException ();	// according to MSDN
		}

		public abstract Type GetElementType ();

		public EventInfo GetEvent (String name)
		{
			return GetEvent (name, DefaultBindingFlags);
		}

		public abstract EventInfo GetEvent (String name, BindingFlags bindingAttr);

		public /*virtual*/ EventInfo[] GetEvents ()
		{
			return GetEvents (DefaultBindingFlags);
		}

		public abstract EventInfo[] GetEvents (BindingFlags bindingAttr);

		public FieldInfo GetField( String name)
		{
			return GetField (name, DefaultBindingFlags);
		}

		public abstract FieldInfo GetField( String name, BindingFlags bindingAttr);

		public FieldInfo[] GetFields ()
		{
			return GetFields (DefaultBindingFlags);
		}

		public abstract FieldInfo[] GetFields (BindingFlags bindingAttr);

		public override int GetHashCode()
		{
			Type t = UnderlyingSystemType;
			if (t != null && t != this)
				return t.GetHashCode ();
			return (int)_impl.Value;
		}

		public MemberInfo[] GetMember (String name)
		{
			return GetMember (name, MemberTypes.All, DefaultBindingFlags);
		}

		public /*virtual*/ MemberInfo[] GetMember (String name, BindingFlags bindingAttr)
		{
			return GetMember (name, MemberTypes.All, bindingAttr);
		}

		public /*virtual*/ MemberInfo[] GetMember (String name, MemberTypes type, BindingFlags bindingAttr)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			if ((bindingAttr & BindingFlags.IgnoreCase) != 0)
				return FindMembers (type, bindingAttr, FilterNameIgnoreCase, name);
			else
				return FindMembers (type, bindingAttr, FilterName, name);
		}

		public MemberInfo[] GetMembers ()
		{
			return GetMembers (DefaultBindingFlags);
		}

		public abstract MemberInfo[] GetMembers (BindingFlags bindingAttr);

		public MethodInfo GetMethod (String name)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			return GetMethodImpl (name, DefaultBindingFlags, null, CallingConventions.Any, null, null);
		}

		public MethodInfo GetMethod (String name, BindingFlags bindingAttr)
		{
			if (name == null)
				throw new ArgumentNullException ("name");

			return GetMethodImpl (name, bindingAttr, null, CallingConventions.Any, null, null);
		}

		public MethodInfo GetMethod (String name, Type[] types)
		{
			return GetMethod (name, DefaultBindingFlags, null, CallingConventions.Any, types, null);
		}

		public MethodInfo GetMethod (String name, Type[] types, ParameterModifier[] modifiers)
		{
			return GetMethod (name, DefaultBindingFlags, null, CallingConventions.Any, types, modifiers);
		}

		public MethodInfo GetMethod (String name, BindingFlags bindingAttr, Binder binder,
		                             Type[] types, ParameterModifier[] modifiers)
		{
			return GetMethod (name, bindingAttr, binder, CallingConventions.Any, types, modifiers);
		}

		public MethodInfo GetMethod (String name, BindingFlags bindingAttr, Binder binder,
		                             CallingConventions callConvention, Type[] types, ParameterModifier[] modifiers)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			if (types == null)
				throw new ArgumentNullException ("types");

			for (int i = 0; i < types.Length; i++) 
				if (types[i] == null)
					throw new ArgumentNullException ("types");

			return GetMethodImpl (name, bindingAttr, binder, callConvention, types, modifiers);
		}

		protected abstract MethodInfo GetMethodImpl (String name, BindingFlags bindingAttr, Binder binder,
		                                             CallingConventions callConvention, Type[] types,
		                                             ParameterModifier[] modifiers);

		/*internal*/ public MethodInfo GetMethodImplInternal (String name, BindingFlags bindingAttr, Binder binder,
															CallingConventions callConvention, Type[] types,
															ParameterModifier[] modifiers)
		{
			return GetMethodImpl (name, bindingAttr, binder, callConvention, types, modifiers);
		}

		/*internal*/ public /*virtual*/ MethodInfo GetMethod (MethodInfo fromNoninstanciated)
                {
			throw new System.InvalidOperationException ("can only be called in generic type");
                }

		/*internal*/ public /*virtual*/ ConstructorInfo GetConstructor (ConstructorInfo fromNoninstanciated)
                {
			throw new System.InvalidOperationException ("can only be called in generic type");
                }

		/*internal*/ public /*virtual*/ FieldInfo GetField (FieldInfo fromNoninstanciated)
                {
			throw new System.InvalidOperationException ("can only be called in generic type");
                }


		public MethodInfo[] GetMethods ()
		{
			return GetMethods (DefaultBindingFlags);
		}

		public abstract MethodInfo[] GetMethods (BindingFlags bindingAttr);

		public Type GetNestedType (String name)
		{
			return GetNestedType (name, DefaultBindingFlags);
		}

		public abstract Type GetNestedType (String name, BindingFlags bindingAttr);

		public Type[] GetNestedTypes ()
		{
			return GetNestedTypes (DefaultBindingFlags);
		}

		public abstract Type[] GetNestedTypes (BindingFlags bindingAttr);


		public PropertyInfo[] GetProperties ()
		{
			return GetProperties (DefaultBindingFlags);
		}

		public abstract PropertyInfo[] GetProperties (BindingFlags bindingAttr);


		public PropertyInfo GetProperty (String name)
		{
			if (name == null)
				throw new ArgumentNullException ("name");

			return GetPropertyImpl (name, DefaultBindingFlags, null, null, null, null);
		}

		public PropertyInfo GetProperty (String name, BindingFlags bindingAttr)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			return GetPropertyImpl (name, bindingAttr, null, null, null, null);
		}

		public PropertyInfo GetProperty (String name, Type returnType)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			return GetPropertyImpl (name, DefaultBindingFlags, null, returnType, null, null);
		}

		public PropertyInfo GetProperty (String name, Type[] types)
		{
			return GetProperty (name, DefaultBindingFlags, null, null, types, null);
		}

		public PropertyInfo GetProperty (String name, Type returnType, Type[] types)
		{
			return GetProperty (name, DefaultBindingFlags, null, returnType, types, null);
		}

		public PropertyInfo GetProperty( String name, Type returnType, Type[] types, ParameterModifier[] modifiers)
		{
			return GetProperty (name, DefaultBindingFlags, null, returnType, types, modifiers);
		}

		public PropertyInfo GetProperty (String name, BindingFlags bindingAttr, Binder binder, Type returnType,
		                                 Type[] types, ParameterModifier[] modifiers)
		{
			if (name == null)
				throw new ArgumentNullException ("name");
			if (types == null)
				throw new ArgumentNullException ("types");

			foreach (Type t in types) {
				if (t == null)
					throw new ArgumentNullException ("types");
			}

			return GetPropertyImpl (name, bindingAttr, binder, returnType, types, modifiers);
		}

		protected abstract PropertyInfo GetPropertyImpl (String name, BindingFlags bindingAttr, Binder binder,
		                                                 Type returnType, Type[] types, ParameterModifier[] modifiers);

		/*internal*/ public PropertyInfo GetPropertyImplInternal (String name, BindingFlags bindingAttr, Binder binder,
													   Type returnType, Type[] types, ParameterModifier[] modifiers)
		{
			return GetPropertyImpl (name, bindingAttr, binder, returnType, types, modifiers);
		}

		protected abstract ConstructorInfo GetConstructorImpl (BindingFlags bindingAttr,
								       Binder binder,
								       CallingConventions callConvention,
								       Type[] types,
								       ParameterModifier[] modifiers);

		protected abstract TypeAttributes GetAttributeFlagsImpl ();
		protected abstract boolean HasElementTypeImpl ();
		protected abstract boolean IsArrayImpl ();
		protected abstract boolean IsByRefImpl ();
		protected abstract boolean IsCOMObjectImpl ();
		protected abstract boolean IsPointerImpl ();
		protected abstract boolean IsPrimitiveImpl ();
		
//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public static /*extern*/ boolean IsArrayImpl (Type type);

		protected /*virtual*/ boolean IsValueTypeImpl ()
		{
			if (this == typeof (ValueType) || this == typeof (Enum))
				return false;

			return IsSubclassOf (typeof (ValueType));
		}

		protected /*virtual*/ boolean IsContextfulImpl ()
		{
			return typeof (ContextBoundObject).IsAssignableFrom (this);
		}

		protected /*virtual*/ boolean IsMarshalByRefImpl ()
		{
			return typeof (MarshalByRefObject).IsAssignableFrom (this);
		}

//		[ComVisible (true)]
		public ConstructorInfo GetConstructor (Type[] types)
		{
			return GetConstructor (BindingFlags.Public|BindingFlags.Instance, null, CallingConventions.Any, types, null);
		}

//		[ComVisible (true)]
		public ConstructorInfo GetConstructor (BindingFlags bindingAttr, Binder binder,
						       Type[] types, ParameterModifier[] modifiers)
		{
			return GetConstructor (bindingAttr, binder, CallingConventions.Any, types, modifiers);
		}

//		[ComVisible (true)]
		public ConstructorInfo GetConstructor (BindingFlags bindingAttr, Binder binder,
						       CallingConventions callConvention,
						       Type[] types, ParameterModifier[] modifiers)
		{
			if (types == null)
				throw new ArgumentNullException ("types");

			foreach (Type t in types) {
				if (t == null)
					throw new ArgumentNullException ("types");
			}

			return GetConstructorImpl (bindingAttr, binder, callConvention, types, modifiers);
		}

//		[ComVisible (true)]
		public ConstructorInfo[] GetConstructors ()
		{
			return GetConstructors (BindingFlags.Public | BindingFlags.Instance);
		}

//		[ComVisible (true)]
		public abstract ConstructorInfo[] GetConstructors (BindingFlags bindingAttr);

		public /*virtual*/ MemberInfo[] GetDefaultMembers ()
		{
			Object [] att = GetCustomAttributes (typeof (DefaultMemberAttribute), true);
			if (att.Length == 0)
				return EmptyArray<MemberInfo>.Value;

			MemberInfo [] member = GetMember (((DefaultMemberAttribute) att [0]).MemberName);
			return (member != null) ? member : EmptyArray<MemberInfo>.Value;
		}

		public /*virtual*/ MemberInfo[] FindMembers (MemberTypes memberType, BindingFlags bindingAttr,
							 MemberFilter filter, Object filterCriteria)
		{
			MemberInfo[] result;
			ArrayList l = new ArrayList ();

			// Console.WriteLine ("FindMembers for {0} (Type: {1}): {2}",
			// this.FullName, this.GetType().FullName, this.obj_address());
			if ((memberType & MemberTypes.Method) != 0) {
				MethodInfo[] c = GetMethods (bindingAttr);
				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria))
							l.Add (m);
					}
				} else {
					l.AddRange (c);
				}
			}
			if ((memberType & MemberTypes.Constructor) != 0) {
				ConstructorInfo[] c = GetConstructors (bindingAttr);
				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria))
							l.Add (m);
					}
				} else {
					l.AddRange (c);
				}
			}
			if ((memberType & MemberTypes.Property) != 0) {
				PropertyInfo[] c = GetProperties (bindingAttr);


				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria))
							l.Add (m);
					}
				} else {
					l.AddRange (c);
				}

			}
			if ((memberType & MemberTypes.Event) != 0) {
				EventInfo[] c = GetEvents (bindingAttr);
				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria))
							l.Add (m);
					}
				} else {
					l.AddRange (c);
				}
			}
			if ((memberType & MemberTypes.Field) != 0) {
				FieldInfo[] c = GetFields (bindingAttr);
				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria))
							l.Add (m);
					}
				} else {
					l.AddRange (c);
				}
			}
			if ((memberType & MemberTypes.NestedType) != 0) {
				Type[] c = GetNestedTypes (bindingAttr);
				if (filter != null) {
					foreach (MemberInfo m in c) {
						if (filter (m, filterCriteria)) {
							l.Add (m);
						}
					}
				} else {
					l.AddRange (c);
				}
			}

			switch (memberType) {
			case MemberTypes.Constructor :
				result = new ConstructorInfo [l.Count];
				break;
			case MemberTypes.Event :
				result = new EventInfo [l.Count];
				break;
			case MemberTypes.Field :
				result = new FieldInfo [l.Count];
				break;
			case MemberTypes.Method :
				result = new MethodInfo [l.Count];
				break;
			case MemberTypes.NestedType :
			case MemberTypes.TypeInfo :
				result = new Type [l.Count];
				break;
			case MemberTypes.Property :
				result = new PropertyInfo [l.Count];
				break;
			default :
				result = new MemberInfo [l.Count];
				break;
			}
			l.CopyTo (result);
			return result;
		}

//		[DebuggerHidden]
//		[DebuggerStepThrough] 
		public Object InvokeMember (String name, BindingFlags invokeAttr, Binder binder, Object target, Object[] args)
		{
			return InvokeMember (name, invokeAttr, binder, target, args, null, null, null);
		}

//		[DebuggerHidden]
//		[DebuggerStepThrough] 
		public Object InvokeMember (String name, BindingFlags invokeAttr, Binder binder,
					    Object target, Object[] args, CultureInfo culture)
		{
			return InvokeMember (name, invokeAttr, binder, target, args, null, culture, null);
		}

		public abstract Object InvokeMember (String name, BindingFlags invokeAttr,
						     Binder binder, Object target, Object[] args,
						     ParameterModifier[] modifiers,
						     CultureInfo culture, String[] namedParameters);

		public /*override*/ String ToString()
		{
			return FullName;
		}

		/*internal*/ public /*virtual*/ Type InternalResolve ()
		{
			return UnderlyingSystemType;
		}

		/*internal*/ public boolean IsSystemType {
			get {
				return _impl.Value != IntPtr.Zero;
			}
		}

//#if NET_4_5
		public /*virtual*/ Type[] GenericTypeArguments {
			get {
				return IsGenericType ? GetGenericArguments () : EmptyTypes;
			}
		}
//#endif

		public /*virtual*/ Type[] GetGenericArguments ()
		{
			throw new NotSupportedException ();
		}

		public /*virtual*/ boolean ContainsGenericParameters {
			get { return false; }
		}

		public /*virtual*/ /*extern*/ boolean IsGenericTypeDefinition {
			[MethodImplAttribute(MethodImplOptions.InternalCall)]
			get;
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*internal*/ public extern Type GetGenericTypeDefinition_impl ();

		public /*virtual*/ Type GetGenericTypeDefinition ()
		{
			throw new NotSupportedException ("Derived classes must provide an implementation.");
		}

		public /*virtual*/ /*extern*/ boolean IsGenericType {
			[MethodImplAttribute(MethodImplOptions.InternalCall)]
			get;
		}
		
//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		static /*extern*/ Type MakeGenericType (Type gt, Type [] types);

		public /*virtual*/ Type MakeGenericType (params Type[] typeArguments)
		{
			if (IsUserType)
				throw new NotSupportedException ();
			if (!IsGenericTypeDefinition)
				throw new InvalidOperationException ("not a generic type definition");
			if (typeArguments == null)
				throw new ArgumentNullException ("typeArguments");
			if (GetGenericArguments().Length != typeArguments.Length)
				throw new ArgumentException (String.Format ("The type or method has {0} generic parameter(s) but {1} generic argument(s) where provided. A generic argument must be provided for each generic parameter.", GetGenericArguments ().Length, typeArguments.Length), "typeArguments");

			boolean hasUserType = false;

			Type[] systemTypes = new Type[typeArguments.Length];
			for (int i = 0; i < typeArguments.Length; ++i) {
				Type t = typeArguments [i];
				if (t == null)
					throw new ArgumentNullException ("typeArguments");

				if (!(t is MonoType))
					hasUserType = true;
				systemTypes [i] = t;
			}

			if (hasUserType) {
#if FULL_AOT_RUNTIME
				throw new NotSupportedException ("User types are not supported under full aot");
#else
				return new MonoGenericClass (this, typeArguments);
#endif
			}

			Type res = MakeGenericType (this, systemTypes);
			if (res == null)
				throw new TypeLoadException ();
			return res;
		}

		public /*virtual*/ boolean IsGenericParameter {
			get {
				return false;
			}
		}

		public boolean IsNested {
			get {
				return DeclaringType != null;
			}
		}

		public boolean IsVisible {
			get {
				if (IsNestedPublic)
					return DeclaringType.IsVisible;

				return IsPublic;
			}
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ int GetGenericParameterPosition ();

		public /*virtual*/ int GenericParameterPosition {
			get {
				int res = GetGenericParameterPosition ();
				if (res < 0)
					throw new InvalidOperationException ();
				return res;
			}
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ GenericParameterAttributes GetGenericParameterAttributes ();

		public /*virtual*/ GenericParameterAttributes GenericParameterAttributes {
			get {
				if (!IsSystemType)
					throw new NotSupportedException ("Derived classes must provide an implementation.");

				if (!IsGenericParameter)
					throw new InvalidOperationException ();

				return GetGenericParameterAttributes ();
			}
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ Type[] GetGenericParameterConstraints_impl ();

		public /*virtual*/ Type[] GetGenericParameterConstraints ()
		{
			if (!IsSystemType)
				throw new InvalidOperationException ();

			if (!IsGenericParameter)
				throw new InvalidOperationException ();

			return GetGenericParameterConstraints_impl ();
		}

		public /*virtual*/ MethodBase DeclaringMethod {
			get {
				return null;
			}
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ Type make_array_type (int rank);

		public /*virtual*/ Type MakeArrayType ()
		{
			if (!IsSystemType)
				throw new NotSupportedException ("Derived classes must provide an implementation.");
			return make_array_type (0);
		}

		public /*virtual*/ Type MakeArrayType (int rank)
		{
			if (!IsSystemType)
				throw new NotSupportedException ("Derived classes must provide an implementation.");
			if (rank < 1 || rank > 255)
				throw new IndexOutOfRangeException ();
			return make_array_type (rank);
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		extern Type make_byref_type ();

		public /*virtual*/ Type MakeByRefType ()
		{
			if (!IsSystemType)
				throw new NotSupportedException ("Derived classes must provide an implementation.");
			if (IsByRef)
				throw new TypeLoadException ("Can not call MakeByRefType on a ByRef type");
			return make_byref_type ();
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		static extern Type MakePointerType (Type type);

		public /*virtual*/ Type MakePointerType ()
		{
			if (!IsSystemType)
				throw new NotSupportedException ("Derived classes must provide an implementation.");
			return MakePointerType (this);
		}

		public static Type ReflectionOnlyGetType (String typeName, 
							  boolean throwIfNotFound, 
							  boolean ignoreCase)
		{
			if (typeName == null)
				throw new ArgumentNullException ("typeName");
			int idx = typeName.IndexOf (',');
			if (idx < 0 || idx == 0 || idx == typeName.Length - 1)
				throw new ArgumentException ("Assembly qualifed type name is required", "typeName");
			String an = typeName.Substring (idx + 1);
			Assembly a;
			try {
				a = Assembly.ReflectionOnlyLoad (an);
			} catch {
				if (throwIfNotFound)
					throw;
				return null;
			}
			return a.GetType (typeName.Substring (0, idx), throwIfNotFound, ignoreCase);
		}

//		[MethodImplAttribute(MethodImplOptions.InternalCall)]
		/*extern*/ void GetPacking (out int packing, out int size);		

		public /*virtual*/ StructLayoutAttribute StructLayoutAttribute {
			get {
#if NET_4_0
				throw new NotSupportedException ();
#else
				return GetStructLayoutAttribute ();
#endif
			}
		}

		/*internal*/ public StructLayoutAttribute GetStructLayoutAttribute ()
		{
			LayoutKind kind;

			if (IsLayoutSequential)
				kind = LayoutKind.Sequential;
			else if (IsExplicitLayout)
				kind = LayoutKind.Explicit;
			else
				kind = LayoutKind.Auto;

			StructLayoutAttribute attr = new StructLayoutAttribute (kind);

			if (IsUnicodeClass)
				attr.CharSet = CharSet.Unicode;
			else if (IsAnsiClass)
				attr.CharSet = CharSet.Ansi;
			else
				attr.CharSet = CharSet.Auto;

			if (kind != LayoutKind.Auto) {
				int packing;
				GetPacking (out packing, out attr.Size);
				// 0 means no data provided, we end up with default value
				if (packing != 0)
					attr.Pack = packing;
			}

			return attr;
		}

		/*internal*/ public Object[] GetPseudoCustomAttributes ()
		{
			int count = 0;

			/* IsSerializable returns true for delegates/enums as well */
			if ((Attributes & TypeAttributes.Serializable) != 0)
				count ++;
			if ((Attributes & TypeAttributes.Import) != 0)
				count ++;

			if (count == 0)
				return null;
			Object[] attrs = new Object [count];
			count = 0;

			if ((Attributes & TypeAttributes.Serializable) != 0)
				attrs [count ++] = new SerializableAttribute ();
			if ((Attributes & TypeAttributes.Import) != 0)
				attrs [count ++] = new ComImportAttribute ();

			return attrs;
		}			


//#if NET_4_0
//		public /*virtual*/ boolean IsEquivalentTo (Type other)
//		{
//			return this == other;
//		}
//#endif

		/* 
		 * Return whenever this Object is an instance of a user defined subclass
		 * of System.Type or an instance of TypeDelegator.
		 * A user defined type is not simply the opposite of a system type.
		 * It's any class that's neither a SRE or runtime baked type.
		 */
		/*internal*/ public /*virtual*/ boolean IsUserType {
			get {
				return true;
			}
		}

//#if !MOBILE
//		void _Type.GetIDsOfNames ([In] ref Guid riid, IntPtr rgszNames, uint cNames, uint lcid, IntPtr rgDispId)
//		{
//			throw new NotImplementedException ();
//		}
//
//		void _Type.GetTypeInfo (uint iTInfo, uint lcid, IntPtr ppTInfo)
//		{
//			throw new NotImplementedException ();
//		}
//
//		void _Type.GetTypeInfoCount (out uint pcTInfo)
//		{
//			throw new NotImplementedException ();
//		}
//
//		void _Type.Invoke (uint dispIdMember, [In] ref Guid riid, uint lcid, short wFlags, IntPtr pDispParams, IntPtr pVarResult, IntPtr pExcepInfo, IntPtr puArgErr)
//		{
//			throw new NotImplementedException ();
//		}
//#endif
	}