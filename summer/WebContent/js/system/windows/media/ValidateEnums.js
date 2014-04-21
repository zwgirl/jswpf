/**
 * ValidateEnums
 */

define(["dojo/_base/declare", "system/Type", "controls/HeaderedContentControl"], 
		function(declare, Type, HeaderedContentControl){
	var ValidateEnums = declare("ValidateEnums", HeaderedContentControl,{
	});
	
//	public static bool 
	ValidateEnums.IsAlignmentXValid = function(/*object*/ value)
	{
		return value == AlignmentX.Left || value == AlignmentX.Center || value == AlignmentX.Right;
	};
	
//	public static bool 
	ValidateEnums.IsAlignmentYValid = function(/*object*/ value)
	{
		return value == AlignmentY.Top || value == AlignmentY.Center || value == AlignmentY.Bottom;
	};
//	public static bool 
	ValidateEnums.IsBrushMappingModeValid = function(/*object*/ value)
	{
		return value == BrushMappingMode.Absolute || value == BrushMappingMode.RelativeToBoundingBox;
	};
//	public static bool 
	ValidateEnums.IsCachingHintValid = function(/*object*/ value)
	{
		return value == CachingHint.Unspecified || value == CachingHint.Cache;
	};
//	public static bool 
	ValidateEnums.IsColorInterpolationModeValid = function(/*object*/ value)
	{
		return value == ColorInterpolationMode.ScRgbLinearInterpolation || value == ColorInterpolationMode.SRgbLinearInterpolation;
	};
//	public static bool 
	ValidateEnums.IsGeometryCombineModeValid = function(/*object*/ value)
	{
		return value == GeometryCombineMode.Union || value == GeometryCombineMode.Intersect || value == GeometryCombineMode.Xor 
		|| value == GeometryCombineMode.Exclude;
	};
//	public static bool 
	ValidateEnums.IsEdgeModeValid = function(/*object*/ value)
	{
		return value == EdgeMode.Unspecified || value == EdgeMode.Aliased;
	};
//	public static bool 
	ValidateEnums.IsBitmapScalingModeValid = function(/*object*/ value)
	{
		return value == BitmapScalingMode.Unspecified || value == BitmapScalingMode.LowQuality || value == BitmapScalingMode.HighQuality 
		|| value == BitmapScalingMode.LowQuality || value == BitmapScalingMode.HighQuality || value == BitmapScalingMode.NearestNeighbor;
	};
//	public static bool 
	ValidateEnums.IsClearTypeHintValid = function(/*object*/ value)
	{
		return value == ClearTypeHint.Auto || value == ClearTypeHint.Enabled;
	};
//	public static bool 
	ValidateEnums.IsTextRenderingModeValid = function(/*object*/ value)
	{
		return value == TextRenderingMode.Auto || value == TextRenderingMode.Aliased || value == TextRenderingMode.Grayscale 
		|| value == TextRenderingMode.ClearType;
	};
//	public static bool 
	ValidateEnums.IsTextHintingModeValid = function(/*object*/ value)
	{
		return value == TextHintingMode.Auto || value == TextHintingMode.Fixed || value == TextHintingMode.Animated;
	};
//	public static bool 
	ValidateEnums.IsFillRuleValid = function(/*object*/ value)
	{
		return value == FillRule.EvenOdd || value == FillRule.Nonzero;
	};
//	public static bool 
	ValidateEnums.IsGradientSpreadMethodValid = function(/*object*/ value)
	{
		return value == GradientSpreadMethod.Pad || value == GradientSpreadMethod.Reflect || value == GradientSpreadMethod.Repeat;
	};
//	public static bool 
	ValidateEnums.IsPenLineCapValid = function(/*object*/ value)
	{
		return value == PenLineCap.Flat || value == PenLineCap.Square || value == PenLineCap.Round || value == PenLineCap.Triangle;
	};
//	public static bool 
	ValidateEnums.IsPenLineJoinValid = function(/*object*/ value)
	{
		return value == PenLineJoin.Miter || value == PenLineJoin.Bevel || value == PenLineJoin.Round;
	};
//	public static bool 
	ValidateEnums.IsStretchValid = function(/*object*/ value)
	{
		return value == Stretch.None || value == Stretch.Fill || value == Stretch.Uniform || value == Stretch.UniformToFill;
	};
//	public static bool 
	ValidateEnums.IsTileModeValid = function(/*object*/ value)
	{
		return value == TileMode.None || value == TileMode.Tile || value == TileMode.FlipX || value == TileMode.FlipY || value == TileMode.FlipXY;
	};
//	public static bool 
	ValidateEnums.IsSweepDirectionValid = function(/*object*/ value)
	{
		return value == SweepDirection.Counterclockwise || value == SweepDirection.Clockwise;
	};
	
	ValidateEnums.Type = new Type("ValidateEnums", ValidateEnums, [Object.Type]);
	return ValidateEnums;
});
