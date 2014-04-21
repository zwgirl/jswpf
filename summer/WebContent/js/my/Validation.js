/**
 * Validation
 */

define(["dojo/_base/declare", "system/Type",
        "windows/FrameworkPropertyMetadata", "windows/FrameworkPropertyMetadataOptions", "windows/ControlTemplate"], 
        function(declare, Type,
        		FrameworkPropertyMetadata, FrameworkPropertyMetadataOptions, ControlTemplate){
	var Validation = declare("Validation", null,{
		constructor:function( ){

		}
	});
	
	var _ErrorEvent =null;
	var _ErrorsPropertyKey = null
	var _ValidationErrorsInternalProperty =null;
	var _HasErrorPropertyKey = null;
	var _ErrorTemplateProperty = null;
	var _ValidationAdornerSiteProperty = null;
	var _ValidationAdornerSiteForProperty = null;
	var __ValidationAdornerProperty = null;
	
	Object.defineProperties(Validation, {
		ErrorEvent:
		{
			get:function(){
				if(_ErrorEvent == null){
					_ErrorEvent = EventManager.RegisterRoutedEvent("ValidationError",
                            RoutingStrategy.Bubble,
                            EventHandler.Type/*<ValidationErrorEventArgs>*/, 
                            Validation.Type);
				}
				
				return _ErrorEvent;
			}
		},
		
		  /// <summary>
	    ///     The key needed to set the publicly read-only ValidationErrors property.
	    /// </summary>
	    ErrorsPropertyKey:
	    {
	    	get:function(){
		    	if(_ErrorsPropertyKey == null){
		    		_ErrorsPropertyKey = DependencyProperty.RegisterAttachedReadOnly("Errors",
	                        ReadOnlyObservableCollection.Type/*<ValidationError>)*/, Validation.Type, 
	                        FrameworkPropertyMetadata.Build2( 
	                                ValidationErrorCollection.Empty,
	                                FrameworkPropertyMetadataOptions.NotDataBindable)); 
		    	}
		    	
		    	return _ErrorsPropertyKey; 
	    	}
	    },
	    
	    /// <summary>
	    ///     ValidationErrors DependencyProperty.
	    ///     holds the list of all active validation errors of any data binding targeting the hosting element. 
	    /// </summary>
	    /// <remarks> 
	    ///     The application cannot modify the content of this collection. 
	    /// </remarks>
	    Errors :{
	    	get : function(){
	    		return ErrorsPropertyKey.DependencyProperty;
	    	}
	    },
	            
	    /// <summary> 
	    ///     holds the internally modifiable collection of validation errors.
	    /// </summary> 
	    ValidationErrorsInternal:{
	    	get:function(){
	    		if(_ValidationErrorsInternalProperty){
	    			    	_ValidationErrorsInternalProperty = DependencyProperty.RegisterAttached("ErrorsInternal",
	                    ValidationErrorCollection.Type, Validation.Type,
	                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
	                            /*(ValidationErrorCollection)*/null,
	                            new PropertyChangedCallback(OnErrorsInternalChanged))); 
	    		}
	    		return _ValidationErrorsInternalProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     The key needed set a read-only property.
	    /// </summary> 
	    HasErrorPropertyKey:
	    {
	    	get:function(){
	    		if(_HasErrorPropertyKey == null){
	    			_HasErrorPropertyKey = DependencyProperty.RegisterAttachedReadOnly("HasError", 
		                    Boolean.Type, Validation.Type, 
		                    FrameworkPropertyMetadata.Build3PCCB(
		                            BooleanBoxes.FalseBox, 
		                            FrameworkPropertyMetadataOptions.NotDataBindable,
		                            OnHasErrorChanged));
	    		}
	            
	    		return _HasErrorPropertyKey;
	    	}
	    },
	    
	    /// <summary>
	    ///     HasError DependencyProperty is true if any binding on the target element 
	    ///     has a validation error.
	    /// </summary>
	    HasError : {
	    	get:function(){
	    		return HasErrorPropertyKey.DependencyProperty; 
	    	}
	    },
	    
	    /// <summary> 
	    ///     Template used to generate validation error feedback on the AdornerLayer.  Default
	    ///     Template is: 
	    /// <code>
	    ///     <Border BorderThickness="1" BorderBrush="Red">
	    ///        <AdornedElementPlaceholder/>
	    ///     </Border> 
	    /// </code>
	    /// </summary> 
	    ErrorTemplate:
	    {
	    	get:function(){
	    		if(_ErrorTemplateProperty == null){
	    			_ErrorTemplateProperty = DependencyProperty.RegisterAttached("ErrorTemplate",
	                        ControlTemplate.Type, Validation.Type, 
	                        FrameworkPropertyMetadata.Build3PCCB(
	                            CreateDefaultErrorTemplate(),
	                            FrameworkPropertyMetadataOptions.NotDataBindable,
	                            new PropertyChangedCallback(OnErrorTemplateChanged)));
	    		}
	    		return _ErrorTemplateProperty;
	    	}

	    },
	    
	    /// <summary> 
	    ///     Designates the alternative element to which validation feedback 
	    ///     should be directed.
	    /// </summary> 
	    ValidationAdornerSite:
	    {
	    	get:function(){
		    	if(_ValidationAdornerSiteProperty == null){
		    		_ValidationAdornerSiteProperty = DependencyProperty.RegisterAttached("ValidationAdornerSite",
		                        DependencyObject.Type, Validation.Type,
		                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(DependencyObject)*/null, 
		                                                   new PropertyChangedCallback(OnValidationAdornerSiteChanged)));
		    	}
		    	
		    	return _ValidationAdornerSiteProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     Designates the element for which the current element should serve
	    ///     as the ValidationAdornerSite. 
	    /// </summary>
	    ValidationAdornerSiteFor:
	    {
	    	get:function(){
		    	if(_ValidationAdornerSiteForProperty == null) {
		            _ValidationAdornerSiteForProperty = DependencyProperty.RegisterAttached("ValidationAdornerSiteFor", 
		                        DependencyObject.Type, Validation.Type,
		                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(DependencyObject)*/null, 
		                                                    new PropertyChangedCallback(OnValidationAdornerSiteForChanged)));
		    	}
		    	return _ValidationAdornerSiteForProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     Reference to the ValidationAdorner 
	    /// </summary> 
	    ValidationAdorner:
	    {
	    	get:function(){
		    	if(_ValidationAdornerProperty == null){
		    		_ValidationAdornerProperty = DependencyProperty.RegisterAttached("ValidationAdorner", 
		                    TemplatedAdorner.Type, Validation.Type,
		                    FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.NotDataBindable));
		    	}
		    	
		    	return _ValidationAdornerProperty;
	    	}
	    }

	});
	
    /// <summary>
    ///     Adds a handler for the ValidationError attached event 
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be added</param>
	Validation.AddErrorHandler = function(/*DependencyObject*/ element, /*EventHandler<ValidationErrorEventArgs>*/ handler) 
    {
        FrameworkElement.AddHandler(element, Validation.ErrorEvent, handler); 
    };

    /// <summary> 
    ///     Removes a handler for the ValidationError attached event
    /// </summary>
    /// <param name="element">UIElement or ContentElement that listens to this event</param>
    /// <param name="handler">Event Handler to be removed</param> 
    Validation.RemoveErrorHandler = function(/*DependencyObject*/ element, /*EventHandler<ValidationErrorEventArgs>*/ handler)
    { 
        FrameworkElement.RemoveHandler(element, Validation.ErrorEvent, handler); 
    }

  

    /// <summary> Static accessor for Validation.Errors property </summary>
    /// <remarks> 
    ///     The application cannot modify the content of this collection.
    /// </remarks> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
    Validation.GetErrors = function(/*DependencyObject*/ element)
    { 
        if (element == null)
            throw new Error('ArgumentNullException("element")');

        return /*(ReadOnlyObservableCollection<ValidationError>)*/ element.GetValue(Validation.ErrorsProperty); 
    };



    // Update HasErrors and Invalidate the public ValidationErrors property whose GetOverride will return
    // the updated value of ValidationErrorsInternal, nicely wrapped into a ReadOnlyCollection<T> 
    function OnErrorsInternalChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    {
        var newErrors = e.NewValue instanceof ValidationErrorCollection ? e.NewValue : null;

        if (newErrors != null)
        { 
            d.SetValue(ErrorsPropertyKey, new ReadOnlyObservableCollection/*<ValidationError>*/(newErrors)); 
        }
        else 
        {
            d.ClearValue(Validation.ErrorsPropertyKey);
        }
    } 

    Validation.GetErrorsInternal = function(/*DependencyObject*/ target) 
    { 
        return /*(ValidationErrorCollection)*/ target.GetValue(Validation.ValidationErrorsInternalProperty);
    };




    // This is a workaround to notify the Control because if we try to override
    // metadata to have the control hook it's own property change handler 
    // it introduces a strange ordering of static constructors when not ngened. 
    function OnHasErrorChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        var control = d instanceof Control ? d : null;
        if (control != null)
        {
            Control.OnVisualStatePropertyChanged(control, e); 
        }
    } 



    /// <summary> Static accessor for HasError property </summary> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
    Validation.GetHasError = function(/*DependencyObject*/ element)
    { 
        if (element == null)
            throw new Error('ArgumentNullException("element")');

        return /*(bool)*/ element.GetValue(Validation.HasErrorProperty); 
    };

 


    /// <summary> Static accessor for ErrorTemplate property </summary> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
    Validation.GetErrorTemplate = function(/*DependencyObject*/ element)
    {
        if (element == null)
            throw new Error('ArgumentNullException("element")'); 

        var temp = element.GetValue(Validation.ErrorTemplateProperty);
        return temp instanceof ControlTemplate ? temp : null; 
    }; 

    /// <summary> Static modifier for ErrorTemplate property </summary> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
    Validation.SetErrorTemplate = function(/*DependencyObject*/ element, /*ControlTemplate*/ value)
    {
        if (element == null) 
            throw new Error('ArgumentNullException("element")');

        // (perf) don't set if the existing value is already correct 
        var oldValue = element.ReadLocalValue(Validation.ErrorTemplateProperty);
        if (!Object.Equals(oldValue, value)) 
            element.SetValue(Validation.ErrorTemplateProperty, value);
    };

    // when ErrorTemplate changes, redraw the currently visible adorner 
    function OnErrorTemplateChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        if (GetHasError(d)) 
        {
            ShowValidationAdorner(d, false); 
            ShowValidationAdorner(d, true);
        }
    }

    /// <summary> Static accessor for ValidationAdornerSite property </summary>
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
    Validation.GetValidationAdornerSite = function(/*DependencyObject*/ element)
    {
        if (element == null) 
            throw new Error('ArgumentNullException("element")');

        var temp = element.GetValue(Validation.ValidationAdornerSiteProperty);
        return  temp instanceof DependencyObject ? temp : null; 
    };

    /// <summary> Static modifier for ValidationAdornerSite property </summary>
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
    Validation.SetValidationAdornerSite = function(/*DependencyObject*/ element, /*DependencyObject*/ value)
    { 
        if (element == null)
            throw new Error('ArgumentNullException("element")'); 

        element.SetValue(Validation.ValidationAdornerSiteProperty, value);
    }; 

    // when Site property changes, update the SiteFor property on the other end
    function OnValidationAdornerSiteChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        // ignore SubPropertyChange - we don't care about properties on the site
        if (e.IsASubPropertyChange) 
            return; 

        var oldSite = /*(DependencyObject)*/e.OldValue; 
        var newSite = /*(DependencyObject)*/e.NewValue;

        if (oldSite != null)
        { 
            oldSite.ClearValue(ValidationAdornerSiteForProperty);
        } 

        if (newSite != null)
        { 
            if (d != GetValidationAdornerSiteFor(newSite))
            {
                SetValidationAdornerSiteFor(newSite, d);
            } 
        }

        // if the adorner is currently visible, move it to the new site 
        if (GetHasError(d))
        { 
            if (oldSite == null)
            {
                oldSite = d;
            } 
            ShowValidationAdornerHelper(d, oldSite, false);
            ShowValidationAdorner(d, true); 
        } 
    }





    /// <summary> Static accessor for ValidationAdornerSiteFor property </summary> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
    Validation.GetValidationAdornerSiteFor = function(/*DependencyObject*/ element) 
    {
        if (element == null) 
            throw new ArgumentNullException("element");

        var temp = element.GetValue(ValidationAdornerSiteForProperty);
        return temp instanceof DependencyObject ? temp : null;
    }; 

    /// <summary> Static modifier for ValidationAdornerSiteFor property </summary> 
    /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
    Validation.SetValidationAdornerSiteFor = function(/*DependencyObject*/ element, /*DependencyObject*/ value)
    { 
        if (element == null)
            throw new Error('ArgumentNullException("element")');

        element.SetValue(ValidationAdornerSiteForProperty, value); 
    };

    // when SiteFor property changes, update the Site property on the other end 
    function OnValidationAdornerSiteForChanged(/*DependencyObject*/ d, /*DependencyPropertyChangedEventArgs*/ e)
    { 
        // ignore SubPropertyChange - we don't care about properties on the siteFor
        if (e.IsASubPropertyChange)
            return;

        var oldSiteFor = /*(DependencyObject)*/e.OldValue;
        var newSiteFor = /*(DependencyObject)*/e.NewValue; 

        if (oldSiteFor != null)
        { 
            oldSiteFor.ClearValue(ValidationAdornerSiteProperty);
        }

        if (newSiteFor != null) 
        {
            if (d != GetValidationAdornerSite(newSiteFor)) 
            { 
                SetValidationAdornerSite(newSiteFor, d);
            } 
        }
    }


    Validation.ShowValidationAdorner = function(/*DependencyObject*/ targetElement, /*bool*/ show)
    { 
        // If the element has a VisualStateGroup for validation, then dont show the Adorner 
        // because the control will handle visualizing the error via VSM states.
        if (!HasValidationGroup(targetElement instanceof FrameworkElement ? targetElement : null)) 
        {
            // redirect the adorner to the designated site, if any
            var adornerSite = GetValidationAdornerSite(targetElement);
            if (adornerSite == null) 
            {
                adornerSite = targetElement; 
            } 

            ShowValidationAdornerHelper(targetElement, adornerSite, show); 
        }
    };


    function HasValidationGroup(/*FrameworkElement*/ fe)
    { 
        if (fe != null) 
        {
            var groups = VisualStateManager.GetVisualStateGroupsInternal(fe); 

            // the Validation group could be on either the FE or it's StateGroupRoot
            if (HasValidationGroup(groups))
            { 
                return true;
            } 

            if (fe.StateGroupsRoot != null)
            { 
                groups = VisualStateManager.GetVisualStateGroupsInternal(fe.StateGroupsRoot);
                return HasValidationGroup(groups);
            }
        } 

        return false; 
    } 

    function HasValidationGroup(/*IList<VisualStateGroup>*/ groups) 
    {
        if (groups != null)
        {
            for (var groupIndex = 0; groupIndex < groups.Count; ++groupIndex) 
            {
                var g = groups[groupIndex]; 
                if (g.Name == VisualStates.GroupValidation) 
                {
                    return true; 
                }
            }
        }

        return false;
    } 

    function ShowValidationAdornerHelper(/*DependencyObject*/ targetElement, /*DependencyObject*/ adornerSite, /*bool*/ show)
    { 
        ShowValidationAdornerHelper(targetElement, adornerSite, show, true);
    }

    function ShowValidationAdornerOperation(/*object*/ arg) 
    {
        var args = /*(object[])*/arg; 
        var targetElement = /*(DependencyObject)*/args[0]; 
        var adornerSite = /*(DependencyObject)*/args[1];
        var show = /*(bool)*/args[2]; 

        ShowValidationAdornerHelper(targetElement, adornerSite, show, false);

        return null; 
    }

    function ShowValidationAdornerHelper(/*DependencyObject*/ targetElement, 
    		/*DependencyObject*/ adornerSite, /*bool*/ show, /*bool*/ tryAgain) 
    {
        var siteUIElement = adornerSite instanceof UIElement ? adornerSite : null; 

        if (siteUIElement != null)
        {
            var adornerLayer = AdornerLayer.GetAdornerLayer(siteUIElement); 

            if (adornerLayer == null) 
            { 
                if (tryAgain)
                { 
                    // try again later, perhaps giving layout a chance to create the adorner layer
                    adornerSite.Dispatcher.BeginInvoke(DispatcherPriority.Loaded,
                                new DispatcherOperationCallback(ShowValidationAdornerOperation),
                                [targetElement, adornerSite, show]); 
                }
                return; 
            } 

            var validationAdorner = siteUIElement.ReadLocalValue(ValidationAdornerProperty);
            validationAdorner instanceof TemplatedAdorner ? validationAdorner : null; 

            if (show && validationAdorner == null)
            {
                // get the template from the site, or from the target element 
                var validationTemplate = GetErrorTemplate(siteUIElement);
                if (validationTemplate == null) 
                { 
                    validationTemplate = GetErrorTemplate(targetElement);
                } 

                if (validationTemplate != null)
                {
                    validationAdorner = new TemplatedAdorner(siteUIElement, validationTemplate); 
                    adornerLayer.Add(validationAdorner);

                    siteUIElement.SetValue(ValidationAdornerProperty, validationAdorner); 
                }
            } 
            else if (!show && validationAdorner != null)
            {
                validationAdorner.ClearChild();
                adornerLayer.Remove(validationAdorner); 
                siteUIElement.ClearValue(ValidationAdornerProperty);
            } 
        } 
    }


    /// <summary>
    /// Mark this BindingExpression as invalid.  If the BindingExpression has been
    /// explicitly marked invalid in this way, then it will remain 
    /// invalid until ClearInvalid is called or another transfer to the source validates successfully.
    /// </summary> 
    Validation.MarkInvalid = function(/*BindingExpressionBase*/ bindingExpression, /*ValidationError*/ validationError) 
    {
        if (bindingExpression == null) 
            throw new Error('ArgumentNullException("bindingExpression")');
        if (validationError == null)
            throw new new Error('ArgumentNullException("validationError")');

        bindingExpression.UpdateValidationError(validationError);
    };

    /// <summary>
    /// Clears the ValidationError that was set through a call 
    /// to MarkInvalid or a previously failed validation of that BindingExpression.
    /// </summary>
    Validation.ClearInvalid = function(/*BindingExpressionBase*/ bindingExpression)
    { 
        if (bindingExpression == null)
            throw new new Error('ArgumentNullException("bindingExpression")'); 
        bindingExpression.UpdateValidationError(null); 
    };

    // add a validation error to the given element
    Validation.AddValidationError = function(/*ValidationError*/ validationError, /*DependencyObject*/ targetElement, /*bool*/ shouldRaiseEvent)
    {
        if (targetElement == null) 
            return;

        var wasValid; 
        var validationErrors = GetErrorsInternal(targetElement);

        if (validationErrors == null)
        {
            wasValid = true;
            validationErrors = new ValidationErrorCollection(); 
            validationErrors.Add(validationError);
            targetElement.SetValue(Validation.ValidationErrorsInternalProperty, validationErrors); 
        } 
        else
        { 
            wasValid = (validationErrors.Count == 0);
            validationErrors.Add(validationError);
        }

        if (wasValid)
        { 
            targetElement.SetValue(HasErrorPropertyKey, BooleanBoxes.TrueBox); 
        }

        if (shouldRaiseEvent)
        {
            OnValidationError(targetElement, validationError, ValidationErrorEventAction.Added);
        } 

        if (wasValid) 
        { 
            ShowValidationAdorner(targetElement, true);
        } 
    };

    // remove a validation error from the given element
    Validation.RemoveValidationError = function(/*ValidationError*/ validationError, /*DependencyObject*/ targetElement, /*bool*/ shouldRaiseEvent) 
    {
        if (targetElement == null) 
            return; 

        var validationErrors = GetErrorsInternal(targetElement); 
        if (validationErrors == null || validationErrors.Count == 0 || !validationErrors.Contains(validationError))
            return;

        var isValid = (validationErrors.Count == 1);   // about to remove the last error 

        if (isValid) 
        { 
            // instead of removing the last error, just discard the error collection.
            // This sends out only one property-change event, instead of two. 
            // Any bindings to Errors[x] will appreciate the economy.
            targetElement.ClearValue(HasErrorPropertyKey);

            targetElement.ClearValue(ValidationErrorsInternalProperty); 

            if (shouldRaiseEvent) 
            { 
                OnValidationError(targetElement, validationError, ValidationErrorEventAction.Removed);
            } 

            ShowValidationAdorner(targetElement, false);
        }
        else 
        {
            // if it's not the last error, just remove it. 
            validationErrors.Remove(validationError); 

            if (shouldRaiseEvent) 
            {
                OnValidationError(targetElement, validationError, ValidationErrorEventAction.Removed);
            }
        } 
    };

    Validation.OnValidationError = function(/*DependencyObject*/ source, /*ValidationError*/ validationError, /*ValidationErrorEventAction*/ action) 
    {
        /*ValidationErrorEventArgs*/var args = new ValidationErrorEventArgs(validationError, action); 

//        if (source instanceof ContentElement)
//            ((ContentElement)source).RaiseEvent(args);
//        else if (source instanceof UIElement) 
//            ((UIElement)source).RaiseEvent(args);
//        else if (source instanceof UIElement3D) 
//            ((UIElement3D)source).RaiseEvent(args); 
        source.RaiseEvent(args);
    };

    function CreateDefaultErrorTemplate()
    {
        /*ControlTemplate*/var defaultTemplate = new ControlTemplate(Control.Type);

        //<Border BorderThickness="1" BorderBrush="Red">
        //        <AdornedElementPlaceholder/> 
        //</Border> 

        /*FrameworkElementFactory*/var border = new FrameworkElementFactory(Border.Type, "Border"); 
        border.SetValue(Border.BorderBrushProperty, Brushes.Red);
        border.SetValue(Border.BorderThicknessProperty, new Thickness(1));

        /*FrameworkElementFactory*/
        var adornedElementPlaceHolder = new FrameworkElementFactory(AdornedElementPlaceholder.Type, "Placeholder"); 

        border.AppendChild(adornedElementPlaceHolder); 

        defaultTemplate.VisualTree = border;
        defaultTemplate.Seal(); 

        return defaultTemplate;
    }

	
	Validation.Type = new Type("Validation", Validation, [Object.Type]);
	return Validation;
});

