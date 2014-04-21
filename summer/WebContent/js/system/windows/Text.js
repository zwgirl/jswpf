/**
 * Text
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyProperty",
        "windows/FrameworkPropertyMetadata"], 
		function(declare, Type, DependencyProperty,
				FrameworkPropertyMetadata){
	var Text = declare("Text", null,{

	});

	
	Object.defineProperties(Text,{
//		color	设置文本的颜色	4	1	9	Yes
//        public static readonly DependencyProperty 
		ColorProperty:
        {
        	get:function(){
        		if(Text._ColorProperty === undefined){
        			Text._ColorProperty = 
                        DependencyProperty.RegisterAttached(
                                "Color",              // Name
                                String.Type,         // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender));
        			Text._ColorProperty._cssName = "color";
        		}
        		
        		return Text._ColorProperty;
        	}
        },	
//		letterSpacing	设置字符间距	4	1	9	Yes
//        public static readonly DependencyProperty 
        LetterSpacingProperty:
        {
        	get:function(){
        		if(Text._LetterSpacingProperty === undefined){
        			Text._LetterSpacingProperty = 
        	            DependencyProperty.RegisterAttached("LetterSpacing",     // Name
        	            		String.Type,         // Type
                                Text.Type, // Owner
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Text._LetterSpacingProperty._cssName = "letter-spacing";
        		}
        		
        		return Text._LetterSpacingProperty;
        	}
        }, 
//		lineHeight	设置行间距	4	1	9	Yes
//        public static readonly DependencyProperty 
        LineHeightProperty:
        {
        	get:function(){
        		if(Text._LineHeightProperty === undefined){
        			Text._LineHeightProperty  =
        	            DependencyProperty.RegisterAttached("LineHeight",       // Name 
        	            		String.Type,         // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value 
        			Text.LineHeightProperty._cssName = "line-height";
        		}
        		
        		return Text._LineHeightProperty;
        	}
        },
//		quotes	设置在文本中使用哪种引号	5M	1	 	Yes
//        public static readonly DependencyProperty 
        QuotesProperty:
        {
        	get:function(){
        		if(Text._QuotesProperty === undefined){
        			Text._QuotesProperty = 
        	            DependencyProperty.RegisterAttached("Quotes",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._QuotesProperty._cssName = "quotes";
        		}
        		
        		return Text._QuotesProperty;
        	}
        },
        
//    	textAlign	排列文本	4	1	9	Yes
//      public static readonly DependencyProperty 
        TextAlignProperty:
        {
        	get:function(){
        		if(Text._TextAlignProperty === undefined){
        			Text._TextAlignProperty = 
        	            DependencyProperty.RegisterAttached("TextAlign",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextAlignProperty._cssName = "text-align";
        		}
        		
        		return Text._TextAlignProperty;
        	}
        },
        
//    	textDecoration	设置文本的修饰	4	1	9	Yes
//      public static readonly DependencyProperty 
        TextDecorationProperty:
        {
        	get:function(){
        		if(Text._TextDecorationProperty === undefined){
        			Text._TextDecorationProperty = 
        	            DependencyProperty.RegisterAttached("TextDecoration",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextDecorationProperty._cssName = "text-decoration";
        		}
        		
        		return Text._TextDecorationProperty;
        	}
        },
        
//    	textIndent	缩紧首行的文本	4	1	9	Yes
//      public static readonly DependencyProperty 
        TextIndentProperty:
        {
        	get:function(){
        		if(Text._TextIndentProperty === undefined){
        			Text._TextIndentProperty = 
        	            DependencyProperty.RegisterAttached("TextIndent",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextIndentProperty._cssName = "text-indent";
        		}
        		
        		return Text._TextIndentProperty;
        	}
        },
        
//    	textShadow	设置文本的阴影效果	5M	1	 	Yes
//      public static readonly DependencyProperty 
        TextShadowProperty:
        {
        	get:function(){
        		if(Text._TextShadowProperty === undefined){
        			Text._TextShadowProperty = 
        	            DependencyProperty.RegisterAttached("TextShadow",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextShadowProperty._cssName = "text-shadow";
        		}
        		
        		return Text._TextShadowProperty;
        	}
        },
        
//    	textTransform	对文本设置大写效果	4	1	9	Yes
//      public static readonly DependencyProperty 
        TextTransformProperty:
        {
        	get:function(){
        		if(Text._TextTransformProperty === undefined){
        			Text._TextTransformProperty = 
        	            DependencyProperty.RegisterAttached("TextTransform",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextTransformProperty._cssName = "text-transform";
        		}
        		
        		return Text._TextTransformProperty;
        	}
        },
        
//    	unicodeBidi	 	5	1	 	Yes
//      public static readonly DependencyProperty 
        UnicodeBidiProperty:
        {
        	get:function(){
        		if(Text._UnicodeBidiProperty === undefined){
        			Text._UnicodeBidiProperty = 
        	            DependencyProperty.RegisterAttached("UnicodeBidi",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._UnicodeBidiProperty._cssName = "unicode-bidi";
        		}
        		
        		return Text._UnicodeBidiProperty;
        	}
        },
        
//    	whiteSpace	设置如何设置文本中的折行和空白符	4	1	9	Yes
//      public static readonly DependencyProperty 
        WhiteSpaceProperty:
        {
        	get:function(){
        		if(Text._WhiteSpaceProperty === undefined){
        			Text._WhiteSpaceProperty = 
        	            DependencyProperty.RegisterAttached("WhiteSpace",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._WhiteSpaceProperty._cssName = "white-wpace";
        		}
        		
        		return Text._WhiteSpaceProperty;
        	}
        },
        
//    	wordSpacing	设置文本中的词间距	6	1	9	Yes
//      public static readonly DependencyProperty 
        WordSpacingProperty:
        {
        	get:function(){
        		if(Text._WordSpacingProperty === undefined){
        			Text._WordSpacingProperty = 
        	            DependencyProperty.RegisterAttached("WordSpacing",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._WordSpacingProperty._cssName = "word-spacing";
        		}
        		
        		return Text._WordSpacingProperty;
        	}
        },
        
//        hanging-punctuation	规定标点字符是否位于线框之外。	3
//      public static readonly DependencyProperty 
        HangingPunctuationProperty:
        {
        	get:function(){
        		if(Text._HangingPunctuationProperty === undefined){
        			Text._HangingPunctuationProperty = 
        	            DependencyProperty.RegisterAttached("HangingPunctuation",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._HangingPunctuationProperty._cssName = "hanging-punctuation";
        		}
        		
        		return Text._HangingPunctuationProperty;
        	}
        },
//        punctuation-trim	规定是否对标点字符进行修剪。	3
//      public static readonly DependencyProperty 
        PunctuationTrimProperty:
        {
        	get:function(){
        		if(Text._PunctuationTrimProperty === undefined){
        			Text._PunctuationTrimProperty = 
        	            DependencyProperty.RegisterAttached("WordSpacing",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._PunctuationTrimProperty._cssName = "punctuation-trim";
        		}
        		
        		return Text._PunctuationTrimProperty;
        	}
        },
//        text-align-last	设置如何对齐最后一行或紧挨着强制换行符之前的行。	3
//      public static readonly DependencyProperty 
        TextAlignLastProperty:
        {
        	get:function(){
        		if(Text._TextAlignLastProperty === undefined){
        			Text._TextAlignLastProperty = 
        	            DependencyProperty.RegisterAttached("WordSpacing",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextAlignLastProperty._cssName = "text-align-last";
        		}
        		
        		return Text._TextAlignLastProperty;
        	}
        },
//        text-emphasis	向元素的文本应用重点标记以及重点标记的前景色。	3
//      public static readonly DependencyProperty 
        TextEmphasisProperty:
        {
        	get:function(){
        		if(Text._TextEmphasisProperty === undefined){
        			Text._TextEmphasisProperty = 
        	            DependencyProperty.RegisterAttached("TextEmphasis",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextEmphasisProperty._cssName = "text-emphasis";
        		}
        		
        		return Text._TextEmphasisProperty;
        	}
        },
//        text-justify	规定当 text-align 设置为 "justify" 时所使用的对齐方法。	3
//      public static readonly DependencyProperty 
        TextJustifyProperty:
        {
        	get:function(){
        		if(Text._TextJustifyProperty === undefined){
        			Text._TextJustifyProperty = 
        	            DependencyProperty.RegisterAttached("TextJustify",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextJustifyProperty._cssName = "text-justify";
        		}
        		
        		return Text._TextJustifyProperty;
        	}
        },
//        text-outline	规定文本的轮廓。	3
//      public static readonly DependencyProperty 
        TextOutlineProperty:
        {
        	get:function(){
        		if(Text._TextOutlineProperty === undefined){
        			Text._TextOutlineProperty = 
        	            DependencyProperty.RegisterAttached("TextOutline",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextOutlineProperty._cssName = "text-outline";
        		}
        		
        		return Text._TextOutlineProperty;
        	}
        },
//        text-overflow	规定当文本溢出包含元素时发生的事情。	3
//      public static readonly DependencyProperty 
        TextOverflowProperty:
        {
        	get:function(){
        		if(Text._TextOverflowProperty === undefined){
        			Text._TextOverflowProperty = 
        	            DependencyProperty.RegisterAttached("TextOverflow",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextOverflowProperty._cssName = "text-overflow";
        		}
        		
        		return Text._TextOverflowProperty;
        	}
        },
//        text-shadow	向文本添加阴影。	3
//      public static readonly DependencyProperty 
        TextShadowProperty:
        {
        	get:function(){
        		if(Text._TextShadowProperty === undefined){
        			Text._TextShadowProperty = 
        	            DependencyProperty.RegisterAttached("TextShadow",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextShadowProperty._cssName = "text-shadow";
        		}
        		
        		return Text._TextShadowProperty;
        	}
        },
//        text-wrap	规定文本的换行规则。	3
//      public static readonly DependencyProperty 
        TextWrapProperty:
        {
        	get:function(){
        		if(Text._TextWrapProperty === undefined){
        			Text._TextWrapProperty = 
        	            DependencyProperty.RegisterAttached("_TextWrap",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._TextWrapProperty._cssName = "text-wrap";
        		}
        		
        		return Text._TextWrapProperty;
        	}
        },
//        word-break	规定非中日韩文本的换行规则。	3
//      public static readonly DependencyProperty 
        WordBreakProperty:
        {
        	get:function(){
        		if(Text._WordBreakProperty === undefined){
        			Text._WordBreakProperty = 
        	            DependencyProperty.RegisterAttached("WordBreak",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._WordBreakProperty._cssName = "word-break";
        		}
        		
        		return Text._WordBreakProperty;
        	}
        },
//        word-wrap 允许对长的不可分割的单词进行分割并换行到下一行。
//      public static readonly DependencyProperty 
        WordWrapProperty:
        {
        	get:function(){
        		if(Text._WordWrapProperty === undefined){
        			Text._WordWrapProperty = 
        	            DependencyProperty.RegisterAttached("WordWrap",        // Name 
        	            		String.Type,           // Type
                                Text.Type, // Owner 
                                FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.AffectsRender)); // Default Value
        			Text._WordWrapProperty._cssName = "word-wrap";
        		}
        		
        		return Text._WordWrapProperty;
        	}
        },

	});
	
    Text.Type = new Type("Text", Text, [Object.Type]);
	return Text;
});

 


