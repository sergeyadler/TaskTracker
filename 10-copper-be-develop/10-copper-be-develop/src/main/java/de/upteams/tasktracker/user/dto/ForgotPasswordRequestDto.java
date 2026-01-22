package de.upteams.tasktracker.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDto (
    @NotBlank(message = "{user.email.notBlank}")
    @Email(message = "{user.email.invalid}")
    String email

    ){
}
