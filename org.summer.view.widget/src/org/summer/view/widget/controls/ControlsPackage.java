/**
 */
package org.summer.view.widget.controls;

import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EEnum;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EReference;
import org.summer.view.widget.WidgetPackage;
import org.summer.view.widget.controls.primitives.PrimitivesPackage;

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
 * @see org.summer.view.widget.controls.ControlsFactory
 * @model kind="package"
 * @generated
 */
public interface ControlsPackage extends EPackage {
	/**
	 * The package name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNAME = "controls";

	/**
	 * The package namespace URI.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_URI = "controls";

	/**
	 * The package namespace name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	String eNS_PREFIX = "controls";

	/**
	 * The singleton instance of the package.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	ControlsPackage eINSTANCE = org.summer.view.widget.controls.impl.ControlsPackageImpl.init();

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ControlImpl <em>Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getControl()
	 * @generated
	 */
	int CONTROL = 0;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__BACKGROUND = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__FONT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__TAB_INDEX = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL__FOREGROUND = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 3;

	/**
	 * The number of structural features of the '<em>Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTROL_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.MediaElementImpl <em>Media Element</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.MediaElementImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMediaElement()
	 * @generated
	 */
	int MEDIA_ELEMENT = 1;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Media Element</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MEDIA_ELEMENT_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.RichTextBoxImpl <em>Rich Text Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.RichTextBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRichTextBox()
	 * @generated
	 */
	int RICH_TEXT_BOX = 2;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__VSIBILITY = PrimitivesPackage.TEXT_BOX_BASE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__NAME = PrimitivesPackage.TEXT_BOX_BASE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__MARGIN = PrimitivesPackage.TEXT_BOX_BASE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__PADDING = PrimitivesPackage.TEXT_BOX_BASE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__BORDER = PrimitivesPackage.TEXT_BOX_BASE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__WIDTH = PrimitivesPackage.TEXT_BOX_BASE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__HEIGHT = PrimitivesPackage.TEXT_BOX_BASE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__MAX_HEIGHT = PrimitivesPackage.TEXT_BOX_BASE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__MIN_HEIGHT = PrimitivesPackage.TEXT_BOX_BASE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__MIN_WIDTH = PrimitivesPackage.TEXT_BOX_BASE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__MAX_WIDTH = PrimitivesPackage.TEXT_BOX_BASE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__RESOURCES = PrimitivesPackage.TEXT_BOX_BASE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__TRIGGERS = PrimitivesPackage.TEXT_BOX_BASE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__STYLE = PrimitivesPackage.TEXT_BOX_BASE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__TOOLTIP = PrimitivesPackage.TEXT_BOX_BASE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__ACTUAL_HEIGHT = PrimitivesPackage.TEXT_BOX_BASE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__ACTUAL_WIDTH = PrimitivesPackage.TEXT_BOX_BASE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__DATA_CONTEXT = PrimitivesPackage.TEXT_BOX_BASE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__BACKGROUND = PrimitivesPackage.TEXT_BOX_BASE__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__FONT = PrimitivesPackage.TEXT_BOX_BASE__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__TAB_INDEX = PrimitivesPackage.TEXT_BOX_BASE__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX__FOREGROUND = PrimitivesPackage.TEXT_BOX_BASE__FOREGROUND;

	/**
	 * The number of structural features of the '<em>Rich Text Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RICH_TEXT_BOX_FEATURE_COUNT = PrimitivesPackage.TEXT_BOX_BASE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ContentControlImpl <em>Content Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ContentControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getContentControl()
	 * @generated
	 */
	int CONTENT_CONTROL = 3;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__VSIBILITY = CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__NAME = CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__MARGIN = CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__PADDING = CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__BORDER = CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__WIDTH = CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__HEIGHT = CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__MAX_HEIGHT = CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__MIN_HEIGHT = CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__MIN_WIDTH = CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__MAX_WIDTH = CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__RESOURCES = CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__TRIGGERS = CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__STYLE = CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__TOOLTIP = CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__ACTUAL_HEIGHT = CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__ACTUAL_WIDTH = CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__DATA_CONTEXT = CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__BACKGROUND = CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__FONT = CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__TAB_INDEX = CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__FOREGROUND = CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL__CONTENT = CONTROL_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>Content Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTENT_CONTROL_FEATURE_COUNT = CONTROL_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.PasswordBoxImpl <em>Password Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.PasswordBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getPasswordBox()
	 * @generated
	 */
	int PASSWORD_BOX = 4;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__VSIBILITY = CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__NAME = CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MARGIN = CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__PADDING = CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__BORDER = CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__WIDTH = CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__HEIGHT = CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MAX_HEIGHT = CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MIN_HEIGHT = CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MIN_WIDTH = CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MAX_WIDTH = CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__RESOURCES = CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__TRIGGERS = CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__STYLE = CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__TOOLTIP = CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__ACTUAL_HEIGHT = CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__ACTUAL_WIDTH = CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__DATA_CONTEXT = CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__BACKGROUND = CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__FONT = CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__TAB_INDEX = CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__FOREGROUND = CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Max Length</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__MAX_LENGTH = CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Password</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__PASSWORD = CONTROL_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Password Char</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX__PASSWORD_CHAR = CONTROL_FEATURE_COUNT + 2;

	/**
	 * The number of structural features of the '<em>Password Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PASSWORD_BOX_FEATURE_COUNT = CONTROL_FEATURE_COUNT + 3;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ItemsControlImpl <em>Items Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ItemsControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getItemsControl()
	 * @generated
	 */
	int ITEMS_CONTROL = 5;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__VSIBILITY = CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__NAME = CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__MARGIN = CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__PADDING = CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__BORDER = CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__WIDTH = CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__HEIGHT = CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__MAX_HEIGHT = CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__MIN_HEIGHT = CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__MIN_WIDTH = CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__MAX_WIDTH = CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__RESOURCES = CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__TRIGGERS = CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__STYLE = CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__TOOLTIP = CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__ACTUAL_HEIGHT = CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__ACTUAL_WIDTH = CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__DATA_CONTEXT = CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__BACKGROUND = CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__FONT = CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__TAB_INDEX = CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__FOREGROUND = CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__ITEMS = CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__ITEMS_SOURCE = CONTROL_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL__ITEM_TEMPLATE = CONTROL_FEATURE_COUNT + 2;

	/**
	 * The number of structural features of the '<em>Items Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ITEMS_CONTROL_FEATURE_COUNT = CONTROL_FEATURE_COUNT + 3;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.SeparatorImpl <em>Separator</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.SeparatorImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getSeparator()
	 * @generated
	 */
	int SEPARATOR = 6;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__VSIBILITY = CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__NAME = CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__MARGIN = CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__PADDING = CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__BORDER = CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__WIDTH = CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__HEIGHT = CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__MAX_HEIGHT = CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__MIN_HEIGHT = CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__MIN_WIDTH = CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__MAX_WIDTH = CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__RESOURCES = CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__TRIGGERS = CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__STYLE = CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__TOOLTIP = CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__ACTUAL_HEIGHT = CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__ACTUAL_WIDTH = CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__DATA_CONTEXT = CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__BACKGROUND = CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__FONT = CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__TAB_INDEX = CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR__FOREGROUND = CONTROL__FOREGROUND;

	/**
	 * The number of structural features of the '<em>Separator</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SEPARATOR_FEATURE_COUNT = CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.FrameImpl <em>Frame</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.FrameImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getFrame()
	 * @generated
	 */
	int FRAME = 7;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Source</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__SOURCE = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Base Uri</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME__BASE_URI = CONTENT_CONTROL_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>Frame</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int FRAME_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.LabelImpl <em>Label</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.LabelImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getLabel()
	 * @generated
	 */
	int LABEL = 8;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Text</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__TEXT = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Target</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL__TARGET = CONTENT_CONTROL_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>Label</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LABEL_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ImageImpl <em>Image</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ImageImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getImage()
	 * @generated
	 */
	int IMAGE = 9;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Source</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE__SOURCE = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>Image</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int IMAGE_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.TextBlockImpl <em>Text Block</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.TextBlockImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTextBlock()
	 * @generated
	 */
	int TEXT_BLOCK = 10;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Text Block</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TEXT_BLOCK_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.PanelImpl <em>Panel</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.PanelImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getPanel()
	 * @generated
	 */
	int PANEL = 11;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__VSIBILITY = CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__NAME = CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__MARGIN = CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__PADDING = CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__BORDER = CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__WIDTH = CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__HEIGHT = CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__MAX_HEIGHT = CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__MIN_HEIGHT = CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__MIN_WIDTH = CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__MAX_WIDTH = CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__RESOURCES = CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__TRIGGERS = CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__STYLE = CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__TOOLTIP = CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__ACTUAL_HEIGHT = CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__ACTUAL_WIDTH = CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__DATA_CONTEXT = CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__BACKGROUND = CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__FONT = CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__TAB_INDEX = CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__FOREGROUND = CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__CHILDREN = CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL__ITEMS_SOURCE = CONTROL_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>Panel</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PANEL_FEATURE_COUNT = CONTROL_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ComboBoxImpl <em>Combo Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ComboBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getComboBox()
	 * @generated
	 */
	int COMBO_BOX = 12;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__VSIBILITY = PrimitivesPackage.SELECTOR__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__NAME = PrimitivesPackage.SELECTOR__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__MARGIN = PrimitivesPackage.SELECTOR__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__PADDING = PrimitivesPackage.SELECTOR__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__BORDER = PrimitivesPackage.SELECTOR__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__WIDTH = PrimitivesPackage.SELECTOR__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__HEIGHT = PrimitivesPackage.SELECTOR__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__MAX_HEIGHT = PrimitivesPackage.SELECTOR__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__MIN_HEIGHT = PrimitivesPackage.SELECTOR__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__MIN_WIDTH = PrimitivesPackage.SELECTOR__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__MAX_WIDTH = PrimitivesPackage.SELECTOR__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__RESOURCES = PrimitivesPackage.SELECTOR__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__TRIGGERS = PrimitivesPackage.SELECTOR__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__STYLE = PrimitivesPackage.SELECTOR__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__TOOLTIP = PrimitivesPackage.SELECTOR__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__ACTUAL_HEIGHT = PrimitivesPackage.SELECTOR__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__ACTUAL_WIDTH = PrimitivesPackage.SELECTOR__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__DATA_CONTEXT = PrimitivesPackage.SELECTOR__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__BACKGROUND = PrimitivesPackage.SELECTOR__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__FONT = PrimitivesPackage.SELECTOR__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__TAB_INDEX = PrimitivesPackage.SELECTOR__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__FOREGROUND = PrimitivesPackage.SELECTOR__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__ITEMS = PrimitivesPackage.SELECTOR__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__ITEMS_SOURCE = PrimitivesPackage.SELECTOR__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__ITEM_TEMPLATE = PrimitivesPackage.SELECTOR__ITEM_TEMPLATE;

