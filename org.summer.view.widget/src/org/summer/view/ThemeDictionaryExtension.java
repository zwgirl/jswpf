package org.summer.view;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.ArgumentNullException;
import org.summer.view.widget.IServiceProvider;
import org.summer.view.widget.InvalidOperationException;
import org.summer.view.widget.ResourceDictionary;
import org.summer.view.widget.StringComparison;
import org.summer.view.widget.Uri;
import org.summer.view.widget.WeakReference;
import org.summer.view.widget.collection.List;
import org.summer.view.widget.markup.IProvideValueTarget;
import org.summer.view.widget.markup.MarkupExtension;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.window.SystemResources;

/// <summary>
///  ThemeDictionaryExtension allows application authors to customize 
///  control styles based on the current system theme.
/// 
/// </summary> 
//[MarkupExtensionReturnType(typeof(Uri))]
public class ThemeDictionaryExtension extends MarkupExtension 
{
//    #region Constructors

    /// <summary> 
    ///  Constructor that takes no parameters
    /// </summary> 
    public ThemeDictionaryExtension() 
    {
    } 

    /// <summary>
    ///  Constructor that takes the name of the assembly that contains the themed ResourceDictionary.
    /// </summary> 
    public ThemeDictionaryExtension(String assemblyName)
    { 
        if (assemblyName != null) 
        {
            _assemblyName = assemblyName; 
        }
        else
        {
            throw new ArgumentNullException("assemblyName"); 
        }
    } 

//    #endregion

//    #region Public Properties

    /// <summary>
    ///     The name of the assembly that contains the themed ResourceDictionary. 
    /// </summary>
    public String AssemblyName 
    { 
        get { return _assemblyName; }
        set { _assemblyName = value; } 
    }

//    #endregion

//    #region Public Methods

    /// <summary> 
    ///  Return an Object that should be set on the targetObject's targetProperty
    ///  for this markup extension.  For ThemeDictionaryExtension, this is the Uri 
    ///  pointing to theme specific dictionary in the specified assembly by AssemblyName.
    /// </summary>
    /// <param name="serviceProvider">ServiceProvider that can be queried for services.</param>
    /// <returns> 
    ///  The Object to set on this property.
    /// </returns> 
    public /*internal*/ Object ProvideValue(IServiceProvider serviceProvider) 
    {
        if (String.IsNullOrEmpty(AssemblyName)) 
        {
            throw new InvalidOperationException(SR.Get(SRID.ThemeDictionaryExtension_Name));
        }

        IProvideValueTarget provideValueTarget = serviceProvider.GetService(typeof(IProvideValueTarget)) as IProvideValueTarget;
        if( provideValueTarget == null ) 
        { 
            throw new InvalidOperationException(SR.Get(SRID.MarkupExtensionNoContext, GetType().Name, "IProvideValueTarget" ));
        } 

        Object targetObject = provideValueTarget.TargetObject;
        Object targetProperty = provideValueTarget.TargetProperty;

        ResourceDictionary dictionary = targetObject as ResourceDictionary;
        PropertyInfo propertyInfo = targetProperty as PropertyInfo; 

        // Allow targetProperty to be null or ResourceDictionary.Source
        if (dictionary == null || (targetProperty != null && propertyInfo != SourceProperty)) 
        {
            throw new InvalidOperationException(SR.Get(SRID.ThemeDictionaryExtension_Source));
        }

        Register(dictionary, _assemblyName);
        dictionary.IsSourcedFromThemeDictionary = true; 

        return GenerateUri(_assemblyName, SystemResources.ResourceDictionaries.ThemedResourceName, MS.Win32.UxThemeWrapper.ThemeName);
    } 

