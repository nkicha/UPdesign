package com.ultrapub.config;

import com.ultrapub.entity.*;
import com.ultrapub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository, 
            ClientRepository clientRepository,
            DevisRepository devisRepository,
            CommandeRepository commandeRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin user if it does not exist, or synchronize its password
            String adminUsername = "admin";
            User admin = userRepository.findByUsername(adminUsername).orElse(null);
            if (admin == null) {
                admin = User.builder()
                        .username(adminUsername)
                        .password(passwordEncoder.encode("Admin123!"))
                        .role("ROLE_ADMIN")
                        .build();
                userRepository.save(admin);
                System.out.println("[DataInitializer] Default admin user created (admin / Admin123!).");
            } else {
                admin.setPassword(passwordEncoder.encode("Admin123!"));
                userRepository.save(admin);
                System.out.println("[DataInitializer] Admin user password synchronized/reset to Admin123!.");
            }

            // Seed sample Clients, Devis, and Commandes if no clients exist
            if (clientRepository.count() == 0) {
                Client c1 = Client.builder()
                        .nom("Jean Dupont")
                        .telephone("0612345678")
                        .email("jean.dupont@gmail.com")
                        .adresse("10 Rue de la Paix, 75002 Paris")
                        .societe("Dupont & Co")
                        .build();

                Client c2 = Client.builder()
                        .nom("Sarah Amrani")
                        .telephone("0522345678")
                        .email("s.amrani@outlook.com")
                        .adresse("20 Boulevard d'Anfa, Casablanca")
                        .societe("Amrani Digital")
                        .build();

                Client c3 = Client.builder()
                        .nom("Mohamed El Fassi")
                        .telephone("0661987654")
                        .email("mohamed.elfassi@gmail.com")
                        .adresse("15 Avenue des FAR, Rabat")
                        .societe("Maroc Neon Solutions")
                        .build();

                clientRepository.save(c1);
                clientRepository.save(c2);
                clientRepository.save(c3);

                // Seed Quotes (Devis)
                Devis d1 = Devis.builder()
                        .client(c1)
                        .typePanneau("Néon LED")
                        .dimensions("120x40 cm")
                        .matiere("Acrylique & Silicone")
                        .prix(4500.0) // 4500 DH
                        .description("Enseigne lumineuse logo 'Dupont & Co' couleur rouge neon.")
                        .statut(DevisStatus.VALIDE)
                        .build();

                Devis d2 = Devis.builder()
                        .client(c2)
                        .typePanneau("Lettres 3D Relief")
                        .dimensions("300x80 cm")
                        .matiere("Inox poli miroir rétroéclairé")
                        .prix(12000.0) // 12000 DH
                        .description("Enseigne extérieure en lettres boîtiers inox poli avec effet halo lumineux blanc chaud.")
                        .statut(DevisStatus.EN_COURS)
                        .build();

                Devis d3 = Devis.builder()
                        .client(c3)
                        .typePanneau("Caisson Lumineux")
                        .dimensions("150x150 cm")
                        .matiere("Profilé alu, bâche tendue diffusante")
                        .prix(6800.0) // 6800 DH
                        .description("Caisson lumineux double face pour signalétique extérieure.")
                        .statut(DevisStatus.EN_ATTENTE)
                        .build();

                devisRepository.save(d1);
                devisRepository.save(d2);
                devisRepository.save(d3);

                // Seed Orders (Commandes)
                Commande cmd1 = Commande.builder()
                        .client(c1)
                        .typePanneau("Néon LED")
                        .dimensions("120x40 cm")
                        .matiere("Acrylique & Silicone")
                        .prix(4500.0)
                        .statut(CommandeStatus.EN_COURS)
                        .devisId(d1.getId())
                        .build();

                Commande cmd2 = Commande.builder()
                        .client(c3)
                        .typePanneau("Caisson Lumineux")
                        .dimensions("150x150 cm")
                        .matiere("Profilé alu, bâche tendue diffusante")
                        .prix(6800.0)
                        .statut(CommandeStatus.EN_ATTENTE)
                        .devisId(d3.getId())
                        .build();

                commandeRepository.save(cmd1);
                commandeRepository.save(cmd2);

                System.out.println("[DataInitializer] Sample clients, quotes (devis), and orders (commandes) seeded successfully.");
            }
        };
    }
}
