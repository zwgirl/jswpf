/**
 * Type
 */
define(["dojo/_base/declare" ], function(declare){
	var PropertyInfo = null;
	function EnsurePropertyInfo(){
		if(PropertyInfo == null){
			PropertyInfo = using("reflection/PropertyInfo");
		}
		
		return PropertyInfo; 
	}
	
	
	Object.Equals = function(obj1, obj2){
		if(obj1==obj2){
			return true;
		}
		return false;
	};
	
	Object.prototype.Equals = function(obj){
		if(this==obj){
			return true;
		}
		return false;
	};
	
	Object.ReferenceEquals = function(obj1, obj2){
		if(obj1===obj2){
			return true;
		}
		
		return false;
	};
	
	Array.prototype.peek = function(){
		if(this.length == 0){
			return null;
		}
		return this[ this.length - 1];
	};
	
	String.prototype.Trim = function() {
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    
    String.Format = function() {
        if( arguments.length == 0 )
            return null;

        var str = arguments[0]; 
        for(var i=1; i<arguments.length; i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };
    
    String.prototype.GetHashCode = function(){
        var str= this + "";
        var h = 0, off = 0;
        var len = str.length;
   	
        for(var i = 0; i < len; i++){
            h = 31 * h  + str.charCodeAt(off++);
            if(h>0x7fffffff || h<0x80000000){
                h=h & 0xffffffff;
            }
        }
        return h;
    };
    
    String.Equals = function(obj1, obj2){
		if(obj1==obj2){
			return true;
		}
		return false;
	};
    	
    String.prototype.isWhiteSpace = function () {
        var whitespaceChars = " \t\n\r\f";
        return (whitespaceChars.indexOf(this) != -1);
    };
	
    String.Empty = "";
    String.IsNullOrEmpty = function(str){
    	if(str == null || str == String.Empty){
    		return true;
    	}
    	
    	return false;
    };
    
 // see below for better implementation!
    String.prototype.StartsWith = function (str){
      return this.indexOf(str) == 0;
    };
	
	var Type = declare("Type", Object,{
		constructor:function(name, ctos, baseTypes, isInterface){
			if(isInterface === undefined){
				isInterface = false;
			}
			
			this._name = name;
		    this._id = Type.GlobalIndex ++;
		    this._ctos=ctos;
		    
		    if(baseTypes == null){
		    	this._interfaces = null;
		    	this._baseType = null;
		    }else{
			    if(baseTypes[0].IsInterface){
			    	this._interfaces = baseTypes;
			    	this._baseType = Object.Type;
			    }else{
			    	this._interfaces = baseTypes.slice(1);
			    	this._baseType = baseTypes[0];
			    }
		    }

		    
		    this._interface = isInterface;
		},
		
		IsValueType:function(){
			return true;
		},
		
//		/**
//		 * ParentClas.IsInstanceOfType(SubClassInstance)
//		 * @param object
//		 * @returns
//		 */
//		IsInstanceOfType:function(object){
//			if(object==null || object ===undefined){
//				return false;
//			}
//			
//			var type = object.GetType();
//			return type.IsSubclassOf(this);
//		},
		
	     // Returns true if the object passed is assignable to an instance of this class.
        // Everything else returns false. 
        //
//        public virtual bool 
		IsInstanceOfType:function(/*Object*/ o)
        { 
            if (o == null)
                return false; 
 
            // No need for transparent proxy casting check here
            // because it never returns true for a non-rutnime type. 

            return this.IsAssignableFrom(o.GetType());
        },
		
//		/**
//		 * SubClas.IsSubClassOf(ParentClass)
//		 * @param c
//		 * @returns {Boolean}
//		 */
//		IsSubclassOf:function (/*Type*/ c){
//			if(null == c  || undefined === c){
//				return false;
//			}
//               
//			if (c.Id == this.Id)  {
//                return true; 
//            }
//			
//			var baseTypes = this.BaseTypes; //this;  
//            if(baseTypes !== undefined && baseTypes != null) {
//                for(var i=0; i<baseTypes.length; i++){
//                	if(baseTypes[i] == null){
//                		return false;
//                	}
//                    if (c.Id == baseTypes[i].Id)  {
//                        return true; 
//                    }else{
//                    	if(baseTypes[i].IsSubclassOf(c)){
//                    		return true;
//                    	}
//                    }
//                }
//            }
//            
//            return false;
//		},
		
//        public virtual bool 
		IsSubclassOf:function(/*Type*/ c) 
        {
			var p = this;
            if (p == c) 
                return false;
            while (p != null) { 
                if (p == c)
                    return true;
                p = p.BaseType;
            } 
            return false;
        },
		
//		/**
//		 * ParentClass.IsAssignableFrom(SubClass)
//		 * @param type
//		 */
//		IsAssignableFrom:function(/*Type*/ type){
//			if(null == type  || undefined === type){
//				return false;
//			}
//			
//			if(type === this){
//				return true;
//			}
//            
////            for(var i = 0; i<type._baseTypes.length; i++){
////                if (this.Id == type._baseTypes[i].Id)  {
////                    return true; 
////                }else{
////                	if(this.IsAssignableFrom(type._baseTypes[i])){
////                		return true;
////                	}
////                }
////            }
//            
//    		var baseTypes = type.BaseTypes; //this;  
//            if(baseTypes !== undefined && baseTypes != null) {
//                for(var i=0; i<baseTypes.length; i++){
//                	if(baseTypes[i] == null){
//                		return false;
//                	}
//                    if (this.Id == baseTypes[i].Id)  {
//                        return true; 
//                    }else{
//                    	if(this.IsAssignableFrom(baseTypes[i])){
//                    		return true;
//                    	}
//                    }
//                }
//            }
//            
//            return false;
//			
//		},
		
		// Returns true if an instance of Type c may be assigned
        // to an instance of this class.  Return false otherwise. 
        // 
//        public virtual bool 
		IsAssignableFrom:function(/*Type*/ c) 
        {
            if (c == null)
                return false;
 
            if (this == c)
                return true; 
 
//            // For backward-compatibility, we need to special case for the types
//            // whose UnderlyingSystemType are RuntimeType objects. 
//            RuntimeType toType = this.UnderlyingSystemType as RuntimeType;
//            if (toType != null)
//                return toType.IsAssignableFrom(c);
 
            // If c is a subclass of this class, then c can be cast to this type.
            if (c.IsSubclassOf(this)) 
                return true; 

            if (this.IsInterface) 
            {
                return c.ImplementInterface(this);
            }
 
            return false;
        },
        

//        internal bool 
        ImplementInterface:function(/*Type*/ ifaceType) 
        { 

            var t = this;
            while (t != null)
            { 
                /*Type[]*/var interfaces = t.GetInterfaces();
                if (interfaces != null) 
                { 
                    for (var i = 0; i < interfaces.length; i++)
                    { 
                        // Interfaces don't derive from other interfaces, they implement them.
                        // So instead of IsSubclassOf, we should use ImplementInterface instead.
                        if (interfaces[i] == ifaceType ||
                            (interfaces[i] != null && interfaces[i].ImplementInterface(ifaceType))) 
                            return true;
                    } 
                } 

                t = t.BaseType; 
            }

            return false;
        }, 
        
        // This method will return all of the interfaces implemented by a class 
//        abstract public Type[] 
        GetInterfaces:function(){
        	return this._interfaces;
        },
 
		GetType:function(){
			return Object.Type;
		},
		
		toString:function(){
			return this._id;
		},
		GetProperty:function(/*String*/ name, /*int*/ flag){
			
			var propDesc = Object.getOwnPropertyDescriptor(this.Constructor.prototype, name);
			if(propDesc != null){
				return new EnsurePropertyInfo()(name);
			}
			return null;
		}
	});
	
	Object.defineProperties(Type.prototype,{
		 
		Id:
		{
			get:function() { return this._id; }
		},
		Constructor:
		{
			get:function() {return this._ctos;}
		},
		Name:
		{
			get:function() { return this._name;}
		},
		Interfaces:
		{
			get:function(){ return this._interfaces;}
		},
		
		BaseType:
		{
			get:function(){
				return this._baseType;
			}
		},
		IsInterface:
		{
			get:function(){
				return this._interface;
			}
		}
	});
	
	Type.GlobalIndex = 0;
	

	Object.Type = new Type("Object" ,Object, null);
	Object.Type.DefaultValue = null;
	Object.prototype.GetHashCode = function(){
        return 1;
    };
	
	Number.Type = new Type("Number" ,Number, [Object.Type]);
	Number.Type.DefaultValue = 0;
	Number.MAX_INT = 4294967295;
	Number.MIN_INT = -2147483648;
	Number.NegativeInfinity = -8388608;
	Number.PositiveInfinity = 2139095040;
	
	Number.IsNaN = function(o){
		return isNaN(o);
	};
	
	Number.IsNegativeInfinity = function(value){
		return value === -Infinity;
	};
	
	Number.IsPositiveInfinity = function(value){
		return value === Infinity;
	};
	
	Number.IsInfinity = function(value){
		return value === Infinity;
	};
	
	
	Number.prototype.GetHashCode = function(){
        return this;
    };
	
	String.Type = new Type("String" ,String, [Object.Type]);
	String.Type.DefaultValue = null;
	
	Boolean.Type = new Type("Boolean" ,Boolean, [Object.Type]);
	Boolean.Type.DefaultValue = false;
	
	Array.Type = new Type("Array" ,Array, [Object.Type]);
	
	Array.Type.DefaultValue = null;
	
	Date.Type = new Type("Date" ,Date,[Object.Type]);
	
 // Return the number of days in the month
    Date.prototype.GetDaysInMonth = function(utc) 
	{
    	var m = utc ? this.getUTCMonth() : this.getMonth();
    	// If feb.
    	var year = this.getFullYear();
    	if (m == 1)
    		return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 29 : 28;
    	// If Apr, Jun, Sep or Nov return 30; otherwise 31
    	return (m == 3 || m == 5 || m == 8 || m == 10) ? 30 : 31;
  	};
  	
  	Date.prototype.AddMonths = function (months) {
  		var month = this.getMonth(); 
  		this.setMonth(month + months); 
  		return this; 
  		
  		
//        if (months < -120000 || months > 120000) throw new ArgumentOutOfRangeException("months", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadMonths")); 
//        int y = GetDatePart(DatePartYear); 
//        int m = GetDatePart(DatePartMonth);
//        int d = GetDatePart(DatePartDay);
//        int i = m - 1 + months;
//        if (i >= 0) { 
//            m = i % 12 + 1;
//            y = y + i / 12; 
//        } 
//        else {
//            m = 12 + (i + 1) % 12; 
//            y = y + (i - 11) / 12;
//        }
//        if (y < 1 || y > 9999) {
//            throw new ArgumentOutOfRangeException("months", Environment.GetResourceString("ArgumentOutOfRange_DateArithmetic")); 
//        }
//        int days = DaysInMonth(y, m); 
//        if (d > days) d = days; 
//        return new DateTime((UInt64)(DateToTicks(y, m, d) + InternalTicks % TicksPerDay) | InternalKind);
  	};
  	
  	Date.prototype.AddDays = function(days)
  	{
  		var date = this.getDate(); 
  		this.setDate(date + value); 
  		return this; 
  	};
  	
  	Date.prototype.GetDayOfWeek = function(){
  		return this.getDay();
  	};
  	
  	Date.prototype.GetDayOfYear = function() {
  		var onejan = new DateTime(this.getFullYear(),0,1);
  		return Math.ceil((this - onejan) / 86400000);
	};

    // Returns the DateTime resulting from adding a fractional number of 
    // hours to this DateTime. The result is computed by rounding the
    // fractional number of hours given by value to the nearest 
    // millisecond, and adding that interval to this DateTime. The 
    // value argument is permitted to be negative.
    // 
	Date.prototype.AddHours = function( value) {
		 this.setHours(this.getHours() + value);
		    return this;
    };

    // Returns the DateTime resulting from the given number of
    // milliseconds to this DateTime. The result is computed by rounding 
    // the number of milliseconds given by value to the nearest integer, 
    // and adding that interval to this DateTime. The value
    // argument is permitted to be negative. 
    //
    Date.prototype.AddMilliseconds = function( value) {
    	var millisecond = this.getMilliseconds(); 
    	this.setMilliseconds(millisecond + value); 
    	return this; 
    }; 

    // Returns the DateTime resulting from adding a fractional number of 
    // minutes to this DateTime. The result is computed by rounding the 
    // fractional number of minutes given by value to the nearest
    // millisecond, and adding that interval to this DateTime. The 
    // value argument is permitted to be negative.
    //
    Date.prototype.AddMinutes = function(value) {
    	var minute = this.addMinutes(); 
    	this.setMinutes(minute + value); 
    	return this; 
    };

    // Returns the DateTime resulting from adding a fractional number of
    // seconds to this DateTime. The result is computed by rounding the
    // fractional number of seconds given by value to the nearest 
    // millisecond, and adding that interval to this DateTime. The
    // value argument is permitted to be negative. 
    // 
    Date.prototype.AddSeconds = function( value) {
    	var second = this.getSeconds(); 
    	this.setSeconds(second + value); 
    	return this; 
    };

    // Returns the DateTime resulting from adding the given number of 
    // years to this DateTime. The result is computed by incrementing 
    // (or decrementing) the year part of this DateTime by value
    // years. If the month and day of this DateTime is 2/29, and if the 
    // resulting year is not a leap year, the month and day of the resulting
    // DateTime becomes 2/28. Otherwise, the month, day, and time-of-day
    // parts of the result are the same as those of this DateTime.
    // 
    Date.prototype.AddYears = function( value) {
        if (value < -10000 || value > 10000) throw new ArgumentOutOfRangeException("years", Environment.GetResourceString("ArgumentOutOfRange_DateTimeBadYears")); 
        return this.AddMonths(value * 12);
    };
    
//    public boolean 
    Date.prototype.Equals = function(/*DateTime*/ value) {
    	if(value instanceof DateTime){
    		return this.getTime() == value.getTime();
    	}
        return false;
    };
    
    Object.defineProperties(Date.prototype, {

//		internal Int64 
		Ticks: {
            get:function() { 
                return this.getTime();
            }
        },
 
//        private UInt64
        InternalKind: {
            get:function() { 
                return (this.dateData & this.FlagsMask);
            }
        },
        // Returns the date part of this DateTime. The resulting value 
        // corresponds to this DateTime with the time-of-day part set to
        // zero (midnight).
        //
//        public DateTime 
        Date: { 
            get:function() {
                return this;
            }
        },
        // Returns the day-of-month part of this DateTime. The returned 
        // value is an integer between 1 and 31.
        // 
//        public int 
        Day: {
            get:function() {
                return this.getDate();
            } 
        }, 

        // Returns the day-of-week part of this DateTime. The returned value 
        // is an integer between 0 and 6, where 0 indicates Sunday, 1 indicates
        // Monday, 2 indicates Tuesday, 3 indicates Wednesday, 4 indicates
        // Thursday, 5 indicates Friday, and 6 indicates Saturday.
        // 
//        public DayOfWeek 
        DayOfWeek: {
            get:function() { 
                return this.getDay();
            } 
        },
 
        // Returns the day-of-year part of this DateTime. The returned value 
        // is an integer between 1 and 366.
        // 
//        public int 
        DayOfYear: {
            get:function() {
                return this.GetDatePart(DatePartDayOfYear);
            } 
        }, 
     // Returns the hour part of this DateTime. The returned value is an
        // integer between 0 and 23.
        //
//        public int 
        Hour: { 
            get:function() {
                return this.getHours();
            }
        }, 
 
//        public DateTimeKind 
        Kind: {
            get:function() { 
                switch (this.InternalKind) { 
                    case KindUnspecified:
                        return DateTimeKind.Unspecified; 
                    case KindUtc:
                        return DateTimeKind.Utc;
                    default:
                        return DateTimeKind.Local; 
                }
            } 
        },

        // Returns the millisecond part of this DateTime. The returned value 
        // is an integer between 0 and 999.
        //
//        public int 
        Millisecond: {
            get:function() { 
                return this.getMilliseconds();
            }
        },
 
        // Returns the minute part of this DateTime. The returned value is
        // an integer between 0 and 59. 
        // 
//        public int 
        Minute: {
            get:function() {
                return this.getMinutes(); 
            } 
        },
 
        // Returns the month part of this DateTime. The returned value is an
        // integer between 1 and 12.
        //
//        public int 
        Month: { 
            get:function() {
                return this.getMonth(); 
            }
        },
        
     // Returns the second part of this DateTime. The returned value is
        // an integer between 0 and 59.
        // 
//        public int 
        Second: {
            get:function() { 
                return this.getSeconds();
            } 
        },
 
        // Returns the time-of-day part of this DateTime. The returned value
        // is a TimeSpan that indicates the time elapsed since midnight. 
        //
//        public TimeSpan 
        TimeOfDay: {
            get:function() { 
                return new TimeSpan(this.InternalTicks % TicksPerDay); 
            }
        }, 
        // Returns the year part of this DateTime. The returned value is an 
        // integer between 1 and 9999. 
        //
//        public int 
        Year: { 
            get:function() {
                return this.getFullYear();
            } 
        }
    });
    
    Object.defineProperties(Date, {
//    	public static DateTime 
    	UtcNow: {
            get:function() { 
                // following code is tuned for speed. Don't change it without running benchmark. 
                return new Date(); 
            }
        },
        
        // Returns a DateTime representing the current date. The date part
        // of the returned value is the current date, and the time-of-day part of
        // the returned value is zero (midnight). 
        //
//        public static DateTime 
        Today: { 
            get:function() {
            	var now = new Date();
                return new Date(now.Year, now.Month, now.Day, 0, 0, 0, 0);
            }
        }
    });
    
 // Compares two DateTime values for equality. Returns true if
    // the two DateTime values are equal, or false if they are 
    // not equal. 
    //
//    public static boolean 
    Date.Equals = function(/*DateTime*/ t1, /*DateTime*/ t2) { 
        return t1.getTime() == t2.getTime();
    };

    // Compares two DateTime values, returning an integer that indicates
    // their relationship.
    // 
//    public static int 
    Date.Compare = function(/*DateTime*/ t1, /*DateTime*/ t2) {
        var ticks1 = t1.Ticks; 
        var ticks2 = t2.Ticks; 
        if (ticks1 > ticks2) return 1;
        if (ticks1 < ticks2) return -1; 
        return 0;
    };
    
    // Checks whether a given year is a leap year. This method returns true if 
    // year is a leap year, or false if not.
    // 
//    public static boolean 
    Date.IsLeapYear = function(/*int*/ year) {
        if (year < 1 || year > 9999) {
            throw new ArgumentOutOfRangeException("year", Environment.GetResourceString("ArgumentOutOfRange_Year"));
        } 
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0); 
    };
    
//  private static readonly int[] 
    var DaysToMonth365 = [
        0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365]; 
//	    private static readonly int[]
    var DaysToMonth366 = [
        0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
    // Returns the number of days in the month given by the year and 
    // month arguments.
    // 
    Date.DaysInMonth = function(/*int*/ year, /*int*/ month) { 
        if (month < 1 || month > 12) throw new ArgumentOutOfRangeException("month", Environment.GetResourceString("ArgumentOutOfRange_Month"));
        // IsLeapYear checks the year argument
        var days = IsLeapYear(year)? DaysToMonth366: DaysToMonth365;
        return days[month] - days[month - 1];
    };
    
    
    Date.MinValue = new Date(-8640000000000000);
    Date.MaxValue = new Date(8640000000000000);

	Object.prototype.GetType = function(){
	    return this.constructor.Type;
	};
	
	
	//From BindingExpression
	Type.NullDataItem = {"name" : "NullDataItem"};
	Type.IgnoreDefaultValue = {"name" : "IgnoreDefaultValue"}; 
	Type.StaticSource = {"name" : "StaticSource"};
	
	//From DependencyProperty
	Type.UnsetValue= {name:"DependencyProperty.UnsetValue"};
	
	//From Binding
	Type.DoNothing = {name:"Binding.DoNothing"}; 

    /// <summary> 
    ///     This string is used as the PropertyName of the
    ///     PropertyChangedEventArgs to indicate that an indexer property
    ///     has been changed.
    /// </summary> 
	Type.IndexerName = "Item[]";
	
	//from DependencyObject
	Type.ExpressionInAlternativeStore = {"name" : "ExpressionInAlternativeStore"};
	
	return Type;
});
 