	/**
	 * The feature id for the '<em><b>Selected Item</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX__SELECTED_ITEM = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>Combo Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_FEATURE_COUNT = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ListBoxItemImpl <em>List Box Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ListBoxItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListBoxItem()
	 * @generated
	 */
	int LIST_BOX_ITEM = 15;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The number of structural features of the '<em>List Box Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_ITEM_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ComboBoxItemImpl <em>Combo Box Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ComboBoxItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getComboBoxItem()
	 * @generated
	 */
	int COMBO_BOX_ITEM = 13;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__VSIBILITY = LIST_BOX_ITEM__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__NAME = LIST_BOX_ITEM__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__MARGIN = LIST_BOX_ITEM__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__PADDING = LIST_BOX_ITEM__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__BORDER = LIST_BOX_ITEM__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__WIDTH = LIST_BOX_ITEM__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__HEIGHT = LIST_BOX_ITEM__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__MAX_HEIGHT = LIST_BOX_ITEM__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__MIN_HEIGHT = LIST_BOX_ITEM__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__MIN_WIDTH = LIST_BOX_ITEM__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__MAX_WIDTH = LIST_BOX_ITEM__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__RESOURCES = LIST_BOX_ITEM__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__TRIGGERS = LIST_BOX_ITEM__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__STYLE = LIST_BOX_ITEM__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__TOOLTIP = LIST_BOX_ITEM__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__ACTUAL_HEIGHT = LIST_BOX_ITEM__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__ACTUAL_WIDTH = LIST_BOX_ITEM__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__DATA_CONTEXT = LIST_BOX_ITEM__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__BACKGROUND = LIST_BOX_ITEM__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__FONT = LIST_BOX_ITEM__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__TAB_INDEX = LIST_BOX_ITEM__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__FOREGROUND = LIST_BOX_ITEM__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM__CONTENT = LIST_BOX_ITEM__CONTENT;

	/**
	 * The number of structural features of the '<em>Combo Box Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COMBO_BOX_ITEM_FEATURE_COUNT = LIST_BOX_ITEM_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ListBoxImpl <em>List Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ListBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListBox()
	 * @generated
	 */
	int LIST_BOX = 14;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__VSIBILITY = PrimitivesPackage.SELECTOR__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__NAME = PrimitivesPackage.SELECTOR__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__MARGIN = PrimitivesPackage.SELECTOR__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__PADDING = PrimitivesPackage.SELECTOR__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__BORDER = PrimitivesPackage.SELECTOR__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__WIDTH = PrimitivesPackage.SELECTOR__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__HEIGHT = PrimitivesPackage.SELECTOR__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__MAX_HEIGHT = PrimitivesPackage.SELECTOR__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__MIN_HEIGHT = PrimitivesPackage.SELECTOR__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__MIN_WIDTH = PrimitivesPackage.SELECTOR__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__MAX_WIDTH = PrimitivesPackage.SELECTOR__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__RESOURCES = PrimitivesPackage.SELECTOR__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__TRIGGERS = PrimitivesPackage.SELECTOR__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__STYLE = PrimitivesPackage.SELECTOR__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__TOOLTIP = PrimitivesPackage.SELECTOR__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__ACTUAL_HEIGHT = PrimitivesPackage.SELECTOR__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__ACTUAL_WIDTH = PrimitivesPackage.SELECTOR__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__DATA_CONTEXT = PrimitivesPackage.SELECTOR__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__BACKGROUND = PrimitivesPackage.SELECTOR__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__FONT = PrimitivesPackage.SELECTOR__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__TAB_INDEX = PrimitivesPackage.SELECTOR__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__FOREGROUND = PrimitivesPackage.SELECTOR__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__ITEMS = PrimitivesPackage.SELECTOR__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__ITEMS_SOURCE = PrimitivesPackage.SELECTOR__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__ITEM_TEMPLATE = PrimitivesPackage.SELECTOR__ITEM_TEMPLATE;

	/**
	 * The feature id for the '<em><b>Selected Item</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__SELECTED_ITEM = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Selected Items</b></em>' reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX__SELECTED_ITEMS = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>List Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_BOX_FEATURE_COUNT = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ListViewImpl <em>List View</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ListViewImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListView()
	 * @generated
	 */
	int LIST_VIEW = 16;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__VSIBILITY = LIST_BOX__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__NAME = LIST_BOX__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__MARGIN = LIST_BOX__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__PADDING = LIST_BOX__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__BORDER = LIST_BOX__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__WIDTH = LIST_BOX__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__HEIGHT = LIST_BOX__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__MAX_HEIGHT = LIST_BOX__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__MIN_HEIGHT = LIST_BOX__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__MIN_WIDTH = LIST_BOX__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__MAX_WIDTH = LIST_BOX__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__RESOURCES = LIST_BOX__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__TRIGGERS = LIST_BOX__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__STYLE = LIST_BOX__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__TOOLTIP = LIST_BOX__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__ACTUAL_HEIGHT = LIST_BOX__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__ACTUAL_WIDTH = LIST_BOX__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__DATA_CONTEXT = LIST_BOX__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__BACKGROUND = LIST_BOX__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__FONT = LIST_BOX__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__TAB_INDEX = LIST_BOX__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__FOREGROUND = LIST_BOX__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__ITEMS = LIST_BOX__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__ITEMS_SOURCE = LIST_BOX__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__ITEM_TEMPLATE = LIST_BOX__ITEM_TEMPLATE;

	/**
	 * The feature id for the '<em><b>Selected Item</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__SELECTED_ITEM = LIST_BOX__SELECTED_ITEM;

	/**
	 * The feature id for the '<em><b>Selected Items</b></em>' reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW__SELECTED_ITEMS = LIST_BOX__SELECTED_ITEMS;

	/**
	 * The number of structural features of the '<em>List View</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_FEATURE_COUNT = LIST_BOX_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ListViewItemImpl <em>List View Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ListViewItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListViewItem()
	 * @generated
	 */
	int LIST_VIEW_ITEM = 17;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__VSIBILITY = LIST_BOX_ITEM__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__NAME = LIST_BOX_ITEM__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__MARGIN = LIST_BOX_ITEM__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__PADDING = LIST_BOX_ITEM__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__BORDER = LIST_BOX_ITEM__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__WIDTH = LIST_BOX_ITEM__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__HEIGHT = LIST_BOX_ITEM__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__MAX_HEIGHT = LIST_BOX_ITEM__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__MIN_HEIGHT = LIST_BOX_ITEM__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__MIN_WIDTH = LIST_BOX_ITEM__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__MAX_WIDTH = LIST_BOX_ITEM__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__RESOURCES = LIST_BOX_ITEM__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__TRIGGERS = LIST_BOX_ITEM__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__STYLE = LIST_BOX_ITEM__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__TOOLTIP = LIST_BOX_ITEM__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__ACTUAL_HEIGHT = LIST_BOX_ITEM__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__ACTUAL_WIDTH = LIST_BOX_ITEM__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__DATA_CONTEXT = LIST_BOX_ITEM__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__BACKGROUND = LIST_BOX_ITEM__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__FONT = LIST_BOX_ITEM__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__TAB_INDEX = LIST_BOX_ITEM__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__FOREGROUND = LIST_BOX_ITEM__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM__CONTENT = LIST_BOX_ITEM__CONTENT;

	/**
	 * The number of structural features of the '<em>List View Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int LIST_VIEW_ITEM_FEATURE_COUNT = LIST_BOX_ITEM_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.HeaderedContentControlImpl <em>Headered Content Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.HeaderedContentControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getHeaderedContentControl()
	 * @generated
	 */
	int HEADERED_CONTENT_CONTROL = 18;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Header</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL__HEADER = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>Headered Content Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_CONTENT_CONTROL_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ExpanderImpl <em>Expander</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ExpanderImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getExpander()
	 * @generated
	 */
	int EXPANDER = 19;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__VSIBILITY = HEADERED_CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__NAME = HEADERED_CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__MARGIN = HEADERED_CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__PADDING = HEADERED_CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__BORDER = HEADERED_CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__WIDTH = HEADERED_CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__HEIGHT = HEADERED_CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__MAX_HEIGHT = HEADERED_CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__MIN_HEIGHT = HEADERED_CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__MIN_WIDTH = HEADERED_CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__MAX_WIDTH = HEADERED_CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__RESOURCES = HEADERED_CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__TRIGGERS = HEADERED_CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__STYLE = HEADERED_CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__TOOLTIP = HEADERED_CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__ACTUAL_HEIGHT = HEADERED_CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__ACTUAL_WIDTH = HEADERED_CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__DATA_CONTEXT = HEADERED_CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__BACKGROUND = HEADERED_CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__FONT = HEADERED_CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__TAB_INDEX = HEADERED_CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__FOREGROUND = HEADERED_CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__CONTENT = HEADERED_CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Header</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__HEADER = HEADERED_CONTENT_CONTROL__HEADER;

	/**
	 * The feature id for the '<em><b>Expand Direction</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__EXPAND_DIRECTION = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Expanded</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER__EXPANDED = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>Expander</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int EXPANDER_FEATURE_COUNT = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.GroupBoxImpl <em>Group Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.GroupBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGroupBox()
	 * @generated
	 */
	int GROUP_BOX = 20;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__VSIBILITY = HEADERED_CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__NAME = HEADERED_CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__MARGIN = HEADERED_CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__PADDING = HEADERED_CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__BORDER = HEADERED_CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__WIDTH = HEADERED_CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__HEIGHT = HEADERED_CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__MAX_HEIGHT = HEADERED_CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__MIN_HEIGHT = HEADERED_CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__MIN_WIDTH = HEADERED_CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__MAX_WIDTH = HEADERED_CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__RESOURCES = HEADERED_CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__TRIGGERS = HEADERED_CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__STYLE = HEADERED_CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__TOOLTIP = HEADERED_CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__ACTUAL_HEIGHT = HEADERED_CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__ACTUAL_WIDTH = HEADERED_CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__DATA_CONTEXT = HEADERED_CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__BACKGROUND = HEADERED_CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__FONT = HEADERED_CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__TAB_INDEX = HEADERED_CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__FOREGROUND = HEADERED_CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__CONTENT = HEADERED_CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Header</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX__HEADER = HEADERED_CONTENT_CONTROL__HEADER;

	/**
	 * The number of structural features of the '<em>Group Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_BOX_FEATURE_COUNT = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.GroupItemImpl <em>Group Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.GroupItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGroupItem()
	 * @generated
	 */
	int GROUP_ITEM = 21;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The number of structural features of the '<em>Group Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GROUP_ITEM_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.TabItemImpl <em>Tab Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.TabItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTabItem()
	 * @generated
	 */
	int TAB_ITEM = 22;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__VSIBILITY = HEADERED_CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__NAME = HEADERED_CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__MARGIN = HEADERED_CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__PADDING = HEADERED_CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__BORDER = HEADERED_CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__WIDTH = HEADERED_CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__HEIGHT = HEADERED_CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__MAX_HEIGHT = HEADERED_CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__MIN_HEIGHT = HEADERED_CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__MIN_WIDTH = HEADERED_CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__MAX_WIDTH = HEADERED_CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__RESOURCES = HEADERED_CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__TRIGGERS = HEADERED_CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__STYLE = HEADERED_CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__TOOLTIP = HEADERED_CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__ACTUAL_HEIGHT = HEADERED_CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__ACTUAL_WIDTH = HEADERED_CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__DATA_CONTEXT = HEADERED_CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__BACKGROUND = HEADERED_CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__FONT = HEADERED_CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__TAB_INDEX = HEADERED_CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__FOREGROUND = HEADERED_CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__CONTENT = HEADERED_CONTENT_CONTROL__CONTENT;

