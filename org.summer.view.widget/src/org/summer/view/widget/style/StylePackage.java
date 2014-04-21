/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;

/**
 * <!-- begin-user-doc -->
 * The <b>Package</b> for the model.
 * It contains accessors for the meta objects to represent
 * <ul>
 *   <li>each class,</li>
 *   <li>each feature of each class,</li>
 *   <li>each enum,</li>
 *   <li>and each data type</li>
 * </ul>
 * <!-- end-user-doc -->
 * @see org.summer.view.widget.style.StyleFactory
 * @model kind="package"
 * @generated
 */
public interface StylePackage extends EPackage {
	/**
	 * The package name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNAME = "style";

	/**
	 * The package namespace URI.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_URI = "style";

	/**
	 * The package namespace name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_PREFIX = "style";

	/**
	 * The singleton instance of the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	StylePackage eINSTANCE = org.summer.view.widget.style.impl.StylePackageImpl.init();

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.MarginImpl <em>Margin</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.MarginImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getMargin()
	 * @generated
	 */
	int MARGIN = 0;

	/**
	 * The feature id for the '<em><b>Left</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MARGIN__LEFT = 0;

	/**
	 * The feature id for the '<em><b>Top</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MARGIN__TOP = 1;

	/**
	 * The feature id for the '<em><b>Right</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MARGIN__RIGHT = 2;

	/**
	 * The feature id for the '<em><b>Bottom</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MARGIN__BOTTOM = 3;

	/**
	 * The number of structural features of the '<em>Margin</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MARGIN_FEATURE_COUNT = 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.PaddingImpl <em>Padding</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.PaddingImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getPadding()
	 * @generated
	 */
	int PADDING = 1;

	/**
	 * The feature id for the '<em><b>Left</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PADDING__LEFT = 0;

	/**
	 * The feature id for the '<em><b>Top</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PADDING__TOP = 1;

	/**
	 * The feature id for the '<em><b>Right</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PADDING__RIGHT = 2;

	/**
	 * The feature id for the '<em><b>Bottom</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PADDING__BOTTOM = 3;

	/**
	 * The number of structural features of the '<em>Padding</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PADDING_FEATURE_COUNT = 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.BorderImpl <em>Border</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.BorderImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorder()
	 * @generated
	 */
	int BORDER = 2;

	/**
	 * The feature id for the '<em><b>Left</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER__LEFT = 0;

	/**
	 * The feature id for the '<em><b>Top</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER__TOP = 1;

	/**
	 * The feature id for the '<em><b>Right</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER__RIGHT = 2;

	/**
	 * The feature id for the '<em><b>Bottom</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER__BOTTOM = 3;

	/**
	 * The number of structural features of the '<em>Border</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER_FEATURE_COUNT = 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.BorderContentImpl <em>Border Content</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.BorderContentImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorderContent()
	 * @generated
	 */
	int BORDER_CONTENT = 3;

	/**
	 * The feature id for the '<em><b>Color</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER_CONTENT__COLOR = 0;

	/**
	 * The feature id for the '<em><b>Style</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER_CONTENT__STYLE = 1;

	/**
	 * The feature id for the '<em><b>Width</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER_CONTENT__WIDTH = 2;

	/**
	 * The number of structural features of the '<em>Border Content</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BORDER_CONTENT_FEATURE_COUNT = 3;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.RGBImpl <em>RGB</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.RGBImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getRGB()
	 * @generated
	 */
	int RGB = 4;

	/**
	 * The feature id for the '<em><b>Red</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGB__RED = 0;

	/**
	 * The feature id for the '<em><b>Green</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGB__GREEN = 1;

	/**
	 * The feature id for the '<em><b>Blue</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGB__BLUE = 2;

	/**
	 * The number of structural features of the '<em>RGB</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGB_FEATURE_COUNT = 3;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.RGBAImpl <em>RGBA</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.RGBAImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getRGBA()
	 * @generated
	 */
	int RGBA = 5;

	/**
	 * The feature id for the '<em><b>Red</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGBA__RED = RGB__RED;

	/**
	 * The feature id for the '<em><b>Green</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGBA__GREEN = RGB__GREEN;

	/**
	 * The feature id for the '<em><b>Blue</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGBA__BLUE = RGB__BLUE;

	/**
	 * The feature id for the '<em><b>Alpha</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGBA__ALPHA = RGB_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>RGBA</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RGBA_FEATURE_COUNT = RGB_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.FontImpl <em>Font</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.FontImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFont()
	 * @generated
	 */
	int FONT = 6;

