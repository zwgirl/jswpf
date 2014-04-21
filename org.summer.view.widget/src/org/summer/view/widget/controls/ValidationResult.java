package org.summer.view.widget.controls;
/// <summary>
    /// A ValidationResult is the result of call to ValidationRule.Validate
    /// </summary>
    public class ValidationResult
    {
  
        /// <summary>
        /// Constructor
        /// </summary>
        public ValidationResult(boolean isValid, Object errorContent)
        {
            _isValid = isValid;
            _errorContent = errorContent;
        }
  
        /// <summary>
        ///     Whether or not the ValidationRule that was checked is valid.
        /// </summary>
        public boolean IsValid
        {
            get
            {
                return _isValid;
            }
        }
 
        /// <summary>
        ///     Additional information regarding the cause of the invalid
        ///     state of the binding that was just checked.
        /// </summary>
        public Object ErrorContent
        {
            get
            {
                return _errorContent;
            }
        }
 
        /// <summary>
        ///     Returns a valid ValidationResult
        /// </summary>
        public static ValidationResult ValidResult
        {
            get
            {
                return s_valid;
            }
        }
  
        /// <summary>
        ///     Compares the parameters for value equality
        /// </summary>
        /// <param name="left">left operand
        /// <param name="right">right operand
        /// <returns>true if the values are equal</returns>
        public static boolean operator == (ValidationResult left, ValidationResult right)
        {
            return Object.Equals(left, right);
        }
  
        /// <summary>
        ///     Compares the parameters for value inequality
        /// </summary>
        /// <param name="left">left operand
        /// <param name="right">right operand
        /// <returns>true if the values are not equal</returns>
        public static boolean operator != (ValidationResult left, ValidationResult right)
        {
            return !Object.Equals(left, right);
        }
 
        /// <summary>
        ///     By-value comparison of ValidationResult
        /// </summary>
        /// <remarks>
        /// This method is also used indirectly from the operator overrides.
        /// </remarks>
        /// <param name="obj">ValidationResult to be compared against this ValidationRule
        /// <returns>true if obj is ValidationResult and has the same values</returns>
        public  boolean Equals(Object obj)
        {
            // A cheaper alternative to Object.ReferenceEquals() is used here for better perf
            if (obj == (Object)this)
            {
                return true;
            }
            else
            {
                ValidationResult vr = obj as ValidationResult;
                if (vr != null)
                {
                    return (IsValid == vr.IsValid) && (ErrorContent == vr.ErrorContent);
                }
            }
 
            return false;
        }
 
        /// <summary>
        ///     Hash function for ValidationResult
        /// </summary>
        /// <returns>hash code for the current ValidationResult</returns>
        public  int GetHashCode()
        {
            return IsValid.GetHashCode() ^ ((ErrorContent == null) ? int.MinValue : ErrorContent).GetHashCode();
        }
 
        private boolean _isValid;
        private Object _errorContent;
 
        private static  ValidationResult s_valid = new ValidationResult(true, null);
    }