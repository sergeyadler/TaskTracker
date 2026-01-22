package de.upteams.tasktracker.user.service.impl;

import de.upteams.tasktracker.mail.EmailService;
import de.upteams.tasktracker.user.entity.AppUser;
import de.upteams.tasktracker.user.entity.PasswordResetToken;
import de.upteams.tasktracker.user.persistence.PasswordResetTokenRepository;
import de.upteams.tasktracker.user.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final int EXPIRATION_MINUTES = 60; // токен действует 1 час

    // Создание токена и отправка письма
    public void createPasswordResetToken(String email) {
        Optional<AppUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Не раскрываем информацию о существовании пользователя
            return;
        }

        AppUser user = userOpt.get();

        // Удаляем старый токен, если есть
        tokenRepository.deleteByUserId(user.getId());

        // Генерация нового токена
        String token = UUID.randomUUID().toString();
        PasswordResetToken prt = new PasswordResetToken(
                user,
                token,
                LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES)
        );
        tokenRepository.save(prt);

        // Отправка письма с фронтенд ссылкой
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    // Проверка токена и сброс пароля
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;

        PasswordResetToken prt = tokenOpt.get();

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(prt);
            return false; // токен истёк
        }

        AppUser user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(prt); // удаляем токен после использования
        return true;
    }
}
