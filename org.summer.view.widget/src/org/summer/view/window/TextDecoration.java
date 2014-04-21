package org.summer.view.window;

import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Freezable;
import org.summer.view.widget.Type;
import org.summer.view.widget.media.Pen;
import org.summer.view.widget.media.animation.Animatable;

/// <summary>
    /// A text decoration
    /// </summary> 
//    [Localizability(LocalizationCategory.None)]
    public /*sealed partial*/ class TextDecoration extends Animatable 
    { 
    	
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
        public /*new*/ TextDecoration Clone()
        {
            return (TextDecoration)super.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public /*new*/ TextDecoration CloneCurrentValue()
        {
            return (TextDecoration)super.CloneCurrentValue();
        } 

 
 

//        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 

 

//        #region Public Properties

        /// <summary> 
        ///     Pen - Pen.  Default value is null.
        ///     The pen used to draw the text decoration 
        /// </summary> 
        public Pen Pen
        { 
            get
            {
                return (Pen) GetValue(PenProperty);
            } 
            set
            { 
                SetValueInternal(PenProperty, value); 
            }
        } 

        /// <summary>
        ///     PenOffset - double.  Default value is 0.0.
        ///     The offset of the text decoration to the location specified. 
        /// </summary>
        public double PenOffset 
        { 
            get
            { 
                return (double) GetValue(PenOffsetProperty);
            }
            set
            { 
                SetValueInternal(PenOffsetProperty, value);
            } 
        } 

        /// <summary> 
        ///     PenOffsetUnit - TextDecorationUnit.  Default value is TextDecorationUnit.FontRecommended.
        ///     The unit type we use to interpret the offset value.
        /// </summary>
        public TextDecorationUnit PenOffsetUnit 
        {
            get 
            { 
                return (TextDecorationUnit) GetValue(PenOffsetUnitProperty);
            } 
            set
            {
                SetValueInternal(PenOffsetUnitProperty, value);
            } 
        }
 
        /// <summary> 
        ///     PenThicknessUnit - TextDecorationUnit.  Default value is TextDecorationUnit.FontRecommended.
        ///     The unit type we use to interpret the thickness value. 
        /// </summary>
        public TextDecorationUnit PenThicknessUnit
        {
            get 
            {
                return (TextDecorationUnit) GetValue(PenThicknessUnitProperty); 
            } 
            set
            { 
                SetValueInternal(PenThicknessUnitProperty, value);
            }
        }
 
        /// <summary>
        ///     Location - TextDecorationLocation.  Default value is TextDecorationLocation.Underline. 
        ///     The Location of the text decorations 
        /// </summary>
        public TextDecorationLocation Location 
        {
            get
            {
                return (TextDecorationLocation) GetValue(LocationProperty); 
            }
            set 
            { 
                SetValueInternal(LocationProperty, value);
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
            return new TextDecoration();
        }

 

//        #endregion ProtectedMethods 
 
        //-----------------------------------------------------
        // 
        //  Internal Methods
        //
        //------------------------------------------------------
 
//        #region Internal Methods
//        #endregion Internal Methods 
 
        //-----------------------------------------------------
        // 
        //  Internal Properties
        //
        //-----------------------------------------------------
 
//        #region Internal Properties
 
 

 

//        #endregion Internal Properties

        //----------------------------------------------------- 
        //
        //  Dependency Properties 
        // 
        //------------------------------------------------------
 
//        #region Dependency Properties

        /// <summary>
        ///     The DependencyProperty for the TextDecoration.Pen property. 
        /// </summary>
        public static final DependencyProperty PenProperty; 
        /// <summary> 
        ///     The DependencyProperty for the TextDecoration.PenOffset property.
        /// </summary> 
        public static final DependencyProperty PenOffsetProperty;
        /// <summary>
        ///     The DependencyProperty for the TextDecoration.PenOffsetUnit property.
        /// </summary> 
        public static final DependencyProperty PenOffsetUnitProperty;
        /// <summary> 
        ///     The DependencyProperty for the TextDecoration.PenThicknessUnit property. 
        /// </summary>
        public static final DependencyProperty PenThicknessUnitProperty; 
        /// <summary>
        ///     The DependencyProperty for the TextDecoration.Location property.
        /// </summary>
        public static final DependencyProperty LocationProperty; 

//        #endregion Dependency Properties 
 
        //-----------------------------------------------------
        // 
        //  Internal Fields
        //
        //------------------------------------------------------
 
//        #region Internal Fields
 
 

 

        /*internal*/ public /*const*/static final double c_PenOffset = 0.0;
        /*internal*/ public /*const*/static final TextDecorationUnit c_PenOffsetUnit = TextDecorationUnit.FontRecommended;
        /*internal*/ public /*const*/static final TextDecorationUnit c_PenThicknessUnit = TextDecorationUnit.FontRecommended; 
        /*internal*/ public /*const*/static final TextDecorationLocation c_Location = TextDecorationLocation.Underline;
 
//        #endregion Internal Fields 

 

//        #region Constructors

        //------------------------------------------------------ 
        //
        //  Constructors 
        // 
        //-----------------------------------------------------
 
        static //TextDecoration()
        {
            // We check our static default fields which are of type Freezable
            // to make sure that they are not mutable, otherwise we will throw 
            // if these get touched by more than one thread in the lifetime
            // of your app.  (Windows OS Bug #947272) 
            // 

 
            // Initializations
            Type typeofThis = typeof(TextDecoration);
            PenProperty =
                  RegisterProperty("Pen", 
                                   typeof(Pen),
                                   typeofThis, 
                                   null, 
                                   null,
                                   null, 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
            PenOffsetProperty =
                  RegisterProperty("PenOffset", 
                                   typeof(Double),
                                   typeofThis, 
                                   0.0, 
                                   null,
                                   null, 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
            PenOffsetUnitProperty =
                  RegisterProperty("PenOffsetUnit", 
                                   typeof(TextDecorationUnit),
                                   typeofThis, 
                                   TextDecorationUnit.FontRecommended, 
                                   null,
                                   new ValidateValueCallback(System.Windows.ValidateEnums.IsTextDecorationUnitValid), 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
            PenThicknessUnitProperty =
                  RegisterProperty("PenThicknessUnit", 
                                   typeof(TextDecorationUnit),
                                   typeofThis, 
                                   TextDecorationUnit.FontRecommended, 
                                   null,
                                   new ValidateValueCallback(System.Windows.ValidateEnums.IsTextDecorationUnitValid), 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
            LocationProperty =
                  RegisterProperty("Location", 
                                   typeof(TextDecorationLocation),
                                   typeofThis, 
                                   TextDecorationLocation.Underline, 
                                   null,
                                   new ValidateValueCallback(System.Windows.ValidateEnums.IsTextDecorationLocationValid), 
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
        }
 

 
//        #endregion Constructors 
        /// <summary>
        /// Constructor 
        /// </summary>
        public TextDecoration()
        {
        } 

        /// <summary> 
        /// Constructor 
        /// </summary>
        /// <param name="location">The location of the text decoration</param> 
        /// <param name="pen">The pen used to draw this text decoration</param>
        /// <param name="penOffset">The offset of this text decoration to the location</param>
        /// <param name="penOffsetUnit">The unit of the offset</param>
        /// <param name="penThicknessUnit">The unit of the thickness of the pen</param> 
        public TextDecoration(
            TextDecorationLocation location, 
            Pen                    pen, 
            double                 penOffset,
            TextDecorationUnit     penOffsetUnit, 
            TextDecorationUnit     penThicknessUnit
            )
        {
            Location         = location; 
            Pen              = pen;
            PenOffset        = penOffset; 
            PenOffsetUnit    = penOffsetUnit; 
            PenThicknessUnit = penThicknessUnit;
        } 


        /// <summary>
        /// Compare the values of thhe properties in the two TextDecoration objects 
        /// </summary>
        /// <param name="textDecoration">The TextDecoration object to be compared against</param> 
        /// <returns>True if their property values are equal. False otherwise</returns> 
        /// <remarks>
        /// The method doesn't check "full" equality as it can not take into account of all the possible 
        /// values associated with the DependencyObject,such as Animation, DataBinding and Attached property.
        /// It only compares the public properties to serve the specific Framework's needs in inline property
        /// management and Editing serialization.
        /// </remarks> 
        /*internal*/ public boolean ValueEquals(TextDecoration textDecoration)
        { 
            if (textDecoration == null) 
                return false; // o is either null or not a TextDecoration object.
 
            if (this == textDecoration)
                return true; // reference equality.

            return ( 
               Location         == textDecoration.Location
            && PenOffset        == textDecoration.PenOffset 
            && PenOffsetUnit    == textDecoration.PenOffsetUnit 
            && PenThicknessUnit == textDecoration.PenThicknessUnit
            && (Pen == null ? textDecoration.Pen == null : Pen.Equals( textDecoration.Pen)) 
            );
        }
    }