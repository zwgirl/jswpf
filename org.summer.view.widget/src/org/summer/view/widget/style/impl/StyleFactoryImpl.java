/**
 */
package org.summer.view.widget.style.impl;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EDataType;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.impl.EFactoryImpl;
import org.eclipse.emf.ecore.plugin.EcorePlugin;
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
import org.summer.view.widget.style.RGB;
import org.summer.view.widget.style.RGBA;
import org.summer.view.widget.style.StyleFactory;
import org.summer.view.widget.style.StylePackage;
import org.summer.view.widget.style.Unit;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model <b>Factory</b>.
 * <!-- end-user-doc -->
 * @generated
 */
public class StyleFactoryImpl extends EFactoryImpl implements StyleFactory {
	/**
	 * Creates the default factory implementation.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static StyleFactory init() {
		try {
			StyleFactory theStyleFactory = (StyleFactory)EPackage.Registry.INSTANCE.getEFactory("style"); 
			if (theStyleFactory != null) {
				return theStyleFactory;
			}
		}
		catch (Exception exception) {
			EcorePlugin.INSTANCE.log(exception);
		}
		return new StyleFactoryImpl();
	}

	/**
	 * Creates an instance of the factory.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public StyleFactoryImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public EObject create(EClass eClass) {
		switch (eClass.getClassifierID()) {
			case StylePackage.MARGIN: return createMargin();
			case StylePackage.PADDING: return createPadding();
			case StylePackage.BORDER: return createBorder();
			case StylePackage.BORDER_CONTENT: return createBorderContent();
			case StylePackage.RGB: return createRGB();
			case StylePackage.RGBA: return createRGBA();
			case StylePackage.FONT: return createFont();
			case StylePackage.BACKGROUND: return createBackground();
			case StylePackage.BACKGROUND_POSITION: return createBackgroundPosition();
			case StylePackage.LENGTH: return createLength();
			default:
				throw new IllegalArgumentException("The class '" + eClass.getName() + "' is not a valid classifier");
		}
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object createFromString(EDataType eDataType, String initialValue) {
		switch (eDataType.getClassifierID()) {
			case StylePackage.BORDER_STYLE:
				return createBorderStyleFromString(eDataType, initialValue);
			case StylePackage.FONT_STYLE:
				return createFontStyleFromString(eDataType, initialValue);
			case StylePackage.FONT_VARIANT:
				return createFontVariantFromString(eDataType, initialValue);
			case StylePackage.FONT_WEIGHT:
				return createFontWeightFromString(eDataType, initialValue);
			case StylePackage.BACKGROUND_ATTACHMENT:
				return createBackgroundAttachmentFromString(eDataType, initialValue);
			case StylePackage.BACKGROUND_REPEAT:
				return createBackgroundRepeatFromString(eDataType, initialValue);
			case StylePackage.UNIT:
				return createUnitFromString(eDataType, initialValue);
			default:
				throw new IllegalArgumentException("The datatype '" + eDataType.getName() + "' is not a valid classifier");
		}
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String convertToString(EDataType eDataType, Object instanceValue) {
		switch (eDataType.getClassifierID()) {
			case StylePackage.BORDER_STYLE:
				return convertBorderStyleToString(eDataType, instanceValue);
			case StylePackage.FONT_STYLE:
				return convertFontStyleToString(eDataType, instanceValue);
			case StylePackage.FONT_VARIANT:
				return convertFontVariantToString(eDataType, instanceValue);
			case StylePackage.FONT_WEIGHT:
				return convertFontWeightToString(eDataType, instanceValue);
			case StylePackage.BACKGROUND_ATTACHMENT:
				return convertBackgroundAttachmentToString(eDataType, instanceValue);
			case StylePackage.BACKGROUND_REPEAT:
				return convertBackgroundRepeatToString(eDataType, instanceValue);
			case StylePackage.UNIT:
				return convertUnitToString(eDataType, instanceValue);
			default:
				throw new IllegalArgumentException("The datatype '" + eDataType.getName() + "' is not a valid classifier");
		}
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Margin createMargin() {
		MarginImpl margin = new MarginImpl();
		return margin;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Padding createPadding() {
		PaddingImpl padding = new PaddingImpl();
		return padding;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Border createBorder() {
		BorderImpl border = new BorderImpl();
		return border;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public BorderContent createBorderContent() {
		BorderContentImpl borderContent = new BorderContentImpl();
		return borderContent;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public RGB createRGB() {
		RGBImpl rgb = new RGBImpl();
		return rgb;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public RGBA createRGBA() {
		RGBAImpl rgba = new RGBAImpl();
		return rgba;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Font createFont() {
		FontImpl font = new FontImpl();
		return font;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Background createBackground() {
		BackgroundImpl background = new BackgroundImpl();
		return background;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public BackgroundPosition createBackgroundPosition() {
		BackgroundPositionImpl backgroundPosition = new BackgroundPositionImpl();
		return backgroundPosition;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Length createLength() {
		LengthImpl length = new LengthImpl();
		return length;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public BorderStyle createBorderStyleFromString(EDataType eDataType, String initialValue) {
		BorderStyle result = BorderStyle.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertBorderStyleToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontStyle createFontStyleFromString(EDataType eDataType, String initialValue) {
		FontStyle result = FontStyle.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertFontStyleToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontVariant createFontVariantFromString(EDataType eDataType, String initialValue) {
		FontVariant result = FontVariant.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertFontVariantToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontWeight createFontWeightFromString(EDataType eDataType, String initialValue) {
		FontWeight result = FontWeight.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertFontWeightToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public BackgroundAttachment createBackgroundAttachmentFromString(EDataType eDataType, String initialValue) {
		BackgroundAttachment result = BackgroundAttachment.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertBackgroundAttachmentToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public BackgroundRepeat createBackgroundRepeatFromString(EDataType eDataType, String initialValue) {
		BackgroundRepeat result = BackgroundRepeat.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertBackgroundRepeatToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Unit createUnitFromString(EDataType eDataType, String initialValue) {
		Unit result = Unit.get(initialValue);
		if (result == null) throw new IllegalArgumentException("The value '" + initialValue + "' is not a valid enumerator of '" + eDataType.getName() + "'");
		return result;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String convertUnitToString(EDataType eDataType, Object instanceValue) {
		return instanceValue == null ? null : instanceValue.toString();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public StylePackage getStylePackage() {
		return (StylePackage)getEPackage();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @deprecated
	 * @generated
	 */
	@Deprecated
	public static StylePackage getPackage() {
		return StylePackage.eINSTANCE;
	}

} //StyleFactoryImpl
