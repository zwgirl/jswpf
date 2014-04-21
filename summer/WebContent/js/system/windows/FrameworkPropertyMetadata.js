/**
 * FrameworkPropertyMetadata
 */

define(["dojo/_base/declare", "system/Type", 
        "windows/UIPropertyMetadata", "windows/FrameworkPropertyMetadataOptions", "data/UpdateSourceTrigger"], 
        function(declare, Type, 
        		UIPropertyMetadata, FrameworkPropertyMetadataOptions, UpdateSourceTrigger){
	
	var MetadataFlags = UIPropertyMetadata.MetadataFlags;
	var FrameworkPropertyMetadata = declare("FrameworkPropertyMetadata", UIPropertyMetadata, {
		constructor:function( ){

		},
		
        /*private void */
		Initialize:function() 
        { 
            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
            this._flags = /*(MetadataFlags)*/((/*(uint)*/this._flags & 0x3FFFFFFF) | (/*(uint)*/ UpdateSourceTrigger.PropertyChanged) << 30);
        },
        

        /*private static bool */
        IsFlagSet:function(/*FrameworkPropertyMetadataOptions*/ flag, /*FrameworkPropertyMetadataOptions*/ flags) 
        {
            return (flags & flag) != 0; 
        },


        
        /*private void */
        TranslateFlags:function(/*FrameworkPropertyMetadataOptions*/ flags) 
        {
            this.Initialize();

            // Convert flags to state sets. If a flag is set, then, 
            // the value is set on the respective property. Otherwise,
            // the state remains unset 
 
            // This means that state is cumulative across base classes
            // on a merge where appropriate 

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.AffectsMeasure, flags))
            {
            	this.AffectsMeasure = true; 
            }
 
            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.AffectsArrange, flags)) 
            {
            	this.AffectsArrange = true; 
            }

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentMeasure, flags))
            { 
            	this.AffectsParentMeasure = true;
            } 
 
            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentArrange, flags))
            { 
                this.AffectsParentArrange = true;
            }

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.AffectsRender, flags)) 
            {
            	this.AffectsRender = true; 
            } 

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.Inherits, flags)) 
            {
            	this.IsInherited = true;
            }
 
            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior, flags))
            { 
            	this.OverridesInheritanceBehavior = true; 
            }
 
            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.NotDataBindable, flags))
            {
            	this.IsNotDataBindable = true;
            } 

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, flags)) 
            { 
            	this.BindsTwoWayByDefault = true;
            } 

            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.Journal, flags))
            {
            	this.Journal = true; 
            }
 
            if (this.IsFlagSet(FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender, flags)) 
            {
            	this.SubPropertiesDoNotAffectRender = true; 
            }
        },
        

        /// <summary>
        ///     Creates a new instance of this property metadata.  This method is used
        ///     when metadata needs to be cloned.  After CreateInstance is called the 
        ///     framework will call Merge to merge metadata into the new instance.
        ///     Deriving classes must override this and return a new instance of 
        ///     themselves. 
        /// </summary>
        /*internal override PropertyMetadata */
        CreateInstance:function() { 
            return new FrameworkPropertyMetadata();
        },

        /// <summary> 
        ///     Merge set source state into this
        /// </summary> 
        /// <remarks> 
        ///     Used when overriding metadata
        /// </remarks> 
        /// <param name="baseMetadata">Base metadata to merge</param>
        /// <param name="dp">DependencyProperty that this metadata is being applied to</param>
        /*protected override void*/ 
        Merge:function(/*PropertyMetadata*/ baseMetadata, /*DependencyProperty*/ dp)
        { 
            // Does parameter validation
            UIPropertyMetadata.prototype.Merge.call(this, baseMetadata, dp); 
 
            // Source type is guaranteed to be the same type or base type
            var fbaseMetadata = baseMetadata instanceof FrameworkPropertyMetadata ? baseMetadata : null; 
            if (fbaseMetadata != null)
            {
                // Merge source metadata into this
 
                // Modify metadata merge state fields directly (not through accessors
                // so that "modified" bits remain intact 
 
                // Merge state
                // Defaults to false, derived classes can only enable 
                this.WriteFlag(MetadataFlags.FW_AffectsMeasureID, this.ReadFlag(MetadataFlags.FW_AffectsMeasureID) | fbaseMetadata.AffectsMeasure);
                this.WriteFlag(MetadataFlags.FW_AffectsArrangeID, this.ReadFlag(MetadataFlags.FW_AffectsArrangeID) | fbaseMetadata.AffectsArrange);
                this.WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, this.ReadFlag(MetadataFlags.FW_AffectsParentMeasureID) | fbaseMetadata.AffectsParentMeasure);
                this.WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, this.ReadFlag(MetadataFlags.FW_AffectsParentArrangeID) | fbaseMetadata.AffectsParentArrange); 
                this.WriteFlag(MetadataFlags.FW_AffectsRenderID, this.ReadFlag(MetadataFlags.FW_AffectsRenderID) | fbaseMetadata.AffectsRender);
                this.WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, this.ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID) | fbaseMetadata.BindsTwoWayByDefault); 
                this.WriteFlag(MetadataFlags.FW_IsNotDataBindableID, this.ReadFlag(MetadataFlags.FW_IsNotDataBindableID) | fbaseMetadata.IsNotDataBindable); 

                // Override state 
                if (!this.IsModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID))
                {
                	this.WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, fbaseMetadata.SubPropertiesDoNotAffectRender);
                } 

                if (!this.IsModified(MetadataFlags.FW_InheritsModifiedID)) 
                { 
                	this.IsInherited = fbaseMetadata.Inherits;
                } 

                if (!this.IsModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID))
                {
                	this.WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, fbaseMetadata.OverridesInheritanceBehavior); 
                }
 
                if (!this.IsModified(MetadataFlags.FW_ShouldBeJournaledModifiedID)) 
                {
                	this.WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, fbaseMetadata.Journal); 
                }

                if (!this.IsModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID))
                { 
                    // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
                    // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
                	this._flags = /*(MetadataFlags)*/((/*(uint)*/this._flags & 0x3FFFFFFF) | (/*(uint)*/ fbaseMetadata.DefaultUpdateSourceTrigger) << 30); 
                }
            } 
        },


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
        /*protected override void*/ 
        OnApply:function(/*DependencyProperty*/ dp, /*Type*/ targetType)
        { 
            // Remember if this is the metadata for a ReadOnly property 
            this.ReadOnly = dp.ReadOnly;
 
            UIPropertyMetadata.prototype.OnApply.call(this, dp, targetType);
        },
        
        
        /*internal void */SetModified:function(/*MetadataFlags*/ id) { this.WriteFlag(id, true); },
        /*internal bool*/ IsModified:function(/*MetadataFlags*/ id) { return this.ReadFlag(id); } 
	});
	
	Object.defineProperties(FrameworkPropertyMetadata.prototype,{

        /// <summary> 
        ///     Property affects measurement
        /// </summary> 
        /*public bool */
		AffectsMeasure: 
        {
            get:function() { return this.ReadFlag(MetadataFlags.FW_AffectsMeasureID); }, 
            set:function(value)
            {
                if (this.IsSealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                } 
 
                this.WriteFlag(MetadataFlags.FW_AffectsMeasureID, value);
            } 
        },

        /// <summary>
        ///     Property affects arragement 
        /// </summary>
        /*public bool */
        AffectsArrange: 
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_AffectsArrangeID); },
            set:function(value) 
            {
                if (this.IsSealed)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)'); 
                }
 
                this.WriteFlag(MetadataFlags.FW_AffectsArrangeID, value); 
            }
        }, 

        /// <summary>
        ///     Property affects parent's measurement
        /// </summary> 
        /*public bool */
        AffectsParentMeasure:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_AffectsParentMeasureID); }, 
            set:function(value)
            { 
                if (this.IsSealed)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                } 

                this.WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, value); 
            } 
        },
 
        /// <summary>
        ///     Property affects parent's arrangement
        /// </summary>
        /*public bool */
        AffectsParentArrange: 
        {
            get:function() { return this.ReadFlag(MetadataFlags.FW_AffectsParentArrangeID); }, 
            set:function(value) 
            {
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }
 
                this.WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, value);
            } 
        }, 

        /// <summary> 
        ///     Property affects rendering
        /// </summary>
        /*public bool */
        AffectsRender:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_AffectsRenderID); },
            set:function(value) 
            { 
                if (this.IsSealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }

                this.WriteFlag(MetadataFlags.FW_AffectsRenderID, value); 
            }
        } ,
 
        /// <summary>
        ///     Property is inheritable 
        /// </summary>
        /*public bool */
        Inherits:
        {
            get:function() { return this.IsInherited; }, 
            set:function(value)
            { 
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)'); 
                }

                this.IsInherited = value;
 
                this.SetModified(MetadataFlags.FW_InheritsModifiedID);
            } 
        },

        /// <summary> 
        ///     Property evaluation must span separated trees
        /// </summary>
        /*public bool */
        OverridesInheritanceBehavior:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID); },
            set:function(value) 
            { 
                if (this.IsSealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }

                this.WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, value); 

                this.SetModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID); 
            } 
        },
 
        /// <summary>
        ///     Property cannot be data-bound
        /// </summary>
        /*public bool */
        IsNotDataBindable: 
        {
            get:function() { return this.ReadFlag(MetadataFlags.FW_IsNotDataBindableID); }, 
            set:function(value) 
            {
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }
 
                this.WriteFlag(MetadataFlags.FW_IsNotDataBindableID, value);
            } 
        }, 

        /// <summary> 
        ///     Data bindings on this property default to two-way
        /// </summary>
        /*public bool */
        BindsTwoWayByDefault:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID); },
            set:function(value) 
            { 
                if (this.IsSealed)
                { 
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }

                this.WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, value); 
            }
        },
 
        /// <summary>
        ///    The default UpdateSourceTrigger for two-way data bindings on this property. 
        /// </summary>
        /*public UpdateSourceTrigger*/ 
        DefaultUpdateSourceTrigger:
        {
            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
            get:function() { return /*(UpdateSourceTrigger)*/ ((/*(uint)*/ this._flags >> 30) & 0x3); }, 
            set:function(value) 
            {
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)');
                }
                if (!BindingOperations.IsValidUpdateSourceTrigger(value)) 
                    throw new Error('InvalidEnumArgumentException("value", (int) value, typeof(UpdateSourceTrigger)');
                if (value == UpdateSourceTrigger.Default) 
                    throw new Error('ArgumentException(SR.Get(SRID.NoDefaultUpdateSourceTrigger), "value")'); 

                // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
                // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
                this._flags = /*(MetadataFlags)*/((/*(uint)*/ this._flags & 0x3FFFFFFF) | (/*(uint)*/ value) << 30);
                this.SetModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID);
            } 
        },
 
 
        /// <summary>
        ///     The value of this property should be saved/restored when journaling by URI 
        /// </summary>
        /*public bool*/ 
        Journal:
        {
            get:function() { return this.ReadFlag(MetadataFlags.FW_ShouldBeJournaledID); }, 
            set:function(value)
            { 
                if (this.IsSealed) 
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)'); 
                }

                this.WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, value);
 
                this.SetModified(MetadataFlags.FW_ShouldBeJournaledModifiedID);
            } 
        }, 

        /// <summary> 
        ///     This property's subproperties do not affect rendering.
        ///     For instance, a property X may have a subproperty Y.
        ///     Changing X.Y does not require rendering to be updated.
        /// </summary> 
        /*public bool */
        SubPropertiesDoNotAffectRender:
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID); }, 
            set:function(value)
            { 
                if (this.IsSealed)
                {
                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
                } 

                this.WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, value); 
 
                this.SetModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID);
            } 
        },

        /// <summary>
        ///     Does the represent the metadata for a ReadOnly property 
        /// </summary>
        /*private bool*/ 
        ReadOnly: 
        { 
            get:function() { return this.ReadFlag(MetadataFlags.FW_ReadOnlyID); },
            set:function(value) 
            {
                if (this.IsSealed)
                {
                    throw new Error('InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)'); 
                }
 
                this.WriteFlag(MetadataFlags.FW_ReadOnlyID, value); 
            }
        },
        

        
        /// <summary>
        ///     Determines if data binding is supported 
        /// </summary> 
        /// <remarks>
        ///     Data binding is not allowed if a property read-only, regardless 
        ///     of the value of the IsNotDataBindable flag
        /// </remarks>
        /*public bool */
        IsDataBindingAllowed:
        { 
            get:function() { return !this.ReadFlag(MetadataFlags.FW_IsNotDataBindableID) && !this.ReadOnly; }
        }
	});
	
    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size.
    /// </summary> 
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.Build = function() 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.Init.call(result);
    	result.Initialize();
        return result;
    };

    /// <summary>
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary> 
    /// <param name="defaultValue">Default value of property</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.BuildWithDV = function(/*object*/ defaultValue) 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithDV.call(result, defaultValue);
    	result.Initialize(); 
        return result;
    };

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size.
    /// </summary> 
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//    public 
    FrameworkPropertyMetadata.BuildWithPCCB = function(/*PropertyChangedCallback*/ propertyChangedCallback) 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithPCCB.call(result, propertyChangedCallback);
    	result.Initialize(); 
    	
    	return result;
    }; 

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size.
    /// </summary>
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
    /// <param name="coerceValueCallback">Called on update of value</param> 
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//    public 
    FrameworkPropertyMetadata.BuildWithPCCBandCVCB = function(/*PropertyChangedCallback*/ propertyChangedCallback, 
                                        /*CoerceValueCallback*/ coerceValueCallback) 
    { 
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithPCCB.call(result, propertyChangedCallback);
        result.Initialize();
        result.CoerceValueCallback = coerceValueCallback;
        return result;
    };

    /// <summary>
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary> 
    /// <param name="defaultValue">Default value of property</param>
    /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//    public 
    FrameworkPropertyMetadata.BuildWithDVandPCCB = function(/*object*/ defaultValue,
                                     /*PropertyChangedCallback*/ propertyChangedCallback) 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithDVandPCCB.call(result, defaultValue, propertyChangedCallback);
        result.Initialize(); 
        return result;
    };

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size.
    /// </summary>
    /// <param name="defaultValue">Default value of property</param>
    /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
    /// <param name="coerceValueCallback">Called on update of value</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.Build3CVCB = function(/*object*/ defaultValue, 
                            /*PropertyChangedCallback*/ propertyChangedCallback,
                            /*CoerceValueCallback*/ coerceValueCallback)  
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback);
    	result.Initialize();
        return result;
    };

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary>
    /// <param name="defaultValue">Default value of property</param> 
    /// <param name="flags">Metadata option flags</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//    public 
    FrameworkPropertyMetadata.Build2 = function(/*object*/ defaultValue, /*FrameworkPropertyMetadataOptions*/ flags) 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithDV.call(result, defaultValue);
    	result.TranslateFlags(flags); 
        return result;
    };

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size.
    /// </summary>
    /// <param name="defaultValue">Default value of property</param>
    /// <param name="flags">Metadata option flags</param> 
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.Build3PCCB = function(/*object*/ defaultValue, 
                                     /*FrameworkPropertyMetadataOptions*/ flags,
                                     /*PropertyChangedCallback*/ propertyChangedCallback) 
    {
	    var result = new FrameworkPropertyMetadata();
	    UIPropertyMetadata.prototype.InitWithDVandPCCB.call(result, defaultValue, propertyChangedCallback);
	    
        result.TranslateFlags(flags);
        
        return result;
    };

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary>
    /// <param name="defaultValue">Default value of property</param> 
    /// <param name="flags">Metadata option flags</param>
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
    /// <param name="coerceValueCallback">Called on update of value</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.Build4 = function(/*object*/ defaultValue,
                                     /*FrameworkPropertyMetadataOptions*/ flags, 
                                     /*PropertyChangedCallback*/ propertyChangedCallback, 
                                     /*CoerceValueCallback*/ coerceValueCallback) 
    {
    	var result = new FrameworkPropertyMetadata();
    	UIPropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback);
    	result.TranslateFlags(flags);
    	return result;
    };

    /// <summary>
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary> 
    /// <param name="defaultValue">Default value of property</param>
    /// <param name="flags">Metadata option flags</param> 
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
    /// <param name="coerceValueCallback">Called on update of value</param>
    /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//    public 
    FrameworkPropertyMetadata.Build5 = function(/*object*/ defaultValue,
                                     /*FrameworkPropertyMetadataOptions*/ flags, 
                                     /*PropertyChangedCallback*/ propertyChangedCallback, 
                                     /*CoerceValueCallback*/ coerceValueCallback,
                                     /*bool*/ isAnimationProhibited) 
    {
        var result = new FrameworkPropertyMetadata();
        UIPropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited);
        result.TranslateFlags(flags);
        return result;
    }; 

    /// <summary> 
    ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
    /// </summary>
    /// <param name="defaultValue">Default value of property</param> 
    /// <param name="flags">Metadata option flags</param>
    /// <param name="propertyChangedCallback">Called when the property has been changed</param>
    /// <param name="coerceValueCallback">Called on update of value</param>
    /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param> 
    /// <param name="defaultUpdateSourceTrigger">The UpdateSourceTrigger to use for bindings that have UpdateSourceTriger=Default.</param>