	/**
	 * The feature id for the '<em><b>Header</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__HEADER = HEADERED_CONTENT_CONTROL__HEADER;

	/**
	 * The feature id for the '<em><b>Selected</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__SELECTED = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Tab Strip Placement</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM__TAB_STRIP_PLACEMENT = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 1;

	/**
	 * The number of structural features of the '<em>Tab Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_ITEM_FEATURE_COUNT = HEADERED_CONTENT_CONTROL_FEATURE_COUNT + 2;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.TabControlImpl <em>Tab Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.TabControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTabControl()
	 * @generated
	 */
	int TAB_CONTROL = 23;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__VSIBILITY = PrimitivesPackage.SELECTOR__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__NAME = PrimitivesPackage.SELECTOR__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__MARGIN = PrimitivesPackage.SELECTOR__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__PADDING = PrimitivesPackage.SELECTOR__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__BORDER = PrimitivesPackage.SELECTOR__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__WIDTH = PrimitivesPackage.SELECTOR__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__HEIGHT = PrimitivesPackage.SELECTOR__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__MAX_HEIGHT = PrimitivesPackage.SELECTOR__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__MIN_HEIGHT = PrimitivesPackage.SELECTOR__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__MIN_WIDTH = PrimitivesPackage.SELECTOR__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__MAX_WIDTH = PrimitivesPackage.SELECTOR__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__RESOURCES = PrimitivesPackage.SELECTOR__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__TRIGGERS = PrimitivesPackage.SELECTOR__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__STYLE = PrimitivesPackage.SELECTOR__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__TOOLTIP = PrimitivesPackage.SELECTOR__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__ACTUAL_HEIGHT = PrimitivesPackage.SELECTOR__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__ACTUAL_WIDTH = PrimitivesPackage.SELECTOR__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__DATA_CONTEXT = PrimitivesPackage.SELECTOR__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__BACKGROUND = PrimitivesPackage.SELECTOR__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__FONT = PrimitivesPackage.SELECTOR__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__TAB_INDEX = PrimitivesPackage.SELECTOR__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__FOREGROUND = PrimitivesPackage.SELECTOR__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__ITEMS = PrimitivesPackage.SELECTOR__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__ITEMS_SOURCE = PrimitivesPackage.SELECTOR__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL__ITEM_TEMPLATE = PrimitivesPackage.SELECTOR__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Tab Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TAB_CONTROL_FEATURE_COUNT = PrimitivesPackage.SELECTOR_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.StackPanelImpl <em>Stack Panel</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.StackPanelImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getStackPanel()
	 * @generated
	 */
	int STACK_PANEL = 24;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__VSIBILITY = PANEL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__NAME = PANEL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__MARGIN = PANEL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__PADDING = PANEL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__BORDER = PANEL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__WIDTH = PANEL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__HEIGHT = PANEL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__MAX_HEIGHT = PANEL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__MIN_HEIGHT = PANEL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__MIN_WIDTH = PANEL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__MAX_WIDTH = PANEL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__RESOURCES = PANEL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__TRIGGERS = PANEL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__STYLE = PANEL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__TOOLTIP = PANEL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__ACTUAL_HEIGHT = PANEL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__ACTUAL_WIDTH = PANEL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__DATA_CONTEXT = PANEL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__BACKGROUND = PANEL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__FONT = PANEL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__TAB_INDEX = PANEL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__FOREGROUND = PANEL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__CHILDREN = PANEL__CHILDREN;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__ITEMS_SOURCE = PANEL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Orientation</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__ORIENTATION = PANEL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Can Horizontally Scroll</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__CAN_HORIZONTALLY_SCROLL = PANEL_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Can Vertically Scroll</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL__CAN_VERTICALLY_SCROLL = PANEL_FEATURE_COUNT + 2;

	/**
	 * The number of structural features of the '<em>Stack Panel</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int STACK_PANEL_FEATURE_COUNT = PANEL_FEATURE_COUNT + 3;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.GridImpl <em>Grid</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.GridImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGrid()
	 * @generated
	 */
	int GRID = 25;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__VSIBILITY = PANEL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__NAME = PANEL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__MARGIN = PANEL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__PADDING = PANEL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__BORDER = PANEL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__WIDTH = PANEL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__HEIGHT = PANEL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__MAX_HEIGHT = PANEL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__MIN_HEIGHT = PANEL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__MIN_WIDTH = PANEL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__MAX_WIDTH = PANEL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__RESOURCES = PANEL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__TRIGGERS = PANEL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__STYLE = PANEL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__TOOLTIP = PANEL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__ACTUAL_HEIGHT = PANEL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__ACTUAL_WIDTH = PANEL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__DATA_CONTEXT = PANEL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__BACKGROUND = PANEL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__FONT = PANEL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__TAB_INDEX = PANEL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__FOREGROUND = PANEL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__CHILDREN = PANEL__CHILDREN;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__ITEMS_SOURCE = PANEL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Column</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__COLUMN = PANEL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Column Span</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__COLUMN_SPAN = PANEL_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Row</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__ROW = PANEL_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>Row Span</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID__ROW_SPAN = PANEL_FEATURE_COUNT + 3;

	/**
	 * The number of structural features of the '<em>Grid</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int GRID_FEATURE_COUNT = PANEL_FEATURE_COUNT + 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DefinitionBaseImpl <em>Definition Base</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DefinitionBaseImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDefinitionBase()
	 * @generated
	 */
	int DEFINITION_BASE = 26;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Definition Base</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DEFINITION_BASE_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ColumnDefinitionImpl <em>Column Definition</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ColumnDefinitionImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getColumnDefinition()
	 * @generated
	 */
	int COLUMN_DEFINITION = 27;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Column Definition</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int COLUMN_DEFINITION_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.RowDefinitionImpl <em>Row Definition</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.RowDefinitionImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRowDefinition()
	 * @generated
	 */
	int ROW_DEFINITION = 28;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__VSIBILITY = WidgetPackage.FRAMEWORK_ELEMENT__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__NAME = WidgetPackage.FRAMEWORK_ELEMENT__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__MARGIN = WidgetPackage.FRAMEWORK_ELEMENT__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__PADDING = WidgetPackage.FRAMEWORK_ELEMENT__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__BORDER = WidgetPackage.FRAMEWORK_ELEMENT__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__MAX_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__MIN_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__MIN_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__MAX_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__RESOURCES = WidgetPackage.FRAMEWORK_ELEMENT__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__TRIGGERS = WidgetPackage.FRAMEWORK_ELEMENT__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__STYLE = WidgetPackage.FRAMEWORK_ELEMENT__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__TOOLTIP = WidgetPackage.FRAMEWORK_ELEMENT__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__ACTUAL_HEIGHT = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__ACTUAL_WIDTH = WidgetPackage.FRAMEWORK_ELEMENT__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION__DATA_CONTEXT = WidgetPackage.FRAMEWORK_ELEMENT__DATA_CONTEXT;

	/**
	 * The number of structural features of the '<em>Row Definition</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int ROW_DEFINITION_FEATURE_COUNT = WidgetPackage.FRAMEWORK_ELEMENT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DockPanelImpl <em>Dock Panel</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DockPanelImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDockPanel()
	 * @generated
	 */
	int DOCK_PANEL = 29;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__VSIBILITY = PANEL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__NAME = PANEL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__MARGIN = PANEL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__PADDING = PANEL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__BORDER = PANEL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__WIDTH = PANEL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__HEIGHT = PANEL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__MAX_HEIGHT = PANEL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__MIN_HEIGHT = PANEL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__MIN_WIDTH = PANEL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__MAX_WIDTH = PANEL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__RESOURCES = PANEL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__TRIGGERS = PANEL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__STYLE = PANEL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__TOOLTIP = PANEL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__ACTUAL_HEIGHT = PANEL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__ACTUAL_WIDTH = PANEL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__DATA_CONTEXT = PANEL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__BACKGROUND = PANEL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__FONT = PANEL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__TAB_INDEX = PANEL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__FOREGROUND = PANEL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__CHILDREN = PANEL__CHILDREN;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__ITEMS_SOURCE = PANEL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Dock</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL__DOCK = PANEL_FEATURE_COUNT + 0;

	/**
	 * The number of structural features of the '<em>Dock Panel</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DOCK_PANEL_FEATURE_COUNT = PANEL_FEATURE_COUNT + 1;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.WrapPanelImpl <em>Wrap Panel</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.WrapPanelImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getWrapPanel()
	 * @generated
	 */
	int WRAP_PANEL = 30;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__VSIBILITY = PANEL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__NAME = PANEL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__MARGIN = PANEL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__PADDING = PANEL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__BORDER = PANEL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__WIDTH = PANEL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__HEIGHT = PANEL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__MAX_HEIGHT = PANEL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__MIN_HEIGHT = PANEL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__MIN_WIDTH = PANEL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__MAX_WIDTH = PANEL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__RESOURCES = PANEL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__TRIGGERS = PANEL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__STYLE = PANEL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__TOOLTIP = PANEL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__ACTUAL_HEIGHT = PANEL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__ACTUAL_WIDTH = PANEL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__DATA_CONTEXT = PANEL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__BACKGROUND = PANEL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__FONT = PANEL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__TAB_INDEX = PANEL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__FOREGROUND = PANEL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__CHILDREN = PANEL__CHILDREN;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL__ITEMS_SOURCE = PANEL__ITEMS_SOURCE;

	/**
	 * The number of structural features of the '<em>Wrap Panel</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int WRAP_PANEL_FEATURE_COUNT = PANEL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.CanvasImpl <em>Canvas</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.CanvasImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getCanvas()
	 * @generated
	 */
	int CANVAS = 31;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__VSIBILITY = PANEL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__NAME = PANEL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__MARGIN = PANEL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__PADDING = PANEL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__BORDER = PANEL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__WIDTH = PANEL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__HEIGHT = PANEL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__MAX_HEIGHT = PANEL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__MIN_HEIGHT = PANEL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__MIN_WIDTH = PANEL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__MAX_WIDTH = PANEL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__RESOURCES = PANEL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__TRIGGERS = PANEL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__STYLE = PANEL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__TOOLTIP = PANEL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__ACTUAL_HEIGHT = PANEL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__ACTUAL_WIDTH = PANEL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__DATA_CONTEXT = PANEL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__BACKGROUND = PANEL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__FONT = PANEL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__TAB_INDEX = PANEL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__FOREGROUND = PANEL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Children</b></em>' containment reference list.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__CHILDREN = PANEL__CHILDREN;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__ITEMS_SOURCE = PANEL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Left</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__LEFT = PANEL_FEATURE_COUNT + 0;

