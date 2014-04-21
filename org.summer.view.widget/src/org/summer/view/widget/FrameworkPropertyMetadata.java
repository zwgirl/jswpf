package org.summer.view.widget;

import org.summer.view.widget.data.BindingOperations;
import org.summer.view.widget.data.UpdateSourceTrigger;
import org.summer.view.widget.threading.InvalidEnumArgumentException;

public class FrameworkPropertyMetadata extends UIPropertyMetadata
    {
        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
        /// </summary> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata()
        {
        	super() ;
            Initialize();
        }
 
        /// <summary>
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary> 
        /// <param name="defaultValue">Default value of property</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue)
        {
        	super(defaultValue);
            Initialize(); 
        }
 
        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
        /// </summary> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public FrameworkPropertyMetadata(PropertyChangedCallback propertyChangedCallback)            
        {
        	super(propertyChangedCallback) ;
            Initialize(); 
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
        /// </summary>
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public FrameworkPropertyMetadata(PropertyChangedCallback propertyChangedCallback, 
                                            CoerceValueCallback coerceValueCallback) 
        { 
        	super(propertyChangedCallback);
            Initialize();
            CoerceValueCallback = coerceValueCallback;
        }
 
        /// <summary>
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary> 
        /// <param name="defaultValue">Default value of property</param>
        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public FrameworkPropertyMetadata(Object defaultValue,
                                         PropertyChangedCallback propertyChangedCallback)
        {
        	super(defaultValue, propertyChangedCallback) ;
            Initialize(); 
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
        /// </summary>
        /// <param name="defaultValue">Default value of property</param>
        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
        /// <param name="coerceValueCallback">Called on update of value</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue, 
                                PropertyChangedCallback propertyChangedCallback,
                                CoerceValueCallback coerceValueCallback)
        {
        	super(defaultValue, propertyChangedCallback, coerceValueCallback);
            Initialize();
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary>
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="flags">Metadata option flags</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
        public FrameworkPropertyMetadata(Object defaultValue, FrameworkPropertyMetadataOptions flags) 
        {
        	super(defaultValue);
            TranslateFlags(flags); 
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
        /// </summary>
        /// <param name="defaultValue">Default value of property</param>
        /// <param name="flags">Metadata option flags</param> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue, 
                                         FrameworkPropertyMetadataOptions flags,
                                         PropertyChangedCallback propertyChangedCallback)
        {
        	super(defaultValue, propertyChangedCallback);
            TranslateFlags(flags);
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary>
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="flags">Metadata option flags</param>
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue,
                                         FrameworkPropertyMetadataOptions flags, 
                                         PropertyChangedCallback propertyChangedCallback, 
                                         CoerceValueCallback coerceValueCallback) 
        {
        	super(defaultValue, propertyChangedCallback, coerceValueCallback); 
            TranslateFlags(flags);
        }
 
        /// <summary>
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary> 
        /// <param name="defaultValue">Default value of property</param>
        /// <param name="flags">Metadata option flags</param> 
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param>
        /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue,
                                         FrameworkPropertyMetadataOptions flags, 
                                         PropertyChangedCallback propertyChangedCallback, 
                                         CoerceValueCallback coerceValueCallback,
                                         boolean isAnimationProhibited) 
        {
        	super(defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited);
            TranslateFlags(flags);
        } 

        /// <summary> 
        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
        /// </summary>
        /// <param name="defaultValue">Default value of property</param> 
        /// <param name="flags">Metadata option flags</param>
        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
        /// <param name="coerceValueCallback">Called on update of value</param>
        /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param> 
        /// <param name="defaultUpdateSourceTrigger">The UpdateSourceTrigger to use for bindings that have UpdateSourceTriger=Default.</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
        public FrameworkPropertyMetadata(Object defaultValue, 
                                         FrameworkPropertyMetadataOptions flags,
                                         PropertyChangedCallback propertyChangedCallback, 
                                         CoerceValueCallback coerceValueCallback,
                                         boolean isAnimationProhibited,
                                         UpdateSourceTrigger defaultUpdateSourceTrigger) 
        {
        	super(defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited) ;
            if (!BindingOperations.IsValidUpdateSourceTrigger(defaultUpdateSourceTrigger)) 
                throw new InvalidEnumArgumentException("defaultUpdateSourceTrigger", (int) defaultUpdateSourceTrigger, typeof(UpdateSourceTrigger)); 
            if (defaultUpdateSourceTrigger == UpdateSourceTrigger.Default)
                throw new ArgumentException(/*SR.Get(SRID.NoDefaultUpdateSourceTrigger),*/ "defaultUpdateSourceTrigger"); 

            TranslateFlags(flags);
            DefaultUpdateSourceTrigger = defaultUpdateSourceTrigger;
        } 

        private void Initialize() 
        { 
            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
            _flags = (MetadataFlags)(((int)_flags & 0x3FFFFFFF) | ((int) UpdateSourceTrigger.PropertyChanged) << 30);
        }

        private static boolean IsFlagSet(FrameworkPropertyMetadataOptions flag, FrameworkPropertyMetadataOptions flags) 
        {
            return (flags & flag) != 0; 
        } 

        private void TranslateFlags(FrameworkPropertyMetadataOptions flags) 
        {
            Initialize();

            // Convert flags to state sets. If a flag is set, then, 
            // the value is set on the respective property. Otherwise,
            // the state remains unset 
 
            // This means that state is cumulative across base classes
            // on a merge where appropriate 

            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsMeasure, flags))
            {
                AffectsMeasure = true; 
            }
 
            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsArrange, flags)) 
            {
                AffectsArrange = true; 
            }

            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentMeasure, flags))
            { 
                AffectsParentMeasure = true;
            } 
 
            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentArrange, flags))
            { 
                AffectsParentArrange = true;
            }

            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsRender, flags)) 
            {
                AffectsRender = true; 
            } 

            if (IsFlagSet(FrameworkPropertyMetadataOptions.Inherits, flags)) 
            {
                IsInherited = true;
            }
 
            if (IsFlagSet(FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior, flags))
            { 
                OverridesInheritanceBehavior = true; 
            }
 
            if (IsFlagSet(FrameworkPropertyMetadataOptions.NotDataBindable, flags))
            {
                IsNotDataBindable = true;
            } 

            if (IsFlagSet(FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, flags)) 
            { 
                BindsTwoWayByDefault = true;
            } 

            if (IsFlagSet(FrameworkPropertyMetadataOptions.Journal, flags))
            {
                Journal = true; 
            }
 
            if (IsFlagSet(FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender, flags)) 
            {
                SubPropertiesDoNotAffectRender = true; 
            }
        }

        /// <summary> 
        ///     Property affects measurement
        /// </summary> 
        public boolean AffectsMeasure 
        {
            get { return ReadFlag(MetadataFlags.FW_AffectsMeasureID); } 
            set
            {
                if (IsSealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                } 
 
                WriteFlag(MetadataFlags.FW_AffectsMeasureID, value);
            } 
        }

        /// <summary>
        ///     Property affects arragement 
        /// </summary>
        public boolean AffectsArrange 
        { 
            get { return ReadFlag(MetadataFlags.FW_AffectsArrangeID); }
            set 
            {
                if (IsSealed)
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
                }
 
                WriteFlag(MetadataFlags.FW_AffectsArrangeID, value); 
            }
        } 

        /// <summary>
        ///     Property affects parent's measurement
        /// </summary> 
        public boolean AffectsParentMeasure
        { 
            get { return ReadFlag(MetadataFlags.FW_AffectsParentMeasureID); } 
            set
            { 
                if (IsSealed)
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                } 

                WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, value); 
            } 
        }
 
        /// <summary>
        ///     Property affects parent's arrangement
        /// </summary>
        public boolean AffectsParentArrange 
        {
            get { return ReadFlag(MetadataFlags.FW_AffectsParentArrangeID); } 
            set 
            {
                if (IsSealed) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                }
 
                WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, value);
            } 
        } 

        /// <summary> 
        ///     Property affects rendering
        /// </summary>
        public boolean AffectsRender
        { 
            get { return ReadFlag(MetadataFlags.FW_AffectsRenderID); }
            set 
            { 
                if (IsSealed)
                { 
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                }

                WriteFlag(MetadataFlags.FW_AffectsRenderID, value); 
            }
        } 
 
        /// <summary>
        ///     Property is inheritable 
        /// </summary>
        public boolean Inherits
        {
            get { return IsInherited; } 
            set
            { 
                if (IsSealed) 
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
                }

                IsInherited = value;
 
                SetModified(MetadataFlags.FW_InheritsModifiedID);
            } 
        } 

        /// <summary> 
        ///     Property evaluation must span separated trees
        /// </summary>
        public boolean OverridesInheritanceBehavior
        { 
            get { return ReadFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID); }
            set 
            { 
                if (IsSealed)
                { 
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/);
                }

                WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, value); 

                SetModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID); 
            } 
        }
 
        /// <summary>
        ///     Property cannot be data-bound
        /// </summary>
        public boolean IsNotDataBindable 
        {
            get { return ReadFlag(MetadataFlags.FW_IsNotDataBindableID); } 
            set 
            {
                if (IsSealed) 
                {
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/);
                }
 
                WriteFlag(MetadataFlags.FW_IsNotDataBindableID, value);
            } 
        } 

        /// <summary> 
        ///     Data bindings on this property default to two-way
        /// </summary>
        public boolean BindsTwoWayByDefault
        { 
            get { return ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID); }
            set 
            { 
                if (IsSealed)
                { 
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/);
                }

                WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, value); 
            }
        } 
 
        /// <summary>
        ///    The default UpdateSourceTrigger for two-way data bindings on this property. 
        /// </summary>
        public UpdateSourceTrigger DefaultUpdateSourceTrigger
        {
            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
            get { return (UpdateSourceTrigger) (((int) _flags >> 30) & 0x3); } 
            set 
            {
                if (IsSealed) 
                {
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/);
                }
                if (!BindingOperations.IsValidUpdateSourceTrigger(value)) 
                    throw new InvalidEnumArgumentException("value", (int) value, typeof(UpdateSourceTrigger));
                if (value == UpdateSourceTrigger.Default) 
                    throw new ArgumentException(/*SR.Get(SRID.NoDefaultUpdateSourceTrigger), "value"*/); 

                // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
                // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
                _flags = (MetadataFlags)(((int) _flags & 0x3FFFFFFF) | ((int) value) << 30);
                SetModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID);
            } 
        }
 
 
        /// <summary>
        ///     The value of this property should be saved/restored when journaling by URI 
        /// </summary>
        public boolean Journal
        {
            get { return ReadFlag(MetadataFlags.FW_ShouldBeJournaledID); } 
            set
            { 
                if (IsSealed) 
                {
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/); 
                }

                WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, value);
 
                SetModified(MetadataFlags.FW_ShouldBeJournaledModifiedID);
            } 
        } 

        /// <summary> 
        ///     This property's subproperties do not affect rendering.
        ///     For instance, a property X may have a subproperty Y.
        ///     Changing X.Y does not require rendering to be updated.
        /// </summary> 
        public boolean SubPropertiesDoNotAffectRender
        { 
            get { return ReadFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID); } 
            set
            { 
                if (IsSealed)
                {
                    throw new InvalidOperationException(/*SR.Get(SRID.TypeMetadataCannotChangeAfterUse)*/);
                } 

                WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, value); 
 
                SetModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID);
            } 
        }

        /// <summary>
        ///     Does the represent the metadata for a ReadOnly property 
        /// </summary>
        private boolean ReadOnly 
        { 
            get { return ReadFlag(MetadataFlags.FW_ReadOnlyID); }
            set 
            {
                if (IsSealed)
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
                }
 
                WriteFlag(MetadataFlags.FW_ReadOnlyID, value); 
            }
        } 

        /// <summary>
        ///     Creates a new instance of this property metadata.  This method is used
        ///     when metadata needs to be cloned.  After CreateInstance is called the 
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must this and return a new instance of 
        ///     themselves. 
        /// </summary>
        PropertyMetadata CreateInstance() { 
            return new FrameworkPropertyMetadata();
        }

        /// <summary> 
        ///     Merge set source state into this
        /// </summary> 
        /// <remarks> 
        ///     Used when overriding metadata
        /// </remarks> 
        /// <param name="baseMetadata">Base metadata to merge</param>
        /// <param name="dp">DependencyProperty that this metadata is being applied to</param>
        protected void Merge(PropertyMetadata baseMetadata, DependencyProperty dp)
        { 
            // Does parameter validation
            super.Merge(baseMetadata, dp); 
 
            // Source type is guaranteed to be the same type or base type
            FrameworkPropertyMetadata fbaseMetadata = baseMetadata as FrameworkPropertyMetadata; 
            if (fbaseMetadata != null)
            {
                // Merge source metadata into this
 
                // Modify metadata merge state fields directly (not through accessors
                // so that "modified" bits remain intact 
 
                // Merge state
                // Defaults to false, derived classes can only enable 
                WriteFlag(MetadataFlags.FW_AffectsMeasureID, ReadFlag(MetadataFlags.FW_AffectsMeasureID) | fbaseMetadata.AffectsMeasure);
                WriteFlag(MetadataFlags.FW_AffectsArrangeID, ReadFlag(MetadataFlags.FW_AffectsArrangeID) | fbaseMetadata.AffectsArrange);
                WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, ReadFlag(MetadataFlags.FW_AffectsParentMeasureID) | fbaseMetadata.AffectsParentMeasure);
                WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, ReadFlag(MetadataFlags.FW_AffectsParentArrangeID) | fbaseMetadata.AffectsParentArrange); 
                WriteFlag(MetadataFlags.FW_AffectsRenderID, ReadFlag(MetadataFlags.FW_AffectsRenderID) | fbaseMetadata.AffectsRender);
                WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID) | fbaseMetadata.BindsTwoWayByDefault); 
                WriteFlag(MetadataFlags.FW_IsNotDataBindableID, ReadFlag(MetadataFlags.FW_IsNotDataBindableID) | fbaseMetadata.IsNotDataBindable); 

                // Override state 
                if (!IsModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID))
                {
                    WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, fbaseMetadata.SubPropertiesDoNotAffectRender);
                } 

                if (!IsModified(MetadataFlags.FW_InheritsModifiedID)) 
                { 
                    IsInherited = fbaseMetadata.Inherits;
                } 

                if (!IsModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID))
                {
                    WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, fbaseMetadata.OverridesInheritanceBehavior); 
                }
 
                if (!IsModified(MetadataFlags.FW_ShouldBeJournaledModifiedID)) 
                {
                    WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, fbaseMetadata.Journal); 
                }

                if (!IsModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID))
                { 
                    // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
                    // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
                    _flags = (MetadataFlags)(((int)_flags & 0x3FFFFFFF) | ((int) fbaseMetadata.DefaultUpdateSourceTrigger) << 30); 
                }
            } 
        }


        /// <summary> 
        ///     Notification that this metadata has been applied to a property
        ///     and the metadata is being sealed 
        /// </summary> 
        /// <remarks>
        ///     Normally, any mutability of the data structure should be marked 
        ///     as immutable at this point
        /// </remarks>
        /// <param name="dp">DependencyProperty</param>
        /// <param name="targetType">Type associating metadata (null if default metadata)</param> 
        protected void OnApply(DependencyProperty dp, Type targetType)
        { 
            // Remember if this is the metadata for a ReadOnly property 
            ReadOnly = dp.ReadOnly;
 
            super.OnApply(dp, targetType);
        }

 
        /// <summary>
        ///     Determines if data binding is supported 
        /// </summary> 
        /// <remarks>
        ///     Data binding is not allowed if a property read-only, regardless 
        ///     of the value of the IsNotDataBindable flag
        /// </remarks>
        public boolean IsDataBindingAllowed
        { 
            get { return !ReadFlag(MetadataFlags.FW_IsNotDataBindableID) && !ReadOnly; }
        } 
 
        void SetModified(MetadataFlags id) { WriteFlag(id, true); }
        boolean IsModified(MetadataFlags id) { return ReadFlag(id); } 
    }