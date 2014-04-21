
/**
 * SystemResourceKeyID
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var SystemResourceKeyID = declare("SystemResourceKeyID", null,{

	});
	
	 // ---- Colors and Brushes section ----
	SystemResourceKeyID.InternalSystemColorsStart = 0,

	SystemResourceKeyID.ActiveBorderBrush = 1; 
	SystemResourceKeyID.ActiveCaptionBrush = 2;
	SystemResourceKeyID.ActiveCaptionTextBrush = 3; 
	SystemResourceKeyID.AppWorkspaceBrush = 4; 
	SystemResourceKeyID.ControlBrush = 5;
	SystemResourceKeyID.ControlDarkBrush = 6; 
	SystemResourceKeyID.ControlDarkDarkBrush = 7;
	SystemResourceKeyID.ControlLightBrush = 8;
	SystemResourceKeyID.ControlLightLightBrush = 9;
	
	SystemResourceKeyID.ControlTextBrush = 10; 
	SystemResourceKeyID.DesktopBrush = 11;
	SystemResourceKeyID.GradientActiveCaptionBrush = 12; 
	SystemResourceKeyID.GradientInactiveCaptionBrush = 13; 
	SystemResourceKeyID.GrayTextBrush = 14;
	SystemResourceKeyID.HighlightBrush = 15; 
	SystemResourceKeyID.HighlightTextBrush = 16;
	SystemResourceKeyID.HotTrackBrush = 17;
	SystemResourceKeyID.InactiveBorderBrush = 18;
	SystemResourceKeyID.InactiveCaptionBrush = 19; 
	
	SystemResourceKeyID.InactiveCaptionTextBrush = 20;
	SystemResourceKeyID.InfoBrush = 21; 
	SystemResourceKeyID.InfoTextBrush = 22; 
	SystemResourceKeyID.MenuBrush = 23;
	SystemResourceKeyID.MenuBarBrush = 24; 
	SystemResourceKeyID.MenuHighlightBrush = 25;
	SystemResourceKeyID.MenuTextBrush = 26;
	SystemResourceKeyID.ScrollBarBrush = 27;
	SystemResourceKeyID.WindowBrush = 28; 
	SystemResourceKeyID.WindowFrameBrush = 29;
	
	SystemResourceKeyID.WindowTextBrush = 30; 
	SystemResourceKeyID.ActiveBorderColor = 31; 
	SystemResourceKeyID.ActiveCaptionColor = 32;
	SystemResourceKeyID.ActiveCaptionTextColor = 33; 
	SystemResourceKeyID.AppWorkspaceColor = 34;
	SystemResourceKeyID.ControlColor = 35;
	SystemResourceKeyID.ControlDarkColor = 36;
	SystemResourceKeyID.ControlDarkDarkColor = 37; 
	SystemResourceKeyID.ControlLightColor = 38;
	SystemResourceKeyID.ControlLightLightColor = 39; 
	
	SystemResourceKeyID.ControlTextColor = 40; 
	SystemResourceKeyID.DesktopColor = 41;
	SystemResourceKeyID.GradientActiveCaptionColor = 42; 
	SystemResourceKeyID.GradientInactiveCaptionColor = 43;
	SystemResourceKeyID.GrayTextColor = 44;
	SystemResourceKeyID.HighlightColor = 45;
	SystemResourceKeyID.HighlightTextColor = 46; 
	SystemResourceKeyID.HotTrackColor = 47;
	SystemResourceKeyID.InactiveBorderColor = 48; 
	SystemResourceKeyID.InactiveCaptionColor = 49; 
	
	SystemResourceKeyID.InactiveCaptionTextColor = 50;
	SystemResourceKeyID.InfoColor = 51; 
	SystemResourceKeyID.InfoTextColor = 52;
	SystemResourceKeyID.MenuColor = 53;
	SystemResourceKeyID.MenuBarColor = 54;
	SystemResourceKeyID.MenuHighlightColor = 55; 
	SystemResourceKeyID.MenuTextColor = 56;
	SystemResourceKeyID.ScrollBarColor = 57; 
	SystemResourceKeyID.WindowColor = 58; 
	SystemResourceKeyID.WindowFrameColor = 59;
	
	SystemResourceKeyID.WindowTextColor = 60; 
	SystemResourceKeyID.InternalSystemColorsEnd = 61;
    // ---- Fonts section ---- 
	SystemResourceKeyID.InternalSystemFontsStart = 62;
	SystemResourceKeyID.CaptionFontSize = 63; 
	SystemResourceKeyID.CaptionFontFamily = 64;
	SystemResourceKeyID.CaptionFontStyle = 65; 
	SystemResourceKeyID.CaptionFontWeight = 66;
	SystemResourceKeyID.CaptionFontTextDecorations = 67;
	SystemResourceKeyID.SmallCaptionFontSize = 68;
	SystemResourceKeyID.SmallCaptionFontFamily = 69; 
	
	SystemResourceKeyID.SmallCaptionFontStyle = 70;
	SystemResourceKeyID.SmallCaptionFontWeight = 71; 
	SystemResourceKeyID.SmallCaptionFontTextDecorations = 72; 
	SystemResourceKeyID.MenuFontSize = 73;
	SystemResourceKeyID.MenuFontFamily = 74; 
	SystemResourceKeyID.MenuFontStyle = 75;
	SystemResourceKeyID.MenuFontWeight = 76;
	SystemResourceKeyID.MenuFontTextDecorations = 77;
	SystemResourceKeyID.StatusFontSize = 78; 
	SystemResourceKeyID.StatusFontFamily = 79;
	
	SystemResourceKeyID.StatusFontStyle = 80; 
	SystemResourceKeyID.StatusFontWeight = 81; 
	SystemResourceKeyID.StatusFontTextDecorations = 82;
	SystemResourceKeyID.MessageFontSize = 83; 
	SystemResourceKeyID.MessageFontFamily = 84;
	SystemResourceKeyID.MessageFontStyle = 85;
	SystemResourceKeyID.MessageFontWeight = 86;
	SystemResourceKeyID.MessageFontTextDecorations = 87; 
	SystemResourceKeyID.IconFontSize = 88;
	SystemResourceKeyID.IconFontFamily = 89; 
	
	SystemResourceKeyID.IconFontStyle = 90; 
	SystemResourceKeyID.IconFontWeight = 91;
	SystemResourceKeyID.IconFontTextDecorations = 92; 
	SystemResourceKeyID.InternalSystemFontsEnd = 93;
    // ---- SystemParameters section --- 
	SystemResourceKeyID.InternalSystemParametersStart = 94;
	SystemResourceKeyID.ThinHorizontalBorderHeight = 95; 
	SystemResourceKeyID.ThinVerticalBorderWidth = 96;
	SystemResourceKeyID.CursorWidth = 97; 
	SystemResourceKeyID.CursorHeight = 98;
	SystemResourceKeyID.ThickHorizontalBorderHeight = 99;
	
	SystemResourceKeyID.ThickVerticalBorderWidth = 100;
	SystemResourceKeyID.FixedFrameHorizontalBorderHeight = 101; 
	SystemResourceKeyID.FixedFrameVerticalBorderWidth = 102;
	SystemResourceKeyID.FocusHorizontalBorderHeight = 103; 
	SystemResourceKeyID.FocusVerticalBorderWidth = 104; 
	SystemResourceKeyID.FullPrimaryScreenWidth = 105;
	SystemResourceKeyID.FullPrimaryScreenHeight = 106; 
	SystemResourceKeyID.HorizontalScrollBarButtonWidth = 107;
	SystemResourceKeyID.HorizontalScrollBarHeight = 108;
	SystemResourceKeyID.HorizontalScrollBarThumbWidth = 109;
	SystemResourceKeyID.IconWidth = 110; 
	
	SystemResourceKeyID.IconHeight = 111;
	SystemResourceKeyID.IconGridWidth = 112; 
	SystemResourceKeyID.IconGridHeight = 113; 
	SystemResourceKeyID.MaximizedPrimaryScreenWidth = 114;
	SystemResourceKeyID.MaximizedPrimaryScreenHeight = 115; 
	SystemResourceKeyID.MaximumWindowTrackWidth = 116;
	SystemResourceKeyID.MaximumWindowTrackHeight = 117;
	SystemResourceKeyID.MenuCheckmarkWidth = 118;
	SystemResourceKeyID.MenuCheckmarkHeight = 119; 
	
	SystemResourceKeyID.MenuButtonWidth = 120;
	SystemResourceKeyID.MenuButtonHeight = 121; 
	SystemResourceKeyID.MinimumWindowWidth = 122; 
	SystemResourceKeyID.MinimumWindowHeight = 123;
	SystemResourceKeyID.MinimizedWindowWidth = 124; 
	SystemResourceKeyID.MinimizedWindowHeight = 125;
	SystemResourceKeyID.MinimizedGridWidth = 126;
	SystemResourceKeyID.MinimizedGridHeight = 127;
	SystemResourceKeyID.MinimumWindowTrackWidth = 128; 
	SystemResourceKeyID.MinimumWindowTrackHeight = 129;
	
	SystemResourceKeyID.PrimaryScreenWidth = 130; 
	SystemResourceKeyID.PrimaryScreenHeight = 131; 
	SystemResourceKeyID.WindowCaptionButtonWidth = 132;
	SystemResourceKeyID.WindowCaptionButtonHeight = 133; 
	SystemResourceKeyID.ResizeFrameHorizontalBorderHeight = 134;
	SystemResourceKeyID.ResizeFrameVerticalBorderWidth = 135;
	SystemResourceKeyID.SmallIconWidth = 136;
	SystemResourceKeyID.SmallIconHeight = 137; 
	SystemResourceKeyID.SmallWindowCaptionButtonWidth = 138;
	SystemResourceKeyID.SmallWindowCaptionButtonHeight = 139; 
	
	SystemResourceKeyID.VirtualScreenWidth = 140; 
	SystemResourceKeyID.VirtualScreenHeight = 141;
	SystemResourceKeyID.VerticalScrollBarWidth = 142; 
	SystemResourceKeyID.VerticalScrollBarButtonHeight = 143;
	SystemResourceKeyID.WindowCaptionHeight = 144;
	SystemResourceKeyID.KanjiWindowHeight = 145;
	SystemResourceKeyID.MenuBarHeight = 146; 
	SystemResourceKeyID.SmallCaptionHeight = 147;
	SystemResourceKeyID.VerticalScrollBarThumbHeight = 148; 
	SystemResourceKeyID.IsImmEnabled = 149; 
	
	SystemResourceKeyID.IsMediaCenter = 150;
	SystemResourceKeyID.IsMenuDropRightAligned = 151; 
	SystemResourceKeyID.IsMiddleEastEnabled = 152;
	SystemResourceKeyID.IsMousePresent = 153;
	SystemResourceKeyID.IsMouseWheelPresent = 154;
	SystemResourceKeyID.IsPenWindows = 155; 
	SystemResourceKeyID.IsRemotelyControlled = 156;
	SystemResourceKeyID.IsRemoteSession = 157; 
	SystemResourceKeyID.ShowSounds = 158; 
	SystemResourceKeyID.IsSlowMachine = 159;
	
	SystemResourceKeyID.SwapButtons = 160; 
	SystemResourceKeyID.IsTabletPC = 161;
	SystemResourceKeyID.VirtualScreenLeft = 162;
	SystemResourceKeyID.VirtualScreenTop = 163;
	SystemResourceKeyID.FocusBorderWidth = 164; 
	SystemResourceKeyID.FocusBorderHeight = 165;
	SystemResourceKeyID.HighContrast = 166; 
	SystemResourceKeyID.DropShadow = 167; 
	SystemResourceKeyID.FlatMenu = 168;
	SystemResourceKeyID.WorkArea = 169; 
	
	SystemResourceKeyID.IconHorizontalSpacing = 170;
	SystemResourceKeyID.IconVerticalSpacing = 171;
	SystemResourceKeyID.IconTitleWrap = 172;
	SystemResourceKeyID.KeyboardCues = 173; 
	SystemResourceKeyID.KeyboardDelay = 174;
	SystemResourceKeyID.KeyboardPreference = 175; 
	SystemResourceKeyID.KeyboardSpeed = 176; 
	SystemResourceKeyID.SnapToDefaultButton = 177;
	SystemResourceKeyID.WheelScrollLines = 178; 
	SystemResourceKeyID.MouseHoverTime = 179;
	
	SystemResourceKeyID.MouseHoverHeight = 180;
	SystemResourceKeyID.MouseHoverWidth = 181;
	SystemResourceKeyID.MenuDropAlignment = 182; 
	SystemResourceKeyID.MenuFade = 183;
	SystemResourceKeyID.MenuShowDelay = 184; 
	SystemResourceKeyID.ComboBoxAnimation = 185; 
    SystemResourceKeyID.ClientAreaAnimation = 186;
    SystemResourceKeyID.CursorShadow = 187; 
    SystemResourceKeyID.GradientCaptions = 188;
    SystemResourceKeyID.HotTracking = 189;
    
    SystemResourceKeyID.ListBoxSmoothScrolling = 190;
    SystemResourceKeyID.MenuAnimation = 191; 
    SystemResourceKeyID.SelectionFade = 192;
    SystemResourceKeyID.StylusHotTracking = 193; 
    SystemResourceKeyID.ToolTipAnimation = 194; 
    SystemResourceKeyID.ToolTipFade = 195;
    SystemResourceKeyID.UIEffects = 196; 
    SystemResourceKeyID.MinimizeAnimation = 197;
    SystemResourceKeyID.Border = 198;
    SystemResourceKeyID.CaretWidth = 199;
    
    SystemResourceKeyID.ForegroundFlashCount = 200; 
    SystemResourceKeyID.DragFullWindows = 201;
    SystemResourceKeyID.BorderWidth = 202; 
    SystemResourceKeyID.ScrollWidth = 203; 
    SystemResourceKeyID.ScrollHeight = 204;
    SystemResourceKeyID.CaptionWidth = 205; 
    SystemResourceKeyID.CaptionHeight = 206;
    SystemResourceKeyID.SmallCaptionWidth = 207;
    SystemResourceKeyID.MenuWidth = 208;
    SystemResourceKeyID.MenuHeight = 209; 
    
    SystemResourceKeyID.ComboBoxPopupAnimation = 210;
    SystemResourceKeyID.MenuPopupAnimation = 211; 
    SystemResourceKeyID.ToolTipPopupAnimation = 212; 
    SystemResourceKeyID.PowerLineStatus = 213;
    // ---- SystemThemeStyle section ---
    SystemResourceKeyID.InternalSystemThemeStylesStart = 214;

    SystemResourceKeyID.FocusVisualStyle = 215; 
    SystemResourceKeyID.NavigationChromeDownLevelStyle = 216;
    SystemResourceKeyID.NavigationChromeStyle = 217; 
    SystemResourceKeyID.InternalSystemParametersEnd = 218;
    SystemResourceKeyID.MenuItemSeparatorStyle = 219;
    

    SystemResourceKeyID.GridViewScrollViewerStyle = 220;
    SystemResourceKeyID.GridViewStyle = 221; 
    SystemResourceKeyID.GridViewItemContainerStyle = 222;
    SystemResourceKeyID.StatusBarSeparatorStyle = 223; 
    SystemResourceKeyID.ToolBarButtonStyle = 224; 
    SystemResourceKeyID.ToolBarToggleButtonStyle = 225;
    SystemResourceKeyID.ToolBarSeparatorStyle = 226;
    SystemResourceKeyID.ToolBarCheckBoxStyle = 227;
    SystemResourceKeyID.ToolBarRadioButtonStyle = 228; 
    SystemResourceKeyID.ToolBarComboBoxStyle = 229;
    
    SystemResourceKeyID.ToolBarTextBoxStyle = 230; 
    SystemResourceKeyID.ToolBarMenuStyle = 231; 
    SystemResourceKeyID.InternalSystemThemeStylesEnd = 232; 
    SystemResourceKeyID.InternalSystemColorsExtendedStart = 233;
    SystemResourceKeyID.InactiveSelectionHighlightBrush = 234; 
    SystemResourceKeyID.InactiveSelectionHighlightTextBrush = 235;
    SystemResourceKeyID.InternalSystemColorsExtendedEnd =236; 
	
//	SystemResourceKeyID.Type = new Type("SystemResourceKeyID", SystemResourceKeyID, [Object.Type]);
	return SystemResourceKeyID;
});
