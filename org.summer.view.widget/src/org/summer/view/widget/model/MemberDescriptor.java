package org.summer.view.widget.model;

import java.security.KeyStore.Entry.Attribute;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentException;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.ArrayList;
import org.summer.view.widget.collection.Hashtable;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.data.BindingFlags;

/// <devdoc> 
///    <para>
///       Declares an array of attributes for a member and defines
///       the properties and methods that give you access to the attributes in the array.
///       All attributes must derive from <see cref='System.Attribute'/>. 
///    </para>
/// </devdoc> 
//[HostProtection(SharedState = true)] 
//[System.Runtime.InteropServices.ComVisible(true)]
public abstract class MemberDescriptor { 
    private String name;
    private String displayName;
    private int nameHash;
    private AttributeCollection attributeCollection; 
    private Attribute[] attributes;
    private Attribute[] originalAttributes; 
    private boolean attributesFiltered = false; 
    private boolean attributesFilled = false;
    private int metadataVersion; 
    private String category;
    private String description;
    private Object lockCookie = new Object();


    /// <devdoc> 
    ///    <para> 
    ///       Initializes a new instance of the <see cref='System.ComponentModel.MemberDescriptor'/> class with the specified <paramref name="name
    ///       "/> and no 
    ///       attributes.
    ///    </para>
    /// </devdoc>
    protected MemberDescriptor(String name)  { 
    	this(name, null);
    }

    /// <devdoc> 
    ///    <para>
    ///       Initializes a new instance of the <see cref='System.ComponentModel.MemberDescriptor'/> class with the specified <paramref name="name"/> 
    ///       and <paramref name="attributes "/>
    ///       array.
    ///    </para>
    /// </devdoc> 
    protected MemberDescriptor(String name, Attribute[] attributes) {
        try { 
            if (name == null || name.Length == 0) { 
                throw new ArgumentException(SR.GetString(SR.InvalidMemberName));
            } 
            this.name = name;
            this.displayName = name;
            this.nameHash = name.GetHashCode();
            if (attributes != null) { 
                this.attributes = attributes;
                attributesFiltered = false; 
            } 

            this.originalAttributes = this.attributes; 
        }
        catch (Exception t) {
            Debug.Fail(t.ToString());
            throw t; 
        }
    } 

    /// <devdoc>
    ///    <para> 
    ///       Initializes a new instance of the <see cref='System.ComponentModel.MemberDescriptor'/> class with the specified <see cref='System.ComponentModel.MemberDescriptor'/>.
    ///    </para>
    /// </devdoc>
    protected MemberDescriptor(MemberDescriptor descr) { 
        this.name = descr.Name;
        this.displayName = this.name; 
        this.nameHash = name.GetHashCode(); 

        this.attributes = new Attribute[descr.Attributes.Count]; 
        descr.Attributes.CopyTo(this.attributes, 0);

        attributesFiltered = true;

        this.originalAttributes = this.attributes;
    } 

    /// <devdoc>
    ///    <para> 
    ///       Initializes a new instance of the <see cref='System.ComponentModel.MemberDescriptor'/> class with the name in the specified
    ///    <see cref='System.ComponentModel.MemberDescriptor'/> and the attributes
    ///       in both the old <see cref='System.ComponentModel.MemberDescriptor'/> and the <see cref='System.Attribute'/> array.
    ///    </para> 
    /// </devdoc>
    protected MemberDescriptor(MemberDescriptor oldMemberDescriptor, Attribute[] newAttributes) { 
        this.name = oldMemberDescriptor.Name; 
        this.displayName = oldMemberDescriptor.DisplayName;
        this.nameHash = name.GetHashCode(); 

        ArrayList newArray = new ArrayList();

        if (oldMemberDescriptor.Attributes.Count != 0) { 
            foreach (Object o in oldMemberDescriptor.Attributes) {
                newArray.Add(o); 
            } 
        }

        if (newAttributes != null) {
            foreach (Object o in newAttributes) {
                newArray.Add(o);
            } 
        }

        this.attributes = new Attribute[ newArray.Count ]; 
        newArray.CopyTo( this.attributes, 0);
        attributesFiltered = false; 

        this.originalAttributes = this.attributes;
    }

    /// <devdoc>
    ///    <para> 
    ///       Gets or sets an array of 
    ///       attributes.
    ///    </para> 
    /// </devdoc>
    protected /*virtual*/ Attribute[] AttributeArray {
        get {
            CheckAttributesValid(); 
            FilterAttributesIfNeeded();
            return attributes; 
        } 
        set {
            lock(lockCookie) { 
                attributes = value;
                originalAttributes = value;
                attributesFiltered = false;
                attributeCollection = null; 
            }
        } 
    } 

