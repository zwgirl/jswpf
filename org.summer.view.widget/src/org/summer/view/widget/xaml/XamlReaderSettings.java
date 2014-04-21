package org.summer.view.widget.xaml;

import org.summer.view.widget.Uri;
import org.summer.view.widget.reflection.Assembly;

public class XamlReaderSettings
	{
		public XamlReaderSettings ()
		{
		}

		public XamlReaderSettings (XamlReaderSettings settings)
		{
			// null settings is allowed (!)
			XamlReaderSettings s = settings;
			if (s == null)
				return;

			AllowProtectedMembersOnRoot = s.AllowProtectedMembersOnRoot;
			BaseUri = s.BaseUri;
			IgnoreUidsOnPropertyElements = s.IgnoreUidsOnPropertyElements;
			LocalAssembly = s.LocalAssembly;
			ProvideLineInfo = s.ProvideLineInfo;
			ValuesMustBeString = s.ValuesMustBeString;
		}

		public boolean AllowProtectedMembersOnRoot { get; set; }
		public Uri BaseUri { get; set; }
		public boolean IgnoreUidsOnPropertyElements { get; set; }
		public Assembly LocalAssembly { get; set; }
		public boolean ProvideLineInfo { get; set; }
		public boolean ValuesMustBeString { get; set; }
	}