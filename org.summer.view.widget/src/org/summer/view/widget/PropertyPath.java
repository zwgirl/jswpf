package org.summer.view.widget;

import java.util.Collection;

import org.eclipse.osgi.framework.debug.Debug;
import org.summer.view.widget.collection.FrugalObjectList;
import org.summer.view.widget.collection.IList;
import org.summer.view.widget.collection.NotifyCollectionChangedEventArgs;
import org.summer.view.widget.collection.ObservableCollection;
import org.summer.view.widget.data.Binding;
import org.summer.view.widget.data.BindingFlags;
import org.summer.view.widget.data.DataBindEngine;
import org.summer.view.widget.data.DrillIn;
import org.summer.view.widget.data.IndexerParamInfo;
import org.summer.view.widget.data.IndexerParameterInfo;
import org.summer.view.widget.data.PathParser;
import org.summer.view.widget.data.PropertyPathWorker;
import org.summer.view.widget.data.SourceValueInfo;
import org.summer.view.widget.data.SourceValueType;
import org.summer.view.widget.internal.DynamicObjectAccessor;
import org.summer.view.widget.markup.IValueSerializerContext;
import org.summer.view.widget.markup.IXamlTypeResolver;
import org.summer.view.widget.markup.ParserContext;
import org.summer.view.widget.markup.TypeConvertContext;
import org.summer.view.widget.markup.ValueSerializer;
import org.summer.view.widget.markup.XamlReader;
import org.summer.view.widget.model.ITypeDescriptorContext;
import org.summer.view.widget.model.PropertyDescriptor;
import org.summer.view.widget.model.TypeConverter;
import org.summer.view.widget.model.TypeDescriptor;
import org.summer.view.widget.reflection.MethodInfo;
import org.summer.view.widget.reflection.PropertyInfo;
import org.summer.view.widget.threading.Dispatcher;
/*internal*/


//A property path really consists of two parts: a static part (PropertyPath) 
//that describes the path, and a dynamic part (PropertyPathWorker) that knows
//how to evaluate the path, relative to a "root item". 
//
//PropertyPath supports two modes of behavior:
//
//"Source" mode is appropriate when the path describes a "source" - some place
//from which we'll fetch values.  The user of PropertyPath typically creates
//workers explicitly - one for each root item - and calls them directly.  The
//workers are fully dynamic;  they listen for property and currency change 
//events, maintain dependency sources, etc.  The connection between the worker
//and its root item is long-lived.  This mode is used by the Binding class in 
//support of data binding. 
//
//"Target" mode is appropriate when the path describes a "target" - some place 
//into which we'll store values.  The user of PropertyPath typically does not
//create workers, but rather calls the convenience routines in PropertyPath
//(relying on the implicit "single" worker).  The connection between the
//worker and its root item is short-lived;  the caller typically connects to 
//a root item, calls a few methods, then disconnects.  This mode is used by
//the property engine and by animation in support of timeline setters.

