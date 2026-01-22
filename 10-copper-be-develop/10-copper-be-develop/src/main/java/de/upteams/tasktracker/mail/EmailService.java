package de.upteams.tasktracker.mail;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service for email sending
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final EmailSender emailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendConfirmationEmail(String sentTo, String firstName, String lastName, String confirmationCode) {
        String confirmationLink = "%s/confirm?code=%s".formatted(frontendUrl, confirmationCode);

        Map<String, Object> model = Map.of(
                "link", confirmationLink,
                "firstName", firstName,
                "lastName", lastName
        );

        String htmlContent = templateEngine.generateHtml("confirm_registration_mail.ftlh", model);
        emailSender.sendEmail(sentTo, "Confirm your registration", htmlContent);
    }

    @Async
        public void sendPasswordResetEmail(@NotBlank(message = "{user.email.notBlank}") String email, String token) {
            String resetLink = "%s/reset-password?token=%s".formatted(frontendUrl, token);

            Map<String, Object> model = Map.of(
                    "link", resetLink
            );

            String htmlContent = templateEngine.generateHtml("password_reset_mail.ftlh", model);
            emailSender.sendEmail(email, "Reset your password", htmlContent);
    }
}
