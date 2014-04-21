package org.summer.view.widget.xaml;

import java.beans.EventHandler;

import org.summer.view.widget.markup.INameScope;
import org.summer.view.widget.markup.XamlSetValueEventArgs;

public class XamlObjectWriterSettings extends XamlWriterSettings
	{
		public XamlObjectWriterSettings ()
		{
		}

		public XamlObjectWriterSettings (XamlObjectWriterSettings settings)
		{
			super (settings);
			XamlObjectWriterSettings s = settings;
//#if !NET_2_1
//			AccessLevel = s.AccessLevel;
//#endif
			AfterBeginInitHandler = s.AfterBeginInitHandler;
			AfterEndInitHandler = s.AfterEndInitHandler;
			AfterPropertiesHandler = s.AfterPropertiesHandler;
			BeforePropertiesHandler = s.BeforePropertiesHandler;
			ExternalNameScope = s.ExternalNameScope;
			IgnoreCanConvert = s.IgnoreCanConvert;
			PreferUnconvertedDictionaryKeys = s.PreferUnconvertedDictionaryKeys;
			RegisterNamesOnExternalNamescope = s.RegisterNamesOnExternalNamescope;
			RootObjectInstance = s.RootObjectInstance;
			SkipDuplicatePropertyCheck = s.SkipDuplicatePropertyCheck;
			SkipProvideValueOnRoot = s.SkipProvideValueOnRoot;
			XamlSetValueHandler = s.XamlSetValueHandler;
		}

		public EventHandler<XamlObjectEventArgs> AfterBeginInitHandler { get; set; }
		public EventHandler<XamlObjectEventArgs> AfterEndInitHandler { get; set; }
		public EventHandler<XamlObjectEventArgs> AfterPropertiesHandler { get; set; }
		public EventHandler<XamlObjectEventArgs> BeforePropertiesHandler { get; set; }
		public EventHandler<XamlSetValueEventArgs> XamlSetValueHandler { get; set; }

//#if !NET_2_1
//		[MonoTODO ("Ignored")]
//		public XamlAccessLevel AccessLevel { get; set; }
//#endif

		public INameScope ExternalNameScope { get; set; }
//		[MonoTODO ("Ignored")]
		public boolean IgnoreCanConvert { get; set; }
//		[MonoTODO ("Ignored")]
		public boolean PreferUnconvertedDictionaryKeys { get; set; }

		public boolean RegisterNamesOnExternalNamescope { get; set; }

		public Object RootObjectInstance { get; set; }
//		[MonoTODO ("Ignored")]
		public boolean SkipDuplicatePropertyCheck { get; set; }
//		[MonoTODO ("Ignored")]
		public boolean SkipProvideValueOnRoot { get; set; }
	}