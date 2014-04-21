package org.summer.view.widget.input;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.List;

///<summary> 
    /// InputScope class is a type which InputScope property holds. FrameworkElement.IputScope returns the current inherited InputScope
    /// instance for the element
    ///</summary>
    /// <speclink>http://avalon/Cicero/Specifications/Stylable%20InputScope.mht</speclink> 

//    [TypeConverter("System.Windows.Input.InputScopeConverter, PresentationCore, Version=" + BuildInfo.WCP_VERSION + ", Culture=neutral, PublicKeyToken=" + BuildInfo.WCP_PUBLIC_KEY_TOKEN + ", Custom=null")] 
    public class InputScope 
    {
        // 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public /*System.Collections.*/IList Names 
        {
            get
            {
                return (/*System.Collections.*/IList)_scopeNames; 
            }
        } 
 
        ///<summary>
        /// SrgsMarkup is currently speech specific. Will be used in non-speech 
        /// input methods in the near future too
        ///</summary>
//        [DefaultValue(null)]
        public String SrgsMarkup 
        {
            get 
            { 
                return _srgsMarkup;
            } 
            set
            {
                if (value == null)
                { 
                    throw new ArgumentNullException("value");
                } 
                _srgsMarkup = value; 
            }
        } 

        ///<summary>
        /// RegularExpression is used as a suggested input text pattern
        /// for input processors. 
        ///</summary>
//        [DefaultValue(null)] 
        public String RegularExpression 
        {
            get 
            {
                return _regexString;
            }
            set 
            {
                if (value == null) 
                { 
                    throw new ArgumentNullException("value");
                } 
                _regexString = value;
            }
        }
        ///<summary> 
        /// PhraseList is a collection of suggested input patterns.
        /// Each phrase is of type InputScopePhrase 
        ///</summary> 
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public /*System.Collections.*/IList PhraseList 
        {
            get
            {
                return (/*System.Collections.*/IList)_phraseList; 
            }
        } 
 

        private  IList<InputScopeName>  _scopeNames = new List<InputScopeName>(); 
        private  IList<InputScopePhrase>  _phraseList = new List<InputScopePhrase>();
        private  String           _regexString;
        private  String           _srgsMarkup;
 
    }
 
 

