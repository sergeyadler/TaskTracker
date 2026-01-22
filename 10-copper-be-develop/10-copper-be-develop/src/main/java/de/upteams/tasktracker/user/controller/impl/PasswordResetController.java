package de.upteams.tasktracker.user.controller.impl;

import de.upteams.tasktracker.user.dto.ForgotPasswordRequestDto;
import de.upteams.tasktracker.user.dto.ResetPasswordRequestDto;
import de.upteams.tasktracker.user.service.impl.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
@Tag(name = "Forgot/Reset Password", description = "Endpoints for password forgot /reset password flow")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }
    @Operation(summary = "Request password reset email")
    @PostMapping("/forgot")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto request) {
        passwordResetService.createPasswordResetToken(request.email()); // FrontendURL берется из AppProperties
        return ResponseEntity.ok("If an account with this email exists, you will receive a password reset email.");
    }

    @Operation(summary = "Reset password using token")
    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(
           @Valid @RequestBody ResetPasswordRequestDto request
    ) {
        boolean success = passwordResetService.resetPassword(request.token(), request.newPassword());
        if (!success) {
            return ResponseEntity.badRequest().body("The link is invalid or has expired. Please request a new one.");
        }
        return ResponseEntity.ok("Password has been successfully reset.");
    }
}
