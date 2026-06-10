package com.ultrapub.repository;

import com.ultrapub.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNomContainingIgnoreCase(String nom);
    List<Client> findByEmailContainingIgnoreCase(String email);
    Optional<Client> findByEmailIgnoreCase(String email);
}
