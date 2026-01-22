package de.upteams.tasktracker.user.service.impl;


import de.upteams.tasktracker.user.dto.request.UserUpdateDto;
import de.upteams.tasktracker.user.dto.response.UserResponseDto;
import de.upteams.tasktracker.user.entity.AppUser;
import de.upteams.tasktracker.user.exception.EmailAlreadyUsedException;
import de.upteams.tasktracker.user.persistence.UserRepository;
import de.upteams.tasktracker.user.service.impl.UserServiceImpl;
import de.upteams.tasktracker.user.util.AppUserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    private UserRepository repository;
    private AppUserMapper mappingService;
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private UserServiceImpl service;

    @BeforeEach
    void setUp() {
        repository = mock(UserRepository.class);
        mappingService = mock(AppUserMapper.class);
        passwordEncoder = mock(org.springframework.security.crypto.password.PasswordEncoder.class);
        service = new UserServiceImpl(repository, mappingService, passwordEncoder);
    }

    @Test
    void updateUser_normalizesEmail_and_saves() {
        UUID id = UUID.randomUUID();
        AppUser user = new AppUser();
        user.setEmail("old@example.com"); // id не трогаем

        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(repository.existsByEmailIgnoreCaseAndIdNot("new@example.com", id)).thenReturn(false);
        when(mappingService.mapEntityToDto(any())).thenReturn(mock(UserResponseDto.class));

        var dto = new UserUpdateDto("NEW@Example.com", " Homer ", " Dev ", " Eng ", null, null);
        service.updateUser(id, dto);

        var captor = ArgumentCaptor.forClass(AppUser.class);
        verify(repository).save(captor.capture());
        AppUser saved = captor.getValue();

        assertEquals("new@example.com", saved.getEmail());
        assertEquals("Homer", saved.getDisplayName());
        assertEquals("Dev", saved.getPosition());
        assertEquals("Eng", saved.getDepartment());
    }


    @Test
    void updateUser_throws_when_email_taken() {
        UUID id = UUID.randomUUID();
        AppUser user = new AppUser();
        user.setEmail("old@example.com"); // id не трогаем

        when(repository.findById(id)).thenReturn(Optional.of(user));
        when(repository.existsByEmailIgnoreCaseAndIdNot(eq("new@example.com"), any()))
                .thenReturn(true);

        var dto = new UserUpdateDto("new@example.com", "Homer", "Dev", "Eng", null, null);

        assertThrows(EmailAlreadyUsedException.class, () -> service.updateUser(id, dto));
        verify(repository, never()).save(any());
    }
}
