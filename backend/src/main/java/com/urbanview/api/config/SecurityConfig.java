package com.urbanview.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configuración de CORS basada en nuestro CorsConfig
            .cors(Customizer.withDefaults())
            
            // 2. Deshabilitar CSRF para endpoints stateless REST API de visualización
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. Establecer la política de sesión como STATELESS
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Configurar headers de seguridad conforme a mejores prácticas OWASP
            .headers(headers -> headers
                // HTTP Strict Transport Security (HSTS)
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000) // 1 año
                )
                // Prevención de Clickjacking (SAMEORIGIN para permitir renderizado local controlado)
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                // Prevención de MIME Sniffing
                .contentTypeOptions(Customizer.withDefaults())
                // Protección contra Cross-Site Scripting (XSS)
                .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
            )
            
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/plano", "/api/plano/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
