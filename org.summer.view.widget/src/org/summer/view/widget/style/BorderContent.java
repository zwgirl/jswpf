/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Border Content</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.BorderContent#getColor <em>Color</em>}</li>
 *   <li>{@link org.summer.view.widget.style.BorderContent#getStyle <em>Style</em>}</li>
 *   <li>{@link org.summer.view.widget.style.BorderContent#getWidth <em>Width</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.style.StylePackage#getBorderContent()
 * @model
 * @generated
 */
public interface BorderContent extends EObject {
	/**
	 * Returns the value of the '<em><b>Color</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Color</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Color</em>' containment reference.
	 * @see #setColor(RGB)
	 * @see org.summer.view.widget.style.StylePackage#getBorderContent_Color()
	 * @model containment="true"
	 * @generated
	 */
	RGB getColor();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.BorderContent#getColor <em>Color</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Color</em>' containment reference.
	 * @see #getColor()
	 * @generated
	 */
	void setColor(RGB value);

	/**
	 * Returns the value of the '<em><b>Style</b></em>' attribute.
	 * The literals are from the enumeration {@link org.summer.view.widget.style.BorderStyle}.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Style</em>' attribute isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Style</em>' attribute.
	 * @see org.summer.view.widget.style.BorderStyle
	 * @see #setStyle(BorderStyle)
	 * @see org.summer.view.widget.style.StylePackage#getBorderContent_Style()
	 * @model
	 * @generated
	 */
	BorderStyle getStyle();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.BorderContent#getStyle <em>Style</em>}' attribute.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Style</em>' attribute.
	 * @see org.summer.view.widget.style.BorderStyle
	 * @see #getStyle()
	 * @generated
	 */
	void setStyle(BorderStyle value);

	/**
	 * Returns the value of the '<em><b>Width</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Width</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Width</em>' containment reference.
	 * @see #setWidth(Length)
	 * @see org.summer.view.widget.style.StylePackage#getBorderContent_Width()
	 * @model containment="true"
	 * @generated
	 */
	Length getWidth();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.BorderContent#getWidth <em>Width</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Width</em>' containment reference.
	 * @see #getWidth()
	 * @generated
	 */
	void setWidth(Length value);

} // BorderContent
