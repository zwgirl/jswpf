/**
 * HashHelpers
 */

define(["dojo/_base/declare", "system/Type"], 
		function(declare, Type){
	
	var HashHelpers = declare("HashHelpers", null,{

	});
	
	HashHelpers.primes =
		[
			3,
			7,
			11,
			17,
			23,
			29,
			37,
			47,
			59,
			71,
			89,
			107,
			131,
			163,
			197,
			239,
			293,
			353,
			431,
			521,
			631,
			761,
			919,
			1103,
			1327,
			1597,
			1931,
			2333,
			2801,
			3371,
			4049,
			4861,
			5839,
			7013,
			8419,
			10103,
			12143,
			14591,
			17519,
			21023,
			25229,
			30293,
			36353,
			43627,
			52361,
			62851,
			75431,
			90523,
			108631,
			130363,
			156437,
			187751,
			225307,
			270371,
			324449,
			389357,
			467237,
			560689,
			672827,
			807403,
			968897,
			1162687,
			1395263,
			1674319,
			2009191,
			2411033,
			2893249,
			3471899,
			4166287,
			4999559,
			5999471,
			7199369
		];
	
//	public static bool 
	HashHelpers.IsPrime = function(/*int*/ candidate)
	{
		if ((candidate & 1) != 0)
		{
			var num = Math.sqrt(candidate);
			for (var i = 3; i <= num; i += 2)
			{
				if (candidate % i == 0)
				{
					return false;
				}
			}
			return true;
		}
		return candidate == 2;
	};
	
//	public static int 
	HashHelpers.GetPrime = function(/*int*/ min)
	{
		if (min < 0)
		{
			throw new Error('ArgumentException(Environment.GetResourceString("Arg_HTCapacityOverflow")');
		}
		for (var i = 0; i < HashHelpers.primes.length; i++)
		{
			var num = HashHelpers.primes[i];
			if (num >= min)
			{
				return num;
			}
		}
		for (var j = min | 1; j < 2147483647; j += 2)
		{
			if (HashHelpers.IsPrime(j) && (j - 1) % 101 != 0)
			{
				return j;
			}
		}
		return min;
	};
	
//	public static int 
	HashHelpers.GetMinPrime = function()
	{
		return HashHelpers.primes[0];
	};
//	public static int 
	HashHelpers.ExpandPrime = function(/*int*/ oldSize)
	{
		var num = 2 * oldSize;
		if (num > 2146435069 && 2146435069 > oldSize)
		{
			return 2146435069;
		}
		return HashHelpers.GetPrime(num);
	};
	
	HashHelpers.Type = new Type("HashHelpers", HashHelpers, [Object.Type]);
	return HashHelpers;
});

