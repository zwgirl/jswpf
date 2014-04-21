package org.summer.view.resources;
///    [FriendAccessAllowed] 
    // [[....] 3/9/2012] This class should be named PRIErrorInfo.
    // 
    // During Dev11 CLR RC Ask mode, the Windows Modern Resource Manager
    // made a breaking change such that ResourceMap.GetSubtree returns null when a subtree is
    // not found instead of throwing an exception. As a result the name of this class is no longer accurate.
    // It should be called PRIErrorInfo. However changing the name of this /*internal*/ public class would cause 
    // mscorlib.asmmeta and System.Runtime.WindowsRuntime.asmmeta to change,
    // which would in turn require updating of the mscorlib and System.Runtime.WindowsRuntime 
    // reference assemblies under InternalApis. This would not meet the Ask Mode bar at this time. 
    // To get an idea of which files may need to be updated when updating this name,
    // see changeset 399234 in the DevDiv2 database, though the update procedure may have changed 
    // by the time you read this.
    /*internal*/ public class PRIExceptionInfo
    {
        public String _PackageSimpleName; 
        public String _ResWFile;
    }