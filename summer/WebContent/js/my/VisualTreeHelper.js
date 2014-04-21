/**
 * VisualTreeHelper
 */

define(["dojo/_base/declare", "system/Type"], function(declare, Type){
	var VisualTreeHelper = declare(null,{
		constructor:function(/*int*/ index, /*boolean*/ found){
			if(arguments.length==1 ){
				this._store = index | 0x80000000;
			}else if(arguments.length==2 ){
				this._store = index & 0x7FFFFFFF;
				if (found){
					this._store |= 0x80000000;
				}
			}else{
				throw new Error();
			}
		}
	});
	
	Object.defineProperties(VisualTreeHelper.prototype,{
		  
		/*public boolean */Found:
		{
			get:function() { return (this._store & 0x80000000) != 0; }
		},
		 
		/*public int */Index:
		{
			get:function() { return this._store & 0x7FFFFFFF; }
		}
	});
	
	VisualTreeHelper.Type = new Type("VisualTreeHelper", VisualTreeHelper, [Object.Type]);
	return VisualTreeHelper;
});

//------------------------------------------------------------------------------ 
//  Microsoft Avalon
//  Copyright (c) Microsoft Corporation, 2003
//
//  File:       VisualTreeHelper 
//-----------------------------------------------------------------------------
using System; 
using System.Windows.Media; 
using System.Windows.Media.Media3D;
using System.Windows.Media.Animation; 
using System.Windows.Threading;
using System.Security.Permissions;
using System.Windows.Media.Effects;
 
using System.Collections;
using System.Diagnostics; 
using MS.Internal; 
using MS.Internal.Media;
using MS.Internal.PresentationCore; 

using SR=MS.Internal.PresentationCore.SR;
using SRID=MS.Internal.PresentationCore.SRID;
 
namespace System.Windows.Media
{ 
    /// <summary> 
    /// The VisualTreeHelper class contains static methods that are useful for performing
    /// common tasks with visual tree nodes.  Nodes in the visual tree may be Visual or 
    /// Visual3Ds.
    ///
    /// When possible methods are typed to DependencyObject and may accept or
    /// return either type of visual tree node (e.g. GetParent). 
    ///
    /// When the result of the operation is specific to 2D or 3D the methods are typed 
    /// to Visual or Visual3D (e.g., GetDescendantBounds()). 
    /// </summary>
    public static class VisualTreeHelper 
    {
        private static void CheckVisualReferenceArgument(DependencyObject reference)
        {
            if (reference == null) 
            {
                throw new ArgumentNullException("reference"); 
            } 
        }
 
        /// <summary>
        /// Return true if the given DependencyObject is a non-null visual type.
        /// This is useful as a precondition for many of the VisualTreeHelper methods,
        /// to avoid exceptions. 
        /// </summary>
        // 
        [FriendAccessAllowed] 
        internal static bool IsVisualType(DependencyObject reference)
        { 
            return (reference is Visual) || (reference is Visual3D);
        }

        /// <summary> 
        /// Get the number of children of the specified Visual.
        /// </summary> 
        public static int GetChildrenCount(DependencyObject reference) 
        {
            Visual visual; 
            Visual3D visual3D;

            VisualTreeUtils.AsNonNullVisual(reference, out visual, out visual3D);
 
            // x86 branch prediction skips the branch on first encounter.  We favor 2D.
            if (visual3D != null) 
            { 
                return visual3D.InternalVisual2DOr3DChildrenCount;
            } 

            //
            // Even though visual is a 2D visual, it still may have
            // 3D children. 
            //
            return visual.InternalVisual2DOr3DChildrenCount; 
        } 

        /// <summary> 
        /// Returns the child of Visual visual at the specified index.
        /// </summary>
        public static DependencyObject GetChild(DependencyObject reference, int childIndex)
        { 
            Visual visual;
            Visual3D visual3D; 
 
            VisualTreeUtils.AsNonNullVisual(reference, out visual, out visual3D);
 
            // x86 branch prediction skips the branch on first encounter.  We favor 2D.
            if (visual3D != null)
            {
                return visual3D.InternalGet2DOr3DVisualChild(childIndex); 
            }
 
            // 
            // Even though visual is a 2D visual, it still may have
            // 3D children. 
            //
            return visual.InternalGet2DOr3DVisualChild(childIndex);
        }
 
        /// <summary>
        /// Visual parent of this Visual. 
        /// </summary> 
        public static DependencyObject GetParent(DependencyObject reference)
        { 
            Visual visual;
            Visual3D visual3D;

            VisualTreeUtils.AsNonNullVisual(reference, out visual, out visual3D); 

            // x86 branch prediction skips the branch on first encounter.  We favor 2D. 
            if (visual3D != null) 
            {
                return visual3D.InternalVisualParent; 
            }

            return visual.InternalVisualParent;
        } 

