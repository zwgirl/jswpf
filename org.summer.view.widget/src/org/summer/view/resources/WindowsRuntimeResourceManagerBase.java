package org.summer.view.resources;

import org.summer.view.widget.CultureInfo;

//
// This is implemented in System.Runtime.WindowsRuntime as function System.Resources.WindowsRuntimeResourceManager,
// allowing us to ask for a WinRT-specific ResourceManager. 
// Ideally this would be an interface, or at least an abstract class - but neither seems to play nice with FriendAccessAllowed. 
//
//[FriendAccessAllowed] 
//[SecurityCritical]
/*internal*/ public class WindowsRuntimeResourceManagerBase
{
//    [SecurityCritical] 
    public /*virtual*/ boolean Initialize(String libpath, String reswFilename, 
    		/*out*/ PRIExceptionInfo exceptionInfo){exceptionInfo = null; return false;}

//    [SecurityCritical] 
    public /*virtual*/ String GetString(String stringName, String startingCulture, String neutralResourcesCulture){return null;}

    public /*virtual*/ CultureInfo GlobalResourceContextBestFitCultureInfo {
//        [SecurityCritical]
        get { return null; }
    } 
}