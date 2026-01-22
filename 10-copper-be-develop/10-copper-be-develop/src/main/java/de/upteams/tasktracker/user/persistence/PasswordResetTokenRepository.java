package de.upteams.tasktracker.user.persistence;

import de.upteams.tasktracker.user.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    //Найти токен по его строковому значению
    Optional<PasswordResetToken> findByToken(String token);

    //Удалить все токены пользователя (по UUID)
    void deleteByUserId(UUID userId);

    //Проверить, есть ли токен у пользователя
    Optional<PasswordResetToken> findByUserId(UUID userId);
}