//    [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
    FrameworkPropertyMetadata.Build6 = function(/*object*/ defaultValue, 
                                     /*FrameworkPropertyMetadataOptions*/ flags,
                                     /*PropertyChangedCallback*/ propertyChangedCallback, 
                                     /*CoerceValueCallback*/ coerceValueCallback,
                                     /*bool*/ isAnimationProhibited,
                                     /*UpdateSourceTrigger*/ defaultUpdateSourceTrigger) 
    {
		
        if (!BindingOperations.IsValidUpdateSourceTrigger(defaultUpdateSourceTrigger)) 
            throw new Error('InvalidEnumArgumentException("defaultUpdateSourceTrigger", (int) defaultUpdateSourceTrigger, typeof(UpdateSourceTrigger)'); 
        if (defaultUpdateSourceTrigger == UpdateSourceTrigger.Default)
            throw new Error('ArgumentException(SR.Get(SRID.NoDefaultUpdateSourceTrigger), "defaultUpdateSourceTrigger")'); 

        var result = new FrameworkPropertyMetadata();
        UIPropertyMetadata.prototype.InitWithDVandPCCBandCVCB.call(result, defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited);
        result.TranslateFlags(flags);
        result.DefaultUpdateSourceTrigger = defaultUpdateSourceTrigger;
        return result;
    };


	
	FrameworkPropertyMetadata.Type = new Type("FrameworkPropertyMetadata", FrameworkPropertyMetadata, [UIPropertyMetadata.Type]);
	return FrameworkPropertyMetadata;
});

