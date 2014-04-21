package org.summer.view.widget.documents;
  /// <summary>
    /// Text run typography properties 
    /// 
    /// Client set properties to generate set of features
    /// that will be processed by OpenType layout engine. 
    ///
    /// For details see OpenType font specification at
    ///      http://www.microsoft.com/typography/
    /// 
    /// </summary>
    public abstract class TextRunTypographyProperties 
    { 
//        #region Public typography properties
 
        /// <summary>
        /// Common ligatures assisting with text readability.
        /// Examples: fi, fl ligatures
        /// </summary> 
        public abstract boolean StandardLigatures
        { get; } 
 
        /// <summary>
        /// Ligature forms depending on surrounding context 
        /// </summary>
        public abstract boolean ContextualLigatures
        { get; }
 
        /// <summary>
        /// Additional ligatures to assist with text readability 
        /// Examples: Qu, Th 
        /// </summary>
        public abstract boolean DiscretionaryLigatures 
        { get; }

        /// <summary>
        /// Ligatures used in historical typography 
        /// Examples: ct, st
        /// </summary> 
        public abstract boolean HistoricalLigatures 
        { get; }
 
        /// <summary>
        /// Custom forms defined by surrounding context
        /// Examples: multiple medial forms in Urdu Nastaliq fonts
        /// </summary> 
        public abstract boolean ContextualAlternates
        { get; } 
 
        /// <summary>
        /// Forms commonly used in the past 
        /// Examples: long s, old Fraktur k
        /// </summary>
        public abstract boolean HistoricalForms
        { get; } 

        /// <summary> 
        /// Feature adjusting spacing between charactersto enchance word shape 
        /// </summary>
        public abstract boolean Kerning 
        { get; }

        /// <summary>
        /// Feature adjusting inter-glyph spacing to provide better readability for all-`capital text 
        /// </summary>
        public abstract boolean CapitalSpacing 
        { get; } 

        /// <summary> 
        /// Feature adjusting punctuation types of characters to the case of the surrounding glyphs
        /// </summary>
        public abstract boolean CaseSensitiveForms
        { get; } 

        /// <summary> 
        /// Font specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet1 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet2 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet3
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet4 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet5 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet6
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet7 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet8 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet9
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet10 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet11 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet12
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet13 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet14 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet15
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet16 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet17 
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other.
        /// </summary>
        public abstract boolean StylisticSet18
        { get; } 

        /// <summary> 
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet19 
        { get; }

        /// <summary>
        /// Font-specific set of glyph forms designed to work with each other. 
        /// </summary>
        public abstract boolean StylisticSet20 
        { get; } 

        /// <summary> 
        /// Substitute nominal zero with slashed zero.
        /// </summary>
        public abstract boolean SlashedZero
        { get; } 

        /// <summary> 
        /// Substitute regular greek forms with forms used in mathematical notation. 
        /// </summary>
        public abstract boolean MathematicalGreek 
        { get; }

        /// <summary>
        /// Replace standard forms in Japaneese fonts with preferred typographic forms 
        /// </summary>
        public abstract boolean EastAsianExpertForms 
        { get; } 

        /// <summary> 
        /// Render different types of typographic variations. Include Normal, Subscript, Superscript,
        /// Inferior, Ordinal and Ruby.
        /// </summary>
        public abstract FontVariants Variants 
        { get; }
 
        /// <summary> 
        /// Select set of `capital forms from Normal, SmallCaps, AllSmallCaps,
        /// PetiteCaps, AllPetiteCaps, Unicase and Titling. 
        /// </summary>
        public abstract FontCapitals Capitals
        { get; }
 
        /// <summary>
        /// Feature selecting special fractional forms of nominator, denominator and slash. 
        /// </summary> 
        public abstract FontFraction Fraction { get; }
 
        /// <summary>
        /// Select set of glyphs to render alternate numeral forms from Normal, OldStyle and Lining
        /// </summary>
        public abstract FontNumeralStyle NumeralStyle 
        { get; }
 
        /// <summary> 
        /// Select glyph set for different numeral aligning options from Default, Proportional and Tabular
        /// </summary> 
        public abstract FontNumeralAlignment NumeralAlignment
        { get; }

        /// <summary> 
        /// Select from different width styles for Latin characters in East Asian fonts.
        /// </summary> 
        public abstract FontEastAsianWidths EastAsianWidths 
        { get; }
 
        /// <summary>
        /// Select glyphs forms specific for particular writing system and language.
        /// </summary>
        public abstract FontEastAsianLanguage EastAsianLanguage 
        { get; }
 
        /// <summary> 
        /// Select glyph forms having swashes by specified index.
        /// Examples: Q with tail extended under following letter 
        /// </summary>
        public abstract int StandardSwashes
        { get; }
 
        /// <summary>
        /// Select swash forms of glyphs by specified index and based on surrounding characters. 
        /// Examples: d with flourish occupying space above following ea. 
        /// </summary>
        public abstract int ContextualSwashes 
        { get; }

        /// <summary>
        /// Select alternate form of glyphs by specified index. 
        /// Examples: multiple forms of ampersand.
        /// </summary> 
        public abstract int StylisticAlternates 
        { get; }
 
        /// <summary>
        /// Forms commonly used in notation.
        /// Examples: characters placed in circles, parentheses
        /// </summary> 
        public abstract int AnnotationAlternates
        { get; } 
 
//        #endregion Public typography properties
 
        /// <summary>
        /// Should be called every time any property changes it's value
        /// </summary>
        protected void OnPropertiesChanged() 
        {
            _features = null; 
        } 

        /// <summary> 
        /// cached feature array.
        /// </summary>
        /*internal*/ public DWriteFontFeature[] CachedFeatureSet
        { 
            get
            { 
                return _features; 
            }
            set 
            {
                _features = value;
            }
        } 

        private DWriteFontFeature[] _features = null; 
 
    }