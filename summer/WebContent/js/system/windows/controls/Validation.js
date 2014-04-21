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
	
	Object.defineProperties(Validation, {
		ErrorEvent:
		{
			get:function(){
				if(Validation._ErrorEvent === undefined){
					Validation._ErrorEvent = EventManager.RegisterRoutedEvent("ValidationError",
                            RoutingStrategy.Bubble,
                            EventHandler.Type/*<ValidationErrorEventArgs>*/, 
                            Validation.Type);
				}
				
				return Validation._ErrorEvent;
			}
		},
		
		  /// <summary>
	    ///     The key needed to set the publicly read-only ValidationErrors property.
	    /// </summary>
	    ErrorsPropertyKey:
	    {
	    	get:function(){
		    	if(Validation._ErrorsPropertyKey === undefined){
		    		Validation._ErrorsPropertyKey = DependencyProperty.RegisterAttachedReadOnly("Errors",
	                        ReadOnlyObservableCollection.Type, Validation.Type, 
	                        FrameworkPropertyMetadata.Build2( 
	                                ValidationErrorCollection.Empty,
	                                FrameworkPropertyMetadataOptions.NotDataBindable)); 
		    	}
		    	
		    	return Validation._ErrorsPropertyKey; 
	    	}
	    },
	    
	    /// <summary>
	    ///     ValidationErrors DependencyProperty.
	    ///     holds the list of all active validation errors of any data binding targeting the hosting element. 
	    /// </summary>
	    /// <remarks> 
	    ///     The application cannot modify the content of this collection. 
	    /// </remarks>
	    ErrorsProperty :{
	    	get : function(){
	    		return Validation.ErrorsPropertyKey.DependencyProperty;
	    	}
	    },
	            
	    /// <summary> 
	    ///     holds the internally modifiable collection of validation errors.
	    /// </summary> 
	    ValidationErrorsInternalProperty:{
	    	get:function(){
	    		if(Validation._ValidationErrorsInternalProperty === undefined){
	    			Validation._ValidationErrorsInternalProperty = DependencyProperty.RegisterAttached("ErrorsInternal",
	                    ValidationErrorCollection.Type, Validation.Type,
	                    FrameworkPropertyMetadata.BuildWithDVandPCCB( 
	                            null,
	                            new PropertyChangedCallback(OnErrorsInternalChanged))); 
	    		}
	    		return Validation._ValidationErrorsInternalProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     The key needed set a read-only property.
	    /// </summary> 
	    HasErrorPropertyKey:
	    {
	    	get:function(){
	    		if(Validation._HasErrorPropertyKey === undefined){
	    			Validation._HasErrorPropertyKey = DependencyProperty.RegisterAttachedReadOnly("HasError", 
		                    Boolean.Type, Validation.Type, 
		                    FrameworkPropertyMetadata.Build3PCCB(
		                            false, 
		                            FrameworkPropertyMetadataOptions.NotDataBindable,
		                            OnHasErrorChanged));
	    		}
	            
	    		return Validation._HasErrorPropertyKey;
	    	}
	    },
	    
	    /// <summary>
	    ///     HasError DependencyProperty is true if any binding on the target element 
	    ///     has a validation error.
	    /// </summary>
	    HasErrorProperty : {
	    	get:function(){
	    		return Validation.HasErrorPropertyKey.DependencyProperty; 
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
	    ErrorTemplateProperty:
	    {
	    	get:function(){
	    		if(Validation._ErrorTemplateProperty === undefined){
	    			Validation._ErrorTemplateProperty = DependencyProperty.RegisterAttached("ErrorTemplate",
	                        ControlTemplate.Type, Validation.Type, 
	                        FrameworkPropertyMetadata.Build3PCCB(
	                            CreateDefaultErrorTemplate(),
	                            FrameworkPropertyMetadataOptions.NotDataBindable,
	                            new PropertyChangedCallback(null, OnErrorTemplateChanged)));
	    		}
	    		return Validation._ErrorTemplateProperty;
	    	}

	    },
	    
	    /// <summary> 
	    ///     Designates the alternative element to which validation feedback 
	    ///     should be directed.
	    /// </summary> 
	    ValidationAdornerSiteProperty:
	    {
	    	get:function(){
		    	if(Validation._ValidationAdornerSiteProperty === undefined){
		    		Validation._ValidationAdornerSiteProperty = DependencyProperty.RegisterAttached("ValidationAdornerSite",
		                        DependencyObject.Type, Validation.Type,
		                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(DependencyObject)*/null, 
		                                                   new PropertyChangedCallback(null, OnValidationAdornerSiteChanged)));
		    	}
		    	
		    	return Validation._ValidationAdornerSiteProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     Designates the element for which the current element should serve
	    ///     as the ValidationAdornerSite. 
	    /// </summary>
	    ValidationAdornerSiteForProperty:
	    {
	    	get:function(){
		    	if(Validation._ValidationAdornerSiteForProperty === undefined) {
		    		Validation._ValidationAdornerSiteForProperty = DependencyProperty.RegisterAttached("ValidationAdornerSiteFor", 
		                        DependencyObject.Type, Validation.Type,
		                        FrameworkPropertyMetadata.BuildWithDVandPCCB(/*(DependencyObject)*/null, 
		                                                    new PropertyChangedCallback(null, OnValidationAdornerSiteForChanged)));
		    	}
		    	return Validation._ValidationAdornerSiteForProperty;
	    	}
	    },
	    
	    /// <summary>
	    ///     Reference to the ValidationAdorner 
	    /// </summary> 
	    ValidationAdornerProperty:
	    {
	    	get:function(){
		    	if(Validation._ValidationAdornerProperty === undefined){
		    		Validation._ValidationAdornerProperty = DependencyProperty.RegisterAttached("ValidationAdorner", 
		                    TemplatedAdorner.Type, Validation.Type,
		                    FrameworkPropertyMetadata.Build2(null, FrameworkPropertyMetadataOptions.NotDataBindable));
		    	}
		    	
		    	return Validation._ValidationAdornerProperty;
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
            targetElement.SetValue(Validation.HasErrorPropertyKey, BooleanBoxes.TrueBox); 
        }

        if (shouldRaiseEvent)
        {
        	Validation.OnValidationError(targetElement, validationError, ValidationErrorEventAction.Added);
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
            	Validation.OnValidationError(targetElement, validationError, ValidationErrorEventAction.Removed);
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
