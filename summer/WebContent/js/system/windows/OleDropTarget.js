   /// <summary> 
    /// OleDropTarget that handle ole DragEnter DragOver DragLeave and DragDrop.
    /// </summary>
    internal class OleDropTarget : DispatcherObject, UnsafeNativeMethods.IOleDropTarget
    { 
        //------------------------------------------------------
        // 
        //  Constructor 
        //
        //----------------------------------------------------- 

        #region Constructor

        /// <summary> 
        /// OleDropTarget Constructor.
        /// </summary> 
        public OleDropTarget(IntPtr handle) 
        {
            if (handle == IntPtr.Zero) 
            {
                throw new ArgumentNullException("handle");
            }
 
            _windowHandle = handle;
        } 
 
        #endregion Constructor
 
        //------------------------------------------------------
        //
        //  IOleDropTarget Interface
        // 
        //-----------------------------------------------------
 
        #region IOleDropTarget 

        /// <summary> 
        /// OleDragEnter - check the data object and notify DragEnter to the target element.
        /// </summary>
        int UnsafeNativeMethods.IOleDropTarget.OleDragEnter(object data, int dragDropKeyStates, long point, ref int effects)
        { 
            DependencyObject target;
            Point targetPoint; 
 
            // Get the data object and immediately return if there isn't the data object or no available data.
            _dataObject = GetDataObject(data); 
            if (_dataObject == null || !IsDataAvailable(_dataObject))
            {
                // Set the none effect.
                effects = (int)DragDropEffects.None; 

                return NativeMethods.S_FALSE; 
            } 

            // Get the current target from the mouse drag point that is based on screen. 
            target = GetCurrentTarget(point, out targetPoint);

            // Set the last target element with the current target.
            _lastTarget = target; 

            if (target != null) 
            { 
                // Create DragEvent agrument and then raise DragEnter event for Tunnel or Buuble event.
                RaiseDragEvent( 
                    DragDrop.DragEnterEvent,
                    dragDropKeyStates,
                    ref effects,
                    target, 
                    targetPoint);
            } 
            else 
            {
                // Set the none effect. 
                effects = (int)DragDropEffects.None;
            }

            return NativeMethods.S_OK; 
        }
 
        /// <summary> 
        /// OleDragOver - get the drop effect from the target element.
        /// </summary> 
        int UnsafeNativeMethods.IOleDropTarget.OleDragOver(int dragDropKeyStates, long point, ref int effects)
        {
            DependencyObject target;
            Point targetPoint; 

            Invariant.Assert(_dataObject != null); 
 
            // Get the current target from the mouse drag point that is based on screen.
            target = GetCurrentTarget(point, out targetPoint); 

            // Raise DragOver event to the target to get DragDrop effect status from the target.
            if (target != null)
            { 
                // Avalon apps can have only one window handle, so we need to generate DragLeave and
                // DragEnter event to target when target is changed by the mouse dragging. 
                // If the current target is the same as the last target, just raise DragOver event to the target. 
                if (target != _lastTarget)
                { 
                    try
                    {
                        if (_lastTarget != null)
                        { 
                            // Raise DragLeave event to the last target.
                            RaiseDragEvent( 
                                DragDrop.DragLeaveEvent, 
                                dragDropKeyStates,
                                ref effects, 
                                _lastTarget,
                                targetPoint);
                        }
 
                        // Raise DragEnter event to the new target.
                        RaiseDragEvent( 
                            DragDrop.DragEnterEvent, 
                            dragDropKeyStates,
                            ref effects, 
                            target,
                            targetPoint);
                    }
                    finally 
                    {
                        // Reset the last target element to check it with the next current element. 
                        _lastTarget = target; 
                    }
                } 
                else
                {
                    // Raise DragOver event to the target.
                    RaiseDragEvent( 
                        DragDrop.DragOverEvent,
                        dragDropKeyStates, 
                        ref effects, 
                        target,
                        targetPoint); 
                }
            }
            else
            { 
                try
                { 
                    if (_lastTarget != null) 
                    {
                        // Raise DragLeave event to the last target. 
                        RaiseDragEvent(
                            DragDrop.DragLeaveEvent,
                            dragDropKeyStates,
                            ref effects, 
                            _lastTarget,
                            targetPoint); 
                    } 
                }
                finally 
                {
                    // Update the last target element as the current target element.
                    _lastTarget = target;
                    effects = (int)DragDropEffects.None; 
                }
            } 
 
            return NativeMethods.S_OK;
        } 

        /// <summary>
        /// OleDragLeave.
        /// </summary> 
        int UnsafeNativeMethods.IOleDropTarget.OleDragLeave()
        { 
            if (_lastTarget != null) 
            {
                int effects; 

                // Set DragDrop effects as DragDropEffects.None
                effects = 0;
 
                try
                { 
                    // Raise DragLeave event for the last target element. 
                    RaiseDragEvent(
                        DragDrop.DragLeaveEvent, 
                        /* DragDropKeyStates.None */ 0,
                        ref effects,
                        _lastTarget,
                        new Point(0, 0)); 
                }
                finally 
                { 
                    // Reset the last target and data object.
                    _lastTarget = null; 
                    _dataObject = null;
                }
            }
 
            return NativeMethods.S_OK;
        } 
 
        /// <summary>
        /// OleDrop - drop the object to the target element. 
        /// </summary>
        int UnsafeNativeMethods.IOleDropTarget.OleDrop(object data, int dragDropKeyStates, long point, ref int effects)
        {
            IDataObject dataObject; 
            DependencyObject target;
            Point targetPoint; 
 
            // Get the data object and then immediately return fail if there isn't the proper data.
            dataObject = GetDataObject(data); 
            if (dataObject == null || !IsDataAvailable(dataObject))
            {
                effects = (int)DragDropEffects.None;
 
                return NativeMethods.S_FALSE;
            } 
 
            // Reset last element and target point.
            _lastTarget = null; 

            // Get the current target from the screen mouse point.
            target = GetCurrentTarget(point, out targetPoint);
 
            // Raise Drop event to the target element.
            if (target != null) 
            { 
                // Raise Drop event to the drop target.
                RaiseDragEvent( 
                    DragDrop.DropEvent,
                    dragDropKeyStates,
                    ref effects,
                    target, 
                    targetPoint);
            } 
            else 
            {
                effects = (int)DragDropEffects.None; 
            }

            return NativeMethods.S_OK;
        } 

        #endregion IOleDropTarget 
 
        #region Private Methods
 
        /// <summary>
        /// Raise Drag(Enter/Over/Leave/Drop) events to the taret.
        /// </summary>
        private void RaiseDragEvent(RoutedEvent dragEvent, int dragDropKeyStates, ref int effects, DependencyObject target, Point targetPoint) 
        {
            DragEventArgs dragEventArgs; 
 
            Invariant.Assert(_dataObject != null);
            Invariant.Assert(target != null); 

            // Create DragEvent argement to raise DragEnter events to the target.
            dragEventArgs = new DragEventArgs(
                _dataObject, 
                (DragDropKeyStates)dragDropKeyStates,
                (DragDropEffects)effects, 
                target, 
                targetPoint);
 
            // Set the preview(Tunnel) drop target events(Tunnel) first.
            if (dragEvent == DragDrop.DragEnterEvent)
            {
                dragEventArgs.RoutedEvent = DragDrop.PreviewDragEnterEvent; 
            }
            else if (dragEvent == DragDrop.DragOverEvent) 
            { 
                dragEventArgs.RoutedEvent = DragDrop.PreviewDragOverEvent;
            } 
            else if (dragEvent == DragDrop.DragLeaveEvent)
            {
                dragEventArgs.RoutedEvent = DragDrop.PreviewDragLeaveEvent;
            } 
            else if (dragEvent == DragDrop.DropEvent)
            { 
                dragEventArgs.RoutedEvent = DragDrop.PreviewDropEvent; 
            }
 
            // Raise the preview drop target events(Tunnel).
            if (target is UIElement)
            {
                ((UIElement)target).RaiseEvent(dragEventArgs); 
            }
            else if (target is ContentElement) 
            { 
                ((ContentElement)target).RaiseEvent(dragEventArgs);
            } 
            else if (target is UIElement3D)
            {
                ((UIElement3D)target).RaiseEvent(dragEventArgs);
            } 
            else
            { 
                throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope"); 
            }
 
            // Raise the bubble DragEvent event if the preview DragEvent isn't handled.
            if (!dragEventArgs.Handled)
            {
                // Set the drop target events(Bubble). 
                dragEventArgs.RoutedEvent = dragEvent;
 
                // Raise the drop target events(Bubble). 
                if (target is UIElement)
                { 
                    ((UIElement)target).RaiseEvent(dragEventArgs);
                }
                else if (target is ContentElement)
                { 
                    ((ContentElement)target).RaiseEvent(dragEventArgs);
                } 
                else if (target is UIElement3D) 
                {
                    ((UIElement3D)target).RaiseEvent(dragEventArgs); 
                }
                else
                {
                    throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope"); 
                }
            } 
 
            // Call the default drop target event handling method internally if no one handle the drop target events.
            if (!dragEventArgs.Handled) 
            {
                if (dragEvent == DragDrop.DragEnterEvent)
                {
                    OnDefaultDragEnter(dragEventArgs); 
                }
                else if (dragEvent == DragDrop.DragOverEvent) 
                { 
                    OnDefaultDragOver(dragEventArgs);
                } 
            }

            // Update DragDrop effects after raise DragEvent.
            effects = (int)dragEventArgs.Effects; 
        }
 
        /// <summary> 
        /// Default drag enter during drag-and-drop operation.
        /// </summary> 
        private void OnDefaultDragEnter(DragEventArgs e)
        {
            bool ctrlKeyDown;
 
            // If there's no supported data available, don't allow the drag-and-drop.
            if (e.Data == null) 
            { 
                e.Effects = DragDropEffects.None;
                return; 
            }

            // Ok, there's data to move or copy here.
            if ((e.AllowedEffects & DragDropEffects.Move) != 0) 
            {
                e.Effects = DragDropEffects.Move; 
            } 

            ctrlKeyDown = ((int)(e.KeyStates & DragDropKeyStates.ControlKey) != 0); 

            if (ctrlKeyDown)
            {
                e.Effects = DragDropEffects.Copy; 
            }
        } 
 
        /// <summary>
        /// Default drag over during drag-and-drop operation. 
        /// </summary>
        private void OnDefaultDragOver(DragEventArgs e)
        {
            bool ctrlKeyDown; 

            // If there's no supported data available, don't allow the drag-and-drop. 
            if (e.Data == null) 
            {
                e.Effects = DragDropEffects.None; 
                return;
            }

            // Ok, there's data to move or copy here. 
            if ((e.AllowedEffects & DragDropEffects.Move) != 0)
            { 
                e.Effects = DragDropEffects.Move; 
            }
 
            ctrlKeyDown = ((int)(e.KeyStates & DragDropKeyStates.ControlKey) != 0);

            if (ctrlKeyDown)
            { 
                e.Effects = DragDropEffects.Copy;
            } 
        } 

        /// <summary> 
        /// Get the client point from the screen point.
        /// </summary>
        private Point GetClientPointFromScreenPoint(long dragPoint, PresentationSource source)
        { 
            Point screenPoint;
            Point clientPoint; 
 
            // Convert the screen point to the client window point
            screenPoint = new Point((int)(dragPoint & 0xffffffff), (int)((dragPoint >> 32) & 0xffffffff)); 
            clientPoint = PointUtil.ScreenToClient(screenPoint, source);

            return clientPoint;
        } 

        /// <summary> 
        /// Get the current target object and target point from the mouse dragging point 
        /// that is the screen point.
        /// </summary> 
        private DependencyObject GetCurrentTarget(long dragPoint, out Point targetPoint)
        {
            HwndSource source;
            DependencyObject target; 

            // Initialize the target as null. 
            target = null; 

            // Get the source from the source to hit-test and translate point. 
            source = HwndSource.FromHwnd(_windowHandle);

            // Get the client point from the screen point.
            targetPoint = GetClientPointFromScreenPoint(dragPoint, source); 

            if (source != null) 
            { 
                UIElement targetUIElement;
 
                // Hit-Testing to get the target object from the current mouse dragging point.
                // LocalHitTest() will get the hit-tested object from the mouse dragging point after
                // conversion the pixel to the measure unit.
                target = MouseDevice.LocalHitTest(targetPoint, source) as DependencyObject; 

                targetUIElement = target as UIElement; 
                if (targetUIElement != null) 
                {
                    if (targetUIElement.AllowDrop) 
                    {
                        // Assign the target as the UIElement.
                        target = targetUIElement;
                    } 
                    else
                    { 
                        target = null; 
                    }
                } 
                else
                {
                    ContentElement targetContentElement;
 
                    targetContentElement = target as ContentElement;
                    if (targetContentElement != null) 
                    { 
                        if (targetContentElement.AllowDrop)
                        { 
                            // Assign the target as the ContentElement.
                            target = targetContentElement;
                        }
                        else 
                        {
                            target = null; 
                        } 
                    }
                    else 
                    {
                        UIElement3D targetUIElement3D;

                        targetUIElement3D = target as UIElement3D; 
                        if (targetUIElement3D != null)
                        { 
                            if (targetUIElement3D.AllowDrop) 
                            {
                                target = targetUIElement3D; 
                            }
                            else
                            {
                                target = null; 
                            }
                        } 
                    } 
                }
 
                if (target != null)
                {
                    // Translate the client point to the root point and then translate it to target point.
                    targetPoint = PointUtil.ClientToRoot(targetPoint, source); 
                    targetPoint = InputElement.TranslatePoint(targetPoint, source.RootVisual, target);
                } 
            } 

            return target; 
        }

        /// <summary>
        /// Get the data object. 
        /// </summary>
        private IDataObject GetDataObject(object data) 
        { 
            IDataObject dataObject;
 
            dataObject = null;

            // We see if data is available on the data object.
            if (data != null) 
            {
                if (data is DataObject) 
                { 
                    dataObject = (DataObject)data;
                } 
                else
                {
                    dataObject = new DataObject((IComDataObject)data);
                } 
            }
 
            return dataObject; 
        }
 
        /// <summary>
        /// Check the available data.
        /// </summary>
        private bool IsDataAvailable(IDataObject dataObject) 
        {
            bool dataAvailable; 
 
            dataAvailable = false;
 
            if (dataObject != null)
            {
                string[] formats;
 
                formats = dataObject.GetFormats();
 
                for (int i = 0; i < formats.Length; i++) 
                {
                    if (dataObject.GetDataPresent(formats[i])) 
                    {
                        dataAvailable = true;
                        break;
                    } 
                }
            } 
 
            return dataAvailable;
        } 

        #endregion Private Methods

        //----------------------------------------------------- 
        //
        //  Private Fields 
        // 
        //-----------------------------------------------------
 
        #region Private Fields

        private IntPtr _windowHandle;
 
        private IDataObject _dataObject;
 
        private DependencyObject _lastTarget; 

        #endregion Private Fields 
    }

    #endregion OleDropTarget