package org.example.service;

public interface UserService {
    /**
     * Registers a new user with the provided identity parameters.
     *
     * @param params the identity parameters containing user details such as name, email, phone, password, status, address, age, and nationality
     * @return an integer representing the result of the sign-up operation
     * 0: Success
     * -1: Input error
     * -2: User already exists
     * -3: Invalid password
     */
    int signUp(IdentityParams params);

    void login(IdentityParams params) throws UserException;
}
