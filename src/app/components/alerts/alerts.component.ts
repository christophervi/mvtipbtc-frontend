import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ThreatIntelligenceService } from '../../services/threat-intelligence.service';
import { MatSelectModule } from '@angular/material/select';

export interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  riskLevel: string;
  timestamp: Date;
  status: string;
  address?: string;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css', './color-fixes.css']
})
export class AlertsComponent implements OnInit {
  displayedColumns: string[] = ['type', 'title', 'riskLevel', 'timestamp', 'status', 'actions'];
  dataSource = new MatTableDataSource<Alert>();

  // Filter properties
  selectedAlertType = 'All';
  selectedRiskLevel = 'All';
  selectedStatus = 'All';
  filterValue = '';

  // Options for the filter dropdowns
  alertTypes: string[] = ['All', 'Critical Alert', 'High Risk Alert', 'Medium Risk Alert'];
  riskLevels = ['All', 'Critical', 'High', 'Medium', 'Low'];
  statuses = ['All', 'Active', 'Resolved', 'Dismissed']; //['All', 'new', 'updated', 'resolved', 'dismissed'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private threatService: ThreatIntelligenceService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.threatService.getAlerts().subscribe({
      next: (alerts) => {
        // Correctly map alerts and derive distinct types
        this.dataSource.data = alerts.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
          status: this.getAlertStatus(new Date(alert.timestamp))
        }));
        
        this.alertTypes = ['All', ...new Set(alerts.map(a => a.type))];
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // **This is the core of the filtering logic**
        this.dataSource.filterPredicate = this.createFilter();
        this.applyFilters(); // Apply default filters on load
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
  }

  // Applies all active filters to the table
  applyFilters() {
    const filterData = {
      risk: this.selectedRiskLevel,
      type: this.selectedAlertType,
      status: this.selectedStatus,
      text: this.filterValue
    };
    this.dataSource.filter = JSON.stringify(filterData);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Creates the custom filter function
  private createFilter(): (data: Alert, filter: string) => boolean {
    const filterFunction = (data: Alert, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      
      const textMatch = (data.address?.toLowerCase() || '').includes(searchTerms.text.toLowerCase());
      const riskMatch = searchTerms.risk === 'All' || data.riskLevel === searchTerms.risk;
      const typeMatch = searchTerms.type === 'All' || data.type === searchTerms.type;
      const statusMatch = searchTerms.status === 'All' || data.status === searchTerms.status;

      return textMatch && riskMatch && typeMatch && statusMatch;
    };
    return filterFunction;
  }

  filterByAlertType() {
    console.log('Filtering by alert type:', this.selectedAlertType);
  }

  getAlertTypeIcon(type: string): string {
    if (type.toLowerCase().includes('critical')) return 'error';
    if (type.toLowerCase().includes('high')) return 'warning';
    return 'info';
  }

  getStatusColor(status: string): string {
    if (status === 'Resolved') return 'primary';
    if (status === 'Active') return 'accent';
    return 'warn';
  }
  
  
  viewAlertDetails(alert: Alert) {
    console.log('Viewing details for alert:', alert);
  }
  
  markAsResolved(alert: Alert) {
    alert.status = 'Resolved';
  }
  

  getCriticalAlertsCount(): number {
      return this.dataSource.data.filter(a => a.riskLevel === 'Critical').length;
  }

  getHighAlertsCount(): number {
      return this.dataSource.data.filter(a => a.riskLevel === 'High').length;
  }

  getMediumAlertsCount(): number {
      return this.dataSource.data.filter(a => a.riskLevel === 'Medium').length;
  }

  getActiveAlertsCount(): number {
      return this.dataSource.data.filter(a => a.status === 'Active').length;
  }

  /*loadAlerts() {
    this.threatService.getAlerts().subscribe({
      next: (alerts) => {
        this.dataSource.data = alerts.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
          status: this.getAlertStatus(new Date(alert.timestamp))
        }));
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
  }*/

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  filterByRiskLevel() {
    console.log('Filtering by risk level:', this.selectedRiskLevel);
  }

  filterByStatus() {
    console.log('Filtering by status:', this.selectedStatus);
  }

  viewAlert(alert: Alert) {
    console.log('Viewing alert:', alert);
  }

  resolveAlert(alert: Alert) {
    console.log('Resolving alert:', alert);
  }

  dismissAlert(alert: Alert) {
    console.log('Dismissing alert:', alert);
  }

  analyzeAddress(address: string) {
    if (address) {
      console.log('Analyzing address:', address);
    }
  }

  markAllAsRead() {
    console.log('Marking all alerts as read');
  }

  exportAlerts() {
    console.log('Exporting alerts');
  }

  refreshAlerts() {
    this.loadAlerts();
  }

  getAlertStatus(timestamp: Date): string {
    const now = new Date();
    const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'New';
    } else if (diffHours < 24) {
      return 'Recent';
    } else {
      return 'Old';
    }
  }

  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#ffeb3b';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }
}

