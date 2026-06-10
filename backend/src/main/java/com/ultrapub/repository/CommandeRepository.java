package com.ultrapub.repository;

import com.ultrapub.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    @Query("SELECT COALESCE(SUM(c.prix), 0) FROM Commande c WHERE MONTH(c.dateCreation) = MONTH(CURRENT_DATE) AND YEAR(c.dateCreation) = YEAR(CURRENT_DATE)")
    Double sumMonthlyRevenue();

    boolean existsByDevisId(Long devisId);
}
