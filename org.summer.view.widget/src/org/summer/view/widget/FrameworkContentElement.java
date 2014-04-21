package org.summer.view.widget;

import java.awt.Cursor;
import java.awt.im.spi.InputMethod;
import java.beans.EventHandler;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.collection.FrugalObjectList;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.collection.Stack;
import org.summer.view.widget.controls.ContextMenu;
import org.summer.view.widget.controls.ContextMenuEventArgs;
import org.summer.view.widget.controls.ContextMenuService;
import org.summer.view.widget.controls.ToolTipEventArgs;
import org.summer.view.widget.controls.ToolTipService;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingBase;
import org.summer.view.widget.data.BindingExpression;
import org.summer.view.widget.data.BindingExpressionBase;
import org.summer.view.widget.data.BindingGroup;
import org.summer.view.widget.data.BindingOperations;
import org.summer.view.widget.data.DataTransferEventArgs;
import org.summer.view.widget.data.Expression;
import org.summer.view.widget.input.FocusNavigationDirection;
import org.summer.view.widget.input.Keyboard;
import org.summer.view.widget.input.KeyboardNavigation;
import org.summer.view.widget.input.Mouse;
import org.summer.view.widget.input.Stylus;
import org.summer.view.widget.input.TraversalRequest;
import org.summer.view.widget.internal.Helper;
import org.summer.view.widget.internal.InheritedPropertyChangedEventArgs;
import org.summer.view.widget.internal.InheritedPropertyChangedEventHandler;
import org.summer.view.widget.markup.INameScope;
import org.summer.view.widget.markup.IQueryAmbient;
import org.summer.view.widget.markup.XmlLanguage;
import org.summer.view.widget.media.BitmapCacheBrush;
import org.summer.view.widget.media.animation.HandoffBehavior;
import org.summer.view.widget.media.animation.Storyboard;
import org.summer.view.widget.media.animation.VisualBrush;
import org.summer.view.widget.model.ISupportInitialize;
import org.summer.view.widget.threading.InvalidEnumArgumentException;
import org.summer.view.widget.utils.ArgumentOutOfRangeException;
import org.summer.view.window.ResourceReferenceExpression;
import org.w3c.dom.css.Rect;

/// <summary> 
///     FrameworkContentElement is used to define
///     structure of generic content. 
/// </summary> 
/// <remarks>
///     FrameworkContentElement doesnt have its own 
///     rendering (rendering must be provided by content
///     owner). <para/>
///
///     FrameworkContentElement <para/> 
///
///     <list type="bullet"> 
///         <item>Directly extends ContentElement </item> 
///         <item>Is not a Visual (doesnt provide its own rendering)</item>
///     </list> 
/// </remarks>
//[StyleTypedProperty(Property = "FocusVisualStyle", StyleTargetType = typeof(Control))]
//[XmlLangProperty("Language")]
//[UsableDuringInitialization(true)] 
public /*partial*/ class FrameworkContentElement extends ContentElement implements IFrameworkInputElement, ISupportInitialize, IQueryAmbient
{ 
    /// <summary> 
    ///     Create an instance of a FrameworkContentElement
    /// </summary> 
    /// <remarks>
    ///     This does basic initialization of the FrameworkContentElement.  All subclasses
    ///     must call the base constructor to perform this initialization
    /// </remarks> 
    public FrameworkContentElement()
    { 
        // Initialize the _styleCache to the default value for StyleProperty. 
        // If the default value is non-null then wire it to the current instance.
        PropertyMetadata metadata = StyleProperty.GetMetadata(DependencyObjectType); 
        Style defaultValue = (Style)metadata.DefaultValue;
        if (defaultValue != null)
        {
            OnStyleChanged(this, new DependencyPropertyChangedEventArgs(StyleProperty, metadata, null, defaultValue)); 
        }

        // Set the ShouldLookupImplicitStyles flag to true if App.Resources has implicit styles. 
        Application app = Application.Current;
        if (app != null && app.HasImplicitStylesInResources) 
        {
            ShouldLookupImplicitStyles = true;
        }
    } 

    static //FrameworkContentElement() 
    { 
        PropertyChangedCallback numberSubstitutionChanged = new PropertyChangedCallback(NumberSubstitutionChanged);
        NumberSubstitution.CultureSourceProperty.OverrideMetadata(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(NumberCultureSource.Text, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged)); 
        NumberSubstitution.CultureOverrideProperty.OverrideMetadata(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));
        NumberSubstitution.SubstitutionProperty.OverrideMetadata(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(NumberSubstitutionMethod.AsCulture, FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure | FrameworkPropertyMetadataOptions.AffectsRender, numberSubstitutionChanged));

        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), Mouse.QueryCursorEvent, new QueryCursorEventHandler(FrameworkContentElement.OnQueryCursor), true); 

        AllowDropProperty.OverrideMetadata(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(BooleanBoxes.FalseBox, FrameworkPropertyMetadataOptions.Inherits)); 

        Stylus.IsPressAndHoldEnabledProperty.AddOwner(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
        Stylus.IsFlicksEnabledProperty.AddOwner(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits)); 
        Stylus.IsTapFeedbackEnabledProperty.AddOwner(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));
        Stylus.IsTouchFeedbackEnabledProperty.AddOwner(typeof(FrameworkContentElement), new FrameworkPropertyMetadata(BooleanBoxes.TrueBox, FrameworkPropertyMetadataOptions.Inherits));

        // Exposing these events in protected /*virtual*/ methods 
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), ToolTipOpeningEvent, new ToolTipEventHandler(OnToolTipOpeningThunk));
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), ToolTipClosingEvent, new ToolTipEventHandler(OnToolTipClosingThunk)); 
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), ContextMenuOpeningEvent, new ContextMenuEventHandler(OnContextMenuOpeningThunk)); 
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), ContextMenuClosingEvent, new ContextMenuEventHandler(OnContextMenuClosingThunk));
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), Keyboard.GotKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnGotKeyboardFocus)); 
        EventManager.RegisterClassHandler(typeof(FrameworkContentElement), Keyboard.LostKeyboardFocusEvent, new KeyboardFocusChangedEventHandler(OnLostKeyboardFocus));
    }

    /*internal*/ public static final NumberSubstitution DefaultNumberSubstitution = new NumberSubstitution( 
        NumberCultureSource.Text,           // number substitution in documents defaults to text culture
        null,                               // culture /*override*/ 
        NumberSubstitutionMethod.AsCulture 
        );

    private static void NumberSubstitutionChanged(DependencyObject o, DependencyPropertyChangedEventArgs e)
    {
        ((FrameworkContentElement) o).HasNumberSubstitutionChanged = true;
    } 


    /// <summary>Style Dependency Property</summary> 
//    [CommonDependencyProperty]
    public static final DependencyProperty StyleProperty = 
            FrameworkElement.StyleProperty.AddOwner(
                    typeof(FrameworkContentElement),
                    new FrameworkPropertyMetadata(
                            (Style) null,  // default value 
                            FrameworkPropertyMetadataOptions.AffectsMeasure,
                            new PropertyChangedCallback(OnStyleChanged))); 


    /// <summary> 
    ///     Style property
    /// </summary>
    public Style Style
    { 
        get { return _styleCache; }
        set { SetValue(StyleProperty, value); } 
    } 

    /// <summary> 
    /// This method is used by TypeDescriptor to determine if this property should
    /// be serialized.
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeStyle()
    { 
        return !IsStyleSetFromGenerator 
                && ReadLocalValue(StyleProperty) != DependencyProperty.UnsetValue;
    } 

    // Invoked when the Style property is changed
    private static void OnStyleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        FrameworkContentElement fce = (FrameworkContentElement) d;
        fce.HasLocalStyle = (e.NewEntry.BaseValueSourceInternal == BaseValueSourceInternal.Local); 
        StyleHelper.UpdateStyleCache(null, fce, (Style) e.OldValue, (Style) e.NewValue, /*ref*/ fce._styleCache); 
    }

    ///
    protected /*internal*/ /*virtual*/ void OnStyleChanged(Style oldStyle, Style newStyle)
    {
        HasStyleChanged = true; 
    }

    /// <summary> 
    /// OverridesDefaultStyleProperty
    /// </summary> 
    public static final DependencyProperty OverridesDefaultStyleProperty
        = FrameworkElement.OverridesDefaultStyleProperty.AddOwner(typeof(FrameworkContentElement),
                                       new FrameworkPropertyMetadata(
                                                    BooleanBoxes.FalseBox,   // default value 
                                                    FrameworkPropertyMetadataOptions.AffectsMeasure,
                                                    new PropertyChangedCallback(OnThemeStyleKeyChanged))); 


    /// <summary> 
    ///     This specifies that the current style ignores all
    ///     properties from the Theme Style
    /// </summary>
    public boolean OverridesDefaultStyle 
    {
        get { return (boolean)GetValue(OverridesDefaultStyleProperty); } 
        set { SetValue(OverridesDefaultStyleProperty, BooleanBoxes.Box(value)); } 
    }

    /// <summary>DefaultStyleKey Dependency Property</summary>
    protected /*internal*/ static final DependencyProperty DefaultStyleKeyProperty =
                FrameworkElement.DefaultStyleKeyProperty.AddOwner(
                            typeof(FrameworkContentElement), 
                            new FrameworkPropertyMetadata(
                                        null,  // default value 
                                        FrameworkPropertyMetadataOptions.AffectsMeasure, 
                                        new PropertyChangedCallback(OnThemeStyleKeyChanged)));

    /// <summary>
    ///     DefaultStyleKey property
    /// </summary>
    protected /*internal*/ Object DefaultStyleKey 
    {
        get { return GetValue(DefaultStyleKeyProperty); } 
        set { SetValue(DefaultStyleKeyProperty, value); } 
    }

    // This function is called when ThemeStyleKey or OverridesThemeStyle properties change
    private static void OnThemeStyleKeyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        // Re-evaluate ThemeStyle because it is 
        // a factor of the ThemeStyleKey property
        ((FrameworkContentElement)d).UpdateThemeStyleProperty(); 
    } 

    // Cache the ThemeStyle for the current instance if there is a DefaultStyleKey specified for it 
    /*internal*/ public Style ThemeStyle
    {
        get { return _themeStyleCache; }
    } 

    // Returns the DependencyObjectType for the registered DefaultStyleKey's default 
    // value. Controls will /*override*/ this method to return approriate types. 
    /*internal*/ public /*virtual*/ DependencyObjectType DTypeThemeStyleKey
    { 
        get { return null; }
    }


    // Invoked when the ThemeStyle/DefaultStyleKey property is changed
    /*internal*/ public static void OnThemeStyleChanged(DependencyObject d, Object oldValue, Object newValue) 
    { 
        FrameworkContentElement fce = (FrameworkContentElement) d;
        StyleHelper.UpdateThemeStyleCache(null, fce, (Style) oldValue, (Style) newValue, /*ref*/ fce._themeStyleCache); 
    }


    /// <summary> 
    ///     Reference to the style parent of this node, if any.
    /// </summary> 
    /// <returns> 
    ///     Reference to FrameworkElement or FrameworkContentElement whose
    ///     Template.VisualTree caused this FrameworkContentElement to be created. 
    /// </returns>
    public DependencyObject TemplatedParent
    {
        get 
        {
            return _templatedParent; 
        } 
    }


    /// <summary>
    ///     Check if resource is not empty.
    /// Call HasResources before accessing resources every time you need 
    /// to query for a resource.
    /// </summary> 
    /*internal*/ public boolean HasResources 
    {
        get 
        {
            ResourceDictionary resources = ResourcesField.GetValue(this);
            return (resources != null &&
                    ((resources.Count > 0) || (resources.MergedDictionaries.Count > 0))); 
        }
    } 

    /// <summary>
    ///     Current locally defined Resources 
    /// </summary>
