package org.summer.view.widget.media;
	abstract /*partial*/ class PathSegment extends Animatable
    { 
	
		internal PathSegment() 
	    {
	    } 

	    internal abstract void AddToFigure(
	        Matrix matrix,          // The transformation matrid 
	        PathFigure figure,      // The figure to add to 
	        ref Point current);     // In: Segment start point, Out: Segment endpoint
	                                //     not transformed 
	    internal virtual bool IsEmpty() 
	    {
	        return false; 
	    } 

	    internal abstract bool IsCurved(); 

	    /// <summary>
	    /// Creates a string representation of this object based on the format string
	    /// and IFormatProvider passed in. 
	    /// If the provider is null, the CurrentCulture is used.
	    /// See the documentation for IFormattable for more information. 
	    /// </summary> 
	    /// <returns>
	    /// A string representation of this object. 
	    /// </returns>
	    internal abstract string ConvertToString(string format, IFormatProvider provider);

	    /// <summary> 
	    /// SerializeData - Serialize the contents of this Segment to the provided context.
	    /// </summary> 
	    internal abstract void SerializeData(StreamGeometryContext ctx);
	    internal const bool c_isStrokedDefault = true;

        /// <summary> 
        ///     Shadows inherited Clone() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new PathSegment Clone()
        {
            return (PathSegment)base.Clone();
        } 

        /// <summary> 
        ///     Shadows inherited CloneCurrentValue() with a strongly typed 
        ///     version for convenience.
        /// </summary> 
        public new PathSegment CloneCurrentValue()
        {
            return (PathSegment)base.CloneCurrentValue();
        } 

 
 

//        #endregion Public Methods 

        //------------------------------------------------------
        //
        //  Public Properties 
        //
        //----------------------------------------------------- 
 

 

//        #region Public Properties

        /// <summary> 
        ///     IsStroked - bool.  Default value is true.
        /// </summary> 
        public bool IsStroked 
        {
            get 
            {
                return (bool) GetValue(IsStrokedProperty);
            }
            set 
            {
                SetValueInternal(IsStrokedProperty, BooleanBoxes.Box(value)); 
            } 
        }
 
        /// <summary>
        ///     IsSmoothJoin - bool.  Default value is false.
        /// </summary>
        public bool IsSmoothJoin 
        {
            get 
            { 
                return (bool) GetValue(IsSmoothJoinProperty);
            } 
            set
            {
                SetValueInternal(IsSmoothJoinProperty, BooleanBoxes.Box(value));
            } 
        }
 

        /// <summary> 
        ///     The DependencyProperty for the PathSegment.IsStroked property.
        /// </summary>
        public static readonly DependencyProperty IsStrokedProperty;
        /// <summary> 
        ///     The DependencyProperty for the PathSegment.IsSmoothJoin property.
        /// </summary> 
        public static readonly DependencyProperty IsSmoothJoinProperty; 

 



 
        internal const bool c_IsStroked = true;
        internal const bool c_IsSmoothJoin = false; 
 
 
        //------------------------------------------------------
        // 
        //  Constructors 
        //
        //----------------------------------------------------- 

        static PathSegment()
        {
            // We check our static default fields which are of type Freezable 
            // to make sure that they are not mutable, otherwise we will throw
            // if these get touched by more than one thread in the lifetime 
            // of your app.  (Windows OS Bug #947272) 
            //
 

            // Initializations
            Type typeofThis = typeof(PathSegment);
            IsStrokedProperty = 
                  RegisterProperty("IsStroked",
                                   typeof(bool), 
                                   typeofThis, 
                                   true,
                                   null, 
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
            IsSmoothJoinProperty = 
                  RegisterProperty("IsSmoothJoin",
                                   typeof(bool), 
                                   typeofThis, 
                                   false,
                                   null, 
                                   null,
                                   /* isIndependentlyAnimated  = */ false,
                                   /* coerceValueCallback */ null);
        } 
 
    }