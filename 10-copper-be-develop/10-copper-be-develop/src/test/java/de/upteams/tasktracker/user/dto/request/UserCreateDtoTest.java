package de.upteams.tasktracker.user.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserCreateDtoTest {

    private static Validator validator;
    private static ValidatorFactory validatorFactory;

    @BeforeAll
    static void init() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        if (validatorFactory != null) {
            validatorFactory.close();
        }
    }

    @Test
    void shouldFail_whenPasswordBlankOrSpaces() {
        UserCreateDto blank = new UserCreateDto("a@b.c", "", "John", "Doe");
        UserCreateDto spaces = new UserCreateDto("a@b.c", "   ", "John", "Doe");

        Set<ConstraintViolation<UserCreateDto>> v1 = validator.validate(blank);
        Set<ConstraintViolation<UserCreateDto>> v2 = validator.validate(spaces);

        assertTrue(hasErrorFor("password", v1));
        assertTrue(hasErrorFor("password", v2));
    }

    @Test
    void shouldFail_whenPasswordTooShort() {
        UserCreateDto dto = new UserCreateDto("a@b.c", "1234567", "John", "Doe"); // 7
        Set<ConstraintViolation<UserCreateDto>> v = validator.validate(dto);
        assertTrue(hasErrorFor("password", v));
    }

    @Test
    void shouldPass_whenPasswordOk() {
        UserCreateDto dto = new UserCreateDto("user@example.com", "123456789", "John", "Doe"); // 9
        Set<ConstraintViolation<UserCreateDto>> v = validator.validate(dto);
        assertFalse(hasErrorFor("password", v));
    }
    @Test
    void email_shouldFail_whenBlankOrSpaces() {
        UserCreateDto blank = new UserCreateDto("", "12345678", "John", "Doe");
        UserCreateDto spaces = new UserCreateDto("   ", "12345678", "John", "Doe");

        Set<ConstraintViolation<UserCreateDto>> r1 = validator.validate(blank);
        Set<ConstraintViolation<UserCreateDto>> r2 = validator.validate(spaces);

        assertTrue(hasErrorFor("email", r1));
        assertTrue(hasErrorFor("email", r2));
    }

    @Test
    void email_shouldFail_whenInvalidFormat() {
        UserCreateDto bad = new UserCreateDto("not-an-email", "12345678", "John", "Doe");
        Set<ConstraintViolation<UserCreateDto>> res = validator.validate(bad);
        assertTrue(hasErrorFor("email", res));
    }

    @Test
    void email_shouldFail_whenTooLong() {
        String tooLong = "x".repeat(256);
        UserCreateDto dto = new UserCreateDto(tooLong, "12345678", "John", "Doe");
        Set<ConstraintViolation<UserCreateDto>> res = validator.validate(dto);
        assertTrue(hasErrorFor("email", res));
    }

    @Test
    void email_shouldPass_whenValid() {
        UserCreateDto ok = new UserCreateDto("user@example.com", "12345678", "John", "Doe");
        Set<ConstraintViolation<UserCreateDto>> res = validator.validate(ok);
        assertFalse(hasErrorFor("email", res));
    }

    @Test
    void firstName_shouldFail_whenBlankOrSpaces() {
        UserCreateDto blank = new UserCreateDto("user@example.com", "12345678", "", "Doe");
        UserCreateDto spaces = new UserCreateDto("user@example.com", "12345678", "   ", "Doe");

        Set<ConstraintViolation<UserCreateDto>> r1 = validator.validate(blank);
        Set<ConstraintViolation<UserCreateDto>> r2 = validator.validate(spaces);

        assertTrue(hasErrorFor("firstName", r1));
        assertTrue(hasErrorFor("firstName", r2));
    }

    @Test
    void lastName_shouldFail_whenBlankOrSpaces() {
        UserCreateDto blank = new UserCreateDto("user@example.com", "12345678", "John", "");
        UserCreateDto spaces = new UserCreateDto("user@example.com", "12345678", "John", "   ");

        Set<ConstraintViolation<UserCreateDto>> r1 = validator.validate(blank);
        Set<ConstraintViolation<UserCreateDto>> r2 = validator.validate(spaces);

        assertTrue(hasErrorFor("lastName", r1));
        assertTrue(hasErrorFor("lastName", r2));
    }


    private static boolean hasErrorFor(
            String property, Set<ConstraintViolation<UserCreateDto>> violations) {
        return violations.stream()
                .anyMatch(cv -> cv.getPropertyPath().toString().equals(property));
    }
}