package org.summer.view.widget.internal;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.EventArgs;

/*internal*/ public class InheritanceContextHelper 
{


    //------------------------------------------------------------------- 
    //
    //  ProvideContextForObject 
    // 
    //  Tell a DO that it has a new inheritance context available.
    // 
    //-------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Core, also used by Framework.
    /*internal*/ public  static void ProvideContextForObject( 
        DependencyObject context,
        DependencyObject newValue ) 
    { 
        if (context != null)
        { 
            context.ProvideSelfAsInheritanceContext(newValue, null);
        }
    }

    //-------------------------------------------------------------------
    // 
    //  RemoveContextFromObject 
    //
    //  Tell a DO that it has lost its inheritance context. 
    //
    //--------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Base, also used by Framework. 
    /*internal*/ public  static void RemoveContextFromObject(
        DependencyObject context, 
        DependencyObject oldValue ) 
    {
        if (context != null && oldValue.InheritanceContext == context) 
        {
            context.RemoveSelfAsInheritanceContext(oldValue, null);
        }
    } 



    //-------------------------------------------------------------------
    // 
    //  AddInheritanceContext
    //
    //  Implementation to receive a new inheritance context
    // 
    //--------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Base, also used by Framework. 
    /*internal*/ public  static void AddInheritanceContext(DependencyObject newInheritanceContext,
                                                          DependencyObject value, 
                                                          /*ref*/ boolean hasMultipleInheritanceContexts,
                                                          /*ref*/ DependencyObject inheritanceContext )
    {
        // ignore the request when the new context is the same as the old, 
        // or when there are already multiple contexts
        if (newInheritanceContext != inheritanceContext && 
            !hasMultipleInheritanceContexts) 
        {
            if (inheritanceContext == null || newInheritanceContext == null) 
            {
                // Pick up the new context
                inheritanceContext = newInheritanceContext;
            } 
            else
            { 
                // We are now being referenced from multiple 
                // places, clear the context
                hasMultipleInheritanceContexts = true; 
                inheritanceContext = null;
            }

            value.OnInheritanceContextChanged(EventArgs.Empty); 
        }
    } 


    //-------------------------------------------------------------------- 
    //
    //  RemoveInheritanceContext
    //
    //  Implementation to remove an old inheritance context 
    //
    //------------------------------------------------------------------- 

//    [FriendAccessAllowed] // Built into Base, also used by Framework.
    /*internal*/ public  static void RemoveInheritanceContext(DependencyObject oldInheritanceContext, 
                                                          DependencyObject value,
                                                          /*ref*/ boolean hasMultipleInheritanceContexts,
                                                          /*ref*/ DependencyObject inheritanceContext )
    { 
        // ignore the request when the given context doesn't match the old one,
        // or when there are already multiple contexts 
        if (oldInheritanceContext == inheritanceContext && 
            !hasMultipleInheritanceContexts)
        { 
            // clear the context
            inheritanceContext = null;
            value.OnInheritanceContextChanged(EventArgs.Empty);
        } 
    }
} 