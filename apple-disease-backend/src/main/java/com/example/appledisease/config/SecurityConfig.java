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

                // ✅ Local development
                config.addAllowedOrigin("http://localhost:5173");
                config.addAllowedOrigin("http://127.0.0.1:5173");
                config.addAllowedOrigin("http://localhost:8080");
                config.addAllowedOrigin("http://localhost");

                // ✅ Docker → Docker (NGINX → backend)
                config.addAllowedOrigin("http://apple-frontend");

                // ✅ Render deployment - Frontend
                config.addAllowedOrigin("https://leaf-snap-kohl.vercel.app");
                config.addAllowedOriginPattern("https://.*\\.vercel\\.app");

                // ✅ Render deployment - Backend (for direct access)
                config.addAllowedOrigin("https://leafsnap-backend.onrender.com");
                config.addAllowedOriginPattern("https://.*\\.onrender\\.com");

                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                 config.addExposedHeader("Authorization");  // 🔥 ADD THIS
                return config;
            }))

            .authorizeHttpRequests(auth -> auth
    .requestMatchers(
        "/",
        "/health",
        "/error",
        "/api/auth/**",
        "/api/predict",
        "/api/predictions"
    ).permitAll()
    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
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
