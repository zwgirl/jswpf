package org.summer.view.widget.controls;

import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.data.BindingGroup;
import org.summer.view.widget.internal.CriticalExceptions;
import org.summer.view.widget.model.IDataErrorInfo;

public class DataErrorValidationRule extends ValidationRule {
	// / <summary>
	// / DataErrorValidationRule ctor.
	// / </summary>
	public DataErrorValidationRule() {
		super(ValidationStep.UpdatedValue, true);
	}

	// / <summary>
	// / Validate is called when Data binding is updating
	// / </summary>
	public ValidationResult Validate(Object value, CultureInfo cultureInfo)
        {
            // This rule is called during the CommittedValue step, so the value is the
            // owner of the rule collection - either a BindingGroup or an individual
            // binding expression.
            BindingGroup bindingGroup;
            BindingExpression bindingExpr;
 
            if ((bindingGroup = value as BindingGroup) != null)
            {
                // in a BindingGroup, check the item-level IDataErrorInfo for each
                // source item in the group
                IList items = bindingGroup.Items;
                for (int i=items.Count-1; i>=0; --i)
                {
                    IDataErrorInfo idei = items[i] as IDataErrorInfo;
                    if (idei != null)
                    {
                        String error = idei.Error;
                        if (!String.IsNullOrEmpty(error))
                        {
                            return new ValidationResult(false, error);
                        }
                    }
                }
            }
            else if ((bindingExpr = value as BindingExpression) != null)
            {
                // in a binding, check the error info for the binding's source
                // property
                IDataErrorInfo idei = bindingExpr.SourceItem as IDataErrorInfo;
                String name = (idei != null) ? bindingExpr.SourcePropertyName : null;
 
                if (!String.IsNullOrEmpty(name))
                {
                    // get the data error information, if any, by calling idie[name].
                    // We do this in a paranoid way, even though indexers with
                    // String-valued arguments are not supposed to throw exceptions.
  
                    // PreSharp uses message numbers that the C# compiler doesn't know about.
                    // Disable the C# complaints, per the PreSharp documentation.
//                    #pragma warning disable 1634, 1691
  
                    // PreSharp complains about catching NullReference (and other) exceptions.
                    // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//                    #pragma warning disable 56500
 
                    String error;
                    try
                    {
                        error = idei[name];
                    }
                    catch (Exception ex)
                    {
                        if (CriticalExceptions.IsCriticalApplicationException(ex))
                            throw ex;
  
                        error = null;
 
//                        if (TraceData.IsEnabled)
//                        {
//                            TraceData.Trace(TraceEventType.Error,
//                                            TraceData.DataErrorInfoFailed(
//                                                name,
//                                                idei.GetType().FullName,
//                                                ex.GetType().FullName,
//                                                ex.Message),
//                                            bindingExpr);
//                        }
                    }
//                    #pragma warning restore 56500
//                    #pragma warning restore 1634, 1691
  
                    if (!String.IsNullOrEmpty(error))
                    {
                        return new ValidationResult(false, error);
                    }
                }
            }
            else
                throw new InvalidOperationException(/*SR.Get(SRID.ValidationRule_UnexpectedValue, this, value)*/);
  
            return ValidationResult.ValidResult;
        }

	/* internal */public static final DataErrorValidationRule Instance = new DataErrorValidationRule();
}