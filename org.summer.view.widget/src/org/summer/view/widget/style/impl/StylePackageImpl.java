/**
 */
package org.summer.view.widget.style.impl;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;
import org.eclipse.emf.ecore.impl.EPackageImpl;
import org.eclipse.xtext.common.types.TypesPackage;
import org.summer.ui.core.CorePackage;
import org.summer.view.widget.WidgetPackage;
import org.summer.view.widget.controls.ControlsPackage;
import org.summer.view.widget.controls.impl.ControlsPackageImpl;
import org.summer.view.widget.controls.primitives.PrimitivesPackage;
import org.summer.view.widget.controls.primitives.impl.PrimitivesPackageImpl;
import org.summer.view.widget.impl.WidgetPackageImpl;
import org.summer.view.widget.shapes.ShapesPackage;
import org.summer.view.widget.shapes.impl.ShapesPackageImpl;
import org.summer.view.widget.style.Background;
import org.summer.view.widget.style.BackgroundAttachment;
import org.summer.view.widget.style.BackgroundPosition;
import org.summer.view.widget.style.BackgroundRepeat;
import org.summer.view.widget.style.Border;
import org.summer.view.widget.style.BorderContent;
import org.summer.view.widget.style.BorderStyle;
import org.summer.view.widget.style.Font;
import org.summer.view.widget.style.FontStyle;
import org.summer.view.widget.style.FontVariant;
import org.summer.view.widget.style.FontWeight;
import org.summer.view.widget.style.Length;
import org.summer.view.widget.style.Margin;
import org.summer.view.widget.style.Padding;
import org.summer.view.widget.style.StyleFactory;
import org.summer.view.widget.style.StylePackage;
import org.summer.view.widget.style.Unit;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model <b>Package</b>.
 * <!-- end-user-doc -->
 * @generated
 */
public class StylePackageImpl extends EPackageImpl implements StylePackage {
	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass marginEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass paddingEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass borderEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass borderContentEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass rgbEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass rgbaEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass fontEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass backgroundEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass backgroundPositionEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EClass lengthEClass = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum borderStyleEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum fontStyleEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum fontVariantEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum fontWeightEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum backgroundAttachmentEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum backgroundRepeatEEnum = null;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private EEnum unitEEnum = null;

