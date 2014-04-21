package org.summer.view.window;

import org.summer.view.widget.EventArgs;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Rect;
import org.summer.view.widget.UIElement;
import org.summer.view.widget.internal.EventHandler;
import org.summer.view.widget.media.Visual;
import org.summer.view.widget.threading.Dispatcher;
import org.summer.view.widget.threading.DispatcherObject;
import org.summer.view.window.automation.peer.AutomationPeer;

/// <summary>
/// Top-level ContextLayoutManager Object. Manages the layout update and layout dirty state. 
/// </summary>
/*internal*/ public /*sealed*/ class ContextLayoutManager extends DispatcherObject
{

    /*internal*/ public ContextLayoutManager()
    { 
        _shutdownHandler = new EventHandler(this.OnDispatcherShutdown); 
        Dispatcher.ShutdownFinished += _shutdownHandler;
    } 

    void OnDispatcherShutdown(Object sender, EventArgs e)
    {
        if(_shutdownHandler != null) 
            Dispatcher.ShutdownFinished -= _shutdownHandler;

        _shutdownHandler = null; 
        _layoutEvents = null;
        _measureQueue = null; 
        _arrangeQueue = null;
        _sizeChangedChain = null;
        _isDead = true;
    } 


    /// <summary> 
    /// The way to obtain ContextLayoutManager associated with particular Dispatcher.
    /// </summary> 
    /// <param name="dispatcher">A dispatcher for which ContextLayoutManager is queried.
    /// There is only one ContextLayoutManager associuated with all elements in a single context</param>
    /// <returns>ContextLayoutManager</returns>
    /*internal*/ public static ContextLayoutManager From(Dispatcher dispatcher) 
    {
        ContextLayoutManager lm = dispatcher.Reserved3 as ContextLayoutManager; 
        if(lm == null) 
        {
            if(Dispatcher.CurrentDispatcher != dispatcher) 
            {
                throw new InvalidOperationException();
            }

            lm = new ContextLayoutManager();
            dispatcher.Reserved3 = lm; 
        } 
        return lm;
    } 

    private void setForceLayout(UIElement e)
    {
        _forceLayoutElement = e; 
    }

    private void markTreeDirty(UIElement e) 
    {
        //walk up until we are the topmost UIElement in the tree. 
        while(true)
        {
            UIElement p = e.GetUIParentNo3DTraversal() as UIElement;
            if(p == null) break; 
            e = p;
        } 

        markTreeDirtyHelper(e);
        MeasureQueue.Add(e); 
        ArrangeQueue.Add(e);
    }

    private void markTreeDirtyHelper(Visual v) 
    {
        //now walk down and mark all UIElements dirty 
        if(v != null) 
        {
            if(v.CheckFlagsAnd(VisualFlags.IsUIElement)) 
            {
                UIElement uie = ((UIElement)v);
                uie.InvalidateMeasureInternal();
                uie.InvalidateArrangeInternal(); 
            }

            //walk children doing the same, don't stop if they are already dirty since there can 
            //be insulated dirty islands below
            int cnt = v.InternalVisualChildrenCount; 

            for(int i=0; i<cnt; i++)
            {
                Visual child = v.InternalGetVisualChild(i); 
                if (child != null) markTreeDirtyHelper(child);
            } 
        } 
    }

    // posts a layout update
    private void NeedsRecalc()
    {
        if(!_layoutRequestPosted && !_isUpdating) 
        {
            MediaContext.From(Dispatcher).BeginInvokeOnRender(_updateCallback, this); 
            _layoutRequestPosted = true; 
        }
    } 

    private static Object UpdateLayoutBackground(Object arg)
    {
        ((ContextLayoutManager)arg).NeedsRecalc(); 
        return null;
    } 

    private boolean hasDirtiness
    { 
        get
        {
            return (!MeasureQueue.IsEmpty) || (!ArrangeQueue.IsEmpty);
        } 
    }

    /*internal*/ public void EnterMeasure() 
    {
        Dispatcher._disableProcessingCount++; 
        _lastExceptionElement = null;
        _measuresOnStack++;
        if(_measuresOnStack > s_LayoutRecursionLimit)
            throw new InvalidOperationException(/*SR.Get(SRID.LayoutManager_DeepRecursion, s_LayoutRecursionLimit)*/); 

        _firePostLayoutEvents = true; 
    } 

    /*internal*/ public void ExitMeasure() 
    {
        _measuresOnStack--;
        Dispatcher._disableProcessingCount--;
    } 

    /*internal*/ public void EnterArrange() 
    { 
        Dispatcher._disableProcessingCount++;
        _lastExceptionElement = null; 
        _arrangesOnStack++;
        if(_arrangesOnStack > s_LayoutRecursionLimit)
            throw new InvalidOperationException(/*SR.Get(SRID.LayoutManager_DeepRecursion, s_LayoutRecursionLimit)*/);

        _firePostLayoutEvents = true;
    } 

    /*internal*/ public void ExitArrange()
    { 
        _arrangesOnStack--;
        Dispatcher._disableProcessingCount--;
    }

    /// <summary>
    /// Tells ContextLayoutManager to finalize possibly async update. 
    /// Used before accessing services off Visual. 
    /// </summary>

    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/ public void UpdateLayout()
    {
        VerifyAccess(); 

        //make UpdateLayout to be a NOP if called during UpdateLayout. 
        if (   _isInUpdateLayout 
            || _measuresOnStack > 0
            || _arrangesOnStack > 0 
            || _isDead) return;

//#if DEBUG_CLR_MEM
        boolean clrTracingEnabled = false; 

        // Start over with the Measure and arrange counters for this layout pass 
        int measureCLRPass = 0; 
        int arrangeCLRPass = 0;

        if (CLRProfilerControl.ProcessIsUnderCLRProfiler)
        {
            clrTracingEnabled = true;
            if (CLRProfilerControl.CLRLoggingLevel >= CLRProfilerControl.CLRLogState.Performance) 
            {
                ++_layoutCLRPass; 
                CLRProfilerControl.CLRLogWriteLine("Begin_Layout_{0}", _layoutCLRPass); 
            }
        } 
//#endif // DEBUG_CLR_MEM

        boolean etwTracingEnabled = false;
        long perfElementID = 0; 
//        /*const*/ static final EventTrace.Keyword etwKeywords = EventTrace.Keyword.KeywordLayout | EventTrace.Keyword.KeywordPerf;
//        if (!_isUpdating && EventTrace.IsEnabled(etwKeywords, EventTrace.Level.Info)) 
//        { 
//            etwTracingEnabled = true;
//            perfElementID = PerfService.GetPerfElementID(this); 
//            EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientLayoutBegin, etwKeywords, EventTrace.Level.Info,
//                    perfElementID, EventTrace.LayoutSource.LayoutManager);
//        }

        int cnt = 0;
        boolean gotException = true; 
        UIElement currentElement = null; 

        try 
        {
            invalidateTreeIfRecovering();


            while(hasDirtiness || _firePostLayoutEvents)
            { 
                if(++cnt > 153) 
                {
                    //loop detected. Lets go over to background to let input/user to correct the situation. 
                    //most frequently, we get such a loop as a result of input detecting a mouse in the "bad spot"
                    //and some event handler oscillating a layout-affecting property depending on hittest result
                    //of the mouse. Going over to background will not break the loopp but will allow user to
                    //move the mouse so that it goes out of the "bad spot". 
                    Dispatcher.BeginInvoke(DispatcherPriority.Background, _updateLayoutBackground, this);
                    currentElement = null; 
                    gotException = false; 
//                    if (etwTracingEnabled)
//                    { 
//                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientLayoutAbort, etwKeywords, EventTrace.Level.Info, 0, cnt);
//                    }
                    return;
                } 


                //this flag stops posting update requests to MediaContext - we are already in one 
                //note that _isInUpdateLayout is close but different - _isInUpdateLayout is reset
                //before firing LayoutUpdated so that event handlers could call UpdateLayout but 
                //still could not cause posting of MediaContext work item. Posting MediaContext workitem
                //causes infinite loop in MediaContext.
                _isUpdating = true;
                _isInUpdateLayout = true; 

//#if DEBUG_CLR_MEM 
//                if (clrTracingEnabled && (CLRProfilerControl.CLRLoggingLevel >= CLRProfilerControl.CLRLogState.Verbose)) 
//                {
//                    ++measureCLRPass; 
//                    CLRProfilerControl.CLRLogWriteLine("Begin_Measure_{0}_{1}", _layoutCLRPass, measureCLRPass);
//                }
//#endif // DEBUG_CLR_MEM

//                if (etwTracingEnabled)
//                { 
//                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientMeasureBegin, etwKeywords, EventTrace.Level.Info, perfElementID); 
//                }

                // Disable processing of the queue during blocking operations to prevent unrelated reentrancy.
                using(Dispatcher.DisableProcessing())
                {

                    //loop for Measure
                    //We limit the number of loops here by time - normally, all layout 
                    //calculations should be done by this time, this limit is here for 
                    //emergency, "infinite loop" scenarios - yielding in this case will
                    //provide user with ability to continue to interact with the app, even though 
                    //it will be sluggish. If we don't yield here, the loop is goign to be a deadly one
                    //and it will be impossible to save results or even close the window.
                    int loopCounter = 0;
                    DateTime loopStartTime = new DateTime(0); 
                    while(true)
                    { 
                        if(++loopCounter > 153) 
                        {
                            loopCounter = 0; 
                            //first bunch of iterations is free, then we start count time
                            //this way, we don't call DateTime.Now in most layout updates
                            if(loopStartTime.Ticks == 0)
                            { 
                                loopStartTime = DateTime.UtcNow;
                            } 
                            else 
                            {
                                TimeSpan loopDuration = (DateTime.UtcNow - loopStartTime); 
                                if(loopDuration.Milliseconds > 153*2) // 153*2 = magic*science
                                {
                                    //loop detected. Lets go over to background to let input work.
                                    Dispatcher.BeginInvoke(DispatcherPriority.Background, _updateLayoutBackground, this); 
                                    currentElement = null;
                                    gotException = false; 
//                                    if (etwTracingEnabled) 
//                                    {
//                                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientMeasureAbort, etwKeywords, EventTrace.Level.Info, 
//                                               loopDuration.Milliseconds, loopCounter);
//                                    }
                                    return;
                                } 
                            }
                        } 

                        currentElement = MeasureQueue.GetTopMost();

                        if(currentElement == null) break; //exit if no more Measure candidates

                        currentElement.Measure(currentElement.PreviousConstraint);
//dmitryt, bug 1150880: not clear why this is needed, remove for now 
//if the parent was just computed, the chidlren should be clean. If they are not clean and in the queue
//that means that there is cross-tree dependency and they most likely shodul be updated by themselves. 
//                        MeasureQueue.RemoveOrphans(currentElement); 
                    }

//                    if (etwTracingEnabled)
//                    {
//                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientMeasureEnd, etwKeywords, EventTrace.Level.Info, loopCounter);
//                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientArrangeBegin, etwKeywords, EventTrace.Level.Info, perfElementID); 
//                    }


//#if DEBUG_CLR_MEM
                    if (clrTracingEnabled && (CLRProfilerControl.CLRLoggingLevel >= CLRProfilerControl.CLRLogState.Verbose)) 
                    {
                        CLRProfilerControl.CLRLogWriteLine("End_Measure_{0}_{1}", _layoutCLRPass, measureCLRPass);
                        ++arrangeCLRPass;
                        CLRProfilerControl.CLRLogWriteLine("Begin_Arrange_{0}_{1}", _layoutCLRPass, arrangeCLRPass); 
                    }
//#endif // DEBUG_CLR_MEM 

                    //loop for Arrange
                    //if Arrange dirtied the tree go clean it again 

                    //We limit the number of loops here by time - normally, all layout
                    //calculations should be done by this time, this limit is here for
                    //emergency, "infinite loop" scenarios - yielding in this case will 
                    //provide user with ability to continue to interact with the app, even though
                    //it will be sluggish. If we don't yield here, the loop is goign to be a deadly one 
                    //and it will be impossible to save results or even close the window. 
                    loopCounter = 0;
                    loopStartTime = new DateTime(0); 
                    while(MeasureQueue.IsEmpty)
                    {
                        if(++loopCounter > 153)
                        { 
                            loopCounter = 0;
                            //first bunch of iterations is free, then we start count time 
                            //this way, we don't call DateTime.Now in most layout updates 
                            if(loopStartTime.Ticks == 0)
                            { 
                                loopStartTime = DateTime.UtcNow;
                            }
                            else
                            { 
                                TimeSpan loopDuration = (DateTime.UtcNow - loopStartTime);
                                if(loopDuration.Milliseconds > 153*2) // 153*2 = magic*science 
                                { 
                                    //loop detected. Lets go over to background to let input work.
                                    Dispatcher.BeginInvoke(DispatcherPriority.Background, _updateLayoutBackground, this); 
                                    currentElement = null;
                                    gotException = false;
//                                    if (etwTracingEnabled)
//                                    { 
//                                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientArrangeAbort, etwKeywords, EventTrace.Level.Info,
//                                               loopDuration.Milliseconds, loopCounter); 
//                                    } 
                                    return;
                                } 
                            }
                        }

                        currentElement = ArrangeQueue.GetTopMost(); 

                        if(currentElement == null) break; //exit if no more Measure candidates 

                        Rect finalRect = getProperArrangeRect(currentElement);

                        currentElement.Arrange(finalRect);
//dmitryt, bug 1150880: not clear why this is needed, remove for now
//if the parent was just computed, the chidlren should be clean. If they are not clean and in the queue
//that means that there is cross-tree dependency and they most likely shodul be updated by themselves. 
//                        ArrangeQueue.RemoveOrphans(currentElement);
                    } 

                    if (etwTracingEnabled)
                    { 
                        EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientArrangeEnd, etwKeywords, EventTrace.Level.Info, loopCounter);
                    }

//#if DEBUG_CLR_MEM 
                    if (clrTracingEnabled && (CLRProfilerControl.CLRLoggingLevel >= CLRProfilerControl.CLRLogState.Verbose))
                    { 
                        CLRProfilerControl.CLRLogWriteLine("End_Arrange_{0}_{1}", _layoutCLRPass, arrangeCLRPass); 
                    }
//#endif // DEBUG_CLR_MEM 

                    //if Arrange dirtied the tree go clean it again
                    //it is not neccesary to check ArrangeQueue sicnce we just exited from Arrange loop
                    if(!MeasureQueue.IsEmpty) continue; 

                    //let LayoutUpdated handlers to call UpdateLayout 
                    //note that it means we can get reentrancy into UpdateLayout past this point, 
                    //if any of event handlers call UpdateLayout [....]. Need to protect from reentrancy
                    //in the firing methods below. 
                    _isInUpdateLayout = false;

                }

                fireSizeChangedEvents();
                if(hasDirtiness) continue; 
                fireLayoutUpdateEvent(); 
                if(hasDirtiness) continue;
                fireAutomationEvents(); 
                if(hasDirtiness) continue;
                fireSizeChangedEvents(); // if nothing is dirty, one last chance for any size changes to announce.
            }

            currentElement = null;
            gotException = false; 
        } 
        finally
        { 
            _isUpdating = false;
            _layoutRequestPosted = false;
            _isInUpdateLayout = false;

            if(gotException)
            { 
                if (etwTracingEnabled) 
                {
                    EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientLayoutException, etwKeywords, EventTrace.Level.Info, PerfService.GetPerfElementID(currentElement)); 
                }

                //set indicator
                _gotException = true; 
                _forceLayoutElement = currentElement;

                //make attempt to request the subsequent layout calc 
                //some exception handler schemas use Idle priorities to
                //wait until dust settles. Then they correct the issue noted in the exception handler. 
                //We don't want to attempt to re-do the operation on the priority higher then that.
                Dispatcher.BeginInvoke(DispatcherPriority.ApplicationIdle, _updateLayoutBackground, this);
            }
        } 

        MS.Internal.Text.TextInterface.Font.ResetFontFaceCache(); 
        MS.Internal.FontCache.BufferCache.Reset(); 

        if (etwTracingEnabled) 
        {
            EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientLayoutEnd, etwKeywords, EventTrace.Level.Info);
        }

