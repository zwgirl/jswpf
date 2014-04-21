package org.summer.view.widget.reflection;

import java.lang.reflect.Array;
import java.security.Signature;

import org.omg.CORBA.Environment;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.ISerializable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.data.BindingFlags;
    /*internal*/ public /*unsafe sealed*/ class RuntimePropertyInfo extends PropertyInfo implements ISerializable 
    {
//        #region Private Data Members 
        private int m_token; 
        private String m_name;
//        [System.Security.SecurityCritical] 
        private void m_utf8name;
        private PropertyAttributes m_flags;
        private RuntimeTypeCache m_reflectedTypeCache;
        private RuntimeMethodInfo m_getterMethod; 
        private RuntimeMethodInfo m_setterMethod;
        private MethodInfo[] m_otherMethod; 
        private RuntimeType m_declaringType; 
        private BindingFlags m_bindingFlags;
        private Signature m_signature; 
        private ParameterInfo[] m_parameters;
//        #endregion

//        #region Constructor 
//        [System.Security.SecurityCritical]  // auto-generated
        /*internal*/ public RuntimePropertyInfo( 
            int tkProperty, RuntimeType declaredType, RuntimeTypeCache reflectedTypeCache, out boolean isPrivate) 
        {
            Contract.Requires(declaredType != null); 
            Contract.Requires(reflectedTypeCache != null);
            Contract.Assert(!reflectedTypeCache.IsGlobal);

            MetadataImport scope = declaredType.GetRuntimeModule().MetadataImport; 

            m_token = tkProperty; 
            m_reflectedTypeCache = reflectedTypeCache; 
            m_declaringType = declaredType;
 
            ConstArray sig;
            scope.GetPropertyProps(tkProperty, out m_utf8name, out m_flags, out sig);

            RuntimeMethodInfo dummy; 
            Associates.AssignAssociates(scope, tkProperty, declaredType, reflectedTypeCache.GetRuntimeType(),
                out dummy, out dummy, out dummy, 
                out m_getterMethod, out m_setterMethod, out m_otherMethod, 
                out isPrivate, out m_bindingFlags);
        } 
//        #endregion
//
//        #region Internal Members
//        [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)] 
        /*internal*/ public /*override*/ boolean CacheEquals(Object o)
        { 
            RuntimePropertyInfo m = o as RuntimePropertyInfo; 

            if ((Object)m == null) 
                return false;

            return m.m_token == m_token &&
                RuntimeTypeHandle.GetModule(m_declaringType).Equals( 
                    RuntimeTypeHandle.GetModule(m.m_declaringType));
        } 
 
        /*internal*/ public Signature Signature
        { 
            [System.Security.SecuritySafeCritical]  // auto-generated
            get
            {
                if (m_signature == null) 
                {
                    PropertyAttributes flags; 
                    ConstArray sig; 

                    void* name; 
                    GetRuntimeModule().MetadataImport.GetPropertyProps(
                        m_token, out name, out flags, out sig);

                    m_signature = new Signature(sig.Signature.ToPointer(), (int)sig.Length, m_declaringType); 
                }
 
                return m_signature; 
            }
        } 
        /*internal*/ public boolean EqualsSig(RuntimePropertyInfo target)
        {
            //@Asymmetry - Legacy policy is to remove duplicate properties, including hidden properties.
            //             The comparison is done by name and by sig. The EqualsSig comparison is expensive 
            //             but forutnetly it is only called when an inherited property is hidden by name or
            //             when an interfaces declare properies with the same signature. 
            //             Note that we intentionally don't resolve generic arguments so that we don't treat 
            //             signatures that only match in certain instantiations as duplicates. This has the
            //             down side of treating overriding and overriden properties as different properties 
            //             in some cases. But PopulateProperties in rttype.cs should have taken care of that
            //             by comparing VTable slots.
            //
            //             Class C1(Of T, Y) 
            //                 Property Prop1(ByVal t1 As T) As Integer
            //                     Get 
            //                         ... ... 
            //                     End Get
            //                 End Property 
            //                 Property Prop1(ByVal y1 As Y) As Integer
            //                     Get
            //                         ... ...
            //                     End Get 
            //                 End Property
            //             End Class 
            // 

            Contract.Requires(Name.Equals(target.Name)); 
            Contract.Requires(this != target);
            Contract.Requires(this.ReflectedType == target.ReflectedType);

            return Signature.CompareSig(this.Signature, target.Signature); 
        }
        /*internal*/ public BindingFlags BindingFlags { get { return m_bindingFlags; } } 
//        #endregion 
//
//        #region Object Overrides 
        public /*override*/ String ToString()
        {
            return FormatNameAndSig(false);
        } 

        private String FormatNameAndSig(boolean serialization) 
        { 
            StringBuilder sbName = new StringBuilder(PropertyType.FormatTypeName(serialization));
 
            sbName.Append(" ");
            sbName.Append(Name);

            RuntimeType[] arguments = Signature.Arguments; 
            if (arguments.Length > 0)
            { 
                sbName.Append(" ["); 
                sbName.Append(MethodBase.ConstructParameters(arguments, Signature.CallingConvention, serialization));
                sbName.Append("]"); 
            }

            return sbName.ToString();
        } 
//        #endregion
// 
//        #region ICustomAttributeProvider 
        public /*override*/ Object[] GetCustomAttributes(boolean inherit)
        { 
            return CustomAttribute.GetCustomAttributes(this, typeof(Object) as RuntimeType);
        }

        public /*override*/ Object[] GetCustomAttributes(Type attributeType, boolean inherit) 
        {
            if (attributeType == null) 
                throw new ArgumentNullException("attributeType"); 
            Contract.EndContractBlock();
 
            RuntimeType attributeRuntimeType = attributeType.UnderlyingSystemType as RuntimeType;

            if (attributeRuntimeType == null)
                throw new ArgumentException(Environment.GetResourceString("Arg_MustBeType"),"attributeType"); 

            return CustomAttribute.GetCustomAttributes(this, attributeRuntimeType); 
        } 

//        [System.Security.SecuritySafeCritical]  // auto-generated 
        public /*override*/ boolean IsDefined(Type attributeType, boolean inherit)
        {
            if (attributeType == null)
                throw new ArgumentNullException("attributeType"); 
            Contract.EndContractBlock();
 
            RuntimeType attributeRuntimeType = attributeType.UnderlyingSystemType as RuntimeType; 

            if (attributeRuntimeType == null) 
                throw new ArgumentException(Environment.GetResourceString("Arg_MustBeType"),"attributeType");

            return CustomAttribute.IsDefined(this, attributeRuntimeType);
        } 

        public /*override*/ IList<CustomAttributeData> GetCustomAttributesData() 
        { 
            return CustomAttributeData.GetCustomAttributesInternal(this);
        } 
//        #endregion
//
//        #region MemberInfo Overrides
        public /*override*/ MemberTypes MemberType { get { return MemberTypes.Property; } } 
        public /*override*/ String Name
        { 
            [System.Security.SecuritySafeCritical]  // auto-generated 
            get
            { 
                if (m_name == null)
                    m_name = new Utf8String(m_utf8name).ToString();

                return m_name; 
            }
        } 
        public /*override*/ Type DeclaringType 
        {
            get 
            {
                return m_declaringType;
            }
        } 

        public /*override*/ Type ReflectedType 
        { 
            get
            { 
                return ReflectedTypeInternal;
            }
        }
 
        private RuntimeType ReflectedTypeInternal
        { 
            get 
            {
                return m_reflectedTypeCache.GetRuntimeType(); 
            }
        }

        public /*override*/ int MetadataToken { get { return m_token; } } 

        public /*override*/ Module Module { get { return GetRuntimeModule(); } } 
        /*internal*/ public RuntimeModule GetRuntimeModule() { return m_declaringType.GetRuntimeModule(); } 
//        #endregion
 
//        #region PropertyInfo Overrides

//        #region Non Dynamic
 
        public /*override*/ Type[] GetRequiredCustomModifiers()
        { 
            return Signature.GetCustomModifiers(0, true); 
        }
 
        public /*override*/ Type[] GetOptionalCustomModifiers()
        {
            return Signature.GetCustomModifiers(0, false);
        } 

//        [System.Security.SecuritySafeCritical]  // auto-generated 
        /*internal*/ public Object GetConstantValue(boolean raw) 
        {
            Object defaultValue = MdConstant.GetValue(GetRuntimeModule().MetadataImport, m_token, PropertyType.GetTypeHandleInternal(), raw); 

            if (defaultValue == DBNull.Value)
                // Arg_EnumLitValueNotFound -> "Literal value was not found."
                throw new InvalidOperationException(Environment.GetResourceString("Arg_EnumLitValueNotFound")); 

            return defaultValue; 
        } 

        public /*override*/ Object GetConstantValue() { return GetConstantValue(false); } 

        public /*override*/ Object GetRawConstantValue() { return GetConstantValue(true); }

        public /*override*/ MethodInfo[] GetAccessors(boolean nonPublic) 
        {
            List<MethodInfo> accessorList = new List<MethodInfo>(); 
 
            if (Associates.IncludeAccessor(m_getterMethod, nonPublic))
                accessorList.Add(m_getterMethod); 

            if (Associates.IncludeAccessor(m_setterMethod, nonPublic))
                accessorList.Add(m_setterMethod);
 
            if ((Object)m_otherMethod != null)
            { 
                for(int i = 0; i < m_otherMethod.Length; i ++) 
                {
                    if (Associates.IncludeAccessor(m_otherMethod[i] as MethodInfo, nonPublic)) 
                        accessorList.Add(m_otherMethod[i]);
                }
            }
            return accessorList.ToArray(); 
        }
 
        public /*override*/ Type PropertyType 
        {
            get { return Signature.ReturnType; } 
        }

        public /*override*/ MethodInfo GetGetMethod(boolean nonPublic)
        { 
            if (!Associates.IncludeAccessor(m_getterMethod, nonPublic))
                return null; 
 
            return m_getterMethod;
        } 

//#if !FEATURE_CORECLR
//        [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
//#endif 
        public /*override*/ MethodInfo GetSetMethod(boolean nonPublic)
        { 
            if (!Associates.IncludeAccessor(m_setterMethod, nonPublic)) 
                return null;
 
            return m_setterMethod;
        }

        public /*override*/ ParameterInfo[] GetIndexParameters() 
        {
            ParameterInfo[] indexParams = GetIndexParametersNoCopy(); 
 
            int numParams = indexParams.Length;
 
            if (numParams == 0)
                return indexParams;

            ParameterInfo[] ret = new ParameterInfo[numParams]; 

            Array.Copy(indexParams, ret, numParams); 
 
            return ret;
        } 

        /*internal*/ public ParameterInfo[] GetIndexParametersNoCopy()
        {
            // @History - Logic ported from RTM 

            // No need to lock because we don't guarantee the uniqueness of ParameterInfo objects 
            if (m_parameters == null) 
            {
                int numParams = 0; 
                ParameterInfo[] methParams = null;

                // First try to get the Get method.
                MethodInfo m = GetGetMethod(true); 
                if (m != null)
                { 
                    // There is a Get method so use it. 
                    methParams = m.GetParametersNoCopy();
                    numParams = methParams.Length; 
                }
                else
                {
                    // If there is no Get method then use the Set method. 
                    m = GetSetMethod(true);
 
                    if (m != null) 
                    {
                        methParams = m.GetParametersNoCopy(); 
                        numParams = methParams.Length - 1;
                    }
                }
 
                // Now copy over the parameter info's and change their
                // owning member info to the current property info. 
 
                ParameterInfo[] propParams = new ParameterInfo[numParams];
 
                for (int i = 0; i < numParams; i++)
                    propParams[i] = new RuntimeParameterInfo((RuntimeParameterInfo)methParams[i], this);

                m_parameters = propParams; 
            }
 
            return m_parameters; 
        }
 
        public /*override*/ PropertyAttributes Attributes
        {
            get
            { 
                return m_flags;
            } 
        } 

        public /*override*/ boolean CanRead 
        {
            get
            {
                return m_getterMethod != null; 
            }
        } 
 
        public /*override*/ boolean CanWrite
        { 
            get
            {
                return m_setterMethod != null;
            } 
        }
//        #endregion 
 
//        #region Dynamic
//        [DebuggerStepThroughAttribute] 
//        [Diagnostics.DebuggerHidden]
//#if !FEATURE_CORECLR
//        [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
//#endif 
        public /*override*/ Object GetValue(Object obj,Object[] index)
        { 
            return GetValue(obj, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static, 
                null, index, null);
        } 

//        [DebuggerStepThroughAttribute]
//        [Diagnostics.DebuggerHidden]
        public /*override*/ Object GetValue(Object obj, BindingFlags invokeAttr, Binder binder, Object[] index, CultureInfo culture) 
        {
 
            MethodInfo m = GetGetMethod(true); 
            if (m == null)
                throw new ArgumentException(System.Environment.GetResourceString("Arg_GetMethNotFnd")); 
            return m.Invoke(obj, invokeAttr, binder, index, null);
        }

//        [DebuggerStepThroughAttribute] 
//        [Diagnostics.DebuggerHidden]
//#if !FEATURE_CORECLR 
//        [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")] 
//#endif
        public /*override*/ void SetValue(Object obj, Object value, Object[] index) 
        {
            SetValue(obj,
                    value,
                    BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static, 
                    null,
                    index, 
                    null); 
        }
 
//        [DebuggerStepThroughAttribute]
//        [Diagnostics.DebuggerHidden]
        public /*override*/ void SetValue(Object obj, Object value, BindingFlags invokeAttr, Binder binder, Object[] index, CultureInfo culture)
        { 

            MethodInfo m = GetSetMethod(true); 
 
            if (m == null)
                throw new ArgumentException(System.Environment.GetResourceString("Arg_SetMethNotFnd")); 

            Object[] args = null;

            if (index != null) 
            {
                args = new Object[index.length + 1]; 
 
                for(int i=0;i<index.length;i++)
                    args[i] = index[i]; 

                args[index.length] = value;
            }
            else 
            {
                args = new Object[1]; 
                args[0] = value; 
            }
 
            m.Invoke(obj, invokeAttr, binder, args, culture);
        }
//        #endregion
// 
//        #endregion
// 
//        #region ISerializable Implementation 
//        [System.Security.SecurityCritical]  // auto-generated
        public void GetObjectData(SerializationInfo info, StreamingContext context) 
        {
            if (info == null)
                throw new ArgumentNullException("info");
            Contract.EndContractBlock(); 

            MemberInfoSerializationHolder.GetSerializationInfo( 
                info, 
                Name,
                ReflectedTypeInternal, 
                ToString(),
                SerializationToString(),
                MemberTypes.Property,
                null); 
        }
 
        /*internal*/ public String SerializationToString() 
        {
            return FormatNameAndSig(true); 
        }
//        #endregion
    }