	/**
	 * The feature id for the '<em><b>Size</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__SIZE = 0;

	/**
	 * The feature id for the '<em><b>Style</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__STYLE = 1;

	/**
	 * The feature id for the '<em><b>Variant</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__VARIANT = 2;

	/**
	 * The feature id for the '<em><b>Weight</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__WEIGHT = 3;

	/**
	 * The feature id for the '<em><b>Family</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__FAMILY = 4;

	/**
	 * The feature id for the '<em><b>Line Height</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT__LINE_HEIGHT = 5;

	/**
	 * The number of structural features of the '<em>Font</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FONT_FEATURE_COUNT = 6;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.BackgroundImpl <em>Background</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.BackgroundImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackground()
	 * @generated
	 */
	int BACKGROUND = 7;

	/**
	 * The feature id for the '<em><b>Attachment</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND__ATTACHMENT = 0;

	/**
	 * The feature id for the '<em><b>Image</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND__IMAGE = 1;

	/**
	 * The feature id for the '<em><b>Repeat</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND__REPEAT = 2;

	/**
	 * The feature id for the '<em><b>Color</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND__COLOR = 3;

	/**
	 * The feature id for the '<em><b>Position</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND__POSITION = 4;

	/**
	 * The number of structural features of the '<em>Background</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND_FEATURE_COUNT = 5;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.BackgroundPositionImpl <em>Background Position</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.BackgroundPositionImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundPosition()
	 * @generated
	 */
	int BACKGROUND_POSITION = 8;

	/**
	 * The feature id for the '<em><b>X</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND_POSITION__X = 0;

	/**
	 * The feature id for the '<em><b>Y</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND_POSITION__Y = 1;

	/**
	 * The number of structural features of the '<em>Background Position</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BACKGROUND_POSITION_FEATURE_COUNT = 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.impl.LengthImpl <em>Length</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.impl.LengthImpl
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getLength()
	 * @generated
	 */
	int LENGTH = 9;