//    [Ambient]
    public ResourceDictionary Resources
    { 
        get
        { 
            ResourceDictionary resources = ResourcesField.GetValue(this); 
            if (resources == null)
            { 
                resources = new ResourceDictionary();
                resources.AddOwner(this);
                ResourcesField.SetValue(this, resources);
            } 

            return resources; 
        } 
        set
        { 
            ResourceDictionary oldValue = ResourcesField.GetValue(this);
            ResourcesField.SetValue(this, value);

            if (oldValue != null) 
            {
                // This element is no longer an owner for the old RD 
                oldValue.RemoveOwner(this); 
            }

            if (value != null)
            {
                if (!value.ContainsOwner(this))
                { 
                    // This element is an owner for the new RD
                    value.AddOwner(this); 
                } 
            }

            // Invalidate ResourceReference properties for this subtree
            //





            if (oldValue != value)
            { 
                TreeWalkHelper.InvalidateOnResourcesChange(null, this, new ResourcesChangeInfo(oldValue, value));
            }
        }
    } 

    public boolean /*IQueryAmbient.*/IsAmbientPropertyAvailable(String propertyName) 
    { 
        // We want to make sure that StaticResource resolution checks the .Resources
        // Ie.  The Ambient search should look at Resources if it is set. 
        // Even if it wasn't set from XAML (eg. the Ctor (or derived Ctor) added stuff)
        return (propertyName != "Resources" || HasResources);
    }

    /// <summary>
    /// This method is used by TypeDescriptor to determine if this property should 
    /// be serialized. 
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Never)] 
    public boolean ShouldSerializeResources()
    {
        if (Resources == null || Resources.Count == 0)
        { 
            return false;
        } 

        return true;
    } 


    /// <summary>
    ///     Searches for a resource with the passed resourceKey and returns it 
    /// </summary>
    /// <remarks> 
    ///     If the sources is not found on the called Element, the parent 
    ///     chain is searched, using the logical tree.
    /// </remarks> 
    /// <param name="resourceKey">Name of the resource</param>
    /// <returns>The found resource.  Null if not found.</returns>
    public Object FindResource(Object resourceKey)
    { 
        // Verify Context Access
        //             VerifyAccess(); 

        if (resourceKey == null)
        { 
            throw new ArgumentNullException("resourceKey");
        }

        Object resource = FrameworkElement.FindResourceInternal(null /* fe */, this, resourceKey); 

        if (resource == DependencyProperty.UnsetValue) 
        { 
            // Resource not found in parent chain, app or system
            Helper.ResourceFailureThrow(resourceKey); 
        }

        return resource;
    } 

    /// <summary> 
    ///     Searches for a resource with the passed resourceKey and returns it 
    /// </summary>
    /// <remarks> 
    ///     If the sources is not found on the called Element, the parent
    ///     chain is searched, using the logical tree.
    /// </remarks>
    /// <param name="resourceKey">Name of the resource</param> 
    /// <returns>The found resource.  Null if not found.</returns>
    public Object TryFindResource(Object resourceKey) 
    { 
        // Verify Context Access
//         VerifyAccess(); 

        if (resourceKey == null)
        {
            throw new ArgumentNullException("resourceKey"); 
        }

        Object resource = FrameworkElement.FindResourceInternal(null /* fe */, this, resourceKey); 

        if (resource == DependencyProperty.UnsetValue) 
        {
            // Resource not found in parent chain, app or system
            // This is where we translate DependencyProperty.UnsetValue to a null
            resource = null; 
        }

        return resource; 
    }

    /// <summary>
    ///     Searches for a resource called name and sets up a resource reference
    ///     to it for the passed property.
    /// </summary> 
    /// <param name="dp">Property to which the resource is bound</param>
    /// <param name="name">Name of the resource</param> 
    public void SetResourceReference( 
        DependencyProperty dp,
        Object             name) 
    {
        // Set the value of the property to a ResourceReferenceExpression
        SetValue(dp, new ResourceReferenceExpression(name));

        // Set flag indicating that the current FrameworkContentElement instance
        // has a property value set to a resource reference and hence must 
        // be invalidated on parent changed or resource property change events 
        HasResourceReference = true;
    } 

    /// <summary>
    ///     Begins the given Storyboard as a non-controllable Storyboard and
    /// the default handoff policy. 
    /// </summary>
    public void BeginStoryboard(Storyboard storyboard) 
    { 
        BeginStoryboard(storyboard, HandoffBehavior.SnapshotAndReplace, false);
    } 

    /// <summary>
    ///     Begins the given Storyboard as a non-controllable Storyboard but
    /// with the given handoff policy. 
    /// </summary>
    public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior) 
    { 
        BeginStoryboard(storyboard, handoffBehavior, false);
    } 

    /// <summary>
    ///     Begins the given Storyboard as a Storyboard with the given handoff
    /// policy, and with the specified state for controllability. 
    /// </summary>
    public void BeginStoryboard(Storyboard storyboard, HandoffBehavior handoffBehavior, boolean isControllable) 
    { 
        if( storyboard == null )
        { 
            throw new ArgumentNullException("storyboard");
        }

        // Storyboard.Begin is a public API and needs to be validating handoffBehavior anyway. 

        storyboard.Begin( this, handoffBehavior, isControllable ); 
    } 

    /// <summary> 
    ///     Allows subclasses to participate in property base value computation
    /// </summary>
    /// <param name="dp">Dependency property</param>
    /// <param name="metadata">Type metadata of the property for the type</param> 
    /// <param name="newEntry">entry computed by base</param>
    /*internal*/ public /*sealed*/ /*override*/ void EvaluateBaseValueCore( 
        DependencyProperty  dp, 
        PropertyMetadata    metadata,
        /*ref*/ EffectiveValueEntry newEntry) 
    {
        if (dp == StyleProperty)
        {
            // If this is the first time that the StyleProperty 
            // is being fetched then mark it such
            HasStyleEverBeenFetched = true; 

            // Clear the flags associated with the StyleProperty
            HasImplicitStyleFromResources = false; 
            IsStyleSetFromGenerator = false;
        }

        GetRawValue(dp, metadata, /*ref*/ newEntry); 
        Storyboard.GetComplexPathValue(this, dp, /*ref*/ newEntry, metadata);
    } 

    //[CodeAnalysis("AptcaMethodsShouldOnlyCallAptcaMethods")] //Tracking Bug: 29647
    /*internal*/ public void GetRawValue(DependencyProperty dp, PropertyMetadata metadata, /*ref*/ EffectiveValueEntry entry) 
    {
        // Check if value was resolved by base. If so, run it by animations
        if ((entry.BaseValueSourceInternal == BaseValueSourceInternal.Local) &&
            (entry.GetFlattenedEntry(RequestFlags.FullyResolved).Value != DependencyProperty.UnsetValue)) 
        {
            return; 
        } 

        // 
        // Try for container Style driven value
        //
        if (TemplateChildIndex != -1)
        { 
            // This instance is in the template child chain of a Template.VisualTree,
            //  so we need to see if the Style has an applicable value. 
            // 
            // If the parent element's style is changing, this instance is
            // in a visual tree that is being removed, and the value request 
            // is simply a result of tearing down some information in that
            // tree (e.g. a BindingExpression).  If so, just pretend there is no style (bug 991395).

            if (GetValueFromTemplatedParent(dp, /*ref*/ entry)) 
            {
                return; 
            } 
        }


        //
        // Try for Styled value
        // 

        // Here are some of the implicit rules used by GetRawValue, 
        // while querying properties on the container. 
        // 1. Style property cannot be specified in a Style
        // 2. Style property cannot be specified in a ThemeStyle 
        // 3. Style property cannot be specified in a Template
        // 4. DefaultStyleKey property cannot be specified in a ThemeStyle
        // 5. DefaultStyleKey property cannot be specified in a Template
        // 6. Template property cannot be specified in a Template 

        if (dp != StyleProperty) 
        { 
            if (StyleHelper.GetValueFromStyleOrTemplate(new FrameworkObject(null, this), dp, /*ref*/ entry))
            { 
                return;
            }
        }
        else 
        {
            Object source; 
            Object implicitValue = FrameworkElement.FindImplicitStyleResource(this, this.GetType(), /*out*/ source); 
            if (implicitValue != DependencyProperty.UnsetValue)
            { 
                // Commented this because the implicit fetch could also return a DeferredDictionaryReference
                // if (!(implicitValue is Style))
                // {
                //     throw new InvalidOperationException(SR.Get(SRID.InvalidImplicitStyleResource, this.GetType().Name, implicitValue)); 
                // }

                // This style has been fetched from resources 
                HasImplicitStyleFromResources = true;

                entry.BaseValueSourceInternal = BaseValueSourceInternal.ImplicitReference;
                entry.Value = implicitValue;
                return;
            } 
        }

        // 
        // Try for Inherited value
        // 
        FrameworkPropertyMetadata fmetadata = metadata as FrameworkPropertyMetadata;

        // Note that for inheritable properties that /*override*/ the default value a parent can impart
        // its default value to the child even though the property may not have been set locally or 
        // via a style or template (ie. IsUsed flag would be false).
        if (fmetadata != null) 
        { 
            if (fmetadata.Inherits)
            { 
                //
                // Inheritance
                //

                if (!TreeWalkHelper.SkipNext(InheritanceBehavior) || fmetadata.OverridesInheritanceBehavior == true)
                { 
                    // Used to terminate tree walk if a tree boundary is hit 
                    InheritanceBehavior inheritanceBehavior;

                    FrameworkContentElement parentFCE;
                    FrameworkElement parentFE;
                    boolean hasParent = FrameworkElement.GetFrameworkParent(this, /*out*/ parentFE, /*out*/ parentFCE);
                    while (hasParent) 
                    {
                        boolean inheritanceNode; 
                        if (parentFE != null) 
                        {
                            inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFE, dp, /*out*/ inheritanceBehavior); 
                        }
                        else // (parentFCE != null)
                        {
                            inheritanceNode = TreeWalkHelper.IsInheritanceNode(parentFCE, dp, /*out*/ inheritanceBehavior); 
                        }

                        // If the current node has SkipNow semantics then we do 
                        // not need to lookup the inheritable value on it.
                        if (TreeWalkHelper.SkipNow(inheritanceBehavior)) 
                        {
                            break;
                        }

                        // Check if node is an inheritance node, if so, query it
                        if (inheritanceNode) 
                        { 
////                            #region EventTracing
//                            if (EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose)) 
//                            {
//                                String TypeAndName = "[" + GetType().Name + "]" + dp.Name;
//                                EventTrace.EventProvider.TraceEvent(EventTrace.Event.WClientPropParentCheck,
//                                                                     EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose, 
//                                                                     GetHashCode(), TypeAndName);
//                            } 
//                            #endregion EventTracing 
                            DependencyObject parentDO = parentFE;
                            if (parentDO == null) 
                            {
                                parentDO = parentFCE;
                            }

                            EntryIndex entryIndex = parentDO.LookupEntry(dp.GlobalIndex);

                            entry = parentDO.GetValueEntry( 
                                            entryIndex,
                                            dp, 
                                            fmetadata,
                                            RequestFlags.SkipDefault | RequestFlags.DeferredReferences);

                            if (entry.Value != DependencyProperty.UnsetValue) 
                            {
                                entry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                            } 
                            return;
                        } 

                        // If the current node has SkipNext semantics then we do
                        // not need to lookup the inheritable value on its parent.
                        if (TreeWalkHelper.SkipNext(inheritanceBehavior)) 
                        {
                            break; 
                        } 

                        // No boundary or inheritance node found, continue search 
                        if (parentFE != null)
                        {
                            hasParent = FrameworkElement.GetFrameworkParent(parentFE, /*out*/ parentFE, /*out*/ parentFCE);
                        } 
                        else
                        { 
                            hasParent = FrameworkElement.GetFrameworkParent(parentFCE, /*out*/ parentFE, /*out*/ parentFCE); 
                        }
                    } 
                }
            }


        }

        // No value found. 
        Debug.Assert(entry.Value == DependencyProperty.UnsetValue);
    } 

    // This FrameworkElement has been established to be a Template.VisualTree
    //  node of a parent Object.  Ask the TemplatedParent's Style Object if
    //  they have a value for us. 

    private boolean GetValueFromTemplatedParent(DependencyProperty dp, /*ref*/ EffectiveValueEntry entry) 
    { 
        FrameworkTemplate frameworkTemplate = null;
        FrameworkElement feTemplatedParent = (FrameworkElement)_templatedParent; 
        frameworkTemplate = feTemplatedParent.TemplateInternal;

        if (frameworkTemplate != null)
        { 
            return StyleHelper.GetValueFromTemplatedParent(
                _templatedParent, 
                TemplateChildIndex, 
                new FrameworkObject(null, this),
                dp, 
                /*ref*/ frameworkTemplate.ChildRecordFromChildIndex,
                frameworkTemplate.VisualTree,
                /*ref*/ entry);
        } 

        return false; 
    } 


    // Like GetValueCore, except it returns the expression (if any) instead of its value
    /*internal*/ public Expression GetExpressionCore(DependencyProperty dp, PropertyMetadata metadata)
    {
        this.IsRequestingExpression = true; 
        EffectiveValueEntry entry = new EffectiveValueEntry(dp);
        entry.Value = DependencyProperty.UnsetValue; 
        this.EvaluateBaseValueCore(dp, metadata, /*ref*/ entry); 
        this.IsRequestingExpression = false;

        return entry.Value as Expression;
    }


    /// <summary>
    ///     Notification that a specified property has been changed 
    /// </summary> 
    /// <param name="e">EventArgs that contains the property, metadata, old value, and new value for this change</param>
    protected /*override*/ void OnPropertyChanged(DependencyPropertyChangedEventArgs e) 
    {
        DependencyProperty dp = e.Property;

        super.OnPropertyChanged(e); 

        if (e.IsAValueChange || e.IsASubPropertyChange) 
        { 
            //
            // Try to fire the Loaded event on the root of the tree 
            // because for this case the OnParentChanged will not
            // have a chance to fire the Loaded event.
            //
            if (dp != null && dp.OwnerType == typeof(PresentationSource) && dp.Name == "RootSource") 
            {
                TryFireInitialized(); 
            } 

//            if (dp == FrameworkElement.NameProperty && 
//                EventTrace.IsEnabled(EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose))
//            {
//                EventTrace.EventProvider.TraceEvent(EventTrace.Event.PerfElementIDName, EventTrace.Keyword.KeywordGeneral, EventTrace.Level.Verbose,
//                        PerfService.GetPerfElementID(this), GetType().Name, GetValue(dp)); 
//            }

            // 
            // Invalidation propagation for Styles
            // 

            // Regardless of metadata, the Style/DefaultStyleKey properties are never a trigger drivers
            if (dp != StyleProperty && dp != DefaultStyleKeyProperty)
            { 
                // Note even properties on non-container nodes within a template could be driving a trigger
                if (TemplatedParent != null) 
                { 
                    FrameworkElement feTemplatedParent = TemplatedParent as FrameworkElement;

                    FrameworkTemplate frameworkTemplate = feTemplatedParent.TemplateInternal;
                    StyleHelper.OnTriggerSourcePropertyInvalidated(null, frameworkTemplate, TemplatedParent, dp, e, false /*invalidateOnlyContainer*/,
                        /*ref*/ frameworkTemplate.TriggerSourceRecordFromChildIndex, /*ref*/ frameworkTemplate.PropertyTriggersWithActions, TemplateChildIndex /*sourceChildIndex*/);
                } 

                // Do not validate Style during an invalidation if the Style was 
                // never used before (dependents do not need invalidation) 
                if (Style != null)
                { 
                    StyleHelper.OnTriggerSourcePropertyInvalidated(Style, null, this, dp, e, true /*invalidateOnlyContainer*/,
                        /*ref*/ Style.TriggerSourceRecordFromChildIndex, /*ref*/ Style.PropertyTriggersWithActions, 0 /*sourceChildId*/); // Style can only have triggers that are driven by properties on the container
                }

                // Do not validate Template during an invalidation if the Template was
                // never used before (dependents do not need invalidation) 

                // There may be container dependents in the ThemeStyle. Invalidate them.
                if (ThemeStyle != null && Style != ThemeStyle) 
                {
                    StyleHelper.OnTriggerSourcePropertyInvalidated(ThemeStyle, null, this, dp, e, true /*invalidateOnlyContainer*/,
                        /*ref*/ ThemeStyle.TriggerSourceRecordFromChildIndex, /*ref*/ ThemeStyle.PropertyTriggersWithActions, 0 /*sourceChildIndex*/); // ThemeStyle can only have triggers that are driven by properties on the container
                } 
            }
        } 

        FrameworkPropertyMetadata fmetadata = e.Metadata as FrameworkPropertyMetadata;

        //
        // Invalidation propagation for Groups and Inheritance
        //

        // Metadata must exist specifically stating propagate invalidation
        // due to group or inheritance 
        if (fmetadata != null) 
        {
            // 
            // Inheritance
            //

            if (fmetadata.Inherits) 
            {
                // Invalidate Inheritable descendents only if instance is not a TreeSeparator 
                // or fmetadata.OverridesInheritanceBehavior is set to /*override*/ separated tree behavior 
                if ((InheritanceBehavior == InheritanceBehavior.Default || fmetadata.OverridesInheritanceBehavior) &&
                    (!DependencyObject.IsTreeWalkOperation(e.OperationType) || PotentiallyHasMentees)) 
                {
                    EffectiveValueEntry newEntry = e.NewEntry;
                    EffectiveValueEntry oldEntry = e.OldEntry;
                    if (oldEntry.BaseValueSourceInternal > newEntry.BaseValueSourceInternal) 
                    {
                        // valuesource == Inherited && value == UnsetValue indicates that we are clearing the inherited value 
                        newEntry = new EffectiveValueEntry(dp, BaseValueSourceInternal.Inherited); 
                    }
                    else 
                    {
                        newEntry = newEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
                        newEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited;
                    } 

                    if (oldEntry.BaseValueSourceInternal != BaseValueSourceInternal.Default || oldEntry.HasModifiers) 
                    { 
                        oldEntry = oldEntry.GetFlattenedEntry(RequestFlags.FullyResolved);
                        oldEntry.BaseValueSourceInternal = BaseValueSourceInternal.Inherited; 
                    }
                    else
                    {
                        // we use an empty EffectiveValueEntry as a signal that the old entry was the default value 
                        oldEntry = new EffectiveValueEntry();
                    } 

                    InheritablePropertyChangeInfo info =
                            new InheritablePropertyChangeInfo( 
                                    this,
                                    dp,
                                    oldEntry,
                                    newEntry); 

                    // Don't InvalidateTree if we're in the middle of doing it. 
                    if (!DependencyObject.IsTreeWalkOperation(e.OperationType)) 
                    {
                        TreeWalkHelper.InvalidateOnInheritablePropertyChange(null, this, info, true); 
                    }

                    // Notify mentees if they exist
                    if (PotentiallyHasMentees) 
                    {
                        TreeWalkHelper.OnInheritedPropertyChanged(this, /*ref*/ info, InheritanceBehavior); 
                    } 
                }
            } 
        }
    }

    /// <summary> 
    ///     The DependencyProperty for the Name property.
    /// </summary> 
    public static final DependencyProperty NameProperty = 
                FrameworkElement.NameProperty.AddOwner(
                            typeof(FrameworkContentElement), 
                            new FrameworkPropertyMetadata(String.Empty));

    /// <summary>
    ///     Name property. 
    /// </summary>