/// <summary>
/// Data structure for describing a property as a path below another
/// </summary>
//[TypeConverter(typeof(PropertyPathConverter))] 
public /*sealed*/ class PropertyPath
{ 
    //----------------------------------------------------- 
    //
    //  Constructors 
    //
    //-----------------------------------------------------

    /// <summary> 
    /// Construct a PropertyPath from a String and a list of parameters
    /// </summary> 
    public PropertyPath(String path, /*params*/ Object[] pathParameters) 
    {
        if (/*System.Windows.Threading.*/Dispatcher.CurrentDispatcher == null) 
            throw new InvalidOperationException();  // This is actually never called since CurrentDispatcher will throw if null.

        _path = path;

        if (pathParameters != null && pathParameters.length > 0)
        { 
            // initialize /*internal*/ public pathParameters list 
            PathParameterCollection parameters = new PathParameterCollection(pathParameters);
            SetPathParameterCollection(parameters); 
        }
        PrepareSourceValueInfo(null);
    }

    /// <summary>
    /// Public constructor that takes a single parameter.  This is 
    /// the degenerate PropertyPath (a path of a single step). 
    /// </summary>
    public PropertyPath(Object parameter) 
    {
    	this(SingleStepPath, parameter);
    }

    // This constructor is for use by the PropertyPathConverter
    /*internal*/ public PropertyPath(String path, ITypeDescriptorContext typeDescriptorContext) 
    { 
        _path = path;
        PrepareSourceValueInfo(typeDescriptorContext); 
        NormalizePath();
    }

    //------------------------------------------------------ 
    //
    //  Public properties 
    // 
    //-----------------------------------------------------

    /// <summary> The String describing the path. </summary>
    public String Path
    {
        get { return _path; } 
        set
        { 
            _path = value; 
            PrepareSourceValueInfo(null);
        } 
    }

    /// <summary>
    /// The list of parameters to use when the 
    /// path refers to indexed parameters.
    /// Each parameter in the list should be a DependencyProperty, 
    /// a PropertyInfo, or a PropertyDescriptor. 
    /// </summary>
    public Collection<Object> PathParameters 
    {
        get
        {
            if (_parameters == null) 
            {
                SetPathParameterCollection(new PathParameterCollection()); 
            } 
            return _parameters;
        } 
    }

    //------------------------------------------------------
    // 
    //  Internal properties
    // 
    //------------------------------------------------------ 

    // the number of levels in the path 
    /*internal*/ public int Length { get { return _arySVI.length; } }

    // the status of the PropertyPath
    /*internal*/ public PropertyPathStatus Status { get { return SingleWorker.Status; } } 

    // the most recent error message 
    /*internal*/ public String LastError { get { return _lastError; } } 

    // convenience properties for a frequent special case 
    /*internal*/ public Object LastItem { get { return GetItem(Length - 1); } }
    /*internal*/ public Object LastAccessor { get { return GetAccessor(Length - 1); } }
    /*internal*/ public Object[] LastIndexerArguments { get { return GetIndexerArguments(Length - 1); } }

    // test for static properties
    /*internal*/ public boolean StartsWithStaticProperty { get { return Length > 0 && IsStaticProperty(_earlyBoundPathParts[0]); } } 

    /*internal*/ public static boolean IsStaticProperty(Object accessor)
    { 
        MethodInfo mi;
        DependencyProperty dp;
        PropertyInfo pi;
        PropertyDescriptor pd; 
        DynamicObjectAccessor doa;
        DowncastAccessor(accessor, /*out*/ dp, /*out*/ pi, /*out*/ pd, /*out*/ doa); 

        if (pi != null)
        { 
            mi =  pi.GetGetMethod();
            return mi != null && mi.IsStatic;
        }

        return false;
    } 

    //-----------------------------------------------------
    // 
    //  Internal methods
    //
    //------------------------------------------------------

    // Convert an "accessor" into one of the legal types
    /*internal*/ public static void DowncastAccessor(Object accessor, 
                        /*out*/ DependencyProperty dp, /*out*/ PropertyInfo pi, /*out*/ PropertyDescriptor pd, /*out*/ DynamicObjectAccessor doa) 
    {
        if ((dp = accessor as DependencyProperty) != null) 
        {
            pd = null;
            pi = null;
            doa = null; 
        }
        else if ((pi = accessor as PropertyInfo) != null) 
        { 
            pd = null;
            doa = null; 
        }
        else if ((pd = accessor as PropertyDescriptor) != null)
        {
            doa = null; 
        }
        else 
        { 
            doa = accessor as DynamicObjectAccessor;
        } 
    }

    // Set the context for the path.  Use this method in "target" mode
    // to connect the path to a rootItem for a short time: 
    //      using (path.SetContext(myItem))
    //      { 
    //          ... call target-mode convenience methods ... 
    //      }
    /*internal*/ public IDisposable SetContext(Object rootItem) 
    {
        return SingleWorker.SetContext(rootItem);
    }

    // return the item for level k.  This is the result of evaluating the
    // path up to level k-1, starting at the root item. 
    /*internal*/ public Object GetItem(int k) 
    {
        return SingleWorker.GetItem(k); 
    }

    // return the "accessor" for level k.  This is the Object used to get
    // the value of level k (together with the level-k item).  It can be 
    // a DP, a PropertyInfo, a PropertyDescriptor, etc.
    /*internal*/ public Object GetAccessor(int k) 
    { 
        Object accessor = _earlyBoundPathParts[k];

        if (accessor == null)
        {
            accessor = SingleWorker.GetAccessor(k);
        } 

        return accessor; 
    } 

    // return the arguments to use when the accessor at level k is an 
    // indexer.  (If it's not an indexer, this returns null.)
    /*internal*/ public Object[] GetIndexerArguments(int k)
    {
        return SingleWorker.GetIndexerArguments(k); 
    }

    // return the value of the path.  Must be called within the scope 
    // of SetContext.
    /*internal*/ public Object GetValue() 
    {
        return SingleWorker.RawValue();
    }

    // return the number of unresolved attached properties (called by Binding)
    /*internal*/ public int ComputeUnresolvedAttachedPropertiesInPath() 
    { 
        // the path uses attached properties by the syntax (ClassName.PropName).
        // If there are any such properties in the path, the binding needs the 
        // tree context to resolve the class name.
        int result = 0;

        for (int k=Length-1; k>=0; --k) 
        {
            if (_earlyBoundPathParts[k] == null) 
            { 
                String name = _arySVI[k].name;
                if (IsPropertyReference(name)) 
                {
                    // a dot inside parens, when there's no early-bound accessor,
                    // is an unresolved PD name
                    if (name.IndexOf('.') >= 0) 
                        ++ result;
                } 
            } 
        }

        return result;
    }

    //----------------------------------------------------- 
    //
    //  Internal properties and methods for use by PropertyPathWorker only 
    // 
    //-----------------------------------------------------

    /*internal*/ public SourceValueInfo[] SVI
    {
        get
        { 
            //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
            return _arySVI; 
        } 
    }

    /*internal*/ public Object ResolvePropertyName(int level, Object item, Type ownerType, Object context)
    {
        //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));

        // if user told us explicitly what to use, use it
        Object accessor = _earlyBoundPathParts[level]; 

        if (accessor == null)
        { 
            accessor = ResolvePropertyName(_arySVI[level].name, item, ownerType, context, false);
        }

        return accessor; 
    }

    /*internal*/ public IndexerParameterInfo[] ResolveIndexerParams(int level, Object context) 
    {
        IndexerParameterInfo[] parameters = _earlyBoundPathParts[level] as IndexerParameterInfo[]; 

        if (parameters == null)
        {
            parameters = ResolveIndexerParams(_arySVI[level].paramList, context, false); 
        }

        return parameters; 
    }

    // PropertyPathWorker may choose to replace an indexer by a property
    /*internal*/ public void ReplaceIndexerByProperty(int level, String name)
    {
        _arySVI[level].name = name; 
        _arySVI[level].propertyName = name;
        _arySVI[level].type = SourceValueType.Property; 

        _earlyBoundPathParts[level] = null;
    } 

    //-----------------------------------------------------
    //
    //  Private properties 
    //
    //------------------------------------------------------ 

    PropertyPathWorker SingleWorker
    { 
        get
        {
            if (_singleWorker == null)
                _singleWorker = new PropertyPathWorker(this); 
            return _singleWorker;
        } 
    } 

    //----------------------------------------------------- 
    //
    //  Private methods
    //
    //------------------------------------------------------ 

    // parse the path to figure out what kind of 
    // SourceValueInfo we're going to need 
    private void PrepareSourceValueInfo(ITypeDescriptorContext typeDescriptorContext)
    { 
        PathParser parser = DataBindEngine.CurrentDataBindEngine.PathParser;
        _arySVI = parser.Parse(Path);

        if (_arySVI.length == 0) 
        {
            String detail = parser.Error; 
            if (detail == null) 
                detail = Path;
            throw new InvalidOperationException(/*SR.Get(SRID.PropertyPathSyntaxError, detail)*/); 
        }

        ResolvePathParts(typeDescriptorContext);
    } 

    // "normalize" the path - i.e. load the PathParameters with the early-bound 
    // accessors, and replace the corresponding parts of the path with 
    // parameter references
    private void NormalizePath() 
    {
        StringBuilder builder = new StringBuilder();
        PathParameterCollection parameters = new PathParameterCollection();

        for (int i=0; i<_arySVI.length; ++i)
        { 
            switch (_arySVI[i].drillIn) 
            {
                case /*DrillIn.*/Always: 
                    builder.Append('/');
                    break;

                case /*DrillIn.*/Never: 
                    if (_arySVI[i].type == SourceValueType.Property)
                    { 
                        builder.Append('.'); 
                    }
                    break; 

                case /*DrillIn.*/IfNeeded:
                    break;
            } 

            switch (_arySVI[i].type) 
            { 
                case /*SourceValueType.*/Property:
                    if (_earlyBoundPathParts[i] != null) 
                    {
                        builder.Append('(');
                        builder.Append(parameters.Count.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
                        builder.Append(')'); 

                        parameters.Add(_earlyBoundPathParts[i]); 
                    } 
                    else
                    { 
                        builder.Append(_arySVI[i].name);
                    }
                    break;

                case /*SourceValueType.*/Indexer:
                    builder.Append('['); 
                    if (_earlyBoundPathParts[i] != null) 
                    {
                        IndexerParameterInfo[] aryIPI = (IndexerParameterInfo[])_earlyBoundPathParts[i]; 
                        // the params should be at the very least a single empty String
//                        Debug.Assert(aryIPI.length > 0);
                        int j = 0;
                        while (true) 
                        {
                            IndexerParameterInfo info = aryIPI[j]; 
                            if (info.type != null) 
                            {
                                builder.Append('('); 
                                builder.Append(parameters.Count.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
                                builder.Append(')');

                                parameters.Add(info.value); 
                            }
                            else 
                            { 
                                builder.Append(info.value);
                            } 
                            ++j;

                            if (j < aryIPI.length)
                            { 
                                builder.Append(',');
                            } 
                            else 
                            {
                                break; 
                            }
                        }
                    }
                    else 
                    {
                        builder.Append(_arySVI[i].name); 
                    } 
                    builder.Append(']');
                    break; 

                case /*SourceValueType.*/Direct:
                    break;
            } 

        } 

        if (parameters.Count > 0)
        { 
            _path = builder.ToString();
            SetPathParameterCollection(parameters);
        }
    } 

    // set new parameter collection; update collection change notification handler 
    private void SetPathParameterCollection(PathParameterCollection parameters) 
    {
        if (_parameters != null) 
        {
            _parameters.CollectionChanged -= new NotifyCollectionChangedEventHandler(ParameterCollectionChanged);
        }
        _parameters = parameters; 
        if (_parameters != null)
        { 
            _parameters.CollectionChanged += new NotifyCollectionChangedEventHandler(ParameterCollectionChanged); 
        }
    } 

    // path parameters were added/removed, update SourceValueInfo
    private void ParameterCollectionChanged(Object sender, NotifyCollectionChangedEventArgs e)
    { 
        PrepareSourceValueInfo(null);
    } 


    // resolve the property names and path parameters early, if possible 
    void ResolvePathParts(ITypeDescriptorContext typeDescriptorContext)
    {
        boolean throwOnError = (typeDescriptorContext != null);

        Object context = null;

        TypeConvertContext typeConvertContext = typeDescriptorContext as TypeConvertContext; 
        if( typeConvertContext != null )
            context = typeConvertContext.ParserContext; 

        if (context == null)
            context = typeDescriptorContext;
        _earlyBoundPathParts = new Object[Length]; 

        for (int level=Length-1; level>=0; --level) 
        { 
            if (_arySVI[level].type == SourceValueType.Property)
            { 
                String name = _arySVI[level].name;
                if (IsPropertyReference(name))
                {
                    Object accessor = ResolvePropertyName(name, null, null, context, throwOnError); 
                    _earlyBoundPathParts[level] = accessor;

                    if (accessor != null) 
                    {
                        _arySVI[level].propertyName = GetPropertyName(accessor); 
                    }
                }
                else
                { 
                    _arySVI[level].propertyName = name;
                } 
            } 
            else if (_arySVI[level].type == SourceValueType.Indexer)
            { 
                IndexerParameterInfo[] indexerParams = ResolveIndexerParams(_arySVI[level].paramList, context, throwOnError);
                _earlyBoundPathParts[level] = indexerParams;
                _arySVI[level].propertyName = Binding.IndexerName;
            } 
        }
    } 

    // resolve a single DP name
    Object ResolvePropertyName(String name, Object item, Type ownerType, Object context, boolean throwOnError) 
    {
        String propertyName = name;
        int index;

        // first see if the name is an index into the parameter list
        if (IsParameterIndex(name, /*out*/ index)) 
        { 
            if (0 <= index && index < PathParameters.Count)
            { 
                Object accessor = PathParameters[index];
                // always throw if the accessor isn't valid - this error cannot
                // be corrected later on.
                if (!IsValidAccessor(accessor)) 
                    throw new InvalidOperationException(/*SR.Get(SRID.PropertyPathInvalidAccessor,
                                (accessor != null) ? accessor.GetType().FullName : "null")*/); 

                return accessor;
            } 
            else if (throwOnError)
                throw new InvalidOperationException(/*SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count)*/);
            else return null;
        } 

        // handle attached-property syntax:  (TypeName.PropertyName) 
        if (IsPropertyReference(name)) 
        {
            name = name.substring(1, name.length()-2); 

            int lastIndex = name.lastIndexOf('.');
            if (lastIndex >= 0)
            { 
                // attached property - get the owner type
                propertyName = name.substring(lastIndex + 1).trim(); 
                String ownerName = name.substring(0, lastIndex).trim(); 
                ownerType = GetTypeFromName(ownerName, context);
                if (ownerType == null && throwOnError) 
                    throw new InvalidOperationException(/*SR.Get(SRID.PropertyPathNoOwnerType, ownerName)*/);
            }
            else
            { 
                // simple name in parens - just strip the parens
                propertyName = name; 
            } 
        }

        if (ownerType != null)
        {
            // get an appropriate accessor from the ownerType and propertyName.
            // We prefer accessors in a certain order, defined below. 
            Object accessor;

            // 1. DependencyProperty on the given type. 
            accessor = DependencyProperty.FromName(propertyName, ownerType);

            // 2. PropertyDescriptor from item's custom lookup.
            // When the item implements custom properties, we must use them.
            if (accessor == null && item instanceof ICustomTypeDescriptor)
            { 
                accessor = TypeDescriptor.GetProperties(item)[propertyName];
            } 

            // 3a. PropertyInfo, when item exposes INotifyPropertyChanged.
            // 3b. PropertyInfo, when item is a DependencyObject (bug 1373351). 
            // This uses less working set than PropertyDescriptor, and we don't need
            // the ValueChanged pattern.  (If item is a DO and wants to raise
            // change notifications, it should make the property a DP.)
            if (accessor == null && 
                (item instanceof INotifyPropertyChanged || item instanceof DependencyObject))
            { 
                accessor = GetPropertyHelper(ownerType, propertyName); 
            }

            // 4. PropertyDescriptor (obtain from item - this is reputedly
            // slower than obtaining from type, but the latter doesn't
            // discover properties obtained from TypeDescriptorProvider -
            // see bug 1713000). 
            // This supports the [....] ValueChanged pattern.
            if (accessor == null && item != null) 
            { 
                accessor = TypeDescriptor.GetProperties(item)[propertyName];
            } 

            // 5. PropertyInfo.
            if (accessor == null)
            { 
                accessor = GetPropertyHelper(ownerType, propertyName);
            } 

            // 6. IDynamicMetaObjectProvider
            // This supports the DLR's dynamic objects 
            if (accessor == null && SystemCoreHelper.IsIDynamicMetaObjectProvider(item))
            {
                accessor = SystemCoreHelper.NewDynamicPropertyAccessor(item.GetType(), propertyName);
            } 

            if (accessor == null && throwOnError) 
                throw new InvalidOperationException(/*SR.Get(SRID.PropertyPathNoProperty, ownerType.Name, propertyName)*/); 

            return accessor; 
        }

        return null;
    } 

    private PropertyInfo GetPropertyHelper(Type ownerType, String propertyName) 
    { 
        PropertyInfo result = null;
        boolean enumerateBaseClasses = false; 
        boolean returnIndexerProperty = false;

        try
        { 
            result = ownerType.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.FlattenHierarchy);
        } 
        catch (AmbiguousMatchException ex) 
        {
            // this happens when ownerType hides a base class property with 'new' 
            // (it also happens by mistake when a non-generic class overrides
            // a generic base class property - see DDB 105201).
            // We'll resolve this by returning the most specific property.
            enumerateBaseClasses = true; 
        }

        if (enumerateBaseClasses) 
        {
            try 
            {
                for (result = null;  result == null && ownerType != null;  ownerType = ownerType.BaseType)
                {
                    result = ownerType.GetProperty(propertyName, BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public); 
                }
            } 
            catch (AmbiguousMatchException e) 
            {
                // if a single class declares the property twice, it must be 
                // an indexed property (with different index parameters)
                returnIndexerProperty = true;
            }
        } 

        if (PropertyPathWorker.IsIndexedProperty(result)) 
        { 
            // the property is indexed (this can't happen in C#, but can in VB)
            returnIndexerProperty = true; 
        }

        if (returnIndexerProperty)
        { 
            result = IndexerPropertyInfo.Instance;
        } 

        return result;
    } 

    // resolve indexer parameters
    IndexerParameterInfo[] ResolveIndexerParams(FrugalObjectList<IndexerParamInfo> paramList, Object context, boolean throwOnError)
    { 
        IndexerParameterInfo[] args = new IndexerParameterInfo[paramList.Count];
        for (int i = 0; i < args.length; ++i) 
        { 
            if (String.IsNullOrEmpty(paramList[i].parenString))
            { 
                // no paren String "foo" - value is (uninterpreted) value String
                args[i].value = paramList[i].valueString;
            }
            else if (String.IsNullOrEmpty(paramList[i].valueString)) 
            {
                // no value String "(2)" - value comes from PathParameter list 
                int index; 
                if (Int32.TryParse( paramList[i].parenString.Trim(),
                                    NumberStyles.Integer, 
                                    TypeConverterHelper.InvariantEnglishUS.NumberFormat,
                                    /*out*/ index))
                {
                    if (0 <= index && index < PathParameters.Count) 
                    {
                        Object value = PathParameters[index]; 
                        if (value != null) 
                        {
                            args[i].value = value; 
                            args[i].type = value.GetType();
                        }
                        else if (throwOnError)
                        { 
                            // info.value will still be "(n)"
                            throw new InvalidOperationException(/*SR.Get(SRID.PathParameterIsNull, index)*/); 
                        } 
                    }
                    else if (throwOnError) 
                        throw new InvalidOperationException(/*SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count)*/);
                }
                else
                { 
                    // parens didn't hold an integer "(abc)" - value is (uninterpreted) paren String
                    // [this could be considered an error, but the original code 
                    // treated it like this, so to preserve compatibility...] 
                    args[i].value = "(" + paramList[i].parenString + ")";
                } 
            }
            else
            {
                // both strings appear "(Double)3.14159" - value is type-converted from value String 
                args[i].type = GetTypeFromName(paramList[i].parenString, context);
                if (args[i].type != null) 
                { 
                    Object value = GetTypedParamValue(paramList[i].valueString.Trim(), args[i].type, throwOnError);
                    if (value != null) 
                    {
                        args[i].value = value;
                    }
                    else 
                    {
                        if (throwOnError) 
                            throw new InvalidOperationException(/*SR.Get(SRID.PropertyPathIndexWrongType, paramList[i].parenString, paramList[i].valueString)*/); 
                        args[i].type = null;
                    } 
                }
                else
                {
                    // parens didn't hold a type name "(abc)xyz" - value is (uninterpreted) String 
                    // [this could be considered an error, but the original code
                    // treated it like this, so to preserve compatibility...] 
                    args[i].value = "(" + paramList[i].parenString + ")" + paramList[i].valueString; 
                }
            } 
        }
        return args;
    }

    Object GetTypedParamValue(String param, Type type, boolean throwOnError)
    { 
        Object value = null; 
        if (type == typeof(String))
            return param; 

        TypeConverter tc = TypeDescriptor.GetConverter(type);

        if (tc != null && tc.CanConvertFrom(typeof(String))) 
        {
            // PreSharp uses message numbers that the C# compiler doesn't know about. 
            // Disable the C# complaints, per the PreSharp documentation. 
//            #pragma warning disable 1634, 1691

            // PreSharp complains about catching NullReference (and other) exceptions.
            // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//            #pragma warning disable 56500

            try
            { 
                value = tc.ConvertFromString(null, CultureInfo.InvariantCulture, 
                                                param);
                // technically the converter can return null as a legitimate 
                // value.  In practice, this seems always to be a sign that
                // the conversion didn't work (often because the converter
                // reverts to the default behavior - returning null).  So
                // we treat null as an "error", and keep trying for something 
                // better.  (See bug 861966)
            } 
            // catch all exceptions.  We simply want to move on to the next 
            // candidate indexer.
            catch (Exception ex) 
            {
                if (CriticalExceptions.IsCriticalApplicationException(ex) || throwOnError)
                    throw ex;
            } 
            catch
            { 
                if (throwOnError) 
                    throw;
            } 

//            #pragma warning restore 56500
//            #pragma warning restore 1634, 1691
        } 

        if (value == null && type.IsAssignableFrom(typeof(String))) 
        { 
            value = param;
        } 
        return value;
    }


    // Return the type named by the given name
    Type GetTypeFromName(String name, Object context) 
    { 
        // use the parser context, if available.  This allows early resolution.
        // [....] 5/8/2009 - I believe with System.Xaml there is never an old parserContext here. 
        // But cannot be sure.
        ParserContext parserContext = context as ParserContext;
        if (parserContext != null)
        { 
            // Find the namespace prefix
            String nsPrefix; 
            int nsIndex = name.IndexOf(':'); 
            if (nsIndex == -1)
                nsPrefix = String.Empty; 
            else
            {
                // Found a namespace prefix separator, so create replacement _pathString.
                // String processing - split "foons" from "BarClass.BazProp" 
                nsPrefix = name.substring(0, nsIndex).TrimEnd();
                name = name.substring(nsIndex + 1).TrimStart(); 
            } 

            // Find the namespace URI, even if its the default one 
            String namespaceURI = parserContext.XmlnsDictionary[nsPrefix];
            if (namespaceURI == null)
            {
                throw new ArgumentException(SR.Get(SRID.ParserPrefixNSProperty, nsPrefix, name)); 
            }

            TypeAndSerializer typeAndSerializer = parserContext.XamlTypeMapper.GetTypeOnly(namespaceURI, name); 

            return (typeAndSerializer != null) ? typeAndSerializer.ObjectType : null; 
        }

        else
        { 
            if (context instanceof IServiceProvider)
            { 

                IXamlTypeResolver xtr = (context as IServiceProvider).GetService(typeof(IXamlTypeResolver)) as IXamlTypeResolver;

                if (xtr != null)
                {
                    return xtr.Resolve(name);
                } 
            }

            IValueSerializerContext serializerContext = context as IValueSerializerContext; 
            if (serializerContext != null)
            { 
                ValueSerializer typeSerializer = ValueSerializer.GetSerializerFor(typeof(Type), serializerContext);
                if (typeSerializer != null)
                    return typeSerializer.ConvertFromString(name, serializerContext) as Type;
            } 
        }

        // if there's no parser or serializer context, use the tree context 
        DependencyObject hostElement = context as DependencyObject;
        if (hostElement == null) 
        {
            hostElement = new DependencyObject();   // at least pick up the default namespaces
        }

        WpfSharedBamlSchemaContext wpfSharedSchemaContext = XamlReader.BamlSharedSchemaContext;
        Type type = wpfSharedSchemaContext.ResolvePrefixedNameWithAdditionalWpfSemantics(name, hostElement); 
        return type; 
    }

    // return true if the name has the form:  (property)
    /*internal*/ public static boolean IsPropertyReference(String name)
    {
        return (name != null && name.length() > 1 && name[0] == '(' && (name[name.length() - 1] == ')')); 
    }

    // return true if the name has the form:  (nnn) 
    /*internal*/ public static boolean IsParameterIndex(String name, /*out*/ int index)
    { 
        if (IsPropertyReference(name))
        {
            name = name.substring(1, name.length() - 2);
        } 
        else
        { 
            index = -1; 
            return false;
        } 

        return Int32.TryParse( name,
                            NumberStyles.Integer,
                            TypeConverterHelper.InvariantEnglishUS.NumberFormat, 
                            /*out*/ index);
    } 

    // determine if an Object is one of the accessors we support
    static boolean IsValidAccessor(Object accessor) 
    {
        return  accessor instanceof DependencyProperty ||
                accessor instanceof PropertyInfo  ||
                accessor instanceof PropertyDescriptor || 
                accessor instanceof DynamicObjectAccessor;
    } 

    // determine the name of an accessor
    static String GetPropertyName(Object accessor) 
    {
        DependencyProperty dp;
        PropertyInfo pi;
        PropertyDescriptor pd; 
        DynamicObjectAccessor doa;

        if ((dp = accessor as DependencyProperty) != null) 
            return dp.Name;
        else if ((pi = accessor as PropertyInfo) != null) 
            return pi.Name;
        else if ((pd = accessor as PropertyDescriptor) != null)
            return pd.Name;
        else if ((doa = accessor as DynamicObjectAccessor) != null) 
            return doa.PropertyName;
        else 
        { 
//            Invariant.Assert(false, "Unknown accessor type");
            return null; 
        }
    }

    //------------------------------------------------------ 
    //
    //  Private Enums, Structs, Constants 
    // 
    //-----------------------------------------------------

    /*const*/static final String SingleStepPath = "(0)";
    static final Char[] s_comma = new Char[]{','};

    //------------------------------------------------------ 
    //
    //  Private data 
    // 
    //-----------------------------------------------------

    String _path = String.Empty;        // the path
    PathParameterCollection _parameters; // list of DPs to inject into the path

    SourceValueInfo[] _arySVI;          // static description of each level in the path 
    String _lastError = String.Empty;   // most recent error message
    Object[] _earlyBoundPathParts;      // accessors and indexer parameters that got resolved early 
    PropertyPathWorker _singleWorker;   // shared worker - used in "target" mode 

    //----------------------------------------------------- 
    //
    //  Private types
    //
    //----------------------------------------------------- 
    private class PathParameterCollection extends ObservableCollection<Object>
    { 
        public PathParameterCollection() 
        {
        } 

        public PathParameterCollection(Object[] parameters)
        {
            IList<Object> items = Items; 
            for/*each*/ (Object o : parameters)
            { 
                items.Add(o); 
            }
        } 
    }
}