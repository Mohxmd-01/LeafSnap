package com.example.appledisease.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowCredentials(true);

                // ✅ Browser access
                config.addAllowedOrigin("http://localhost:5173");

                // ✅ Docker → Docker (NGINX → backend)
                config.addAllowedOrigin("http://apple-frontend");

                // (Optional but safe)
                config.addAllowedOrigin("http://127.0.0.1:5173");

                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                return config;
            }))

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/health",
                    "/api/auth/**",
                    "/api/predict",
                    "/api/predictions"
                ).permitAll()
                .anyRequest().authenticated()
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    // ✅ REQUIRED for auth (already correct)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
