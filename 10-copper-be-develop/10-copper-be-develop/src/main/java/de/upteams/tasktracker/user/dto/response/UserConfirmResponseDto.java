package de.upteams.tasktracker.user.dto.response;

import de.upteams.tasktracker.user.entity.ConfirmationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Simplified User DTO used for registration and email confirmation responses")
public record  UserConfirmResponseDto (
        @Schema(
                description = "User's email address",
                example = "homer@simpsons.com"
        )
        String email,

        @Schema(
                description = "Role assigned to the user",
                example = "ROLE_USER",
                accessMode = Schema.AccessMode.READ_ONLY
        )
        String role,

        @Schema(
                description = "Confirmation status of the user account",
                example = "CONFIRMED",
                accessMode = Schema.AccessMode.READ_ONLY
        )
        ConfirmationStatus confirmationStatus
){
}
