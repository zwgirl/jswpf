package org.summer.view.widget.documents;

import org.summer.view.widget.UIElement;

/// <summary> 
    /// This AdornerDecorator does not hookup its child in the logical tree. It's being
    /// used by PopupRoot and FixedDocument. 
    /// </summary>
    /*internal*/ public class NonLogicalAdornerDecorator extends AdornerDecorator
    {
        public /*override*/ UIElement Child 
        {
            get 
            { 
                return IntChild;
            } 
            set
            {
                if (IntChild != value)
                { 
                    this.RemoveVisualChild(IntChild);
                    this.RemoveVisualChild(AdornerLayer); 
                    IntChild = value; 
                    if(value != null)
                    { 
                        this.AddVisualChild(value);
                        this.AddVisualChild(AdornerLayer);
                    }
 
                    InvalidateMeasure();
                } 
            } 
        }
    } 