//#if DEBUG_CLR_MEM
        if (clrTracingEnabled && (CLRProfilerControl.CLRLoggingLevel >= CLRProfilerControl.CLRLogState.Performance)) 
        { 
            CLRProfilerControl.CLRLogWriteLine("End_Layout_{0}", _layoutCLRPass);
        } 
//#endif // DEBUG_CLR_MEM

    }

    private Rect getProperArrangeRect(UIElement element)
    { 
        Rect arrangeRect = element.PreviousArrangeRect; 

        // ELements without a parent (top level) get Arrange at DesiredSize 
        // if they were measured "to content" (as infinity indicates).
        // If we arrange the element that is temporarily disconnected
        // so it is not a top-level one, the assumption is that it will be
        // layout-invalidated and/or recomputed by the parent when reconnected. 
        if (element.GetUIParentNo3DTraversal() == null)
        { 
            arrangeRect.X = arrangeRect.Y = 0; 

            if (Double.IsPositiveInfinity(element.PreviousConstraint.Width)) 
                arrangeRect.Width = element.DesiredSize.Width;

            if (Double.IsPositiveInfinity(element.PreviousConstraint.Height))
                arrangeRect.Height = element.DesiredSize.Height; 
        }

        return arrangeRect; 
    }

    private void invalidateTreeIfRecovering()
    {
        if((_forceLayoutElement != null) || _gotException)
        { 
            if(_forceLayoutElement != null)
            { 
                markTreeDirty(_forceLayoutElement); 
            }

            _forceLayoutElement = null;
            _gotException = false;
        }
    } 

    /*internal*/ public LayoutQueue MeasureQueue 
    { 
        get
        { 
            if(_measureQueue == null)
                _measureQueue = new InternalMeasureQueue();
            return _measureQueue;
        } 
    }

    /*internal*/ public LayoutQueue ArrangeQueue 
    {
        get 
        {
            if(_arrangeQueue == null)
                _arrangeQueue = new InternalArrangeQueue();
            return _arrangeQueue; 
        }
    } 


    // delegate for dispatcher - keep it static so we don't allocate new ones.
    private static DispatcherOperationCallback _updateCallback = new DispatcherOperationCallback(UpdateLayoutCallback); 
    private static Object UpdateLayoutCallback(Object arg) 
    {
        ContextLayoutManager ContextLayoutManager = arg instanceof ContextLayoutManager ? arg : null; 
        if(ContextLayoutManager != null)
            ContextLayoutManager.UpdateLayout();
        return null;
    } 

    //walks the list, fires events to alive handlers and removes dead ones 
    private void fireLayoutUpdateEvent() 
    {
        //no reentrancy. It may happen if one of handlers calls UpdateLayout synchronously 
        if(_inFireLayoutUpdated) return;

        EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireLayoutUpdatedBegin);
        try 
        {
            _inFireLayoutUpdated = true; 

            LayoutEventList.ListItem [] copy = LayoutEvents.CopyToArray();

            for(int i=0; i<copy.length; i++)
            {
                LayoutEventList.ListItem item = copy[i];
                //store handler here in case if thread gets pre-empted between check for IsAlive and invocation 
                //and GC can run making something that was alive not callable.
                EventHandler e = null; 
                try 
                {
                    // this will return null if element is already GC'ed 
                    e = (EventHandler)(item.Target);
                }
                catch(InvalidOperationException ex) //this will happen if element is being resurrected after finalization
                { 
                    e = null;
                } 

                if(e != null)
                { 
                    e(null, EventArgs.Empty);
                    // if handler dirtied the tree, go clean it again before calling other handlers
                    if(hasDirtiness) break;
                } 
                else
                { 
                    LayoutEvents.Remove(item); 
                }
            } 
         }
        finally
        {
            _inFireLayoutUpdated = false; 
            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireLayoutUpdatedEnd);
        } 
    } 


    private LayoutEventList _layoutEvents;

    /*internal*/ public LayoutEventList LayoutEvents
    { 
        get
        { 
            if(_layoutEvents == null) 
                _layoutEvents = new LayoutEventList();
            return _layoutEvents; 
        }
    }

    /*internal*/ public void AddToSizeChangedChain(SizeChangedInfo info) 
    {
        //this typically will cause firing of SizeChanged from top to down. However, this order is not 
        //specified for any users and is subject to change without notice. 
        info.Next = _sizeChangedChain;
        _sizeChangedChain = info; 
    }




    private void fireSizeChangedEvents() 
    { 
        //no reentrancy. It may happen if one of handlers calls UpdateLayout synchronously
        if(_inFireSizeChanged) return; 

        EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireSizeChangedBegin);
        try
        { 
            _inFireSizeChanged = true;

            //loop for SizeChanged 
            while(_sizeChangedChain != null)
            { 
                SizeChangedInfo info = _sizeChangedChain;
                _sizeChangedChain = info.Next;

                info.Element.sizeChangedInfo = null; 

                info.Element.OnRenderSizeChanged(info); 

                //if callout dirtified the tree, return to cleaning
                if(hasDirtiness) break; 
            }
        }
        finally
        { 
            _inFireSizeChanged = false;
            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireSizeChangedEnd); 
        } 
    }

    private void fireAutomationEvents()
    {
        //no reentrancy. It may happen if one of handlers calls UpdateLayout synchronously
        if(_inFireAutomationEvents) return; 

        EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireAutomationEventsBegin); 
        try 
        {
            _inFireAutomationEvents = true; 
            _firePostLayoutEvents = false;

            LayoutEventList.ListItem [] copy = AutomationEvents.CopyToArray();

            for(int i=0; i<copy.length; i++)
            { 
                LayoutEventList.ListItem item = copy[i]; 
                //store peer here in case if thread gets pre-empted between check for IsAlive and invocation
                //and GC can run making something that was alive not callable. 
                AutomationPeer peer = null;
                try
                {
                    // this will return null if element is already GC'ed 
                    peer = (AutomationPeer)(item.Target);
                } 
                catch(InvalidOperationException ex) //this will happen if element is being resurrected after finalization 
                {
                    peer = null; 
                }

                if(peer != null)
                { 
                    peer.FireAutomationEvents();
                    // if handler dirtied the tree, go clean it again before calling other handlers 
                    if(hasDirtiness) break; 
                }
                else 
                {
                    AutomationEvents.Remove(item);
                }
            } 
        }
        finally 
        { 
            _inFireAutomationEvents = false;
            EventTrace.EasyTraceEvent(EventTrace.Keyword.KeywordLayout, EventTrace.Level.Verbose, EventTrace.Event.WClientLayoutFireAutomationEventsEnd); 
        }
    }

    private LayoutEventList _automationEvents; 

    /*internal*/ public LayoutEventList AutomationEvents 
    { 
        get
        { 
            if(_automationEvents == null)
                _automationEvents = new LayoutEventList();
            return _automationEvents;
        } 
    }

    /*internal*/ public AutomationPeer[] GetAutomationRoots() 
    {
        LayoutEventList.ListItem [] copy = AutomationEvents.CopyToArray(); 

        AutomationPeer[] peers = new AutomationPeer[copy.length];
        int freeSlot = 0;

        for(int i=0; i<copy.length; i++)
        { 
            LayoutEventList.ListItem item = copy[i]; 
            //store peer here in case if thread gets pre-empted between check for IsAlive and invocation
            //and GC can run making something that was alive not callable. 
            AutomationPeer peer = null;
            try
            {
                // this will return null if element is already GC'ed 
                peer = (AutomationPeer)(item.Target);
            } 
            catch(InvalidOperationException ex) //this will happen if element is being resurrected after finalization 
            {
                peer = null; 
            }

            if(peer != null)
            { 
                peers[freeSlot++] = peer;
            } 
        } 

        return peers; 
    }

    //this is used to prevent using automation roots in AutomationPeer when there are
    //[....] updates of AutomationPeers on the stack. It is here because LayoutManager is 
    //a Dispatcher-wide Object and [....] updates are per-dispatcher. Basically,
    //it is here to avoid creating AutomationManager to track Dispatcher scope. 
    /*internal*/ public int AutomationSyncUpdateCounter 
    {
        get 
        {
            return _automationSyncUpdateCounter;
        }
        set 
        {
            _automationSyncUpdateCounter = value; 
        } 
    }

    //Debuggability support - see LayoutInformation class in Framework
    /*internal*/ public UIElement GetLastExceptionElement()
    {
        return _lastExceptionElement; 
    }

    /*internal*/ public void SetLastExceptionElement(UIElement e) 
    {
        _lastExceptionElement = e; 
    }

   ///// DATA //////

    private UIElement _forceLayoutElement; //set in extreme situations, forces the update of the whole tree containing the element
    private UIElement _lastExceptionElement; //set on exception in Measure or Arrange. 

    private InternalMeasureQueue _measureQueue;
    private InternalArrangeQueue _arrangeQueue; 
    private SizeChangedInfo      _sizeChangedChain;

    private static DispatcherOperationCallback _updateLayoutBackground = new DispatcherOperationCallback(UpdateLayoutBackground);
    private EventHandler _shutdownHandler; 

    /*internal*/ public static int s_LayoutRecursionLimit = UIElement.MAX_ELEMENTS_IN_ROUTE; //to keep these two constants in [....] 
    private int _arrangesOnStack; 
    private int _measuresOnStack;
    private int _automationSyncUpdateCounter; 

    private boolean      _isDead;
    private boolean      _isUpdating;
    private boolean      _isInUpdateLayout; 
    private boolean      _gotException; //true if UpdateLayout exited with exception
    private boolean      _layoutRequestPosted; 
    private boolean      _inFireLayoutUpdated; 
    private boolean      _inFireSizeChanged;
    private boolean      _firePostLayoutEvents; 
    private boolean      _inFireAutomationEvents;


//#if DEBUG_CLR_MEM 
    // Used for CLRProfiler comments
    private static int _layoutCLRPass = 0; 
//#endif 

    
} 

    