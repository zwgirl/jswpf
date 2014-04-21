/**
 * DragDrop
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl"], 
		function(declare, Type, HeaderedContentControl){
	var DragDrop = declare("DragDrop", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(DragDrop.prototype,{
		  
	});
	
	Object.defineProperties(DragDrop,{
		  
	});
	
	DragDrop.Type = new Type("DragDrop", DragDrop, [Object.Type]);
	return DragDrop;
});



//---------------------------------------------------------------------------- 
//
// File: DragDrop.cs
//
// Copyright (C) Microsoft Corporation.  All rights reserved. 
//
// Description: The DragDrop system is for drag-and-drop operation. 
// 
// See spec at http://avalon/uis/Data%20Transfer%20clipboard%20dragdrop/DragDrop%20design%20on%20WPP.mht
// 
// History:
//  07/10/2003 : sangilj    Created
//  08/19/2004 : sangilj    Event name changes and code clean up
// 
//---------------------------------------------------------------------------
 
using MS.Win32; 
using System.Collections;
using System.ComponentModel; 
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Threading;
using System.Security; 
using System.Security.Permissions;
using MS.Internal; 
using MS.Internal.PresentationCore; 
using System.Windows.Input;
using System.Windows.Interop; 
using System.Windows.Media;

using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID; 
using IComDataObject = System.Runtime.InteropServices.ComTypes.IDataObject;
 
namespace System.Windows 
{
    #region DragDrop 

    /// <summary>
    /// Provides drag-and-drop operation methods.
    /// </summary> 
    public static class DragDrop
    { 
        //----------------------------------------------------- 
        //
        //  DragDrop Event 
        //
        //-----------------------------------------------------

        #region DragDrop Event 

        /// <summary> 
        /// PreviewQueryContinueDrag 
        /// </summary>
        public static readonly RoutedEvent PreviewQueryContinueDragEvent = EventManager.RegisterRoutedEvent("PreviewQueryContinueDrag", RoutingStrategy.Tunnel, typeof(QueryContinueDragEventHandler), typeof(DragDrop)); 

        /// <summary>
        /// Adds a handler for the PreviewQueryContinueDrag attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddPreviewQueryContinueDragHandler(DependencyObject element, QueryContinueDragEventHandler handler) 
        {
            UIElement.AddHandler(element, PreviewQueryContinueDragEvent, handler); 
        }

        /// <summary>
        /// Removes a handler for the PreviewQueryContinueDrag attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param> 
        public static void RemovePreviewQueryContinueDragHandler(DependencyObject element, QueryContinueDragEventHandler handler)
        { 
            UIElement.RemoveHandler(element, PreviewQueryContinueDragEvent, handler);
        }

        /// <summary> 
        /// QueryContinueDrag
        /// </summary> 
        public static readonly RoutedEvent QueryContinueDragEvent = EventManager.RegisterRoutedEvent("QueryContinueDrag", RoutingStrategy.Bubble, typeof(QueryContinueDragEventHandler), typeof(DragDrop)); 

        /// <summary> 
        /// Adds a handler for the QueryContinueDrag attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddQueryContinueDragHandler(DependencyObject element, QueryContinueDragEventHandler handler)
        { 
            UIElement.AddHandler(element, QueryContinueDragEvent, handler); 
        }
 
        /// <summary>
        /// Removes a handler for the QueryContinueDrag attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemoveQueryContinueDragHandler(DependencyObject element, QueryContinueDragEventHandler handler) 
        { 
            UIElement.RemoveHandler(element, QueryContinueDragEvent, handler);
        } 

        /// <summary>
        /// PreviewGiveFeedback
        /// </summary> 
        public static readonly RoutedEvent PreviewGiveFeedbackEvent = EventManager.RegisterRoutedEvent("PreviewGiveFeedback", RoutingStrategy.Tunnel, typeof(GiveFeedbackEventHandler), typeof(DragDrop));
 
        /// <summary> 
        /// Adds a handler for the PreviewGiveFeedback attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param>
        public static void AddPreviewGiveFeedbackHandler(DependencyObject element, GiveFeedbackEventHandler handler)
        { 
            UIElement.AddHandler(element, PreviewGiveFeedbackEvent, handler);
        } 
 
        /// <summary>
        /// Removes a handler for the PreviewGiveFeedback attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemovePreviewGiveFeedbackHandler(DependencyObject element, GiveFeedbackEventHandler handler) 
        {
            UIElement.RemoveHandler(element, PreviewGiveFeedbackEvent, handler); 
        } 

        /// <summary> 
        /// GiveFeedback
        /// </summary>
        public static readonly RoutedEvent GiveFeedbackEvent = EventManager.RegisterRoutedEvent("GiveFeedback", RoutingStrategy.Bubble, typeof(GiveFeedbackEventHandler), typeof(DragDrop));
 
        /// <summary>
        /// Adds a handler for the GiveFeedback attached event 
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddGiveFeedbackHandler(DependencyObject element, GiveFeedbackEventHandler handler)
        {
            UIElement.AddHandler(element, GiveFeedbackEvent, handler);
        } 

        /// <summary> 
        /// Removes a handler for the GiveFeedback attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemoveGiveFeedbackHandler(DependencyObject element, GiveFeedbackEventHandler handler)
        {
            UIElement.RemoveHandler(element, GiveFeedbackEvent, handler); 
        }
 
        /// <summary> 
        /// PreviewDragEnter
        /// </summary> 
        public static readonly RoutedEvent PreviewDragEnterEvent = EventManager.RegisterRoutedEvent("PreviewDragEnter", RoutingStrategy.Tunnel, typeof(DragEventHandler), typeof(DragDrop));

        /// <summary>
        /// Adds a handler for the PreviewDragEnter attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddPreviewDragEnterHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.AddHandler(element, PreviewDragEnterEvent, handler);
        }

        /// <summary> 
        /// Removes a handler for the PreviewDragEnter attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemovePreviewDragEnterHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.RemoveHandler(element, PreviewDragEnterEvent, handler);
        }
 
        /// <summary>
        /// DragEnter 
        /// </summary> 
        public static readonly RoutedEvent DragEnterEvent = EventManager.RegisterRoutedEvent("DragEnter", RoutingStrategy.Bubble, typeof(DragEventHandler), typeof(DragDrop));
 
        /// <summary>
        /// Adds a handler for the DragEnter attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be added</param>
        public static void AddDragEnterHandler(DependencyObject element, DragEventHandler handler) 
        { 
            UIElement.AddHandler(element, DragEnterEvent, handler);
        } 

        /// <summary>
        /// Removes a handler for the DragEnter attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param> 
        public static void RemoveDragEnterHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.RemoveHandler(element, DragEnterEvent, handler); 
        }

        /// <summary>
        /// PreviewDragOver 
        /// </summary>
        public static readonly RoutedEvent PreviewDragOverEvent = EventManager.RegisterRoutedEvent("PreviewDragOver", RoutingStrategy.Tunnel, typeof(DragEventHandler), typeof(DragDrop)); 
 
        /// <summary>
        /// Adds a handler for the PreviewDragOver attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param>
        public static void AddPreviewDragOverHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.AddHandler(element, PreviewDragOverEvent, handler); 
        } 

        /// <summary> 
        /// Removes a handler for the PreviewDragOver attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param> 
        public static void RemovePreviewDragOverHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.RemoveHandler(element, PreviewDragOverEvent, handler); 
        }
 
        /// <summary>
        /// DragOver
        /// </summary>
        public static readonly RoutedEvent DragOverEvent = EventManager.RegisterRoutedEvent("DragOver", RoutingStrategy.Bubble, typeof(DragEventHandler), typeof(DragDrop)); 

        /// <summary> 
        /// Adds a handler for the DragOver attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be added</param>
        public static void AddDragOverHandler(DependencyObject element, DragEventHandler handler)
        {
            UIElement.AddHandler(element, DragOverEvent, handler); 
        }
 
        /// <summary> 
        /// Removes a handler for the DragOver attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemoveDragOverHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.RemoveHandler(element, DragOverEvent, handler);
        } 
 
        /// <summary>
        /// PreviewDragLeave 
        /// </summary>
        public static readonly RoutedEvent PreviewDragLeaveEvent = EventManager.RegisterRoutedEvent("PreviewDragLeave", RoutingStrategy.Tunnel, typeof(DragEventHandler), typeof(DragDrop));

        /// <summary> 
        /// Adds a handler for the PreviewDragLeave attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be added</param>
        public static void AddPreviewDragLeaveHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.AddHandler(element, PreviewDragLeaveEvent, handler);
        }
 
        /// <summary>
        /// Removes a handler for the PreviewDragLeave attached event 
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param> 
        public static void RemovePreviewDragLeaveHandler(DependencyObject element, DragEventHandler handler)
        {
            UIElement.RemoveHandler(element, PreviewDragLeaveEvent, handler);
        } 

        /// <summary> 
        /// DragLeave 
        /// </summary>
        public static readonly RoutedEvent DragLeaveEvent = EventManager.RegisterRoutedEvent("DragLeave", RoutingStrategy.Bubble, typeof(DragEventHandler), typeof(DragDrop)); 

        /// <summary>
        /// Adds a handler for the DragLeave attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddDragLeaveHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.AddHandler(element, DragLeaveEvent, handler); 
        }

        /// <summary>
        /// Removes a handler for the DragLeave attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param> 
        public static void RemoveDragLeaveHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.RemoveHandler(element, DragLeaveEvent, handler);
        }

        /// <summary> 
        /// PreviewDrop
        /// </summary> 
        public static readonly RoutedEvent PreviewDropEvent = EventManager.RegisterRoutedEvent("PreviewDrop", RoutingStrategy.Tunnel, typeof(DragEventHandler), typeof(DragDrop)); 

        /// <summary> 
        /// Adds a handler for the PreviewDrop attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param> 
        public static void AddPreviewDropHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.AddHandler(element, PreviewDropEvent, handler); 
        }
 
        /// <summary>
        /// Removes a handler for the PreviewDrop attached event
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param> 
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemovePreviewDropHandler(DependencyObject element, DragEventHandler handler) 
        { 
            UIElement.RemoveHandler(element, PreviewDropEvent, handler);
        } 

        /// <summary>
        /// Drop
        /// </summary> 
        public static readonly RoutedEvent DropEvent = EventManager.RegisterRoutedEvent("Drop", RoutingStrategy.Bubble, typeof(DragEventHandler), typeof(DragDrop));
 
        /// <summary> 
        /// Adds a handler for the Drop attached event
        /// </summary> 
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be added</param>
        public static void AddDropHandler(DependencyObject element, DragEventHandler handler)
        { 
            UIElement.AddHandler(element, DropEvent, handler);
        } 
 
        /// <summary>
        /// Removes a handler for the Drop attached event 
        /// </summary>
        /// <param name="element">UIElement or ContentElement that listens to this event</param>
        /// <param name="handler">Event Handler to be removed</param>
        public static void RemoveDropHandler(DependencyObject element, DragEventHandler handler) 
        {
            UIElement.RemoveHandler(element, DropEvent, handler); 
        } 

        internal static readonly RoutedEvent DragDropStartedEvent = EventManager.RegisterRoutedEvent("DragDropStarted", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(DragDrop)); 
        internal static readonly RoutedEvent DragDropCompletedEvent = EventManager.RegisterRoutedEvent("DragDropCompleted", RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(DragDrop));

        #endregion DragDrop Event
 
        //------------------------------------------------------
        // 
        //  Public Methods 
        //
        //----------------------------------------------------- 

        #region Public Methods

        /// <summary> 
        /// Begins a drag-and-drop operation.
        /// </summary> 
        /// <param name="dragSource"> 
        /// The drag source object.
        /// </param> 
        /// <param name="data">
        /// The data to drag.
        /// </param>
        /// <param name="allowedEffects"> 
        /// The allowed effects that is one of the DragDropEffects values.
        /// </param> 
        /// <remarks> 
        /// Requires UnmanagedCode permission.
        /// If caller does not have this permission, the dragdrop will not occur. 
        /// </remarks>
        /// <SecurityNote>
        /// Critical - calls critical code (OleDoDragDrop), but this is OK since we won't
        ///            allow the initiate DragDrop operation without the unmanaged code permission. 
        ///            Demand the unmanaged code permission to block initiating DragDrop both
        ///            intranet and internet zone. 
        /// PublicOK - It's disabled in partial trust. 
        /// </SecurityNote>
        [SecurityCritical] 
        public static DragDropEffects DoDragDrop(DependencyObject dragSource, object data, DragDropEffects allowedEffects)
        {
            DataObject dataObject;
 
            // Demand the unmanaged code permission to initiate DragDrop operation.
            SecurityHelper.DemandUnmanagedCode(); 
 
            if (dragSource == null)
            { 
                throw new ArgumentNullException("dragSource");
            }

            if (data == null) 
            {
                throw new ArgumentNullException("data"); 
            } 

            RoutedEventArgs args = new RoutedEventArgs(DragDropStartedEvent, dragSource); 

            // Raise the DragDropStarted internal event(Bubble).
            if (dragSource is UIElement)
            { 
                ((UIElement)dragSource).RaiseEvent(args);
            } 
            else if (dragSource is ContentElement) 
            {
                ((ContentElement)dragSource).RaiseEvent(args); 
            }
            else if (dragSource is UIElement3D)
            {
                ((UIElement3D)dragSource).RaiseEvent(args); 
            }
            else 
            { 
                throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "dragSource");
            } 

            dataObject = data as DataObject;

            if (dataObject == null) 
            {
                // Create DataObject for DragDrop from the data. 
                dataObject = new DataObject(data); 
            }
 
            // Call OleDoDragDrop with DataObject.
            DragDropEffects ret = OleDoDragDrop(dragSource, dataObject, allowedEffects);

            args = new RoutedEventArgs(DragDropCompletedEvent, dragSource); 

            // Raise the DragDropCompleted internal event(Bubble). 
            if (dragSource is UIElement) 
            {
                ((UIElement)dragSource).RaiseEvent(args); 
            }
            else if (dragSource is ContentElement)
            {
                ((ContentElement)dragSource).RaiseEvent(args); 
            }
            else if (dragSource is UIElement3D) 
            { 
                ((UIElement3D)dragSource).RaiseEvent(args);
            } 
            else
            {
                throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "dragSource");
            } 

            return ret; 
        } 

        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Internal Methods 
        //
        //------------------------------------------------------ 
 
        #region Internal Methods
 
        /// <summary>
        /// Register the drop target which want to a droppable window.
        /// </summary>
        /// <param name="windowHandle"> 
        /// The window handle to be drop target .
        /// </param> 
        /// <SecurityNote> 
        /// Critical - calls critical code (OleRegisterDragDrop), and potentially deals with unmanged code..
        /// 
        /// TreatAsSafe - RegisterDropTarget check the unmanged code permission.
        ///               Demmand the unmanaged code permission to block the register drop target
        ///               both intranet and internet zone.
        /// </SecurityNote> 
        [SecurityCritical, SecurityTreatAsSafe]
        internal static void RegisterDropTarget(IntPtr windowHandle) 
        { 
            if (SecurityHelper.CheckUnmanagedCodePermission() && windowHandle != IntPtr.Zero)
            { 
                // Create OleDragSource and call Ole DoDragDrop for starting DragDrop.
                OleDropTarget oleDropTarget = new OleDropTarget(windowHandle);

                // Call OLE RegisterDragDrop and it will get the drop target events during drag-and-drop 
                // operation on the drop target window.
                OleServicesContext.CurrentOleServicesContext.OleRegisterDragDrop( 
                    new HandleRef(null, windowHandle), 
                    (UnsafeNativeMethods.IOleDropTarget)oleDropTarget);
            } 
        }

        /// <summary>
        /// Revoke the drop target which was a droppable window. 
        /// </summary>
        /// <param name="windowHandle"> 
        /// The window handle that can accept drop. 
        /// </param>
        /// <SecurityNote> 
        /// Critical - calls critical code (OleRevokeDragDrop).We do not want this called excessively
        /// TreatAsSafe - RevokeDropTarget check the unmanged code permission.
        ///               Demmand the unmanaged code permission to block the revoke drop target
        ///               both intranet and internet zone. 
        /// </SecurityNote>
        [SecurityCritical, SecurityTreatAsSafe] 
        internal static void RevokeDropTarget(IntPtr windowHandle) 
        {
            if (SecurityHelper.CheckUnmanagedCodePermission() && windowHandle != IntPtr.Zero) 
            {
                // Call OLE RevokeDragDrop to revoke the droppable target window.
                OleServicesContext.CurrentOleServicesContext.OleRevokeDragDrop(
                    new HandleRef(null, windowHandle)); 
            }
        } 
 
        /// <summary>
        /// Validate the dragdrop effects of DragDrop. 
        /// </summary>
        internal static bool IsValidDragDropEffects(DragDropEffects dragDropEffects)
        {
            int dragDropEffectsAll; 

            dragDropEffectsAll = (int)(DragDropEffects.None | 
                                       DragDropEffects.Copy | 
                                       DragDropEffects.Move |
                                       DragDropEffects.Link | 
                                       DragDropEffects.Scroll |
                                       DragDropEffects.All);

            if (((int)dragDropEffects & ~dragDropEffectsAll) != 0) 
            {
                return false; 
            } 

            return true; 
        }

        /// <summary>
        /// Validate the drag action of DragDrop. 
        /// </summary>
        internal static bool IsValidDragAction(DragAction dragAction) 
        { 
            if (dragAction == DragAction.Continue ||
                dragAction == DragAction.Drop || 
                dragAction == DragAction.Cancel)
            {
                return true;
            } 
            else
            { 
                return false; 
            }
        } 

        /// <summary>
        /// Validate the key states of DragDrop.
        /// </summary> 
        internal static bool IsValidDragDropKeyStates(DragDropKeyStates dragDropKeyStates)
        { 
            int keyStatesAll; 

            keyStatesAll = (int)(DragDropKeyStates.LeftMouseButton | 
                                 DragDropKeyStates.RightMouseButton |
                                 DragDropKeyStates.ShiftKey |
                                 DragDropKeyStates.ControlKey |
                                 DragDropKeyStates.MiddleMouseButton | 
                                 DragDropKeyStates.AltKey);
 
            if (((int)dragDropKeyStates & ~keyStatesAll) != 0) 
            {
                return false; 
            }

            return true;
        } 

        #endregion Internal Methods 
 
        //-----------------------------------------------------
        // 
        //  Private Methods
        //
        //------------------------------------------------------
 
        #region Private Methods
 
        /// <summary> 
        /// Begins a drag-and-drop operation through OLE DoDragDrop.
        /// </summary> 
        /// <param name="dragSource">
        /// The drag source object.
        /// </param>
        /// <param name="dataObject"> 
        /// The data object to drag.
        /// </param> 
        /// <param name="allowedEffects"> 
        /// The allowed effects that is one of the DragDropEffects values.
        /// </param> 
        [SecurityCritical]
        private static DragDropEffects OleDoDragDrop(DependencyObject dragSource, DataObject dataObject, DragDropEffects allowedEffects)
        {
            int[] dwEffect; 
            OleDragSource oleDragSource;
 
            Debug.Assert(dragSource != null, "Invalid dragSource"); 
            Debug.Assert(dataObject != null, "Invalid dataObject");
 
            // Create the int array for passing parameter of OLE DoDragDrop
            dwEffect = new int[1];

            // Create OleDragSource and call Ole DoDragDrop for starting DragDrop. 
            oleDragSource = new OleDragSource(dragSource);
 
            // Call OLE DoDragDrop and it will hanlde all mouse and keyboard input until drop the object. 
            // We don't need to check the error return since PreserveSig attribute is defined as "false"
            // which will pops up the exception automatically. 
            OleServicesContext.CurrentOleServicesContext.OleDoDragDrop(
                                                            (IComDataObject)dataObject,
                                                            (UnsafeNativeMethods.IOleDropSource)oleDragSource,
                                                            (int)allowedEffects, 
                                                            dwEffect);
 
            // return the drop effect of DragDrop. 
            return (DragDropEffects)dwEffect[0];
        } 

        #endregion Private Methods
    }
 
    #endregion DragDrop
 
 
    #region OleDragSource
 
  
 
    #region OleDropTarget 

 
} 
