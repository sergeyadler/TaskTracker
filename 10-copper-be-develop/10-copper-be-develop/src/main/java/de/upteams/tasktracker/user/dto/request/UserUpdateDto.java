package de.upteams.tasktracker.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

/**
 * DTO for updating user's profile
 *
 * <p>This DTO contains only the fields that a user is allowed to update in their profile.
 * It is used in profile edit endpoints.</p>
 */
@Schema(description = "DTO for updating user's profile")
public record UserUpdateDto(
        @Schema(description = "New email (optional)", example = "user@example.com")
        @Email(message = "{user.email.invalid}")
        @Size(max = 255, message = "{user.email.max}")
        String email,

        @Schema(
                description = "User's display name",
                example = "Homer Simpson"
        )
        @NotBlank(message = "{user.displayName.notBlank}")
        @Size(max = 100, message = "{user.displayName.max}")
        String displayName,

        @Schema(
                description = "User's job position",
                example = "Developer"
        )
        @NotBlank(message = "{user.position.notBlank}")
        @Size(max = 100, message = "{user.position.max}")
        String position,

        @Schema(
                description = "Department or team of the user",
                example = "Engineering"
        )
        @NotBlank(message = "{user.department.notBlank}")
        @Size(max = 100, message = "{user.department.max}")
        String department,


        @Schema(
                description = "URL of user's avatar image",
                example = "https://example.com/avatar/homer.png"
        )
        @URL(message = "{user.avatarUrl.invalid}")
        @Size(max = 255, message = "{user.avatarUrl.max}")
        String avatarUrl,


        @Schema(
                description = "Short biography or info about the user",
                example = "Code Donut Sleep Repeat"
        )
        @Size(max = 500, message = "{user.bio.max}")
        String bio
) {}