package org.summer.view.widget.controls;

import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.EventManager;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.FrameworkPropertyMetadataOptions;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.RoutedEventArgs;
import org.summer.view.widget.RoutingStrategy;
import org.summer.view.widget.UIPropertyMetadata;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary> 
/// An Expander control allows a user to view a header and expand that
/// header to see further details of the content, or to collapse the section 
/// up to the header to save space. 
/// </summary>
//[Localizability(LocalizationCategory.None, Readability = Readability.Unreadable)] // cannot be read & localized as string 
public class Expander extends HeaderedContentControl
    {
        //-------------------------------------------------------------------
        // 
        //  Constructors
        // 
        //------------------------------------------------------------------- 

//        #region Constructors 

        static //Expander()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(Expander), new FrameworkPropertyMetadata(typeof(Expander))); 
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(Expander));
 
            IsTabStopProperty.OverrideMetadata(typeof(Expander), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); 

            IsMouseOverPropertyKey.OverrideMetadata(typeof(Expander), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged))); 
            IsEnabledProperty.OverrideMetadata(typeof(Expander), new UIPropertyMetadata(new PropertyChangedCallback(OnVisualStatePropertyChanged)));
        }

//        #endregion 

        //-------------------------------------------------------------------- 
        // 
        //  Public Properties
        // 
        //-------------------------------------------------------------------

//        #region Public Properties
 
        /// <summary>
        /// ExpandDirection specifies to which direction the content will expand 
        /// </summary> 
//        [Bindable(true), Category("Behavior")]
        public ExpandDirection ExpandDirection 
        {
            get { return (ExpandDirection) GetValue(ExpandDirectionProperty); }
            set { SetValue(ExpandDirectionProperty, value); }
        } 

        /// <summary> 
        /// The DependencyProperty for the ExpandDirection property. 
        /// Default Value: ExpandDirection.Down
        /// </summary> 
        public static final DependencyProperty ExpandDirectionProperty =
                DependencyProperty.Register(
                        "ExpandDirection",
                        typeof(ExpandDirection), 
                        typeof(Expander),
                        new FrameworkPropertyMetadata( 
                                ExpandDirection.Down /* default value */, 
                                FrameworkPropertyMetadataOptions.BindsTwoWayByDefault,
                                new PropertyChangedCallback(OnVisualStatePropertyChanged)), 
                        new ValidateValueCallback(IsValidExpandDirection));

        private static boolean IsValidExpandDirection(Object o)
        { 
            ExpandDirection value = (ExpandDirection)o;
 
            return (value == ExpandDirection.Down || 
                    value == ExpandDirection.Left ||
                    value == ExpandDirection.Right || 
                    value == ExpandDirection.Up);
        }

        /// <summary> 
        ///     The DependencyProperty for the IsExpanded property.
        ///     Default Value: false 
        /// </summary> 
        public static final DependencyProperty IsExpandedProperty =
                DependencyProperty.Register( 
                        "IsExpanded",
                        typeof(boolean),
                        typeof(Expander),
                        new FrameworkPropertyMetadata( 
                                BooleanBoxes.FalseBox /* default value */,
                                FrameworkPropertyMetadataOptions.BindsTwoWayByDefault | FrameworkPropertyMetadataOptions.Journal, 
                                new PropertyChangedCallback(OnIsExpandedChanged))); 

        private static void OnIsExpandedChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
        {
            Expander ep = (Expander) d;

            boolean newValue = (boolean) e.NewValue; 

            // Fire accessibility event 
            ExpanderAutomationPeer peer = UIElementAutomationPeer.FromElement(ep) as ExpanderAutomationPeer; 
            if(peer != null)
            { 
                peer.RaiseExpandCollapseAutomationEvent(!newValue, newValue);
            }

            if (newValue) 
            {
                ep.OnExpanded(); 
            } 
            else
            { 
                ep.OnCollapsed();
            }

            ep.UpdateVisualState(); 
        }
 
        /// <summary> 
        /// IsExpanded indicates whether the expander is currently expanded.
        /// </summary> 
