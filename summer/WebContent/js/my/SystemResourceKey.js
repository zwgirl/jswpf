    internal class SystemResourceKey : ResourceKey 
    {
        //
        // This is the enum range representing the original SystemResource[Key]s. 
        //
        private const short SystemResourceKeyIDStart = SystemResourceKeyID.InternalSystemColorsStart; 
        private const short SystemResourceKeyIDEnd = SystemResourceKeyID.InternalSystemThemeStylesEnd; 

        // 
        // This is the enum range representing the extended SystemResource[Key]s.
        //
        private const short SystemResourceKeyIDExtendedStart = SystemResourceKeyID.InternalSystemColorsExtendedStart;
        private const short SystemResourceKeyIDExtendedEnd = SystemResourceKeyID.InternalSystemColorsExtendedEnd; 

        // 
        // This is the BAML id range representing the original SystemResourceKeys. 
        //
        private const short SystemResourceKeyBAMLIDStart = SystemResourceKeyIDStart; 
        private const short SystemResourceKeyBAMLIDEnd = SystemResourceKeyIDEnd;

        //
        // This is the BAML id range representing the original SystemResources. 
        //
        private const short SystemResourceBAMLIDStart = SystemResourceKeyBAMLIDEnd; 
        private const short SystemResourceBAMLIDEnd = (SystemResourceBAMLIDStart + (SystemResourceKeyBAMLIDEnd - SystemResourceKeyBAMLIDStart)); 

        // 
        // This is the BAML id range representing the extended SystemResourceKeys.
        //
        private const short SystemResourceKeyBAMLIDExtendedStart = SystemResourceBAMLIDEnd;
        private const short SystemResourceKeyBAMLIDExtendedEnd = (SystemResourceKeyBAMLIDExtendedStart + (SystemResourceKeyIDExtendedEnd - SystemResourceKeyIDExtendedStart)); 

        // 
        // This is the BAML id range representing the extended SystemResources. 
        //
        private const short SystemResourceBAMLIDExtendedStart = SystemResourceKeyBAMLIDExtendedEnd; 
        private const short SystemResourceBAMLIDExtendedEnd = (SystemResourceBAMLIDExtendedStart + (SystemResourceKeyBAMLIDExtendedEnd - SystemResourceKeyBAMLIDExtendedStart));

        internal static short GetSystemResourceKeyIdFromBamlId(short bamlId, out bool isKey) 
        {
            isKey = true; 
 
            if (bamlId > SystemResourceBAMLIDStart && bamlId < SystemResourceBAMLIDEnd)
            { 
                // Not extended and not a key
                bamlId -= SystemResourceBAMLIDStart;
                isKey = false;
            } 
            else if (bamlId > SystemResourceKeyBAMLIDExtendedStart && bamlId < SystemResourceKeyBAMLIDExtendedEnd)
            { 
                // Extended Key 
                bamlId -= (SystemResourceKeyBAMLIDExtendedStart - SystemResourceKeyIDExtendedStart);
            } 
            else if (bamlId > SystemResourceBAMLIDExtendedStart && bamlId < SystemResourceBAMLIDExtendedEnd)
            {
                // Extended but not a key
                bamlId -= (SystemResourceBAMLIDExtendedStart - SystemResourceKeyIDExtendedStart); 
                isKey = false;
            } 
 
            return bamlId;
        } 

        internal static short GetBamlIdBasedOnSystemResourceKeyId(Type targetType, string memberName)
        { 
            short memberId = 0;
            string srkField = null; 
            bool isKey = false; 
            bool found = true;
 
            // Initialization needed to keep compiler happy!
            SystemResourceKeyID srkId = SystemResourceKeyID.InternalSystemColorsStart;

            if (memberName.EndsWith("Key", false, TypeConverterHelper.InvariantEnglishUS)) 
            {
                srkField = memberName.Remove(memberName.Length - 3); 
 
                if ((KnownTypes.Types[(int)KnownElements.MenuItem] == targetType) ||
                    (KnownTypes.Types[(int)KnownElements.ToolBar] == targetType) || 
                    (KnownTypes.Types[(int)KnownElements.StatusBar] == targetType))
                {
                    srkField = targetType.Name + srkField;
                } 

                isKey = true; 
            } 
            else
            { 
                srkField = memberName;
            }

            try 
            {
                srkId = (SystemResourceKeyID)Enum.Parse(typeof(SystemResourceKeyID), srkField); 
            } 
            catch (ArgumentException)
            { 
                found = false;
            }

            if (found) 
            {
                bool isExtended = (srkId > SystemResourceKeyIDExtendedStart && 
                                   srkId < SystemResourceKeyIDExtendedEnd); 

                if (isExtended) 
                {
                    if (isKey)
                    {
                        // if keyId is more than the range it is the actual resource, else it is the key. 
                        memberId = (-(srkId - SystemResourceKeyIDExtendedStart + SystemResourceKeyBAMLIDExtendedStart));
                    } 
                    else 
                    {
                        memberId = (-(srkId - SystemResourceKeyIDExtendedStart + SystemResourceBAMLIDExtendedStart)); 
                    }
                }
                else
                { 
                    if (isKey)
                    { 
                        // if keyId is more than the range it is the actual resource, else it is the key. 
                        memberId = (-(srkId));
                    } 
                    else
                    {
                        memberId = (-(srkId + SystemResourceBAMLIDStart));
                    } 
                }
            } 
 
            return memberId;
        } 

        internal object Resource
        { 
            get
            { 
                // ************************************************************************************* 
                // IMPORTANT NOTE: If an entry is added to this property, a corresponding one needs to
                // be added to the method GetResourceKey below as well 
                // *************************************************************************************
                // FxCop: FxCop may complain that this method is too long.
                //        A hashtable would be overkill, which is the reason for using a switch.
 
                switch (_id)
                { 
                    case SystemResourceKeyID.ActiveBorderBrush: 
                        return SystemColors.ActiveBorderBrush;
 
                    case SystemResourceKeyID.ActiveCaptionBrush:
                        return SystemColors.ActiveCaptionBrush;

                    case SystemResourceKeyID.ActiveCaptionTextBrush: 
                        return SystemColors.ActiveCaptionTextBrush;
 
                    case SystemResourceKeyID.AppWorkspaceBrush: 
                        return SystemColors.AppWorkspaceBrush;
 
                    case SystemResourceKeyID.ControlBrush:
                        return SystemColors.ControlBrush;

                    case SystemResourceKeyID.ControlDarkBrush: 
                        return SystemColors.ControlDarkBrush;
 
                    case SystemResourceKeyID.ControlDarkDarkBrush: 
                        return SystemColors.ControlDarkDarkBrush;
 
                    case SystemResourceKeyID.ControlLightBrush:
                        return SystemColors.ControlLightBrush;

                    case SystemResourceKeyID.ControlLightLightBrush: 
                        return SystemColors.ControlLightLightBrush;
 
                    case SystemResourceKeyID.ControlTextBrush: 
                        return SystemColors.ControlTextBrush;
 
                    case SystemResourceKeyID.DesktopBrush:
                        return SystemColors.DesktopBrush;

                    case SystemResourceKeyID.GradientActiveCaptionBrush: 
                        return SystemColors.GradientActiveCaptionBrush;
 
                    case SystemResourceKeyID.GradientInactiveCaptionBrush: 
                        return SystemColors.GradientInactiveCaptionBrush;
 
                    case SystemResourceKeyID.GrayTextBrush:
                        return SystemColors.GrayTextBrush;

                    case SystemResourceKeyID.HighlightBrush: 
                        return SystemColors.HighlightBrush;
 
                    case SystemResourceKeyID.HighlightTextBrush: 
                        return SystemColors.HighlightTextBrush;
 
                    case SystemResourceKeyID.HotTrackBrush:
                        return SystemColors.HotTrackBrush;

                    case SystemResourceKeyID.InactiveBorderBrush: 
                        return SystemColors.InactiveBorderBrush;
 
                    case SystemResourceKeyID.InactiveCaptionBrush: 
                        return SystemColors.InactiveCaptionBrush;
 
                    case SystemResourceKeyID.InactiveCaptionTextBrush:
                        return SystemColors.InactiveCaptionTextBrush;

                    case SystemResourceKeyID.InfoBrush: 
                        return SystemColors.InfoBrush;
 
                    case SystemResourceKeyID.InfoTextBrush: 
                        return SystemColors.InfoTextBrush;
 
                    case SystemResourceKeyID.MenuBrush:
                        return SystemColors.MenuBrush;

                    case SystemResourceKeyID.MenuBarBrush: 
                        return SystemColors.MenuBarBrush;
 
                    case SystemResourceKeyID.MenuHighlightBrush: 
                        return SystemColors.MenuHighlightBrush;
 
                    case SystemResourceKeyID.MenuTextBrush:
                        return SystemColors.MenuTextBrush;

                    case SystemResourceKeyID.ScrollBarBrush: 
                        return SystemColors.ScrollBarBrush;
 
                    case SystemResourceKeyID.WindowBrush: 
                        return SystemColors.WindowBrush;
 
                    case SystemResourceKeyID.WindowFrameBrush:
                        return SystemColors.WindowFrameBrush;

                    case SystemResourceKeyID.WindowTextBrush: 
                        return SystemColors.WindowTextBrush;
 
                    case SystemResourceKeyID.InactiveSelectionHighlightBrush: 
                        return SystemColors.InactiveSelectionHighlightBrush;
 
                    case SystemResourceKeyID.InactiveSelectionHighlightTextBrush:
                        return SystemColors.InactiveSelectionHighlightTextBrush;

                    case SystemResourceKeyID.ActiveBorderColor: 
                        return SystemColors.ActiveBorderColor;
 
                    case SystemResourceKeyID.ActiveCaptionColor: 
                        return SystemColors.ActiveCaptionColor;
 
                    case SystemResourceKeyID.ActiveCaptionTextColor:
                        return SystemColors.ActiveCaptionTextColor;

                    case SystemResourceKeyID.AppWorkspaceColor: 
                        return SystemColors.AppWorkspaceColor;
 
                    case SystemResourceKeyID.ControlColor: 
                        return SystemColors.ControlColor;
 
                    case SystemResourceKeyID.ControlDarkColor:
                        return SystemColors.ControlDarkColor;

                    case SystemResourceKeyID.ControlDarkDarkColor: 
                        return SystemColors.ControlDarkDarkColor;
 
                    case SystemResourceKeyID.ControlLightColor: 
                        return SystemColors.ControlLightColor;
 
                    case SystemResourceKeyID.ControlLightLightColor:
                        return SystemColors.ControlLightLightColor;

                    case SystemResourceKeyID.ControlTextColor: 
                        return SystemColors.ControlTextColor;
 
                    case SystemResourceKeyID.DesktopColor: 
                        return SystemColors.DesktopColor;
 
                    case SystemResourceKeyID.GradientActiveCaptionColor:
                        return SystemColors.GradientActiveCaptionColor;

                    case SystemResourceKeyID.GradientInactiveCaptionColor: 
                        return SystemColors.GradientInactiveCaptionColor;
 
                    case SystemResourceKeyID.GrayTextColor: 
                        return SystemColors.GrayTextColor;
 
                    case SystemResourceKeyID.HighlightColor:
                        return SystemColors.HighlightColor;

                    case SystemResourceKeyID.HighlightTextColor: 
                        return SystemColors.HighlightTextColor;
 
                    case SystemResourceKeyID.HotTrackColor: 
                        return SystemColors.HotTrackColor;
 
                    case SystemResourceKeyID.InactiveBorderColor:
                        return SystemColors.InactiveBorderColor;

                    case SystemResourceKeyID.InactiveCaptionColor: 
                        return SystemColors.InactiveCaptionColor;
 
                    case SystemResourceKeyID.InactiveCaptionTextColor: 
                        return SystemColors.InactiveCaptionTextColor;
 
                    case SystemResourceKeyID.InfoColor:
                        return SystemColors.InfoColor;

                    case SystemResourceKeyID.InfoTextColor: 
                        return SystemColors.InfoTextColor;
 
                    case SystemResourceKeyID.MenuColor: 
                        return SystemColors.MenuColor;
 
                    case SystemResourceKeyID.MenuBarColor:
                        return SystemColors.MenuBarColor;

                    case SystemResourceKeyID.MenuHighlightColor: 
                        return SystemColors.MenuHighlightColor;
 
                    case SystemResourceKeyID.MenuTextColor: 
                        return SystemColors.MenuTextColor;
 
                    case SystemResourceKeyID.ScrollBarColor:
                        return SystemColors.ScrollBarColor;

                    case SystemResourceKeyID.WindowColor: 
                        return SystemColors.WindowColor;
 
                    case SystemResourceKeyID.WindowFrameColor: 
                        return SystemColors.WindowFrameColor;
 
                    case SystemResourceKeyID.WindowTextColor:
                        return SystemColors.WindowTextColor;

                    case SystemResourceKeyID.ThinHorizontalBorderHeight: 
                        return SystemParameters.ThinHorizontalBorderHeight;
 
                    case SystemResourceKeyID.ThinVerticalBorderWidth: 
                        return SystemParameters.ThinVerticalBorderWidth;
 
                    case SystemResourceKeyID.CursorWidth:
                        return SystemParameters.CursorWidth;

                    case SystemResourceKeyID.CursorHeight: 
                        return SystemParameters.CursorHeight;
 
                    case SystemResourceKeyID.ThickHorizontalBorderHeight: 
                        return SystemParameters.ThickHorizontalBorderHeight;
 
                    case SystemResourceKeyID.ThickVerticalBorderWidth:
                        return SystemParameters.ThickVerticalBorderWidth;

                    case SystemResourceKeyID.FixedFrameHorizontalBorderHeight: 
                        return SystemParameters.FixedFrameHorizontalBorderHeight;
 
                    case SystemResourceKeyID.FixedFrameVerticalBorderWidth: 
                        return SystemParameters.FixedFrameVerticalBorderWidth;
 
                    case SystemResourceKeyID.FocusHorizontalBorderHeight:
                        return SystemParameters.FocusHorizontalBorderHeight;

                    case SystemResourceKeyID.FocusVerticalBorderWidth: 
                        return SystemParameters.FocusVerticalBorderWidth;
 
                    case SystemResourceKeyID.FullPrimaryScreenWidth: 
                        return SystemParameters.FullPrimaryScreenWidth;
 
                    case SystemResourceKeyID.FullPrimaryScreenHeight:
                        return SystemParameters.FullPrimaryScreenHeight;

                    case SystemResourceKeyID.HorizontalScrollBarButtonWidth: 
                        return SystemParameters.HorizontalScrollBarButtonWidth;
 
                    case SystemResourceKeyID.HorizontalScrollBarHeight: 
                        return SystemParameters.HorizontalScrollBarHeight;
 
                    case SystemResourceKeyID.HorizontalScrollBarThumbWidth:
                        return SystemParameters.HorizontalScrollBarThumbWidth;

                    case SystemResourceKeyID.IconWidth: 
                        return SystemParameters.IconWidth;
 
                    case SystemResourceKeyID.IconHeight: 
                        return SystemParameters.IconHeight;
 
                    case SystemResourceKeyID.IconGridWidth:
                        return SystemParameters.IconGridWidth;

                    case SystemResourceKeyID.IconGridHeight: 
                        return SystemParameters.IconGridHeight;
 
                    case SystemResourceKeyID.MaximizedPrimaryScreenWidth: 
                        return SystemParameters.MaximizedPrimaryScreenWidth;
 
                    case SystemResourceKeyID.MaximizedPrimaryScreenHeight:
                        return SystemParameters.MaximizedPrimaryScreenHeight;

                    case SystemResourceKeyID.MaximumWindowTrackWidth: 
                        return SystemParameters.MaximumWindowTrackWidth;
 
                    case SystemResourceKeyID.MaximumWindowTrackHeight: 
                        return SystemParameters.MaximumWindowTrackHeight;
 
                    case SystemResourceKeyID.MenuCheckmarkWidth:
                        return SystemParameters.MenuCheckmarkWidth;

                    case SystemResourceKeyID.MenuCheckmarkHeight: 
                        return SystemParameters.MenuCheckmarkHeight;
 
                    case SystemResourceKeyID.MenuButtonWidth: 
                        return SystemParameters.MenuButtonWidth;
 
                    case SystemResourceKeyID.MenuButtonHeight:
                        return SystemParameters.MenuButtonHeight;

                    case SystemResourceKeyID.MinimumWindowWidth: 
                        return SystemParameters.MinimumWindowWidth;
 
                    case SystemResourceKeyID.MinimumWindowHeight: 
                        return SystemParameters.MinimumWindowHeight;
 
                    case SystemResourceKeyID.MinimizedWindowWidth:
                        return SystemParameters.MinimizedWindowWidth;

                    case SystemResourceKeyID.MinimizedWindowHeight: 
                        return SystemParameters.MinimizedWindowHeight;
 
                    case SystemResourceKeyID.MinimizedGridWidth: 
                        return SystemParameters.MinimizedGridWidth;
 
                    case SystemResourceKeyID.MinimizedGridHeight:
                        return SystemParameters.MinimizedGridHeight;

                    case SystemResourceKeyID.MinimumWindowTrackWidth: 
                        return SystemParameters.MinimumWindowTrackWidth;
 
                    case SystemResourceKeyID.MinimumWindowTrackHeight: 
                        return SystemParameters.MinimumWindowTrackHeight;
 
                    case SystemResourceKeyID.PrimaryScreenWidth:
                        return SystemParameters.PrimaryScreenWidth;

                    case SystemResourceKeyID.PrimaryScreenHeight: 
                        return SystemParameters.PrimaryScreenHeight;
 
                    case SystemResourceKeyID.WindowCaptionButtonWidth: 
                        return SystemParameters.WindowCaptionButtonWidth;
 
                    case SystemResourceKeyID.WindowCaptionButtonHeight:
                        return SystemParameters.WindowCaptionButtonHeight;

                    case SystemResourceKeyID.ResizeFrameHorizontalBorderHeight: 
                        return SystemParameters.ResizeFrameHorizontalBorderHeight;
 
                    case SystemResourceKeyID.ResizeFrameVerticalBorderWidth: 
                        return SystemParameters.ResizeFrameVerticalBorderWidth;
 
                    case SystemResourceKeyID.SmallIconWidth:
                        return SystemParameters.SmallIconWidth;

                    case SystemResourceKeyID.SmallIconHeight: 
                        return SystemParameters.SmallIconHeight;
 
                    case SystemResourceKeyID.SmallWindowCaptionButtonWidth: 
                        return SystemParameters.SmallWindowCaptionButtonWidth;
 
                    case SystemResourceKeyID.SmallWindowCaptionButtonHeight:
                        return SystemParameters.SmallWindowCaptionButtonHeight;

                    case SystemResourceKeyID.VirtualScreenWidth: 
                        return SystemParameters.VirtualScreenWidth;
 
                    case SystemResourceKeyID.VirtualScreenHeight: 
                        return SystemParameters.VirtualScreenHeight;
 
                    case SystemResourceKeyID.VerticalScrollBarWidth:
                        return SystemParameters.VerticalScrollBarWidth;

                    case SystemResourceKeyID.VerticalScrollBarButtonHeight: 
                        return SystemParameters.VerticalScrollBarButtonHeight;
 
                    case SystemResourceKeyID.WindowCaptionHeight: 
                        return SystemParameters.WindowCaptionHeight;
 
                    case SystemResourceKeyID.KanjiWindowHeight:
                        return SystemParameters.KanjiWindowHeight;

                    case SystemResourceKeyID.MenuBarHeight: 
                        return SystemParameters.MenuBarHeight;
 
                    case SystemResourceKeyID.SmallCaptionHeight: 
                        return SystemParameters.SmallCaptionHeight;
 
                    case SystemResourceKeyID.VerticalScrollBarThumbHeight:
                        return SystemParameters.VerticalScrollBarThumbHeight;

                    case SystemResourceKeyID.IsImmEnabled: 
                        return BooleanBoxes.Box(SystemParameters.IsImmEnabled);
 
                    case SystemResourceKeyID.IsMediaCenter: 
                        return BooleanBoxes.Box(SystemParameters.IsMediaCenter);
 
                    case SystemResourceKeyID.IsMenuDropRightAligned:
                        return BooleanBoxes.Box(SystemParameters.IsMenuDropRightAligned);

                    case SystemResourceKeyID.IsMiddleEastEnabled: 
                        return BooleanBoxes.Box(SystemParameters.IsMiddleEastEnabled);
 
                    case SystemResourceKeyID.IsMousePresent: 
                        return BooleanBoxes.Box(SystemParameters.IsMousePresent);
 
                    case SystemResourceKeyID.IsMouseWheelPresent:
                        return BooleanBoxes.Box(SystemParameters.IsMouseWheelPresent);

                    case SystemResourceKeyID.IsPenWindows: 
                        return BooleanBoxes.Box(SystemParameters.IsPenWindows);
 
                    case SystemResourceKeyID.IsRemotelyControlled: 
                        return BooleanBoxes.Box(SystemParameters.IsRemotelyControlled);
 
                    case SystemResourceKeyID.IsRemoteSession:
                        return BooleanBoxes.Box(SystemParameters.IsRemoteSession);

                    case SystemResourceKeyID.ShowSounds: 
                        return BooleanBoxes.Box(SystemParameters.ShowSounds);
 
                    case SystemResourceKeyID.IsSlowMachine: 
                        return BooleanBoxes.Box(SystemParameters.IsSlowMachine);
 
                    case SystemResourceKeyID.SwapButtons:
                        return BooleanBoxes.Box(SystemParameters.SwapButtons);

                    case SystemResourceKeyID.IsTabletPC: 
                        return BooleanBoxes.Box(SystemParameters.IsTabletPC);
 
                    case SystemResourceKeyID.VirtualScreenLeft: 
                        return SystemParameters.VirtualScreenLeft;
 
                    case SystemResourceKeyID.VirtualScreenTop:
                        return SystemParameters.VirtualScreenTop;

                    case SystemResourceKeyID.FocusBorderWidth: 
                        return SystemParameters.FocusBorderWidth;
 
                    case SystemResourceKeyID.FocusBorderHeight: 
                        return SystemParameters.FocusBorderHeight;
 
                    case SystemResourceKeyID.HighContrast:
                        return BooleanBoxes.Box(SystemParameters.HighContrast);

                    case SystemResourceKeyID.DropShadow: 
                        return BooleanBoxes.Box(SystemParameters.DropShadow);
 
                    case SystemResourceKeyID.FlatMenu: 
                        return BooleanBoxes.Box(SystemParameters.FlatMenu);
 
                    case SystemResourceKeyID.WorkArea:
                        return SystemParameters.WorkArea;

                    case SystemResourceKeyID.IconHorizontalSpacing: 
                        return SystemParameters.IconHorizontalSpacing;
 
                    case SystemResourceKeyID.IconVerticalSpacing: 
                        return SystemParameters.IconVerticalSpacing;
 
                    case SystemResourceKeyID.IconTitleWrap:
                        return SystemParameters.IconTitleWrap;

                    case SystemResourceKeyID.IconFontSize: 
                        return SystemFonts.IconFontSize;
 
                    case SystemResourceKeyID.IconFontFamily: 
                        return SystemFonts.IconFontFamily;
 
                    case SystemResourceKeyID.IconFontStyle:
                        return SystemFonts.IconFontStyle;

                    case SystemResourceKeyID.IconFontWeight: 
                        return SystemFonts.IconFontWeight;
 
                    case SystemResourceKeyID.IconFontTextDecorations: 
                        return SystemFonts.IconFontTextDecorations;
 
                    case SystemResourceKeyID.KeyboardCues:
                        return BooleanBoxes.Box(SystemParameters.KeyboardCues);

                    case SystemResourceKeyID.KeyboardDelay: 
                        return SystemParameters.KeyboardDelay;
 
                    case SystemResourceKeyID.KeyboardPreference: 
                        return BooleanBoxes.Box(SystemParameters.KeyboardPreference);
 
                    case SystemResourceKeyID.KeyboardSpeed:
                        return SystemParameters.KeyboardSpeed;

                    case SystemResourceKeyID.SnapToDefaultButton: 
                        return BooleanBoxes.Box(SystemParameters.SnapToDefaultButton);
 
                    case SystemResourceKeyID.WheelScrollLines: 
                        return SystemParameters.WheelScrollLines;
 
                    case SystemResourceKeyID.MouseHoverTime:
                        return SystemParameters.MouseHoverTime;

                    case SystemResourceKeyID.MouseHoverHeight: 
                        return SystemParameters.MouseHoverHeight;
 
                    case SystemResourceKeyID.MouseHoverWidth: 
                        return SystemParameters.MouseHoverWidth;
 
                    case SystemResourceKeyID.MenuDropAlignment:
                        return BooleanBoxes.Box(SystemParameters.MenuDropAlignment);

                    case SystemResourceKeyID.MenuFade: 
                        return BooleanBoxes.Box(SystemParameters.MenuFade);
 
                    case SystemResourceKeyID.MenuShowDelay: 
                        return SystemParameters.MenuShowDelay;
 
                    case SystemResourceKeyID.ComboBoxAnimation:
                        return BooleanBoxes.Box(SystemParameters.ComboBoxAnimation);

                    case SystemResourceKeyID.ClientAreaAnimation: 
                        return BooleanBoxes.Box(SystemParameters.ClientAreaAnimation);
 
                    case SystemResourceKeyID.CursorShadow: 
                        return BooleanBoxes.Box(SystemParameters.CursorShadow);
 
                    case SystemResourceKeyID.GradientCaptions:
                        return BooleanBoxes.Box(SystemParameters.GradientCaptions);

                    case SystemResourceKeyID.HotTracking: 
                        return BooleanBoxes.Box(SystemParameters.HotTracking);
 
                    case SystemResourceKeyID.ListBoxSmoothScrolling: 
                        return BooleanBoxes.Box(SystemParameters.ListBoxSmoothScrolling);
 
                    case SystemResourceKeyID.MenuAnimation:
                        return BooleanBoxes.Box(SystemParameters.MenuAnimation);

                    case SystemResourceKeyID.SelectionFade: 
                        return BooleanBoxes.Box(SystemParameters.SelectionFade);
 
                    case SystemResourceKeyID.StylusHotTracking: 
                        return BooleanBoxes.Box(SystemParameters.StylusHotTracking);
 
                    case SystemResourceKeyID.ToolTipAnimation:
                        return BooleanBoxes.Box(SystemParameters.ToolTipAnimation);

                    case SystemResourceKeyID.ToolTipFade: 
                        return BooleanBoxes.Box(SystemParameters.ToolTipFade);
 
                    case SystemResourceKeyID.UIEffects: 
                        return BooleanBoxes.Box(SystemParameters.UIEffects);
 
                    case SystemResourceKeyID.MinimizeAnimation:
                        return BooleanBoxes.Box(SystemParameters.MinimizeAnimation);

                    case SystemResourceKeyID.Border: 
                        return SystemParameters.Border;
 
                    case SystemResourceKeyID.CaretWidth: 
                        return SystemParameters.CaretWidth;
 
                    case SystemResourceKeyID.ForegroundFlashCount:
                        return SystemParameters.ForegroundFlashCount;

                    case SystemResourceKeyID.DragFullWindows: 
                        return BooleanBoxes.Box(SystemParameters.DragFullWindows);
 
                    case SystemResourceKeyID.BorderWidth: 
                        return SystemParameters.BorderWidth;
 
                    case SystemResourceKeyID.ScrollWidth:
                        return SystemParameters.ScrollWidth;

                    case SystemResourceKeyID.ScrollHeight: 
                        return SystemParameters.ScrollHeight;
 
                    case SystemResourceKeyID.CaptionWidth: 
                        return SystemParameters.CaptionWidth;
 
                    case SystemResourceKeyID.CaptionHeight:
                        return SystemParameters.CaptionHeight;

                    case SystemResourceKeyID.SmallCaptionWidth: 
                        return SystemParameters.SmallCaptionWidth;
 
                    case SystemResourceKeyID.MenuWidth: 
                        return SystemParameters.MenuWidth;
 
                    case SystemResourceKeyID.MenuHeight:
                        return SystemParameters.MenuHeight;

                    case SystemResourceKeyID.CaptionFontSize: 
                        return SystemFonts.CaptionFontSize;
 
                    case SystemResourceKeyID.CaptionFontFamily: 
                        return SystemFonts.CaptionFontFamily;
 
                    case SystemResourceKeyID.CaptionFontStyle:
                        return SystemFonts.CaptionFontStyle;

                    case SystemResourceKeyID.CaptionFontWeight: 
                        return SystemFonts.CaptionFontWeight;
 
                    case SystemResourceKeyID.CaptionFontTextDecorations: 
                        return SystemFonts.CaptionFontTextDecorations;
 
                    case SystemResourceKeyID.SmallCaptionFontSize:
                        return SystemFonts.SmallCaptionFontSize;

                    case SystemResourceKeyID.SmallCaptionFontFamily: 
                        return SystemFonts.SmallCaptionFontFamily;
 
                    case SystemResourceKeyID.SmallCaptionFontStyle: 
                        return SystemFonts.SmallCaptionFontStyle;
 
                    case SystemResourceKeyID.SmallCaptionFontWeight:
                        return SystemFonts.SmallCaptionFontWeight;

                    case SystemResourceKeyID.SmallCaptionFontTextDecorations: 
                        return SystemFonts.SmallCaptionFontTextDecorations;
 
                    case SystemResourceKeyID.MenuFontSize: 
                        return SystemFonts.MenuFontSize;
 
                    case SystemResourceKeyID.MenuFontFamily:
                        return SystemFonts.MenuFontFamily;

                    case SystemResourceKeyID.MenuFontStyle: 
                        return SystemFonts.MenuFontStyle;
 
                    case SystemResourceKeyID.MenuFontWeight: 
                        return SystemFonts.MenuFontWeight;
 
                    case SystemResourceKeyID.MenuFontTextDecorations:
                        return SystemFonts.MenuFontTextDecorations;

                    case SystemResourceKeyID.StatusFontSize: 
                        return SystemFonts.StatusFontSize;
 
                    case SystemResourceKeyID.StatusFontFamily: 
                        return SystemFonts.StatusFontFamily;
 
                    case SystemResourceKeyID.StatusFontStyle:
                        return SystemFonts.StatusFontStyle;

                    case SystemResourceKeyID.StatusFontWeight: 
                        return SystemFonts.StatusFontWeight;
 
                    case SystemResourceKeyID.StatusFontTextDecorations: 
                        return SystemFonts.StatusFontTextDecorations;
 
                    case SystemResourceKeyID.MessageFontSize:
                        return SystemFonts.MessageFontSize;

                    case SystemResourceKeyID.MessageFontFamily: 
                        return SystemFonts.MessageFontFamily;
 
                    case SystemResourceKeyID.MessageFontStyle: 
                        return SystemFonts.MessageFontStyle;
 
                    case SystemResourceKeyID.MessageFontWeight:
                        return SystemFonts.MessageFontWeight;

                    case SystemResourceKeyID.MessageFontTextDecorations: 
                        return SystemFonts.MessageFontTextDecorations;
 
                    case SystemResourceKeyID.ComboBoxPopupAnimation: 
                        return SystemParameters.ComboBoxPopupAnimation;
 
                    case SystemResourceKeyID.MenuPopupAnimation:
                        return SystemParameters.MenuPopupAnimation;

                    case SystemResourceKeyID.ToolTipPopupAnimation: 
                        return SystemParameters.ToolTipPopupAnimation;
 
                    case SystemResourceKeyID.PowerLineStatus: 
                        return SystemParameters.PowerLineStatus;
                } 

                return null;
            }
        } 

        internal static ResourceKey GetResourceKey(short id) 
        { 
            switch (id)
            { 
                case SystemResourceKeyID.ActiveBorderBrush:
                    return SystemColors.ActiveBorderBrushKey;

                case SystemResourceKeyID.ActiveCaptionBrush: 
                    return SystemColors.ActiveCaptionBrushKey;
 
                case SystemResourceKeyID.ActiveCaptionTextBrush: 
                    return SystemColors.ActiveCaptionTextBrushKey;
 
                case SystemResourceKeyID.AppWorkspaceBrush:
                    return SystemColors.AppWorkspaceBrushKey;

                case SystemResourceKeyID.ControlBrush: 
                    return SystemColors.ControlBrushKey;
 
                case SystemResourceKeyID.ControlDarkBrush: 
                    return SystemColors.ControlDarkBrushKey;
 
                case SystemResourceKeyID.ControlDarkDarkBrush:
                    return SystemColors.ControlDarkDarkBrushKey;

                case SystemResourceKeyID.ControlLightBrush: 
                    return SystemColors.ControlLightBrushKey;
 
                case SystemResourceKeyID.ControlLightLightBrush: 
                    return SystemColors.ControlLightLightBrushKey;
 
                case SystemResourceKeyID.ControlTextBrush:
                    return SystemColors.ControlTextBrushKey;

                case SystemResourceKeyID.DesktopBrush: 
                    return SystemColors.DesktopBrushKey;
 
                case SystemResourceKeyID.GradientActiveCaptionBrush: 
                    return SystemColors.GradientActiveCaptionBrushKey;
 
                case SystemResourceKeyID.GradientInactiveCaptionBrush:
                    return SystemColors.GradientInactiveCaptionBrushKey;

                case SystemResourceKeyID.GrayTextBrush: 
                    return SystemColors.GrayTextBrushKey;
 
                case SystemResourceKeyID.HighlightBrush: 
                    return SystemColors.HighlightBrushKey;
 
                case SystemResourceKeyID.HighlightTextBrush:
                    return SystemColors.HighlightTextBrushKey;

                case SystemResourceKeyID.HotTrackBrush: 
                    return SystemColors.HotTrackBrushKey;
 
                case SystemResourceKeyID.InactiveBorderBrush: 
                    return SystemColors.InactiveBorderBrushKey;
 
                case SystemResourceKeyID.InactiveCaptionBrush:
                    return SystemColors.InactiveCaptionBrushKey;

                case SystemResourceKeyID.InactiveCaptionTextBrush: 
                    return SystemColors.InactiveCaptionTextBrushKey;
 
                case SystemResourceKeyID.InfoBrush: 
                    return SystemColors.InfoBrushKey;
 
                case SystemResourceKeyID.InfoTextBrush:
                    return SystemColors.InfoTextBrushKey;

                case SystemResourceKeyID.MenuBrush: 
                    return SystemColors.MenuBrushKey;
 
                case SystemResourceKeyID.MenuBarBrush: 
                    return SystemColors.MenuBarBrushKey;
 
                case SystemResourceKeyID.MenuHighlightBrush:
                    return SystemColors.MenuHighlightBrushKey;

                case SystemResourceKeyID.MenuTextBrush: 
                    return SystemColors.MenuTextBrushKey;
 
                case SystemResourceKeyID.ScrollBarBrush: 
                    return SystemColors.ScrollBarBrushKey;
 
                case SystemResourceKeyID.WindowBrush:
                    return SystemColors.WindowBrushKey;

                case SystemResourceKeyID.WindowFrameBrush: 
                    return SystemColors.WindowFrameBrushKey;
 
                case SystemResourceKeyID.WindowTextBrush: 
                    return SystemColors.WindowTextBrushKey;
 
                case SystemResourceKeyID.InactiveSelectionHighlightBrush:
                    return SystemColors.InactiveSelectionHighlightBrushKey;

                case SystemResourceKeyID.InactiveSelectionHighlightTextBrush: 
                    return SystemColors.InactiveSelectionHighlightTextBrushKey;
 
                case SystemResourceKeyID.ActiveBorderColor: 
                    return SystemColors.ActiveBorderColorKey;
 
                case SystemResourceKeyID.ActiveCaptionColor:
                    return SystemColors.ActiveCaptionColorKey;

                case SystemResourceKeyID.ActiveCaptionTextColor: 
                    return SystemColors.ActiveCaptionTextColorKey;
 
                case SystemResourceKeyID.AppWorkspaceColor: 
                    return SystemColors.AppWorkspaceColorKey;
 
                case SystemResourceKeyID.ControlColor:
                    return SystemColors.ControlColorKey;

                case SystemResourceKeyID.ControlDarkColor: 
                    return SystemColors.ControlDarkColorKey;
 
                case SystemResourceKeyID.ControlDarkDarkColor: 
                    return SystemColors.ControlDarkDarkColorKey;
 
                case SystemResourceKeyID.ControlLightColor:
                    return SystemColors.ControlLightColorKey;

                case SystemResourceKeyID.ControlLightLightColor: 
                    return SystemColors.ControlLightLightColorKey;
 
                case SystemResourceKeyID.ControlTextColor: 
                    return SystemColors.ControlTextColorKey;
 
                case SystemResourceKeyID.DesktopColor:
                    return SystemColors.DesktopColorKey;

                case SystemResourceKeyID.GradientActiveCaptionColor: 
                    return SystemColors.GradientActiveCaptionColorKey;
 
                case SystemResourceKeyID.GradientInactiveCaptionColor: 
                    return SystemColors.GradientInactiveCaptionColorKey;
 
                case SystemResourceKeyID.GrayTextColor:
                    return SystemColors.GrayTextColorKey;

                case SystemResourceKeyID.HighlightColor: 
                    return SystemColors.HighlightColorKey;
 
                case SystemResourceKeyID.HighlightTextColor: 
                    return SystemColors.HighlightTextColorKey;
 
                case SystemResourceKeyID.HotTrackColor:
                    return SystemColors.HotTrackColorKey;

                case SystemResourceKeyID.InactiveBorderColor: 
                    return SystemColors.InactiveBorderColorKey;
 
                case SystemResourceKeyID.InactiveCaptionColor: 
                    return SystemColors.InactiveCaptionColorKey;
 
                case SystemResourceKeyID.InactiveCaptionTextColor:
                    return SystemColors.InactiveCaptionTextColorKey;

                case SystemResourceKeyID.InfoColor: 
                    return SystemColors.InfoColorKey;
 
                case SystemResourceKeyID.InfoTextColor: 
                    return SystemColors.InfoTextColorKey;
 
                case SystemResourceKeyID.MenuColor:
                    return SystemColors.MenuColorKey;

                case SystemResourceKeyID.MenuBarColor: 
                    return SystemColors.MenuBarColorKey;
 
                case SystemResourceKeyID.MenuHighlightColor: 
                    return SystemColors.MenuHighlightColorKey;
 
                case SystemResourceKeyID.MenuTextColor:
                    return SystemColors.MenuTextColorKey;

                case SystemResourceKeyID.ScrollBarColor: 
                    return SystemColors.ScrollBarColorKey;
 
                case SystemResourceKeyID.WindowColor: 
                    return SystemColors.WindowColorKey;
 
                case SystemResourceKeyID.WindowFrameColor:
                    return SystemColors.WindowFrameColorKey;

                case SystemResourceKeyID.WindowTextColor: 
                    return SystemColors.WindowTextColorKey;
 
                case SystemResourceKeyID.ThinHorizontalBorderHeight: 
                    return SystemParameters.ThinHorizontalBorderHeightKey;
 
                case SystemResourceKeyID.ThinVerticalBorderWidth:
                    return SystemParameters.ThinVerticalBorderWidthKey;

                case SystemResourceKeyID.CursorWidth: 
                    return SystemParameters.CursorWidthKey;
 
                case SystemResourceKeyID.CursorHeight: 
                    return SystemParameters.CursorHeightKey;
 
                case SystemResourceKeyID.ThickHorizontalBorderHeight:
                    return SystemParameters.ThickHorizontalBorderHeightKey;

                case SystemResourceKeyID.ThickVerticalBorderWidth: 
                    return SystemParameters.ThickVerticalBorderWidthKey;
 
                case SystemResourceKeyID.FixedFrameHorizontalBorderHeight: 
                    return SystemParameters.FixedFrameHorizontalBorderHeightKey;
 
                case SystemResourceKeyID.FixedFrameVerticalBorderWidth:
                    return SystemParameters.FixedFrameVerticalBorderWidthKey;

                case SystemResourceKeyID.FocusHorizontalBorderHeight: 
                    return SystemParameters.FocusHorizontalBorderHeightKey;
 
                case SystemResourceKeyID.FocusVerticalBorderWidth: 
                    return SystemParameters.FocusVerticalBorderWidthKey;
 
                case SystemResourceKeyID.FullPrimaryScreenWidth:
                    return SystemParameters.FullPrimaryScreenWidthKey;

                case SystemResourceKeyID.FullPrimaryScreenHeight: 
                    return SystemParameters.FullPrimaryScreenHeightKey;
 
                case SystemResourceKeyID.HorizontalScrollBarButtonWidth: 
                    return SystemParameters.HorizontalScrollBarButtonWidthKey;
 
                case SystemResourceKeyID.HorizontalScrollBarHeight:
                    return SystemParameters.HorizontalScrollBarHeightKey;

                case SystemResourceKeyID.HorizontalScrollBarThumbWidth: 
                    return SystemParameters.HorizontalScrollBarThumbWidthKey;
 
                case SystemResourceKeyID.IconWidth: 
                    return SystemParameters.IconWidthKey;
 
                case SystemResourceKeyID.IconHeight:
                    return SystemParameters.IconHeightKey;

                case SystemResourceKeyID.IconGridWidth: 
                    return SystemParameters.IconGridWidthKey;
 
                case SystemResourceKeyID.IconGridHeight: 
                    return SystemParameters.IconGridHeightKey;
 
                case SystemResourceKeyID.MaximizedPrimaryScreenWidth:
                    return SystemParameters.MaximizedPrimaryScreenWidthKey;

                case SystemResourceKeyID.MaximizedPrimaryScreenHeight: 
                    return SystemParameters.MaximizedPrimaryScreenHeightKey;
 
                case SystemResourceKeyID.MaximumWindowTrackWidth: 
                    return SystemParameters.MaximumWindowTrackWidthKey;
 
                case SystemResourceKeyID.MaximumWindowTrackHeight:
                    return SystemParameters.MaximumWindowTrackHeightKey;

                case SystemResourceKeyID.MenuCheckmarkWidth: 
                    return SystemParameters.MenuCheckmarkWidthKey;
 
                case SystemResourceKeyID.MenuCheckmarkHeight: 
                    return SystemParameters.MenuCheckmarkHeightKey;
 
                case SystemResourceKeyID.MenuButtonWidth:
                    return SystemParameters.MenuButtonWidthKey;

                case SystemResourceKeyID.MenuButtonHeight: 
                    return SystemParameters.MenuButtonHeightKey;
 
                case SystemResourceKeyID.MinimumWindowWidth: 
                    return SystemParameters.MinimumWindowWidthKey;
 
                case SystemResourceKeyID.MinimumWindowHeight:
                    return SystemParameters.MinimumWindowHeightKey;

                case SystemResourceKeyID.MinimizedWindowWidth: 
                    return SystemParameters.MinimizedWindowWidthKey;
 
                case SystemResourceKeyID.MinimizedWindowHeight: 
                    return SystemParameters.MinimizedWindowHeightKey;
 
                case SystemResourceKeyID.MinimizedGridWidth:
                    return SystemParameters.MinimizedGridWidthKey;

                case SystemResourceKeyID.MinimizedGridHeight: 
                    return SystemParameters.MinimizedGridHeightKey;
 
                case SystemResourceKeyID.MinimumWindowTrackWidth: 
                    return SystemParameters.MinimumWindowTrackWidthKey;
 
                case SystemResourceKeyID.MinimumWindowTrackHeight:
                    return SystemParameters.MinimumWindowTrackHeightKey;

                case SystemResourceKeyID.PrimaryScreenWidth: 
                    return SystemParameters.PrimaryScreenWidthKey;
 
                case SystemResourceKeyID.PrimaryScreenHeight: 
                    return SystemParameters.PrimaryScreenHeightKey;
 
                case SystemResourceKeyID.WindowCaptionButtonWidth:
                    return SystemParameters.WindowCaptionButtonWidthKey;

                case SystemResourceKeyID.WindowCaptionButtonHeight: 
                    return SystemParameters.WindowCaptionButtonHeightKey;
 
                case SystemResourceKeyID.ResizeFrameHorizontalBorderHeight: 
                    return SystemParameters.ResizeFrameHorizontalBorderHeightKey;
 
                case SystemResourceKeyID.ResizeFrameVerticalBorderWidth:
                    return SystemParameters.ResizeFrameVerticalBorderWidthKey;

                case SystemResourceKeyID.SmallIconWidth: 
                    return SystemParameters.SmallIconWidthKey;
 
                case SystemResourceKeyID.SmallIconHeight: 
                    return SystemParameters.SmallIconHeightKey;
 
                case SystemResourceKeyID.SmallWindowCaptionButtonWidth:
                    return SystemParameters.SmallWindowCaptionButtonWidthKey;

                case SystemResourceKeyID.SmallWindowCaptionButtonHeight: 
                    return SystemParameters.SmallWindowCaptionButtonHeightKey;
 
                case SystemResourceKeyID.VirtualScreenWidth: 
                    return SystemParameters.VirtualScreenWidthKey;
 
                case SystemResourceKeyID.VirtualScreenHeight:
                    return SystemParameters.VirtualScreenHeightKey;

                case SystemResourceKeyID.VerticalScrollBarWidth: 
                    return SystemParameters.VerticalScrollBarWidthKey;
 
                case SystemResourceKeyID.VerticalScrollBarButtonHeight: 
                    return SystemParameters.VerticalScrollBarButtonHeightKey;
 
                case SystemResourceKeyID.WindowCaptionHeight:
                    return SystemParameters.WindowCaptionHeightKey;

                case SystemResourceKeyID.KanjiWindowHeight: 
                    return SystemParameters.KanjiWindowHeightKey;
 
                case SystemResourceKeyID.MenuBarHeight: 
                    return SystemParameters.MenuBarHeightKey;
 
                case SystemResourceKeyID.SmallCaptionHeight:
                    return SystemParameters.SmallCaptionHeightKey;

                case SystemResourceKeyID.VerticalScrollBarThumbHeight: 
                    return SystemParameters.VerticalScrollBarThumbHeightKey;
 
                case SystemResourceKeyID.IsImmEnabled: 
                    return SystemParameters.IsImmEnabledKey;
 
                case SystemResourceKeyID.IsMediaCenter:
                    return SystemParameters.IsMediaCenterKey;

                case SystemResourceKeyID.IsMenuDropRightAligned: 
                    return SystemParameters.IsMenuDropRightAlignedKey;
 
                case SystemResourceKeyID.IsMiddleEastEnabled: 
                    return SystemParameters.IsMiddleEastEnabledKey;
 
                case SystemResourceKeyID.IsMousePresent:
                    return SystemParameters.IsMousePresentKey;

                case SystemResourceKeyID.IsMouseWheelPresent: 
                    return SystemParameters.IsMouseWheelPresentKey;
 
                case SystemResourceKeyID.IsPenWindows: 
                    return SystemParameters.IsPenWindowsKey;
 
                case SystemResourceKeyID.IsRemotelyControlled:
                    return SystemParameters.IsRemotelyControlledKey;

                case SystemResourceKeyID.IsRemoteSession: 
                    return SystemParameters.IsRemoteSessionKey;
 
                case SystemResourceKeyID.ShowSounds: 
                    return SystemParameters.ShowSoundsKey;
 
                case SystemResourceKeyID.IsSlowMachine:
                    return SystemParameters.IsSlowMachineKey;

                case SystemResourceKeyID.SwapButtons: 
                    return SystemParameters.SwapButtonsKey;
 
                case SystemResourceKeyID.IsTabletPC: 
                    return SystemParameters.IsTabletPCKey;
 
                case SystemResourceKeyID.VirtualScreenLeft:
                    return SystemParameters.VirtualScreenLeftKey;

                case SystemResourceKeyID.VirtualScreenTop: 
                    return SystemParameters.VirtualScreenTopKey;
 
                case SystemResourceKeyID.FocusBorderWidth: 
                    return SystemParameters.FocusBorderWidthKey;
 
                case SystemResourceKeyID.FocusBorderHeight:
                    return SystemParameters.FocusBorderHeightKey;

                case SystemResourceKeyID.HighContrast: 
                    return SystemParameters.HighContrastKey;
 
                case SystemResourceKeyID.DropShadow: 
                    return SystemParameters.DropShadowKey;
 
                case SystemResourceKeyID.FlatMenu:
                    return SystemParameters.FlatMenuKey;

                case SystemResourceKeyID.WorkArea: 
                    return SystemParameters.WorkAreaKey;
 
                case SystemResourceKeyID.IconHorizontalSpacing: 
                    return SystemParameters.IconHorizontalSpacingKey;
 
                case SystemResourceKeyID.IconVerticalSpacing:
                    return SystemParameters.IconVerticalSpacingKey;

                case SystemResourceKeyID.IconTitleWrap: 
                    return SystemParameters.IconTitleWrapKey;
 
                case SystemResourceKeyID.IconFontSize: 
                    return SystemFonts.IconFontSizeKey;
 
                case SystemResourceKeyID.IconFontFamily:
                    return SystemFonts.IconFontFamilyKey;

                case SystemResourceKeyID.IconFontStyle: 
                    return SystemFonts.IconFontStyleKey;
 
                case SystemResourceKeyID.IconFontWeight: 
                    return SystemFonts.IconFontWeightKey;
 
                case SystemResourceKeyID.IconFontTextDecorations:
                    return SystemFonts.IconFontTextDecorationsKey;

                case SystemResourceKeyID.KeyboardCues: 
                    return SystemParameters.KeyboardCuesKey;
 
                case SystemResourceKeyID.KeyboardDelay: 
                    return SystemParameters.KeyboardDelayKey;
 
                case SystemResourceKeyID.KeyboardPreference:
                    return SystemParameters.KeyboardPreferenceKey;

                case SystemResourceKeyID.KeyboardSpeed: 
                    return SystemParameters.KeyboardSpeedKey;
 
                case SystemResourceKeyID.SnapToDefaultButton: 
                    return SystemParameters.SnapToDefaultButtonKey;
 
                case SystemResourceKeyID.WheelScrollLines:
                    return SystemParameters.WheelScrollLinesKey;

                case SystemResourceKeyID.MouseHoverTime: 
                    return SystemParameters.MouseHoverTimeKey;
 
                case SystemResourceKeyID.MouseHoverHeight: 
                    return SystemParameters.MouseHoverHeightKey;
 
                case SystemResourceKeyID.MouseHoverWidth:
                    return SystemParameters.MouseHoverWidthKey;

                case SystemResourceKeyID.MenuDropAlignment: 
                    return SystemParameters.MenuDropAlignmentKey;
 
                case SystemResourceKeyID.MenuFade: 
                    return SystemParameters.MenuFadeKey;
 
                case SystemResourceKeyID.MenuShowDelay:
                    return SystemParameters.MenuShowDelayKey;

                case SystemResourceKeyID.ComboBoxAnimation: 
                    return SystemParameters.ComboBoxAnimationKey;
 
                case SystemResourceKeyID.ClientAreaAnimation: 
                    return SystemParameters.ClientAreaAnimationKey;
 
                case SystemResourceKeyID.CursorShadow:
                    return SystemParameters.CursorShadowKey;

                case SystemResourceKeyID.GradientCaptions: 
                    return SystemParameters.GradientCaptionsKey;
 
                case SystemResourceKeyID.HotTracking: 
                    return SystemParameters.HotTrackingKey;
 
                case SystemResourceKeyID.ListBoxSmoothScrolling:
                    return SystemParameters.ListBoxSmoothScrollingKey;

                case SystemResourceKeyID.MenuAnimation: 
                    return SystemParameters.MenuAnimationKey;
 
                case SystemResourceKeyID.SelectionFade: 
                    return SystemParameters.SelectionFadeKey;
 
                case SystemResourceKeyID.StylusHotTracking:
                    return SystemParameters.StylusHotTrackingKey;

                case SystemResourceKeyID.ToolTipAnimation: 
                    return SystemParameters.ToolTipAnimationKey;
 
                case SystemResourceKeyID.ToolTipFade: 
                    return SystemParameters.ToolTipFadeKey;
 
                case SystemResourceKeyID.UIEffects:
                    return SystemParameters.UIEffectsKey;

                case SystemResourceKeyID.MinimizeAnimation: 
                    return SystemParameters.MinimizeAnimationKey;
 
                case SystemResourceKeyID.Border: 
                    return SystemParameters.BorderKey;
 
                case SystemResourceKeyID.CaretWidth:
                    return SystemParameters.CaretWidthKey;

                case SystemResourceKeyID.ForegroundFlashCount: 
                    return SystemParameters.ForegroundFlashCountKey;
 
                case SystemResourceKeyID.DragFullWindows: 
                    return SystemParameters.DragFullWindowsKey;
 
                case SystemResourceKeyID.BorderWidth:
                    return SystemParameters.BorderWidthKey;

                case SystemResourceKeyID.ScrollWidth: 
                    return SystemParameters.ScrollWidthKey;
 
                case SystemResourceKeyID.ScrollHeight: 
                    return SystemParameters.ScrollHeightKey;
 
                case SystemResourceKeyID.CaptionWidth:
                    return SystemParameters.CaptionWidthKey;

                case SystemResourceKeyID.CaptionHeight: 
                    return SystemParameters.CaptionHeightKey;
 
                case SystemResourceKeyID.SmallCaptionWidth: 
                    return SystemParameters.SmallCaptionWidthKey;
 
                case SystemResourceKeyID.MenuWidth:
                    return SystemParameters.MenuWidthKey;

                case SystemResourceKeyID.MenuHeight: 
                    return SystemParameters.MenuHeightKey;
 
                case SystemResourceKeyID.CaptionFontSize: 
                    return SystemFonts.CaptionFontSizeKey;
 
                case SystemResourceKeyID.CaptionFontFamily:
                    return SystemFonts.CaptionFontFamilyKey;

                case SystemResourceKeyID.CaptionFontStyle: 
                    return SystemFonts.CaptionFontStyleKey;
 
                case SystemResourceKeyID.CaptionFontWeight: 
                    return SystemFonts.CaptionFontWeightKey;
 
                case SystemResourceKeyID.CaptionFontTextDecorations:
                    return SystemFonts.CaptionFontTextDecorationsKey;

                case SystemResourceKeyID.SmallCaptionFontSize: 
                    return SystemFonts.SmallCaptionFontSizeKey;
 
                case SystemResourceKeyID.SmallCaptionFontFamily: 
                    return SystemFonts.SmallCaptionFontFamilyKey;
 
                case SystemResourceKeyID.SmallCaptionFontStyle:
                    return SystemFonts.SmallCaptionFontStyleKey;

                case SystemResourceKeyID.SmallCaptionFontWeight: 
                    return SystemFonts.SmallCaptionFontWeightKey;
 
                case SystemResourceKeyID.SmallCaptionFontTextDecorations: 
                    return SystemFonts.SmallCaptionFontTextDecorationsKey;
 
                case SystemResourceKeyID.MenuFontSize:
                    return SystemFonts.MenuFontSizeKey;

                case SystemResourceKeyID.MenuFontFamily: 
                    return SystemFonts.MenuFontFamilyKey;
 
                case SystemResourceKeyID.MenuFontStyle: 
                    return SystemFonts.MenuFontStyleKey;
 
                case SystemResourceKeyID.MenuFontWeight:
                    return SystemFonts.MenuFontWeightKey;

                case SystemResourceKeyID.MenuFontTextDecorations: 
                    return SystemFonts.MenuFontTextDecorationsKey;
 
                case SystemResourceKeyID.StatusFontSize: 
                    return SystemFonts.StatusFontSizeKey;
 
                case SystemResourceKeyID.StatusFontFamily:
                    return SystemFonts.StatusFontFamilyKey;

                case SystemResourceKeyID.StatusFontStyle: 
                    return SystemFonts.StatusFontStyleKey;
 
                case SystemResourceKeyID.StatusFontWeight: 
                    return SystemFonts.StatusFontWeightKey;
 
                case SystemResourceKeyID.StatusFontTextDecorations:
                    return SystemFonts.StatusFontTextDecorationsKey;

                case SystemResourceKeyID.MessageFontSize: 
                    return SystemFonts.MessageFontSizeKey;
 
                case SystemResourceKeyID.MessageFontFamily: 
                    return SystemFonts.MessageFontFamilyKey;
 
                case SystemResourceKeyID.MessageFontStyle:
                    return SystemFonts.MessageFontStyleKey;

                case SystemResourceKeyID.MessageFontWeight: 
                    return SystemFonts.MessageFontWeightKey;
 
                case SystemResourceKeyID.MessageFontTextDecorations: 
                    return SystemFonts.MessageFontTextDecorationsKey;
 
                case SystemResourceKeyID.ComboBoxPopupAnimation:
                    return SystemParameters.ComboBoxPopupAnimationKey;

                case SystemResourceKeyID.MenuPopupAnimation: 
                    return SystemParameters.MenuPopupAnimationKey;
 
                case SystemResourceKeyID.ToolTipPopupAnimation: 
                    return SystemParameters.ToolTipPopupAnimationKey;
 
                case SystemResourceKeyID.FocusVisualStyle:
                    return SystemParameters.FocusVisualStyleKey;

                case SystemResourceKeyID.NavigationChromeDownLevelStyle: 
                    return SystemParameters.NavigationChromeDownLevelStyleKey;
 
                case SystemResourceKeyID.NavigationChromeStyle: 
                    return SystemParameters.NavigationChromeStyleKey;
 
                case SystemResourceKeyID.MenuItemSeparatorStyle:
                    return MenuItem.SeparatorStyleKey;

                case SystemResourceKeyID.GridViewScrollViewerStyle: 
                    return GridView.GridViewScrollViewerStyleKey;
 
                case SystemResourceKeyID.GridViewStyle: 
                    return GridView.GridViewStyleKey;
 
                case SystemResourceKeyID.GridViewItemContainerStyle:
                    return GridView.GridViewItemContainerStyleKey;

                case SystemResourceKeyID.StatusBarSeparatorStyle: 
                    return StatusBar.SeparatorStyleKey;
 
                case SystemResourceKeyID.ToolBarButtonStyle: 
                    return ToolBar.ButtonStyleKey;
 
                case SystemResourceKeyID.ToolBarToggleButtonStyle:
                    return ToolBar.ToggleButtonStyleKey;

                case SystemResourceKeyID.ToolBarSeparatorStyle: 
                    return ToolBar.SeparatorStyleKey;
 
                case SystemResourceKeyID.ToolBarCheckBoxStyle: 
                    return ToolBar.CheckBoxStyleKey;
 
                case SystemResourceKeyID.ToolBarRadioButtonStyle:
                    return ToolBar.RadioButtonStyleKey;

                case SystemResourceKeyID.ToolBarComboBoxStyle: 
                    return ToolBar.ComboBoxStyleKey;
 
                case SystemResourceKeyID.ToolBarTextBoxStyle: 
                    return ToolBar.TextBoxStyleKey;
 
                case SystemResourceKeyID.ToolBarMenuStyle:
                    return ToolBar.MenuStyleKey;

                case SystemResourceKeyID.PowerLineStatus: 
                    return SystemParameters.PowerLineStatusKey;
            } 
 
            return null;
        } 

        internal static ResourceKey GetSystemResourceKey(string keyName)
        {
            switch (keyName) 
            {
                case "SystemParameters.FocusVisualStyleKey" : 
                    return SystemParameters.FocusVisualStyleKey; 

                case "ToolBar.ButtonStyleKey" : 
                    return ToolBarButtonStyleKey;

                case "ToolBar.ToggleButtonStyleKey" :
                    return ToolBarToggleButtonStyleKey; 

                case "ToolBar.CheckBoxStyleKey" : 
                    return ToolBarCheckBoxStyleKey; 

                case "ToolBar.RadioButtonStyleKey" : 
                    return ToolBarRadioButtonStyleKey;

                case "ToolBar.ComboBoxStyleKey" :
                    return ToolBarComboBoxStyleKey; 

                case "ToolBar.TextBoxStyleKey" : 
                    return ToolBarTextBoxStyleKey; 

                case "ToolBar.MenuStyleKey" : 
                    return ToolBarMenuStyleKey;

                case "ToolBar.SeparatorStyleKey" :
                    return ToolBarSeparatorStyleKey; 

                case "MenuItem.SeparatorStyleKey" : 
                    return MenuItemSeparatorStyleKey; 

                case "StatusBar.SeparatorStyleKey" : 
                    return StatusBarSeparatorStyleKey;

                case "SystemParameters.NavigationChromeStyleKey" :
                    return SystemParameters.NavigationChromeStyleKey; 

                case "SystemParameters.NavigationChromeDownLevelStyleKey" : 
                    return SystemParameters.NavigationChromeDownLevelStyleKey; 

                case "GridView.GridViewStyleKey" : 
                    return GridViewStyleKey;

                case "GridView.GridViewScrollViewerStyleKey" :
                    return GridViewScrollViewerStyleKey; 

                case "GridView.GridViewItemContainerStyleKey" : 
                    return GridViewItemContainerStyleKey; 

                case "DataGridColumnHeader.ColumnFloatingHeaderStyleKey" : 
                    return DataGridColumnHeaderColumnFloatingHeaderStyleKey;

                case "DataGridColumnHeader.ColumnHeaderDropSeparatorStyleKey" :
                    return DataGridColumnHeaderColumnHeaderDropSeparatorStyleKey; 

                case "DataGrid.FocusBorderBrushKey" : 
                    return DataGridFocusBorderBrushKey; 

                case "DataGridComboBoxColumn.TextBlockComboBoxStyleKey" : 
                    return DataGridComboBoxColumnTextBlockComboBoxStyleKey;
            }

            return null; 
        }
 
        internal static object GetResource(short id) 
        {
            SystemResourceKeyID keyId = (SystemResourceKeyID)id; 
            if (_srk == null)
            {
                _srk = new SystemResourceKey(keyId);
            } 
            else
            { 
                _srk._id = keyId; 
            }
 
            return _srk.Resource;
        }

        /// <summary> 
        ///     Constructs a new instance of the key with the given ID.
        /// </summary> 
        /// <param name="id">The internal, unique ID of the system resource.</param> 
        internal SystemResourceKey(SystemResourceKeyID id)
        { 
            Debug.Assert(((SystemResourceKeyID.InternalSystemColorsStart < id) && (id < SystemResourceKeyID.InternalSystemColorsEnd)) ||
                ((SystemResourceKeyID.InternalSystemFontsStart < id) && (id < SystemResourceKeyID.InternalSystemFontsEnd)) ||
                ((SystemResourceKeyID.InternalSystemParametersStart < id) && (id < SystemResourceKeyID.InternalSystemParametersEnd)) ||
                ((SystemResourceKeyID.InternalSystemColorsExtendedStart < id) && (id < SystemResourceKeyID.InternalSystemColorsExtendedEnd)), 
                String.Format("Invalid SystemResourceKeyID (id={0})", (int)id));
            _id = id; 
        } 

        internal SystemResourceKeyID InternalKey 
        {
            get
            {
                return _id; 
            }
        } 
 
        /// <summary>
        ///     Used to determine where to look for the resource dictionary that holds this resource. 
        /// </summary>
        public override Assembly Assembly
        {
            get 
            {
                return null; 
            } 
        }
 
        /// <summary>
        ///     Determines if the passed in object is equal to this object.
        ///     Two keys will be equal if they both have the same ID.
        /// </summary> 
        /// <param name="o">The object to compare with.</param>
        /// <returns>True if the objects are equal. False otherwise.</returns> 
        public override bool Equals(object o) 
        {
            SystemResourceKey key = o as SystemResourceKey; 

            if (key != null)
            {
                return (key._id == this._id); 
            }
 
            return false; 
        }
 
        /// <summary>
        ///     Serves as a hash function for a particular type.
        /// </summary>
        public override int GetHashCode() 
        {
            return (int)_id; 
        } 

        /// <summary> 
        ///     get string representation of this key
        /// </summary>
        /// <returns>the string representation of the key</returns>
        public override string ToString() 
        {
            return _id.ToString(); 
        } 

        #region ResourceKeys 

        internal static ComponentResourceKey DataGridFocusBorderBrushKey
        {
            get 
            {
                if (_focusBorderBrushKey == null) 
                { 
                    _focusBorderBrushKey = new ComponentResourceKey(typeof(DataGrid), "FocusBorderBrushKey");
                } 

                return _focusBorderBrushKey;
            }
        } 

        internal static ComponentResourceKey DataGridComboBoxColumnTextBlockComboBoxStyleKey 
        { 
            get
            { 
                if (_textBlockComboBoxStyleKey == null)
                {
                    _textBlockComboBoxStyleKey = new ComponentResourceKey(typeof(DataGrid), "TextBlockComboBoxStyleKey");
                } 

                return _textBlockComboBoxStyleKey; 
            } 
        }
 
        internal static ResourceKey MenuItemSeparatorStyleKey
        {
            get
            { 
                if (_menuItemSeparatorStyleKey == null)
                { 
                    _menuItemSeparatorStyleKey = new SystemThemeKey(SystemResourceKeyID.MenuItemSeparatorStyle); 
                }
                return _menuItemSeparatorStyleKey; 
            }
        }

        internal static ComponentResourceKey DataGridColumnHeaderColumnFloatingHeaderStyleKey 
        {
            get 
            { 
                if (_columnFloatingHeaderStyleKey == null)
                { 
                    _columnFloatingHeaderStyleKey = new ComponentResourceKey(typeof(DataGrid), "ColumnFloatingHeaderStyleKey");
                }

                return _columnFloatingHeaderStyleKey; 
            }
        } 
 
        internal static ComponentResourceKey DataGridColumnHeaderColumnHeaderDropSeparatorStyleKey
        { 
            get
            {
                if (_columnHeaderDropSeparatorStyleKey == null)
                { 
                    _columnHeaderDropSeparatorStyleKey = new ComponentResourceKey(typeof(DataGrid), "ColumnHeaderDropSeparatorStyleKey");
                } 
 
                return _columnHeaderDropSeparatorStyleKey;
            } 
        }

        internal static ResourceKey GridViewItemContainerStyleKey
        { 
            get
            { 
                if (_gridViewItemContainerStyleKey == null) 
                {
                    _gridViewItemContainerStyleKey = new SystemThemeKey(SystemResourceKeyID.GridViewItemContainerStyle); 
                }

                return _gridViewItemContainerStyleKey;
            } 
        }
 
        internal static ResourceKey GridViewScrollViewerStyleKey 
        {
            get 
            {
                if (_scrollViewerStyleKey == null)
                {
                    _scrollViewerStyleKey = new SystemThemeKey(SystemResourceKeyID.GridViewScrollViewerStyle); 
                }
 
                return _scrollViewerStyleKey; 
            }
        } 

        internal static ResourceKey GridViewStyleKey
        {
            get 
            {
                if (_gridViewStyleKey == null) 
                { 
                    _gridViewStyleKey = new SystemThemeKey(SystemResourceKeyID.GridViewStyle);
                } 

                return _gridViewStyleKey;
            }
        } 

        internal static ResourceKey StatusBarSeparatorStyleKey 
        { 
            get
            { 
                if (_statusBarSeparatorStyleKey == null)
                {
                    _statusBarSeparatorStyleKey = new SystemThemeKey(SystemResourceKeyID.StatusBarSeparatorStyle);
                } 
                return _statusBarSeparatorStyleKey;
            } 
        } 

        internal static ResourceKey ToolBarButtonStyleKey 
        {
            get
            {
                if (_cacheButtonStyle == null) 
                {
                    _cacheButtonStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarButtonStyle); 
                } 
                return _cacheButtonStyle;
            } 
        }


        /// <summary> 
        ///     Resource Key for the ToggleButtonStyle
        /// </summary> 
        internal static ResourceKey ToolBarToggleButtonStyleKey 
        {
            get 
            {
                if (_cacheToggleButtonStyle == null)
                {
                    _cacheToggleButtonStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarToggleButtonStyle); 
                }
                return _cacheToggleButtonStyle; 
            } 
        }
 
        /// <summary>
        ///     Resource Key for the SeparatorStyle
        /// </summary>
        internal static ResourceKey ToolBarSeparatorStyleKey 
        {
            get 
            { 
                if (_cacheSeparatorStyle == null)
                { 
                    _cacheSeparatorStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarSeparatorStyle);
                }
                return _cacheSeparatorStyle;
            } 
        }
 
 
        /// <summary>
        ///     Resource Key for the CheckBoxStyle 
        /// </summary>
        internal static ResourceKey ToolBarCheckBoxStyleKey
        {
            get 
            {
                if (_cacheCheckBoxStyle == null) 
                { 
                    _cacheCheckBoxStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarCheckBoxStyle);
                } 
                return _cacheCheckBoxStyle;
            }
        }
 
        /// <summary>
        ///     Resource Key for the RadioButtonStyle 
        /// </summary> 
        internal static ResourceKey ToolBarRadioButtonStyleKey
        { 
            get
            {
                if (_cacheRadioButtonStyle == null)
                { 
                    _cacheRadioButtonStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarRadioButtonStyle);
                } 
                return _cacheRadioButtonStyle; 
            }
        } 


        /// <summary>
        ///     Resource Key for the ComboBoxStyle 
        /// </summary>
        internal static ResourceKey ToolBarComboBoxStyleKey 
        { 
            get
            { 
                if (_cacheComboBoxStyle == null)
                {
                    _cacheComboBoxStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarComboBoxStyle);
                } 
                return _cacheComboBoxStyle;
            } 
        } 

 
        /// <summary>
        ///     Resource Key for the TextBoxStyle
        /// </summary>
        internal static ResourceKey ToolBarTextBoxStyleKey 
        {
            get 
            { 
                if (_cacheTextBoxStyle == null)
                { 
                    _cacheTextBoxStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarTextBoxStyle);
                }
                return _cacheTextBoxStyle;
            } 
        }
 
 
        /// <summary>
        ///     Resource Key for the MenuStyle 
        /// </summary>
        internal static ResourceKey ToolBarMenuStyleKey
        {
            get 
            {
                if (_cacheMenuStyle == null) 
                { 
                    _cacheMenuStyle = new SystemThemeKey(SystemResourceKeyID.ToolBarMenuStyle);
                } 
                return _cacheMenuStyle;
            }
        }
 
        private static SystemThemeKey _cacheSeparatorStyle;
        private static SystemThemeKey _cacheCheckBoxStyle; 
        private static SystemThemeKey _cacheToggleButtonStyle; 
        private static SystemThemeKey _cacheButtonStyle;
        private static SystemThemeKey _cacheRadioButtonStyle; 
        private static SystemThemeKey _cacheComboBoxStyle;
        private static SystemThemeKey _cacheTextBoxStyle;
        private static SystemThemeKey _cacheMenuStyle;
 
        private static ComponentResourceKey _focusBorderBrushKey;
        private static ComponentResourceKey _textBlockComboBoxStyleKey; 
        private static SystemThemeKey _menuItemSeparatorStyleKey; 
        private static ComponentResourceKey _columnHeaderDropSeparatorStyleKey;
        private static ComponentResourceKey _columnFloatingHeaderStyleKey; 
        private static SystemThemeKey _gridViewItemContainerStyleKey;
        private static SystemThemeKey _scrollViewerStyleKey;
        private static SystemThemeKey _gridViewStyleKey;
        private static SystemThemeKey _statusBarSeparatorStyleKey; 

        #endregion 
 

        private SystemResourceKeyID _id; 

        [ThreadStatic]
        private static SystemResourceKey _srk = null;
#endif 
    }