	/**
	 * Creates an instance of the model <b>Package</b>, registered with
	 * {@link org.eclipse.emf.ecore.EPackage.Registry EPackage.Registry} by the package
	 * package URI value.
	 * <p>Note: the correct way to create the package is via the static
	 * factory method {@link #init init()}, which also performs
	 * initialization of the package, or returns the registered package,
	 * if one already exists.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.eclipse.emf.ecore.EPackage.Registry
	 * @see org.summer.view.widget.style.StylePackage#eNS_URI
	 * @see #init()
	 * @generated
	 */
	private StylePackageImpl() {
		super(eNS_URI, StyleFactory.eINSTANCE);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static boolean isInited = false;

	/**
	 * Creates, registers, and initializes the <b>Package</b> for this model, and for any others upon which it depends.
	 * 
	 * <p>This method is used to initialize {@link StylePackage#eINSTANCE} when that field is accessed.
	 * Clients should not invoke it directly. Instead, they should simply access that field to obtain the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #eNS_URI
	 * @see #createPackageContents()
	 * @see #initializePackageContents()
	 * @generated
	 */
	public static StylePackage init() {
		if (isInited) return (StylePackage)EPackage.Registry.INSTANCE.getEPackage(StylePackage.eNS_URI);

		// Obtain or create and register package
		StylePackageImpl theStylePackage = (StylePackageImpl)(EPackage.Registry.INSTANCE.get(eNS_URI) instanceof StylePackageImpl ? EPackage.Registry.INSTANCE.get(eNS_URI) : new StylePackageImpl());

		isInited = true;

		// Initialize simple dependencies
		TypesPackage.eINSTANCE.eClass();
		CorePackage.eINSTANCE.eClass();

		// Obtain or create and register interdependencies
		WidgetPackageImpl theWidgetPackage = (WidgetPackageImpl)(EPackage.Registry.INSTANCE.getEPackage(WidgetPackage.eNS_URI) instanceof WidgetPackageImpl ? EPackage.Registry.INSTANCE.getEPackage(WidgetPackage.eNS_URI) : WidgetPackage.eINSTANCE);
		ShapesPackageImpl theShapesPackage = (ShapesPackageImpl)(EPackage.Registry.INSTANCE.getEPackage(ShapesPackage.eNS_URI) instanceof ShapesPackageImpl ? EPackage.Registry.INSTANCE.getEPackage(ShapesPackage.eNS_URI) : ShapesPackage.eINSTANCE);
		ControlsPackageImpl theControlsPackage = (ControlsPackageImpl)(EPackage.Registry.INSTANCE.getEPackage(ControlsPackage.eNS_URI) instanceof ControlsPackageImpl ? EPackage.Registry.INSTANCE.getEPackage(ControlsPackage.eNS_URI) : ControlsPackage.eINSTANCE);
		PrimitivesPackageImpl thePrimitivesPackage = (PrimitivesPackageImpl)(EPackage.Registry.INSTANCE.getEPackage(PrimitivesPackage.eNS_URI) instanceof PrimitivesPackageImpl ? EPackage.Registry.INSTANCE.getEPackage(PrimitivesPackage.eNS_URI) : PrimitivesPackage.eINSTANCE);

		// Create package meta-data objects
		theStylePackage.createPackageContents();
		theWidgetPackage.createPackageContents();
		theShapesPackage.createPackageContents();
		theControlsPackage.createPackageContents();
		thePrimitivesPackage.createPackageContents();

		// Initialize created meta-data
		theStylePackage.initializePackageContents();
		theWidgetPackage.initializePackageContents();
		theShapesPackage.initializePackageContents();
		theControlsPackage.initializePackageContents();
		thePrimitivesPackage.initializePackageContents();

		// Mark meta-data to indicate it can't be changed
		theStylePackage.freeze();

  
		// Update the registry and return the package
		EPackage.Registry.INSTANCE.put(StylePackage.eNS_URI, theStylePackage);
		return theStylePackage;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getMargin() {
		return marginEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getMargin_Left() {
		return (EReference)marginEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getMargin_Top() {
		return (EReference)marginEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getMargin_Right() {
		return (EReference)marginEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getMargin_Bottom() {
		return (EReference)marginEClass.getEStructuralFeatures().get(3);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getPadding() {
		return paddingEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getPadding_Left() {
		return (EReference)paddingEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getPadding_Top() {
		return (EReference)paddingEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getPadding_Right() {
		return (EReference)paddingEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getPadding_Bottom() {
		return (EReference)paddingEClass.getEStructuralFeatures().get(3);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getBorder() {
		return borderEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorder_Left() {
		return (EReference)borderEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorder_Top() {
		return (EReference)borderEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorder_Right() {
		return (EReference)borderEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorder_Bottom() {
		return (EReference)borderEClass.getEStructuralFeatures().get(3);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getBorderContent() {
		return borderContentEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorderContent_Color() {
		return (EReference)borderContentEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getBorderContent_Style() {
		return (EAttribute)borderContentEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBorderContent_Width() {
		return (EReference)borderContentEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getRGB() {
		return rgbEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getRGB_Red() {
		return (EAttribute)rgbEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getRGB_Green() {
		return (EAttribute)rgbEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getRGB_Blue() {
		return (EAttribute)rgbEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getRGBA() {
		return rgbaEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getRGBA_Alpha() {
		return (EAttribute)rgbaEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getFont() {
		return fontEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getFont_Size() {
		return (EReference)fontEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getFont_Style() {
		return (EAttribute)fontEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getFont_Variant() {
		return (EAttribute)fontEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getFont_Weight() {
		return (EAttribute)fontEClass.getEStructuralFeatures().get(3);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getFont_Family() {
		return (EAttribute)fontEClass.getEStructuralFeatures().get(4);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getFont_LineHeight() {
		return (EReference)fontEClass.getEStructuralFeatures().get(5);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getBackground() {
		return backgroundEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getBackground_Attachment() {
		return (EAttribute)backgroundEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getBackground_Image() {
		return (EAttribute)backgroundEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getBackground_Repeat() {
		return (EAttribute)backgroundEClass.getEStructuralFeatures().get(2);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBackground_Color() {
		return (EReference)backgroundEClass.getEStructuralFeatures().get(3);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBackground_Position() {
		return (EReference)backgroundEClass.getEStructuralFeatures().get(4);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getBackgroundPosition() {
		return backgroundPositionEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBackgroundPosition_X() {
		return (EReference)backgroundPositionEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EReference getBackgroundPosition_Y() {
		return (EReference)backgroundPositionEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EClass getLength() {
		return lengthEClass;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getLength_Value() {
		return (EAttribute)lengthEClass.getEStructuralFeatures().get(0);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EAttribute getLength_Unit() {
		return (EAttribute)lengthEClass.getEStructuralFeatures().get(1);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getBorderStyle() {
		return borderStyleEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getFontStyle() {
		return fontStyleEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getFontVariant() {
		return fontVariantEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getFontWeight() {
		return fontWeightEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getBackgroundAttachment() {
		return backgroundAttachmentEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getBackgroundRepeat() {
		return backgroundRepeatEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public EEnum getUnit() {
		return unitEEnum;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public StyleFactory getStyleFactory() {
		return (StyleFactory)getEFactoryInstance();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private boolean isCreated = false;

	/**
	 * Creates the meta-model objects for the package.  This method is
	 * guarded to have no affect on any invocation but its first.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void createPackageContents() {
		if (isCreated) return;
		isCreated = true;

		// Create classes and their features
		marginEClass = createEClass(MARGIN);
		createEReference(marginEClass, MARGIN__LEFT);
		createEReference(marginEClass, MARGIN__TOP);
		createEReference(marginEClass, MARGIN__RIGHT);
		createEReference(marginEClass, MARGIN__BOTTOM);

		paddingEClass = createEClass(PADDING);
		createEReference(paddingEClass, PADDING__LEFT);
		createEReference(paddingEClass, PADDING__TOP);
		createEReference(paddingEClass, PADDING__RIGHT);
		createEReference(paddingEClass, PADDING__BOTTOM);

		borderEClass = createEClass(BORDER);
		createEReference(borderEClass, BORDER__LEFT);
		createEReference(borderEClass, BORDER__TOP);
		createEReference(borderEClass, BORDER__RIGHT);
		createEReference(borderEClass, BORDER__BOTTOM);

		borderContentEClass = createEClass(BORDER_CONTENT);
		createEReference(borderContentEClass, BORDER_CONTENT__COLOR);
		createEAttribute(borderContentEClass, BORDER_CONTENT__STYLE);
		createEReference(borderContentEClass, BORDER_CONTENT__WIDTH);

		rgbEClass = createEClass(RGB);
		createEAttribute(rgbEClass, RGB__RED);
		createEAttribute(rgbEClass, RGB__GREEN);
		createEAttribute(rgbEClass, RGB__BLUE);

		rgbaEClass = createEClass(RGBA);
		createEAttribute(rgbaEClass, RGBA__ALPHA);

		fontEClass = createEClass(FONT);
		createEReference(fontEClass, FONT__SIZE);
		createEAttribute(fontEClass, FONT__STYLE);
		createEAttribute(fontEClass, FONT__VARIANT);
		createEAttribute(fontEClass, FONT__WEIGHT);
		createEAttribute(fontEClass, FONT__FAMILY);
		createEReference(fontEClass, FONT__LINE_HEIGHT);

		backgroundEClass = createEClass(BACKGROUND);
		createEAttribute(backgroundEClass, BACKGROUND__ATTACHMENT);
		createEAttribute(backgroundEClass, BACKGROUND__IMAGE);
		createEAttribute(backgroundEClass, BACKGROUND__REPEAT);
		createEReference(backgroundEClass, BACKGROUND__COLOR);
		createEReference(backgroundEClass, BACKGROUND__POSITION);

		backgroundPositionEClass = createEClass(BACKGROUND_POSITION);
		createEReference(backgroundPositionEClass, BACKGROUND_POSITION__X);
		createEReference(backgroundPositionEClass, BACKGROUND_POSITION__Y);

		lengthEClass = createEClass(LENGTH);
		createEAttribute(lengthEClass, LENGTH__VALUE);
		createEAttribute(lengthEClass, LENGTH__UNIT);

		// Create enums
		borderStyleEEnum = createEEnum(BORDER_STYLE);
		fontStyleEEnum = createEEnum(FONT_STYLE);
		fontVariantEEnum = createEEnum(FONT_VARIANT);
		fontWeightEEnum = createEEnum(FONT_WEIGHT);
		backgroundAttachmentEEnum = createEEnum(BACKGROUND_ATTACHMENT);
		backgroundRepeatEEnum = createEEnum(BACKGROUND_REPEAT);
		unitEEnum = createEEnum(UNIT);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private boolean isInitialized = false;

	/**
	 * Complete the initialization of the package and its meta-model.  This
	 * method is guarded to have no affect on any invocation but its first.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void initializePackageContents() {
		if (isInitialized) return;
		isInitialized = true;

		// Initialize package
		setName(eNAME);
		setNsPrefix(eNS_PREFIX);
		setNsURI(eNS_URI);

		// Create type parameters

		// Set bounds for type parameters

		// Add supertypes to classes
		rgbaEClass.getESuperTypes().add(this.getRGB());

		// Initialize classes and features; add operations and parameters
		initEClass(marginEClass, Margin.class, "Margin", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getMargin_Left(), this.getLength(), null, "left", null, 0, 1, Margin.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getMargin_Top(), this.getLength(), null, "top", null, 0, 1, Margin.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getMargin_Right(), this.getLength(), null, "right", null, 0, 1, Margin.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getMargin_Bottom(), this.getLength(), null, "bottom", null, 0, 1, Margin.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(paddingEClass, Padding.class, "Padding", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getPadding_Left(), this.getLength(), null, "left", null, 0, 1, Padding.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getPadding_Top(), this.getLength(), null, "top", null, 0, 1, Padding.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getPadding_Right(), this.getLength(), null, "right", null, 0, 1, Padding.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getPadding_Bottom(), this.getLength(), null, "bottom", null, 0, 1, Padding.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(borderEClass, Border.class, "Border", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getBorder_Left(), this.getBorderContent(), null, "left", null, 0, 1, Border.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBorder_Top(), this.getBorderContent(), null, "top", null, 0, 1, Border.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBorder_Right(), this.getBorderContent(), null, "right", null, 0, 1, Border.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBorder_Bottom(), this.getBorderContent(), null, "bottom", null, 0, 1, Border.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(borderContentEClass, BorderContent.class, "BorderContent", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getBorderContent_Color(), this.getRGB(), null, "color", null, 0, 1, BorderContent.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getBorderContent_Style(), this.getBorderStyle(), "style", null, 0, 1, BorderContent.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBorderContent_Width(), this.getLength(), null, "width", null, 0, 1, BorderContent.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(rgbEClass, org.summer.view.widget.style.RGB.class, "RGB", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEAttribute(getRGB_Red(), ecorePackage.getEInt(), "red", null, 0, 1, org.summer.view.widget.style.RGB.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getRGB_Green(), ecorePackage.getEInt(), "green", null, 0, 1, org.summer.view.widget.style.RGB.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getRGB_Blue(), ecorePackage.getEInt(), "blue", null, 0, 1, org.summer.view.widget.style.RGB.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(rgbaEClass, org.summer.view.widget.style.RGBA.class, "RGBA", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEAttribute(getRGBA_Alpha(), ecorePackage.getEInt(), "alpha", null, 0, 1, org.summer.view.widget.style.RGBA.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(fontEClass, Font.class, "Font", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getFont_Size(), this.getLength(), null, "size", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getFont_Style(), this.getFontStyle(), "style", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getFont_Variant(), this.getFontVariant(), "variant", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getFont_Weight(), this.getFontWeight(), "weight", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getFont_Family(), ecorePackage.getEString(), "family", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getFont_LineHeight(), this.getLength(), null, "lineHeight", null, 0, 1, Font.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(backgroundEClass, Background.class, "Background", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEAttribute(getBackground_Attachment(), this.getBackgroundAttachment(), "attachment", null, 0, 1, Background.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getBackground_Image(), ecorePackage.getEString(), "image", null, 0, 1, Background.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getBackground_Repeat(), this.getBackgroundRepeat(), "repeat", null, 0, 1, Background.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBackground_Color(), this.getRGB(), null, "color", null, 0, 1, Background.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBackground_Position(), this.getBackgroundPosition(), null, "position", null, 0, 1, Background.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_COMPOSITE, IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(backgroundPositionEClass, BackgroundPosition.class, "BackgroundPosition", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEReference(getBackgroundPosition_X(), this.getLength(), null, "x", null, 0, 1, BackgroundPosition.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEReference(getBackgroundPosition_Y(), this.getLength(), null, "y", null, 0, 1, BackgroundPosition.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, IS_COMPOSITE, !IS_RESOLVE_PROXIES, !IS_UNSETTABLE, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		initEClass(lengthEClass, Length.class, "Length", !IS_ABSTRACT, !IS_INTERFACE, IS_GENERATED_INSTANCE_CLASS);
		initEAttribute(getLength_Value(), ecorePackage.getEDouble(), "value", null, 0, 1, Length.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);
		initEAttribute(getLength_Unit(), this.getUnit(), "unit", null, 0, 1, Length.class, !IS_TRANSIENT, !IS_VOLATILE, IS_CHANGEABLE, !IS_UNSETTABLE, !IS_ID, IS_UNIQUE, !IS_DERIVED, IS_ORDERED);

		// Initialize enums and add enum literals
		initEEnum(borderStyleEEnum, BorderStyle.class, "BorderStyle");
		addEEnumLiteral(borderStyleEEnum, BorderStyle.NONE);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.HIDDEN);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.DOTTED);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.DASHED);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.SOLID);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.DOUBLE);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.GROOVE);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.RIDGE);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.INSERT);
		addEEnumLiteral(borderStyleEEnum, BorderStyle.OUTSET);

		initEEnum(fontStyleEEnum, FontStyle.class, "FontStyle");
		addEEnumLiteral(fontStyleEEnum, FontStyle.NORMAL);
		addEEnumLiteral(fontStyleEEnum, FontStyle.ITALIC);
		addEEnumLiteral(fontStyleEEnum, FontStyle.OBLIQUE);

		initEEnum(fontVariantEEnum, FontVariant.class, "FontVariant");
		addEEnumLiteral(fontVariantEEnum, FontVariant.NORMAL);
		addEEnumLiteral(fontVariantEEnum, FontVariant.SMALL_CAPS);

		initEEnum(fontWeightEEnum, FontWeight.class, "FontWeight");
		addEEnumLiteral(fontWeightEEnum, FontWeight.BOLD);
		addEEnumLiteral(fontWeightEEnum, FontWeight.NORMAL);
		addEEnumLiteral(fontWeightEEnum, FontWeight.BOLDER);
		addEEnumLiteral(fontWeightEEnum, FontWeight.LIGHTER);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W100);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W200);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W300);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W400);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W500);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W600);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W700);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W800);
		addEEnumLiteral(fontWeightEEnum, FontWeight.W900);
		addEEnumLiteral(fontWeightEEnum, FontWeight.INHERIT);

		initEEnum(backgroundAttachmentEEnum, BackgroundAttachment.class, "BackgroundAttachment");
		addEEnumLiteral(backgroundAttachmentEEnum, BackgroundAttachment.FIXED);
		addEEnumLiteral(backgroundAttachmentEEnum, BackgroundAttachment.SCROLL);
		addEEnumLiteral(backgroundAttachmentEEnum, BackgroundAttachment.INHERIT);

		initEEnum(backgroundRepeatEEnum, BackgroundRepeat.class, "BackgroundRepeat");
		addEEnumLiteral(backgroundRepeatEEnum, BackgroundRepeat.REPAET_X);
		addEEnumLiteral(backgroundRepeatEEnum, BackgroundRepeat.REPEAT_Y);
		addEEnumLiteral(backgroundRepeatEEnum, BackgroundRepeat.NO_REPEAT);
		addEEnumLiteral(backgroundRepeatEEnum, BackgroundRepeat.INHERIT);

		initEEnum(unitEEnum, Unit.class, "Unit");
		addEEnumLiteral(unitEEnum, Unit.PIXEL);
		addEEnumLiteral(unitEEnum, Unit.POINT);
		addEEnumLiteral(unitEEnum, Unit.PICA);
		addEEnumLiteral(unitEEnum, Unit.MM);
		addEEnumLiteral(unitEEnum, Unit.CM);
		addEEnumLiteral(unitEEnum, Unit.IN);
		addEEnumLiteral(unitEEnum, Unit.PCRCENT);
		addEEnumLiteral(unitEEnum, Unit.EM);
		addEEnumLiteral(unitEEnum, Unit.EX);
	}

} //StylePackageImpl
