/**
 */
package org.summer.view.widget.shapes;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;
import org.summer.view.widget.WidgetPackage;

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
 * @see org.summer.view.widget.shapes.ShapesFactory
 * @model kind="package"
 * @generated
 */
public interface ShapesPackage extends EPackage {
	/**
	 * The package name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNAME = "shapes";

	/**
	 * The package namespace URI.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_URI = "shapes";

	/**
	 * The package namespace name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_PREFIX = "shapes";

	/**
	 * The singleton instance of the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	ShapesPackage eINSTANCE = org.summer.view.widget.shapes.impl.ShapesPackageImpl.init();

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.ShapeImpl <em>Shape</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.ShapeImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getShape()
	 * @generated
	 */
	int SHAPE = 0;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Shape</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SHAPE_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.EllipseImpl <em>Ellipse</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.EllipseImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getEllipse()
	 * @generated
	 */
	int ELLIPSE = 1;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Stroke</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__STROKE = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Fill</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__FILL = SHAPE_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Cx</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__CX = SHAPE_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>Cy</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__CY = SHAPE_FEATURE_COUNT + 3;

	/**
	 * The feature id for the '<em><b>Rx</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__RX = SHAPE_FEATURE_COUNT + 4;

	/**
	 * The feature id for the '<em><b>Ry</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE__RY = SHAPE_FEATURE_COUNT + 5;

	/**
	 * The number of structural features of the '<em>Ellipse</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ELLIPSE_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 6;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.LineImpl <em>Line</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.LineImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getLine()
	 * @generated
	 */
	int LINE = 2;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Line</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LINE_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.PathImpl <em>Path</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.PathImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPath()
	 * @generated
	 */
	int PATH = 3;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Path</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PATH_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.PolygonImpl <em>Polygon</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.PolygonImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPolygon()
	 * @generated
	 */
	int POLYGON = 4;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Polygon</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYGON_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.PolylineImpl <em>Polyline</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.PolylineImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPolyline()
	 * @generated
	 */
	int POLYLINE = 5;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Polyline</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int POLYLINE_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.RetangleImpl <em>Retangle</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.RetangleImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getRetangle()
	 * @generated
	 */
	int RETANGLE = 6;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__VSIBILITY = SHAPE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__NAME = SHAPE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__MARGIN = SHAPE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__PADDING = SHAPE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__BORDER = SHAPE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__WIDTH = SHAPE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__HEIGHT = SHAPE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__MAX_HEIGHT = SHAPE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__MIN_HEIGHT = SHAPE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__MIN_WIDTH = SHAPE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__MAX_WIDTH = SHAPE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__RESOURCES = SHAPE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__TRIGGERS = SHAPE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__STYLE = SHAPE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__TOOLTIP = SHAPE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__ACTUAL_HEIGHT = SHAPE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__ACTUAL_WIDTH = SHAPE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE__DATA_CONTEXT = SHAPE__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Retangle</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RETANGLE_FEATURE_COUNT = SHAPE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.shapes.impl.StrokeImpl <em>Stroke</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.shapes.impl.StrokeImpl
	 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getStroke()
	 * @generated
	 */
	int STROKE = 7;

	/**
	 * The feature id for the '<em><b>Color</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__COLOR = 0;

	/**
	 * The feature id for the '<em><b>Width</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__WIDTH = 1;

	/**
	 * The feature id for the '<em><b>Dasharray</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__DASHARRAY = 2;

	/**
	 * The feature id for the '<em><b>Dashoffset</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__DASHOFFSET = 3;

	/**
	 * The feature id for the '<em><b>Linecap</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__LINECAP = 4;

	/**
	 * The feature id for the '<em><b>Linejoin</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__LINEJOIN = 5;

	/**
	 * The feature id for the '<em><b>Linemiterlimit</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE__LINEMITERLIMIT = 6;

	/**
	 * The number of structural features of the '<em>Stroke</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STROKE_FEATURE_COUNT = 7;


	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Shape <em>Shape</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Shape</em>'.
	 * @see org.summer.view.widget.shapes.Shape
	 * @generated
	 */
	EClass getShape();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Ellipse <em>Ellipse</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Ellipse</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse
	 * @generated
	 */
	EClass getEllipse();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.shapes.Ellipse#getStroke <em>Stroke</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Stroke</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getStroke()
	 * @see #getEllipse()
	 * @generated
	 */
	EReference getEllipse_Stroke();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.shapes.Ellipse#getFill <em>Fill</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Fill</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getFill()
	 * @see #getEllipse()
	 * @generated
	 */
	EReference getEllipse_Fill();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Ellipse#getCx <em>Cx</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Cx</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getCx()
	 * @see #getEllipse()
	 * @generated
	 */
	EAttribute getEllipse_Cx();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Ellipse#getCy <em>Cy</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Cy</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getCy()
	 * @see #getEllipse()
	 * @generated
	 */
	EAttribute getEllipse_Cy();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Ellipse#getRx <em>Rx</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Rx</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getRx()
	 * @see #getEllipse()
	 * @generated
	 */
	EAttribute getEllipse_Rx();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Ellipse#getRy <em>Ry</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Ry</em>'.
	 * @see org.summer.view.widget.shapes.Ellipse#getRy()
	 * @see #getEllipse()
	 * @generated
	 */
	EAttribute getEllipse_Ry();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Line <em>Line</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Line</em>'.
	 * @see org.summer.view.widget.shapes.Line
	 * @generated
	 */
	EClass getLine();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Path <em>Path</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Path</em>'.
	 * @see org.summer.view.widget.shapes.Path
	 * @generated
	 */
	EClass getPath();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Polygon <em>Polygon</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Polygon</em>'.
	 * @see org.summer.view.widget.shapes.Polygon
	 * @generated
	 */
	EClass getPolygon();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Polyline <em>Polyline</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Polyline</em>'.
	 * @see org.summer.view.widget.shapes.Polyline
	 * @generated
	 */
	EClass getPolyline();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Retangle <em>Retangle</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Retangle</em>'.
	 * @see org.summer.view.widget.shapes.Retangle
	 * @generated
	 */
	EClass getRetangle();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.shapes.Stroke <em>Stroke</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Stroke</em>'.
	 * @see org.summer.view.widget.shapes.Stroke
	 * @generated
	 */
	EClass getStroke();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.shapes.Stroke#getColor <em>Color</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Color</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getColor()
	 * @see #getStroke()
	 * @generated
	 */
	EReference getStroke_Color();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.shapes.Stroke#getWidth <em>Width</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Width</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getWidth()
	 * @see #getStroke()
	 * @generated
	 */
	EReference getStroke_Width();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Stroke#getDasharray <em>Dasharray</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Dasharray</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getDasharray()
	 * @see #getStroke()
	 * @generated
	 */
	EAttribute getStroke_Dasharray();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Stroke#getDashoffset <em>Dashoffset</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Dashoffset</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getDashoffset()
	 * @see #getStroke()
	 * @generated
	 */
	EAttribute getStroke_Dashoffset();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Stroke#getLinecap <em>Linecap</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Linecap</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getLinecap()
	 * @see #getStroke()
	 * @generated
	 */
	EAttribute getStroke_Linecap();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Stroke#getLinejoin <em>Linejoin</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Linejoin</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getLinejoin()
	 * @see #getStroke()
	 * @generated
	 */
	EAttribute getStroke_Linejoin();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.shapes.Stroke#getLinemiterlimit <em>Linemiterlimit</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Linemiterlimit</em>'.
	 * @see org.summer.view.widget.shapes.Stroke#getLinemiterlimit()
	 * @see #getStroke()
	 * @generated
	 */
	EAttribute getStroke_Linemiterlimit();