    /// <devdoc> 
    ///    <para>
    ///       Gets the collection of attributes for this member.
    ///    </para>
    /// </devdoc> 
    public /*virtual*/ AttributeCollection Attributes {
        get { 
            CheckAttributesValid(); 
            AttributeCollection attrs = attributeCollection;
            if (attrs == null) { 
                lock(lockCookie) {
                    attrs = CreateAttributeCollection();
                    attributeCollection = attrs;
                } 
            }
            return attrs; 
        } 
    }


    /// <devdoc>
    ///    <para>
    ///       Gets the name of the category that the 
    ///       member
    ///       belongs to, as specified in the <see cref='System.ComponentModel.CategoryAttribute'/>. 
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ String Category { 
        get {
            if (category == null) {
                category = ((CategoryAttribute)Attributes[typeof(CategoryAttribute)]).Category;
            } 
            return category;
        } 
    } 

    /// <devdoc> 
    ///    <para>
    ///       Gets the description of
    ///       the member as specified in the <see cref='System.ComponentModel.DescriptionAttribute'/>.
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ String Description { 
        get { 
            if (description == null) {
                description = ((DescriptionAttribute) Attributes[typeof(DescriptionAttribute)]).Description; 
            }
            return description;
        }
    } 

    /// <devdoc> 
    ///    <para> 
    ///       Gets a value indicating whether the member is browsable as specified in the
    ///    <see cref='System.ComponentModel.BrowsableAttribute'/>. 
    ///    </para>
    /// </devdoc>
    public /*virtual*/ boolean IsBrowsable {
        get { 
            return((BrowsableAttribute)Attributes[typeof(BrowsableAttribute)]).Browsable;
        } 
    } 

    /// <devdoc> 
    ///    <para>
    ///       Gets the
    ///       name of the member.
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ String Name { 
        get { 
            if (name == null) {
                return ""; 
            }
            return name;
        }
    } 

    /// <devdoc> 
    ///    <para> 
    ///       Gets the hash
    ///       code for the name of the member as specified in <see cref='System.String.GetHashCode'/>. 
    ///    </para>
    /// </devdoc>
    protected /*virtual*/ int NameHashCode {
        get { 
            return nameHash;
        } 
    } 

    /// <devdoc> 
    ///    <para>
    ///       Determines whether this member should be set only at
    ///       design time as specified in the <see cref='System.ComponentModel.DesignOnlyAttribute'/>.
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ boolean DesignTimeOnly { 
        get { 
            return(DesignOnlyAttribute.Yes.Equals(Attributes[typeof(DesignOnlyAttribute)]));
        } 
    }

    /// <devdoc>
    ///    <para> 
    ///       Gets the name that can be displayed in a window like a
    ///       properties window. 
    ///    </para> 
    /// </devdoc>
    public /*virtual*/ String DisplayName { 
        get {
            DisplayNameAttribute displayNameAttr = Attributes[typeof(DisplayNameAttribute)] as DisplayNameAttribute;
            if (displayNameAttr == null || displayNameAttr.IsDefaultAttribute()) {
                return displayName; 
            }
            return displayNameAttr.DisplayName; 
        } 
    }

    /// <devdoc>
    ///     Called each time we access the attribtes on
    ///     this member descriptor to give deriving classes
    ///     a chance to change them on the fly. 
    /// </devdoc>
    private void CheckAttributesValid() { 
        if (attributesFiltered) { 
            if (metadataVersion != TypeDescriptor.MetadataVersion) {
                attributesFilled = false; 
                attributesFiltered = false;
                attributeCollection = null;
            }
        } 
    }

    /// <include file='doc\MemberDescriptor.uex' path='docs/doc[@for="MemberDescriptor.CreateAttributeCollection"]/*' /> 
    /// <devdoc>
    ///    <para> 
    ///       Creates a collection of attributes using the
    ///       array of attributes that you passed to the constructor.
    ///    </para>
    /// </devdoc> 
    protected /*virtual*/ AttributeCollection CreateAttributeCollection() {
        return new AttributeCollection(AttributeArray); 
    } 

    /// <devdoc> 
    ///    <para>
    ///       Compares this instance to the specified <see cref='System.ComponentModel.MemberDescriptor'/> to see if they are equivalent.
    ///       NOTE: If you make a change here, you likely need to change GetHashCode() as well.
    ///    </para> 
    /// </devdoc>
    public /*override*/ boolean Equals(Object obj) { 
        if (this == obj) { 
            return true;
        } 
        if (obj == null) {
            return false;
        }

        if (obj.GetType() != GetType()) {
            return false; 
        } 

        MemberDescriptor mdObj = (MemberDescriptor)obj; 
        FilterAttributesIfNeeded();
        mdObj.FilterAttributesIfNeeded();

        if (mdObj.nameHash != nameHash) { 
            return false;
        } 

        if ((mdObj.category == null) != (category == null) ||
            (category != null && !mdObj.category.Equals(category))) { 
            return false;
        }

        if ((mdObj.description == null) != (description == null) || 
            (description != null && !mdObj.category.Equals(description))) {
            return false; 
        } 

        if ((mdObj.attributes == null) != (attributes == null)) { 
            return false;
        }

        boolean sameAttrs = true; 

        if (attributes != null) { 
            if (attributes.Length != mdObj.attributes.Length) { 
                return false;
            } 
            for (int i = 0; i < attributes.Length; i++) {
                if (!attributes[i].Equals(mdObj.attributes[i])) {
                    sameAttrs = false;
                    break; 
                }
            } 
        } 
        return sameAttrs;
    } 

