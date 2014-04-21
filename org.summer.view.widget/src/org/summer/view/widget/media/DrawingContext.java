package org.summer.view.widget.media;

import org.summer.view.widget.IDisposable;
import org.summer.view.widget.Point;
import org.summer.view.widget.threading.DispatcherObject;
    /// <summary>
    /// Drawing context. 
    /// </summary>
    public abstract /*partial*/ class DrawingContext extends DispatcherObject implements IDisposable 
    { 
//        #region Constructors
        /// <summary> 
        /// Default constructor for DrawingContext - this uses the current Dispatcher.
        /// </summary>
        /*internal*/public DrawingContext()
        { 
            // Nothing to do here
        } 
 
//        #endregion Constructors
 
//        #region Public Methods

        /// <summary>
        /// Draw Text at the location specified. 
        /// </summary>
        /// <param name="formattedText"> The FormattedText to draw. </param> 
        /// <param name="origin"> The location at which to draw the text. </param> 
        /// <exception cref="ObjectDisposedException">
        /// This call is illegal if this object has already been closed or disposed. 
        /// </exception>
        public void DrawText(FormattedText formattedText,
                             Point origin)
        { 

            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, EventTrace.Event.WClientStringBegin, "DrawingContext.DrawText Start"); 
 
            VerifyApiNonstructuralChange();
//#if DEBUG 
            MediaTrace.DrawingContextOp.Trace("DrawText(const)");
//#endif
            if (formattedText == null)
            { 
                return;
            } 
 
            formattedText.Draw(this, origin);
 
            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, EventTrace.Event.WClientStringEnd, "DrawingContext.DrawText End");
        }

        /// <summary> 
        /// Closes the DrawingContext and flushes the content.
        /// Afterwards the DrawingContext can not be used anymore. 
        /// This call does not require all Push calls to have been Popped. 
        /// </summary>
        /// <exception cref="ObjectDisposedException"> 
        /// This call is illegal if this object has already been closed or disposed.
        /// </exception>
        public abstract void Close();
 
        /// <summary>
        /// This is the same as the Close call: 
        /// Closes the DrawingContext and flushes the content. 
        /// Afterwards the DrawingContext can not be used anymore.
        /// This call does not require all Push calls to have been Popped. 
        /// </summary>
        /// <exception cref="ObjectDisposedException">
        /// This call is illegal if this object has already been closed or disposed.
        /// </exception> 
        public void /*IDisposable.*/Dispose()
        { 
            // Call a virtual method for derived Dispose implementations 
            //
            // Attempting to override a explicit interface member implementation causes 
            // the most-derived implementation to always be called, and the base
            // implementation becomes uncallable.  But FxCop requires the base Dispose
            // method is always be called.  To avoid this situation, we use the *Core
            // pattern for derived classes, instead of attempting to override 
            // IDisposable.Dispose.
 
            VerifyAccess(); 

            DisposeCore(); 
            GC.SuppressFinalize(this);
        }

//        #endregion Public Methods 

//        #region Protected Methods 
 

        /// <summary> 
        /// Dispose functionality implemented by subclasses
        /// </summary>
        /// <exception cref="ObjectDisposedException">
        /// This call is illegal if this object has already been closed or disposed. 
        /// </exception>
        protected abstract void DisposeCore(); 
 
        /// <summary>
        /// This verifies that the API can be called for read only access. 
        /// </summary>
        protected /*virtual*/ void VerifyApiNonstructuralChange()
        {
            this.VerifyAccess(); 
        }
 
//        #endregion Protected Methods 
    }