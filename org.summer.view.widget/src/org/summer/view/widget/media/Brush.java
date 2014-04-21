package org.summer.view.widget.media;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.Type;
import org.summer.view.widget.markup.TypeConverterHelper;
import org.summer.view.widget.media.animation.Animatable;
import org.summer.view.widget.model.ITypeDescriptorContext;

/// <summary>
/// Brush - 
/// A brush is an object that represents a method to fill a plane.
/// In addition to being able to fill a plane in an absolute way,
/// Brushes are also able to adapt how they fill the plane to the
/// size of the object that they are used to fill. 
/// </summary>
//[Localizability(LocalizationCategory.None, Readability=Readability.Unreadable)] 
public abstract /*partial*/ class Brush extends Animatable implements IFormattable 
{
//    #region Constructors 

    /// <summary>
    /// Protected constructor for Brush.
    /// Sets all values to their defaults. 
    /// To set property values, use the constructor which accepts paramters
    /// </summary> 
    protected Brush() 
    {
    } 

//    #endregion Constructors

//    #region ToString 

    /// <summary> 
    /// Parse - this method is called by the type converter to parse a Brush's String 
    /// (provided in "value") with the given IFormatProvider.
    /// </summary> 
    /// <returns>
    /// A Brush which was created by parsing the "value".
    /// </returns>
    /// <param name="value"> String representation of a Brush.  Cannot be null/empty. </param> 
    /// <param name="context"> The ITypeDescriptorContext for this call. </param>
    /*internal*/public static Brush Parse(String value, ITypeDescriptorContext context) 
    { 
        Brush brush;
        IFreezeFreezables freezer = null; 
        if (context != null)
        {
            freezer = (IFreezeFreezables)context.GetService(typeof(IFreezeFreezables));
            if ((freezer != null) && freezer.FreezeFreezables) 
            {
                brush = (Brush)freezer.TryGetFreezable(value); 
                if (brush != null) 
                {
                    return brush; 
                }
            }
        }

        brush = Parsers.ParseBrush(value, /*System.Windows.Markup.*/TypeConverterHelper.InvariantEnglishUS, context);

        if ((brush != null) && (freezer != null) && (freezer.FreezeFreezables)) 
        {
            freezer.TryFreeze(value, brush); 
        }

        return brush;
    } 

    /// <summary> 
    /// Can serialze "this" to a String 
    /// </summary>
    /*internal*/ public /*virtual*/ boolean CanSerializeToString() 
    {
        return false;
    }

//    #endregion
    
  //-----------------------------------------------------
    // 
    //  Public Methods
    //
    //-----------------------------------------------------

//    #region Public Methods

    /// <summary> 
    ///     Shadows inherited Clone() with a strongly typed
    ///     version for convenience. 
    /// </summary>
    public /*new*/ Brush Clone()
    {
        return (Brush)super.Clone(); 
    }

    /// <summary> 
    ///     Shadows inherited CloneCurrentValue() with a strongly typed
    ///     version for convenience. 
    /// </summary>
    public /*new*/ Brush CloneCurrentValue()
    {
        return (Brush)super.CloneCurrentValue(); 
    }


//    #endregion Public Methods

    //------------------------------------------------------
    // 
    //  Public Properties
    // 
    //----------------------------------------------------- 

    private static void OpacityPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
        Brush target = ((Brush) d);


        target.PropertyChanged(OpacityProperty);
    } 
    private static void TransformPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e) 
    {
    	// The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children) 
        // will promote the property value from a default value to a local value. This is technically a sub-property
        // change because the collection was changed and not a new collection set (GeometryGroup.Children. 
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled 
        // the default value to the compositor. If the property changes from a default value, the new local value
        // needs to be marshalled to the compositor. We detect this scenario with the second condition 
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange &&
           (e.OldValueSource == e.NewValueSource)) 
        {
            return; 
        } 


        Brush target = ((Brush) d);


        Transform oldV = (Transform) e.OldValue; 
        Transform newV = (Transform) e.NewValue;
        System.Windows.Threading.Dispatcher dispatcher = target.Dispatcher; 

        if (dispatcher != null)
        { 
            DUCE.IResource targetResource = (DUCE.IResource)target;
            using (CompositionEngineLock.Acquire())
            {
                int channelCount = targetResource.GetChannelCount(); 

                for (int channelIndex = 0; channelIndex < channelCount; channelIndex++) 
                { 
                    DUCE.Channel channel = targetResource.GetChannel(channelIndex);
                    Debug.Assert(!channel.IsOutOfBandChannel); 
                    Debug.Assert(!targetResource.GetHandle(channel).IsNull);
                    target.ReleaseResource(oldV,channel);
                    target.AddRefResource(newV,channel);
                } 
            }
        } 

        target.PropertyChanged(TransformProperty);
    } 
    private static void RelativeTransformPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
    	// The first change to the default value of a mutable collection property (e.g. GeometryGroup.Children) 
        // will promote the property value from a default value to a local value. This is technically a sub-property
        // change because the collection was changed and not a new collection set (GeometryGroup.Children. 
        // Add versus GeometryGroup.Children = myNewChildrenCollection). However, we never marshalled
        // the default value to the compositor. If the property changes from a default value, the new local value
        // needs to be marshalled to the compositor. We detect this scenario with the second condition
        // e.OldValueSource != e.NewValueSource. Specifically in this scenario the OldValueSource will be 
        // Default and the NewValueSource will be Local.
        if (e.IsASubPropertyChange && 
           (e.OldValueSource == e.NewValueSource)) 
        {
            return; 
        }


        Brush target = ((Brush) d); 


        Transform oldV = (Transform) e.OldValue; 
        Transform newV = (Transform) e.NewValue;
        System.Windows.Threading.Dispatcher dispatcher = target.Dispatcher; 

        if (dispatcher != null)
        {
            DUCE.IResource targetResource = (DUCE.IResource)target; 
            using (CompositionEngineLock.Acquire())
            { 
                int channelCount = targetResource.GetChannelCount(); 

                for (int channelIndex = 0; channelIndex < channelCount; channelIndex++) 
                {
                    DUCE.Channel channel = targetResource.GetChannel(channelIndex);
                    Debug.Assert(!channel.IsOutOfBandChannel);
                    Debug.Assert(!targetResource.GetHandle(channel).IsNull); 
                    target.ReleaseResource(oldV,channel);
                    target.AddRefResource(newV,channel); 
                } 
            }
        } 

        target.PropertyChanged(RelativeTransformProperty);
    }


