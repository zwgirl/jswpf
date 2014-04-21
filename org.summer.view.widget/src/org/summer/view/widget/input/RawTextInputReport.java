package org.summer.view.widget.input;

import org.summer.view.widget.PresentationSource;

/// <summary>
    ///     The RawTextInputReport class encapsulates the raw text input 
    ///     provided. 
    /// </summary>
    /// <remarks> 
    ///     It is important to note that the InputReport class only contains
    ///     blittable types.  This is required so that the report can be
    ///     marshalled across application domains.
    /// </remarks> 
    /*internal*/ public class RawTextInputReport extends InputReport
    { 
        /// <summary> 
        ///     Constructs ad instance of the RawKeyboardInputReport class.
        /// </summary> 
        /// <param name="inputSource">
        ///     The input source that provided this input.
        /// </param>
        /// <param name="mode"> 
        ///     The mode in which the input is being provided.
        /// </param> 
        /// <param name="timestamp"> 
        ///     The time when the input occured.
        /// </param> 
        /// <param name="isDeadCharacter">
        ///     True if the char code is a dead char.
        /// </param>
        /// <param name="isSystemCharacter"> 
        ///     True if the char code is a system char.
        /// </param> 
        /// <param name="isControlCharacter"> 
        ///     True if the char code is a control char.
        /// </param> 
        /// <param name="characterCode">
        ///     The character code.
        /// </param>
        public RawTextInputReport( 
            PresentationSource inputSource,
            InputMode mode, 
            int timestamp, 
            boolean isDeadCharacter,
            boolean isSystemCharacter, 
            boolean isControlCharacter,
            char characterCode) 
        {
        	super(inputSource, InputType.Text, mode, timestamp);
            _isDeadCharacter = isDeadCharacter; 
            _isSystemCharacter = isSystemCharacter;
            _isControlCharacter = isControlCharacter; 
 
            _characterCode = characterCode;
        } 


        /// <summary>
        ///     Read-only access to the state of dead character 
        /// </summary>
        public boolean IsDeadCharacter {get {return _isDeadCharacter;}} 
 
        /// <summary>
        ///     Read-only access to the state of system character 
        /// </summary>
        public boolean IsSystemCharacter {get {return _isSystemCharacter;}}

        /// <summary> 
        ///     Read-only access to the state of control character
        /// </summary> 
        public boolean IsControlCharacter {get {return _isControlCharacter;}} 

        /// <summary> 
        ///     Read-only access to the character code that was reported.
        /// </summary>
        public char CharacterCode {get {return _characterCode;}}
 
        private final boolean _isDeadCharacter;
        private final boolean _isSystemCharacter; 
        private final boolean _isControlCharacter; 
        private final char _characterCode;
    } 