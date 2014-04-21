package org.summer.view.widget;
/// <summary> 
    /// </summary>
//    [Flags] 
    public enum FrameworkPropertyMetadataOptions //: int 
    {
        /// <summary>No flags</summary> 
        None                            ,//= 0x000,

        /// <summary>This property affects measurement</summary>
        AffectsMeasure                  ,//= 0x001, 

        /// <summary>This property affects arragement</summary> 
        AffectsArrange                  ,//= 0x002, 

        /// <summary>This property affects parent's measurement</summary> 
        AffectsParentMeasure            ,//= 0x004,

        /// <summary>This property affects parent's arrangement</summary>
        AffectsParentArrange            ,//= 0x008, 

        /// <summary>This property affects rendering</summary> 
        AffectsRender                   ,//= 0x010, 

        /// <summary>This property inherits to children</summary> 
        Inherits                        ,//= 0x020,

        /// <summary>
        /// This property causes inheritance and resource lookup to override values 
        /// of InheritanceBehavior that may be set on any FE in the path of lookup
        /// </summary> 
        OverridesInheritanceBehavior    ,//= 0x040, 

        /// <summary>This property does not support data binding</summary> 
        NotDataBindable                 ,//= 0x080,

        /// <summary>Data bindings on this property default to two-way</summary>
        BindsTwoWayByDefault            ,//= 0x100, 

        /// <summary>This property should be saved/restored when journaling/navigating by URI</summary> 
        Journal                         ,//= 0x400, 

        /// <summary> 
        ///     This property's subproperties do not affect rendering.
        ///     For instance, a property X may have a subproperty Y.
        ///     Changing X.Y does not require rendering to be updated.
        /// </summary> 
        SubPropertiesDoNotAffectRender  ,//= 0x800,
    } 
 
    /// <summary>
    ///     Metadata for supported Framework features 
    /// </summary>
    