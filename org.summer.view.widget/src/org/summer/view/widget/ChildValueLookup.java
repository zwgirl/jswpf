package org.summer.view.widget;
// 
//  PropertyValues set on either a Style or a TemplateNode or a 
//  Trigger are consolidated into a this data-structure. This
//  happens either when the owner Style or the Template is sealed. 
//
/*internal*/ public  class ChildValueLookup
{
    /*internal*/ public  ValueLookupType    LookupType; 
    /*internal*/ public  TriggerCondition[] Conditions;
    /*internal*/ public  DependencyProperty Property; 
    /*internal*/ public  Object             Value; 

    // Implemented for #1038821, FxCop ConsiderOverridingEqualsAndOperatorEqualsOnValueTypes 
    //  Trading off an Object boxing cost in exchange for avoiding reflection cost.
    public /*override*/ boolean Equals( Object value )
    {
        if( value instanceof ChildValueLookup ) 
        {
            ChildValueLookup other = (ChildValueLookup)value; 

            if( LookupType      == other.LookupType &&
                Property        == other.Property && 
                Value           == other.Value )
            {
                if( Conditions == null &&
                    other.Conditions == null ) 
                {
                    // Both condition arrays are null 
                    return true; 
                }

                if( Conditions == null ||
                    other.Conditions == null )
                {
                    // One condition array is null, but not other 
                    return false;
                } 

                // Both condition array non-null, see if they're the same length..
                if( Conditions.length == other.Conditions.length ) 
                {
                    // Same length.  Walk the list and compare.
                    for( int i = 0; i < Conditions.length; i++ )
                    { 
                        if( !Conditions[i].TypeSpecificEquals(other.Conditions[i]) )
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

    // GetHashCode, ==, and != are required when Equals is overridden, even though we don't expect to need them.
    public /*override*/ int GetHashCode() 
    {
//        Debug.Assert(false, "GetHashCode for value types will use reflection to generate the hashcode.  Write a better hash code generation algorithm if this struct is to be used in a hashtable, or remove this assert if it's decided that reflection is OK.");

        return super.GetHashCode(); 
    }

    public static boolean operator == ( ChildValueLookup value1, ChildValueLookup value2 ) 
    {
        return value1.Equals( value2 ); 
    }

    public static boolean operator != ( ChildValueLookup value1, ChildValueLookup value2 )
    { 
        return !value1.Equals( value2 );
    } 
} 