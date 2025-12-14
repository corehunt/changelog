package com.changelog.tickets.controller;

import com.changelog.tickets.dto.DashboardHomeResponse;
import com.changelog.tickets.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/home")
    public DashboardHomeResponse getHome() {
        return dashboardService.getHomePage();
    }
}