//    [MergableProperty(false)] 
//    [Localizability(LocalizationCategory.NeverLocalize)] // cannot be localized 
    public String Name
    { 
        get { return (String) GetValue(NameProperty); }
        set { SetValue(NameProperty, value); }
    }

    /// <summary>
    ///     The DependencyProperty for the Tag property. 
    /// </summary> 
    public static final DependencyProperty TagProperty =
                FrameworkElement.TagProperty.AddOwner( 
                            typeof(FrameworkContentElement),
                            new FrameworkPropertyMetadata((Object) null));

    /// <summary> 
    ///     Tag property.
    /// </summary> 
    public Object Tag 
    {
        get { return GetValue(TagProperty); } 
        set { SetValue(TagProperty, value); }
    }

//    #region Language 

    /// <summary> 
    /// Language can be specified in xaml at any point using the xml language attribute xml:lang. 
    /// This will make the culture pertain to the scope of the element where it is applied.  The
    /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US". 
    /// </summary>
    static public final DependencyProperty LanguageProperty =
                FrameworkElement.LanguageProperty.AddOwner(
                            typeof(FrameworkContentElement), 
                            new FrameworkPropertyMetadata(
                                    XmlLanguage.GetLanguage("en-US"), 
                                    FrameworkPropertyMetadataOptions.Inherits | FrameworkPropertyMetadataOptions.AffectsMeasure)); 

    /// <summary> 
    /// Language can be specified in xaml at any point using the xml language attribute xml:lang.
    /// This will make the culture pertain to the scope of the element where it is applied.  The
    /// XmlLanguage names follow the RFC 3066 standard. For example, U.S. English is "en-US".
    /// </summary> 
    public XmlLanguage Language
    { 
        get { return (XmlLanguage) GetValue(LanguageProperty); } 
        set { SetValue(LanguageProperty, value); }
    } 
//    #endregion Language

//    #region Input

    /// <summary>
    /// FocusVisualStyleProperty 
    /// </summary> 
    public static final DependencyProperty FocusVisualStyleProperty =
                FrameworkElement.FocusVisualStyleProperty.AddOwner(typeof(FrameworkContentElement), 
                new FrameworkPropertyMetadata(FrameworkElement.DefaultFocusVisualStyle));

    /// <summary>
    /// FocusVisualStyle Property 
    /// </summary>
    public Style FocusVisualStyle 
    { 
        get { return (Style) GetValue(FocusVisualStyleProperty); }
        set { SetValue(FocusVisualStyleProperty, value); } 
    }

    /// <summary>
    ///     CursorProperty 
    /// </summary>
    public static final DependencyProperty CursorProperty = 
                FrameworkElement.CursorProperty.AddOwner( 
                            typeof(FrameworkContentElement),
                            new FrameworkPropertyMetadata( 
                                        (Object) null, // default value
                                        0,
                                        new PropertyChangedCallback(OnCursorChanged)));

    /// <summary>
    ///     Cursor Property 
    /// </summary> 
    public /*System.Windows.Input.*/Cursor Cursor
    { 
        get { return (/*System.Windows.Input.*/Cursor)GetValue(CursorProperty); }

        set { SetValue(CursorProperty, value); }
    } 

    // If the cursor is changed, we may need to set the actual cursor. 
    static private void OnCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        FrameworkContentElement fce = ((FrameworkContentElement)d); 

        if(fce.IsMouseOver)
        {
            Mouse.UpdateCursor(); 
        }
    } 

    /// <summary>
    ///     ForceCursorProperty 
    /// </summary>
    public static final DependencyProperty ForceCursorProperty =
                FrameworkElement.ForceCursorProperty.AddOwner(
                            typeof(FrameworkContentElement), 
                            new FrameworkPropertyMetadata(
                                        BooleanBoxes.FalseBox, // default value 
                                        0, 
                                        new PropertyChangedCallback(OnForceCursorChanged)));


    /// <summary>
    ///     ForceCursor Property
    /// </summary> 
    public boolean ForceCursor
    { 
        get { return (boolean) GetValue(ForceCursorProperty); } 
        set { SetValue(ForceCursorProperty, BooleanBoxes.Box(value)); }
    } 

    // If the ForceCursor property changed, we may need to set the actual cursor.
    static private void OnForceCursorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    { 
        FrameworkContentElement fce = ((FrameworkContentElement)d);

        if (fce.IsMouseOver) 
        {
            Mouse.UpdateCursor(); 
        }
    }

    private static void OnQueryCursor(Object sender, QueryCursorEventArgs e) 
    {
        FrameworkContentElement fce = (FrameworkContentElement) sender; 

        // We respond to querying the cursor by specifying the cursor set
        // as a property on this element. 
        Cursor cursor = fce.Cursor;

        if(cursor != null)
        { 
            // We specify the cursor if the QueryCursor event is not
            // handled by the time it gets to us, or if we are configured 
            // to force our cursor anyways.  Since the QueryCursor event 
            // bubbles, this has the effect of overriding whatever cursor
            // a child of ours specified. 
            if(!e.Handled || fce.ForceCursor)
            {
                e.Cursor = cursor;
                e.Handled = true; 
            }
        } 
    } 

    // Keyboard 
    /// <summary>
    ///     Request to move the focus from this element to another element
    /// </summary>
    /// <param name="request"> 
    ///     The direction that focus is to move.
    /// </param> 
    /// <returns> Returns true if focus is moved successfully. Returns false if there is no next element</returns> 
    public /*sealed*/ /*override*/ boolean MoveFocus(TraversalRequest request)
    { 
        if (request == null)
        {
            throw new ArgumentNullException("request");
        } 

        return KeyboardNavigation.Current.Navigate(this, request); 
    } 

    /// <summary> 
    ///     Request to predict the element that should receive focus relative to this element for a
    /// given direction, without actually moving focus to it.
    /// </summary>
    /// <param name="direction">The direction for which focus should be predicted</param> 
    /// <returns>
    ///     Returns the next element that focus should move to for a given FocusNavigationDirection. 
    /// Returns null if focus cannot be moved relative to this element. 
    /// </returns>
    public /*sealed*/ /*override*/ DependencyObject PredictFocus(FocusNavigationDirection direction) 
    {
        return KeyboardNavigation.Current.PredictFocusedElement(this, direction);
    }

    /// <summary>
    ///     This method is invoked when the IsFocused property changes to true 
    /// </summary> 
    /// <param name="e">RoutedEventArgs</param>
    protected /*override*/ void OnGotFocus(RoutedEventArgs e) 
    {
        // Scroll the element into view if currently focused
        if (IsKeyboardFocused)
            BringIntoView(); 

        super.OnGotFocus(e); 
    } 

    private static void OnGotKeyboardFocus(Object sender, KeyboardFocusChangedEventArgs e) 
    {
        // This static class handler will get hit each time anybody gets hit with a tunnel that someone is getting focused.
        // We're only interested when the element is getting focused is processing the event.
        // NB: This will not do the right thing if the element rejects focus or does not want to be scrolled into view. 
        if (sender == e.OriginalSource)
        { 
            FrameworkContentElement fce = (FrameworkContentElement)sender; 
            KeyboardNavigation.UpdateFocusedElement(fce);

            KeyboardNavigation keyNav = KeyboardNavigation.Current;
            KeyboardNavigation.ShowFocusVisual();
            keyNav.UpdateActiveElement(fce);
        } 
    }

    private static void OnLostKeyboardFocus(Object sender, KeyboardFocusChangedEventArgs e) 
    {
        if (sender == e.OriginalSource) 
        {
            KeyboardNavigation.Current.HideFocusVisual();

            if (e.NewFocus == null) 
            {
                KeyboardNavigation.Current.NotifyFocusChanged(sender, e); 
            } 
        }
    } 

    /// <summary>
    /// Attempts to bring this element into view by originating a RequestBringIntoView event.
    /// </summary> 
    public void BringIntoView()
    { 
        RequestBringIntoViewEventArgs args = new RequestBringIntoViewEventArgs(this, Rect.Empty); 
        args.RoutedEvent=FrameworkElement.RequestBringIntoViewEvent;
        RaiseEvent(args); 
    }

//    #endregion Input

//    #region InputScope

    /// <summary> 
    ///     InputScope DependencyProperty
    ///     this is originally registered on InputMethod class 
    /// </summary>
    public static final DependencyProperty InputScopeProperty =
                InputMethod.InputScopeProperty.AddOwner(typeof(FrameworkContentElement),
                            new FrameworkPropertyMetadata((InputScope)null, // default value 
                                        FrameworkPropertyMetadataOptions.Inherits));

    /// <summary> 
    ///     InputScope Property accessor
    /// </summary> 
    public InputScope InputScope
    {
        get { return (InputScope) GetValue(InputScopeProperty); }
        set { SetValue(InputScopeProperty, value); } 
    }

//    #endregion InputScope 

//    #region Data binding 

    /// <summary>
    /// Add / Remove TargetUpdatedEvent handler
    /// </summary> 
    public /*event*/ EventHandler<DataTransferEventArgs> TargetUpdated
    { 
        add     { AddHandler(Binding.TargetUpdatedEvent, value); } 
        remove  { RemoveHandler(Binding.TargetUpdatedEvent, value); }
    } 


    /// <summary>
    /// Add / Remove SourceUpdatedEvent handler 
    /// </summary>
    public /*event*/ EventHandler<DataTransferEventArgs> SourceUpdated 
    { 
        add     { AddHandler(Binding.SourceUpdatedEvent, value); }
        remove  { RemoveHandler(Binding.SourceUpdatedEvent, value); } 
    }


    /// <summary> 
    ///     DataContext DependencyProperty
    /// </summary> 
    public static final DependencyProperty DataContextProperty = 
            FrameworkElement.DataContextProperty.AddOwner(
                    typeof(FrameworkContentElement), 
                    new FrameworkPropertyMetadata(null,
                            FrameworkPropertyMetadataOptions.Inherits,
                            new PropertyChangedCallback(OnDataContextChanged)));

    /// <summary>
    ///     DataContextChanged event 
    /// </summary> 
    /// <remarks>
    ///     When an element's DataContext changes, all data-bound properties 
    ///     (on this element or any other element) whose Binding use this
    ///     DataContext will change to reflect the new value.  There is no
    ///     guarantee made about the order of these changes relative to the
    ///     raising of the DataContextChanged event.  The changes can happen 
    ///     before the event, after the event, or in any mixture.
    /// </remarks> 
    public /*event*/ DependencyPropertyChangedEventHandler DataContextChanged 
    {
        add { EventHandlersStoreAdd(FrameworkElement.DataContextChangedKey, value); } 
        remove { EventHandlersStoreRemove(FrameworkElement.DataContextChangedKey, value); }
    }

    /// <summary> 
    ///     DataContext Property
    /// </summary> 
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)] 
//    [Localizability(LocalizationCategory.NeverLocalize)]
    public Object DataContext 
    {
        get { return GetValue(DataContextProperty); }
        set { SetValue(DataContextProperty, value); }
    } 

    private static void OnDataContextChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    { 
        if (e.NewValue == BindingExpressionBase.DisconnectedItem)
            return; 

        ((FrameworkContentElement) d).RaiseDependencyPropertyChanged(FrameworkElement.DataContextChangedKey, e);
    }

    /// <summary>
    /// Get the BindingExpression for the given property 
    /// </summary> 
    /// <param name="dp">DependencyProperty that represents the property</param>
    /// <returns> BindingExpression if property is data-bound, null if it is not</returns> 
    public BindingExpression GetBindingExpression(DependencyProperty dp)
    {
        return BindingOperations.GetBindingExpression(this, dp);
    } 

    /// <summary> 
    /// Attach a data Binding to a property 
    /// </summary>
    /// <param name="dp">DependencyProperty that represents the property</param> 
    /// <param name="binding">description of Binding to attach</param>
    public BindingExpressionBase SetBinding(DependencyProperty dp, BindingBase binding)
    {
        return BindingOperations.SetBinding(this, dp, binding); 
    }

    /// <summary> 
    /// Convenience method.  Create a BindingExpression and attach it.
    /// Most fields of the BindingExpression get default values. 
    /// </summary>
    /// <param name="dp">DependencyProperty that represents the property</param>
    /// <param name="path">source path</param>
    public BindingExpression SetBinding(DependencyProperty dp, String path) 
    {
        return (BindingExpression)SetBinding(dp, new Binding(path)); 
    } 

    /// <summary> 
    ///     BindingGroup DependencyProperty
    /// </summary>
    public static final DependencyProperty BindingGroupProperty =
            FrameworkElement.BindingGroupProperty.AddOwner( 
                    typeof(FrameworkContentElement),
                    new FrameworkPropertyMetadata(null, 
                            FrameworkPropertyMetadataOptions.Inherits)); 

    /// <summary> 
    ///     BindingGroup Property
    /// </summary>
