/**
 * SystemFonts
 */

define(["dojo/_base/declare", "system/Type", "windows/SystemParameters", "windows/FontStyles", "windows/FontWeights"], 
		function(declare, Type, SystemParameters, FontStyles, FontWeights){
	
	/*private static TextDecorationCollection*/ var  _iconFontTextDecorations; 
    /*private static TextDecorationCollection*/ var  _messageFontTextDecorations;
    /*private static TextDecorationCollection*/ var  _statusFontTextDecorations; 
    /*private static TextDecorationCollection*/ var  _menuFontTextDecorations; 
    /*private static TextDecorationCollection*/ var  _smallCaptionFontTextDecorations;
    /*private static TextDecorationCollection*/ var  _captionFontTextDecorations; 

    /*private static FontFamily*/ var  _iconFontFamily;
    /*private static FontFamily*/ var  _messageFontFamily;
    /*private static FontFamily*/ var  _statusFontFamily; 
    /*private static FontFamily*/ var  _menuFontFamily;
    /*private static FontFamily*/ var  _smallCaptionFontFamily; 
    /*private static FontFamily*/ var  _captionFontFamily; 

    /*private static SystemResourceKey*/ var  _cacheIconFontSize; 
    /*private static SystemResourceKey*/ var  _cacheIconFontFamily;
    /*private static SystemResourceKey*/ var  _cacheIconFontStyle;
    /*private static SystemResourceKey*/ var  _cacheIconFontWeight;
    /*private static SystemResourceKey*/ var  _cacheIconFontTextDecorations; 
    /*private static SystemResourceKey*/ var  _cacheCaptionFontSize;
    /*private static SystemResourceKey*/ var  _cacheCaptionFontFamily; 
    /*private static SystemResourceKey*/ var  _cacheCaptionFontStyle; 
    /*private static SystemResourceKey*/ var  _cacheCaptionFontWeight;
    /*private static SystemResourceKey*/ var  _cacheCaptionFontTextDecorations; 
    /*private static SystemResourceKey*/ var  _cacheSmallCaptionFontSize;
    /*private static SystemResourceKey*/ var  _cacheSmallCaptionFontFamily;
    /*private static SystemResourceKey*/ var  _cacheSmallCaptionFontStyle;
    /*private static SystemResourceKey*/ var  _cacheSmallCaptionFontWeight; 
    /*private static SystemResourceKey*/ var  _cacheSmallCaptionFontTextDecorations;
    /*private static SystemResourceKey*/ var  _cacheMenuFontSize; 
    /*private static SystemResourceKey*/ var  _cacheMenuFontFamily; 
    /*private static SystemResourceKey*/ var  _cacheMenuFontStyle;
    /*private static SystemResourceKey*/ var  _cacheMenuFontWeight; 
    /*private static SystemResourceKey*/ var  _cacheMenuFontTextDecorations;
    /*private static SystemResourceKey*/ var  _cacheStatusFontSize;
    /*private static SystemResourceKey*/ var  _cacheStatusFontFamily;
    /*private static SystemResourceKey*/ var  _cacheStatusFontStyle; 
    /*private static SystemResourceKey*/ var  _cacheStatusFontWeight;
    /*private static SystemResourceKey*/ var  _cacheStatusFontTextDecorations; 
    /*private static SystemResourceKey*/ var  _cacheMessageFontSize; 
    /*private static SystemResourceKey*/ var  _cacheMessageFontFamily;
    /*private static SystemResourceKey*/ var  _cacheMessageFontStyle; 
    /*private static SystemResourceKey*/ var  _cacheMessageFontWeight;
    /*private static SystemResourceKey*/ var  _cacheMessageFontTextDecorations;
    
	var SystemFonts = declare("SystemFonts", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(SystemFonts,{
        /// <summary>
        ///     Maps to SPI_GETICONTITLELOGFONT 
        /// </summary>
//        public static double 
		IconFontSize:
        { 
            get:function()
            { 
                return ConvertFontHeight(SystemParameters.IconMetrics.lfFont.lfHeight);
            }
        },
 
        /// <summary>
        ///     Maps to SPI_GETICONTITLELOGFONT 
        /// </summary> 
//        public static FontFamily 
		IconFontFamily:
        { 
            get:function()
            {
                if (_iconFontFamily == null)
                { 
                    _iconFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.IconMetrics.lfFont.lfFaceName);
                } 
 
                return _iconFontFamily;
            } 
        },

        /// <summary>
        ///     Maps to SPI_GETICONTITLELOGFONT 
        /// </summary>
//        public static FontStyle 
        IconFontStyle: 
        { 
            get:function()
            { 
                return (SystemParameters.IconMetrics.lfFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal;
            }
        },
 
        /// <summary>
        ///     Maps to SPI_GETICONTITLELOGFONT 
        /// </summary> 
//        public static FontWeight 
        IconFontWeight:
        { 
            get:function()
            {
                return FontWeight.FromOpenTypeWeight(SystemParameters.IconMetrics.lfFont.lfWeight);
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_GETICONTITLELOGFONT
        /// </summary> 
//        public static TextDecorationCollection 
        IconFontTextDecorations:
        {
            get:function()
            { 
                if (_iconFontTextDecorations == null)
                { 
                    _iconFontTextDecorations = new TextDecorationCollection(); 

                    if (SystemParameters.IconMetrics.lfFont.lfUnderline != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Underline, _iconFontTextDecorations);
                    }
 
                    if (SystemParameters.IconMetrics.lfFont.lfStrikeOut != 0)
                    { 
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _iconFontTextDecorations); 
                    }
 
                    _iconFontTextDecorations.Freeze();
                }

                return _iconFontTextDecorations; 
            }
        }, 
 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static double 
        CaptionFontSize:
        {
            get:function() 
            {
                return ConvertFontHeight(SystemParameters.NonClientMetrics.lfCaptionFont.lfHeight); 
            } 
        },
 

        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontFamily 
        CaptionFontFamily:
        { 
            get:function() 
            {
                if (_captionFontFamily == null) 
                {
                    _captionFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.NonClientMetrics.lfCaptionFont.lfFaceName);
                }
 
                return _captionFontFamily;
            } 
        }, 

 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static FontStyle 
        CaptionFontStyle: 
        {
            get:function() 
            { 
                return (SystemParameters.NonClientMetrics.lfCaptionFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal;
            } 
        },


        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontWeight 
        CaptionFontWeight: 
        {
            get:function() 
            {
                return FontWeight.FromOpenTypeWeight(SystemParameters.NonClientMetrics.lfCaptionFont.lfWeight);
            }
        }, 

 
        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static TextDecorationCollection 
        CaptionFontTextDecorations:
        {
            get:function()
            { 
                if (_captionFontTextDecorations == null)
                { 
                    _captionFontTextDecorations = new TextDecorationCollection(); 

                    if (SystemParameters.NonClientMetrics.lfCaptionFont.lfUnderline != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Underline, _captionFontTextDecorations);
                    }
 
                    if (SystemParameters.NonClientMetrics.lfCaptionFont.lfStrikeOut != 0)
                    { 
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _captionFontTextDecorations); 
                    }
                    _captionFontTextDecorations.Freeze(); 
                }

                return _captionFontTextDecorations;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static double 
        SmallCaptionFontSize:
        {
            get:function()
            { 
                return ConvertFontHeight(SystemParameters.NonClientMetrics.lfSmCaptionFont.lfHeight);
            } 
        }, 

 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static FontFamily 
        SmallCaptionFontFamily: 
        {
            get:function() 
            { 
                if (_smallCaptionFontFamily == null)
                { 
                    _smallCaptionFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.NonClientMetrics.lfSmCaptionFont.lfFaceName);
                }

                return _smallCaptionFontFamily; 
            }
        }, 
 

        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static FontStyle 
        SmallCaptionFontStyle:
        { 
            get:function()
            { 
                return (SystemParameters.NonClientMetrics.lfSmCaptionFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal; 
            }
        }, 


        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static FontWeight 
        SmallCaptionFontWeight: 
        { 
            get:function()
            { 
                return FontWeight.FromOpenTypeWeight(SystemParameters.NonClientMetrics.lfSmCaptionFont.lfWeight);
            }
        },
 

        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static TextDecorationCollection 
        SmallCaptionFontTextDecorations: 
        {
            get:function()
            {
                if (_smallCaptionFontTextDecorations == null) 
                {
                   _smallCaptionFontTextDecorations = new TextDecorationCollection(); 
 
                    if (SystemParameters.NonClientMetrics.lfSmCaptionFont.lfUnderline != 0)
                    { 
                        CopyTextDecorationCollection(TextDecorations.Underline, _smallCaptionFontTextDecorations);
                    }

                    if (SystemParameters.NonClientMetrics.lfSmCaptionFont.lfStrikeOut != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _smallCaptionFontTextDecorations); 
                    } 

                    _smallCaptionFontTextDecorations.Freeze(); 
                }

                return _smallCaptionFontTextDecorations;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static double 
        MenuFontSize:
        {
            get:function()
            { 
                return ConvertFontHeight(SystemParameters.NonClientMetrics.lfMenuFont.lfHeight);
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static FontFamily 
        MenuFontFamily:
        { 
            get:function()
            { 
                if (_menuFontFamily == null) 
                {
                    _menuFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.NonClientMetrics.lfMenuFont.lfFaceName); 
                }

                return _menuFontFamily;
            } 
        },
 
        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontStyle 
        MenuFontStyle:
        {
            get:function()
            { 
                return (SystemParameters.NonClientMetrics.lfMenuFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal;
            } 
        }, 

        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static FontWeight 
        MenuFontWeight:
        { 
            get:function()
            { 
                return FontWeight.FromOpenTypeWeight(SystemParameters.NonClientMetrics.lfMenuFont.lfWeight); 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static TextDecorationCollection 
        MenuFontTextDecorations:
        { 
            get:function() 
            {
                if (_menuFontTextDecorations == null) 
                {
                   _menuFontTextDecorations = new TextDecorationCollection();

                    if (SystemParameters.NonClientMetrics.lfMenuFont.lfUnderline != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Underline, _menuFontTextDecorations); 
                    } 

                    if (SystemParameters.NonClientMetrics.lfMenuFont.lfStrikeOut != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _menuFontTextDecorations);
                    }
                    _menuFontTextDecorations.Freeze(); 
                }
 
                return _menuFontTextDecorations; 
            }
        }, 

        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static double 
        StatusFontSize:
        { 
            get:function() 
            {
                return ConvertFontHeight(SystemParameters.NonClientMetrics.lfStatusFont.lfHeight); 
            }
        },

 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary> 
//        public static FontFamily 
        StatusFontFamily:
        { 
            get:function()
            {
                if (_statusFontFamily == null)
                { 
                    _statusFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.NonClientMetrics.lfStatusFont.lfFaceName);
                } 
 
                return _statusFontFamily;
            } 
        },


        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontStyle 
        StatusFontStyle: 
        {
            get:function() 
            {
                return (SystemParameters.NonClientMetrics.lfStatusFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal;
            }
        }, 

 
        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontWeight 
        StatusFontWeight:
        {
            get:function()
            { 
                return FontWeight.FromOpenTypeWeight(SystemParameters.NonClientMetrics.lfStatusFont.lfWeight);
            } 
        }, 

 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary>
//        public static TextDecorationCollection 
        StatusFontTextDecorations: 
        {
            get:function() 
            { 

                if (_statusFontTextDecorations == null) 
                {
                   _statusFontTextDecorations = new TextDecorationCollection();

                    if (SystemParameters.NonClientMetrics.lfStatusFont.lfUnderline!= 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Underline, _statusFontTextDecorations); 
                    } 

                    if (SystemParameters.NonClientMetrics.lfStatusFont.lfStrikeOut != 0) 
                    {
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _statusFontTextDecorations);
                    }
                    _statusFontTextDecorations.Freeze(); 
                }
 
                return _statusFontTextDecorations; 
            }
        },

        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static double 
        MessageFontSize:
        { 
            get:function() 
            {
                return 10;//ConvertFontHeight(SystemParameters.NonClientMetrics.lfMessageFont.lfHeight); 
            }
        },

 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary> 
//        public static FontFamily 
        MessageFontFamily:
        { 
            get:function()
            {
                if (_messageFontFamily == null)
                { 
                    _messageFontFamily = new FontFamily("arial,serif"); //new FontFamily(SystemParameters.NonClientMetrics.lfMessageFont.lfFaceName);
                } 
 
                return _messageFontFamily;
            } 
        },


        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS
        /// </summary> 
//        public static FontStyle 
        MessageFontStyle: 
        {
            get:function() 
            {
                return FontStyles.Normal; //(SystemParameters.NonClientMetrics.lfMessageFont.lfItalic != 0) ? FontStyles.Italic : FontStyles.Normal;
            }
        }, 

        /// <summary> 
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static FontWeight 
        MessageFontWeight: 
        {
            get:function()
            {
                return FontWeights.Normal; //.FromOpenTypeWeight(SystemParameters.NonClientMetrics.lfMessageFont.lfWeight); 
            }
        }, 
 
        /// <summary>
        ///     Maps to SPI_NONCLIENTMETRICS 
        /// </summary>
//        public static TextDecorationCollection 
        MessageFontTextDecorations:
        {
            get:function() 
            {
                if (_messageFontTextDecorations == null) 
                { 
                    _messageFontTextDecorations = new TextDecorationCollection();
 
                    if (SystemParameters.NonClientMetrics.lfMessageFont.lfUnderline != 0)
                    {
                        CopyTextDecorationCollection(TextDecorations.Underline, _messageFontTextDecorations);
                    } 

                    if (SystemParameters.NonClientMetrics.lfMessageFont.lfStrikeOut != 0) 
                    { 
                        CopyTextDecorationCollection(TextDecorations.Strikethrough, _messageFontTextDecorations);
                    } 
                    _messageFontTextDecorations.Freeze();
                }

                return _messageFontTextDecorations; 
            }
        }, 
 
        /// <summary>
        ///     IconFontSize System Resource Key
        /// </summary>
        /*public static ResourceKey*/ IconFontSizeKey: 
        {
            get:function() 
            { 
                if (_cacheIconFontSize == null)
                { 
                    _cacheIconFontSize = CreateInstance(SystemResourceKeyID.IconFontSize);
                }

                return _cacheIconFontSize; 
            }
        }, 
 
        /// <summary>
        ///     IconFontFamily System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ IconFontFamilyKey:
        {
            get:function() 
            {
                if (_cacheIconFontFamily == null) 
                { 
                    _cacheIconFontFamily = CreateInstance(SystemResourceKeyID.IconFontFamily);
                } 

                return _cacheIconFontFamily;
            }
        }, 

        /// <summary> 
        ///     IconFontStyle System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ IconFontStyleKey: 
        {
            get:function()
            {
                if (_cacheIconFontStyle == null) 
                {
                    _cacheIconFontStyle = CreateInstance(SystemResourceKeyID.IconFontStyle); 
                } 

                return _cacheIconFontStyle; 
            }
        },

        /// <summary> 
        ///     IconFontWeight System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ IconFontWeightKey: 
        {
            get:function() 
            {
                if (_cacheIconFontWeight == null)
                {
                    _cacheIconFontWeight = CreateInstance(SystemResourceKeyID.IconFontWeight); 
                }
 
                return _cacheIconFontWeight; 
            }
        }, 

        /// <summary>
        ///     IconFontTextDecorations System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ IconFontTextDecorationsKey:
        { 
            get:function() 
            {
                if (_cacheIconFontTextDecorations == null) 
                {
                    _cacheIconFontTextDecorations = CreateInstance(SystemResourceKeyID.IconFontTextDecorations);
                }
 
                return _cacheIconFontTextDecorations;
            } 
        }, 

 


        /// <summary>
        ///     CaptionFontSize System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ CaptionFontSizeKey: 
        { 
            get:function()
            { 
                if (_cacheCaptionFontSize == null)
                {
                    _cacheCaptionFontSize = CreateInstance(SystemResourceKeyID.CaptionFontSize);
                } 

                return _cacheCaptionFontSize; 
            } 
        },
 
        /// <summary>
        ///     CaptionFontFamily System Resource Key
        /// </summary>
        /*public static ResourceKey*/ CaptionFontFamilyKey: 
        {
            get:function() 
            { 
                if (_cacheCaptionFontFamily == null)
                { 
                    _cacheCaptionFontFamily = CreateInstance(SystemResourceKeyID.CaptionFontFamily);
                }

                return _cacheCaptionFontFamily; 
            }
        }, 
 
        /// <summary>
        ///     CaptionFontStyle System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ CaptionFontStyleKey:
        {
            get:function() 
            {
                if (_cacheCaptionFontStyle == null) 
                { 
                    _cacheCaptionFontStyle = CreateInstance(SystemResourceKeyID.CaptionFontStyle);
                } 

                return _cacheCaptionFontStyle;
            }
        }, 

        /// <summary> 
        ///     CaptionFontWeight System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ CaptionFontWeightKey: 
        {
            get:function()
            {
                if (_cacheCaptionFontWeight == null) 
                {
                    _cacheCaptionFontWeight = CreateInstance(SystemResourceKeyID.CaptionFontWeight); 
                } 

                return _cacheCaptionFontWeight; 
            }
        },

        /// <summary> 
        ///     CaptionFontTextDecorations System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ CaptionFontTextDecorationsKey: 
        {
            get:function() 
            {
                if (_cacheCaptionFontTextDecorations == null)
                {
                    _cacheCaptionFontTextDecorations = CreateInstance(SystemResourceKeyID.CaptionFontTextDecorations); 
                }
 
                return _cacheCaptionFontTextDecorations; 
            }
        }, 

        /// <summary>
        ///     SmallCaptionFontSize System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ SmallCaptionFontSizeKey:
        { 
            get:function() 
            {
                if (_cacheSmallCaptionFontSize == null) 
                {
                    _cacheSmallCaptionFontSize = CreateInstance(SystemResourceKeyID.SmallCaptionFontSize);
                }
 
                return _cacheSmallCaptionFontSize;
            } 
        }, 

        /// <summary> 
        ///     SmallCaptionFontFamily System Resource Key
        /// </summary>
        /*public static ResourceKey*/ SmallCaptionFontFamilyKey:
        { 
            get:function()
            { 
                if (_cacheSmallCaptionFontFamily == null) 
                {
                    _cacheSmallCaptionFontFamily = CreateInstance(SystemResourceKeyID.SmallCaptionFontFamily); 
                }

                return _cacheSmallCaptionFontFamily;
            } 
        },
 
        /// <summary> 
        ///     SmallCaptionFontStyle System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ SmallCaptionFontStyleKey:
        {
            get:function()
            { 
                if (_cacheSmallCaptionFontStyle == null)
                { 
                    _cacheSmallCaptionFontStyle = CreateInstance(SystemResourceKeyID.SmallCaptionFontStyle); 
                }
 
                return _cacheSmallCaptionFontStyle;
            }
        },
 
        /// <summary>
        ///     SmallCaptionFontWeight System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ SmallCaptionFontWeightKey:
        { 
            get:function()
            {
                if (_cacheSmallCaptionFontWeight == null)
                { 
                    _cacheSmallCaptionFontWeight = CreateInstance(SystemResourceKeyID.SmallCaptionFontWeight);
                } 
 
                return _cacheSmallCaptionFontWeight;
            } 
        },

        /// <summary>
        ///     SmallCaptionFontTextDecorations System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ SmallCaptionFontTextDecorationsKey: 
        { 
            get:function()
            { 
                if (_cacheSmallCaptionFontTextDecorations == null)
                {
                    _cacheSmallCaptionFontTextDecorations = CreateInstance(SystemResourceKeyID.SmallCaptionFontTextDecorations);
                } 

                return _cacheSmallCaptionFontTextDecorations; 
            } 
        },
 
        /// <summary>
        ///     MenuFontSize System Resource Key
        /// </summary>
        /*public static ResourceKey*/ MenuFontSizeKey: 
        {
            get:function() 
            { 
                if (_cacheMenuFontSize == null)
                { 
                    _cacheMenuFontSize = CreateInstance(SystemResourceKeyID.MenuFontSize);
                }

                return _cacheMenuFontSize; 
            }
        }, 
 
        /// <summary>
        ///     MenuFontFamily System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuFontFamilyKey:
        {
            get:function() 
            {
                if (_cacheMenuFontFamily == null) 
                { 
                    _cacheMenuFontFamily = CreateInstance(SystemResourceKeyID.MenuFontFamily);
                } 

                return _cacheMenuFontFamily;
            }
        },

        /// <summary> 
        ///     MenuFontStyle System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MenuFontStyleKey: 
        {
            get:function()
            {
                if (_cacheMenuFontStyle == null) 
                {
                    _cacheMenuFontStyle = CreateInstance(SystemResourceKeyID.MenuFontStyle); 
                } 

                return _cacheMenuFontStyle; 
            }
        },

        /// <summary> 
        ///     MenuFontWeight System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ MenuFontWeightKey: 
        {
            get:function() 
            {
                if (_cacheMenuFontWeight == null)
                {
                    _cacheMenuFontWeight = CreateInstance(SystemResourceKeyID.MenuFontWeight); 
                }
 
                return _cacheMenuFontWeight; 
            }
        }, 

        /// <summary>
        ///     MenuFontTextDecorations System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ MenuFontTextDecorationsKey:
        { 
            get:function() 
            {
                if (_cacheMenuFontTextDecorations == null) 
                {
                    _cacheMenuFontTextDecorations = CreateInstance(SystemResourceKeyID.MenuFontTextDecorations);
                }
 
                return _cacheMenuFontTextDecorations;
            } 
        }, 

        /// <summary> 
        ///     StatusFontSize System Resource Key
        /// </summary>
        /*public static ResourceKey*/ StatusFontSizeKey:
        { 
            get:function()
            { 
                if (_cacheStatusFontSize == null) 
                {
                    _cacheStatusFontSize = CreateInstance(SystemResourceKeyID.StatusFontSize); 
                }

                return _cacheStatusFontSize;
            } 
        },
 
        /// <summary> 
        ///     StatusFontFamily System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ StatusFontFamilyKey:
        {
            get:function()
            { 
                if (_cacheStatusFontFamily == null)
                { 
                    _cacheStatusFontFamily = CreateInstance(SystemResourceKeyID.StatusFontFamily); 
                }
 
                return _cacheStatusFontFamily;
            }
        },
 
        /// <summary>
        ///     StatusFontStyle System Resource Key 
        /// </summary> 
        /*public static ResourceKey*/ StatusFontStyleKey:
        { 
            get:function()
            {
                if (_cacheStatusFontStyle == null)
                { 
                    _cacheStatusFontStyle = CreateInstance(SystemResourceKeyID.StatusFontStyle);
                } 
 
                return _cacheStatusFontStyle;
            } 
        },

        /// <summary>
        ///     StatusFontWeight System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ StatusFontWeightKey: 
        { 
            get:function()
            { 
                if (_cacheStatusFontWeight == null)
                {
                    _cacheStatusFontWeight = CreateInstance(SystemResourceKeyID.StatusFontWeight);
                } 

                return _cacheStatusFontWeight; 
            } 
        },
 
        /// <summary>
        ///     StatusFontTextDecorations System Resource Key
        /// </summary>
        /*public static ResourceKey*/ StatusFontTextDecorationsKey: 
        {
            get:function() 
            { 
                if (_cacheStatusFontTextDecorations == null)
                { 
                    _cacheStatusFontTextDecorations = CreateInstance(SystemResourceKeyID.StatusFontTextDecorations);
                }

                return _cacheStatusFontTextDecorations; 
            }
        }, 
 
        /// <summary>
        ///     MessageFontSize System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MessageFontSizeKey:
        {
            get:function() 
            {
                if (_cacheMessageFontSize == null) 
                { 
                    _cacheMessageFontSize = CreateInstance(SystemResourceKeyID.MessageFontSize);
                } 

                return _cacheMessageFontSize;
            }
        }, 

        /// <summary> 
        ///     MessageFontFamily System Resource Key 
        /// </summary>
        /*public static ResourceKey*/ MessageFontFamilyKey: 
        {
            get:function()
            {
                if (_cacheMessageFontFamily == null) 
                {
                    _cacheMessageFontFamily = CreateInstance(SystemResourceKeyID.MessageFontFamily); 
                } 

                return _cacheMessageFontFamily; 
            }
        },

        /// <summary> 
        ///     MessageFontStyle System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ MessageFontStyleKey: 
        {
            get:function() 
            {
                if (_cacheMessageFontStyle == null)
                {
                    _cacheMessageFontStyle = CreateInstance(SystemResourceKeyID.MessageFontStyle); 
                }
 
                return _cacheMessageFontStyle; 
            }
        }, 

        /// <summary>
        ///     MessageFontWeight System Resource Key
        /// </summary> 
        /*public static ResourceKey*/ MessageFontWeightKey:
        { 
            get:function() 
            {
                if (_cacheMessageFontWeight == null) 
                {
                    _cacheMessageFontWeight = CreateInstance(SystemResourceKeyID.MessageFontWeight);
                }
 
                return _cacheMessageFontWeight;
            } 
        },
        
        /// <summary> 
        ///     MessageFontTextDecorations System Resource Key
        /// </summary>
        /*public static ResourceKey*/ MessageFontTextDecorationsKey:
        { 
            get:function()
            { 
                if (_cacheMessageFontTextDecorations == null) 
                {
                    _cacheMessageFontTextDecorations = CreateInstance(SystemResourceKeyID.MessageFontTextDecorations); 
                }

                return _cacheMessageFontTextDecorations;
            } 
        }
		  
	});
	

//    private static void 
	function CopyTextDecorationCollection(/*TextDecorationCollection*/ from, /*TextDecorationCollection*/ to)
    { 

        var count = from.Count;
        for (var i = 0; i < count; ++i)
        { 
            to.Add(from[i]);
        } 
    } 


//    private static SystemResourceKey 
	function CreateInstance(/*SystemResourceKeyID*/ KeyId)
    { 
        return new SystemResourceKey(KeyId);
    }
	
//    private static double 
	function ConvertFontHeight(/*int*/ height)
    {
        var dpi = SystemParameters.Dpi; 

        if (dpi != 0) 
        { 
            return (Math.abs(height) * 96 / dpi);
        } 
        else
        {
            // Could not get the DPI to convert the size, using the hardcoded fallback value
            return FallbackFontSize; 
        }
    }
	
	SystemFonts.Type = new Type("SystemFonts", SystemFonts, [Object.Type]);
	return SystemFonts;
});
 
//        private const double FallbackFontSize = 11.0;   // To use if unable to get the system size
 

        

