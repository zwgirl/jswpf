/**
 * PropertyPath
 */
// A property path really consists of two parts: a static part (PropertyPath) 
// that describes the path, and a dynamic part (PropertyPathWorker) that knows
// how to evaluate the path, relative to a "root item". 
// 
// PropertyPath supports two modes of behavior:
// 
// "Source" mode is appropriate when the path describes a "source" - some place
// from which we'll fetch values.  The user of PropertyPath typically creates
// workers explicitly - one for each root item - and calls them directly.  The
// workers are fully dynamic;  they listen for property and currency change 
// events, maintain dependency sources, etc.  The connection between the worker
// and its root item is long-lived.  This mode is used by the Binding class in 
// support of data binding. 
//
// "Target" mode is appropriate when the path describes a "target" - some place 
// into which we'll store values.  The user of PropertyPath typically does not
// create workers, but rather calls the convenience routines in PropertyPath
// (relying on the implicit "single" worker).  The connection between the
// worker and its root item is short-lived;  the caller typically connects to 
// a root item, calls a few methods, then disconnects.  This mode is used by
// the property engine and by animation in support of timeline setters. 

define(["dojo/_base/declare", "system/Type", "objectmodel/ObservableCollection",
        "internal.data/DataBindEngine", "internal.data/SourceValueType", "windows/DependencyProperty",
        "componentmodel/ICustomTypeDescriptor", "internal.data/PropertyPathWorker",
        "reflection/IndexerPropertyInfo", "specialized/NotifyCollectionChangedEventHandler"], 
		function(declare, Type, ObservableCollection,
				DataBindEngine, SourceValueType, DependencyProperty,
				ICustomTypeDescriptor, PropertyPathWorker,
				IndexerPropertyInfo, NotifyCollectionChangedEventHandler){
	
	
	var PathParameterCollection = declare("PathParameterCollection", ObservableCollection,{
		constructor:function(/*object[]*/ parameters ){
			ObservableCollection.prototype.constructor.call(this);
            /*IList<object>*/
			var items = this.Items; 
            for (var index in parameters)
            { 
                items.Add(parameters[index]); 
            }
		}
	});

	PathParameterCollection.Type = new Type("PathParameterCollection", PathParameterCollection, [ObservableCollection.Type]);
	
//  const string
    SingleStepPath = "(0)";
//    static readonly Char[] 
    s_comma = ','; //new Char[]{','};
    
	var PropertyPath = declare("PropertyPath", null,{
		constructor:function( /*string*/ path /*, params object[]*/ /*pathParameters*/) 
        {
//            if (System.Windows.Threading.Dispatcher.CurrentDispatcher == null) 
//                throw new InvalidOperationException();  // This is actually never called since CurrentDispatcher will throw if null.
			if(arguments.length == 1){
				if(typeof(path) == "string"){
		            this._path = path;
				}else {
					this._path = SingleStepPath;
//					this.constructor(SingleStepPath, path);
					var parameters = new PathParameterCollection([path]);
	                this.SetPathParameterCollection(parameters); 
				}
			}
 
			if(arguments.length >= 2){
				pathParameters = [];
				for(var i=0; i<arguments.length; i++){
					pathParameters[i] = arguments[i+1];
				}
                // initialize internal pathParameters list 
                var parameters = new PathParameterCollection(pathParameters);
                this.SetPathParameterCollection(parameters); 
			}
            
            this.PrepareSourceValueInfo(null);
		},
		
//		/// <summary> 
//		/// Construct a PropertyPath from a string and a list of parameters
//		/// </summary> 
//		public PropertyPath(string path, params object[] pathParameters) 
//		{
//		    if (System.Windows.Threading.Dispatcher.CurrentDispatcher == null) 
//		        throw new InvalidOperationException();  // This is actually never called since CurrentDispatcher will throw if null.
//
//		    _path = path;
//
//		    if (pathParameters != null && pathParameters.Length > 0)
//		    { 
//		        // initialize internal pathParameters list 
//		        PathParameterCollection parameters = new PathParameterCollection(pathParameters);
//		        SetPathParameterCollection(parameters); 
//		    }
//		    PrepareSourceValueInfo(null);
//		}
//
//		/// <summary>
//		/// Public constructor that takes a single parameter.  This is 
//		/// the degenerate PropertyPath (a path of a single step). 
//		/// </summary>
//		public PropertyPath(object parameter) 
//		    : this(SingleStepPath, parameter)
//		{
//		}
//
//		// This constructor is for use by the PropertyPathConverter
//		internal PropertyPath(string path, ITypeDescriptorContext typeDescriptorContext) 
//		{ 
//		    _path = path;
//		    PrepareSourceValueInfo(typeDescriptorContext); 
//		    NormalizePath();
//		} 
 
        // Set the context for the path.  Use this method in "target" mode
        // to connect the path to a rootItem for a short time: 
        //      using (path.SetContext(myItem))
        //      { 
        //          ... call target-mode convenience methods ... 
        //      }
        /*internal IDisposable */
        SetContext:function(/*object*/ rootItem) 
        {
            return SingleWorker.SetContext(rootItem);
        },
 
        // return the item for level k.  This is the result of evaluating the
        // path up to level k-1, starting at the root item. 
        /*internal object */
        GetItem:function(/*int*/ k) 
        {
            return SingleWorker.GetItem(k); 
        },

        // return the "accessor" for level k.  This is the object used to get
        // the value of level k (together with the level-k item).  It can be 
        // a DP, a PropertyInfo, a PropertyDescriptor, etc.
        /*internal object */
        GetAccessor:function(/*int*/ k) 
        { 
            /*object*/var accessor = this._earlyBoundPathParts[k];
 
            if (accessor == null)
            {
                accessor = SingleWorker.GetAccessor(k);
            } 

            return accessor; 
        }, 

        // return the arguments to use when the accessor at level k is an 
        // indexer.  (If it's not an indexer, this returns null.)
        /*internal object[] */
        GetIndexerArguments:function(/*int*/ k)
        {
            return SingleWorker.GetIndexerArguments(k); 
        },
 
        // return the value of the path.  Must be called within the scope 
        // of SetContext.
        /*internal object */
        GetValue:function() 
        {
            return SingleWorker.RawValue();
        },
 
        // return the number of unresolved attached properties (called by Binding)
        /*internal int */
        ComputeUnresolvedAttachedPropertiesInPath:function() 
        { 
            // the path uses attached properties by the syntax (ClassName.PropName).
            // If there are any such properties in the path, the binding needs the 
            // tree context to resolve the class name.
            var result = 0;

            for (var k=this.Length-1; k>=0; --k) 
            {
                if (this._earlyBoundPathParts[k] == null) 
                { 
                    var name = this._arySVI[k].name;
                    if (PropertyPath.IsPropertyReference(name)) 
                    {
                        // a dot inside parens, when there's no early-bound accessor,
                        // is an unresolved PD name
                        if (name.indexOf('.') >= 0) 
                            ++ result;
                    } 
                } 
            }
 
            return result;
        },
 
        /*internal IndexerParameterInfo[] */
        ResolveIndexerParams:function(/*int*/ level, /*object*/ context) 
        {
            /*IndexerParameterInfo[]*/
        	var parameters = this._earlyBoundPathParts[level]; 
        	parameters = parameters instanceof Array ? parameters : null; // IndexerParameterInfo[]; 

            if (parameters == null)
            {
                parameters = this.ResolveIndexerParams(this._arySVI[level].paramList, context, false); 
            }
 
            return parameters; 
        },
 
        // PropertyPathWorker may choose to replace an indexer by a property
        /*internal void*/ 
        ReplaceIndexerByProperty:function(/*int*/ level, /*string*/ name)
        {
        	this._arySVI[level].name = name; 
            this._arySVI[level].propertyName = name;
            this._arySVI[level].type = SourceValueType.Property; 
 
            this._earlyBoundPathParts[level] = null;
        }, 



        //----------------------------------------------------- 
        //
        //  Private methods
        //
        //------------------------------------------------------ 

        // parse the path to figure out what kind of 
        // SourceValueInfo we're going to need 
        /*private void*/ 
        PrepareSourceValueInfo:function(/*ITypeDescriptorContext*/ typeDescriptorContext)
        { 
            /*PathParser*/var parser = DataBindEngine.CurrentDataBindEngine.PathParser;
            this._arySVI = parser.Parse(this.Path);

            if (this._arySVI.length == 0) 
            {
                /*string*/var detail = parser.Error; 
                if (detail == null) 
                    detail = Path;
                throw new Error("InvalidOperationException(SR.Get(SRID.PropertyPathSyntaxError, detail)"); 
            }

            this.ResolvePathParts(typeDescriptorContext);
        }, 

        // "normalize" the path - i.e. load the PathParameters with the early-bound 
        // accessors, and replace the corresponding parts of the path with 
        // parameter references
        /*private void*/ 
        NormalizePath:function() 
        {
            /*StringBuilder*/var builder = ""; //new StringBuilder();
            /*PathParameterCollection*/var parameters = new PathParameterCollection();
 
            for (var i=0; i<_arySVI.length; ++i)
            { 
                switch (_arySVI[i].drillIn) 
                {
                    case DrillIn.Always: 
                        builder += '/';
                        break;

                    case DrillIn.Never: 
                        if (_arySVI[i].type == SourceValueType.Property)
                        { 
                            builder += '.'; 
                        }
                        break; 

                    case DrillIn.IfNeeded:
                        break;
                } 

                switch (_arySVI[i].type) 
                { 
                    case SourceValueType.Property:
                        if (_earlyBoundPathParts[i] != null) 
                        {
                            builder +='(';
                            builder += parameters.Count; //.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
                            builder += ')'; 

                            parameters.Add(_earlyBoundPathParts[i]); 
                        } 
                        else
                        { 
                            builder += (this._arySVI[i].name);
                        }
                        break;
 
                    case SourceValueType.Indexer:
                        builder += '['; 
                        if (this._earlyBoundPathParts[i] != null) 
                        {
                            /*IndexerParameterInfo[]*/var aryIPI = /*(IndexerParameterInfo[])*/this._earlyBoundPathParts[i]; 
                            // the params should be at the very least a single empty string
//                            Debug.Assert(aryIPI.Length > 0);
                            var j = 0;
                            while (true) 
                            {
                                /*IndexerParameterInfo*/var info = aryIPI[j]; 
                                if (info.type != null) 
                                {
                                    builder += '('; 
                                    builder += parameters.Count; //.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
                                    builder += ')';

                                    parameters.Add(info.value); 
                                }
                                else 
                                { 
                                    builder += info.value;
                                } 
                                ++j;

                                if (j < aryIPI.Length)
                                { 
                                    builder += ',';
                                } 
                                else 
                                {
                                    break; 
                                }
                            }
                        }
                        else 
                        {
                            builder += _arySVI[i].name; 
                        } 
                        builder += ']';
                        break; 

                    case SourceValueType.Direct:
                        break;
                } 

            } 
 
            if (parameters.Count > 0)
            { 
                this._path = builder;
                this.SetPathParameterCollection(parameters);
            }
        },

        // set new parameter collection; update collection change notification handler 
        /*private void*/ SetPathParameterCollection:function(/*PathParameterCollection*/ parameters) 
        {
            if (this._parameters != null) 
            {
            	this._parameters.CollectionChanged.Remove(new NotifyCollectionChangedEventHandler(this, this.ParameterCollectionChanged));
            }
            this._parameters = parameters; 
            if (this._parameters != null)
            { 
            	this._parameters.CollectionChanged.Combine(new NotifyCollectionChangedEventHandler(this, this.ParameterCollectionChanged)); 
            }
        }, 

        // path parameters were added/removed, update SourceValueInfo
        /*private void*/ 
        ParameterCollectionChanged:function(/*object*/ sender, /*NotifyCollectionChangedEventArgs*/ e)
        { 
        	this.PrepareSourceValueInfo(null);
        }, 
 

        // resolve the property names and path parameters early, if possible 
        /*void*/ 
        ResolvePathParts:function(/*ITypeDescriptorContext*/ typeDescriptorContext)
        {
            var throwOnError = (typeDescriptorContext != null);
 
            var context = null;
 
            /*TypeConvertContext*/
            
/*            var typeConvertContext = (typeDescriptorContext instanceof TypeConvertContext ? typeDescriptorContext : null); 
            if( typeConvertContext != null )
                context = typeConvertContext.ParserContext; 
*/  //cym comment
            
            if (context == null)
                context = typeDescriptorContext;
            this._earlyBoundPathParts = []; 

            for (var level=this.Length-1; level>=0; --level) 
            { 
                if (this._arySVI[level].type == SourceValueType.Property)
                { 
                    var name = this._arySVI[level].name;
                    if (PropertyPath.IsPropertyReference(name))
                    {
                        var accessor = this.ResolvePropertyName(name, null, null, context, throwOnError); 
                        this._earlyBoundPathParts[level] = accessor;
 
                        if (accessor != null) 
                        {
                        	this._arySVI[level].propertyName = PropertyPath.GetPropertyName(accessor); 
                        }
                    }
                    else
                    { 
                    	this._arySVI[level].propertyName = name;
                    } 
                } 
                else if (this._arySVI[level].type == SourceValueType.Indexer)
                { 
                    /*IndexerParameterInfo[]*/var indexerParams = this.ResolveIndexerParams(_arySVI[level].paramList, context, throwOnError);
                    this._earlyBoundPathParts[level] = indexerParams;
                    this._arySVI[level].propertyName = Binding.IndexerName;
                } 
            }
        }, 
        
//        /*internal object */
//        ResolvePropertyName:function(/*int*/ level, /*object*/ item, /*Type*/ ownerType, /*object*/ context)
//        {
//            //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
// 
//            // if user told us explicitly what to use, use it
//            /*object*/var accessor = this._earlyBoundPathParts[level]; 
// 
//            if (accessor == null)
//            { 
//                accessor = ResolvePropertyName(_arySVI[level].name, item, ownerType, context, false);
//            }
//
//            return accessor; 
//        },
// 
//        // resolve a single DP name
//        /*object*/ 
//        ResolvePropertyName:function(/*string*/ name, /*object*/ item, /*Type*/ ownerType, /*object*/ context, /*bool*/ throwOnError) 
//        {
//            var propertyName = name;
//
//            // first see if the name is an index into the parameter list
//            var parObj = {"index":null};
//            
//            var result = PropertyPath.IsParameterIndex(name, /*out index*/parObj);
//            var index = parObj.index;
//            if (result) 
//            { 
//                if (0 <= index && index < this.PathParameters.Count)
//                { 
//                    var accessor = PathParameters[index];
//                    // always throw if the accessor isn't valid - this error cannot
//                    // be corrected later on.
//                    if (!this.IsValidAccessor(accessor)) 
//                        throw new Error('InvalidOperationException(SR.Get(SRID.PropertyPathInvalidAccessor' + 
//                                    '(accessor != null) ? accessor.GetType().FullName : "null")'); 
// 
//                    return accessor;
//                } 
//                else if (throwOnError)
//                    throw new Error('InvalidOperationException(SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count)');
//                else return null;
//            } 
//
//            // handle attached-property syntax:  (TypeName.PropertyName) 
//            if (PropertyPath.IsPropertyReference(name)) 
//            {
//                name = name.Substring(1, name.Length-2); 
//
//                var lastIndex = name.lastIndexOf('.');
//                if (lastIndex >= 0)
//                { 
//                    // attached property - get the owner type
//                    propertyName = name.substring(lastIndex + 1).trim(); 
//                    var ownerName = name.substring(0, lastIndex).trim(); 
//                    ownerType = GetTypeFromName(ownerName, context);
//                    if (ownerType == null && throwOnError) 
//                        throw new Error('InvalidOperationException(SR.Get(SRID.PropertyPathNoOwnerType, ownerName)');
//                }
//                else
//                { 
//                    // simple name in parens - just strip the parens
//                    propertyName = name; 
//                } 
//            }
// 
//            if (ownerType != null)
//            {
//                // get an appropriate accessor from the ownerType and propertyName.
//                // We prefer accessors in a certain order, defined below. 
//                var accessor;
// 
//                // 1. DependencyProperty on the given type. 
//                accessor = DependencyProperty.FromName(propertyName, ownerType);
// 
//                // 2. PropertyDescriptor from item's custom lookup.
//                // When the item implements custom properties, we must use them.
//                if (accessor == null && item instanceof ICustomTypeDescriptor)
//                { 
//                    accessor = TypeDescriptor.GetProperties(item)[propertyName];
//                } 
// 
//                // 3a. PropertyInfo, when item exposes INotifyPropertyChanged.
//                // 3b. PropertyInfo, when item is a DependencyObject (bug 1373351). 
//                // This uses less working set than PropertyDescriptor, and we don't need
//                // the ValueChanged pattern.  (If item is a DO and wants to raise
//                // change notifications, it should make the property a DP.)
//                if (accessor == null && 
//                    (item instanceof INotifyPropertyChanged || item instanceof DependencyObject))
//                { 
//                    accessor = this.GetPropertyHelper(ownerType, propertyName); 
//                }
// 
//                // 4. PropertyDescriptor (obtain from item - this is reputedly
//                // slower than obtaining from type, but the latter doesn't
//                // discover properties obtained from TypeDescriptorProvider -
//                // see bug 1713000). 
//                // This supports the [....] ValueChanged pattern.
//                if (accessor == null && item != null) 
//                { 
//                    accessor = TypeDescriptor.GetProperties(item)[propertyName];
//                } 
//
//                // 5. PropertyInfo.
//                if (accessor == null)
//                { 
//                    accessor = this.GetPropertyHelper(ownerType, propertyName);
//                } 
// 
//                // 6. IDynamicMetaObjectProvider
//                // This supports the DLR's dynamic objects 
//                if (accessor == null && SystemCoreHelper.IsIDynamicMetaObjectProvider(item))
//                {
//                    accessor = SystemCoreHelper.NewDynamicPropertyAccessor(item.GetType(), propertyName);
//                } 
//
//                if (accessor == null && throwOnError) 
//                    throw new InvalidOperationException(SR.Get(SRID.PropertyPathNoProperty, ownerType.Name, propertyName)); 
//
//                return accessor; 
//            }
//
//            return null;
//        },
//        
//        /*internal object */
//        ResolvePropertyName:function(/*int*/ level, /*object*/ item, /*Type*/ ownerType, /*object*/ context)
//        {
//            //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
// 
//            // if user told us explicitly what to use, use it
//            /*object*/var accessor = this._earlyBoundPathParts[level]; 
// 
//            if (accessor == null)
//            { 
//                accessor = ResolvePropertyName(this._arySVI[level].name, item, ownerType, context, false);
//            }
//
//            return accessor; 
//        },
 
        // resolve a single DP name
        /*object*/ 
        ResolvePropertyName:function(/*string*/ name, /*object*/ item, /*Type*/ ownerType, /*object*/ context, /*bool*/ throwOnError) 
        {
        	if(typeof name == "number"){
        		var level = name;
                //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
        		 
                // if user told us explicitly what to use, use it
                /*object*/var accessor = this._earlyBoundPathParts[level]; 
     
                if (accessor == null)
                { 
                    accessor = this.ResolvePropertyName(this._arySVI[level].name, item, ownerType, context, false);
                }

                return accessor; 
        	}
        	
            var propertyName = name;

            // first see if the name is an index into the parameter list
            var parObj = {"index":null};
            
            var result = PropertyPath.IsParameterIndex(name, /*out index*/parObj);
            var index = parObj.index;
            if (result) 
            { 
                if (0 <= index && index < this.PathParameters.Count)
                { 
                    var accessor = this.PathParameters.Get(index);
                    // always throw if the accessor isn't valid - this error cannot
                    // be corrected later on.
                    if (!PropertyPath.IsValidAccessor(accessor)) 
                        throw new Error('InvalidOperationException(SR.Get(SRID.PropertyPathInvalidAccessor' + 
                                    '(accessor != null) ? accessor.GetType().FullName : "null")'); 
 
                    return accessor;
                } 
                else if (throwOnError)
                    throw new Error('InvalidOperationException(SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count)');
                else return null;
            } 

            // handle attached-property syntax:  (TypeName.PropertyName) 
            if (PropertyPath.IsPropertyReference(name)) 
            {
                name = name.Substring(1, name.Length-2); 

                var lastIndex = name.lastIndexOf('.');
                if (lastIndex >= 0)
                { 
                    // attached property - get the owner type
                    propertyName = name.substring(lastIndex + 1).Trim(); 
                    var ownerName = name.substring(0, lastIndex).Trim(); 
                    ownerType = GetTypeFromName(ownerName, context);
                    if (ownerType == null && throwOnError) 
                        throw new Error('InvalidOperationException(SR.Get(SRID.PropertyPathNoOwnerType, ownerName)');
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
                var accessor;
 
                // 1. DependencyProperty on the given type. 
//                accessor = DependencyProperty.FromName(propertyName, ownerType);
                //cym modify 2014-01-25
                var tempDp = ownerType.Constructor[propertyName + "Property"];
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
                    accessor = this.GetPropertyHelper(ownerType, propertyName); 
                }
                
                //cym comment
 
//                // 4. PropertyDescriptor (obtain from item - this is reputedly
//                // slower than obtaining from type, but the latter doesn't
//                // discover properties obtained from TypeDescriptorProvider -
//                // see bug 1713000). 
//                // This supports the [....] ValueChanged pattern.
//                if (accessor == null && item != null) 
//                { 
//                    accessor = TypeDescriptor.GetProperties(item)[propertyName];
//                } 
//
//                // 5. PropertyInfo.
//                if (accessor == null)
//                { 
//                    accessor = this.GetPropertyHelper(ownerType, propertyName);
//                } 
// 
//                // 6. IDynamicMetaObjectProvider
//                // This supports the DLR's dynamic objects 
//                if (accessor == null && SystemCoreHelper.IsIDynamicMetaObjectProvider(item))
//                {
//                    accessor = SystemCoreHelper.NewDynamicPropertyAccessor(item.GetType(), propertyName);
//                } 

                if (accessor == null && throwOnError) 
                    throw new InvalidOperationException(SR.Get(SRID.PropertyPathNoProperty, ownerType.Name, propertyName)); 

                return accessor; 
            }

            return null;
        },

        /*private PropertyInfo*/ 
        GetPropertyHelper:function(/*Type*/ ownerType, /*string*/ propertyName) 
        { 
            /*PropertyInfo*/var result = null;
            var enumerateBaseClasses = false; 
            var returnIndexerProperty = false;

            try
            { 
                result = ownerType.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.FlattenHierarchy);
            } 
            catch (/*AmbiguousMatchException*/ e) 
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
                catch (/*AmbiguousMatchException*/ ex) 
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
        }, 

        // resolve indexer parameters
        /*IndexerParameterInfo[]*/ 
        ResolveIndexerParams:function(/*FrugalObjectList<IndexerParamInfo>*/ paramList, /*object*/ context, /*bool*/ throwOnError)
        { 
            /*IndexerParameterInfo[]*/var args = new IndexerParameterInfo[paramList.Count];
            for (var i = 0; i < args.Length; ++i) 
            { 
                if (String.IsNullOrEmpty(paramList[i].parenString))
                { 
                    // no paren string "foo" - value is (uninterpreted) value string
                    args[i].value = paramList[i].valueString;
                }
                else if (String.IsNullOrEmpty(paramList[i].valueString)) 
                {
                    // no value string "(2)" - value comes from PathParameter list 
                    var index; 
                    if (Int32.TryParse( paramList[i].parenString.Trim(),
                                        NumberStyles.Integer, 
                                        TypeConverterHelper.InvariantEnglishUS.NumberFormat,
                                        /*out*/ index))
                    {
                        if (0 <= index && index < PathParameters.Count) 
                        {
                            var value = PathParameters[index]; 
                            if (value != null) 
                            {
                                args[i].value = value; 
                                args[i].type = value.GetType();
                            }
                            else if (throwOnError)
                            { 
                                // info.value will still be "(n)"
                                throw new Error('InvalidOperationException(SR.Get(SRID.PathParameterIsNull, index)'); 
                            } 
                        }
                        else if (throwOnError) 
                            throw new Error('InvalidOperationException(SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count)');
                    }
                    else
                    { 
                        // parens didn't hold an integer "(abc)" - value is (uninterpreted) paren string
                        // [this could be considered an error, but the original code 
                        // treated it like this, so to preserve compatibility...] 
                        args[i].value = "(" + paramList[i].parenString + ")";
                    } 
                }
                else
                {
                    // both strings appear "(Double)3.14159" - value is type-converted from value string 
                    args[i].type = GetTypeFromName(paramList[i].parenString, context);
                    if (args[i].type != null) 
                    { 
                        var value = GetTypedParamValue(paramList[i].valueString.Trim(), args[i].type, throwOnError);
                        if (value != null) 
                        {
                            args[i].value = value;
                        }
                        else 
                        {
                            if (throwOnError) 
                                throw new Error('InvalidOperationException(SR.Get(SRID.PropertyPathIndexWrongType, paramList[i].parenString, paramList[i].valueString)'); 
                            args[i].type = null;
                        } 
                    }
                    else
                    {
                        // parens didn't hold a type name "(abc)xyz" - value is (uninterpreted) string 
                        // [this could be considered an error, but the original code
                        // treated it like this, so to preserve compatibility...] 
                        args[i].value = "(" + paramList[i].parenString + ")" + paramList[i].valueString; 
                    }
                } 
            }
            return args;
        },
 
        /*object*/ 
        GetTypedParamValue:function(/*string*/ param, /*Type*/ type, /*bool*/ throwOnError)
        { 
            var value = null; 
            if (type == typeof(string))
                return param; 

            var tc = TypeDescriptor.GetConverter(type);

            if (tc != null && tc.CanConvertFrom(typeof(string))) 
            {
                // PreSharp uses message numbers that the C# compiler doesn't know about. 
                // Disable the C# complaints, per the PreSharp documentation. 
//                #pragma warning disable 1634, 1691
// 
//                // PreSharp complains about catching NullReference (and other) exceptions.
//                // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//                #pragma warning disable 56500
 
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
                catch (/*Exception*/ ex) 
                {
                    if (CriticalExceptions.IsCriticalApplicationException(ex) || throwOnError)
                        throw ex;
                } 
//                catch
//                { 
//                    if (throwOnError) 
//                        throw;
//                } 
//
//                #pragma warning restore 56500
//                #pragma warning restore 1634, 1691
            } 

            if (value == null && type.IsAssignableFrom(typeof(string))) 
            { 
                value = param;
            } 
            return value;
        },

 
        // Return the type named by the given name
        /*Type*/ 
        GetTypeFromName:function(/*string*/ name, /*object*/ context) 
        { 
            // use the parser context, if available.  This allows early resolution.
            // [....] 5/8/2009 - I believe with System.Xaml there is never an old parserContext here. 
            // But cannot be sure.
            /*ParserContext*/var parserContext = context instanceof ParserContext ? context : null;
            if (parserContext != null)
            { 
                // Find the namespace prefix
                var nsPrefix; 
                var nsIndex = name.indexOf(':'); 
                if (nsIndex == -1)
                    nsPrefix = String.Empty; 
                else
                {
                    // Found a namespace prefix separator, so create replacement _pathString.
                    // String processing - split "foons" from "BarClass.BazProp" 
                    nsPrefix = name.substring(0, nsIndex).trimEnd();
                    name = name.substring(nsIndex + 1).trimStart(); 
                } 

                // Find the namespace URI, even if its the default one 
                var namespaceURI = parserContext.XmlnsDictionary[nsPrefix];
                if (namespaceURI == null)
                {
                    throw new ArgumentException(SR.Get(SRID.ParserPrefixNSProperty, nsPrefix, name)); 
                }
 
                /*TypeAndSerializer*/var typeAndSerializer = parserContext.XamlTypeMapper.GetTypeOnly(namespaceURI, name); 

                return (typeAndSerializer != null) ? typeAndSerializer.ObjectType : null; 
            }

            else
            { 
                if (context instanceof IServiceProvider)
                { 
 
                    /*IXamlTypeResolver*/var xtr = context.GetService(typeof(IXamlTypeResolver));
                    xtr = xtr instanceof IXamlTypeResolver ? xtr : null;
 
                    if (xtr != null)
                    {
                        return xtr.Resolve(name);
                    } 
                }
 
                /*IValueSerializerContext*/var serializerContext = context instanceof IValueSerializerContext ? context : null; 
                if (serializerContext != null)
                { 
                    /*ValueSerializer*/var typeSerializer = ValueSerializer.GetSerializerFor(typeof(Type), serializerContext);
                    if (typeSerializer != null)
                    	var result = typeSerializer.ConvertFromString(name, serializerContext);
                        return  result instanceof Type ? result : null;
                } 
            }
 
            // if there's no parser or serializer context, use the tree context 
            /*DependencyObject*/var hostElement = context instanceof DependencyObject ? context : null;
            if (hostElement == null) 
            {
                hostElement = new DependencyObject();   // at least pick up the default namespaces
            }
 
            var wpfSharedSchemaContext = XamlReader.BamlSharedSchemaContext;
            var type = wpfSharedSchemaContext.ResolvePrefixedNameWithAdditionalWpfSemantics(name, hostElement); 
            return type; 
        }
 

        
	});
	
	Object.defineProperties(PropertyPath.prototype,{
        //------------------------------------------------------ 
        //
        //  Public properties 
        // 
        //-----------------------------------------------------
 
        /// <summary> The string describing the path. </summary>
        /*public string*/ 
		Path:
        {
            get:function() { return this._path; },
            set:function(value)
            { 
                this._path = value; 
                PrepareSourceValueInfo(null);
            } 
        },

        /// <summary>
        /// The list of parameters to use when the 
        /// path refers to indexed parameters.
        /// Each parameter in the list should be a DependencyProperty, 
        /// a PropertyInfo, or a PropertyDescriptor. 
        /// </summary>
        /*public Collection<object>*/ 
        PathParameters:
        {
            get:function()
            {
                if (this._parameters == null) 
                {
                	this.SetPathParameterCollection(new PathParameterCollection()); 
                } 
                return this._parameters;
            } 
        },
        
        //-----------------------------------------------------
        //
        //  Private properties 
        //
        //------------------------------------------------------ 
 
        /*PropertyPathWorker*/ 
        SingleWorker:
        { 
            get:function()
            {
                if (this._singleWorker == null)
                	this._singleWorker = new PropertyPathWorker(this); 
                return this._singleWorker;
            } 
        },

        //------------------------------------------------------
        // 
        //  Internal properties
        // 
        //------------------------------------------------------ 

        // the number of levels in the path 
        /*internal int*/ 
        Length: { get:function() { return this._arySVI.length; } },

        // the status of the PropertyPath
        /*internal PropertyPathStatus*/ 
        Status: { get:function() { return this.SingleWorker.Status; } }, 

        // the most recent error message 
        /*internal string*/ 
        LastError: { get:function() { return this._lastError; } }, 

        // convenience properties for a frequent special case 
        /*internal object*/ 
        LastItem: { get:function() { return this.GetItem(this.Length - 1); } },
        /*internal object*/ 
        LastAccessor: { get:function() { return this.GetAccessor(this.Length - 1); } },
        /*internal object[]*/ 
        LastIndexerArguments: { get:function() { return this.GetIndexerArguments(this.Length - 1); } },
 
        // test for static properties
        /*internal bool*/ 
        StartsWithStaticProperty: { get:function() { return this.Length > 0 && PropertyPath.IsStaticProperty(this._earlyBoundPathParts[0]); } },
        

        //----------------------------------------------------- 
        //
        //  Internal properties and methods for use by PropertyPathWorker only 
        // 
        //-----------------------------------------------------
 
        /*internal SourceValueInfo[]*/ 
        SVI:
        {
            get:function()
            { 
                //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
                return this._arySVI; 
            } 
        }
	});
	
	/*internal static bool*/ 
	PropertyPath.IsStaticProperty = function(/*object*/ accessor)
    { 
        /*MethodInfo*/var mi;
//        DependencyProperty dp;
//        PropertyInfo pi;
//        PropertyDescriptor pd; 
//        DynamicObjectAccessor doa;
//        DowncastAccessor(accessor, out dp, out pi, out pd, out doa);
        var dpOut = {
        	"dp":null
        };
        var pdOut = {
        	"pd":null,
        };
        
        var piOut = {
        	"pi":null,
        };
        
        var doaOut = {
        	"doa":null,
        };
        PropertyPath.DowncastAccessor(accessor, /*out dp*/dpOut, /*out pi*/piOut, /*out pd*/pdOut, /*out doa*/doaOut);
//        /*DependencyProperty*/var dp = dpOut.dp;
        /*PropertyInfo*/var pi = piOut.pi;
//        /*PropertyDescriptor*/var pd = pdOut.pd; 
//        /*DynamicObjectAccessor*/var doa = doaOut.doa;

//        if (pi != null)
//        { 
//            mi =  pi.GetGetMethod();
//            return mi != null && mi.IsStatic;
//        }

        return false;
    };
	
	// Convert an "accessor" into one of the legal types
	//internal static void 
	PropertyPath.DowncastAccessor = function(/*object*/ accessor, 
	                  /*out DependencyProperty dp*/dpOut, /*out PropertyInfo pi*/piOut, 
	                  /*out PropertyDescriptor pd*/pdOut, /*out DynamicObjectAccessor doa*/doaOut) 
	{
		if ((dpOut.dp = (accessor instanceof DependencyProperty  ? accessor : null)) != null) 
		{
			pdOut.pd = null;
			piOut.pi = null;
			doaOut.doa = null; 
		}
		else if ((piOut.pi = (accessor instanceof PropertyInfo  ? accessor : null)) != null) 
		{ 
			pdOut.pd = null;
			doaOut.doa = null; 
		}
		else if ((pdOut.pd = (accessor instanceof PropertyDescriptor  ? accessor : null) ) != null)
		{
			doaOut.doa = null; 
		}
		else 
		{ 
			doaOut.doa = accessor instanceof DynamicObjectAccessor ? accessor : null;
		} 
	};
	
    // return true if the name has the form:  (property)
//    internal static bool 
    PropertyPath.IsPropertyReference = function(/*string*/ name)
    {
        return (name != null && name.length > 1 && name[0] == '(' && (name[name.length - 1] == ')')); 
    };

    // return true if the name has the form:  (nnn) 
//    internal static bool 
    PropertyPath.IsParameterIndex = function(/*string*/ name, parObj/*out int index*/)
    { 
        if (this.IsPropertyReference(name))
        {
            name = name.substr(1, name.length - 2);
        } 
        else
        { 
        	parObj.index = -1; 
            return false;
        } 
        parObj.index = parseInt(name);
        
        return NaN !== parObj.index;

        /*return Int32.TryParse( name,
                            NumberStyles.Integer,
                            TypeConverterHelper.InvariantEnglishUS.NumberFormat, 
                            out index);*/
    };
	
	 
    // determine if an object is one of the accessors we support
//    static bool 
    PropertyPath.IsValidAccessor = function(/*object*/ accessor) 
    {
        return  accessor instanceof DependencyProperty ||
                accessor instanceof PropertyInfo  ||
                accessor instanceof PropertyDescriptor || 
                accessor instanceof DynamicObjectAccessor;
    };

    // determine the name of an accessor
//    static string 
    PropertyPath.GetPropertyName = function(/*object*/ accessor) 
    {
        /*DependencyProperty*/var dp;
        /*PropertyInfo*/var pi;
        /*PropertyDescriptor*/var pd; 
        /*DynamicObjectAccessor*/var doa;

        if ((dp = (accessor instanceof DependencyProperty ? accessor : null)) != null) 
            return dp.Name;
        else if ((pi = (accessor instanceof PropertyInfo ? accessor : null)) != null) 
            return pi.Name;
        else if ((pd = (accessor instanceof PropertyDescriptor ? accessor : null)) != null)
            return pd.Name;
        else if ((doa = (accessor instanceof DynamicObjectAccessor ? accessor : null)) != null) 
            return doa.PropertyName;
        else 
        { 
//            Invariant.Assert(false, "Unknown accessor type");
            return null; 
        }
    };


//    //------------------------------------------------------ 
//    //
//    //  Private data 
//    // 
//    //-----------------------------------------------------
//
//    string _path = String.Empty;        // the path
//    PathParameterCollection _parameters; // list of DPs to inject into the path
//
//    SourceValueInfo[] _arySVI;          // static description of each level in the path 
//    string _lastError = String.Empty;   // most recent error message
//    object[] _earlyBoundPathParts;      // accessors and indexer parameters that got resolved early 
//    PropertyPathWorker _singleWorker;   // shared worker - used in "target" mode 
	
	PropertyPath.Type = new Type("PropertyPath", PropertyPath, [Object.Type]);
	return PropertyPath;
});




