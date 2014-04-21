package org.summer.view.widget.xaml.schema;

import java.rmi.activation.Activator;

import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.Type;
import org.summer.view.widget.xaml.XamlType;

public class XamlValueConverter<TConverterBase> //: IEquatable<XamlValueConverter<TConverterBase>>
//		where TConverterBase : class
	{
		public XamlValueConverter (Type converterType, XamlType targetType)
		{
			this (converterType, targetType, null);
		}

		public XamlValueConverter (Type converterType, XamlType targetType, String name)
		{
			if (converterType == null && targetType == null && name == null)
				throw new ArgumentException ("Either of converterType, targetType or name must be non-null");
			ConverterType = converterType;
			TargetType = targetType;
			Name = name;
		}

		TConverterBase converter_instance;
		public TConverterBase ConverterInstance {
			get {
				if (converter_instance == null)
					converter_instance = CreateInstance ();
				return converter_instance;
			}
		}
		public Type ConverterType { get; private set; }
		public String Name { get; private set; }
		public XamlType TargetType { get; private set; }


		public static boolean operator == (XamlValueConverter<TConverterBase> left, XamlValueConverter<TConverterBase> right)
		{
			return IsNull (left) ? IsNull (right) : left.Equals (right);
		}

		static boolean IsNull (XamlValueConverter<TConverterBase> a)
		{
			return Object.ReferenceEquals (a, null);
		}

		public static boolean operator != (XamlValueConverter<TConverterBase> left, XamlValueConverter<TConverterBase> right)
		{
			return IsNull (left) ? !IsNull (right) : IsNull (right) || left.ConverterType != right.ConverterType || left.TargetType != right.TargetType || left.Name != right.Name;
		}

		public boolean Equals (XamlValueConverter<TConverterBase> other)
		{
			return !IsNull (other) && ConverterType == other.ConverterType && TargetType == other.TargetType && Name == other.Name;
		}

		public /*override*/ boolean Equals (Object obj)
		{
			var a = obj as XamlValueConverter<TConverterBase>;
			return Equals (a);
		}

		protected /*virtual*/ TConverterBase CreateInstance ()
		{
			if (ConverterType == null)
				return null;

			if (!typeof (TConverterBase).IsAssignableFrom (ConverterType))
				throw new XamlSchemaException (String.Format ("ConverterType '{0}' is not derived from '{1}' type", ConverterType, typeof (TConverterBase)));

			if (TargetType != null && TargetType.UnderlyingType != null) {
				// special case: Enum
				if (TargetType.UnderlyingType.IsEnum)
					return (TConverterBase) (Object) new EnumConverter (TargetType.UnderlyingType);
				// special case: Nullable<T>
				if (TargetType.IsNullable && TargetType.UnderlyingType.IsValueType)
					return (TConverterBase) (Object) new NullableConverter (TargetType.UnderlyingType);
			}

			if (ConverterType.GetConstructor (Type.EmptyTypes) == null)
				return null;

			return (TConverterBase) Activator.CreateInstance (ConverterType, true);
		}

		public /*override*/ int GetHashCode ()
		{
			var ret = ConverterType != null ? ConverterType.GetHashCode () : 0;
			ret <<= 5;
			if (TargetType != null)
				ret += TargetType.GetHashCode ();
			ret <<= 5;
			if (Name != null)
				ret += Name.GetHashCode ();
			return ret;
		}

		public /*override*/ String ToString ()
		{
			if (Name != null)
				return Name;
			if (ConverterType != null && TargetType != null)
				return String.Concat (ConverterType.Name, "(", TargetType.Name, ")");
			else if (ConverterType != null)
				return ConverterType.Name;
			else
				return TargetType.Name;
		}
	}