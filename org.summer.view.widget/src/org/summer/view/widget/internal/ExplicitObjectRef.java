package org.summer.view.widget.internal;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.WeakReference;

//#region ExplicitObjectRef
/// <summary> Explicit Object reference. </summary>
/*internal*/public final class ExplicitObjectRef extends ObjectRef 
{
    //----------------------------------------------------- 
    // 
    //  Constructors
    // 
    //-----------------------------------------------------

    /// <summary> Constructor. </summary>
    /*internal*/public ExplicitObjectRef(Object o) 
    {
        if (o instanceof DependencyObject) 
            _element = new WeakReference(o); 
        else
            _object = o; 
    }

    //------------------------------------------------------
    // 
    //  Public Methods
    // 
    //----------------------------------------------------- 

    /// <summary> Returns the referenced Object. </summary> 
    /// <param name="d">Element defining context for the reference. </param>
    /// <param name="args">See ObjectRefArgs </param>
    /*internal*/ /*override*/ Object GetObject(DependencyObject d, ObjectRefArgs args)
    { 
        return (_element != null) ? _element.Target : _object;
    } 

    /// <summary>
    /// true if the ObjectRef uses the mentor of the target element, 
    /// rather than the target element itself.
    /// </summary>
    protected /*override*/ boolean ProtectedUsesMentor
    { 
        get { return false; }
    } 

    /*internal*/ /*override*/ String Identify()
    { 
        return "Source";
    }

    //------------------------------------------------------ 
    //
    //  Private Fields 
    // 
    //------------------------------------------------------

    Object _object;
    WeakReference _element; // to DependencyObject (bug 986435)
}