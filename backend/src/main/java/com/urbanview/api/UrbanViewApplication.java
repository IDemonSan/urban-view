package com.urbanview.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
public class UrbanViewApplication {

    static {
        // Carga dinámica de secretos de Docker para evitar credenciales en texto plano
        String userSecretPath = "/run/secrets/db_user";
        String passwordSecretPath = "/run/secrets/db_password";
        try {
            if (Files.exists(Paths.get(userSecretPath))) {
                String user = Files.readString(Paths.get(userSecretPath)).trim();
                System.setProperty("spring.datasource.username", user);
                System.out.println("[INFO] Cargando usuario desde secreto de Docker.");
            }
            if (Files.exists(Paths.get(passwordSecretPath))) {
                String password = Files.readString(Paths.get(passwordSecretPath)).trim();
                System.setProperty("spring.datasource.password", password);
                System.out.println("[INFO] Cargando contraseña desde secreto de Docker.");
            }
        } catch (IOException e) {
            System.err.println("[ERROR] Error al inicializar secretos de Docker: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(UrbanViewApplication.class, args);
    }
}
