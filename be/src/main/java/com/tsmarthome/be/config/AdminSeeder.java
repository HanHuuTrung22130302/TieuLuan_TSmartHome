package com.tsmarthome.be.config;

import com.tsmarthome.be.entity.User;
import com.tsmarthome.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("testadmin@tsmarthome.com")) {
            User user = User.builder()
                    .firstName("Test")
                    .lastName("Admin")
                    .email("testadmin@tsmarthome.com")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .systemRole("ADMIN")
                    .isVerified(true)
                    .isLocked(false)
                    .build();
            userRepository.save(user);
            System.out.println("====== TEST ADMIN ACCOUNT SEEDED: testadmin@tsmarthome.com / Admin@123456 ======");
        }
    }
}
