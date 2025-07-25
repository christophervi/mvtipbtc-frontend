import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { ThreatIntelligenceService, Alert } from '../../services/threat-intelligence.service';
import { AuthService } from '../../services/auth.service';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface QuickAction {
  title: string;
  icon: string;
  route: string;
  color: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  address?: string;
  riskLevel?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTableModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string = '';
  alerts: Alert[] = [];
  recentAlerts: Alert[] = [];
  
  statCards: StatCard[] = [
    { title: 'Monitored Addresses', value: 124, icon: 'account_balance_wallet', color: '#1976d2', change: '+12%', trend: 'up' },
    { title: 'Active Alerts', value: 8, icon: 'warning', color: '#f44336', change: '-3%', trend: 'down' },
    { title: 'Risk Score', value: '72/100', icon: 'security', color: '#ff9800', change: '+5%', trend: 'up' },
    { title: 'Generated Reports', value: 47, icon: 'description', color: '#4caf50', change: '+15%', trend: 'up' }
  ];

  quickActions: QuickAction[] = [
    { title: 'Trace Transaction', icon: 'search', route: '/dashboard', color: '#1976d2' },
    { title: 'View Alerts', icon: 'notifications', route: '/alerts', color: '#f44336' },
    { title: 'Generate Report', icon: 'description', route: '/reports', color: '#4caf50' },
    { title: 'Settings', icon: 'settings', route: '/settings', color: '#9c27b0' }
  ];

  recentActivities: RecentActivity[] = [
    { id: 1, type: 'Alert', description: 'Critical alert: Ransomware wallet connection detected', timestamp: '2 hours ago', riskLevel: 'Critical' },
    { id: 2, type: 'Analysis', description: 'Address 1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF analyzed', timestamp: '3 hours ago', address: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF', riskLevel: 'High' },
    { id: 3, type: 'Report', description: 'Transaction analysis report generated', timestamp: '1 day ago' },
    { id: 4, type: 'Alert', description: 'Unusual transaction pattern detected', timestamp: '2 days ago', riskLevel: 'Medium' },
    { id: 5, type: 'Analysis', description: 'Address 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 analyzed', timestamp: '3 days ago', address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', riskLevel: 'High' }
  ];

  riskDistribution = [
    { category: 'Money Laundering', percentage: 35 },
    { category: 'Ransomware', percentage: 25 },
    { category: 'Dark Markets', percentage: 20 },
    { category: 'Scams', percentage: 15 },
    { category: 'Other', percentage: 5 }
  ];

  constructor(
    private threatService: ThreatIntelligenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadAlerts();
  }

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.email;
    }
  }

  loadAlerts(): void {
    this.threatService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.recentAlerts = alerts.slice(0, 3);
        
        // Update active alerts stat card
        const activeAlertsCard = this.statCards.find(card => card.title === 'Active Alerts');
        if (activeAlertsCard) {
          activeAlertsCard.value = alerts.length;
        }
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getRiskColor(riskLevel: string | undefined): string {
    if (!riskLevel) return '#9E9E9E';
    
    switch (riskLevel.toLowerCase()) {
      case 'critical': return '#F44336';
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }

  getTrendIcon(trend: 'up' | 'down' | 'neutral' | undefined): string {
    if (!trend) return 'trending_flat';
    
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      case 'neutral': return 'trending_flat';
      default: return 'trending_flat';
    }
  }

  getTrendColor(trend: 'up' | 'down' | 'neutral' | undefined): string {
    if (!trend) return '#9E9E9E';
    
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#F44336';
      case 'neutral': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }

  analyzeAddress(address: string | undefined): void {
    if (!address) return;
    
    this.router.navigate(['/dashboard'], { queryParams: { address } });
  }

  viewAlert(alertId: number): void {
    this.router.navigate(['/alerts'], { queryParams: { id: alertId } });
  }
}