	/**
	 * Returns the factory that creates the instances of the model.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the factory that creates the instances of the model.
	 * @generated
	 */
	ShapesFactory getShapesFactory();

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
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.ShapeImpl <em>Shape</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.ShapeImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getShape()
		 * @generated
		 */
		EClass SHAPE = eINSTANCE.getShape();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.EllipseImpl <em>Ellipse</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.EllipseImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getEllipse()
		 * @generated
		 */
		EClass ELLIPSE = eINSTANCE.getEllipse();

		/**
		 * The meta object literal for the '<em><b>Stroke</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference ELLIPSE__STROKE = eINSTANCE.getEllipse_Stroke();

		/**
		 * The meta object literal for the '<em><b>Fill</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference ELLIPSE__FILL = eINSTANCE.getEllipse_Fill();

		/**
		 * The meta object literal for the '<em><b>Cx</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute ELLIPSE__CX = eINSTANCE.getEllipse_Cx();

		/**
		 * The meta object literal for the '<em><b>Cy</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute ELLIPSE__CY = eINSTANCE.getEllipse_Cy();

		/**
		 * The meta object literal for the '<em><b>Rx</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute ELLIPSE__RX = eINSTANCE.getEllipse_Rx();

		/**
		 * The meta object literal for the '<em><b>Ry</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute ELLIPSE__RY = eINSTANCE.getEllipse_Ry();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.LineImpl <em>Line</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.LineImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getLine()
		 * @generated
		 */
		EClass LINE = eINSTANCE.getLine();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.PathImpl <em>Path</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.PathImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPath()
		 * @generated
		 */
		EClass PATH = eINSTANCE.getPath();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.PolygonImpl <em>Polygon</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.PolygonImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPolygon()
		 * @generated
		 */
		EClass POLYGON = eINSTANCE.getPolygon();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.PolylineImpl <em>Polyline</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.PolylineImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getPolyline()
		 * @generated
		 */
		EClass POLYLINE = eINSTANCE.getPolyline();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.RetangleImpl <em>Retangle</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.RetangleImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getRetangle()
		 * @generated
		 */
		EClass RETANGLE = eINSTANCE.getRetangle();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.shapes.impl.StrokeImpl <em>Stroke</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.shapes.impl.StrokeImpl
		 * @see org.summer.view.widget.shapes.impl.ShapesPackageImpl#getStroke()
		 * @generated
		 */
		EClass STROKE = eINSTANCE.getStroke();

		/**
		 * The meta object literal for the '<em><b>Color</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference STROKE__COLOR = eINSTANCE.getStroke_Color();

		/**
		 * The meta object literal for the '<em><b>Width</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference STROKE__WIDTH = eINSTANCE.getStroke_Width();

		/**
		 * The meta object literal for the '<em><b>Dasharray</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STROKE__DASHARRAY = eINSTANCE.getStroke_Dasharray();

		/**
		 * The meta object literal for the '<em><b>Dashoffset</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STROKE__DASHOFFSET = eINSTANCE.getStroke_Dashoffset();

		/**
		 * The meta object literal for the '<em><b>Linecap</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STROKE__LINECAP = eINSTANCE.getStroke_Linecap();

		/**
		 * The meta object literal for the '<em><b>Linejoin</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STROKE__LINEJOIN = eINSTANCE.getStroke_Linejoin();

		/**
		 * The meta object literal for the '<em><b>Linemiterlimit</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STROKE__LINEMITERLIMIT = eINSTANCE.getStroke_Linemiterlimit();

	}

} //ShapesPackage