	/**
	 * The feature id for the '<em><b>Right</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__RIGHT = PANEL_FEATURE_COUNT + 1;

	/**
	 * The feature id for the '<em><b>Top</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__TOP = PANEL_FEATURE_COUNT + 2;

	/**
	 * The feature id for the '<em><b>Bottom</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS__BOTTOM = PANEL_FEATURE_COUNT + 3;

	/**
	 * The number of structural features of the '<em>Canvas</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CANVAS_FEATURE_COUNT = PANEL_FEATURE_COUNT + 4;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.TreeViewImpl <em>Tree View</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.TreeViewImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTreeView()
	 * @generated
	 */
	int TREE_VIEW = 32;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__VSIBILITY = ITEMS_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__NAME = ITEMS_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__MARGIN = ITEMS_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__PADDING = ITEMS_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__BORDER = ITEMS_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__WIDTH = ITEMS_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__HEIGHT = ITEMS_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__MAX_HEIGHT = ITEMS_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__MIN_HEIGHT = ITEMS_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__MIN_WIDTH = ITEMS_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__MAX_WIDTH = ITEMS_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__RESOURCES = ITEMS_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__TRIGGERS = ITEMS_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__STYLE = ITEMS_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__TOOLTIP = ITEMS_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__ACTUAL_HEIGHT = ITEMS_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__ACTUAL_WIDTH = ITEMS_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__DATA_CONTEXT = ITEMS_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__BACKGROUND = ITEMS_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__FONT = ITEMS_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__TAB_INDEX = ITEMS_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__FOREGROUND = ITEMS_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__ITEMS = ITEMS_CONTROL__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__ITEMS_SOURCE = ITEMS_CONTROL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW__ITEM_TEMPLATE = ITEMS_CONTROL__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Tree View</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_FEATURE_COUNT = ITEMS_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.HeaderedItemsControlImpl <em>Headered Items Control</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.HeaderedItemsControlImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getHeaderedItemsControl()
	 * @generated
	 */
	int HEADERED_ITEMS_CONTROL = 33;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__VSIBILITY = ITEMS_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__NAME = ITEMS_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__MARGIN = ITEMS_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__PADDING = ITEMS_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__BORDER = ITEMS_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__WIDTH = ITEMS_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__HEIGHT = ITEMS_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__MAX_HEIGHT = ITEMS_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__MIN_HEIGHT = ITEMS_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__MIN_WIDTH = ITEMS_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__MAX_WIDTH = ITEMS_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__RESOURCES = ITEMS_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__TRIGGERS = ITEMS_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__STYLE = ITEMS_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__TOOLTIP = ITEMS_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__ACTUAL_HEIGHT = ITEMS_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__ACTUAL_WIDTH = ITEMS_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__DATA_CONTEXT = ITEMS_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__BACKGROUND = ITEMS_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__FONT = ITEMS_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__TAB_INDEX = ITEMS_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__FOREGROUND = ITEMS_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__ITEMS = ITEMS_CONTROL__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__ITEMS_SOURCE = ITEMS_CONTROL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL__ITEM_TEMPLATE = ITEMS_CONTROL__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Headered Items Control</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int HEADERED_ITEMS_CONTROL_FEATURE_COUNT = ITEMS_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.TreeViewItemImpl <em>Tree View Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.TreeViewItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTreeViewItem()
	 * @generated
	 */
	int TREE_VIEW_ITEM = 34;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__VSIBILITY = HEADERED_ITEMS_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__NAME = HEADERED_ITEMS_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__MARGIN = HEADERED_ITEMS_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__PADDING = HEADERED_ITEMS_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__BORDER = HEADERED_ITEMS_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__WIDTH = HEADERED_ITEMS_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__HEIGHT = HEADERED_ITEMS_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__MAX_HEIGHT = HEADERED_ITEMS_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__MIN_HEIGHT = HEADERED_ITEMS_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__MIN_WIDTH = HEADERED_ITEMS_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__MAX_WIDTH = HEADERED_ITEMS_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__RESOURCES = HEADERED_ITEMS_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__TRIGGERS = HEADERED_ITEMS_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__STYLE = HEADERED_ITEMS_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__TOOLTIP = HEADERED_ITEMS_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__ACTUAL_HEIGHT = HEADERED_ITEMS_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__ACTUAL_WIDTH = HEADERED_ITEMS_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__DATA_CONTEXT = HEADERED_ITEMS_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__BACKGROUND = HEADERED_ITEMS_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__FONT = HEADERED_ITEMS_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__TAB_INDEX = HEADERED_ITEMS_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__FOREGROUND = HEADERED_ITEMS_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__ITEMS = HEADERED_ITEMS_CONTROL__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__ITEMS_SOURCE = HEADERED_ITEMS_CONTROL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM__ITEM_TEMPLATE = HEADERED_ITEMS_CONTROL__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Tree View Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int TREE_VIEW_ITEM_FEATURE_COUNT = HEADERED_ITEMS_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.MenuItemImpl <em>Menu Item</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.MenuItemImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMenuItem()
	 * @generated
	 */
	int MENU_ITEM = 35;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__VSIBILITY = HEADERED_ITEMS_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__NAME = HEADERED_ITEMS_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__MARGIN = HEADERED_ITEMS_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__PADDING = HEADERED_ITEMS_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__BORDER = HEADERED_ITEMS_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__WIDTH = HEADERED_ITEMS_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__HEIGHT = HEADERED_ITEMS_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__MAX_HEIGHT = HEADERED_ITEMS_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__MIN_HEIGHT = HEADERED_ITEMS_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__MIN_WIDTH = HEADERED_ITEMS_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__MAX_WIDTH = HEADERED_ITEMS_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__RESOURCES = HEADERED_ITEMS_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__TRIGGERS = HEADERED_ITEMS_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__STYLE = HEADERED_ITEMS_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__TOOLTIP = HEADERED_ITEMS_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__ACTUAL_HEIGHT = HEADERED_ITEMS_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__ACTUAL_WIDTH = HEADERED_ITEMS_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__DATA_CONTEXT = HEADERED_ITEMS_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__BACKGROUND = HEADERED_ITEMS_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__FONT = HEADERED_ITEMS_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__TAB_INDEX = HEADERED_ITEMS_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__FOREGROUND = HEADERED_ITEMS_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__ITEMS = HEADERED_ITEMS_CONTROL__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__ITEMS_SOURCE = HEADERED_ITEMS_CONTROL__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM__ITEM_TEMPLATE = HEADERED_ITEMS_CONTROL__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Menu Item</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_ITEM_FEATURE_COUNT = HEADERED_ITEMS_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.MenuImpl <em>Menu</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.MenuImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMenu()
	 * @generated
	 */
	int MENU = 36;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__VSIBILITY = PrimitivesPackage.MENU_BASE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__NAME = PrimitivesPackage.MENU_BASE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__MARGIN = PrimitivesPackage.MENU_BASE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__PADDING = PrimitivesPackage.MENU_BASE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__BORDER = PrimitivesPackage.MENU_BASE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__WIDTH = PrimitivesPackage.MENU_BASE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__HEIGHT = PrimitivesPackage.MENU_BASE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__MAX_HEIGHT = PrimitivesPackage.MENU_BASE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__MIN_HEIGHT = PrimitivesPackage.MENU_BASE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__MIN_WIDTH = PrimitivesPackage.MENU_BASE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__MAX_WIDTH = PrimitivesPackage.MENU_BASE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__RESOURCES = PrimitivesPackage.MENU_BASE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__TRIGGERS = PrimitivesPackage.MENU_BASE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__STYLE = PrimitivesPackage.MENU_BASE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__TOOLTIP = PrimitivesPackage.MENU_BASE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__ACTUAL_HEIGHT = PrimitivesPackage.MENU_BASE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__ACTUAL_WIDTH = PrimitivesPackage.MENU_BASE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__DATA_CONTEXT = PrimitivesPackage.MENU_BASE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__BACKGROUND = PrimitivesPackage.MENU_BASE__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__FONT = PrimitivesPackage.MENU_BASE__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__TAB_INDEX = PrimitivesPackage.MENU_BASE__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__FOREGROUND = PrimitivesPackage.MENU_BASE__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__ITEMS = PrimitivesPackage.MENU_BASE__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__ITEMS_SOURCE = PrimitivesPackage.MENU_BASE__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU__ITEM_TEMPLATE = PrimitivesPackage.MENU_BASE__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Menu</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int MENU_FEATURE_COUNT = PrimitivesPackage.MENU_BASE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ContextMenuImpl <em>Context Menu</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ContextMenuImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getContextMenu()
	 * @generated
	 */
	int CONTEXT_MENU = 37;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__VSIBILITY = PrimitivesPackage.MENU_BASE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__NAME = PrimitivesPackage.MENU_BASE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__MARGIN = PrimitivesPackage.MENU_BASE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__PADDING = PrimitivesPackage.MENU_BASE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__BORDER = PrimitivesPackage.MENU_BASE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__WIDTH = PrimitivesPackage.MENU_BASE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__HEIGHT = PrimitivesPackage.MENU_BASE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__MAX_HEIGHT = PrimitivesPackage.MENU_BASE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__MIN_HEIGHT = PrimitivesPackage.MENU_BASE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__MIN_WIDTH = PrimitivesPackage.MENU_BASE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__MAX_WIDTH = PrimitivesPackage.MENU_BASE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__RESOURCES = PrimitivesPackage.MENU_BASE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__TRIGGERS = PrimitivesPackage.MENU_BASE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__STYLE = PrimitivesPackage.MENU_BASE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__TOOLTIP = PrimitivesPackage.MENU_BASE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__ACTUAL_HEIGHT = PrimitivesPackage.MENU_BASE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__ACTUAL_WIDTH = PrimitivesPackage.MENU_BASE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__DATA_CONTEXT = PrimitivesPackage.MENU_BASE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__BACKGROUND = PrimitivesPackage.MENU_BASE__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__FONT = PrimitivesPackage.MENU_BASE__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__TAB_INDEX = PrimitivesPackage.MENU_BASE__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__FOREGROUND = PrimitivesPackage.MENU_BASE__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__ITEMS = PrimitivesPackage.MENU_BASE__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__ITEMS_SOURCE = PrimitivesPackage.MENU_BASE__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU__ITEM_TEMPLATE = PrimitivesPackage.MENU_BASE__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Context Menu</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CONTEXT_MENU_FEATURE_COUNT = PrimitivesPackage.MENU_BASE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DataGridImpl <em>Data Grid</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DataGridImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGrid()
	 * @generated
	 */
	int DATA_GRID = 38;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__VSIBILITY = PrimitivesPackage.MULTI_SELECTOR__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__NAME = PrimitivesPackage.MULTI_SELECTOR__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__MARGIN = PrimitivesPackage.MULTI_SELECTOR__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__PADDING = PrimitivesPackage.MULTI_SELECTOR__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__BORDER = PrimitivesPackage.MULTI_SELECTOR__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__WIDTH = PrimitivesPackage.MULTI_SELECTOR__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__HEIGHT = PrimitivesPackage.MULTI_SELECTOR__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__MAX_HEIGHT = PrimitivesPackage.MULTI_SELECTOR__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__MIN_HEIGHT = PrimitivesPackage.MULTI_SELECTOR__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__MIN_WIDTH = PrimitivesPackage.MULTI_SELECTOR__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__MAX_WIDTH = PrimitivesPackage.MULTI_SELECTOR__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__RESOURCES = PrimitivesPackage.MULTI_SELECTOR__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__TRIGGERS = PrimitivesPackage.MULTI_SELECTOR__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__STYLE = PrimitivesPackage.MULTI_SELECTOR__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__TOOLTIP = PrimitivesPackage.MULTI_SELECTOR__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__ACTUAL_HEIGHT = PrimitivesPackage.MULTI_SELECTOR__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__ACTUAL_WIDTH = PrimitivesPackage.MULTI_SELECTOR__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__DATA_CONTEXT = PrimitivesPackage.MULTI_SELECTOR__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__BACKGROUND = PrimitivesPackage.MULTI_SELECTOR__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__FONT = PrimitivesPackage.MULTI_SELECTOR__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__TAB_INDEX = PrimitivesPackage.MULTI_SELECTOR__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__FOREGROUND = PrimitivesPackage.MULTI_SELECTOR__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Items</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__ITEMS = PrimitivesPackage.MULTI_SELECTOR__ITEMS;

	/**
	 * The feature id for the '<em><b>Items Source</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__ITEMS_SOURCE = PrimitivesPackage.MULTI_SELECTOR__ITEMS_SOURCE;

	/**
	 * The feature id for the '<em><b>Item Template</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID__ITEM_TEMPLATE = PrimitivesPackage.MULTI_SELECTOR__ITEM_TEMPLATE;

	/**
	 * The number of structural features of the '<em>Data Grid</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_FEATURE_COUNT = PrimitivesPackage.MULTI_SELECTOR_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DataGridColumnImpl <em>Data Grid Column</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DataGridColumnImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridColumn()
	 * @generated
	 */
	int DATA_GRID_COLUMN = 39;

	/**
	 * The number of structural features of the '<em>Data Grid Column</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_COLUMN_FEATURE_COUNT = WidgetPackage.DEPENDENCY_OBJECT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DataGridRowImpl <em>Data Grid Row</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DataGridRowImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridRow()
	 * @generated
	 */
	int DATA_GRID_ROW = 40;

