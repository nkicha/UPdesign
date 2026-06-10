package com.ultrapub.controller;

import com.ultrapub.dto.CommandeRequest;
import com.ultrapub.dto.CommandeResponse;
import com.ultrapub.service.CommandeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping
    public ResponseEntity<List<CommandeResponse>> getAll() {
        return ResponseEntity.ok(commandeService.listCommandes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommande(id));
    }

    @PostMapping
    public ResponseEntity<CommandeResponse> create(@Valid @RequestBody CommandeRequest request) {
        return ResponseEntity.ok(commandeService.createCommande(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommandeResponse> update(@PathVariable Long id, @Valid @RequestBody CommandeRequest request) {
        return ResponseEntity.ok(commandeService.updateCommande(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commandeService.deleteCommande(id);
        return ResponseEntity.noContent().build();
    }
}
