/**
 */
package org.summer.view.widget.style;

import org.eclipse.emf.ecore.EObject;

/**
 * <!-- begin-user-doc -->
 * A representation of the model object '<em><b>Border</b></em>'.
 * <!-- end-user-doc -->
 *
 * <p>
 * The following features are supported:
 * <ul>
 *   <li>{@link org.summer.view.widget.style.Border#getLeft <em>Left</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Border#getTop <em>Top</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Border#getRight <em>Right</em>}</li>
 *   <li>{@link org.summer.view.widget.style.Border#getBottom <em>Bottom</em>}</li>
 * </ul>
 * </p>
 *
 * @see org.summer.view.widget.style.StylePackage#getBorder()
 * @model
 * @generated
 */
public interface Border extends EObject {
	/**
	 * Returns the value of the '<em><b>Left</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Left</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Left</em>' containment reference.
	 * @see #setLeft(BorderContent)
	 * @see org.summer.view.widget.style.StylePackage#getBorder_Left()
	 * @model containment="true"
	 * @generated
	 */
	BorderContent getLeft();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Border#getLeft <em>Left</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Left</em>' containment reference.
	 * @see #getLeft()
	 * @generated
	 */
	void setLeft(BorderContent value);

	/**
	 * Returns the value of the '<em><b>Top</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Top</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Top</em>' containment reference.
	 * @see #setTop(BorderContent)
	 * @see org.summer.view.widget.style.StylePackage#getBorder_Top()
	 * @model containment="true"
	 * @generated
	 */
	BorderContent getTop();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Border#getTop <em>Top</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Top</em>' containment reference.
	 * @see #getTop()
	 * @generated
	 */
	void setTop(BorderContent value);

	/**
	 * Returns the value of the '<em><b>Right</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Right</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Right</em>' containment reference.
	 * @see #setRight(BorderContent)
	 * @see org.summer.view.widget.style.StylePackage#getBorder_Right()
	 * @model containment="true"
	 * @generated
	 */
	BorderContent getRight();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Border#getRight <em>Right</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Right</em>' containment reference.
	 * @see #getRight()
	 * @generated
	 */
	void setRight(BorderContent value);

	/**
	 * Returns the value of the '<em><b>Bottom</b></em>' containment reference.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of the '<em>Bottom</em>' containment reference isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @return the value of the '<em>Bottom</em>' containment reference.
	 * @see #setBottom(BorderContent)
	 * @see org.summer.view.widget.style.StylePackage#getBorder_Bottom()
	 * @model containment="true"
	 * @generated
	 */
	BorderContent getBottom();

	/**
	 * Sets the value of the '{@link org.summer.view.widget.style.Border#getBottom <em>Bottom</em>}' containment reference.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @param value the new value of the '<em>Bottom</em>' containment reference.
	 * @see #getBottom()
	 * @generated
	 */
	void setBottom(BorderContent value);

} // Border
