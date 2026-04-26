package io.zoooohs.realworld;

import io.zoooohs.realworld.domain.user.entity.UserEntity;
import io.zoooohs.realworld.domain.user.repository.UserRepository;
import io.zoooohs.realworld.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting DataInitializer...");
        
        try {
            UserEntity user;
            var existingUser = userRepository.findByEmail("demo@example.com");
            
            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.info("Using existing user: demo, id: {}", user.getId());
            } else {
                user = UserEntity.builder()
                        .username("demo")
                        .email("demo@example.com")
                        .password(passwordEncoder.encode("password123"))
                        .bio("")
                        .image("")
                        .build();
                user = userRepository.save(user);
                log.info("Created new user: demo, id: {}", user.getId());
            }
            
            log.info("DataInitializer completed successfully");
            
        } catch (Exception e) {
            log.error("DataInitializer error: {}", e.getMessage(), e);
            e.printStackTrace();
        }
    }
}
