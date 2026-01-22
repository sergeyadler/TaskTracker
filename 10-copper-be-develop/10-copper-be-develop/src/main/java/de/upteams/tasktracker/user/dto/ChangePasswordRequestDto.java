package de.upteams.tasktracker.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



public record ChangePasswordRequestDto(
        @NotBlank(message = "Current password is required")
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 72, message = "Password must be 8..72 chars")
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        String confirmNewPassword
) {}