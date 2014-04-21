package org.summer.view.widget.xaml.schema;

import java.beans.EventHandler;
import java.rmi.activation.Activator;

import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.NotSupportedException;
import org.summer.view.widget.Type;
import org.summer.view.widget.collection.IEnumerable;
import org.summer.view.widget.collection.IEnumerator;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.xaml.XamlType;

public class XamlTypeInvoker
	{
		static final XamlTypeInvoker unknown = new XamlTypeInvoker ();
		public static XamlTypeInvoker UnknownInvoker {
			get { return unknown; }
		}

		protected XamlTypeInvoker ()
		{
		}

		public XamlTypeInvoker (XamlType type)
		{
			if (type == null)
				throw new ArgumentNullException ("type");
			this.type = type;
		}

		XamlType type;

		void ThrowIfUnknown ()
		{
			if (type == null || type.UnderlyingType == null)
				throw new NotSupportedException (String.Format ("Current operation is valid only when the underlying type on a XamlType is known, but it is unknown for '{0}'", type));
		}

		public EventHandler<XamlSetMarkupExtensionEventArgs> SetMarkupExtensionHandler {
			get { return type == null ? null : type.SetMarkupExtensionHandler; }
		}

		public EventHandler<XamlSetTypeConverterEventArgs> SetTypeConverterHandler {
			get { return type == null ? null : type.SetTypeConverterHandler; }
		}

		public /*virtual*/ void AddToCollection (Object instance, Object item)
		{
			if (instance == null)
				throw new ArgumentNullException ("instance");
			if (item == null)
				throw new ArgumentNullException ("item");

			Type ct = instance.GetType ();
			var xct = type == null ? null : type.SchemaContext.GetXamlType (ct);
			MethodInfo mi = null;

			// FIXME: this method lookup should be mostly based on GetAddMethod(). At least iface method lookup must be done there.
			if (type != null && type.UnderlyingType != null) {
				if (!xct.IsCollection) // not sure why this check is done only when UnderlyingType exists...
					throw new NotSupportedException (String.Format ("Non-collection type '{0}' does not support this operation", xct));
				if (ct.IsAssignableFrom (type.UnderlyingType))
					mi = GetAddMethod (type.SchemaContext.GetXamlType (item.GetType ()));
			}

			if (mi == null) {
				if (ct.IsGenericType) {
					mi = ct.GetMethod ("Add", ct.GetGenericArguments ());
					if (mi == null)
						mi = LookupAddMethod (ct, typeof (ICollection<>).MakeGenericType (ct.GetGenericArguments ()));
				} else {
					mi = ct.GetMethod ("Add", new Type [] {typeof (Object)});
					if (mi == null)
						mi = LookupAddMethod (ct, typeof (IList));
				}
			}

			if (mi == null)
				throw new InvalidOperationException (String.Format ("The collection type '{0}' does not have 'Add' method", ct));

			mi.Invoke (instance, new Object [] {item});
		}

		public /*virtual*/ void AddToDictionary (Object instance, Object key, Object item)
		{
			if (instance == null)
				throw new ArgumentNullException ("instance");

			Type t = instance.GetType ();
			// FIXME: this likely needs similar method lookup to AddToCollection().

			MethodInfo mi = null;
			if (t.IsGenericType) {
				mi = instance.GetType ().GetMethod ("Add", t.GetGenericArguments ());
				if (mi == null)
					mi = LookupAddMethod (t, typeof (IDictionary<,>).MakeGenericType (t.GetGenericArguments ()));
			} else {
				mi = instance.GetType ().GetMethod ("Add", new Type [] {typeof (Object), typeof (Object)});
				if (mi == null)
					mi = LookupAddMethod (t, typeof (IDictionary));
			}
			mi.Invoke (instance, new Object [] {key, item});
		}

		MethodInfo LookupAddMethod (Type ct, Type iface)
		{
			var map = ct.GetInterfaceMap (iface);
			for (int i = 0; i < map.TargetMethods.Length; i++)
				if (map.InterfaceMethods [i].Name == "Add")
					return map.TargetMethods [i];
			return null;
		}

		public /*virtual*/ Object CreateInstance (Object [] arguments)
		{
			ThrowIfUnknown ();
			return Activator.CreateInstance (type.UnderlyingType, arguments);
		}

		public /*virtual*/ MethodInfo GetAddMethod (XamlType contentType)
		{
			return type == null || type.UnderlyingType == null || type.ItemType == null || type.LookupCollectionKind () == XamlCollectionKind.None ? null : type.UnderlyingType.GetMethod ("Add", new Type [] {contentType.UnderlyingType});
		}

		public /*virtual*/ MethodInfo GetEnumeratorMethod ()
		{
			return type.UnderlyingType == null || type.LookupCollectionKind () == XamlCollectionKind.None ? null : type.UnderlyingType.GetMethod ("GetEnumerator");
		}

		public /*virtual*/ IEnumerator GetItems (Object instance)
		{
			if (instance == null)
				throw new ArgumentNullException ("instance");
			return ((IEnumerable) instance).GetEnumerator ();
		}
	}