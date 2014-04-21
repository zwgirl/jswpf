package org.summer.view.widget.input;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.markup.IAddChild;

///<summary> 
/// InputScopePhrase is a class that implements InputScopePhrase tag
/// Each InputScopePhrase represents a suggested input text pattern and ususally used to
/// form a list
///</summary> 
//[ContentProperty("NameValue")]
//[TypeConverter("System.Windows.Input.InputScopeNameConverter, PresentationCore, Version=" + BuildInfo.WCP_VERSION + ", Culture=neutral, PublicKeyToken=" + BuildInfo.WCP_PUBLIC_KEY_TOKEN + ", Custom=null")] 

public class InputScopePhrase implements IAddChild
    { 
        // NOTE: this is a class rather than a simple String so that we can add more hint information 
        //           for input phrase such as typing stroke, pronouciation etc.
        //           should be enhanced as needed. 

        //----------------------------------------------------------------------------
        //
        // Public Methods 
        //
        //--------------------------------------------------------------------------- 
 
// #region Public Methods
        ///<summary> 
        /// Default Constructor necesary for parser
        ///</summary>
        public InputScopePhrase()
        { 
        }
 
        ///<summary> 
        /// Constructor that takes name
        ///</summary> 
        public InputScopePhrase(String name)
        {
            if (name == null)
            { 
                throw new ArgumentNullException("name");
            } 
            _phraseName = name; 
        }
 
//#region implementation of IAddChild
        ///<summary>
        /// Called to Add the Object as a Child. For InputScopePhrase tag this is ignored
        ///</summary> 
        ///<param name="value">
        /// Object to add as a child 
        ///</param> 
        public void AddChild(Object value)
        { 
            throw new System.NotImplementedException();
        }

        /// <summary> 
        ///  if text is present between InputScopePhrase tags, the text is added as a phrase name
        /// </summary> 
        ///<param name="name"> 
        /// Text String to add
        ///</param> 
        public void AddText(String name)
        {
            if (name == null)
            { 
                throw new ArgumentNullException("name");
            } 
            _phraseName = name; 
        }
 
//#endregion IAddChild

//#endregion Public Methods
 
//#region class public properties
        ///<summary> 
        /// Name property - this is used when accessing the String that is set to InputScopePhrase 
        ///</summary>
        public String Name 
        {
            get { return _phraseName; }
            set { _phraseName = value; }
        } 
//#endregion class public properties
 
        private String _phraseName; 
    }