        /// <summary> 
        /// Equivalent to GetParent except that it does not VerifyAccess and only asserts 
        /// in
 



        [FriendAccessAllowed] 
        internal static DependencyObject GetParentInternal(DependencyObject reference)
        { 
            Visual visual; 
            Visual3D visual3D;
 
            VisualTreeUtils.AsVisualInternal(reference, out visual, out visual3D);

            if (visual != null)
            { 
                return visual.InternalVisualParent;
            } 
 
            if (visual3D != null)
            { 
                return visual3D.InternalVisualParent;
            }

            Debug.Assert(reference == null); 

            return null; 
        } 

        /// <summary> 
        /// Returns the closest Visual that contains the given DependencyObject
        /// </summary>
        internal static Visual GetContainingVisual2D(DependencyObject reference)
        { 
            Visual visual = null;
 
            while (reference != null) 
            {
                visual = reference as Visual; 

                if (visual != null) break;

                reference = VisualTreeHelper.GetParent(reference); 
            }
 
            return visual; 
        }
 
        /// <summary>
        /// Returns the closest Visual3D that contains the given DependencyObject
        /// </summary>
        internal static Visual3D GetContainingVisual3D(DependencyObject reference) 
        {
            Visual3D visual3D = null; 
 
            while (reference != null)
            { 
                visual3D = reference as Visual3D;

                if (visual3D != null) break;
 
                reference = VisualTreeHelper.GetParent(reference);
            } 
 
            return visual3D;
        } 

        internal static bool IsAncestorOf(DependencyObject reference, DependencyObject descendant)
        {
            Visual visual; 
            Visual3D visual3D;
 
            VisualTreeUtils.AsNonNullVisual(reference, out visual, out visual3D); 

            // x86 branch prediction skips the branch on first encounter.  We favor 2D. 
            if (visual3D != null)
            {
                return visual3D.IsAncestorOf(descendant);
            } 

            return visual.IsAncestorOf(descendant); 
        } 

        // a version of IsAncestorOf that stops looking when it finds an ancestor 
        // of the given type
        internal static bool IsAncestorOf(DependencyObject ancestor, DependencyObject descendant, Type stopType)
        {
            if (ancestor == null) 
            {
                throw new ArgumentNullException("ancestor"); 
            } 
            if (descendant == null)
            { 
                throw new ArgumentNullException("descendant");
            }

            VisualTreeUtils.EnsureVisual(ancestor); 
            VisualTreeUtils.EnsureVisual(descendant);
 
            // Walk up the parent chain of the descendant until we run out of parents, 
            // or we find the ancestor, or we reach a node of the given type.
            DependencyObject current = descendant; 

            while ((current != null) && (current != ancestor) && !stopType.IsInstanceOfType(current))
            {
                Visual visual; 
                Visual3D visual3D;
 
                if ((visual = current as Visual) != null) 
                {
                    current = visual.InternalVisualParent; 
                }
                else if ((visual3D = current as Visual3D) != null)
                {
                    current = visual3D.InternalVisualParent; 
                }
                else 
                { 
                    current = null;
                } 
            }

            return current == ancestor;
        } 

        internal static DependencyObject FindCommonAncestor(DependencyObject reference, DependencyObject otherVisual) 
        { 
            Visual visual;
            Visual3D visual3D; 

            VisualTreeUtils.AsNonNullVisual(reference, out visual, out visual3D);

            // x86 branch prediction skips the branch on first encounter.  We favor 2D. 
            if (visual3D != null)
            { 
                return visual3D.FindCommonVisualAncestor(otherVisual); 
            }
 
            return visual.FindCommonVisualAncestor(otherVisual);
        }

        /// <summary> 
        /// Gets the clip of this Visual.
        /// </summary> 
        public static Geometry GetClip(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualClip;
        }

        /// <summary> 
        /// Gets the opacity of the Visual.
        /// </summary> 
        public static double GetOpacity(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualOpacity;
        }

        /// <summary> 
        /// Gets the OpacityMask.
        /// </summary> 
        public static Brush GetOpacityMask(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualOpacityMask;
        }

        /// <summary> 
        /// Returns the offset of the Visual.
        /// </summary> 
        public static Vector GetOffset(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualOffset;
        }

         /// <summary> 
        /// Returns the Visual transform.
        /// </summary> 
        public static Transform GetTransform(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualTransform;
        }

        /// <summary> 
        /// Returns X-coordinate (vertical) guideline collection.
        /// </summary> 
        public static DoubleCollection GetXSnappingGuidelines(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualXSnappingGuidelines;
        }

         /// <summary> 
        /// Returns Y-coordinate (horizontal) guideline collection.
        /// </summary> 
        public static DoubleCollection GetYSnappingGuidelines(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualYSnappingGuidelines;
        }

