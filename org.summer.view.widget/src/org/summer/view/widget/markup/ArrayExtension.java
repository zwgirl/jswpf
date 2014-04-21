package org.summer.view.widget.markup;

import java.lang.reflect.Array;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.xml.InvalidCastException;

/// <summary>
    ///  Class for Xaml markup extension for Arrays.
    /// </summary>
//    [ContentProperty("Items")]
//    [MarkupExtensionReturnType(typeof(Array))]
    public class ArrayExtension extends MarkupExtension implements IAddChild
    {
        /// <summary>
        ///  Constructor that takes no parameters.  This creates an empty array.
        /// </summary>
        public ArrayExtension()
        {
        }
 
        /// <summary>
        ///  Constructor that takes one parameter.  This initializes the type of the array.
        /// </summary>
        public ArrayExtension(
            Type arrayType)
        {
            if (arrayType == null)
            {
                throw new ArgumentNullException("arrayType");
            }
            _arrayType = arrayType;
        }
  
        /// <summary>
        /// Constructor for writing
        /// </summary>
        /// <param name="elements">The array to write
        public ArrayExtension(Array elements)
        {
            _arrayList.AddRange(elements);
            _arrayType = elements.GetType().GetElementType();
        }
 
        ///<summary>
        /// Called to Add an Object as a new array item.  This will append the Object to the end
        /// of the array.
        ///</summary>
        ///<param name="value">
        /// Object to add to the end of the array.
        ///
        public void AddChild(Object value)
        {
            _arrayList.Add(value);
        }
 
        ///<summary>
        /// Called to Add a text as a new array item.  This will append the Object to the end
        /// of the array.
        ///</summary>
        ///<param name="text">
        /// Text to Add to the end of the array
        ///
        public void AddText(String text)
        {
            AddChild(text);
        }
 
        ///<summary>
        /// Get and set the type of array to be created when calling ProvideValue
        ///</summary>
//        [ConstructorArgument("type")]
        public Type Type
        {
            get { return _arrayType; }
            set { _arrayType = value; }
        }
  
        /// <summary>
        /// An IList accessor to the contents of the array
        /// </summary>
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public IList Items
        {
            get { return _arrayList; }
        }
  
        /// <summary>
        ///  Return an array that is sized to the number of objects added to the ArrayExtension.
        /// </summary>
        /// <param name="serviceProvider">Object that can provide services for the markup extension.
        /// <returns>
        ///  The Array containing all the objects added to this extension.
        /// </returns>
        public /*override*/ Object ProvideValue(IServiceProvider serviceProvider)
        {
            if (_arrayType == null)
            {
                throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionArrayType)*/);
            }
 
            Object retArray = null;
  
            try
            {
                retArray = _arrayList.ToArray(_arrayType);
            }
            catch (/*System.*/InvalidCastException ex)
            {
                // If an element was added to the ArrayExtension that does not agree with the
                // ArrayType, then an InvalidCastException will occur.  Generate a more
                // meaningful error for this case.
                throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionArrayBadType, _arrayType.Name)*/);
            }
  
            return retArray;
        }
 
        private ArrayList _arrayList = new ArrayList();
        private Type      _arrayType;
  
    }