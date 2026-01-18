package com.example.appledisease.controller;

import com.example.appledisease.entity.User;
import com.example.appledisease.entity.UserLogin;
import com.example.appledisease.repository.UserLoginRepository;
import com.example.appledisease.repository.UserRepository;
import com.example.appledisease.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://apple-frontend"
})
public class AuthController {

    private final UserRepository userRepository;
    private final UserLoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            UserLoginRepository loginRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "Signup successful")
        );
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        User user = userRepository.findByEmail(request.get("email"))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.get("password"), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // save login history
        loginRepository.save(new UserLogin(user.getId()));

        // generate JWT
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", Map.of(
                                "id", user.getId(),
                                "email", user.getEmail(),
                                "name", user.getName()
                        )
                )
        );
    }

    // ✅ FORGOT PASSWORD (placeholder)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(
                Map.of("message", "If email exists, reset link sent")
        );
    }
}