//    [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
//    [Localizability(LocalizationCategory.NeverLocalize)] 
    public BindingGroup BindingGroup
    { 
        get { return (BindingGroup)GetValue(BindingGroupProperty); } 
        set { SetValue(BindingGroupProperty, value); }
    } 

//    #endregion Data binding

//    #region LogicalTree 

    /// <returns> 
    ///     Returns a non-null value when some framework implementation 
    ///     of this method has a non-visual parent connection,
    /// </returns> 
    protected /*internal*/ public /*override*/ DependencyObject GetUIParentCore()
    {
        return this._parent;
    } 

    /// <summary> 
    ///     Allows adjustment to the event source 
    /// </summary>
    /// <remarks> 
    ///     Subclasses must /*override*/ this method
    ///     to be able to adjust the source during
    ///     route invocation <para/>
    /// 
    ///     NOTE: Expected to return null when no
    ///     change is made to source 
    /// </remarks> 
    /// <param name="args">
    ///     Routed Event Args 
    /// </param>
    /// <returns>
    ///     Returns new source
    /// </returns> 
    /*internal*/ public /*override*/ Object AdjustEventSource(RoutedEventArgs args)
    { 
        Object source = null; 

        // As part of routing events through logical trees, we have 
        // to be careful about events that come to us from "foreign"
        // trees.  For example, the event could come from an element
        // in our "implementation" visual tree, or from an element
        // in a different logical tree all together. 
        //
        // Note that we consider ourselves to be part of a logical tree 
        // if we have either a logical parent, or any logical children. 
        //
        // 

        if(_parent != null || HasLogicalChildren)
        {
            DependencyObject logicalSource = args.Source as DependencyObject; 
            if(logicalSource == null || !IsLogicalDescendent(logicalSource))
            { 
                args.Source=this; 
                source = this;
            } 
        }

        return source;
    } 

    // Allows adjustments to the branch source popped off the stack 
    /*internal*/ public /*virtual*/ void AdjustBranchSource(RoutedEventArgs args) 
    {
    } 

    //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft./*internal*/ public.BuildInfo.WCP_PUBLIC_KEY_STRING)]
    /*internal*/ public /*virtual*/ boolean IgnoreModelParentBuildRoute(RoutedEventArgs args)
    { 
        return false;
    } 

    /// <summary>
    ///     Allows FrameworkElement to augment the 
    ///     <see cref="EventRoute"/>
    /// </summary>
    /// <remarks>
    ///     NOTE: If this instance does not have a 
    ///     visualParent but has a model parent
    ///     then route is built through the model 
    ///     parent 
    /// </remarks>
    /// <param name="route"> 
    ///     The <see cref="EventRoute"/> to be
    ///     augmented
    /// </param>
    /// <param name="args"> 
    ///     <see cref="RoutedEventArgs"/> for the
    ///     RoutedEvent to be raised post building 
    ///     the route 
    /// </param>
    /// <returns> 
    ///     Whether or not the route should continue past the visual tree.
    ///     If this is true, and there are no more visual parents, the route
    ///     building code will call the GetUIParentCore method to find the
    ///     next non-visual parent. 
    /// </returns>
    /*internal*/ public /*override*/ /*sealed*/ boolean BuildRouteCore(EventRoute route, RoutedEventArgs args) 
    { 
        boolean continuePastCoreTree = false;

        // Verify Context Access
//         VerifyAccess();

        DependencyObject visualParent = (DependencyObject) ContentOperations.GetParent(this); 
        DependencyObject modelParent = this._parent;

        // FrameworkElement extends the basic event routing strategy by 
        // introducing the concept of a logical tree.  When an event
        // passes through an element in a logical tree, the source of 
        // the event needs to change to the leaf-most node in the same
        // logical tree that is in the route.

        // Check the route to see if we are returning into a logical tree 
        // that we left before.  If so, restore the source of the event to
        // be the source that it was when we left the logical tree. 
        DependencyObject branchNode = route.PeekBranchNode() as DependencyObject; 
        if (branchNode != null && IsLogicalDescendent(branchNode))
        { 
            // We keep the most recent source in the event args.  Note that
            // this is only for our consumption.  Once the event is raised,
            // it will use the source information in the route.
            args.Source  = (route.PeekBranchSource()); 

            AdjustBranchSource(args); 

            route.AddSource(args.Source);

            // By popping the branch node we will also be setting the source
            // in the event route.
            route.PopBranchNode();

            // Add intermediate ContentElements to the route
            FrameworkElement.AddIntermediateElementsToRoute(this, route, args, LogicalTreeHelper.GetParent(branchNode)); 
        } 


        // Check if the next element in the route is in a different
        // logical tree.

        if (!IgnoreModelParentBuildRoute(args)) 
        {
            // If there is no visual parent, route via the model tree. 
            if (visualParent == null) 
            {
                continuePastCoreTree = modelParent != null; 
            }
            else if(modelParent != null)
            {
                // If there is a model parent, record the branch node. 
                route.PushBranchNode(this, args.Source);

                // The source is going to be the visual parent, which 
                // could live in a different logical tree.
                args.Source  = (visualParent); 
            }

        }

        return continuePastCoreTree;
    } 

    /// <summary>
    ///     Add Style TargetType and FEF EventHandlers to the EventRoute 
    /// </summary>
    /*internal*/ public /*override*/ void AddToEventRouteCore(EventRoute route, RoutedEventArgs args)
    {
        FrameworkElement.AddStyleHandlersToEventRoute(null, this, route, args); 
    }

    // Returns if the given child instance is a logical descendent 
    private boolean IsLogicalDescendent(DependencyObject child)
    { 
        while (child != null)
        {
            if (child == this)
            { 
                return true;
            } 

            child = LogicalTreeHelper.GetParent(child);
        } 

        return false;
    }

    /*internal*/ public /*override*/ boolean InvalidateAutomationAncestorsCore(Stack<DependencyObject> branchNodeStack, /*out*/ boolean continuePastCoreTree)
    { 
        boolean continueInvalidation = true; 
        continuePastCoreTree = false;

        DependencyObject visualParent = (DependencyObject) ContentOperations.GetParent(this);
        DependencyObject modelParent = this._parent;

        DependencyObject branchNode = branchNodeStack.Count > 0 ? branchNodeStack.Peek() : null; 
        if (branchNode != null && IsLogicalDescendent(branchNode))
        { 
            branchNodeStack.Pop(); 
            continueInvalidation = FrameworkElement.InvalidateAutomationIntermediateElements(this, LogicalTreeHelper.GetParent(branchNode));
        } 

        // If there is no visual parent, route via the model tree.
        if (visualParent == null)
        { 
            continuePastCoreTree = modelParent != null;
        } 
        else if(modelParent != null) 
        {
            // If there is a model parent, record the branch node. 
            branchNodeStack.Push(this);
        }

        return continueInvalidation; 
    }

    /// <summary> 
    ///     Invoked when ancestor is changed.  This is invoked after
    ///     the ancestor has changed, and the purpose is to allow elements to 
    ///     perform actions based on the changed ancestor.
    /// </summary>
    //CASRemoval:[StrongNameIdentityPermissionAttribute(SecurityAction.InheritanceDemand, PublicKey=Microsoft./*internal*/ public.BuildInfo.WCP_PUBLIC_KEY_STRING)]
    /*internal*/ public /*virtual*/ void OnAncestorChanged() 
    {
    } 

    /// <summary>
    /// OnContentParentChanged is called when the parent of the content element is changed. 
    /// </summary>
    /// <param name="oldParent">Old parent or null if the content element did not have a parent before.</param>
    /*internal*/ public /*override*/ void OnContentParentChanged(DependencyObject oldParent)
    { 
        DependencyObject newParent = ContentOperations.GetParent(this);

        // Initialize, if not already done 
        TryFireInitialized();

        super.OnContentParentChanged(oldParent);
    }

    /// <summary> 
    ///     Indicates the current mode of lookup for both inheritance and resources.
    /// </summary> 
    /// <remarks> 
    ///     Used in property inheritence and reverse
    ///     inheritence and resource lookup to stop at 
    ///     logical tree boundaries
    ///
    ///     It is also used by designers such as Sparkle to
    ///     skip past the app resources directly to the theme. 
    ///     They are expected to merge in the client's app
    ///     resources via the MergedDictionaries feature on 
    ///     root element of the tree. 
    ///
    ///     NOTE: Property can be set only when the 
    ///     instance is not yet hooked to the tree. This
    ///     is to encourage setting it at construction time.
    ///     If we didn't restrict it to (roughly) construction
    ///     time, we would have to take the complexity of 
    ///     firing property invalidations when the flag was
    ///     changed. 
    /// </remarks> 
    /*internal*/ public InheritanceBehavior InheritanceBehavior
    { 
        get
        {
            Debug.Assert((int)InternalFlags.InheritanceBehavior0 == 0x08);
            Debug.Assert((int)InternalFlags.InheritanceBehavior1 == 0x10); 
            Debug.Assert((int)InternalFlags.InheritanceBehavior2 == 0x20);

            /*const*/static final int inheritanceBehaviorMask = 
                (int)InternalFlags.InheritanceBehavior0 +
                (int)InternalFlags.InheritanceBehavior1 + 
                (int)InternalFlags.InheritanceBehavior2;

            int inheritanceBehavior = ((int)_flags & inheritanceBehaviorMask) >> 3;
            return (InheritanceBehavior)inheritanceBehavior; 
        }

        set 
        {
            Debug.Assert((int)InternalFlags.InheritanceBehavior0 == 0x08); 
            Debug.Assert((int)InternalFlags.InheritanceBehavior1 == 0x10);
            Debug.Assert((int)InternalFlags.InheritanceBehavior2 == 0x20);

            /*const*/static final int inheritanceBehaviorMask = 
                (int)InternalFlags.InheritanceBehavior0 +
                (int)InternalFlags.InheritanceBehavior1 + 
                (int)InternalFlags.InheritanceBehavior2; 

            if (!this.IsInitialized) 
            {
                if ((int)value < 0 ||
                    (int)value > (int)InheritanceBehavior.SkipAllNext)
                { 
                    throw new InvalidEnumArgumentException("value", (int)value, typeof(InheritanceBehavior));
                } 

                int inheritanceBehavior = (int)value << 3;

                _flags = (InternalFlags)((inheritanceBehavior & inheritanceBehaviorMask) | (((int)_flags) & ~inheritanceBehaviorMask));

                if (_parent != null)
                { 
                    // This means that we are in the process of xaml parsing:
                    // an instance of FCE has been created and added to a parent, 
                    // but no children yet added to it (otherwise it would be initialized already 
                    // and we would not be allowed to change InheritanceBehavior).
                    // So we need to re-calculate properties accounting for the new 
                    // inheritance behavior.
                    // This must have no performance effect as the subtree of this
                    // element is empty (no children yet added).
                    TreeWalkHelper.InvalidateOnTreeChange(/*fe:*/null, /*fce:*/this, _parent, true); 
                }
            } 
            else 
            {
                throw new InvalidOperationException(/*SR.Get(SRID.Illegal_InheritanceBehaviorSettor)*/); 
            }
        }
    }

//    #endregion LogicalTree

//    #region ISupportInitialize 

    /// <summary> 
    ///     Initialization of this element is about to begin
    /// </summary>
    public /*virtual*/ void BeginInit()
    { 
        // Nested BeginInits on the same instance aren't permitted
        if (ReadInternalFlag(InternalFlags.InitPending)) 
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.NestedBeginInitNotSupported)*/);
        } 

        // Mark the element as pending initialization
        WriteInternalFlag(InternalFlags.InitPending, true);
    } 

    /// <summary> 
    ///     Initialization of this element has completed 
    /// </summary>
    public /*virtual*/ void EndInit() 
    {
        // Every EndInit must be preceeded by a BeginInit
        if (!ReadInternalFlag(InternalFlags.InitPending))
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.EndInitWithoutBeginInitNotSupported)*/);
        } 

        // Reset the pending flag
        WriteInternalFlag(InternalFlags.InitPending, false); 

        // Mark the element initialized and fire Initialized event
        // (eg. tree building via parser)
        TryFireInitialized(); 
    }

    /// <summary> 
    ///     Has this element been initialized
    /// </summary> 
    /// <remarks>
    ///     True if either EndInit or OnParentChanged were called
    /// </remarks>
//    [EditorBrowsable(EditorBrowsableState.Advanced)] 
    public boolean IsInitialized
    { 
        get { return ReadInternalFlag(InternalFlags.IsInitialized); } 
    }

    /// <summary>
    ///     This clr event is fired when
    ///     <see cref="IsInitialized"/>
    ///     becomes true 
    /// </summary>
//    [EditorBrowsable(EditorBrowsableState.Advanced)] 
    public /*event*/ EventHandler Initialized 
    {
        add { EventHandlersStoreAdd(FrameworkElement.InitializedKey, value); } 
        remove { EventHandlersStoreRemove(FrameworkElement.InitializedKey, value); }
    }

    /// <summary> 
    ///     This /*virtual*/ method in called when IsInitialized is set to true and it raises an Initialized event
    /// </summary> 
    protected /*virtual*/ void OnInitialized(EventArgs e) 
    {
        // Need to update the StyleProperty so that we can pickup 
        // the implicit style if it hasn't already been fetched
        if (!HasStyleEverBeenFetched)
        {
            UpdateStyleProperty(); 
        }

        // Need to update the ThemeStyleProperty so that we can pickup 
        // the implicit style if it hasn't already been fetched
        if (!HasThemeStyleEverBeenFetched) 
        {
            UpdateThemeStyleProperty();
        }

        RaiseInitialized(FrameworkElement.InitializedKey, e);
    } 

    // Helper method that tries to set IsInitialized to true
    // and Fire the Initialized event 
    // This method can be invoked from two locations
    //      1> EndInit
    //      2> OnParentChanged
    private void TryFireInitialized() 
    {
        if (!ReadInternalFlag(InternalFlags.InitPending) && 
            !ReadInternalFlag(InternalFlags.IsInitialized)) 
        {
            WriteInternalFlag(InternalFlags.IsInitialized, true); 

            OnInitialized(EventArgs.Empty);
        }
    } 

    // Helper method to retrieve and fire Clr Event handlers for Initialized event 
    private void RaiseInitialized(EventPrivateKey key, EventArgs e) 
    {
        EventHandlersStore store = EventHandlersStore; 
        if (store != null)
        {
            Delegate handler = store.Get(key);
            if (handler != null) 
            {
                ((EventHandler)handler)(this, e); 
            } 
        }
    } 

