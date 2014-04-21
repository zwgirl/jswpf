/**
 * EqualityComparer
 */

define(["dojo/_base/declare", "system/Type", "collections/IEqualityComparer"], 
		function(declare, Type, IEqualityComparer){
	var EqualityComparer = declare("EqualityComparer", IEqualityComparer,{
		constructor:function(){
		}
	});
	
	Object.defineProperties(EqualityComparer.prototype,{
		  
	});
	
//    static volatile EqualityComparer<T> 
	var defaultComparer = null; 
	Object.defineProperties(EqualityComparer,{
//	       public static EqualityComparer<T> 
		Default: {
	        get:function() {
	            if (defaultComparer == null) { 
	            	defaultComparer = CreateComparer();
	            }
	            return defaultComparer;
	        }
        }   
	});
	
	// 
    // Note that logic in this method is replicated in vm\compile.cpp to ensure that NGen 
    // saves the right instantiations
    // 
//    private static EqualityComparer<T> 
	function CreateComparer() {

        RuntimeType t = (RuntimeType)typeof(T);
        // Specialize type byte for performance reasons 
        if (t == typeof(byte)) { 
            return (EqualityComparer<T>)(object)(new ByteEqualityComparer());
        } 
        // If T implements IEquatable<T> return a GenericEqualityComparer<T>
        if (typeof(IEquatable<T>).IsAssignableFrom(t)) {
            return (EqualityComparer<T>)RuntimeTypeHandle.CreateInstanceForAnotherGenericParameter((RuntimeType)typeof(GenericEqualityComparer<int>), t);
        } 
        // If T is a Nullable<U> where U implements IEquatable<U> return a NullableEqualityComparer<U>
        if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Nullable<>)) { 
            RuntimeType u = (RuntimeType)t.GetGenericArguments()[0]; 
            if (typeof(IEquatable<>).MakeGenericType(u).IsAssignableFrom(u)) {
                return (EqualityComparer<T>)RuntimeTypeHandle.CreateInstanceForAnotherGenericParameter((RuntimeType)typeof(NullableEqualityComparer<int>), u); 
            }
        }
        // If T is an int-based Enum, return an EnumEqualityComparer<T>
        // See the METHOD__JIT_HELPERS__UNSAFE_ENUM_CAST and METHOD__JIT_HELPERS__UNSAFE_ENUM_CAST_LONG cases in getILIntrinsicImplementation 
        if (t.IsEnum && Enum.GetUnderlyingType(t) == typeof(int))
        { 
            return (EqualityComparer<T>)RuntimeTypeHandle.CreateInstanceForAnotherGenericParameter((RuntimeType)typeof(EnumEqualityComparer<int>), t); 
        }
        // Otherwise return an ObjectEqualityComparer<T> 
        return new ObjectEqualityComparer<T>();
    }
	
	EqualityComparer.Type = new Type("EqualityComparer", EqualityComparer, [IEqualityComparer.Type]);
	return EqualityComparer;
});

        public abstract bool Equals(T x, T y);
        public abstract int GetHashCode(T obj); 

        internal virtual int IndexOf(T[] array, T value, int startIndex, int count) { 
            int endIndex = startIndex + count;
            for (int i = startIndex; i < endIndex; i++) {
                if (Equals(array[i], value)) return i;
            } 
            return -1;
        } 
 
        internal virtual int LastIndexOf(T[] array, T value, int startIndex, int count) {
            int endIndex = startIndex - count + 1; 
            for (int i = startIndex; i >= endIndex; i--) {
                if (Equals(array[i], value)) return i;
            }
            return -1; 
        }
 
        int IEqualityComparer.GetHashCode(object obj) { 
            if (obj == null) return 0;
            if (obj is T) return GetHashCode((T)obj); 
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidArgumentForComparison);
            return 0;
        }
 
        bool IEqualityComparer.Equals(object x, object y) {
            if (x == y) return true; 
            if (x == null || y == null) return false; 
            if ((x is T) && (y is T)) return Equals((T)x, (T)y);
            ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_InvalidArgumentForComparison); 
            return false;
        }
    }
 
    // The methods in this class look identical to the inherited methods, but the calls
    // to Equal bind to IEquatable<T>.Equals(T) instead of Object.Equals(Object) 
    internal class GenericEqualityComparer<T>: EqualityComparer<T> where T: IEquatable<T>
    { 
        [Pure]
        public override bool Equals(T x, T y) {
            if (x != null) {
                if (y != null) return x.Equals(y); 
                return false;
            } 
            if (y != null) return false; 
            return true;
        } 

        public override int GetHashCode(T obj) { 
            if (obj == null) return 0; 
            return obj.GetHashCode();
        } 

        internal override int IndexOf(T[] array, T value, int startIndex, int count) {
            int endIndex = startIndex + count;
            if (value == null) { 
                for (int i = startIndex; i < endIndex; i++) {
                    if (array[i] == null) return i; 
                } 
            }
            else { 
                for (int i = startIndex; i < endIndex; i++) {
                    if (array[i] != null && array[i].Equals(value)) return i;
                }
            } 
            return -1;
        } 
 
        internal override int LastIndexOf(T[] array, T value, int startIndex, int count) {
            int endIndex = startIndex - count + 1; 
            if (value == null) {
                for (int i = startIndex; i >= endIndex; i--) {
                    if (array[i] == null) return i;
                } 
            }
            else { 
                for (int i = startIndex; i >= endIndex; i--) { 
                    if (array[i] != null && array[i].Equals(value)) return i;
                } 
            }
            return -1;
        }
 
        // Equals method for the comparer itself.
        public override bool Equals(Object obj){ 
            GenericEqualityComparer<T> comparer = obj as GenericEqualityComparer<T>; 
            return comparer != null;
        } 

        public override int GetHashCode() {
            return this.GetType().Name.GetHashCode();
        } 
    }
 
    internal class NullableEqualityComparer<T> : EqualityComparer<Nullable<T>> where T : struct, IEquatable<T>
    { 
        [Pure]
        public override bool Equals(Nullable<T> x, Nullable<T> y) {
            if (x.HasValue) {
                if (y.HasValue) return x.value.Equals(y.value); 
                return false;
            } 
            if (y.HasValue) return false; 
            return true;
        } 

        [Pure]
        public override int GetHashCode(Nullable<T> obj) {
            return obj.GetHashCode(); 
        }
 
        internal override int IndexOf(Nullable<T>[] array, Nullable<T> value, int startIndex, int count) { 
            int endIndex = startIndex + count;
            if (!value.HasValue) { 
                for (int i = startIndex; i < endIndex; i++) {
                    if (!array[i].HasValue) return i;
                }
            } 
            else {
                for (int i = startIndex; i < endIndex; i++) { 
                    if (array[i].HasValue && array[i].value.Equals(value.value)) return i; 
                }
            } 
            return -1;
        }

        internal override int LastIndexOf(Nullable<T>[] array, Nullable<T> value, int startIndex, int count) { 
            int endIndex = startIndex - count + 1;
            if (!value.HasValue) { 
                for (int i = startIndex; i >= endIndex; i--) { 
                    if (!array[i].HasValue) return i;
                } 
            }
            else {
                for (int i = startIndex; i >= endIndex; i--) {
                    if (array[i].HasValue && array[i].value.Equals(value.value)) return i; 
                }
            } 
            return -1; 
        }
 
        // Equals method for the comparer itself.
        public override bool Equals(Object obj){
            NullableEqualityComparer<T> comparer = obj as NullableEqualityComparer<T>;
            return comparer != null; 
        }
 
        public override int GetHashCode() { 
            return this.GetType().Name.GetHashCode();
        } 
    }

    internal class ObjectEqualityComparer<T>: EqualityComparer<T> 
    {
        [Pure] 
        public override bool Equals(T x, T y) { 
            if (x != null) {
                if (y != null) return x.Equals(y); 
                return false;
            }
            if (y != null) return false;
            return true; 
        }
 
        public override int GetHashCode(T obj) {
            if (obj == null) return 0;
            return obj.GetHashCode(); 
        }
 
        internal override int IndexOf(T[] array, T value, int startIndex, int count) { 
            int endIndex = startIndex + count;
            if (value == null) { 
                for (int i = startIndex; i < endIndex; i++) {
                    if (array[i] == null) return i;
                }
            } 
            else {
                for (int i = startIndex; i < endIndex; i++) { 
                    if (array[i] != null && array[i].Equals(value)) return i; 
                }
            } 
            return -1;
        }

        internal override int LastIndexOf(T[] array, T value, int startIndex, int count) { 
            int endIndex = startIndex - count + 1;
            if (value == null) { 
                for (int i = startIndex; i >= endIndex; i--) { 
                    if (array[i] == null) return i;
                } 
            }
            else {
                for (int i = startIndex; i >= endIndex; i--) {
                    if (array[i] != null && array[i].Equals(value)) return i; 
                }
            } 
            return -1; 
        }
 
        // Equals method for the comparer itself.
        public override bool Equals(Object obj){
            ObjectEqualityComparer<T> comparer = obj as ObjectEqualityComparer<T>;
            return comparer != null; 
        }
 
        public override int GetHashCode() { 
            return this.GetType().Name.GetHashCode();
        } 
    }

    // Performance of IndexOf on byte array is very important for some scenarios.
    // We will call the C runtime function memchr, which is optimized. 
    internal class ByteEqualityComparer: EqualityComparer<byte> 
    { 
        [Pure]
        public override bool Equals(byte x, byte y) { 
            return x == y;
        }

        [Pure] 
        public override int GetHashCode(byte b) {
            return b.GetHashCode(); 
        } 

        [System.Security.SecuritySafeCritical]  // auto-generated 
        internal unsafe override int IndexOf(byte[] array, byte value, int startIndex, int count) {
            if (array==null)
                throw new ArgumentNullException("array");
            if (startIndex < 0) 
                throw new ArgumentOutOfRangeException("startIndex", Environment.GetResourceString("ArgumentOutOfRange_Index"));
            if (count < 0) 
                throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_Count")); 
            if (count > array.Length - startIndex)
                throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen")); 
            Contract.EndContractBlock();
            if (count == 0) return -1;
            fixed (byte* pbytes = array) {
                return Buffer.IndexOfByte(pbytes, value, startIndex, count); 
            }
        } 
 
        internal override int LastIndexOf(byte[] array, byte value, int startIndex, int count) {
            int endIndex = startIndex - count + 1; 
            for (int i = startIndex; i >= endIndex; i--) {
                if (array[i] == value) return i;
            }
            return -1; 
        }
 
        // Equals method for the comparer itself. 
        public override bool Equals(Object obj){
            ByteEqualityComparer comparer = obj as ByteEqualityComparer; 
            return comparer != null;
        }

        public override int GetHashCode() { 
            return this.GetType().Name.GetHashCode();
        } 
 
    }
 
    internal sealed class EnumEqualityComparer<T>: EqualityComparer<T> where T : struct
    {
        [Pure] 
        public override bool Equals(T x, T y) {
            int x_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCast(x); 
            int y_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCast(y); 
            return x_final == y_final;
        } 

        [Pure]
        public override int GetHashCode(T obj) {
            int x_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCast(obj); 
            return x_final.GetHashCode();
        } 
 
        // Equals method for the comparer itself.
        public override bool Equals(Object obj){ 
            EnumEqualityComparer<T> comparer = obj as EnumEqualityComparer<T>;
            return comparer != null;
        }
 
        public override int GetHashCode() {
            return this.GetType().Name.GetHashCode(); 
        } 
    }
 
    internal sealed class LongEnumEqualityComparer<T>: EqualityComparer<T> where T : struct
    {
        [Pure] 
        public override bool Equals(T x, T y) {
            long x_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCastLong(x); 
            long y_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCastLong(y); 
            return x_final == y_final;
        } 

        [Pure]
        public override int GetHashCode(T obj) {
            long x_final = System.Runtime.CompilerServices.JitHelpers.UnsafeEnumCastLong(obj); 
            return x_final.GetHashCode();
        } 
 
        // Equals method for the comparer itself.
        public override bool Equals(Object obj){ 
            LongEnumEqualityComparer<T> comparer = obj as LongEnumEqualityComparer<T>;
            return comparer != null;
        }
 
        public override int GetHashCode() {
            return this.GetType().Name.GetHashCode(); 
        } 
    }
}
 

