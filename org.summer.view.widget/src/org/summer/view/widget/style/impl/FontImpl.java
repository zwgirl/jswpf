/**
 */
package org.summer.view.widget.style.impl;

import org.eclipse.emf.common.notify.Notification;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.InternalEObject;
import org.eclipse.emf.ecore.impl.ENotificationImpl;
import org.eclipse.emf.ecore.impl.EObjectImpl;
import org.summer.view.widget.style.Font;
import org.summer.view.widget.style.FontStyle;
import org.summer.view.widget.style.FontVariant;
import org.summer.view.widget.style.FontWeight;
import org.summer.view.widget.style.Length;
import org.summer.view.widget.style.StylePackage;

/**
 * <!-- begin-user-doc -->
 * An implementation of the model object '<em><b>Font</b></em>'.
 * <!-- end-user-doc -->
 * <p>
 * The following features are implemented:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getSize <em>Size</em>}</li>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getStyle <em>Style</em>}</li>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getVariant <em>Variant</em>}</li>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getWeight <em>Weight</em>}</li>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getFamily <em>Family</em>}</li>
 *   <li>{@link org.summer.view.widget.style.impl.FontImpl#getLineHeight <em>Line Height</em>}</li>
 * </ul>
 * </p>
 *
 * @generated
 */
public class FontImpl extends EObjectImpl implements Font {
	/**
	 * The cached value of the '{@link #getSize() <em>Size</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getSize()
	 * @generated
	 * @ordered
	 */
	protected Length size;

	/**
	 * The default value of the '{@link #getStyle() <em>Style</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getStyle()
	 * @generated
	 * @ordered
	 */
	protected static final FontStyle STYLE_EDEFAULT = FontStyle.NORMAL;

	/**
	 * The cached value of the '{@link #getStyle() <em>Style</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getStyle()
	 * @generated
	 * @ordered
	 */
	protected FontStyle style = STYLE_EDEFAULT;

	/**
	 * The default value of the '{@link #getVariant() <em>Variant</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getVariant()
	 * @generated
	 * @ordered
	 */
	protected static final FontVariant VARIANT_EDEFAULT = FontVariant.NORMAL;

	/**
	 * The cached value of the '{@link #getVariant() <em>Variant</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getVariant()
	 * @generated
	 * @ordered
	 */
	protected FontVariant variant = VARIANT_EDEFAULT;

	/**
	 * The default value of the '{@link #getWeight() <em>Weight</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getWeight()
	 * @generated
	 * @ordered
	 */
	protected static final FontWeight WEIGHT_EDEFAULT = FontWeight.BOLD;

	/**
	 * The cached value of the '{@link #getWeight() <em>Weight</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getWeight()
	 * @generated
	 * @ordered
	 */
	protected FontWeight weight = WEIGHT_EDEFAULT;

	/**
	 * The default value of the '{@link #getFamily() <em>Family</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getFamily()
	 * @generated
	 * @ordered
	 */
	protected static final String FAMILY_EDEFAULT = null;

	/**
	 * The cached value of the '{@link #getFamily() <em>Family</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getFamily()
	 * @generated
	 * @ordered
	 */
	protected String family = FAMILY_EDEFAULT;

