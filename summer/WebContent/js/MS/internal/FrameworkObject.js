/**
 * FrameworkObject
 */

define(["dojo/_base/declare", "system/Type", "windows/ContentOperations"], 
		function(declare, Type, ContentOperations){
	
	var FrameworkElement = null;
	function EnsureFrameworkElement(){
		if(FrameworkElement == null){
			FrameworkElement = using("windows/FrameworkElement");
		}
		return FrameworkElement;
	}
	
	var FrameworkContentElement = null;
	function EnsureFrameworkContentElement(){
		if(FrameworkContentElement == null){
			FrameworkContentElement = using("windows/FrameworkContentElement");
		}
		return FrameworkContentElement;
	}
	
	var FrameworkObject = declare("FrameworkObject", Object,{
		constructor:function( /*DependencyObject*/ fe, fce)
        {
			if(arguments.length ==1){
	            this._do = fe;
	            
	            if (EnsureFrameworkElement().DType.IsInstanceOfType(fe)) 
	            {
	                this._fe = /*(FrameworkElement)*/fe; 
	                this._fce = null;
	            }
	            else if (EnsureFrameworkContentElement().DType.IsInstanceOfType(fe))
	            { 
	            	this._fe = null;
	            	this._fce = /*(FrameworkContentElement)*/fe; 
	            } 
	            else
	            { 
	            	this._fe = null;
	            	this._fce = null;
	            }
			}else if(arguments.length ==2){
	            this._fe = fe; 
	            this._fce = fce;

	            if (fe != null)
	            	this._do = fe; 
	            else
	            	this._do = fce; 
			}
//
//        /*internal*/ public FrameworkObject(DependencyObject d, bool throwIfNeither) 
//            : this(d) 
//        {
//            if (throwIfNeither && _fe == null && _fce == null) 
//            {
//                object arg = (d != null) ? (object)d.GetType() : (object)"NULL";
//                throw new InvalidOperationException(SR.Get(SRID.MustBeFrameworkDerived, arg));
//            } 
//        }
// 
//        /*internal*/ public FrameworkObject(FrameworkElement fe, FrameworkContentElement fce) 
//        {
//            _fe = fe; 
//            _fce = fce;
//
//            if (fe != null)
//                _do = fe; 
//            else
//                _do = fce; 
//        } 

		},
		
//		/*internal*/ public void 
		Reset:function(/*DependencyObject*/ d) 
        {
            this._do = d;

            if (EnsureFrameworkElement().DType.IsInstanceOfType(d)) 
            {
            	this._fe = /*(FrameworkElement)*/d; 
            	this._fce = null; 
            }
            else if (EnsureFrameworkContentElement().DType.IsInstanceOfType(d)) 
            {
            	this._fe = null;
            	this._fce = /*(FrameworkContentElement)*/d;
            } 
            else
            { 
            	this._fe = null; 
            	this._fce = null;
            } 
        },
        
//        /*internal*/ public static FrameworkObject 
        GetContainingFrameworkElement:function(/*DependencyObject*/ current)
        {
            /*FrameworkObject*/
        	var fo = new FrameworkObject(current); 

            while (!fo.IsValid && fo.DO != null) 
            { 
                // The current object is neither a FrameworkElement nor a
                // FrameworkContentElement.  We will now walk the "core" 
                // tree looking for one.
                /*Visual*/var visual;
//                Visual3D visual3D;
                /*ContentElement*/var ce; 

                if ((visual = fo.DO instanceof Visual ? fo.DO : null) != null) 
                { 
                    fo.Reset(VisualTreeHelper.GetParent(visual));
                } 
                else if ((ce = fo.DO instanceof ContentElement ? fo.DO : null) != null)
                {
                    fo.Reset(ContentOperations.GetParent(ce));
                } 
//                else if ((visual3D = fo.DO as Visual3D) != null)
//                { 
//                    fo.Reset(VisualTreeHelper.GetParent(visual3D)); 
//                }
                else 
                {
                    // The parent could be an application.
                    fo.Reset(null);
                } 
            }
 
            return fo; 
        },
        
//        /*internal*/ public void 
        ChangeLogicalParent:function(/*DependencyObject*/ newParent)
        { 
            if (this.IsFE) 
            {
            	this._fe.ChangeLogicalParent(newParent); 
            }
            else if (this.IsFCE)
            {
            	this._fce.ChangeLogicalParent(newParent); 
            }
        },
 
//        /*internal*/ public void 
        BeginInit:function()
        { 
            if( this.IsFE )
            {
            	this._fe.BeginInit();
            } 
            else if( this.IsFCE )
            { 
            	this._fce.BeginInit(); 
            }
            else 
            {
            	this.UnexpectedCall();
            }
        },
        

//        /*internal*/ public void 
        EndInit:function() 
        { 
            if( this.IsFE )
            { 
            	this._fe.EndInit();
            }
            else if( this.IsFCE )
            { 
            	this._fce.EndInit();
            } 
            else 
            {
            	this.UnexpectedCall(); 
            }
        },

//        /*internal*/ public object 
        FindName:function(/*string*/ name, /*out DependencyObject scopeOwner*/scopeOwnerOut) 
        {
            if (this.IsFE) 
            { 
                return this._fe.FindName(name, /*out scopeOwner*/scopeOwnerOut);
            } 
            else if (this.IsFCE)
            {
                return this._fce.FindName(name, /*out scopeOwner*/scopeOwnerOut);
            } 
            else
            { 
            	scopeOwnerOut.scopeOwner = null; 
                return null;
            } 
        },

        // returns the parent in the "prefer-visual" sense.
        // That is, this method 
        //  1. prefers visual to logical parent (with InheritanceContext last)
        //  2. does not see parents whose InheritanceBehavior forbids it 
        // Call with force=true to get the parent even if the current object doesn't 
        // allow it via rule 2.
//        /*internal*/ public FrameworkObject 
        GetPreferVisualParent:function(/*bool*/ force) 
        {
            // If we're not allowed to move up from here, return null
            /*InheritanceBehavior*/var inheritanceBehavior = force ? InheritanceBehavior.Default : this.InheritanceBehavior;
            if (inheritanceBehavior != InheritanceBehavior.Default) 
            {
                return new FrameworkObject(null); 
            } 

            /*FrameworkObject*/var parent = this.GetRawPreferVisualParent(); 

            // make sure the parent allows itself to be found
            switch (parent.InheritanceBehavior)
            { 
                case InheritanceBehavior.SkipToAppNow:
                case InheritanceBehavior.SkipToThemeNow: 
                case InheritanceBehavior.SkipAllNow: 
                    parent.Reset(null);
                    break; 

                default:
                    break;
            } 

            return parent; 
        },

        // helper used by GetPreferVisualParent - doesn't check InheritanceBehavior 
//        private FrameworkObject 
        GetRawPreferVisualParent:function()
        {
            // the null object has no parent
            if (this._do == null) 
            {
                return new FrameworkObject(null); 
            } 

            // get visual parent 
            /*DependencyObject*/var visualParent;
            if (this.IsFE)
            {
                visualParent = VisualTreeHelper.GetParent(this._fe); 
            }
            else if (this.IsFCE) 
            { 
                visualParent = null;
            } 
            else if (_do != null)
            {
                /*Visual*/var visual = this._do instanceof Visual ? this._do : null;
                visualParent = (visual != null) ? VisualTreeHelper.GetParent(visual) : null; 
            }
            else 
            { 
                visualParent = null;
            } 

            if (visualParent != null)
            {
                return new FrameworkObject(visualParent); 
            }
 
            // if no visual parent, get logical parent 
            /*DependencyObject*/var logicalParent;
            if (this.IsFE) 
            {
                logicalParent = this._fe.Parent;
            }
            else if (this.IsFCE) 
            {
                logicalParent = this._fce.Parent; 
            } 
            else if (this._do != null)
            { 
                /*ContentElement*/var ce = this._do instanceof ContentElement ? this._do : null;
                logicalParent = (ce != null) ? ContentOperations.GetParent(ce) : null;
            }
            else 
            {
                logicalParent = null; 
            } 

            if (logicalParent != null) 
            {
                return new FrameworkObject(logicalParent);
            }
 
            // if no logical or visual parent, get "uiCore" parent
            /*UIElement*/var uiElement; 
            /*ContentElement*/var contentElement; 
            /*DependencyObject*/var uiCoreParent;
            if ((uiElement = this._do instanceof UIElement ? this._do : null) != null) 
            {
                uiCoreParent = uiElement.GetUIParentCore();
            }
            else if ((contentElement = this._do instanceof ContentElement ? this._do : null) != null) 
            {
                uiCoreParent = contentElement.GetUIParentCore(); 
            } 
            else
            { 
                uiCoreParent = null;
            }

            if (uiCoreParent != null) 
            {
                return new FrameworkObject(uiCoreParent); 
            } 

            // if all else fails, use InheritanceContext 
            return new FrameworkObject(this._do.InheritanceContext);
        },

//        /*internal*/ public void 
        RaiseEvent:function(/*RoutedEventArgs*/ args) 
        {
            if (this.IsFE) 
            { 
            	this._fe.RaiseEvent(args);
            } 
            else if (this.IsFCE)
            {
            	this._fce.RaiseEvent(args);
            } 
        },
 
//        /*internal*/ public void 
        OnLoaded:function(/*RoutedEventArgs*/ args) 
        {
            if (this.IsFE) 
            {
            	this._fe.OnLoaded(args);
            }
            else if (this.IsFCE) 
            {
            	this._fce.OnLoaded(args); 
            } 
        },
 
//        /*internal*/ public void 
        OnUnloaded:function(/*RoutedEventArgs*/ args)
        {
            if (this.IsFE)
            { 
            	this._fe.OnUnloaded(args);
            } 
            else if (this.IsFCE) 
            {
            	this._fce.OnUnloaded(args); 
            }
        },

//        /*internal*/ public void 
        ChangeSubtreeHasLoadedChangedHandler:function(/*DependencyObject*/ mentor) 
        {
            if (this.IsFE) 
            { 
            	this._fe.ChangeSubtreeHasLoadedChangedHandler(mentor);
            } 
            else if (this.IsFCE)
            {
            	this._fce.ChangeSubtreeHasLoadedChangedHandler(mentor);
            } 
        },
 
//        /*internal*/ public void 
        OnInheritedPropertyChanged:function(/*ref InheritablePropertyChangeInfo*/ info) 
        {
            if (this.IsFE) 
            {
            	this._fe.RaiseInheritedPropertyChangedEvent(/*ref*/ info);
            }
            else if (this.IsFCE) 
            {
            	this._fce.RaiseInheritedPropertyChangedEvent(/*ref*/ info); 
            } 
        },
 
        // Set the ShouldLookupImplicitStyles flag on the current
        // node if the parent has it set to true.
//        /*internal*/ public void 
        SetShouldLookupImplicitStyles:function()
        { 
            if (!this.ShouldLookupImplicitStyles)
            { 
                /*FrameworkObject*/var parent = this.FrameworkParent; 
                if (parent.IsValid && parent.ShouldLookupImplicitStyles)
                { 
                    this.ShouldLookupImplicitStyles = true;
                }
            }
        },
        
//        void 
        UnexpectedCall:function() 
        { 
//            Invariant.Assert(false, "Call to FrameworkObject expects either FE or FCE");
        	throw new Error("Call to FrameworkObject expects either FE or FCE");
        } 
        
	});
	
	Object.defineProperties(FrameworkObject.prototype,{
//	       /*internal*/ public FrameworkElement           
		FE:  { get:function() { return this._fe; } },
//	        /*internal*/ public FrameworkContentElement    
		FCE: { get:function() { return this._fce; } },
//	        /*internal*/ public DependencyObject           
		DO:  { get:function() { return this._do; } }, 

//	        /*internal*/ public bool   
		IsFE:    { get:function() { return (this._fe != null); } },
//	        /*internal*/ public bool   
		IsFCE:   { get:function() { return (this._fce != null); } },
//	        /*internal*/ public bool   
		IsValid: { get:function() { return (this._fe != null || this._fce != null); } }, 

	        // logical parent
//	        /*internal*/ public DependencyObject 
		Parent:
		{
            get:function() 
            {
                if (this.IsFE) 
                { 
                    return this._fe.Parent;
                } 
                else if (this.IsFCE)
                {
                    return this._fce.Parent;
                } 
                else
                { 
                    return null; 
                }
            } 
        },

//	        /*internal*/ public int 
		TemplateChildIndex:
        { 
            get:function()
            { 
                if (this.IsFE) 
                {
                    return this._fe.TemplateChildIndex; 
                }
                else if (this.IsFCE)
                {
                    return this._fce.TemplateChildIndex; 
                }
                else 
                { 
                    return -1;
                } 
            }
        },

//	        /*internal*/ public DependencyObject 
        TemplatedParent: 
        {
            get:function() 
            { 
                if (this.IsFE)
                { 
                    return this._fe.TemplatedParent;
                }
                else if (this.IsFCE)
                { 
                    return this._fce.TemplatedParent;
                } 
                else 
                {
                    return null; 
                }
            }
        },
	 
//        /*internal*/ public Style 
        ThemeStyle:
        { 
            get:function()
            {
                if (this.IsFE) 
                {
                    return this._fe.ThemeStyle;
                }
                else if (this.IsFCE) 
                {
                    return this._fce.ThemeStyle; 
                } 
                else
                { 
                    return null;
                }
            }
        }, 

//        /*internal*/ public XmlLanguage 
        Language:
        { 
            get:function()
            { 
                if (this.IsFE)
                {
                    return this._fe.Language;
                } 
                else if (this.IsFCE)
                { 
                    return this._fce.Language; 
                }
                else 
                {
                    return null;
                }
            } 
        },
	 
//        /*internal*/ public FrameworkTemplate 
        TemplateInternal: 
        {
            get:function() 
            {
                if (this.IsFE)
                {
                    return this._fe.TemplateInternal; 
                }
                else 
                { 
                    return null;
                } 
            }
        },

//        /*internal*/ public FrameworkObject 
        FrameworkParent: 
        {
            get:function() 
            { 
                if (this.IsFE)
                { 
                    /*DependencyObject*/
                	var parent = this._fe.ContextVerifiedGetParent();

                    // NOTE: Logical parent can only be an FE, FCE
                    if (parent != null) 
                    {
//                        Invariant.Assert(parent is FrameworkElement || parent is FrameworkContentElement); 
 
                        if (this._fe.IsParentAnFE)
                        { 
                            return new FrameworkObject(/*(FrameworkElement)*/parent, null);
                        }
                        else
                        { 
                            return new FrameworkObject(null, /*(FrameworkContentElement)*/parent);
                        } 
                    } 

                    // This is when current does not have a logical parent that is an fe or fce 
                    /*FrameworkObject*/
                    var foParent = this.GetContainingFrameworkElement(this._fe.InternalVisualParent);
                    if (foParent.IsValid)
                    {
                        return foParent; 
                    }
 
                    // allow subclasses to override (e.g. Popup) 
                    foParent.Reset(this._fe.GetUIParentCore());
                    if (foParent.IsValid) 
                    {
                        return foParent;
                    }
 
                    // try InheritanceContext
                    foParent.Reset(Helper.FindMentor(this._fe.InheritanceContext)); 
                    return foParent; 
                }
                else if (this.IsFCE) 
                {
                    /*DependencyObject*/
                	var parent = this._fce.Parent;

                    // NOTE: Logical parent can only be an FE, FCE 
                    if (parent != null)
                    { 
//                        Invariant.Assert(parent is FrameworkElement || parent is FrameworkContentElement); 

                        if (this._fce.IsParentAnFE) 
                        {
                            return new FrameworkObject(/*(FrameworkElement)*/parent, null);
                        }
                        else 
                        {
                            return new FrameworkObject(null, /*(FrameworkContentElement)*/parent); 
                        } 
                    }
 
                    // This is when current does not have a logical parent that is an fe or fce
                    parent = ContentOperations.GetParent(/*(ContentElement)*/this._fce);
                    /*FrameworkObject*/var foParent = this.GetContainingFrameworkElement(parent);
                    if (foParent.IsValid) 
                    {
                        return foParent; 
                    } 

                    // try InheritanceContext 
                    foParent.Reset(Helper.FindMentor(this._fce.InheritanceContext));
                    return foParent;
                }
                else 
                {
                    return this.GetContainingFrameworkElement(this._do); 
                } 
            }
        },
        
        // Style property
//        /*internal*/ public Style 
        Style:
        {
            get:function() 
            {
                if (this.IsFE) 
                { 
                    return this._fe.Style;
                } 
                else if (this.IsFCE)
                {
                    return this._fce.Style;
                } 
                else
                { 
                    return null; 
                }
            },
            set:function(value)
            {
                if (this.IsFE)
                { 
                	this._fe.Style = value;
                } 
                else if (this.IsFCE) 
                {
                	this._fce.Style = value; 
                }
            }
        },
 
        // IsStyleSetFromGenerator property
//        /*internal*/ public bool 
        IsStyleSetFromGenerator: 
        { 
            get:function()
            { 
                if (this.IsFE)
                {
                    return this._fe.IsStyleSetFromGenerator;
                } 
                else if (this.IsFCE)
                { 
                    return this._fce.IsStyleSetFromGenerator; 
                }
                else 
                {
                    return false;
                }
            }, 
            set:function(value)
            { 
                if (this.IsFE) 
                {
                	this._fe.IsStyleSetFromGenerator = value; 
                }
                else if (this.IsFCE)
                {
                	this._fce.IsStyleSetFromGenerator = value; 
                }
            } 
        },

 
        // returns the effective parent, whether visual, logical,
        // inheritance context, etc.
//        /*internal*/ public DependencyObject 
        EffectiveParent:
        { 
            get:function()
            { 
                /*DependencyObject*/var parent; 

                if (this.IsFE) 
                {
                    parent = VisualTreeHelper.GetParent(this._fe);
                }
                else if (this.IsFCE) 
                {
                    parent = this._fce.Parent; 
                } 
                else
                { 
                    /*Visual*/var visual;
//                    Visual3D visual3D;
                    /*ContentElement*/var ce;
 
                    if ((visual = this._do instanceof Visual ? this._do : null) != null)
                    { 
                        parent = VisualTreeHelper.GetParent(visual); 
                    }
                    else if ((ce = this._do instanceof ContentElement  ? this._do : null ) != null) 
                    {
                        parent = ContentOperations.GetParent(ce);
                    }
//                    else if ((visual3D = this._do as Visual3D) != null) 
//                    {
//                        parent = VisualTreeHelper.GetParent(visual3D); 
//                    } 
                    else
                    { 
                        parent = null;
                    }
                }
 
                if (parent == null && this._do != null)
                { 
                    parent = this._do.InheritanceContext; 
                }
 
                return parent;
            }
        },
 
//        /*internal*/ public FrameworkObject 
        PreferVisualParent:
        { 
            get:function() { return GetPreferVisualParent(false); } 
        },
 
//        /*internal*/ public bool 
        IsLoaded:
        {
            get:function()
            { 
                if (this.IsFE)
                { 
                    return this._fe.IsLoaded; 
                }
                else if (this.IsFCE) 
                {
                    return this._fce.IsLoaded;
                }
                else 
                {
                    return BroadcastEventHelper.IsParentLoaded(this._do); 
                } 
            }
        },

//        /*internal*/ public bool 
        IsInitialized:
        {
            get:function() 
            {
                if (this.IsFE) 
                { 
                    return this._fe.IsInitialized;
                } 
                else if (this.IsFCE)
                {
                    return this._fce.IsInitialized;
                } 
                else
                { 
                    return true; 
                }
            } 
        },

//        /*internal*/ public bool 
        ThisHasLoadedChangeEventHandler:
        { 
            get:function()
            { 
                if (this.IsFE) 
                {
                    return this._fe.ThisHasLoadedChangeEventHandler; 
                }
                else if (this.IsFCE)
                {
                    return this._fce.ThisHasLoadedChangeEventHandler; 
                }
                else 
                { 
                    return false;
                } 
            }
        },

//        /*internal*/ public bool 
        SubtreeHasLoadedChangeHandler:
        {
            get:function() 
            { 
                if (this.IsFE)
                { 
                    return this._fe.SubtreeHasLoadedChangeHandler;
                }
                else if (this.IsFCE)
                { 
                    return this._fce.SubtreeHasLoadedChangeHandler;
                } 
                else 
                {
                    return false; 
                }
            },
            set:function(value)
            { 
                if (this.IsFE)
                { 
                	this._fe.SubtreeHasLoadedChangeHandler = value; 
                }
                else if (this.IsFCE) 
                {
                	this._fce.SubtreeHasLoadedChangeHandler = value;
                }
            } 
        },
 
//        /*internal*/ public InheritanceBehavior 
        InheritanceBehavior: 
        {
            get:function() 
            {
                if (this.IsFE)
                {
                    return this._fe.InheritanceBehavior; 
                }
                else if (this.IsFCE) 
                { 
                    return this._fce.InheritanceBehavior;
                } 
                else
                {
                    return InheritanceBehavior.Default;
                } 
            }
        }, 
 
//        /*internal*/ public bool 
        StoresParentTemplateValues:
        { 
            get:function()
            {
                if (this.IsFE)
                { 
                    return this._fe.StoresParentTemplateValues;
                } 
                else if (this.IsFCE) 
                {
                    return this._fce.StoresParentTemplateValues; 
                }
                else
                {
                    return false; 
                }
            },
            set:function(value) 
            {
                if (this.IsFE) 
                {
                	this._fe.StoresParentTemplateValues = value;
                }
                else if (this.IsFCE) 
                {
                	this._fce.StoresParentTemplateValues = value; 
                } 
            }
        }, 


//        /*internal*/ public bool 
        HasResourceReference:
        { 
            /* not used (yet)
            get 
            { 
                if (IsFE)
                { 
                    return _fe.HasResourceReference;
                }
                else if (IsFCE)
                { 
                    return _fce.HasResourceReference;
                } 
                else 
                {
                    return false; 
                }
            }
            */
            set:function(value) 
            {
                if (this.IsFE) 
                { 
                	this._fe.HasResourceReference = value;
                } 
                else if (this.IsFCE)
                {
                	this._fce.HasResourceReference = value;
                } 
            }
        }, 
 
//        /*internal*/ public bool 
        HasTemplateChanged: 
        {
            set:function(value)
            {
                if (this.IsFE)
                { 
                	this._fe.HasTemplateChanged = value;
                } 
            } 
        },
 
        // Says if there are any implicit styles in the ancestry
//        /*internal*/ public bool 
        ShouldLookupImplicitStyles:
        {
            get:function() 
            {
                if (this.IsFE) 
                { 
                    return this._fe.ShouldLookupImplicitStyles;
                } 
                else if (this.IsFCE)
                {
                    return this._fce.ShouldLookupImplicitStyles;
                } 
                else
                { 
                    return false; 
                }
            },
            set:function(value)
            {
                if (this.IsFE)
                { 
                	this._fe.ShouldLookupImplicitStyles = value;
                } 
                else if (this.IsFCE) 
                {
                	this._fce.ShouldLookupImplicitStyles = value; 
                }
            }
        },
        
//        /*internal*/ public event RoutedEventHandler 
        Loaded:{
        	get:function(){
        		if (this.IsFE)
                { 
        			return this._fe.Loaded; // += value; 
                }
                else if (this.IsFCE) 
                {
                	return this._fce.Loaded; // += value;
                }
                else 
                {
                	this.UnexpectedCall(); 
                } 
        	}
        },
 
//        /*internal*/ public event RoutedEventHandler 
        Unloaded:
        {
        	get:function(){
                if (this.IsFE)
                { 
                    return this._fe.Unloaded; // += value;
                } 
                else if (this.IsFCE) 
                {
                    return this._fce.Unloaded; // += value; 
                }
                else
                {
                	this.UnexpectedCall(); 
                }
        	}
        },

//        /*internal*/ public event InheritedPropertyChangedEventHandler 
        InheritedPropertyChanged:
        {
        	get:function(){
                if (this.IsFE)
                {
                	return this._fe.InheritedPropertyChanged; // += value;
                } 
                else if (this.IsFCE)
                { 
                	return this._fce.InheritedPropertyChanged; // += value; 
                }
                else 
                {
                	this.UnexpectedCall();
                }
        	}
        },

//        /*internal*/ public event EventHandler 
        ResourcesChanged:
        {
        	get:function(){
                if (this.IsFE)
                { 
                    return this._fe.ResourcesChanged; // += value;
                }
                else if (this.IsFCE)
                { 
                	this._fce.ResourcesChanged; // += value;
                } 
                else 
                {
                    this.UnexpectedCall(); 
                }
        	}
        },

        
	});
	
//    /*internal*/ public static bool 
	FrameworkObject.IsEffectiveAncestor = function(/*DependencyObject*/ d1, /*DependencyObject*/ d2 ) 
	{
		for ( /*FrameworkObject*/var fo = new FrameworkObject(d2); fo.DO != null; fo.Reset(fo.EffectiveParent))
		{
			if (fo.DO == d1) 
			{
				return true; 
			}
		}
		
		return false; 
	};
	
	FrameworkObject.Type = new Type("FrameworkObject", FrameworkObject, [Object.Type]);
	return FrameworkObject;
});



