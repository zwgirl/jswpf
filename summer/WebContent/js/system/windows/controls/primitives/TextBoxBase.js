/**
 * TextBoxBase
 */

define(["dojo/_base/declare", "system/Type", "controls/Control"], 
		function(declare, Type, Control){
	var TextBoxBase = declare("TextBoxBase", Control,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(TextBoxBase.prototype,{
//	      /// <summary>
//	      /// Event fired from this text box when its inner content 
//	      /// has been changed. 
//	      /// </summary>
//	      /// <remarks> 
//	      /// The event itself is defined on TextEditor.
//	      /// </remarks>
//	      public event TextChangedEventHandler TextChanged
//	      { 
//	          add
//	          { 
//	              AddHandler(TextChangedEvent, value); 
//	          }
//
//	          remove
//	          {
//	              RemoveHandler(TextChangedEvent, value);
//	          } 
//	      }
	});
	
	Object.defineProperties(TextBoxBase, {
	      /// <summary>
	      /// Event for "Text has changed" 
	      /// </summary> 
//	      public static readonly RoutedEvent 
		TextChangedEvent:
        {
        	get:function(){
        		if(FrameworkElement._TextChangedEvent === undefined){
        			FrameworkElement._TextChangedEvent  = EventManager.RegisterRoutedEvent(
        			          "TextChanged", // Event name 
        			          RoutingStrategy.Bubble, //
        			          TextChangedEventHandler.Type, //
        			          TextBoxBase.Type);
        		}
        		
        		return FrameworkElement._TextChangedEvent;
        	}
        } //

	});
	
	TextBoxBase.Type = new Type("TextBoxBase", TextBoxBase, [Control.Type]);
	return TextBoxBase;
});


//        /// <summary>
//        /// Static constructor - provides metadata for some properties
//        /// </summary> 
//        static TextBoxBase()
//        { 
//            DefaultStyleKeyProperty.OverrideMetadata(typeof(TextBoxBase), new FrameworkPropertyMetadata(typeof(TextBoxBase))); 
//            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(TextBoxBase));
// 
//            // Declaree listener for Padding property
//            Control.PaddingProperty.OverrideMetadata(typeof(TextBoxBase),
//                new FrameworkPropertyMetadata(new PropertyChangedCallback(OnScrollViewerPropertyChanged)));
// 
//            // Listner for InputMethod enabled/disabled property
//            // TextEditor needs to set the document manager focus. 
//            InputMethod.IsInputMethodEnabledProperty.OverrideMetadata(typeof(TextBoxBase), 
//                new FrameworkPropertyMetadata(new PropertyChangedCallback(OnInputMethodEnabledPropertyChanged)));
// 
//            IsEnabledProperty.OverrideMetadata(typeof(TextBoxBase), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
//            IsMouseOverPropertyKey.OverrideMetadata(typeof(TextBoxBase), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
//        }
// 
//        /// <summary>
//        /// Constructor. 
//        /// </summary> 
//        internal TextBoxBase() : base()
//        { 
//            // Subclass is expected to do three things:
//            // a) Register class command handlers
//            // b) create TextContainer and call InitializeTextContainer
//            // c) configure TextEditor by setting appropriate properties 
//            CoerceValue(HorizontalScrollBarVisibilityProperty);
// 
//            // Security team really wants to set AllowDrop property value as "False" 
//            // not to generate the security exception that can be happened in the
//            // partial trust environment. 
//            if (!SecurityHelper.CallerHasPermissionWithAppDomainOptimization(new SecurityPermission(SecurityPermissionFlag.UnmanagedCode)))
//            {
//                AllowDrop = false;
//            } 
//        }
// 
//        /// <summary>
//        /// Appends text to the current text of text box 
//        /// You can use this method to add text to the existing text
//        /// in the control instead of using the concatenation operator
//        /// (+) to concatenate text to the Text property
//        /// </summary> 
//        /// <param name="textData">
//        /// The text to append to the current contents of the text box 
//        /// </param> 
//        /// <remarks>
//        /// For RichTextBox this method works similar to TextRange.set_Text: 
//        /// every NewLine combination will insert a new Paragraph element.
//        /// </remarks>
//        public void AppendText(string textData)
//        { 
//            if (textData == null)
//            { 
//                return; 
//            }
// 
//            TextRange range = new TextRange(_textContainer.End, _textContainer.End);
//            range.Text = textData; // Note that in RichTextBox this assignment will convert NewLines into Paragraphs
//        }
// 
//        /// <summary>
//        /// Called when the Template's tree has been generated 
//        /// </summary> 
//        public override void OnApplyTemplate()
//        { 
//            base.OnApplyTemplate();
//            AttachToVisualTree();
//        }
// 
//        /// <summary>
//        /// Copy the current selection in the text box to the clipboard 
//        /// </summary> 
//        /// <SecurityNote>
//        ///   Critical - Calls TextEditorCopyPaste.Copy which sets data on the clipboard. 
//        ///   PublicOK - Indicates that this was not a user-initiated call, so TextEditorCopyPaste.Copy will
//        ///     check for clipboard permission.
//        /// </SecurityNote>
//        public void Copy()
//        { 
//            TextEditorCopyPaste.Copy(this.TextEditor, false); 
//        }
// 
//        /// <summary>
//        /// Moves the current selection in the textbox to the clipboard
//        /// </summary>
//        /// <SecurityNote> 
//        ///   Critical - Calls TextEditorCopyPaste.Cut which sets data on the clipboard.
//        ///   PublicOK - Indicates that this was not a user-initiated call, so TextEditorCopyPaste.Cut will 
//        ///     check for clipboard permission. 
//        /// </SecurityNote>
//        public void Cut()
//        {
//            TextEditorCopyPaste.Cut(this.TextEditor, false);
//        } 
//
//        /// <summary> 
//        /// Replaces the current selection in the textbox with the contents 
//        /// of the Clipboard
//        /// </summary> 
//        public void Paste()
//        {
//            TextEditorCopyPaste.Paste(this.TextEditor);
//        } 
//
//        /// <summary> 
//        /// Select all text in the TextBox 
//        /// </summary>
//        public void SelectAll() 
//        {
//            using (this.TextSelectionInternal.DeclareChangeBlock())
//            {
//                TextSelectionInternal.Select(_textContainer.Start, _textContainer.End); 
//            }
//        } 
//
//        /// <summary>
//        /// Alias for TextEditor.IsReadOnly dependency property.
//        /// Enables editing within this textbox.
//        /// </summary> 
//        public static readonly DependencyProperty IsReadOnlyProperty =
//                TextEditor.IsReadOnlyProperty.AddOwner( 
//                    typeof(TextBoxBase), 
//                    new FrameworkPropertyMetadata(
//                        false, 
//                        FrameworkPropertyMetadataOptions.Inherits,
//                        new PropertyChangedCallback(OnVisualStatePropertyChanged)));
//
//        /// <summary> 
//        /// Whether or not the Textbox is read-only
//        /// </summary> 
//        public bool IsReadOnly 
//        {
//            get { return (bool) GetValue(TextEditor.IsReadOnlyProperty); } 
//            set { SetValue(TextEditor.IsReadOnlyProperty, value); }
//        }
//
//        /// <summary> 
//        /// Indicates if VK_Return character is accepted as a normal new-line character, if it is true, it will insert a new-line to the textbox
//        /// or other editable controls, if it is false, it will not insert a new-line character to the controls's content, but just 
//        /// activates the control with focus. 
//        ///
//        /// Default: true. 
//        /// TextBox and/or RichTextBox need to set this value appropriately
//        /// </summary>
//        public static readonly DependencyProperty AcceptsReturnProperty =
//                KeyboardNavigation.AcceptsReturnProperty.AddOwner(typeof(TextBoxBase)); 
//
//        /// <summary> 
//        /// Whether or not the Textbox accepts newlines 
//        /// </summary>
//        public bool AcceptsReturn 
//        {
//            get { return (bool) GetValue(AcceptsReturnProperty); }
//            set { SetValue(AcceptsReturnProperty, value); }
//        } 
//
//        /// <summary> 
//        /// Indicates if VK_TAB character is accepted as a normal tab char, if it is true, it will insert a tab character to the control's content, 
//        /// otherwise, it will not insert new tab to the content of control, instead, it will navigate the focus to the next IsTabStop control.
//        /// 
//        /// Default: false.
//        ///
//        /// TextBox and RichTextBox need to set the value appropriately.
//        /// </summary> 
//        public static readonly DependencyProperty AcceptsTabProperty =
//                DependencyProperty.Register( 
//                        "AcceptsTab", // Property name 
//                        typeof(bool), // Property type
//                        typeof(TextBoxBase), // Property owner 
//                        new FrameworkPropertyMetadata(false /*default value*/));
//
//        /// <summary>
//        /// Whether or not the Textbox accepts tabs 
//        /// </summary>
//        public bool AcceptsTab 
//        { 
//            get { return (bool) GetValue(AcceptsTabProperty); }
//            set { SetValue(AcceptsTabProperty, value); } 
//        }
// 
//        /// <summary>
//        /// Exposes ScrollViewer's HorizontalScrollBarVisibility property 
//        /// Default: Hidden 
//        /// </summary>
//        public static readonly DependencyProperty HorizontalScrollBarVisibilityProperty = 
//                ScrollViewer.HorizontalScrollBarVisibilityProperty.AddOwner(
//                        typeof(TextBoxBase),
//                        new FrameworkPropertyMetadata(
//                                ScrollBarVisibility.Hidden, 
//                                new PropertyChangedCallback(OnScrollViewerPropertyChanged))); // PropertyChangedCallback
// 
//        /// <summary> 
//        /// Whether or not a horizontal scrollbar is shown
//        /// </summary> 
//        public ScrollBarVisibility HorizontalScrollBarVisibility
//        {
//            get { return (ScrollBarVisibility) GetValue(HorizontalScrollBarVisibilityProperty); }
//            set { SetValue(HorizontalScrollBarVisibilityProperty, value); } 
//        }
// 
//        /// <summary> 
//        /// Exposes ScrollViewer's VerticalScrollBarVisibility property
//        /// Default: Hidden 
//        /// </summary>
//        public static readonly DependencyProperty VerticalScrollBarVisibilityProperty =
//                ScrollViewer.VerticalScrollBarVisibilityProperty.AddOwner(
//                        typeof(TextBoxBase), 
//                        new FrameworkPropertyMetadata(ScrollBarVisibility.Hidden,
//                        new PropertyChangedCallback(OnScrollViewerPropertyChanged))); 
// 
//        /// <summary>
//        /// Whether or not a vertical scrollbar is shown 
//        /// </summary>
//        public ScrollBarVisibility VerticalScrollBarVisibility
//        {
//            get { return (ScrollBarVisibility) GetValue(VerticalScrollBarVisibilityProperty); } 
//            set { SetValue(VerticalScrollBarVisibilityProperty, value); }
//        } 
//        /// <summary>
//        /// The DependencyID for the AutoWordSelection property. 
//        /// Flags:              Can be used in style rules
//        /// Default Value:      false 
//        /// </summary> 
//        public static readonly DependencyProperty AutoWordSelectionProperty =
//            DependencyProperty.Register( 
//                "AutoWordSelection", // Property name
//                typeof(bool), // Property type
//                typeof(TextBoxBase), // Property owner
//                new FrameworkPropertyMetadata(false)); 
//
//        /// <summary> 
//        /// Whether or not dragging with the mouse automatically selects words 
//        /// </summary>
//        public bool AutoWordSelection 
//        {
//            get
//            {
//                return (bool)GetValue(AutoWordSelectionProperty); 
//            }
// 
//            set 
//            {
//                SetValue(AutoWordSelectionProperty, value); 
//            }
//        }
//
// 
//        /// <summary>
//        /// Event for "Text has changed" 
//        /// </summary> 
//        public static readonly RoutedEvent TextChangedEvent = EventManager.RegisterRoutedEvent(
//            "TextChanged", // Event name 
//            RoutingStrategy.Bubble, //
//            typeof(TextChangedEventHandler), //
//            typeof(TextBoxBase)); //
// 
//        /// <summary>
//        /// Event fired from this text box when its inner content 
//        /// has been changed. 
//        /// </summary>
//        /// <remarks> 
//        /// The event itself is defined on TextEditor.
//        /// </remarks>
//        public event TextChangedEventHandler TextChanged
//        { 
//            add
//            { 
//                AddHandler(TextChangedEvent, value); 
//            }
// 
//            remove
//            {
//                RemoveHandler(TextChangedEvent, value);
//            } 
//        }
// 
//        /// <summary> 
//        /// Event for "Selection has changed"
//        /// </summary> 
//        public static readonly RoutedEvent SelectionChangedEvent = EventManager.RegisterRoutedEvent(
//            "SelectionChanged", // Event name
//            RoutingStrategy.Bubble, //
//            typeof(RoutedEventHandler), // 
//            typeof(TextBoxBase)); //
// 
//        /// <summary> 
//        /// Event fired from this text box when its selection has been changed.
//        /// </summary> 
//        public event RoutedEventHandler SelectionChanged
//        {
//            add
//            { 
//                AddHandler(SelectionChangedEvent, value);
//            } 
// 
//            remove
//            { 
//                RemoveHandler(SelectionChangedEvent, value);
//            }
//        }
//
//        internal override void ChangeVisualState(bool useTransitions) 
//        { 
//            // See ButtonBase.ChangeVisualState.
//            // This method should be exactly like it, except we have a ReadOnly state instead of Pressed 
//            if (!IsEnabled)
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateDisabled, useTransitions);
//            } 
//            else if (IsReadOnly)
//            { 
//                VisualStateManager.GoToState(this, VisualStates.StateReadOnly, useTransitions); 
//            }
//            else if (IsMouseOver) 
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateMouseOver, useTransitions);
//            }
//            else 
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateNormal, useTransitions); 
//            } 
//
//            if (IsKeyboardFocused) 
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateFocused, useTransitions);
//            }
//            else 
//            {
//                VisualStateManager.GoToState(this, VisualStates.StateUnfocused, useTransitions); 
//            } 
//
//            base.ChangeVisualState(useTransitions); 
//        }
//
//        /// <summary>
//        /// Called when content in this Control changes. 
//        /// Raises the TextChanged event.
//        /// </summary> 
//        /// <param name="e"></param> 
//        protected virtual void OnTextChanged(TextChangedEventArgs e)
//        { 
//            RaiseEvent(e);
//        }
//
//        /// <summary> 
//        /// Called when the caret or selection changes position.
//        /// Raises the SelectionChanged event. 
//        /// </summary> 
//        /// <param name="e"></param>
//        protected virtual void OnSelectionChanged(RoutedEventArgs e) 
//        {
//            RaiseEvent(e);
//        }
// 
//        /// <summary>
//        /// Template has changed 
//        /// </summary> 
//        /// <param name="oldTemplate">
//        /// </param> 
//        /// <param name="newTemplate">
//        /// </param>
//        protected override void OnTemplateChanged(ControlTemplate oldTemplate, ControlTemplate newTemplate)
//        { 
//            base.OnTemplateChanged(oldTemplate, newTemplate);
// 
//            if (oldTemplate!=null && newTemplate!= null && oldTemplate.VisualTree != newTemplate.VisualTree) 
//            {
//                DetachFromVisualTree(); 
//            }
//        }
//
//
//
//        /// <summary>
//        /// When RenderScope is FlowDocumentView, events can bypass our nested ScrollViewer. 
//        /// We want to make sure that ScrollViewer-- and any other elements in our style--
//        /// always gets a `crack at mouse events.
//        /// </summary>
//        internal override void AddToEventRouteCore(EventRoute route, RoutedEventArgs args) 
//        {
//            base.AddToEventRouteCore(route, args); 
// 
//            // Walk up the tree from the RenderScope to this, adding each element to the route
//            Visual visual = this.RenderScope; 
//            while (visual != this && visual != null)
//            {
//                if (visual is UIElement)
//                { 
//                    ((UIElement)visual).AddToEventRoute(route, args);
//                } 
//                visual = VisualTreeHelper.GetParent(visual) as Visual; 
//            }
//        } 
//
//
//
//        /// <summary>
//        /// TextSelection.Moved event listener. 
//        /// </summary>
//        private void OnSelectionChangedInternal(object sender, EventArgs e) 
//        { 
//            OnSelectionChanged(new RoutedEventArgs(SelectionChangedEvent)); 
//        }
// 
//        /// 
//        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
//        // value. Controls will override this method to return approriate types. 
//        internal override DependencyObjectType DTypeThemeStyleKey 
//        {
//            get 
//            {
//                return _dType;
//            }
//        } 
//
// 
// 
//        private static DependencyObjectType _dType; 
//
//        // Text content owned by this TextBox. 
//        //
//        private TextContainer _textContainer;
//
//        // Text editor 
//        private TextEditor _textEditor;
// 
//        // An element marked as TextBoxContentto which we assign our _renderScope as a anonymous child. 
//        // In case when TextBoxContent is not an anonymouse child this member is null.
//        private FrameworkElement _textBoxContentHost; 
//
//        // Encapsulated control that holds/implements our TextContainer.
//        private FrameworkElement _renderScope;
// 
//        // ScrollViewer
//        private ScrollViewer _scrollViewer; 
// 
//        /// When TextEditor fires a TextChanged event, listeners may want to use the event to
//        /// update their Undo/Redo UI.  But the undo stack hasn't yet been modified by the event, 
//        /// so querying that stack won't give us the information we need to report correctly.
//        /// TextBoxBase therefore caches the UndoAction here, so that CanUndo can reference it
//        /// and make the right determination.
//        private UndoAction _pendingUndoAction; 
//
//        // Part name used in the style. The class TemplatePartAttribute should use the same name 
//        internal const string ContentHostTemplateName = "PART_ContentHost"; 