	/**
	 * The cached value of the '{@link #getLineHeight() <em>Line Height</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #getLineHeight()
	 * @generated
	 * @ordered
	 */
	protected Length lineHeight;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	protected FontImpl() {
		super();
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	protected EClass eStaticClass() {
		return StylePackage.Literals.FONT;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Length getSize() {
		if (size != null && size.eIsProxy()) {
			InternalEObject oldSize = (InternalEObject)size;
			size = (Length)eResolveProxy(oldSize);
			if (size != oldSize) {
				if (eNotificationRequired())
					eNotify(new ENotificationImpl(this, Notification.RESOLVE, StylePackage.FONT__SIZE, oldSize, size));
			}
		}
		return size;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Length basicGetSize() {
		return size;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setSize(Length newSize) {
		Length oldSize = size;
		size = newSize;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__SIZE, oldSize, size));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontStyle getStyle() {
		return style;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setStyle(FontStyle newStyle) {
		FontStyle oldStyle = style;
		style = newStyle == null ? STYLE_EDEFAULT : newStyle;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__STYLE, oldStyle, style));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontVariant getVariant() {
		return variant;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setVariant(FontVariant newVariant) {
		FontVariant oldVariant = variant;
		variant = newVariant == null ? VARIANT_EDEFAULT : newVariant;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__VARIANT, oldVariant, variant));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public FontWeight getWeight() {
		return weight;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setWeight(FontWeight newWeight) {
		FontWeight oldWeight = weight;
		weight = newWeight == null ? WEIGHT_EDEFAULT : newWeight;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__WEIGHT, oldWeight, weight));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String getFamily() {
		return family;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setFamily(String newFamily) {
		String oldFamily = family;
		family = newFamily;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__FAMILY, oldFamily, family));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Length getLineHeight() {
		if (lineHeight != null && lineHeight.eIsProxy()) {
			InternalEObject oldLineHeight = (InternalEObject)lineHeight;
			lineHeight = (Length)eResolveProxy(oldLineHeight);
			if (lineHeight != oldLineHeight) {
				if (eNotificationRequired())
					eNotify(new ENotificationImpl(this, Notification.RESOLVE, StylePackage.FONT__LINE_HEIGHT, oldLineHeight, lineHeight));
			}
		}
		return lineHeight;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public Length basicGetLineHeight() {
		return lineHeight;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public void setLineHeight(Length newLineHeight) {
		Length oldLineHeight = lineHeight;
		lineHeight = newLineHeight;
		if (eNotificationRequired())
			eNotify(new ENotificationImpl(this, Notification.SET, StylePackage.FONT__LINE_HEIGHT, oldLineHeight, lineHeight));
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public Object eGet(int featureID, boolean resolve, boolean coreType) {
		switch (featureID) {
			case StylePackage.FONT__SIZE:
				if (resolve) return getSize();
				return basicGetSize();
			case StylePackage.FONT__STYLE:
				return getStyle();
			case StylePackage.FONT__VARIANT:
				return getVariant();
			case StylePackage.FONT__WEIGHT:
				return getWeight();
			case StylePackage.FONT__FAMILY:
				return getFamily();
			case StylePackage.FONT__LINE_HEIGHT:
				if (resolve) return getLineHeight();
				return basicGetLineHeight();
		}
		return super.eGet(featureID, resolve, coreType);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eSet(int featureID, Object newValue) {
		switch (featureID) {
			case StylePackage.FONT__SIZE:
				setSize((Length)newValue);
				return;
			case StylePackage.FONT__STYLE:
				setStyle((FontStyle)newValue);
				return;
			case StylePackage.FONT__VARIANT:
				setVariant((FontVariant)newValue);
				return;
			case StylePackage.FONT__WEIGHT:
				setWeight((FontWeight)newValue);
				return;
			case StylePackage.FONT__FAMILY:
				setFamily((String)newValue);
				return;
			case StylePackage.FONT__LINE_HEIGHT:
				setLineHeight((Length)newValue);
				return;
		}
		super.eSet(featureID, newValue);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public void eUnset(int featureID) {
		switch (featureID) {
			case StylePackage.FONT__SIZE:
				setSize((Length)null);
				return;
			case StylePackage.FONT__STYLE:
				setStyle(STYLE_EDEFAULT);
				return;
			case StylePackage.FONT__VARIANT:
				setVariant(VARIANT_EDEFAULT);
				return;
			case StylePackage.FONT__WEIGHT:
				setWeight(WEIGHT_EDEFAULT);
				return;
			case StylePackage.FONT__FAMILY:
				setFamily(FAMILY_EDEFAULT);
				return;
			case StylePackage.FONT__LINE_HEIGHT:
				setLineHeight((Length)null);
				return;
		}
		super.eUnset(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public boolean eIsSet(int featureID) {
		switch (featureID) {
			case StylePackage.FONT__SIZE:
				return size != null;
			case StylePackage.FONT__STYLE:
				return style != STYLE_EDEFAULT;
			case StylePackage.FONT__VARIANT:
				return variant != VARIANT_EDEFAULT;
			case StylePackage.FONT__WEIGHT:
				return weight != WEIGHT_EDEFAULT;
			case StylePackage.FONT__FAMILY:
				return FAMILY_EDEFAULT == null ? family != null : !FAMILY_EDEFAULT.equals(family);
			case StylePackage.FONT__LINE_HEIGHT:
				return lineHeight != null;
		}
		return super.eIsSet(featureID);
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		if (eIsProxy()) return super.toString();

		StringBuffer result = new StringBuffer(super.toString());
		result.append(" (style: ");
		result.append(style);
		result.append(", variant: ");
		result.append(variant);
		result.append(", weight: ");
		result.append(weight);
		result.append(", family: ");
		result.append(family);
		result.append(')');
		return result.toString();
	}

} //FontImpl