	/**
	 * The number of structural features of the '<em>Data Grid Row</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_ROW_FEATURE_COUNT = WidgetPackage.DEPENDENCY_OBJECT_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.DataGridCellImpl <em>Data Grid Cell</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.DataGridCellImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridCell()
	 * @generated
	 */
	int DATA_GRID_CELL = 41;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__VSIBILITY = CONTENT_CONTROL__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__NAME = CONTENT_CONTROL__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__MARGIN = CONTENT_CONTROL__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__PADDING = CONTENT_CONTROL__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__BORDER = CONTENT_CONTROL__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__WIDTH = CONTENT_CONTROL__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__HEIGHT = CONTENT_CONTROL__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__MAX_HEIGHT = CONTENT_CONTROL__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__MIN_HEIGHT = CONTENT_CONTROL__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__MIN_WIDTH = CONTENT_CONTROL__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__MAX_WIDTH = CONTENT_CONTROL__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__RESOURCES = CONTENT_CONTROL__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__TRIGGERS = CONTENT_CONTROL__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__STYLE = CONTENT_CONTROL__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__TOOLTIP = CONTENT_CONTROL__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__ACTUAL_HEIGHT = CONTENT_CONTROL__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__ACTUAL_WIDTH = CONTENT_CONTROL__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__DATA_CONTEXT = CONTENT_CONTROL__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__BACKGROUND = CONTENT_CONTROL__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__FONT = CONTENT_CONTROL__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__TAB_INDEX = CONTENT_CONTROL__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__FOREGROUND = CONTENT_CONTROL__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL__CONTENT = CONTENT_CONTROL__CONTENT;

	/**
	 * The number of structural features of the '<em>Data Grid Cell</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int DATA_GRID_CELL_FEATURE_COUNT = CONTENT_CONTROL_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ButtonImpl <em>Button</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ButtonImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getButton()
	 * @generated
	 */
	int BUTTON = 42;

	/**
	 * The number of structural features of the '<em>Button</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int BUTTON_FEATURE_COUNT = 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.CheckBoxImpl <em>Check Box</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.CheckBoxImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getCheckBox()
	 * @generated
	 */
	int CHECK_BOX = 43;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__VSIBILITY = PrimitivesPackage.TOGGLE_BUTTON__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__NAME = PrimitivesPackage.TOGGLE_BUTTON__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__MARGIN = PrimitivesPackage.TOGGLE_BUTTON__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__PADDING = PrimitivesPackage.TOGGLE_BUTTON__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__BORDER = PrimitivesPackage.TOGGLE_BUTTON__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__WIDTH = PrimitivesPackage.TOGGLE_BUTTON__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__MAX_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__MIN_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__MIN_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__MAX_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__RESOURCES = PrimitivesPackage.TOGGLE_BUTTON__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__TRIGGERS = PrimitivesPackage.TOGGLE_BUTTON__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__STYLE = PrimitivesPackage.TOGGLE_BUTTON__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__TOOLTIP = PrimitivesPackage.TOGGLE_BUTTON__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__ACTUAL_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__ACTUAL_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__DATA_CONTEXT = PrimitivesPackage.TOGGLE_BUTTON__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__BACKGROUND = PrimitivesPackage.TOGGLE_BUTTON__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__FONT = PrimitivesPackage.TOGGLE_BUTTON__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__TAB_INDEX = PrimitivesPackage.TOGGLE_BUTTON__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__FOREGROUND = PrimitivesPackage.TOGGLE_BUTTON__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX__CONTENT = PrimitivesPackage.TOGGLE_BUTTON__CONTENT;

	/**
	 * The number of structural features of the '<em>Check Box</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int CHECK_BOX_FEATURE_COUNT = PrimitivesPackage.TOGGLE_BUTTON_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.RadioButtonImpl <em>Radio Button</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.RadioButtonImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRadioButton()
	 * @generated
	 */
	int RADIO_BUTTON = 44;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__VSIBILITY = PrimitivesPackage.TOGGLE_BUTTON__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__NAME = PrimitivesPackage.TOGGLE_BUTTON__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__MARGIN = PrimitivesPackage.TOGGLE_BUTTON__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__PADDING = PrimitivesPackage.TOGGLE_BUTTON__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__BORDER = PrimitivesPackage.TOGGLE_BUTTON__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__WIDTH = PrimitivesPackage.TOGGLE_BUTTON__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__MAX_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__MIN_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__MIN_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__MAX_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__RESOURCES = PrimitivesPackage.TOGGLE_BUTTON__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__TRIGGERS = PrimitivesPackage.TOGGLE_BUTTON__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__STYLE = PrimitivesPackage.TOGGLE_BUTTON__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__TOOLTIP = PrimitivesPackage.TOGGLE_BUTTON__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__ACTUAL_HEIGHT = PrimitivesPackage.TOGGLE_BUTTON__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__ACTUAL_WIDTH = PrimitivesPackage.TOGGLE_BUTTON__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__DATA_CONTEXT = PrimitivesPackage.TOGGLE_BUTTON__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__BACKGROUND = PrimitivesPackage.TOGGLE_BUTTON__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__FONT = PrimitivesPackage.TOGGLE_BUTTON__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__TAB_INDEX = PrimitivesPackage.TOGGLE_BUTTON__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__FOREGROUND = PrimitivesPackage.TOGGLE_BUTTON__FOREGROUND;

	/**
	 * The feature id for the '<em><b>Content</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON__CONTENT = PrimitivesPackage.TOGGLE_BUTTON__CONTENT;

	/**
	 * The number of structural features of the '<em>Radio Button</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int RADIO_BUTTON_FEATURE_COUNT = PrimitivesPackage.TOGGLE_BUTTON_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.ProgressBarImpl <em>Progress Bar</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.ProgressBarImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getProgressBar()
	 * @generated
	 */
	int PROGRESS_BAR = 45;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__VSIBILITY = PrimitivesPackage.RANGE_BASE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__NAME = PrimitivesPackage.RANGE_BASE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__MARGIN = PrimitivesPackage.RANGE_BASE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__PADDING = PrimitivesPackage.RANGE_BASE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__BORDER = PrimitivesPackage.RANGE_BASE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__WIDTH = PrimitivesPackage.RANGE_BASE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__HEIGHT = PrimitivesPackage.RANGE_BASE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__MAX_HEIGHT = PrimitivesPackage.RANGE_BASE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__MIN_HEIGHT = PrimitivesPackage.RANGE_BASE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__MIN_WIDTH = PrimitivesPackage.RANGE_BASE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__MAX_WIDTH = PrimitivesPackage.RANGE_BASE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__RESOURCES = PrimitivesPackage.RANGE_BASE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__TRIGGERS = PrimitivesPackage.RANGE_BASE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__STYLE = PrimitivesPackage.RANGE_BASE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__TOOLTIP = PrimitivesPackage.RANGE_BASE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__ACTUAL_HEIGHT = PrimitivesPackage.RANGE_BASE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__ACTUAL_WIDTH = PrimitivesPackage.RANGE_BASE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__DATA_CONTEXT = PrimitivesPackage.RANGE_BASE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__BACKGROUND = PrimitivesPackage.RANGE_BASE__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__FONT = PrimitivesPackage.RANGE_BASE__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__TAB_INDEX = PrimitivesPackage.RANGE_BASE__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR__FOREGROUND = PrimitivesPackage.RANGE_BASE__FOREGROUND;

	/**
	 * The number of structural features of the '<em>Progress Bar</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int PROGRESS_BAR_FEATURE_COUNT = PrimitivesPackage.RANGE_BASE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.impl.SliderImpl <em>Slider</em>}' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.impl.SliderImpl
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getSlider()
	 * @generated
	 */
	int SLIDER = 46;

	/**
	 * The feature id for the '<em><b>Vsibility</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__VSIBILITY = PrimitivesPackage.RANGE_BASE__VSIBILITY;

	/**
	 * The feature id for the '<em><b>Name</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__NAME = PrimitivesPackage.RANGE_BASE__NAME;

	/**
	 * The feature id for the '<em><b>Margin</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__MARGIN = PrimitivesPackage.RANGE_BASE__MARGIN;

	/**
	 * The feature id for the '<em><b>Padding</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__PADDING = PrimitivesPackage.RANGE_BASE__PADDING;

	/**
	 * The feature id for the '<em><b>Border</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__BORDER = PrimitivesPackage.RANGE_BASE__BORDER;

	/**
	 * The feature id for the '<em><b>Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__WIDTH = PrimitivesPackage.RANGE_BASE__WIDTH;

	/**
	 * The feature id for the '<em><b>Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__HEIGHT = PrimitivesPackage.RANGE_BASE__HEIGHT;

	/**
	 * The feature id for the '<em><b>Max Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__MAX_HEIGHT = PrimitivesPackage.RANGE_BASE__MAX_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__MIN_HEIGHT = PrimitivesPackage.RANGE_BASE__MIN_HEIGHT;

	/**
	 * The feature id for the '<em><b>Min Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__MIN_WIDTH = PrimitivesPackage.RANGE_BASE__MIN_WIDTH;

	/**
	 * The feature id for the '<em><b>Max Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__MAX_WIDTH = PrimitivesPackage.RANGE_BASE__MAX_WIDTH;

	/**
	 * The feature id for the '<em><b>Resources</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__RESOURCES = PrimitivesPackage.RANGE_BASE__RESOURCES;

	/**
	 * The feature id for the '<em><b>Triggers</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__TRIGGERS = PrimitivesPackage.RANGE_BASE__TRIGGERS;

	/**
	 * The feature id for the '<em><b>Style</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__STYLE = PrimitivesPackage.RANGE_BASE__STYLE;

	/**
	 * The feature id for the '<em><b>Tooltip</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__TOOLTIP = PrimitivesPackage.RANGE_BASE__TOOLTIP;

	/**
	 * The feature id for the '<em><b>Actual Height</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__ACTUAL_HEIGHT = PrimitivesPackage.RANGE_BASE__ACTUAL_HEIGHT;

	/**
	 * The feature id for the '<em><b>Actual Width</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__ACTUAL_WIDTH = PrimitivesPackage.RANGE_BASE__ACTUAL_WIDTH;

	/**
	 * The feature id for the '<em><b>Data Context</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__DATA_CONTEXT = PrimitivesPackage.RANGE_BASE__DATA_CONTEXT;

	/**
	 * The feature id for the '<em><b>Background</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__BACKGROUND = PrimitivesPackage.RANGE_BASE__BACKGROUND;

	/**
	 * The feature id for the '<em><b>Font</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__FONT = PrimitivesPackage.RANGE_BASE__FONT;

	/**
	 * The feature id for the '<em><b>Tab Index</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__TAB_INDEX = PrimitivesPackage.RANGE_BASE__TAB_INDEX;

	/**
	 * The feature id for the '<em><b>Foreground</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER__FOREGROUND = PrimitivesPackage.RANGE_BASE__FOREGROUND;

	/**
	 * The number of structural features of the '<em>Slider</em>' class.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 * @ordered
	 */
	int SLIDER_FEATURE_COUNT = PrimitivesPackage.RANGE_BASE_FEATURE_COUNT + 0;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.ExpandDirection <em>Expand Direction</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.ExpandDirection
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getExpandDirection()
	 * @generated
	 */
	int EXPAND_DIRECTION = 47;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.Orientation <em>Orientation</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.Orientation
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getOrientation()
	 * @generated
	 */
	int ORIENTATION = 48;

