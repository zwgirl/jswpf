/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Font</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.Font#getSize <em>Size</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Font#getStyle <em>Style</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Font#getVariant <em>Variant</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Font#getWeight <em>Weight</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Font#getFamily <em>Family</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Font#getLineHeight <em>Line Height</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.style.StylePackage#getFont()
 * @model
 * @generated
 */
public interface Font extends EObject {
	/**
	 * Returns the value of the '<em><b>Size</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Size</em>' reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Size</em>' reference.
	 * @see #setSize(Length)
	 * @see org.summer.view.widget.style.StylePackage#getFont_Size()
	 * @model
	 * @generated
	 */
	Length getSize();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getSize <em>Size</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Size</em>' reference.
	 * @see #getSize()
	 * @generated
	 */
	void setSize(Length value);

	/**
	 * Returns the value of the '<em><b>Style</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.FontStyle}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Style</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Style</em>' attribute.
	 * @see org.summer.view.widget.style.FontStyle
	 * @see #setStyle(FontStyle)
	 * @see org.summer.view.widget.style.StylePackage#getFont_Style()
	 * @model
	 * @generated
	 */
	FontStyle getStyle();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getStyle <em>Style</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Style</em>' attribute.
	 * @see org.summer.view.widget.style.FontStyle
	 * @see #getStyle()
	 * @generated
	 */
	void setStyle(FontStyle value);

	/**
	 * Returns the value of the '<em><b>Variant</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.FontVariant}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Variant</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Variant</em>' attribute.
	 * @see org.summer.view.widget.style.FontVariant
	 * @see #setVariant(FontVariant)
	 * @see org.summer.view.widget.style.StylePackage#getFont_Variant()
	 * @model
	 * @generated
	 */
	FontVariant getVariant();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getVariant <em>Variant</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Variant</em>' attribute.
	 * @see org.summer.view.widget.style.FontVariant
	 * @see #getVariant()
	 * @generated
	 */
	void setVariant(FontVariant value);

	/**
	 * Returns the value of the '<em><b>Weight</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.FontWeight}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Weight</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Weight</em>' attribute.
	 * @see org.summer.view.widget.style.FontWeight
	 * @see #setWeight(FontWeight)
	 * @see org.summer.view.widget.style.StylePackage#getFont_Weight()
	 * @model
	 * @generated
	 */
	FontWeight getWeight();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getWeight <em>Weight</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Weight</em>' attribute.
	 * @see org.summer.view.widget.style.FontWeight
	 * @see #getWeight()
	 * @generated
	 */
	void setWeight(FontWeight value);

	/**
	 * Returns the value of the '<em><b>Family</b></em>' attribute.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Family</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Family</em>' attribute.
	 * @see #setFamily(String)
	 * @see org.summer.view.widget.style.StylePackage#getFont_Family()
	 * @model
	 * @generated
	 */
	String getFamily();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getFamily <em>Family</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Family</em>' attribute.
	 * @see #getFamily()
	 * @generated
	 */
	void setFamily(String value);

	/**
	 * Returns the value of the '<em><b>Line Height</b></em>' reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Line Height</em>' reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Line Height</em>' reference.
	 * @see #setLineHeight(Length)
	 * @see org.summer.view.widget.style.StylePackage#getFont_LineHeight()
	 * @model
	 * @generated
	 */
	Length getLineHeight();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Font#getLineHeight <em>Line Height</em>}' reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Line Height</em>' reference.
	 * @see #getLineHeight()
	 * @generated
	 */
	void setLineHeight(Length value);

} // Font
