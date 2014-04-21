package org.summer.view.runtime;

import org.summer.view.window.interop.IntPtr;

//[System.Runtime.InteropServices.ComVisible(true)]
public class HandleRef
{

    // ! Do not add or rearrange fields as the EE depends on this layout.
    //------------------------------------------------------------------ 
    /*internal*/ public Object m_wrapper; 
    /*internal*/ public IntPtr m_handle;
    //----------------------------------------------------------------- 


    public HandleRef(Object wrapper, IntPtr handle)
    { 
        m_wrapper = wrapper;
        m_handle  = handle; 
    } 

    public Object Wrapper { 
        get {
            return m_wrapper;
        }
    } 

    public IntPtr Handle { 
        get { 
            return m_handle;
        } 
    }


    public static /*explicit*/ operator IntPtr(HandleRef value) 
    {
        return value.m_handle; 
    } 

    public static IntPtr ToIntPtr(HandleRef value) 
    {
        return value.m_handle;
    }
} 

