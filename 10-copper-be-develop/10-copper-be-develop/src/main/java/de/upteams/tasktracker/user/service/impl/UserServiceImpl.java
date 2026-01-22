package de.upteams.tasktracker.user.service.impl;

import de.upteams.tasktracker.user.dto.ChangePasswordRequestDto;
import java.util.Locale;
import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import de.upteams.tasktracker.user.entity.AppUser;
import de.upteams.tasktracker.user.exception.EmailAlreadyUsedException;
import de.upteams.tasktracker.user.exception.UserNotFoundException;
import de.upteams.tasktracker.user.persistence.UserRepository;
import de.upteams.tasktracker.user.service.UserService;
import de.upteams.tasktracker.user.util.AppUserMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for various operations with Employees
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final AppUserMapper mappingService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser saveOrUpdate(final AppUser user) {
        return repository.save(user);
    }

    @Override
    @Transactional
    public Optional<AppUser> getByEmail(String email) {
        return repository.findByEmailIgnoreCase(email);
    }

    @Override
    @Transactional
    public AppUser getByEmailOrThrow(String email) {
        return getByEmail(email)
                .orElseThrow(UserNotFoundException::new);
    }

    @Override
    @Transactional
    public AppUser getByIdOrThrow(String id) {
        return repository
                .findById(UUID.fromString(id))
                .orElseThrow(UserNotFoundException::new);
    }

    @Override
    public List<UserResponseDto> getAll() {
        return repository
                .findAll()
                .stream()
                .map(mappingService::mapEntityToDto)
                .toList();
    }

    @Override
    @Transactional
    public AppUser updateUser(UserUpdateDto userUpdateDto) {
        String currentUserEmail = getCurrentUserEmail();
        return updateProfile(currentUserEmail, userUpdateDto);
    }

    @Override
    @Transactional
    public AppUser updateUserByEmail(String email, UserUpdateDto dto) {
        return updateProfile(email, dto);
    }

    private void applyProfileUpdates(AppUser user, UserUpdateDto dto) {

        if (dto.email() != null && !dto.email().isBlank()) {
            String normalized = dto.email().trim().toLowerCase(Locale.ROOT);
            if (!normalized.equalsIgnoreCase(user.getEmail())
                    && repository.existsByEmailIgnoreCaseAndIdNot(normalized, user.getId())) {
                throw new EmailAlreadyUsedException("Unable to update profile"); // нейтрально
            }
            user.setEmail(normalized);
        }

        if (dto.displayName() != null) user.setDisplayName(dto.displayName().trim());
        if (dto.position() != null)     user.setPosition(dto.position().trim());
        if (dto.department() != null)   user.setDepartment(dto.department().trim());
        if (dto.avatarUrl() != null)    user.setAvatarUrl(dto.avatarUrl().trim());
        if (dto.bio() != null)          user.setBio(dto.bio().trim());
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(UUID userId, UserUpdateDto dto) {
        AppUser user = repository.findById(userId).orElseThrow(UserNotFoundException::new);
        applyProfileUpdates(user, dto);
        repository.save(user);
        return mappingService.mapEntityToDto(user);
    }

    @Transactional
    public AppUser updateProfile(String userId, UserUpdateDto updateDto) {
        AppUser user = getByEmailOrThrow(userId);
        applyProfileUpdates(user, updateDto);
        return repository.save(user);
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new UserNotFoundException("Current user not found in context");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            // напрямую через UserRepository
            AppUser user = repository.findByEmailIgnoreCase(userDetails.getUsername())
                    .orElseThrow(() -> new UserNotFoundException("Current user not found in DB"));
            return user.getId().toString();
        }

        throw new UserNotFoundException("Current user not found in context");
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new UserNotFoundException("Current user not found in context");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername(); // ожидаем email
        }

        // Если JwtAuthenticationToken и username лежит в getName()
        String name = auth.getName();
        if (name != null && !name.isBlank()) {
            return name;
        }

        throw new UserNotFoundException("Current user not found in context");
    }
    @Override
    @Transactional
    public void changePassword(ChangePasswordRequestDto request) {
        // 1) Валидация совпадения нового пароля и подтверждения
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }
        // 2) Достаём текущего пользователя по email (как мы уже починили ранее)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank()) {
            throw new UserNotFoundException();
        }
        String email = auth.getName();

        AppUser user = repository.findByEmailIgnoreCase(email)
                .orElseThrow(UserNotFoundException::new);


        // 3) Проверяем текущий пароль
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        validatePasswordPolicy(request.newPassword());


        user.setPassword(passwordEncoder.encode(request.newPassword()));
        repository.save(user);


    }
    private void validatePasswordPolicy(String raw) {
        if (raw.toLowerCase().contains("password")) {
            throw new IllegalArgumentException("Password is too weak");
        }
    }
}