	/**
	 * The feature id for the '<em><b>Value</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LENGTH__VALUE = 0;

	/**
	 * The feature id for the '<em><b>Unit</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LENGTH__UNIT = 1;

	/**
	 * The number of structural features of the '<em>Length</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LENGTH_FEATURE_COUNT = 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.BorderStyle <em>Border Style</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.BorderStyle
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorderStyle()
	 * @generated
	 */
	int BORDER_STYLE = 10;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.FontStyle <em>Font Style</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.FontStyle
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontStyle()
	 * @generated
	 */
	int FONT_STYLE = 11;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.FontVariant <em>Font Variant</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.FontVariant
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontVariant()
	 * @generated
	 */
	int FONT_VARIANT = 12;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.FontWeight <em>Font Weight</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.FontWeight
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontWeight()
	 * @generated
	 */
	int FONT_WEIGHT = 13;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.BackgroundAttachment <em>Background Attachment</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.BackgroundAttachment
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundAttachment()
	 * @generated
	 */
	int BACKGROUND_ATTACHMENT = 14;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.BackgroundRepeat <em>Background Repeat</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.BackgroundRepeat
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundRepeat()
	 * @generated
	 */
	int BACKGROUND_REPEAT = 15;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.style.Unit <em>Unit</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.style.Unit
	 * @see org.summer.view.widget.style.impl.StylePackageImpl#getUnit()
	 * @generated
	 */
	int UNIT = 16;


	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Margin <em>Margin</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Margin</em>'.
	 * @see org.summer.view.widget.style.Margin
	 * @generated
	 */
	EClass getMargin();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Margin#getLeft <em>Left</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Left</em>'.
	 * @see org.summer.view.widget.style.Margin#getLeft()
	 * @see #getMargin()
	 * @generated
	 */
	EReference getMargin_Left();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Margin#getTop <em>Top</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Top</em>'.
	 * @see org.summer.view.widget.style.Margin#getTop()
	 * @see #getMargin()
	 * @generated
	 */
	EReference getMargin_Top();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Margin#getRight <em>Right</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Right</em>'.
	 * @see org.summer.view.widget.style.Margin#getRight()
	 * @see #getMargin()
	 * @generated
	 */
	EReference getMargin_Right();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Margin#getBottom <em>Bottom</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Bottom</em>'.
	 * @see org.summer.view.widget.style.Margin#getBottom()
	 * @see #getMargin()
	 * @generated
	 */
	EReference getMargin_Bottom();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Padding <em>Padding</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Padding</em>'.
	 * @see org.summer.view.widget.style.Padding
	 * @generated
	 */
	EClass getPadding();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Padding#getLeft <em>Left</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Left</em>'.
	 * @see org.summer.view.widget.style.Padding#getLeft()
	 * @see #getPadding()
	 * @generated
	 */
	EReference getPadding_Left();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Padding#getTop <em>Top</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Top</em>'.
	 * @see org.summer.view.widget.style.Padding#getTop()
	 * @see #getPadding()
	 * @generated
	 */
	EReference getPadding_Top();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Padding#getRight <em>Right</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Right</em>'.
	 * @see org.summer.view.widget.style.Padding#getRight()
	 * @see #getPadding()
	 * @generated
	 */
	EReference getPadding_Right();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Padding#getBottom <em>Bottom</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Bottom</em>'.
	 * @see org.summer.view.widget.style.Padding#getBottom()
	 * @see #getPadding()
	 * @generated
	 */
	EReference getPadding_Bottom();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Border <em>Border</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Border</em>'.
	 * @see org.summer.view.widget.style.Border
	 * @generated
	 */
	EClass getBorder();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Border#getLeft <em>Left</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Left</em>'.
	 * @see org.summer.view.widget.style.Border#getLeft()
	 * @see #getBorder()
	 * @generated
	 */
	EReference getBorder_Left();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Border#getTop <em>Top</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Top</em>'.
	 * @see org.summer.view.widget.style.Border#getTop()
	 * @see #getBorder()
	 * @generated
	 */
	EReference getBorder_Top();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Border#getRight <em>Right</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Right</em>'.
	 * @see org.summer.view.widget.style.Border#getRight()
	 * @see #getBorder()
	 * @generated
	 */
	EReference getBorder_Right();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Border#getBottom <em>Bottom</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Bottom</em>'.
	 * @see org.summer.view.widget.style.Border#getBottom()
	 * @see #getBorder()
	 * @generated
	 */
	EReference getBorder_Bottom();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.BorderContent <em>Border Content</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Border Content</em>'.
	 * @see org.summer.view.widget.style.BorderContent
	 * @generated
	 */
	EClass getBorderContent();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.BorderContent#getColor <em>Color</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Color</em>'.
	 * @see org.summer.view.widget.style.BorderContent#getColor()
	 * @see #getBorderContent()
	 * @generated
	 */
	EReference getBorderContent_Color();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.BorderContent#getStyle <em>Style</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Style</em>'.
	 * @see org.summer.view.widget.style.BorderContent#getStyle()
	 * @see #getBorderContent()
	 * @generated
	 */
	EAttribute getBorderContent_Style();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.BorderContent#getWidth <em>Width</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Width</em>'.
	 * @see org.summer.view.widget.style.BorderContent#getWidth()
	 * @see #getBorderContent()
	 * @generated
	 */
	EReference getBorderContent_Width();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.RGB <em>RGB</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>RGB</em>'.
	 * @see org.summer.view.widget.style.RGB
	 * @generated
	 */
	EClass getRGB();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.RGB#getRed <em>Red</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Red</em>'.
	 * @see org.summer.view.widget.style.RGB#getRed()
	 * @see #getRGB()
	 * @generated
	 */
	EAttribute getRGB_Red();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.RGB#getGreen <em>Green</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Green</em>'.
	 * @see org.summer.view.widget.style.RGB#getGreen()
	 * @see #getRGB()
	 * @generated
	 */
	EAttribute getRGB_Green();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.RGB#getBlue <em>Blue</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Blue</em>'.
	 * @see org.summer.view.widget.style.RGB#getBlue()
	 * @see #getRGB()
	 * @generated
	 */
	EAttribute getRGB_Blue();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.RGBA <em>RGBA</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>RGBA</em>'.
	 * @see org.summer.view.widget.style.RGBA
	 * @generated
	 */
	EClass getRGBA();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.RGBA#getAlpha <em>Alpha</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Alpha</em>'.
	 * @see org.summer.view.widget.style.RGBA#getAlpha()
	 * @see #getRGBA()
	 * @generated
	 */
	EAttribute getRGBA_Alpha();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Font <em>Font</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Font</em>'.
	 * @see org.summer.view.widget.style.Font
	 * @generated
	 */
	EClass getFont();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.style.Font#getSize <em>Size</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Size</em>'.
	 * @see org.summer.view.widget.style.Font#getSize()
	 * @see #getFont()
	 * @generated
	 */
	EReference getFont_Size();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Font#getStyle <em>Style</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Style</em>'.
	 * @see org.summer.view.widget.style.Font#getStyle()
	 * @see #getFont()
	 * @generated
	 */
	EAttribute getFont_Style();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Font#getVariant <em>Variant</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Variant</em>'.
	 * @see org.summer.view.widget.style.Font#getVariant()
	 * @see #getFont()
	 * @generated
	 */
	EAttribute getFont_Variant();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Font#getWeight <em>Weight</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Weight</em>'.
	 * @see org.summer.view.widget.style.Font#getWeight()
	 * @see #getFont()
	 * @generated
	 */
	EAttribute getFont_Weight();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Font#getFamily <em>Family</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Family</em>'.
	 * @see org.summer.view.widget.style.Font#getFamily()
	 * @see #getFont()
	 * @generated
	 */
	EAttribute getFont_Family();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.style.Font#getLineHeight <em>Line Height</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Line Height</em>'.
	 * @see org.summer.view.widget.style.Font#getLineHeight()
	 * @see #getFont()
	 * @generated
	 */
	EReference getFont_LineHeight();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Background <em>Background</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Background</em>'.
	 * @see org.summer.view.widget.style.Background
	 * @generated
	 */
	EClass getBackground();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Background#getAttachment <em>Attachment</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Attachment</em>'.
	 * @see org.summer.view.widget.style.Background#getAttachment()
	 * @see #getBackground()
	 * @generated
	 */
	EAttribute getBackground_Attachment();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Background#getImage <em>Image</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Image</em>'.
	 * @see org.summer.view.widget.style.Background#getImage()
	 * @see #getBackground()
	 * @generated
	 */
	EAttribute getBackground_Image();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Background#getRepeat <em>Repeat</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Repeat</em>'.
	 * @see org.summer.view.widget.style.Background#getRepeat()
	 * @see #getBackground()
	 * @generated
	 */
	EAttribute getBackground_Repeat();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.Background#getColor <em>Color</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Color</em>'.
	 * @see org.summer.view.widget.style.Background#getColor()
	 * @see #getBackground()
	 * @generated
	 */
	EReference getBackground_Color();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.style.Background#getPosition <em>Position</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Position</em>'.
	 * @see org.summer.view.widget.style.Background#getPosition()
	 * @see #getBackground()
	 * @generated
	 */
	EReference getBackground_Position();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.BackgroundPosition <em>Background Position</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Background Position</em>'.
	 * @see org.summer.view.widget.style.BackgroundPosition
	 * @generated
	 */
	EClass getBackgroundPosition();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.BackgroundPosition#getX <em>X</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>X</em>'.
	 * @see org.summer.view.widget.style.BackgroundPosition#getX()
	 * @see #getBackgroundPosition()
	 * @generated
	 */
	EReference getBackgroundPosition_X();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.style.BackgroundPosition#getY <em>Y</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Y</em>'.
	 * @see org.summer.view.widget.style.BackgroundPosition#getY()
	 * @see #getBackgroundPosition()
	 * @generated
	 */
	EReference getBackgroundPosition_Y();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.style.Length <em>Length</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Length</em>'.
	 * @see org.summer.view.widget.style.Length
	 * @generated
	 */
	EClass getLength();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Length#getValue <em>Value</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Value</em>'.
	 * @see org.summer.view.widget.style.Length#getValue()
	 * @see #getLength()
	 * @generated
	 */
	EAttribute getLength_Value();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.style.Length#getUnit <em>Unit</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Unit</em>'.
	 * @see org.summer.view.widget.style.Length#getUnit()
	 * @see #getLength()
	 * @generated
	 */
	EAttribute getLength_Unit();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.BorderStyle <em>Border Style</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Border Style</em>'.
	 * @see org.summer.view.widget.style.BorderStyle
	 * @generated
	 */
	EEnum getBorderStyle();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.FontStyle <em>Font Style</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Font Style</em>'.
	 * @see org.summer.view.widget.style.FontStyle
	 * @generated
	 */
	EEnum getFontStyle();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.FontVariant <em>Font Variant</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Font Variant</em>'.
	 * @see org.summer.view.widget.style.FontVariant
	 * @generated
	 */
	EEnum getFontVariant();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.FontWeight <em>Font Weight</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Font Weight</em>'.
	 * @see org.summer.view.widget.style.FontWeight
	 * @generated
	 */
	EEnum getFontWeight();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.BackgroundAttachment <em>Background Attachment</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Background Attachment</em>'.
	 * @see org.summer.view.widget.style.BackgroundAttachment
	 * @generated
	 */
	EEnum getBackgroundAttachment();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.BackgroundRepeat <em>Background Repeat</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Background Repeat</em>'.
	 * @see org.summer.view.widget.style.BackgroundRepeat
	 * @generated
	 */
	EEnum getBackgroundRepeat();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.style.Unit <em>Unit</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Unit</em>'.
	 * @see org.summer.view.widget.style.Unit
	 * @generated
	 */
	EEnum getUnit();

