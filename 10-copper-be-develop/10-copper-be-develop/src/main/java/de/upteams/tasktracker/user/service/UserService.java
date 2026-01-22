package de.upteams.tasktracker.user.service;

import de.upteams.tasktracker.user.dto.ChangePasswordRequestDto;
import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import de.upteams.tasktracker.user.entity.AppUser;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for various operations with Employees
 */
public interface UserService {

    AppUser saveOrUpdate(AppUser user);

    Optional<AppUser> getByEmail(String email);

    AppUser getByEmailOrThrow(String email);

    AppUser getByIdOrThrow(String id);

    List<UserResponseDto> getAll();

    void changePassword(ChangePasswordRequestDto request);

    AppUser updateUser(UserUpdateDto userUpdateDto);

    AppUser updateUserByEmail(String email, UserUpdateDto dto);
    UserResponseDto updateUser(UUID userId, UserUpdateDto dto);
}