////---------------------------------------------------------------------------- 
////
//// <copyright file="Validation.cs" company="Microsoft">
////    Copyright (C) 2005 by Microsoft Corporation.  All rights reserved.
//// </copyright> 
////
//// 
//// Description: 
////     Validation-related methods and DependencyProperties
//// 
//// See specs at http://avalon/connecteddata/Specs/Validation.mht
////
//// History:
////  02/03/2005       mharper: created. 
////
////--------------------------------------------------------------------------- 
// 
//using System;
//using System.Collections; 
//using System.Collections.Generic;
//using System.Collections.ObjectModel;
//using System.ComponentModel;
//using System.Diagnostics; 
//using System.Windows;
//using System.Windows.Data; 
//using System.Windows.Documents; 
//using System.Windows.Media;
//using System.Windows.Threading; 
//
//using MS.Internal.Controls;
//using MS.Internal.Data;
//using MS.Internal.KnownBoxes; 
//using MS.Utility;
// 
//namespace System.Windows.Controls 
//{
// 
//    /// <summary>
//    ///     Validation-related methods and DependencyProperties
//    /// </summary>
//    public static class Validation 
//    {
// 
//        /// <summary> 
//        ///     ValidationError event
//        /// </summary> 
//        public static readonly RoutedEvent ErrorEvent =
//                EventManager.RegisterRoutedEvent("ValidationError",
//                                                    RoutingStrategy.Bubble,
//                                                    typeof(EventHandler<ValidationErrorEventArgs>), 
//                                                    typeof(Validation));
// 
// 
//        /// <summary>
//        ///     Adds a handler for the ValidationError attached event 
//        /// </summary>
//        /// <param name="element">UIElement or ContentElement that listens to this event</param>
//        /// <param name="handler">Event Handler to be added</param>
//        public static void AddErrorHandler(DependencyObject element, EventHandler<ValidationErrorEventArgs> handler) 
//        {
//            FrameworkElement.AddHandler(element, ErrorEvent, handler); 
//        } 
//
//        /// <summary> 
//        ///     Removes a handler for the ValidationError attached event
//        /// </summary>
//        /// <param name="element">UIElement or ContentElement that listens to this event</param>
//        /// <param name="handler">Event Handler to be removed</param> 
//        public static void RemoveErrorHandler(DependencyObject element, EventHandler<ValidationErrorEventArgs> handler)
//        { 
//            FrameworkElement.RemoveHandler(element, ErrorEvent, handler); 
//        }
// 
//        /// <summary>
//        ///     The key needed to set the publicly read-only ValidationErrors property.
//        /// </summary>
//        internal static readonly DependencyPropertyKey ErrorsPropertyKey = 
//                DependencyProperty.RegisterAttachedReadOnly("Errors",
//                                    typeof(ReadOnlyObservableCollection<ValidationError>), typeof(Validation), 
//                                    new FrameworkPropertyMetadata( 
//                                            ValidationErrorCollection.Empty,
//                                            FrameworkPropertyMetadataOptions.NotDataBindable)); 
//
//        /// <summary>
//        ///     ValidationErrors DependencyProperty.
//        ///     holds the list of all active validation errors of any data binding targeting the hosting element. 
//        /// </summary>
//        /// <remarks> 
//        ///     The application cannot modify the content of this collection. 
//        /// </remarks>
//        public static readonly DependencyProperty ErrorsProperty = 
//                ErrorsPropertyKey.DependencyProperty;
//
//        /// <summary> Static accessor for Validation.Errors property </summary>
//        /// <remarks> 
//        ///     The application cannot modify the content of this collection.
//        /// </remarks> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
//        public static ReadOnlyObservableCollection<ValidationError> GetErrors(DependencyObject element)
//        { 
//            if (element == null)
//                throw new ArgumentNullException("element");
//
//            return (ReadOnlyObservableCollection<ValidationError>) element.GetValue(ErrorsProperty); 
//        }
// 
//        /// <summary> 
//        ///     holds the internally modifiable collection of validation errors.
//        /// </summary> 
//        internal static readonly DependencyProperty ValidationErrorsInternalProperty =
//                DependencyProperty.RegisterAttached("ErrorsInternal",
//                        typeof(ValidationErrorCollection), typeof(Validation),
//                        new FrameworkPropertyMetadata( 
//                                (ValidationErrorCollection)null,
//                                new PropertyChangedCallback(OnErrorsInternalChanged))); 
// 
//        // Update HasErrors and Invalidate the public ValidationErrors property whose GetOverride will return
//        // the updated value of ValidationErrorsInternal, nicely wrapped into a ReadOnlyCollection<T> 
//        private static void OnErrorsInternalChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
//        {
//            ValidationErrorCollection newErrors = e.NewValue as ValidationErrorCollection;
// 
//            if (newErrors != null)
//            { 
//                d.SetValue(ErrorsPropertyKey, new ReadOnlyObservableCollection<ValidationError>(newErrors)); 
//            }
//            else 
//            {
//                d.ClearValue(ErrorsPropertyKey);
//            }
//        } 
//
//        internal static ValidationErrorCollection GetErrorsInternal(DependencyObject target) 
//        { 
//            return (ValidationErrorCollection) target.GetValue(Validation.ValidationErrorsInternalProperty);
//        } 
//
//        /// <summary>
//        ///     The key needed set a read-only property.
//        /// </summary> 
//        internal static readonly DependencyPropertyKey HasErrorPropertyKey =
//                DependencyProperty.RegisterAttachedReadOnly("HasError", 
//                        typeof(bool), typeof(Validation), 
//                        new FrameworkPropertyMetadata(
//                                BooleanBoxes.FalseBox, 
//                                FrameworkPropertyMetadataOptions.NotDataBindable,
//                                OnHasErrorChanged));
//
// 
//        // This is a workaround to notify the Control because if we try to override
//        // metadata to have the control hook it's own property change handler 
//        // it introduces a strange ordering of static constructors when not ngened. 
//        private static void OnHasErrorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
//        { 
//            Control control = d as Control;
//            if (control != null)
//            {
//                Control.OnVisualStatePropertyChanged(control, e); 
//            }
//        } 
// 
//        /// <summary>
//        ///     HasError DependencyProperty is true if any binding on the target element 
//        ///     has a validation error.
//        /// </summary>
//        public static readonly DependencyProperty HasErrorProperty=
//            HasErrorPropertyKey.DependencyProperty; 
//
//        /// <summary> Static accessor for HasError property </summary> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
//        public static bool GetHasError(DependencyObject element)
//        { 
//            if (element == null)
//                throw new ArgumentNullException("element");
//
//            return (bool) element.GetValue(HasErrorProperty); 
//        }
// 
//        /// <summary> 
//        ///     Template used to generate validation error feedback on the AdornerLayer.  Default
//        ///     Template is: 
//        /// <code>
//        ///     <Border BorderThickness="1" BorderBrush="Red">
//        ///        <AdornedElementPlaceholder/>
//        ///     </Border> 
//        /// </code>
//        /// </summary> 
//        public static readonly DependencyProperty ErrorTemplateProperty = 
//                DependencyProperty.RegisterAttached("ErrorTemplate",
//                            typeof(ControlTemplate), typeof(Validation), 
//                            new FrameworkPropertyMetadata(
//                                CreateDefaultErrorTemplate(),
//                                FrameworkPropertyMetadataOptions.NotDataBindable,
//                                new PropertyChangedCallback(OnErrorTemplateChanged))); 
//
// 
//        /// <summary> Static accessor for ErrorTemplate property </summary> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
//        [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
//        public static ControlTemplate GetErrorTemplate(DependencyObject element)
//        {
//            if (element == null)
//                throw new ArgumentNullException("element"); 
//
//            return element.GetValue(ErrorTemplateProperty) as ControlTemplate; 
//        } 
//
//        /// <summary> Static modifier for ErrorTemplate property </summary> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
//        public static void SetErrorTemplate(DependencyObject element, ControlTemplate value)
//        {
//            if (element == null) 
//                throw new ArgumentNullException("element");
// 
//            // (perf) don't set if the existing value is already correct 
//            object oldValue = element.ReadLocalValue(ErrorTemplateProperty);
//            if (!Object.Equals(oldValue, value)) 
//                element.SetValue(ErrorTemplateProperty, value);
//        }
//
//        // when ErrorTemplate changes, redraw the currently visible adorner 
//        private static void OnErrorTemplateChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
//        { 
//            if (GetHasError(d)) 
//            {
//                ShowValidationAdorner(d, false); 
//                ShowValidationAdorner(d, true);
//            }
//        }
// 
//
//        /// <summary> 
//        ///     Designates the alternative element to which validation feedback 
//        ///     should be directed.
//        /// </summary> 
//        public static readonly DependencyProperty ValidationAdornerSiteProperty =
//                DependencyProperty.RegisterAttached("ValidationAdornerSite",
//                            typeof(DependencyObject), typeof(Validation),
//                            new FrameworkPropertyMetadata((DependencyObject)null, 
//                                                        new PropertyChangedCallback(OnValidationAdornerSiteChanged)));
// 
// 
//        /// <summary> Static accessor for ValidationAdornerSite property </summary>
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
//        [AttachedPropertyBrowsableForType(typeof(DependencyObject))]
//        public static DependencyObject GetValidationAdornerSite(DependencyObject element)
//        {
//            if (element == null) 
//                throw new ArgumentNullException("element");
// 
//            return element.GetValue(ValidationAdornerSiteProperty) as DependencyObject; 
//        }
// 
//        /// <summary> Static modifier for ValidationAdornerSite property </summary>
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
//        public static void SetValidationAdornerSite(DependencyObject element, DependencyObject value)
//        { 
//            if (element == null)
//                throw new ArgumentNullException("element"); 
// 
//            element.SetValue(ValidationAdornerSiteProperty, value);
//        } 
//
//        // when Site property changes, update the SiteFor property on the other end
//        private static void OnValidationAdornerSiteChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
//        { 
//            // ignore SubPropertyChange - we don't care about properties on the site
//            if (e.IsASubPropertyChange) 
//                return; 
//
//            DependencyObject oldSite = (DependencyObject)e.OldValue; 
//            DependencyObject newSite = (DependencyObject)e.NewValue;
//
//            if (oldSite != null)
//            { 
//                oldSite.ClearValue(ValidationAdornerSiteForProperty);
//            } 
// 
//            if (newSite != null)
//            { 
//                if (d != GetValidationAdornerSiteFor(newSite))
//                {
//                    SetValidationAdornerSiteFor(newSite, d);
//                } 
//            }
// 
//            // if the adorner is currently visible, move it to the new site 
//            if (GetHasError(d))
//            { 
//                if (oldSite == null)
//                {
//                    oldSite = d;
//                } 
//                ShowValidationAdornerHelper(d, oldSite, false);
//                ShowValidationAdorner(d, true); 
//            } 
//        }
// 
//
//        /// <summary>
//        ///     Designates the element for which the current element should serve
//        ///     as the ValidationAdornerSite. 
//        /// </summary>
//        public static readonly DependencyProperty ValidationAdornerSiteForProperty = 
//                DependencyProperty.RegisterAttached("ValidationAdornerSiteFor", 
//                            typeof(DependencyObject), typeof(Validation),
//                            new FrameworkPropertyMetadata((DependencyObject)null, 
//                                                        new PropertyChangedCallback(OnValidationAdornerSiteForChanged)));
//
//
//        /// <summary> Static accessor for ValidationAdornerSiteFor property </summary> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception>
//        [AttachedPropertyBrowsableForType(typeof(DependencyObject))] 
//        public static DependencyObject GetValidationAdornerSiteFor(DependencyObject element) 
//        {
//            if (element == null) 
//                throw new ArgumentNullException("element");
//
//            return element.GetValue(ValidationAdornerSiteForProperty) as DependencyObject;
//        } 
//
//        /// <summary> Static modifier for ValidationAdornerSiteFor property </summary> 
//        /// <exception cref="ArgumentNullException"> DependencyObject element cannot be null </exception> 
//        public static void SetValidationAdornerSiteFor(DependencyObject element, DependencyObject value)
//        { 
//            if (element == null)
//                throw new ArgumentNullException("element");
//
//            element.SetValue(ValidationAdornerSiteForProperty, value); 
//        }
// 
//        // when SiteFor property changes, update the Site property on the other end 
//        private static void OnValidationAdornerSiteForChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
//        { 
//            // ignore SubPropertyChange - we don't care about properties on the siteFor
//            if (e.IsASubPropertyChange)
//                return;
// 
//            DependencyObject oldSiteFor = (DependencyObject)e.OldValue;
//            DependencyObject newSiteFor = (DependencyObject)e.NewValue; 
// 
//            if (oldSiteFor != null)
//            { 
//                oldSiteFor.ClearValue(ValidationAdornerSiteProperty);
//            }
//
//            if (newSiteFor != null) 
//            {
//                if (d != GetValidationAdornerSite(newSiteFor)) 
//                { 
//                    SetValidationAdornerSite(newSiteFor, d);
//                } 
//            }
//        }
//
// 
//        internal static void ShowValidationAdorner(DependencyObject targetElement, bool show)
//        { 
//            // If the element has a VisualStateGroup for validation, then dont show the Adorner 
//            // because the control will handle visualizing the error via VSM states.
//            if (!HasValidationGroup(targetElement as FrameworkElement)) 
//            {
//                // redirect the adorner to the designated site, if any
//                DependencyObject adornerSite = GetValidationAdornerSite(targetElement);
//                if (adornerSite == null) 
//                {
//                    adornerSite = targetElement; 
//                } 
//
//                ShowValidationAdornerHelper(targetElement, adornerSite, show); 
//            }
//        }
//
// 
//        private static bool HasValidationGroup(FrameworkElement fe)
//        { 
//            if (fe != null) 
//            {
//                IList<VisualStateGroup> groups = VisualStateManager.GetVisualStateGroupsInternal(fe); 
//
//                // the Validation group could be on either the FE or it's StateGroupRoot
//                if (HasValidationGroup(groups))
//                { 
//                    return true;
//                } 
// 
//                if (fe.StateGroupsRoot != null)
//                { 
//                    groups = VisualStateManager.GetVisualStateGroupsInternal(fe.StateGroupsRoot);
//                    return HasValidationGroup(groups);
//                }
//            } 
//
//            return false; 
//        } 
//
//        private static bool HasValidationGroup(IList<VisualStateGroup> groups) 
//        {
//            if (groups != null)
//            {
//                for (int groupIndex = 0; groupIndex < groups.Count; ++groupIndex) 
//                {
//                    VisualStateGroup g = groups[groupIndex]; 
//                    if (g.Name == VisualStates.GroupValidation) 
//                    {
//                        return true; 
//                    }
//                }
//            }
// 
//            return false;
//        } 
// 
//        private static void ShowValidationAdornerHelper(DependencyObject targetElement, DependencyObject adornerSite, bool show)
//        { 
//            ShowValidationAdornerHelper(targetElement, adornerSite, show, true);
//        }
//
//        private static object ShowValidationAdornerOperation(object arg) 
//        {
//            object[] args = (object[])arg; 
//            DependencyObject targetElement = (DependencyObject)args[0]; 
//            DependencyObject adornerSite = (DependencyObject)args[1];
//            bool show = (bool)args[2]; 
//
//            ShowValidationAdornerHelper(targetElement, adornerSite, show, false);
//
//            return null; 
//        }
// 
//        private static void ShowValidationAdornerHelper(DependencyObject targetElement, DependencyObject adornerSite, bool show, bool tryAgain) 
//        {
//            UIElement siteUIElement = adornerSite as UIElement; 
//
//            if (siteUIElement != null)
//            {
//                AdornerLayer adornerLayer = AdornerLayer.GetAdornerLayer(siteUIElement); 
//
//                if (adornerLayer == null) 
//                { 
//                    if (tryAgain)
//                    { 
//                        // try again later, perhaps giving layout a chance to create the adorner layer
//                        adornerSite.Dispatcher.BeginInvoke(DispatcherPriority.Loaded,
//                                    new DispatcherOperationCallback(ShowValidationAdornerOperation),
//                                    new object[]{targetElement, adornerSite, show}); 
//                    }
//                    return; 
//                } 
//
//                TemplatedAdorner validationAdorner = siteUIElement.ReadLocalValue(ValidationAdornerProperty) as TemplatedAdorner; 
//
//                if (show && validationAdorner == null)
//                {
//                    // get the template from the site, or from the target element 
//                    ControlTemplate validationTemplate = GetErrorTemplate(siteUIElement);
//                    if (validationTemplate == null) 
//                    { 
//                        validationTemplate = GetErrorTemplate(targetElement);
//                    } 
//
//                    if (validationTemplate != null)
//                    {
//                        validationAdorner = new TemplatedAdorner(siteUIElement, validationTemplate); 
//                        adornerLayer.Add(validationAdorner);
// 
//                        siteUIElement.SetValue(ValidationAdornerProperty, validationAdorner); 
//                    }
//                } 
//                else if (!show && validationAdorner != null)
//                {
//                    validationAdorner.ClearChild();
//                    adornerLayer.Remove(validationAdorner); 
//                    siteUIElement.ClearValue(ValidationAdornerProperty);
//                } 
//            } 
//        }
// 
//
//        /// <summary>
//        /// Mark this BindingExpression as invalid.  If the BindingExpression has been
//        /// explicitly marked invalid in this way, then it will remain 
//        /// invalid until ClearInvalid is called or another transfer to the source validates successfully.
//        /// </summary> 
//        public static void MarkInvalid(BindingExpressionBase bindingExpression, ValidationError validationError) 
//        {
//            if (bindingExpression == null) 
//                throw new ArgumentNullException("bindingExpression");
//            if (validationError == null)
//                throw new ArgumentNullException("validationError");
// 
//            bindingExpression.UpdateValidationError(validationError);
//        } 
// 
//        /// <summary>
//        /// Clears the ValidationError that was set through a call 
//        /// to MarkInvalid or a previously failed validation of that BindingExpression.
//        /// </summary>
//        public static void ClearInvalid(BindingExpressionBase bindingExpression)
//        { 
//            if (bindingExpression == null)
//                throw new ArgumentNullException("bindingExpression"); 
//            bindingExpression.UpdateValidationError(null); 
//        }
// 
//        // add a validation error to the given element
//        internal static void AddValidationError(ValidationError validationError, DependencyObject targetElement, bool shouldRaiseEvent)
//        {
//            if (targetElement == null) 
//                return;
// 
//            bool wasValid; 
//            ValidationErrorCollection validationErrors = GetErrorsInternal(targetElement);
// 
//            if (validationErrors == null)
//            {
//                wasValid = true;
//                validationErrors = new ValidationErrorCollection(); 
//                validationErrors.Add(validationError);
//                targetElement.SetValue(Validation.ValidationErrorsInternalProperty, validationErrors); 
//            } 
//            else
//            { 
//                wasValid = (validationErrors.Count == 0);
//                validationErrors.Add(validationError);
//            }
// 
//            if (wasValid)
//            { 
//                targetElement.SetValue(HasErrorPropertyKey, BooleanBoxes.TrueBox); 
//            }
// 
//            if (shouldRaiseEvent)
//            {
//                OnValidationError(targetElement, validationError, ValidationErrorEventAction.Added);
//            } 
//
//            if (wasValid) 
//            { 
//                ShowValidationAdorner(targetElement, true);
//            } 
//        }
//
//        // remove a validation error from the given element
//        internal static void RemoveValidationError(ValidationError validationError, DependencyObject targetElement, bool shouldRaiseEvent) 
//        {
//            if (targetElement == null) 
//                return; 
//
//            ValidationErrorCollection validationErrors = GetErrorsInternal(targetElement); 
//            if (validationErrors == null || validationErrors.Count == 0 || !validationErrors.Contains(validationError))
//                return;
//
//            bool isValid = (validationErrors.Count == 1);   // about to remove the last error 
//
//            if (isValid) 
//            { 
//                // instead of removing the last error, just discard the error collection.
//                // This sends out only one property-change event, instead of two. 
//                // Any bindings to Errors[x] will appreciate the economy.
//                targetElement.ClearValue(HasErrorPropertyKey);
//
//                targetElement.ClearValue(ValidationErrorsInternalProperty); 
//
//                if (shouldRaiseEvent) 
//                { 
//                    OnValidationError(targetElement, validationError, ValidationErrorEventAction.Removed);
//                } 
//
//                ShowValidationAdorner(targetElement, false);
//            }
//            else 
//            {
//                // if it's not the last error, just remove it. 
//                validationErrors.Remove(validationError); 
//
//                if (shouldRaiseEvent) 
//                {
//                    OnValidationError(targetElement, validationError, ValidationErrorEventAction.Removed);
//                }
//            } 
//        }
// 
//        static void OnValidationError(DependencyObject source, ValidationError validationError, ValidationErrorEventAction action) 
//        {
//            ValidationErrorEventArgs args = new ValidationErrorEventArgs(validationError, action); 
//
//            if (source is ContentElement)
//                ((ContentElement)source).RaiseEvent(args);
//            else if (source is UIElement) 
//                ((UIElement)source).RaiseEvent(args);
//            else if (source is UIElement3D) 
//                ((UIElement3D)source).RaiseEvent(args); 
//        }
// 
//        private static ControlTemplate CreateDefaultErrorTemplate()
//        {
//            ControlTemplate defaultTemplate = new ControlTemplate(typeof(Control));
// 
//            //<Border BorderThickness="1" BorderBrush="Red">
//            //        <AdornedElementPlaceholder/> 
//            //</Border> 
//
//            FrameworkElementFactory border = new FrameworkElementFactory(typeof(Border), "Border"); 
//            border.SetValue(Border.BorderBrushProperty, Brushes.Red);
//            border.SetValue(Border.BorderThicknessProperty, new Thickness(1));
//
//            FrameworkElementFactory adornedElementPlaceHolder = new FrameworkElementFactory(typeof(AdornedElementPlaceholder), "Placeholder"); 
//
//            border.AppendChild(adornedElementPlaceHolder); 
// 
//            defaultTemplate.VisualTree = border;
//            defaultTemplate.Seal(); 
//
//            return defaultTemplate;
//        }
// 
//        /// <summary>
//        ///     Reference to the ValidationAdorner 
//        /// </summary> 
//        private static readonly DependencyProperty ValidationAdornerProperty =
//                DependencyProperty.RegisterAttached("ValidationAdorner", 
//                        typeof(TemplatedAdorner), typeof(Validation),
//                        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.NotDataBindable));
//
//    } 
//}