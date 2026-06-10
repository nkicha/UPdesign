package com.ultrapub.service;

import com.ultrapub.dto.DashboardResponse;
import com.ultrapub.repository.ClientRepository;
import com.ultrapub.repository.CommandeRepository;
import com.ultrapub.repository.DevisRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final DevisRepository devisRepository;
    private final CommandeRepository commandeRepository;

    public DashboardService(ClientRepository clientRepository,
                            DevisRepository devisRepository,
                            CommandeRepository commandeRepository) {
        this.clientRepository = clientRepository;
        this.devisRepository = devisRepository;
        this.commandeRepository = commandeRepository;
    }

    public DashboardResponse getStatistics() {
        long clientCount = clientRepository.count();
        long devisCount = devisRepository.count();
        long commandeCount = commandeRepository.count();
        Double monthlyRevenue = commandeRepository.sumMonthlyRevenue();
        return new DashboardResponse(clientCount, devisCount, commandeCount, monthlyRevenue != null ? monthlyRevenue : 0.0);
    }
}
