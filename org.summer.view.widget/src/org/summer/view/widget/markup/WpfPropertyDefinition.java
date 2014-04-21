package org.summer.view.widget.markup;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.DependencyProperty;
import org.summer.view.widget.Type;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;

// This structure is usedas a generilized property descriptor. 
    // It can have three possible states - DependencyProperty, PropertyInfo, AttachedPropertyGetter/Setter. 
    // PropertyInfo is used for CLR properties, AttachedPropertySetter is used for attached properties.
    // DependencyProperty is used as an optimization for either CLr or Attached property when it is backed by a DP. 
    /*internal*/public class WpfPropertyDefinition
    {
        public WpfPropertyDefinition(BamlRecordReader reader, short attributeId, boolean targetIsDependencyObject)
        { 
            _reader = reader;
            _attributeId = attributeId; 
            _dependencyProperty = null; 
            _attributeInfo = null;
 
            if (_reader.MapTable != null && targetIsDependencyObject)
            {
                _dependencyProperty = _reader.MapTable.GetDependencyProperty(_attributeId);
            } 
        }
 
        public DependencyProperty DependencyProperty 
        {
            get 
            {
                return _dependencyProperty;
            }
        } 

        public BamlAttributeUsage AttributeUsage 
        { 
            get
            { 
                if (_attributeInfo != null)
                {
                    return _attributeInfo.AttributeUsage;
                } 
                else if (_reader.MapTable != null)
                { 
                    short ownerTypeId; 
                    String name;
                    BamlAttributeUsage attributeUsage; 
                    _reader.MapTable.GetAttributeInfoFromId(_attributeId, out ownerTypeId, out name, out attributeUsage);
                    return attributeUsage;
                }
                else 
                {
                    return BamlAttributeUsage.Default; 
                } 
            }
        } 

        public BamlAttributeInfoRecord AttributeInfo
        {
            get 
            {
                if (_attributeInfo == null && _reader.MapTable != null) 
                { 
                    // Either the attribute is not a DP or the record is still needed.
                    // This version of the method makes sure that attributeInfo.OwnerType is calculated. 
                    // In most other cases we ant to avoid unnecessary type allocations.
                    //
                    _attributeInfo = _reader.MapTable.GetAttributeInfoFromIdWithOwnerType(_attributeId);
                    Debug.Assert(_attributeInfo != null); 
                }
                return _attributeInfo; 
            } 
        }
 
        public PropertyInfo PropertyInfo
        {
            get
            { 
                if (this.AttributeInfo == null)
                { 
                    return null; 
                }
 
                if (_attributeInfo.PropInfo == null)
                {
                    //
 

                    Object currentParent = _reader.GetCurrentObjectData(); 
                    Type currentParentType = currentParent.GetType(); 

                    _reader.XamlTypeMapper.UpdateClrPropertyInfo(currentParentType, _attributeInfo); 
                }

                return _attributeInfo.PropInfo;
            } 
        }
 
        public MethodInfo AttachedPropertyGetter 
        {
            get 
            {
                if (this.AttributeInfo == null)
                {
                    return null; 
                }
 
                if (_attributeInfo.AttachedPropertyGetter == null) 
                {
                    _reader.XamlTypeMapper.UpdateAttachedPropertyGetter(_attributeInfo); 
                }

                return _attributeInfo.AttachedPropertyGetter;
            } 
        }
 
        public MethodInfo AttachedPropertySetter 
        {
            get 
            {
                if (this.AttributeInfo == null)
                {
                    return null; 
                }
 
                if (_attributeInfo.AttachedPropertySetter == null) 
                {
                    // Note we update both Setter and Getter in one call; and detect the need of it by Getter==null 
                    //
                    _reader.XamlTypeMapper.UpdateAttachedPropertySetter(_attributeInfo);
                }
 
                return _attributeInfo.AttachedPropertySetter;
            } 
        } 

        public boolean IsInternal 
        {
            get
            {
                if (this.AttributeInfo == null) 
                {
                    return false; 
                } 

                return _attributeInfo.IsInternal; 
            }
        }

        public Type PropertyType 
        {
            get 
            { 
                if (this.DependencyProperty != null)
                { 
                    return this.DependencyProperty.PropertyType;
                }
                else if (this.PropertyInfo != null)
                { 
                    return this.PropertyInfo.PropertyType;
                } 
                else if (this.AttachedPropertySetter != null) 
                {
                    return XamlTypeMapper.GetPropertyType(this.AttachedPropertySetter); 
                }
                else
                {
                    Debug.Assert(this.AttachedPropertyGetter != null); 
                    return this.AttachedPropertyGetter.ReturnType;
                } 
            } 
        }
 
        public String Name
        {
            get
            { 
                if (this.DependencyProperty != null)
                { 
                    return this.DependencyProperty.Name; 
                }
                else if (this.PropertyInfo != null) 
                {
                    return this.PropertyInfo.Name;
                }
                else if (this.AttachedPropertySetter != null) 
                {
                    return this.AttachedPropertySetter.Name.Substring("Set".Length); 
                } 
                else if (this.AttachedPropertyGetter != null)
                { 
                    return this.AttachedPropertyGetter.Name.Substring("Get".Length);
                }
                else
                { 
                    // One of the above should have worked.  If all of them had
                    //  failed, then something has gone wrong.  But we still need 
                    //  to be able to provide *something* because a name is 
                    //  needed for the exception message.
                    if( _attributeInfo != null ) 
                    {
                        return _attributeInfo.Name;
                    }
                    else 
                    {
                        return "<unknown>"; 
                    } 
                }
            } 
        }

        /*internal*/public Object DpOrPiOrMi
        { 
            get
            { 
                return 
                    this.DependencyProperty != null ? (Object)this.DependencyProperty :
                    this.PropertyInfo != null ? (Object)this.PropertyInfo : 
                    (Object)this.AttachedPropertySetter;
            }
        }
 
        private BamlRecordReader _reader;
        private short _attributeId; 
        private BamlAttributeInfoRecord _attributeInfo; 

        // This field is defined when a DP is available for a property. 
        // When DP is defined we do not go after PropertyInfo or AttachedPropertyGetter/Setter
        // unless it was explicitly requested - because of a perf concern.
        private DependencyProperty _dependencyProperty;
    } 