//        [Bindable(true), Category("Appearance")]
        public boolean IsExpanded
        {
            get { return (boolean) GetValue(IsExpandedProperty); } 
            set { SetValue(IsExpandedProperty, BooleanBoxes.Box(value)); }
        } 
 
        /// <summary>
        /// Expanded event. 
        /// </summary>
        public static final RoutedEvent ExpandedEvent =
            EventManager.RegisterRoutedEvent("Expanded",
                RoutingStrategy.Bubble, 
                typeof(RoutedEventHandler),
                typeof(Expander) 
            ); 

        /// <summary> 
        /// Expanded event. It is fired when IsExpanded changed from false to true.
        /// </summary>
        public /*event*/ RoutedEventHandler Expanded
        { 
            add { AddHandler(ExpandedEvent, value); }
            remove { RemoveHandler(ExpandedEvent, value); } 
        } 

        /// <summary> 
        /// Collapsed event.
        /// </summary>
        public static final RoutedEvent CollapsedEvent =
            EventManager.RegisterRoutedEvent("Collapsed", 
                RoutingStrategy.Bubble,
                typeof(RoutedEventHandler), 
                typeof(Expander) 
            );
 
        /// <summary>
        /// Collapsed event. It is fired when IsExpanded changed from true to false.
        /// </summary>
        public /*event*/ RoutedEventHandler Collapsed 
        {
            add { AddHandler(CollapsedEvent, value); } 
            remove { RemoveHandler(CollapsedEvent, value); } 
        }
 
//        #endregion

        //--------------------------------------------------------------------
        // 
        //  Protected Methods
        // 
        //-------------------------------------------------------------------- 

//        #region Protected Methods 

        /*internal*/ public /*override*/ void ChangeVisualState(boolean useTransitions)
        {
            // Handle the Common states 
            if (!IsEnabled)
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateDisabled, VisualStates.StateNormal); 
            }
            else if (IsMouseOver) 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateMouseOver, VisualStates.StateNormal);
            }
            else 
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateNormal); 
            } 

            // Handle the Focused states 
            if (IsKeyboardFocused)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateFocused, VisualStates.StateUnfocused);
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateUnfocused); 
            }
 
            if (IsExpanded)
            {
                VisualStates.GoToState(this, useTransitions, VisualStates.StateExpanded);
            } 
            else
            { 
                VisualStates.GoToState(this, useTransitions, VisualStates.StateCollapsed); 
            }
 
            switch (ExpandDirection)
            {
                case ExpandDirection.Down:
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandDown); 
                    break;
 
                case ExpandDirection.Up: 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandUp);
                    break; 

                case ExpandDirection.Left:
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandLeft);
                    break; 

                default: 
                    VisualStates.GoToState(this, useTransitions, VisualStates.StateExpandRight); 
                    break;
            } 

            super.ChangeVisualState(useTransitions);
        }
 
        /// <summary>
        /// A /*virtual*/ function that is called when the IsExpanded property is changed to true. 
        /// Default behavior is to raise an ExpandedEvent. 
        /// </summary>
        protected /*virtual*/ void OnExpanded() 
        {
            RoutedEventArgs args = new RoutedEventArgs();
            args.RoutedEvent = Expander.ExpandedEvent;
            args.Source = this; 
            RaiseEvent(args);
        } 
 
        /// <summary>
        /// A /*virtual*/ function that is called when the IsExpanded property is changed to false. 
        /// Default behavior is to raise a CollapsedEvent.
        /// </summary>
        protected /*virtual*/ void OnCollapsed()
        { 
            RaiseEvent(new RoutedEventArgs(Expander.CollapsedEvent, this));
        } 
 
//        #endregion
 
//        #region Accessibility

        /// <summary>
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
        /// </summary>
        protected /*override*/ AutomationPeer OnCreateAutomationPeer() 
        { 
            return new ExpanderAutomationPeer(this);
        } 

//        #endregion

 
        //-------------------------------------------------------------------
        // 
        //  Private Fields 
        //
        //-------------------------------------------------------------------- 

//        #region Private Fields

//        #endregion 

//        #region DTypeThemeStyleKey 
 
        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will /*override*/ this method to return approriate types. 
        /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey
        {
            get { return _dType; }
        } 

        private static DependencyObjectType _dType; 
 
//        #endregion DTypeThemeStyleKey
    } 