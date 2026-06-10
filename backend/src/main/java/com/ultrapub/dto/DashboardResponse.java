package com.ultrapub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private long totalClients;
    private long totalDevis;
    private long totalCommandes;
    private double monthlyRevenue;
}
