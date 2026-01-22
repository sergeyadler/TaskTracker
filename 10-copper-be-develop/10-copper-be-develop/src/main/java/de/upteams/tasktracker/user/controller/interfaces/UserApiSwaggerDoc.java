package de.upteams.tasktracker.user.controller.interfaces;

import de.upteams.tasktracker.exception.handling.response.ErrorResponseDto;
import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(
        name = "User Management",
        description = "Operations to manage application users"
)
public interface UserApiSwaggerDoc {
    @Operation(
            summary = "Get all users",
            description = "Returns a JSON array of all users in the system. Access: ADMIN only."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = UserResponseDto.class)),
                            examples = @ExampleObject(
                                    name = "200 OK",
                                    value = """
                                [
                                  {
                                    "id": "7d3f0a2e-9c0e-4f0c-8c3a-2a6a9f1a1b11",
                                    "email": "admin@example.com",
                                    "firstName": "Admin",
                                    "lastName": "User",
                                    "avatarUrl": "https://cdn.app/u/1.png",
                                    "roles": ["ADMIN"]
                                  },
                                  {
                                    "id": "e1f3b3c1-3a22-4a2c-99e7-d8a2b05a9b77",
                                    "email": "user@example.com",
                                    "firstName": "John",
                                    "lastName": "Doe",
                                    "avatarUrl": null,
                                    "roles": ["USER"]
                                  }
                                ]
                                """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized — authentication required",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class),
                            examples = @ExampleObject(
                                    name = "401 Unauthorized",
                                    value = """
                                {
                                  "timestamp": "2025-10-30T10:15:00",
                                  "status": 401,
                                  "error": "Unauthorized",
                                  "message": "Authentication required",
                                  "errors": [],
                                  "path": "/api/v1/users"
                                }
                                """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden — insufficient permissions (ADMIN required)",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class),
                            examples = @ExampleObject(
                                    name = "403 Forbidden",
                                    value = """
                                {
                                  "timestamp": "2025-10-30T10:15:00",
                                  "status": 403,
                                  "error": "Forbidden",
                                  "message": "ADMIN role required",
                                  "errors": [],
                                  "path": "/api/v1/users"
                                }
                                """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class),
                            examples = @ExampleObject(
                                    name = "500 Internal Server Error",
                                    value = """
                                {
                                  "timestamp": "2025-10-30T10:15:00",
                                  "status": 500,
                                  "error": "Internal Server Error",
                                  "message": "Unexpected error",
                                  "errors": [],
                                  "path": "/api/v1/users"
                                }
                                """
                            )
                    )
            )
    })
    List<UserResponseDto> getAll();


    // ====================================
    // GET /api/v1/users/{email} (ADMIN, USER)
    // ====================================
    @Operation(
            summary = "Get user by email",
            description = "Returns user profile by email. Access: ADMIN, USER. " +
                    "Regular users should only access their own profile (enforced by security rules).",
            security = { @SecurityRequirement(name = "cookieAuth") }
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User retrieved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request (invalid email format)",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized — authentication required",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden — insufficient permissions or accessing another user's data",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    UserResponseDto getByEmail(
            @Parameter(description = "User email", required = true, example = "user@example.com")
            String email
    );

    // ======================================
    // PUT /api/v1/users/update (ADMIN, USER)
    // ======================================
    @Operation(
            summary = "Update current user profile",
            description = "Updates the current authenticated user's profile. Access: ADMIN, USER.",
            security = { @SecurityRequirement(name = "cookieAuth") }
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized — authentication required",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden — insufficient permissions",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    UserResponseDto updateUser(
            @RequestBody
            UserUpdateDto dto
    );

    // ===========================================
    // PUT /api/v1/users/update/{email} (ADMIN)
    // ===========================================
    @Operation(
            summary = "Update user by email (ADMIN)",
            description = "Updates user profile by email. Access: ADMIN only.",
            security = { @SecurityRequirement(name = "cookieAuth") }
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "User updated",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation failed or bad email format",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized — authentication required",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden — ADMIN role required",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponseDto.class))
            )
    })
    UserResponseDto updateUserByEmail(
            @Parameter(description = "User email", required = true, example = "user@example.com")
            String email,
            @RequestBody
            UserUpdateDto dto
    );
}
