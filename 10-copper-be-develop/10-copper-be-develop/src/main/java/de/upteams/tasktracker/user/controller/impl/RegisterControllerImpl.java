package de.upteams.tasktracker.user.controller.impl;

import de.upteams.tasktracker.security.entities.TokenResponseDto;
import de.upteams.tasktracker.security.service.CookieService;
import de.upteams.tasktracker.user.controller.interfaces.RegisterControllerApi;
import de.upteams.tasktracker.user.dto.request.UserCreateDto;
import de.upteams.tasktracker.user.dto.response.UserCreateResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import de.upteams.tasktracker.user.service.impl.UserRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class RegisterControllerImpl implements RegisterControllerApi {

    private final UserRegisterService service;
    private final CookieService cookieService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public UserCreateResponseDto register(UserCreateDto registerUser) {
        return service.register(registerUser);
    }

    @Override
    public ResponseEntity<Void> confirmRegistration(String code, HttpServletResponse response) {
        TokenResponseDto tokens = service.confirmRegistration(code);

        Cookie accessCookie = cookieService.generateAccessTokenCookie(tokens.getAccessToken());
        Cookie refreshCookie = cookieService.generateRefreshTokenCookie(tokens.getRefreshToken());

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        URI redictLocation = URI.create(frontendUrl + "/login");
        return  ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.LOCATION, redictLocation.toString())
                .build();
    }
}
