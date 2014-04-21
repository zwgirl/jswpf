package org.summer.view.widget.controls.primitives;

import org.summer.view.widget.DependencyObjectType;
import org.summer.view.widget.FrameworkPropertyMetadata;
import org.summer.view.widget.controls.ContentControl;

/// <summary>
    ///     Control that implements a item inside a StatusBar. 
    /// </summary> 
//    [Localizability(LocalizationCategory.Inherit)]
    public class StatusBarItem extends ContentControl 
    {
//        #region Constructors

        static //StatusBarItem() 
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(StatusBarItem), new FrameworkPropertyMetadata(typeof(StatusBarItem))); 
            _dType = DependencyObjectType.FromSystemTypeInternal(typeof(StatusBarItem)); 

            IsTabStopProperty.OverrideMetadata(typeof(StatusBarItem), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox)); 
            AutomationProperties.IsOffscreenBehaviorProperty.OverrideMetadata(typeof(StatusBarItem), new FrameworkPropertyMetadata(IsOffscreenBehavior.FromClip));
        }

//        #endregion 

//        #region Accessibility 
 
        /// <summary>
        /// Creates AutomationPeer (<see cref="UIElement.OnCreateAutomationPeer"/>) 
        /// </summary>
        protected /*override*/ AutomationPeer OnCreateAutomationPeer()
        {
            return new StatusBarItemAutomationPeer(this); 
        }
 
//        #endregion 

//        #region DTypeThemeStyleKey 

        // Returns the DependencyObjectType for the registered ThemeStyleKey's default
        // value. Controls will override this method to return approriate types.
        /*internal*/ public /*override*/ DependencyObjectType DTypeThemeStyleKey 
        {
            get { return _dType; } 
        } 

        private static DependencyObjectType _dType; 

//        #endregion DTypeThemeStyleKey
    }