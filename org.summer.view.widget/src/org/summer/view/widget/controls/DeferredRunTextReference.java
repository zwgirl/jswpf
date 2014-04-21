package org.summer.view.widget.controls;

import org.summer.view.widget.BaseValueSourceInternal;
import org.summer.view.widget.DeferredReference;
import org.summer.view.widget.Type;
import org.summer.view.widget.documents.Run;
 // Proxy Object passed to the property system to delay load TextProperty 
    // values. 
    /*internal*/ public class DeferredRunTextReference extends DeferredReference
    { 
        //-----------------------------------------------------
        //
        //  Constructors
        // 
        //-----------------------------------------------------
 
//        #region Constructors 

        /*internal*/ public DeferredRunTextReference(Run run) 
        {
            _run = run;
        }
 
//        #endregion Constructors
 
        //------------------------------------------------------ 
        //
        //  Internal Methods 
        //
        //-----------------------------------------------------

//        #region Internal Methods 

        // Does the real work to calculate the current TextProperty value. 
        /*internal*/ public /*override*/ Object GetValue(BaseValueSourceInternal valueSource) 
        {
            return TextRangeBase.GetTextInternal(_run.ContentStart, _run.ContentEnd); 
        }

        // Gets the type of the value it represents
        /*internal*/ public /*override*/ Type GetValueType() 
        {
            return typeof(String); 
        } 

//        #endregion Internal Methods 

        //------------------------------------------------------
        //
        //  Private Fields 
        //
        //------------------------------------------------------ 
 
//        #region Private Fields
 
        // Run mapped to this Object.
        private final Run _run;

//        #endregion Private Fields 
    }