    // Build the Uri for the assembly:
    // /AssemblyName;Component/themes/<CurrentTheme>.<Color>.xaml
    private static Uri GenerateUri(String assemblyName, String resourceName, String themeName) 
    {
        StringBuilder uri = new StringBuilder(assemblyName.Length + 50); 

        uri.Append("/");
        uri.Append(assemblyName); 

        // If assembly is PresentationFramework, append the Theme name
        if (assemblyName.Equals(SystemResources.PresentationFrameworkName, StringComparison.OrdinalIgnoreCase))
        { 
            uri.Append('.');
            uri.Append(themeName); 
        } 

        uri.Append(";component/"); 
        uri.Append(resourceName);
        uri.Append(".xaml");

        return new System.Uri(uri.ToString(), System.UriKind.RelativeOrAbsolute); 
    }

    /*internal*/ public static Uri GenerateFallbackUri(ResourceDictionary dictionary, String resourceName) 
    {
        for (int i = 0; i < _themeDictionaryInfos.Count; i++) 
        {
            ThemeDictionaryInfo info = _themeDictionaryInfos[i];

            if (!info.DictionaryReference.IsAlive) 
            {
                // Remove from list 
                _themeDictionaryInfos.RemoveAt(i); 
                i--;
                continue; 
            }
            if ((ResourceDictionary)info.DictionaryReference.Target == dictionary)
            {
                String themeName = resourceName.Split('/')[1]; 
                return GenerateUri(info.AssemblyName, resourceName, themeName);
            } 
        } 
        return null;
    } 


//    #endregion

//    #region Data

    private String _assemblyName; 

//    #endregion 

//    #region Static Data

    // Keep track of all dictionaries that have ThemeDictionaryExtensions applied to them 
    // When the theme changes update the Source uri to point to the new theme info

    // This is the ResourceDictionary.Source property info 
    private static PropertyInfo _sourceProperty;

    private static PropertyInfo SourceProperty
    {
        get
        { 
            if (_sourceProperty == null)
            { 
                _sourceProperty = typeof(ResourceDictionary).GetProperty("Source"); 
            }
            return _sourceProperty; 
        }
    }

    private class ThemeDictionaryInfo 
    {
        public WeakReference DictionaryReference; 
        public String AssemblyName; 
    }

    // Store a list of dictionaries and assembly info's.
    // When the theme changes, give the dictionaries a new Source Uri

//    [ThreadStatic] 
    private static List<ThemeDictionaryInfo> _themeDictionaryInfos;

    private static void Register(ResourceDictionary dictionary, String assemblyName) 
    {
        Debug.Assert(dictionary != null, "dictionary should not be null"); 
        Debug.Assert(assemblyName != null, "assemblyName should not be null");

        if (_themeDictionaryInfos == null)
        { 
            _themeDictionaryInfos = new List<ThemeDictionaryInfo>();
        } 
        ThemeDictionaryInfo info; 

        for (int i = 0; i < _themeDictionaryInfos.Count; i++) 
        {
            info = _themeDictionaryInfos[i];

            if (!info.DictionaryReference.IsAlive) 
            {
                // Remove from list 
                _themeDictionaryInfos.RemoveAt(i); 
                i--;
                continue; 
            }

            if (info.DictionaryReference.Target == dictionary)
            { 
                info.AssemblyName = assemblyName;
                return; 
            } 
        }

        // Not present, add to list
        info = new ThemeDictionaryInfo();
        info.DictionaryReference = new WeakReference(dictionary);
        info.AssemblyName = assemblyName; 

        _themeDictionaryInfos.Add(info); 

    }

    /*internal*/ public static void OnThemeChanged()
    {
        // Update all resource dictionaries

        if (_themeDictionaryInfos != null)
        { 
            for (int i = 0; i < _themeDictionaryInfos.Count; i++) 
            {
                ThemeDictionaryInfo info = _themeDictionaryInfos[i]; 

                if (!info.DictionaryReference.IsAlive)
                {
                    // Remove from list 
                    _themeDictionaryInfos.RemoveAt(i);
                    i--; 
                    continue; 
                }

                // Provide the new dictionary URI
                ResourceDictionary dictionary = (ResourceDictionary)info.DictionaryReference.Target;
                dictionary.Source = GenerateUri(info.AssemblyName, SystemResources.ResourceDictionaries.ThemedResourceName, MS.Win32.UxThemeWrapper.ThemeName);
            } 
        }
    } 

//    #endregion
}