	/**
	 * The meta object id for the '{@link org.summer.view.widget.controls.Dock <em>Dock</em>}' enum.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see org.summer.view.widget.controls.Dock
	 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDock()
	 * @generated
	 */
	int DOCK = 49;


	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Control <em>Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Control</em>'.
	 * @see org.summer.view.widget.controls.Control
	 * @generated
	 */
	EClass getControl();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.controls.Control#getBackground <em>Background</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Background</em>'.
	 * @see org.summer.view.widget.controls.Control#getBackground()
	 * @see #getControl()
	 * @generated
	 */
	EReference getControl_Background();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.controls.Control#getFont <em>Font</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Font</em>'.
	 * @see org.summer.view.widget.controls.Control#getFont()
	 * @see #getControl()
	 * @generated
	 */
	EReference getControl_Font();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Control#getTabIndex <em>Tab Index</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Tab Index</em>'.
	 * @see org.summer.view.widget.controls.Control#getTabIndex()
	 * @see #getControl()
	 * @generated
	 */
	EAttribute getControl_TabIndex();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.controls.Control#getForeground <em>Foreground</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Foreground</em>'.
	 * @see org.summer.view.widget.controls.Control#getForeground()
	 * @see #getControl()
	 * @generated
	 */
	EReference getControl_Foreground();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.MediaElement <em>Media Element</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Media Element</em>'.
	 * @see org.summer.view.widget.controls.MediaElement
	 * @generated
	 */
	EClass getMediaElement();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.RichTextBox <em>Rich Text Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Rich Text Box</em>'.
	 * @see org.summer.view.widget.controls.RichTextBox
	 * @generated
	 */
	EClass getRichTextBox();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ContentControl <em>Content Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Content Control</em>'.
	 * @see org.summer.view.widget.controls.ContentControl
	 * @generated
	 */
	EClass getContentControl();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.controls.ContentControl#getContent <em>Content</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Content</em>'.
	 * @see org.summer.view.widget.controls.ContentControl#getContent()
	 * @see #getContentControl()
	 * @generated
	 */
	EReference getContentControl_Content();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.PasswordBox <em>Password Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Password Box</em>'.
	 * @see org.summer.view.widget.controls.PasswordBox
	 * @generated
	 */
	EClass getPasswordBox();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.PasswordBox#getMaxLength <em>Max Length</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Max Length</em>'.
	 * @see org.summer.view.widget.controls.PasswordBox#getMaxLength()
	 * @see #getPasswordBox()
	 * @generated
	 */
	EAttribute getPasswordBox_MaxLength();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.PasswordBox#getPassword <em>Password</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Password</em>'.
	 * @see org.summer.view.widget.controls.PasswordBox#getPassword()
	 * @see #getPasswordBox()
	 * @generated
	 */
	EAttribute getPasswordBox_Password();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.PasswordBox#getPasswordChar <em>Password Char</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Password Char</em>'.
	 * @see org.summer.view.widget.controls.PasswordBox#getPasswordChar()
	 * @see #getPasswordBox()
	 * @generated
	 */
	EAttribute getPasswordBox_PasswordChar();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ItemsControl <em>Items Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Items Control</em>'.
	 * @see org.summer.view.widget.controls.ItemsControl
	 * @generated
	 */
	EClass getItemsControl();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.ItemsControl#getItems <em>Items</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Items</em>'.
	 * @see org.summer.view.widget.controls.ItemsControl#getItems()
	 * @see #getItemsControl()
	 * @generated
	 */
	EReference getItemsControl_Items();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.ItemsControl#getItemsSource <em>Items Source</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Items Source</em>'.
	 * @see org.summer.view.widget.controls.ItemsControl#getItemsSource()
	 * @see #getItemsControl()
	 * @generated
	 */
	EReference getItemsControl_ItemsSource();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.ItemsControl#getItemTemplate <em>Item Template</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Item Template</em>'.
	 * @see org.summer.view.widget.controls.ItemsControl#getItemTemplate()
	 * @see #getItemsControl()
	 * @generated
	 */
	EReference getItemsControl_ItemTemplate();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Separator <em>Separator</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Separator</em>'.
	 * @see org.summer.view.widget.controls.Separator
	 * @generated
	 */
	EClass getSeparator();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Frame <em>Frame</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Frame</em>'.
	 * @see org.summer.view.widget.controls.Frame
	 * @generated
	 */
	EClass getFrame();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Frame#getSource <em>Source</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Source</em>'.
	 * @see org.summer.view.widget.controls.Frame#getSource()
	 * @see #getFrame()
	 * @generated
	 */
	EAttribute getFrame_Source();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Frame#getBaseUri <em>Base Uri</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Base Uri</em>'.
	 * @see org.summer.view.widget.controls.Frame#getBaseUri()
	 * @see #getFrame()
	 * @generated
	 */
	EAttribute getFrame_BaseUri();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Label <em>Label</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Label</em>'.
	 * @see org.summer.view.widget.controls.Label
	 * @generated
	 */
	EClass getLabel();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Label#getText <em>Text</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Text</em>'.
	 * @see org.summer.view.widget.controls.Label#getText()
	 * @see #getLabel()
	 * @generated
	 */
	EAttribute getLabel_Text();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.Label#getTarget <em>Target</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Target</em>'.
	 * @see org.summer.view.widget.controls.Label#getTarget()
	 * @see #getLabel()
	 * @generated
	 */
	EReference getLabel_Target();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Image <em>Image</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Image</em>'.
	 * @see org.summer.view.widget.controls.Image
	 * @generated
	 */
	EClass getImage();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Image#getSource <em>Source</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Source</em>'.
	 * @see org.summer.view.widget.controls.Image#getSource()
	 * @see #getImage()
	 * @generated
	 */
	EAttribute getImage_Source();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.TextBlock <em>Text Block</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Text Block</em>'.
	 * @see org.summer.view.widget.controls.TextBlock
	 * @generated
	 */
	EClass getTextBlock();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Panel <em>Panel</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Panel</em>'.
	 * @see org.summer.view.widget.controls.Panel
	 * @generated
	 */
	EClass getPanel();

	/**
	 * Returns the meta object for the containment reference list '{@link org.summer.view.widget.controls.Panel#getChildren <em>Children</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference list '<em>Children</em>'.
	 * @see org.summer.view.widget.controls.Panel#getChildren()
	 * @see #getPanel()
	 * @generated
	 */
	EReference getPanel_Children();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.Panel#getItemsSource <em>Items Source</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Items Source</em>'.
	 * @see org.summer.view.widget.controls.Panel#getItemsSource()
	 * @see #getPanel()
	 * @generated
	 */
	EReference getPanel_ItemsSource();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ComboBox <em>Combo Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Combo Box</em>'.
	 * @see org.summer.view.widget.controls.ComboBox
	 * @generated
	 */
	EClass getComboBox();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.ComboBox#getSelectedItem <em>Selected Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Selected Item</em>'.
	 * @see org.summer.view.widget.controls.ComboBox#getSelectedItem()
	 * @see #getComboBox()
	 * @generated
	 */
	EReference getComboBox_SelectedItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ComboBoxItem <em>Combo Box Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Combo Box Item</em>'.
	 * @see org.summer.view.widget.controls.ComboBoxItem
	 * @generated
	 */
	EClass getComboBoxItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ListBox <em>List Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>List Box</em>'.
	 * @see org.summer.view.widget.controls.ListBox
	 * @generated
	 */
	EClass getListBox();

	/**
	 * Returns the meta object for the reference '{@link org.summer.view.widget.controls.ListBox#getSelectedItem <em>Selected Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference '<em>Selected Item</em>'.
	 * @see org.summer.view.widget.controls.ListBox#getSelectedItem()
	 * @see #getListBox()
	 * @generated
	 */
	EReference getListBox_SelectedItem();

	/**
	 * Returns the meta object for the reference list '{@link org.summer.view.widget.controls.ListBox#getSelectedItems <em>Selected Items</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the reference list '<em>Selected Items</em>'.
	 * @see org.summer.view.widget.controls.ListBox#getSelectedItems()
	 * @see #getListBox()
	 * @generated
	 */
	EReference getListBox_SelectedItems();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ListBoxItem <em>List Box Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>List Box Item</em>'.
	 * @see org.summer.view.widget.controls.ListBoxItem
	 * @generated
	 */
	EClass getListBoxItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ListView <em>List View</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>List View</em>'.
	 * @see org.summer.view.widget.controls.ListView
	 * @generated
	 */
	EClass getListView();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ListViewItem <em>List View Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>List View Item</em>'.
	 * @see org.summer.view.widget.controls.ListViewItem
	 * @generated
	 */
	EClass getListViewItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.HeaderedContentControl <em>Headered Content Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Headered Content Control</em>'.
	 * @see org.summer.view.widget.controls.HeaderedContentControl
	 * @generated
	 */
	EClass getHeaderedContentControl();

