  /// <summary>
    /// OleDragSource that handle ole QueryContinueDrag and GiveFeedback.
    /// </summary>
    internal class OleDragSource : UnsafeNativeMethods.IOleDropSource 
    {
        //----------------------------------------------------- 
        // 
        //  Constructor
        // 
        //-----------------------------------------------------

        #region Constructor
 
        /// <summary>
        /// OleDragSource constructor. 
        /// </summary> 
        public OleDragSource(DependencyObject dragSource)
        { 
            _dragSource = dragSource;
        }

        #endregion Constructor 

        //----------------------------------------------------- 
        // 
        //  Private Methods
        // 
        //------------------------------------------------------

        #region IOleDropSource
 
        /// <summary>
        /// Query the source to know the drag continue or not. 
        /// </summary> 
        int UnsafeNativeMethods.IOleDropSource.OleQueryContinueDrag(int escapeKey, int grfkeyState)
        { 
            bool escapePressed;
            QueryContinueDragEventArgs args;

            escapePressed = false; 

            if (escapeKey != 0) 
            { 
                escapePressed = true;
            } 

            // Create QueryContinueDrag event arguments.
            args = new QueryContinueDragEventArgs(escapePressed, (DragDropKeyStates)grfkeyState);
 
            // Raise the query continue drag event for both Tunnel(Preview) and Bubble.
            RaiseQueryContinueDragEvent(args); 
 
            // Check the drag continue result.
            if (args.Action == DragAction.Continue) 
            {
                return NativeMethods.S_OK;
            }
            else if (args.Action == DragAction.Drop) 
            {
                return NativeMethods.DRAGDROP_S_DROP; 
            } 
            else if (args.Action == DragAction.Cancel)
            { 
                return NativeMethods.DRAGDROP_S_CANCEL;
            }

            return NativeMethods.S_OK; 
        }
 
        /// <summary> 
        /// Give feedback from the source whether use the default cursor or not.
        /// </summary> 
        int UnsafeNativeMethods.IOleDropSource.OleGiveFeedback(int effect)
        {
            GiveFeedbackEventArgs args;
 
            // Create GiveFeedback event arguments.
            args = new GiveFeedbackEventArgs((DragDropEffects)effect, /*UseDefaultCursors*/ false); 
 
            // Raise the give feedback event for both Tunnel(Preview) and Bubble.
            RaiseGiveFeedbackEvent(args); 

            // Check the give feedback result whether use default cursors or not.
            if (args.UseDefaultCursors)
            { 
                return NativeMethods.DRAGDROP_S_USEDEFAULTCURSORS;
            } 
 
            return NativeMethods.S_OK;
        } 

        /// <summary>
        /// Raise QueryContinueDrag event for Tunel and Bubble.
        /// </summary> 
        private void RaiseQueryContinueDragEvent(QueryContinueDragEventArgs args)
        { 
            // Set PreviewQueryContinueDrag(Tunnel) first. 
            args.RoutedEvent=DragDrop.PreviewQueryContinueDragEvent;
 
            // Raise the preview QueryContinueDrag event(Tunnel).
            if (_dragSource is UIElement)
            {
                ((UIElement)_dragSource).RaiseEvent(args); 
            }
            else if (_dragSource is ContentElement) 
            { 
                ((ContentElement)_dragSource).RaiseEvent(args);
            } 
            else if (_dragSource is UIElement3D)
            {
                ((UIElement3D)_dragSource).RaiseEvent(args);
            } 
            else
            { 
                throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope"); 
            }
 
            // Set QueryContinueDrag(Bubble).
            args.RoutedEvent = DragDrop.QueryContinueDragEvent;

            // Raise QueryContinueDrag event(Bubble). 
            if (!args.Handled)
            { 
                if (_dragSource is UIElement) 
                {
                    ((UIElement)_dragSource).RaiseEvent(args); 
                }
                else if (_dragSource is ContentElement)
                {
                    ((ContentElement)_dragSource).RaiseEvent(args); 
                }
                else if (_dragSource is UIElement3D) 
                { 
                    ((UIElement3D)_dragSource).RaiseEvent(args);
                } 
                else
                {
                    throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope");
                } 
            }
 
            // Call the default event handling method internally if no one handle the drag source events. 
            if (!args.Handled)
            { 
                OnDefaultQueryContinueDrag(args);
            }
        }
 
        /// <summary>
        /// Raise GiveFeedback event for Tunnel and Bubble. 
        /// </summary> 
        private void RaiseGiveFeedbackEvent(GiveFeedbackEventArgs args)
        { 
            // Set PreviewGiveFeedback(Tunnel) first.
            args.RoutedEvent=DragDrop.PreviewGiveFeedbackEvent;

            // Raise the preview GiveFeedback(Tunnel). 
            if (_dragSource is UIElement)
            { 
                ((UIElement)_dragSource).RaiseEvent(args); 
            }
            else if (_dragSource is ContentElement) 
            {
                ((ContentElement)_dragSource).RaiseEvent(args);
            }
            else if (_dragSource is UIElement3D) 
            {
                ((UIElement3D)_dragSource).RaiseEvent(args); 
            } 
            else
            { 
                throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope");
            }

            // Set GiveFeedback event ID(Bubble). 
            args.RoutedEvent = DragDrop.GiveFeedbackEvent;
 
            if (!args.Handled) 
            {
                // Raise GiveFeedback event(Bubble). 
                if (_dragSource is UIElement)
                {
                    ((UIElement)_dragSource).RaiseEvent(args);
                } 
                else if (_dragSource is ContentElement)
                { 
                    ((ContentElement)_dragSource).RaiseEvent(args); 
                }
                else if (_dragSource is UIElement3D) 
                {
                    ((UIElement3D)_dragSource).RaiseEvent(args);
                }
                else 
                {
                    throw new ArgumentException(SR.Get(SRID.ScopeMustBeUIElementOrContent), "scope"); 
                } 
            }
 
            // Call the default event handling method internally if no one handle the drag source events.
            if (!args.Handled)
            {
                OnDefaultGiveFeedback(args); 
            }
        } 
 
        /// <summary>
        /// Default query continue drag during drag-and-drop operation. 
        /// </summary>
        /// <remarks>
        ///     At this stage we do not know application's intended mouse
        ///     button combination for dragging. For default purposes we assume 
        ///     that the DragDrop happens due to single mouse button press.
        ///     Hence if any two mouse buttons are pressed at any point of time, 
        ///     then we cancel the drapdrop. Also if no mouse buttons are pressed at 
        ///     any point of time, then we complete the drop. If an application intends
        ///     to privide multi-button press dragging (like dragging by pressing 
        ///     both left and right buttons of mouse) applications will have
        ///     to handle (Preview)QueryContiueDragEvent to the allow
        ///     such valid combinations explicitly.
        /// </remarks> 
        private void OnDefaultQueryContinueDrag(QueryContinueDragEventArgs e)
        { 
            int mouseButtonDownCount = 0; 

            if ((e.KeyStates & DragDropKeyStates.LeftMouseButton) == DragDropKeyStates.LeftMouseButton) 
            {
                mouseButtonDownCount++;
            }
            if ((e.KeyStates & DragDropKeyStates.MiddleMouseButton) == DragDropKeyStates.MiddleMouseButton) 
            {
                mouseButtonDownCount++; 
            } 
            if ((e.KeyStates & DragDropKeyStates.RightMouseButton) == DragDropKeyStates.RightMouseButton)
            { 
                mouseButtonDownCount++;
            }

            e.Action = DragAction.Continue; 

            if (e.EscapePressed || 
                mouseButtonDownCount >= 2) 
            {
                e.Action = DragAction.Cancel; 
            }
            else if (mouseButtonDownCount == 0)
            {
                e.Action = DragAction.Drop; 
            }
        } 
 
        /// <summary>
        /// Default give feedback during drag-and-drop operation. 
        /// </summary>
        private void OnDefaultGiveFeedback(GiveFeedbackEventArgs e)
        {
            // Show the default DragDrop cursor. 
            e.UseDefaultCursors = true;
        } 
 
        #endregion IOleDropSource
 
        //-----------------------------------------------------
        //
        //  Private Fields
        // 
        //------------------------------------------------------
 
        #region Private Fields 

        private DependencyObject _dragSource; 

        #endregion Private Fields
    }
 
    #endregion OleDragSource