	/**
	 * Returns the factory that creates the instances of the model.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the factory that creates the instances of the model.
	 * @generated
	 */
	StyleFactory getStyleFactory();

	/**
	 * <!-- begin-user-doc -->
	 * Defines literals for the meta objects that represent
	 * <ul>
	 *   <li>each class,</li>
	 *   <li>each feature of each class,</li>
	 *   <li>each enum,</li>
	 *   <li>and each data type</li>
	 * </ul>
	 * <!-- end-user-doc -->
	 * @generated
	 */
	interface Literals {
		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.MarginImpl <em>Margin</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.MarginImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getMargin()
		 * @generated
		 */
		EClass MARGIN = eINSTANCE.getMargin();

		/**
		 * The meta object literal for the '<em><b>Left</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference MARGIN__LEFT = eINSTANCE.getMargin_Left();

		/**
		 * The meta object literal for the '<em><b>Top</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference MARGIN__TOP = eINSTANCE.getMargin_Top();

		/**
		 * The meta object literal for the '<em><b>Right</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference MARGIN__RIGHT = eINSTANCE.getMargin_Right();

		/**
		 * The meta object literal for the '<em><b>Bottom</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference MARGIN__BOTTOM = eINSTANCE.getMargin_Bottom();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.PaddingImpl <em>Padding</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.PaddingImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getPadding()
		 * @generated
		 */
		EClass PADDING = eINSTANCE.getPadding();

