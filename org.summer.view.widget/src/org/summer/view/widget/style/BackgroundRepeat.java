/**
 */
package org.summer.view.widget.style;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.eclipse.emf.common.util.Enumerator;

/**
 * <!-- begin-user-doc -->
 * A representation of the literals of the enumeration '<em><b>Background Repeat</b></em>',
 * and utility methods for working with them.
 * <!-- end-user-doc -->
 * @see org.summer.view.widget.style.StylePackage#getBackgroundRepeat()
 * @model
 * @generated
 */
public enum BackgroundRepeat implements Enumerator {
	/**
	 * The '<em><b>Repaet X</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #REPAET_X_VALUE
	 * @generated
	 * @ordered
	 */
	REPAET_X(0, "repaetX", "repaetX"),

	/**
	 * The '<em><b>Repeat Y</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #REPEAT_Y_VALUE
	 * @generated
	 * @ordered
	 */
	REPEAT_Y(0, "repeatY", "repeatY"),

	/**
	 * The '<em><b>No Repeat</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #NO_REPEAT_VALUE
	 * @generated
	 * @ordered
	 */
	NO_REPEAT(0, "noRepeat", "noRepeat"),

	/**
	 * The '<em><b>Inherit</b></em>' literal object.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @see #INHERIT_VALUE
	 * @generated
	 * @ordered
	 */
	INHERIT(0, "inherit", "inherit");

	/**
	 * The '<em><b>Repaet X</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of '<em><b>Repaet X</b></em>' literal object isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @see #REPAET_X
	 * @model name="repaetX"
	 * @generated
	 * @ordered
	 */
	public static final int REPAET_X_VALUE = 0;

	/**
	 * The '<em><b>Repeat Y</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of '<em><b>Repeat Y</b></em>' literal object isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @see #REPEAT_Y
	 * @model name="repeatY"
	 * @generated
	 * @ordered
	 */
	public static final int REPEAT_Y_VALUE = 0;

	/**
	 * The '<em><b>No Repeat</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of '<em><b>No Repeat</b></em>' literal object isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @see #NO_REPEAT
	 * @model name="noRepeat"
	 * @generated
	 * @ordered
	 */
	public static final int NO_REPEAT_VALUE = 0;

	/**
	 * The '<em><b>Inherit</b></em>' literal value.
	 * <!-- begin-user-doc -->
	 * <p>
	 * If the meaning of '<em><b>Inherit</b></em>' literal object isn't clear,
	 * there really should be more of a description here...
	 * </p>
	 * <!-- end-user-doc -->
	 * @see #INHERIT
	 * @model name="inherit"
	 * @generated
	 * @ordered
	 */
	public static final int INHERIT_VALUE = 0;

	/**
	 * An array of all the '<em><b>Background Repeat</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private static final BackgroundRepeat[] VALUES_ARRAY =
		new BackgroundRepeat[] {
			REPAET_X,
			REPEAT_Y,
			NO_REPEAT,
			INHERIT,
		};

	/**
	 * A public read-only list of all the '<em><b>Background Repeat</b></em>' enumerators.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static final List<BackgroundRepeat> VALUES = Collections.unmodifiableList(Arrays.asList(VALUES_ARRAY));

	/**
	 * Returns the '<em><b>Background Repeat</b></em>' literal with the specified literal value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static BackgroundRepeat get(String literal) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			BackgroundRepeat result = VALUES_ARRAY[i];
			if (result.toString().equals(literal)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Background Repeat</b></em>' literal with the specified name.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static BackgroundRepeat getByName(String name) {
		for (int i = 0; i < VALUES_ARRAY.length; ++i) {
			BackgroundRepeat result = VALUES_ARRAY[i];
			if (result.getName().equals(name)) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the '<em><b>Background Repeat</b></em>' literal with the specified integer value.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public static BackgroundRepeat get(int value) {
		switch (value) {
			case REPAET_X_VALUE: return REPAET_X;
		}
		return null;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final int value;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String name;

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private final String literal;

	/**
	 * Only this class can construct instances.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	private BackgroundRepeat(int value, String name, String literal) {
		this.value = value;
		this.name = name;
		this.literal = literal;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public int getValue() {
	  return value;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String getName() {
	  return name;
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	public String getLiteral() {
	  return literal;
	}

	/**
	 * Returns the literal value of the enumerator, which is its string representation.
	 * <!-- begin-user-doc -->
	 * <!-- end-user-doc -->
	 * @generated
	 */
	@Override
	public String toString() {
		return literal;
	}
	
} //BackgroundRepeat
