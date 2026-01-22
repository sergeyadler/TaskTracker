package de.upteams.tasktracker.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateDto(
        @Schema(
                description = "new User email",
                example = "tes_dev@upteams.de"
        )
        @NotBlank(message = "{user.email.notBlank}")
        @Email(message = "{user.email.invalid}")
        @Size(max = 255, message = "{user.email.max}")
        String email,

        @Schema(
                description = "new User password",
                example = "dev_TR_pass_007"
        )
        @NotBlank(message="{user.password.notBlank}")
        @Size(min = 8, message="{user.password.size}")
        String password,

        @Schema(
                description = "User's first name",
                example = "John"
        )
        @NotBlank(message = "{user.firstName.notBlank}")
        @Size(max = 100, message = "{user.firstName.max}")
        String firstName,

        @Schema(
                description = "User's last name",
                example = "Smith"
        )
        @NotBlank(message = "{user.lastName.notBlank}")
        @Size(max = 100, message = "{user.lastName.max}")
        String lastName){
}
