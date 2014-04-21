define(["dojo/_base/declare","system/Type","windows/DependencyObject","windows/UIElement","input/InputBindingCollection","input/CommandBindingCollection","windows/IInputElement","animation/IAnimatable","windows/UIPropertyMetadata"],function(declare,Type,DependencyObject,UIElement,InputBindingCollection,CommandBindingCollection,IInputElement,IAnimatable,UIPropertyMetadata){var EventHandlersStoreField=UIElement.EventHandlersStoreField;var InputBindingCollectionField=UIElement.InputBindingCollectionField;var CommandBindingCollectionField=UIElement.CommandBindingCollectionField;var ContentElement=declare("ContentElement",[DependencyObject,IInputElement,IAnimatable],{constructor:function(){},ApplyAnimationClock:function(dp,clock,handoffBehavior){if(handoffBehavior===undefined){handoffBehavior=HandoffBehavior.SnapshotAndReplace}if(dp==null){throw new ArgumentNullException("dp");}if(!AnimationStorage.IsPropertyAnimatable(this,dp)){throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable,dp.Name,this.GetType()),"dp");}if(clock!=null&&!AnimationStorage.IsAnimationValid(dp,clock.Timeline)){throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch,clock.Timeline.GetType(),dp.Name,dp.PropertyType),"clock");}if(!HandoffBehaviorEnum.IsDefined(handoffBehavior)){throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior));}if(this.IsSealed){throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO,dp,this.GetType()));}AnimationStorage.ApplyAnimationClock(this,dp,clock,handoffBehavior)},BeginAnimation:function(dp,animation,handoffBehavior){if(handoffBehavior===undefined){handoffBehavior=HandoffBehavior.SnapshotAndReplace}if(dp==null){throw new ArgumentNullException("dp");}if(!AnimationStorage.IsPropertyAnimatable(this,dp)){throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable,dp.Name,this.GetType()),"dp");}if(animation!=null&&!AnimationStorage.IsAnimationValid(dp,animation)){throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch,animation.GetType(),dp.Name,dp.PropertyType),"animation");}if(!HandoffBehaviorEnum.IsDefined(handoffBehavior)){throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior));}if(this.IsSealed){throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO,dp,this.GetType()));}AnimationStorage.BeginAnimation(this,dp,animation,handoffBehavior)},GetAnimationBaseValue:function(dp){if(dp==null){throw new ArgumentNullException("dp");}return this.GetValueEntry(this.LookupEntry(dp.GlobalIndex),dp,null,RequestFlags.AnimationBaseValue).Value},EvaluateAnimatedValueCore:function(dp,metadata,entryRef){if(this.IAnimatable_HasAnimatedProperties){var storage=AnimationStorage.GetStorage(this,dp);if(storage!=null){storage.EvaluateAnimatedValue(metadata,entryRef)}}},BuildRouteCore:function(route,args){return false},BuildRoute:function(route,args){UIElement.BuildRouteHelper(this,route,args)},RaiseEvent:function(args,trusted){if(arguments.length==1){if(e==null){throw new ArgumentNullException("e");}e.ClearUserInitiated();return UIElement.RaiseEventImpl(this,e)}if(args==null){throw new ArgumentNullException("args");}if(trusted){this.RaiseTrustedEvent(args)}else{args.ClearUserInitiated();UIElement.RaiseEventImpl(this,args)}},RaiseTrustedEvent:function(args){if(args==null){throw new ArgumentNullException("args");}args.MarkAsUserInitiated();try{UIElement.RaiseEventImpl(this,args)}finally{args.ClearUserInitiated()}},AdjustEventSource:function(args){return null},AddHandler:function(routedEvent,handler,handledEventsToo){if(handledEventsToo===undefined){handledEventsToo=false}if(routedEvent==null){throw new ArgumentNullException("routedEvent");}if(handler==null){throw new ArgumentNullException("handler");}if(!routedEvent.IsLegalHandler(handler)){throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal));}this.EnsureEventHandlersStore();EventHandlersStore.AddRoutedEventHandler(routedEvent,handler,handledEventsToo);this.OnAddHandler(routedEvent,handler)},OnAddHandler:function(routedEvent,handler){},RemoveHandler:function(routedEvent,handler){if(routedEvent==null){throw new ArgumentNullException("routedEvent");}if(handler==null){throw new ArgumentNullException("handler");}if(!routedEvent.IsLegalHandler(handler)){throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal));}var store=this.EventHandlersStore;if(store!=null){store.RemoveRoutedEventHandler(routedEvent,handler);this.OnRemoveHandler(routedEvent,handler);if(store.Count==0){EventHandlersStoreField.ClearValue(this);this.WriteFlag(CoreFlags.ExistsEventHandlersStore,false)}}},OnRemoveHandler:function(routedEvent,handler){},EventHandlersStoreAdd:function(key,handler){this.EnsureEventHandlersStore();EventHandlersStore.Add(key,handler)},EventHandlersStoreRemove:function(key,handler){var store=this.EventHandlersStore;if(store!=null){store.Remove(key,handler);if(store.Count==0){EventHandlersStoreField.ClearValue(this);this.WriteFlag(CoreFlags.ExistsEventHandlersStore,false)}}},AddToEventRoute:function(route,e){if(route==null){throw new ArgumentNullException("route");}if(e==null){throw new ArgumentNullException("e");}var classListeners=GlobalEventManager.GetDTypedClassListeners(this.DependencyObjectType,e.RoutedEvent);while(classListeners!=null){for(var i=0;i<classListeners.Handlers.length;i++){route.Add(this,classListeners.Handlers[i].Handler,classListeners.Handlers[i].InvokeHandledEventsToo)}classListeners=classListeners.Next}var instanceListeners=null;var store=EventHandlersStore;if(store!=null){instanceListeners=store.Get(e.RoutedEvent);if(instanceListeners!=null){for(var i=0;i<instanceListeners.Count;i++){route.Add(this,instanceListeners.Get(i).Handler,instanceListeners.Get(i).InvokeHandledEventsToo)}}}AddToEventRouteCore(route,e)},AddToEventRouteCore:function(route,args){},EnsureEventHandlersStore:function(){if(EventHandlersStore==null){EventHandlersStoreField.SetValue(this,new EventHandlersStore());this.WriteFlag(CoreFlags.ExistsEventHandlersStore,true)}},InvalidateAutomationAncestorsCore:function(branchNodeStack,continuePastVisualTreeOut){continuePastVisualTreeOut.continuePastVisualTree=false;return true},OnPreviewMouseDown:function(e){},OnMouseDown:function(e){},OnPreviewMouseUp:function(e){},OnMouseUp:function(e){},OnPreviewMouseLeftButtonDown:function(e){},OnMouseLeftButtonDown:function(e){},OnPreviewMouseLeftButtonUp:function(e){},OnMouseLeftButtonUp:function(e){},OnPreviewMouseRightButtonDown:function(e){},OnMouseRightButtonDown:function(e){},OnPreviewMouseRightButtonUp:function(e){},OnMouseRightButtonUp:function(e){},OnPreviewMouseMove:function(e){},OnMouseMove:function(e){},OnPreviewMouseWheel:function(e){},OnMouseWheel:function(e){},OnMouseEnter:function(e){},OnMouseLeave:function(e){},OnGotMouseCapture:function(e){},OnLostMouseCapture:function(e){},OnQueryCursor:function(e){},OnPreviewKeyDown:function(e){},OnKeyDown:function(e){},OnPreviewKeyUp:function(e){},OnKeyUp:function(e){},OnPreviewGotKeyboardFocus:function(e){},OnGotKeyboardFocus:function(e){},OnPreviewLostKeyboardFocus:function(e){},OnLostKeyboardFocus:function(e){},OnPreviewTextInput:function(e){},OnTextInput:function(e){},OnPreviewQueryContinueDrag:function(e){},OnQueryContinueDrag:function(e){},OnPreviewGiveFeedback:function(e){},OnGiveFeedback:function(e){},OnPreviewDragEnter:function(e){},OnDragEnter:function(e){},OnPreviewDragOver:function(e){},OnDragOver:function(e){},OnPreviewDragLeave:function(e){},OnDragLeave:function(e){},OnPreviewDrop:function(e){},OnDrop:function(e){},OnIsMouseDirectlyOverChanged:function(e){},RaiseIsMouseDirectlyOverChanged:function(args){this.OnIsMouseDirectlyOverChanged(args);this.RaiseDependencyPropertyChanged(UIElement.IsMouseDirectlyOverChangedKey,args)},OnIsKeyboardFocusWithinChanged:function(e){},RaiseIsKeyboardFocusWithinChanged:function(args){this.OnIsKeyboardFocusWithinChanged(args);this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey,args)},OnIsMouseCapturedChanged:function(e){},RaiseIsMouseCapturedChanged:function(args){this.OnIsMouseCapturedChanged(args);this.RaiseDependencyPropertyChanged(UIElement.IsMouseCapturedChangedKey,args)},OnIsMouseCaptureWithinChanged:function(e){},RaiseIsMouseCaptureWithinChanged:function(args){this.OnIsMouseCaptureWithinChanged(args);this.RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey,args)},OnIsKeyboardFocusedChanged:function(e){},RaiseIsKeyboardFocusedChanged:function(args){this.OnIsKeyboardFocusedChanged(args);this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusedChangedKey,args)},ReadFlag:function(field){return(this._flags&field)!=0},WriteFlag:function(field,value){if(value){this._flags|=field}else{this._flags&=(~field)}},GetUIParent:function(continuePastVisualTree){if(continuePastVisualTree===undefined){continuePastVisualTree=false}var e=null;e=InputElement.GetContainingInputElement(this._parent);e=e instanceof DependencyObject?e:null;if(e==null&&continuePastVisualTree){var doParent=this.GetUIParentCore();e=InputElement.GetContainingInputElement(doParent);e=e instanceof DependencyObject?e:null}return e},GetUIParentCore:function(){return null},OnContentParentChanged:function(oldParent){this.SynchronizeReverseInheritPropertyFlags(oldParent,true)},AddSynchronizedInputPreOpportunityHandler:function(route,args){if(InputManager.IsSynchronizedInput){if(SynchronizedInputHelper.IsListening(this,args)){var eventHandler=new RoutedEventHandler(this.SynchronizedInputPreOpportunityHandler);SynchronizedInputHelper.AddHandlerToRoute(this,route,eventHandler,false)}}},AddSynchronizedInputPostOpportunityHandler:function(route,args){if(InputManager.IsSynchronizedInput){if(SynchronizedInputHelper.IsListening(this,args)){var eventHandler=new RoutedEventHandler(this.SynchronizedInputPostOpportunityHandler);SynchronizedInputHelper.AddHandlerToRoute(this,route,eventHandler,true)}else{SynchronizedInputHelper.AddParentPreOpportunityHandler(this,route,args)}}},SynchronizedInputPreOpportunityHandler:function(sender,args){if(!args.Handled){SynchronizedInputHelper.PreOpportunityHandler(sender,args)}},SynchronizedInputPostOpportunityHandler:function(sender,args){if(args.Handled&&(InputManager.SynchronizedInputState==SynchronizedInputStates.HadOpportunity)){SynchronizedInputHelper.PostOpportunityHandler(sender,args)}},StartListeningSynchronizedInput:function(inputType){if(InputManager.IsSynchronizedInput){return false}else{InputManager.StartListeningSynchronizedInput(this,inputType);return true}},CancelSynchronizedInput:function(){InputManager.CancelSynchronizedInput()},IsMouseDirectlyOver_ComputeValue:function(){return(Mouse.DirectlyOver==this)},SynchronizeReverseInheritPropertyFlags:function(oldParent,isCoreParent){if(this.IsKeyboardFocusWithin){Keyboard.PrimaryDevice.ReevaluateFocusAsync(this,oldParent,isCoreParent)}if(this.IsStylusOver){StylusLogic.CurrentStylusLogicReevaluateStylusOver(this,oldParent,isCoreParent)}if(this.IsStylusCaptureWithin){StylusLogic.CurrentStylusLogicReevaluateCapture(this,oldParent,isCoreParent)}if(this.IsMouseOver){Mouse.PrimaryDevice.ReevaluateMouseOver(this,oldParent,isCoreParent)}if(this.IsMouseCaptureWithin){Mouse.PrimaryDevice.ReevaluateCapture(this,oldParent,isCoreParent)}},BlockReverseInheritance:function(){return false},CaptureMouse:function(){return Mouse.Capture(this)},ReleaseMouseCapture:function(){Mouse.Capture(null)},CaptureStylus:function(){return Stylus.Capture(this)},ReleaseStylusCapture:function(){Stylus.Capture(null)},IsKeyboardFocused_ComputeValue:function(){return(Keyboard.FocusedElement==this)},Focus:function(){return Keyboard.Focus(this)==this},MoveFocus:function(request){return false},PredictFocus:function(direction){return null},OnGotFocus:function(e){this.RaiseEvent(e)},OnLostFocus:function(e){this.RaiseEvent(e)},RaiseMouseButtonEvent:function(key,e){var store=EventHandlersStore;if(store!=null){var handler=store.Get(key);if(handler!=null){handler.Invoke(this,e)}}},RaiseDependencyPropertyChanged:function(key,args){var store=EventHandlersStore;if(store!=null){var handler=store.Get(key);if(handler!=null){handler.Invoke(this,args)}}},InvalidateForceInheritPropertyOnChildren:function(property){},});Object.defineProperties(ContentElement.prototype,{HasAnimatedProperties:{get:function(){return this.IAnimatable_HasAnimatedProperties}},InputBindings:{get:function(){var bindings=InputBindingCollectionField.GetValue(this);if(bindings==null){bindings=new InputBindingCollection(this);InputBindingCollectionField.SetValue(this,bindings)}return bindings}},InputBindingsInternal:{get:function(){return InputBindingCollectionField.GetValue(this)}},CommandBindings:{get:function(){var bindings=CommandBindingCollectionField.GetValue(this);if(bindings==null){bindings=new CommandBindingCollection();CommandBindingCollectionField.SetValue(this,bindings)}return bindings}},CommandBindingsInternal:{get:function(){return CommandBindingCollectionField.GetValue(this)}},EventHandlersStore:{get:function(){if(!this.ReadFlag(CoreFlags.ExistsEventHandlersStore)){return null}return EventHandlersStoreField.GetValue(this)}},Parent:{get:function(){return this._parent}},IsMouseDirectlyOver:{get:function(){return this.IsMouseDirectlyOver_ComputeValue()}},IsMouseOver:{get:function(){return this.ReadFlag(CoreFlags.IsMouseOverCache)}},IsKeyboardFocusWithin:{get:function(){return this.ReadFlag(CoreFlags.IsKeyboardFocusWithinCache)}},IsMouseCaptured:{get:function(){return this.GetValue(IsMouseCapturedProperty)}},IsMouseCaptureWithin:{get:function(){return this.ReadFlag(CoreFlags.IsMouseCaptureWithinCache)}},IsKeyboardFocused:{get:function(){return this.IsKeyboardFocused_ComputeValue()}},IsFocused:{get:function(){return this.GetValue(ContentElement.IsFocusedProperty)}},IsEnabled:{get:function(){return this.GetValue(ContentElement.IsEnabledProperty)},set:function(value){this.SetValue(ContentElement.IsEnabledProperty,value)}},IsEnabledCore:{get:function(){return true}},Focusable:{get:function(){return this.GetValue(ContentElement.FocusableProperty)},set:function(value){this.SetValue(ContentElement.FocusableProperty,value)}},IsInputMethodEnabled:{get:function(){return this.GetValue(InputMethod.IsInputMethodEnabledProperty)}},AllowDrop:{get:function(){return this.GetValue(ContentElement.AllowDropProperty)},set:function(value){this.SetValue(ContentElement.AllowDropProperty,BooleanBoxes.Box(value))}}});Object.defineProperties(ContentElement,{PreviewMouseDownEvent:{get:function(){if(ContentElement._PreviewMouseDownEvent===undefined){ContentElement._PreviewMouseDownEvent=Mouse.PreviewMouseDownEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseDownEvent}},MouseDownEvent:{get:function(){if(ContentElement._MouseDownEvent===undefined){ContentElement._MouseDownEvent=Mouse.MouseDownEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseDownEvent}},PreviewMouseUpEvent:{get:function(){if(ContentElement._PreviewMouseUpEvent===undefined){ContentElement._PreviewMouseUpEvent=Mouse.PreviewMouseUpEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseUpEvent}},MouseUpEvent:{get:function(){if(ContentElement._MouseUpEvent===undefined){ContentElement._MouseUpEvent=Mouse.PreviewMouseDownEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseUpEvent}},PreviewMouseLeftButtonDownEvent:{get:function(){if(ContentElement._PreviewMouseLeftButtonDownEvent===undefined){ContentElement._PreviewMouseLeftButtonDownEvent=UIElement.PreviewMouseLeftButtonDownEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseLeftButtonDownEvent}},MouseLeftButtonDownEvent:{get:function(){if(ContentElement._MouseLeftButtonDownEvent===undefined){ContentElement._MouseLeftButtonDownEvent=UIElement.MouseLeftButtonDownEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseLeftButtonDownEvent}},PreviewMouseLeftButtonUpEvent:{get:function(){if(ContentElement._PreviewMouseLeftButtonUpEvent===undefined){ContentElement._PreviewMouseLeftButtonUpEvent=UIElement.PreviewMouseLeftButtonUpEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseLeftButtonUpEvent}},MouseLeftButtonUpEvent:{get:function(){if(ContentElement._MouseLeftButtonUpEvent===undefined){ContentElement._MouseLeftButtonUpEvent=UIElement.MouseLeftButtonUpEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseLeftButtonUpEvent}},PreviewMouseRightButtonDownEvent:{get:function(){if(ContentElement._PreviewMouseRightButtonDownEvent===undefined){ContentElement._PreviewMouseRightButtonDownEvent=UIElement.PreviewMouseRightButtonDownEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseRightButtonDownEvent}},MouseRightButtonDownEvent:{get:function(){if(ContentElement._MouseRightButtonDownEvent===undefined){ContentElement._MouseRightButtonDownEvent=UIElement.MouseRightButtonDownEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseRightButtonDownEvent}},PreviewMouseRightButtonUpEvent:{get:function(){if(ContentElement._PreviewMouseRightButtonUpEvent===undefined){ContentElement._PreviewMouseRightButtonUpEvent=UIElement.PreviewMouseRightButtonUpEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseRightButtonUpEvent}},MouseRightButtonUpEvent:{get:function(){if(ContentElement._MouseRightButtonUpEvent===undefined){ContentElement._MouseRightButtonUpEvent=UIElement.MouseRightButtonUpEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseRightButtonUpEvent}},PreviewMouseMoveEvent:{get:function(){if(ContentElement._PreviewMouseMoveEvent===undefined){ContentElement._PreviewMouseMoveEvent=Mouse.PreviewMouseMoveEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseMoveEvent}},MouseMoveEvent:{get:function(){if(ContentElement._MouseMoveEvent===undefined){ContentElement._MouseMoveEvent=Mouse.MouseMoveEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseMoveEvent}},PreviewMouseWheelEvent:{get:function(){if(ContentElement._PreviewMouseWheelEvent===undefined){ContentElement._PreviewMouseWheelEvent=Mouse.PreviewMouseWheelEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseWheelEvent}},MouseWheelEvent:{get:function(){if(ContentElement._MouseWheelEvent===undefined){ContentElement._MouseWheelEvent=Mouse.MouseWheelEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseWheelEvent}},MouseEnterEvent:{get:function(){if(ContentElement._MouseEnterEvent===undefined){ContentElement._MouseEnterEvent=Mouse.MouseEnterEvent.AddOwner(ContentElement.Type)}return ContentElement._MouseEnterEvent}},MouseLeaveEvent:{get:function(){if(ContentElement._PreviewMouseDownEvent===undefined){ContentElement._PreviewMouseDownEvent=Mouse.MouseLeaveEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewMouseDownEvent}},GotMouseCaptureEvent:{get:function(){if(ContentElement._GotMouseCaptureEvent===undefined){ContentElement._GotMouseCaptureEvent=Mouse.GotMouseCaptureEvent.AddOwner(ContentElement.Type)}return ContentElement._GotMouseCaptureEvent}},LostMouseCaptureEvent:{get:function(){if(ContentElement._LostMouseCaptureEvent===undefined){ContentElement._LostMouseCaptureEvent=Mouse.LostMouseCaptureEvent.AddOwner(ContentElement.Type)}return ContentElement._LostMouseCaptureEvent}},QueryCursorEvent:{get:function(){if(ContentElement._QueryCursorEvent===undefined){ContentElement._QueryCursorEvent=Mouse.QueryCursorEvent.AddOwner(ContentElement.Type)}return ContentElement._QueryCursorEvent}},PreviewKeyDownEvent:{get:function(){if(ContentElement._PreviewKeyDownEvent===undefined){ContentElement._PreviewKeyDownEvent=Keyboard.PreviewKeyDownEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewKeyDownEvent}},KeyDownEvent:{get:function(){if(ContentElement._KeyDownEvent===undefined){ContentElement._KeyDownEvent=Keyboard.KeyDownEvent.AddOwner(ContentElement.Type)}return ContentElement._KeyDownEvent}},PreviewKeyUpEvent:{get:function(){if(ContentElement._PreviewKeyUpEvent===undefined){ContentElement._PreviewKeyUpEvent=Keyboard.PreviewKeyUpEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewKeyUpEvent}},KeyUpEvent:{get:function(){if(ContentElement._KeyUpEvent===undefined){ContentElement._KeyUpEvent=Keyboard.KeyUpEvent.AddOwner(ContentElement.Type)}return ContentElement._KeyUpEvent}},PreviewGotKeyboardFocusEvent:{get:function(){if(ContentElement._PreviewGotKeyboardFocusEvent===undefined){ContentElement._PreviewGotKeyboardFocusEvent=Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewGotKeyboardFocusEvent}},GotKeyboardFocusEvent:{get:function(){if(ContentElement._GotKeyboardFocusEvent===undefined){ContentElement._GotKeyboardFocusEvent=Keyboard.GotKeyboardFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._GotKeyboardFocusEvent}},PreviewLostKeyboardFocusEvent:{get:function(){if(ContentElement._PreviewLostKeyboardFocusEvent===undefined){ContentElement._PreviewLostKeyboardFocusEvent=Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewLostKeyboardFocusEvent}},LostKeyboardFocusEvent:{get:function(){if(ContentElement._LostKeyboardFocusEvent===undefined){ContentElement._LostKeyboardFocusEvent=Keyboard.LostKeyboardFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._LostKeyboardFocusEvent}},PreviewTextInputEvent:{get:function(){if(ContentElement._PreviewTextInputEvent===undefined){ContentElement._PreviewTextInputEvent=TextCompositionManager.PreviewTextInputEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewTextInputEvent}},TextInputEvent:{get:function(){if(ContentElement._TextInputEvent===undefined){ContentElement._TextInputEvent=TextCompositionManager.TextInputEvent.AddOwner(ContentElement.Type)}return ContentElement._TextInputEvent}},PreviewQueryContinueDragEvent:{get:function(){if(ContentElement._PreviewQueryContinueDragEvent===undefined){ContentElement._PreviewQueryContinueDragEvent=DragDrop.PreviewQueryContinueDragEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewQueryContinueDragEvent}},QueryContinueDragEvent:{get:function(){if(ContentElement._QueryContinueDragEvent===undefined){ContentElement._QueryContinueDragEvent=DragDrop.QueryContinueDragEvent.AddOwner(ContentElement.Type)}return ContentElement._QueryContinueDragEvent}},PreviewGiveFeedbackEvent:{get:function(){if(ContentElement._PreviewGiveFeedbackEvent===undefined){ContentElement._PreviewGiveFeedbackEvent=DragDrop.PreviewGiveFeedbackEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewGiveFeedbackEvent}},GiveFeedbackEvent:{get:function(){if(ContentElement._GiveFeedbackEvent===undefined){ContentElement._GiveFeedbackEvent=DragDrop.GiveFeedbackEvent.AddOwner(ContentElement.Type)}return ContentElement._GiveFeedbackEvent}},PreviewDragEnterEvent:{get:function(){if(ContentElement._PreviewDragEnterEvent===undefined){ContentElement._PreviewDragEnterEvent=DragDrop.PreviewDragEnterEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewDragEnterEvent}},DragEnterEvent:{get:function(){if(ContentElement._DragEnterEvent===undefined){ContentElement._DragEnterEvent=DragDrop.DragEnterEvent.AddOwner(ContentElement.Type)}return ContentElement._DragEnterEvent}},PreviewDragOverEvent:{get:function(){if(ContentElement._PreviewDragOverEvent===undefined){ContentElement._PreviewDragOverEvent=DragDrop.PreviewDragOverEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewDragOverEvent}},DragOverEvent:{get:function(){if(ContentElement._DragOverEvent===undefined){ContentElement._DragOverEvent=DragDrop.DragOverEvent.AddOwner(ContentElement.Type)}return ContentElement._DragOverEvent}},PreviewDragLeaveEvent:{get:function(){if(ContentElement._PreviewDragLeaveEvent===undefined){ContentElement._PreviewDragLeaveEvent=DragDrop.PreviewDragLeaveEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewDragLeaveEvent}},DragLeaveEvent:{get:function(){if(ContentElement._DragLeaveEvent===undefined){ContentElement._DragLeaveEvent=DragDrop.DragLeaveEvent.AddOwner(ContentElement.Type)}return ContentElement._DragLeaveEvent}},PreviewDropEvent:{get:function(){if(ContentElement._PreviewDropEvent===undefined){ContentElement._PreviewDropEvent=DragDrop.PreviewDropEvent.AddOwner(ContentElement.Type)}return ContentElement._PreviewDropEvent}},DropEvent:{get:function(){if(ContentElement._DropEvent===undefined){ContentElement._DropEvent=DragDrop.DropEvent.AddOwner(ContentElement.Type)}return ContentElement._DropEvent}},IsMouseDirectlyOverProperty:{get:function(){if(ContentElement._IsMouseDirectlyOverProperty===undefined){ContentElement._IsMouseDirectlyOverProperty=UIElement.IsMouseDirectlyOverProperty.AddOwner(ContentElement.Type)}return ContentElement._IsMouseDirectlyOverProperty}},IsMouseOverProperty:{get:function(){if(ContentElement._IsMouseOverProperty===undefined){ContentElement._IsMouseOverProperty=UIElement.IsMouseOverProperty.AddOwner(ContentElement.Type)}return ContentElement._IsMouseOverProperty}},IsKeyboardFocusWithinProperty:{get:function(){if(ContentElement._IsKeyboardFocusWithinProperty===undefined){ContentElement._IsKeyboardFocusWithinProperty=UIElement.IsKeyboardFocusWithinProperty.AddOwner(ContentElement.Type)}return ContentElement._IsKeyboardFocusWithinProperty}},IsMouseCapturedProperty:{get:function(){if(ContentElement._IsMouseCapturedProperty===undefined){ContentElement._IsMouseCapturedProperty=UIElement.IsMouseCapturedProperty.AddOwner(ContentElement.Type)}return ContentElement._IsMouseCapturedProperty}},IsMouseCaptureWithinProperty:{get:function(){if(ContentElement._IsMouseCaptureWithinProperty===undefined){ContentElement._IsMouseCaptureWithinProperty=UIElement.IsMouseCaptureWithinProperty.AddOwner(ContentElement.Type)}return ContentElement._IsMouseCaptureWithinProperty}},IsKeyboardFocusedProperty:{get:function(){if(ContentElement._IsKeyboardFocusedProperty===undefined){ContentElement._IsKeyboardFocusedProperty=UIElement.IsKeyboardFocusedProperty.AddOwner(ContentElement.Type)}return ContentElement._IsKeyboardFocusedProperty}},GotFocusEvent:{get:function(){if(ContentElement._GotFocusEvent===undefined){ContentElement._GotFocusEvent=FocusManager.GotFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._GotFocusEvent}},LostFocusEvent:{get:function(){if(ContentElement._LostFocusEvent===undefined){ContentElement._LostFocusEvent=FocusManager.LostFocusEvent.AddOwner(ContentElement.Type)}return ContentElement._LostFocusEvent}},IsFocusedProperty:{get:function(){if(ContentElement._IsFocusedProperty===undefined){ContentElement._IsFocusedProperty=UIElement.IsFocusedProperty.AddOwner(ContentElement.Type)}return ContentElement._IsFocusedProperty}},IsEnabledProperty:{get:function(){if(ContentElement._IsEnabledProperty===undefined){ContentElement._IsEnabledProperty=UIElement.IsEnabledProperty.AddOwner(ContentElement.Type,UIPropertyMetadata.BuildWithDVandPCCBandCVCB(true,new PropertyChangedCallback(null,OnIsEnabledChanged),new CoerceValueCallback(null,CoerceIsEnabled)))}return ContentElement._IsEnabledProperty}},FocusableProperty:{get:function(){if(ContentElement._FocusableProperty===undefined){ContentElement._FocusableProperty=UIElement.FocusableProperty.AddOwner(ContentElement.Type,UIPropertyMetadata.BuildWithDVandPCCB(false,new PropertyChangedCallback(null,OnFocusableChanged)))}return ContentElement._FocusableProperty}},AllowDropProperty:{get:function(){if(ContentElement._AllowDropProperty===undefined){ContentElement._AllowDropProperty=UIElement.AllowDropProperty.AddOwner(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false))}return ContentElement._AllowDropProperty}},});function RegisterProperties(){UIElement.IsMouseDirectlyOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDVandPCB(false,new PropertyChangedCallback(null,IsMouseDirectlyOver_Changed)));UIElement.IsMouseOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.IsStylusOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.IsKeyboardFocusWithinPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.IsMouseCapturedPropertyKey.OverrideMetadata(ContentElement.Type,new PropertyMetadata(false,new PropertyChangedCallback(IsMouseCaptured_Changed)));UIElement.IsMouseCaptureWithinPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.IsStylusDirectlyOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDVandPCB(false,new PropertyChangedCallback(null,IsStylusDirectlyOver_Changed)));UIElement.IsStylusCapturedPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDVandPCB(false,new PropertyChangedCallback(null,IsStylusCaptured_Changed)));UIElement.IsStylusCaptureWithinPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.IsKeyboardFocusedPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDVandPCB(false,new PropertyChangedCallback(null,IsKeyboardFocused_Changed)));UIElement.AreAnyTouchesDirectlyOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.AreAnyTouchesOverPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.AreAnyTouchesCapturedPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false));UIElement.AreAnyTouchesCapturedWithinPropertyKey.OverrideMetadata(ContentElement.Type,PropertyMetadata.BuildWithDefaultValue(false))}function IsMouseDirectlyOver_Changed(d,e){d.RaiseIsMouseDirectlyOverChanged(e)}function IsMouseCaptured_Changed(d,e){d.RaiseIsMouseCapturedChanged(e)}function IsKeyboardFocused_Changed(d,e){d.RaiseIsKeyboardFocusedChanged(e)}function IsFocused_Changed(d,e){if(e.NewValue){d.OnGotFocus(new RoutedEventArgs(GotFocusEvent,d))}else{d.OnLostFocus(new RoutedEventArgs(LostFocusEvent,d))}}function CoerceIsEnabled(d,value){if(value){var parent=d.GetUIParentCore();if(parent==null||parent.GetValue(IsEnabledProperty)){return d.IsEnabledCore}else{return false}}else{return false}}function OnIsEnabledChanged(d,e){d.RaiseDependencyPropertyChanged(UIElement.IsEnabledChangedKey,e);d.InvalidateForceInheritPropertyOnChildren(e.Property);InputManager.SafeCurrentNotifyHitTestInvalidated()}function OnFocusableChanged(d,e){d.RaiseDependencyPropertyChanged(UIElement.FocusableChangedKey,e)}ContentElement.Type=new Type("ContentElement",ContentElement,[DependencyObject.Type,IInputElement.Type,IAnimatable.Type]);return ContentElement});
/**
 * ContentElement
 */

define(["dojo/_base/declare", "system/Type", "windows/DependencyObject", "windows/UIElement", 
        "input/InputBindingCollection", "input/CommandBindingCollection", "windows/IInputElement", "animation/IAnimatable",
        "windows/UIPropertyMetadata"/*, "windows/PropertyMetadata"*/], 
		function(declare, Type, DependencyObject, UIElement, 
				InputBindingCollection, CommandBindingCollection, IInputElement, IAnimatable,
				UIPropertyMetadata/*, PropertyMetadata*/){
	
    ///// ATTACHED STORAGE /////
//    internal static readonly UncommonField<EventHandlersStore> 
	var EventHandlersStoreField = UIElement.EventHandlersStoreField;
//    internal static readonly UncommonField<InputBindingCollection> 
	var InputBindingCollectionField = UIElement.InputBindingCollectionField; 
//    internal static readonly UncommonField<CommandBindingCollection> 
	var CommandBindingCollectionField = UIElement.CommandBindingCollectionField;
    
	var ContentElement = declare("ContentElement", [DependencyObject, IInputElement, IAnimatable],{
		constructor:function( ){

		},
		
	       /// <summary>
        /// Applies an AnimationClock to a DepencencyProperty which will 
        /// replace the current animations on the property using the snapshot
        /// and replace HandoffBehavior.
        /// </summary>
        /// <param name="dp"> 
        /// The DependencyProperty to animate.
        /// </param> 
        /// <param name="clock"> 
        /// The AnimationClock that will animate the property. If this is null
        /// then all animations will be removed from the property. 
        /// </param>
//        public void 
//        ApplyAnimationClock:function(
//            /*DependencyProperty*/ dp,
//            /*AnimationClock*/ clock) 
//        {
//            ApplyAnimationClock(dp, clock, HandoffBehavior.SnapshotAndReplace); 
//        }, 

        /// <summary> 
        /// Applies an AnimationClock to a DependencyProperty. The effect of
        /// the new AnimationClock on any current animations will be determined by
        /// the value of the handoffBehavior parameter.
        /// </summary> 
        /// <param name="dp">
        /// The DependencyProperty to animate. 
        /// </param> 
        /// <param name="clock">
        /// The AnimationClock that will animate the property. If parameter is null 
        /// then animations will be removed from the property if handoffBehavior is
        /// SnapshotAndReplace; otherwise the method call will have no result.
        /// </param>
        /// <param name="handoffBehavior"> 
        /// Determines how the new AnimationClock will transition from or
        /// affect any current animations on the property. 
        /// </param> 
//        public void 
        ApplyAnimationClock:function(
            /*DependencyProperty*/ dp, 
            /*AnimationClock*/ clock,
            /*HandoffBehavior*/ handoffBehavior)
        {
        	if(handoffBehavior === undefined){
        		handoffBehavior = HandoffBehavior.SnapshotAndReplace;
        	}
        	
            if (dp == null) 
            {
                throw new ArgumentNullException("dp"); 
            } 

            if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
            {
                throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
            }
 
            if (clock != null 
                && !AnimationStorage.IsAnimationValid(dp, clock.Timeline))
            { 
                throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, clock.Timeline.GetType(), dp.Name, dp.PropertyType), "clock");
            } 

            if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
            { 
                throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior));
            } 

            if (this.IsSealed)
            {
                throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType())); 
            }
 
            AnimationStorage.ApplyAnimationClock(this, dp, clock, handoffBehavior); 
        },
 
        /// <summary>
        /// Starts an animation for a DependencyProperty. The animation will
        /// begin when the next frame is rendered. 
        /// </summary>
        /// <param name="dp"> 
        /// The DependencyProperty to animate. 
        /// </param>
        /// <param name="animation"> 
        /// <para>The AnimationTimeline to used to animate the property.</para>
        /// <para>If the AnimationTimeline's BeginTime is null, any current animations
        /// will be removed and the current value of the property will be held.</para>
        /// <para>If this value is null, all animations will be removed from the property 
        /// and the property value will revert back to its base value.</para>
        /// </param> 
        /// <param name="handoffBehavior"> 
        /// Specifies how the new animation should interact with any current
        /// animations already affecting the property value. 
        /// </param>
//        public void 
        BeginAnimation:function(/*DependencyProperty*/ dp, /*AnimationTimeline*/ animation, /*HandoffBehavior*/ handoffBehavior)
        {
        	if(handoffBehavior === undefined){
        		handoffBehavior = HandoffBehavior.SnapshotAndReplace;
        	}
        	
            if (dp == null) 
            {
                throw new ArgumentNullException("dp"); 
            } 

            if (!AnimationStorage.IsPropertyAnimatable(this, dp)) 
            {
                throw new ArgumentException(SR.Get(SRID.Animation_DependencyPropertyIsNotAnimatable, dp.Name, this.GetType()), "dp");
            }
 
            if (   animation != null 
                && !AnimationStorage.IsAnimationValid(dp, animation))
            { 
                throw new ArgumentException(SR.Get(SRID.Animation_AnimationTimelineTypeMismatch, animation.GetType(), dp.Name, dp.PropertyType), "animation");
            }

            if (!HandoffBehaviorEnum.IsDefined(handoffBehavior)) 
            {
                throw new ArgumentException(SR.Get(SRID.Animation_UnrecognizedHandoffBehavior)); 
            } 

            if (this.IsSealed) 
            {
                throw new InvalidOperationException(SR.Get(SRID.IAnimatable_CantAnimateSealedDO, dp, this.GetType()));
            }
 
            AnimationStorage.BeginAnimation(this, dp, animation, handoffBehavior);
        }, 
 
        /// <summary>
        ///   If the dependency property is animated this method will 
        ///   give you the value as if it was not animated. 
        /// </summary>
        /// <param name="dp">The DependencyProperty</param> 
        /// <returns>
        ///   The value that would be returned if there were no
        ///   animations attached.  If there aren't any attached, then
        ///   the result will be the same as that returned from 
        ///   GetValue.
        /// </returns> 
//        public object 
        GetAnimationBaseValue:function(/*DependencyProperty*/ dp) 
        {
            if (dp == null) 
            {
                throw new ArgumentNullException("dp");
            }
 
            return this.GetValueEntry(
                    this.LookupEntry(dp.GlobalIndex), 
                    dp, 
                    null,
                    RequestFlags.AnimationBaseValue).Value; 
        },

 
        /// <summary> 
        ///     Allows subclasses to participate in property animated value computation
        /// </summary> 
        /// <param name="dp"></param>
        /// <param name="metadata"></param>
        /// <param name="entry">EffectiveValueEntry computed by base</param>
        /// <SecurityNote> 
        ///     Putting an InheritanceDemand as a defense-in-depth measure,
        ///     as this provides a hook to the property system that we don't 
        ///     want exposed under PartialTrust. 
        /// </SecurityNote>
//        internal sealed override void 
        EvaluateAnimatedValueCore:function(
                /*DependencyProperty*/  dp,
                /*PropertyMetadata*/    metadata,
            /*ref EffectiveValueEntry entry*/entryRef) 
        {
            if (this.IAnimatable_HasAnimatedProperties) 
            { 
                /*AnimationStorage*/var storage = AnimationStorage.GetStorage(this, dp);
 
                if (storage != null)
                {
                    storage.EvaluateAnimatedValue(metadata, entryRef/*ref entry*/);
                } 
            }
        }, 

        /// <summary> 
        ///     Allows ContentElement to augment the
        ///     <see cref="EventRoute"/> 
        /// </summary>
        /// <remarks>
        ///     Sub-classes of ContentElement can override
        ///     this method to custom augment the route 
        /// </remarks>
        /// <param name="route"> 
        ///     The <see cref="EventRoute"/> to be 
        ///     augmented
        /// </param> 
        /// <param name="args">
        ///     <see cref="RoutedEventArgs"/> for the
        ///     RoutedEvent to be raised post building
        ///     the route 
        /// </param>
        /// <returns> 
        ///     Whether or not the route should continue past the visual tree. 
        ///     If this is true, and there are no more visual parents, the route
        ///     building code will call the GetUIParentCore method to find the 
        ///     next non-visual parent.
        /// </returns>
//        internal virtual bool 
        BuildRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        { 
            return false;
        }, 
 
        /// <summary>
        ///     Builds the <see cref="EventRoute"/> 
        /// </summary>
        /// <param name="route">
        ///     The <see cref="EventRoute"/> being
        ///     built 
        /// </param>
        /// <param name="args"> 
        ///     <see cref="RoutedEventArgs"/> for the 
        ///     RoutedEvent to be raised post building
        ///     the route 
        /// </param>
//        internal void 
        BuildRoute:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        {
            UIElement.BuildRouteHelper(this, route, args); 
        },
 
        /// <summary> 
        ///     Raise the events specified by
        ///     <see cref="RoutedEventArgs.RoutedEvent"/> 
        /// </summary>
        /// <remarks>
        ///     This method is a shorthand for
        ///     <see cref="ContentElement.BuildRoute"/> and 
        ///     <see cref="EventRoute.InvokeHandlers"/>
        /// </remarks> 
        /// <param name="e"> 
        ///     <see cref="RoutedEventArgs"/> for the event to
        ///     be raised 
        /// </param>
        ///<SecurityNote>
        ///     By default clears the user initiated bit.
        ///     To guard against "replay" attacks. 
        ///</SecurityNote>
//        public void 
//        RaiseEvent:function(/*RoutedEventArgs*/ e) 
//        { 
//            if (e == null)
//            {
//                throw new ArgumentNullException("e");
//            } 
//            e.ClearUserInitiated();
// 
//            UIElement.RaiseEventImpl(this, e); 
//        },
 
        /// <summary>
        ///     "Trusted" internal flavor of RaiseEvent.
        ///     Used to set the User-initated RaiseEvent.
        /// </summary> 
        ///<SecurityNote>
        ///     Critical - sets the MarkAsUserInitiated bit. 
        ///</SecurityNote> 
//        internal void 
        RaiseEvent:function(/*RoutedEventArgs*/ args, /*bool*/ trusted) 
        {
        	if(arguments.length == 1){
                if (e == null)
                {
                    throw new ArgumentNullException("e");
                } 
                e.ClearUserInitiated();
     
                return UIElement.RaiseEventImpl(this, e); 
        	}
        	
            if (args == null)
            {
                throw new ArgumentNullException("args"); 
            }
 
            if (trusted) 
            {
            	this.RaiseTrustedEvent(args); 
            }
            else
            {
                args.ClearUserInitiated(); 

                UIElement.RaiseEventImpl(this, args); 
            } 
        },
 
        ///<SecurityNote>
        ///     Critical - sets the MarkAsUserInitiated bit.
        ///</SecurityNote>
//        internal void 
        RaiseTrustedEvent:function(/*RoutedEventArgs*/ args) 
        { 
            if (args == null)
            { 
                throw new ArgumentNullException("args");
            }

            // Try/finally to ensure that UserInitiated bit is cleared. 
            args.MarkAsUserInitiated();
 
            try 
            {
                UIElement.RaiseEventImpl(this, args); 
            }
            finally
            {
                // Clear the bit - just to guarantee it's not used again 
                args.ClearUserInitiated();
            } 
        }, 

 
        /// <summary>
        ///     Allows adjustment to the event source
        /// </summary>
        /// <remarks> 
        ///     Subclasses must override this method
        ///     to be able to adjust the source during 
        ///     route invocation <para/> 
        ///
        ///     NOTE: Expected to return null when no 
        ///     change is made to source
        /// </remarks>
        /// <param name="args">
        ///     Routed Event Args 
        /// </param>
        /// <returns> 
        ///     Returns new source 
        /// </returns>
//        internal virtual object 
        AdjustEventSource:function(/*RoutedEventArgs*/ args) 
        {
            return null;
        },
 
        /// <summary>
        ///     Adds a routed event handler for the particular 
        ///     <see cref="RoutedEvent"/>
        /// </summary> 
        /// <remarks> 
        ///     The handler added thus is also known as
        ///     an instance handler <para/> 
        ///     <para/>
        ///
        ///     NOTE: It is not an error to add a handler twice
        ///     (handler will simply be called twice) <para/> 
        ///     <para/>
        /// 
        ///     Input parameters <see cref="RoutedEvent"/> 
        ///     and handler cannot be null <para/>
        ///     handledEventsToo input parameter when false means 
        ///     that listener does not care about already handled events.
        ///     Hence the handler will not be invoked on the target if
        ///     the RoutedEvent has already been
        ///     <see cref="RoutedEventArgs.Handled"/> <para/> 
        ///     handledEventsToo input parameter when true means
        ///     that the listener wants to hear about all events even if 
        ///     they have already been handled. Hence the handler will 
        ///     be invoked irrespective of the event being
        ///     <see cref="RoutedEventArgs.Handled"/> 
        /// </remarks>
        /// <param name="routedEvent">
        ///     <see cref="RoutedEvent"/> for which the handler
        ///     is attached 
        /// </param>
        /// <param name="handler"> 
        ///     The handler that will be invoked on this object 
        ///     when the RoutedEvent is raised
        /// </param> 
        /// <param name="handledEventsToo">
        ///     Flag indicating whether or not the listener wants to
        ///     hear about events that have already been handled
        /// </param> 
//        public void 
        AddHandler:function(
            /*RoutedEvent*/ routedEvent, 
            /*Delegate*/ handler, 
            /*bool*/ handledEventsToo)
        { 
            if(handledEventsToo === undefined){
            	handledEventsToo = false;
            }

            if (routedEvent == null)
            { 
                throw new ArgumentNullException("routedEvent");
            } 
 
            if (handler == null)
            { 
                throw new ArgumentNullException("handler");
            }

            if (!routedEvent.IsLegalHandler(handler)) 
            {
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            } 

            this.EnsureEventHandlersStore(); 
            EventHandlersStore.AddRoutedEventHandler(routedEvent, handler, handledEventsToo);

            this.OnAddHandler (routedEvent, handler);
        }, 

        /// <summary> 
        ///     Notifies subclass of a new routed event handler.  Note that this is 
        ///     called once for each handler added, but OnRemoveHandler is only called
        ///     on the last removal. 
        /// </summary>
//        internal virtual void 
        OnAddHandler:function(
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler) 
        {
        }, 
 
        /// <summary>
        ///     Removes all instances of the specified routed 
        ///     event handler for this object instance
        /// </summary>
        /// <remarks>
        ///     The handler removed thus is also known as 
        ///     an instance handler <para/>
        ///     <para/> 
        /// 
        ///     NOTE: This method does nothing if there were
        ///     no handlers registered with the matching 
        ///     criteria <para/>
        ///     <para/>
        ///
        ///     Input parameters <see cref="RoutedEvent"/> 
        ///     and handler cannot be null <para/>
        ///     This method ignores the handledEventsToo criterion 
        /// </remarks> 
        /// <param name="routedEvent">
        ///     <see cref="RoutedEvent"/> for which the handler 
        ///     is attached
        /// </param>
        /// <param name="handler">
        ///     The handler for this object instance to be removed 
        /// </param>
//        public void 
        RemoveHandler:function(/*RoutedEvent*/ routedEvent, /*Delegate*/ handler) 
        { 
            // VerifyAccess();
 
            if (routedEvent == null)
            {
                throw new ArgumentNullException("routedEvent");
            } 

            if (handler == null) 
            { 
                throw new ArgumentNullException("handler");
            } 

            if (!routedEvent.IsLegalHandler(handler))
            {
                throw new ArgumentException(SR.Get(SRID.HandlerTypeIllegal)); 
            }
 
            /*EventHandlersStore*/var store = this.EventHandlersStore; 
            if (store != null)
            { 
                store.RemoveRoutedEventHandler(routedEvent, handler);

                this.OnRemoveHandler (routedEvent, handler);
 
                if (store.Count == 0)
                { 
                    // last event handler was removed -- throw away underlying EventHandlersStore 
                    EventHandlersStoreField.ClearValue(this);
                    this.WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
                }

            }
        }, 

        /// <summary> 
        ///     Notifies subclass of an event for which a handler has been removed. 
        /// </summary>
//        internal virtual void 
        OnRemoveHandler:function( 
            /*RoutedEvent*/ routedEvent,
            /*Delegate*/ handler)
        {
        }, 

//        private void 
        EventHandlersStoreAdd:function(/*EventPrivateKey*/ key, /*Delegate*/ handler) 
        { 
        	this.EnsureEventHandlersStore();
            EventHandlersStore.Add(key, handler); 
        },

//        private void 
        EventHandlersStoreRemove:function(/*EventPrivateKey*/ key, /*Delegate*/ handler)
        { 
            /*EventHandlersStore*/
        	var store = this.EventHandlersStore;
            if (store != null) 
            { 
                store.Remove(key, handler);
                if (store.Count == 0) 
                {
                    // last event handler was removed -- throw away underlying EventHandlersStore
                    EventHandlersStoreField.ClearValue(this);
                    this.WriteFlag(CoreFlags.ExistsEventHandlersStore, false); 
                }
            } 
        }, 

        /// <summary> 
        ///     Add the event handlers for this element to the route.
        /// </summary>
//        public void 
        AddToEventRoute:function(/*EventRoute*/ route, /*RoutedEventArgs*/ e)
        { 
            if (route == null)
            { 
                throw new ArgumentNullException("route"); 
            }
            if (e == null) 
            {
                throw new ArgumentNullException("e");
            }
 
            // Get class listeners for this ContentElement
//            RoutedEventHandlerInfoList 
            var classListeners = 
                GlobalEventManager.GetDTypedClassListeners(this.DependencyObjectType, e.RoutedEvent); 

            // Add all class listeners for this ContentElement 
            while (classListeners != null)
            {
                for(var i = 0; i < classListeners.Handlers.length; i++)
                { 
                    route.Add(this, classListeners.Handlers[i].Handler, classListeners.Handlers[i].InvokeHandledEventsToo);
                } 
 
                classListeners = classListeners.Next;
            } 

            // Get instance listeners for this ContentElement
            /*FrugalObjectList<RoutedEventHandlerInfo>*/
            var instanceListeners = null;
            /*EventHandlersStore*/
            var store = EventHandlersStore; 
            if (store != null)
            { 
                instanceListeners = store.Get(e.RoutedEvent); 

                // Add all instance listeners for this ContentElement 
                if (instanceListeners != null)
                {
                    for (var i = 0; i < instanceListeners.Count; i++)
                    { 
                        route.Add(this, instanceListeners.Get(i).Handler, instanceListeners.Get(i).InvokeHandledEventsToo);
                    } 
                } 
            }
 
            // Allow Framework to add event handlers in styles
            AddToEventRouteCore(route, e);
        },
 
        /// <summary>
        ///     This virtual method is to be overridden in Framework 
        ///     to be able to add handlers for styles 
        /// </summary>
//        internal virtual void 
        AddToEventRouteCore:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        {
        },
 
        /// <summary> 
        ///     Ensures that EventHandlersStore will return
        ///     non-null when it is called. 
        /// </summary>
//        internal void 
        EnsureEventHandlersStore:function()
        { 
            if (EventHandlersStore == null)
            { 
                EventHandlersStoreField.SetValue(this, new EventHandlersStore()); 
                this.WriteFlag(CoreFlags.ExistsEventHandlersStore, true);
            } 
        },

//        internal virtual bool 
        InvalidateAutomationAncestorsCore:function(/*Stack<DependencyObject>*/ branchNodeStack, 
        		continuePastVisualTreeOut/*out bool continuePastVisualTree*/)
        { 
        	continuePastVisualTreeOut.continuePastVisualTree = false; 
            return true;
        }, 
 
        /// <summary>
        ///     Virtual method reporting the mouse button was pressed 
        /// </summary>
//        protected internal virtual void 
        OnPreviewMouseDown:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the mouse button was pressed
        /// </summary>
//        protected internal virtual void 
        OnMouseDown:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the mouse button was released
        /// </summary>
//        protected internal virtual void 
        OnPreviewMouseUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the mouse button was released
        /// </summary> 
//        protected internal virtual void 
        OnMouseUp:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the left mouse button was pressed 
        /// </summary>
//        protected internal virtual void 
        OnPreviewMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting the left mouse button was pressed
        /// </summary> 
//        protected internal virtual void 
        OnMouseLeftButtonDown:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the left mouse button was released 
        /// </summary> 
//        protected internal virtual void 
        OnPreviewMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting the left mouse button was released 
        /// </summary>
//        protected internal virtual void 
        OnMouseLeftButtonUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the right mouse button was pressed
        /// </summary> 
//        protected internal virtual void 
        OnPreviewMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the right mouse button was pressed 
        /// </summary>
//        protected internal virtual void 
        OnMouseRightButtonDown:function(/*MouseButtonEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the right mouse button was released
        /// </summary>
//        protected internal virtual void 
        OnPreviewMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the right mouse button was released
        /// </summary>
//        protected internal virtual void 
        OnMouseRightButtonUp:function(/*MouseButtonEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting a mouse move
        /// </summary> 
//        protected internal virtual void 
        OnPreviewMouseMove:function(/*MouseEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting a mouse move 
        /// </summary>
//        protected internal virtual void 
        OnMouseMove:function(/*MouseEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting a mouse wheel rotation
        /// </summary> 
//        protected internal virtual void 
        OnPreviewMouseWheel:function(/*MouseWheelEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting a mouse wheel rotation 
        /// </summary> 
//        protected internal virtual void 
        OnMouseWheel:function(/*MouseWheelEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting the mouse entered this element 
        /// </summary>
//        protected internal virtual void 
        OnMouseEnter:function(/*MouseEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the mouse left this element
        /// </summary> 
//        protected internal virtual void 
        OnMouseLeave:function(/*MouseEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting that this element got the mouse capture 
        /// </summary>
//        protected internal virtual void 
        OnGotMouseCapture:function(/*MouseEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting that this element lost the mouse capture
        /// </summary>
//        protected internal virtual void 
        OnLostMouseCapture:function(/*MouseEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the cursor to display was requested
        /// </summary>
//        protected internal virtual void 
        OnQueryCursor:function(/*QueryCursorEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting a key was pressed 
        /// </summary>
//        protected internal virtual void 
        OnPreviewKeyDown:function(/*KeyEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting a key was pressed
        /// </summary> 
//        protected internal virtual void 
        OnKeyDown:function(/*KeyEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting a key was released 
        /// </summary>
//        protected internal virtual void 
        OnPreviewKeyUp:function(/*KeyEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting a key was released
        /// </summary>
//        protected internal virtual void 
        OnKeyUp:function(/*KeyEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element
        /// </summary>
//        protected internal virtual void 
        OnPreviewGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting that the keyboard is focused on this element
        /// </summary> 
//        protected internal virtual void 
        OnGotKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
        /// </summary>
//        protected internal virtual void 
        OnPreviewLostKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed
        /// </summary> 
//        protected internal virtual void 
        OnLostKeyboardFocus:function(/*KeyboardFocusChangedEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting text composition 
        /// </summary> 
//        protected internal virtual void 
        OnPreviewTextInput:function(/*TextCompositionEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting text composition 
        /// </summary>
//        protected internal virtual void 
        OnTextInput:function(/*TextCompositionEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the preview query continue drag is going to happen
        /// </summary> 
//        protected internal virtual void 
        OnPreviewQueryContinueDrag:function(/*QueryContinueDragEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the query continue drag is going to happen 
        /// </summary>
//        protected internal virtual void 
        OnQueryContinueDrag:function(/*QueryContinueDragEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the preview give feedback is going to happen
        /// </summary>
//        protected internal virtual void 
        OnPreviewGiveFeedback:function(/*GiveFeedbackEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the give feedback is going to happen
        /// </summary>
//        protected internal virtual void 
        OnGiveFeedback:function(/*GiveFeedbackEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the preview drag enter is going to happen
        /// </summary> 
//        protected internal virtual void 
        OnPreviewDragEnter:function(/*DragEventArgs*/ e) {},
 
        /// <summary>
        ///     Virtual method reporting the drag enter is going to happen 
        /// </summary>
//        protected internal virtual void 
        OnDragEnter:function(/*DragEventArgs*/ e) {}, 
 
        /// <summary> 
        ///     Virtual method reporting the preview drag over is going to happen
        /// </summary> 
//        protected internal virtual void 
        OnPreviewDragOver:function(/*DragEventArgs*/ e) {}, 

        /// <summary>
        ///     Virtual method reporting the drag over is going to happen 
        /// </summary> 
//        protected internal virtual void 
        OnDragOver:function(/*DragEventArgs*/ e) {},
 
        /// <summary> 
        ///     Virtual method reporting the preview drag leave is going to happen 
        /// </summary>
//        protected internal virtual void 
        OnPreviewDragLeave:function(/*DragEventArgs*/ e) {}, 

        /// <summary> 
        ///     Virtual method reporting the drag leave is going to happen
        /// </summary> 
//        protected internal virtual void 
        OnDragLeave:function(/*DragEventArgs*/ e) {},

        /// <summary>
        ///     Virtual method reporting the preview drop is going to happen 
        /// </summary>
//        protected internal virtual void 
        OnPreviewDrop:function(/*DragEventArgs*/ e) {},

        /// <summary> 
        ///     Virtual method reporting the drag enter is going to happen
        /// </summary>
//        protected internal virtual void 
        OnDrop:function(/*DragEventArgs*/ e) {},
 
        /// <summary>
        ///     An event reporting that the IsMouseDirectlyOver property changed. 
        /// </summary>
//        protected virtual void 
        OnIsMouseDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        {
        }, 

//        private void 
        RaiseIsMouseDirectlyOverChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        { 
            // Call the virtual method first.
            this.OnIsMouseDirectlyOverChanged(args); 

            // Raise the public event second.
            this.RaiseDependencyPropertyChanged(UIElement.IsMouseDirectlyOverChangedKey, args);
        }, 

        /// <summary>
        ///     An event reporting that the IsKeyboardFocusWithin property changed. 
        /// </summary>
//        protected virtual void 
        OnIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e) 
        { 
        },
 
//        internal void 
        RaiseIsKeyboardFocusWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        {
            // Call the virtual method first.
        	this.OnIsKeyboardFocusWithinChanged(args); 

            // Raise the public event second. 
        	this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey, args); 
        },
 
        /// <summary>
        ///     An event reporting that the IsMouseCaptured property changed.
        /// </summary> 
//        protected virtual void 
        OnIsMouseCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        }, 

//        private void 
        RaiseIsMouseCapturedChanged:function(/*DependencyPropertyChangedEventArgs*/ args) 
        {
            // Call the virtual method first.
        	this.OnIsMouseCapturedChanged(args);
 
            // Raise the public event second.
        	this.RaiseDependencyPropertyChanged(UIElement.IsMouseCapturedChangedKey, args); 
        }, 

        /// <summary>
        ///     An event reporting that the IsMouseCaptureWithin property changed. 
        /// </summary> 
//        protected virtual void 
        OnIsMouseCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

//        internal void 
        RaiseIsMouseCaptureWithinChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
        	this.OnIsMouseCaptureWithinChanged(args); 
 
            // Raise the public event second.
        	this.RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey, args); 
        },

        /// <summary>
        ///     An event reporting that the IsKeyboardFocused property changed. 
        /// </summary> 
//        protected virtual void 
        OnIsKeyboardFocusedChanged:function(/*DependencyPropertyChangedEventArgs*/ e)
        { 
        },

//        private void 
        RaiseIsKeyboardFocusedChanged:function(/*DependencyPropertyChangedEventArgs*/ args)
        { 
            // Call the virtual method first.
        	this.OnIsKeyboardFocusedChanged(args); 
 
            // Raise the public event second.
        	this.RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusedChangedKey, args); 
        },
 
//        internal bool 
        ReadFlag:function(/*CoreFlags*/ field)
        { 
            return (this._flags & field) != 0; 
        },
 
//        internal void 
        WriteFlag:function(/*CoreFlags*/ field,/*bool*/ value)
        {
            if (value)
            { 
            	this._flags |= field;
            } 
            else 
            {
            	this._flags &= (~field); 
            }
        },

        /// Helper, gives the UIParent under control of which 
        /// the OnMeasure or OnArrange are currently called. 
        /// This may be implemented as a tree walk up until
        /// LayoutElement is found. 
        /// </summary>
//        internal DependencyObject 
//        GetUIParent:function()
//        {
//            return this.GetUIParent(false); 
//        },
 
//        internal DependencyObject 
        GetUIParent:function(/*bool*/ continuePastVisualTree) 
        {
        	if(continuePastVisualTree === undefined){
        		continuePastVisualTree = false;
        	}
            /*DependencyObject*/var e = null; 

            // Try to find a UIElement parent in the visual ancestry.
            e = InputElement.GetContainingInputElement(this._parent);
            e = e instanceof DependencyObject ? e : null;
 
            // If there was no InputElement parent in the visual ancestry,
            // check along the logical branch. 
            if(e == null && continuePastVisualTree) 
            {
                /*DependencyObject*/
            	var doParent = this.GetUIParentCore(); 
                e = InputElement.GetContainingInputElement(doParent);
                e = e instanceof DependencyObject ? e : null;
            }

            return e; 
        },
 
        /// <summary> 
        ///     Called to get the UI parent of this element when there is
        ///     no visual parent. 
        /// </summary>
        /// <returns>
        ///     Returns a non-null value when some framework implementation
        ///     of this method has a non-visual parent connection, 
        /// </returns>
//        protected virtual internal DependencyObject 
        GetUIParentCore:function() 
        { 
            return null;
        } ,
 
        /// <summary>
        /// OnContentParentChanged is called when the parent of the content element is changed.
        /// </summary>
        /// <param name="oldParent">Old parent or null if the content element did not have a parent before.</param> 
//        internal virtual void 
        OnContentParentChanged:function(/*DependencyObject*/ oldParent) 
        { 
        	this.SynchronizeReverseInheritPropertyFlags(oldParent, true);
        }, 


        // If this element is currently listening to synchronized input, add a pre-opportunity handler to keep track of event routed through this element. 
//        internal void 
        AddSynchronizedInputPreOpportunityHandler:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args)
        {
            if (InputManager.IsSynchronizedInput)
            { 
                if (SynchronizedInputHelper.IsListening(this, args))
                { 
                    /*RoutedEventHandler*/
                	var eventHandler = new RoutedEventHandler(this.SynchronizedInputPreOpportunityHandler); 
                    SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, false);
                } 
            }
        },

        // If this element is currently listening to synchronized input, add a handler to post process the synchronized input otherwise 
        // add a synchronized input pre-opportunity handler from parent if parent is listening.
//        internal void 
        AddSynchronizedInputPostOpportunityHandler:function(/*EventRoute*/ route, /*RoutedEventArgs*/ args) 
        { 
            if (InputManager.IsSynchronizedInput)
            { 
                if (SynchronizedInputHelper.IsListening(this, args))
                {
                    /*RoutedEventHandler*/
                	var eventHandler = new RoutedEventHandler(this.SynchronizedInputPostOpportunityHandler);
                    SynchronizedInputHelper.AddHandlerToRoute(this, route, eventHandler, true); 
                }
                else 
                { 
                    // Add a preview handler from the parent.
                    SynchronizedInputHelper.AddParentPreOpportunityHandler(this, route, args); 
                }
            }

        }, 

        // This event handler to be called before all the class & instance handlers for this element. 
//        internal void 
        SynchronizedInputPreOpportunityHandler:function(/*object*/ sender, /*RoutedEventArgs*/ args) 
        {
            if (!args.Handled) 
            {
                SynchronizedInputHelper.PreOpportunityHandler(sender, args);
            }
        }, 
        // This event handler to be called after class & instance handlers for this element.
//        internal void 
        SynchronizedInputPostOpportunityHandler:function(/*object*/ sender, /*RoutedEventArgs*/ args) 
        { 
            if (args.Handled && (InputManager.SynchronizedInputState == SynchronizedInputStates.HadOpportunity))
            { 
                SynchronizedInputHelper.PostOpportunityHandler(sender, args);
            }
        },
 

        // Called by automation peer, when called this element will be the listening element for synchronized input. 
//        internal bool 
        StartListeningSynchronizedInput:function(/*SynchronizedInputType*/ inputType) 
        {
            if (InputManager.IsSynchronizedInput) 
            {
                return false;
            }
            else 
            {
                InputManager.StartListeningSynchronizedInput(this, inputType); 
                return true; 
            }
        } ,

        // When called, input processing will return to normal mode.
//        internal void 
        CancelSynchronizedInput:function()
        { 
            InputManager.CancelSynchronizedInput();
        }, 
 
//        private bool 
        IsMouseDirectlyOver_ComputeValue:function() 
        {
            return (Mouse.DirectlyOver == this); 
        },

        /// <summary>
        ///     Asynchronously re-evaluate the reverse-inherited properties. 
        /// </summary>
//        internal void 
        SynchronizeReverseInheritPropertyFlags:function(/*DependencyObject*/ oldParent, /*bool*/ isCoreParent) 
        {
            if(this.IsKeyboardFocusWithin) 
            {
                Keyboard.PrimaryDevice.ReevaluateFocusAsync(this, oldParent, isCoreParent);
            }
 
            // Reevelauate the stylus properties first to guarentee that our property change
            // notifications fire before mouse properties. 
            if(this.IsStylusOver) 
            {
                StylusLogic.CurrentStylusLogicReevaluateStylusOver(this, oldParent, isCoreParent); 
            }

            if(this.IsStylusCaptureWithin)
            { 
                StylusLogic.CurrentStylusLogicReevaluateCapture(this, oldParent, isCoreParent);
            } 
 
            if(this.IsMouseOver)
            { 
                Mouse.PrimaryDevice.ReevaluateMouseOver(this, oldParent, isCoreParent);
            }

            if(this.IsMouseCaptureWithin) 
            {
                Mouse.PrimaryDevice.ReevaluateCapture(this, oldParent, isCoreParent); 
            } 
        }, 

        /// <summary>
            /// BlockReverseInheritance method when overriden stops reverseInheritProperties from updating their parent level properties.
        /// </summary> 
//        internal virtual bool 
        BlockReverseInheritance:function()
        { 
            return false; 
        },
 
        /// <summary>
        ///     Captures the mouse to this element. 
        /// </summary>
//        public bool 
        CaptureMouse:function()
        {
            return Mouse.Capture(this); 
        },
 
        /// <summary> 
        ///     Releases the mouse capture.
        /// </summary> 
//        public void 
        ReleaseMouseCapture:function()
        {
            Mouse.Capture(null);
        }, 

        /// <summary>
        ///     Captures the stylus to this element. 
        /// </summary>
//        public bool 
        CaptureStylus:function()
        {
            return Stylus.Capture(this); 
        },
 
        /// <summary> 
        ///     Releases the stylus capture.
        /// </summary> 
//        public void 
        ReleaseStylusCapture:function()
        {
            Stylus.Capture(null);
        }, 

//        private bool 
        IsKeyboardFocused_ComputeValue:function()
        { 
            return (Keyboard.FocusedElement == this); 
        },
 
        /// <summary>
        ///     Focuses the keyboard on this element.
        /// </summary>
//        public bool 
        Focus:function() 
        {
            return Keyboard.Focus(this) == this; 
        }, 

        /// <summary> 
        ///     Request to move the focus from this element to another element
        /// </summary>
        /// <param name="request">Determine how to move the focus</param>
        /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns> 
//        public virtual bool 
        MoveFocus:function(/*TraversalRequest*/ request)
        { 
            return false; 
        },
 
        /// <summary>
        ///     Request to predict the element that should receive focus relative to this element for a
        /// given direction, without actually moving focus to it.
        /// </summary> 
        /// <param name="direction">The direction for which focus should be predicted</param>
        /// <returns> 
        ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
        /// Returns null if focus cannot be moved relative to this element.
        /// </returns> 
//        public virtual DependencyObject 
        PredictFocus:function(/*FocusNavigationDirection*/ direction)
        {
            return null;
        }, 

        /// <summary>
        ///     This method is invoked when the IsFocused property changes to true 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
//        protected virtual void 
        OnGotFocus:function(/*RoutedEventArgs*/ e) 
        {
        	this.RaiseEvent(e); 
        },

        /// <summary>
        ///     This method is invoked when the IsFocused property changes to false 
        /// </summary>
        /// <param name="e">RoutedEventArgs</param> 
//        protected virtual void 
        OnLostFocus:function(/*RoutedEventArgs*/ e) 
        {
        	this.RaiseEvent(e); 
        },

 

//        private void 
        RaiseMouseButtonEvent:function(/*EventPrivateKey*/ key, /*MouseButtonEventArgs*/ e)
        {
            /*EventHandlersStore*/
        	var store = EventHandlersStore;
            if (store != null) 
            {
                /*Delegate*/
            	var handler = store.Get(key); 
                if (handler != null) 
                {
                	handler.Invoke(this, e); 
                }
            }
        },
 
        // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
//        private void 
        RaiseDependencyPropertyChanged:function(/*EventPrivateKey*/ key, /*DependencyPropertyChangedEventArgs*/ args) 
        { 
            /*EventHandlersStore*/
        	var store = EventHandlersStore;
            if (store != null) 
            {
                /*Delegate*/
            	var handler = store.Get(key);
                if (handler != null)
                { 
                	handler.Invoke(this, args);
                } 
            } 
        },
        // This has to be virtual, since there is no concept of "core" content children,
        // so we have no choice by to rely on FrameworkContentElement to use logical 
        // children instead.
//        internal virtual void 
        InvalidateForceInheritPropertyOnChildren:function(/*DependencyProperty*/ property)
        {
        }, 
	});
	
	Object.defineProperties(ContentElement.prototype,{
 
        /// <summary>
        /// Returns true if any properties on this DependencyObject have a 
        /// persistent animation or the object has one or more clocks associated
        /// with any of its properties.
        /// </summary>
//        public bool 
        HasAnimatedProperties:
        {
            get:function()
            { 
 
                return this.IAnimatable_HasAnimatedProperties;
            }
        },
 
        /// <summary>
        /// Instance level InputBinding collection, initialized on first use.
        /// To have commands handled (QueryEnabled/Execute) on an element instance, 
        /// the user of this method can add InputBinding with handlers thru this
        /// method. 
        /// </summary> 
//        public InputBindingCollection 
        InputBindings: 
        {
            get:function()
            {
//                InputBindingCollection 
                var bindings = InputBindingCollectionField.GetValue(this);
                if (bindings == null) 
                { 
                    bindings = new InputBindingCollection(this);
                    InputBindingCollectionField.SetValue(this, bindings); 
                }

                return bindings;
            } 
        },
 
        // Used by CommandManager to avoid instantiating an empty collection 
//        internal InputBindingCollection 
        InputBindingsInternal:
        { 
            get:function()
            {
                return InputBindingCollectionField.GetValue(this); 
            }
        } ,
 
        /// <summary> 
        /// Instance level CommandBinding collection, initialized on first use.
        /// To have commands handled (QueryEnabled/Execute) on an element instance, 
        /// the user of this method can add CommandBinding with handlers thru this
        /// method.
        /// </summary>
//        public CommandBindingCollection 
        CommandBindings:
        { 
            get:function()
            {
                /*CommandBindingCollection*/
            	var bindings = CommandBindingCollectionField.GetValue(this);
                if (bindings == null)
                {
                    bindings = new CommandBindingCollection(); 
                    CommandBindingCollectionField.SetValue(this, bindings);
                } 
 
                return bindings;
            } 
        },

        // Used by CommandManager to avoid instantiating an empty collection
//        internal CommandBindingCollection 
        CommandBindingsInternal: 
        {
            get:function() 
            { 
                return CommandBindingCollectionField.GetValue(this); 
            }
        },

        /// <summary> 
        ///     Event Handlers Store
        /// </summary> 
        /// <remarks> 
        ///     The idea of exposing this property is to allow
        ///     elements in the Framework to generically use 
        ///     EventHandlersStore for Clr events as well.
        /// </remarks>
//        internal EventHandlersStore 
        EventHandlersStore:
        { 
            get:function() 
            { 
                if(!this.ReadFlag(CoreFlags.ExistsEventHandlersStore))
                { 
                    return null;
                }
                return EventHandlersStoreField.GetValue(this);
            } 
        },

//        internal DependencyObject 
        Parent:
        {
            get:function() 
            {
                return this._parent; 
            } 
        },
 
        /// <summary>
        ///     A property indicating if the mouse is over this element or not. 
        /// </summary>
//        public bool 
        IsMouseDirectlyOver: 
        { 
            get:function()
            { 
                // We do not return the cached value of reverse-inherited seed properties.
                //
                // The cached value is only used internally to detect a "change".
                // 
                // More Info:
                // The act of invalidating the seed property of a reverse-inherited property 
                // on the first side of the path causes the invalidation of the 
                // reverse-inherited properties on both sides.  The input system has not yet
                // invalidated the seed property on the second side, so its cached value can 
                // be incorrect.
                //
                return this.IsMouseDirectlyOver_ComputeValue();
            } 
        },
 
        /// <summary>
        ///     A property indicating if the mouse is over this element or not.
        /// </summary>
//        public bool 
        IsMouseOver: 
        {
            get:function() 
            { 
                return this.ReadFlag(CoreFlags.IsMouseOverCache);
            } 
        },

        /// <summary>
        ///     Indicates if Keyboard Focus is anywhere 
        ///     within in the subtree starting at the 
        ///     current instance
        /// </summary> 
//        public bool 
        IsKeyboardFocusWithin:
        {
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsKeyboardFocusWithinCache);
            } 
        }, 

        /// <summary> 
        ///     A property indicating if the mouse is captured to this element or not.
        /// </summary>
//        public bool 
        IsMouseCaptured:
        { 
            get:function() { return this.GetValue(IsMouseCapturedProperty); }
        }, 

        /// <summary> 
        ///     Indicates if mouse capture is anywhere within in the subtree 
        ///     starting at the current instance
        /// </summary> 
//        public bool 
        IsMouseCaptureWithin:
        {
            get:function()
            { 
                return this.ReadFlag(CoreFlags.IsMouseCaptureWithinCache);
            } 
        }, 

        /// <summary> 
        ///     A property indicating if the keyboard is focused on this
        ///     element or not.
        /// </summary>
//        public bool 
        IsKeyboardFocused: 
        {
            get:function() 
            { 
                // We do not return the cached value of reverse-inherited seed properties.
                // 
                // The cached value is only used internally to detect a "change".
                //
                // More Info:
                // The act of invalidating the seed property of a reverse-inherited property 
                // on the first side of the path causes the invalidation of the
                // reverse-inherited properties on both sides.  The input system has not yet 
                // invalidated the seed property on the second side, so its cached value can 
                // be incorrect.
                // 
                return this.IsKeyboardFocused_ComputeValue();
            }
        },

        /// <summary>
        ///     Gettor for IsFocused Property 
        /// </summary>
//        public bool 
        IsFocused: 
        { 
            get:function() { return this.GetValue(ContentElement.IsFocusedProperty); }
        }, 

 
        /// <summary>
        ///     A property indicating if this element is enabled or not. 
        /// </summary> 
//        public bool 
        IsEnabled:
        { 
            get:function() { return this.GetValue(ContentElement.IsEnabledProperty); },
            set:function(value) { this.SetValue(ContentElement.IsEnabledProperty, value); }
        },
 
        /// <summary>
        ///     Fetches the value that IsEnabled should be coerced to. 
        /// </summary> 
        /// <remarks>
        ///     This method is virtual is so that controls derived from UIElement 
        ///     can combine additional requirements into the coersion logic.
        ///     <P/>
        ///     It is important for anyone overriding this property to also
        ///     call CoerceValue when any of their dependencies change. 
        /// </remarks>
//        protected virtual bool 
        IsEnabledCore: 
        { 
            get:function()
            { 
                // As of 1/25/2006, the following controls override this method:
                // Hyperlink.IsEnabledCore: CanExecute
                return true;
            } 
        },
 
        /// <summary>
        ///     Gettor and Settor for Focusable Property 
        /// </summary>
//        public bool 
        Focusable: 
        { 
            get:function() { return this.GetValue(ContentElement.FocusableProperty); },
            set:function(value) { this.SetValue(ContentElement.FocusableProperty, value); } 
        },

        /// <summary> 
        ///     A property indicating if the inptu method is enabled. 
        /// </summary>
//        public bool 
        IsInputMethodEnabled: 
        {
            get:function() { return this.GetValue(InputMethod.IsInputMethodEnabledProperty); }
        },
 
        /// <sum,mary> 
        ///     A dependency property that allows the drop object as DragDrop target.
        /// </summary> 
//        public bool 
        AllowDrop: 
        {
            get:function() { return this.GetValue(ContentElement.AllowDropProperty); },
            set:function(value) { this.SetValue(ContentElement.AllowDropProperty, BooleanBoxes.Box(value)); }
        }
	});
	
	Object.defineProperties(ContentElement, {


        /// <summary>
        ///     Alias to the Mouse.PreviewMouseDownEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseDownEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseDownEvent === undefined){
        			ContentElement._PreviewMouseDownEvent = Mouse.PreviewMouseDownEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewMouseDownEvent;
        	}
        },
	
 
        /// <summary> 
        ///     Alias to the Mouse.MouseDownEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseDownEvent:
        {
        	get:function(){
        		if(ContentElement._MouseDownEvent === undefined){
        			ContentElement._MouseDownEvent = Mouse.MouseDownEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._MouseDownEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Mouse.PreviewMouseUpEvent. 
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseUpEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseUpEvent === undefined){
        			ContentElement._PreviewMouseUpEvent = Mouse.PreviewMouseUpEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewMouseUpEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the Mouse.MouseUpEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        MouseUpEvent:
        {
        	get:function(){
        		if(ContentElement._MouseUpEvent === undefined){
        			ContentElement._MouseUpEvent = Mouse.PreviewMouseDownEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._MouseUpEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the UIElement.PreviewMouseLeftButtonDownEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseLeftButtonDownEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseLeftButtonDownEvent === undefined){
        			ContentElement._PreviewMouseLeftButtonDownEvent = UIElement.PreviewMouseLeftButtonDownEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewMouseLeftButtonDownEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the UIElement.MouseLeftButtonDownEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        MouseLeftButtonDownEvent:
        {
        	get:function(){
        		if(ContentElement._MouseLeftButtonDownEvent === undefined){
        			ContentElement._MouseLeftButtonDownEvent = UIElement.MouseLeftButtonDownEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._MouseLeftButtonDownEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the UIElement.PreviewMouseLeftButtonUpEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseLeftButtonUpEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseLeftButtonUpEvent === undefined){
        			ContentElement._PreviewMouseLeftButtonUpEvent = UIElement.PreviewMouseLeftButtonUpEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewMouseLeftButtonUpEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the UIElement.MouseLeftButtonUpEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        MouseLeftButtonUpEvent:
        {
        	get:function(){
        		if(ContentElement._MouseLeftButtonUpEvent === undefined){
        			ContentElement._MouseLeftButtonUpEvent = UIElement.MouseLeftButtonUpEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._MouseLeftButtonUpEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the UIElement.PreviewMouseRightButtonDownEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseRightButtonDownEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseRightButtonDownEvent === undefined){
        			ContentElement._PreviewMouseRightButtonDownEvent = UIElement.PreviewMouseRightButtonDownEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewMouseRightButtonDownEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the UIElement.MouseRightButtonDownEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        MouseRightButtonDownEvent:
        {
        	get:function(){
        		if(ContentElement._MouseRightButtonDownEvent === undefined){
        			ContentElement._MouseRightButtonDownEvent = UIElement.MouseRightButtonDownEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._MouseRightButtonDownEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the UIElement.PreviewMouseRightButtonUpEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewMouseRightButtonUpEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseRightButtonUpEvent === undefined){
        			ContentElement._PreviewMouseRightButtonUpEvent = UIElement.PreviewMouseRightButtonUpEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewMouseRightButtonUpEvent;
        	}
        },  

        /// <summary>
        ///     Alias to the UIElement.MouseRightButtonUpEvent. 
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseRightButtonUpEvent:
        {
        	get:function(){
        		if(ContentElement._MouseRightButtonUpEvent === undefined){
        			ContentElement._MouseRightButtonUpEvent = UIElement.MouseRightButtonUpEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._MouseRightButtonUpEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the Mouse.PreviewMouseMoveEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseMoveEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseMoveEvent === undefined){
        			ContentElement._PreviewMouseMoveEvent = Mouse.PreviewMouseMoveEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewMouseMoveEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the Mouse.MouseMoveEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseMoveEvent:
        {
        	get:function(){
        		if(ContentElement._MouseMoveEvent === undefined){
        			ContentElement._MouseMoveEvent = Mouse.MouseMoveEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._MouseMoveEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Mouse.PreviewMouseWheelEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewMouseWheelEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseWheelEvent === undefined){
        			ContentElement._PreviewMouseWheelEvent = Mouse.PreviewMouseWheelEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewMouseWheelEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the Mouse.MouseWheelEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        MouseWheelEvent:
        {
        	get:function(){
        		if(ContentElement._MouseWheelEvent === undefined){
        			ContentElement._MouseWheelEvent = Mouse.MouseWheelEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._MouseWheelEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the Mouse.MouseEnterEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        MouseEnterEvent:
        {
        	get:function(){
        		if(ContentElement._MouseEnterEvent === undefined){
        			ContentElement._MouseEnterEvent = Mouse.MouseEnterEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._MouseEnterEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Mouse.MouseLeaveEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        MouseLeaveEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewMouseDownEvent === undefined){
        			ContentElement._PreviewMouseDownEvent = Mouse.MouseLeaveEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewMouseDownEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the Mouse.GotMouseCaptureEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        GotMouseCaptureEvent:
        {
        	get:function(){
        		if(ContentElement._GotMouseCaptureEvent === undefined){
        			ContentElement._GotMouseCaptureEvent = Mouse.GotMouseCaptureEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._GotMouseCaptureEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the Mouse.LostMouseCaptureEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        LostMouseCaptureEvent:
        {
        	get:function(){
        		if(ContentElement._LostMouseCaptureEvent === undefined){
        			ContentElement._LostMouseCaptureEvent = Mouse.LostMouseCaptureEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._LostMouseCaptureEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Mouse.QueryCursorEvent. 
        /// </summary> 
//        public static readonly RoutedEvent 
        QueryCursorEvent:
        {
        	get:function(){
        		if(ContentElement._QueryCursorEvent === undefined){
        			ContentElement._QueryCursorEvent = Mouse.QueryCursorEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._QueryCursorEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Keyboard.PreviewKeyDownEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewKeyDownEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewKeyDownEvent === undefined){
        			ContentElement._PreviewKeyDownEvent = Keyboard.PreviewKeyDownEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._PreviewKeyDownEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Keyboard.KeyDownEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        KeyDownEvent:
        {
        	get:function(){
        		if(ContentElement._KeyDownEvent === undefined){
        			ContentElement._KeyDownEvent = Keyboard.KeyDownEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._KeyDownEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the Keyboard.PreviewKeyUpEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewKeyUpEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewKeyUpEvent === undefined){
        			ContentElement._PreviewKeyUpEvent = Keyboard.PreviewKeyUpEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewKeyUpEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the Keyboard.KeyUpEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        KeyUpEvent:
        {
        	get:function(){
        		if(ContentElement._KeyUpEvent === undefined){
        			ContentElement._KeyUpEvent = Keyboard.KeyUpEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._KeyUpEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Keyboard.PreviewGotKeyboardFocusEvent. 
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewGotKeyboardFocusEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewGotKeyboardFocusEvent === undefined){
        			ContentElement._PreviewGotKeyboardFocusEvent = Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewGotKeyboardFocusEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the Keyboard.GotKeyboardFocusEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        GotKeyboardFocusEvent:
        {
        	get:function(){
        		if(ContentElement._GotKeyboardFocusEvent === undefined){
        			ContentElement._GotKeyboardFocusEvent = Keyboard.GotKeyboardFocusEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._GotKeyboardFocusEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the Keyboard.PreviewLostKeyboardFocusEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewLostKeyboardFocusEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewLostKeyboardFocusEvent === undefined){
        			ContentElement._PreviewLostKeyboardFocusEvent = Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewLostKeyboardFocusEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the Keyboard.LostKeyboardFocusEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        LostKeyboardFocusEvent:
        {
        	get:function(){
        		if(ContentElement._LostKeyboardFocusEvent === undefined){
        			ContentElement._LostKeyboardFocusEvent = Keyboard.LostKeyboardFocusEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._LostKeyboardFocusEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the TextCompositionManager.PreviewTextInputEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewTextInputEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewTextInputEvent === undefined){
        			ContentElement._PreviewTextInputEvent = TextCompositionManager.PreviewTextInputEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewTextInputEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the TextCompositionManager.TextInputEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        TextInputEvent:
        {
        	get:function(){
        		if(ContentElement._TextInputEvent === undefined){
        			ContentElement._TextInputEvent = TextCompositionManager.TextInputEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._TextInputEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the DragDrop.PreviewQueryContinueDragEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewQueryContinueDragEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewQueryContinueDragEvent === undefined){
        			ContentElement._PreviewQueryContinueDragEvent = DragDrop.PreviewQueryContinueDragEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewQueryContinueDragEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the DragDrop.QueryContinueDragEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        QueryContinueDragEvent:
        {
        	get:function(){
        		if(ContentElement._QueryContinueDragEvent === undefined){
        			ContentElement._QueryContinueDragEvent = DragDrop.QueryContinueDragEvent.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._QueryContinueDragEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the DragDrop.PreviewGiveFeedbackEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        PreviewGiveFeedbackEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewGiveFeedbackEvent === undefined){
        			ContentElement._PreviewGiveFeedbackEvent = DragDrop.PreviewGiveFeedbackEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewGiveFeedbackEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the DragDrop.GiveFeedbackEvent. 
        /// </summary> 
//        public static readonly RoutedEvent 
        GiveFeedbackEvent:
        {
        	get:function(){
        		if(ContentElement._GiveFeedbackEvent === undefined){
        			ContentElement._GiveFeedbackEvent = DragDrop.GiveFeedbackEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._GiveFeedbackEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the DragDrop.PreviewDragEnterEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewDragEnterEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewDragEnterEvent === undefined){
        			ContentElement._PreviewDragEnterEvent = DragDrop.PreviewDragEnterEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewDragEnterEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the DragDrop.DragEnterEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        DragEnterEvent:
        {
        	get:function(){
        		if(ContentElement._DragEnterEvent === undefined){
        			ContentElement._DragEnterEvent = DragDrop.DragEnterEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._DragEnterEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the DragDrop.PreviewDragOverEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewDragOverEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewDragOverEvent === undefined){
        			ContentElement._PreviewDragOverEvent = DragDrop.PreviewDragOverEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._PreviewDragOverEvent;
        	}
        }, 

        /// <summary> 
        ///     Alias to the DragDrop.DragOverEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        DragOverEvent:
        {
        	get:function(){
        		if(ContentElement._DragOverEvent === undefined){
        			ContentElement._DragOverEvent = DragDrop.DragOverEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._DragOverEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the DragDrop.PreviewDragLeaveEvent.
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewDragLeaveEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewDragLeaveEvent === undefined){
        			ContentElement._PreviewDragLeaveEvent = DragDrop.PreviewDragLeaveEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewDragLeaveEvent;
        	}
        }, 

        /// <summary>
        ///     Alias to the DragDrop.DragLeaveEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        DragLeaveEvent:
        {
        	get:function(){
        		if(ContentElement._DragLeaveEvent === undefined){
        			ContentElement._DragLeaveEvent = DragDrop.DragLeaveEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._DragLeaveEvent;
        	}
        }, 
 
        /// <summary>
        ///     Alias to the DragDrop.PreviewDropEvent. 
        /// </summary>
//        public static readonly RoutedEvent 
        PreviewDropEvent:
        {
        	get:function(){
        		if(ContentElement._PreviewDropEvent === undefined){
        			ContentElement._PreviewDropEvent = DragDrop.PreviewDropEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._PreviewDropEvent;
        	}
        }, 
 
        /// <summary> 
        ///     Alias to the DragDrop.DropEvent.
        /// </summary> 
//        public static readonly RoutedEvent 
        DropEvent:
        {
        	get:function(){
        		if(ContentElement._DropEvent === undefined){
        			ContentElement._DropEvent = DragDrop.DropEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._DropEvent;
        	}
        }, 

        /// <summary> 
        ///     The dependency property for the IsMouseDirectlyOver property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsMouseDirectlyOverProperty:
        {
        	get:function(){
        		if(ContentElement._IsMouseDirectlyOverProperty === undefined){
        			ContentElement._IsMouseDirectlyOverProperty = UIElement.IsMouseDirectlyOverProperty.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._IsMouseDirectlyOverProperty;
        	}
        }, 

        /// <summary> 
        ///     The dependency property for the IsMouseOver property. 
        /// </summary>
//        public static readonly DependencyProperty 
        IsMouseOverProperty:
        {
        	get:function(){
        		if(ContentElement._IsMouseOverProperty === undefined){
        			ContentElement._IsMouseOverProperty = UIElement.IsMouseOverProperty.AddOwner(ContentElement.Type);  
        		}
        		
        		return ContentElement._IsMouseOverProperty;
        	}
        }, 

        /// <summary> 
        ///     The dependency property for the IsKeyboardFocusWithin property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsKeyboardFocusWithinProperty:
        {
        	get:function(){
        		if(ContentElement._IsKeyboardFocusWithinProperty === undefined){
        			ContentElement._IsKeyboardFocusWithinProperty = UIElement.IsKeyboardFocusWithinProperty.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._IsKeyboardFocusWithinProperty;
        	}
        }, 

        /// <summary>
        ///     The dependency property for the IsMouseCaptured property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsMouseCapturedProperty:
        {
        	get:function(){
        		if(ContentElement._IsMouseCapturedProperty === undefined){
        			ContentElement._IsMouseCapturedProperty = UIElement.IsMouseCapturedProperty.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._IsMouseCapturedProperty;
        	}
        }, 

        /// <summary> 
        ///     The dependency property for the IsMouseCaptureWithin property.
        /// </summary>
//        public static readonly DependencyProperty 
        IsMouseCaptureWithinProperty:
        {
        	get:function(){
        		if(ContentElement._IsMouseCaptureWithinProperty === undefined){
        			ContentElement._IsMouseCaptureWithinProperty = UIElement.IsMouseCaptureWithinProperty.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._IsMouseCaptureWithinProperty;
        	}
        }, 
 
        /// <summary> 
        ///     The dependency property for the IsKeyboardFocused property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsKeyboardFocusedProperty:
        {
        	get:function(){
        		if(ContentElement._IsKeyboardFocusedProperty === undefined){
        			ContentElement._IsKeyboardFocusedProperty = UIElement.IsKeyboardFocusedProperty.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._IsKeyboardFocusedProperty;
        	}
        }, 

        /// <summary> 
        ///     GotFocus event 
        /// </summary>
//        public static readonly RoutedEvent 
        GotFocusEvent:
        {
        	get:function(){
        		if(ContentElement._GotFocusEvent === undefined){
        			ContentElement._GotFocusEvent = FocusManager.GotFocusEvent.AddOwner(ContentElement.Type); 
        		}
        		
        		return ContentElement._GotFocusEvent;
        	}
        }, 

        /// <summary>
        ///     LostFocus event
        /// </summary> 
//        public static readonly RoutedEvent 
        LostFocusEvent:
        {
        	get:function(){
        		if(ContentElement._LostFocusEvent === undefined){
        			ContentElement._LostFocusEvent = FocusManager.LostFocusEvent.AddOwner(ContentElement.Type);
        		}
        		
        		return ContentElement._LostFocusEvent;
        	}
        }, 
 
        /// <summary> 
        ///     The DependencyProperty for IsFocused.
        ///     Flags:              None 
        ///     Read-Only:          true
        /// </summary>
//        public static readonly DependencyProperty 
        IsFocusedProperty:
        {
        	get:function(){
        		if(ContentElement._IsFocusedProperty === undefined){
        			ContentElement._IsFocusedProperty =
                    UIElement.IsFocusedProperty.AddOwner( 
                    		ContentElement.Type);
        		}
        		
        		return ContentElement._IsFocusedProperty;
        	}
        }, 
 
        /// <summary>
        ///     The DependencyProperty for the IsEnabled property.
        /// </summary> 
//        public static readonly DependencyProperty 
        IsEnabledProperty:
        {
        	get:function(){
        		if(ContentElement._IsEnabledProperty === undefined){
        			ContentElement._IsEnabledProperty =
                    UIElement.IsEnabledProperty.AddOwner( 
                                ContentElement.Type, 
                                /*new UIPropertyMetadata(
                                            true, // default value 
                                            new PropertyChangedCallback(null, OnIsEnabledChanged),
                                            new CoerceValueCallback(null, CoerceIsEnabled))*/
                                UIPropertyMetadata.BuildWithDVandPCCBandCVCB(
                                            true, // default value 
                                            new PropertyChangedCallback(null, OnIsEnabledChanged),
                                            new CoerceValueCallback(null, CoerceIsEnabled)));
        		}
        		
        		return ContentElement._IsEnabledProperty;
        	}
        },

 

        /// <summary>
        ///     The DependencyProperty for the Focusable property.
        /// </summary>
//        public static readonly DependencyProperty 
        FocusableProperty:
        {
        	get:function(){
        		if(ContentElement._FocusableProperty === undefined){
        			ContentElement._FocusableProperty =
                        UIElement.FocusableProperty.AddOwner( 
                                ContentElement.Type, 
                                /*new UIPropertyMetadata(
                                        false, // default value 
                                        new PropertyChangedCallback(null, OnFocusableChanged))*/
                                UIPropertyMetadata.BuildWithDVandPCCB(
                                        false, // default value 
                                        new PropertyChangedCallback(null, OnFocusableChanged)));
        		}
        		
        		return ContentElement._FocusableProperty;
        	}
        }, 

 
        /// <summary>
        ///     The DependencyProperty for the AllowDrop property. 
        /// </summary> 
//        public static readonly DependencyProperty 
        AllowDropProperty:
        {
        	get:function(){
        		if(ContentElement._AllowDropProperty === undefined){
        			ContentElement._AllowDropProperty =
                    UIElement.AllowDropProperty.AddOwner( 
                                ContentElement.Type,
                                /*new PropertyMetadata(false)*/
                                PropertyMetadata.BuildWithDefaultValue(false)); 
        		}
        		
        		return ContentElement._AllowDropProperty;
        	}
        }, 
	});



//    private static void 
    function RegisterProperties() 
    {
        UIElement.IsMouseDirectlyOverPropertyKey.OverrideMetadata( 
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                                        false, // default value 
                                        new PropertyChangedCallback(null, IsMouseDirectlyOver_Changed))*/
                            PropertyMetadata.BuildWithDVandPCB(
                                    false, // default value 
                                    new PropertyChangedCallback(null, IsMouseDirectlyOver_Changed)));

        UIElement.IsMouseOverPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                            		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false)); 

        UIElement.IsStylusOverPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false));

        UIElement.IsKeyboardFocusWithinPropertyKey.OverrideMetadata( 
                            ContentElement.Type,
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false)); 

        UIElement.IsMouseCapturedPropertyKey.OverrideMetadata( 
                            ContentElement.Type,
                            new PropertyMetadata(
                            		false, // default value
                                        new PropertyChangedCallback(IsMouseCaptured_Changed))); 

        UIElement.IsMouseCaptureWithinPropertyKey.OverrideMetadata( 
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false)); 

        UIElement.IsStylusDirectlyOverPropertyKey.OverrideMetadata(
                            ContentElement.Type,
                            /*new PropertyMetadata( 
                            		false, // default value
                                        new PropertyChangedCallback(null, IsStylusDirectlyOver_Changed))*/
                            PropertyMetadata.BuildWithDVandPCB( 
                            		false, // default value
                                    new PropertyChangedCallback(null, IsStylusDirectlyOver_Changed))); 

        UIElement.IsStylusCapturedPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                            		false, // default value
                                        new PropertyChangedCallback(null, IsStylusCaptured_Changed))*/
                            PropertyMetadata.BuildWithDVandPCB(
                            		false, // default value
                                        new PropertyChangedCallback(null, IsStylusCaptured_Changed)));

        UIElement.IsStylusCaptureWithinPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false));

        UIElement.IsKeyboardFocusedPropertyKey.OverrideMetadata(
                            ContentElement.Type,
                            /*new PropertyMetadata(
                            		false, // default value 
                                        new PropertyChangedCallback(null, IsKeyboardFocused_Changed))*/
                            PropertyMetadata.BuildWithDVandPCB(
                            		false, // default value 
                                        new PropertyChangedCallback(null, IsKeyboardFocused_Changed)));

        UIElement.AreAnyTouchesDirectlyOverPropertyKey.OverrideMetadata( 
                            ContentElement.Type,
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false));

        UIElement.AreAnyTouchesOverPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false)); 

        UIElement.AreAnyTouchesCapturedPropertyKey.OverrideMetadata(
                            ContentElement.Type, 
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false));

        UIElement.AreAnyTouchesCapturedWithinPropertyKey.OverrideMetadata( 
                            ContentElement.Type,
                            /*new PropertyMetadata(
                    		false)*/
                            PropertyMetadata.BuildWithDefaultValue(false)); 
    }

//    private static void 
    function IsMouseDirectlyOver_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        d.RaiseIsMouseDirectlyOverChanged(e);
    } 

//    private static void 
    function IsMouseCaptured_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    { 
        d.RaiseIsMouseCapturedChanged(e);
    } 


//    private static void 
    function IsKeyboardFocused_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
        d.RaiseIsKeyboardFocusedChanged(e);
    }

//    private static void 
    function IsFocused_Changed(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e) 
    {
//        ContentElement ce = ((ContentElement) d); 

        if ( e.NewValue)
        {
            d.OnGotFocus(new RoutedEventArgs(GotFocusEvent, d)); 
        }
        else 
        { 
            d.OnLostFocus(new RoutedEventArgs(LostFocusEvent, d));
        } 
    }

//    private static object 
    function CoerceIsEnabled(/*DependencyObject*/ d, /*object*/ value) 
    {
//        ContentElement ce = (ContentElement) d; 

        // We must be false if our parent is false, but we can be
        // either true or false if our parent is true.
        // 
        // Another way of saying this is that we can only be true
        // if our parent is true, but we can always be false. 
        if(value) 
        {
            // Use the "logical" parent.  This is different that UIElement, which 
            // uses the visual parent.  But the "content parent" is not a complete
            // tree description (for instance, we don't track "content children"),
            // so the best we can do is use the logical tree for ContentElements.
            // 
            // Note: we assume the "logical" parent of a ContentElement is either
            // a UIElement or ContentElement.  We explicitly assume that there 
            // is never a raw Visual as the parent. 

            /*DependencyObject*/var parent = d.GetUIParentCore(); 

            if(parent == null || parent.GetValue(IsEnabledProperty))
            {
                return d.IsEnabledCore; 
            }
            else 
            { 
                return false; //BooleanBoxes.FalseBox;
            } 
        }
        else
        {
            return false; //BooleanBoxes.FalseBox; 
        }
    } 

//    private static void 
    function OnIsEnabledChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        ContentElement ce = (ContentElement)d;

        // Raise the public changed event.
        d.RaiseDependencyPropertyChanged(UIElement.IsEnabledChangedKey, e); 

        // Invalidate the children so that they will inherit the new value. 
        d.InvalidateForceInheritPropertyOnChildren(e.Property); 

        // The input manager needs to re-hittest because something changed 
        // that is involved in the hit-testing we do, so a different result
        // could be returned.
        InputManager.SafeCurrentNotifyHitTestInvalidated();
    } 

//    private static void 
    function OnFocusableChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
//        ContentElement ce = (ContentElement) d;

        // Raise the public changed event. 
        d.RaiseDependencyPropertyChanged(UIElement.FocusableChangedKey, e);
    } 
	
	ContentElement.Type = new Type("ContentElement", ContentElement, [DependencyObject.Type, IInputElement.Type, IAnimatable.Type]);
	return ContentElement;
});

//         /// <summary>
//         ///     Alias to the Mouse.PreviewMouseDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewMouseDownEvent = Mouse.PreviewMouseDownEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting the mouse button was pressed 
//         /// </summary>
//         public event MouseButtonEventHandler PreviewMouseDown
//         {
//             add { AddHandler(Mouse.PreviewMouseDownEvent, value, false); } 
//             remove { RemoveHandler(Mouse.PreviewMouseDownEvent, value); }
//         } 
//         /// <summary> 
//         ///     Alias to the Mouse.MouseDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent MouseDownEvent = Mouse.MouseDownEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the mouse button was pressed
//         /// </summary>
//         public event MouseButtonEventHandler MouseDown
//         { 
//             add { AddHandler(Mouse.MouseDownEvent, value, false); }
//             remove { RemoveHandler(Mouse.MouseDownEvent, value); } 
//         } 
//         /// <summary>
//         ///     Alias to the Mouse.PreviewMouseUpEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent PreviewMouseUpEvent = Mouse.PreviewMouseUpEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the mouse button was released
//         /// </summary>
//         public event MouseButtonEventHandler PreviewMouseUp 
//         {
//             add { AddHandler(Mouse.PreviewMouseUpEvent, value, false); } 
//             remove { RemoveHandler(Mouse.PreviewMouseUpEvent, value); } 
//         }
//
//         /// <summary> 
//         ///     Alias to the Mouse.MouseUpEvent. 
//         /// </summary>
//         public static readonly RoutedEvent MouseUpEvent = Mouse.MouseUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting the mouse button was released
//         /// </summary> 
//         public event MouseButtonEventHandler MouseUp
//         { 
//             add { AddHandler(Mouse.MouseUpEvent, value, false); } 
//             remove { RemoveHandler(Mouse.MouseUpEvent, value); }
//         } 
//         /// <summary> 
//         ///     Alias to the UIElement.PreviewMouseLeftButtonDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewMouseLeftButtonDownEvent = UIElement.PreviewMouseLeftButtonDownEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting the left mouse button was pressed 
//         /// </summary>
//         public event MouseButtonEventHandler PreviewMouseLeftButtonDown 
//         { 
//             add { AddHandler(UIElement.PreviewMouseLeftButtonDownEvent, value, false); }
//             remove { RemoveHandler(UIElement.PreviewMouseLeftButtonDownEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Alias to the UIElement.MouseLeftButtonDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent MouseLeftButtonDownEvent = UIElement.MouseLeftButtonDownEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting the left mouse button was pressed
//         /// </summary> 
//         public event MouseButtonEventHandler MouseLeftButtonDown 
//         {
//             add { AddHandler(UIElement.MouseLeftButtonDownEvent, value, false); } 
//             remove { RemoveHandler(UIElement.MouseLeftButtonDownEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Alias to the UIElement.PreviewMouseLeftButtonUpEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewMouseLeftButtonUpEvent = UIElement.PreviewMouseLeftButtonUpEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the left mouse button was released 
//         /// </summary> 
//         public event MouseButtonEventHandler PreviewMouseLeftButtonUp
//         { 
//             add { AddHandler(UIElement.PreviewMouseLeftButtonUpEvent, value, false); }
//             remove { RemoveHandler(UIElement.PreviewMouseLeftButtonUpEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Alias to the UIElement.MouseLeftButtonUpEvent.
//         /// </summary>
//         public static readonly RoutedEvent MouseLeftButtonUpEvent = UIElement.MouseLeftButtonUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the left mouse button was released 
//         /// </summary>
//         public event MouseButtonEventHandler MouseLeftButtonUp 
//         {
//             add { AddHandler(UIElement.MouseLeftButtonUpEvent, value, false); }
//             remove { RemoveHandler(UIElement.MouseLeftButtonUpEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Alias to the UIElement.PreviewMouseRightButtonDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewMouseRightButtonDownEvent = UIElement.PreviewMouseRightButtonDownEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting the right mouse button was pressed
//         /// </summary> 
//         public event MouseButtonEventHandler PreviewMouseRightButtonDown
//         {
//             add { AddHandler(UIElement.PreviewMouseRightButtonDownEvent, value, false); }
//             remove { RemoveHandler(UIElement.PreviewMouseRightButtonDownEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Alias to the UIElement.MouseRightButtonDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent MouseRightButtonDownEvent = UIElement.MouseRightButtonDownEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting the right mouse button was pressed 
//         /// </summary>
//         public event MouseButtonEventHandler MouseRightButtonDown
//         {
//             add { AddHandler(UIElement.MouseRightButtonDownEvent, value, false); } 
//             remove { RemoveHandler(UIElement.MouseRightButtonDownEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Alias to the UIElement.PreviewMouseRightButtonUpEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewMouseRightButtonUpEvent = UIElement.PreviewMouseRightButtonUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the right mouse button was released
//         /// </summary>
//         public event MouseButtonEventHandler PreviewMouseRightButtonUp
//         { 
//             add { AddHandler(UIElement.PreviewMouseRightButtonUpEvent, value, false); }
//             remove { RemoveHandler(UIElement.PreviewMouseRightButtonUpEvent, value); } 
//         } 
//  
//         /// <summary>
//         ///     Alias to the UIElement.MouseRightButtonUpEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent MouseRightButtonUpEvent = UIElement.MouseRightButtonUpEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the right mouse button was released
//         /// </summary>
//         public event MouseButtonEventHandler MouseRightButtonUp 
//         {
//             add { AddHandler(UIElement.MouseRightButtonUpEvent, value, false); } 
//             remove { RemoveHandler(UIElement.MouseRightButtonUpEvent, value); } 
//         }
//
//         /// <summary> 
//         ///     Alias to the Mouse.PreviewMouseMoveEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewMouseMoveEvent = Mouse.PreviewMouseMoveEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting a mouse move
//         /// </summary> 
//         public event MouseEventHandler PreviewMouseMove
//         { 
//             add { AddHandler(Mouse.PreviewMouseMoveEvent, value, false); } 
//             remove { RemoveHandler(Mouse.PreviewMouseMoveEvent, value); }
//         } 
//  
//         /// <summary> 
//         ///     Alias to the Mouse.MouseMoveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent MouseMoveEvent = Mouse.MouseMoveEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting a mouse move 
//         /// </summary>
//         public event MouseEventHandler MouseMove 
//         { 
//             add { AddHandler(Mouse.MouseMoveEvent, value, false); }
//             remove { RemoveHandler(Mouse.MouseMoveEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Alias to the Mouse.PreviewMouseWheelEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewMouseWheelEvent = Mouse.PreviewMouseWheelEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting a mouse wheel rotation
//         /// </summary> 
//         public event MouseWheelEventHandler PreviewMouseWheel 
//         {
//             add { AddHandler(Mouse.PreviewMouseWheelEvent, value, false); } 
//             remove { RemoveHandler(Mouse.PreviewMouseWheelEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Alias to the Mouse.MouseWheelEvent.
//         /// </summary>
//         public static readonly RoutedEvent MouseWheelEvent = Mouse.MouseWheelEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting a mouse wheel rotation 
//         /// </summary> 
//         public event MouseWheelEventHandler MouseWheel
//         { 
//             add { AddHandler(Mouse.MouseWheelEvent, value, false); }
//             remove { RemoveHandler(Mouse.MouseWheelEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Alias to the Mouse.MouseEnterEvent.
//         /// </summary>
//         public static readonly RoutedEvent MouseEnterEvent = Mouse.MouseEnterEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the mouse entered this element 
//         /// </summary>
//         public event MouseEventHandler MouseEnter 
//         {
//             add { AddHandler(Mouse.MouseEnterEvent, value, false); }
//             remove { RemoveHandler(Mouse.MouseEnterEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Alias to the Mouse.MouseLeaveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent MouseLeaveEvent = Mouse.MouseLeaveEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting the mouse left this element
//         /// </summary> 
//         public event MouseEventHandler MouseLeave
//         {
//             add { AddHandler(Mouse.MouseLeaveEvent, value, false); }
//             remove { RemoveHandler(Mouse.MouseLeaveEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Alias to the Mouse.GotMouseCaptureEvent. 
//         /// </summary>
//         public static readonly RoutedEvent GotMouseCaptureEvent = Mouse.GotMouseCaptureEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting that this element got the mouse capture 
//         /// </summary>
//         public event MouseEventHandler GotMouseCapture
//         {
//             add { AddHandler(Mouse.GotMouseCaptureEvent, value, false); } 
//             remove { RemoveHandler(Mouse.GotMouseCaptureEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Alias to the Mouse.LostMouseCaptureEvent.
//         /// </summary> 
//         public static readonly RoutedEvent LostMouseCaptureEvent = Mouse.LostMouseCaptureEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting that this element lost the mouse capture
//         /// </summary>
//         public event MouseEventHandler LostMouseCapture
//         { 
//             add { AddHandler(Mouse.LostMouseCaptureEvent, value, false); }
//             remove { RemoveHandler(Mouse.LostMouseCaptureEvent, value); } 
//         } 
//  
//         /// <summary>
//         ///     Alias to the Mouse.QueryCursorEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent QueryCursorEvent = Mouse.QueryCursorEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the cursor to display was requested
//         /// </summary>
//         public event QueryCursorEventHandler QueryCursor 
//         {
//             add { AddHandler(Mouse.QueryCursorEvent, value, false); } 
//             remove { RemoveHandler(Mouse.QueryCursorEvent, value); } 
//         }
//
//         /// <summary> 
//         ///     Alias to the Stylus.PreviewStylusDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusDownEvent = Stylus.PreviewStylusDownEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting a stylus-down
//         /// </summary> 
//         public event StylusDownEventHandler PreviewStylusDown
//         { 
//             add { AddHandler(Stylus.PreviewStylusDownEvent, value, false); } 
//             remove { RemoveHandler(Stylus.PreviewStylusDownEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting a stylus-down
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusDown(StylusDownEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the Stylus.StylusDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent StylusDownEvent = Stylus.StylusDownEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting a stylus-down 
//         /// </summary>
//         public event StylusDownEventHandler StylusDown 
//         { 
//             add { AddHandler(Stylus.StylusDownEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusDownEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting a stylus-down 
//         /// </summary>
//         protected internal virtual void OnStylusDown(StylusDownEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the Stylus.PreviewStylusUpEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusUpEvent = Stylus.PreviewStylusUpEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting a stylus-up
//         /// </summary> 
//         public event StylusEventHandler PreviewStylusUp 
//         {
//             add { AddHandler(Stylus.PreviewStylusUpEvent, value, false); } 
//             remove { RemoveHandler(Stylus.PreviewStylusUpEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting a stylus-up
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusUp(StylusEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Stylus.StylusUpEvent.
//         /// </summary>
//         public static readonly RoutedEvent StylusUpEvent = Stylus.StylusUpEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting a stylus-up 
//         /// </summary> 
//         public event StylusEventHandler StylusUp
//         { 
//             add { AddHandler(Stylus.StylusUpEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusUpEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting a stylus-up 
//         /// </summary> 
//         protected internal virtual void OnStylusUp(StylusEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Stylus.PreviewStylusMoveEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusMoveEvent = Stylus.PreviewStylusMoveEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a stylus move 
//         /// </summary>
//         public event StylusEventHandler PreviewStylusMove 
//         {
//             add { AddHandler(Stylus.PreviewStylusMoveEvent, value, false); }
//             remove { RemoveHandler(Stylus.PreviewStylusMoveEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting a stylus move 
//         /// </summary>
//         protected internal virtual void OnPreviewStylusMove(StylusEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the Stylus.StylusMoveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent StylusMoveEvent = Stylus.StylusMoveEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting a stylus move
//         /// </summary> 
//         public event StylusEventHandler StylusMove
//         {
//             add { AddHandler(Stylus.StylusMoveEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusMoveEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting a stylus move
//         /// </summary> 
//         protected internal virtual void OnStylusMove(StylusEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the Stylus.PreviewStylusInAirMoveEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusInAirMoveEvent = Stylus.PreviewStylusInAirMoveEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting a stylus-in-air-move 
//         /// </summary>
//         public event StylusEventHandler PreviewStylusInAirMove
//         {
//             add { AddHandler(Stylus.PreviewStylusInAirMoveEvent, value, false); } 
//             remove { RemoveHandler(Stylus.PreviewStylusInAirMoveEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting a stylus-in-air-move 
//         /// </summary>
//         protected internal virtual void OnPreviewStylusInAirMove(StylusEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the Stylus.StylusInAirMoveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent StylusInAirMoveEvent = Stylus.StylusInAirMoveEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a stylus-in-air-move
//         /// </summary>
//         public event StylusEventHandler StylusInAirMove
//         { 
//             add { AddHandler(Stylus.StylusInAirMoveEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusInAirMoveEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting a stylus-in-air-move
//         /// </summary>
//         protected internal virtual void OnStylusInAirMove(StylusEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Stylus.StylusEnterEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent StylusEnterEvent = Stylus.StylusEnterEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the stylus entered this element
//         /// </summary>
//         public event StylusEventHandler StylusEnter 
//         {
//             add { AddHandler(Stylus.StylusEnterEvent, value, false); } 
//             remove { RemoveHandler(Stylus.StylusEnterEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting the stylus entered this element
//         /// </summary>
//         protected internal virtual void OnStylusEnter(StylusEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Stylus.StylusLeaveEvent. 
//         /// </summary>
//         public static readonly RoutedEvent StylusLeaveEvent = Stylus.StylusLeaveEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting the stylus left this element
//         /// </summary> 
//         public event StylusEventHandler StylusLeave
//         { 
//             add { AddHandler(Stylus.StylusLeaveEvent, value, false); } 
//             remove { RemoveHandler(Stylus.StylusLeaveEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting the stylus left this element
//         /// </summary> 
//         protected internal virtual void OnStylusLeave(StylusEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the Stylus.PreviewStylusInRangeEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewStylusInRangeEvent = Stylus.PreviewStylusInRangeEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting the stylus is now in range of the digitizer 
//         /// </summary>
//         public event StylusEventHandler PreviewStylusInRange 
//         { 
//             add { AddHandler(Stylus.PreviewStylusInRangeEvent, value, false); }
//             remove { RemoveHandler(Stylus.PreviewStylusInRangeEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting the stylus is now in range of the digitizer 
//         /// </summary>
//         protected internal virtual void OnPreviewStylusInRange(StylusEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the Stylus.StylusInRangeEvent. 
//         /// </summary>
//         public static readonly RoutedEvent StylusInRangeEvent = Stylus.StylusInRangeEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting the stylus is now in range of the digitizer
//         /// </summary> 
//         public event StylusEventHandler StylusInRange 
//         {
//             add { AddHandler(Stylus.StylusInRangeEvent, value, false); } 
//             remove { RemoveHandler(Stylus.StylusInRangeEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting the stylus is now in range of the digitizer
//         /// </summary> 
//         protected internal virtual void OnStylusInRange(StylusEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Stylus.PreviewStylusOutOfRangeEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusOutOfRangeEvent = Stylus.PreviewStylusOutOfRangeEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the stylus is now out of range of the digitizer 
//         /// </summary> 
//         public event StylusEventHandler PreviewStylusOutOfRange
//         { 
//             add { AddHandler(Stylus.PreviewStylusOutOfRangeEvent, value, false); }
//             remove { RemoveHandler(Stylus.PreviewStylusOutOfRangeEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting the stylus is now out of range of the digitizer 
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusOutOfRange(StylusEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Stylus.StylusOutOfRangeEvent.
//         /// </summary>
//         public static readonly RoutedEvent StylusOutOfRangeEvent = Stylus.StylusOutOfRangeEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the stylus is now out of range of the digitizer 
//         /// </summary>
//         public event StylusEventHandler StylusOutOfRange 
//         {
//             add { AddHandler(Stylus.StylusOutOfRangeEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusOutOfRangeEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting the stylus is now out of range of the digitizer 
//         /// </summary>
//         protected internal virtual void OnStylusOutOfRange(StylusEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the Stylus.PreviewStylusSystemGestureEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewStylusSystemGestureEvent = Stylus.PreviewStylusSystemGestureEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting a stylus system gesture
//         /// </summary> 
//         public event StylusSystemGestureEventHandler PreviewStylusSystemGesture
//         {
//             add { AddHandler(Stylus.PreviewStylusSystemGestureEvent, value, false); }
//             remove { RemoveHandler(Stylus.PreviewStylusSystemGestureEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting a stylus system gesture
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusSystemGesture(StylusSystemGestureEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the Stylus.StylusSystemGestureEvent. 
//         /// </summary>
//         public static readonly RoutedEvent StylusSystemGestureEvent = Stylus.StylusSystemGestureEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting a stylus system gesture 
//         /// </summary>
//         public event StylusSystemGestureEventHandler StylusSystemGesture
//         {
//             add { AddHandler(Stylus.StylusSystemGestureEvent, value, false); } 
//             remove { RemoveHandler(Stylus.StylusSystemGestureEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting a stylus system gesture 
//         /// </summary>
//         protected internal virtual void OnStylusSystemGesture(StylusSystemGestureEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the Stylus.GotStylusCaptureEvent.
//         /// </summary> 
//         public static readonly RoutedEvent GotStylusCaptureEvent = Stylus.GotStylusCaptureEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting that this element got the stylus capture
//         /// </summary>
//         public event StylusEventHandler GotStylusCapture
//         { 
//             add { AddHandler(Stylus.GotStylusCaptureEvent, value, false); }
//             remove { RemoveHandler(Stylus.GotStylusCaptureEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting that this element got the stylus capture
//         /// </summary>
//         protected internal virtual void OnGotStylusCapture(StylusEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Stylus.LostStylusCaptureEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent LostStylusCaptureEvent = Stylus.LostStylusCaptureEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting that this element lost the stylus capture
//         /// </summary>
//         public event StylusEventHandler LostStylusCapture 
//         {
//             add { AddHandler(Stylus.LostStylusCaptureEvent, value, false); } 
//             remove { RemoveHandler(Stylus.LostStylusCaptureEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting that this element lost the stylus capture
//         /// </summary>
//         protected internal virtual void OnLostStylusCapture(StylusEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Stylus.StylusButtonDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent StylusButtonDownEvent = Stylus.StylusButtonDownEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting the stylus button is down
//         /// </summary> 
//         public event StylusButtonEventHandler StylusButtonDown
//         { 
//             add { AddHandler(Stylus.StylusButtonDownEvent, value, false); } 
//             remove { RemoveHandler(Stylus.StylusButtonDownEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting the stylus button is down
//         /// </summary> 
//         protected internal virtual void OnStylusButtonDown(StylusButtonEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the Stylus.StylusButtonUpEvent.
//         /// </summary> 
//         public static readonly RoutedEvent StylusButtonUpEvent = Stylus.StylusButtonUpEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting the stylus button is up 
//         /// </summary>
//         public event StylusButtonEventHandler StylusButtonUp 
//         { 
//             add { AddHandler(Stylus.StylusButtonUpEvent, value, false); }
//             remove { RemoveHandler(Stylus.StylusButtonUpEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting the stylus button is up 
//         /// </summary>
//         protected internal virtual void OnStylusButtonUp(StylusButtonEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the Stylus.PreviewStylusButtonDownEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusButtonDownEvent = Stylus.PreviewStylusButtonDownEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting the stylus button is down
//         /// </summary> 
//         public event StylusButtonEventHandler PreviewStylusButtonDown 
//         {
//             add { AddHandler(Stylus.PreviewStylusButtonDownEvent, value, false); } 
//             remove { RemoveHandler(Stylus.PreviewStylusButtonDownEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting the stylus button is down
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusButtonDown(StylusButtonEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Stylus.PreviewStylusButtonUpEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewStylusButtonUpEvent = Stylus.PreviewStylusButtonUpEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the stylus button is up 
//         /// </summary> 
//         public event StylusButtonEventHandler PreviewStylusButtonUp
//         { 
//             add { AddHandler(Stylus.PreviewStylusButtonUpEvent, value, false); }
//             remove { RemoveHandler(Stylus.PreviewStylusButtonUpEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting the stylus button is up 
//         /// </summary> 
//         protected internal virtual void OnPreviewStylusButtonUp(StylusButtonEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Keyboard.PreviewKeyDownEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewKeyDownEvent = Keyboard.PreviewKeyDownEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a key was pressed 
//         /// </summary>
//         public event KeyEventHandler PreviewKeyDown 
//         {
//             add { AddHandler(Keyboard.PreviewKeyDownEvent, value, false); }
//             remove { RemoveHandler(Keyboard.PreviewKeyDownEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting a key was pressed 
//         /// </summary>
//         protected internal virtual void OnPreviewKeyDown(KeyEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the Keyboard.KeyDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent KeyDownEvent = Keyboard.KeyDownEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting a key was pressed
//         /// </summary> 
//         public event KeyEventHandler KeyDown
//         {
//             add { AddHandler(Keyboard.KeyDownEvent, value, false); }
//             remove { RemoveHandler(Keyboard.KeyDownEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting a key was pressed
//         /// </summary> 
//         protected internal virtual void OnKeyDown(KeyEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the Keyboard.PreviewKeyUpEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewKeyUpEvent = Keyboard.PreviewKeyUpEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting a key was released 
//         /// </summary>
//         public event KeyEventHandler PreviewKeyUp
//         {
//             add { AddHandler(Keyboard.PreviewKeyUpEvent, value, false); } 
//             remove { RemoveHandler(Keyboard.PreviewKeyUpEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting a key was released 
//         /// </summary>
//         protected internal virtual void OnPreviewKeyUp(KeyEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the Keyboard.KeyUpEvent.
//         /// </summary> 
//         public static readonly RoutedEvent KeyUpEvent = Keyboard.KeyUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a key was released
//         /// </summary>
//         public event KeyEventHandler KeyUp
//         { 
//             add { AddHandler(Keyboard.KeyUpEvent, value, false); }
//             remove { RemoveHandler(Keyboard.KeyUpEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting a key was released
//         /// </summary>
//         protected internal virtual void OnKeyUp(KeyEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Keyboard.PreviewGotKeyboardFocusEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent PreviewGotKeyboardFocusEvent = Keyboard.PreviewGotKeyboardFocusEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting that the keyboard is focused on this element
//         /// </summary>
//         public event KeyboardFocusChangedEventHandler PreviewGotKeyboardFocus 
//         {
//             add { AddHandler(Keyboard.PreviewGotKeyboardFocusEvent, value, false); } 
//             remove { RemoveHandler(Keyboard.PreviewGotKeyboardFocusEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting that the keyboard is focused on this element
//         /// </summary>
//         protected internal virtual void OnPreviewGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Keyboard.GotKeyboardFocusEvent. 
//         /// </summary>
//         public static readonly RoutedEvent GotKeyboardFocusEvent = Keyboard.GotKeyboardFocusEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting that the keyboard is focused on this element
//         /// </summary> 
//         public event KeyboardFocusChangedEventHandler GotKeyboardFocus
//         { 
//             add { AddHandler(Keyboard.GotKeyboardFocusEvent, value, false); } 
//             remove { RemoveHandler(Keyboard.GotKeyboardFocusEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting that the keyboard is focused on this element
//         /// </summary> 
//         protected internal virtual void OnGotKeyboardFocus(KeyboardFocusChangedEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the Keyboard.PreviewLostKeyboardFocusEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewLostKeyboardFocusEvent = Keyboard.PreviewLostKeyboardFocusEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
//         /// </summary>
//         public event KeyboardFocusChangedEventHandler PreviewLostKeyboardFocus 
//         { 
//             add { AddHandler(Keyboard.PreviewLostKeyboardFocusEvent, value, false); }
//             remove { RemoveHandler(Keyboard.PreviewLostKeyboardFocusEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed 
//         /// </summary>
//         protected internal virtual void OnPreviewLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the Keyboard.LostKeyboardFocusEvent. 
//         /// </summary>
//         public static readonly RoutedEvent LostKeyboardFocusEvent = Keyboard.LostKeyboardFocusEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting that the keyboard is no longer focusekeyboard is no longer focuseed
//         /// </summary> 
//         public event KeyboardFocusChangedEventHandler LostKeyboardFocus 
//         {
//             add { AddHandler(Keyboard.LostKeyboardFocusEvent, value, false); } 
//             remove { RemoveHandler(Keyboard.LostKeyboardFocusEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting that the keyboard is no longer focusekeyboard is no longer focuseed
//         /// </summary> 
//         protected internal virtual void OnLostKeyboardFocus(KeyboardFocusChangedEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the TextCompositionManager.PreviewTextInputEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewTextInputEvent = TextCompositionManager.PreviewTextInputEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting text composition 
//         /// </summary> 
//         public event TextCompositionEventHandler PreviewTextInput
//         { 
//             add { AddHandler(TextCompositionManager.PreviewTextInputEvent, value, false); }
//             remove { RemoveHandler(TextCompositionManager.PreviewTextInputEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting text composition 
//         /// </summary> 
//         protected internal virtual void OnPreviewTextInput(TextCompositionEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the TextCompositionManager.TextInputEvent.
//         /// </summary>
//         public static readonly RoutedEvent TextInputEvent = TextCompositionManager.TextInputEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting text composition 
//         /// </summary>
//         public event TextCompositionEventHandler TextInput 
//         {
//             add { AddHandler(TextCompositionManager.TextInputEvent, value, false); }
//             remove { RemoveHandler(TextCompositionManager.TextInputEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting text composition 
//         /// </summary>
//         protected internal virtual void OnTextInput(TextCompositionEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the DragDrop.PreviewQueryContinueDragEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewQueryContinueDragEvent = DragDrop.PreviewQueryContinueDragEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting the preview query continue drag is going to happen
//         /// </summary> 
//         public event QueryContinueDragEventHandler PreviewQueryContinueDrag
//         {
//             add { AddHandler(DragDrop.PreviewQueryContinueDragEvent, value, false); }
//             remove { RemoveHandler(DragDrop.PreviewQueryContinueDragEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting the preview query continue drag is going to happen
//         /// </summary> 
//         protected internal virtual void OnPreviewQueryContinueDrag(QueryContinueDragEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the DragDrop.QueryContinueDragEvent. 
//         /// </summary>
//         public static readonly RoutedEvent QueryContinueDragEvent = DragDrop.QueryContinueDragEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting the query continue drag is going to happen 
//         /// </summary>
//         public event QueryContinueDragEventHandler QueryContinueDrag
//         {
//             add { AddHandler(DragDrop.QueryContinueDragEvent, value, false); } 
//             remove { RemoveHandler(DragDrop.QueryContinueDragEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting the query continue drag is going to happen 
//         /// </summary>
//         protected internal virtual void OnQueryContinueDrag(QueryContinueDragEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the DragDrop.PreviewGiveFeedbackEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewGiveFeedbackEvent = DragDrop.PreviewGiveFeedbackEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the preview give feedback is going to happen
//         /// </summary>
//         public event GiveFeedbackEventHandler PreviewGiveFeedback
//         { 
//             add { AddHandler(DragDrop.PreviewGiveFeedbackEvent, value, false); }
//             remove { RemoveHandler(DragDrop.PreviewGiveFeedbackEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting the preview give feedback is going to happen
//         /// </summary>
//         protected internal virtual void OnPreviewGiveFeedback(GiveFeedbackEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the DragDrop.GiveFeedbackEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent GiveFeedbackEvent = DragDrop.GiveFeedbackEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the give feedback is going to happen
//         /// </summary>
//         public event GiveFeedbackEventHandler GiveFeedback 
//         {
//             add { AddHandler(DragDrop.GiveFeedbackEvent, value, false); } 
//             remove { RemoveHandler(DragDrop.GiveFeedbackEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting the give feedback is going to happen
//         /// </summary>
//         protected internal virtual void OnGiveFeedback(GiveFeedbackEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the DragDrop.PreviewDragEnterEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewDragEnterEvent = DragDrop.PreviewDragEnterEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting the preview drag enter is going to happen
//         /// </summary> 
//         public event DragEventHandler PreviewDragEnter
//         { 
//             add { AddHandler(DragDrop.PreviewDragEnterEvent, value, false); } 
//             remove { RemoveHandler(DragDrop.PreviewDragEnterEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting the preview drag enter is going to happen
//         /// </summary> 
//         protected internal virtual void OnPreviewDragEnter(DragEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the DragDrop.DragEnterEvent.
//         /// </summary> 
//         public static readonly RoutedEvent DragEnterEvent = DragDrop.DragEnterEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting the drag enter is going to happen 
//         /// </summary>
//         public event DragEventHandler DragEnter 
//         { 
//             add { AddHandler(DragDrop.DragEnterEvent, value, false); }
//             remove { RemoveHandler(DragDrop.DragEnterEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting the drag enter is going to happen 
//         /// </summary>
//         protected internal virtual void OnDragEnter(DragEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the DragDrop.PreviewDragOverEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewDragOverEvent = DragDrop.PreviewDragOverEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting the preview drag over is going to happen
//         /// </summary> 
//         public event DragEventHandler PreviewDragOver 
//         {
//             add { AddHandler(DragDrop.PreviewDragOverEvent, value, false); } 
//             remove { RemoveHandler(DragDrop.PreviewDragOverEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting the preview drag over is going to happen
//         /// </summary> 
//         protected internal virtual void OnPreviewDragOver(DragEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the DragDrop.DragOverEvent.
//         /// </summary>
//         public static readonly RoutedEvent DragOverEvent = DragDrop.DragOverEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the drag over is going to happen 
//         /// </summary> 
//         public event DragEventHandler DragOver
//         { 
//             add { AddHandler(DragDrop.DragOverEvent, value, false); }
//             remove { RemoveHandler(DragDrop.DragOverEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting the drag over is going to happen 
//         /// </summary> 
//         protected internal virtual void OnDragOver(DragEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the DragDrop.PreviewDragLeaveEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewDragLeaveEvent = DragDrop.PreviewDragLeaveEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the preview drag leave is going to happen 
//         /// </summary>
//         public event DragEventHandler PreviewDragLeave 
//         {
//             add { AddHandler(DragDrop.PreviewDragLeaveEvent, value, false); }
//             remove { RemoveHandler(DragDrop.PreviewDragLeaveEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting the preview drag leave is going to happen 
//         /// </summary>
//         protected internal virtual void OnPreviewDragLeave(DragEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the DragDrop.DragLeaveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent DragLeaveEvent = DragDrop.DragLeaveEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting the drag leave is going to happen
//         /// </summary> 
//         public event DragEventHandler DragLeave
//         {
//             add { AddHandler(DragDrop.DragLeaveEvent, value, false); }
//             remove { RemoveHandler(DragDrop.DragLeaveEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting the drag leave is going to happen
//         /// </summary> 
//         protected internal virtual void OnDragLeave(DragEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the DragDrop.PreviewDropEvent. 
//         /// </summary>
//         public static readonly RoutedEvent PreviewDropEvent = DragDrop.PreviewDropEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting the preview drop is going to happen 
//         /// </summary>
//         public event DragEventHandler PreviewDrop
//         {
//             add { AddHandler(DragDrop.PreviewDropEvent, value, false); } 
//             remove { RemoveHandler(DragDrop.PreviewDropEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting the preview drop is going to happen 
//         /// </summary>
//         protected internal virtual void OnPreviewDrop(DragEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the DragDrop.DropEvent.
//         /// </summary> 
//         public static readonly RoutedEvent DropEvent = DragDrop.DropEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting the drag enter is going to happen
//         /// </summary>
//         public event DragEventHandler Drop
//         { 
//             add { AddHandler(DragDrop.DropEvent, value, false); }
//             remove { RemoveHandler(DragDrop.DropEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting the drag enter is going to happen
//         /// </summary>
//         protected internal virtual void OnDrop(DragEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Touch.PreviewTouchDownEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent PreviewTouchDownEvent = Touch.PreviewTouchDownEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting a finger touched the screen
//         /// </summary>
//         [CustomCategory(SRID.Touch_Category)] 
//         public event EventHandler<TouchEventArgs> PreviewTouchDown
//         { 
//             add { AddHandler(Touch.PreviewTouchDownEvent, value, false); } 
//             remove { RemoveHandler(Touch.PreviewTouchDownEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting a finger touched the screen
//         /// </summary> 
//         protected internal virtual void OnPreviewTouchDown(TouchEventArgs e) {}
//  
//         /// <summary> 
//         ///     Alias to the Touch.TouchDownEvent.
//         /// </summary> 
//         public static readonly RoutedEvent TouchDownEvent = Touch.TouchDownEvent.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     Event reporting a finger touched the screen 
//         /// </summary>
//         [CustomCategory(SRID.Touch_Category)] 
//         public event EventHandler<TouchEventArgs> TouchDown 
//         {
//             add { AddHandler(Touch.TouchDownEvent, value, false); } 
//             remove { RemoveHandler(Touch.TouchDownEvent, value); }
//         }
//
//         /// <summary> 
//         ///     Virtual method reporting a finger touched the screen
//         /// </summary> 
//         protected internal virtual void OnTouchDown(TouchEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Touch.PreviewTouchMoveEvent.
//         /// </summary>
//         public static readonly RoutedEvent PreviewTouchMoveEvent = Touch.PreviewTouchMoveEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting a finger moved across the screen 
//         /// </summary> 
//         [CustomCategory(SRID.Touch_Category)]
//         public event EventHandler<TouchEventArgs> PreviewTouchMove 
//         {
//             add { AddHandler(Touch.PreviewTouchMoveEvent, value, false); }
//             remove { RemoveHandler(Touch.PreviewTouchMoveEvent, value); }
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting a finger moved across the screen 
//         /// </summary>
//         protected internal virtual void OnPreviewTouchMove(TouchEventArgs e) {} 
//
//         /// <summary>
//         ///     Alias to the Touch.TouchMoveEvent.
//         /// </summary> 
//         public static readonly RoutedEvent TouchMoveEvent = Touch.TouchMoveEvent.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     Event reporting a finger moved across the screen
//         /// </summary> 
//         [CustomCategory(SRID.Touch_Category)]
//         public event EventHandler<TouchEventArgs> TouchMove
//         {
//             add { AddHandler(Touch.TouchMoveEvent, value, false); } 
//             remove { RemoveHandler(Touch.TouchMoveEvent, value); }
//         } 
//  
//         /// <summary>
//         ///     Virtual method reporting a finger moved across the screen 
//         /// </summary>
//         protected internal virtual void OnTouchMove(TouchEventArgs e) {}
//
//         /// <summary> 
//         ///     Alias to the Touch.PreviewTouchUpEvent.
//         /// </summary> 
//         public static readonly RoutedEvent PreviewTouchUpEvent = Touch.PreviewTouchUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a finger lifted off the screen
//         /// </summary>
//         [CustomCategory(SRID.Touch_Category)]
//         public event EventHandler<TouchEventArgs> PreviewTouchUp 
//         {
//             add { AddHandler(Touch.PreviewTouchUpEvent, value, false); } 
//             remove { RemoveHandler(Touch.PreviewTouchUpEvent, value); } 
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting a finger lifted off the screen
//         /// </summary>
//         protected internal virtual void OnPreviewTouchUp(TouchEventArgs e) {} 
//
//         /// <summary> 
//         ///     Alias to the Touch.TouchUpEvent. 
//         /// </summary>
//         public static readonly RoutedEvent TouchUpEvent = Touch.TouchUpEvent.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     Event reporting a finger lifted off the screen
//         /// </summary> 
//         public event EventHandler<TouchEventArgs> TouchUp 
//         { 
//             add { AddHandler(Touch.TouchUpEvent, value, false); }
//             remove { RemoveHandler(Touch.TouchUpEvent, value); } 
//         }
//
//         /// <summary>
//         ///     Virtual method reporting a finger lifted off the screen 
//         /// </summary>
//         protected internal virtual void OnTouchUp(TouchEventArgs e) {} 
//  
//         /// <summary>
//         ///     Alias to the Touch.GotTouchCaptureEvent. 
//         /// </summary>
//         public static readonly RoutedEvent GotTouchCaptureEvent = Touch.GotTouchCaptureEvent.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     Event reporting a finger was captured to an element
//         /// </summary> 
//         public event EventHandler<TouchEventArgs> GotTouchCapture
//         { 
//             add { AddHandler(Touch.GotTouchCaptureEvent, value, false); }
//             remove { RemoveHandler(Touch.GotTouchCaptureEvent, value); }
//         }
//  
//         /// <summary>
//         ///     Virtual method reporting a finger was captured to an element 
//         /// </summary> 
//         protected internal virtual void OnGotTouchCapture(TouchEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Touch.LostTouchCaptureEvent.
//         /// </summary>
//         public static readonly RoutedEvent LostTouchCaptureEvent = Touch.LostTouchCaptureEvent.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     Event reporting a finger is no longer captured to an element 
//         /// </summary>
//         public event EventHandler<TouchEventArgs> LostTouchCapture
//         {
//             add { AddHandler(Touch.LostTouchCaptureEvent, value, false); }
//             remove { RemoveHandler(Touch.LostTouchCaptureEvent, value); } 
//         }
//  
//         /// <summary> 
//         ///     Virtual method reporting a finger is no longer captured to an element
//         /// </summary> 
//         protected internal virtual void OnLostTouchCapture(TouchEventArgs e) {}
//
//         /// <summary>
//         ///     Alias to the Touch.TouchEnterEvent. 
//         /// </summary>
//         public static readonly RoutedEvent TouchEnterEvent = Touch.TouchEnterEvent.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     Event reporting the mouse entered this element 
//         /// </summary>
//         public event EventHandler<TouchEventArgs> TouchEnter
//         { 
//             add { AddHandler(Touch.TouchEnterEvent, value, false); }
//             remove { RemoveHandler(Touch.TouchEnterEvent, value); } 
//         } 
//
//         /// <summary> 
//         ///     Virtual method reporting the mouse entered this element
//         /// </summary>
//         protected internal virtual void OnTouchEnter(TouchEventArgs e) {}
//  
//         /// <summary>
//         ///     Alias to the Touch.TouchLeaveEvent. 
//         /// </summary> 
//         public static readonly RoutedEvent TouchLeaveEvent = Touch.TouchLeaveEvent.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     Event reporting the mouse left this element
//         /// </summary>
//         public event EventHandler<TouchEventArgs> TouchLeave
//         { 
//             add { AddHandler(Touch.TouchLeaveEvent, value, false); } 
//             remove { RemoveHandler(Touch.TouchLeaveEvent, value); }
//         } 
//
//         /// <summary>
//         ///     Virtual method reporting the mouse left this element
//         /// </summary> 
//         protected internal virtual void OnTouchLeave(TouchEventArgs e) {}
//  
//         /// <summary> 
//         ///     The dependency property for the IsMouseDirectlyOver property.
//         /// </summary> 
//         public static readonly DependencyProperty IsMouseDirectlyOverProperty = UIElement.IsMouseDirectlyOverProperty.AddOwner(_typeofThis);
//
//         private static void IsMouseDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
//         { 
//             ((ContentElement) d).RaiseIsMouseDirectlyOverChanged(e);
//         } 
//  
//         /// <summary>
//         ///     An event reporting that the IsMouseDirectlyOver property changed. 
//         /// </summary>
//         public event DependencyPropertyChangedEventHandler IsMouseDirectlyOverChanged
//         {
//             add    { EventHandlersStoreAdd(UIElement.IsMouseDirectlyOverChangedKey, value); } 
//             remove { EventHandlersStoreRemove(UIElement.IsMouseDirectlyOverChangedKey, value); }
//         } 
//  
//         /// <summary>
//         ///     An event reporting that the IsMouseDirectlyOver property changed. 
//         /// </summary>
//         protected virtual void OnIsMouseDirectlyOverChanged(DependencyPropertyChangedEventArgs e)
//         {
//         } 
//
//         private void RaiseIsMouseDirectlyOverChanged(DependencyPropertyChangedEventArgs args) 
//         { 
//             // Call the virtual method first.
//             OnIsMouseDirectlyOverChanged(args); 
//
//             // Raise the public event second.
//             RaiseDependencyPropertyChanged(UIElement.IsMouseDirectlyOverChangedKey, args);
//         } 
//
//         /// <summary> 
//         ///     The dependency property for the IsMouseOver property. 
//         /// </summary>
//         public static readonly DependencyProperty IsMouseOverProperty = UIElement.IsMouseOverProperty.AddOwner(_typeofThis); 
//
//         /// <summary>
//         ///     The dependency property for the IsStylusOver property.
//         /// </summary> 
//         public static readonly DependencyProperty IsStylusOverProperty = UIElement.IsStylusOverProperty.AddOwner(_typeofThis);
//  
//         /// <summary> 
//         ///     The dependency property for the IsKeyboardFocusWithin property.
//         /// </summary> 
//         public static readonly DependencyProperty IsKeyboardFocusWithinProperty = UIElement.IsKeyboardFocusWithinProperty.AddOwner(_typeofThis);
//
//         /// <summary>
//         ///     An event reporting that the IsKeyboardFocusWithin property changed. 
//         /// </summary>
//         public event DependencyPropertyChangedEventHandler IsKeyboardFocusWithinChanged 
//         { 
//             add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusWithinChangedKey, value); }
//             remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusWithinChangedKey, value); } 
//         }
//
//         /// <summary>
//         ///     An event reporting that the IsKeyboardFocusWithin property changed. 
//         /// </summary>
//         protected virtual void OnIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs e) 
//         { 
//         }
//  
//         internal void RaiseIsKeyboardFocusWithinChanged(DependencyPropertyChangedEventArgs args)
//         {
//             // Call the virtual method first.
//             OnIsKeyboardFocusWithinChanged(args); 
//
//             // Raise the public event second. 
//             RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusWithinChangedKey, args); 
//         }
//  
//         /// <summary>
//         ///     The dependency property for the IsMouseCaptured property.
//         /// </summary>
//         public static readonly DependencyProperty IsMouseCapturedProperty = UIElement.IsMouseCapturedProperty.AddOwner(_typeofThis); 
//
//         private static void IsMouseCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
//         { 
//             ((ContentElement) d).RaiseIsMouseCapturedChanged(e);
//         } 
//
//         /// <summary>
//         ///     An event reporting that the IsMouseCaptured property changed.
//         /// </summary> 
//         public event DependencyPropertyChangedEventHandler IsMouseCapturedChanged
//         { 
//             add    { EventHandlersStoreAdd(UIElement.IsMouseCapturedChangedKey, value); } 
//             remove { EventHandlersStoreRemove(UIElement.IsMouseCapturedChangedKey, value); }
//         } 
//
//         /// <summary>
//         ///     An event reporting that the IsMouseCaptured property changed.
//         /// </summary> 
//         protected virtual void OnIsMouseCapturedChanged(DependencyPropertyChangedEventArgs e)
//         { 
//         } 
//
//         private void RaiseIsMouseCapturedChanged(DependencyPropertyChangedEventArgs args) 
//         {
//             // Call the virtual method first.
//             OnIsMouseCapturedChanged(args);
//  
//             // Raise the public event second.
//             RaiseDependencyPropertyChanged(UIElement.IsMouseCapturedChangedKey, args); 
//         } 
//
//         /// <summary> 
//         ///     The dependency property for the IsMouseCaptureWithin property.
//         /// </summary>
//         public static readonly DependencyProperty IsMouseCaptureWithinProperty = UIElement.IsMouseCaptureWithinProperty.AddOwner(_typeofThis);
//  
//         /// <summary>
//         ///     An event reporting that the IsMouseCaptureWithin property changed. 
//         /// </summary> 
//         public event DependencyPropertyChangedEventHandler IsMouseCaptureWithinChanged
//         { 
//             add    { EventHandlersStoreAdd(UIElement.IsMouseCaptureWithinChangedKey, value); }
//             remove { EventHandlersStoreRemove(UIElement.IsMouseCaptureWithinChangedKey, value); }
//         }
//  
//         /// <summary>
//         ///     An event reporting that the IsMouseCaptureWithin property changed. 
//         /// </summary> 
//         protected virtual void OnIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs e)
//         { 
//         }
//
//         internal void RaiseIsMouseCaptureWithinChanged(DependencyPropertyChangedEventArgs args)
//         { 
//             // Call the virtual method first.
//             OnIsMouseCaptureWithinChanged(args); 
//  
//             // Raise the public event second.
//             RaiseDependencyPropertyChanged(UIElement.IsMouseCaptureWithinChangedKey, args); 
//         }
//
//         /// <summary>
//         ///     The dependency property for the IsStylusDirectlyOver property. 
//         /// </summary>
//         public static readonly DependencyProperty IsStylusDirectlyOverProperty = UIElement.IsStylusDirectlyOverProperty.AddOwner(_typeofThis); 
//  
//         private static void IsStylusDirectlyOver_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e)
//         { 
//             ((ContentElement) d).RaiseIsStylusDirectlyOverChanged(e);
//         }
//
//         /// <summary> 
//         ///     An event reporting that the IsStylusDirectlyOver property changed.
//         /// </summary> 
//         public event DependencyPropertyChangedEventHandler IsStylusDirectlyOverChanged 
//         {
//             add    { EventHandlersStoreAdd(UIElement.IsStylusDirectlyOverChangedKey, value); } 
//             remove { EventHandlersStoreRemove(UIElement.IsStylusDirectlyOverChangedKey, value); }
//         }
//
//         /// <summary> 
//         ///     An event reporting that the IsStylusDirectlyOver property changed.
//         /// </summary> 
//         protected virtual void OnIsStylusDirectlyOverChanged(DependencyPropertyChangedEventArgs e) 
//         {
//         } 
//
//         private void RaiseIsStylusDirectlyOverChanged(DependencyPropertyChangedEventArgs args)
//         {
//             // Call the virtual method first. 
//             OnIsStylusDirectlyOverChanged(args);
//  
//             // Raise the public event second. 
//             RaiseDependencyPropertyChanged(UIElement.IsStylusDirectlyOverChangedKey, args);
//         } 
//
//         /// <summary>
//         ///     The dependency property for the IsStylusCaptured property.
//         /// </summary> 
//         public static readonly DependencyProperty IsStylusCapturedProperty = UIElement.IsStylusCapturedProperty.AddOwner(_typeofThis);
//  
//         private static void IsStylusCaptured_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
//         {
//             ((ContentElement) d).RaiseIsStylusCapturedChanged(e); 
//         }
//
//         /// <summary>
//         ///     An event reporting that the IsStylusCaptured property changed. 
//         /// </summary>
//         public event DependencyPropertyChangedEventHandler IsStylusCapturedChanged 
//         { 
//             add    { EventHandlersStoreAdd(UIElement.IsStylusCapturedChangedKey, value); }
//             remove { EventHandlersStoreRemove(UIElement.IsStylusCapturedChangedKey, value); } 
//         }
//
//         /// <summary>
//         ///     An event reporting that the IsStylusCaptured property changed. 
//         /// </summary>
//         protected virtual void OnIsStylusCapturedChanged(DependencyPropertyChangedEventArgs e) 
//         { 
//         }
//  
//         private void RaiseIsStylusCapturedChanged(DependencyPropertyChangedEventArgs args)
//         {
//             // Call the virtual method first.
//             OnIsStylusCapturedChanged(args); 
//
//             // Raise the public event second. 
//             RaiseDependencyPropertyChanged(UIElement.IsStylusCapturedChangedKey, args); 
//         }
//  
//         /// <summary>
//         ///     The dependency property for the IsStylusCaptureWithin property.
//         /// </summary>
//         public static readonly DependencyProperty IsStylusCaptureWithinProperty = UIElement.IsStylusCaptureWithinProperty.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     An event reporting that the IsStylusCaptureWithin property changed. 
//         /// </summary>
//         public event DependencyPropertyChangedEventHandler IsStylusCaptureWithinChanged 
//         {
//             add    { EventHandlersStoreAdd(UIElement.IsStylusCaptureWithinChangedKey, value); }
//             remove { EventHandlersStoreRemove(UIElement.IsStylusCaptureWithinChangedKey, value); }
//         } 
//
//         /// <summary> 
//         ///     An event reporting that the IsStylusCaptureWithin property changed. 
//         /// </summary>
//         protected virtual void OnIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs e) 
//         {
//         }
//
//         internal void RaiseIsStylusCaptureWithinChanged(DependencyPropertyChangedEventArgs args) 
//         {
//             // Call the virtual method first. 
//             OnIsStylusCaptureWithinChanged(args); 
//
//             // Raise the public event second. 
//             RaiseDependencyPropertyChanged(UIElement.IsStylusCaptureWithinChangedKey, args);
//         }
//
//         /// <summary> 
//         ///     The dependency property for the IsKeyboardFocused property.
//         /// </summary> 
//         public static readonly DependencyProperty IsKeyboardFocusedProperty = UIElement.IsKeyboardFocusedProperty.AddOwner(_typeofThis); 
//
//         private static void IsKeyboardFocused_Changed(DependencyObject d, DependencyPropertyChangedEventArgs e) 
//         {
//             ((ContentElement) d).RaiseIsKeyboardFocusedChanged(e);
//         }
//  
//         /// <summary>
//         ///     An event reporting that the IsKeyboardFocused property changed. 
//         /// </summary> 
//         public event DependencyPropertyChangedEventHandler IsKeyboardFocusedChanged
//         { 
//             add    { EventHandlersStoreAdd(UIElement.IsKeyboardFocusedChangedKey, value); }
//             remove { EventHandlersStoreRemove(UIElement.IsKeyboardFocusedChangedKey, value); }
//         }
//  
//         /// <summary>
//         ///     An event reporting that the IsKeyboardFocused property changed. 
//         /// </summary> 
//         protected virtual void OnIsKeyboardFocusedChanged(DependencyPropertyChangedEventArgs e)
//         { 
//         }
//
//         private void RaiseIsKeyboardFocusedChanged(DependencyPropertyChangedEventArgs args)
//         { 
//             // Call the virtual method first.
//             OnIsKeyboardFocusedChanged(args); 
//  
//             // Raise the public event second.
//             RaiseDependencyPropertyChanged(UIElement.IsKeyboardFocusedChangedKey, args); 
//         }
//
//         /// <summary>
//         ///     The dependency property for the AreAnyTouchesDirectlyOver property. 
//         /// </summary>
//         public static readonly DependencyProperty AreAnyTouchesDirectlyOverProperty = UIElement.AreAnyTouchesDirectlyOverProperty.AddOwner(_typeofThis); 
//  
//         /// <summary>
//         ///     The dependency property for the AreAnyTouchesOver property. 
//         /// </summary>
//         public static readonly DependencyProperty AreAnyTouchesOverProperty = UIElement.AreAnyTouchesOverProperty.AddOwner(_typeofThis);
//
//         /// <summary> 
//         ///     The dependency property for the AreAnyTouchesCaptured property.
//         /// </summary> 
//         public static readonly DependencyProperty AreAnyTouchesCapturedProperty = UIElement.AreAnyTouchesCapturedProperty.AddOwner(_typeofThis); 
//
//         /// <summary> 
//         ///     The dependency property for the AreAnyTouchesCapturedWithin property.
//         /// </summary>
//         public static readonly DependencyProperty AreAnyTouchesCapturedWithinProperty = UIElement.AreAnyTouchesCapturedWithinProperty.AddOwner(_typeofThis);
//  
//         internal bool ReadFlag(CoreFlags field)
//         { 
//             return (_flags & field) != 0; 
//         }
//  
//         internal void WriteFlag(CoreFlags field,bool value)
//         {
//             if (value)
//             { 
//                  _flags |= field;
//             } 
//             else 
//             {
//                  _flags &= (~field); 
//             }
//         }
//
//         private CoreFlags       _flags; 
//    	
//        /// <summary>
//        ///     Static Constructor for ContentElement 
//        /// </summary> 
//        /// <SecurityNote>
//        ///     Critical: This hooks up a bunch of thunks which are all critical since they 
//        ///     can be used to spoof input
//        ///     TreatAsSafe: Since it does not expose the thunks
//        /// </SecurityNote>
//        static ContentElement()
//        { 
//            UIElement.RegisterEvents(typeof(ContentElement)); 
//            RegisterProperties();
// 
//            UIElement.IsFocusedPropertyKey.OverrideMetadata(
//                typeof(ContentElement),
//                new PropertyMetadata(
//                    BooleanBoxes.FalseBox, // default value 
//                    new PropertyChangedCallback(IsFocused_Changed)));
//        } 
//
//        /// <summary>
//        ///     A property indicating if the stylus is over this element or not. 
//        /// </summary>
//        public bool IsStylusOver 
//        { 
//            get
//            { 
//                return ReadFlag(CoreFlags.IsStylusOverCache);
//            }
//        }
//
//        /// <summary> 
//        ///     A property indicating if the stylus is over this element or not.
//        /// </summary>
//        public bool IsStylusDirectlyOver
//        { 
//            get
//            { 
//                // We do not return the cached value of reverse-inherited seed properties. 
//                //
//                // The cached value is only used internally to detect a "change". 
//                //
//                // More Info:
//                // The act of invalidating the seed property of a reverse-inherited property
//                // on the first side of the path causes the invalidation of the 
//                // reverse-inherited properties on both sides.  The input system has not yet
//                // invalidated the seed property on the second side, so its cached value can 
//                // be incorrect. 
//                //
//                return IsStylusDirectlyOver_ComputeValue(); 
//            }
//        }
//
//        private bool IsStylusDirectlyOver_ComputeValue() 
//        {
//            return (Stylus.DirectlyOver == this); 
//        } 
//
//        /// <summary> 
//        ///     A property indicating if the stylus is captured to this element or not.
//        /// </summary>
//        public bool IsStylusCaptured
//        { 
//            get { return (bool) GetValue(IsStylusCapturedProperty); }
//        } 
//
//        /// <summary> 
//        ///     Indicates if stylus capture is anywhere within in the subtree 
//        ///     starting at the current instance
//        /// </summary> 
//        public bool IsStylusCaptureWithin
//        {
//            get
//            { 
//                return ReadFlag(CoreFlags.IsStylusCaptureWithinCache);
//            } 
//        } 
//
//        /// <summary> 
//        ///     GotFocus event 
//        /// </summary>
//        public static readonly RoutedEvent GotFocusEvent = FocusManager.GotFocusEvent.AddOwner(typeof(ContentElement)); 
//
//        /// <summary>
//        ///     An event announcing that IsFocused changed to true.
//        /// </summary> 
//        public event RoutedEventHandler GotFocus
//        { 
//            add { AddHandler(GotFocusEvent, value); } 
//            remove { RemoveHandler(GotFocusEvent, value); }
//        } 
//
//        /// <summary>
//        ///     LostFocus event
//        /// </summary> 
//        public static readonly RoutedEvent LostFocusEvent = FocusManager.LostFocusEvent.AddOwner(typeof(ContentElement));
// 
//        /// <summary> 
//        ///     An event announcing that IsFocused changed to false.
//        /// </summary> 
//        public event RoutedEventHandler LostFocus
//        {
//            add { AddHandler(LostFocusEvent, value); }
//            remove { RemoveHandler(LostFocusEvent, value); } 
//        }
// 
//        /// <summary>
//        ///     IsEnabledChanged event 
//        /// </summary> 
//        public event DependencyPropertyChangedEventHandler IsEnabledChanged
//        { 
//            add { EventHandlersStoreAdd(UIElement.IsEnabledChangedKey, value); }
//            remove { EventHandlersStoreRemove(UIElement.IsEnabledChangedKey, value); }
//        }
//
//        /// <summary>
//        ///     FocusableChanged event 
//        /// </summary>
//        public event DependencyPropertyChangedEventHandler FocusableChanged 
//        { 
//            add {EventHandlersStoreAdd(UIElement.FocusableChangedKey, value);}
//            remove {EventHandlersStoreRemove(UIElement.FocusableChangedKey, value);} 
//        }
//
//        /// <summary> 
//        ///     A property indicating if the inptu method is enabled. 
//        /// </summary>
//        public bool IsInputMethodEnabled 
//        {
//            get { return (bool) GetValue(InputMethod.IsInputMethodEnabledProperty); }
//        }
//
//        /// <summary>
//        ///     A property indicating if any touch devices are over this element or not.
//        /// </summary>
//        public bool AreAnyTouchesOver 
//        {
//            get { return ReadFlag(CoreFlags.TouchesOverCache); } 
//        } 
//
//        /// <summary> 
//        ///     A property indicating if any touch devices are directly over this element or not.
//        /// </summary>
//        public bool AreAnyTouchesDirectlyOver
//        { 
//            get { return (bool)GetValue(AreAnyTouchesDirectlyOverProperty); }
//        } 
// 
//        /// <summary>
//        ///     A property indicating if any touch devices are captured to elements in this subtree. 
//        /// </summary>
//        public bool AreAnyTouchesCapturedWithin
//        {
//            get { return ReadFlag(CoreFlags.TouchesCapturedWithinCache); } 
//        }
// 
//        /// <summary> 
//        ///     A property indicating if any touch devices are captured to this element.
//        /// </summary> 
//        public bool AreAnyTouchesCaptured
//        {
//            get { return (bool)GetValue(AreAnyTouchesCapturedProperty); }
//        } 
//
//        /// <summary> 
//        ///     Captures the specified device to this element. 
//        /// </summary>
//        /// <param name="touchDevice">The touch device to capture.</param> 
//        /// <returns>True if capture was taken.</returns>
//        public bool CaptureTouch(TouchDevice touchDevice)
//        {
//            if (touchDevice == null) 
//            {
//                throw new ArgumentNullException("touchDevice"); 
//            } 
//
//            return touchDevice.Capture(this); 
//        }
//
//        /// <summary>
//        ///     Releases capture from the specified touch device. 
//        /// </summary>
//        /// <param name="touchDevice">The device that is captured to this element.</param> 
//        /// <returns>true if capture was released, false otherwise.</returns> 
//        public bool ReleaseTouchCapture(TouchDevice touchDevice)
//        { 
//            if (touchDevice == null)
//            {
//                throw new ArgumentNullException("touchDevice");
//            } 
//
//            if (touchDevice.Captured == this) 
//            { 
//                touchDevice.Capture(null);
//                return true; 
//            }
//            else
//            {
//                return false; 
//            }
//        } 
// 
//        /// <summary>
//        ///     Releases capture on any touch devices captured to this element. 
//        /// </summary>
//        public void ReleaseAllTouchCaptures()
//        {
//            TouchDevice.ReleaseAllCaptures(this); 
//        }
// 
//        /// <summary> 
//        ///     The touch devices captured to this element.
//        /// </summary> 
//        public IEnumerable<TouchDevice> TouchesCaptured
//        {
//            get
//            { 
//                return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ false);
//            } 
//        } 
//
//        /// <summary> 
//        ///     The touch devices captured to this element and any elements in the subtree.
//        /// </summary>
//        public IEnumerable<TouchDevice> TouchesCapturedWithin
//        { 
//            get
//            { 
//                return TouchDevice.GetCapturedTouches(this, /* includeWithin = */ true); 
//            }
//        } 
//
//        /// <summary>
//        ///     The touch devices which are over this element and any elements in the subtree.
//        ///     This is particularly relevant to elements which dont take capture (like Label). 
//        /// </summary>
//        public IEnumerable<TouchDevice> TouchesOver 
//        { 
//            get
//            { 
//                return TouchDevice.GetTouchesOver(this, /* includeWithin = */ true);
//            }
//        }
// 
//        /// <summary>
//        ///     The touch devices which are directly over this element. 
//        ///     This is particularly relevant to elements which dont take capture (like Label). 
//        /// </summary>
//        public IEnumerable<TouchDevice> TouchesDirectlyOver 
//        {
//            get
//            {
//                return TouchDevice.GetTouchesOver(this, /* includeWithin = */ false); 
//            }
//        } 
// 
//        internal DependencyObject _parent; 
//
//
// 
//   	 	static private readonly Type _typeofThis = typeof(ContentElement); 
//        // Caches the ContentElement's DependencyObjectType
//        private static DependencyObjectType ContentElementType = DependencyObjectType.FromSystemTypeInternal(typeof(ContentElement)); 


