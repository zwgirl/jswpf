package org.summer.view.widget.internal;

import org.summer.view.window.OutOfMemoryException;

/*internal*/ public /*static*/ class CriticalExceptions
{ 
    // these are all the exceptions considered critical by PreSharp 
//    #if !PBTCOMPILER && !SYSTEM_XAML
//    [FriendAccessAllowed] 
//    #endif
    /*internal*/ public static boolean IsCriticalException(Exception ex)
    {
        ex = Unwrap(ex); 

        return ex instanceof NullReferenceException || 
               ex instanceof StackOverflowException || 
               ex instanceof OutOfMemoryException   ||
               ex instanceof /*System.Threading.*/ThreadAbortException || 
               ex instanceof /*System.Runtime.*/InteropServices.SEHException ||
               ex instanceof /*System.Security.*/SecurityException;
    }

    // these are exceptions that we should treat as critical when they
    // arise during callbacks into application code 
//    #if !PBTCOMPILER && !SYSTEM_XAML 
//    [FriendAccessAllowed]
    /*internal*/ public static boolean IsCriticalApplicationException(Exception ex) 
    {
        ex = Unwrap(ex);

        return ex instanceof StackOverflowException || 
               ex instanceof OutOfMemoryException   ||
               ex instanceof /*System.Threading.*/ThreadAbortException || 
               ex instanceof /*System.Security.*/SecurityException; 
    }
//    #endif 

//    #if !PBTCOMPILER && !SYSTEM_XAML
//    [FriendAccessAllowed]
//    #endif 
    /*internal*/ public static Exception Unwrap(Exception ex)
    { 
        // for certain types of exceptions, we care more about the inner 
        // exception
        while (ex.InnerException != null && 
                (   ex instanceof /*System.Reflection.*/TargetInvocationException
                ))
        {
            ex = ex.InnerException; 
        }

        return ex; 
    }
}