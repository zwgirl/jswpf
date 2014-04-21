package org.summer.view.widget.media;

import javax.xml.crypto.dsig.Transform;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.DependencyObject;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.DependencyPropertyChangedEventArgs;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.PropertyChangedCallback;
import org.summer.view.widget.Type;
import org.summer.view.widget.media.composion.DUCE;
import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.window.DoubleUtil;

/// <summary>
    /// SolidColorBrush 
    /// The SolidColorBrush is the simplest of the Brushes.  It can be used to
    /// fill an area with a solid color, which can be animate.
    /// </summary>
    public /*sealed*/ /*partial*/ class SolidColorBrush extends Brush 
    {
//        #region Constructors 
 
        /// <summary>
        /// Default constructor for SolidColorBrush. 
        /// </summary>
        public SolidColorBrush()
        {
        } 

        /// <summary> 
        /// SolidColorBrush - The constructor accepts the color of the brush 
        /// </summary>
        /// <param name="color"> The color value. </param> 
        public SolidColorBrush(Color color)
        {
            Color = color;
        } 

//        #endregion Constructors 
 
//        #region Serialization
 
        // This enum is used to identify brush types for deserialization in the
        // ConvertCustomBinaryToObject method.  If we support more types of brushes,
        // then we may have to expose this publically and add more enum values.
        /*internal*/ enum SerializationBrushType //: byte 
        {
            Unknown ,//= 0, 
            KnownSolidColor ,//= 1, 
            OtherColor ,//= 2,
        } 

        ///<summary>
        /// Serialize this Object using the passed writer in compact BAML binary format.
        ///</summary> 
        /// <remarks>
        /// This is called ONLY from the Parser and is not a general public method. 
        /// </remarks> 
        /// <exception cref="System.ArgumentNullException">
        /// Thrown if "writer" is null. 
        /// </exception>
//        [FriendAccessAllowed] // Built into Core, also used by Framework.
        /*internal*/ public static boolean SerializeOn(BinaryWriter writer, String stringValue)
        { 
            // ********* VERY IMPORTANT NOTE *****************
            // If this method is changed, then XamlBrushSerilaizer.SerializeOn() needs 
            // to be correspondingly changed as well. That code is linked into PBT.dll 
            // and duplicates the code below to avoid pulling in SCB & base classes as well.
            // ********* VERY IMPORTANT NOTE ***************** 

            if (writer == null)
            {
                throw new ArgumentNullException("writer"); 
            }
 
            KnownColor knownColor = KnownColors.ColorStringToKnownColor(stringValue); 
            if (knownColor != KnownColor.UnknownColor)
            { 
                // Serialize values of the type "Red", "Blue" and other names
                writer.Write((byte)SerializationBrushType.KnownSolidColor);
                writer.Write((uint)knownColor);
                return true; 
            }
            else 
            { 
                // Serialize values of the type "#F00", "#0000FF" and other hex color values.
                // We don't have a good way to check if this is valid without running the 
                // converter at this point, so just store the String if it has at least a
                // minimum length of 4.
                stringValue = stringValue.Trim();
                if (stringValue.Length > 3) 
                {
                    writer.Write((byte)SerializationBrushType.OtherColor); 
                    writer.Write(stringValue); 
                    return true;
                } 
            }
            return false;
        }
 
        ///<summary>
        /// Deserialize this Object using the passed reader.  Throw an exception if 
        /// the format is not a solid color brush. 
        ///</summary>
        /// <remarks> 
        /// This is called ONLY from the Parser and is not a general public method.
        /// </remarks>
        /// <exception cref="System.ArgumentNullException">
        /// Thrown if "reader" is null. 
        /// </exception>
        public static Object DeserializeFrom(BinaryReader reader) 
        { 
            if (reader == null)
            { 
                throw new ArgumentNullException("reader");
            }

            return DeserializeFrom(reader, null); 
        }
 
        /*internal*/ public static Object DeserializeFrom(BinaryReader reader, ITypeDescriptorContext context) 
        {
            SerializationBrushType brushType = (SerializationBrushType)reader.ReadByte(); 

            if (brushType == SerializationBrushType.KnownSolidColor)
            {
                uint knownColorUint = reader.ReadUInt32(); 
                return KnownColors.SolidColorBrushFromUint(knownColorUint);
            } 
            else if (brushType == SerializationBrushType.OtherColor) 
            {
                String colorValue = reader.ReadString(); 
                BrushConverter converter = new BrushConverter();
                return converter.ConvertFromInvariantString(context, colorValue);
            }
            else 
            {
                throw new Exception(/*SR.Get(SRID.BrushUnknownBamlType)*/); 
            } 
        }
 
//        #endregion Serialization

//        #region ToString
 
        /// <summary>
        /// CanSerializeToString - an internal helper method which determines whether this Object 
        /// can fully serialize to a String with no data loss. 
        /// </summary>
        /// <returns> 
        /// boolean - true if full fidelity serialization is possible, false if not.
        /// </returns>
        /*internal*/ public /*override*/ boolean CanSerializeToString()
        { 
            if (HasAnimatedProperties
                || HasAnyExpression() 
                || !Transform.IsIdentity 
                || !DoubleUtil.AreClose(Opacity, Brush.c_Opacity))
            { 
                return false;
            }

            return true; 
        }
 
        /// <summary> 
        /// Creates a String representation of this Object based on the format String
        /// and IFormatProvider passed in. 
        /// If the provider is null, the CurrentCulture is used.
        /// See the documentation for IFormattable for more information.
        /// </summary>
        /// <returns> 
        /// A String representation of this Object.
        /// </returns> 
        /*internal*/ public /*override*/ String ConvertToString(String format, IFormatProvider provider) 
        {
            return Color.ConvertToString(format, provider); 
        }

//        #endregion
        
      //----------------------------------------------------- 
        //
        //  Public Methods 
        //
        //-----------------------------------------------------

//        #region Public Methods 

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public /*new*/ SolidColorBrush Clone()
        {
            return (SolidColorBrush)super.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public /*new*/ SolidColorBrush CloneCurrentValue()
        {
            return (SolidColorBrush)super.CloneCurrentValue();
        } 

 
 

//        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 
        private static void ColorPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        { 
            SolidColorBrush target = ((SolidColorBrush) d);


            target.PropertyChanged(ColorProperty); 
        }
 
 
//        #region Public Properties
 
        /// <summary>
        ///     Color - Color.  Default value is Colors.Transparent.
        /// </summary>
        public Color Color 
        {
            get 
            { 
                return (Color) GetValue(ColorProperty);
            } 
            set
            {
                SetValueInternal(ColorProperty, value);
            } 
        }
 
//        #endregion Public Properties 

        //------------------------------------------------------ 
        //
        //  Protected Methods
        //
        //------------------------------------------------------ 

//        #region Protected Methods 
 
        /// <summary>
        /// Implementation of <see cref="System.Windows.Freezable.CreateInstanceCore">Freezable.CreateInstanceCore</see>. 
        /// </summary>
        /// <returns>The new Freezable.</returns>
        protected /*override*/ Freezable CreateInstanceCore()
        { 
            return new SolidColorBrush();
        } 
 

 
//        #endregion ProtectedMethods

        //-----------------------------------------------------
        // 
        //  Internal Methods
        // 
        //------------------------------------------------------ 

//        #region Internal Methods 

        /// <SecurityNote>
        ///     Critical: This code calls into an unsafe code block
        ///     TreatAsSafe: This code does not return any critical data.It is ok to expose 
        ///     Channels are safe to call into and do not go cross domain and cross process
        /// </SecurityNote> 
//        [SecurityCritical,SecurityTreatAsSafe] 
        /*internal*/ public /*override*/ void UpdateResource(DUCE.Channel channel, boolean skipOnChannelCheck)
        { 
            // If we're told we can skip the channel check, then we must be on channel
            Debug.Assert(!skipOnChannelCheck || _duceResource.IsOnChannel(channel));

            if (skipOnChannelCheck || _duceResource.IsOnChannel(channel)) 
            {
                base.UpdateResource(channel, skipOnChannelCheck); 
 
                // Read values of properties into local variables
                Transform vTransform = Transform; 
                Transform vRelativeTransform = RelativeTransform;

                // Obtain handles for properties that implement DUCE.IResource
                DUCE.ResourceHandle hTransform; 
                if (vTransform == null ||
                    Object.ReferenceEquals(vTransform, Transform.Identity) 
                    ) 
                {
                    hTransform = DUCE.ResourceHandle.Null; 
                }
                else
                {
                    hTransform = ((DUCE.IResource)vTransform).GetHandle(channel); 
                }
                DUCE.ResourceHandle hRelativeTransform; 
                if (vRelativeTransform == null || 
                    Object.ReferenceEquals(vRelativeTransform, Transform.Identity)
                    ) 
                {
                    hRelativeTransform = DUCE.ResourceHandle.Null;
                }
                else 
                {
                    hRelativeTransform = ((DUCE.IResource)vRelativeTransform).GetHandle(channel); 
                } 

                // Obtain handles for animated properties 
                DUCE.ResourceHandle hOpacityAnimations = GetAnimationResourceHandle(OpacityProperty, channel);
                DUCE.ResourceHandle hColorAnimations = GetAnimationResourceHandle(ColorProperty, channel);

                // Pack & send command packet 
                DUCE.MILCMD_SOLIDCOLORBRUSH data;
                unsafe 
                { 
                    data.Type = MILCMD.MilCmdSolidColorBrush;
                    data.Handle = _duceResource.GetHandle(channel); 
                    if (hOpacityAnimations.IsNull)
                    {
                        data.Opacity = Opacity;
                    } 
                    data.hOpacityAnimations = hOpacityAnimations;
                    data.hTransform = hTransform; 
                    data.hRelativeTransform = hRelativeTransform; 
                    if (hColorAnimations.IsNull)
                    { 
                        data.Color = CompositionResourceManager.ColorToMilColorF(Color);
                    }
                    data.hColorAnimations = hColorAnimations;
 
                    // Send packed command structure
                    channel.SendCommand( 
                        (byte*)&data, 
                        sizeof(DUCE.MILCMD_SOLIDCOLORBRUSH));
                } 
            }
        }
        /*internal*/ public /*override*/ DUCE.ResourceHandle AddRefOnChannelCore(DUCE.Channel channel)
        { 

                if (_duceResource.CreateOrAddRefOnChannel(this, channel, System.Windows.Media.Composition.DUCE.ResourceType.TYPE_SOLIDCOLORBRUSH)) 
                { 
                    Transform vTransform = Transform;
                    if (vTransform != null) ((DUCE.IResource)vTransform).AddRefOnChannel(channel); 
                    Transform vRelativeTransform = RelativeTransform;
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).AddRefOnChannel(channel);

                    AddRefOnChannelAnimations(channel); 

 
                    UpdateResource(channel, true /* skip "on channel" check - we already know that we're on channel */ ); 
                }
 
                return _duceResource.GetHandle(channel);

        }
        /*internal*/ public /*override*/ void ReleaseOnChannelCore(DUCE.Channel channel) 
        {
 
                Debug.Assert(_duceResource.IsOnChannel(channel)); 

                if (_duceResource.ReleaseOnChannel(channel)) 
                {
                    Transform vTransform = Transform;
                    if (vTransform != null) ((DUCE.IResource)vTransform).ReleaseOnChannel(channel);
                    Transform vRelativeTransform = RelativeTransform; 
                    if (vRelativeTransform != null) ((DUCE.IResource)vRelativeTransform).ReleaseOnChannel(channel);
 
                    ReleaseOnChannelAnimations(channel); 

                } 

        }
        /*internal*/ public /*override*/ DUCE.ResourceHandle GetHandleCore(DUCE.Channel channel)
        { 
            // Note that we are in a lock here already.
            return _duceResource.GetHandle(channel); 
        } 
        /*internal*/ public /*override*/ int GetChannelCountCore()
        { 
            // must already be in composition lock here
            return _duceResource.GetChannelCount();
        }
        /*internal*/ public /*override*/ DUCE.Channel GetChannelCore(int index) 
        {
            // Note that we are in a lock here already. 
            return _duceResource.GetChannel(index); 
        }
 

//        #endregion Internal Methods

        //----------------------------------------------------- 
        //
        //  Internal Properties 
        // 
        //-----------------------------------------------------
 
//        #region Internal Properties

        //
        //  This property finds the correct initial size for the _effectiveValues store on the 
        //  current DependencyObject as a performance optimization
        // 
        //  This includes: 
        //    Color
        // 
        /*internal*/ public /*override*/ int EffectiveValuesInitialSize
        {
            get
            { 
                return 1;
            } 
        } 

 

//        #endregion Internal Properties

        //----------------------------------------------------- 
        //
        //  Dependency Properties 
        // 
        //------------------------------------------------------
 
//        #region Dependency Properties

        /// <summary>
        ///     The DependencyProperty for the SolidColorBrush.Color property. 
        /// </summary>
        public static final DependencyProperty ColorProperty; 
 
//        #endregion Dependency Properties
 
        //-----------------------------------------------------
        //
        //  Internal Fields
        // 
        //------------------------------------------------------
 
//        #region Internal Fields 

 

        /*internal*/ public System.Windows.Media.Composition.DUCE.MultiChannelResource _duceResource = new System.Windows.Media.Composition.DUCE.MultiChannelResource();

        /*internal*/ public static Color s_Color = Colors.Transparent; 

//        #endregion Internal Fields 
 

 
//        #region Constructors

        //------------------------------------------------------
        // 
        //  Constructors
        // 
        //----------------------------------------------------- 

        static //SolidColorBrush() 
        {
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272)
            // 
 

            // Initializations 
            Type typeofThis = typeof(SolidColorBrush);
            ColorProperty =
                  RegisterProperty("Color",
                                   typeof(Color), 
                                   typeofThis,
                                   Colors.Transparent, 
                                   new PropertyChangedCallback(ColorPropertyChanged), 
                                   null,
                                   /* isIndependentlyAnimated  = */ true, 
                                   /* coerceValueCallback */ null);
        }

 

//        #endregion Constructors 
 
    }
    } 