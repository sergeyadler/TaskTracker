package de.upteams.tasktracker.user.controller.interfaces;

import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.ChangePasswordRequestDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST mappings for user operations.
 * Implementation classes should implement this interface.
 */
@RequestMapping("/api/v1/users")
public interface UserApi extends UserApiSwaggerDoc {
    @PutMapping("/{id}")
    UserResponseDto update(@PathVariable UUID id, @Valid @RequestBody UserUpdateDto dto);

    @PutMapping("/me")
    UserResponseDto updateMe(@Valid @RequestBody UserUpdateDto dto);

    @Override
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    List<UserResponseDto> getAll();

    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDto request);

    /**
     * Returns current user
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    UserResponseDto getCurrentUser(Authentication authentication);


    /**
     * Returns user by email
     */
    @GetMapping("/{email}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    UserResponseDto getByEmail(@PathVariable String email);


    /**
     * Update current user profile
     */
    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    UserResponseDto updateUser(@RequestBody UserUpdateDto dto);


    /**
     * ONLY FOR ADMIN
     * Update user profile by ID
     */
    @PutMapping("/update/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    UserResponseDto updateUserByEmail(@PathVariable String email, @RequestBody UserUpdateDto dto);

}
