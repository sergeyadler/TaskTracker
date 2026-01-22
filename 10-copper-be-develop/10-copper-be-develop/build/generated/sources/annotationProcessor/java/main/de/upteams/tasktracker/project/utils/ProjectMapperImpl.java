package de.upteams.tasktracker.project.utils;

import de.upteams.tasktracker.project.dto.request.ProjectCreateDto;
import de.upteams.tasktracker.project.dto.response.ProjectResponseDto;
import de.upteams.tasktracker.project.entity.Project;
import de.upteams.tasktracker.user.dto.EmployeeDto;
import de.upteams.tasktracker.user.dto.RoleDto;
import de.upteams.tasktracker.user.entity.AppUser;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-23T19:44:02+0100",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.13.jar, environment: Java 17.0.16 (Microsoft)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public ProjectResponseDto mapEntityToDto(Project entity) {
        if ( entity == null ) {
            return null;
        }

        String id = null;
        EmployeeDto owner = null;
        String title = null;
        String description = null;

        if ( entity.getId() != null ) {
            id = entity.getId().toString();
        }
        owner = appUserToEmployeeDto( entity.getOwner() );
        title = entity.getTitle();
        description = entity.getDescription();

        ProjectResponseDto projectResponseDto = new ProjectResponseDto( id, title, description, owner );

        return projectResponseDto;
    }

    @Override
    public Project mapDtoToEntity(ProjectCreateDto dto) {
        if ( dto == null ) {
            return null;
        }

        Project project = new Project();

        project.setTitle( dto.title() );
        project.setDescription( dto.description() );

        return project;
    }

    protected EmployeeDto appUserToEmployeeDto(AppUser appUser) {
        if ( appUser == null ) {
            return null;
        }

        String id = null;
        String password = null;
        String email = null;
        String position = null;
        String department = null;
        String bio = null;

        if ( appUser.getId() != null ) {
            id = appUser.getId().toString();
        }
        password = appUser.getPassword();
        email = appUser.getEmail();
        position = appUser.getPosition();
        department = appUser.getDepartment();
        bio = appUser.getBio();

        String name = null;
        String avatar = null;
        RoleDto roles = null;

        EmployeeDto employeeDto = new EmployeeDto( id, name, password, email, position, department, avatar, bio, roles );

        return employeeDto;
    }
}
