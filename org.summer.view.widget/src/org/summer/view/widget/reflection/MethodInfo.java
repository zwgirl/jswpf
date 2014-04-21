package org.summer.view.widget.reflection;

import org.omg.CORBA.Environment;
import org.summer.view.widget.Delegate;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;

//[Serializable]
//[ClassInterface(ClassInterfaceType.None)] 
//[ComDefaultInterface(typeof(_MethodInfo))]
//#pragma warning disable 618 
//[PermissionSetAttribute(SecurityAction.InheritanceDemand, Name = "FullTrust")] 
//#pragma warning restore 618
//[System.Runtime.InteropServices.ComVisible(true)] 
public abstract class MethodInfo extends MethodBase implements _MethodInfo
{
//  #region Constructor
  protected MethodInfo() { } 
//  #endregion

//#if !FEATURE_CORECLR 
  public static boolean operator ==(MethodInfo left, MethodInfo right)
  { 
      if (ReferenceEquals(left, right))
          return true;

      if ((Object)left == null || (Object)right == null || 
          left is RuntimeMethodInfo || right is RuntimeMethodInfo)
      { 
          return false; 
      }
      return left.Equals(right); 
  }

//  [TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
  public static boolean operator !=(MethodInfo left, MethodInfo right) 
  {
      return !(left == right); 
  } 

  public /*override*/ boolean Equals(Object obj) 
  {
      return base.Equals(obj);
  }

  public /*override*/ int GetHashCode()
  { 
      return base.GetHashCode(); 
  }
//#endif // !FEATURE_CORECLR 

//  #region MemberInfo Overrides
  public /*override*/ MemberTypes MemberType { get { return System.Reflection.MemberTypes.Method; } }
//  #endregion 

//  #region Public Abstract\Virtual Members 
  public /*virtual*/ Type ReturnType { get { throw new NotImplementedException(); } } 

  public /*virtual*/ ParameterInfo ReturnParameter { get { throw new NotImplementedException(); } } 

  public abstract ICustomAttributeProvider ReturnTypeCustomAttributes { get;  }

  public abstract MethodInfo GetBaseDefinition(); 

//  [System.Runtime.InteropServices.ComVisible(true)] 
  public /*override*/ Type[] GetGenericArguments() { throw new NotSupportedException(Environment.GetResourceString("NotSupported_SubclassOverride")); } 

//  [System.Runtime.InteropServices.ComVisible(true)] 
  public /*virtual*/ MethodInfo GetGenericMethodDefinition() { throw new NotSupportedException(Environment.GetResourceString("NotSupported_SubclassOverride")); }

  public /*virtual*/ MethodInfo MakeGenericMethod(params Type[] typeArguments) { throw new NotSupportedException(Environment.GetResourceString("NotSupported_SubclassOverride")); }

  public /*virtual*/ Delegate CreateDelegate(Type delegateType) { throw new NotSupportedException(Environment.GetResourceString("NotSupported_SubclassOverride")); }
  public /*virtual*/ Delegate CreateDelegate(Type delegateType, Object target) { throw new NotSupportedException(Environment.GetResourceString("NotSupported_SubclassOverride")); } 
//  #endregion 

  public Type /*_MethodInfo.*/GetType() 
  {
      return base.GetType();
  }

  public void /*_MethodInfo.*/GetTypeInfoCount(/*out*/ int pcTInfo)
  { 
      throw new NotImplementedException(); 
  }

  public void /*_MethodInfo.*/GetTypeInfo(int iTInfo, int lcid, IntPtr ppTInfo)
  {
      throw new NotImplementedException();
  } 

  public void /*_MethodInfo.*/GetIDsOfNames(/*[In]*/ /*ref*/ Guid riid, IntPtr rgszNames, int cNames, int lcid, IntPtr rgDispId) 
  { 
      throw new NotImplementedException();
  } 

  // If you implement this method, make sure to include _MethodInfo.Invoke in VM\DangerousAPIs.h and
  // include _MethodInfo in SystemDomain::IsReflectionInvocationMethod in AppDomain.cpp.
  public void /*_MethodInfo.*/Invoke(int dispIdMember, /*[In]*/ /*ref*/ Guid riid, int lcid, short wFlags, IntPtr pDispParams, IntPtr pVarResult, IntPtr pExcepInfo, IntPtr puArgErr) 
  {
      throw new NotImplementedException(); 
  } 
}