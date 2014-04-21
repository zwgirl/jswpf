 /**
 * Colors
 */

define(["dojo/_base/declare", "system/Type", "media/Color", "media/KnownColor"], 
		function(declare, Type, Color, KnownColor){
	var Colors = declare("Colors", null,{
	});
	
	Object.defineProperties(Colors,{
        /// <summary>
        /// Well-known color: AliceBlue
        /// </summary> 
        AliceBlue:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.AliceBlue); 
            }
        },

        /// <summary> 
        /// Well-known color: AntiqueWhite
        /// </summary> 
        AntiqueWhite: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.AntiqueWhite);
            }
        }, 

        /// <summary> 
        /// Well-known color: Aqua 
        /// </summary>
        Aqua: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Aqua); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: Aquamarine 
        /// </summary>
        Aquamarine:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Aquamarine); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Azure
        /// </summary>
        Azure: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Azure);
            } 
        },

        /// <summary>
        /// Well-known color: Beige 
        /// </summary>
        Beige: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Beige);
            }
        },
 
        /// <summary>
        /// Well-known color: Bisque 
        /// </summary> 
        Bisque:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Bisque);
            } 
        },
 
        /// <summary> 
        /// Well-known color: Black
        /// </summary> 
        Black:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Black);
            } 
        }, 

        /// <summary> 
        /// Well-known color: BlanchedAlmond
        /// </summary>
        BlanchedAlmond:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.BlanchedAlmond); 
            }
        }, 

        /// <summary>
        /// Well-known color: Blue
        /// </summary> 
        Blue:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Blue); 
            }
        },

        /// <summary> 
        /// Well-known color: BlueViolet
        /// </summary> 
        BlueViolet: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.BlueViolet);
            }
        }, 

        /// <summary> 
        /// Well-known color: Brown 
        /// </summary>
        Brown: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Brown); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: BurlyWood 
        /// </summary>
        BurlyWood:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.BurlyWood); 
            } 
        },
 
        /// <summary>
        /// Well-known color: CadetBlue
        /// </summary>
        CadetBlue: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.CadetBlue);
            } 
        },

        /// <summary>
        /// Well-known color: Chartreuse 
        /// </summary>
        Chartreuse: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Chartreuse);
            }
        },
 
        /// <summary>
        /// Well-known color: Chocolate 
        /// </summary> 
        Chocolate:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Chocolate);
            } 
        },
 
        /// <summary> 
        /// Well-known color: Coral
        /// </summary> 
        Coral:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Coral);
            } 
        }, 

        /// <summary> 
        /// Well-known color: CornflowerBlue
        /// </summary>
        CornflowerBlue:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.CornflowerBlue); 
            }
        }, 

        /// <summary>
        /// Well-known color: Cornsilk
        /// </summary> 
        Cornsilk:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Cornsilk); 
            }
        },

        /// <summary> 
        /// Well-known color: Crimson
        /// </summary> 
        Crimson: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Crimson);
            }
        }, 

        /// <summary> 
        /// Well-known color: Cyan 
        /// </summary>
        Cyan: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Cyan); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: DarkBlue 
        /// </summary>
        DarkBlue:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkBlue); 
            } 
        },
 
        /// <summary>
        /// Well-known color: DarkCyan
        /// </summary>
        DarkCyan: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.DarkCyan);
            } 
        },

        /// <summary>
        /// Well-known color: DarkGoldenrod 
        /// </summary>
        DarkGoldenrod: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkGoldenrod);
            }
        },
 
        /// <summary>
        /// Well-known color: DarkGray 
        /// </summary> 
        DarkGray:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.DarkGray);
            } 
        },
 
        /// <summary> 
        /// Well-known color: DarkGreen
        /// </summary> 
        DarkGreen:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkGreen);
            } 
        } ,

        /// <summary> 
        /// Well-known color: DarkKhaki
        /// </summary>
        DarkKhaki:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkKhaki); 
            }
        }, 

        /// <summary>
        /// Well-known color: DarkMagenta
        /// </summary> 
        DarkMagenta:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkMagenta); 
            }
        },

        /// <summary> 
        /// Well-known color: DarkOliveGreen
        /// </summary> 
        DarkOliveGreen: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkOliveGreen);
            }
        }, 

        /// <summary> 
        /// Well-known color: DarkOrange 
        /// </summary>
        DarkOrange: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.DarkOrange); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: DarkOrchid 
        /// </summary>
        DarkOrchid:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkOrchid); 
            } 
        },
 
        /// <summary>
        /// Well-known color: DarkRed
        /// </summary>
        DarkRed:
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.DarkRed);
            } 
        },

        /// <summary>
        /// Well-known color: DarkSalmon 
        /// </summary>
        DarkSalmon: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkSalmon);
            }
        },
 
        /// <summary>
        /// Well-known color: DarkSeaGreen 
        /// </summary> 
        DarkSeaGreen:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.DarkSeaGreen);
            } 
        },
 
        /// <summary> 
        /// Well-known color: DarkSlateBlue
        /// </summary> 
        DarkSlateBlue:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkSlateBlue);
            } 
        }, 

        /// <summary> 
        /// Well-known color: DarkSlateGray
        /// </summary>
        DarkSlateGray:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DarkSlateGray); 
            }
        }, 

        /// <summary>
        /// Well-known color: DarkTurquoise
        /// </summary> 
        DarkTurquoise:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkTurquoise); 
            }
        },

        /// <summary> 
        /// Well-known color: DarkViolet
        /// </summary> 
        DarkViolet: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DarkViolet);
            }
        }, 

        /// <summary> 
        /// Well-known color: DeepPink 
        /// </summary>
        DeepPink: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.DeepPink); 
            }
        } ,
 
        /// <summary>
        /// Well-known color: DeepSkyBlue 
        /// </summary>
        DeepSkyBlue:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.DeepSkyBlue); 
            } 
        },
 
        /// <summary>
        /// Well-known color: DimGray
        /// </summary>
        DimGray: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.DimGray);
            } 
        },

        /// <summary>
        /// Well-known color: DodgerBlue 
        /// </summary>
        DodgerBlue: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.DodgerBlue);
            }
        },
 
        /// <summary>
        /// Well-known color: Firebrick 
        /// </summary> 
        Firebrick:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Firebrick);
            } 
        },
 
        /// <summary> 
        /// Well-known color: FloralWhite
        /// </summary> 
        FloralWhite:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.FloralWhite);
            } 
        }, 

        /// <summary> 
        /// Well-known color: ForestGreen
        /// </summary>
        ForestGreen:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.ForestGreen); 
            }
        }, 

        /// <summary>
        /// Well-known color: Fuchsia
        /// </summary> 
        Fuchsia:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Fuchsia); 
            }
        },

        /// <summary> 
        /// Well-known color: Gainsboro
        /// </summary> 
        Gainsboro: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Gainsboro);
            }
        }, 

        /// <summary> 
        /// Well-known color: GhostWhite 
        /// </summary>
        GhostWhite: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.GhostWhite); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: Gold 
        /// </summary>
        Gold:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Gold); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Goldenrod
        /// </summary>
        Goldenrod: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Goldenrod);
            } 
        },

        /// <summary>
        /// Well-known color: Gray 
        /// </summary>
        Gray: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Gray);
            }
        },
 
        /// <summary>
        /// Well-known color: Green 
        /// </summary> 
        Green:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Green);
            } 
        },
 
        /// <summary> 
        /// Well-known color: GreenYellow
        /// </summary> 
        GreenYellow:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.GreenYellow);
            } 
        }, 

        /// <summary> 
        /// Well-known color: Honeydew
        /// </summary>
        Honeydew:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Honeydew); 
            }
        }, 

        /// <summary>
        /// Well-known color: HotPink
        /// </summary> 
        HotPink:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.HotPink); 
            }
        },

        /// <summary> 
        /// Well-known color: IndianRed
        /// </summary> 
        IndianRed: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.IndianRed);
            }
        } ,

        /// <summary> 
        /// Well-known color: Indigo 
        /// </summary>
        Indigo: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Indigo); 
            }
        } ,
 
        /// <summary>
        /// Well-known color: Ivory 
        /// </summary>
        Ivory:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Ivory); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Khaki
        /// </summary>
        Khaki: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Khaki);
            } 
        },

        /// <summary>
        /// Well-known color: Lavender 
        /// </summary>
        Lavender: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Lavender);
            }
        },
 
        /// <summary>
        /// Well-known color: LavenderBlush 
        /// </summary> 
        LavenderBlush:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.LavenderBlush);
            } 
        },
 
        /// <summary> 
        /// Well-known color: LawnGreen
        /// </summary> 
        LawnGreen:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LawnGreen);
            } 
        }, 

        /// <summary> 
        /// Well-known color: LemonChiffon
        /// </summary>
        LemonChiffon:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LemonChiffon); 
            }
        } ,

        /// <summary>
        /// Well-known color: LightBlue
        /// </summary> 
        LightBlue:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightBlue); 
            }
        },

        /// <summary> 
        /// Well-known color: LightCoral
        /// </summary> 
        LightCoral: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightCoral);
            }
        }, 

        /// <summary> 
        /// Well-known color: LightCyan 
        /// </summary>
        LightCyan: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.LightCyan); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: LightGoldenrodYellow 
        /// </summary>
        LightGoldenrodYellow:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightGoldenrodYellow); 
            } 
        },
 
        /// <summary>
        /// Well-known color: LightGray
        /// </summary>
        LightGray: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.LightGray);
            } 
        },

        /// <summary>
        /// Well-known color: LightGreen 
        /// </summary>
        LightGreen: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LightGreen);
            }
        },
 
        /// <summary>
        /// Well-known color: LightPink 
        /// </summary> 
        LightPink:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.LightPink);
            } 
        },
 
        /// <summary> 
        /// Well-known color: LightSalmon
        /// </summary> 
        LightSalmon:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LightSalmon);
            } 
        } ,

        /// <summary> 
        /// Well-known color: LightSeaGreen
        /// </summary>
        LightSeaGreen:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LightSeaGreen); 
            }
        } ,

        /// <summary>
        /// Well-known color: LightSkyBlue
        /// </summary> 
        LightSkyBlue:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightSkyBlue); 
            }
        },

        /// <summary> 
        /// Well-known color: LightSlateGray
        /// </summary> 
        LightSlateGray: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightSlateGray);
            }
        }, 

        /// <summary> 
        /// Well-known color: LightSteelBlue 
        /// </summary>
        LightSteelBlue: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.LightSteelBlue); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: LightYellow 
        /// </summary>
        LightYellow:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.LightYellow); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Lime
        /// </summary>
        Lime: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Lime);
            } 
        },

        /// <summary>
        /// Well-known color: LimeGreen 
        /// </summary>
        LimeGreen: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.LimeGreen);
            }
        },
 
        /// <summary>
        /// Well-known color: Linen 
        /// </summary> 
        Linen:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Linen);
            } 
        },
 
        /// <summary> 
        /// Well-known color: Magenta
        /// </summary> 
        Magenta:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Magenta);
            } 
        }, 

        /// <summary> 
        /// Well-known color: Maroon
        /// </summary>
        Maroon:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Maroon); 
            }
        }, 

        /// <summary>
        /// Well-known color: MediumAquamarine
        /// </summary> 
        MediumAquamarine:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.MediumAquamarine); 
            }
        },

        /// <summary> 
        /// Well-known color: MediumBlue
        /// </summary> 
        MediumBlue: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.MediumBlue);
            }
        } ,

        /// <summary> 
        /// Well-known color: MediumOrchid 
        /// </summary>
        MediumOrchid: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.MediumOrchid); 
            }
        } ,
 
        /// <summary>
        /// Well-known color: MediumPurple 
        /// </summary>
        MediumPurple:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.MediumPurple); 
            } 
        },
 
        /// <summary>
        /// Well-known color: MediumSeaGreen
        /// </summary>
        MediumSeaGreen: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.MediumSeaGreen);
            } 
        },

        /// <summary>
        /// Well-known color: MediumSlateBlue 
        /// </summary>
        MediumSlateBlue: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.MediumSlateBlue);
            }
        },
 
        /// <summary>
        /// Well-known color: MediumSpringGreen 
        /// </summary> 
        MediumSpringGreen:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.MediumSpringGreen);
            } 
        },
 
        /// <summary> 
        /// Well-known color: MediumTurquoise
        /// </summary> 
        MediumTurquoise:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.MediumTurquoise);
            } 
        }, 

        /// <summary> 
        /// Well-known color: MediumVioletRed
        /// </summary>
        MediumVioletRed:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.MediumVioletRed); 
            }
        } ,

        /// <summary>
        /// Well-known color: MidnightBlue
        /// </summary> 
        MidnightBlue:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.MidnightBlue); 
            }
        },

        /// <summary> 
        /// Well-known color: MintCream
        /// </summary> 
        MintCream: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.MintCream);
            }
        }, 

        /// <summary> 
        /// Well-known color: MistyRose 
        /// </summary>
        MistyRose: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.MistyRose); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: Moccasin 
        /// </summary>
        Moccasin:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Moccasin); 
            } 
        },
 
        /// <summary>
        /// Well-known color: NavajoWhite
        /// </summary>
        NavajoWhite: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.NavajoWhite);
            } 
        },

        /// <summary>
        /// Well-known color: Navy 
        /// </summary>
        Navy: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Navy);
            }
        },
 
        /// <summary>
        /// Well-known color: OldLace 
        /// </summary> 
        OldLace:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.OldLace);
            } 
        },
 
        /// <summary> 
        /// Well-known color: Olive
        /// </summary> 
        Olive:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Olive);
            } 
        }, 

        /// <summary> 
        /// Well-known color: OliveDrab
        /// </summary>
        OliveDrab:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.OliveDrab); 
            }
        }, 

        /// <summary>
        /// Well-known color: Orange
        /// </summary> 
        Orange:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Orange); 
            }
        },

        /// <summary> 
        /// Well-known color: OrangeRed
        /// </summary> 
        OrangeRed: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.OrangeRed);
            }
        }, 

        /// <summary> 
        /// Well-known color: Orchid 
        /// </summary>
        Orchid: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Orchid); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: PaleGoldenrod 
        /// </summary>
        PaleGoldenrod:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.PaleGoldenrod); 
            } 
        },
 
        /// <summary>
        /// Well-known color: PaleGreen
        /// </summary>
        PaleGreen: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.PaleGreen);
            } 
        },

        /// <summary>
        /// Well-known color: PaleTurquoise 
        /// </summary>
        PaleTurquoise: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.PaleTurquoise);
            }
        },
 
        /// <summary>
        /// Well-known color: PaleVioletRed 
        /// </summary> 
        PaleVioletRed:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.PaleVioletRed);
            } 
        },
 
        /// <summary> 
        /// Well-known color: PapayaWhip
        /// </summary> 
        PapayaWhip:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.PapayaWhip);
            } 
        }, 

        /// <summary> 
        /// Well-known color: PeachPuff
        /// </summary>
        PeachPuff:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.PeachPuff); 
            }
        }, 

        /// <summary>
        /// Well-known color: Peru
        /// </summary> 
        Peru:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Peru); 
            }
        },

        /// <summary> 
        /// Well-known color: Pink
        /// </summary> 
        Pink: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Pink);
            }
        }, 

        /// <summary> 
        /// Well-known color: Plum 
        /// </summary>
        Plum: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.Plum); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: PowderBlue 
        /// </summary>
        PowderBlue:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.PowderBlue); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Purple
        /// </summary>
        Purple: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Purple);
            } 
        },

        /// <summary>
        /// Well-known color: Red 
        /// </summary>
        Red: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Red);
            }
        },
 
        /// <summary>
        /// Well-known color: RosyBrown 
        /// </summary> 
        RosyBrown:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.RosyBrown);
            } 
        },
 
        /// <summary> 
        /// Well-known color: RoyalBlue
        /// </summary> 
        RoyalBlue:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.RoyalBlue);
            } 
        }, 

        /// <summary> 
        /// Well-known color: SaddleBrown
        /// </summary>
        SaddleBrown:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.SaddleBrown); 
            }
        }, 

        /// <summary>
        /// Well-known color: Salmon
        /// </summary> 
        Salmon:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Salmon); 
            }
        },

        /// <summary> 
        /// Well-known color: SandyBrown
        /// </summary> 
        SandyBrown: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.SandyBrown);
            }
        }, 

        /// <summary> 
        /// Well-known color: SeaGreen 
        /// </summary>
        SeaGreen: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.SeaGreen); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: SeaShell 
        /// </summary>
        SeaShell:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.SeaShell); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Sienna
        /// </summary>
        Sienna: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Sienna);
            } 
        },

        /// <summary>
        /// Well-known color: Silver 
        /// </summary>
        Silver: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Silver);
            }
        },
 
        /// <summary>
        /// Well-known color: SkyBlue 
        /// </summary> 
        SkyBlue:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.SkyBlue);
            } 
        },
 
        /// <summary> 
        /// Well-known color: SlateBlue
        /// </summary> 
        SlateBlue:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.SlateBlue);
            } 
        }, 

        /// <summary> 
        /// Well-known color: SlateGray
        /// </summary>
        SlateGray:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.SlateGray); 
            }
        }, 

        /// <summary>
        /// Well-known color: Snow
        /// </summary> 
        Snow:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Snow); 
            }
        },

        /// <summary> 
        /// Well-known color: SpringGreen
        /// </summary> 
        SpringGreen: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.SpringGreen);
            }
        }, 

        /// <summary> 
        /// Well-known color: SteelBlue 
        /// </summary>
        SteelBlue: 
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.SteelBlue); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: Tan 
        /// </summary>
        Tan:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Tan); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Teal
        /// </summary>
        Teal: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Teal);
            } 
        },

        /// <summary>
        /// Well-known color: Thistle 
        /// </summary>
        Thistle: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Thistle);
            }
        },
 
        /// <summary>
        /// Well-known color: Tomato 
        /// </summary> 
        Tomato:
        { 
            get:function()
            {
                return Color.FromUInt32(KnownColor.Tomato);
            } 
        },
 
        /// <summary> 
        /// Well-known color: Transparent
        /// </summary> 
        Transparent:
        {
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Transparent);
            } 
        } ,

        /// <summary> 
        /// Well-known color: Turquoise
        /// </summary>
        Turquoise:
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.Turquoise); 
            }
        } ,

        /// <summary>
        /// Well-known color: Violet
        /// </summary> 
        Violet:
        { 
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Violet); 
            }
        },

        /// <summary> 
        /// Well-known color: Wheat
        /// </summary> 
        Wheat: 
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.Wheat);
            }
        } ,

        /// <summary> 
        /// Well-known color: White 
        /// </summary>
        White:
        {
            get:function()
            {
                return Color.FromUInt32(KnownColor.White); 
            }
        }, 
 
        /// <summary>
        /// Well-known color: WhiteSmoke 
        /// </summary>
        WhiteSmoke:
        {
            get:function() 
            {
                return Color.FromUInt32(KnownColor.WhiteSmoke); 
            } 
        },
 
        /// <summary>
        /// Well-known color: Yellow
        /// </summary>
        Yellow: 
        {
            get:function() 
            { 
                return Color.FromUInt32(KnownColor.Yellow);
            } 
        },

        /// <summary>
        /// Well-known color: YellowGreen 
        /// </summary>
        YellowGreen: 
        { 
            get:function()
            { 
                return Color.FromUInt32(KnownColor.YellowGreen);
            }
        },
	});
	
	Colors.Type = new Type("Colors", Colors, [Object.Type]);
	return Colors;
});
