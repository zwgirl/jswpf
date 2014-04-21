/**
 * from StyleHelper
 */
/**
 * ChildValueLookup
 */
// 
//  PropertyValues set on either a Style or a TemplateNode or a 
//  Trigger are consolidated into a this data-structure. This
//  happens either when the owner Style or the Template is sealed. 
//
//internal struct 
define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var ChildValueLookup = declare("ChildValueLookup", Object,{
		constructor:function(){
			this._conditions = null;
		},
        // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
        //  Trading off an object boxing cost in exchange for avoiding reflection cost.
//        public override bool 
        Equals:function( /*object*/ value )
        {
            if( value instanceof ChildValueLookup ) 
            {
                /*ChildValueLookup*/
//            	var other = /*(ChildValueLookup)*/value; 
 
                if( this.LookupType      == value.LookupType &&
                		this.Property        == value.Property && 
                		this.Value           == value.Value )
                {
                    if( this.Conditions == null &&
                    		this.value.Conditions == null ) 
                    {
                        // Both condition arrays are null 
                        return true; 
                    }
 
                    if( this.Conditions == null ||
                    		this.value.Conditions == null )
                    {
                        // One condition array is null, but not other 
                        return false;
                    } 
 
                    // Both condition array non-null, see if they're the same length..
                    if( this.Conditions.length == value.Conditions.length ) 
                    {
                        // Same length.  Walk the list and compare.
                        for( var i = 0; i < this.Conditions.length; i++ )
                        { 
                            if( !this.Conditions[i].TypeSpecificEquals(value.Conditions[i]) )
                            { 
                                return false; 
                            }
                        } 
                        return true;
                    }
                }
            } 
            return false;
        } 
	});
	
	Object.defineProperties(ChildValueLookup.prototype,{
//        internal ValueLookupType    
        LookupType:{
        	get:function(){
        		return this._lookupType;
        	},
        	set:function(value){
        		this._lookupType = value;
        	}
        },
//        internal TriggerCondition[] 
        Conditions:
        {
        	get:function(){
        		return this._conditions;
        	},
        	set:function(value){
        		this._conditions = value;
        	}
        },
//        internal DependencyProperty 
        Property:
        {
        	get:function(){
        		return this._property;
        	},
        	set:function(value){
        		this._property = value;
        	}
        },
//        internal object             
        Value:
        {
        	get:function(){
        		return this._value;
        	},
        	set:function(value){
        		this._value = value;
        	}
        }
	});
	
	ChildValueLookup.Type = new Type("ChildValueLookup", ChildValueLookup, [Object.Type]);
	return ChildValueLookup;
});

//// 
//    //  PropertyValues set on either a Style or a TemplateNode or a 
//    //  Trigger are consolidated into a this data-structure. This
//    //  happens either when the owner Style or the Template is sealed. 
//    //
//    internal struct ChildValueLookup
//    {
//        internal ValueLookupType    LookupType; 
//        internal TriggerCondition[] Conditions;
//        internal DependencyProperty Property; 
//        internal object             Value; 
//
//        // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
//        //  Trading off an object boxing cost in exchange for avoiding reflection cost.
//        public override bool Equals( object value )
//        {
//            if( value is ChildValueLookup ) 
//            {
//                ChildValueLookup other = (ChildValueLookup)value; 
// 
//                if( LookupType      == other.LookupType &&
//                    Property        == other.Property && 
//                    Value           == other.Value )
//                {
//                    if( Conditions == null &&
//                        other.Conditions == null ) 
//                    {
//                        // Both condition arrays are null 
//                        return true; 
//                    }
// 
//                    if( Conditions == null ||
//                        other.Conditions == null )
//                    {
//                        // One condition array is null, but not other 
//                        return false;
//                    } 
// 
//                    // Both condition array non-null, see if they're the same length..
//                    if( Conditions.Length == other.Conditions.Length ) 
//                    {
//                        // Same length.  Walk the list and compare.
//                        for( int i = 0; i < Conditions.Length; i++ )
//                        { 
//                            if( !Conditions[i].TypeSpecificEquals(other.Conditions[i]) )
//                            { 
//                                return false; 
//                            }
//                        } 
//                        return true;
//                    }
//                }
//            } 
//            return false;
//        } 
// 
//        // GetHashCode, ==, and != are required when Equals is overridden, even though we don't expect to need them.
//        public override int GetHashCode() 
//        {
//            Debug.Assert(false, "GetHashCode for value types will use reflection to generate the hashcode.  Write a better hash code generation algorithm if this struct is to be used in a hashtable, or remove this assert if it's decided that reflection is OK.");
//
//            return base.GetHashCode(); 
//        }
// 
//        public static bool operator == ( ChildValueLookup value1, ChildValueLookup value2 ) 
//        {
//            return value1.Equals( value2 ); 
//        }
//
//        public static bool operator != ( ChildValueLookup value1, ChildValueLookup value2 )
//        { 
//            return !value1.Equals( value2 );
//        } 
//    } 