		/**
		 * The meta object literal for the '<em><b>Left</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PADDING__LEFT = eINSTANCE.getPadding_Left();

		/**
		 * The meta object literal for the '<em><b>Top</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PADDING__TOP = eINSTANCE.getPadding_Top();

		/**
		 * The meta object literal for the '<em><b>Right</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PADDING__RIGHT = eINSTANCE.getPadding_Right();

		/**
		 * The meta object literal for the '<em><b>Bottom</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PADDING__BOTTOM = eINSTANCE.getPadding_Bottom();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.BorderImpl <em>Border</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.BorderImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorder()
		 * @generated
		 */
		EClass BORDER = eINSTANCE.getBorder();

		/**
		 * The meta object literal for the '<em><b>Left</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER__LEFT = eINSTANCE.getBorder_Left();

		/**
		 * The meta object literal for the '<em><b>Top</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER__TOP = eINSTANCE.getBorder_Top();

		/**
		 * The meta object literal for the '<em><b>Right</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER__RIGHT = eINSTANCE.getBorder_Right();

		/**
		 * The meta object literal for the '<em><b>Bottom</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER__BOTTOM = eINSTANCE.getBorder_Bottom();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.BorderContentImpl <em>Border Content</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.BorderContentImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorderContent()
		 * @generated
		 */
		EClass BORDER_CONTENT = eINSTANCE.getBorderContent();

		/**
		 * The meta object literal for the '<em><b>Color</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER_CONTENT__COLOR = eINSTANCE.getBorderContent_Color();

		/**
		 * The meta object literal for the '<em><b>Style</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute BORDER_CONTENT__STYLE = eINSTANCE.getBorderContent_Style();

		/**
		 * The meta object literal for the '<em><b>Width</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BORDER_CONTENT__WIDTH = eINSTANCE.getBorderContent_Width();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.RGBImpl <em>RGB</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.RGBImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getRGB()
		 * @generated
		 */
		EClass RGB = eINSTANCE.getRGB();

		/**
		 * The meta object literal for the '<em><b>Red</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute RGB__RED = eINSTANCE.getRGB_Red();

		/**
		 * The meta object literal for the '<em><b>Green</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute RGB__GREEN = eINSTANCE.getRGB_Green();

		/**
		 * The meta object literal for the '<em><b>Blue</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute RGB__BLUE = eINSTANCE.getRGB_Blue();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.RGBAImpl <em>RGBA</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.RGBAImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getRGBA()
		 * @generated
		 */
		EClass RGBA = eINSTANCE.getRGBA();