//
//        //------------------------------------------------------ 
//        //
//        //  Public properties 
//        // 
//        //-----------------------------------------------------
// 
//        /// <summary> The string describing the path. </summary>
//        public string Path
//        {
//            get { return _path; } 
//            set
//            { 
//                _path = value; 
//                PrepareSourceValueInfo(null);
//            } 
//        }
//
//        /// <summary>
//        /// The list of parameters to use when the 
//        /// path refers to indexed parameters.
//        /// Each parameter in the list should be a DependencyProperty, 
//        /// a PropertyInfo, or a PropertyDescriptor. 
//        /// </summary>
//        public Collection<object> PathParameters 
//        {
//            get
//            {
//                if (_parameters == null) 
//                {
//                    SetPathParameterCollection(new PathParameterCollection()); 
//                } 
//                return _parameters;
//            } 
//        }
//
//        //------------------------------------------------------
//        // 
//        //  Internal properties
//        // 
//        //------------------------------------------------------ 
//
//        // the number of levels in the path 
//        internal int Length { get { return _arySVI.length; } }
//
//        // the status of the PropertyPath
//        internal PropertyPathStatus Status { get { return SingleWorker.Status; } } 
//
//        // the most recent error message 
//        internal string LastError { get { return _lastError; } } 
//
//        // convenience properties for a frequent special case 
//        internal object LastItem { get { return GetItem(Length - 1); } }
//        internal object LastAccessor { get { return GetAccessor(Length - 1); } }
//        internal object[] LastIndexerArguments { get { return GetIndexerArguments(Length - 1); } }
// 
//        // test for static properties
//        internal bool StartsWithStaticProperty { get { return Length > 0 && IsStaticProperty(_earlyBoundPathParts[0]); } } 
// 
//        internal static bool IsStaticProperty(object accessor)
//        { 
//            MethodInfo mi;
//            DependencyProperty dp;
//            PropertyInfo pi;
//            PropertyDescriptor pd; 
//            DynamicObjectAccessor doa;
//            DowncastAccessor(accessor, out dp, out pi, out pd, out doa); 
// 
//            if (pi != null)
//            { 
//                mi =  pi.GetGetMethod();
//                return mi != null && mi.IsStatic;
//            }
// 
//            return false;
//        } 
// 
//        //-----------------------------------------------------
//        // 
//        //  Internal methods
//        //
//        //------------------------------------------------------
// 
//        // Convert an "accessor" into one of the legal types
//        internal static void DowncastAccessor(object accessor, 
//                            out DependencyProperty dp, out PropertyInfo pi, out PropertyDescriptor pd, out DynamicObjectAccessor doa) 
//        {
//            if ((dp = accessor as DependencyProperty) != null) 
//            {
//                pd = null;
//                pi = null;
//                doa = null; 
//            }
//            else if ((pi = accessor as PropertyInfo) != null) 
//            { 
//                pd = null;
//                doa = null; 
//            }
//            else if ((pd = accessor as PropertyDescriptor) != null)
//            {
//                doa = null; 
//            }
//            else 
//            { 
//                doa = accessor as DynamicObjectAccessor;
//            } 
//        }
//
//        // Set the context for the path.  Use this method in "target" mode
//        // to connect the path to a rootItem for a short time: 
//        //      using (path.SetContext(myItem))
//        //      { 
//        //          ... call target-mode convenience methods ... 
//        //      }
//        internal IDisposable SetContext(object rootItem) 
//        {
//            return SingleWorker.SetContext(rootItem);
//        }
// 
//        // return the item for level k.  This is the result of evaluating the
//        // path up to level k-1, starting at the root item. 
//        internal object GetItem(int k) 
//        {
//            return SingleWorker.GetItem(k); 
//        }
//
//        // return the "accessor" for level k.  This is the object used to get
//        // the value of level k (together with the level-k item).  It can be 
//        // a DP, a PropertyInfo, a PropertyDescriptor, etc.
//        internal object GetAccessor(int k) 
//        { 
//            object accessor = _earlyBoundPathParts[k];
// 
//            if (accessor == null)
//            {
//                accessor = SingleWorker.GetAccessor(k);
//            } 
//
//            return accessor; 
//        } 
//
//        // return the arguments to use when the accessor at level k is an 
//        // indexer.  (If it's not an indexer, this returns null.)
//        internal object[] GetIndexerArguments(int k)
//        {
//            return SingleWorker.GetIndexerArguments(k); 
//        }
// 
//        // return the value of the path.  Must be called within the scope 
//        // of SetContext.
//        internal object GetValue() 
//        {
//            return SingleWorker.RawValue();
//        }
// 
//        // return the number of unresolved attached properties (called by Binding)
//        internal int ComputeUnresolvedAttachedPropertiesInPath() 
//        { 
//            // the path uses attached properties by the syntax (ClassName.PropName).
//            // If there are any such properties in the path, the binding needs the 
//            // tree context to resolve the class name.
//            int result = 0;
//
//            for (int k=Length-1; k>=0; --k) 
//            {
//                if (_earlyBoundPathParts[k] == null) 
//                { 
//                    string name = _arySVI[k].name;
//                    if (IsPropertyReference(name)) 
//                    {
//                        // a dot inside parens, when there's no early-bound accessor,
//                        // is an unresolved PD name
//                        if (name.IndexOf('.') >= 0) 
//                            ++ result;
//                    } 
//                } 
//            }
// 
//            return result;
//        }
//
//        //----------------------------------------------------- 
//        //
//        //  Internal properties and methods for use by PropertyPathWorker only 
//        // 
//        //-----------------------------------------------------
// 
//        internal SourceValueInfo[] SVI
//        {
//            get
//            { 
//                //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
//                return _arySVI; 
//            } 
//        }
// 
//        internal object ResolvePropertyName(int level, object item, Type ownerType, object context)
//        {
//            //Debug.Assert(Helper.IsCallerOfType(typeof(PropertyPathWorker)));
// 
//            // if user told us explicitly what to use, use it
//            object accessor = _earlyBoundPathParts[level]; 
// 
//            if (accessor == null)
//            { 
//                accessor = ResolvePropertyName(_arySVI[level].name, item, ownerType, context, false);
//            }
//
//            return accessor; 
//        }
// 
//        internal IndexerParameterInfo[] ResolveIndexerParams(int level, object context) 
//        {
//            IndexerParameterInfo[] parameters = _earlyBoundPathParts[level] as IndexerParameterInfo[]; 
//
//            if (parameters == null)
//            {
//                parameters = ResolveIndexerParams(_arySVI[level].paramList, context, false); 
//            }
// 
//            return parameters; 
//        }
// 
//        // PropertyPathWorker may choose to replace an indexer by a property
//        internal void ReplaceIndexerByProperty(int level, string name)
//        {
//            _arySVI[level].name = name; 
//            _arySVI[level].propertyName = name;
//            _arySVI[level].type = SourceValueType.Property; 
// 
//            _earlyBoundPathParts[level] = null;
//        } 
//
//        //-----------------------------------------------------
//        //
//        //  Private properties 
//        //
//        //------------------------------------------------------ 
// 
//        PropertyPathWorker SingleWorker
//        { 
//            get
//            {
//                if (_singleWorker == null)
//                    _singleWorker = new PropertyPathWorker(this); 
//                return _singleWorker;
//            } 
//        } 
//
//        //----------------------------------------------------- 
//        //
//        //  Private methods
//        //
//        //------------------------------------------------------ 
//
//        // parse the path to figure out what kind of 
//        // SourceValueInfo we're going to need 
//        private void PrepareSourceValueInfo(ITypeDescriptorContext typeDescriptorContext)
//        { 
//            PathParser parser = DataBindEngine.CurrentDataBindEngine.PathParser;
//            _arySVI = parser.Parse(Path);
//
//            if (_arySVI.length == 0) 
//            {
//                string detail = parser.Error; 
//                if (detail == null) 
//                    detail = Path;
//                throw new InvalidOperationException(SR.Get(SRID.PropertyPathSyntaxError, detail)); 
//            }
//
//            ResolvePathParts(typeDescriptorContext);
//        } 
//
//        // "normalize" the path - i.e. load the PathParameters with the early-bound 
//        // accessors, and replace the corresponding parts of the path with 
//        // parameter references
//        private void NormalizePath() 
//        {
//            StringBuilder builder = new StringBuilder();
//            PathParameterCollection parameters = new PathParameterCollection();
// 
//            for (int i=0; i<_arySVI.length; ++i)
//            { 
//                switch (_arySVI[i].drillIn) 
//                {
//                    case DrillIn.Always: 
//                        builder.Append('/');
//                        break;
//
//                    case DrillIn.Never: 
//                        if (_arySVI[i].type == SourceValueType.Property)
//                        { 
//                            builder.Append('.'); 
//                        }
//                        break; 
//
//                    case DrillIn.IfNeeded:
//                        break;
//                } 
//
//                switch (_arySVI[i].type) 
//                { 
//                    case SourceValueType.Property:
//                        if (_earlyBoundPathParts[i] != null) 
//                        {
//                            builder.Append('(');
//                            builder.Append(parameters.Count.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
//                            builder.Append(')'); 
//
//                            parameters.Add(_earlyBoundPathParts[i]); 
//                        } 
//                        else
//                        { 
//                            builder.Append(_arySVI[i].name);
//                        }
//                        break;
// 
//                    case SourceValueType.Indexer:
//                        builder.Append('['); 
//                        if (_earlyBoundPathParts[i] != null) 
//                        {
//                            IndexerParameterInfo[] aryIPI = (IndexerParameterInfo[])_earlyBoundPathParts[i]; 
//                            // the params should be at the very least a single empty string
//                            Debug.Assert(aryIPI.Length > 0);
//                            int j = 0;
//                            while (true) 
//                            {
//                                IndexerParameterInfo info = aryIPI[j]; 
//                                if (info.type != null) 
//                                {
//                                    builder.Append('('); 
//                                    builder.Append(parameters.Count.ToString(TypeConverterHelper.InvariantEnglishUS.NumberFormat));
//                                    builder.Append(')');
//
//                                    parameters.Add(info.value); 
//                                }
//                                else 
//                                { 
//                                    builder.Append(info.value);
//                                } 
//                                ++j;
//
//                                if (j < aryIPI.Length)
//                                { 
//                                    builder.Append(',');
//                                } 
//                                else 
//                                {
//                                    break; 
//                                }
//                            }
//                        }
//                        else 
//                        {
//                            builder.Append(_arySVI[i].name); 
//                        } 
//                        builder.Append(']');
//                        break; 
//
//                    case SourceValueType.Direct:
//                        break;
//                } 
//
//            } 
// 
//            if (parameters.Count > 0)
//            { 
//                _path = builder.ToString();
//                SetPathParameterCollection(parameters);
//            }
//        } 
//
//        // set new parameter collection; update collection change notification handler 
//        private void SetPathParameterCollection(PathParameterCollection parameters) 
//        {
//            if (_parameters != null) 
//            {
//                _parameters.CollectionChanged -= new NotifyCollectionChangedEventHandler(ParameterCollectionChanged);
//            }
//            _parameters = parameters; 
//            if (_parameters != null)
//            { 
//                _parameters.CollectionChanged += new NotifyCollectionChangedEventHandler(ParameterCollectionChanged); 
//            }
//        } 
//
//        // path parameters were added/removed, update SourceValueInfo
//        private void ParameterCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
//        { 
//            PrepareSourceValueInfo(null);
//        } 
// 
//
//        // resolve the property names and path parameters early, if possible 
//        void ResolvePathParts(ITypeDescriptorContext typeDescriptorContext)
//        {
//            bool throwOnError = (typeDescriptorContext != null);
// 
//            object context = null;
// 
//            TypeConvertContext typeConvertContext = typeDescriptorContext as TypeConvertContext; 
//            if( typeConvertContext != null )
//                context = typeConvertContext.ParserContext; 
//
//            if (context == null)
//                context = typeDescriptorContext;
//            _earlyBoundPathParts = new object[Length]; 
//
//            for (int level=Length-1; level>=0; --level) 
//            { 
//                if (_arySVI[level].type == SourceValueType.Property)
//                { 
//                    string name = _arySVI[level].name;
//                    if (IsPropertyReference(name))
//                    {
//                        object accessor = ResolvePropertyName(name, null, null, context, throwOnError); 
//                        _earlyBoundPathParts[level] = accessor;
// 
//                        if (accessor != null) 
//                        {
//                            _arySVI[level].propertyName = GetPropertyName(accessor); 
//                        }
//                    }
//                    else
//                    { 
//                        _arySVI[level].propertyName = name;
//                    } 
//                } 
//                else if (_arySVI[level].type == SourceValueType.Indexer)
//                { 
//                    IndexerParameterInfo[] indexerParams = ResolveIndexerParams(_arySVI[level].paramList, context, throwOnError);
//                    _earlyBoundPathParts[level] = indexerParams;
//                    _arySVI[level].propertyName = Binding.IndexerName;
//                } 
//            }
//        } 
// 
//        // resolve a single DP name
//        object ResolvePropertyName(string name, object item, Type ownerType, object context, bool throwOnError) 
//        {
//            string propertyName = name;
//            int index;
// 
//            // first see if the name is an index into the parameter list
//            if (IsParameterIndex(name, out index)) 
//            { 
//                if (0 <= index && index < PathParameters.Count)
//                { 
//                    object accessor = PathParameters[index];
//                    // always throw if the accessor isn't valid - this error cannot
//                    // be corrected later on.
//                    if (!IsValidAccessor(accessor)) 
//                        throw new InvalidOperationException(SR.Get(SRID.PropertyPathInvalidAccessor,
//                                    (accessor != null) ? accessor.GetType().FullName : "null")); 
// 
//                    return accessor;
//                } 
//                else if (throwOnError)
//                    throw new InvalidOperationException(SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count));
//                else return null;
//            } 
//
//            // handle attached-property syntax:  (TypeName.PropertyName) 
//            if (IsPropertyReference(name)) 
//            {
//                name = name.Substring(1, name.Length-2); 
//
//                int lastIndex = name.LastIndexOf('.');
//                if (lastIndex >= 0)
//                { 
//                    // attached property - get the owner type
//                    propertyName = name.Substring(lastIndex + 1).Trim(); 
//                    string ownerName = name.Substring(0, lastIndex).Trim(); 
//                    ownerType = GetTypeFromName(ownerName, context);
//                    if (ownerType == null && throwOnError) 
//                        throw new InvalidOperationException(SR.Get(SRID.PropertyPathNoOwnerType, ownerName));
//                }
//                else
//                { 
//                    // simple name in parens - just strip the parens
//                    propertyName = name; 
//                } 
//            }
// 
//            if (ownerType != null)
//            {
//                // get an appropriate accessor from the ownerType and propertyName.
//                // We prefer accessors in a certain order, defined below. 
//                object accessor;
// 
//                // 1. DependencyProperty on the given type. 
//                accessor = DependencyProperty.FromName(propertyName, ownerType);
// 
//                // 2. PropertyDescriptor from item's custom lookup.
//                // When the item implements custom properties, we must use them.
//                if (accessor == null && item is ICustomTypeDescriptor)
//                { 
//                    accessor = TypeDescriptor.GetProperties(item)[propertyName];
//                } 
// 
//                // 3a. PropertyInfo, when item exposes INotifyPropertyChanged.
//                // 3b. PropertyInfo, when item is a DependencyObject (bug 1373351). 
//                // This uses less working set than PropertyDescriptor, and we don't need
//                // the ValueChanged pattern.  (If item is a DO and wants to raise
//                // change notifications, it should make the property a DP.)
//                if (accessor == null && 
//                    (item is INotifyPropertyChanged || item is DependencyObject))
//                { 
//                    accessor = GetPropertyHelper(ownerType, propertyName); 
//                }
// 
//                // 4. PropertyDescriptor (obtain from item - this is reputedly
//                // slower than obtaining from type, but the latter doesn't
//                // discover properties obtained from TypeDescriptorProvider -
//                // see bug 1713000). 
//                // This supports the [....] ValueChanged pattern.
//                if (accessor == null && item != null) 
//                { 
//                    accessor = TypeDescriptor.GetProperties(item)[propertyName];
//                } 
//
//                // 5. PropertyInfo.
//                if (accessor == null)
//                { 
//                    accessor = GetPropertyHelper(ownerType, propertyName);
//                } 
// 
//                // 6. IDynamicMetaObjectProvider
//                // This supports the DLR's dynamic objects 
//                if (accessor == null && SystemCoreHelper.IsIDynamicMetaObjectProvider(item))
//                {
//                    accessor = SystemCoreHelper.NewDynamicPropertyAccessor(item.GetType(), propertyName);
//                } 
//
//                if (accessor == null && throwOnError) 
//                    throw new InvalidOperationException(SR.Get(SRID.PropertyPathNoProperty, ownerType.Name, propertyName)); 
//
//                return accessor; 
//            }
//
//            return null;
//        } 
//
//        private PropertyInfo GetPropertyHelper(Type ownerType, string propertyName) 
//        { 
//            PropertyInfo result = null;
//            bool enumerateBaseClasses = false; 
//            bool returnIndexerProperty = false;
//
//            try
//            { 
//                result = ownerType.GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.FlattenHierarchy);
//            } 
//            catch (AmbiguousMatchException) 
//            {
//                // this happens when ownerType hides a base class property with 'new' 
//                // (it also happens by mistake when a non-generic class overrides
//                // a generic base class property - see DDB 105201).
//                // We'll resolve this by returning the most specific property.
//                enumerateBaseClasses = true; 
//            }
// 
//            if (enumerateBaseClasses) 
//            {
//                try 
//                {
//                    for (result = null;  result == null && ownerType != null;  ownerType = ownerType.BaseType)
//                    {
//                        result = ownerType.GetProperty(propertyName, BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public); 
//                    }
//                } 
//                catch (AmbiguousMatchException) 
//                {
//                    // if a single class declares the property twice, it must be 
//                    // an indexed property (with different index parameters)
//                    returnIndexerProperty = true;
//                }
//            } 
//
//            if (PropertyPathWorker.IsIndexedProperty(result)) 
//            { 
//                // the property is indexed (this can't happen in C#, but can in VB)
//                returnIndexerProperty = true; 
//            }
//
//            if (returnIndexerProperty)
//            { 
//                result = IndexerPropertyInfo.Instance;
//            } 
// 
//            return result;
//        } 
//
//        // resolve indexer parameters
//        IndexerParameterInfo[] ResolveIndexerParams(FrugalObjectList<IndexerParamInfo> paramList, object context, bool throwOnError)
//        { 
//            IndexerParameterInfo[] args = new IndexerParameterInfo[paramList.Count];
//            for (int i = 0; i < args.Length; ++i) 
//            { 
//                if (String.IsNullOrEmpty(paramList[i].parenString))
//                { 
//                    // no paren string "foo" - value is (uninterpreted) value string
//                    args[i].value = paramList[i].valueString;
//                }
//                else if (String.IsNullOrEmpty(paramList[i].valueString)) 
//                {
//                    // no value string "(2)" - value comes from PathParameter list 
//                    int index; 
//                    if (Int32.TryParse( paramList[i].parenString.Trim(),
//                                        NumberStyles.Integer, 
//                                        TypeConverterHelper.InvariantEnglishUS.NumberFormat,
//                                        out index))
//                    {
//                        if (0 <= index && index < PathParameters.Count) 
//                        {
//                            object value = PathParameters[index]; 
//                            if (value != null) 
//                            {
//                                args[i].value = value; 
//                                args[i].type = value.GetType();
//                            }
//                            else if (throwOnError)
//                            { 
//                                // info.value will still be "(n)"
//                                throw new InvalidOperationException(SR.Get(SRID.PathParameterIsNull, index)); 
//                            } 
//                        }
//                        else if (throwOnError) 
//                            throw new InvalidOperationException(SR.Get(SRID.PathParametersIndexOutOfRange, index, PathParameters.Count));
//                    }
//                    else
//                    { 
//                        // parens didn't hold an integer "(abc)" - value is (uninterpreted) paren string
//                        // [this could be considered an error, but the original code 
//                        // treated it like this, so to preserve compatibility...] 
//                        args[i].value = "(" + paramList[i].parenString + ")";
//                    } 
//                }
//                else
//                {
//                    // both strings appear "(Double)3.14159" - value is type-converted from value string 
//                    args[i].type = GetTypeFromName(paramList[i].parenString, context);
//                    if (args[i].type != null) 
//                    { 
//                        object value = GetTypedParamValue(paramList[i].valueString.Trim(), args[i].type, throwOnError);
//                        if (value != null) 
//                        {
//                            args[i].value = value;
//                        }
//                        else 
//                        {
//                            if (throwOnError) 
//                                throw new InvalidOperationException(SR.Get(SRID.PropertyPathIndexWrongType, paramList[i].parenString, paramList[i].valueString)); 
//                            args[i].type = null;
//                        } 
//                    }
//                    else
//                    {
//                        // parens didn't hold a type name "(abc)xyz" - value is (uninterpreted) string 
//                        // [this could be considered an error, but the original code
//                        // treated it like this, so to preserve compatibility...] 
//                        args[i].value = "(" + paramList[i].parenString + ")" + paramList[i].valueString; 
//                    }
//                } 
//            }
//            return args;
//        }
// 
//        object GetTypedParamValue(string param, Type type, bool throwOnError)
//        { 
//            object value = null; 
//            if (type == typeof(string))
//                return param; 
//
//            TypeConverter tc = TypeDescriptor.GetConverter(type);
//
//            if (tc != null && tc.CanConvertFrom(typeof(string))) 
//            {
//                // PreSharp uses message numbers that the C# compiler doesn't know about. 
//                // Disable the C# complaints, per the PreSharp documentation. 
//                #pragma warning disable 1634, 1691
// 
//                // PreSharp complains about catching NullReference (and other) exceptions.
//                // It doesn't recognize that IsCritical[Application]Exception() handles these correctly.
//                #pragma warning disable 56500
// 
//                try
//                { 
//                    value = tc.ConvertFromString(null, CultureInfo.InvariantCulture, 
//                                                    param);
//                    // technically the converter can return null as a legitimate 
//                    // value.  In practice, this seems always to be a sign that
//                    // the conversion didn't work (often because the converter
//                    // reverts to the default behavior - returning null).  So
//                    // we treat null as an "error", and keep trying for something 
//                    // better.  (See bug 861966)
//                } 
//                // catch all exceptions.  We simply want to move on to the next 
//                // candidate indexer.
//                catch (Exception ex) 
//                {
//                    if (CriticalExceptions.IsCriticalApplicationException(ex) || throwOnError)
//                        throw;
//                } 
//                catch
//                { 
//                    if (throwOnError) 
//                        throw;
//                } 
//
//                #pragma warning restore 56500
//                #pragma warning restore 1634, 1691
//            } 
//
//            if (value == null && type.IsAssignableFrom(typeof(string))) 
//            { 
//                value = param;
//            } 
//            return value;
//        }
//
// 
//        // Return the type named by the given name
//        Type GetTypeFromName(string name, object context) 
//        { 
//            // use the parser context, if available.  This allows early resolution.
//            // [....] 5/8/2009 - I believe with System.Xaml there is never an old parserContext here. 
//            // But cannot be sure.
//            ParserContext parserContext = context as ParserContext;
//            if (parserContext != null)
//            { 
//                // Find the namespace prefix
//                string nsPrefix; 
//                int nsIndex = name.IndexOf(':'); 
//                if (nsIndex == -1)
//                    nsPrefix = string.Empty; 
//                else
//                {
//                    // Found a namespace prefix separator, so create replacement _pathString.
//                    // String processing - split "foons" from "BarClass.BazProp" 
//                    nsPrefix = name.Substring(0, nsIndex).TrimEnd();
//                    name = name.Substring(nsIndex + 1).TrimStart(); 
//                } 
//
//                // Find the namespace URI, even if its the default one 
//                string namespaceURI = parserContext.XmlnsDictionary[nsPrefix];
//                if (namespaceURI == null)
//                {
//                    throw new ArgumentException(SR.Get(SRID.ParserPrefixNSProperty, nsPrefix, name)); 
//                }
// 
//                TypeAndSerializer typeAndSerializer = parserContext.XamlTypeMapper.GetTypeOnly(namespaceURI, name); 
//
//                return (typeAndSerializer != null) ? typeAndSerializer.ObjectType : null; 
//            }
//
//            else
//            { 
//                if (context is IServiceProvider)
//                { 
// 
//                    IXamlTypeResolver xtr = (context as IServiceProvider).GetService(typeof(IXamlTypeResolver)) as IXamlTypeResolver;
// 
//                    if (xtr != null)
//                    {
//                        return xtr.Resolve(name);
//                    } 
//                }
// 
//                IValueSerializerContext serializerContext = context as IValueSerializerContext; 
//                if (serializerContext != null)
//                { 
//                    ValueSerializer typeSerializer = ValueSerializer.GetSerializerFor(typeof(Type), serializerContext);
//                    if (typeSerializer != null)
//                        return typeSerializer.ConvertFromString(name, serializerContext) as Type;
//                } 
//            }
// 
//            // if there's no parser or serializer context, use the tree context 
//            DependencyObject hostElement = context as DependencyObject;
//            if (hostElement == null) 
//            {
//                hostElement = new DependencyObject();   // at least pick up the default namespaces
//            }
// 
//            var wpfSharedSchemaContext = XamlReader.BamlSharedSchemaContext;
//            Type type = wpfSharedSchemaContext.ResolvePrefixedNameWithAdditionalWpfSemantics(name, hostElement); 
//            return type; 
//        }
// 
//        // return true if the name has the form:  (property)
//        internal static bool IsPropertyReference(string name)
//        {
//            return (name != null && name.Length > 1 && name[0] == '(' && (name[name.Length - 1] == ')')); 
//        }
// 
//        // return true if the name has the form:  (nnn) 
//        internal static bool IsParameterIndex(string name, out int index)
//        { 
//            if (IsPropertyReference(name))
//            {
//                name = name.Substring(1, name.Length - 2);
//            } 
//            else
//            { 
//                index = -1; 
//                return false;
//            } 
//
//            return Int32.TryParse( name,
//                                NumberStyles.Integer,
//                                TypeConverterHelper.InvariantEnglishUS.NumberFormat, 
//                                out index);
//        } 
// 
//        // determine if an object is one of the accessors we support
//        static bool IsValidAccessor(object accessor) 
//        {
//            return  accessor is DependencyProperty ||
//                    accessor is PropertyInfo  ||
//                    accessor is PropertyDescriptor || 
//                    accessor is DynamicObjectAccessor;
//        } 
// 
//        // determine the name of an accessor
//        static string GetPropertyName(object accessor) 
//        {
//            DependencyProperty dp;
//            PropertyInfo pi;
//            PropertyDescriptor pd; 
//            DynamicObjectAccessor doa;
// 
//            if ((dp = accessor as DependencyProperty) != null) 
//                return dp.Name;
//            else if ((pi = accessor as PropertyInfo) != null) 
//                return pi.Name;
//            else if ((pd = accessor as PropertyDescriptor) != null)
//                return pd.Name;
//            else if ((doa = accessor as DynamicObjectAccessor) != null) 
//                return doa.PropertyName;
//            else 
//            { 
//                Invariant.Assert(false, "Unknown accessor type");
//                return null; 
//            }
//        }
//
//        //------------------------------------------------------ 
//        //
//        //  Private Enums, Structs, Constants 
//        // 
//        //-----------------------------------------------------
// 
//        const string SingleStepPath = "(0)";
//        static readonly Char[] s_comma = new Char[]{','};
//
//        //------------------------------------------------------ 
//        //
//        //  Private data 
//        // 
//        //-----------------------------------------------------
// 
//        string _path = String.Empty;        // the path
//        PathParameterCollection _parameters; // list of DPs to inject into the path
//
//        SourceValueInfo[] _arySVI;          // static description of each level in the path 
//        string _lastError = String.Empty;   // most recent error message
//        object[] _earlyBoundPathParts;      // accessors and indexer parameters that got resolved early 
//        PropertyPathWorker _singleWorker;   // shared worker - used in "target" mode 
//
//        //----------------------------------------------------- 
//        //
//        //  Private types
//        //
//        //----------------------------------------------------- 
//        private class PathParameterCollection : ObservableCollection<object>
//        { 
//            public PathParameterCollection() 
//            {
//            } 
//
//            public PathParameterCollection(object[] parameters)
//            {
//                IList<object> items = Items; 
//                foreach (object o in parameters)
//                { 
//                    items.Add(o); 
//                }
//            } 
//        }
//    }
//}