        /// <summary> 
        /// GetDrawing returns the drawing content of the reference Visual
        /// </summary> 
        public static DrawingGroup GetDrawing(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.GetDrawing();
        }

        /// <summary> 
        /// GetContentBounds returns the bounding box for the contents of the specified visual.
        /// </summary> 
        public static Rect GetContentBounds(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualContentBounds;
        }

        /// <summary> 
        /// GetContentBounds returns the bounding box for the contents of the specified visual.
        /// </summary> 
        public static Rect3D GetContentBounds(Visual3D reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualContentBounds;
        }

        /// <summary> 
        /// GetDescendantBounds returns the union of all of the content bounding
        /// boxes of the specified Visual's sub-graph. 
        /// </summary> 
        public static Rect GetDescendantBounds(Visual reference)
        { 
            CheckVisualReferenceArgument(reference);
            return reference.VisualDescendantBounds;
        }
 
        /// <summary>
        /// GetDescendantBounds returns the union of all of the content bounding 
        /// boxes of the specified Visual3D's sub-graph. 
        /// </summary>
        public static Rect3D GetDescendantBounds(Visual3D reference) 
        {
            CheckVisualReferenceArgument(reference);
            return reference.VisualDescendantBounds;
        } 

        /// <summary> 
        /// Gets the BitmapEffect. 
        /// </summary>
        public static BitmapEffect GetBitmapEffect(Visual reference) 
        {
            CheckVisualReferenceArgument(reference);
#pragma warning disable 0618
            return reference.VisualBitmapEffect; 
#pragma warning restore 0618
        } 
 
        /// <summary>
        /// Gets the BitmapEffectInput. 
        /// </summary>
        public static BitmapEffectInput GetBitmapEffectInput(Visual reference)
        {
            CheckVisualReferenceArgument(reference); 
#pragma warning disable 0618
            return reference.VisualBitmapEffectInput; 
#pragma warning restore 0618 
        }
 
        /// <summary>
        /// Gets the Effect.
        /// </summary>
        public static Effect GetEffect(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualEffect; 
        }
 
        /// <summary>
        /// Gets the CacheMode.
        /// </summary>
        public static CacheMode GetCacheMode(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualCacheMode; 
        }
 
        /// <summary>
        /// Gets the EdgeMode of the Visual.
        /// </summary>
        public static EdgeMode GetEdgeMode(Visual reference) 
        {
            CheckVisualReferenceArgument(reference); 
            return reference.VisualEdgeMode; 
        }
 
        /// <summary>
        /// Return top most visual of a hit test.
        /// </summary>
        public static HitTestResult HitTest(Visual reference, Point point) 
        {
            return HitTest(reference, point, true); 
        } 

        /// <summary> 
        /// </summary>
        [FriendAccessAllowed]
        internal static HitTestResult HitTest(Visual reference, Point point, bool include2DOn3D)
        { 
            CheckVisualReferenceArgument(reference);
 
            return reference.HitTest(point, include2DOn3D); 
        }
 
        /// <summary>
        /// Initiate a hit test using delegates.
        /// </summary>
        public static void HitTest( 
            Visual reference,
            HitTestFilterCallback filterCallback, 
            HitTestResultCallback resultCallback, 
            HitTestParameters hitTestParameters)
        { 
            CheckVisualReferenceArgument(reference);
            reference.HitTest(filterCallback, resultCallback, hitTestParameters);
        }
 
        /// <summary>
        /// Initiate a hit test using delegates. 
        /// </summary> 
        public static void HitTest(
            Visual3D reference, 
            HitTestFilterCallback filterCallback,
            HitTestResultCallback resultCallback,
            HitTestParameters3D hitTestParameters)
        { 
            CheckVisualReferenceArgument(reference);
            reference.HitTest(filterCallback, resultCallback, hitTestParameters); 
        } 

#if WCP_MF_ENABLED 
        /// <summary>
        /// Serialize a visual to fixed (S0) XAML
        /// </summary>
        /// <param name="visual"></param> 
        /// <param name="writer"></param>
        static internal void SaveAsXml(Visual visual, System.Xml.XmlWriter writer) 
        { 
            VisualTreeFlattener.SaveAsXml(visual, writer, new FixedXamlDesigner());
        } 

        /// <summary>
        /// Walk a visual tree and flatten it to (S0) DrawingContext
        /// </summary> 
        /// <param name="visual"></param>
        /// <param name="dc"></param> 
        //CASRemoval:[StrongNameIdentityPermission(SecurityAction.LinkDemand, PublicKey=Microsoft.Internal.BuildInfo.WCP_PUBLIC_KEY_STRING)] 
        static public void Walk(Visual visual, DrawingContext dc)
        { 
            VisualTreeFlattener flattener = new VisualTreeFlattener(dc);

            flattener.Walk(visual, null);
        } 
#endif // WCP_MF_ENABLED
 
    } 
}
 


