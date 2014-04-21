package org.summer.view.widget.reflection;

import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IEnumerable;

//[ComVisible (true)]
//	[ComDefaultInterfaceAttribute (typeof (_MemberInfo))]
//	[Serializable]
//	[ClassInterface(ClassInterfaceType.None)]
//	[PermissionSet (SecurityAction.InheritanceDemand, Unrestricted = true)]
//#if MOBILE
//	public abstract class MemberInfo : ICustomAttributeProvider {
//#else
	public abstract class MemberInfo implements ICustomAttributeProvider, _MemberInfo {
//#endif

		protected MemberInfo ()
		{
		}

		public abstract Type DeclaringType {
			get;
		}

		public abstract MemberTypes MemberType {
			get;
		}

		public abstract String Name {
			get;
		}

		public abstract Type ReflectedType {
			get;
		}

		public /*virtual*/ Module Module {
			get {
				return DeclaringType.Module;
			}
		}

		public abstract boolean IsDefined (Type attributeType, boolean inherit);

		public abstract Object [] GetCustomAttributes (boolean inherit);

		public abstract Object [] GetCustomAttributes (Type attributeType, boolean inherit);

		public /*virtual*/ extern int MetadataToken {
			[MethodImplAttribute (MethodImplOptions.InternalCall)]
			get;
		}

//#if NET_4_0
//		public override boolean Equals (Object obj)
//		{
//			return obj == (Object) this;
//		}
//
//		public override int GetHashCode ()
//		{
//			return base.GetHashCode ();
//		}
//
//		public static boolean operator == (MemberInfo left, MemberInfo right)
//		{
//			if ((Object)left == (Object)right)
//				return true;
//			if ((Object)left == null ^ (Object)right == null)
//				return false;
//			return left.Equals (right);
//		}
//
//		public static boolean operator != (MemberInfo left, MemberInfo right)
//		{
//			if ((Object)left == (Object)right)
//				return false;
//			if ((Object)left == null ^ (Object)right == null)
//				return true;
//			return !left.Equals (right);
//		}
//
//		public /*virtual*/ IList<CustomAttributeData> GetCustomAttributesData () {
//			throw new NotImplementedException ();
//		}
//#endif

//#if NET_4_5
		public /*virtual*/ IEnumerable<CustomAttributeData> CustomAttributes {
			get { return GetCustomAttributesData (); }
		}
//#endif

//#if !MOBILE
		void _MemberInfo.GetIDsOfNames ([In] ref Guid riid, IntPtr rgszNames, uint cNames, uint lcid, IntPtr rgDispId)
		{
			throw new NotImplementedException ();
		}

		Type _MemberInfo.GetType ()
		{
			// Required or Object::GetType becomes /*virtual*/ final
			return base.GetType ();
		}

		void _MemberInfo.GetTypeInfo (uint iTInfo, uint lcid, IntPtr ppTInfo)
		{
			throw new NotImplementedException ();
		}

		void _MemberInfo.GetTypeInfoCount (out uint pcTInfo)
		{
			throw new NotImplementedException ();
		}

		void _MemberInfo.Invoke (uint dispIdMember, [In] ref Guid riid, uint lcid, short wFlags, IntPtr pDispParams, IntPtr pVarResult, IntPtr pExcepInfo, IntPtr puArgErr)
		{
			throw new NotImplementedException ();
		}
//#endif
	}