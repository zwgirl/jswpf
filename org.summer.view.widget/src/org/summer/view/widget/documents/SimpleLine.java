package org.summer.view.widget.documents;
// ---------------------------------------------------------------------
    // Text line formatter. 
    // --------------------------------------------------------------------- 
    /*internal*/ public /*sealed*/ class SimpleLine extends Line
    { 
        // ------------------------------------------------------------------
        //
        //  TextSource Implementation
        // 
        // -----------------------------------------------------------------
 
//        #region TextSource Implementation 

        // ------------------------------------------------------------------ 
        // Get a text run at specified text source position.
        // ------------------------------------------------------------------
        public /*override*/ TextRun GetTextRun(int dcp)
        { 
            Debug.Assert(dcp >= 0, "Character index must be non-negative.");
 
            TextRun run; 

            // There is only one run of text. 
            if (dcp  < _content.Length)
            {
                // LineLayout may ask for dcp != 0. This case may only happen during partial
                // validation of TextRunCache. 
                // Example:
                //  1) TextRunCache and LineMetrics array were created during measure process. 
                //  2) Before OnRender is called somebody invalidates render only property. 
                //     This invalidates TextRunCache.
                //  3) Before OnRender is called InputHitTest is invoked. Because LineMetrics 
                //     array is valid, we don't have to recreate all lines. There is only
                //     need to recreate the N-th line (line that has been hit).
                //     During line recreation LineLayout will not refetch all runs from the
                //     beginning of TextBlock control - it will ask for the run at the beginning 
                //     of the current line.
                // For this reason set 'offsetToFirstChar' to 'dcp' value. 
                run = new TextCharacters(_content, dcp, _content.Length - dcp, _textProps); 
            }
            else 
            {
                run = new TextEndOfParagraph(_syntheticCharacterLength);
            }
 
            return run;
        } 
 
        // -----------------------------------------------------------------
        // Get text immediately before specified text source position. 
        // ------------------------------------------------------------------
        public /*override*/ TextSpan<CultureSpecificCharacterBufferRange> GetPrecedingText(int dcp)
        {
            Debug.Assert(dcp >= 0, "Character index must be non-negative."); 

            CharacterBufferRange charString = CharacterBufferRange.Empty; 
            CultureInfo culture = null; 

            if (dcp > 0) 
            {
                charString = new CharacterBufferRange(
                    _content,
                    0, 
                    Math.Min(dcp, _content.Length)
                    ); 
                culture = _textProps.CultureInfo; 
            }
 
            return new TextSpan<CultureSpecificCharacterBufferRange> (
                dcp,
                new CultureSpecificCharacterBufferRange(culture, charString)
                ); 
        }
 
 
        /// <summary>
        /// TextFormatter to map a text source character index to a text effect character index 
        /// </summary>
        /// <param name="textSourceCharacterIndex"> text source character index </param>
        /// <returns> the text effect index corresponding to the text effect character index </returns>
        public /*override*/ int GetTextEffectCharacterIndexFromTextSourceCharacterIndex( 
            int textSourceCharacterIndex
            ) 
        { 
            return textSourceCharacterIndex;
        } 

//        #endregion TextSource Implementation

        //------------------------------------------------------------------- 
        //
        //  Internal Methods 
        // 
        //-------------------------------------------------------------------
 
//        #region Internal Methods

        // -----------------------------------------------------------------
        // Constructor. 
        //
        //      owner - owner of the line. 
        // ------------------------------------------------------------------ 
        /*internal*/ public SimpleLine(TextBlock owner, String content, TextRunProperties textProps)
        { 
        	 super(owner);
            Debug.Assert(content != null);
            _content = content;
            _textProps = textProps;
        } 

//        #endregion Internal Methods 
 
        //-------------------------------------------------------------------
        // 
        //  Private Fields
        //
        //--------------------------------------------------------------------
 
//        #region Private Fields
 
        // ------------------------------------------------------------------ 
        // Content of the line.
        // ----------------------------------------------------------------- 
        private final String _content;

        // ------------------------------------------------------------------
        // Text properties. 
        // -----------------------------------------------------------------
        private final TextRunProperties _textProps; 
 
//        #endregion Private Fields
    } 