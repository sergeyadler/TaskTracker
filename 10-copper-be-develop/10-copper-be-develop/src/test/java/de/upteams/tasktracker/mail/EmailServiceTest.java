package de.upteams.tasktracker.mail;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    @Test
    void sendConfirmationEmail_buildsLinkWithApiPrefix() {
        EmailSender emailSender = mock(EmailSender.class);
        TemplateEngine templateEngine = mock(TemplateEngine.class);

        EmailService service = new EmailService(emailSender, templateEngine);
        ReflectionTestUtils.setField(service, "frontendUrl", "http://localhost:5173");

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Map<String, Object>> modelCaptor = ArgumentCaptor.forClass(Map.class);
        when(templateEngine.generateHtml(eq("confirm_registration_mail.ftlh"), modelCaptor.capture()))
                .thenReturn("<html/>");

        service.sendConfirmationEmail("u@ex.com", "John", "Doe", "CODE123");

        Map<String, Object> model = modelCaptor.getValue();
        String link = (String) model.get("link");
        assertEquals("http://localhost:5173/confirm?code=CODE123", link);
        assertEquals("John", model.get("firstName"));
        assertEquals("Doe", model.get("lastName"));

        verify(emailSender).sendEmail(eq("u@ex.com"), anyString(), anyString());
        verifyNoMoreInteractions(emailSender);
    }
}