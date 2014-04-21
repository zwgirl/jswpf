import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.Type;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.reflection.PropertyInfo;

/// <summary>
///  Class for Xaml markup extension for static field and property references.
/// </summary>
//[TypeConverter(typeof(StaticExtensionConverter))]
//[MarkupExtensionReturnType(typeof(object))]
public class StaticExtension extends MarkupExtension
{
    /// <summary>
    ///  Constructor that takes no parameters
    /// </summary>
    public StaticExtension()
    {
    }

    /// <summary>
    ///  Constructor that takes the member that this is a static reference to.
    ///  This String is of the format
    ///     Prefix:ClassName.FieldOrPropertyName.  The Prefix is
    ///  optional, and refers to the XML prefix in a Xaml file.
    /// </summary>
    public StaticExtension(
        String   member)
    {
        if (member == null)
        {
            throw new ArgumentNullException("member");
        }
        _member = member;
    }

    /// <summary>
    ///  Return an object that should be set on the targetObject's targetProperty
    ///  for this markup extension.  For a StaticExtension this is a static field
    ///  or property value.
    /// </summary>
    /// <param name="serviceProvider">Object that can provide services for the markup extension.
    /// <returns>
    ///  The object to set on this property.
    /// </returns>
    public Object ProvideValue(IServiceProvider serviceProvider)
    {
        if (_member == null)
        {
            throw new InvalidOperationException(/*SR.Get(SRID.MarkupExtensionStaticMember)*/);
        }

        Object value = null;
        Type type = MemberType;
        String fieldString = null;
        String memberFullName = null;
        if (type != null)
        {
            fieldString = _member;
            memberFullName = type.FullName + "." + _member;
        }
        else
        {
            memberFullName = _member;

            // Validate the _member

            int dotIndex = _member.IndexOf('.');
            if (dotIndex < 0)
            {
                throw new ArgumentException(/*SR.Get(SRID.MarkupExtensionBadStatic, _member)*/);
            }

            // Pull out the type substring (this will include any XML prefix, e.g. "av:Button")

            String typeString = _member.Substring(0, dotIndex);
            if (typeString == String.Empty)
            {
                throw new ArgumentException(/*SR.Get(SRID.MarkupExtensionBadStatic, _member)*/);
            }

            // Get the IXamlTypeResolver from the service provider

            IXamlTypeResolver xamlTypeResolver = serviceProvider.GetService(typeof(IXamlTypeResolver)) as IXamlTypeResolver;
            if (xamlTypeResolver == null)
            {
                throw new ArgumentException(/*SR.Get(SRID.MarkupExtensionNoContext, GetType().Name, "IXamlTypeResolver")*/);
            }

            // Use the type resolver to get a Type instance

            type = xamlTypeResolver.Resolve(typeString);

            // Get the member name substring

            fieldString = _member.Substring(dotIndex + 1, _member.length() - dotIndex - 1);
            if (fieldString == String.Empty)
            {
                throw new ArgumentException(/*SR.Get(SRID.MarkupExtensionBadStatic, _member)*/);
            }
        }

        // Use the built-in parser for enum types

        if (type.IsEnum)
        {
            return Enum.Parse(type, fieldString);
        }

        // For other types, reflect

        boolean found = false;

        Object fieldOrProp = type.GetField(fieldString, BindingFlags.Public |
                         BindingFlags.FlattenHierarchy | BindingFlags.Static);
        if (fieldOrProp == null)
        {
            fieldOrProp = type.GetProperty(fieldString, BindingFlags.Public |
                          BindingFlags.FlattenHierarchy | BindingFlags.Static);
            if (fieldOrProp instanceof PropertyInfo)
            {
                value = ((PropertyInfo)fieldOrProp).GetValue(null,null);
                found = true;
            }
        }
        else if (fieldOrProp instanceof FieldInfo)
        {
            value = ((FieldInfo)fieldOrProp).GetValue(null);
            found = true;
        }

        if (found)
        {
            return value;
        }
        else
        {
            throw new ArgumentException(/*SR.Get(SRID.MarkupExtensionBadStatic, memberFullName)*/);
        }
    }

    /// <summary>
    ///  The static field or property represented by a String.  This String is
    ///  of the format Prefix:ClassName.FieldOrPropertyName.  The Prefix is
    ///  optional, and refers to the XML prefix in a Xaml file.
    /// </summary>
//    [ConstructorArgument("member")]
    public String Member
    {
        get { return _member; }
        set
        {
            if (value == null)
            {
                throw new ArgumentNullException("value");
            }
            _member = value;
        }
    }

    /*internal*/ public Type MemberType
    {
        get { return _memberType; }
        set
        {
            if (value == null)
            {
                throw new ArgumentNullException("value");
            }
            _memberType = value;
        }
    }

    private String _member;
    private Type _memberType;
}
