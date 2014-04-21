package org.summer.view.widget.media.animation;

import java.beans.EventHandler;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.EventArgs;
import org.summer.view.widget.Freezable;

//Small Object used to send a property invalidation when the InvalidatePropertyOnChange 
//  delegate is called in response to an event.
// The ChangeListener class supports Storyboard animation scenarios with 
//  multi-step property paths.  In these cases, a clone of the original 
//  value is made and the storyboard animation is attached to the clone.
// This class listens to the changes on both the original Object and the 
//  clone.
// If the original Object has changed, this class signals the need to
//  re-clone in order to pick up the state of the original Object.
// If the cloned Object has changed, this class signals an animation- 
//  driven sub-property invalidation.
/*internal*/ public class ChangeListener 
{ 
    // Constructor of the Object, the parameters include the property to
    //  invalidate and the Object to invalidate it on.  As well as the 
    //  two Freezable objects (original and clone) that are associated
    //  with the property on the target Object.
    /*internal*/ public ChangeListener( DependencyObject target, Freezable clone, DependencyProperty property, Freezable original )
    { 
        Debug.Assert( target != null && clone != null && property != null && original != null,
            "Internal utility class requires non-null arguments.  Check the caller of this method for an error."); 
        _target = target; 
        _property = property;
        _clone = clone; 
        _original = original;
    }

    // Called when the clone has changed.  We check the clone cache on 
    //  the target Object to see if we were the most recent clone.  If so,
    //  signal a sub-property invalidation.  If not, we are no longer 
    //  relevant and we should clean up. 
    /*internal*/ public void InvalidatePropertyOnCloneChange( Object source, EventArgs e )
    { 
        CloneCacheEntry cacheEntry = GetComplexPathClone( _target, _property );

        // If the changed freezable is the currently outstanding instance
        //  then we need to trigger a sub-property invalidation. 
        if( cacheEntry != null && cacheEntry.Clone == _clone )
        { 
            _target.InvalidateSubProperty(_property); 
        }
        // Otherwise, we are no longer relevant and need to clean up. 
        else
        {
            Cleanup();
        } 
    }

    // This is the event handler on the original.  When the original 
    //  changes, the clone is no longer valid.  This method triggers a
    //  re-clone by calling InvalidateProperty, then clean up.  Now that 
    //  the associated clone is no longer valid, there's nothing useful
    //  for us to listen on.
    /*internal*/ public void InvalidatePropertyOnOriginalChange( Object source, EventArgs e )
    { 
        // recompute animated value
        _target.InvalidateProperty(_property); 
        Cleanup(); 
    }

    // This is the /*internal*/ public method called to set up the listeners on both
    //  the original and the clone.
    /*internal*/ public static void ListenToChangesOnFreezable(
        DependencyObject target, 
        Freezable clone,
        DependencyProperty dp, 
        Freezable original) 
    {
        ChangeListener listener = new ChangeListener( target, clone, dp, original ); 

        listener.Setup();
    }

    private void Setup()
    { 
        EventHandler changeEventHandler = new EventHandler(InvalidatePropertyOnCloneChange); 

        // Listen to changes on clone. 
        _clone.Changed += changeEventHandler;

        if( _original.IsFrozen )
        { 
            // We skip setting up for the original Object when it is Frozen,
            //  because it won't change so we don't need to worry about listening. 
            _original = null; 
        }
        else 
        {
            // If the original is not Frozen, we do need to listen and
            //  signal a re-clone if the original changes.
            changeEventHandler = new EventHandler(InvalidatePropertyOnOriginalChange); 

            _original.Changed += changeEventHandler; 
        } 
    }

    // Stop listening to the Changed event on the given Freezable objects
    //  and clean up.
    private void Cleanup()
    { 
        // Remove ourself from the clone
        EventHandler changeEventHandler = new EventHandler(InvalidatePropertyOnCloneChange); 

        _clone.Changed -= changeEventHandler;

        // If we're listening on the original, remove ourselves from there too.
        //  (In Setup() _original was nulled out if we aren't listening.)
        if( _original != null )
        { 
            changeEventHandler = new EventHandler(InvalidatePropertyOnOriginalChange);

            _original.Changed -= changeEventHandler; 
        }

        // Clear all Object references.
        _target = null;
        _property = null;
        _clone = null; 
        _original = null;
    } 

    DependencyObject _target;     // The Object to invalidate
    DependencyProperty _property; // The property to invalidate on the above Object. 
    Freezable _clone;             // The cloned Freezable whose Changed event we were listening to.
    Freezable _original;          // The original Freezable whose Changed event we're also listening to.
}