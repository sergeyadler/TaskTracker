package de.upteams.tasktracker.user.controller.impl;

import de.upteams.tasktracker.user.controller.interfaces.UserApi;
import de.upteams.tasktracker.user.dto.ChangePasswordRequestDto;
import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import de.upteams.tasktracker.user.entity.AppUser;
import de.upteams.tasktracker.user.service.UserService;
import de.upteams.tasktracker.user.util.AppUserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller that receives http-requests for various operations with Employees
 */
@RestController
@RequiredArgsConstructor
public class UserControllerImpl implements UserApi {

    /**
     * Service for various operations with Employees
     */
    private final UserService service;
    private final AppUserMapper mappingService;

    @Override
    public UserResponseDto update(UUID id, @Valid UserUpdateDto dto) {
        return service.updateUser(id, dto);
    }

    @Override
    public UserResponseDto updateMe(@Valid UserUpdateDto dto) {
        AppUser updated = service.updateUser(dto);
        return mappingService.mapEntityToDto(updated);
    }

    @Override
    public List<UserResponseDto> getAll() {
        return service.getAll();
    }

    @Override
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDto request) {
        service.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    @Override
    public UserResponseDto getCurrentUser(Authentication authentication) {
        AppUser user= service.getByEmailOrThrow(authentication.getName());
        return mapToDto(user);
    }

    @Override
    public UserResponseDto getByEmail(String email) {
        return mapToDto(service.getByEmailOrThrow(email));
    }


    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public UserResponseDto updateUser(@RequestBody UserUpdateDto userUpdateDto) {
        AppUser updatedUser = service.updateUser(userUpdateDto);
        return mapToDto(updatedUser);
    }

    @Override
    public UserResponseDto updateUserByEmail(String email, UserUpdateDto dto) {
        AppUser updatedUser = service.updateUserByEmail(email, dto);
        return mapToDto(updatedUser);
    }


    private UserResponseDto mapToDto(AppUser user) {
        return new UserResponseDto(
                user.getEmail(),
                user.getRole().name(),
                user.getConfirmationStatus(),
                user.getDisplayName(),
                user.getPosition(),
                user.getDepartment(),
                user.getAvatarUrl(),
                user.getBio()
        );
    }
}
