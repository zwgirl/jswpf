package org.summer.view.widget;

import org.summer.view.widget.controls.ContentPresenter;
import org.summer.view.window.DataTemplateKey;
import org.summer.view.window.TemplateKey;


public class DataTemplate extends FrameworkTemplate 
    {
//        #region Constructors 
 
        //-------------------------------------------------------------------
        // 
        //  Constructors
        //
        //-------------------------------------------------------------------
 
        /// <summary>
        ///     DataTemplate Constructor 
        /// </summary> 
        public DataTemplate()
        { 
        }

        /// <summary>
        ///     DataTemplate Constructor 
        /// </summary>
        public DataTemplate(Object dataType) 
        { 
            Exception ex = TemplateKey.ValidateDataType(dataType, "dataType");
            if (ex != null) 
                throw ex;

            _dataType = dataType;
        } 

//        #endregion Constructors 
// 
//        #region Public Properties
 
        //--------------------------------------------------------------------
        //
        //  Public Properties
        // 
        //-------------------------------------------------------------------
 
        /// <summary> 
        ///     DataType for this DataTemplate.  If the template is intended
        ///     for Object data, this is the Type of the data.  If the 
        ///     template is intended for XML data, this is the tag name
        ///     of the data (i.e. a string).
        /// </summary>
//        [DefaultValue(null)] 
//        [Ambient]
        public Object DataType 
        { 
            get {  return _dataType; }
            set 
            {
                Exception ex = TemplateKey.ValidateDataType(value, "value");
                if (ex != null)
                    throw ex; 

                CheckSealed(); 
                _dataType = value; 
            }
        } 

        /// <summary>
        ///     Collection of Triggers
        /// </summary> 
//        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
//        [DependsOn("VisualTree")] 
//        [DependsOn("Template")] 
        public TriggerCollection Triggers
        { 
            get
            {
                if (_triggers == null)
                { 
                    _triggers = new TriggerCollection();
 
                    // If the template has been sealed prior to this the newly 
                    // created TriggerCollection also needs to be sealed
                    if (IsSealed) 
                    {
                        _triggers.Seal();
                    }
                } 
                return _triggers;
            } 
        } 

        /// <summary> 
        ///     The key that will be used if the DataTemplate is added to a
        ///     ResourceDictionary in Xaml without a specified Key (x:Key).
        /// </summary>
        public Object DataTemplateKey 
        {
            get 
            { 
                return (DataType != null) ? new DataTemplateKey(DataType) : null;
            } 
        }

//        #endregion PublicProperties
// 
//        #region Internal Properties
 
        //-------------------------------------------------------------------- 
        //
        //  Internal Properties 
        //
        //--------------------------------------------------------------------

        // 
        //  TargetType for DataTemplate. This is is
        //  so FrameworkTemplate can see this property. 
        // 
        private Type TargetTypeInternal
        { 
            get {  return DefaultTargetType; }
        }

        // Subclasses must provide a way for the parser to directly set the 
        // target type.  For DataTemplate, this is not allowed.
        private void SetTargetTypeInternal(Type targetType) 
        { 
            throw new InvalidOperationException(SR.Get(SRID.TemplateNotTargetType));
        } 

        //
        //  DataType for DataTemplate. This is is
        //  so FrameworkTemplate can see this property. 
        //
        private Object DataTypeInternal 
        { 
            get {  return DataType; }
        } 

        //
        //  Collection of Triggers for a DataTemplate. This is
        //  is so FrameworkTemplate can see this property. 
        //
        private TriggerCollection TriggersInternal 
        { 
            get { return Triggers; }
        } 

        // Target type of DataTrigger is ContentPresenter
        static private Type DefaultTargetType
        { 
            get { return typeof(ContentPresenter); }
        } 
// 
//        #endregion Internal Properties
// 
//        #region Protected Methods

        //-------------------------------------------------------------------
        // 
        //  Protected Methods
        // 
        //-------------------------------------------------------------------- 

        /// <summary> 
        ///     Validate against the following rules
        ///     1. Must have a non-null feTemplatedParent
        ///     2. A DataTemplate must be applied to a ContentPresenter
        /// </summary> 
        protected void ValidateTemplatedParent(FrameworkElement templatedParent)
        { 
            // Must have a non-null feTemplatedParent 
            if (templatedParent == null)
            { 
                throw new ArgumentNullException("templatedParent");
            }

            // A DataTemplate must be applied to a ContentPresenter 
            if (!(templatedParent instanceof ContentPresenter))
            { 
                throw new ArgumentException(/*SR.Get(SRID.TemplateTargetTypeMismatch, "ContentPresenter", templatedParent.GetType().Name)*/); 
            }
        } 

//        #endregion Protected Methods
//
//        #region Data 

        private Object                  _dataType; 
        private TriggerCollection       _triggers; 

//        #endregion Data 
    }