////---------------------------------------------------------------------------- 
////
//// Copyright (C) Microsoft Corporation.  All rights reserved.
////
////--------------------------------------------------------------------------- 
//
//using MS.Utility; 
//using System; 
//using System.ComponentModel;    // InvalidEnumArgumentException
//using System.Windows.Data;      // UpdateSourceTrigger 
//
//namespace System.Windows
//{
//    /// <summary> 
//    /// </summary>
//    [Flags] 
//    public enum FrameworkPropertyMetadataOptions: int 
//    {
//        /// <summary>No flags</summary> 
//        None                            = 0x000,
//
//        /// <summary>This property affects measurement</summary>
//        AffectsMeasure                  = 0x001, 
//
//        /// <summary>This property affects arragement</summary> 
//        AffectsArrange                  = 0x002, 
//
//        /// <summary>This property affects parent's measurement</summary> 
//        AffectsParentMeasure            = 0x004,
//
//        /// <summary>This property affects parent's arrangement</summary>
//        AffectsParentArrange            = 0x008, 
//
//        /// <summary>This property affects rendering</summary> 
//        AffectsRender                   = 0x010, 
//
//        /// <summary>This property inherits to children</summary> 
//        Inherits                        = 0x020,
//
//        /// <summary>
//        /// This property causes inheritance and resource lookup to override values 
//        /// of InheritanceBehavior that may be set on any FE in the path of lookup
//        /// </summary> 
//        OverridesInheritanceBehavior    = 0x040, 
//
//        /// <summary>This property does not support data binding</summary> 
//        NotDataBindable                 = 0x080,
//
//        /// <summary>Data bindings on this property default to two-way</summary>
//        BindsTwoWayByDefault            = 0x100, 
//
//        /// <summary>This property should be saved/restored when journaling/navigating by URI</summary> 
//        Journal                         = 0x400, 
//
//        /// <summary> 
//        ///     This property's subproperties do not affect rendering.
//        ///     For instance, a property X may have a subproperty Y.
//        ///     Changing X.Y does not require rendering to be updated.
//        /// </summary> 
//        SubPropertiesDoNotAffectRender  = 0x800,
//    } 
// 
//    /// <summary>
//    ///     Metadata for supported Framework features 
//    /// </summary>
//    public class FrameworkPropertyMetadata : UIPropertyMetadata
//    {
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
//        /// </summary> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata() :
//            base() 
//        {
//            Initialize();
//        }
// 
//        /// <summary>
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary> 
//        /// <param name="defaultValue">Default value of property</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue) :
//            base(defaultValue)
//        {
//            Initialize(); 
//        }
// 
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
//        /// </summary> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//        public FrameworkPropertyMetadata(PropertyChangedCallback propertyChangedCallback) :
//            base(propertyChangedCallback) 
//        {
//            Initialize(); 
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
//        /// </summary>
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//        public FrameworkPropertyMetadata(PropertyChangedCallback propertyChangedCallback, 
//                                            CoerceValueCallback coerceValueCallback) : 
//            base(propertyChangedCallback)
//        { 
//            Initialize();
//            CoerceValueCallback = coerceValueCallback;
//        }
// 
//        /// <summary>
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary> 
//        /// <param name="defaultValue">Default value of property</param>
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//        public FrameworkPropertyMetadata(object defaultValue,
//                                         PropertyChangedCallback propertyChangedCallback) :
//            base(defaultValue, propertyChangedCallback) 
//        {
//            Initialize(); 
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param>
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param> 
//        /// <param name="coerceValueCallback">Called on update of value</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue, 
//                                PropertyChangedCallback propertyChangedCallback,
//                                CoerceValueCallback coerceValueCallback) : 
//            base(defaultValue, propertyChangedCallback, coerceValueCallback)
//        {
//            Initialize();
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="flags">Metadata option flags</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)]
//        public FrameworkPropertyMetadata(object defaultValue, FrameworkPropertyMetadataOptions flags) :
//            base(defaultValue) 
//        {
//            TranslateFlags(flags); 
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size.
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param>
//        /// <param name="flags">Metadata option flags</param> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue, 
//                                         FrameworkPropertyMetadataOptions flags,
//                                         PropertyChangedCallback propertyChangedCallback) : 
//            base(defaultValue, propertyChangedCallback)
//        {
//            TranslateFlags(flags);
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="flags">Metadata option flags</param>
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue,
//                                         FrameworkPropertyMetadataOptions flags, 
//                                         PropertyChangedCallback propertyChangedCallback, 
//                                         CoerceValueCallback coerceValueCallback) :
//            base(defaultValue, propertyChangedCallback, coerceValueCallback) 
//        {
//            TranslateFlags(flags);
//        }
// 
//        /// <summary>
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary> 
//        /// <param name="defaultValue">Default value of property</param>
//        /// <param name="flags">Metadata option flags</param> 
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param>
//        /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue,
//                                         FrameworkPropertyMetadataOptions flags, 
//                                         PropertyChangedCallback propertyChangedCallback, 
//                                         CoerceValueCallback coerceValueCallback,
//                                         bool isAnimationProhibited) : 
//            base(defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited)
//        {
//            TranslateFlags(flags);
//        } 
//
//        /// <summary> 
//        ///     Framework type metadata construction.  Marked as no inline to reduce code size. 
//        /// </summary>
//        /// <param name="defaultValue">Default value of property</param> 
//        /// <param name="flags">Metadata option flags</param>
//        /// <param name="propertyChangedCallback">Called when the property has been changed</param>
//        /// <param name="coerceValueCallback">Called on update of value</param>
//        /// <param name="isAnimationProhibited">Should animation of this property be prohibited?</param> 
//        /// <param name="defaultUpdateSourceTrigger">The UpdateSourceTrigger to use for bindings that have UpdateSourceTriger=Default.</param>
//        [System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.NoInlining)] 
//        public FrameworkPropertyMetadata(object defaultValue, 
//                                         FrameworkPropertyMetadataOptions flags,
//                                         PropertyChangedCallback propertyChangedCallback, 
//                                         CoerceValueCallback coerceValueCallback,
//                                         bool isAnimationProhibited,
//                                         UpdateSourceTrigger defaultUpdateSourceTrigger) :
//            base(defaultValue, propertyChangedCallback, coerceValueCallback, isAnimationProhibited) 
//        {
//            if (!BindingOperations.IsValidUpdateSourceTrigger(defaultUpdateSourceTrigger)) 
//                throw new InvalidEnumArgumentException("defaultUpdateSourceTrigger", (int) defaultUpdateSourceTrigger, typeof(UpdateSourceTrigger)); 
//            if (defaultUpdateSourceTrigger == UpdateSourceTrigger.Default)
//                throw new ArgumentException(SR.Get(SRID.NoDefaultUpdateSourceTrigger), "defaultUpdateSourceTrigger"); 
//
//            TranslateFlags(flags);
//            DefaultUpdateSourceTrigger = defaultUpdateSourceTrigger;
//        } 
//
//        private void Initialize() 
//        { 
//            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
//            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
//            _flags = (MetadataFlags)(((uint)_flags & 0x3FFFFFFF) | ((uint) UpdateSourceTrigger.PropertyChanged) << 30);
//        }
//
//        private static bool IsFlagSet(FrameworkPropertyMetadataOptions flag, FrameworkPropertyMetadataOptions flags) 
//        {
//            return (flags & flag) != 0; 
//        } 
//
//        private void TranslateFlags(FrameworkPropertyMetadataOptions flags) 
//        {
//            Initialize();
//
//            // Convert flags to state sets. If a flag is set, then, 
//            // the value is set on the respective property. Otherwise,
//            // the state remains unset 
// 
//            // This means that state is cumulative across base classes
//            // on a merge where appropriate 
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsMeasure, flags))
//            {
//                AffectsMeasure = true; 
//            }
// 
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsArrange, flags)) 
//            {
//                AffectsArrange = true; 
//            }
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentMeasure, flags))
//            { 
//                AffectsParentMeasure = true;
//            } 
// 
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsParentArrange, flags))
//            { 
//                AffectsParentArrange = true;
//            }
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.AffectsRender, flags)) 
//            {
//                AffectsRender = true; 
//            } 
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.Inherits, flags)) 
//            {
//                IsInherited = true;
//            }
// 
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.OverridesInheritanceBehavior, flags))
//            { 
//                OverridesInheritanceBehavior = true; 
//            }
// 
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.NotDataBindable, flags))
//            {
//                IsNotDataBindable = true;
//            } 
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, flags)) 
//            { 
//                BindsTwoWayByDefault = true;
//            } 
//
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.Journal, flags))
//            {
//                Journal = true; 
//            }
// 
//            if (IsFlagSet(FrameworkPropertyMetadataOptions.SubPropertiesDoNotAffectRender, flags)) 
//            {
//                SubPropertiesDoNotAffectRender = true; 
//            }
//        }
//
//        /// <summary> 
//        ///     Property affects measurement
//        /// </summary> 
//        public bool AffectsMeasure 
//        {
//            get { return ReadFlag(MetadataFlags.FW_AffectsMeasureID); } 
//            set
//            {
//                if (IsSealed)
//                { 
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                } 
// 
//                WriteFlag(MetadataFlags.FW_AffectsMeasureID, value);
//            } 
//        }
//
//        /// <summary>
//        ///     Property affects arragement 
//        /// </summary>
//        public bool AffectsArrange 
//        { 
//            get { return ReadFlag(MetadataFlags.FW_AffectsArrangeID); }
//            set 
//            {
//                if (IsSealed)
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
//                }
// 
//                WriteFlag(MetadataFlags.FW_AffectsArrangeID, value); 
//            }
//        } 
//
//        /// <summary>
//        ///     Property affects parent's measurement
//        /// </summary> 
//        public bool AffectsParentMeasure
//        { 
//            get { return ReadFlag(MetadataFlags.FW_AffectsParentMeasureID); } 
//            set
//            { 
//                if (IsSealed)
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                } 
//
//                WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, value); 
//            } 
//        }
// 
//        /// <summary>
//        ///     Property affects parent's arrangement
//        /// </summary>
//        public bool AffectsParentArrange 
//        {
//            get { return ReadFlag(MetadataFlags.FW_AffectsParentArrangeID); } 
//            set 
//            {
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
// 
//                WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, value);
//            } 
//        } 
//
//        /// <summary> 
//        ///     Property affects rendering
//        /// </summary>
//        public bool AffectsRender
//        { 
//            get { return ReadFlag(MetadataFlags.FW_AffectsRenderID); }
//            set 
//            { 
//                if (IsSealed)
//                { 
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
//
//                WriteFlag(MetadataFlags.FW_AffectsRenderID, value); 
//            }
//        } 
// 
//        /// <summary>
//        ///     Property is inheritable 
//        /// </summary>
//        public bool Inherits
//        {
//            get { return IsInherited; } 
//            set
//            { 
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
//                }
//
//                IsInherited = value;
// 
//                SetModified(MetadataFlags.FW_InheritsModifiedID);
//            } 
//        } 
//
//        /// <summary> 
//        ///     Property evaluation must span separated trees
//        /// </summary>
//        public bool OverridesInheritanceBehavior
//        { 
//            get { return ReadFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID); }
//            set 
//            { 
//                if (IsSealed)
//                { 
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
//
//                WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, value); 
//
//                SetModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID); 
//            } 
//        }
// 
//        /// <summary>
//        ///     Property cannot be data-bound
//        /// </summary>
//        public bool IsNotDataBindable 
//        {
//            get { return ReadFlag(MetadataFlags.FW_IsNotDataBindableID); } 
//            set 
//            {
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
// 
//                WriteFlag(MetadataFlags.FW_IsNotDataBindableID, value);
//            } 
//        } 
//
//        /// <summary> 
//        ///     Data bindings on this property default to two-way
//        /// </summary>
//        public bool BindsTwoWayByDefault
//        { 
//            get { return ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID); }
//            set 
//            { 
//                if (IsSealed)
//                { 
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
//
//                WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, value); 
//            }
//        } 
// 
//        /// <summary>
//        ///    The default UpdateSourceTrigger for two-way data bindings on this property. 
//        /// </summary>
//        public UpdateSourceTrigger DefaultUpdateSourceTrigger
//        {
//            // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
//            // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
//            get { return (UpdateSourceTrigger) (((uint) _flags >> 30) & 0x3); } 
//            set 
//            {
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                }
//                if (!BindingOperations.IsValidUpdateSourceTrigger(value)) 
//                    throw new InvalidEnumArgumentException("value", (int) value, typeof(UpdateSourceTrigger));
//                if (value == UpdateSourceTrigger.Default) 
//                    throw new ArgumentException(SR.Get(SRID.NoDefaultUpdateSourceTrigger), "value"); 
//
//                // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000, 
//                // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000,
//                _flags = (MetadataFlags)(((uint) _flags & 0x3FFFFFFF) | ((uint) value) << 30);
//                SetModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID);
//            } 
//        }
// 
// 
//        /// <summary>
//        ///     The value of this property should be saved/restored when journaling by URI 
//        /// </summary>
//        public bool Journal
//        {
//            get { return ReadFlag(MetadataFlags.FW_ShouldBeJournaledID); } 
//            set
//            { 
//                if (IsSealed) 
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
//                }
//
//                WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, value);
// 
//                SetModified(MetadataFlags.FW_ShouldBeJournaledModifiedID);
//            } 
//        } 
//
//        /// <summary> 
//        ///     This property's subproperties do not affect rendering.
//        ///     For instance, a property X may have a subproperty Y.
//        ///     Changing X.Y does not require rendering to be updated.
//        /// </summary> 
//        public bool SubPropertiesDoNotAffectRender
//        { 
//            get { return ReadFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID); } 
//            set
//            { 
//                if (IsSealed)
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse));
//                } 
//
//                WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, value); 
// 
//                SetModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID);
//            } 
//        }
//
//        /// <summary>
//        ///     Does the represent the metadata for a ReadOnly property 
//        /// </summary>
//        private bool ReadOnly 
//        { 
//            get { return ReadFlag(MetadataFlags.FW_ReadOnlyID); }
//            set 
//            {
//                if (IsSealed)
//                {
//                    throw new InvalidOperationException(SR.Get(SRID.TypeMetadataCannotChangeAfterUse)); 
//                }
// 
//                WriteFlag(MetadataFlags.FW_ReadOnlyID, value); 
//            }
//        } 
//
//        /// <summary>
//        ///     Creates a new instance of this property metadata.  This method is used
//        ///     when metadata needs to be cloned.  After CreateInstance is called the 
//        ///     framework will call Merge to merge metadata into the new instance.
//        ///     Deriving classes must override this and return a new instance of 
//        ///     themselves. 
//        /// </summary>
//        internal override PropertyMetadata CreateInstance() { 
//            return new FrameworkPropertyMetadata();
//        }
//
//        /// <summary> 
//        ///     Merge set source state into this
//        /// </summary> 
//        /// <remarks> 
//        ///     Used when overriding metadata
//        /// </remarks> 
//        /// <param name="baseMetadata">Base metadata to merge</param>
//        /// <param name="dp">DependencyProperty that this metadata is being applied to</param>
//        protected override void Merge(PropertyMetadata baseMetadata, DependencyProperty dp)
//        { 
//            // Does parameter validation
//            base.Merge(baseMetadata, dp); 
// 
//            // Source type is guaranteed to be the same type or base type
//            FrameworkPropertyMetadata fbaseMetadata = baseMetadata as FrameworkPropertyMetadata; 
//            if (fbaseMetadata != null)
//            {
//                // Merge source metadata into this
// 
//                // Modify metadata merge state fields directly (not through accessors
//                // so that "modified" bits remain intact 
// 
//                // Merge state
//                // Defaults to false, derived classes can only enable 
//                WriteFlag(MetadataFlags.FW_AffectsMeasureID, ReadFlag(MetadataFlags.FW_AffectsMeasureID) | fbaseMetadata.AffectsMeasure);
//                WriteFlag(MetadataFlags.FW_AffectsArrangeID, ReadFlag(MetadataFlags.FW_AffectsArrangeID) | fbaseMetadata.AffectsArrange);
//                WriteFlag(MetadataFlags.FW_AffectsParentMeasureID, ReadFlag(MetadataFlags.FW_AffectsParentMeasureID) | fbaseMetadata.AffectsParentMeasure);
//                WriteFlag(MetadataFlags.FW_AffectsParentArrangeID, ReadFlag(MetadataFlags.FW_AffectsParentArrangeID) | fbaseMetadata.AffectsParentArrange); 
//                WriteFlag(MetadataFlags.FW_AffectsRenderID, ReadFlag(MetadataFlags.FW_AffectsRenderID) | fbaseMetadata.AffectsRender);
//                WriteFlag(MetadataFlags.FW_BindsTwoWayByDefaultID, ReadFlag(MetadataFlags.FW_BindsTwoWayByDefaultID) | fbaseMetadata.BindsTwoWayByDefault); 
//                WriteFlag(MetadataFlags.FW_IsNotDataBindableID, ReadFlag(MetadataFlags.FW_IsNotDataBindableID) | fbaseMetadata.IsNotDataBindable); 
//
//                // Override state 
//                if (!IsModified(MetadataFlags.FW_SubPropertiesDoNotAffectRenderModifiedID))
//                {
//                    WriteFlag(MetadataFlags.FW_SubPropertiesDoNotAffectRenderID, fbaseMetadata.SubPropertiesDoNotAffectRender);
//                } 
//
//                if (!IsModified(MetadataFlags.FW_InheritsModifiedID)) 
//                { 
//                    IsInherited = fbaseMetadata.Inherits;
//                } 
//
//                if (!IsModified(MetadataFlags.FW_OverridesInheritanceBehaviorModifiedID))
//                {
//                    WriteFlag(MetadataFlags.FW_OverridesInheritanceBehaviorID, fbaseMetadata.OverridesInheritanceBehavior); 
//                }
// 
//                if (!IsModified(MetadataFlags.FW_ShouldBeJournaledModifiedID)) 
//                {
//                    WriteFlag(MetadataFlags.FW_ShouldBeJournaledID, fbaseMetadata.Journal); 
//                }
//
//                if (!IsModified(MetadataFlags.FW_DefaultUpdateSourceTriggerModifiedID))
//                { 
//                    // FW_DefaultUpdateSourceTriggerEnumBit1        = 0x40000000,
//                    // FW_DefaultUpdateSourceTriggerEnumBit2        = 0x80000000, 
//                    _flags = (MetadataFlags)(((uint)_flags & 0x3FFFFFFF) | ((uint) fbaseMetadata.DefaultUpdateSourceTrigger) << 30); 
//                }
//            } 
//        }
//
//
//        /// <summary> 
//        ///     Notification that this metadata has been applied to a property
//        ///     and the metadata is being sealed 
//        /// </summary> 
//        /// <remarks>
//        ///     Normally, any mutability of the data structure should be marked 
//        ///     as immutable at this point
//        /// </remarks>
//        /// <param name="dp">DependencyProperty</param>
//        /// <param name="targetType">Type associating metadata (null if default metadata)</param> 
//        protected override void OnApply(DependencyProperty dp, Type targetType)
//        { 
//            // Remember if this is the metadata for a ReadOnly property 
//            ReadOnly = dp.ReadOnly;
// 
//            base.OnApply(dp, targetType);
//        }
//
// 
//        /// <summary>
//        ///     Determines if data binding is supported 
//        /// </summary> 
//        /// <remarks>
//        ///     Data binding is not allowed if a property read-only, regardless 
//        ///     of the value of the IsNotDataBindable flag
//        /// </remarks>
//        public bool IsDataBindingAllowed
//        { 
//            get { return !ReadFlag(MetadataFlags.FW_IsNotDataBindableID) && !ReadOnly; }
//        } 
// 
//        internal void SetModified(MetadataFlags id) { WriteFlag(id, true); }
//        internal bool IsModified(MetadataFlags id) { return ReadFlag(id); } 
//    }
//}

