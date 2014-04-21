package org.summer.view.widget.internal;

import org.summer.view.widget.DependencyObject;

//#region ObjectRef 
    /// <summary> Abstract Object reference. </summary>
    /*internal*/public abstract class ObjectRef 
    { 
        //-----------------------------------------------------
        // 
        //  Constructors
        //
        //-----------------------------------------------------
 
        /// <summary> Constructor is protected - you can only create subclasses. </summary>
        protected ObjectRef() {} 
 
        //------------------------------------------------------
        // 
        //  Public Methods
        //
        //-----------------------------------------------------
 
        /// <summary> Returns the referenced Object. </summary>
        /// <param name="d">Element defining context for the reference. </param> 
        /// <param name="args">See ObjectRefArgs </param> 
        /*internal*/ /*virtual*/ Object GetObject(DependencyObject d, ObjectRefArgs args)
        { 
            return null;
        }

        /// <summary> Returns the data Object associated with the referenced Object. 
        /// Often this is the same as the referenced Object.
        /// </summary> 
        /// <param name="d">Element defining context for the reference. </param> 
        /// <param name="args">See ObjectRefArgs </param>
        /*internal*/ /*virtual*/ public Object GetDataObject(DependencyObject d, ObjectRefArgs args) 
        {
            return GetObject(d, args);
        }
 
        /// <summary> true if the ObjectRef really needs the tree context </summary>
        /*internal*/ public boolean TreeContextIsRequired(DependencyObject target) 
        { 
            return ProtectedTreeContextIsRequired(target);
        } 

        /// <summary> true if the ObjectRef really needs the tree context </summary>
        protected /*virtual*/ boolean ProtectedTreeContextIsRequired(DependencyObject target)
        { 
            return false;
        } 
 
        /// <summary>
        /// true if the ObjectRef uses the mentor of the target element, 
        /// rather than the target element itself.
        /// </summary>
        /*internal*/ public boolean UsesMentor
        { 
            get { return ProtectedUsesMentor; }
        } 
 
        /// <summary>
        /// true if the ObjectRef uses the mentor of the target element, 
        /// rather than the target element itself.
        /// </summary>
        protected /*virtual*/ boolean ProtectedUsesMentor
        { 
            get { return true; }
        } 
 
        /// <summary>
        /// identify this ObjectRef to the user - used by extended tracing 
        /// </summary>
        /*internal*/ abstract String Identify();
    }
 
//#endregion ObjectRef