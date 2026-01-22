package de.upteams.tasktracker.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDto (
        @NotBlank(message = "Reset token is required")
        String token,

        @NotBlank(message = "{user.password.notBlank}")
        @Size(min = 8, max = 72, message = "{user.password.size}")
        String newPassword
){
}
