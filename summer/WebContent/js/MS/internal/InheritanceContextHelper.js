/**
 * InheritanceContextHelper
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var InheritanceContextHelper = declare("InheritanceContextHelper", null,{
	});
	
    //------------------------------------------------------------------- 
    //
    //  ProvideContextForObject 
    // 
    //  Tell a DO that it has a new inheritance context available.
    // 
    //-------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Core, also used by Framework.
//    internal static void 
    InheritanceContextHelper.ProvideContextForObject = function( 
        /*DependencyObject*/ context,
        /*DependencyObject*/ newValue ) 
    { 
        if (context != null)
        { 
            context.ProvideSelfAsInheritanceContext(newValue, null);
        }
    };

    //-------------------------------------------------------------------
    // 
    //  RemoveContextFromObject 
    //
    //  Tell a DO that it has lost its inheritance context. 
    //
    //--------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Base, also used by Framework. 
//    internal static void 
    InheritanceContextHelper.RemoveContextFromObject = function(
        /*DependencyObject*/ context, 
        /*DependencyObject*/ oldValue ) 
    {
        if (context != null && oldValue.InheritanceContext == context) 
        {
            context.RemoveSelfAsInheritanceContext(oldValue, null);
        }
    };



    //-------------------------------------------------------------------
    // 
    //  AddInheritanceContext
    //
    //  Implementation to receive a new inheritance context
    // 
    //--------------------------------------------------------------------

//    [FriendAccessAllowed] // Built into Base, also used by Framework. 
//    internal static void 
    InheritanceContextHelper.AddInheritanceContext = function(/*DependencyObject*/ newInheritanceContext,
                                                          /*DependencyObject*/ value, 
                                                          /*ref bool hasMultipleInheritanceContexts*/ 
                                                          hasMultipleInheritanceContextsRef,
                                                          /*ref DependencyObject inheritanceContext*/
                                                          inheritanceContextRef)
    {
        // ignore the request when the new context is the same as the old, 
        // or when there are already multiple contexts
        if (newInheritanceContext != inheritanceContextRef.inheritanceContext && 
            !hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts) 
        {
            if (inheritanceContextRef.inheritanceContext == null || newInheritanceContext == null) 
            {
                // Pick up the new context
            	inheritanceContextRef.inheritanceContext = newInheritanceContext;
            } 
            else
            { 
                // We are now being referenced from multiple 
                // places, clear the context
            	hasMultipleInheritanceContextsRef.hasMultipleInheritanceContexts = true; 
            	inheritanceContextRef.inheritanceContext = null;
            }

            value.OnInheritanceContextChanged(EventArgs.Empty); 
        }
    };


    //-------------------------------------------------------------------- 
    //
    //  RemoveInheritanceContext
    //
    //  Implementation to remove an old inheritance context 
    //
    //------------------------------------------------------------------- 

//    [FriendAccessAllowed] // Built into Base, also used by Framework.
//    internal static void
    InheritanceContextHelper.RemoveInheritanceContext = function(/*DependencyObject*/ oldInheritanceContext, 
                                                          /*DependencyObject*/ value,
                                                          parObj
                                                          /*ref bool hasMultipleInheritanceContexts,
                                                          ref DependencyObject inheritanceContext*/ )
    { 
        // ignore the request when the given context doesn't match the old one,
        // or when there are already multiple contexts 
        if (oldInheritanceContext == parObj.inheritanceContext && 
            !parObj.hasMultipleInheritanceContexts)
        { 
            // clear the context
            parObj.inheritanceContext = null;
            value.OnInheritanceContextChanged(EventArgs.Empty);
        } 
    };
	
	InheritanceContextHelper.Type = new Type("InheritanceContextHelper", InheritanceContextHelper, [Object.Type]);
	return InheritanceContextHelper;
});

/////****************************************************************************\ 
////*
////* File: InheritanceContextHelper.cs
////*
////* This file holds a helper class for DO subclasses that implement an 
////* inheritance context.
////* 
////* Copyright (C) by Microsoft Corporation.  All rights reserved. 
////*
////\***************************************************************************/ 
////
////
////using System;
////using System.Windows; 
////using MS.Internal.WindowsBase;
//// 
////namespace MS.Internal 
////{
////    internal static class InheritanceContextHelper 
////    {
////
////
//        //------------------------------------------------------------------- 
//        //
//        //  ProvideContextForObject 
//        // 
//        //  Tell a DO that it has a new inheritance context available.
//        // 
//        //-------------------------------------------------------------------
//
//        [FriendAccessAllowed] // Built into Core, also used by Framework.
//        internal static void ProvideContextForObject( 
//            DependencyObject context,
//            DependencyObject newValue ) 
//        { 
//            if (context != null)
//            { 
//                context.ProvideSelfAsInheritanceContext(newValue, null);
//            }
//        }
// 
//        //-------------------------------------------------------------------
//        // 
//        //  RemoveContextFromObject 
//        //
//        //  Tell a DO that it has lost its inheritance context. 
//        //
//        //--------------------------------------------------------------------
//
//        [FriendAccessAllowed] // Built into Base, also used by Framework. 
//        internal static void RemoveContextFromObject(
//            DependencyObject context, 
//            DependencyObject oldValue ) 
//        {
//            if (context != null && oldValue.InheritanceContext == context) 
//            {
//                context.RemoveSelfAsInheritanceContext(oldValue, null);
//            }
//        } 
//
// 
// 
//        //-------------------------------------------------------------------
//        // 
//        //  AddInheritanceContext
//        //
//        //  Implementation to receive a new inheritance context
//        // 
//        //--------------------------------------------------------------------
// 
//        [FriendAccessAllowed] // Built into Base, also used by Framework. 
//        internal static void AddInheritanceContext(DependencyObject newInheritanceContext,
//                                                              DependencyObject value, 
//                                                              ref bool hasMultipleInheritanceContexts,
//                                                              ref DependencyObject inheritanceContext )
//        {
//            // ignore the request when the new context is the same as the old, 
//            // or when there are already multiple contexts
//            if (newInheritanceContext != inheritanceContext && 
//                !hasMultipleInheritanceContexts) 
//            {
//                if (inheritanceContext == null || newInheritanceContext == null) 
//                {
//                    // Pick up the new context
//                    inheritanceContext = newInheritanceContext;
//                } 
//                else
//                { 
//                    // We are now being referenced from multiple 
//                    // places, clear the context
//                    hasMultipleInheritanceContexts = true; 
//                    inheritanceContext = null;
//                }
//
//                value.OnInheritanceContextChanged(EventArgs.Empty); 
//            }
//        } 
// 
//
//        //-------------------------------------------------------------------- 
//        //
//        //  RemoveInheritanceContext
//        //
//        //  Implementation to remove an old inheritance context 
//        //
//        //------------------------------------------------------------------- 
// 
//        [FriendAccessAllowed] // Built into Base, also used by Framework.
//        internal static void RemoveInheritanceContext(DependencyObject oldInheritanceContext, 
//                                                              DependencyObject value,
//                                                              ref bool hasMultipleInheritanceContexts,
//                                                              ref DependencyObject inheritanceContext )
//        { 
//            // ignore the request when the given context doesn't match the old one,
//            // or when there are already multiple contexts 
//            if (oldInheritanceContext == inheritanceContext && 
//                !hasMultipleInheritanceContexts)
//            { 
//                // clear the context
//                inheritanceContext = null;
//                value.OnInheritanceContextChanged(EventArgs.Empty);
//            } 
//        }
//    } 
//} 
