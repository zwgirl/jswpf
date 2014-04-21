/**
 * SystemParameters
 */

define(["dojo/_base/declare", "system/Type", "windows/SystemResourceKeyID", "windows/SystemResourceKey"], 
		function(declare, Type, SystemResourceKeyID, SystemResourceKey){
	
    /// <summary>
    /// Indicates whether the system power is online, or that the system power status is unknown.
    /// </summary>
//    public enum 
	var  PowerLineStatus = declare(null, {}); 
    /// <summary> 
    /// The system is offline. 
    /// </summary>
	PowerLineStatus.Offline = 0x00; 

        /// <summary>
        /// The system is online.
        /// </summary> 
	PowerLineStatusOnline = 0x01,
 
        /// <summary> 
        /// The power status of the system is unknown.
        /// </summary> 
	PowerLineStatusUnknown = 0xFF;
	
//    private enum 
	var CacheSlot = declare(null, {});
	CacheSlot.DpiX= 0 ; 

	CacheSlot.FocusBorderWidth= 0 ;
	CacheSlot.FocusBorderHeight= 0 ;
	CacheSlot.HighContrast= 0 ; 
	CacheSlot.MouseVanish= 0 ;

	CacheSlot.DropShadow= 0 ; 
	CacheSlot.FlatMenu= 0 ;
	CacheSlot.WorkAreaInternal= 0 ; 
	CacheSlot.WorkArea= 0 ;

	CacheSlot.IconMetrics= 0 ;

	CacheSlot.KeyboardCues= 0 ;
	CacheSlot.KeyboardDelay= 0 ; 
	CacheSlot.KeyboardPreference= 0 ; 
	CacheSlot.KeyboardSpeed= 0 ;
	CacheSlot.SnapToDefaultButton= 0 ; 
	CacheSlot.WheelScrollLines= 0 ;
	CacheSlot.MouseHoverTime= 0 ;
	CacheSlot.MouseHoverHeight= 0 ;
	CacheSlot.MouseHoverWidth= 0 ; 

	CacheSlot.MenuDropAlignment= 0 ; 
	CacheSlot.MenuFade= 0 ; 
	CacheSlot.MenuShowDelay= 0 ;

	CacheSlot.ComboBoxAnimation= 0 ;
	CacheSlot.ClientAreaAnimation= 0 ;
	CacheSlot.CursorShadow= 0 ;
	CacheSlot.GradientCaptions= 0 ; 
	CacheSlot.HotTracking= 0 ;
	CacheSlot.ListBoxSmoothScrolling= 0 ; 
	CacheSlot.MenuAnimation= 0 ; 
	CacheSlot.SelectionFade= 0 ;
	CacheSlot.StylusHotTracking= 0 ; 
	CacheSlot.ToolTipAnimation= 0 ;
	CacheSlot.ToolTipFade= 0 ;
	CacheSlot.UIEffects= 0 ;

	CacheSlot.MinimizeAnimation= 0 ;
	CacheSlot.Border= 0 ; 
	CacheSlot.CaretWidth= 0 ; 
	CacheSlot.ForegroundFlashCount= 0 ;
	CacheSlot.DragFullWindows= 0 ; 
    CacheSlot.NonClientMetrics= 0 ;

    CacheSlot.ThinHorizontalBorderHeight= 0 ;
    CacheSlot.ThinVerticalBorderWidth= 0 ; 
    CacheSlot.CursorWidth= 0 ;
    CacheSlot.CursorHeight= 0 ; 
    CacheSlot.ThickHorizontalBorderHeight= 0 ; 
    CacheSlot.ThickVerticalBorderWidth= 0 ;
    CacheSlot.MinimumHorizontalDragDistance= 0 ; 
    CacheSlot.MinimumVerticalDragDistance= 0 ;
    CacheSlot.FixedFrameHorizontalBorderHeight= 0 ;
    CacheSlot.FixedFrameVerticalBorderWidth= 0 ;
    CacheSlot.FocusHorizontalBorderHeight= 0 ; 
    CacheSlot.FocusVerticalBorderWidth= 0 ;
    CacheSlot.FullPrimaryScreenWidth= 0 ; 
    CacheSlot.FullPrimaryScreenHeight= 0 ; 
    CacheSlot.HorizontalScrollBarButtonWidth= 0 ;
    CacheSlot.HorizontalScrollBarHeight= 0 ; 
    CacheSlot.HorizontalScrollBarThumbWidth= 0 ;
    CacheSlot.IconWidth= 0 ;
    CacheSlot.IconHeight= 0 ;
    CacheSlot.IconGridWidth= 0 ; 
    CacheSlot.IconGridHeight= 0 ;
    CacheSlot.MaximizedPrimaryScreenWidth= 0 ; 
    CacheSlot.MaximizedPrimaryScreenHeight= 0 ; 
    CacheSlot.MaximumWindowTrackWidth= 0 ;
    CacheSlot.MaximumWindowTrackHeight= 0 ; 
    CacheSlot.MenuCheckmarkWidth= 0 ;
    CacheSlot.MenuCheckmarkHeight= 0 ;
    CacheSlot.MenuButtonWidth= 0 ;
    CacheSlot.MenuButtonHeight= 0 ; 
    CacheSlot.MinimumWindowWidth= 0 ;
    CacheSlot.MinimumWindowHeight= 0 ; 
    CacheSlot.MinimizedWindowWidth= 0 ; 
    CacheSlot.MinimizedWindowHeight= 0 ;
    CacheSlot.MinimizedGridWidth= 0 ; 
    CacheSlot.MinimizedGridHeight= 0 ;
    CacheSlot.MinimumWindowTrackWidth= 0 ;
    CacheSlot.MinimumWindowTrackHeight= 0 ;
    CacheSlot.PrimaryScreenWidth= 0 ; 
    CacheSlot.PrimaryScreenHeight= 0 ;
    CacheSlot.WindowCaptionButtonWidth= 0 ; 
    CacheSlot.WindowCaptionButtonHeight= 0 ; 
    CacheSlot.ResizeFrameHorizontalBorderHeight= 0 ;
    CacheSlot.ResizeFrameVerticalBorderWidth= 0 ; 
    CacheSlot.SmallIconWidth= 0 ;
    CacheSlot.SmallIconHeight= 0 ;
    CacheSlot.SmallWindowCaptionButtonWidth= 0 ;
    CacheSlot.SmallWindowCaptionButtonHeight= 0 ; 
    CacheSlot.VirtualScreenWidth= 0 ;
    CacheSlot.VirtualScreenHeight= 0 ; 
    CacheSlot.VerticalScrollBarWidth= 0 ; 
    CacheSlot.VerticalScrollBarButtonHeight= 0 ;
    CacheSlot.WindowCaptionHeight= 0 ; 
    CacheSlot.KanjiWindowHeight= 0 ;
    CacheSlot.MenuBarHeight= 0 ;
    CacheSlot.VerticalScrollBarThumbHeight= 0 ;
    CacheSlot.IsImmEnabled= 0 ; 
    CacheSlot.IsMediaCenter= 0 ;
    CacheSlot.IsMenuDropRightAligned= 0 ; 
    CacheSlot.IsMiddleEastEnabled= 0 ; 
    CacheSlot.IsMousePresent= 0 ;
    CacheSlot.IsMouseWheelPresent= 0 ; 
    CacheSlot.IsPenWindows= 0 ;
    CacheSlot.IsRemotelyControlled= 0 ;
    CacheSlot.IsRemoteSession= 0 ;
    CacheSlot.ShowSounds= 0 ; 
    CacheSlot.IsSlowMachine= 0 ;
    CacheSlot.SwapButtons= 0 ; 
    CacheSlot.IsTabletPC= 0 ; 
    CacheSlot.VirtualScreenLeft= 0 ;
    CacheSlot.VirtualScreenTop= 0 ; 

    CacheSlot.PowerLineStatus= 0 ;

    CacheSlot.IsGlassEnabled= 0 ; 
    CacheSlot.UxThemeName= 0 ;
    CacheSlot.UxThemeColor= 0 ; 
    CacheSlot.WindowCornerRadius= 0 ; 
    CacheSlot.WindowGlassColor= 0 ;
    CacheSlot.WindowGlassBrush= 0 ; 
    CacheSlot.WindowNonClientFrameThickness= 0 ;
    CacheSlot.WindowResizeBorderThickness= 0 ;

    CacheSlot.NumSlots =0;
    
//    private static bool 
    var _isGlassEnabled; 
//    private static string 
    var _uxThemeName;
//    private static string 
    var _uxThemeColor;
//    private static CornerRadius 
    var _windowCornerRadius;
//    private static Color 
    var _windowGlassColor; 
//    private static Brush 
    var _windowGlassBrush;
//    private static Thickness 
    var _windowNonClientFrameThickness; 
//    private static Thickness 
    var _windowResizeBorderThickness; 

//    private static int 
    var _dpiX; 
//    private static bool 
    var _setDpiX = true;

//    private static double 
    var _focusBorderWidth;
//    private static double 
    var _focusBorderHeight; 
//    private static bool 
    var _highContrast;
//    private static bool 
    var _mouseVanish; 

//    private static bool 
    var _dropShadow;
//    private static bool 
    var _flatMenu; 
//    private static NativeMethods.RECT 
    var _workAreaInternal;
//    private static Rect _workArea;

//    private static NativeMethods.ICONMETRICS 
    var _iconMetrics; 

//    private static bool 
    var _keyboardCues; 
//    private static int 
    var _keyboardDelay; 
//    private static bool 
    var _keyboardPref;
//    private static int 
    var _keyboardSpeed; 
//    private static bool 
    var _snapToDefButton;
//    private static int 
    var _wheelScrollLines;
//    private static int 
    var _mouseHoverTime = 50;
//    private static double 
    var _mouseHoverHeight; 
//    private static double 
    var _mouseHoverWidth;

//    private static bool 
    var _menuDropAlignment; 
//    private static bool 
    var _menuFade;
//    private static int 
    var _menuShowDelay; 

//    private static bool 
    var _comboBoxAnimation;
//    private static bool 
    var _clientAreaAnimation;
//    private static bool 
    var _cursorShadow; 
//    private static bool 
    var _gradientCaptions;
//    private static bool 
    var _hotTracking; 
//    private static bool 
    var _listBoxSmoothScrolling; 
//    private static bool 
    var _menuAnimation;
//    private static bool 
    var _selectionFade; 
//    private static bool 
    var _stylusHotTracking;
//    private static bool 
    var _toolTipAnimation;
//    private static bool 
    var _tooltipFade;
//    private static bool 
    var _uiEffects; 

//    private static bool 
    var _minAnimation; 
//    private static int 
    var _border; 
//    private static double 
    var _caretWidth;
//    private static bool 
    var _dragFullWindows; 
//    private static int 
    var _foregroundFlashCount;
//    private static NativeMethods.NONCLIENTMETRICS 
    var _ncm;

//    private static double 
    var _thinHorizontalBorderHeight; 
//    private static double 
    var _thinVerticalBorderWidth;
//    private static double 
    var _cursorWidth; 
//    private static double 
    var _cursorHeight; 
//    private static double 
    var _thickHorizontalBorderHeight;
//    private static double 
    var _thickVerticalBorderWidth; 
//    private static double 
    var _minimumHorizontalDragDistance;
//    private static double 
    var _minimumVerticalDragDistance;
//    private static double 
    var _fixedFrameHorizontalBorderHeight;
//    private static double 
    var _fixedFrameVerticalBorderWidth; 
//    private static double 
    var _focusHorizontalBorderHeight;
//    private static double 
    var _focusVerticalBorderWidth; 
//    private static double 
    var _fullPrimaryScreenHeight; 
//    private static double 
    var _fullPrimaryScreenWidth;
//    private static double 
    var _horizontalScrollBarHeight; 
//    private static double 
    var _horizontalScrollBarButtonWidth;
//    private static double 
    var _horizontalScrollBarThumbWidth;
//    private static double 
    var _iconWidth;
//    private static double 
    var _iconHeight; 
//    private static double 
    var _iconGridWidth;
//    private static double 
    var _iconGridHeight; 
//    private static double 
    var _maximizedPrimaryScreenWidth; 
//    private static double 
    var _maximizedPrimaryScreenHeight;
//    private static double 
    var _maximumWindowTrackWidth; 
//    private static double 
    var _maximumWindowTrackHeight;
//    private static double 
    var _menuCheckmarkWidth;
//    private static double 
    var _menuCheckmarkHeight;
//    private static double 
    var _menuButtonWidth; 
//    private static double 
    var _menuButtonHeight;
//    private static double 
    var _minimumWindowWidth; 
//    private static double 
    var _minimumWindowHeight; 
//    private static double 
    var _minimizedWindowWidth;
//    private static double 
    var _minimizedWindowHeight; 
//    private static double 
    var _minimizedGridWidth;
//    private static double 
    var _minimizedGridHeight;
//    private static double 
    var _minimumWindowTrackWidth;
//    private static double 
    var _minimumWindowTrackHeight; 
//    private static double 
    var _primaryScreenWidth;
//    private static double 
    var _primaryScreenHeight; 
//    private static double 
    var _windowCaptionButtonWidth; 
//    private static double 
    var _windowCaptionButtonHeight;
//    private static double 
    var _resizeFrameHorizontalBorderHeight; 
//    private static double 
    var _resizeFrameVerticalBorderWidth;
//    private static double 
    var _smallIconWidth;
//    private static double 
    var _smallIconHeight;
//    private static double 
    var _smallWindowCaptionButtonWidth; 
//    private static double 
    var _smallWindowCaptionButtonHeight;
//    private static double 
    var _virtualScreenWidth; 
//    private static double 
    var _virtualScreenHeight; 
//    private static double 
    var _verticalScrollBarWidth;
//    private static double 
    var _verticalScrollBarButtonHeight; 
//    private static double 
    var _windowCaptionHeight;
//    private static double 
    var _kanjiWindowHeight;
//    private static double 
    var _menuBarHeight;
//    private static double 
    var _verticalScrollBarThumbHeight; 
//    private static bool 
    var _isImmEnabled;
//    private static bool 
    var _isMediaCenter; 
//    private static bool 
    var _isMenuDropRightAligned; 
//    private static bool 
    var _isMiddleEastEnabled;
//    private static bool 
    var _isMousePresent; 
//    private static bool 
    var _isMouseWheelPresent;
//    private static bool 
    var _isPenWindows;
//    private static bool 
    var _isRemotelyControlled;
//    private static bool 
    var _isRemoteSession; 
//    private static bool 
    var _showSounds;
//    private static bool 
    var _isSlowMachine; 
//    private static bool 
    var _swapButtons; 
//    private static bool 
    var _isTabletPC;
//    private static double 
    var _virtualScreenLeft; 
//    private static double 
    var _virtualScreenTop;
//    private static PowerLineStatus 
    var _powerLineStatus;
    
    
    /*private static SystemResourceKey*/ var _cacheThinHorizontalBorderHeight; 
    /*private static SystemResourceKey*/ var _cacheThinVerticalBorderWidth;
    /*private static SystemResourceKey*/ var _cacheCursorWidth; 
    /*private static SystemResourceKey*/ var _cacheCursorHeight; 
    /*private static SystemResourceKey*/ var _cacheThickHorizontalBorderHeight;
    /*private static SystemResourceKey*/ var _cacheThickVerticalBorderWidth; 
    /*private static SystemResourceKey*/ var _cacheFixedFrameHorizontalBorderHeight;
    /*private static SystemResourceKey*/ var _cacheFixedFrameVerticalBorderWidth;
    /*private static SystemResourceKey*/ var _cacheFocusHorizontalBorderHeight;
    /*private static SystemResourceKey*/ var _cacheFocusVerticalBorderWidth; 
    /*private static SystemResourceKey*/ var _cacheFullPrimaryScreenWidth;
    /*private static SystemResourceKey*/ var _cacheFullPrimaryScreenHeight; 
    /*private static SystemResourceKey*/ var _cacheHorizontalScrollBarButtonWidth; 
    /*private static SystemResourceKey*/ var _cacheHorizontalScrollBarHeight;
    /*private static SystemResourceKey*/ var _cacheHorizontalScrollBarThumbWidth; 
    /*private static SystemResourceKey*/ var _cacheIconWidth;
    /*private static SystemResourceKey*/ var _cacheIconHeight;
    /*private static SystemResourceKey*/ var _cacheIconGridWidth;
    /*private static SystemResourceKey*/ var _cacheIconGridHeight; 
    /*private static SystemResourceKey*/ var _cacheMaximizedPrimaryScreenWidth;
    /*private static SystemResourceKey*/ var _cacheMaximizedPrimaryScreenHeight; 
    /*private static SystemResourceKey*/ var _cacheMaximumWindowTrackWidth; 
    /*private static SystemResourceKey*/ var _cacheMaximumWindowTrackHeight;
    /*private static SystemResourceKey*/ var _cacheMenuCheckmarkWidth; 
    /*private static SystemResourceKey*/ var _cacheMenuCheckmarkHeight;
    /*private static SystemResourceKey*/ var _cacheMenuButtonWidth;
    /*private static SystemResourceKey*/ var _cacheMenuButtonHeight;
    /*private static SystemResourceKey*/ var _cacheMinimumWindowWidth; 
    /*private static SystemResourceKey*/ var _cacheMinimumWindowHeight;
    /*private static SystemResourceKey*/ var _cacheMinimizedWindowWidth; 
    /*private static SystemResourceKey*/ var _cacheMinimizedWindowHeight; 
    /*private static SystemResourceKey*/ var _cacheMinimizedGridWidth;
    /*private static SystemResourceKey*/ var _cacheMinimizedGridHeight; 
    /*private static SystemResourceKey*/ var _cacheMinimumWindowTrackWidth;
    /*private static SystemResourceKey*/ var _cacheMinimumWindowTrackHeight;
    /*private static SystemResourceKey*/ var _cachePrimaryScreenWidth;
    /*private static SystemResourceKey*/ var _cachePrimaryScreenHeight; 
    /*private static SystemResourceKey*/ var _cacheWindowCaptionButtonWidth;
    /*private static SystemResourceKey*/ var _cacheWindowCaptionButtonHeight; 
    /*private static SystemResourceKey*/ var _cacheResizeFrameHorizontalBorderHeight; 
    /*private static SystemResourceKey*/ var _cacheResizeFrameVerticalBorderWidth;
    /*private static SystemResourceKey*/ var _cacheSmallIconWidth; 
    /*private static SystemResourceKey*/ var _cacheSmallIconHeight;
    /*private static SystemResourceKey*/ var _cacheSmallWindowCaptionButtonWidth;
    /*private static SystemResourceKey*/ var _cacheSmallWindowCaptionButtonHeight;
    /*private static SystemResourceKey*/ var _cacheVirtualScreenWidth; 
    /*private static SystemResourceKey*/ var _cacheVirtualScreenHeight;
    /*private static SystemResourceKey*/ var _cacheVerticalScrollBarWidth; 
    /*private static SystemResourceKey*/ var _cacheVerticalScrollBarButtonHeight; 
    /*private static SystemResourceKey*/ var _cacheWindowCaptionHeight;
    /*private static SystemResourceKey*/ var _cacheKanjiWindowHeight; 
    /*private static SystemResourceKey*/ var _cacheMenuBarHeight;
    /*private static SystemResourceKey*/ var _cacheSmallCaptionHeight;
    /*private static SystemResourceKey*/ var _cacheVerticalScrollBarThumbHeight;
    /*private static SystemResourceKey*/ var _cacheIsImmEnabled; 
    /*private static SystemResourceKey*/ var _cacheIsMediaCenter;
    /*private static SystemResourceKey*/ var _cacheIsMenuDropRightAligned; 
    /*private static SystemResourceKey*/ var _cacheIsMiddleEastEnabled; 
    /*private static SystemResourceKey*/ var _cacheIsMousePresent;
    /*private static SystemResourceKey*/ var _cacheIsMouseWheelPresent; 
    /*private static SystemResourceKey*/ var _cacheIsPenWindows;
    /*private static SystemResourceKey*/ var _cacheIsRemotelyControlled;
    /*private static SystemResourceKey*/ var _cacheIsRemoteSession;
    /*private static SystemResourceKey*/ var _cacheShowSounds; 
    /*private static SystemResourceKey*/ var _cacheIsSlowMachine;
    /*private static SystemResourceKey*/ var _cacheSwapButtons; 
    /*private static SystemResourceKey*/ var _cacheIsTabletPC; 
    /*private static SystemResourceKey*/ var _cacheVirtualScreenLeft;
    /*private static SystemResourceKey*/ var _cacheVirtualScreenTop; 
    /*private static SystemResourceKey*/ var _cacheFocusBorderWidth;
    /*private static SystemResourceKey*/ var _cacheFocusBorderHeight;
    /*private static SystemResourceKey*/ var _cacheHighContrast;
    /*private static SystemResourceKey*/ var _cacheDropShadow; 
    /*private static SystemResourceKey*/ var _cacheFlatMenu;
    /*private static SystemResourceKey*/ var _cacheWorkArea; 
    /*private static SystemResourceKey*/ var _cacheIconHorizontalSpacing; 
    /*private static SystemResourceKey*/ var _cacheIconVerticalSpacing;
    /*private static SystemResourceKey*/ var _cacheIconTitleWrap; 
    /*private static SystemResourceKey*/ var _cacheKeyboardCues;
    /*private static SystemResourceKey*/ var _cacheKeyboardDelay;
    /*private static SystemResourceKey*/ var _cacheKeyboardPreference;
    /*private static SystemResourceKey*/ var _cacheKeyboardSpeed; 
    /*private static SystemResourceKey*/ var _cacheSnapToDefaultButton;
    /*private static SystemResourceKey*/ var _cacheWheelScrollLines; 
    /*private static SystemResourceKey*/ var _cacheMouseHoverTime; 
    /*private static SystemResourceKey*/ var _cacheMouseHoverHeight;
    /*private static SystemResourceKey*/ var _cacheMouseHoverWidth; 
    /*private static SystemResourceKey*/ var _cacheMenuDropAlignment;
    /*private static SystemResourceKey*/ var _cacheMenuFade;
    /*private static SystemResourceKey*/ var _cacheMenuShowDelay;
    /*private static SystemResourceKey*/ var _cacheComboBoxAnimation; 
    /*private static SystemResourceKey*/ var _cacheClientAreaAnimation;
    /*private static SystemResourceKey*/ var _cacheCursorShadow; 
    /*private static SystemResourceKey*/ var _cacheGradientCaptions; 
    /*private static SystemResourceKey*/ var _cacheHotTracking;
    /*private static SystemResourceKey*/ var _cacheListBoxSmoothScrolling; 
    /*private static SystemResourceKey*/ var _cacheMenuAnimation;
    /*private static SystemResourceKey*/ var _cacheSelectionFade;
    /*private static SystemResourceKey*/ var _cacheStylusHotTracking;
    /*private static SystemResourceKey*/ var _cacheToolTipAnimation; 
    /*private static SystemResourceKey*/ var _cacheToolTipFade;
    /*private static SystemResourceKey*/ var _cacheUIEffects; 
    /*private static SystemResourceKey*/ var _cacheMinimizeAnimation; 
    /*private static SystemResourceKey*/ var _cacheBorder;
    /*private static SystemResourceKey*/ var _cacheCaretWidth; 
    /*private static SystemResourceKey*/ var _cacheForegroundFlashCount;
    /*private static SystemResourceKey*/ var _cacheDragFullWindows;
    /*private static SystemResourceKey*/ var _cacheBorderWidth;
    /*private static SystemResourceKey*/ var _cacheScrollWidth; 
    /*private static SystemResourceKey*/ var _cacheScrollHeight;
    /*private static SystemResourceKey*/ var _cacheCaptionWidth; 
    /*private static SystemResourceKey*/ var _cacheCaptionHeight; 
    /*private static SystemResourceKey*/ var _cacheSmallCaptionWidth;
    /*private static SystemResourceKey*/ var _cacheMenuWidth; 
    /*private static SystemResourceKey*/ var _cacheMenuHeight;
    /*private static SystemResourceKey*/ var _cacheComboBoxPopupAnimation;
    /*private static SystemResourceKey*/ var _cacheMenuPopupAnimation;
    /*private static SystemResourceKey*/ var _cacheToolTipPopupAnimation; 
    /*private static SystemResourceKey*/ var _cachePowerLineStatus;

    /*private static SystemThemeKey*/var _cacheFocusVisualStyle; 
    /*private static SystemThemeKey*/var _cacheNavigationChromeStyle;
    /*private static SystemThemeKey*/var _cacheNavigationChromeDownLevelStyle; 
    
	var SystemParameters = declare("SystemParameters", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(SystemParameters.prototype,{
		  
	});
	
	Object.defineProperties(SystemParameters,{
	       /// <summary> 
        ///     Maps to SPI_GETFOCUSBORDERWIDTH
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK -- Determined safe: getting the size of the dotted rectangle around a selected obj
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
		FocusBorderWidth:
        {
            get:function()
            { 
                return _focusBorderWidth; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETFOCUSBORDERHEIGHT
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK -- Determined safe: getting the size of the dotted rectangle around a selected obj 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
	FocusBorderHeight: 
        {
            get:function()
            { 
                return _focusBorderHeight;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETHIGHCONTRAST -> HCF_HIGHCONTRASTON
        /// </summary>
        /// <SecurityNote>
        ///  Critical as this code does an elevation. 
        ///  PublicOK - considered ok to expose since the method doesn't take user input and only
        ///                returns a boolean value which indicates the current high contrast mode. 
        /// </SecurityNote> 
//        public static bool 
        HighContrast:
        { 
            get:function()
            {
                return _highContrast;
            } 
        }, 

        /// <summary> 
        /// Maps to SPI_GETMOUSEVANISH.
        /// </summary>
        /// <SecurityNote>
        ///  Critical -- calling UnsafeNativeMethods 
        ///  PublicOK - considered ok to expose.
        /// </SecurityNote> 
        // 
//        internal static bool 
        MouseVanish:
        { 
            get:function()
            {
                return _mouseVanish;
            }
        },

        /// <summary> 
        ///     FocusBorderWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        FocusBorderWidthKey: 
        {
            get:function()
            {
                if (_cacheFocusBorderWidth == null) 
                {
                    _cacheFocusBorderWidth = CreateInstance(SystemResourceKeyID.FocusBorderWidth); 
                } 

                return _cacheFocusBorderWidth; 
            }
        },

        /// <summary> 
        ///     FocusBorderHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        FocusBorderHeightKey: 
        {
            get:function() 
            {
                if (_cacheFocusBorderHeight == null)
                {
                    _cacheFocusBorderHeight = CreateInstance(SystemResourceKeyID.FocusBorderHeight); 
                }
 
                return _cacheFocusBorderHeight; 
            }
        }, 

        /// <summary>
        ///     HighContrast System Resource Key
        /// </summary> 
//        public static ResourceKey 
        HighContrastKey:
        { 
            get:function() 
            {
                if (_cacheHighContrast == null) 
                {
                    _cacheHighContrast = CreateInstance(SystemResourceKeyID.HighContrast);
                }
 
                return _cacheHighContrast;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETDROPSHADOW
        /// </summary> 
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK: This information is ok to give out 
        /// </SecurityNote>
//        public static bool 
        DropShadow:
        {
            get:function()
            { 
                return _dropShadow; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SPI_GETFLATMENU 
        /// </summary>
        /// <SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers. 
        /// </SecurityNote>
//        public static bool 
        FlatMenu: 
        { 
            get:function()
            {
                return _flatMenu; 
            }
        },

        /// <summary> 
        ///     Maps to SPI_GETWORKAREA
        /// </summary> 
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  TreatAsSafe - Okay to expose info to internet callers. 
        /// </SecurityNote>
//        internal static NativeMethods.RECT 
        WorkAreaInternal:
        {
            get:function()
            { 
                return _workAreaInternal;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETWORKAREA
        /// </summary>
//        public static Rect 
        WorkArea:
        { 
            get:function()
            { 
                return _workArea; 
            }
        },

        /// <summary>
        ///     DropShadow System Resource Key 
        /// </summary>
//        public static ResourceKey 
        DropShadowKey:
        {
            get:function() 
            {
                if (_cacheDropShadow == null) 
                { 
                    _cacheDropShadow = CreateInstance(SystemResourceKeyID.DropShadow);
                } 

                return _cacheDropShadow;
            }
        }, 

        /// <summary> 
        ///     FlatMenu System Resource Key 
        /// </summary>
//        public static ResourceKey 
        FlatMenuKey: 
        {
            get:function()
            {
                if (_cacheFlatMenu == null) 
                {
                    _cacheFlatMenu = CreateInstance(SystemResourceKeyID.FlatMenu); 
                } 

                return _cacheFlatMenu; 
            }
        },

        /// <summary> 
        ///     WorkArea System Resource Key
        /// </summary> 
//        public static ResourceKey 
        WorkAreaKey: 
        {
            get:function() 
            {
                if (_cacheWorkArea == null)
                {
                    _cacheWorkArea = CreateInstance(SystemResourceKeyID.WorkArea); 
                }
 
                return _cacheWorkArea; 
            }
        }, 

        /// <summary> 
        ///     Maps to SPI_GETICONMETRICS 
        /// </summary>
        ///<SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  TreatAsSafe - Okay to expose info to internet callers.
        ///</SecurityNote>
//        internal static NativeMethods.ICONMETRICS 
        IconMetrics: 
        {
            get:function() 
            {
                return _iconMetrics; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETICONMETRICS -> iHorzSpacing or SPI_ICONHORIZONTALSPACING
        /// </summary> 
//        public static double 
        IconHorizontalSpacing:
        { 
            get:function() 
            {
                return ConvertPixel(IconMetrics.iHorzSpacing); 
            }
        },

        /// <summary> 
        ///     Maps to SPI_GETICONMETRICS -> iVertSpacing or SPI_ICONVERTICALSPACING
        /// </summary> 
//        public static double 
        IconVerticalSpacing:
        {
            get:function() 
            {
                return ConvertPixel(IconMetrics.iVertSpacing);
            }
        }, 

        /// <summary> 
        ///     Maps to SPI_GETICONMETRICS -> iTitleWrap or SPI_GETICONTITLEWRAP 
        /// </summary>
//        public static bool 
        IconTitleWrap: 
        {
            get:function()
            {
                return IconMetrics.iTitleWrap != 0; 
            }
        }, 
 

        /// <summary>
        ///     IconHorizontalSpacing System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IconHorizontalSpacingKey: 
        { 
            get:function()
            { 
                if (_cacheIconHorizontalSpacing == null)
                {
                    _cacheIconHorizontalSpacing = CreateInstance(SystemResourceKeyID.IconHorizontalSpacing);
                } 

                return _cacheIconHorizontalSpacing; 
            } 
        },
 
        /// <summary>
        ///     IconVerticalSpacing System Resource Key
        /// </summary>
//        public static ResourceKey 
        IconVerticalSpacingKey: 
        {
            get:function() 
            { 
                if (_cacheIconVerticalSpacing == null)
                { 
                    _cacheIconVerticalSpacing = CreateInstance(SystemResourceKeyID.IconVerticalSpacing);
                }

                return _cacheIconVerticalSpacing; 
            }
        }, 
 
        /// <summary>
        ///     IconTitleWrap System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IconTitleWrapKey:
        {
            get:function() 
            {
                if (_cacheIconTitleWrap == null) 
                { 
                    _cacheIconTitleWrap = CreateInstance(SystemResourceKeyID.IconTitleWrap);
                } 

                return _cacheIconTitleWrap;
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETKEYBOARDCUES
        /// </summary>
        /// 
        /// <SecurityNote>
        /// Demanding unmanaged code permission because calling an unsafe native method. 
        ///  SecurityCritical because it calls an unsafe native method.  PublicOK because is demanding unmanaged code perm. 
        /// PublicOK: This information is ok to give out
        /// </SecurityNote> 
//        public static bool 
        KeyboardCues:
        {
            get:function() 
            {
                return _keyboardCues;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_GETKEYBOARDDELAY
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK -- Determined safe: getting keyboard repeat delay
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static int
        KeyboardDelay:
        { 
            get:function()
            { 
                return _keyboardDelay; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETKEYBOARDPREF
        /// </summary> 
        /// <SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers. 
        /// </SecurityNote>
//        public static bool 
        KeyboardPreference: 
        {
            get:function()
            { 
                return _keyboardPref;
            }
        }, 

        /// <summary> 
        ///     Maps to SPI_GETKEYBOARDSPEED 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK -- Determined safe: getting keyboard repeat-speed
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static int
        KeyboardSpeed: 
        {
            get:function() 
            {
                return _keyboardSpeed; 
            } 
        },
 
        /// <summary>
        ///     Maps to SPI_GETSNAPTODEFBUTTON
        /// </summary>
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers. 
        /// </SecurityNote> 
//        public static bool 
        SnapToDefaultButton:
        { 
            get:function()
            {
                return _snapToDefButton;
            }
        },
 
        /// <summary>
        ///     Maps to SPI_GETWHEELSCROLLLINES 
        /// </summary> 
        /// <SecurityNote>
        ///     Get is PublicOK -- Determined safe: Geting the number of lines to scroll when the mouse wheel is rotated. \ 
        ///     Get is Critical -- Calling unsafe native methods.
        /// </SecurityNote>
//        public static int 
        WheelScrollLines:
        { 
            get:function() 
            { 
                return _wheelScrollLines;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETMOUSEHOVERTIME.
        /// </summary>
//        public static TimeSpan 
        MouseHoverTime:
        { 
            get:function()
            { 
                return TimeSpan.FromMilliseconds(MouseHoverTimeMilliseconds); 
            }
        }, 

        /// <SecurityNote>
        ///    TreatAsSafe -- Determined safe: getting time mouse pointer has to stay in the hover rectangle for TrackMouseEvent to generate a WM_MOUSEHOVER message.
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        internal static int 
        MouseHoverTimeMilliseconds: 
        { 
            get:function() 
            {
                return _mouseHoverTime;
            } 
        },

        /// <summary>
        ///     Maps to SPI_GETMOUSEHOVERHEIGHT. 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK -- Determined safe: gettingthe height, in pixels, of the rectangle within which the mouse pointer has to stay for TrackMouseEvent to generate a WM_MOUSEHOVER message 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MouseHoverHeight:
        {
            get:function() 
            {
                return _mouseHoverHeight; 
            } 
        },
 
        /// <summary>
        ///     Maps to SPI_GETMOUSEHOVERWIDTH.
        /// </summary>
        /// 
        /// <SecurityNote>
        ///    PublicOK -- Determined safe: getting the width, in pixels, of the rectangle within which the mouse pointer has to stay for TrackMouseEvent to generate a WM_MOUSEHOVER message 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        MouseHoverWidth: 
        {
            get:function()
            { 
                return _mouseHoverWidth;
            } 
        }, 
 
        /// <summary>
        ///     KeyboardCues System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        KeyboardCuesKey:
        { 
            get:function()
            {
                if (_cacheKeyboardCues == null)
                { 
                    _cacheKeyboardCues = CreateInstance(SystemResourceKeyID.KeyboardCues);
                } 
 
                return _cacheKeyboardCues;
            } 
        },

        /// <summary>
        ///     KeyboardDelay System Resource Key 
        /// </summary>
//        public static ResourceKey 
        KeyboardDelayKey: 
        { 
            get:function()
            { 
                if (_cacheKeyboardDelay == null)
                {
                    _cacheKeyboardDelay = CreateInstance(SystemResourceKeyID.KeyboardDelay);
                } 

                return _cacheKeyboardDelay; 
            } 
        },
 
        /// <summary>
        ///     KeyboardPreference System Resource Key
        /// </summary>
//        public static ResourceKey 
        KeyboardPreferenceKey: 
        {
            get:function() 
            { 
                if (_cacheKeyboardPreference == null)
                { 
                    _cacheKeyboardPreference = CreateInstance(SystemResourceKeyID.KeyboardPreference);
                }

                return _cacheKeyboardPreference; 
            }
        }, 
 
        /// <summary>
        ///     KeyboardSpeed System Resource Key 
        /// </summary>
//        public static ResourceKey 
        KeyboardSpeedKey:
        {
            get:function() 
            {
                if (_cacheKeyboardSpeed == null) 
                { 
                    _cacheKeyboardSpeed = CreateInstance(SystemResourceKeyID.KeyboardSpeed);
                } 

                return _cacheKeyboardSpeed;
            }
        }, 

        /// <summary> 
        ///     SnapToDefaultButton System Resource Key 
        /// </summary>
//        public static ResourceKey 
        SnapToDefaultButtonKey: 
        {
            get:function()
            {
                if (_cacheSnapToDefaultButton == null) 
                {
                    _cacheSnapToDefaultButton = CreateInstance(SystemResourceKeyID.SnapToDefaultButton); 
                } 

                return _cacheSnapToDefaultButton; 
            }
        },

        /// <summary> 
        ///     WheelScrollLines System Resource Key
        /// </summary> 
//        public static ResourceKey 
        WheelScrollLinesKey: 
        {
            get:function() 
            {
                if (_cacheWheelScrollLines == null)
                {
                    _cacheWheelScrollLines = CreateInstance(SystemResourceKeyID.WheelScrollLines); 
                }
 
                return _cacheWheelScrollLines; 
            }
        }, 

        /// <summary>
        ///     MouseHoverTime System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MouseHoverTimeKey:
        { 
            get:function() 
            {
                if (_cacheMouseHoverTime == null) 
                {
                    _cacheMouseHoverTime = CreateInstance(SystemResourceKeyID.MouseHoverTime);
                }
 
                return _cacheMouseHoverTime;
            } 
        }, 

        /// <summary> 
        ///     MouseHoverHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        MouseHoverHeightKey:
        { 
            get:function()
            { 
                if (_cacheMouseHoverHeight == null) 
                {
                    _cacheMouseHoverHeight = CreateInstance(SystemResourceKeyID.MouseHoverHeight); 
                }

                return _cacheMouseHoverHeight;
            } 
        },
 
        /// <summary> 
        ///     MouseHoverWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MouseHoverWidthKey:
        {
            get:function()
            { 
                if (_cacheMouseHoverWidth == null)
                { 
                    _cacheMouseHoverWidth = CreateInstance(SystemResourceKeyID.MouseHoverWidth); 
                }
 
                return _cacheMouseHoverWidth;
            }
        },
 

        /// <summary> 
        ///     Maps to SPI_GETMENUDROPALIGNMENT
        /// </summary>
        /// <SecurityNote>
        /// Demanding unmanaged code permission because calling an unsafe native method. 
        /// Critical - get:function(): it calls an unsafe native method
        /// PublicOK - get:function(): it's safe to expose a menu drop alignment of a system. 
        /// </SecurityNote> 
//        public static bool
        MenuDropAlignment:
        { 
            get:function()
            {
                return _menuDropAlignment; 
            }
        },

        /// <summary> 
        ///     Maps to SPI_GETMENUFADE
        /// </summary> 
        /// <SecurityNote> 
        /// Critical - because it calls an unsafe native method
        /// PublicOK - ok to return menu fade data 
        /// </SecurityNote>
//        public static bool 
        MenuFade:
        {
            get:function()
            { 
                return _menuFade; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SPI_GETMENUSHOWDELAY 
        /// </summary>
        /// <SecurityNote>
        ///     Critical - calls a method that perfoms an elevation.
        ///     PublicOK - considered ok to expose in partial trust. 
        /// </SecurityNote>
//        public static int 
        MenuShowDelay: 
        { 
            get:function()
            {
                return _menuShowDelay; 
            }
        },

 
        /// <summary>
        ///     MenuDropAlignment System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MenuDropAlignmentKey:
        {
            get:function() 
            {
                if (_cacheMenuDropAlignment == null) 
                { 
                    _cacheMenuDropAlignment = CreateInstance(SystemResourceKeyID.MenuDropAlignment);
                } 

                return _cacheMenuDropAlignment;
            }
        }, 

        /// <summary> 
        ///     MenuFade System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MenuFadeKey: 
        {
            get:function()
            {
                if (_cacheMenuFade == null) 
                {
                    _cacheMenuFade = CreateInstance(SystemResourceKeyID.MenuFade); 
                } 

                return _cacheMenuFade; 
            }
        },

        /// <summary> 
        ///     MenuShowDelay System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MenuShowDelayKey: 
        {
            get:function() 
            {
                if (_cacheMenuShowDelay == null)
                {
                    _cacheMenuShowDelay = CreateInstance(SystemResourceKeyID.MenuShowDelay); 
                }
 
                return _cacheMenuShowDelay; 
            }
        }, 


        /// <summary> 
        ///     Returns the system value of PopupAnimation for ComboBoxes. 
        /// </summary>
//        public static PopupAnimation 
        ComboBoxPopupAnimation: 
        {
            get:function()
            {
                if (ComboBoxAnimation) 
                {
                    return PopupAnimation.Slide; 
                } 

                return PopupAnimation.None; 
            }
        },

        /// <summary> 
        ///     Maps to SPI_GETCOMBOBOXANIMATION
        /// </summary> 
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK: This information is ok to give out 
        /// </SecurityNote>

//        public static bool 
        ComboBoxAnimation:
        { 
            get:function() 
            {
                return _comboBoxAnimation;
            } 
        },

        /// <summary>
        ///     Maps to SPI_GETCLIENTAREAANIMATION 
        /// </summary>
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK: This information is ok to give out
        /// </SecurityNote> 
//        public static bool 
        ClientAreaAnimation:
        {
            get:function() 
            {
                return _clientAreaAnimation;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_GETCURSORSHADOW
        /// </summary> 
        /// <SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers.
        /// </SecurityNote> 
//        public static bool 
        CursorShadow:
        { 
            get:function()
            { 
                return _cursorShadow; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETGRADIENTCAPTIONS
        /// </summary> 
        /// <SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers. 
        /// </SecurityNote>
//        public static bool 
        GradientCaptions:
        {
            get:function()
            { 
                return _gradientCaptions;
            }
        }, 

        /// <summary> 
        ///     Maps to SPI_GETHOTTRACKING 
        /// </summary>
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers.
        /// </SecurityNote>
//        public static bool 
        HotTracking: 
        {
            get:function() 
            {
                return _hotTracking; 
            } 
        },
 
        /// <summary>
        ///     Maps to SPI_GETLISTBOXSMOOTHSCROLLING
        /// </summary>
        /// <SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers. 
        /// </SecurityNote> 
//        public static bool 
        ListBoxSmoothScrolling:
        { 
            get:function()
            {
                return _listBoxSmoothScrolling;
            }
        },
 
        /// <summary>
        ///     Returns the PopupAnimation value for Menus. 
        /// </summary> 
//        public static PopupAnimation 
        MenuPopupAnimation:
        { 
            get:function()
            {
                if (MenuAnimation)
                { 
                    if (MenuFade)
                    { 
                        return PopupAnimation.Fade; 
                    }
                    else 
                    {
                        return PopupAnimation.Scroll;
                    }
                } 

                return PopupAnimation.None; 
            } 
        },
 
        /// <summary>
        ///     Maps to SPI_GETMENUANIMATION
        /// </summary>
        /// <SecurityNote> 
        ///     Critical - calls SystemParametersInfo
        ///     PublicOK - net information returned is whether menu-animation is enabled. Considered safe. 
        /// </SecurityNote> 
//        public static bool 
        MenuAnimation:
        { 
            get:function()
            {
                return _menuAnimation;
            }
        },
 
        /// <summary>
        ///     Maps to SPI_GETSELECTIONFADE 
        /// </summary> 
        ///<SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers.
        ///</SecurityNote>
//        public static bool 
        SelectionFade:
        { 
            get:function() 
            { 
                return _selectionFade;
            } 
        },

        /// <summary> 
        ///     Maps to SPI_GETSTYLUSHOTTRACKING
        /// </summary>
        ///<SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers.
        ///</SecurityNote> 
//        public static bool 
        StylusHotTracking: 
        {
            get:function()
            {
                return _stylusHotTracking; 
            }
        },

        /// <summary> 
        ///     Returns the PopupAnimation value for ToolTips.
        /// </summary> 
//        public static PopupAnimation 
        ToolTipPopupAnimation: 
        {
            get:function() 
            {
                // Win32 ToolTips do not appear to scroll, only fade
                if (ToolTipAnimation && ToolTipFade)
                { 
                    return PopupAnimation.Fade;
                } 
 
                return PopupAnimation.None;
            } 
        },

        /// <summary>
        ///     Maps to SPI_GETTOOLTIPANIMATION 
        /// </summary>
        ///<SecurityNote> 
        /// Critical as this code elevates. 
        /// PublicOK - as we think this is ok to expose.
        ///</SecurityNote> 
//        public static bool 
        ToolTipAnimation:
        {
            get:function() 
            {
                return _toolTipAnimation;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETTOOLTIPFADE
        /// </summary>
        ///<SecurityNote>
        /// Critical as this code elevates. 
        /// PublicOK - as we think this is ok to expose.
        ///</SecurityNote> 
//        public static bool 
        ToolTipFade: 
        {
            get:function()
            {
                return _tooltipFade;
            }
        },
 
        /// <summary>
        ///     Maps to SPI_GETUIEFFECTS 
        /// </summary> 
        ///<SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers.
        ///</SecurityNote>
//        public static bool 
        UIEffects:
        { 
            get:function() 
            { 
                return _uiEffects;
            } 
        }, 


        /// <summary> 
        ///     ComboBoxAnimation System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ComboBoxAnimationKey: 
        {
            get:function() 
            {
                if (_cacheComboBoxAnimation == null)
                {
                    _cacheComboBoxAnimation = CreateInstance(SystemResourceKeyID.ComboBoxAnimation); 
                }
 
                return _cacheComboBoxAnimation; 
            }
        }, 

        /// <summary>
        ///     ClientAreaAnimation System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ClientAreaAnimationKey:
        { 
            get:function() 
            {
                if (_cacheClientAreaAnimation == null) 
                {
                    _cacheClientAreaAnimation = CreateInstance(SystemResourceKeyID.ClientAreaAnimation);
                }
 
                return _cacheClientAreaAnimation;
            } 
        }, 

        /// <summary> 
        ///     CursorShadow System Resource Key
        /// </summary>
//        public static ResourceKey 
        CursorShadowKey:
        { 
            get:function()
            { 
                if (_cacheCursorShadow == null) 
                {
                    _cacheCursorShadow = CreateInstance(SystemResourceKeyID.CursorShadow); 
                }

                return _cacheCursorShadow;
            } 
        },
 
        /// <summary> 
        ///     GradientCaptions System Resource Key
        /// </summary> 
//        public static ResourceKey 
        GradientCaptionsKey:
        {
            get:function()
            { 
                if (_cacheGradientCaptions == null)
                { 
                    _cacheGradientCaptions = CreateInstance(SystemResourceKeyID.GradientCaptions); 
                }
 
                return _cacheGradientCaptions;
            }
        },
 
        /// <summary>
        ///     HotTracking System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        HotTrackingKey:
        { 
            get:function()
            {
                if (_cacheHotTracking == null)
                { 
                    _cacheHotTracking = CreateInstance(SystemResourceKeyID.HotTracking);
                } 
 
                return _cacheHotTracking;
            } 
        },

        /// <summary>
        ///     ListBoxSmoothScrolling System Resource Key 
        /// </summary>
//        public static ResourceKey 
        ListBoxSmoothScrollingKey: 
        { 
            get:function()
            { 
                if (_cacheListBoxSmoothScrolling == null)
                {
                    _cacheListBoxSmoothScrolling = CreateInstance(SystemResourceKeyID.ListBoxSmoothScrolling);
                } 

                return _cacheListBoxSmoothScrolling; 
            } 
        },
 
        /// <summary>
        ///     MenuAnimation System Resource Key
        /// </summary>
//        public static ResourceKey 
        MenuAnimationKey: 
        {
            get:function() 
            { 
                if (_cacheMenuAnimation == null)
                { 
                    _cacheMenuAnimation = CreateInstance(SystemResourceKeyID.MenuAnimation);
                }

                return _cacheMenuAnimation; 
            }
        }, 
 
        /// <summary>
        ///     SelectionFade System Resource Key 
        /// </summary>
//        public static ResourceKey 
        SelectionFadeKey:
        {
            get:function() 
            {
                if (_cacheSelectionFade == null) 
                { 
                    _cacheSelectionFade = CreateInstance(SystemResourceKeyID.SelectionFade);
                } 

                return _cacheSelectionFade;
            }
        }, 

        /// <summary> 
        ///     StylusHotTracking System Resource Key 
        /// </summary>
//        public static ResourceKey 
        StylusHotTrackingKey: 
        {
            get:function()
            {
                if (_cacheStylusHotTracking == null) 
                {
                    _cacheStylusHotTracking = CreateInstance(SystemResourceKeyID.StylusHotTracking); 
                } 

                return _cacheStylusHotTracking; 
            }
        },

        /// <summary> 
        ///     ToolTipAnimation System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ToolTipAnimationKey: 
        {
            get:function() 
            {
                if (_cacheToolTipAnimation == null)
                {
                    _cacheToolTipAnimation = CreateInstance(SystemResourceKeyID.ToolTipAnimation); 
                }
 
                return _cacheToolTipAnimation; 
            }
        }, 

        /// <summary>
        ///     ToolTipFade System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ToolTipFadeKey:
        { 
            get:function() 
            {
                if (_cacheToolTipFade == null) 
                {
                    _cacheToolTipFade = CreateInstance(SystemResourceKeyID.ToolTipFade);
                }
 
                return _cacheToolTipFade;
            } 
        }, 

        /// <summary> 
        ///     UIEffects System Resource Key
        /// </summary>
//        public static ResourceKey 
        UIEffectsKey:
        { 
            get:function()
            { 
                if (_cacheUIEffects == null) 
                {
                    _cacheUIEffects = CreateInstance(SystemResourceKeyID.UIEffects); 
                }

                return _cacheUIEffects;
            } 
        },
 
        /// <summary> 
        ///     ComboBoxPopupAnimation System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ComboBoxPopupAnimationKey:
        {
            get:function()
            { 
                if (_cacheComboBoxPopupAnimation == null)
                { 
                    _cacheComboBoxPopupAnimation = CreateInstance(SystemResourceKeyID.ComboBoxPopupAnimation); 
                }
 
                return _cacheComboBoxPopupAnimation;
            }
        },
 
        /// <summary>
        ///     MenuPopupAnimation System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        MenuPopupAnimationKey:
        { 
            get:function()
            {
                if (_cacheMenuPopupAnimation == null)
                { 
                    _cacheMenuPopupAnimation = CreateInstance(SystemResourceKeyID.MenuPopupAnimation);
                } 
 
                return _cacheMenuPopupAnimation;
            } 
        },

        /// <summary>
        ///     ToolTipPopupAnimation System Resource Key 
        /// </summary>
//        public static ResourceKey 
        ToolTipPopupAnimationKey: 
        { 
            get:function()
            { 
                if (_cacheToolTipPopupAnimation == null)
                {
                    _cacheToolTipPopupAnimation = CreateInstance(SystemResourceKeyID.ToolTipPopupAnimation);
                } 

                return _cacheToolTipPopupAnimation; 
            } 
        },
 
        /// <summary>
        ///     Maps to SPI_GETANIMATION 
        /// </summary> 
        ///<SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method. 
        ///  PublicOK - Okay to expose info to internet callers.
        ///</SecurityNote>
//        public static bool 
        MinimizeAnimation:
        { 
            get:function() 
            { 
                return _minAnimation; 
            }
        },

        /// <summary> 
        ///     Maps to SPI_GETBORDER
        /// </summary> 
        ///<SecurityNote> 
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers. 
        ///</SecurityNote>
//        public static int 
        Border:
        {
            get:function()
            { 
                return _border;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_GETCARETWIDTH
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK -- Determined safe: getting width of caret 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        CaretWidth: 
        {
            get:function()
            {
                return _caretWidth;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_GETDRAGFULLWINDOWS
        /// </summary> 
        /// <SecurityNote>
        ///  SecurityCritical because it calls an unsafe native method.
        ///  PublicOK - Okay to expose info to internet callers.
        /// </SecurityNote> 
//        public static bool 
        DragFullWindows:
        { 
            get:function()
            { 
                return _dragFullWindows; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_GETFOREGROUNDFLASHCOUNT
        /// </summary> 
        /// <SecurityNote>
        ///     Get is PublicOK -- Getting # of times taskbar button will flash when rejecting a forecground switch request. 
        ///     Get is Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
 
//        public static int 
        ForegroundFlashCount:
        {
            get:function() 
            {
                return _foregroundFlashCount;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_GETNONCLIENTMETRICS
        /// </summary> 
        /// <SecurityNote>
        ///      SecurityCritical because it calls an unsafe native method.
        ///      SecurityTreatAsSafe as we think this would be ok to expose publically - and this is ok for consumption in partial trust.
        /// </SecurityNote> 
//        internal static NativeMethods.NONCLIENTMETRICS 
        NonClientMetrics:
        { 
            get:function()
            { 
                return _ncm;
            } 
        },

        /// <summary>
        ///     From SPI_GETNONCLIENTMETRICS 
        /// </summary>
//        public static double 
        BorderWidth: 
        { 
            get:function()
            { 
                return ConvertPixel(NonClientMetrics.iBorderWidth);
            }
        },
 
        /// <summary>
        ///     From SPI_GETNONCLIENTMETRICS 
        /// </summary> 
//        public static double 
        ScrollWidth:
        { 
            get:function()
            {
                return ConvertPixel(NonClientMetrics.iScrollWidth);
            } 
        },
 
        /// <summary> 
        ///     From SPI_GETNONCLIENTMETRICS
        /// </summary> 
//        public static double 
        ScrollHeight:
        {
            get:function()
            { 
                return ConvertPixel(NonClientMetrics.iScrollHeight);
            } 
        }, 

        /// <summary> 
        ///     From SPI_GETNONCLIENTMETRICS
        /// </summary>
//        public static double 
        CaptionWidth:
        { 
            get:function()
            { 
                return ConvertPixel(NonClientMetrics.iCaptionWidth); 
            }
        }, 

        /// <summary>
        ///     From SPI_GETNONCLIENTMETRICS
        /// </summary> 
//        public static double 
        CaptionHeight:
        { 
            get:function() 
            {
                return ConvertPixel(NonClientMetrics.iCaptionHeight); 
            }
        },

        /// <summary> 
        ///     From SPI_GETNONCLIENTMETRICS
        /// </summary> 
//        public static double 
        SmallCaptionWidth: 
        {
            get:function() 
            {
                return ConvertPixel(NonClientMetrics.iSmCaptionWidth);
            }
        }, 

        /// <summary> 
        ///     From SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static double 
        SmallCaptionHeight: 
        {
            get:function()
            {
                return ConvertPixel(NonClientMetrics.iSmCaptionHeight); 
            }
        }, 
 
        /// <summary>
        ///     From SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static double 
        MenuWidth:
        {
            get:function() 
            {
                return ConvertPixel(NonClientMetrics.iMenuWidth); 
            } 
        },
 
        /// <summary>
        ///     From SPI_NONCLIENTMETRICS
        /// </summary>
//        public static double 
        MenuHeight: 
        {
            get:function() 
            { 
                return ConvertPixel(NonClientMetrics.iMenuHeight);
            } 
        },

        /// <summary> 
        ///     MinimizeAnimation System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MinimizeAnimationKey:
        {
            get:function()
            { 
                if (_cacheMinimizeAnimation == null)
                { 
                    _cacheMinimizeAnimation = CreateInstance(SystemResourceKeyID.MinimizeAnimation); 
                }
 
                return _cacheMinimizeAnimation;
            }
        },
 
        /// <summary>
        ///     Border System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        BorderKey:
        { 
            get:function()
            {
                if (_cacheBorder == null)
                { 
                    _cacheBorder = CreateInstance(SystemResourceKeyID.Border);
                } 
 
                return _cacheBorder;
            } 
        },

        /// <summary>
        ///     CaretWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        CaretWidthKey: 
        { 
            get:function()
            { 
                if (_cacheCaretWidth == null)
                {
                    _cacheCaretWidth = CreateInstance(SystemResourceKeyID.CaretWidth);
                } 

                return _cacheCaretWidth; 
            } 
        },
 
        /// <summary>
        ///     ForegroundFlashCount System Resource Key
        /// </summary>
//        public static ResourceKey 
        ForegroundFlashCountKey: 
        {
            get:function() 
            { 
                if (_cacheForegroundFlashCount == null)
                { 
                    _cacheForegroundFlashCount = CreateInstance(SystemResourceKeyID.ForegroundFlashCount);
                }

                return _cacheForegroundFlashCount; 
            }
        }, 
 
        /// <summary>
        ///     DragFullWindows System Resource Key 
        /// </summary>
//        public static ResourceKey 
        DragFullWindowsKey:
        {
            get:function() 
            {
                if (_cacheDragFullWindows == null) 
                { 
                    _cacheDragFullWindows = CreateInstance(SystemResourceKeyID.DragFullWindows);
                } 

                return _cacheDragFullWindows;
            }
        }, 

        /// <summary> 
        ///     BorderWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        BorderWidthKey: 
        {
            get:function()
            {
                if (_cacheBorderWidth == null) 
                {
                    _cacheBorderWidth = CreateInstance(SystemResourceKeyID.BorderWidth); 
                } 

                return _cacheBorderWidth; 
            }
        },

        /// <summary> 
        ///     ScrollWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ScrollWidthKey: 
        {
            get:function() 
            {
                if (_cacheScrollWidth == null)
                {
                    _cacheScrollWidth = CreateInstance(SystemResourceKeyID.ScrollWidth); 
                }
 
                return _cacheScrollWidth; 
            }
        }, 

        /// <summary>
        ///     ScrollHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ScrollHeightKey:
        { 
            get:function() 
            {
                if (_cacheScrollHeight == null) 
                {
                    _cacheScrollHeight = CreateInstance(SystemResourceKeyID.ScrollHeight);
                }
 
                return _cacheScrollHeight;
            } 
        }, 

        /// <summary> 
        ///     CaptionWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        CaptionWidthKey:
        { 
            get:function()
            { 
                if (_cacheCaptionWidth == null) 
                {
                    _cacheCaptionWidth = CreateInstance(SystemResourceKeyID.CaptionWidth); 
                }

                return _cacheCaptionWidth;
            } 
        },
 
        /// <summary> 
        ///     CaptionHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        CaptionHeightKey:
        {
            get:function()
            { 
                if (_cacheCaptionHeight == null)
                { 
                    _cacheCaptionHeight = CreateInstance(SystemResourceKeyID.CaptionHeight); 
                }
 
                return _cacheCaptionHeight;
            }
        },
 
        /// <summary>
        ///     SmallCaptionWidth System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        SmallCaptionWidthKey:
        { 
            get:function()
            {
                if (_cacheSmallCaptionWidth == null)
                { 
                    _cacheSmallCaptionWidth = CreateInstance(SystemResourceKeyID.SmallCaptionWidth);
                } 
 
                return _cacheSmallCaptionWidth;
            } 
        },

        /// <summary>
        ///     MenuWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MenuWidthKey: 
        { 
            get:function()
            { 
                if (_cacheMenuWidth == null)
                {
                    _cacheMenuWidth = CreateInstance(SystemResourceKeyID.MenuWidth);
                } 

                return _cacheMenuWidth; 
            } 
        },
 
        /// <summary>
        ///     MenuHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        MenuHeightKey: 
        {
            get:function() 
            { 
                if (_cacheMenuHeight == null)
                { 
                    _cacheMenuHeight = CreateInstance(SystemResourceKeyID.MenuHeight);
                }

                return _cacheMenuHeight; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SM_CXBORDER 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        ThinHorizontalBorderHeight:
        {
            get:function() 
            {
                return _thinHorizontalBorderHeight; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_CYBORDER
        /// </summary>
        /// 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        ThinVerticalBorderWidth: 
        {
            get:function()
            { 
                return _thinVerticalBorderWidth;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CXCURSOR
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        CursorWidth: 
        {
            get:function()
            {
                return _cursorWidth;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CYCURSOR
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        CursorHeight:
        { 
            get:function()
            { 
                return _cursorHeight;
            }
        },
 
        /// <summary>
        ///     Maps to SM_CXEDGE 
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        ThickHorizontalBorderHeight:
        { 
            get:function() 
            { 
                return _thickHorizontalBorderHeight;
            } 
        },

        /// <summary>
        ///     Maps to SM_CYEDGE 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double
        ThickVerticalBorderWidth:
        {
            get:function() 
            {
                return _thickVerticalBorderWidth; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_CXDRAG
        /// </summary>
        /// <SecurityNote> 
        ///    Critical - calls into native code (GetSystemMetrics)
        ///    PublicOK - Safe data to expose 
        /// </SecurityNote> 
//        public static double
        MinimumHorizontalDragDistance:
        { 
            get:function()
            {
                return _minimumHorizontalDragDistance; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SM_CYDRAG 
        /// </summary>
        /// <SecurityNote>
        ///    Critical - calls into native code (GetSystemMetrics)
        ///    PublicOK - Safe data to expose 
        /// </SecurityNote>
//        public static double 
        MinimumVerticalDragDistance: 
        { 
            get:function() 
            {
                return _minimumVerticalDragDistance;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_CXFIXEDFRAME 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        FixedFrameHorizontalBorderHeight: 
        {
            get:function() 
            {
                return _fixedFrameHorizontalBorderHeight; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYFIXEDFRAME
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        FixedFrameVerticalBorderWidth:
        {
            get:function()
            { 
                return _fixedFrameVerticalBorderWidth; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CXFOCUSBORDER
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        FocusHorizontalBorderHeight: 
        {
            get:function()
            { 
                return _focusHorizontalBorderHeight;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CYFOCUSBORDER
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        FocusVerticalBorderWidth: 
        {
            get:function()
            {
                return _focusVerticalBorderWidth;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CXFULLSCREEN
        /// </summary> 
        ///
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        FullPrimaryScreenWidth: 
        {
            get:function()
            { 
                return _fullPrimaryScreenWidth; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_CYFULLSCREEN
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        FullPrimaryScreenHeight:
        {
            get:function()
            { 
                return _fullPrimaryScreenHeight;
            } 
        },

        /// <summary>
        ///     Maps to SM_CXHSCROLL 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        HorizontalScrollBarButtonWidth:
        {
            get:function() 
            {
                return _horizontalScrollBarButtonWidth; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_CYHSCROLL
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static double 
        HorizontalScrollBarHeight:
        { 
            get:function()
            {
                return _horizontalScrollBarHeight; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SM_CXHTHUMB 
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        HorizontalScrollBarThumbWidth: 
        { 
            get:function() 
            {
                return _horizontalScrollBarThumbWidth;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_CXICON 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double
        IconWidth: 
        {
            get:function() 
            {
                return _iconWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYICON
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        IconHeight:
        {
            get:function()
            { 
                return _iconHeight; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CXICONSPACING
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        IconGridWidth: 
        {
            get:function()
            { 
                return _iconGridWidth;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CYICONSPACING
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        IconGridHeight: 
        {
            get:function()
            {
                return _iconGridHeight;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CXMAXIMIZED
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static double 
        MaximizedPrimaryScreenWidth:
        { 
            get:function()
            {
                return _maximizedPrimaryScreenWidth;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CYMAXIMIZED
        /// </summary>
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MaximizedPrimaryScreenHeight:
        {
            get:function() 
            {
                return _maximizedPrimaryScreenHeight; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CXMAXTRACK
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        MaximumWindowTrackWidth:
        { 
            get:function() 
            { 
                return _maximumWindowTrackWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYMAXTRACK
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MaximumWindowTrackHeight:
        { 
            get:function()
            { 
                return _maximumWindowTrackHeight;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_CXMENUCHECK 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        MenuCheckmarkWidth: 
        {
            get:function() 
            {
                return _menuCheckmarkWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYMENUCHECK
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        MenuCheckmarkHeight:
        {
            get:function()
            { 
                return _menuCheckmarkHeight; 
            }
        },

        /// <summary>
        ///     Maps to SM_CXMENUSIZE
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        MenuButtonWidth: 
        {
            get:function()
            { 
                return _menuButtonWidth;
            } 
        },

        /// <summary> 
        ///     Maps to SM_CYMENUSIZE
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MenuButtonHeight: 
        {
            get:function()
            {
                return _menuButtonHeight;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CXMIN
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static double 
        MinimumWindowWidth:
        { 
            get:function()
            {
                return _minimumWindowWidth;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CYMIN
        /// </summary>
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MinimumWindowHeight:
        {
            get:function() 
            {
                return _minimumWindowHeight; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CXMINIMIZED
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK -- There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        MinimizedWindowWidth:
        { 
            get:function() 
            { 
                return _minimizedWindowWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYMINIMIZED
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MinimizedWindowHeight:
        { 
            get:function()
            { 
                return _minimizedWindowHeight;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_CXMINSPACING 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        MinimizedGridWidth: 
        {
            get:function() 
            {
                return _minimizedGridWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYMINSPACING
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        MinimizedGridHeight:
        {
            get:function()
            { 
                return _minimizedGridHeight; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CXMINTRACK
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exist a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        MinimumWindowTrackWidth:
        { 
            get:function() 
            { 
                return _minimumWindowTrackWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYMINTRACK
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        MinimumWindowTrackHeight:
        { 
            get:function()
            { 
                return _minimumWindowTrackHeight;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_CXSCREEN 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --  This is safe to expose
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        PrimaryScreenWidth: 
        {
            get:function() 
            {
                return _primaryScreenWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYSCREEN
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --This is safe to expose
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        PrimaryScreenHeight:
        {
            get:function()
            { 
                return _primaryScreenHeight;
            } 
        },

        /// <summary>
        ///     Maps to SM_CXSIZE 
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        WindowCaptionButtonWidth: 
        {
            get:function() 
            {
                return _windowCaptionButtonWidth;
            }
        },
 
        /// <summary>
        ///     Maps to SM_CYSIZE 
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        WindowCaptionButtonHeight:
        { 
            get:function() 
            { 
                return _windowCaptionButtonHeight;
            } 
        },

        /// <summary>
        ///     Maps to SM_CXSIZEFRAME 
        /// </summary>
        /// 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        ResizeFrameHorizontalBorderHeight:
        {
            get:function()
            { 
                return _resizeFrameHorizontalBorderHeight; 
            }
        },

        /// <summary>
        ///     Maps to SM_CYSIZEFRAME
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        ResizeFrameVerticalBorderWidth: 
        {
            get:function()
            { 
                return _resizeFrameVerticalBorderWidth;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CXSMICON
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        SmallIconWidth: 
        {
            get:function()
            {
                return _smallIconWidth;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CYSMICON
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        SmallIconHeight:
        { 
            get:function()
            { 
                return _smallIconHeight;
            }
        },
 
        /// <summary>
        ///     Maps to SM_CXSMSIZE 
        /// </summary> 
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        SmallWindowCaptionButtonWidth:
        { 
            get:function() 
            { 
                return _smallWindowCaptionButtonWidth;
            } 
        },

        /// <summary>
        ///     Maps to SM_CYSMSIZE 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        SmallWindowCaptionButtonHeight:
        {
            get:function() 
            {
                return _smallWindowCaptionButtonHeight; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_CXVIRTUALSCREEN
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        VirtualScreenWidth:
        {
            get:function()
            { 
                return _virtualScreenWidth;
            } 
        },

        /// <summary>
        ///     Maps to SM_CYVIRTUALSCREEN 
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        VirtualScreenHeight: 
        {
            get:function() 
            {
                return _virtualScreenHeight;
            }
        },
 
        /// <summary>
        ///     Maps to SM_CXVSCROLL 
        /// </summary> 
        ///
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        VerticalScrollBarWidth: 
        {
            get:function() 
            {
                return _verticalScrollBarWidth; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYVSCROLL
        /// </summary> 
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        VerticalScrollBarButtonHeight:
        {
            get:function()
            { 
                return _verticalScrollBarButtonHeight; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_CYCAPTION
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --There exists a demand 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static double 
        WindowCaptionHeight:
        { 
            get:function() 
            { 
                return _windowCaptionHeight; 
            }
        },

        /// <summary> 
        ///     Maps to SM_CYKANJIWINDOW
        /// </summary> 
        /// 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote>
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static double 
        KanjiWindowHeight: 
        { 
            get:function() 
            {
                return _kanjiWindowHeight;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_CYMENU
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static double 
        MenuBarHeight:
        { 
            get:function()
            {
                return _menuBarHeight;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_CYVTHUMB
        /// </summary>
        /// <SecurityNote>
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        VerticalScrollBarThumbHeight: 
        {
            get:function()
            {
                return _verticalScrollBarThumbHeight;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_IMMENABLED
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand in this code.
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static bool 
        IsImmEnabled:
        { 
            get:function()
            {
                return _isImmEnabled;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_MEDIACENTER
        /// </summary>
        ///
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static bool 
        IsMediaCenter:
        {
            get:function()
            { 
                return _isMediaCenter;
            } 
        },

        /// <summary>
        ///     Maps to SM_MENUDROPALIGNMENT 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static bool 
        IsMenuDropRightAligned:
        {
            get:function() 
            {
                return _isMenuDropRightAligned; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_MIDEASTENABLED
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote> 
        ///    PublicOK --There exists a demand
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static bool 
        IsMiddleEastEnabled:
        {
            get:function()
            { 
                return _isMiddleEastEnabled;
            } 
        },

        /// <summary>
        ///     Maps to SM_MOUSEPRESENT 
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static bool 
        IsMousePresent:
        {
            get:function() 
            {
                return _isMousePresent; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_MOUSEWHEELPRESENT
        /// </summary>
        /// <SecurityNote> 
        ///    PublicOK --System Metrics are deemed safe
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static bool 
        IsMouseWheelPresent:
        { 
            get:function()
            {
                return _isMouseWheelPresent; 
            }
        },
 
        /// <summary>
        ///     Maps to SM_PENWINDOWS 
        /// </summary>
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --Deemed as unsafe 
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static bool 
        IsPenWindows: 
        {
            get:function()
            { 
                return _isPenWindows; 
            } 
        },
 
        /// <summary>
        ///     Maps to SM_REMOTECONTROL
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote> 
        ///    PublicOK --Demands unmanaged Code
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static bool 
        IsRemotelyControlled:
        {
            get:function()
            { 
                return _isRemotelyControlled;
            } 
        },

        /// <summary>
        ///     Maps to SM_REMOTESESSION 
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --Demand Unmanaged Code
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static bool 
        IsRemoteSession: 
        {
            get:function() 
            {
                return _isRemoteSession;
            }
        },
 
        /// <summary>
        ///     Maps to SM_SHOWSOUNDS 
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote>
        ///    PublicOK --Demand Unmanaged Code
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote>
//        public static bool 
        ShowSounds: 
        { 
            get:function() 
            {
                return _showSounds;
            } 
        },
 
        /// <summary> 
        ///     Maps to SM_SLOWMACHINE
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --Demands unmanaged code
        ///    Security Critical -- Calling UnsafeNativeMethods 
        /// </SecurityNote> 
//        public static bool 
        IsSlowMachine:
        { 
            get:function()
            {
                return _isSlowMachine;
            } 
        }, 

        /// <summary> 
        ///     Maps to SM_SWAPBUTTON
        /// </summary>
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks>
        /// <SecurityNote> 
        ///    PublicOK --Demands unmanaged code 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static bool 
        SwapButtons:
        {
            get:function() 
            {
                return _swapButtons; 
            }
        }, 

        /// <summary>
        ///     Maps to SM_TABLETPC
        /// </summary> 
        /// <remarks>
        ///     Callers must have UnmanagedCode permission to call this API. 
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK -- Demands unmanaged code 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote>
//        public static bool 
        IsTabletPC:
        { 
            get:function() 
            { 
                return _isTabletPC; 
            }
        },

        /// <summary> 
        ///     Maps to SM_XVIRTUALSCREEN
        /// </summary> 
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks> 
        /// <SecurityNote>
        ///    PublicOK --Demands unmanaged code
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        VirtualScreenLeft:
        { 
            get:function()
            { 
                return _virtualScreenLeft;
            }
        }, 

        /// <summary> 
        ///     Maps to SM_YVIRTUALSCREEN 
        /// </summary>
        /// <remarks> 
        ///     Callers must have UnmanagedCode permission to call this API.
        /// </remarks>
        /// <SecurityNote>
        ///    PublicOK --Demands unmanaged code 
        ///    Security Critical -- Calling UnsafeNativeMethods
        /// </SecurityNote> 
//        public static double 
        VirtualScreenTop: 
        {
            get:function()
            {
                return _virtualScreenTop; 
            }
        }, 

        /// <summary>
        ///     ThinHorizontalBorderHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        ThinHorizontalBorderHeightKey: 
        { 
            get:function()
            { 
                if (_cacheThinHorizontalBorderHeight == null)
                {
                    _cacheThinHorizontalBorderHeight = CreateInstance(SystemResourceKeyID.ThinHorizontalBorderHeight);
                } 

                return _cacheThinHorizontalBorderHeight; 
            } 
        },
 
        /// <summary>
        ///     ThinVerticalBorderWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        ThinVerticalBorderWidthKey: 
        {
            get:function() 
            { 
                if (_cacheThinVerticalBorderWidth == null)
                { 
                    _cacheThinVerticalBorderWidth = CreateInstance(SystemResourceKeyID.ThinVerticalBorderWidth);
                }

                return _cacheThinVerticalBorderWidth; 
            }
        }, 
 
        /// <summary>
        ///     CursorWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        CursorWidthKey:
        {
            get:function() 
            {
                if (_cacheCursorWidth == null) 
                { 
                    _cacheCursorWidth = CreateInstance(SystemResourceKeyID.CursorWidth);
                } 

                return _cacheCursorWidth;
            }
        }, 

        /// <summary> 
        ///     CursorHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        CursorHeightKey: 
        {
            get:function()
            {
                if (_cacheCursorHeight == null) 
                {
                    _cacheCursorHeight = CreateInstance(SystemResourceKeyID.CursorHeight); 
                } 

                return _cacheCursorHeight; 
            }
        },

        /// <summary> 
        ///     ThickHorizontalBorderHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ThickHorizontalBorderHeightKey: 
        {
            get:function() 
            {
                if (_cacheThickHorizontalBorderHeight == null)
                {
                    _cacheThickHorizontalBorderHeight = CreateInstance(SystemResourceKeyID.ThickHorizontalBorderHeight); 
                }
 
                return _cacheThickHorizontalBorderHeight; 
            }
        }, 

        /// <summary>
        ///     ThickVerticalBorderWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ThickVerticalBorderWidthKey:
        { 
            get:function() 
            {
                if (_cacheThickVerticalBorderWidth == null) 
                {
                    _cacheThickVerticalBorderWidth = CreateInstance(SystemResourceKeyID.ThickVerticalBorderWidth);
                }
 
                return _cacheThickVerticalBorderWidth;
            } 
        }, 

        /// <summary> 
        ///     FixedFrameHorizontalBorderHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        FixedFrameHorizontalBorderHeightKey:
        { 
            get:function()
            { 
                if (_cacheFixedFrameHorizontalBorderHeight == null) 
                {
                    _cacheFixedFrameHorizontalBorderHeight = CreateInstance(SystemResourceKeyID.FixedFrameHorizontalBorderHeight); 
                }

                return _cacheFixedFrameHorizontalBorderHeight;
            } 
        },
 
        /// <summary> 
        ///     FixedFrameVerticalBorderWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        FixedFrameVerticalBorderWidthKey:
        {
            get:function()
            { 
                if (_cacheFixedFrameVerticalBorderWidth == null)
                { 
                    _cacheFixedFrameVerticalBorderWidth = CreateInstance(SystemResourceKeyID.FixedFrameVerticalBorderWidth); 
                }
 
                return _cacheFixedFrameVerticalBorderWidth;
            }
        },
 
        /// <summary>
        ///     FocusHorizontalBorderHeight System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        FocusHorizontalBorderHeightKey:
        { 
            get:function()
            {
                if (_cacheFocusHorizontalBorderHeight == null)
                { 
                    _cacheFocusHorizontalBorderHeight = CreateInstance(SystemResourceKeyID.FocusHorizontalBorderHeight);
                } 
 
                return _cacheFocusHorizontalBorderHeight;
            } 
        },

        /// <summary>
        ///     FocusVerticalBorderWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        FocusVerticalBorderWidthKey: 
        { 
            get:function()
            { 
                if (_cacheFocusVerticalBorderWidth == null)
                {
                    _cacheFocusVerticalBorderWidth = CreateInstance(SystemResourceKeyID.FocusVerticalBorderWidth);
                } 

                return _cacheFocusVerticalBorderWidth; 
            } 
        },
 
        /// <summary>
        ///     FullPrimaryScreenWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        FullPrimaryScreenWidthKey: 
        {
            get:function() 
            { 
                if (_cacheFullPrimaryScreenWidth == null)
                { 
                    _cacheFullPrimaryScreenWidth = CreateInstance(SystemResourceKeyID.FullPrimaryScreenWidth);
                }

                return _cacheFullPrimaryScreenWidth; 
            }
        },
 
        /// <summary>
        ///     FullPrimaryScreenHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        FullPrimaryScreenHeightKey:
        {
            get:function() 
            {
                if (_cacheFullPrimaryScreenHeight == null) 
                { 
                    _cacheFullPrimaryScreenHeight = CreateInstance(SystemResourceKeyID.FullPrimaryScreenHeight);
                } 

                return _cacheFullPrimaryScreenHeight;
            }
        }, 

        /// <summary> 
        ///     HorizontalScrollBarButtonWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        HorizontalScrollBarButtonWidthKey: 
        {
            get:function()
            {
                if (_cacheHorizontalScrollBarButtonWidth == null) 
                {
                    _cacheHorizontalScrollBarButtonWidth = CreateInstance(SystemResourceKeyID.HorizontalScrollBarButtonWidth); 
                } 

                return _cacheHorizontalScrollBarButtonWidth; 
            }
        },

        /// <summary> 
        ///     HorizontalScrollBarHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        HorizontalScrollBarHeightKey: 
        {
            get:function() 
            {
                if (_cacheHorizontalScrollBarHeight == null)
                {
                    _cacheHorizontalScrollBarHeight = CreateInstance(SystemResourceKeyID.HorizontalScrollBarHeight); 
                }
 
                return _cacheHorizontalScrollBarHeight; 
            }
        }, 

        /// <summary>
        ///     HorizontalScrollBarThumbWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        HorizontalScrollBarThumbWidthKey:
        { 
            get:function() 
            {
                if (_cacheHorizontalScrollBarThumbWidth == null) 
                {
                    _cacheHorizontalScrollBarThumbWidth = CreateInstance(SystemResourceKeyID.HorizontalScrollBarThumbWidth);
                }
 
                return _cacheHorizontalScrollBarThumbWidth;
            } 
        }, 

        /// <summary> 
        ///     IconWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        IconWidthKey:
        { 
            get:function()
            { 
                if (_cacheIconWidth == null) 
                {
                    _cacheIconWidth = CreateInstance(SystemResourceKeyID.IconWidth); 
                }

                return _cacheIconWidth;
            } 
        },
 
        /// <summary> 
        ///     IconHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        IconHeightKey:
        {
            get:function()
            { 
                if (_cacheIconHeight == null)
                { 
                    _cacheIconHeight = CreateInstance(SystemResourceKeyID.IconHeight); 
                }
 
                return _cacheIconHeight;
            }
        },
 
        /// <summary>
        ///     IconGridWidth System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        IconGridWidthKey:
        { 
            get:function()
            {
                if (_cacheIconGridWidth == null)
                { 
                    _cacheIconGridWidth = CreateInstance(SystemResourceKeyID.IconGridWidth);
                } 
 
                return _cacheIconGridWidth;
            } 
        },

        /// <summary>
        ///     IconGridHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IconGridHeightKey: 
        { 
            get:function()
            { 
                if (_cacheIconGridHeight == null)
                {
                    _cacheIconGridHeight = CreateInstance(SystemResourceKeyID.IconGridHeight);
                } 

                return _cacheIconGridHeight; 
            } 
        },
 
        /// <summary>
        ///     MaximizedPrimaryScreenWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        MaximizedPrimaryScreenWidthKey: 
        {
            get:function() 
            { 
                if (_cacheMaximizedPrimaryScreenWidth == null)
                { 
                    _cacheMaximizedPrimaryScreenWidth = CreateInstance(SystemResourceKeyID.MaximizedPrimaryScreenWidth);
                }

                return _cacheMaximizedPrimaryScreenWidth; 
            }
        }, 
 
        /// <summary>
        ///     MaximizedPrimaryScreenHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MaximizedPrimaryScreenHeightKey:
        {
            get:function() 
            {
                if (_cacheMaximizedPrimaryScreenHeight == null) 
                { 
                    _cacheMaximizedPrimaryScreenHeight = CreateInstance(SystemResourceKeyID.MaximizedPrimaryScreenHeight);
                } 

                return _cacheMaximizedPrimaryScreenHeight;
            }
        }, 

        /// <summary> 
        ///     MaximumWindowTrackWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MaximumWindowTrackWidthKey: 
        {
            get:function()
            {
                if (_cacheMaximumWindowTrackWidth == null) 
                {
                    _cacheMaximumWindowTrackWidth = CreateInstance(SystemResourceKeyID.MaximumWindowTrackWidth); 
                } 

                return _cacheMaximumWindowTrackWidth; 
            }
        },

        /// <summary> 
        ///     MaximumWindowTrackHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MaximumWindowTrackHeightKey: 
        {
            get:function() 
            {
                if (_cacheMaximumWindowTrackHeight == null)
                {
                    _cacheMaximumWindowTrackHeight = CreateInstance(SystemResourceKeyID.MaximumWindowTrackHeight); 
                }
 
                return _cacheMaximumWindowTrackHeight; 
            }
        }, 

        /// <summary>
        ///     MenuCheckmarkWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MenuCheckmarkWidthKey:
        { 
            get:function() 
            {
                if (_cacheMenuCheckmarkWidth == null) 
                {
                    _cacheMenuCheckmarkWidth = CreateInstance(SystemResourceKeyID.MenuCheckmarkWidth);
                }
 
                return _cacheMenuCheckmarkWidth;
            } 
        }, 

        /// <summary> 
        ///     MenuCheckmarkHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        MenuCheckmarkHeightKey:
        { 
            get:function()
            { 
                if (_cacheMenuCheckmarkHeight == null) 
                {
                    _cacheMenuCheckmarkHeight = CreateInstance(SystemResourceKeyID.MenuCheckmarkHeight); 
                }

                return _cacheMenuCheckmarkHeight;
            } 
        },
 
        /// <summary> 
        ///     MenuButtonWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MenuButtonWidthKey:
        {
            get:function()
            { 
                if (_cacheMenuButtonWidth == null)
                { 
                    _cacheMenuButtonWidth = CreateInstance(SystemResourceKeyID.MenuButtonWidth); 
                }
 
                return _cacheMenuButtonWidth;
            }
        },
 
        /// <summary>
        ///     MenuButtonHeight System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        MenuButtonHeightKey:
        { 
            get:function()
            {
                if (_cacheMenuButtonHeight == null)
                { 
                    _cacheMenuButtonHeight = CreateInstance(SystemResourceKeyID.MenuButtonHeight);
                } 
 
                return _cacheMenuButtonHeight;
            } 
        },

        /// <summary>
        ///     MinimumWindowWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MinimumWindowWidthKey: 
        { 
            get:function()
            { 
                if (_cacheMinimumWindowWidth == null)
                {
                    _cacheMinimumWindowWidth = CreateInstance(SystemResourceKeyID.MinimumWindowWidth);
                } 

                return _cacheMinimumWindowWidth; 
            } 
        },
 
        /// <summary>
        ///     MinimumWindowHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        MinimumWindowHeightKey: 
        {
            get:function() 
            { 
                if (_cacheMinimumWindowHeight == null)
                { 
                    _cacheMinimumWindowHeight = CreateInstance(SystemResourceKeyID.MinimumWindowHeight);
                }

                return _cacheMinimumWindowHeight; 
            }
        }, 
 
        /// <summary>
        ///     MinimizedWindowWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MinimizedWindowWidthKey:
        {
            get:function() 
            {
                if (_cacheMinimizedWindowWidth == null) 
                { 
                    _cacheMinimizedWindowWidth = CreateInstance(SystemResourceKeyID.MinimizedWindowWidth);
                } 

                return _cacheMinimizedWindowWidth;
            }
        }, 

        /// <summary> 
        ///     MinimizedWindowHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        MinimizedWindowHeightKey: 
        {
            get:function()
            {
                if (_cacheMinimizedWindowHeight == null) 
                {
                    _cacheMinimizedWindowHeight = CreateInstance(SystemResourceKeyID.MinimizedWindowHeight); 
                } 

                return _cacheMinimizedWindowHeight; 
            }
        },

        /// <summary> 
        ///     MinimizedGridWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MinimizedGridWidthKey: 
        {
            get:function() 
            {
                if (_cacheMinimizedGridWidth == null)
                {
                    _cacheMinimizedGridWidth = CreateInstance(SystemResourceKeyID.MinimizedGridWidth); 
                }
 
                return _cacheMinimizedGridWidth; 
            }
        }, 

        /// <summary>
        ///     MinimizedGridHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MinimizedGridHeightKey:
        { 
            get:function() 
            {
                if (_cacheMinimizedGridHeight == null) 
                {
                    _cacheMinimizedGridHeight = CreateInstance(SystemResourceKeyID.MinimizedGridHeight);
                }
 
                return _cacheMinimizedGridHeight;
            } 
        }, 

        /// <summary> 
        ///     MinimumWindowTrackWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        MinimumWindowTrackWidthKey:
        { 
            get:function()
            { 
                if (_cacheMinimumWindowTrackWidth == null) 
                {
                    _cacheMinimumWindowTrackWidth = CreateInstance(SystemResourceKeyID.MinimumWindowTrackWidth); 
                }

                return _cacheMinimumWindowTrackWidth;
            } 
        },
 
        /// <summary> 
        ///     MinimumWindowTrackHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        MinimumWindowTrackHeightKey:
        {
            get:function()
            { 
                if (_cacheMinimumWindowTrackHeight == null)
                { 
                    _cacheMinimumWindowTrackHeight = CreateInstance(SystemResourceKeyID.MinimumWindowTrackHeight); 
                }
 
                return _cacheMinimumWindowTrackHeight;
            }
        },
 
        /// <summary>
        ///     PrimaryScreenWidth System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        PrimaryScreenWidthKey:
        { 
            get:function()
            {
                if (_cachePrimaryScreenWidth == null)
                { 
                    _cachePrimaryScreenWidth = CreateInstance(SystemResourceKeyID.PrimaryScreenWidth);
                } 
 
                return _cachePrimaryScreenWidth;
            } 
        },

        /// <summary>
        ///     PrimaryScreenHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        PrimaryScreenHeightKey:
        { 
            get:function()
            { 
                if (_cachePrimaryScreenHeight == null)
                {
                    _cachePrimaryScreenHeight = CreateInstance(SystemResourceKeyID.PrimaryScreenHeight);
                } 

                return _cachePrimaryScreenHeight; 
            } 
        },
 
        /// <summary>
        ///     WindowCaptionButtonWidth System Resource Key
        /// </summary>
//        public static ResourceKey 
        WindowCaptionButtonWidthKey: 
        {
            get:function() 
            { 
                if (_cacheWindowCaptionButtonWidth == null)
                { 
                    _cacheWindowCaptionButtonWidth = CreateInstance(SystemResourceKeyID.WindowCaptionButtonWidth);
                }

                return _cacheWindowCaptionButtonWidth; 
            }
        }, 
 
        /// <summary>
        ///     WindowCaptionButtonHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        WindowCaptionButtonHeightKey:
        {
            get:function() 
            {
                if (_cacheWindowCaptionButtonHeight == null) 
                { 
                    _cacheWindowCaptionButtonHeight = CreateInstance(SystemResourceKeyID.WindowCaptionButtonHeight);
                } 

                return _cacheWindowCaptionButtonHeight;
            }
        }, 

        /// <summary> 
        ///     ResizeFrameHorizontalBorderHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        ResizeFrameHorizontalBorderHeightKey: 
        {
            get:function()
            {
                if (_cacheResizeFrameHorizontalBorderHeight == null) 
                {
                    _cacheResizeFrameHorizontalBorderHeight = CreateInstance(SystemResourceKeyID.ResizeFrameHorizontalBorderHeight); 
                } 

                return _cacheResizeFrameHorizontalBorderHeight; 
            }
        },

        /// <summary> 
        ///     ResizeFrameVerticalBorderWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        ResizeFrameVerticalBorderWidthKey: 
        {
            get:function() 
            {
                if (_cacheResizeFrameVerticalBorderWidth == null)
                {
                    _cacheResizeFrameVerticalBorderWidth = CreateInstance(SystemResourceKeyID.ResizeFrameVerticalBorderWidth); 
                }
 
                return _cacheResizeFrameVerticalBorderWidth; 
            }
        }, 

        /// <summary>
        ///     SmallIconWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        SmallIconWidthKey:
        { 
            get:function() 
            {
                if (_cacheSmallIconWidth == null) 
                {
                    _cacheSmallIconWidth = CreateInstance(SystemResourceKeyID.SmallIconWidth);
                }
 
                return _cacheSmallIconWidth;
            } 
        }, 

        /// <summary> 
        ///     SmallIconHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        SmallIconHeightKey:
        { 
            get:function()
            { 
                if (_cacheSmallIconHeight == null) 
                {
                    _cacheSmallIconHeight = CreateInstance(SystemResourceKeyID.SmallIconHeight); 
                }

                return _cacheSmallIconHeight;
            } 
        },
 
        /// <summary> 
        ///     SmallWindowCaptionButtonWidth System Resource Key
        /// </summary> 
//        public static ResourceKey 
        SmallWindowCaptionButtonWidthKey:
        {
            get:function()
            { 
                if (_cacheSmallWindowCaptionButtonWidth == null)
                { 
                    _cacheSmallWindowCaptionButtonWidth = CreateInstance(SystemResourceKeyID.SmallWindowCaptionButtonWidth); 
                }
 
                return _cacheSmallWindowCaptionButtonWidth;
            }
        },
 
        /// <summary>
        ///     SmallWindowCaptionButtonHeight System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        SmallWindowCaptionButtonHeightKey:
        { 
            get:function()
            {
                if (_cacheSmallWindowCaptionButtonHeight == null)
                { 
                    _cacheSmallWindowCaptionButtonHeight = CreateInstance(SystemResourceKeyID.SmallWindowCaptionButtonHeight);
                } 
 
                return _cacheSmallWindowCaptionButtonHeight;
            } 
        },

        /// <summary>
        ///     VirtualScreenWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        VirtualScreenWidthKey: 
        { 
            get:function()
            { 
                if (_cacheVirtualScreenWidth == null)
                {
                    _cacheVirtualScreenWidth = CreateInstance(SystemResourceKeyID.VirtualScreenWidth);
                } 

                return _cacheVirtualScreenWidth; 
            } 
        },
 
        /// <summary>
        ///     VirtualScreenHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        VirtualScreenHeightKey: 
        {
            get:function() 
            { 
                if (_cacheVirtualScreenHeight == null)
                { 
                    _cacheVirtualScreenHeight = CreateInstance(SystemResourceKeyID.VirtualScreenHeight);
                }

                return _cacheVirtualScreenHeight; 
            }
        }, 
 
        /// <summary>
        ///     VerticalScrollBarWidth System Resource Key 
        /// </summary>
//        public static ResourceKey 
        VerticalScrollBarWidthKey:
        {
            get:function() 
            {
                if (_cacheVerticalScrollBarWidth == null) 
                { 
                    _cacheVerticalScrollBarWidth = CreateInstance(SystemResourceKeyID.VerticalScrollBarWidth);
                } 

                return _cacheVerticalScrollBarWidth;
            }
        }, 

        /// <summary> 
        ///     VerticalScrollBarButtonHeight System Resource Key 
        /// </summary>
//        public static ResourceKey 
        VerticalScrollBarButtonHeightKey: 
        {
            get:function()
            {
                if (_cacheVerticalScrollBarButtonHeight == null) 
                {
                    _cacheVerticalScrollBarButtonHeight = CreateInstance(SystemResourceKeyID.VerticalScrollBarButtonHeight); 
                } 

                return _cacheVerticalScrollBarButtonHeight; 
            }
        },

        /// <summary> 
        ///     WindowCaptionHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        WindowCaptionHeightKey: 
        {
            get:function() 
            {
                if (_cacheWindowCaptionHeight == null)
                {
                    _cacheWindowCaptionHeight = CreateInstance(SystemResourceKeyID.WindowCaptionHeight); 
                }
 
                return _cacheWindowCaptionHeight; 
            }
        }, 

        /// <summary>
        ///     KanjiWindowHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        KanjiWindowHeightKey:
        { 
            get:function() 
            {
                if (_cacheKanjiWindowHeight == null) 
                {
                    _cacheKanjiWindowHeight = CreateInstance(SystemResourceKeyID.KanjiWindowHeight);
                }
 
                return _cacheKanjiWindowHeight;
            } 
        }, 

        /// <summary> 
        ///     MenuBarHeight System Resource Key
        /// </summary>
//        public static ResourceKey 
        MenuBarHeightKey:
        { 
            get:function()
            { 
                if (_cacheMenuBarHeight == null) 
                {
                    _cacheMenuBarHeight = CreateInstance(SystemResourceKeyID.MenuBarHeight); 
                }

                return _cacheMenuBarHeight;
            } 
        },
 
        /// <summary> 
        ///     SmallCaptionHeight System Resource Key
        /// </summary> 
//        public static ResourceKey 
        SmallCaptionHeightKey:
        {
            get:function()
            { 
                if (_cacheSmallCaptionHeight == null)
                { 
                    _cacheSmallCaptionHeight = CreateInstance(SystemResourceKeyID.SmallCaptionHeight); 
                }
 
                return _cacheSmallCaptionHeight;
            }
        },
 
        /// <summary>
        ///     VerticalScrollBarThumbHeight System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        VerticalScrollBarThumbHeightKey:
        { 
            get:function()
            {
                if (_cacheVerticalScrollBarThumbHeight == null)
                { 
                    _cacheVerticalScrollBarThumbHeight = CreateInstance(SystemResourceKeyID.VerticalScrollBarThumbHeight);
                } 
 
                return _cacheVerticalScrollBarThumbHeight;
            } 
        },

        /// <summary>
        ///     IsImmEnabled System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IsImmEnabledKey: 
        { 
            get:function()
            { 
                if (_cacheIsImmEnabled == null)
                {
                    _cacheIsImmEnabled = CreateInstance(SystemResourceKeyID.IsImmEnabled);
                } 

                return _cacheIsImmEnabled; 
            } 
        },
 
        /// <summary>
        ///     IsMediaCenter System Resource Key
        /// </summary>
//        public static ResourceKey 
        IsMediaCenterKey: 
        {
            get:function() 
            { 
                if (_cacheIsMediaCenter == null)
                { 
                    _cacheIsMediaCenter = CreateInstance(SystemResourceKeyID.IsMediaCenter);
                }

                return _cacheIsMediaCenter; 
            }
        }, 
 
        /// <summary>
        ///     IsMenuDropRightAligned System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IsMenuDropRightAlignedKey:
        {
            get:function() 
            {
                if (_cacheIsMenuDropRightAligned == null) 
                { 
                    _cacheIsMenuDropRightAligned = CreateInstance(SystemResourceKeyID.IsMenuDropRightAligned);
                } 

                return _cacheIsMenuDropRightAligned;
            }
        }, 

        /// <summary> 
        ///     IsMiddleEastEnabled System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IsMiddleEastEnabledKey: 
        {
            get:function()
            {
                if (_cacheIsMiddleEastEnabled == null) 
                {
                    _cacheIsMiddleEastEnabled = CreateInstance(SystemResourceKeyID.IsMiddleEastEnabled); 
                } 

                return _cacheIsMiddleEastEnabled; 
            }
        },

        /// <summary> 
        ///     IsMousePresent System Resource Key
        /// </summary> 
//        public static ResourceKey 
        IsMousePresentKey: 
        {
            get:function() 
            {
                if (_cacheIsMousePresent == null)
                {
                    _cacheIsMousePresent = CreateInstance(SystemResourceKeyID.IsMousePresent); 
                }
 
                return _cacheIsMousePresent; 
            }
        }, 

        /// <summary>
        ///     IsMouseWheelPresent System Resource Key
        /// </summary> 
//        public static ResourceKey 
        IsMouseWheelPresentKey:
        { 
            get:function() 
            {
                if (_cacheIsMouseWheelPresent == null) 
                {
                    _cacheIsMouseWheelPresent = CreateInstance(SystemResourceKeyID.IsMouseWheelPresent);
                }
 
                return _cacheIsMouseWheelPresent;
            } 
        }, 

        /// <summary> 
        ///     IsPenWindows System Resource Key
        /// </summary>
//        public static ResourceKey 
        IsPenWindowsKey:
        { 
            get:function()
            { 
                if (_cacheIsPenWindows == null) 
                {
                    _cacheIsPenWindows = CreateInstance(SystemResourceKeyID.IsPenWindows); 
                }

                return _cacheIsPenWindows;
            } 
        },
 
        /// <summary> 
        ///     IsRemotelyControlled System Resource Key
        /// </summary> 
//        public static ResourceKey 
        IsRemotelyControlledKey:
        {
            get:function()
            { 
                if (_cacheIsRemotelyControlled == null)
                { 
                    _cacheIsRemotelyControlled = CreateInstance(SystemResourceKeyID.IsRemotelyControlled); 
                }
 
                return _cacheIsRemotelyControlled;
            }
        },
 
        /// <summary>
        ///     IsRemoteSession System Resource Key 
        /// </summary> 
//        public static ResourceKey 
        IsRemoteSessionKey:
        { 
            get:function()
            {
                if (_cacheIsRemoteSession == null)
                { 
                    _cacheIsRemoteSession = CreateInstance(SystemResourceKeyID.IsRemoteSession);
                } 
 
                return _cacheIsRemoteSession;
            } 
        },

        /// <summary>
        ///     ShowSounds System Resource Key 
        /// </summary>
//        public static ResourceKey 
        ShowSoundsKey: 
        { 
            get:function()
            { 
                if (_cacheShowSounds == null)
                {
                    _cacheShowSounds = CreateInstance(SystemResourceKeyID.ShowSounds);
                } 

                return _cacheShowSounds; 
            } 
        },
 
        /// <summary>
        ///     IsSlowMachine System Resource Key
        /// </summary>
//        public static ResourceKey 
        IsSlowMachineKey: 
        {
            get:function() 
            { 
                if (_cacheIsSlowMachine == null)
                { 
                    _cacheIsSlowMachine = CreateInstance(SystemResourceKeyID.IsSlowMachine);
                }

                return _cacheIsSlowMachine; 
            }
        }, 
 
        /// <summary>
        ///     SwapButtons System Resource Key 
        /// </summary>
//        public static ResourceKey 
        SwapButtonsKey:
        {
            get:function() 
            {
                if (_cacheSwapButtons == null) 
                { 
                    _cacheSwapButtons = CreateInstance(SystemResourceKeyID.SwapButtons);
                } 

                return _cacheSwapButtons;
            }
        }, 

        /// <summary> 
        ///     IsTabletPC System Resource Key 
        /// </summary>
//        public static ResourceKey 
        IsTabletPCKey: 
        {
            get:function()
            {
                if (_cacheIsTabletPC == null) 
                {
                    _cacheIsTabletPC = CreateInstance(SystemResourceKeyID.IsTabletPC); 
                } 

                return _cacheIsTabletPC; 
            }
        },

        /// <summary> 
        ///     VirtualScreenLeft System Resource Key
        /// </summary> 
//        public static ResourceKey 
        VirtualScreenLeftKey: 
        {
            get:function() 
            {
                if (_cacheVirtualScreenLeft == null)
                {
                    _cacheVirtualScreenLeft = CreateInstance(SystemResourceKeyID.VirtualScreenLeft); 
                }
 
                return _cacheVirtualScreenLeft; 
            }
        },

        /// <summary>
        ///     VirtualScreenTop System Resource Key
        /// </summary> 
//        public static ResourceKey 
        VirtualScreenTopKey:
        { 
            get:function() 
            {
                if (_cacheVirtualScreenTop == null) 
                {
                    _cacheVirtualScreenTop = CreateInstance(SystemResourceKeyID.VirtualScreenTop);
                }
 
                return _cacheVirtualScreenTop;
            } 
        }, 

        /// <summary> 
        ///     Resource Key for the FocusVisualStyle
        /// </summary> 
//        public static ResourceKey 
        FocusVisualStyleKey: 
        {
            get:function() 
            {
                if (_cacheFocusVisualStyle == null)
                {
                    _cacheFocusVisualStyle = new SystemThemeKey(SystemResourceKeyID.FocusVisualStyle); 
                }
 
                return _cacheFocusVisualStyle; 
            }
        }, 

        /// <summary>
        /// Resource Key for the browser window style
        /// </summary> 
        /// <value></value>
//        public static ResourceKey 
        NavigationChromeStyleKey: 
        { 
            get:function()
            { 
                if (_cacheNavigationChromeStyle == null)
                {
                    _cacheNavigationChromeStyle = new SystemThemeKey(SystemResourceKeyID.NavigationChromeStyle);
                } 

                return _cacheNavigationChromeStyle; 
            } 
        },
 
        /// <summary>
        /// Resource Key for the down level browser window style
        /// </summary>
        /// <value></value> 
//        public static ResourceKey 
        NavigationChromeDownLevelStyleKey:
        { 
            get:function() 
            {
                if (_cacheNavigationChromeDownLevelStyle == null) 
                {
                    _cacheNavigationChromeDownLevelStyle = new SystemThemeKey(SystemResourceKeyID.NavigationChromeDownLevelStyle);
                }
 
                return _cacheNavigationChromeDownLevelStyle;
            } 
        },
        
        /// <summary>
        ///     Indicates current Power Status 
        /// </summary> 
        ///<SecurityNote>
        /// Critical as this code elevates. 
        /// PublicOK - as we think this is ok to expose.
        ///</SecurityNote>
//        public static PowerLineStatus 
        PowerLineStatus:
        { 
            get:function() 
            { 
                return _powerLineStatus; 
            }
        }, 
        /// <summary> 
        /// Resource Key for the PowerLineStatus property
        /// </summary> 
        /// <value></value> 
//        public static ResourceKey 
        PowerLineStatusKey:
        { 
            get:function()
            {
                if (_cachePowerLineStatus == null)
                { 
                    _cachePowerLineStatus = CreateInstance(SystemResourceKeyID.PowerLineStatus);
                } 
 
                return _cachePowerLineStatus;
            } 
        },
        
        /// <summary> 
        ///     Whether DWM composition is turned on.
        ///     May change when WM.DWMNCRENDERINGCHANGED or WM.DWMCOMPOSITIONCHANGED is received. 
        ///
        ///     It turns out there may be some lag between someone asking this
        ///     and the window getting updated.  It's not too expensive, just always do the check
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation. 
        /// </SecurityNote> 
//        public static bool 
        IsGlassEnabled:
        { 
        	get:function()
            {
                return _isGlassEnabled; 
            }
        }, 
 
        /// <summary>
        ///     The current Windows system theme's name. 
        /// </summary>
        /// <SecurityNote>
        ///  Critical as this code does an elevation.
        /// </SecurityNote> 
//        public static string 
        UxThemeName: 
        {
        	get:function()
        	{
                return _uxThemeName; 
            }
        }, 

        /// <summary>
        ///     The current Windows system theme's color.
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation. 
        /// </SecurityNote> 
//        public static string 
        UxThemeColor:
        {	get:function()
        	{
                return _uxThemeColor;
            }
        },
 
        /// <summary>
        ///     The radius of window corners isn't exposed as a true system parameter. 
        ///     It instead is a logical size that we're approximating based on the current theme. 
        ///     There aren't any known variations based on theme color.
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation.
        /// </SecurityNote>
//        public static CornerRadius 
        WindowCornerRadius: 
        {
        	get:function() 
            {
                return _windowCornerRadius;
            }
        },
 
        /// <summary>
        ///     Color representing the DWM glass for windows in the Aero theme. 
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation. 
        /// </SecurityNote>
//        public static Color 
        WindowGlassColor:
        {
        	get:function()
            { 
                return _windowGlassColor;
            } 
        },
 
        /// <summary> 
        ///     Brush representing the DWM glass for windows in the Aero theme.
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation.
        /// </SecurityNote>
//        public static Brush 
        WindowGlassBrush: 
        {
        	get:function() 
            {
                return _windowGlassBrush;
            } 
        },
 
        /// <summary> 
        ///     Standard thickness of the resize border of a window.
        /// </summary> 
        /// <SecurityNote>
        ///  Critical as this code does an elevation.
        /// </SecurityNote>
//        public static Thickness 
        WindowResizeBorderThickness: 
        {
        	get:function() 
            {
                return _windowResizeBorderThickness; 
            }
        }, 
 
        /// <summary>
        ///     Standard thickness of the non-client frame around a window. 
        /// </summary>
        /// <SecurityNote>
        ///  Critical as this code does an elevation.
        /// </SecurityNote> 
//        public static Thickness 
        WindowNonClientFrameThickness:
        { 
        	get:function()
            { 
                return _windowNonClientFrameThickness; 
            } 
        },
 
//        internal static int 
        Dpi:
        {
        	get:function()
            { 
                return MS.Internal.FontCache.Util.Dpi;
            } 
        }, 

        ///<SecurityNote> 
        ///  Critical as this accesses Native methods.
        ///  TreatAsSafe - it would be ok to expose this information - DPI in partial trust
        ///</SecurityNote>
//        internal static int 
        DpiX: 
        
        {
        	get:function() 
            {
                return _dpiX;
            } 
        }
	});
	
//    private static SystemResourceKey 
	function CreateInstance(/*SystemResourceKeyID*/ KeyId)
    { 
        return new SystemResourceKey(KeyId);
    }
	
//    internal static double 
	SystemParameters.ConvertPixel = function(/*int*/ pixel) 
    {
        var dpi = Dpi; 

        if (dpi != 0)
        { 
            return pixel * 96 / dpi;
        }

        return pixel; 
    };
	
	SystemParameters.Type = new Type("SystemParameters", SystemParameters, [Object.Type]);
	return SystemParameters;
});

 




