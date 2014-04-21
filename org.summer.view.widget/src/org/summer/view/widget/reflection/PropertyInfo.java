package org.summer.view.widget.reflection;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.data.BindingFlags;
    public abstract class PropertyInfo extends MemberInfo implements _PropertyInfo
    { 
//        #region Constructor
        protected PropertyInfo() { } 
//        #endregion 

//#if !FEATURE_CORECLR 
//        public static boolean operator ==(PropertyInfo left, PropertyInfo right)
//        {
//            if (ReferenceEquals(left, right))
//                return true; 
//
//            if ((Object)left == null || (Object)right == null || 
//                left is RuntimePropertyInfo || right is RuntimePropertyInfo) 
//            {
//                return false; 
//            }
//            return left.Equals(right);
//        }
// 
//        [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
//        public static boolean operator !=(PropertyInfo left, PropertyInfo right) 
//        { 
//            return !(left == right);
//        } 
//
//        public /*override*/ boolean Equals(Object obj)
//        {
//            return base.Equals(obj); 
//        }
// 
//        public /*override*/ int GetHashCode() 
//        {
//            return base.GetHashCode(); 
//        }
//#endif // !FEATURE_CORECLR

//        #region MemberInfo Overrides 
        public /*override*/ MemberTypes MemberType { get { return System.Reflection.MemberTypes.Property; } }
//        #endregion 
 
//        #region Public Abstract\Virtual Members
        public /*virtual*/ Object GetConstantValue() 
        {
            throw new NotImplementedException();
        }
 
        public /*virtual*/ Object GetRawConstantValue()
        { 
            throw new NotImplementedException(); 
        }
 
        public abstract Type PropertyType { get; }

        public abstract void SetValue(Object obj, Object value, BindingFlags invokeAttr, Binder binder, Object[] index, CultureInfo culture);
 
        public abstract MethodInfo[] GetAccessors(boolean nonPublic);
 
        public abstract MethodInfo GetGetMethod(boolean nonPublic); 

        public abstract MethodInfo GetSetMethod(boolean nonPublic); 

        public abstract ParameterInfo[] GetIndexParameters();

        public abstract PropertyAttributes Attributes { get; } 

        public abstract boolean CanRead { get; } 
 
        public abstract boolean CanWrite { get; }
 
//        [DebuggerStepThroughAttribute]
//        [Diagnostics.DebuggerHidden]
        public Object GetValue(Object obj)
        { 
            return GetValue(obj, null);
        } 
 
//        [DebuggerStepThroughAttribute]
//        [Diagnostics.DebuggerHidden] 
        public /*virtual*/ Object GetValue(Object obj,Object[] index)
        {
            return GetValue(obj, BindingFlags.Default, null, index, null);
        } 

        public abstract Object GetValue(Object obj, BindingFlags invokeAttr, Binder binder, Object[] index, CultureInfo culture); 
 
//        [DebuggerStepThroughAttribute]
//        [Diagnostics.DebuggerHidden] 
//#if !FEATURE_CORECLR
//        [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
//#endif
        public void SetValue(Object obj, Object value) 
        {
            SetValue(obj, value, null); 
        } 

//        [DebuggerStepThroughAttribute] 
//        [Diagnostics.DebuggerHidden]
        public /*virtual*/ void SetValue(Object obj, Object value, Object[] index)
        {
            SetValue(obj, value, BindingFlags.Default, null, index, null); 
        }
//        #endregion 
// 
//        #region Public Members
        public /*virtual*/ Type[] GetRequiredCustomModifiers() { return new Type[0]; } 

        public /*virtual*/ Type[] GetOptionalCustomModifiers() { return new Type[0]; }

        public MethodInfo[] GetAccessors() { return GetAccessors(false); } 

        public /*virtual*/ MethodInfo GetMethod 
        { 
            get
            { 
                return GetGetMethod(true);
            }
        }
 
        public /*virtual*/ MethodInfo SetMethod
        { 
            get 
            {
                return GetSetMethod(true); 
            }
        }

        public MethodInfo GetGetMethod() { return GetGetMethod(false); } 

        public MethodInfo GetSetMethod() { return GetSetMethod(false); } 
 
        public boolean IsSpecialName { get { return(Attributes & PropertyAttributes.SpecialName) != 0; } }
//        #endregion 

        Type _PropertyInfo.GetType()
        {
            return base.GetType(); 
        }
 
        void _PropertyInfo.GetTypeInfoCount(out uint pcTInfo) 
        {
            throw new NotImplementedException(); 
        }

        void _PropertyInfo.GetTypeInfo(uint iTInfo, uint lcid, IntPtr ppTInfo)
        { 
            throw new NotImplementedException();
        } 
 
        void _PropertyInfo.GetIDsOfNames([In] ref Guid riid, IntPtr rgszNames, uint cNames, uint lcid, IntPtr rgDispId)
        { 
            throw new NotImplementedException();
        }

        // If you implement this method, make sure to include _PropertyInfo.Invoke in VM\DangerousAPIs.h and 
        // include _PropertyInfo in SystemDomain::IsReflectionInvocationMethod in AppDomain.cpp.
        void _PropertyInfo.Invoke(uint dispIdMember, [In] ref Guid riid, uint lcid, short wFlags, IntPtr pDispParams, IntPtr pVarResult, IntPtr pExcepInfo, IntPtr puArgErr) 
        { 
            throw new NotImplementedException();
        } 
    }