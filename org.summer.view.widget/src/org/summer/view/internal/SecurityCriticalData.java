package org.summer.view.internal;

	/*internal*/public class SecurityCriticalData<T> 
	{
	    /// <SecurityNote>
	    /// Critical - as this accesses _value which is Critical.
	    /// Safe - as the caller already got the critical value. 
	    /// </SecurityNote>
//	    [SecurityCritical, SecurityTreatAsSafe] 
	    /*internal*/public SecurityCriticalData(T value) 
	    {
	        _value = value; 
	    }
	
	    // <SecurityNote>
	    //    Critical "by definition" - this class is intended only to store critical data. 
	    // </SecurityNote>
	    /*internal*/public T Value 
	    { 
//	        [SecurityCritical]
	        get 
	        {
	            return _value;
	        }
	    } 
	
	    /// <SecurityNote> 
	    /// Critical - by definition as this is a wrapper for Critical data. 
	    /// </SecurityNote>
//	    [SecurityCritical] 
	    private T _value;
	}
}