		/**
		 * The meta object literal for the '<em><b>Alpha</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute RGBA__ALPHA = eINSTANCE.getRGBA_Alpha();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.FontImpl <em>Font</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.FontImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFont()
		 * @generated
		 */
		EClass FONT = eINSTANCE.getFont();

		/**
		 * The meta object literal for the '<em><b>Size</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference FONT__SIZE = eINSTANCE.getFont_Size();

		/**
		 * The meta object literal for the '<em><b>Style</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FONT__STYLE = eINSTANCE.getFont_Style();

		/**
		 * The meta object literal for the '<em><b>Variant</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FONT__VARIANT = eINSTANCE.getFont_Variant();

		/**
		 * The meta object literal for the '<em><b>Weight</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FONT__WEIGHT = eINSTANCE.getFont_Weight();

		/**
		 * The meta object literal for the '<em><b>Family</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FONT__FAMILY = eINSTANCE.getFont_Family();

		/**
		 * The meta object literal for the '<em><b>Line Height</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference FONT__LINE_HEIGHT = eINSTANCE.getFont_LineHeight();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.BackgroundImpl <em>Background</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.BackgroundImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackground()
		 * @generated
		 */
		EClass BACKGROUND = eINSTANCE.getBackground();

		/**
		 * The meta object literal for the '<em><b>Attachment</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute BACKGROUND__ATTACHMENT = eINSTANCE.getBackground_Attachment();

		/**
		 * The meta object literal for the '<em><b>Image</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute BACKGROUND__IMAGE = eINSTANCE.getBackground_Image();

		/**
		 * The meta object literal for the '<em><b>Repeat</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute BACKGROUND__REPEAT = eINSTANCE.getBackground_Repeat();

		/**
		 * The meta object literal for the '<em><b>Color</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BACKGROUND__COLOR = eINSTANCE.getBackground_Color();

		/**
		 * The meta object literal for the '<em><b>Position</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BACKGROUND__POSITION = eINSTANCE.getBackground_Position();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.BackgroundPositionImpl <em>Background Position</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.BackgroundPositionImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundPosition()
		 * @generated
		 */
		EClass BACKGROUND_POSITION = eINSTANCE.getBackgroundPosition();

		/**
		 * The meta object literal for the '<em><b>X</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BACKGROUND_POSITION__X = eINSTANCE.getBackgroundPosition_X();

		/**
		 * The meta object literal for the '<em><b>Y</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference BACKGROUND_POSITION__Y = eINSTANCE.getBackgroundPosition_Y();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.impl.LengthImpl <em>Length</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.impl.LengthImpl
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getLength()
		 * @generated
		 */
		EClass LENGTH = eINSTANCE.getLength();

		/**
		 * The meta object literal for the '<em><b>Value</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LENGTH__VALUE = eINSTANCE.getLength_Value();

		/**
		 * The meta object literal for the '<em><b>Unit</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LENGTH__UNIT = eINSTANCE.getLength_Unit();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.BorderStyle <em>Border Style</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.BorderStyle
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBorderStyle()
		 * @generated
		 */
		EEnum BORDER_STYLE = eINSTANCE.getBorderStyle();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.FontStyle <em>Font Style</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.FontStyle
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontStyle()
		 * @generated
		 */
		EEnum FONT_STYLE = eINSTANCE.getFontStyle();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.FontVariant <em>Font Variant</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.FontVariant
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontVariant()
		 * @generated
		 */
		EEnum FONT_VARIANT = eINSTANCE.getFontVariant();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.FontWeight <em>Font Weight</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.FontWeight
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getFontWeight()
		 * @generated
		 */
		EEnum FONT_WEIGHT = eINSTANCE.getFontWeight();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.BackgroundAttachment <em>Background Attachment</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.BackgroundAttachment
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundAttachment()
		 * @generated
		 */
		EEnum BACKGROUND_ATTACHMENT = eINSTANCE.getBackgroundAttachment();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.BackgroundRepeat <em>Background Repeat</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.BackgroundRepeat
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getBackgroundRepeat()
		 * @generated
		 */
		EEnum BACKGROUND_REPEAT = eINSTANCE.getBackgroundRepeat();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.style.Unit <em>Unit</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.style.Unit
		 * @see org.summer.view.widget.style.impl.StylePackageImpl#getUnit()
		 * @generated
		 */
		EEnum UNIT = eINSTANCE.getUnit();

	}

} //StylePackage