	/**
	 * Returns the meta object for the containment reference '{@link org.summer.view.widget.controls.HeaderedContentControl#getHeader <em>Header</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the containment reference '<em>Header</em>'.
	 * @see org.summer.view.widget.controls.HeaderedContentControl#getHeader()
	 * @see #getHeaderedContentControl()
	 * @generated
	 */
	EReference getHeaderedContentControl_Header();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Expander <em>Expander</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Expander</em>'.
	 * @see org.summer.view.widget.controls.Expander
	 * @generated
	 */
	EClass getExpander();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Expander#getExpandDirection <em>Expand Direction</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Expand Direction</em>'.
	 * @see org.summer.view.widget.controls.Expander#getExpandDirection()
	 * @see #getExpander()
	 * @generated
	 */
	EAttribute getExpander_ExpandDirection();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Expander#isExpanded <em>Expanded</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Expanded</em>'.
	 * @see org.summer.view.widget.controls.Expander#isExpanded()
	 * @see #getExpander()
	 * @generated
	 */
	EAttribute getExpander_Expanded();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.GroupBox <em>Group Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Group Box</em>'.
	 * @see org.summer.view.widget.controls.GroupBox
	 * @generated
	 */
	EClass getGroupBox();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.GroupItem <em>Group Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Group Item</em>'.
	 * @see org.summer.view.widget.controls.GroupItem
	 * @generated
	 */
	EClass getGroupItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.TabItem <em>Tab Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Tab Item</em>'.
	 * @see org.summer.view.widget.controls.TabItem
	 * @generated
	 */
	EClass getTabItem();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.TabItem#isSelected <em>Selected</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Selected</em>'.
	 * @see org.summer.view.widget.controls.TabItem#isSelected()
	 * @see #getTabItem()
	 * @generated
	 */
	EAttribute getTabItem_Selected();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.TabItem#getTabStripPlacement <em>Tab Strip Placement</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Tab Strip Placement</em>'.
	 * @see org.summer.view.widget.controls.TabItem#getTabStripPlacement()
	 * @see #getTabItem()
	 * @generated
	 */
	EAttribute getTabItem_TabStripPlacement();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.TabControl <em>Tab Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Tab Control</em>'.
	 * @see org.summer.view.widget.controls.TabControl
	 * @generated
	 */
	EClass getTabControl();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.StackPanel <em>Stack Panel</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Stack Panel</em>'.
	 * @see org.summer.view.widget.controls.StackPanel
	 * @generated
	 */
	EClass getStackPanel();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.StackPanel#getOrientation <em>Orientation</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Orientation</em>'.
	 * @see org.summer.view.widget.controls.StackPanel#getOrientation()
	 * @see #getStackPanel()
	 * @generated
	 */
	EAttribute getStackPanel_Orientation();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.StackPanel#isCanHorizontallyScroll <em>Can Horizontally Scroll</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Can Horizontally Scroll</em>'.
	 * @see org.summer.view.widget.controls.StackPanel#isCanHorizontallyScroll()
	 * @see #getStackPanel()
	 * @generated
	 */
	EAttribute getStackPanel_CanHorizontallyScroll();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.StackPanel#isCanVerticallyScroll <em>Can Vertically Scroll</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Can Vertically Scroll</em>'.
	 * @see org.summer.view.widget.controls.StackPanel#isCanVerticallyScroll()
	 * @see #getStackPanel()
	 * @generated
	 */
	EAttribute getStackPanel_CanVerticallyScroll();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Grid <em>Grid</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Grid</em>'.
	 * @see org.summer.view.widget.controls.Grid
	 * @generated
	 */
	EClass getGrid();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Grid#getColumn <em>Column</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Column</em>'.
	 * @see org.summer.view.widget.controls.Grid#getColumn()
	 * @see #getGrid()
	 * @generated
	 */
	EAttribute getGrid_Column();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Grid#getColumnSpan <em>Column Span</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Column Span</em>'.
	 * @see org.summer.view.widget.controls.Grid#getColumnSpan()
	 * @see #getGrid()
	 * @generated
	 */
	EAttribute getGrid_ColumnSpan();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Grid#getRow <em>Row</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Row</em>'.
	 * @see org.summer.view.widget.controls.Grid#getRow()
	 * @see #getGrid()
	 * @generated
	 */
	EAttribute getGrid_Row();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Grid#getRowSpan <em>Row Span</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Row Span</em>'.
	 * @see org.summer.view.widget.controls.Grid#getRowSpan()
	 * @see #getGrid()
	 * @generated
	 */
	EAttribute getGrid_RowSpan();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DefinitionBase <em>Definition Base</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Definition Base</em>'.
	 * @see org.summer.view.widget.controls.DefinitionBase
	 * @generated
	 */
	EClass getDefinitionBase();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ColumnDefinition <em>Column Definition</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Column Definition</em>'.
	 * @see org.summer.view.widget.controls.ColumnDefinition
	 * @generated
	 */
	EClass getColumnDefinition();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.RowDefinition <em>Row Definition</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Row Definition</em>'.
	 * @see org.summer.view.widget.controls.RowDefinition
	 * @generated
	 */
	EClass getRowDefinition();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DockPanel <em>Dock Panel</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Dock Panel</em>'.
	 * @see org.summer.view.widget.controls.DockPanel
	 * @generated
	 */
	EClass getDockPanel();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.DockPanel#getDock <em>Dock</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Dock</em>'.
	 * @see org.summer.view.widget.controls.DockPanel#getDock()
	 * @see #getDockPanel()
	 * @generated
	 */
	EAttribute getDockPanel_Dock();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.WrapPanel <em>Wrap Panel</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Wrap Panel</em>'.
	 * @see org.summer.view.widget.controls.WrapPanel
	 * @generated
	 */
	EClass getWrapPanel();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Canvas <em>Canvas</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Canvas</em>'.
	 * @see org.summer.view.widget.controls.Canvas
	 * @generated
	 */
	EClass getCanvas();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Canvas#getLeft <em>Left</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Left</em>'.
	 * @see org.summer.view.widget.controls.Canvas#getLeft()
	 * @see #getCanvas()
	 * @generated
	 */
	EAttribute getCanvas_Left();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Canvas#getRight <em>Right</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Right</em>'.
	 * @see org.summer.view.widget.controls.Canvas#getRight()
	 * @see #getCanvas()
	 * @generated
	 */
	EAttribute getCanvas_Right();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Canvas#getTop <em>Top</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Top</em>'.
	 * @see org.summer.view.widget.controls.Canvas#getTop()
	 * @see #getCanvas()
	 * @generated
	 */
	EAttribute getCanvas_Top();

	/**
	 * Returns the meta object for the attribute '{@link org.summer.view.widget.controls.Canvas#getBottom <em>Bottom</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for the attribute '<em>Bottom</em>'.
	 * @see org.summer.view.widget.controls.Canvas#getBottom()
	 * @see #getCanvas()
	 * @generated
	 */
	EAttribute getCanvas_Bottom();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.TreeView <em>Tree View</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Tree View</em>'.
	 * @see org.summer.view.widget.controls.TreeView
	 * @generated
	 */
	EClass getTreeView();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.HeaderedItemsControl <em>Headered Items Control</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Headered Items Control</em>'.
	 * @see org.summer.view.widget.controls.HeaderedItemsControl
	 * @generated
	 */
	EClass getHeaderedItemsControl();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.TreeViewItem <em>Tree View Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Tree View Item</em>'.
	 * @see org.summer.view.widget.controls.TreeViewItem
	 * @generated
	 */
	EClass getTreeViewItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.MenuItem <em>Menu Item</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Menu Item</em>'.
	 * @see org.summer.view.widget.controls.MenuItem
	 * @generated
	 */
	EClass getMenuItem();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Menu <em>Menu</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Menu</em>'.
	 * @see org.summer.view.widget.controls.Menu
	 * @generated
	 */
	EClass getMenu();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ContextMenu <em>Context Menu</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Context Menu</em>'.
	 * @see org.summer.view.widget.controls.ContextMenu
	 * @generated
	 */
	EClass getContextMenu();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DataGrid <em>Data Grid</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Data Grid</em>'.
	 * @see org.summer.view.widget.controls.DataGrid
	 * @generated
	 */
	EClass getDataGrid();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DataGridColumn <em>Data Grid Column</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Data Grid Column</em>'.
	 * @see org.summer.view.widget.controls.DataGridColumn
	 * @generated
	 */
	EClass getDataGridColumn();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DataGridRow <em>Data Grid Row</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Data Grid Row</em>'.
	 * @see org.summer.view.widget.controls.DataGridRow
	 * @generated
	 */
	EClass getDataGridRow();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.DataGridCell <em>Data Grid Cell</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Data Grid Cell</em>'.
	 * @see org.summer.view.widget.controls.DataGridCell
	 * @generated
	 */
	EClass getDataGridCell();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Button <em>Button</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Button</em>'.
	 * @see org.summer.view.widget.controls.Button
	 * @generated
	 */
	EClass getButton();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.CheckBox <em>Check Box</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Check Box</em>'.
	 * @see org.summer.view.widget.controls.CheckBox
	 * @generated
	 */
	EClass getCheckBox();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.RadioButton <em>Radio Button</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Radio Button</em>'.
	 * @see org.summer.view.widget.controls.RadioButton
	 * @generated
	 */
	EClass getRadioButton();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.ProgressBar <em>Progress Bar</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Progress Bar</em>'.
	 * @see org.summer.view.widget.controls.ProgressBar
	 * @generated
	 */
	EClass getProgressBar();

	/**
	 * Returns the meta object for class '{@link org.summer.view.widget.controls.Slider <em>Slider</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for class '<em>Slider</em>'.
	 * @see org.summer.view.widget.controls.Slider
	 * @generated
	 */
	EClass getSlider();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.controls.ExpandDirection <em>Expand Direction</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Expand Direction</em>'.
	 * @see org.summer.view.widget.controls.ExpandDirection
	 * @generated
	 */
	EEnum getExpandDirection();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.controls.Orientation <em>Orientation</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Orientation</em>'.
	 * @see org.summer.view.widget.controls.Orientation
	 * @generated
	 */
	EEnum getOrientation();

	/**
	 * Returns the meta object for enum '{@link org.summer.view.widget.controls.Dock <em>Dock</em>}'.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the meta object for enum '<em>Dock</em>'.
	 * @see org.summer.view.widget.controls.Dock
	 * @generated
	 */
	EEnum getDock();

	/**
	 * Returns the factory that creates the instances of the model.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @return the factory that creates the instances of the model.
	 * @generated
	 */
	ControlsFactory getControlsFactory();

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
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ControlImpl <em>Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getControl()
		 * @generated
		 */
		EClass CONTROL = eINSTANCE.getControl();

		/**
		 * The meta object literal for the '<em><b>Background</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference CONTROL__BACKGROUND = eINSTANCE.getControl_Background();

		/**
		 * The meta object literal for the '<em><b>Font</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference CONTROL__FONT = eINSTANCE.getControl_Font();

		/**
		 * The meta object literal for the '<em><b>Tab Index</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute CONTROL__TAB_INDEX = eINSTANCE.getControl_TabIndex();

		/**
		 * The meta object literal for the '<em><b>Foreground</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference CONTROL__FOREGROUND = eINSTANCE.getControl_Foreground();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.MediaElementImpl <em>Media Element</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.MediaElementImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMediaElement()
		 * @generated
		 */
		EClass MEDIA_ELEMENT = eINSTANCE.getMediaElement();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.RichTextBoxImpl <em>Rich Text Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.RichTextBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRichTextBox()
		 * @generated
		 */
		EClass RICH_TEXT_BOX = eINSTANCE.getRichTextBox();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ContentControlImpl <em>Content Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ContentControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getContentControl()
		 * @generated
		 */
		EClass CONTENT_CONTROL = eINSTANCE.getContentControl();

		/**
		 * The meta object literal for the '<em><b>Content</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference CONTENT_CONTROL__CONTENT = eINSTANCE.getContentControl_Content();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.PasswordBoxImpl <em>Password Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.PasswordBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getPasswordBox()
		 * @generated
		 */
		EClass PASSWORD_BOX = eINSTANCE.getPasswordBox();

		/**
		 * The meta object literal for the '<em><b>Max Length</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute PASSWORD_BOX__MAX_LENGTH = eINSTANCE.getPasswordBox_MaxLength();

		/**
		 * The meta object literal for the '<em><b>Password</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute PASSWORD_BOX__PASSWORD = eINSTANCE.getPasswordBox_Password();

		/**
		 * The meta object literal for the '<em><b>Password Char</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute PASSWORD_BOX__PASSWORD_CHAR = eINSTANCE.getPasswordBox_PasswordChar();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ItemsControlImpl <em>Items Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ItemsControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getItemsControl()
		 * @generated
		 */
		EClass ITEMS_CONTROL = eINSTANCE.getItemsControl();

		/**
		 * The meta object literal for the '<em><b>Items</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference ITEMS_CONTROL__ITEMS = eINSTANCE.getItemsControl_Items();

		/**
		 * The meta object literal for the '<em><b>Items Source</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference ITEMS_CONTROL__ITEMS_SOURCE = eINSTANCE.getItemsControl_ItemsSource();

		/**
		 * The meta object literal for the '<em><b>Item Template</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference ITEMS_CONTROL__ITEM_TEMPLATE = eINSTANCE.getItemsControl_ItemTemplate();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.SeparatorImpl <em>Separator</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.SeparatorImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getSeparator()
		 * @generated
		 */
		EClass SEPARATOR = eINSTANCE.getSeparator();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.FrameImpl <em>Frame</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.FrameImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getFrame()
		 * @generated
		 */
		EClass FRAME = eINSTANCE.getFrame();

		/**
		 * The meta object literal for the '<em><b>Source</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FRAME__SOURCE = eINSTANCE.getFrame_Source();

		/**
		 * The meta object literal for the '<em><b>Base Uri</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute FRAME__BASE_URI = eINSTANCE.getFrame_BaseUri();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.LabelImpl <em>Label</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.LabelImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getLabel()
		 * @generated
		 */
		EClass LABEL = eINSTANCE.getLabel();

		/**
		 * The meta object literal for the '<em><b>Text</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute LABEL__TEXT = eINSTANCE.getLabel_Text();

		/**
		 * The meta object literal for the '<em><b>Target</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference LABEL__TARGET = eINSTANCE.getLabel_Target();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ImageImpl <em>Image</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ImageImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getImage()
		 * @generated
		 */
		EClass IMAGE = eINSTANCE.getImage();

