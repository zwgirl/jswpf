define([ "dojo/_base/declare", "dojo/_base/lang", "my/data/Feature" ], function(declare, lang, Feature) {
	var Expression = declare(null, {
	
	
/// <summary> 
    ///     Modes for expressions 
    /// </summary>
    //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)] 
//    internal enum 
    ExpressionMode:{
        /// <summary>
        ///     No options 
        /// </summary>
        None    : 0, 
 
        /// <summary>
        ///     Expression may not be set in multiple places 
        /// </summary>
        /// <remarks>
        ///     Even if a non-shareable Expression has been attached and
        ///     then detached, it still may not be reused 
        /// </remarks>
        NonSharable:1, 
 
        /// <summary>
        ///     Expression forwards invalidations to the property on which it is set. 
        /// </summary>
        /// <remarks>
        ///     This option implies <see cref:"NonSharable"/> as well.
        ///     Whenever the expression is notified of an invalidation of one 
        ///     of its sources via OnPropertyInvalidation, it
        ///     promises to invalidate the property on which it is set, so the 
        ///     property engine doesn't have to. 
        ///
        ///     The property engine does not 
        ///     need to keep a reference to the target <see cref:"DependencyObject"/>
        ///     in this case, which can allow the target to be garbage-collected
        ///     when it is no longer in use.
        /// </remarks> 
        ForwardsInvalidations:2,
 
        /// <summary> 
        ///     Expression supports DependencySources on a different Dispatcher.
        /// </summary> 
        /// <remarks>
        ///     This option implies <see cref:"ForwardsInvalidations"/> as well.
        ///     When set, it suppresses the property engine's check that the
        ///     DependencyObject to which the expression is attached belongs to 
        ///     the same Thread as all its DependencySources, and allows
        ///     OnPropertyInvalidation notifications to arrive on the "wrong" 
        ///     Thread.  It is the expression's responsibility to handle these 
        ///     correctly, typically by marshalling them to the right Thread.
        ///     Note:  The check is only suppressed when the source isn't owned 
        ///     by any Thread (i.e. source.Dispatcher == null).
        /// </remarks>
        SupportsUnboundSources:3
    },

 
    /// <summary> 
    ///     Expressions are used to define dependencies between properties
    /// </summary> 
    /// <remarks>
    ///     When a property's computed value is no longer considered valid, the
    ///     property must be invalidated. The property engine propagates these
    ///     invalidations to all dependents.<para/> 
    ///
    ///     An Expression can be set per-instance per-property via SetValue. 
    /// </remarks> 
    //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey = Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)]
//    [TypeConverter(typeof(ExpressionConverter))] 
//    public class Expression
//    {
        /// <summary>
        ///     Expression construction 
        /// </summary>
//        internal Expression() : this(ExpressionMode.None) 
//        { 
//        }
 
        /// <summary>
        ///     Expression construction
        /// </summary>
//        internal Expression(ExpressionMode mode) 
        constructor:function(mode){
        	
        	if(mode == null && mode==undefined){
        		mode=ExpressionMode.None;
        	}
            this._flags = 0; 
 
            switch(mode)
            { 
                case ExpressionMode.None:
                    break;

                case ExpressionMode.NonSharable: 
                	this._flags |= InternalFlags.NonShareable;
                    break; 
 
                case ExpressionMode.ForwardsInvalidations:
                	this._flags |= InternalFlags.ForwardsInvalidations; 
                	this._flags |= InternalFlags.NonShareable;
                    break;

                case ExpressionMode.SupportsUnboundSources: 
                	this._flags |= InternalFlags.ForwardsInvalidations;
                    this._flags |= InternalFlags.NonShareable; 
                    this._flags |= InternalFlags.SupportsUnboundSources; 
                    break;
 
                default:
                    throw new ArgumentException(SR.Get(SRID.UnknownExpressionMode));
            }
        },

 
        // We need this Clone method to copy a binding during Freezable.Copy.  We shouldn't be taking 
        // the target object/dp parameters here, but Binding.ProvideValue requires it.  (Binding
        // could probably be re-factored so that we don't need this). 
//        [FriendAccessAllowed] // Used by Freezables
//        internal virtual Expression Copy( DependencyObject targetObject, DependencyProperty targetDP )
        Copy:function(targetObject, targetDP){
            // By default, just use the same copy. 
            return this;
        }, 
 

        /// <summary> 
        ///     List of sources of the Expression
        /// </summary>
        /// <returns>Sources list</returns>
//        internal virtual DependencySource[] GetSources() 
        GetSources:function(){
            return null; 
        },

        /// <summary> 
        ///     Called to evaluate the Expression value
        /// </summary>
        /// <param name="d">DependencyObject being queried</param>
        /// <param name="dp">Property being queried</param> 
        /// <returns>Computed value. Unset if unavailable.</returns>
//        internal virtual object GetValue(DependencyObject d, DependencyProperty dp) 
        GetValue:function(d, dp){ 
            return DependencyProperty.UnsetValue;
        },

        /// <summary>
        ///     Allows Expression to store set values
        /// </summary> 
        /// <param name="d">DependencyObject being set</param>
        /// <param name="dp">Property being set</param> 
        /// <param name="value">Value being set</param> 
        /// <returns>true if Expression handled storing of the value</returns>
//        internal virtual bool SetValue(DependencyObject d, DependencyProperty dp, object value) 
        SetValue:function(d, dp, value){
            return false;
        },
 
        /// <summary>
        ///     Notification that the Expression has been set as a property's value 
        /// </summary> 
        /// <param name="d">DependencyObject being set</param>
        /// <param name="dp">Property being set</param> 
//        internal virtual void OnAttach(DependencyObject d, DependencyProperty dp)
        OnAttach:function(d, dp){
        },
 
        /// <summary>
        ///     Notification that the Expression has been removed as a property's value 
        /// </summary> 
        /// <param name="d">DependencyObject being cleared</param>
        /// <param name="dp">Property being cleared</param> 
//        internal virtual void OnDetach(DependencyObject d, DependencyProperty dp)
        OnDetach:function(d, dp){
        },
 
        /// <summary>
        ///     Notification that a Dependent that this Expression established has 
        ///     been invalidated as a result of a Source invalidation 
        /// </summary>
        /// <param name="d">DependencyObject that was invalidated</param> 
        /// <param name="args">Changed event args for the property that was invalidated</param>
//        internal virtual void OnPropertyInvalidation(DependencyObject d, DependencyPropertyChangedEventArgs args)
        OnPropertyInvalidation:function(d, args){
        },

 
        /// <summary> 
        ///     Dynamically change this Expression sources (availiable only for NonShareable
        ///     Expressions) 
        /// </summary>
        /// <remarks>
        ///     Expression must be in use on provided DependencyObject/DependencyProperty.
        ///     GetSources must reflect the old sources to be replaced by the provided newSources. 
        /// </remarks>
        /// <param name="d">DependencyObject whose sources are to be updated</param> 
        /// <param name="dp">The property that the Expression is set to</param> 
        /// <param name="newSources">New sources</param>
//        internal void ChangeSources(DependencyObject d, DependencyProperty dp, DependencySource[] newSources) 
        ChangeSources:function(d, dp, newSources){
            if (d == null && !ForwardsInvalidations)
            {
                throw new ArgumentNullException("d"); 
            }
 
            if (dp == null && !ForwardsInvalidations) 
            {
                throw new ArgumentNullException("dp"); 
            }

            if (Shareable)
            { 
                throw new InvalidOperationException(SR.Get(SRID.ShareableExpressionsCannotChangeSources));
            } 
 
            DependencyObject.ValidateSources(d, newSources, this);
 
            // Additional validation in callee
            if (ForwardsInvalidations)
            {
                DependencyObject.ChangeExpressionSources(this, null, null, newSources); 
            }
            else 
            { 
                DependencyObject.ChangeExpressionSources(this, d, dp, newSources);
            } 
        },


 

//        internal void 
        MarkAttached:function()
        { 
            this._flags |= InternalFlags.Attached;
        }, 
 
//        internal void 
        MarkDetached:function()
        { 
        	this._flags |= InternalFlags.Detached;
        },

        /// <summary> 
        /// Expression.GetValue can return NoValue to indicate that
        /// the property engine should obtain the value some other way. 
        /// </summary> 
//        [FriendAccessAllowed]
//        internal static readonly object NoValue = new object(); 
//
//        private InternalFlags _flags;

//        [Flags] 
//        private enum 
        InternalFlags:
        { 
            None         : 0x0, 
            NonShareable : 0x1,
            ForwardsInvalidations : 0x2, 
            SupportsUnboundSources : 0x4,
            Attached    : 0x8,
            Detached    : 0x10,
        }

    });
	
	Expression.NoValue=new Object();
	
	Object.definedProperties(Expression.prototype, {
	       // Determines if Expression can be attached: 
        //    1) If Shareable
        //    2) If NonShareable and not HasBeenAttached 
//        internal bool 
        Attachable:{
            // Once a NonShareable has been Attached, it can't be used anywhere 
            // else again (even if it's been Detached)
            get:function() { return Shareable || !HasBeenAttached; }
        },
 
//        internal bool 
        Shareable:
        { 
            get:function() { return (_flags & InternalFlags.NonShareable) == 0; } 
        },
 
//        internal bool 
        ForwardsInvalidations:
        {
            get:function() { return (_flags & InternalFlags.ForwardsInvalidations) != 0; }
        }, 

//        internal bool 
        SupportsUnboundSources: 
        { 
            get:function() { return (_flags & InternalFlags.SupportsUnboundSources) != 0; }
        } ,

//        internal bool 
        HasBeenAttached:
        {
            get:function() { return (_flags & InternalFlags.Attached) != 0; } 
        },
 
//        internal bool 
        HasBeenDetached: 
        {
            get:function() { return (_flags & InternalFlags.Detached) != 0; } 
        }
	});

});