//    #endregion ISupportInitialize

//    #region LoadedAndUnloadedEvents 

    /// <summary> 
    ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Loaded event 
    ///     This DP is cleared when the Loaded event is either fired or cancelled for some reason
    /// </summary> 
    private static final DependencyProperty LoadedPendingProperty
        = FrameworkElement.LoadedPendingProperty.AddOwner(typeof(FrameworkContentElement));

    /// <summary> 
    ///     This DP is set on the root of a sub-tree that is about to receive a broadcast Unloaded event
    ///     This DP is cleared when the Unloaded event is either fired or cancelled for some reason 
    /// </summary> 
    private static final DependencyProperty UnloadedPendingProperty
        = FrameworkElement.UnloadedPendingProperty.AddOwner(typeof(FrameworkContentElement)); 

    /// <summary>
    ///     Turns true when this element is attached to a tree and is laid out and rendered.
    ///     Turns false when the element gets detached from a loaded tree 
    /// </summary>
    public boolean IsLoaded 
    { 
        get
        { 
            Object[] loadedPending = LoadedPending;
            Object[] unloadedPending = UnloadedPending;

            if (loadedPending == null && unloadedPending == null) 
            {
                // The HasHandler flags are used for validation of the IsLoaded flag 
                if (SubtreeHasLoadedChangeHandler) 
                {
                    // The IsLoaded flag is valid 
                    return IsLoadedCache;
                }
                else
                { 
                    // IsLoaded flag isn't valid
                    return BroadcastEventHelper.IsParentLoaded(this); 
                } 
            }
            else 
            {
                // This is the case where we might be
                // 1. Pending Unloaded only
                //    In this case we are already Loaded 
                // 2. Pending Loaded only
                //    In this case we are not Loaded yet 
                // 3. Pending both Loaded and Unloaded 
                //    We can get to this state only when Unloaded operation preceeds Loaded.
                //    If Loaded preceeded Unloaded then it is sure to have been cancelled 
                //    out by the latter.

                return (unloadedPending != null);
            } 
        }
    } 

    /// <summary>
    ///     Loaded RoutedEvent 
    /// </summary>

    public static final RoutedEvent LoadedEvent = FrameworkElement.LoadedEvent.AddOwner( typeof(FrameworkContentElement));

    /// <summary>
    ///     This event is fired when the element is laid out, rendered and ready for interaction 
    /// </summary> 

    public /*event*/ RoutedEventHandler Loaded 
    {
        add
        {
            AddHandler(FrameworkElement.LoadedEvent, value, false); 
        }
        remove 
        { 
            RemoveHandler(FrameworkElement.LoadedEvent, value);
        } 
    }


    /// <summary> 
    ///     Helper that will set the IsLoaded flag and Raise the Loaded event
    /// </summary> 
    /*internal*/ public void OnLoaded(RoutedEventArgs args) 
    {
        RaiseEvent(args); 
    }

    /// <summary>
    ///     Unloaded RoutedEvent 
    /// </summary>

    public static final RoutedEvent UnloadedEvent = FrameworkElement.UnloadedEvent.AddOwner( typeof(FrameworkContentElement)); 

    /// <summary> 
    ///     This clr event is fired when this element is detached form a loaded tree
    /// </summary>
    public /*event*/ RoutedEventHandler Unloaded
    { 
        add
        { 
            AddHandler(FrameworkElement.UnloadedEvent, value, false); 
        }
        remove 
        {
            RemoveHandler(FrameworkElement.UnloadedEvent, value);
        }
    } 

    /// <summary> 
    ///     Helper that will reset the IsLoaded flag and Raise the Unloaded event 
    /// </summary>
    /*internal*/ public void OnUnloaded(RoutedEventArgs args) 
    {
        RaiseEvent(args);
    }


    /// <summary> 
    ///     Notifies subclass of a new routed event handler.  Note that this is 
    ///     called once for each handler added, but OnRemoveHandler is only called
    ///     on the last removal. 
    /// </summary>
    /*internal*/ public /*override*/ void OnAddHandler(
        RoutedEvent routedEvent,
        Delegate handler) 
    {
        if (routedEvent == LoadedEvent || routedEvent == UnloadedEvent) 
        { 
            BroadcastEventHelper.AddHasLoadedChangeHandlerFlagInAncestry(this);
        } 
    }


    /// <summary> 
    ///     Notifies subclass of an event for which a handler has been removed.
    /// </summary> 
    /*internal*/ public /*override*/ void OnRemoveHandler( 
        RoutedEvent routedEvent,
        Delegate handler) 
    {
        // We only care about Loaded & Unloaded events
        if (routedEvent != LoadedEvent && routedEvent != UnloadedEvent)
            return; 

        if (!ThisHasLoadedChangeEventHandler) 
        { 
            BroadcastEventHelper.RemoveHasLoadedChangeHandlerFlagInAncestry(this);
        } 
    }


    // Helper method to retrieve and fire Clr Event handlers 
    /*internal*/ public void RaiseClrEvent(EventPrivateKey key, EventArgs args)
    { 
        EventHandlersStore store = EventHandlersStore; 
        if (store != null)
        { 
            Delegate handler = store.Get(key);
            if (handler != null)
            {
                ((EventHandler)handler)(this, args); 
            }
        } 
    } 

//    #endregion LoadedAndUnloadedEvents 

//    #region PopupControlService

    /// <summary> 
    ///     The DependencyProperty for the ToolTip property
    /// </summary> 
    public static final DependencyProperty ToolTipProperty = 
        ToolTipService.ToolTipProperty.AddOwner(typeof(FrameworkContentElement));

    /// <summary>
    ///     The ToolTip for the element.
    ///     If the value is of type ToolTip, then that is the ToolTip that will be used.
    ///     If the value is of any other type, then that value will be used 
    ///     as the content for a ToolTip provided by the system. Refer to ToolTipService
    ///     for attached properties to customize the ToolTip. 
    /// </summary> 
//    [Bindable(true), Category("Appearance")]
    public Object ToolTip 
    {
        get
        {
            return ToolTipService.GetToolTip(this); 
        }

        set 
        {
            ToolTipService.SetToolTip(this, value); 
        }
    }


    /// <summary>
    /// The DependencyProperty for the Contextmenu property 
    /// </summary> 
    public static final DependencyProperty ContextMenuProperty =
        ContextMenuService.ContextMenuProperty.AddOwner(typeof(FrameworkContentElement), 
        new FrameworkPropertyMetadata((ContextMenu) null));

    /// <summary>
    /// The ContextMenu data set on this element. Can be any type that can be converted to a UIElement. 
    /// </summary>
    public ContextMenu ContextMenu 
    { 
        get
        { 
            return (ContextMenu)GetValue(ContextMenuProperty);
        }

        set 
        {
            SetValue(ContextMenuProperty, value); 
        } 
    }

    /// <summary>
    ///     The RoutedEvent for the ToolTipOpening event.
    /// </summary>
    public static final RoutedEvent ToolTipOpeningEvent = ToolTipService.ToolTipOpeningEvent.AddOwner(typeof(FrameworkContentElement)); 

    /// <summary> 
    ///     An event that fires just before a ToolTip should be opened. 
    ///     This event does not fire if the value of ToolTip is null or unset.
    /// 
    ///     To manually open and close ToolTips, set the value of ToolTip to a non-null value
    ///     and then mark this event as handled.
    ///
    ///     To delay loading the actual ToolTip value, set the value of the ToolTip property to 
    ///     any value (you can also use it as a tag) and then set the value to the actual value
    ///     in a handler for this event. Do not mark the event as handled if the system provided 
    ///     functionality for showing or hiding the ToolTip is desired. 
    /// </summary>
    public /*event*/ ToolTipEventHandler ToolTipOpening 
    {
        add { AddHandler(ToolTipOpeningEvent, value); }
        remove { RemoveHandler(ToolTipOpeningEvent, value); }
    } 

    private static void OnToolTipOpeningThunk(Object sender, ToolTipEventArgs e) 
    { 
        ((FrameworkContentElement)sender).OnToolTipOpening(e);
    } 

    /// <summary>
    ///     Called when the ToolTipOpening event fires.
    ///     Allows subclasses to add functionality without having to attach 
    ///     an individual handler.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*virtual*/ void OnToolTipOpening(ToolTipEventArgs e)
    { 
    }

    /// <summary>
    ///     The RoutedEvent for the ToolTipClosing event. 
    /// </summary>
    public static final RoutedEvent ToolTipClosingEvent = ToolTipService.ToolTipClosingEvent.AddOwner(typeof(FrameworkContentElement)); 

    /// <summary>
    ///     An event that fires just before a ToolTip should be closed. 
    ///     This event will only fire if there was a preceding ToolTipOpening event.
    ///
    ///     To manually close a ToolTip and not use the system behavior, mark this event as handled.
    /// </summary> 
    public /*event*/ ToolTipEventHandler ToolTipClosing
    { 
        add { AddHandler(ToolTipClosingEvent, value); } 
        remove { RemoveHandler(ToolTipClosingEvent, value); }
    } 

    private static void OnToolTipClosingThunk(Object sender, ToolTipEventArgs e)
    {
        ((FrameworkContentElement)sender).OnToolTipClosing(e); 
    }

    /// <summary> 
    ///     Called when the ToolTipClosing event fires.
    ///     Allows subclasses to add functionality without having to attach 
    ///     an individual handler.
    /// </summary>
    /// <param name="e">Event arguments</param>
    protected /*virtual*/ void OnToolTipClosing(ToolTipEventArgs e) 
    {
    } 

    /// <summary>
    ///     RoutedEvent for the ContextMenuOpening event. 
    /// </summary>
    public static final RoutedEvent ContextMenuOpeningEvent = ContextMenuService.ContextMenuOpeningEvent.AddOwner(typeof(FrameworkContentElement));

    /// <summary> 
    ///     An event that fires just before a ContextMenu should be opened.
    /// 
    ///     To manually open and close ContextMenus, mark this event as handled. 
    ///     Otherwise, the value of the the ContextMenu property will be used
    ///     to automatically open a ContextMenu. 
    /// </summary>
    public /*event*/ ContextMenuEventHandler ContextMenuOpening
    {
        add { AddHandler(ContextMenuOpeningEvent, value); } 
        remove { RemoveHandler(ContextMenuOpeningEvent, value); }
    } 

    private static void OnContextMenuOpeningThunk(Object sender, ContextMenuEventArgs e)
    { 
        ((FrameworkContentElement)sender).OnContextMenuOpening(e);
    }

    /// <summary> 
    ///     Called when ContextMenuOpening is raised on this element.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*virtual*/ void OnContextMenuOpening(ContextMenuEventArgs e)
    { 
    }

    /// <summary>
    ///     RoutedEvent for the ContextMenuClosing event. 
    /// </summary>
    public static final RoutedEvent ContextMenuClosingEvent = ContextMenuService.ContextMenuClosingEvent.AddOwner(typeof(FrameworkContentElement)); 

    /// <summary>
    ///     An event that fires just as a ContextMenu closes. 
    /// </summary>
    public /*event*/ ContextMenuEventHandler ContextMenuClosing
    {
        add { AddHandler(ContextMenuClosingEvent, value); } 
        remove { RemoveHandler(ContextMenuClosingEvent, value); }
    } 

    private static void OnContextMenuClosingThunk(Object sender, ContextMenuEventArgs e)
    { 
        ((FrameworkContentElement)sender).OnContextMenuClosing(e);
    }

    /// <summary> 
    ///     Called when ContextMenuClosing is raised on this element.
    /// </summary> 
    /// <param name="e">Event arguments</param> 
    protected /*virtual*/ void OnContextMenuClosing(ContextMenuEventArgs e)
    { 
    }

