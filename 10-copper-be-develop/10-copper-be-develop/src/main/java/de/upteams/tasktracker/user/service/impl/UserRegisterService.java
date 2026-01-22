package de.upteams.tasktracker.user.service.impl;

import de.upteams.tasktracker.mail.EmailService;
import de.upteams.tasktracker.mail.confirmation.code.ConfirmationCode;
import de.upteams.tasktracker.mail.confirmation.code.interfaces.ConfirmationService;
import de.upteams.tasktracker.security.entities.TokenResponseDto;
import de.upteams.tasktracker.security.service.JwtTokenService;
import de.upteams.tasktracker.user.dto.request.UserCreateDto;
import de.upteams.tasktracker.user.dto.response.UserCreateResponseDto;
import de.upteams.tasktracker.user.entity.AppUser;
import de.upteams.tasktracker.user.exception.UserAlreadyExistException;
import de.upteams.tasktracker.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static de.upteams.tasktracker.user.entity.ConfirmationStatus.CONFIRMED;
import static de.upteams.tasktracker.user.entity.ConfirmationStatus.UNCONFIRMED;

@Service
@RequiredArgsConstructor
public class UserRegisterService {

    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ConfirmationService confirmationService;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;

    @Transactional
    public UserCreateResponseDto register(final UserCreateDto dto) {
        final String normalizedEmail = dto.email().toLowerCase().trim();
        final String encodedPassword = passwordEncoder.encode(dto.password());

        final Optional<AppUser> foundUserByEmail = userService.getByEmail(normalizedEmail);
        if (foundUserByEmail.isPresent()) {
            return handleExistingUser(foundUserByEmail.get());
        }

        final AppUser appUser = new AppUser(
                encodedPassword,
                normalizedEmail,
                dto.firstName(),
                dto.lastName()
        );
        final AppUser savedNewUser = userService.saveOrUpdate(appUser);

        String confirmationCode = confirmationService.generateConfirmationCode(savedNewUser);
        emailService.sendConfirmationEmail(
                savedNewUser.getEmail(),
                savedNewUser.getFirstName(),
                savedNewUser.getLastName(),
                confirmationCode
        );

        return new UserCreateResponseDto(
                savedNewUser.getId().toString(),
                savedNewUser.getEmail(),
                savedNewUser.getRole().name(),
                false
        );
    }


    private UserCreateResponseDto handleExistingUser(AppUser existingUser) {
        if (UNCONFIRMED.equals(existingUser.getConfirmationStatus())) {
            String confirmationCode = confirmationService.regenerateCode(existingUser);
            emailService.sendConfirmationEmail(
                    existingUser.getEmail(),
                    existingUser.getFirstName(),
                    existingUser.getLastName(),
                    confirmationCode
            );
            return new UserCreateResponseDto(
                    existingUser.getId().toString(),
                    existingUser.getEmail(),
                    existingUser.getRole().name(),
                    true);
        }
        throw new UserAlreadyExistException();
    }

    @Transactional
    public TokenResponseDto confirmRegistration(final String code) {
        final ConfirmationCode confirmationToken = confirmationService.getConfirmationIfValidOrThrow(code);

        final AppUser registeredUser = confirmationToken.getUser();
        registeredUser.setConfirmationStatus(CONFIRMED);
        userService.saveOrUpdate(registeredUser);

        confirmationService.removeToken(confirmationToken);

       String accessToken = jwtTokenService.generateAccessToken(registeredUser.getEmail());
       String refreshToken = jwtTokenService.generateRefreshToken(registeredUser.getEmail());
       return new TokenResponseDto(accessToken,refreshToken);
    }
}
