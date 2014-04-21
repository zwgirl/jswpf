/**
 * from DependencyPropertyHelper
 * BaseValueSource
 */

define(["dojo/_base/declare", "windows/BaseValueSourceInternal"], function(declare, BaseValueSourceInternal){

    var BaseValueSource =  declare("BaseValueSource", null,{ 
    });

    /// <summary> The source is not known by the Framework. </summary> 
    BaseValueSource.Unknown                 = BaseValueSourceInternal.Unknown,
    /// <summary> Default value, as defined by property metadata. </summary> 
    BaseValueSource.Default                 = BaseValueSourceInternal.Default, 
    /// <summary> Inherited from an ancestor. </summary>
    BaseValueSource.Inherited               = BaseValueSourceInternal.Inherited, 
    /// <summary> Default Style for the current theme. </summary>
    BaseValueSource.DefaultStyle            = BaseValueSourceInternal.ThemeStyle,
    /// <summary> Trigger in the default Style for the current theme. </summary>
    BaseValueSource.DefaultStyleTrigger     = BaseValueSourceInternal.ThemeStyleTrigger, 
    /// <summary> Style setter. </summary>
    BaseValueSource.Style                   = BaseValueSourceInternal.Style, 
    /// <summary> Trigger in the Template. </summary> 
    BaseValueSource.TemplateTrigger         = BaseValueSourceInternal.TemplateTrigger,
    /// <summary> Trigger in the Style. </summary> 
    BaseValueSource.StyleTrigger            = BaseValueSourceInternal.StyleTrigger,
    /// <summary> Implicit Style reference. </summary>
    BaseValueSource.ImplicitStyleReference  = BaseValueSourceInternal.ImplicitReference,
    /// <summary> Template that created the element. </summary> 
    BaseValueSource.ParentTemplate          = BaseValueSourceInternal.ParentTemplate,
    /// <summary> Trigger in the Template that created the element. </summary> 
    BaseValueSource.ParentTemplateTrigger   = BaseValueSourceInternal.ParentTemplateTrigger, 
    /// <summary> Local value. </summary>
    BaseValueSource.Local                   = BaseValueSourceInternal.Local;
    
    return BaseValueSource;
});
//	/// <summary>
//    /// Source of a DependencyProperty value. 
//    /// </summary>
//    public enum BaseValueSource
//    {
//        /// <summary> The source is not known by the Framework. </summary> 
//        Unknown                 = BaseValueSourceInternal.Unknown,
//        /// <summary> Default value, as defined by property metadata. </summary> 
//        Default                 = BaseValueSourceInternal.Default, 
//        /// <summary> Inherited from an ancestor. </summary>
//        Inherited               = BaseValueSourceInternal.Inherited, 
//        /// <summary> Default Style for the current theme. </summary>
//        DefaultStyle            = BaseValueSourceInternal.ThemeStyle,
//        /// <summary> Trigger in the default Style for the current theme. </summary>
//        DefaultStyleTrigger     = BaseValueSourceInternal.ThemeStyleTrigger, 
//        /// <summary> Style setter. </summary>
//        Style                   = BaseValueSourceInternal.Style, 
//        /// <summary> Trigger in the Template. </summary> 
//        TemplateTrigger         = BaseValueSourceInternal.TemplateTrigger,
//        /// <summary> Trigger in the Style. </summary> 
//        StyleTrigger            = BaseValueSourceInternal.StyleTrigger,
//        /// <summary> Implicit Style reference. </summary>
//        ImplicitStyleReference  = BaseValueSourceInternal.ImplicitReference,
//        /// <summary> Template that created the element. </summary> 
//        ParentTemplate          = BaseValueSourceInternal.ParentTemplate,
//        /// <summary> Trigger in the Template that created the element. </summary> 
//        ParentTemplateTrigger   = BaseValueSourceInternal.ParentTemplateTrigger, 
//        /// <summary> Local value. </summary>
//        Local                   = BaseValueSourceInternal.Local, 
//    }