//    #region Public Properties 

    /// <summary>
    ///     Opacity - double.  Default value is 1.0. 
    /// </summary>
    public double Opacity
    {
        get 
        {
            return (double) GetValue(OpacityProperty); 
        } 
        set
        { 
            SetValueInternal(OpacityProperty, value);
        }
    }

    /// <summary>
    ///     Transform - Transform.  Default value is Transform.Identity. 
    /// </summary> 
    public Transform Transform
    { 
        get
        {
            return (Transform) GetValue(TransformProperty);
        } 
        set
        { 
            SetValueInternal(TransformProperty, value); 
        }
    } 

    /// <summary>
    ///     RelativeTransform - Transform.  Default value is Transform.Identity.
    /// </summary> 
    public Transform RelativeTransform
    { 
        get 
        {
            return (Transform) GetValue(RelativeTransformProperty); 
        }
        set
        {
            SetValueInternal(RelativeTransformProperty, value); 
        }
    } 

//    #endregion Public Properties

    //------------------------------------------------------
    //
    //  Protected Methods
    // 
    //------------------------------------------------------

//    #region Protected Methods 





//    #endregion ProtectedMethods 

    //----------------------------------------------------- 
    // 
    //  Internal Methods
    // 
    //------------------------------------------------------

//    #region Internal Methods


    /*internal*/public abstract DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel); 

    /// <summary>
    /// AddRefOnChannel 
    /// </summary>
    DUCE.ResourceHandle DUCE.IResource.AddRefOnChannel(DUCE.Channel channel)
    {
        // Reconsider the need for this lock when removing the MultiChannelResource. 
        using (CompositionEngineLock.Acquire())
        { 
            return AddRefOnChannelCore(channel); 
        }
    } 
    /*internal*/public abstract void ReleaseOnChannelCore(DUCE.Channel channel);

    /// <summary>
    /// ReleaseOnChannel 
    /// </summary>
    void DUCE.IResource.ReleaseOnChannel(DUCE.Channel channel) 
    { 
        // Reconsider the need for this lock when removing the MultiChannelResource.
        using (CompositionEngineLock.Acquire()) 
        {
            ReleaseOnChannelCore(channel);
        }
    } 
    /*internal*/public abstract DUCE.ResourceHandle GetHandleCore(DUCE.Channel channel);

    /// <summary> 
    /// GetHandle
    /// </summary> 
    DUCE.ResourceHandle DUCE.IResource.GetHandle(DUCE.Channel channel)
    {
        DUCE.ResourceHandle handle;

        using (CompositionEngineLock.Acquire())
        { 
            handle = GetHandleCore(channel); 
        }

        return handle;
    }
    /*internal*/public abstract int GetChannelCountCore();

    /// <summary>
    /// GetChannelCount 
    /// </summary> 
    int DUCE.IResource.GetChannelCount()
    { 
        // must already be in composition lock here
        return GetChannelCountCore();
    }
    /*internal*/public abstract DUCE.Channel GetChannelCore(int index); 

    /// <summary> 
    /// GetChannel 
    /// </summary>
    DUCE.Channel DUCE.IResource.GetChannel(int index) 
    {
        // must already be in composition lock here
        return GetChannelCore(index);
    } 