    /// <devdoc>
    ///    <para>
    ///       In an inheriting class, adds the attributes of the inheriting class to the 
    ///       specified list of attributes in the parent class.  For duplicate attributes,
    ///       the last one added to the list will be kept. 
    ///    </para> 
    /// </devdoc>
    protected /*virtual*/ void FillAttributes(IList attributeList) { 
        if (originalAttributes != null) {
            foreach (Attribute attr in originalAttributes) {
                attributeList.Add(attr);
            } 
        }
    } 

    private void FilterAttributesIfNeeded() {
        if (!attributesFiltered) { 
            IList list;

            if (!attributesFilled) {
                list = new ArrayList(); 
                try {
                    FillAttributes(list); 
                } 
                catch (System.Threading.ThreadAbortException) {
                    throw; 
                }
                catch (Exception e) {
                    Debug.Fail(name + ">>" + e.ToString());
                } 
            }
            else { 
                list = new ArrayList(attributes); 
            }

            Hashtable hash = new Hashtable(list.Count);

            foreach (Attribute attr in list) {
                hash[attr.TypeId] = attr; 
            }

            Attribute[] newAttributes = new Attribute[hash.Values.Count]; 
            hash.Values.CopyTo(newAttributes, 0);

            lock(lockCookie) {
                attributes = newAttributes;
                attributesFiltered = true;
                attributesFilled = true; 
                metadataVersion = TypeDescriptor.MetadataVersion;
            } 
        } 
    }

    /// <devdoc>
    ///    <para>
    ///       Finds the given method through reflection.  This method only looks for public methods.
    ///    </para> 
    /// </devdoc>
    protected static MethodInfo FindMethod(Type componentClass, String name, Type[] args, Type returnType) { 
        return FindMethod(componentClass, name, args, returnType, true); 
    }

    /// <devdoc>
    ///    <para>
    ///       Finds the given method through reflection.
    ///    </para> 
    /// </devdoc>
    protected static MethodInfo FindMethod(Type componentClass, String name, Type[] args, Type returnType, boolean publicOnly) { 
        MethodInfo result = null; 

        if (publicOnly) { 
            result = componentClass.GetMethod(name, args);
        }
        else {
            result = componentClass.GetMethod(name, BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic, null, args, null); 
        }
        if (result != null && !result.ReturnType.IsEquivalentTo(returnType)) { 
            result = null; 
        }
        return result; 
    }

    /// <devdoc>
    ///     Try to keep this reasonable in [....] with Equals(). Specifically, 
    ///     if A.Equals(B) returns true, A & B should have the same hash code.
    /// </devdoc> 
    public /*override*/ int GetHashCode() { 
        return nameHash;
    } 

    /// <devdoc>
    ///     This method returns the Object that should be used during invocation of members.
    ///     Normally the return value will be the same as the instance passed in.  If 
    ///     someone associated another Object with this instance, or if the instance is a
    ///     custom type descriptor, GetInvocationTarget may return a different value. 
    /// </devdoc> 
    protected /*virtual*/ Object GetInvocationTarget(Type type, Object instance) {

        if (type == null)
        {
            throw new ArgumentNullException("type");
        } 

        if (instance == null) 
        { 
            throw new ArgumentNullException("instance");
        } 

        return TypeDescriptor.GetAssociation(type, instance);
    }

    /// <devdoc>
    ///    <para> 
    ///       Gets a component site 
    ///       for the given component.
    ///    </para> 
    /// </devdoc>
    protected static ISite GetSite(Object component) {
        if (!(component is IComponent)) {
            return null; 
        }

        return((IComponent)component).Site; 
    }

    /// <devdoc>
    ///    <para>
    ///       Gets
    ///       the component 
    ///       that a method should be invoked on.
    ///    </para> 
    /// </devdoc> 
//    [Obsolete("This method has been deprecated. Use GetInvocationTarget instead.  http://go.microsoft.com/fwlink/?linkid=14202")]
    protected static Object GetInvokee(Type componentClass, Object component) { 

        if (componentClass == null)
        {
            throw new ArgumentNullException("componentClass"); 
        }

        if (component == null) 
        {
            throw new ArgumentNullException("component"); 
        }

        return TypeDescriptor.GetAssociation(componentClass, component);
    } 
}