//    #endregion

    // This has to be /*virtual*/, since there is no concept of "core" content children,
    // so we have no choice by to rely on FrameworkContentElement to use logical 
    // children instead. 
    /*internal*/ public /*override*/ void InvalidateForceInheritPropertyOnChildren(DependencyProperty property)
    { 
        IEnumerator enumerator = LogicalChildren;

        if(enumerator != null)
        { 
            while(enumerator.MoveNext())
            { 
                DependencyObject child =enumerator.Current as DependencyObject; 
                if(child != null)
                { 
                    // CODE




                    child.CoerceValue(property); 
                } 
            }
        } 
    }

    // Helper method to retrieve and fire Clr Event handlers for DependencyPropertyChanged event
    private void RaiseDependencyPropertyChanged(EventPrivateKey key, DependencyPropertyChangedEventArgs args) 
    {
        EventHandlersStore store = EventHandlersStore; 
        if (store != null) 
        {
            Delegate handler = store.Get(key); 
            if (handler != null)
            {
                ((DependencyPropertyChangedEventHandler)handler)(this, args);
            } 
        }
    } 

    private void EventHandlersStoreAdd(EventPrivateKey key, Delegate handler)
    { 
        EnsureEventHandlersStore();
        EventHandlersStore.Add(key, handler);
    }

    private void EventHandlersStoreRemove(EventPrivateKey key, Delegate handler)
    { 
        EventHandlersStore store = EventHandlersStore; 
        if (store != null)
        { 
            store.Remove(key, handler);
        }
    }

    // Gettor and Settor for flag that indicates
    // if this instance has some property values 
    // that are set to a resource reference 
    /*internal*/ public boolean HasResourceReference
    { 
        get { return ReadInternalFlag(InternalFlags.HasResourceReferences); }
        set { WriteInternalFlag(InternalFlags.HasResourceReferences, value); }
    }

    /*internal*/ public boolean IsLogicalChildrenIterationInProgress
    { 
        get { return ReadInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress); } 
        set { WriteInternalFlag(InternalFlags.IsLogicalChildrenIterationInProgress, value); }
    } 

    /*internal*/ public boolean SubtreeHasLoadedChangeHandler
    {
        get { return ReadInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler); } 
        set { WriteInternalFlag2(InternalFlags2.TreeHasLoadedChangeHandler, value); }
    } 

    /*internal*/ public boolean IsLoadedCache
    { 
        get { return ReadInternalFlag2(InternalFlags2.IsLoadedCache); }
        set { WriteInternalFlag2(InternalFlags2.IsLoadedCache, value); }
    }

    /*internal*/ public boolean IsParentAnFE
    { 
        get { return ReadInternalFlag2(InternalFlags2.IsParentAnFE); } 
        set { WriteInternalFlag2(InternalFlags2.IsParentAnFE, value); }
    } 

    /*internal*/ public boolean IsTemplatedParentAnFE
    {
        get { return ReadInternalFlag2(InternalFlags2.IsTemplatedParentAnFE); } 
        set { WriteInternalFlag2(InternalFlags2.IsTemplatedParentAnFE, value); }
    } 

    /*internal*/ public boolean HasLogicalChildren
    { 
        get { return ReadInternalFlag(InternalFlags.HasLogicalChildren); }
        set { WriteInternalFlag(InternalFlags.HasLogicalChildren, value); }
    }

    // See comment on FrameworkElement.TemplateChildIndex
    /*internal*/ public int TemplateChildIndex 
    { 
        get
        { 
            int childIndex = (((int)_flags2) & 0xFFFF);
            if (childIndex == 0xFFFF)
            {
                return -1; 
            }
            else 
            { 
                return (int)childIndex;
            } 
        }
        set
        {
            // We store TemplateChildIndex as a 16-bit integer with 0xFFFF meaning "-1". 
            // Thus we support any indices in the range [-1, 65535).
            if (value < -1 || value >= 0xFFFF) 
            { 
                throw new ArgumentOutOfRangeException("value", SR.Get(SRID.TemplateChildIndexOutOfRange));
            } 

            int childIndex = (value == -1) ? 0xFFFF : (int)value;

            _flags2 = (InternalFlags2)(childIndex | (((int)_flags2) & 0xFFFF0000)); 
        }
    } 

    /*internal*/ public boolean IsRequestingExpression
    { 
        get { return ReadInternalFlag2(InternalFlags2.IsRequestingExpression); }
        set { WriteInternalFlag2(InternalFlags2.IsRequestingExpression, value); }
    }

    // Extracts the required flag and returns
    // boolean to indicate if it is set or unset 
    /*internal*/ public boolean ReadInternalFlag(InternalFlags reqFlag) 
    {
        return (_flags & reqFlag) != 0; 
    }

    /*internal*/ public boolean ReadInternalFlag2(InternalFlags2 reqFlag)
    { 
        return (_flags2 & reqFlag) != 0;
    } 

    // Sets or Unsets the required flag based on
    // the boolean argument 
    /*internal*/ public void WriteInternalFlag(InternalFlags reqFlag, boolean set)
    {
        if (set)
        { 
            _flags |= reqFlag;
        } 
        else 
        {
            _flags &= (~reqFlag); 
        }
    }

    /*internal*/ public void WriteInternalFlag2(InternalFlags2 reqFlag, boolean set) 
    {
        if (set) 
        { 
            _flags2 |= reqFlag;
        } 
        else
        {
            _flags2 &= ~reqFlag;
        } 
    }

    // Style/Template state (internals maintained by Style) 
    private Style _styleCache;

    // ThemeStyle used only when a DefaultStyleKey is specified
    private Style _themeStyleCache;

    // See FrameworkElement (who also have these) for details on these values. 
    /*internal*/ public DependencyObject _templatedParent;    // Non-null if this Object was created as a result of a Template.VisualTree

    // Resources dictionary 
    private static final UncommonField<ResourceDictionary> ResourcesField = FrameworkElement.ResourcesField;

    private InternalFlags  _flags  = 0; // field used to store various flags such as HasResourceReferences, etc.
    private InternalFlags2 _flags2 = InternalFlags2.Default; // field used to store various flags such as HasResourceReferences, etc.
    
    //-----------------------------------------------------
    // 
    //  Constructors
    //
    //-----------------------------------------------------

    //------------------------------------------------------
    // 
    //  Public Methods 
    //
    //----------------------------------------------------- 

//    #region Public Methods


    /// <summary>
    ///     Returns logical parent 
    /// </summary> 
    public /*new*/ DependencyObject Parent
    { 
        get
        {
            // Verify Context Access
            // VerifyAccess(); 

            return ContextVerifiedGetParent(); 
        } 
    }

    /// <summary>
    /// Registers the name - element combination from the
    /// NameScope that the current element belongs to.
    /// </summary> 
    /// <param name="name">Name of the element</param>
    /// <param name="scopedElement">Element where name is defined</param> 
    public void RegisterName(String name, Object scopedElement) 
    {
        INameScope nameScope = FrameworkElement.FindScope(this); 
        if (nameScope != null)
        {
            nameScope.RegisterName(name, scopedElement);
        } 
        else
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.NameScopeNotFound, name, "register")*/); 
        }
    } 

    /// <summary>
    /// Unregisters the name - element combination from the
    /// NameScope that the current element belongs to. 
    /// </summary>
    /// <param name="name">Name of the element</param> 
    public void UnregisterName(String name) 
    {
        INameScope nameScope = FrameworkElement.FindScope(this); 
        if (nameScope != null)
        {
            nameScope.UnregisterName(name);
        } 
        else
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.NameScopeNotFound, name, "unregister")*/); 
        }
    } 

    /// <summary>
    /// Find the Object with given name in the
    /// NameScope that the current element belongs to. 
    /// </summary>
    /// <param name="name">String name to index</param> 
    /// <returns>context if found, else null</returns> 
    public Object FindName(String name)
    { 
        DependencyObject scopeOwner;
        return FindName(name, /*out*/ scopeOwner);
    }

    // /*internal*/ public version of FindName that returns the scope owner
    /*internal*/ public Object FindName(String name, /*out*/ DependencyObject scopeOwner) 
    { 
        INameScope nameScope = FrameworkElement.FindScope(this, /*out*/ scopeOwner);
        if (nameScope != null) 
        {
            return nameScope.FindName(name);
        }

        return null;
    } 

    /// <summary>
    /// Elements that arent connected to the tree do not receive theme change notifications. 
    /// We leave it upto the app author to listen for such changes and invoke this method on
    /// elements that they know that arent connected to the tree. This method will update the
    /// DefaultStyle for the subtree starting at the current instance.
    /// </summary> 
    public void UpdateDefaultStyle()
    { 
        TreeWalkHelper.InvalidateOnResourcesChange(/* fe = */ null, /* fce = */ this, ResourcesChangeInfo.ThemeChangeInfo); 
    }


//    #endregion Public Methods

    //------------------------------------------------------ 
    //
    //  Protected Methods 
    // 
    //------------------------------------------------------

//    #region Protected Methods

    /// <summary>
    ///     Returns enumerator to logical children 
    /// </summary>
    protected /*internal*/ /*virtual*/ IEnumerator LogicalChildren 
    { 
        get { return null; }
    } 

//    #endregion Protected Methods

    //----------------------------------------------------- 
    //
    //  Internal Methods 
    // 
    //------------------------------------------------------

//    #region Internal Methods/

    /// <summary>
    ///     Tries to find a Resource for the given resourceKey in the current 
    ///     element's ResourceDictionary.
    /// </summary> 
    /*internal*/ public Object FindResourceOnSelf(Object resourceKey, boolean allowDeferredResourceReference, boolean mustReturnDeferredResourceReference) 
    {
        ResourceDictionary resources = ResourcesField.GetValue(this); 
        if ((resources != null) && resources.Contains(resourceKey))
        {
            boolean canCache;
            return resources.FetchResource(resourceKey, allowDeferredResourceReference, mustReturnDeferredResourceReference, /*out*/ canCache); 
        }

        return DependencyProperty.UnsetValue; 
    }

    /*internal*/ public DependencyObject ContextVerifiedGetParent()
    {
        return _parent;
    } 

    // 
    protected /*internal*/ void AddLogicalChild(Object child)
    { 
        if (child != null)
        { 
            // It is invalid to modify the children collection that we 
            // might be iterating during a property invalidation tree walk.
            if (IsLogicalChildrenIterationInProgress) 
            {
                throw new InvalidOperationException(/*SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk)*/);
            }

            // Now that the child is going to be added, the FE/FCE construction is considered finished,
            // so we do not expect a change of InheritanceBehavior property, 
            // so we can pick up properties from styles and resources. 
            TryFireInitialized();

            boolean exceptionThrown = true;
            try
            {
                HasLogicalChildren = true; 

                // Child is present; reparent him to this element 
                FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
                fo.ChangeLogicalParent(this);

                exceptionThrown = false;
            }
            finally
            { 
                if (exceptionThrown)
                { 
                    // 
                    // Consider doing this...
                    //RemoveLogicalChild(child);
                }
            } 
        }
    } 


    // 
    protected /*internal*/ void RemoveLogicalChild(Object child) 
    { 
        if (child != null)
        { 
            // It is invalid to modify the children collection that we
            // might be iterating during a property invalidation tree walk.
            if (IsLogicalChildrenIterationInProgress)
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.CannotModifyLogicalChildrenDuringTreeWalk)*/);
            } 

            // Child is present
            FrameworkObject fo = new FrameworkObject(child as DependencyObject); 
            if (fo.Parent == this)
            {
                fo.ChangeLogicalParent(null);
            } 

            // This could have been the last child, so check if we have any more children 
            IEnumerator children = LogicalChildren; 

            // if null, there are no children. 
            if (children == null)
            {
                HasLogicalChildren = false;
            } 
            else
            { 
                // If we can move next, there is at least one child 
                HasLogicalChildren = children.MoveNext();
            } 
        }
    }

    /// <summary> 
    ///     Invoked when logical parent is changed.  This just
    ///     sets the parent pointer. 
    /// </summary> 
    /// <remarks>
    ///     A parent change is considered catastrohpic and results in a large 
    ///     amount of invalidations and tree traversals. <cref see="DependencyFastBuild"/>
    ///     is recommended to reduce the work necessary to build a tree
    /// </remarks>
    /// <param name="newParent"> 
    ///     New parent that was set
    /// </param> 
    /*internal*/ public void ChangeLogicalParent(DependencyObject newParent) 
    {
        /////////////////// 
        // OnNewParent:
        ///////////////////

        // 
        // -- Approved By The Core Team --
        // 
        // Do not allow foreign threads to change the tree. 
        // (This is a noop if this Object is not assigned to a Dispatcher.)
        // 
        // We also need to ensure that the tree is homogenous with respect
        // to the dispatchers that the elements belong to.
        //
        this.VerifyAccess(); 
        if(newParent != null)
        { 
            newParent.VerifyAccess(); 
        }

        // Logical Parent must first be dropped before you are attached to a newParent
        // This mitigates illegal tree state caused by logical child stealing as illustrated in bug 970706
        if (_parent != null && newParent != null && _parent != newParent)
        { 
            throw new /*System.*/InvalidOperationException(/*SR.Get(SRID.HasLogicalParent)*/);
        } 

        // Trivial check to avoid loops
        if (newParent == this) 
        {
            throw new /*System.*/InvalidOperationException(/*SR.Get(SRID.CannotBeSelfParent)*/);
        }

        // Logical Parent implies no InheritanceContext
        if (newParent != null) 
        { 
            ClearInheritanceContext();
        } 

        IsParentAnFE = newParent instanceof FrameworkElement;

        DependencyObject oldParent = _parent; 
        OnNewParent(newParent);

        // Update Has[Loaded/Unloaded]Handler Flags 
        BroadcastEventHelper.AddOrRemoveHasLoadedChangeHandlerFlag(this, oldParent, newParent);


        // Fire Loaded and Unloaded Events
        BroadcastEventHelper.BroadcastLoadedOrUnloadedEvent(this, oldParent, newParent);


        /////////////////// 
        // OnParentChanged: 
        ///////////////////

        // Invalidate relevant properties for this subtree
        DependencyObject parent = (newParent != null) ? newParent : oldParent;
        TreeWalkHelper.InvalidateOnTreeChange(/* fe = */ null, /* fce = */ this, parent, (newParent != null));

        // If no one has called BeginInit then mark the element initialized and fire Initialized event
        // (non-parser programmatic tree building scenario) 
        TryFireInitialized(); 
    }

    /// <summary>
    ///     Called before the parent is chanded to the new value.
    /// </summary>
    /*internal*/ public /*virtual*/ void OnNewParent(DependencyObject newParent) 
    {
        // 
        // This API is only here for compatability with the old 
        // behavior.  Note that FrameworkElement does not have
        // this /*virtual*/, so why do we need it here? 
        //

        DependencyObject oldParent = _parent;
        _parent = newParent; 


        // Synchronize ForceInherit properties 
        if(_parent != null)
        { 
            UIElement.SynchronizeForceInheritProperties(null, this, null, _parent);
        }
        else
        { 
            UIElement.SynchronizeForceInheritProperties(null, this, null, oldParent);
        } 



        // Synchronize ReverseInheritProperty Flags
        //
        // NOTE: do this AFTER synchronizing force-inherited flags, since
        // they often effect focusability and such. 
        this.SynchronizeReverseInheritPropertyFlags(oldParent, false);
    } 

    // OnAncestorChangedInternal variant when we know what type (FE/FCE) the
    //  tree node is. 
    /// <SecurityNote>
    ///     Critical: This code calls into PresentationSource.OnAncestorChanged which is link demand protected
    ///     it does so only for content elements and not for FEs. But if called externally and configured
    ///     inappropriately it can be used to change the tree 
    ///     TreatAsSafe: This does not let you get at the presentationsource which is what we do not want to expose
    /// </SecurityNote> 
