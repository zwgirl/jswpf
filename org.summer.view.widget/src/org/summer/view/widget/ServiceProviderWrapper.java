package org.summer.view.widget;

import org.summer.view.widget.TemplateContent.StackOfFrames;
import org.summer.view.widget.collection.FrugalObjectList;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.markup.IProvideValueTarget;
import org.summer.view.widget.markup.IXamlTypeResolver;
import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.xaml.IXamlNamespaceResolver;
import org.summer.view.widget.xaml.NamespaceDeclaration;
import org.summer.view.widget.xaml.XamlSchemaContext;

/*internal*/public class ServiceProviderWrapper implements ITypeDescriptorContext, IXamlTypeResolver, IXamlNamespaceResolver, IProvideValueTarget
    {
        private IServiceProvider _services;
        /*internal*/ StackOfFrames Frames { get; set; } 
        private XamlSchemaContext _schemaContext;
        private Object _targetObject; 
        private Object _targetProperty; 

        public ServiceProviderWrapper(IServiceProvider services, XamlSchemaContext schemaContext) 
        {
            _services = services;
            _schemaContext = schemaContext;
        } 
//        #region IServiceProvider Members

        public Object /*IServiceProvider.*/GetService(Type serviceType) 
        {
            if (serviceType == typeof(IXamlTypeResolver)) 
            {
                return this;
            }
            else if (serviceType == typeof(IProvideValueTarget)) 
            {
                return this; 
            } 
            else
            { 
                return _services.GetService(serviceType);
            }
        }

//        #endregion

//        #region IXamlTypeResolver Members 

        public Type /*IXamlTypeResolver.*/Resolve(String qualifiedTypeName) 
        {
            return _schemaContext.GetXamlType(XamlTypeName.Parse(qualifiedTypeName, this)).UnderlyingType;
        }

//        #endregion

//        #region IXamlNamespaceResolver Members 

        public String /*IXamlNamespaceResolver.*/GetNamespace(String prefix) 
        {
            FrugalObjectList<NamespaceDeclaration> namespaces = Frames.InScopeNamespaces;
            if (namespaces != null)
            { 
                for (int idx = 0; idx < namespaces.Count; idx++)
                { 
                    if (namespaces[idx].Prefix == prefix) 
                    {
                        return namespaces[idx].Namespace; 
                    }
                }
            }

            return ((IXamlNamespaceResolver)_services.GetService(typeof(IXamlNamespaceResolver))).GetNamespace(prefix);
        } 

        public IEnumerable<NamespaceDeclaration> /*IXamlNamespaceResolver.*/GetNamespacePrefixes()
        { 
            throw new NotImplementedException();
        }

//        #endregion 

//        #region ITypeDescriptorContext Members 

        public IContainer /*ITypeDescriptorContext.*/Container
        { 
            get { return null; }
        }

        public Object /*ITypeDescriptorContext.*/Instance 
        {
            get { return null; } 
        } 

        public void /*ITypeDescriptorContext.*/OnComponentChanged() 
        {
        }

        public boolean /*ITypeDescriptorContext.*/OnComponentChanging() 
        {
            return false; 
        } 

        public PropertyDescriptor /*ITypeDescriptorContext.*/PropertyDescriptor 
        {
            get { return null; }
        }

//        #endregion

        public void SetData(Object targetObject, Object targetProperty) 
        {
            _targetObject = targetObject; 
            _targetProperty = targetProperty;
        }
        public void Clear()
        { 
            _targetObject = null;
            _targetProperty = null; 
        } 
        public Object /*IProvideValueTarget.*/TargetObject { get { return _targetObject; } }
        public Object /*IProvideValueTarget.*/TargetProperty { get { return _targetProperty; } } 
    }