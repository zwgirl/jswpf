/**
 * Brushes
 */

define(["dojo/_base/declare", "system/Type", "media/KnownColors", "media/KnownColor"], 
		function(declare, Type, KnownColors, KnownColor){
	var Brushes = declare("Brushes", Object,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(Brushes,{
		/// <summary> 
        /// Well-known SolidColorBrush: AliceBlue
        /// </summary>
        /*public static SolidColorBrush*/ AliceBlue:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.AliceBlue); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: AntiqueWhite
        /// </summary> 
        /*public static SolidColorBrush*/ AntiqueWhite:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.AntiqueWhite); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Aqua
        /// </summary> 
        /*public static SolidColorBrush*/ Aqua: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Aqua);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Aquamarine 
        /// </summary>
        /*public static SolidColorBrush*/ Aquamarine: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Aquamarine); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Azure 
        /// </summary>
        /*public static SolidColorBrush*/ Azure:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Azure); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Beige
        /// </summary>
        /*public static SolidColorBrush*/ Beige: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Beige);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Bisque 
        /// </summary>
        /*public static SolidColorBrush*/ Bisque: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Bisque);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Black 
        /// </summary> 
        /*public static SolidColorBrush*/ Black:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Black);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: BlanchedAlmond
        /// </summary> 
        /*public static SolidColorBrush*/ BlanchedAlmond:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.BlanchedAlmond);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Blue
        /// </summary>
        /*public static SolidColorBrush*/ Blue:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Blue); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: BlueViolet
        /// </summary> 
        /*public static SolidColorBrush*/ BlueViolet:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.BlueViolet); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Brown
        /// </summary> 
        /*public static SolidColorBrush*/ Brown: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Brown);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: BurlyWood 
        /// </summary>
        /*public static SolidColorBrush*/ BurlyWood: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.BurlyWood); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: CadetBlue 
        /// </summary>
        /*public static SolidColorBrush*/ CadetBlue:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.CadetBlue); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Chartreuse
        /// </summary>
        /*public static SolidColorBrush*/ Chartreuse: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Chartreuse);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Chocolate 
        /// </summary>
        /*public static SolidColorBrush*/ Chocolate: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Chocolate);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Coral 
        /// </summary> 
        /*public static SolidColorBrush*/ Coral:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Coral);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: CornflowerBlue
        /// </summary> 
        /*public static SolidColorBrush*/ CornflowerBlue:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.CornflowerBlue);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Cornsilk
        /// </summary>
        /*public static SolidColorBrush*/ Cornsilk:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Cornsilk); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: Crimson
        /// </summary> 
        /*public static SolidColorBrush*/ Crimson:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Crimson); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Cyan
        /// </summary> 
        /*public static SolidColorBrush*/ Cyan: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Cyan);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: DarkBlue 
        /// </summary>
        /*public static SolidColorBrush*/ DarkBlue: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkBlue); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkCyan 
        /// </summary>
        /*public static SolidColorBrush*/ DarkCyan:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkCyan); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkGoldenrod
        /// </summary>
        /*public static SolidColorBrush*/ DarkGoldenrod: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkGoldenrod);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: DarkGray 
        /// </summary>
        /*public static SolidColorBrush*/ DarkGray: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkGray);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkGreen 
        /// </summary> 
        /*public static SolidColorBrush*/ DarkGreen:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkGreen);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: DarkKhaki
        /// </summary> 
        /*public static SolidColorBrush*/ DarkKhaki:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkKhaki);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: DarkMagenta
        /// </summary>
        /*public static SolidColorBrush*/ DarkMagenta:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkMagenta); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: DarkOliveGreen
        /// </summary> 
        /*public static SolidColorBrush*/ DarkOliveGreen:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkOliveGreen); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: DarkOrange
        /// </summary> 
        /*public static SolidColorBrush*/ DarkOrange: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkOrange);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: DarkOrchid 
        /// </summary>
        /*public static SolidColorBrush*/ DarkOrchid: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkOrchid); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkRed 
        /// </summary>
        /*public static SolidColorBrush*/ DarkRed:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkRed); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkSalmon
        /// </summary>
        /*public static SolidColorBrush*/ DarkSalmon: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkSalmon);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: DarkSeaGreen 
        /// </summary>
        /*public static SolidColorBrush*/ DarkSeaGreen: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkSeaGreen);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: DarkSlateBlue 
        /// </summary> 
        /*public static SolidColorBrush*/ DarkSlateBlue:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkSlateBlue);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: DarkSlateGray
        /// </summary> 
        /*public static SolidColorBrush*/ DarkSlateGray:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkSlateGray);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: DarkTurquoise
        /// </summary>
        /*public static SolidColorBrush*/ DarkTurquoise:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkTurquoise); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: DarkViolet
        /// </summary> 
        /*public static SolidColorBrush*/ DarkViolet:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DarkViolet); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: DeepPink
        /// </summary> 
        /*public static SolidColorBrush*/ DeepPink: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DeepPink);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: DeepSkyBlue 
        /// </summary>
        /*public static SolidColorBrush*/ DeepSkyBlue: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DeepSkyBlue); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: DimGray 
        /// </summary>
        /*public static SolidColorBrush*/ DimGray:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.DimGray); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: DodgerBlue
        /// </summary>
        /*public static SolidColorBrush*/ DodgerBlue: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.DodgerBlue);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Firebrick 
        /// </summary>
        /*public static SolidColorBrush*/ Firebrick: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Firebrick);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: FloralWhite 
        /// </summary> 
        /*public static SolidColorBrush*/ FloralWhite:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.FloralWhite);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: ForestGreen
        /// </summary> 
        /*public static SolidColorBrush*/ ForestGreen:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.ForestGreen);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Fuchsia
        /// </summary>
        /*public static SolidColorBrush*/ Fuchsia:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Fuchsia); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: Gainsboro
        /// </summary> 
        /*public static SolidColorBrush*/ Gainsboro:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Gainsboro); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: GhostWhite
        /// </summary> 
        /*public static SolidColorBrush*/ GhostWhite: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.GhostWhite);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Gold 
        /// </summary>
        /*public static SolidColorBrush*/ Gold: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Gold); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Goldenrod 
        /// </summary>
        /*public static SolidColorBrush*/ Goldenrod:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Goldenrod); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Gray
        /// </summary>
        /*public static SolidColorBrush*/ Gray: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Gray);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Green 
        /// </summary>
        /*public static SolidColorBrush*/ Green: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Green);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: GreenYellow 
        /// </summary> 
        /*public static SolidColorBrush*/ GreenYellow:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.GreenYellow);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: Honeydew
        /// </summary> 
        /*public static SolidColorBrush*/ Honeydew:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Honeydew);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: HotPink
        /// </summary>
        /*public static SolidColorBrush*/ HotPink:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.HotPink); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: IndianRed
        /// </summary> 
        /*public static SolidColorBrush*/ IndianRed:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.IndianRed); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Indigo
        /// </summary> 
        /*public static SolidColorBrush*/ Indigo: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Indigo);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Ivory 
        /// </summary>
        /*public static SolidColorBrush*/ Ivory: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Ivory); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Khaki 
        /// </summary>
        /*public static SolidColorBrush*/ Khaki:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Khaki); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Lavender
        /// </summary>
        /*public static SolidColorBrush*/ Lavender: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Lavender);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: LavenderBlush 
        /// </summary>
        /*public static SolidColorBrush*/ LavenderBlush: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LavenderBlush);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: LawnGreen 
        /// </summary> 
        /*public static SolidColorBrush*/ LawnGreen:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LawnGreen);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: LemonChiffon
        /// </summary> 
        /*public static SolidColorBrush*/ LemonChiffon:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LemonChiffon);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: LightBlue
        /// </summary>
        /*public static SolidColorBrush*/ LightBlue:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightBlue); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: LightCoral
        /// </summary> 
        /*public static SolidColorBrush*/ LightCoral:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightCoral); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: LightCyan
        /// </summary> 
        /*public static SolidColorBrush*/ LightCyan: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightCyan);
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: LightGoldenrodYellow 
        /// </summary>
        /*public static SolidColorBrush*/ LightGoldenrodYellow: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightGoldenrodYellow); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: LightGray 
        /// </summary>
        /*public static SolidColorBrush*/ LightGray:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightGray); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: LightGreen
        /// </summary>
        /*public static SolidColorBrush*/ LightGreen: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightGreen);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: LightPink 
        /// </summary>
        /*public static SolidColorBrush*/ LightPink: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightPink);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: LightSalmon 
        /// </summary> 
        /*public static SolidColorBrush*/ LightSalmon:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightSalmon);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: LightSeaGreen
        /// </summary> 
        /*public static SolidColorBrush*/ LightSeaGreen:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightSeaGreen);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: LightSkyBlue
        /// </summary>
        /*public static SolidColorBrush*/ LightSkyBlue:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightSkyBlue); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: LightSlateGray
        /// </summary> 
        /*public static SolidColorBrush*/ LightSlateGray:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightSlateGray); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: LightSteelBlue
        /// </summary> 
        /*public static SolidColorBrush*/ LightSteelBlue: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightSteelBlue);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: LightYellow 
        /// </summary>
        /*public static SolidColorBrush*/ LightYellow: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.LightYellow); 
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Lime 
        /// </summary>
        /*public static SolidColorBrush*/ Lime:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Lime); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: LimeGreen
        /// </summary>
        /*public static SolidColorBrush*/ LimeGreen: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.LimeGreen);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Linen 
        /// </summary>
        /*public static SolidColorBrush*/ Linen: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Linen);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Magenta 
        /// </summary> 
        /*public static SolidColorBrush*/ Magenta:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Magenta);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: Maroon
        /// </summary> 
        /*public static SolidColorBrush*/ Maroon:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Maroon);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: MediumAquamarine
        /// </summary>
        /*public static SolidColorBrush*/ MediumAquamarine:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumAquamarine); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: MediumBlue
        /// </summary> 
        /*public static SolidColorBrush*/ MediumBlue:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumBlue); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: MediumOrchid
        /// </summary> 
        /*public static SolidColorBrush*/ MediumOrchid: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumOrchid);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: MediumPurple 
        /// </summary>
        /*public static SolidColorBrush*/ MediumPurple: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumPurple); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: MediumSeaGreen 
        /// </summary>
        /*public static SolidColorBrush*/ MediumSeaGreen:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumSeaGreen); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: MediumSlateBlue
        /// </summary>
        /*public static SolidColorBrush*/ MediumSlateBlue: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumSlateBlue);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: MediumSpringGreen 
        /// </summary>
        /*public static SolidColorBrush*/ MediumSpringGreen: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumSpringGreen);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: MediumTurquoise 
        /// </summary> 
        /*public static SolidColorBrush*/ MediumTurquoise:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumTurquoise);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: MediumVioletRed
        /// </summary> 
        /*public static SolidColorBrush*/ MediumVioletRed:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.MediumVioletRed);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: MidnightBlue
        /// </summary>
        /*public static SolidColorBrush*/ MidnightBlue:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.MidnightBlue); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: MintCream
        /// </summary> 
        /*public static SolidColorBrush*/ MintCream:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MintCream); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: MistyRose
        /// </summary> 
        /*public static SolidColorBrush*/ MistyRose: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.MistyRose);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Moccasin 
        /// </summary>
        /*public static SolidColorBrush*/ Moccasin: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Moccasin); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: NavajoWhite 
        /// </summary>
        /*public static SolidColorBrush*/ NavajoWhite:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.NavajoWhite); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Navy
        /// </summary>
        /*public static SolidColorBrush*/ Navy: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Navy);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: OldLace 
        /// </summary>
        /*public static SolidColorBrush*/ OldLace: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.OldLace);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Olive 
        /// </summary> 
        /*public static SolidColorBrush*/ Olive:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Olive);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: OliveDrab
        /// </summary> 
        /*public static SolidColorBrush*/ OliveDrab:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.OliveDrab);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Orange
        /// </summary>
        /*public static SolidColorBrush*/ Orange:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Orange); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: OrangeRed
        /// </summary> 
        /*public static SolidColorBrush*/ OrangeRed:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.OrangeRed); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Orchid
        /// </summary> 
        /*public static SolidColorBrush*/ Orchid: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Orchid);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: PaleGoldenrod 
        /// </summary>
        /*public static SolidColorBrush*/ PaleGoldenrod: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.PaleGoldenrod); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: PaleGreen 
        /// </summary>
        /*public static SolidColorBrush*/ PaleGreen:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.PaleGreen); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: PaleTurquoise
        /// </summary>
        /*public static SolidColorBrush*/ PaleTurquoise: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.PaleTurquoise);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: PaleVioletRed 
        /// </summary>
        /*public static SolidColorBrush*/ PaleVioletRed: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.PaleVioletRed);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: PapayaWhip 
        /// </summary> 
        /*public static SolidColorBrush*/ PapayaWhip:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.PapayaWhip);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: PeachPuff
        /// </summary> 
        /*public static SolidColorBrush*/ PeachPuff:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.PeachPuff);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Peru
        /// </summary>
        /*public static SolidColorBrush*/ Peru:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Peru); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: Pink
        /// </summary> 
        /*public static SolidColorBrush*/ Pink:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Pink); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: Plum
        /// </summary> 
        /*public static SolidColorBrush*/ Plum: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Plum);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: PowderBlue 
        /// </summary>
        /*public static SolidColorBrush*/ PowderBlue: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.PowderBlue); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Purple 
        /// </summary>
        /*public static SolidColorBrush*/ Purple:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Purple); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Red
        /// </summary>
        /*public static SolidColorBrush*/ Red: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Red);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: RosyBrown 
        /// </summary>
        /*public static SolidColorBrush*/ RosyBrown: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.RosyBrown);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: RoyalBlue 
        /// </summary> 
        /*public static SolidColorBrush*/ RoyalBlue:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.RoyalBlue);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: SaddleBrown
        /// </summary> 
        /*public static SolidColorBrush*/ SaddleBrown:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.SaddleBrown);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Salmon
        /// </summary>
        /*public static SolidColorBrush*/ Salmon:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Salmon); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: SandyBrown
        /// </summary> 
        /*public static SolidColorBrush*/ SandyBrown:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SandyBrown); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: SeaGreen
        /// </summary> 
        /*public static SolidColorBrush*/ SeaGreen: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SeaGreen);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: SeaShell 
        /// </summary>
        /*public static SolidColorBrush*/ SeaShell: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SeaShell); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Sienna 
        /// </summary>
        /*public static SolidColorBrush*/ Sienna:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Sienna); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Silver
        /// </summary>
        /*public static SolidColorBrush*/ Silver: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Silver);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: SkyBlue 
        /// </summary>
        /*public static SolidColorBrush*/ SkyBlue: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.SkyBlue);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: SlateBlue 
        /// </summary> 
        /*public static SolidColorBrush*/ SlateBlue:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SlateBlue);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: SlateGray
        /// </summary> 
        /*public static SolidColorBrush*/ SlateGray:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.SlateGray);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Snow
        /// </summary>
        /*public static SolidColorBrush*/ Snow:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Snow); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: SpringGreen
        /// </summary> 
        /*public static SolidColorBrush*/ SpringGreen:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SpringGreen); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: SteelBlue
        /// </summary> 
        /*public static SolidColorBrush*/ SteelBlue: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.SteelBlue);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Tan 
        /// </summary>
        /*public static SolidColorBrush*/ Tan: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Tan); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Teal 
        /// </summary>
        /*public static SolidColorBrush*/ Teal:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Teal); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Thistle
        /// </summary>
        /*public static SolidColorBrush*/ Thistle: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Thistle);
            } 
        },

        /// <summary>
        /// Well-known SolidColorBrush: Tomato 
        /// </summary>
        /*public static SolidColorBrush*/ Tomato: 
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Tomato);
            }
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: Transparent 
        /// </summary> 
        /*public static SolidColorBrush*/ Transparent:
        { 
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Transparent);
            } 
        },
 
        /// <summary> 
        /// Well-known SolidColorBrush: Turquoise
        /// </summary> 
        /*public static SolidColorBrush*/ Turquoise:
        {
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Turquoise);
            } 
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: Violet
        /// </summary>
        /*public static SolidColorBrush*/ Violet:
        { 
            get:function()
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.Violet); 
            }
        }, 

        /// <summary>
        /// Well-known SolidColorBrush: Wheat
        /// </summary> 
        /*public static SolidColorBrush*/ Wheat:
        { 
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Wheat); 
            }
        },

        /// <summary> 
        /// Well-known SolidColorBrush: White
        /// </summary> 
        /*public static SolidColorBrush*/ White: 
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.White);
            }
        }, 

        /// <summary> 
        /// Well-known SolidColorBrush: WhiteSmoke 
        /// </summary>
        /*public static SolidColorBrush*/ WhiteSmoke: 
        {
            get:function()
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.WhiteSmoke); 
            }
        }, 
 
        /// <summary>
        /// Well-known SolidColorBrush: Yellow 
        /// </summary>
        /*public static SolidColorBrush*/ Yellow:
        {
            get:function() 
            {
                return KnownColors.SolidColorBrushFromUint(KnownColor.Yellow); 
            } 
        },
 
        /// <summary>
        /// Well-known SolidColorBrush: YellowGreen
        /// </summary>
        /*public static SolidColorBrush*/ YellowGreen: 
        {
            get:function() 
            { 
                return KnownColors.SolidColorBrushFromUint(KnownColor.YellowGreen);
            } 
        }		  
	});
	
	Brushes.Type = new Type("Brushes", Brushes, [Object.Type]);
	return Brushes;
});


        