//    [SecurityCritical,SecurityTreatAsSafe] 
        /*internal*/ public void OnAncestorChangedInternal(TreeChangeInfo parentTreeState)
    { 
        // Cache the IsSelfInheritanceParent flag
        boolean isSelfInheritanceParent = IsSelfInheritanceParent;

        if (parentTreeState.Root != this) 
        {
            // Clear the HasStyleChanged flag 
            HasStyleChanged = false; 
            HasStyleInvalidated = false;

        }

        // If this is a tree add operation update the ShouldLookupImplicitStyles
        // flag with respect to your parent. 
        if (parentTreeState.IsAddOperation)
        { 
            FrameworkObject fo = 

                new FrameworkObject(null, this); 
            fo.SetShouldLookupImplicitStyles();
        }

        // Invalidate ResourceReference properties 
        if (HasResourceReference)
        { 
            // This operation may cause a style change and hence should be done before the call to 
            // InvalidateTreeDependents as it relies on the HasStyleChanged flag
            TreeWalkHelper.OnResourcesChanged(this, ResourcesChangeInfo.TreeChangeInfo, false); 
        }

        // If parent is a FrameworkElement
        // This is also an operation that could change the style 
        FrugalObjectList<DependencyProperty> currentInheritableProperties =
        InvalidateTreeDependentProperties(parentTreeState, isSelfInheritanceParent); 

        // we have inherited properties that changes as a result of the above;
        // invalidation; push that list of inherited properties on the stack 
        // for the children to use
        parentTreeState.InheritablePropertiesStack.Push(currentInheritableProperties);


        // Notify the PresentationSource that this element's ancestry may have changed.
        // We only need the ContentElement's because UIElements are taken care of 
        // through the Visual class. 
        PresentationSource.OnAncestorChanged(this);


        // Call OnAncestorChanged
        OnAncestorChanged();

        // Notify mentees if they exist
        if (PotentiallyHasMentees) 
        { 
            // Raise the ResourcesChanged Event so that ResourceReferenceExpressions
            // on non-[FE/FCE] listening for this can then update their values 
            RaiseClrEvent(FrameworkElement.ResourcesChangedKey, EventArgs.Empty);
        }
    }

    // Invalidate all the properties that may have changed as a result of
    //  changing this element's parent in the logical (and sometimes visual tree.) 
    /*internal*/ public FrugalObjectList<DependencyProperty> InvalidateTreeDependentProperties(TreeChangeInfo parentTreeState, boolean isSelfInheritanceParent) 
    {
        AncestorChangeInProgress = true; 


        try
        { 
            // Style property is a special case of a non-inherited property that needs
            // invalidation for parent changes. Invalidate StyleProperty if it hasn't been 
            // locally set because local value takes precedence over implicit references 
            if (!HasLocalStyle && (this != parentTreeState.Root))
            { 
                UpdateStyleProperty();
            }

            Style selfStyle = null; 
            Style selfThemeStyle = null;
            DependencyObject templatedParent = null; 

            int childIndex = -1;
            ChildRecord childRecord = new ChildRecord(); 
            boolean isChildRecordValid = false;

            selfStyle = Style;
            selfThemeStyle = ThemeStyle; 
            templatedParent = TemplatedParent;
            childIndex = TemplateChildIndex; 

            // StyleProperty could have changed during invalidation of ResourceReferenceExpressions if it
            // were locally set or during the invalidation of unresolved implicitly referenced style 
            boolean hasStyleChanged = HasStyleChanged;

            // Fetch selfStyle, hasStyleChanged and childIndex for the current node
            FrameworkElement.GetTemplatedParentChildRecord(templatedParent, childIndex, /*out*/ childRecord, /*out*/ isChildRecordValid); 

            FrameworkElement parentFE; 
            FrameworkContentElement parentFCE; 
            boolean hasParent = FrameworkElement.GetFrameworkParent(this, /*out*/ parentFE, /*out*/ parentFCE);

            DependencyObject parent = null;
            InheritanceBehavior parentInheritanceBehavior = InheritanceBehavior.Default;
            if (hasParent)
            { 
                if (parentFE != null)
                { 
                    parent = parentFE; 
                    parentInheritanceBehavior = parentFE.InheritanceBehavior;
                } 
                else
                {
                    parent = parentFCE;
                    parentInheritanceBehavior = parentFCE.InheritanceBehavior; 
                }
            } 

            if (!TreeWalkHelper.SkipNext(InheritanceBehavior) && !TreeWalkHelper.SkipNow(parentInheritanceBehavior))
            { 
                // Synchronize InheritanceParent
                this.SynchronizeInheritanceParent(parent);
            }
            else if (!IsSelfInheritanceParent) 
            {
                // Set IsSelfInheritanceParet on the root node at a tree boundary 
                // so that all inheritable properties are cached on it. 
                SetIsSelfInheritanceParent();
            } 

            // Loop through all cached inheritable properties for the parent to see if they should be invalidated.
            return TreeWalkHelper.InvalidateTreeDependentProperties(parentTreeState, /* fe = */ null, /* fce = */ this, selfStyle, selfThemeStyle,
            		/*ref*/ childRecord, isChildRecordValid, hasStyleChanged, isSelfInheritanceParent); 
        }
        finally 
        { 
            AncestorChangeInProgress = false;

        }
    }

    /// <summary> 
    ///    Check if the current element has a Loaded/Unloaded Change Handler.
    /// </summary> 
    /// <remarks> 
    ///    This is called this when a loaded handler element is removed.
    ///  We need to check if the parent should clear or maintain the 
    ///  SubtreeHasLoadedChangeHandler bit.   For example the parent may also
    ///  have a handler.
    ///    This could be more efficent if it were a bit on the element,
    ///  set and cleared when the handler or templates state changes.  I expect 
    ///  Event Handler state changes less often than element parentage.
    /// </remarks> 
    /*internal*/ public boolean ThisHasLoadedChangeEventHandler 
    {
        get 
        {
                if (null != EventHandlersStore)
                {
                    if (EventHandlersStore.Contains(LoadedEvent) || EventHandlersStore.Contains(UnloadedEvent)) 
                    {
                        return true; 
                    } 
                }
                if(null != Style && Style.HasLoadedChangeHandler) 
                {
                    return true;
                }
                if(null != ThemeStyle && ThemeStyle.HasLoadedChangeHandler) 
                {
                    return true; 
                } 

                if(HasFefLoadedChangeHandler) 
                {
                    return true;
                }
                return false; 
            }
    } 

    /*internal*/ public boolean HasFefLoadedChangeHandler
    { 
        get
        {
            if(null == TemplatedParent)
            { 
                return false;
            } 
            FrameworkElementFactory fefRoot = BroadcastEventHelper.GetFEFTreeRoot(TemplatedParent); 
            if(null == fefRoot)
            { 
                return false;
            }
            FrameworkElementFactory fef = StyleHelper.FindFEF(fefRoot, TemplateChildIndex);
            if(null == fef) 
            {
                return false; 
            } 
            return fef.HasLoadedChangeHandler;
        } 
    }


    /// <summary> 
    ///     This method causes the StyleProperty to be re-evaluated
    /// </summary> 
    /*internal*/ public void UpdateStyleProperty() 
    {
        if (!HasStyleInvalidated) 
        {
            if (IsStyleUpdateInProgress == false)
            {
                IsStyleUpdateInProgress = true; 
                try
                { 
                    InvalidateProperty(StyleProperty); 
                    HasStyleInvalidated = true;
                } 
                finally
                {
                    IsStyleUpdateInProgress = false;
                } 
            }
            else 
            { 
                throw new InvalidOperationException(/*SR.Get(SRID.CyclicStyleReferenceDetected, this)*/);
            } 
        }
    }

    /// <summary> 
    ///     This method causes the ThemeStyleProperty to be re-evaluated
    /// </summary> 
    /*internal*/ public void UpdateThemeStyleProperty() 
    {
        if (IsThemeStyleUpdateInProgress == false) 
        {
            IsThemeStyleUpdateInProgress = true;
            try
            { 
                StyleHelper.GetThemeStyle(/* fe = */ null, /* fce = */ this);

                // Update the ContextMenu and ToolTips separately because they aren't in the tree 
                ContextMenu contextMenu =
                        GetValueEntry( 
                                LookupEntry(ContextMenuProperty.GlobalIndex),
                                ContextMenuProperty,
                                null,
                                RequestFlags.DeferredReferences).Value as ContextMenu; 
                if (contextMenu != null)
                { 
                    TreeWalkHelper.InvalidateOnResourcesChange(contextMenu, null, ResourcesChangeInfo.ThemeChangeInfo); 
                }

                DependencyObject toolTip =
                        GetValueEntry(
                                LookupEntry(ToolTipProperty.GlobalIndex),
                                ToolTipProperty, 
                                null,
                                RequestFlags.DeferredReferences).Value as DependencyObject; 

                if (toolTip != null)
                { 
                    FrameworkObject toolTipFO = new FrameworkObject(toolTip);
                    if (toolTipFO.IsValid)
                    {
                        TreeWalkHelper.InvalidateOnResourcesChange(toolTipFO.FE, toolTipFO.FCE, ResourcesChangeInfo.ThemeChangeInfo); 
                    }
                } 

                OnThemeChanged();
            } 
            finally
            {
                IsThemeStyleUpdateInProgress = false;
            } 
        }
        else 
        { 
            throw new InvalidOperationException(/*SR.Get(SRID.CyclicThemeStyleReferenceDetected, this)*/);
        } 
    }

    // Called when the theme changes so resources not in the tree can be updated by subclasses
    /*internal*/ public /*virtual*/ void OnThemeChanged() 
    {
    } 

    ///<summary>
    ///     Initiate the processing for Loaded event broadcast starting at this node 
    /// </summary>
    /// <remarks>
    ///     This method is to allow firing Loaded event from a Helper class since the /*override*/ is protected
    /// </remarks> 
    /*internal*/ public void FireLoadedOnDescendentsInternal()
    { 
        // This is to prevent duplicate Broadcasts for the Loaded event 
        if (LoadedPending == null)
        { 
            DependencyObject parent = Parent;


            // Check if this Loaded cancels against a previously queued Unloaded event 
            // Note that if the Loaded and the Unloaded do not change the position of
            // the node within the loagical tree they are considered to cancel each other out. 
            Object[] unloadedPending = UnloadedPending; 
            if (unloadedPending == null || unloadedPending[2] != parent)
            { 
                // Add a callback to the MediaContext which will be called
                // before the first render after this point
                BroadcastEventHelper.AddLoadedCallback(this, parent);
            } 
            else
            { 
                // Dequeue Unloaded 
                BroadcastEventHelper.RemoveUnloadedCallback(this, unloadedPending);
            } 
        }
    }

    ///<summary> 
    ///     Broadcast Unloaded event starting at this node
    /// </summary> 
    /*internal*/ public void FireUnloadedOnDescendentsInternal() 
    {
        // This is to prevent duplicate Broadcasts for the Unloaded event 
        if (UnloadedPending == null)
        {
            DependencyObject parent = Parent;


            // Check if this Unloaded cancels against a previously queued Loaded event 
            // Note that if the Loaded and the Unloaded do not change the position of 
            // the node within the loagical tree they are considered to cancel each other out.
            Object[] loadedPending = LoadedPending; 
            if (loadedPending == null)
            {
                // Add a callback to the MediaContext which will be called
                // before the first render after this point 
                BroadcastEventHelper.AddUnloadedCallback(this, parent);
            } 
            else 
            {
                // Dequeue Loaded 
                BroadcastEventHelper.RemoveLoadedCallback(this, loadedPending);
            }
        }
    } 

    /// <summary> 
    ///     You are about to provided as the InheritanceContext for the target. 
    ///     You can choose to allow this or not.
    /// </summary> 
    /*internal*/ public /*override*/ boolean ShouldProvideInheritanceContext(DependencyObject target, DependencyProperty property)
    {
        // return true if the target is neither a FE or FCE
        FrameworkObject fo = new FrameworkObject(target); 
        return !fo.IsValid;
    } 

    // Define the DO's inheritance context
    /*internal*/ public /*override*/ DependencyObject InheritanceContext 
    {
        get { return InheritanceContextField.GetValue(this); }
    }

    /// <summary>
    ///     You have a new InheritanceContext 
    /// </summary> 
    /// <remarks>
    ///     This is to solve the case of programmatically creating a VisualBrush or BitmapCacheBrush 
    ///     with an element in it and the element not getting Initialized.
    /// </remarks>
    /*internal*/ public /*override*/ void AddInheritanceContext(DependencyObject context, DependencyProperty property)
    { 
        super.AddInheritanceContext(context, property);

        // Initialize, if not already done 
        TryFireInitialized();

        // accept the new inheritance context provided that
        // a) the requested link uses VisualBrush.Visual or BitmapCacheBrush.TargetProperty
        // b) this element has no visual or logical parent
        // c) the context does not introduce a cycle 
        if ((property == VisualBrush.VisualProperty || property == BitmapCacheBrush.TargetProperty)
            && FrameworkElement.GetFrameworkParent(this) == null 
             //!FrameworkObject.IsEffectiveAncestor(this, context, property)) 
            && !FrameworkObject.IsEffectiveAncestor(this, context))
        { 
            //FrameworkObject.Log("+ {0}", FrameworkObject.LogIC(context, property, this));
            if (!HasMultipleInheritanceContexts && InheritanceContext == null)
            {
                // first request - accept the new inheritance context 
                InheritanceContextField.SetValue(this, context);
                OnInheritanceContextChanged(EventArgs.Empty); 
            } 
            else if (InheritanceContext != null)
            { 
                // second request - remove all context and enter "shared" mode
                InheritanceContextField.ClearValue(this);
                WriteInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts, true);
                OnInheritanceContextChanged(EventArgs.Empty); 
            }
            // else already in shared mode - ignore the request 
        } 
    }

    // Remove an inheritance context
    /*internal*/ public /*override*/ void RemoveInheritanceContext(DependencyObject context, DependencyProperty property)
    {
        if (InheritanceContext == context) 
        {
            //FrameworkObject.Log("- {0}", FrameworkObject.LogIC(context, property, this)); 
            InheritanceContextField.ClearValue(this); 
            OnInheritanceContextChanged(EventArgs.Empty);
        } 

        super.RemoveInheritanceContext(context, property);
    }

    // Clear the inheritance context (called when the element
    // gets a real parent 
    private void ClearInheritanceContext() 
    {
        if (InheritanceContext != null) 
        {
            InheritanceContextField.ClearValue(this);
            OnInheritanceContextChanged(EventArgs.Empty);
        } 
    }

    /// <summary> 
    ///     This is a means for subclasses to get notification
    ///     of InheritanceContext changes and then they can do 
    ///     their own thing.
    /// </summary>
    /*internal*/ public /*override*/ void OnInheritanceContextChangedCore(EventArgs args)
    { 
        DependencyObject oldMentor = MentorField.GetValue(this);
        DependencyObject newMentor = Helper.FindMentor(InheritanceContext); 

        if (oldMentor != newMentor)
        { 
            MentorField.SetValue(this, newMentor);

            if (oldMentor != null)
            { 
                DisconnectMentor(oldMentor);
            } 
            if (newMentor != null) 
            {
                ConnectMentor(newMentor); 
            }
        }
    }

    // connect to a new mentor
    void ConnectMentor(DependencyObject mentor) 
    { 
        FrameworkObject foMentor = new FrameworkObject(mentor);

        // register for InheritedPropertyChanged events
        foMentor.InheritedPropertyChanged += new InheritedPropertyChangedEventHandler(OnMentorInheritedPropertyChanged);

        // register for ResourcesChanged events 
        foMentor.ResourcesChanged += new EventHandler(OnMentorResourcesChanged);

        // invalidate the mentee's tree 
        TreeWalkHelper.InvalidateOnTreeChange(

                null, this,
                foMentor.DO,
                true /* isAddOperation */
                ); 

        // register for Loaded/Unloaded events. 
        // Do this last so the tree is ready when Loaded is raised. 
        if (this.SubtreeHasLoadedChangeHandler)
        { 
            boolean isLoaded = foMentor.IsLoaded;

            ConnectLoadedEvents(/*ref*/ foMentor, isLoaded);

            if (isLoaded)
            { 
                this.FireLoadedOnDescendentsInternal(); 
            }
        } 
    }

    // disconnect from an old mentor
    void DisconnectMentor(DependencyObject mentor) 
    {
        FrameworkObject foMentor = new FrameworkObject(mentor); 

        // unregister for InheritedPropertyChanged events
        foMentor.InheritedPropertyChanged -= new InheritedPropertyChangedEventHandler(OnMentorInheritedPropertyChanged); 

        // unregister for ResourcesChanged events
        foMentor.ResourcesChanged -= new EventHandler(OnMentorResourcesChanged);

        // invalidate the mentee's tree
        TreeWalkHelper.InvalidateOnTreeChange( 

                null, this,
                foMentor.DO, 
                false /* isAddOperation */
                );

        // unregister for Loaded/Unloaded events 
        if (this.SubtreeHasLoadedChangeHandler)
        { 
            boolean isLoaded = foMentor.IsLoaded; 

            DisconnectLoadedEvents(/*ref*/ foMentor, isLoaded); 

            if (foMentor.IsLoaded)
            {
                this.FireUnloadedOnDescendentsInternal(); 
            }
        } 
    } 

    // called by BroadcastEventHelper when the SubtreeHasLoadedChangedHandler 
    // flag changes on a mentored FE/FCE
    /*internal*/ public void ChangeSubtreeHasLoadedChangedHandler(DependencyObject mentor)
    {
        FrameworkObject foMentor = new FrameworkObject(mentor); 
        boolean isLoaded = foMentor.IsLoaded;

        if (this.SubtreeHasLoadedChangeHandler) 
        {
            ConnectLoadedEvents(/*ref*/ foMentor, isLoaded); 
        }
        else
        {
            DisconnectLoadedEvents(/*ref*/ foMentor, isLoaded); 
        }
    } 

    // handle the Loaded event from the mentor
    void OnMentorLoaded(Object sender, RoutedEventArgs e) 
    {
        FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender);

        // stop listening for Loaded, start listening for Unloaded 
        foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded);
        foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 

        // broadcast the Loaded event to my framework subtree
        //FireLoadedOnDescendentsInternal(); 
        BroadcastEventHelper.BroadcastLoadedSynchronously(this, IsLoaded);
    }

    // handle the Unloaded event from the mentor 
    void OnMentorUnloaded(Object sender, RoutedEventArgs e)
    { 
        FrameworkObject foMentor = new FrameworkObject((DependencyObject)sender); 

        // stop listening for Unloaded, start listening for Loaded 
        foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded);
        foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded);

        // broadcast the Unloaded event to my framework subtree 
        //FireUnloadedOnDescendentsInternal();
        BroadcastEventHelper.BroadcastUnloadedSynchronously(this, IsLoaded); 
    } 

    void ConnectLoadedEvents(/*ref*/ FrameworkObject foMentor, boolean isLoaded) 
    {
        if (foMentor.IsValid)
        {
            if (isLoaded) 
            {
                foMentor.Unloaded += new RoutedEventHandler(OnMentorUnloaded); 
            } 
            else
            { 
                foMentor.Loaded += new RoutedEventHandler(OnMentorLoaded);
            }
        }
    } 

    void DisconnectLoadedEvents(/*ref*/ FrameworkObject foMentor, boolean isLoaded) 
    { 
        if (foMentor.IsValid)
        { 
            if (isLoaded)
            {
                foMentor.Unloaded -= new RoutedEventHandler(OnMentorUnloaded);
            } 
            else
            { 
                foMentor.Loaded -= new RoutedEventHandler(OnMentorLoaded); 
            }
        } 
    }

    // handle the InheritedPropertyChanged event from the mentor
    void OnMentorInheritedPropertyChanged(Object sender, InheritedPropertyChangedEventArgs e) 
    {
        TreeWalkHelper.InvalidateOnInheritablePropertyChange( 

                null, this,
                e.Info, false /*skipStartNode*/); 
    }

    // handle the ResourcesChanged event from the mentor
    void OnMentorResourcesChanged(Object sender, EventArgs e) 
    {
        TreeWalkHelper.InvalidateOnResourcesChange( 

                null, this,
                ResourcesChangeInfo.CatastrophicDictionaryChangeInfo); 
    }

    // Helper method to retrieve and fire the InheritedPropertyChanged event
    /*internal*/ public void RaiseInheritedPropertyChangedEvent(/*ref*/ InheritablePropertyChangeInfo info) 
    {
        EventHandlersStore store = EventHandlersStore; 
        if (store != null) 
        {
            Delegate handler = store.Get(FrameworkElement.InheritedPropertyChangedKey); 
            if (handler != null)
            {
                InheritedPropertyChangedEventArgs args = new InheritedPropertyChangedEventArgs(/*ref*/ info);
                ((InheritedPropertyChangedEventHandler)handler)(this, args); 
            }
        } 
    } 