//    #endregion Internal Methods 

    //----------------------------------------------------- 
    //
    //  Internal Properties
    //
    //----------------------------------------------------- 

//    #region Internal Properties 


    /// <summary> 
    /// Creates a String representation of this object based on the current culture.
    /// </summary>
    /// <returns>
    /// A String representation of this object. 
    /// </returns>
    public /*override*/ String ToString() 
    { 
        ReadPreamble();
        // Delegate to the internal method which implements all ToString calls. 
        return ConvertToString(null /* format String */, null /* format provider */);
    }

    /// <summary> 
    /// Creates a String representation of this object based on the IFormatProvider
    /// passed in.  If the provider is null, the CurrentCulture is used. 
    /// </summary> 
    /// <returns>
    /// A String representation of this object. 
    /// </returns>
    public String ToString(IFormatProvider provider)
    {
        ReadPreamble(); 
        // Delegate to the internal method which implements all ToString calls.
        return ConvertToString(null /* format String */, provider); 
    } 

    /// <summary> 
    /// Creates a String representation of this object based on the format String
    /// and IFormatProvider passed in.
    /// If the provider is null, the CurrentCulture is used.
    /// See the documentation for IFormattable for more information. 
    /// </summary>
    /// <returns> 
    /// A String representation of this object. 
    /// </returns>
    String IFormattable.ToString(String format, IFormatProvider provider) 
    {
        ReadPreamble();
        // Delegate to the internal method which implements all ToString calls.
        return ConvertToString(format, provider); 
    }

    /// <summary> 
    /// Creates a String representation of this object based on the format String
    /// and IFormatProvider passed in. 
    /// If the provider is null, the CurrentCulture is used.
    /// See the documentation for IFormattable for more information.
    /// </summary>
    /// <returns> 
    /// A String representation of this object.
    /// </returns> 
    /*internal*/public /*virtual*/ String ConvertToString(String format, IFormatProvider provider) 
    {
        return super.ToString(); 
    }


//    #endregion Internal Properties 

    //----------------------------------------------------- 
    // 
    //  Dependency Properties
    // 
    //------------------------------------------------------

//    #region Dependency Properties

    /// <summary>
    ///     The DependencyProperty for the Brush.Opacity property. 
    /// </summary> 
    public static final DependencyProperty OpacityProperty;
    /// <summary> 
    ///     The DependencyProperty for the Brush.Transform property.
    /// </summary>
    public static final DependencyProperty TransformProperty;
    /// <summary> 
    ///     The DependencyProperty for the Brush.RelativeTransform property.
    /// </summary> 
    public static final DependencyProperty RelativeTransformProperty; 

//    #endregion Dependency Properties 

    //-----------------------------------------------------
    //
    //  Internal Fields 
    //
    //------------------------------------------------------ 

//    #region Internal Fields

    /*internal*/public /*const*/static final double c_Opacity = 1.0;
    /*internal*/public static Transform s_Transform = Transform.Identity; 
    /*internal*/public static Transform s_RelativeTransform = Transform.Identity; 

//    #endregion Internal Fields 



//    #region Constructors 

    //------------------------------------------------------ 
    // 
    //  Constructors
    // 
    //-----------------------------------------------------

    static //Brush()
    { 
        // We check our static default fields which are of type Freezable
        // to make sure that they are not mutable, otherwise we will throw 
        // if these get touched by more than one thread in the lifetime 
        // of your app.  (Windows OS Bug #947272)
        // 
        Debug.Assert(s_Transform == null || s_Transform.IsFrozen,
            "Detected context bound default value Brush.s_Transform (See OS Bug #947272).");


        Debug.Assert(s_RelativeTransform == null || s_RelativeTransform.IsFrozen,
            "Detected context bound default value Brush.s_RelativeTransform (See OS Bug #947272)."); 


        // Initializations 
        Type typeofThis = typeof(Brush);
        OpacityProperty =
              RegisterProperty("Opacity",
                               typeof(Double), 
                               typeofThis,
                               1.0, 
                               new PropertyChangedCallback(OpacityPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ true, 
                               /* coerceValueCallback */ null);
        TransformProperty =
              RegisterProperty("Transform",
                               typeof(Transform), 
                               typeofThis,
                               Transform.Identity, 
                               new PropertyChangedCallback(TransformPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
        RelativeTransformProperty =
              RegisterProperty("RelativeTransform",
                               typeof(Transform), 
                               typeofThis,
                               Transform.Identity, 
                               new PropertyChangedCallback(RelativeTransformPropertyChanged), 
                               null,
                               /* isIndependentlyAnimated  = */ false, 
                               /* coerceValueCallback */ null);
    }



//    #endregion Constructors 

}
