package org.example.service;

public class UserException extends Exception {
    public UserException() {
        super();
    }
    public UserException(String message) {
        super(message);
    }

    public static class UserNotFoundException extends UserException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class InvalidPasswordException extends UserException {
        public InvalidPasswordException(String message) {
            super(message);
        }
    }

    public static class InvalidParametersException extends UserException {
        public InvalidParametersException(String message) {
            super(message);
        }
    }
}
