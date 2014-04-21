/**
 * RelativeSource
 */
/// <summary>
///
/// RelativeSource Modes are 
///     PreviousData   - use the DataContext from the previous scope
///     TemplatedParent- use the target element's styled parent 
///     Self           - use the target element itself 
///     FindAncestor   - use the hosting Type
/// Only FindAncestor mode allows AncestorType and AncestorLevel. 
/// </summary>
define(["dojo/_base/declare", "system/Type", "markup/MarkupExtension", "data/RelativeSourceMode"], 
		function(declare, Type, MarkupExtension, RelativeSourceMode){
	var RelativeSource = declare("RelativeSource", MarkupExtension,{
		constructor:function(/*RelativeSourceMode*/ mode, /*Type*/ ancestorType, /*int*/ ancestorLevel){
			if(arguments.length == 0){
				mode = RelativeSourceMode.FindAncestor; 
				this._ancestorType = null;
				this._ancestorLevel = -1;  // while -1, indicates _mode has not been set 
				this.InitializeMode(mode);
			}else if(arguments.length == 1){
				this._ancestorType = null;
				this._ancestorLevel = -1;  // while -1, indicates _mode has not been set 
				this.InitializeMode(mode);
			}else if(arguments.length == 3){
				this.InitializeMode(mode);
	            this.AncestorType = ancestorType;
	            this.AncestorLevel = ancestorLevel;
			}
		},
		
		/// <summary>Begin Initialization</summary> 
//        void ISupportInitialize.
		BeginInit:function()
        {
        },
 
        /// <summary>End Initialization, verify that internal state is consistent</summary>
//        void ISupportInitialize.
		EndInit:function() 
        { 
            if (this.IsUninitialized)
                throw new InvalidOperationException(SR.Get(SRID.RelativeSourceNeedsMode)); 
            if (this._mode == RelativeSourceMode.FindAncestor && (this.AncestorType == null))
                throw new InvalidOperationException(SR.Get(SRID.RelativeSourceNeedsAncestorType));
        },
        
      /// <summary>
        ///  Return an object that should be set on the targetObject's targetProperty 
        ///  for this markup extension.
        /// </summary> 
        /// <param name="serviceProvider">ServiceProvider that can be queried for services.</param> 
        /// <returns>
        ///  The object to set on this property. 
        /// </returns>
//        public override object 
        ProvideValue:function(/*IServiceProvider*/ serviceProvider)
        {
            if (this._mode == RelativeSourceMode.PreviousData) 
                return RelativeSource.PreviousData;
            if (this._mode == RelativeSourceMode.Self) 
                return RelativeSource.Self; 
            if (this._mode == RelativeSourceMode.TemplatedParent)
                return RelativeSource.TemplatedParent; 
            return this;
        },


//        void 
        InitializeMode:function(/*RelativeSourceMode*/ mode)
        { 
//            Debug.Assert(IsUninitialized); 

            if (mode == RelativeSourceMode.FindAncestor) 
            {
                // default level
            	this._ancestorLevel = 1;
            	this._mode = mode; 
            }
            else if (mode == RelativeSourceMode.PreviousData 
                || mode == RelativeSourceMode.Self 
                || mode == RelativeSourceMode.TemplatedParent)
            { 
            	this._ancestorLevel = 0;
            	this._mode = mode;
            }
            else 
            {
                throw new ArgumentException(SR.Get(SRID.RelativeSourceModeInvalid), "mode"); 
            } 
        }
	});
	
	Object.defineProperties(RelativeSource.prototype,{
		/// <summary>mode of RelativeSource 
        /// </summary> 
        /// <remarks> Mode is read-only after initialization.
        /// If Mode is not set explicitly, setting AncestorType or AncestorLevel will implicitly lock the Mode to FindAncestor. </remarks> 
        /// <exception cref="InvalidOperationException"> RelativeSource Mode is immutable after initialization;
        /// instead of changing the Mode on this instance, create a new RelativeSource or use a different static instance. </exception>
//        public RelativeSourceMode 
		Mode:
        {
            get:function() { return this._mode; },
            set:function(value)  
            {
                if (this.IsUninitialized) 
                {
                	this.InitializeMode(value);
                }
                else if (value != this._mode)    // mode changes are not allowed 
                {
                    throw new InvalidOperationException(SR.Get(SRID.RelativeSourceModeIsImmutable)); 
                } 
            }
        },

        /// <summary> The Type of ancestor to look for, in FindAncestor mode.
        /// </summary>
        /// <remarks> if Mode has not been set explicitly, setting AncestorType will implicitly lock Mode to FindAncestor. </remarks> 
        /// <exception cref="InvalidOperationException"> RelativeSource is not in FindAncestor mode </exception>
//        public Type 
        AncestorType:
        { 
            get:function() { return this._ancestorType; },
            set:function(value)  
            {
                if (this.IsUninitialized)
                {
//                    Debug.Assert(_mode == RelativeSourceMode.FindAncestor); 
                    this.AncestorLevel = 1;  // lock the mode and set default level
                } 
 
                if (this._mode != RelativeSourceMode.FindAncestor)
                { 
                    // in all other modes, AncestorType should not get set to a non-null value
                    if (value != null)
                        throw new InvalidOperationException(SR.Get(SRID.RelativeSourceNotInFindAncestorMode));
                } 
                else
                { 
                	this._ancestorType = value; 
                }
            } 
        },

        /// <summary> The level of ancestor to look for, in FindAncestor mode.  Use 1 to indicate the one nearest to the target element. 
        /// </summary>
        /// <remarks> if Mode has not been set explicitly, getting AncestorLevel will return -1 and 
        /// setting AncestorLevel will implicitly lock Mode to FindAncestor. </remarks> 
        /// <exception cref="InvalidOperationException"> RelativeSource is not in FindAncestor mode </exception>
        /// <exception cref="ArgumentOutOfRangeException"> AncestorLevel cannot be set to less than 1 </exception> 
//        public int 
        AncestorLevel:
        {
            get:function() { return this._ancestorLevel; },
            set:function(value) 
            {
//                Debug.Assert((!IsUninitialized) || (_mode == RelativeSourceMode.FindAncestor)); 
 
                if (this._mode != RelativeSourceMode.FindAncestor)
                { 
                    // in all other modes, AncestorLevel should not get set to a non-zero value
                    if (value != 0)
                        throw new InvalidOperationException(SR.Get(SRID.RelativeSourceNotInFindAncestorMode));
                } 
                else if (value < 1)
                { 
                    throw new ArgumentOutOfRangeException(SR.Get(SRID.RelativeSourceInvalidAncestorLevel)); 
                }
                else 
                {
                	this._ancestorLevel = value;
                }
            } 
        },
        
//        private bool 
        IsUninitialized: 
        {
            get:function() { return (this._ancestorLevel == -1); } 
        }
	});
	
//    private static RelativeSource 
	var s_previousData = null;
//    private static RelativeSource 
	var s_templatedParent = null; 
//    private static RelativeSource 
	var s_self = null;
	
	Object.defineProperties(RelativeSource,{
		/// <summary>static instance of RelativeSource for PreviousData mode. 
        /// </summary>
//        public static RelativeSource 
		PreviousData:
        {
            get:function() 
            {
                if (s_previousData == null) 
                { 
                    s_previousData = new RelativeSource(RelativeSourceMode.PreviousData);
                } 
                return s_previousData;
            }
        },
 
        /// <summary>static instance of RelativeSource for TemplatedParent mode.
        /// </summary> 
//        public static RelativeSource 
        TemplatedParent: 
        {
            get:function() 
            {
                if (s_templatedParent == null)
                {
                    s_templatedParent = new RelativeSource(RelativeSourceMode.TemplatedParent); 
                }
                return s_templatedParent; 
            } 
        },
 
        /// <summary>static instance of RelativeSource for Self mode.
        /// </summary>
//        public static RelativeSource 
        Self:
        { 
            get:function()
            { 
                if (s_self == null) 
                {
                    s_self = new RelativeSource(RelativeSourceMode.Self); 
                }
                return s_self;
            }
        }   
	});
	
	RelativeSource.Type = new Type("RelativeSource", RelativeSource, [MarkupExtension.Type, ISupportInitialize.Type]);
	return RelativeSource;
});
