package org.summer.view.widget.markup;

import org.omg.CORBA.TypeCode;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.CultureInfo;
import org.summer.view.widget.NotImplementedException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.xaml.IXamlNamespaceResolver;
import org.summer.view.widget.xaml.IXamlSchemaContextProvider;
import org.summer.view.widget.xaml.XamlLanguage;
import org.summer.view.widget.xaml.schema.XamlTypeName;

public abstract class ValueSerializer
	{
//#if !NET_2_1
		public static ValueSerializer GetSerializerFor (PropertyDescriptor descriptor)
		{
			return GetSerializerFor (descriptor, null);
		}
//#endif

		public static ValueSerializer GetSerializerFor (Type type)
		{
			return GetSerializerFor (type, null);
		}

//#if !NET_2_1
		// untested
		public static ValueSerializer GetSerializerFor (PropertyDescriptor descriptor, IValueSerializerContext context)
		{
			if (descriptor == null)
				throw new ArgumentNullException ("descriptor");
			if (context != null)
				return context.GetValueSerializerFor (descriptor);

			TypeConverter tc = descriptor.Converter;
			if (tc != null && tc.GetType () != typeof (TypeConverter))
				return new TypeConverterValueSerializer (tc);
			return null;
		}
//#endif

		public static ValueSerializer GetSerializerFor (Type type, IValueSerializerContext context)
		{
			if (type == null)
				throw new ArgumentNullException ("type");
			if (context != null)
				return context.GetValueSerializerFor (type);

			// Standard MarkupExtensions are serialized without ValueSerializer.
			if (typeof (MarkupExtension).IsAssignableFrom (type) && XamlLanguage.AllTypes.Any (x => x.UnderlyingType == type))
				return null;

			// DateTime is documented as special.
			if (type == typeof (DateTime))
				return new DateTimeValueSerializer ();
			// String too.
			if (type == typeof (String))
				return new StringValueSerializer ();

			// FIXME: this is hack. The complete condition is fully documented at http://msdn.microsoft.com/en-us/library/ms590363.aspx
			if (type.GetCustomAttribute<TypeConverterAttribute> (true) != null) {
				TypeConverter tc = type.GetTypeConverter ();
				if (tc != null && tc.GetType () != typeof (TypeConverter))
					return new TypeConverterValueSerializer (tc);
			}

			// Undocumented, but System.Type seems also special. While other MarkupExtension returned types are not handled specially, this method returns a valid instance for System.Type. Note that it doesn't for TypeExtension.
			if (type == typeof (Type))
				// Since System.Type does not have a valid TypeConverter, I use TypeExtensionConverter (may sound funny considering the above notes!) for this serializer.
				return new TypeValueSerializer ();

			// Undocumented, but several primitive types get a valid serializer while it does not have TypeConverter.
			switch (Type.GetTypeCode (type)) {
			case TypeCode.Object:
			case TypeCode.DBNull:
				break;
			default:
				return new TypeConverterValueSerializer (type.GetTypeConverter ());
			}

			// There is still exceptional type! TimeSpan. Why aren't they documented?
			if (type == typeof (TimeSpan))
				return new TypeConverterValueSerializer (type.GetTypeConverter ());

			return null;
		}

		// instance members

		public /*virtual*/ boolean CanConvertFromString (String value, IValueSerializerContext context)
		{
			return false;
		}

		public /*virtual*/ boolean CanConvertToString (Object value, IValueSerializerContext context)
		{
			return false;
		}

		public /*virtual*/ Object ConvertFromString (String value, IValueSerializerContext context)
		{
			throw GetConvertFromException (value);
		}

		public /*virtual*/ String ConvertToString (Object value,     IValueSerializerContext context)
		{
			throw GetConvertToException (value, typeof (String));
		}

		protected RuntimeException GetConvertFromException (Object value)
		{
			return new NotSupportedException (String.format ("Conversion from String '{0}' is not supported", value));
		}

		protected Exception GetConvertToException (Object value, Type destinationType)
		{
			return new NotSupportedException (String.Format ("Conversion from '{0}' to {1} is not supported", value != null ? value.GetType ().Name : "(null)", destinationType));
		}

		public /*virtual*/ IEnumerable<Type> TypeReferences (Object value, IValueSerializerContext context)
		{
			/*yield*/ /*break*/;
			return null;
		}
	}

//	#region Internal implementations.

	/*internal*/ class StringValueSerializer extends ValueSerializer
	{
		public /*override*/ boolean CanConvertFromString (String value, IValueSerializerContext context)
		{
			return true;
		}

		public /*override*/ boolean CanConvertToString (Object value, IValueSerializerContext context)
		{
			return true;
		}

		public /*override*/ Object ConvertFromString (String value, IValueSerializerContext context)
		{
			return value;
		}

		public /*override*/ String ConvertToString (Object value,     IValueSerializerContext context)
		{
			return (String) value;
		}

		public /*override*/ IEnumerable<Type> TypeReferences (Object value, IValueSerializerContext context)
		{
			throw new NotImplementedException ();
		}
	}

	/*internal*/ class TypeValueSerializer extends ValueSerializer
	{
		TypeExtensionConverter txc = new TypeExtensionConverter ();

		public /*override*/ boolean CanConvertFromString (String value, IValueSerializerContext context)
		{
			return true;
		}

		public /*override*/ boolean CanConvertToString (Object value, IValueSerializerContext context)
		{
			return true;
		}

		public /*override*/ Object ConvertFromString (String value, IValueSerializerContext context)
		{
			if (context == null)
				return super.ConvertFromString (value, context);
			var nsr = (IXamlNamespaceResolver) context.GetService (typeof (IXamlNamespaceResolver));
			var scp = (IXamlSchemaContextProvider) context.GetService (typeof (IXamlSchemaContextProvider));
			return scp.SchemaContext.GetXamlType (XamlTypeName.Parse (value, nsr)).UnderlyingType;
		}

		public /*override*/ String ConvertToString (Object value,     IValueSerializerContext context)
		{
			return (String) txc.ConvertTo (context, CultureInfo.InvariantCulture, value, typeof (String));
		}

		public /*override*/ IEnumerable<Type> TypeReferences (Object value, IValueSerializerContext context)
		{
			throw new NotImplementedException ();
		}
	}

	/*internal*/ class TypeConverterValueSerializer extends ValueSerializer
	{
		public TypeConverterValueSerializer (TypeConverter typeConverter)
		{
			c = typeConverter;
		}

		TypeConverter c;

		public /*override*/ boolean CanConvertFromString (String value, IValueSerializerContext context)
		{
			return c.CanConvertFrom (context, typeof (String));
		}

		public /*override*/ boolean CanConvertToString (Object value, IValueSerializerContext context)
		{
			return c.CanConvertTo (context, typeof (String));
		}

		public /*override*/ Object ConvertFromString (String value, IValueSerializerContext context)
		{
			return c.ConvertFrom (context, CultureInfo.InvariantCulture, value);
		}

		public /*override*/ String ConvertToString (Object value,     IValueSerializerContext context)
		{
			return value == null ? String.Empty : (String) c.ConvertTo (context, CultureInfo.InvariantCulture, value, typeof (String));
		}

		public /*override*/ IEnumerable<Type> TypeReferences (Object value, IValueSerializerContext context)
		{
			throw new NotImplementedException ();
		}
	}