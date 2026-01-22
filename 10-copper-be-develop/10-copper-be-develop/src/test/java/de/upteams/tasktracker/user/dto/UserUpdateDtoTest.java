package de.upteams.tasktracker.user.dto;

import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;


import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserUpdateDtoTest {

    private static Validator validator;

    @BeforeAll
    static void init() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void notBlank_fields_are_required() {
        var dto = new UserUpdateDto(
                null,      // email (optional)
                "   ",     // displayName -> invalid
                "",        // position    -> invalid
                " \t ",    // department  -> invalid
                null,      // avatarUrl (optional)
                null       // bio (optional)
        );
        Set<ConstraintViolation<UserUpdateDto>> v = validator.validate(dto);
        assertFalse(v.isEmpty());
        assertTrue(v.stream().anyMatch(it -> it.getPropertyPath().toString().equals("displayName")));
        assertTrue(v.stream().anyMatch(it -> it.getPropertyPath().toString().equals("position")));
        assertTrue(v.stream().anyMatch(it -> it.getPropertyPath().toString().equals("department")));
    }

    @Test
    void email_format_and_length() {
        var ok = new UserUpdateDto(
                "user@example.com",
                "Homer", "Dev", "Eng",
                null, null
        );
        assertTrue(validator.validate(ok).isEmpty());

        var badFormat = new UserUpdateDto(
                "not-an-email",
                "Homer", "Dev", "Eng",
                null, null
        );
        assertFalse(validator.validate(badFormat).isEmpty());

        var longEmail = "a".repeat(256) + "@ex.com";
        var tooLong = new UserUpdateDto(
                longEmail,
                "Homer", "Dev", "Eng",
                null, null
        );
        assertFalse(validator.validate(tooLong).isEmpty());
    }

    @Test
    void avatar_url_must_be_valid_when_present() {
        var bad = new UserUpdateDto(
                null,
                "Homer", "Dev", "Eng",
                "not-a-url",
                null
        );
        assertFalse(validator.validate(bad).isEmpty());

        var ok = new UserUpdateDto(
                null,
                "Homer", "Dev", "Eng",
                "https://example.com/a.png",
                null
        );
        assertTrue(validator.validate(ok).isEmpty());
    }
}