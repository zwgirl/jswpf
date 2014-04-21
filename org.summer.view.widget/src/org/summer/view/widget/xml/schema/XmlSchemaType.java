package org.summer.view.widget.xml.schema;

import javax.xml.bind.annotation.XmlSchema;

/// <summary>
	/// Summary description for XmlSchemaType.
	/// </summary>
	public class XmlSchemaType extends XmlSchemaAnnotated
	{
		private XmlSchemaDerivationMethod final;
		private bool isMixed;
		private String name;
		boolean recursed;

		/*internal*/public XmlQualifiedName BaseSchemaTypeName;
		/*internal*/public XmlSchemaType BaseXmlSchemaTypeInternal;
		/*internal*/public XmlSchemaDatatype DatatypeInternal;
		/*internal*/public XmlSchemaDerivationMethod resolvedDerivedBy;
		/*internal*/public XmlSchemaDerivationMethod finalResolved;
		/*internal*/public XmlQualifiedName QNameInternal;

		public XmlSchemaType ()
		{
			_final = XmlSchemaDerivationMethod.None;
			QNameInternal = XmlQualifiedName.Empty;
		}

//		#region Attributes
//		[System.Xml.Serialization.XmlAttribute("name")]
		public String Name {
			get{ return name; }
			set{ name = value; }
		}

//		[DefaultValue(XmlSchemaDerivationMethod.None)]
		[System.Xml.Serialization.XmlAttribute("final")]
		public XmlSchemaDerivationMethod Final {
			get{ return  final; }
			set{ final = value; }
		}
//		#endregion

//		#region Post Compilation Schema Information
//		[XmlIgnore]
		public XmlQualifiedName QualifiedName {
			get{ return QNameInternal; }
		}

//		[XmlIgnore]
		public XmlSchemaDerivationMethod FinalResolved {
			get{ return finalResolved; }
		}

//		[XmlIgnore]
//#if NET_2_0
//		[Obsolete ("This property is going away. Use BaseXmlSchemaType instead")]
//#endif
		public Object BaseSchemaType {
			get{
				if (BaseXmlSchemaType != null)
					return BaseXmlSchemaType;
				else if (this == XmlSchemaComplexType.AnyType)
					return null; // This property is designed so.
				else
					return Datatype;
			}
		}

//		[XmlIgnore]
//		// FIXME:This property works as always returning a valid schema type.
//		[MonoTODO]
		// In .NET 2.0, all schema types used in schema documents must
		// be XmlSchemaType, even if it is primitive type, in terms of
		// non-obsolete System.Xml.Schema members.

		// To modify this property, we have to make sure that it does
		// not affect to any compilation/validation logic.
//#if NET_2_0
//		public XmlSchemaType BaseXmlSchemaType {
//#else
		/*internal*/public XmlSchemaType BaseXmlSchemaType {
//#endif
			get { return  BaseXmlSchemaTypeInternal; }
		}

//		[XmlIgnore]
		public XmlSchemaDerivationMethod DerivedBy {
			get{ return resolvedDerivedBy; }
		}

//		[XmlIgnore]
		public XmlSchemaDatatype Datatype {
			get{ return DatatypeInternal; }
		}

//		[XmlIgnore]
		public virtual boolean IsMixed {  
			get{ return  isMixed; }
			set{ isMixed = value; } 
		}

//#if NET_2_0
//		 LAMESPEC: for IDREFS it returns Idref. for ENTITIES 
//		 it returns Entity. for NMTOKENS it returns NmToken.
//		[XmlIgnore]
		public XmlTypeCode TypeCode {
			get {
				if (this == XmlSchemaComplexType.AnyType)
					return XmlTypeCode.Item;
				if (DatatypeInternal == XmlSchemaSimpleType.AnySimpleType)
					return XmlTypeCode.AnyAtomicType;
				if (this == XmlSchemaSimpleType.XsIDRefs)
					return XmlTypeCode.Idref;
				if (this == XmlSchemaSimpleType.XsEntities)
					return XmlTypeCode.Entity;
				if (this == XmlSchemaSimpleType.XsNMTokens)
					return XmlTypeCode.NmToken;
				if (DatatypeInternal != null)
					return DatatypeInternal.TypeCode;
				return BaseXmlSchemaType.TypeCode;
			}
		}
//#endif
//		#endregion

//#if NET_2_0
//		/*internal*/public static XmlSchemaType GetBuiltInType (XmlQualifiedName qualifiedName)
//		{
//			XmlSchemaType t = GetBuiltInSimpleType (qualifiedName);
//			if (t == null)
//				t = GetBuiltInComplexType (qualifiedName);
//			return t;
//		}
//
//		/*internal*/public static XmlSchemaType GetBuiltInType (XmlTypeCode typecode)
//		{
//			if (typecode == XmlTypeCode.Item)
//				return XmlSchemaComplexType.AnyType;
//			return GetBuiltInSimpleType (typecode);
//		}
////#endif

//#if NET_2_0
//		public static XmlSchemaComplexType GetBuiltInComplexType (XmlQualifiedName qualifiedName)
//#else
		/*internal*/public static XmlSchemaComplexType GetBuiltInComplexType (XmlQualifiedName qualifiedName)
//#endif
		{
			if (qualifiedName.Name == "anyType" && qualifiedName.Namespace == XmlSchema.Namespace)
				return XmlSchemaComplexType.AnyType;

			return null;
		}

//#if NET_2_0
//		public static XmlSchemaComplexType GetBuiltInComplexType (XmlTypeCode typeCode)
//		{
//			switch (typeCode) {
//			case XmlTypeCode.Item:
//				return XmlSchemaComplexType.AnyType;
//			}
//			return null;
//		}
//#endif

//#if NET_2_0
//		[MonoTODO]
		public static XmlSchemaSimpleType GetBuiltInSimpleType (XmlQualifiedName qualifiedName)
		{
			if (qualifiedName.Namespace == "http://www.w3.org/2003/11/xpath-datatypes") {
				switch (qualifiedName.Name) {
				case "untypedAtomic":
					return XmlSchemaSimpleType.XdtUntypedAtomic;
				case "anyAtomicType":
					return XmlSchemaSimpleType.XdtAnyAtomicType;
				case "yearMonthDuration":
					return XmlSchemaSimpleType.XdtYearMonthDuration;
				case "dayTimeDuration":
					return XmlSchemaSimpleType.XdtDayTimeDuration;
				}
				return null;
			}
			else if (qualifiedName.Namespace != XmlSchema.Namespace)
				return null;
			switch (qualifiedName.Name) {
			case "anySimpleType":
				return XmlSchemaSimpleType.XsAnySimpleType;
			case "String":
				return XmlSchemaSimpleType.XsString;
			case "boolean":
				return XmlSchemaSimpleType.XsBoolean;
			case "decimal":
				return XmlSchemaSimpleType.XsDecimal;
			case "float":
				return XmlSchemaSimpleType.XsFloat;
			case "double":
				return XmlSchemaSimpleType.XsDouble;
			case "duration":
				return XmlSchemaSimpleType.XsDuration;
			case "dateTime":
				return XmlSchemaSimpleType.XsDateTime;
			case "time":
				return XmlSchemaSimpleType.XsTime;
			case "date":
				return XmlSchemaSimpleType.XsDate;
			case "gYearMonth":
				return XmlSchemaSimpleType.XsGYearMonth;
			case "gYear":
				return XmlSchemaSimpleType.XsGYear;
			case "gMonthDay":
				return XmlSchemaSimpleType.XsGMonthDay;
			case "gDay":
				return XmlSchemaSimpleType.XsGDay;
			case "gMonth":
				return XmlSchemaSimpleType.XsGMonth;
			case "hexBinary":
				return XmlSchemaSimpleType.XsHexBinary;
			case "base64Binary":
				return XmlSchemaSimpleType.XsBase64Binary;
			case "anyURI":
				return XmlSchemaSimpleType.XsAnyUri;
			case "QName":
				return XmlSchemaSimpleType.XsQName;
			case "NOTATION":
				return XmlSchemaSimpleType.XsNotation;
			case "normalizedString":
				return XmlSchemaSimpleType.XsNormalizedString;
			case "token":
				return XmlSchemaSimpleType.XsToken;
			case "language":
				return XmlSchemaSimpleType.XsLanguage;
			case "NMTOKEN":
				return XmlSchemaSimpleType.XsNMToken;
			case "NMTOKENS":
				return XmlSchemaSimpleType.XsNMTokens;
			case "Name":
				return XmlSchemaSimpleType.XsName;
			case "NCName":
				return XmlSchemaSimpleType.XsNCName;
			case "ID":
				return XmlSchemaSimpleType.XsID;
			case "IDREF":
				return XmlSchemaSimpleType.XsIDRef;
			case "IDREFS":
				return XmlSchemaSimpleType.XsIDRefs;
			case "ENTITY":
				return XmlSchemaSimpleType.XsEntity;
			case "ENTITIES":
				return XmlSchemaSimpleType.XsEntities;
			case "integer":
				return XmlSchemaSimpleType.XsInteger;
			case "nonPositiveInteger":
				return XmlSchemaSimpleType.XsNonPositiveInteger;
			case "negativeInteger":
				return XmlSchemaSimpleType.XsNegativeInteger;
			case "long":
				return XmlSchemaSimpleType.XsLong;
			case "int":
				return XmlSchemaSimpleType.XsInt;
			case "short":
				return XmlSchemaSimpleType.XsShort;
			case "byte":
				return XmlSchemaSimpleType.XsByte;
			case "nonNegativeInteger":
				return XmlSchemaSimpleType.XsNonNegativeInteger;
			case "positiveInteger":
				return XmlSchemaSimpleType.XsPositiveInteger;
			case "unsignedLong":
				return XmlSchemaSimpleType.XsUnsignedLong;
			case "unsignedInt":
				return XmlSchemaSimpleType.XsUnsignedInt;
			case "unsignedShort":
				return XmlSchemaSimpleType.XsUnsignedShort;
			case "unsignedByte":
				return XmlSchemaSimpleType.XsUnsignedByte;
			}
			return null;
		}

		/*internal*/public static XmlSchemaSimpleType GetBuiltInSimpleType (XmlSchemaDatatype type)
		{
			if (type instanceof XsdEntities)
				return XmlSchemaSimpleType.XsEntities;
			else if (type instanceof XsdNMTokens)
				return XmlSchemaSimpleType.XsNMTokens;
			else if (type instanceof XsdIDRefs)
				return XmlSchemaSimpleType.XsIDRefs;
			else
				return GetBuiltInSimpleType (type.TypeCode);
		}

//		[MonoTODO]
		// Don't use this method to cover all XML Schema datatypes.
		public static XmlSchemaSimpleType GetBuiltInSimpleType (XmlTypeCode typeCode)
		{
			switch (typeCode) {
			case XmlTypeCode.None:
			case XmlTypeCode.Item:
			case XmlTypeCode.Node:
			case XmlTypeCode.Document: // node
			case XmlTypeCode.Element: // node
			case XmlTypeCode.Attribute: // node
			case XmlTypeCode.Namespace: // node
			case XmlTypeCode.ProcessingInstruction: // node
			case XmlTypeCode.Comment: // node
			case XmlTypeCode.Text:	// node
				return null;
			case XmlTypeCode.AnyAtomicType:
				return XmlSchemaSimpleType.XdtAnyAtomicType;
			case XmlTypeCode.UntypedAtomic:
				return XmlSchemaSimpleType.XdtUntypedAtomic;
			case XmlTypeCode.String:
				return XmlSchemaSimpleType.XsString;
			case XmlTypeCode.Boolean:
				return XmlSchemaSimpleType.XsBoolean;
			case XmlTypeCode.Decimal:
				return XmlSchemaSimpleType.XsDecimal;
			case XmlTypeCode.Float:
				return XmlSchemaSimpleType.XsFloat;
			case XmlTypeCode.Double:
				return XmlSchemaSimpleType.XsDouble;
			case XmlTypeCode.Duration:
				return XmlSchemaSimpleType.XsDuration;
			case XmlTypeCode.DateTime:
				return XmlSchemaSimpleType.XsDateTime;
			case XmlTypeCode.Time:
				return XmlSchemaSimpleType.XsTime;
			case XmlTypeCode.Date:
				return XmlSchemaSimpleType.XsDate;
			case XmlTypeCode.GYearMonth:
				return XmlSchemaSimpleType.XsGYearMonth;
			case XmlTypeCode.GYear:
				return XmlSchemaSimpleType.XsGYear;
			case XmlTypeCode.GMonthDay:
				return XmlSchemaSimpleType.XsGMonthDay;
			case XmlTypeCode.GDay:
				return XmlSchemaSimpleType.XsGDay;
			case XmlTypeCode.GMonth:
				return XmlSchemaSimpleType.XsGMonth;
			case XmlTypeCode.HexBinary:
				return XmlSchemaSimpleType.XsHexBinary;
			case XmlTypeCode.Base64Binary:
				return XmlSchemaSimpleType.XsBase64Binary;
			case XmlTypeCode.AnyUri:
				return XmlSchemaSimpleType.XsAnyUri;
			case XmlTypeCode.QName:
				return XmlSchemaSimpleType.XsQName;
			case XmlTypeCode.Notation:
				return XmlSchemaSimpleType.XsNotation;
			case XmlTypeCode.NormalizedString:
				return XmlSchemaSimpleType.XsNormalizedString;
			case XmlTypeCode.Token:
				return XmlSchemaSimpleType.XsToken;
			case XmlTypeCode.Language:
				return XmlSchemaSimpleType.XsLanguage;
			case XmlTypeCode.NmToken: // NmTokens is not primitive
				return XmlSchemaSimpleType.XsNMToken;
			case XmlTypeCode.Name:
				return XmlSchemaSimpleType.XsName;
			case XmlTypeCode.NCName:
				return XmlSchemaSimpleType.XsNCName;
			case XmlTypeCode.Id:
				return XmlSchemaSimpleType.XsID;
			case XmlTypeCode.Idref: // Idrefs is not primitive
				return XmlSchemaSimpleType.XsIDRef;
			case XmlTypeCode.Entity: // Entities is not primitive
				return XmlSchemaSimpleType.XsEntity;
			case XmlTypeCode.Integer:
				return XmlSchemaSimpleType.XsInteger;
			case XmlTypeCode.NonPositiveInteger:
				return XmlSchemaSimpleType.XsNonPositiveInteger;
			case XmlTypeCode.NegativeInteger:
				return XmlSchemaSimpleType.XsNegativeInteger;
			case XmlTypeCode.Long:
				return XmlSchemaSimpleType.XsLong;
			case XmlTypeCode.Int:
				return XmlSchemaSimpleType.XsInt;
			case XmlTypeCode.Short:
				return XmlSchemaSimpleType.XsShort;
			case XmlTypeCode.Byte:
				return XmlSchemaSimpleType.XsByte;
			case XmlTypeCode.NonNegativeInteger:
				return XmlSchemaSimpleType.XsNonNegativeInteger;
			case XmlTypeCode.UnsignedLong:
				return XmlSchemaSimpleType.XsUnsignedLong;
			case XmlTypeCode.UnsignedInt:
				return XmlSchemaSimpleType.XsUnsignedInt;
			case XmlTypeCode.UnsignedShort:
				return XmlSchemaSimpleType.XsUnsignedShort;
			case XmlTypeCode.UnsignedByte:
				return XmlSchemaSimpleType.XsUnsignedByte;
			case XmlTypeCode.PositiveInteger:
				return XmlSchemaSimpleType.XsPositiveInteger;
			case XmlTypeCode.YearMonthDuration:
				return XmlSchemaSimpleType.XdtYearMonthDuration;
			case XmlTypeCode.DayTimeDuration:
				return XmlSchemaSimpleType.XdtDayTimeDuration;
			}
			return null;
		}

		public static boolean IsDerivedFrom (XmlSchemaType derivedType, XmlSchemaType baseType, XmlSchemaDerivationMethod except)
		{
			if (derivedType.BaseXmlSchemaType == null)
				return false;
			if ((derivedType.DerivedBy & except) != 0)
				return false;
			if (derivedType.BaseXmlSchemaType == baseType)
				return true;
			return IsDerivedFrom (derivedType.BaseXmlSchemaType,
				baseType, except);
		}
//#endif

		/*internal*/public boolean ValidateRecursionCheck ()
		{
			if (recursed)
				return (this != XmlSchemaComplexType.AnyType);
			recursed = true;
			XmlSchemaType baseType = this.BaseXmlSchemaType as XmlSchemaType;
			boolean result = false;
			if (baseType != null)
				result = baseType.ValidateRecursionCheck ();
			recursed = false;
			return result;
		}
	}