		/**
		 * The meta object literal for the '<em><b>Source</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute IMAGE__SOURCE = eINSTANCE.getImage_Source();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.TextBlockImpl <em>Text Block</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.TextBlockImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTextBlock()
		 * @generated
		 */
		EClass TEXT_BLOCK = eINSTANCE.getTextBlock();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.PanelImpl <em>Panel</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.PanelImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getPanel()
		 * @generated
		 */
		EClass PANEL = eINSTANCE.getPanel();

		/**
		 * The meta object literal for the '<em><b>Children</b></em>' containment reference list feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PANEL__CHILDREN = eINSTANCE.getPanel_Children();

		/**
		 * The meta object literal for the '<em><b>Items Source</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference PANEL__ITEMS_SOURCE = eINSTANCE.getPanel_ItemsSource();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ComboBoxImpl <em>Combo Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ComboBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getComboBox()
		 * @generated
		 */
		EClass COMBO_BOX = eINSTANCE.getComboBox();

		/**
		 * The meta object literal for the '<em><b>Selected Item</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference COMBO_BOX__SELECTED_ITEM = eINSTANCE.getComboBox_SelectedItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ComboBoxItemImpl <em>Combo Box Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ComboBoxItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getComboBoxItem()
		 * @generated
		 */
		EClass COMBO_BOX_ITEM = eINSTANCE.getComboBoxItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ListBoxImpl <em>List Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ListBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListBox()
		 * @generated
		 */
		EClass LIST_BOX = eINSTANCE.getListBox();

		/**
		 * The meta object literal for the '<em><b>Selected Item</b></em>' reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference LIST_BOX__SELECTED_ITEM = eINSTANCE.getListBox_SelectedItem();

		/**
		 * The meta object literal for the '<em><b>Selected Items</b></em>' reference list feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference LIST_BOX__SELECTED_ITEMS = eINSTANCE.getListBox_SelectedItems();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ListBoxItemImpl <em>List Box Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ListBoxItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListBoxItem()
		 * @generated
		 */
		EClass LIST_BOX_ITEM = eINSTANCE.getListBoxItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ListViewImpl <em>List View</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ListViewImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListView()
		 * @generated
		 */
		EClass LIST_VIEW = eINSTANCE.getListView();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ListViewItemImpl <em>List View Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ListViewItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getListViewItem()
		 * @generated
		 */
		EClass LIST_VIEW_ITEM = eINSTANCE.getListViewItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.HeaderedContentControlImpl <em>Headered Content Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.HeaderedContentControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getHeaderedContentControl()
		 * @generated
		 */
		EClass HEADERED_CONTENT_CONTROL = eINSTANCE.getHeaderedContentControl();

		/**
		 * The meta object literal for the '<em><b>Header</b></em>' containment reference feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EReference HEADERED_CONTENT_CONTROL__HEADER = eINSTANCE.getHeaderedContentControl_Header();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ExpanderImpl <em>Expander</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ExpanderImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getExpander()
		 * @generated
		 */
		EClass EXPANDER = eINSTANCE.getExpander();

		/**
		 * The meta object literal for the '<em><b>Expand Direction</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute EXPANDER__EXPAND_DIRECTION = eINSTANCE.getExpander_ExpandDirection();

		/**
		 * The meta object literal for the '<em><b>Expanded</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute EXPANDER__EXPANDED = eINSTANCE.getExpander_Expanded();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.GroupBoxImpl <em>Group Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.GroupBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGroupBox()
		 * @generated
		 */
		EClass GROUP_BOX = eINSTANCE.getGroupBox();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.GroupItemImpl <em>Group Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.GroupItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGroupItem()
		 * @generated
		 */
		EClass GROUP_ITEM = eINSTANCE.getGroupItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.TabItemImpl <em>Tab Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.TabItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTabItem()
		 * @generated
		 */
		EClass TAB_ITEM = eINSTANCE.getTabItem();

		/**
		 * The meta object literal for the '<em><b>Selected</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TAB_ITEM__SELECTED = eINSTANCE.getTabItem_Selected();

		/**
		 * The meta object literal for the '<em><b>Tab Strip Placement</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute TAB_ITEM__TAB_STRIP_PLACEMENT = eINSTANCE.getTabItem_TabStripPlacement();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.TabControlImpl <em>Tab Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.TabControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTabControl()
		 * @generated
		 */
		EClass TAB_CONTROL = eINSTANCE.getTabControl();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.StackPanelImpl <em>Stack Panel</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.StackPanelImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getStackPanel()
		 * @generated
		 */
		EClass STACK_PANEL = eINSTANCE.getStackPanel();

		/**
		 * The meta object literal for the '<em><b>Orientation</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STACK_PANEL__ORIENTATION = eINSTANCE.getStackPanel_Orientation();

		/**
		 * The meta object literal for the '<em><b>Can Horizontally Scroll</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STACK_PANEL__CAN_HORIZONTALLY_SCROLL = eINSTANCE.getStackPanel_CanHorizontallyScroll();

		/**
		 * The meta object literal for the '<em><b>Can Vertically Scroll</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute STACK_PANEL__CAN_VERTICALLY_SCROLL = eINSTANCE.getStackPanel_CanVerticallyScroll();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.GridImpl <em>Grid</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.GridImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getGrid()
		 * @generated
		 */
		EClass GRID = eINSTANCE.getGrid();

		/**
		 * The meta object literal for the '<em><b>Column</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute GRID__COLUMN = eINSTANCE.getGrid_Column();

		/**
		 * The meta object literal for the '<em><b>Column Span</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute GRID__COLUMN_SPAN = eINSTANCE.getGrid_ColumnSpan();

		/**
		 * The meta object literal for the '<em><b>Row</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute GRID__ROW = eINSTANCE.getGrid_Row();

		/**
		 * The meta object literal for the '<em><b>Row Span</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute GRID__ROW_SPAN = eINSTANCE.getGrid_RowSpan();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DefinitionBaseImpl <em>Definition Base</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DefinitionBaseImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDefinitionBase()
		 * @generated
		 */
		EClass DEFINITION_BASE = eINSTANCE.getDefinitionBase();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ColumnDefinitionImpl <em>Column Definition</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ColumnDefinitionImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getColumnDefinition()
		 * @generated
		 */
		EClass COLUMN_DEFINITION = eINSTANCE.getColumnDefinition();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.RowDefinitionImpl <em>Row Definition</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.RowDefinitionImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRowDefinition()
		 * @generated
		 */
		EClass ROW_DEFINITION = eINSTANCE.getRowDefinition();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DockPanelImpl <em>Dock Panel</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DockPanelImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDockPanel()
		 * @generated
		 */
		EClass DOCK_PANEL = eINSTANCE.getDockPanel();

		/**
		 * The meta object literal for the '<em><b>Dock</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute DOCK_PANEL__DOCK = eINSTANCE.getDockPanel_Dock();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.WrapPanelImpl <em>Wrap Panel</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.WrapPanelImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getWrapPanel()
		 * @generated
		 */
		EClass WRAP_PANEL = eINSTANCE.getWrapPanel();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.CanvasImpl <em>Canvas</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.CanvasImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getCanvas()
		 * @generated
		 */
		EClass CANVAS = eINSTANCE.getCanvas();

		/**
		 * The meta object literal for the '<em><b>Left</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute CANVAS__LEFT = eINSTANCE.getCanvas_Left();

		/**
		 * The meta object literal for the '<em><b>Right</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute CANVAS__RIGHT = eINSTANCE.getCanvas_Right();

		/**
		 * The meta object literal for the '<em><b>Top</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute CANVAS__TOP = eINSTANCE.getCanvas_Top();

		/**
		 * The meta object literal for the '<em><b>Bottom</b></em>' attribute feature.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @generated
		 */
		EAttribute CANVAS__BOTTOM = eINSTANCE.getCanvas_Bottom();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.TreeViewImpl <em>Tree View</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.TreeViewImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTreeView()
		 * @generated
		 */
		EClass TREE_VIEW = eINSTANCE.getTreeView();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.HeaderedItemsControlImpl <em>Headered Items Control</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.HeaderedItemsControlImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getHeaderedItemsControl()
		 * @generated
		 */
		EClass HEADERED_ITEMS_CONTROL = eINSTANCE.getHeaderedItemsControl();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.TreeViewItemImpl <em>Tree View Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.TreeViewItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getTreeViewItem()
		 * @generated
		 */
		EClass TREE_VIEW_ITEM = eINSTANCE.getTreeViewItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.MenuItemImpl <em>Menu Item</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.MenuItemImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMenuItem()
		 * @generated
		 */
		EClass MENU_ITEM = eINSTANCE.getMenuItem();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.MenuImpl <em>Menu</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.MenuImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getMenu()
		 * @generated
		 */
		EClass MENU = eINSTANCE.getMenu();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ContextMenuImpl <em>Context Menu</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ContextMenuImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getContextMenu()
		 * @generated
		 */
		EClass CONTEXT_MENU = eINSTANCE.getContextMenu();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DataGridImpl <em>Data Grid</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DataGridImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGrid()
		 * @generated
		 */
		EClass DATA_GRID = eINSTANCE.getDataGrid();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DataGridColumnImpl <em>Data Grid Column</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DataGridColumnImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridColumn()
		 * @generated
		 */
		EClass DATA_GRID_COLUMN = eINSTANCE.getDataGridColumn();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DataGridRowImpl <em>Data Grid Row</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DataGridRowImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridRow()
		 * @generated
		 */
		EClass DATA_GRID_ROW = eINSTANCE.getDataGridRow();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.DataGridCellImpl <em>Data Grid Cell</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.DataGridCellImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDataGridCell()
		 * @generated
		 */
		EClass DATA_GRID_CELL = eINSTANCE.getDataGridCell();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ButtonImpl <em>Button</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ButtonImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getButton()
		 * @generated
		 */
		EClass BUTTON = eINSTANCE.getButton();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.CheckBoxImpl <em>Check Box</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.CheckBoxImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getCheckBox()
		 * @generated
		 */
		EClass CHECK_BOX = eINSTANCE.getCheckBox();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.RadioButtonImpl <em>Radio Button</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.RadioButtonImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getRadioButton()
		 * @generated
		 */
		EClass RADIO_BUTTON = eINSTANCE.getRadioButton();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.ProgressBarImpl <em>Progress Bar</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.ProgressBarImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getProgressBar()
		 * @generated
		 */
		EClass PROGRESS_BAR = eINSTANCE.getProgressBar();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.impl.SliderImpl <em>Slider</em>}' class.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.impl.SliderImpl
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getSlider()
		 * @generated
		 */
		EClass SLIDER = eINSTANCE.getSlider();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.ExpandDirection <em>Expand Direction</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.ExpandDirection
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getExpandDirection()
		 * @generated
		 */
		EEnum EXPAND_DIRECTION = eINSTANCE.getExpandDirection();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.Orientation <em>Orientation</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.Orientation
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getOrientation()
		 * @generated
		 */
		EEnum ORIENTATION = eINSTANCE.getOrientation();

		/**
		 * The meta object literal for the '{@link org.summer.view.widget.controls.Dock <em>Dock</em>}' enum.
		 * <!-- begin-user-doc -->
		 * <!-- end-user-doc -->
		 * @see org.summer.view.widget.controls.Dock
		 * @see org.summer.view.widget.controls.impl.ControlsPackageImpl#getDock()
		 * @generated
		 */
		EEnum DOCK = eINSTANCE.getDock();

	}

} //ControlsPackage
