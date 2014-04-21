package org.summer.view.widget;
/// <summary> 
    ///     Metadata for supported UI features
    /// </summary>
    public class UIPropertyMetadata extends PropertyMetadata
    { 
        /// <summary>
        ///     UI metadata construction 
        /// </summary> 
        public UIPropertyMetadata() 
        {
            super();
        }

        /// <summary> 
        ///     UI metadata construction
        /// </summary> 
        /// <param name="defaultValue">Default value of property</param> 
        public UIPropertyMetadata(Object defaultValue)      
        {
        	 super(defaultValue);
        }

        /// <summary> 
        ///     UI metadata construction
        /// </summary> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
        public UIPropertyMetadata(PropertyChangedCallback propertyChangedCallback)
        {
        	super(propertyChangedCallback);
        }

        /// <summary> 
        ///     UI metadata construction
        /// </summary> 
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        public UIPropertyMetadata(Object defaultValue, 
                                  PropertyChangedCallback propertyChangedCallback) 
            
        {
        	super(defaultValue, propertyChangedCallback);
        } 

        /// <summary> 
        ///     UI metadata construction 
        /// </summary>
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param>
        public UIPropertyMetadata(Object defaultValue,
                                PropertyChangedCallback propertyChangedCallback, 
                                CoerceValueCallback coerceValueCallback) 
            
        { 
        	super(defaultValue, propertyChangedCallback, coerceValueCallback) ;
        }
 
        /// <summary>
        ///     UI metadata construction
        /// </summary>
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param> 
        /// <param name="isAnimationProhibited">Should animation be prohibited?</param> 
        public UIPropertyMetadata(Object defaultValue,
                                PropertyChangedCallback propertyChangedCallback, 
                                CoerceValueCallback coerceValueCallback,
                                boolean isAnimationProhibited) 
        { 
        	super(defaultValue, propertyChangedCallback, coerceValueCallback);
            WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, isAnimationProhibited);
        } 
 

        /// <summary> 
        ///     Creates a new instance of this property metadata.  This method is used
        ///     when metadata needs to be cloned.  After CreateInstance is called the
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must this and return a new instance of 
        ///     themselves.
        /// </summary> 
        PropertyMetadata CreateInstance() { 
            return new UIPropertyMetadata();
        } 

        /// <summary>
        /// Set this to true for a property for which animation should be
        /// prohibited. This should not be set unless there are very strong 
        /// technical reasons why a property can not be animated. In the
        /// vast majority of cases, a property that can not be properly 
        /// animated means that the property implementation contains a bug. 
        /// </summary>
        public boolean IsAnimationProhibited 
        {
            get
            {
                return ReadFlag(MetadataFlags.UI_IsAnimationProhibitedID); 
            }
            set 
            { 
                if (Sealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                }

                WriteFlag(MetadataFlags.UI_IsAnimationProhibitedID, value); 
            }
        } 
    }