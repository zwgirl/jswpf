package org.summer.view.widget.controls;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.data.BindingGroup;
 /// <summary>
    ///      ValidationRule is a member of ValidationRules Collection.
    ///      ValidationRulesCollection is a collection of ValidationRule
    ///      instances on either a Binding or a MultiBinding.  Each of the ValidationRules' 
    ///      Validate is checked for validity on update
    /// </summary> 
    public abstract class ValidationRule 
    {
        /// <summary> 
        /// Initialize a new instance of ValidationRule.
        /// </summary>
        //
     protected ValidationRule() 
        {
        	this(ValidationStep.RawProposedValue, false) ;
        } 

        /// <summary>
        /// Initialize a new instance of ValidationRule with the given validation
        /// step and target-update behavior. 
        /// </summary>
        protected ValidationRule(ValidationStep validationStep, boolean validatesOnTargetUpdated) 
        { 
            _validationStep = validationStep;
            _validatesOnTargetUpdated = validatesOnTargetUpdated; 
        }

        /// <summary>
        /// Validate is called when Data binding is updating 
        /// </summary>
        public abstract ValidationResult Validate(Object value, CultureInfo cultureInfo); 
 
        public /*virtual*/ ValidationResult Validate(Object value, CultureInfo cultureInfo, BindingExpressionBase owner)
        { 
            switch (_validationStep)
            {
                case /*ValidationStep.*/UpdatedValue:
                case /*ValidationStep.*/CommittedValue: 
                    value = owner;
                    break; 
            } 

            return Validate(value, cultureInfo); 
        }

        public /*virtual*/ ValidationResult Validate(Object value, CultureInfo cultureInfo, BindingGroup owner)
        { 
            return Validate(owner, cultureInfo);
        } 
 
        /// <summary>
        /// The step at which the rule should be called. 
        /// </summary>
        public ValidationStep ValidationStep
        {
            get { return _validationStep; } 
            set { _validationStep = value; }
        } 
 
        /// <summary>
        /// When true, the validation rule is also called during source-to-target data 
        /// transfer.  This allows invalid data in the source to be highlighted
        /// as soon as it appears in the UI, without waiting for the user to edit it.
        /// </summary>
        public boolean ValidatesOnTargetUpdated 
        {
            get { return _validatesOnTargetUpdated; } 
            set { _validatesOnTargetUpdated = value; } 
        }
 
        ValidationStep  _validationStep;
        boolean            _validatesOnTargetUpdated;
    }