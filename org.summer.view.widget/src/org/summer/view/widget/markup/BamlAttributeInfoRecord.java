package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.RoutedEvent;
import org.summer.view.widget.Type;
import org.summer.view.widget.reflection.EventInfo;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;

public class BamlAttributeInfoRecord extends BamlVariableSizedRecord
    { 
        /*internal*/public BamlAttributeInfoRecord() 
        {
            Pin(); // Don't allow this record to be recycled in the read cache. 
            AttributeUsage = BamlAttributeUsage.Default;
        }

//#region Methods 

//#if !PBTCOMPILER 
        // LoadRecord specific data 
        /*internal*/public /*override*/ void  LoadRecordData(BinaryReader bamlBinaryReader)
        { 
            AttributeId  =   bamlBinaryReader.ReadInt16();
            OwnerTypeId  =   bamlBinaryReader.ReadInt16();
            AttributeUsage = (BamlAttributeUsage)bamlBinaryReader.ReadByte();
            Name  =          bamlBinaryReader.ReadString(); 
        }
//#endif 
 
        // write record specific Data.
        /*internal*/public /*override*/ void WriteRecordData(BinaryWriter bamlBinaryWriter) 
        {
            // write out an int for record size but we'll go back and fill
            bamlBinaryWriter.Write(AttributeId);
            bamlBinaryWriter.Write(OwnerTypeId); 
            bamlBinaryWriter.Write((Byte)AttributeUsage);
            bamlBinaryWriter.Write(Name); 
        } 

//#if !PBTCOMPILER 
        /*internal*/public /*override*/ void Copy(BamlRecord record)
        {
            base.Copy(record);
 
            BamlAttributeInfoRecord newRecord = (BamlAttributeInfoRecord)record;
            newRecord._ownerId = _ownerId; 
            newRecord._attributeId = _attributeId; 
            newRecord._name = _name;
            newRecord._ownerType = _ownerType; 
            newRecord._Event = _Event;
            newRecord._dp = _dp;
            newRecord._ei = _ei;
            newRecord._pi = _pi; 
            newRecord._smi = _smi;
            newRecord._gmi = _gmi; 
            newRecord._dpOrMiOrPi = _dpOrMiOrPi; 
        }
//#endif 

//#endregion Methods

//#region Properties 

        // The following 3 properties are stored in the Baml file and are read and 
        // written by the BamlRecordReader and BamlXamlNodeWriter 

        /*internal*/public short OwnerTypeId 
        {
            get { return _ownerId; }
            set { _ownerId = value; }
        } 

        /*internal*/public short AttributeId 
        { 
            set { _attributeId = value; }
            get { return _attributeId; } 
        }

        /*internal*/public String Name
        { 
            get { return _name; }
            set { _name = value; } 
        } 

        // The following properties are derived at runtime from the above 3 properties using 
        // the Mapper.  Which are set depends on the attribute and the context in which it is
        // used.

        /*internal*/public /*override*/ BamlRecordType RecordType 
        {
            get { return BamlRecordType.AttributeInfo; } 
        } 

//#if !PBTCOMPILER 
        // Return type of property.  Note that this uses the same logic as
        // Mapper.GetPropertyType but uses the cached values of DP, PropInfo
        // and AttachedPropertySetter.
        /*internal*/public Type GetPropertyType() 
        {
            Type validType = null; 
            DependencyProperty dp = DP; 
            if (dp == null)
            { 
                MethodInfo methodInfo = AttachedPropertySetter;
                if (methodInfo == null)
                {
                    PropertyInfo propInfo = PropInfo; 
                    validType = propInfo.PropertyType;
                } 
                else 
                {
                    ParameterInfo[] paramInfo = methodInfo.GetParameters(); 
                    validType = paramInfo[1].ParameterType;
                }
            }
            else 
            {
                validType = dp.PropertyType; 
            } 
            return validType;
        } 
//#endif

        /// <summary>
        /// Set the PropertyMember, which can is assumed to be a MethodInfo for 
        /// the static setter method for a DP or a PropertyInfo for the clr property
        /// </summary> 
        /// <remarks> 
        /// The possibility of having multiple member info cached for an attribute is when a
        /// dependency property that does not belong to the default namespace is used in once 
        /// in a once with a namespace prefix and once without it. When it has a namespace
        /// prefix we correctly find the dependency property for it. However when it does not
        /// have a namespace prefix it the parser tries to look it up in the default namespace
        /// and falls back to using the clr wrapper's property info for it instead. Another 
        /// scenario that requires caching more than one property info is when a dependency
        /// property has both a static settor and a clr wrapper. 
        /// </remarks> 
        /*internal*/public void SetPropertyMember (Object propertyMember)
        { 
            Debug.Assert((propertyMember is MethodInfo) || (propertyMember is PropertyInfo)
                        || (KnownTypes.Types[(int)KnownElements.DependencyProperty].IsAssignableFrom(propertyMember.GetType())),
                "Cache can hold either a MethodInfo and/or a PropertyInfo and/or a DependencyProperty for a given attribute");
 
            if (PropertyMember == null)
            { 
                PropertyMember = propertyMember; 
            }
            else 
            {
                // Cache a additional MemberInfo for the given attribute
                Object[] arr = PropertyMember as Object[];
                if (arr == null) 
                {
                    arr = new Object[3]; 
                    arr[0] = PropertyMember; 
                    arr[1] = propertyMember;
                } 
                else
                {
                    Debug.Assert(arr.Length == 3 && arr[0] != null && arr[1] != null);
                    arr[2] = propertyMember; 
                }
            } 
        } 

        /// <summary> 
        /// Return the PropertyMember, which can is assumed to be a MethodInfo for
        /// the static setter method for a DP or a PropertyInfo for the clr property
        /// </summary>
        /// <remarks> 
        /// The possibility of having multiple member info cached for an attribute is when a
        /// dependency property that does not belong to the default namespace is used in once 
        /// in a once with a namespace prefix and once without it. When it has a namespace 
        /// prefix we correctly find the dependency property for it. However when it does not
        /// have a namespace prefix it the parser tries to look it up in the default namespace 
        /// and falls back to using the clr wrapper's property info for it instead. Another
        /// scenario that requires caching more than one property info is when a dependency
        /// property has both a static settor and a clr wrapper.
        /// </remarks> 
        /*internal*/public Object GetPropertyMember(boolean onlyPropInfo)
        { 
            if (PropertyMember == null || 
                PropertyMember is MemberInfo ||
                KnownTypes.Types[(int)KnownElements.DependencyProperty].IsAssignableFrom(PropertyMember.GetType( )) ) 
            {
                if (onlyPropInfo)
                {
//#if PBTCOMPILER 
//                    return PropertyMember as PropertyInfo;
//#else 
                    return PropInfo; 
//#endif
                } 
                else
                {
                    return PropertyMember;
                } 
            }
            else 
            { 
                // The attribute has multiple member info. Choose which one to return.
                Object[] arr = (Object[])PropertyMember; 
                Debug.Assert(arr.Length == 3 && arr[0] != null && arr[1] != null);

                // If someone queries any MemberInfo for the given attribute then we return the
                // first member info cached for it. If they are looking specifically for a 
                // PropertyInfo we try and find them one.
                if (onlyPropInfo) 
                { 
                    if (arr[0] is PropertyInfo)
                    { 
                        return (PropertyInfo)arr[0];
                    }
                    else if (arr[1] is PropertyInfo)
                    { 
                        return (PropertyInfo)arr[1];
                    } 
                    else 
                    {
                        return arr[2] as PropertyInfo; 
                    }
                }
                else
                { 
                    return arr[0];
                } 
            } 
        }
 
        // Cached value of the DependencyProperty, MethodInfo for the static setter
        // method, or the PropertyInfo for a given property.  If this is an
        // event, then this is null.
        /*internal*/public Object PropertyMember 
        {
            get { return _dpOrMiOrPi; } 
            set { _dpOrMiOrPi = value; } 
        }
 
//#if !PBTCOMPILER

        // The cached type of the owner or declarer of this property
        /*internal*/public Type OwnerType 
        {
            get { return _ownerType; } 
            set { _ownerType = value; } 
        }
 
        // Cached value of the routed event id, if this attribute is for a
        // routed event.  If not a routed event, this is null.
        /*internal*/public RoutedEvent Event
        { 
            get {  return _Event; }
            set { _Event = value; } 
        } 

        // Cached value of DP, if available 
        /*internal*/public DependencyProperty DP
        {
            get
            { 
                if (null != _dp)
                    return _dp; 
                else 
                    return _dpOrMiOrPi as DependencyProperty;
            } 
            set
            {
                _dp = value;
                if (_dp != null) 
                {
                    // Release the other copy of the String 
                    _name = _dp.Name; 
                }
            } 
        }

        // Cached value of static property setter method info, if available
        /*internal*/public MethodInfo AttachedPropertySetter 
        {
            get 
            { 
                return _smi;
            } 

            set
            {
                _smi = value; 
            }
        } 
 
        // Cached value of static property getter method info, if available
        /*internal*/public MethodInfo AttachedPropertyGetter 
        {
            get
            {
                return _gmi; 
            }
 
            set 
            {
                _gmi = value; 
            }
        }

        // Cached value of EventInfo, if available 
        /*internal*/public EventInfo EventInfo
        { 
            get { return _ei; } 
            set { _ei = value; }
        } 

        // Cached value of PropertyInfo, if available
        /*internal*/public PropertyInfo PropInfo
        { 
            get
            { 
                return _pi; 
            }
            set { _pi = value; } 
        }

        /*internal*/public boolean IsInternal
        { 
            get
            { 
                return _flags[_isInternalSection] == 1 ? true : false; 
            }
 
            set
            {
                _flags[_isInternalSection] = value ? 1 : 0;
            } 
        }
//#endif 
 
        // Some attributes have special usage, such as setting the XmlLang and XmlSpace
        // strings in the parser context.  This is flagged with this property 
        /*internal*/public BamlAttributeUsage AttributeUsage
        {
            get
            { 
                return (BamlAttributeUsage) _flags[_attributeUsageSection];
            } 
 
            set
            { 
                _flags[_attributeUsageSection] = (int) value;
            }
        }
 

        // Allocate space in _flags. 
 
        private static BitVector32.Section _isInternalSection
            = BitVector32.CreateSection( 1, BamlVariableSizedRecord.LastFlagsSection ); 

        private static BitVector32.Section _attributeUsageSection
            = BitVector32.CreateSection( 3, _isInternalSection );
 
//#if !PBTCOMPILER
        // This provides subclasses with a referece section to create their own section. 
        /*internal*/public /*new*/ static BitVector32.Section LastFlagsSection 
        {
            get { return _attributeUsageSection; } 
        }
//#endif

//#endregion Properties 

//#if !PBTCOMPILER 
        public /*override*/ String ToString() 
        {
            return String.Format(CultureInfo.InvariantCulture, 
                                 "{0} owner={1} attr({2}) is '{3}'",
                                 RecordType, GetTypeName(OwnerTypeId), AttributeId, _name);
        }
//#endif 

//#region Data 
 
        short _ownerId;
        short _attributeId; 
        String _name;

#if !PBTCOMPILER
        Type               _ownerType = null; 
        RoutedEvent        _Event = null;
        DependencyProperty _dp = null; 
        EventInfo          _ei = null; 
        PropertyInfo       _pi = null;
        MethodInfo         _smi = null; 
        MethodInfo         _gmi = null;
//#endif

        Object             _dpOrMiOrPi = null;   // MethodInfo, PropertyInfo or DependencyProperty 

//#endregion Data 
    } 

    // Information about a String that is an entry in the String table. 
    // <SecurityNote>
    // This code should always be transparent.  Meaning you should never add
    // SecurityCritical to this section of the code.
    // </SecurityNote> 
    /*internal*/