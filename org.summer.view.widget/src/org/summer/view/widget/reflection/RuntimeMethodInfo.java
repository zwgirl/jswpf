package org.summer.view.widget.reflection;

import java.lang.reflect.Array;
import java.security.Security;
import java.security.Signature;

import org.omg.CORBA.Environment;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.ISerializable;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.BindingFlags;



//[Serializable]
/*internal*/ public /*sealed*/ class RuntimeMethodInfo extends MethodInfo implements ISerializable, IRuntimeMethodInfo
{
//  #region Private Data Members 
  private IntPtr m_handle;
  private RuntimeTypeCache m_reflectedTypeCache; 
  private String m_name; 
  private String m_toString;
  private ParameterInfo[] m_parameters; 
  private ParameterInfo m_returnParameter;
  private BindingFlags m_bindingFlags;
  private MethodAttributes m_methodAttributes;
  private Signature m_signature; 
  private RuntimeType m_declaringType;
  private Object m_keepalive; 
  private INVOCATION_FLAGS m_invocationFlags; 

//#if FEATURE_APPX 
  private boolean IsNonW8PFrameworkAPI()
  {
      if (m_declaringType.IsArray && IsPublic && !IsStatic)
          return false; 

      RuntimeAssembly rtAssembly = GetRuntimeAssembly(); 
      if (rtAssembly.IsFrameworkAssembly()) 
      {
          int ctorToken = rtAssembly.InvocableAttributeCtorToken; 
          if (System.Reflection.MetadataToken.IsNullToken(ctorToken) ||
              !CustomAttribute.IsAttributeDefined(GetRuntimeModule(), MetadataToken, ctorToken))
              return true;
      } 

      if (GetRuntimeType().IsNonW8PFrameworkAPI()) 
          return true; 

      if (IsGenericMethod && !IsGenericMethodDefinition) 
      {
          foreach (Type t in GetGenericArguments())
          {
              if (((RuntimeType)t).IsNonW8PFrameworkAPI()) 
                  return true;
          } 
      } 

      return false; 
  }

  /*internal*/ public /*override*/ boolean IsDynamicallyInvokable
  { 
      get
      { 
          return !AppDomain.ProfileAPICheck || !IsNonW8PFrameworkAPI(); 
      }
  } 
//#endif

  /*internal*/ public INVOCATION_FLAGS InvocationFlags
  { 
//      [System.Security.SecuritySafeCritical]
      get 
      { 
          if ((m_invocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_INITIALIZED) == 0)
          { 
              INVOCATION_FLAGS invocationFlags = INVOCATION_FLAGS.INVOCATION_FLAGS_UNKNOWN;

              Type declaringType = DeclaringType;

              //
              // first take care of all the NO_INVOKE cases. 
              if (ContainsGenericParameters || 
                   ReturnType.IsByRef ||
                   (declaringType != null && declaringType.ContainsGenericParameters) || 
                   ((CallingConvention & CallingConventions.VarArgs) == CallingConventions.VarArgs) ||
                   ((Attributes & MethodAttributes.RequireSecObject) == MethodAttributes.RequireSecObject))
              {
                  // We don't need other flags if this method cannot be invoked 
                  invocationFlags = INVOCATION_FLAGS.INVOCATION_FLAGS_NO_INVOKE;
              } 
              else 
              {
                  // this should be an invocable method, determine the other flags that participate in invocation 
                  invocationFlags = RuntimeMethodHandle.GetSecurityFlags(this);

                  if ((invocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_NEED_SECURITY) == 0)
                  { 
                      if ( (Attributes & MethodAttributes.MemberAccessMask) != MethodAttributes.Public ||
                           (declaringType != null && declaringType.NeedsReflectionSecurityCheck) ) 
                      { 
                          // If method is non-public, or declaring type is not visible
                          invocationFlags |= INVOCATION_FLAGS.INVOCATION_FLAGS_NEED_SECURITY; 
                      }
                      else if (IsGenericMethod)
                      {
                          Type[] genericArguments = GetGenericArguments(); 

                          for (int i = 0; i < genericArguments.Length; i++) 
                          { 
                              if (genericArguments[i].NeedsReflectionSecurityCheck)
                              { 
                                  invocationFlags |= INVOCATION_FLAGS.INVOCATION_FLAGS_NEED_SECURITY;
                                  break;
                              }
                          } 
                      }
                  } 
              } 

//#if FEATURE_APPX 
              if (AppDomain.ProfileAPICheck && IsNonW8PFrameworkAPI())
                  invocationFlags |= INVOCATION_FLAGS.INVOCATION_FLAGS_NON_W8P_FX_API;
//#endif // FEATURE_APPX

              m_invocationFlags = invocationFlags | INVOCATION_FLAGS.INVOCATION_FLAGS_INITIALIZED;
          } 

          return m_invocationFlags;
      } 
  }
//  #endregion

//  #region Constructor 
//  [System.Security.SecurityCritical]  // auto-generated
  /*internal*/ public RuntimeMethodInfo( 
      RuntimeMethodHandleInternal handle, RuntimeType declaringType, 
      RuntimeTypeCache reflectedTypeCache, MethodAttributes methodAttributes, BindingFlags bindingFlags, Object keepalive)
  { 
      Contract.Ensures(!m_handle.IsNull());

      Contract.Assert(!handle.IsNullHandle());
      Contract.Assert(methodAttributes == RuntimeMethodHandle.GetAttributes(handle)); 

      m_bindingFlags = bindingFlags; 
      m_declaringType = declaringType; 
      m_keepalive = keepalive;
      m_handle = handle.Value; 
      m_reflectedTypeCache = reflectedTypeCache;
      m_methodAttributes = methodAttributes;
  }
//  #endregion 

//#if FEATURE_REMOTING 
//  #region Legacy Remoting Cache 
  // The size of CachedData is accounted for by BaseObjectWithCachedData in Object.h.
  // This member is currently being used by Remoting for caching remoting data. If you 
  // need to cache data here, talk to the Remoting team to work out a mechanism, so that
  // both caching systems can happily work together.
  private RemotingMethodCachedData m_cachedData;

  /*internal*/ public RemotingMethodCachedData RemotingCache
  { 
      get 
      {
          // This grabs an /*internal*/ public copy of m_cachedData and uses 
          // that instead of looking at m_cachedData directly because
          // the cache may get cleared asynchronously.  This prevents
          // us from having to take a lock.
          RemotingMethodCachedData cache = m_cachedData; 
          if (cache == null)
          { 
              cache = new RemotingMethodCachedData(this); 
              RemotingMethodCachedData ret = Interlocked.CompareExchange(/*ref*/ m_cachedData, cache, null);
              if (ret != null) 
                  cache = ret;
          }
          return cache;
      } 
  }
//  #endregion 
//#endif //FEATURE_REMOTING 

//  #region Private Methods 
  RuntimeMethodHandleInternal IRuntimeMethodInfo.Value
  {
      [System.Security.SecuritySafeCritical]
      get 
      {
          return new RuntimeMethodHandleInternal(m_handle); 
      } 
  }

  private RuntimeType ReflectedTypeInternal
  {
      get
      { 
          return m_reflectedTypeCache.GetRuntimeType();
      } 
  } 

//  [System.Security.SecurityCritical]  // auto-generated 
  private ParameterInfo[] FetchNonReturnParameters()
  {
      if (m_parameters == null)
          m_parameters = RuntimeParameterInfo.GetParameters(this, this, Signature); 

      return m_parameters; 
  } 

//  [System.Security.SecurityCritical]  // auto-generated 
  private ParameterInfo FetchReturnParameter()
  {
      if (m_returnParameter == null)
          m_returnParameter = RuntimeParameterInfo.GetReturnParameter(this, this, Signature); 

      return m_returnParameter; 
  } 
//  #endregion

//  #region Internal Members
  /*internal*/ public /*override*/ String FormatNameAndSig(boolean serialization)
  {
      // Serialization uses ToString to resolve MethodInfo overloads. 
      StringBuilder sbName = new StringBuilder(Name);

      // serialization == true: use unambiguous (except for assembly name) type names to distinguish between overloads. 
      // serialization == false: use basic format to maintain backward compatibility of MethodInfo.ToString().
      TypeNameFormatFlags format = serialization ? TypeNameFormatFlags.FormatSerialization : TypeNameFormatFlags.FormatBasic; 

      if (IsGenericMethod)
          sbName.Append(RuntimeMethodHandle.ConstructInstantiation(this, format));

      sbName.Append("(");
      sbName.Append(ConstructParameters(GetParameterTypes(), CallingConvention, serialization)); 
      sbName.Append(")"); 

      return sbName.ToString(); 
  }

//  [ReliabilityContract(Consistency.WillNotCorruptState, Cer.Success)]
//#if !FEATURE_CORECLR 
//  [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
//#endif 
  /*internal*/ public /*override*/ boolean CacheEquals(Object o) 
  {
      RuntimeMethodInfo m = o as RuntimeMethodInfo; 

      if ((Object)m == null)
          return false;

      return m.m_handle == m_handle;
  } 

  /*internal*/ public Signature Signature
  { 
      get
      {
          if (m_signature == null)
              m_signature = new Signature(this, m_declaringType); 

          return m_signature; 
      } 
  }

  /*internal*/ public BindingFlags BindingFlags { get { return m_bindingFlags; } }

  // Differs from MethodHandle in that it will return a valid handle even for reflection only loaded types
  /*internal*/ public RuntimeMethodHandle GetMethodHandle() 
  {
      return new RuntimeMethodHandle(this); 
  } 

  [System.Security.SecuritySafeCritical]  // auto-generated 
  /*internal*/ public RuntimeMethodInfo GetParentDefinition()
  {
      if (!IsVirtual || m_declaringType.IsInterface)
          return null; 

      RuntimeType parent = (RuntimeType)m_declaringType.BaseType; 

      if (parent == null)
          return null; 

      int slot = RuntimeMethodHandle.GetSlot(this);

      if (RuntimeTypeHandle.GetNumVirtuals(parent) <= slot) 
          return null;

      return (RuntimeMethodInfo)RuntimeType.GetMethodBase(parent, RuntimeTypeHandle.GetMethodAt(parent, slot)); 
  }

  // Unlike DeclaringType, this will return a valid type even for global methods
  /*internal*/ public RuntimeType GetDeclaringTypeInternal()
  {
      return m_declaringType; 
  }

//  #endregion 

//  #region Object Overrides 
  public /*override*/ String ToString()
  {
      if (m_toString == null)
          m_toString = ReturnType.FormatTypeName() + " " + FormatNameAndSig(); 

      return m_toString; 
  } 

  public /*override*/ int GetHashCode() 
  {
      // See RuntimeMethodInfo.Equals() below.
      if (IsGenericMethod)
          return ValueType.GetHashCodeOfPtr(m_handle); 
      else
          return base.GetHashCode(); 
  } 

//  [System.Security.SecuritySafeCritical]  // auto-generated 
  public /*override*/ boolean Equals(Object obj)
  {
      if (!IsGenericMethod)
          return obj == (Object)this; 

      // We cannot do simple Object identity comparisons for generic methods. 
      // Equals will be called in CerHashTable when RuntimeType+RuntimeTypeCache.GetGenericMethodInfo() 
      // retrive items from and insert items into s_methodInstantiations which is a CerHashtable.
      // 

      RuntimeMethodInfo mi = obj as RuntimeMethodInfo;

      if (mi == null || !mi.IsGenericMethod) 
          return false;

      // now we know that both operands are generic methods 

      IRuntimeMethodInfo handle1 = RuntimeMethodHandle.StripMethodInstantiation(this); 
      IRuntimeMethodInfo handle2 = RuntimeMethodHandle.StripMethodInstantiation(mi);
      if (handle1.Value.Value != handle2.Value.Value)
          return false;

      Type[] lhs = GetGenericArguments();
      Type[] rhs = mi.GetGenericArguments(); 

      if (lhs.Length != rhs.Length)
          return false; 

      for (int i = 0; i < lhs.Length; i++)
      {
          if (lhs[i] != rhs[i]) 
              return false;
      } 

      if (DeclaringType != mi.DeclaringType)
          return false; 

      if (ReflectedType != mi.ReflectedType)
          return false;

      return true;
  } 
//  #endregion 

//  #region ICustomAttributeProvider 
//  [System.Security.SecuritySafeCritical]  // auto-generated
  public /*override*/ Object[] GetCustomAttributes(boolean inherit)
  {
      return CustomAttribute.GetCustomAttributes(this, typeof(Object) as RuntimeType as RuntimeType, inherit); 
  }

//  [System.Security.SecuritySafeCritical]  // auto-generated 
  public /*override*/ Object[] GetCustomAttributes(Type attributeType, boolean inherit)
  { 
      if (attributeType == null)
          throw new ArgumentNullException("attributeType");
      Contract.EndContractBlock();

      RuntimeType attributeRuntimeType = attributeType.UnderlyingSystemType as RuntimeType;

      if (attributeRuntimeType == null) 
          throw new ArgumentException(Environment.GetResourceString("Arg_MustBeType"),"attributeType");

      return CustomAttribute.GetCustomAttributes(this, attributeRuntimeType, inherit);
  }

  public /*override*/ boolean IsDefined(Type attributeType, boolean inherit) 
  {
      if (attributeType == null) 
          throw new ArgumentNullException("attributeType"); 
      Contract.EndContractBlock();

      RuntimeType attributeRuntimeType = attributeType.UnderlyingSystemType as RuntimeType;

      if (attributeRuntimeType == null)
          throw new ArgumentException(Environment.GetResourceString("Arg_MustBeType"),"attributeType"); 

      return CustomAttribute.IsDefined(this, attributeRuntimeType, inherit); 
  } 

  public /*override*/ IList<CustomAttributeData> GetCustomAttributesData() 
  {
      return CustomAttributeData.GetCustomAttributesInternal(this);
  }
//  #endregion 

//  #region MemberInfo Overrides 
  public /*override*/ String Name 
  {
      [System.Security.SecuritySafeCritical]  // auto-generated 
      get
      {
          if (m_name == null)
              m_name = RuntimeMethodHandle.GetName(this); 

          return m_name; 
      } 
  }

  public /*override*/ Type DeclaringType
  {
      get
      { 
          if (m_reflectedTypeCache.IsGlobal)
              return null; 

          return m_declaringType;
      } 
  }

  public /*override*/ Type ReflectedType
  { 
      get
      { 
          if (m_reflectedTypeCache.IsGlobal) 
              return null;

          return m_reflectedTypeCache.GetRuntimeType();
      }
  }

  public /*override*/ MemberTypes MemberType { get { return MemberTypes.Method; } }
  public /*override*/ int MetadataToken 
  { 
//      [System.Security.SecuritySafeCritical]  // auto-generated
      get { return RuntimeMethodHandle.GetMethodDef(this); } 
  }
  public /*override*/ Module Module { get { return GetRuntimeModule(); } }
  /*internal*/ public RuntimeType GetRuntimeType() { return m_declaringType; }
  /*internal*/ public RuntimeModule GetRuntimeModule() { return m_declaringType.GetRuntimeModule(); } 
  /*internal*/ public RuntimeAssembly GetRuntimeAssembly() { return GetRuntimeModule().GetRuntimeAssembly(); }

  public /*override*/ boolean IsSecurityCritical 
  {
      get { return RuntimeMethodHandle.IsSecurityCritical(this); } 
  }
  public /*override*/ boolean IsSecuritySafeCritical
  {
      get { return RuntimeMethodHandle.IsSecuritySafeCritical(this); } 
  }
  public /*override*/ boolean IsSecurityTransparent 
  { 
      get { return RuntimeMethodHandle.IsSecurityTransparent(this); }
  } 
//  #endregion

//  #region MethodBase Overrides
//  [System.Security.SecuritySafeCritical]  // auto-generated 
//#if !FEATURE_CORECLR
//  [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")] 
////#endif 
  /*internal*/ public /*override*/ ParameterInfo[] GetParametersNoCopy()
  { 
      FetchNonReturnParameters();

      return m_parameters;
  } 

//  [System.Security.SecuritySafeCritical]  // auto-generated 
//  [System.Diagnostics.Contracts.Pure] 
  public /*override*/ ParameterInfo[] GetParameters()
  { 
      FetchNonReturnParameters();

      if (m_parameters.Length == 0)
          return m_parameters; 

      ParameterInfo[] ret = new ParameterInfo[m_parameters.Length]; 

      Array.Copy(m_parameters, ret, m_parameters.Length);

      return ret;
  }

  public /*override*/ MethodImplAttributes GetMethodImplementationFlags() 
  {
      return RuntimeMethodHandle.GetImplAttributes(this); 
  } 

  /*internal*/ public boolean IsOverloaded 
  {
      get
      {
          return m_reflectedTypeCache.GetMethodList(MemberListType.CaseSensitive, Name).Length > 1; 
      }
  } 

  public /*override*/ RuntimeMethodHandle MethodHandle
  { 
      get
      {
          Type declaringType = DeclaringType;
          if ((declaringType == null && Module.Assembly.ReflectionOnly) || declaringType is ReflectionOnlyType) 
              throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_NotAllowedInReflectionOnly"));
          return new RuntimeMethodHandle(this); 
      } 
  }

  public /*override*/ MethodAttributes Attributes { get { return m_methodAttributes; } }

  public /*override*/ CallingConventions CallingConvention
  { 
      get
      { 
          return Signature.CallingConvention; 
      }
  } 

//  [System.Security.SecuritySafeCritical] // overrides SafeCritical member
//#pragma warning disable 618
//  [ReflectionPermissionAttribute(SecurityAction.Demand, Flags = ReflectionPermissionFlag.MemberAccess)] 
//#pragma warning restore 618
  public /*override*/ MethodBody GetMethodBody() 
  { 
      MethodBody mb = RuntimeMethodHandle.GetMethodBody(this, ReflectedTypeInternal);
      if (mb != null) 
          mb.m_methodBase = this;
      return mb;
  }
//  #endregion 

//  #region Invocation Logic(On MemberBase) 
  private void CheckConsistency(Object target) 
  {
      // only test instance methods 
      if ((m_methodAttributes & MethodAttributes.Static) != MethodAttributes.Static)
      {
          if (!m_declaringType.IsInstanceOfType(target))
          { 
              if (target == null)
                  throw new TargetException(Environment.GetResourceString("RFLCT.Targ_StatMethReqTarg")); 
              else 
                  throw new TargetException(Environment.GetResourceString("RFLCT.Targ_ITargMismatch"));
          } 
      }
  }

//  [System.Security.SecuritySafeCritical] 
  private void ThrowNoInvokeException()
  { 
      // method is ReflectionOnly 
      Type declaringType = DeclaringType;
      if ((declaringType == null && Module.Assembly.ReflectionOnly) || declaringType is ReflectionOnlyType) 
      {
          throw new InvalidOperationException(Environment.GetResourceString("Arg_ReflectionOnlyInvoke"));
      }
      // method is on a class that contains stack pointers 
      else if ((InvocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_CONTAINS_STACK_POINTERS) != 0)
      { 
          throw new NotSupportedException(); 
      }
      // method is vararg 
      else if ((CallingConvention & CallingConventions.VarArgs) == CallingConventions.VarArgs)
      {
          throw new NotSupportedException();
      } 
      // method is generic or on a generic class
      else if (DeclaringType.ContainsGenericParameters || ContainsGenericParameters) 
      { 
          throw new InvalidOperationException(Environment.GetResourceString("Arg_UnboundGenParam"));
      } 
      // method is abstract class
      else if (IsAbstract)
      {
          throw new MemberAccessException(); 
      }
      // ByRef return are not allowed in reflection 
      else if (ReturnType.IsByRef) 
      {
          throw new NotSupportedException(Environment.GetResourceString("NotSupported_ByRefReturn")); 
      }

      throw new TargetException();
  } 

//  [System.Security.SecuritySafeCritical] 
//  [DebuggerStepThroughAttribute] 
//  [Diagnostics.DebuggerHidden]
//  [MethodImplAttribute(MethodImplOptions.NoInlining)] // Methods containing StackCrawlMark local var has to be marked non-inlineable 
  public /*override*/ Object Invoke(Object obj, BindingFlags invokeAttr, Binder binder, Object[] parameters, CultureInfo culture)
  {
      Object[] arguments = InvokeArgumentsCheck(obj, invokeAttr, binder, parameters, culture);

//      #region Security Check
      StackCrawlMark stackMark = StackCrawlMark.LookForMyCaller; 
      INVOCATION_FLAGS invocationFlags = InvocationFlags; 

//#if FEATURE_APPX 
      if ((invocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_NON_W8P_FX_API) != 0)
      {
          RuntimeAssembly caller = RuntimeAssembly.GetExecutingAssembly(/*ref*/ stackMark);
          if (caller != null && !caller.IsSafeForReflection()) 
              throw new InvalidOperationException(Environment.GetResourceString("InvalidOperation_APIInvalidForCurrentContext", FullName));
      } 
//#endif 

      if ((invocationFlags & (INVOCATION_FLAGS.INVOCATION_FLAGS_RISKY_METHOD | INVOCATION_FLAGS.INVOCATION_FLAGS_NEED_SECURITY)) != 0) 
      {
//#if !FEATURE_CORECLR
          if ((invocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_RISKY_METHOD) != 0)
              CodeAccessPermission.Demand(PermissionType.ReflectionMemberAccess); 

          if ((invocationFlags & INVOCATION_FLAGS.INVOCATION_FLAGS_NEED_SECURITY) != 0) 
//#endif // !FEATURE_CORECLR 
              RuntimeMethodHandle.PerformSecurityCheck(obj, this, m_declaringType, (uint)m_invocationFlags);
      } 
//      #endregion

      return UnsafeInvokeInternal(obj, parameters, arguments);
  } 

//  [System.Security.SecurityCritical] 
//  [DebuggerStepThroughAttribute] 
//  [Diagnostics.DebuggerHidden]
  /*internal*/ public Object UnsafeInvoke(Object obj, BindingFlags invokeAttr, Binder binder, Object[] parameters, CultureInfo culture) 
  {
      Object[] arguments = InvokeArgumentsCheck(obj, invokeAttr, binder, parameters, culture);

      return UnsafeInvokeInternal(obj, parameters, arguments); 
  }

//  [System.Security.SecurityCritical] 
//  [DebuggerStepThroughAttribute]
//  [Diagnostics.DebuggerHidden] 
  private Object UnsafeInvokeInternal(Object obj, Object[] parameters, Object[] arguments)
  {
      if (arguments == null || arguments.Length == 0)
          return RuntimeMethodHandle.InvokeMethod(obj, null, Signature, false); 
      else
      { 
          Object retValue = RuntimeMethodHandle.InvokeMethod(obj, arguments, Signature, false); 

          // copy out. This should be made only if ByRef are present. 
          for (int index = 0; index < arguments.Length; index++)
              parameters[index] = arguments[index];

          return retValue; 
      }
  } 

//  [DebuggerStepThroughAttribute]
//  [Diagnostics.DebuggerHidden] 
  private Object[] InvokeArgumentsCheck(Object obj, BindingFlags invokeAttr, Binder binder, Object[] parameters, CultureInfo culture)
  {
      Signature sig = Signature;

      // get the signature
      int formalCount = sig.Arguments.Length; 
      int actualCount = (parameters != null) ? parameters.Length : 0; 

      INVOCATION_FLAGS invocationFlags = InvocationFlags; 

      // INVOCATION_FLAGS_CONTAINS_STACK_POINTERS means that the struct (either the declaring type or the return type)
      // contains pointers that point to the stack. This is either a ByRef or a TypedReference. These structs cannot
      // be boxed and thus cannot be invoked through reflection which only deals with boxed value type objects. 
      if ((invocationFlags & (INVOCATION_FLAGS.INVOCATION_FLAGS_NO_INVOKE | INVOCATION_FLAGS.INVOCATION_FLAGS_CONTAINS_STACK_POINTERS)) != 0)
          ThrowNoInvokeException(); 

      // check basic method consistency. This call will throw if there are problems in the target/method relationship
      CheckConsistency(obj); 

      if (formalCount != actualCount)
          throw new TargetParameterCountException(Environment.GetResourceString("Arg_ParmCnt"));

      if (actualCount != 0)
          return CheckArguments(parameters, binder, invokeAttr, culture, sig); 
      else 
          return null;
  } 

//  #endregion

//  #region MethodInfo Overrides 
  public /*override*/ Type ReturnType
  { 
      get { return Signature.ReturnType; } 
  }

  public /*override*/ ICustomAttributeProvider ReturnTypeCustomAttributes
  {
      get { return ReturnParameter; }
  } 

  public /*override*/ ParameterInfo ReturnParameter 
  { 
//      [System.Security.SecuritySafeCritical]  // auto-generated
      get 
      {
          Contract.Ensures(m_returnParameter != null);

          FetchReturnParameter(); 
          return m_returnParameter as ParameterInfo;
      } 
  } 

//  [System.Security.SecuritySafeCritical]  // auto-generated 
  public /*override*/ MethodInfo GetBaseDefinition()
  {
      if (!IsVirtual || IsStatic || m_declaringType == null || m_declaringType.IsInterface)
          return this; 

      int slot = RuntimeMethodHandle.GetSlot(this); 
      RuntimeType declaringType = (RuntimeType)DeclaringType; 
      RuntimeType baseDeclaringType = declaringType;
      RuntimeMethodHandleInternal baseMethodHandle = new RuntimeMethodHandleInternal(); 

      do {
          int cVtblSlots = RuntimeTypeHandle.GetNumVirtuals(declaringType);

          if (cVtblSlots <= slot)
              break; 

          baseMethodHandle = RuntimeTypeHandle.GetMethodAt(declaringType, slot);
          baseDeclaringType = declaringType; 

          declaringType = (RuntimeType)declaringType.BaseType;
      } while (declaringType != null);

      return(MethodInfo)RuntimeType.GetMethodBase(baseDeclaringType, baseMethodHandle);
  } 

//  [System.Security.SecuritySafeCritical]
  public /*override*/ Delegate CreateDelegate(Type delegateType) 
  {
      StackCrawlMark stackMark = StackCrawlMark.LookForMyCaller;

      // This API existed in v1/v1.1 and only expected to create closed 
      // instance delegates. Constrain the call to BindToMethodInfo to
      // open delegates only for backwards compatibility. But we'll allow 
      // relaxed signature checking and open static delegates because 
      // there's no ambiguity there (the caller would have to explicitly
      // pass us a static method or a method with a non-exact signature 
      // and the only change in behavior from v1.1 there is that we won't
      // fail the call).
      return CreateDelegateInternal(
          delegateType, 
          null,
          DelegateBindingFlags.OpenDelegateOnly | DelegateBindingFlags.RelaxedSignature, 
          /*ref*/ stackMark); 
  }

//  [System.Security.SecuritySafeCritical]
  public /*override*/ Delegate CreateDelegate(Type delegateType, Object target)
  {
      StackCrawlMark stackMark = StackCrawlMark.LookForMyCaller; 

      // This API is new in Whidbey and allows the full range of delegate 
      // flexability (open or closed delegates binding to static or 
      // instance methods with relaxed signature checking). The delegate
      // can also be closed over null. There's no ambiguity with all these 
      // options since the caller is providing us a specific MethodInfo.
      return CreateDelegateInternal(
          delegateType,
          target, 
          DelegateBindingFlags.RelaxedSignature,
          /*ref*/ stackMark); 
  } 

//  [System.Security.SecurityCritical] 
  private Delegate CreateDelegateInternal(Type delegateType, Object firstArgument, DelegateBindingFlags bindingFlags, /*ref*/ StackCrawlMark stackMark)
  {
      // Validate the parameters.
      if (delegateType == null) 
          throw new ArgumentNullException("delegateType");
      Contract.EndContractBlock(); 

      RuntimeType rtType = delegateType as RuntimeType;
      if (rtType == null) 
          throw new ArgumentException(Environment.GetResourceString("Argument_MustBeRuntimeType"), "delegateType");

      if (!rtType.IsDelegate())
          throw new ArgumentException(Environment.GetResourceString("Arg_MustBeDelegate"), "delegateType"); 

      Delegate d = Delegate.CreateDelegateInternal(rtType, this, firstArgument, bindingFlags, /*ref*/ stackMark); 
      if (d == null) 
      {
          throw new ArgumentException(Environment.GetResourceString("Arg_DlgtTargMeth")); 
      }

      return d;
  } 

//  #endregion 

//  #region Generics
//  [System.Security.SecuritySafeCritical]  // auto-generated 
  public /*override*/ MethodInfo MakeGenericMethod(params Type[] methodInstantiation)
  {
    if (methodInstantiation == null)
          throw new ArgumentNullException("methodInstantiation"); 
    Contract.EndContractBlock();

      RuntimeType[] methodInstantionRuntimeType = new RuntimeType[methodInstantiation.Length]; 

      if (!IsGenericMethodDefinition) 
          throw new InvalidOperationException(
              Environment.GetResourceString("Arg_NotGenericMethodDefinition", this));

      for (int i = 0; i < methodInstantiation.Length; i++) 
      {
          Type methodInstantiationElem = methodInstantiation[i]; 

          if (methodInstantiationElem == null)
              throw new ArgumentNullException(); 

          RuntimeType rtMethodInstantiationElem = methodInstantiationElem as RuntimeType;

          if (rtMethodInstantiationElem == null) 
          {
              Type[] methodInstantiationCopy = new Type[methodInstantiation.Length]; 
              for (int iCopy = 0; iCopy < methodInstantiation.Length; iCopy++) 
                  methodInstantiationCopy[iCopy] = methodInstantiation[iCopy];
              methodInstantiation = methodInstantiationCopy; 
              return System.Reflection.Emit.MethodBuilderInstantiation.MakeGenericMethod(this, methodInstantiation);
          }

          methodInstantionRuntimeType[i] = rtMethodInstantiationElem; 
      }

      RuntimeType[] genericParameters = GetGenericArgumentsInternal(); 

      RuntimeType.SanityCheckGenericArguments(methodInstantionRuntimeType, genericParameters); 

      MethodInfo ret = null;

      try 
      {
          ret = RuntimeType.GetMethodBase(ReflectedTypeInternal, 
              RuntimeMethodHandle.GetStubIfNeeded(new RuntimeMethodHandleInternal(this.m_handle), m_declaringType, methodInstantionRuntimeType)) as MethodInfo; 
      }
      catch (VerificationException e) 
      {
          RuntimeType.ValidateGenericArguments(this, methodInstantionRuntimeType, e);
          throw;
      } 

      return ret; 
  } 

  /*internal*/ public RuntimeType[] GetGenericArgumentsInternal() 
  {
      return RuntimeMethodHandle.GetMethodInstantiationInternal(this);
  }

  public /*override*/ Type[] GetGenericArguments()
  { 
      Type[] types = RuntimeMethodHandle.GetMethodInstantiationPublic(this); 

      if (types == null) 
      {
          types = new Type[0];
      }
      return types; 
  }

  public /*override*/ MethodInfo GetGenericMethodDefinition() 
  {
      if (!IsGenericMethod) 
          throw new InvalidOperationException();
      Contract.EndContractBlock();

      return RuntimeType.GetMethodBase(m_declaringType, RuntimeMethodHandle.StripMethodInstantiation(this)) as MethodInfo; 
  }

  public /*override*/ boolean IsGenericMethod 
  {
      get { return RuntimeMethodHandle.HasMethodInstantiation(this); } 
  }

  public /*override*/ boolean IsGenericMethodDefinition
  { 
      get { return RuntimeMethodHandle.IsGenericMethodDefinition(this); }
  } 

  public /*override*/ boolean ContainsGenericParameters
  { 
      get
      {
          if (DeclaringType != null && DeclaringType.ContainsGenericParameters)
              return true; 

          if (!IsGenericMethod) 
              return false; 

          Type[] pis = GetGenericArguments(); 
          for (int i = 0; i < pis.Length; i++)
          {
              if (pis[i].ContainsGenericParameters)
                  return true; 
          }

          return false; 
      }
  } 
//  #endregion

//  #region ISerializable Implementation
//  [System.Security.SecurityCritical]  // auto-generated 
  public void GetObjectData(SerializationInfo info, StreamingContext context)
  { 
      if (info == null) 
          throw new ArgumentNullException("info");
      Contract.EndContractBlock(); 

      if (m_reflectedTypeCache.IsGlobal)
          throw new NotSupportedException(Environment.GetResourceString("NotSupported_GlobalMethodSerialization"));

      MemberInfoSerializationHolder.GetSerializationInfo(
          info, 
          Name, 
          ReflectedTypeInternal,
          ToString(), 
          SerializationToString(),
          MemberTypes.Method,
          IsGenericMethod & !IsGenericMethodDefinition ? GetGenericArguments() : null);
  } 

  /*internal*/ public String SerializationToString() 
  { 
      return ReturnType.FormatTypeName(true) + " " + FormatNameAndSig(true);
  } 
//  #endregion

//  #region Legacy Internal
  /*internal*/ public static MethodBase InternalGetCurrentMethod(/*ref*/ StackCrawlMark stackMark) 
  {
      IRuntimeMethodInfo method = RuntimeMethodHandle.GetCurrentMethod(/*ref*/ stackMark); 

      if (method == null)
          return null; 

      return RuntimeType.GetMethodBase(method);
  }
//  #endregion 
}