/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Background Position</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.BackgroundPosition#getX <em>X</em>}</li>
 *   <li>{@link org.summer.view.widget.style.BackgroundPosition#getY <em>Y</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.style.StylePackage#getBackgroundPosition()
 * @model
 * @generated
 */
public interface BackgroundPosition extends EObject {
	/**
	 * Returns the value of the '<em><b>X</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>X</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>X</em>' containment reference.
	 * @see #setX(Length)
	 * @see org.summer.view.widget.style.StylePackage#getBackgroundPosition_X()
	 * @model containment="true"
	 * @generated
	 */
	Length getX();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.BackgroundPosition#getX <em>X</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>X</em>' containment reference.
	 * @see #getX()
	 * @generated
	 */
	void setX(Length value);

	/**
	 * Returns the value of the '<em><b>Y</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Y</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Y</em>' containment reference.
	 * @see #setY(Length)
	 * @see org.summer.view.widget.style.StylePackage#getBackgroundPosition_Y()
	 * @model containment="true"
	 * @generated
	 */
	Length getY();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.BackgroundPosition#getY <em>Y</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Y</em>' containment reference.
	 * @see #getY()
	 * @generated
	 */
	void setY(Length value);

} // BackgroundPosition
