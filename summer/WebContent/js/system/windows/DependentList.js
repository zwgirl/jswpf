/**
 * DependentList
 */

define(["dojo/_base/declare", "system/Type", "utility/FrugalObjectList"], 
		function(declare, Type, FrugalObjectList){
	

//    internal struct 
	var Dependent = declare(null, { 
		constructor:function(/*DependencyObject*/ o, /*DependencyProperty*/ p, /*Expression*/ e) 
        {
            this._Expr = e; 
            this._DP = p; 
            this._DO = o;
        }, 
//        private DependencyProperty _DP;
//        private WeakReference _wrDO; 
//        private WeakReference _wrEX; 

//        public bool 
		IsValid:function() 
        {
            return true;
        },

//        override public bool
        Equals:function(/*object*/ o)
        {
            if(! (o instanceof Dependent)) 
                return false;
 
            if(this._DO != o._DO) 
                return false;

            if(this._DP != o._DP)
                return false; 

            // if they are both non-null then the Targets must match. 
            if(null != this._Expr != o._Expr) 
            {
            	return false;
            }
 
            return true; 
        },
 
        // We don't expect to need this function. [Required when overriding Equals()]
        // Write a good HashCode anyway (if not a fast one)
//        override public int
        GetHashCode:function() 
        {
            var hashCode = (null == ex) ? 0 : this._Expr.GetHashCode();
 
            hashCode += (null == this._DO) ? 0 : this._DO.GetHashCode(); 
 
            hashCode += (null == this._DP) ? 0 : this._DP.GetHashCode(); 
            return hashCode;
        } 
    });
	
	Object.defineProperties(Dependent.prototype, {
		
//        public DependencyObject 
		DO:
        {
            get:function() 
            {
                return _DO; 
            }
        },

//        public DependencyProperty 
        DP:
        {
            get:function() { return _DP; } 
        }, 

//        public Expression 
        Expr: 
        {
            get:function()
            {
                return this._Expr; 
            }
        } 
	});
    
	var DependentList = declare("DependentList", FrugalObjectList,{
		constructor:function(){
		},
		

//        public void 
		Add:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*Expression*/ expr) 
        { 
            // don't clean up every time.  This would make Add() cost O(N),
            // which would cause building a list to cost O(N^2).  yuck! 
            // Clean the list less often the longer it gets.
//            if(this.Count == this.Capacity)
//            	this.CleanUpDeadWeakReferences();
 
            var dep = new Dependent(d, dp, expr);
            FrugalObjectList.prototype.Add.call(this, dep); 
        }, 

//        public void 
        Remove:function(/*DependencyObject*/ d, /*DependencyProperty*/ dp, /*Expression*/ expr) 
        {
            var dep = new Dependent(d, dp, expr);
            FrugalObjectList.prototype.Remove.call(this, dep);
        }, 

//        public void 
        InvalidateDependents:function(/*DependencyObject*/ source, /*DependencyPropertyChangedEventArgs*/ sourceArgs) 
        {
            // Take a snapshot of the list to protect against re-entrancy via Add / Remove. 
            /*Dependent[]*/var snapList = FrugalObjectList.prototype.ToArray.call(this);

            for(var i=0; i<snapList.length; i++)
            { 
                var expression = snapList[i].Expr;
                if(null != expression) 
                { 
                    expression.OnPropertyInvalidation(source, sourceArgs);
 
                    // Invalidate dependent, unless expression did it already
                    if (!expression.ForwardsInvalidations)
                    {
                        var dependencyObject = snapList[i].DO; 
                        var dependencyProperty = snapList[i].DP;
 
                        if(null != dependencyObject && null != dependencyProperty) 
                        {
                            // recompute expression 
                            dependencyObject.InvalidateProperty(dependencyProperty);
                        }
                    }
                } 
            }
        }, 
 
//        private void 
//        CleanUpDeadWeakReferences:function()
//        { 
//        	var newCount = 0;
//
//            // determine how many entries are valid
//            for (var i=this.Count-1; i>=0; --i) 
//            {
//                if (this.Get(i).IsValid()) 
//                { 
//                    ++ newCount;
//                } 
//            }
//
//            // if all the entries are valid, there's nothing to do
//            if (newCount == this.Count) 
//                return;
// 
//            // compact the valid entries 
//            var compacter = new Compacter(this, newCount);
//            var runStart = 0;           // starting index of current run 
//            var runIsValid = false;    // whether run contains valid or invalid entries
//
//            for (var i=0, n=this.Count; i<n; ++i)
//            { 
//                if (runIsValid != this.Get(i).IsValid())    // run has ended
//                { 
//                    if (runIsValid) 
//                    {
//                        // emit a run of valid entries to the compacter 
//                        compacter.Include(runStart, i);
//                    }
//
//                    // start a new run 
//                    runStart = i;
//                    runIsValid = !runIsValid; 
//                } 
//            }
// 
//            // emit the last run of valid entries
//            if (runIsValid)
//            {
//                compacter.Include(runStart, Count); 
//            }
// 
//            // finish the job 
//            compacter.Finish();
//        } 
	});
	
	Object.defineProperties(DependentList.prototype,{
//        public bool 
		IsEmpty: 
        { 
            get:function()
            { 
                for(var i = this.Count-1; i >= 0; i--)
                {
                    if(this.Get(i).IsValid())
                    { 
                        return false;
                    } 
                } 

                // there are no valid entries.   All callers immediately discard the 
                // empty DependentList in this case, so there's no need to clean out
                // the list.  We can just GC collect the WeakReferences.
                return true;
            } 
        },
	});
	
	DependentList.Type = new Type("DependentList", DependentList, [FrugalObjectList.Type]);
	return DependentList;
});

