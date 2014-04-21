/**
 * SystemColors
 */

define(["dojo/_base/declare", "system/Type", "media/Color"], 
		function(declare, Type, Color){
	
//	private enum 
	var CacheSlot = declare(null, {});
	CacheSlot.ActiveBorder=0;
	CacheSlot.ActiveCaption=0; 
	CacheSlot.ActiveCaptionText=0;
	CacheSlot.AppWorkspace=0; 
	CacheSlot.Control=0; 
	CacheSlot.ControlDark=0;
	CacheSlot.ControlDarkDark=0; 
	CacheSlot.ControlLight=0;
	CacheSlot.ControlLightLight=0;
	CacheSlot.ControlText=0;
	CacheSlot.Desktop=0; 
	CacheSlot.GradientActiveCaption=0;
	CacheSlot.GradientInactiveCaption=0; 
	CacheSlot.GrayText=0; 
	CacheSlot.Highlight=0;
	CacheSlot.HighlightText=0; 
	CacheSlot.HotTrack=0;
	CacheSlot.InactiveBorder=0;
	CacheSlot.InactiveCaption=0;
	CacheSlot.InactiveCaptionText=0; 
	CacheSlot.Info=0;
	CacheSlot.InfoText=0; 
	CacheSlot.Menu=0; 
	CacheSlot.MenuBar=0;
	CacheSlot.MenuHighlight=0; 
	CacheSlot.MenuText=0;
	CacheSlot.ScrollBar=0;
	CacheSlot.Window=0;
	CacheSlot.WindowFrame=0; 
	CacheSlot.WindowText=0;

	CacheSlot.NumSlots=0; 
	
    /*private static SystemResourceKey*/ var _cacheActiveBorderBrush; 
    /*private static SystemResourceKey*/ var _cacheActiveCaptionBrush; 
    /*private static SystemResourceKey*/ var _cacheActiveCaptionTextBrush;
    /*private static SystemResourceKey*/ var _cacheAppWorkspaceBrush; 
    /*private static SystemResourceKey*/ var _cacheControlBrush;
    /*private static SystemResourceKey*/ var _cacheControlDarkBrush;
    /*private static SystemResourceKey*/ var _cacheControlDarkDarkBrush;
    /*private static SystemResourceKey*/ var _cacheControlLightBrush; 
    /*private static SystemResourceKey*/ var _cacheControlLightLightBrush;
    /*private static SystemResourceKey*/ var _cacheControlTextBrush; 
    /*private static SystemResourceKey*/ var _cacheDesktopBrush; 
    /*private static SystemResourceKey*/ var _cacheGradientActiveCaptionBrush;
    /*private static SystemResourceKey*/ var _cacheGradientInactiveCaptionBrush; 
    /*private static SystemResourceKey*/ var _cacheGrayTextBrush;
    /*private static SystemResourceKey*/ var _cacheHighlightBrush;
    /*private static SystemResourceKey*/ var _cacheHighlightTextBrush;
    /*private static SystemResourceKey*/ var _cacheHotTrackBrush; 
    /*private static SystemResourceKey*/ var _cacheInactiveBorderBrush;
    /*private static SystemResourceKey*/ var _cacheInactiveCaptionBrush; 
    /*private static SystemResourceKey*/ var _cacheInactiveCaptionTextBrush; 
    /*private static SystemResourceKey*/ var _cacheInfoBrush;
    /*private static SystemResourceKey*/ var _cacheInfoTextBrush; 
    /*private static SystemResourceKey*/ var _cacheMenuBrush;
    /*private static SystemResourceKey*/ var _cacheMenuBarBrush;
    /*private static SystemResourceKey*/ var _cacheMenuHighlightBrush;
    /*private static SystemResourceKey*/ var _cacheMenuTextBrush; 
    /*private static SystemResourceKey*/ var _cacheScrollBarBrush;
    /*private static SystemResourceKey*/ var _cacheWindowBrush; 
    /*private static SystemResourceKey*/ var _cacheWindowFrameBrush; 
    /*private static SystemResourceKey*/ var _cacheWindowTextBrush;
    /*private static SystemResourceKey*/ var _cacheInactiveSelectionHighlightBrush; 
    /*private static SystemResourceKey*/ var _cacheInactiveSelectionHighlightTextBrush;
    /*private static SystemResourceKey*/ var _cacheActiveBorderColor;
    /*private static SystemResourceKey*/ var _cacheActiveCaptionColor;
    /*private static SystemResourceKey*/ var _cacheActiveCaptionTextColor; 
    /*private static SystemResourceKey*/ var _cacheAppWorkspaceColor;
    /*private static SystemResourceKey*/ var _cacheControlColor; 
    /*private static SystemResourceKey*/ var _cacheControlDarkColor; 
    /*private static SystemResourceKey*/ var _cacheControlDarkDarkColor;
    /*private static SystemResourceKey*/ var _cacheControlLightColor; 
    /*private static SystemResourceKey*/ var _cacheControlLightLightColor;
    /*private static SystemResourceKey*/ var _cacheControlTextColor;
    /*private static SystemResourceKey*/ var _cacheDesktopColor;
    /*private static SystemResourceKey*/ var _cacheGradientActiveCaptionColor; 
    /*private static SystemResourceKey*/ var _cacheGradientInactiveCaptionColor;
    /*private static SystemResourceKey*/ var _cacheGrayTextColor; 
    /*private static SystemResourceKey*/ var _cacheHighlightColor; 
    /*private static SystemResourceKey*/ var _cacheHighlightTextColor;
    /*private static SystemResourceKey*/ var _cacheHotTrackColor; 
    /*private static SystemResourceKey*/ var _cacheInactiveBorderColor;
    /*private static SystemResourceKey*/ var _cacheInactiveCaptionColor;
    /*private static SystemResourceKey*/ var _cacheInactiveCaptionTextColor;
    /*private static SystemResourceKey*/ var _cacheInfoColor; 
    /*private static SystemResourceKey*/ var _cacheInfoTextColor;
    /*private static SystemResourceKey*/ var _cacheMenuColor; 
    /*private static SystemResourceKey*/ var _cacheMenuBarColor; 
    /*private static SystemResourceKey*/ var _cacheMenuHighlightColor;
    /*private static SystemResourceKey*/ var _cacheMenuTextColor; 
    /*private static SystemResourceKey*/ var _cacheScrollBarColor;
    /*private static SystemResourceKey*/ var _cacheWindowColor;
    /*private static SystemResourceKey*/ var _cacheWindowFrameColor;
    /*private static SystemResourceKey*/ var _cacheWindowTextColor; 
	
	var SystemColors = declare("SystemColors", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(SystemColors.prototype,{
		  
	});
	
	Object.defineProperties(SystemColors,{
		 /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ ActiveBorderColor: 
        {
            get:function()
            {
                return GetSystemColor(CacheSlot.ActiveBorder); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ ActiveCaptionColor:
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.ActiveCaption); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ ActiveCaptionTextColor: 
        {
            get:function() 
            { 
                return GetSystemColor(CacheSlot.ActiveCaptionText);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ AppWorkspaceColor: 
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.AppWorkspace);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static Color*/ ControlColor:
        { 
            get:function()
            {
                return GetSystemColor(CacheSlot.Control);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ ControlDarkColor:
        {
            get:function()
            { 
                return GetSystemColor(CacheSlot.ControlDark);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ ControlDarkDarkColor:
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.ControlDarkDark); 
            }
        }, 

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ ControlLightColor:
        { 
            get:function() 
            {
                return GetSystemColor(CacheSlot.ControlLight); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ ControlLightLightColor: 
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.ControlLightLight);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ ControlTextColor: 
        {
            get:function()
            {
                return GetSystemColor(CacheSlot.ControlText); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ DesktopColor:
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.Desktop); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ GradientActiveCaptionColor: 
        {
            get:function() 
            { 
                return GetSystemColor(CacheSlot.GradientActiveCaption);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ GradientInactiveCaptionColor: 
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.GradientInactiveCaption);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static Color*/ GrayTextColor:
        { 
            get:function()
            {
                return GetSystemColor(CacheSlot.GrayText);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ HighlightColor:
        {
            get:function()
            { 
                return GetSystemColor(CacheSlot.Highlight);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ HighlightTextColor:
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.HighlightText); 
            }
        }, 

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ HotTrackColor:
        { 
            get:function() 
            {
                return GetSystemColor(CacheSlot.HotTrack); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ InactiveBorderColor: 
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.InactiveBorder);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ InactiveCaptionColor: 
        {
            get:function()
            {
                return GetSystemColor(CacheSlot.InactiveCaption); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ InactiveCaptionTextColor:
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.InactiveCaptionText); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ InfoColor: 
        {
            get:function() 
            { 
                return GetSystemColor(CacheSlot.Info);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ InfoTextColor: 
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.InfoText);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static Color*/ MenuColor:
        { 
            get:function()
            {
                return GetSystemColor(CacheSlot.Menu);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ MenuBarColor:
        {
            get:function()
            { 
                return GetSystemColor(CacheSlot.MenuBar);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ MenuHighlightColor:
        { 
            get:function()
            { 
                return GetSystemColor(CacheSlot.MenuHighlight); 
            }
        }, 

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ MenuTextColor:
        { 
            get:function() 
            {
                return GetSystemColor(CacheSlot.MenuText); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static Color*/ ScrollBarColor: 
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.ScrollBar);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ WindowColor: 
        {
            get:function()
            {
                return GetSystemColor(CacheSlot.Window); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static Color*/ WindowFrameColor:
        {
            get:function() 
            {
                return GetSystemColor(CacheSlot.WindowFrame); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static Color*/ WindowTextColor: 
        {
            get:function() 
            { 
                return GetSystemColor(CacheSlot.WindowText);
            } 
        },

        /// <summary> 
        ///     ActiveBorderColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ActiveBorderColorKey: 
        {
            get:function() 
            {
                if (_cacheActiveBorderColor == null)
                {
                    _cacheActiveBorderColor = CreateInstance(SystemResourceKeyID.ActiveBorderColor); 
                }
 
                return _cacheActiveBorderColor; 
            }
        }, 

        /// <summary>
        ///     ActiveCaptionColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ActiveCaptionColorKey:
        { 
            get:function() 
            {
                if (_cacheActiveCaptionColor == null) 
                {
                    _cacheActiveCaptionColor = CreateInstance(SystemResourceKeyID.ActiveCaptionColor);
                }
 
                return _cacheActiveCaptionColor;
            } 
        }, 

        /// <summary> 
        ///     ActiveCaptionTextColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ ActiveCaptionTextColorKey:
        { 
            get:function()
            { 
                if (_cacheActiveCaptionTextColor == null) 
                {
                    _cacheActiveCaptionTextColor = CreateInstance(SystemResourceKeyID.ActiveCaptionTextColor); 
                }

                return _cacheActiveCaptionTextColor;
            } 
        },
 
        /// <summary> 
        ///     AppWorkspaceColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ AppWorkspaceColorKey:
        {
            get:function()
            { 
                if (_cacheAppWorkspaceColor == null)
                { 
                    _cacheAppWorkspaceColor = CreateInstance(SystemResourceKeyID.AppWorkspaceColor); 
                }
 
                return _cacheAppWorkspaceColor;
            }
        },
 
        /// <summary>
        ///     ControlColor System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ ControlColorKey:
        { 
            get:function()
            {
                if (_cacheControlColor == null)
                { 
                    _cacheControlColor = CreateInstance(SystemResourceKeyID.ControlColor);
                } 
 
                return _cacheControlColor;
            } 
        },

        /// <summary>
        ///     ControlDarkColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ControlDarkColorKey: 
        { 
            get:function()
            { 
                if (_cacheControlDarkColor == null)
                {
                    _cacheControlDarkColor = CreateInstance(SystemResourceKeyID.ControlDarkColor);
                } 

                return _cacheControlDarkColor; 
            } 
        },
 
        /// <summary>
        ///     ControlDarkDarkColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ ControlDarkDarkColorKey: 
        {
            get:function() 
            { 
                if (_cacheControlDarkDarkColor == null)
                { 
                    _cacheControlDarkDarkColor = CreateInstance(SystemResourceKeyID.ControlDarkDarkColor);
                }

                return _cacheControlDarkDarkColor; 
            }
        },
 
        /// <summary>
        ///     ControlLightColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ControlLightColorKey:
        {
            get:function() 
            {
                if (_cacheControlLightColor == null) 
                { 
                    _cacheControlLightColor = CreateInstance(SystemResourceKeyID.ControlLightColor);
                } 

                return _cacheControlLightColor;
            }
        }, 

        /// <summary> 
        ///     ControlLightLightColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ControlLightLightColorKey: 
        {
            get:function()
            {
                if (_cacheControlLightLightColor == null) 
                {
                    _cacheControlLightLightColor = CreateInstance(SystemResourceKeyID.ControlLightLightColor); 
                } 

                return _cacheControlLightLightColor; 
            }
        },

        /// <summary> 
        ///     ControlTextColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ControlTextColorKey: 
        {
            get:function() 
            {
                if (_cacheControlTextColor == null)
                {
                    _cacheControlTextColor = CreateInstance(SystemResourceKeyID.ControlTextColor); 
                }
 
                return _cacheControlTextColor; 
            }
        }, 

        /// <summary>
        ///     DesktopColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ DesktopColorKey:
        { 
            get:function() 
            {
                if (_cacheDesktopColor == null) 
                {
                    _cacheDesktopColor = CreateInstance(SystemResourceKeyID.DesktopColor);
                }
 
                return _cacheDesktopColor;
            } 
        },

        /// <summary> 
        ///     GradientActiveCaptionColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ GradientActiveCaptionColorKey:
        { 
            get:function()
            { 
                if (_cacheGradientActiveCaptionColor == null) 
                {
                    _cacheGradientActiveCaptionColor = CreateInstance(SystemResourceKeyID.GradientActiveCaptionColor); 
                }

                return _cacheGradientActiveCaptionColor;
            } 
        },
 
        /// <summary> 
        ///     GradientInactiveCaptionColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ GradientInactiveCaptionColorKey:
        {
            get:function()
            { 
                if (_cacheGradientInactiveCaptionColor == null)
                { 
                    _cacheGradientInactiveCaptionColor = CreateInstance(SystemResourceKeyID.GradientInactiveCaptionColor); 
                }
 
                return _cacheGradientInactiveCaptionColor;
            }
        },
 
        /// <summary>
        ///     GrayTextColor System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ GrayTextColorKey:
        { 
            get:function()
            {
                if (_cacheGrayTextColor == null)
                { 
                    _cacheGrayTextColor = CreateInstance(SystemResourceKeyID.GrayTextColor);
                } 
 
                return _cacheGrayTextColor;
            } 
        },

        /// <summary>
        ///     HighlightColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ HighlightColorKey: 
        { 
            get:function()
            { 
                if (_cacheHighlightColor == null)
                {
                    _cacheHighlightColor = CreateInstance(SystemResourceKeyID.HighlightColor);
                } 

                return _cacheHighlightColor; 
            } 
        },
 
        /// <summary>
        ///     HighlightTextColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ HighlightTextColorKey: 
        {
            get:function() 
            { 
                if (_cacheHighlightTextColor == null)
                { 
                    _cacheHighlightTextColor = CreateInstance(SystemResourceKeyID.HighlightTextColor);
                }

                return _cacheHighlightTextColor; 
            }
        }, 
 
        /// <summary>
        ///     HotTrackColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ HotTrackColorKey:
        {
            get:function() 
            {
                if (_cacheHotTrackColor == null) 
                { 
                    _cacheHotTrackColor = CreateInstance(SystemResourceKeyID.HotTrackColor);
                } 

                return _cacheHotTrackColor;
            }
        }, 

        /// <summary> 
        ///     InactiveBorderColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ InactiveBorderColorKey: 
        {
            get:function()
            {
                if (_cacheInactiveBorderColor == null) 
                {
                    _cacheInactiveBorderColor = CreateInstance(SystemResourceKeyID.InactiveBorderColor); 
                } 

                return _cacheInactiveBorderColor; 
            }
        },

        /// <summary> 
        ///     InactiveCaptionColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ InactiveCaptionColorKey: 
        {
            get:function() 
            {
                if (_cacheInactiveCaptionColor == null)
                {
                    _cacheInactiveCaptionColor = CreateInstance(SystemResourceKeyID.InactiveCaptionColor); 
                }
 
                return _cacheInactiveCaptionColor; 
            }
        }, 

        /// <summary>
        ///     InactiveCaptionTextColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ InactiveCaptionTextColorKey:
        { 
            get:function() 
            {
                if (_cacheInactiveCaptionTextColor == null) 
                {
                    _cacheInactiveCaptionTextColor = CreateInstance(SystemResourceKeyID.InactiveCaptionTextColor);
                }
 
                return _cacheInactiveCaptionTextColor;
            } 
        },

        /// <summary> 
        ///     InfoColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ InfoColorKey:
        { 
            get:function()
            { 
                if (_cacheInfoColor == null) 
                {
                    _cacheInfoColor = CreateInstance(SystemResourceKeyID.InfoColor); 
                }

                return _cacheInfoColor;
            } 
        },
 
        /// <summary> 
        ///     InfoTextColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ InfoTextColorKey:
        {
            get:function()
            { 
                if (_cacheInfoTextColor == null)
                { 
                    _cacheInfoTextColor = CreateInstance(SystemResourceKeyID.InfoTextColor); 
                }
 
                return _cacheInfoTextColor;
            }
        },
 
        /// <summary>
        ///     MenuColor System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ MenuColorKey:
        { 
            get:function()
            {
                if (_cacheMenuColor == null)
                { 
                    _cacheMenuColor = CreateInstance(SystemResourceKeyID.MenuColor);
                } 
 
                return _cacheMenuColor;
            } 
        },

        /// <summary>
        ///     MenuBarColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuBarColorKey: 
        { 
            get:function()
            { 
                if (_cacheMenuBarColor == null)
                {
                    _cacheMenuBarColor = CreateInstance(SystemResourceKeyID.MenuBarColor);
                } 

                return _cacheMenuBarColor; 
            } 
        },
 
        /// <summary>
        ///     MenuHighlightColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ MenuHighlightColorKey: 
        {
            get:function() 
            { 
                if (_cacheMenuHighlightColor == null)
                { 
                    _cacheMenuHighlightColor = CreateInstance(SystemResourceKeyID.MenuHighlightColor);
                }

                return _cacheMenuHighlightColor; 
            }
        }, 
 
        /// <summary>
        ///     MenuTextColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuTextColorKey:
        {
            get:function() 
            {
                if (_cacheMenuTextColor == null) 
                { 
                    _cacheMenuTextColor = CreateInstance(SystemResourceKeyID.MenuTextColor);
                } 

                return _cacheMenuTextColor;
            }
        }, 

        /// <summary> 
        ///     ScrollBarColor System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ScrollBarColorKey: 
        {
            get:function()
            {
                if (_cacheScrollBarColor == null) 
                {
                    _cacheScrollBarColor = CreateInstance(SystemResourceKeyID.ScrollBarColor); 
                } 

                return _cacheScrollBarColor; 
            }
        },

        /// <summary> 
        ///     WindowColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ WindowColorKey: 
        {
            get:function() 
            {
                if (_cacheWindowColor == null)
                {
                    _cacheWindowColor = CreateInstance(SystemResourceKeyID.WindowColor); 
                }
 
                return _cacheWindowColor; 
            }
        }, 

        /// <summary>
        ///     WindowFrameColor System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ WindowFrameColorKey:
        { 
            get:function() 
            {
                if (_cacheWindowFrameColor == null) 
                {
                    _cacheWindowFrameColor = CreateInstance(SystemResourceKeyID.WindowFrameColor);
                }
 
                return _cacheWindowFrameColor;
            } 
        }, 

        /// <summary> 
        ///     WindowTextColor System Resource Key
        /// </summary>
        /*public static ResourceKey*/ WindowTextColorKey:
        { 
            get:function()
            { 
                if (_cacheWindowTextColor == null) 
                {
                    _cacheWindowTextColor = CreateInstance(SystemResourceKeyID.WindowTextColor); 
                }

                return _cacheWindowTextColor;
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ ActiveBorderBrush:
        { 
            get:function() 
            {
                return MakeBrush(CacheSlot.ActiveBorder); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ ActiveCaptionBrush: 
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.ActiveCaption);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ ActiveCaptionTextBrush: 
        {
            get:function()
            {
                return MakeBrush(CacheSlot.ActiveCaptionText); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ AppWorkspaceBrush:
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.AppWorkspace); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ ControlBrush: 
        {
            get:function() 
            { 
                return MakeBrush(CacheSlot.Control);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ ControlDarkBrush: 
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.ControlDark);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static SolidColorBrush*/ ControlDarkDarkBrush:
        { 
            get:function()
            {
                return MakeBrush(CacheSlot.ControlDarkDark);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ ControlLightBrush:
        {
            get:function()
            { 
                return MakeBrush(CacheSlot.ControlLight);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ ControlLightLightBrush:
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.ControlLightLight); 
            }
        }, 

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ ControlTextBrush:
        { 
            get:function() 
            {
                return MakeBrush(CacheSlot.ControlText); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ DesktopBrush: 
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.Desktop);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ GradientActiveCaptionBrush: 
        {
            get:function()
            {
                return MakeBrush(CacheSlot.GradientActiveCaption); 
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ GradientInactiveCaptionBrush:
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.GradientInactiveCaption); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ GrayTextBrush: 
        {
            get:function() 
            { 
                return MakeBrush(CacheSlot.GrayText);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ HighlightBrush: 
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.Highlight);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static SolidColorBrush*/ HighlightTextBrush:
        { 
            get:function()
            {
                return MakeBrush(CacheSlot.HighlightText);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ HotTrackBrush:
        {
            get:function()
            { 
                return MakeBrush(CacheSlot.HotTrack);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ InactiveBorderBrush:
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.InactiveBorder); 
            }
        },

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ InactiveCaptionBrush:
        { 
            get:function() 
            {
                return MakeBrush(CacheSlot.InactiveCaption); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ InactiveCaptionTextBrush: 
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.InactiveCaptionText);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ InfoBrush: 
        {
            get:function()
            {
                return MakeBrush(CacheSlot.Info); 
            }
        }, 
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ InfoTextBrush:
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.InfoText); 
            } 
        },
 
        /// <summary>
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ MenuBrush: 
        {
            get:function() 
            { 
                return MakeBrush(CacheSlot.Menu);
            } 
        },

        /// <summary>
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ MenuBarBrush: 
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.MenuBar);
            }
        },
 
        /// <summary>
        ///     System color of the same name. 
        /// </summary> 
        /*public static SolidColorBrush*/ MenuHighlightBrush:
        { 
            get:function()
            {
                return MakeBrush(CacheSlot.MenuHighlight);
            } 
        },
 
        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ MenuTextBrush:
        {
            get:function()
            { 
                return MakeBrush(CacheSlot.MenuText);
            } 
        }, 

        /// <summary> 
        ///     System color of the same name.
        /// </summary>
        /*public static SolidColorBrush*/ ScrollBarBrush:
        { 
            get:function()
            { 
                return MakeBrush(CacheSlot.ScrollBar); 
            }
        }, 

        /// <summary>
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ WindowBrush:
        { 
            get:function() 
            {
                return MakeBrush(CacheSlot.Window); 
            }
        },

        /// <summary> 
        ///     System color of the same name.
        /// </summary> 
        /*public static SolidColorBrush*/ WindowFrameBrush: 
        {
            get:function() 
            {
                return MakeBrush(CacheSlot.WindowFrame);
            }
        }, 

        /// <summary> 
        ///     System color of the same name. 
        /// </summary>
        /*public static SolidColorBrush*/ WindowTextBrush: 
        {
            get:function()
            {
                return MakeBrush(CacheSlot.WindowText); 
            }
        }, 
 
        /// <summary>
        ///     Inactive selection highlight brush. 
        /// </summary>
        /// <remarks>
        ///     Please note that this property does not have an equivalent system color.
        /// </remarks> 
        /*public static SolidColorBrush*/ InactiveSelectionHighlightBrush:
        { 
            get:function() 
            {
                if (SystemParameters.HighContrast) 
                {
                    return SystemColors.HighlightBrush;
                }
                else 
                {
                    return SystemColors.ControlBrush; 
                } 
            }
        }, 

        /// <summary>
        ///     Inactive selection highlight text brush.
        /// </summary> 
        /// <remarks>
        ///     Please note that this property does not have an equivalent system color. 
        /// </remarks> 
        /*public static SolidColorBrush*/ InactiveSelectionHighlightTextBrush:
        { 
            get:function()
            {
                if (SystemParameters.HighContrast)
                { 
                    return SystemColors.HighlightTextBrush;
                } 
                else 
                {
                    return SystemColors.ControlTextBrush; 
                }
            }
        },
 
        /// <summary> 
        ///     ActiveBorderBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ ActiveBorderBrushKey:
        { 
            get:function()
            { 
                if (_cacheActiveBorderBrush == null) 
                {
                    _cacheActiveBorderBrush = CreateInstance(SystemResourceKeyID.ActiveBorderBrush); 
                }

                return _cacheActiveBorderBrush;
            } 
        },
 
        /// <summary> 
        ///     ActiveCaptionBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ActiveCaptionBrushKey:
        {
            get:function()
            { 
                if (_cacheActiveCaptionBrush == null)
                { 
                    _cacheActiveCaptionBrush = CreateInstance(SystemResourceKeyID.ActiveCaptionBrush); 
                }
 
                return _cacheActiveCaptionBrush;
            }
        },
 
        /// <summary>
        ///     ActiveCaptionTextBrush System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ ActiveCaptionTextBrushKey:
        { 
            get:function()
            {
                if (_cacheActiveCaptionTextBrush == null)
                { 
                    _cacheActiveCaptionTextBrush = CreateInstance(SystemResourceKeyID.ActiveCaptionTextBrush);
                } 
 
                return _cacheActiveCaptionTextBrush;
            } 
        },

        /// <summary>
        ///     AppWorkspaceBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ AppWorkspaceBrushKey: 
        { 
            get:function()
            { 
                if (_cacheAppWorkspaceBrush == null)
                {
                    _cacheAppWorkspaceBrush = CreateInstance(SystemResourceKeyID.AppWorkspaceBrush);
                } 

                return _cacheAppWorkspaceBrush; 
            } 
        },
 
        /// <summary>
        ///     ControlBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ ControlBrushKey: 
        {
            get:function() 
            { 
                if (_cacheControlBrush == null)
                { 
                    _cacheControlBrush = CreateInstance(SystemResourceKeyID.ControlBrush);
                }

                return _cacheControlBrush; 
            }
        }, 
 
        /// <summary>
        ///     ControlDarkBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ControlDarkBrushKey:
        {
            get:function() 
            {
                if (_cacheControlDarkBrush == null) 
                { 
                    _cacheControlDarkBrush = CreateInstance(SystemResourceKeyID.ControlDarkBrush);
                } 

                return _cacheControlDarkBrush;
            }
        }, 

        /// <summary> 
        ///     ControlDarkDarkBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ ControlDarkDarkBrushKey: 
        {
            get:function()
            {
                if (_cacheControlDarkDarkBrush == null) 
                {
                    _cacheControlDarkDarkBrush = CreateInstance(SystemResourceKeyID.ControlDarkDarkBrush); 
                } 

                return _cacheControlDarkDarkBrush; 
            }
        },

        /// <summary> 
        ///     ControlLightBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ControlLightBrushKey: 
        {
            get:function() 
            {
                if (_cacheControlLightBrush == null)
                {
                    _cacheControlLightBrush = CreateInstance(SystemResourceKeyID.ControlLightBrush); 
                }
 
                return _cacheControlLightBrush; 
            }
        }, 

        /// <summary>
        ///     ControlLightLightBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ControlLightLightBrushKey:
        { 
            get:function() 
            {
                if (_cacheControlLightLightBrush == null) 
                {
                    _cacheControlLightLightBrush = CreateInstance(SystemResourceKeyID.ControlLightLightBrush);
                }
 
                return _cacheControlLightLightBrush;
            } 
        }, 

        /// <summary> 
        ///     ControlTextBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ ControlTextBrushKey:
        { 
            get:function()
            { 
                if (_cacheControlTextBrush == null) 
                {
                    _cacheControlTextBrush = CreateInstance(SystemResourceKeyID.ControlTextBrush); 
                }

                return _cacheControlTextBrush;
            } 
        },
 
        /// <summary> 
        ///     DesktopBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ DesktopBrushKey:
        {
            get:function()
            { 
                if (_cacheDesktopBrush == null)
                { 
                    _cacheDesktopBrush = CreateInstance(SystemResourceKeyID.DesktopBrush); 
                }
 
                return _cacheDesktopBrush;
            }
        },
 
        /// <summary>
        ///     GradientActiveCaptionBrush System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ GradientActiveCaptionBrushKey:
        { 
            get:function()
            {
                if (_cacheGradientActiveCaptionBrush == null)
                { 
                    _cacheGradientActiveCaptionBrush = CreateInstance(SystemResourceKeyID.GradientActiveCaptionBrush);
                } 
 
                return _cacheGradientActiveCaptionBrush;
            } 
        },

        /// <summary>
        ///     GradientInactiveCaptionBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ GradientInactiveCaptionBrushKey: 
        { 
            get:function()
            { 
                if (_cacheGradientInactiveCaptionBrush == null)
                {
                    _cacheGradientInactiveCaptionBrush = CreateInstance(SystemResourceKeyID.GradientInactiveCaptionBrush);
                } 

                return _cacheGradientInactiveCaptionBrush; 
            } 
        },
 
        /// <summary>
        ///     GrayTextBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ GrayTextBrushKey: 
        {
            get:function() 
            { 
                if (_cacheGrayTextBrush == null)
                { 
                    _cacheGrayTextBrush = CreateInstance(SystemResourceKeyID.GrayTextBrush);
                }

                return _cacheGrayTextBrush; 
            }
        }, 
 
        /// <summary>
        ///     HighlightBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ HighlightBrushKey:
        {
            get:function() 
            {
                if (_cacheHighlightBrush == null) 
                { 
                    _cacheHighlightBrush = CreateInstance(SystemResourceKeyID.HighlightBrush);
                } 

                return _cacheHighlightBrush;
            }
        }, 

        /// <summary> 
        ///     HighlightTextBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ HighlightTextBrushKey: 
        {
            get:function()
            {
                if (_cacheHighlightTextBrush == null) 
                {
                    _cacheHighlightTextBrush = CreateInstance(SystemResourceKeyID.HighlightTextBrush); 
                } 

                return _cacheHighlightTextBrush; 
            }
        },

        /// <summary> 
        ///     HotTrackBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ HotTrackBrushKey: 
        {
            get:function() 
            {
                if (_cacheHotTrackBrush == null)
                {
                    _cacheHotTrackBrush = CreateInstance(SystemResourceKeyID.HotTrackBrush); 
                }
 
                return _cacheHotTrackBrush; 
            }
        }, 

        /// <summary>
        ///     InactiveBorderBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ InactiveBorderBrushKey:
        { 
            get:function() 
            {
                if (_cacheInactiveBorderBrush == null) 
                {
                    _cacheInactiveBorderBrush = CreateInstance(SystemResourceKeyID.InactiveBorderBrush);
                }
 
                return _cacheInactiveBorderBrush;
            } 
        }, 

        /// <summary> 
        ///     InactiveCaptionBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ InactiveCaptionBrushKey:
        { 
            get:function()
            { 
                if (_cacheInactiveCaptionBrush == null) 
                {
                    _cacheInactiveCaptionBrush = CreateInstance(SystemResourceKeyID.InactiveCaptionBrush); 
                }

                return _cacheInactiveCaptionBrush;
            } 
        },
 
        /// <summary> 
        ///     InactiveCaptionTextBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ InactiveCaptionTextBrushKey:
        {
            get:function()
            { 
                if (_cacheInactiveCaptionTextBrush == null)
                { 
                    _cacheInactiveCaptionTextBrush = CreateInstance(SystemResourceKeyID.InactiveCaptionTextBrush); 
                }
 
                return _cacheInactiveCaptionTextBrush;
            }
        },
 
        /// <summary>
        ///     InfoBrush System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ InfoBrushKey:
        { 
            get:function()
            {
                if (_cacheInfoBrush == null)
                { 
                    _cacheInfoBrush = CreateInstance(SystemResourceKeyID.InfoBrush);
                } 
 
                return _cacheInfoBrush;
            } 
        },

        /// <summary>
        ///     InfoTextBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ InfoTextBrushKey: 
        { 
            get:function()
            { 
                if (_cacheInfoTextBrush == null)
                {
                    _cacheInfoTextBrush = CreateInstance(SystemResourceKeyID.InfoTextBrush);
                } 

                return _cacheInfoTextBrush; 
            } 
        },
 
        /// <summary>
        ///     MenuBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ MenuBrushKey: 
        {
            get:function() 
            { 
                if (_cacheMenuBrush == null)
                { 
                    _cacheMenuBrush = CreateInstance(SystemResourceKeyID.MenuBrush);
                }

                return _cacheMenuBrush; 
            }
        }, 
 
        /// <summary>
        ///     MenuBarBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuBarBrushKey:
        {
            get:function() 
            {
                if (_cacheMenuBarBrush == null) 
                { 
                    _cacheMenuBarBrush = CreateInstance(SystemResourceKeyID.MenuBarBrush);
                } 

                return _cacheMenuBarBrush;
            }
        }, 

        /// <summary> 
        ///     MenuHighlightBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuHighlightBrushKey: 
        {
            get:function()
            {
                if (_cacheMenuHighlightBrush == null) 
                {
                    _cacheMenuHighlightBrush = CreateInstance(SystemResourceKeyID.MenuHighlightBrush); 
                } 

                return _cacheMenuHighlightBrush; 
            }
        },

        /// <summary> 
        ///     MenuTextBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ MenuTextBrushKey: 
        {
            get:function() 
            {
                if (_cacheMenuTextBrush == null)
                {
                    _cacheMenuTextBrush = CreateInstance(SystemResourceKeyID.MenuTextBrush); 
                }
 
                return _cacheMenuTextBrush; 
            }
        }, 

        /// <summary>
        ///     ScrollBarBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ ScrollBarBrushKey:
        { 
            get:function() 
            {
                if (_cacheScrollBarBrush == null) 
                {
                    _cacheScrollBarBrush = CreateInstance(SystemResourceKeyID.ScrollBarBrush);
                }
 
                return _cacheScrollBarBrush;
            } 
        }, 

        /// <summary> 
        ///     WindowBrush System Resource Key
        /// </summary>
        /*public static ResourceKey*/ WindowBrushKey:
        { 
            get:function()
            { 
                if (_cacheWindowBrush == null) 
                {
                    _cacheWindowBrush = CreateInstance(SystemResourceKeyID.WindowBrush); 
                }

                return _cacheWindowBrush;
            } 
        },
 
        /// <summary> 
        ///     WindowFrameBrush System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ WindowFrameBrushKey:
        {
            get:function()
            { 
                if (_cacheWindowFrameBrush == null)
                { 
                    _cacheWindowFrameBrush = CreateInstance(SystemResourceKeyID.WindowFrameBrush); 
                }
 
                return _cacheWindowFrameBrush;
            }
        },
 
        /// <summary>
        ///     WindowTextBrush System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ WindowTextBrushKey:
        { 
            get:function()
            {
                if (_cacheWindowTextBrush == null)
                { 
                    _cacheWindowTextBrush = CreateInstance(SystemResourceKeyID.WindowTextBrush);
                } 
 
                return _cacheWindowTextBrush;
            } 
        },

        /// <summary>
        ///     InactiveSelectionHighlightBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ InactiveSelectionHighlightBrushKey: 
        { 
            get:function()
            { 
                if (FrameworkCompatibilityPreferences.GetAreInactiveSelectionHighlightBrushKeysSupported())
                {
                    if (_cacheInactiveSelectionHighlightBrush == null)
                    { 
                        _cacheInactiveSelectionHighlightBrush = CreateInstance(SystemResourceKeyID.InactiveSelectionHighlightBrush);
                    } 
 
                    return _cacheInactiveSelectionHighlightBrush;
                } 
                else
                {
                    return ControlBrushKey;
                } 
            }
        },
 
        /// <summary>
        ///     InactiveSelectionHighlightTextBrush System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ InactiveSelectionHighlightTextBrushKey:
        {
            get:function() 
            {
                if (FrameworkCompatibilityPreferences.GetAreInactiveSelectionHighlightBrushKeysSupported()) 
                { 
                    if (_cacheInactiveSelectionHighlightTextBrush == null)
                    { 
                        _cacheInactiveSelectionHighlightTextBrush = CreateInstance(SystemResourceKeyID.InactiveSelectionHighlightTextBrush);
                    }

                    return _cacheInactiveSelectionHighlightTextBrush; 
                }
                else 
                { 
                    return ControlTextBrushKey;
                } 
            }
        }		  
	});
	

//    private static SystemResourceKey 
	function CreateInstance(/*SystemResourceKeyID*/ KeyId) 
    { 
        return new SystemResourceKey(KeyId);
    } 

	
	   // Shift count and bit mask for A, R, G, B components 
    /*private const int*/var AlphaShift  = 24; 
    /*private const int*/var RedShift    = 16;
    /*private const int*/var GreenShift  = 8; 
    /*private const int*/var BlueShift   = 0;

    /*private const int*/var Win32RedShift    = 0;
    /*private const int*/var Win32GreenShift  = 8; 
    /*private const int*/var Win32BlueShift   = 16;
    
//    private static int 
    function Encode(/*int*/ alpha, /*int*/ red, /*int*/ green, /*int*/ blue) 
    {
        return red << RedShift | green << GreenShift | blue << BlueShift | alpha << AlphaShift; 
    }

//    private static int 
    function FromWin32Value(/*int*/ value)
    { 
        return Encode(255,
            (value >> Win32RedShift) & 0xFF, 
            (value >> Win32GreenShift) & 0xFF, 
            (value >> Win32BlueShift) & 0xFF);
    } 

    /// <summary>
    ///     Query for system colors.
    /// </summary> 
    /// <param name="slot">The color slot.</param>
    /// <returns>The system color.</returns> 
//    private static Color 
    function GetSystemColor(/*CacheSlot*/ slot) 
    {
        var color; 

//        if (!_colorCacheValid[slot]) 
//        {
            argb = FromWin32Value(0x22222222); 
            color = Color.FromArgb(((argb & 0xff000000) >>24), ((argb & 0x00ff0000) >>16), ((argb & 0x0000ff00) >>8), (argb & 0x000000ff));

//            _colorCache[slot] = color;
//            _colorCacheValid[slot] = true; 
//        }
//        else 
//        { 
//            color = _colorCache[slot];
//        } 

        return color;
    } 

//    private static SolidColorBrush 
    function MakeBrush(/*CacheSlot*/ slot) 
    { 
        var brush;

//        if (!_brushCacheValid[slot])
//        { 
            brush = new SolidColorBrush(GetSystemColor(slot));
            brush.Freeze(); 

//            _brushCache[slot] = brush;
//            _brushCacheValid[slot] = true; 
//        }
//        else
//        {
//            brush = _brushCache[slot]; 
//        }

        return brush;
    } 

//    private static int 
    function SlotToFlag(/*CacheSlot*/ slot)
    {
        // FxCop: Hashtable would be overkill, using switch instead 

        switch (slot) 
        { 
            case CacheSlot.ActiveBorder:
                return NativeMethods.Win32SystemColors.ActiveBorder; 
            case CacheSlot.ActiveCaption:
                return NativeMethods.Win32SystemColors.ActiveCaption;
            case CacheSlot.ActiveCaptionText:
                return NativeMethods.Win32SystemColors.ActiveCaptionText; 
            case CacheSlot.AppWorkspace:
                return NativeMethods.Win32SystemColors.AppWorkspace; 
            case CacheSlot.Control: 
                return NativeMethods.Win32SystemColors.Control;
            case CacheSlot.ControlDark: 
                return NativeMethods.Win32SystemColors.ControlDark;
            case CacheSlot.ControlDarkDark:
                return NativeMethods.Win32SystemColors.ControlDarkDark;
            case CacheSlot.ControlLight: 
                return NativeMethods.Win32SystemColors.ControlLight;
            case CacheSlot.ControlLightLight: 
                return NativeMethods.Win32SystemColors.ControlLightLight; 
            case CacheSlot.ControlText:
                return NativeMethods.Win32SystemColors.ControlText; 
            case CacheSlot.Desktop:
                return NativeMethods.Win32SystemColors.Desktop;
            case CacheSlot.GradientActiveCaption:
                return NativeMethods.Win32SystemColors.GradientActiveCaption; 
            case CacheSlot.GradientInactiveCaption:
                return NativeMethods.Win32SystemColors.GradientInactiveCaption; 
            case CacheSlot.GrayText: 
                return NativeMethods.Win32SystemColors.GrayText;
            case CacheSlot.Highlight: 
                return NativeMethods.Win32SystemColors.Highlight;
            case CacheSlot.HighlightText:
                return NativeMethods.Win32SystemColors.HighlightText;
            case CacheSlot.HotTrack: 
                return NativeMethods.Win32SystemColors.HotTrack;
            case CacheSlot.InactiveBorder: 
                return NativeMethods.Win32SystemColors.InactiveBorder; 
            case CacheSlot.InactiveCaption:
                return NativeMethods.Win32SystemColors.InactiveCaption; 
            case CacheSlot.InactiveCaptionText:
                return NativeMethods.Win32SystemColors.InactiveCaptionText;
            case CacheSlot.Info:
                return NativeMethods.Win32SystemColors.Info; 
            case CacheSlot.InfoText:
                return NativeMethods.Win32SystemColors.InfoText; 
            case CacheSlot.Menu: 
                return NativeMethods.Win32SystemColors.Menu;
            case CacheSlot.MenuBar: 
                return NativeMethods.Win32SystemColors.MenuBar;
            case CacheSlot.MenuHighlight:
                return NativeMethods.Win32SystemColors.MenuHighlight;
            case CacheSlot.MenuText: 
                return NativeMethods.Win32SystemColors.MenuText;
            case CacheSlot.ScrollBar: 
                return NativeMethods.Win32SystemColors.ScrollBar; 
            case CacheSlot.Window:
                return NativeMethods.Win32SystemColors.Window; 
            case CacheSlot.WindowFrame:
                return NativeMethods.Win32SystemColors.WindowFrame;
            case CacheSlot.WindowText:
                return NativeMethods.Win32SystemColors.WindowText; 
        }

        return 0; 
    }
	
	SystemColors.Type = new Type("SystemColors", SystemColors, [Object.Type]);
	return SystemColors;
});

       

       
 
        
 
//        private static BitArray _colorCacheValid = new BitArray(CacheSlot.NumSlots);
//        private static Color[] _colorCache = new Color[CacheSlot.NumSlots];
//        private static BitArray _brushCacheValid = new BitArray(CacheSlot.NumSlots);
//        private static SolidColorBrush[] _brushCache = new SolidColorBrush[CacheSlot.NumSlots]; 



