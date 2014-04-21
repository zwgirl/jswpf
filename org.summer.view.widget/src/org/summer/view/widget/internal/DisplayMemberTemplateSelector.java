package org.summer.view.widget.internal;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DataTemplate;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.FrameworkElementFactory;
import org.summer.view.widget.PropertyPath;
import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.widget.controls.DataTemplateSelector;
import org.summer.view.widget.controls.TextBlock;
import org.summer.view.widget.data.Binding;

//Selects template appropriate for CLR/XML item in order to
// display string property at DisplayMemberPath on the item.
/*internal*/ public /*sealed*/ class DisplayMemberTemplateSelector extends DataTemplateSelector
{ 
    /// <summary>
    /// Constructor 
    /// </summary> 
    /// <param name="displayMemberPath">path to the member to display</param>
    public DisplayMemberTemplateSelector(String displayMemberPath, String stringFormat) 
    {
        Debug.Assert(!(String.IsNullOrEmpty(displayMemberPath) && String.IsNullOrEmpty(stringFormat)));
        _displayMemberPath = displayMemberPath;
        _stringFormat = stringFormat; 
    }

    /// <summary> 
    /// Override this method to return an app specific <seealso cref="DataTemplate"/>.
    /// </summary> 
    /// <param name="item">The data content</param>
    /// <param name="container">The container in which the content is to be displayed</param>
    /// <returns>a app specific template to apply.</returns>
    public /*override*/ DataTemplate SelectTemplate(Object item, DependencyObject container) 
    {
        if (SystemXmlHelper.IsXmlNode(item)) 
        { 
            if (_xmlNodeContentTemplate == null)
            { 
                _xmlNodeContentTemplate = new DataTemplate();
                FrameworkElementFactory text = ContentPresenter.CreateTextBlockFactory();
                Binding binding = new Binding();
                binding.XPath = _displayMemberPath; 
                binding.StringFormat = _stringFormat;
                text.SetBinding(TextBlock.TextProperty, binding); 
                _xmlNodeContentTemplate.VisualTree = text; 
                _xmlNodeContentTemplate.Seal();
            } 
            return _xmlNodeContentTemplate;
        }
        else
        { 
            if (_clrNodeContentTemplate == null)
            { 
                _clrNodeContentTemplate = new DataTemplate(); 
                FrameworkElementFactory text = ContentPresenter.CreateTextBlockFactory();
                Binding binding = new Binding(); 
                binding.Path = new PropertyPath(_displayMemberPath);
                binding.StringFormat = _stringFormat;
                text.SetBinding(TextBlock.TextProperty, binding);
                _clrNodeContentTemplate.VisualTree = text; 
                _clrNodeContentTemplate.Seal();
            } 
            return _clrNodeContentTemplate; 
        }
    } 

    private String _displayMemberPath;
    private String _stringFormat;
    private DataTemplate _xmlNodeContentTemplate; 
    private DataTemplate _clrNodeContentTemplate;
} 