//    #endregion Internal Methods 

    //-----------------------------------------------------
    //
    //  Internal Properties 
    //
    //----------------------------------------------------- 

//    #region Internal Properties

    // Indicates if the Style is being re-evaluated
    /*internal*/ public boolean IsStyleUpdateInProgress
    {
        get { return ReadInternalFlag(InternalFlags.IsStyleUpdateInProgress); } 
        set { WriteInternalFlag(InternalFlags.IsStyleUpdateInProgress, value); }
    } 

    // Indicates if the ThemeStyle is being re-evaluated
    /*internal*/ public boolean IsThemeStyleUpdateInProgress 
    {
        get { return ReadInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress); }
        set { WriteInternalFlag(InternalFlags.IsThemeStyleUpdateInProgress, value); }
    } 

    // Indicates that we are storing "container template" provided values 
    // on this element -- see StyleHelper.ParentTemplateValuesField 
    /*internal*/ public boolean StoresParentTemplateValues
    { 
        get { return ReadInternalFlag(InternalFlags.StoresParentTemplateValues); }
        set { WriteInternalFlag(InternalFlags.StoresParentTemplateValues, value); }
    }

    // Indicates if this instance has had NumberSubstitutionChanged on it
    /*internal*/ public boolean HasNumberSubstitutionChanged 
    { 
        get { return ReadInternalFlag(InternalFlags.HasNumberSubstitutionChanged); }
        set { WriteInternalFlag(InternalFlags.HasNumberSubstitutionChanged, value); } 
    }

    // Indicates if this instance has a tree that
    // was generated via a Template 
    /*internal*/ public boolean HasTemplateGeneratedSubTree
    { 
        get { return ReadInternalFlag(InternalFlags.HasTemplateGeneratedSubTree); } 
        set { WriteInternalFlag(InternalFlags.HasTemplateGeneratedSubTree, value); }
    } 

    // Indicates if this instance has an implicit style
    /*internal*/ public boolean HasImplicitStyleFromResources
    { 
        get { return ReadInternalFlag(InternalFlags.HasImplicitStyleFromResources); }
        set { WriteInternalFlag(InternalFlags.HasImplicitStyleFromResources, value); } 
    } 

    // Indicates if there are any implicit styles in the ancestry 
    /*internal*/ public boolean ShouldLookupImplicitStyles
    {
        get { return ReadInternalFlag(InternalFlags.ShouldLookupImplicitStyles); }
        set { WriteInternalFlag(InternalFlags.ShouldLookupImplicitStyles, value); } 
    }

    // Indicates if this instance has a style set by a generator 
    /*internal*/ public boolean IsStyleSetFromGenerator
    { 
        get { return ReadInternalFlag2(InternalFlags2.IsStyleSetFromGenerator); }
        set { WriteInternalFlag2(InternalFlags2.IsStyleSetFromGenerator, value); }
    }

    // Indicates if the StyleProperty has changed following a UpdateStyleProperty
    // call in OnAncestorChangedInternal 
    /*internal*/ public boolean HasStyleChanged 
    {
        get { return ReadInternalFlag2(InternalFlags2.HasStyleChanged); } 
        set { WriteInternalFlag2(InternalFlags2.HasStyleChanged, value); }
    }



    // Indicates if the StyleProperty has been invalidated during a tree walk 
    /*internal*/ public boolean HasStyleInvalidated 
    {
        get { return ReadInternalFlag2(InternalFlags2.HasStyleInvalidated); } 
        set { WriteInternalFlag2(InternalFlags2.HasStyleInvalidated, value); }
    }

    // Indicates that the StyleProperty full fetch has been 
    // performed atleast once on this node
    /*internal*/ public boolean HasStyleEverBeenFetched 
    { 
        get { return ReadInternalFlag(InternalFlags.HasStyleEverBeenFetched); }
        set { WriteInternalFlag(InternalFlags.HasStyleEverBeenFetched, value); } 
    }

    // Indicates that the StyleProperty has been set locally on this element
    /*internal*/ public boolean HasLocalStyle 
    {
        get { return ReadInternalFlag(InternalFlags.HasLocalStyle); } 
        set { WriteInternalFlag(InternalFlags.HasLocalStyle, value); } 
    }

    // Indicates that the ThemeStyleProperty full fetch has been
    // performed atleast once on this node
    /*internal*/ public boolean HasThemeStyleEverBeenFetched
    { 
        get { return ReadInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched); }
        set { WriteInternalFlag(InternalFlags.HasThemeStyleEverBeenFetched, value); } 
    } 

    // Indicates that an ancestor change tree walk is progressing 
    // through the given node
    /*internal*/ public boolean AncestorChangeInProgress
    {
        get { return ReadInternalFlag(InternalFlags.AncestorChangeInProgress); } 
        set { WriteInternalFlag(InternalFlags.AncestorChangeInProgress, value); }
    } 

    // Stores the inheritable properties that will need to invalidated on the children of this
    // node.This is a transient cache that is active only during an AncestorChange operation. 
    /*internal*/ public FrugalObjectList<DependencyProperty> InheritableProperties
    {
        get { return _inheritableProperties; }
        set { _inheritableProperties = value; } 
    }

    // Says if there is a loaded event pending 
    /*internal*/ public Object[] LoadedPending
    { 
        get { return (Object[]) GetValue(LoadedPendingProperty); }
    }

    // Says if there is an unloaded event pending 
    /*internal*/ public Object[] UnloadedPending
    { 
        get { return (Object[]) GetValue(UnloadedPendingProperty); } 
    }

    // Indicates if this instance has multiple inheritance contexts
    /*internal*/ public /*override*/ boolean HasMultipleInheritanceContexts
    {
        get { return ReadInternalFlag2(InternalFlags2.HasMultipleInheritanceContexts); } 
    }

    // Indicates if the current element has or had mentees at some point. 
    /*internal*/ public boolean PotentiallyHasMentees
    { 
        get { return ReadInternalFlag(InternalFlags.PotentiallyHasMentees); }
        set
        {
            Debug.Assert(value == true, 
                "This flag is set to true when a mentee attaches a listeners to either the " +
                "InheritedPropertyChanged event or the ResourcesChanged event. It never goes " + 
                "back to being false because this would involve counting the remaining listeners " + 
                "for either of the aforementioned events. This seems like an overkill for the perf " +
                "optimization we are trying to achieve here."); 

            WriteInternalFlag(InternalFlags.PotentiallyHasMentees, value);
        }
    } 



    /// <summary>
    ///     ResourceReferenceExpressions on non-[FE/FCE] add listeners to this 
    ///     event so they can get notified when there is a ResourcesChange
    /// </summary>
    /// <remarks>
    ///     make this pay-for-play by storing handlers 
    ///     in EventHandlersStore
    /// </remarks> 
    /*internal*/ public /*event*/ EventHandler ResourcesChanged 
    {
        add 
        {
            PotentiallyHasMentees = true;
            EventHandlersStoreAdd(FrameworkElement.ResourcesChangedKey, value);
        } 
        remove { EventHandlersStoreRemove(FrameworkElement.ResourcesChangedKey, value); }
    } 



    /// <summary>
    ///     Mentees add listeners to this
    ///     event so they can get notified when there is a InheritedPropertyChange
    /// </summary> 
    /// <remarks>
    ///     make this pay-for-play by storing handlers 
    ///     in EventHandlersStore 
    /// </remarks>
    /*internal*/ public /*event*/ InheritedPropertyChangedEventHandler InheritedPropertyChanged 
    {
        add
        {
            PotentiallyHasMentees = true; 
            EventHandlersStoreAdd(FrameworkElement.InheritedPropertyChangedKey, value);
        } 
        remove { EventHandlersStoreRemove(FrameworkElement.InheritedPropertyChangedKey, value); } 
    }


//    #endregion Internal Properties

    //----------------------------------------------------- 
    //
    //  Internal Fields 
    // 
    //------------------------------------------------------

//    #region Internal Fields

    // Optimization, to avoid calling FromSystemType too often
    /*internal*/ public /*new*/ static DependencyObjectType DType = DependencyObjectType.FromSystemTypeInternal(typeof(FrameworkContentElement)); 

//    #endregion Internal Fields 

    //-----------------------------------------------------
    // 
    //  Private Fields
    //
    //------------------------------------------------------

//    #region Private Fields

    // The parent element in logical tree. 
    private /*new*/ DependencyObject _parent;
    private FrugalObjectList<DependencyProperty> _inheritableProperties; 

    private static final UncommonField<DependencyObject> InheritanceContextField = new UncommonField<DependencyObject>();
    private static final UncommonField<DependencyObject> MentorField = new UncommonField<DependencyObject>();
}