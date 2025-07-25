import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ThreatIntelligenceService, TransactionAnalysis, Alert, TransactionFlow } from '../../services/threat-intelligence.service';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, ChartData, ChartOptions, ChartType, Legend, LinearScale, LineController, LineElement, PieController, PointElement, Title, Tooltip } from 'chart.js';
import cytoscape from 'cytoscape';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  searchAddress = '';
  isAnalyzing = false;
  currentAnalysis: TransactionAnalysis | null = null;
  alerts: Alert[] = [];
  recentTransactions = [
    {
      hash: '1A2b3C...7x8Y9z',
      type: 'Input',
      amount: 5.24,
      riskLevel: 'High',
      timestamp: '2 hours ago'
    },
    {
      hash: '3D4e5F...8y9Z0a',
      type: 'Input',
      amount: 3.21,
      riskLevel: 'Medium',
      timestamp: '5 hours ago'
    },
    {
      hash: '5G6h7I...0a1B2c',
      type: 'Output',
      amount: 7.89,
      riskLevel: 'Low',
      timestamp: 'Yesterday'
    },
    {
      hash: '7J8k9L...2c3D4e',
      type: 'Output',
      amount: 0.56,
      riskLevel: 'Critical',
      timestamp: 'Yesterday'
    }
  ];
  
  relatedTransactions: any[] = [];
  totalRelatedTransactions: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  displayedColumns: string[] = ['address', 'type', 'amount', 'riskLevel', 'actions'];

  public bitcoinAddress: string = '';
  private cy: any;

  // ng2-charts Properties
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };
  public barChartType: 'bar' = 'bar';
  
  // Pie chart properties
  public pieChartType: 'pie' = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: ['Money Laundering', 'Ransomware', 'Dark Markets', 'Scams', 'Fraud'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#F44336', '#FF5722', '#673AB7', '#3F51B5', '#2196F3'],
      hoverBackgroundColor: ['#D32F2F', '#E64A19', '#5E35B1', '#303F9F', '#1976D2']
    }]
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#FFFFFF',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  constructor(private threatService: ThreatIntelligenceService, private zone: NgZone) {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      CategoryScale,
      BarController,
      BarElement,
      ArcElement,
      PieController
    );
  }

  ngOnInit() {
    this.loadAlerts();
    this.updateChart();
  }

  updateChart(): void {
    this.threatService.getMempoolStats().subscribe({
      next: (stats: any) => {
        this.zone.run(() => {
          this.barChartData = {
            labels: stats.labels,
            datasets: stats.data
          };
        });
      },
      error: (err) => console.error('Error fetching block stats', err)
    });
  }
  
  traceTransaction(): void {
    if (!this.searchAddress.trim()) {
      return;
    }

    this.isAnalyzing = true;
    this.currentAnalysis = null;

    this.threatService.analyzeTransaction(this.searchAddress).subscribe({
      next: (analysis) => {
        this.currentAnalysis = analysis;
        this.isAnalyzing = false;

        this.fetchAndRenderGraph(this.searchAddress);
      },
      error: (error) => {
        console.error('Error analyzing transaction:', error);
        this.currentAnalysis = {
          address: this.searchAddress,
          riskScore: 78,
          riskLevel: 'High',
          transactionVolume: 12.45,
          networkConfirmations: 342,
          firstSeen: '2023-05-14 14:32:18 UTC',
          totalReceived: 5.24891,
          totalSent: 5.24891,
          currentBalance: 0.00000,
          numberOfTransactions: 42,
          analysis: 'This address has been associated with multiple high-risk activities including potential money laundering and connections to dark web marketplaces.',
          mixingProbability: 78,
          illicitFundSources: 64,
          darkMarketConnections: 92
        };
        this.isAnalyzing = false;
      }
    });
  }

  fetchAndRenderGraph(address: string): void {
    console.log('Fetching transaction flow for address:', address);
    // Check if the Cytoscape instance needs to be created
    if (!this.cy) {
      const container = document.getElementById('cy');
      if (container) {
        // Initialize it
        this.cy = cytoscape({
          container: container,
          style: [
            {
              selector: 'node',
              style: {
                'background-color': '#0d6efd',
                'label': 'data(id)',
                'color': '#fff',
                'text-outline-color': '#0d6efd',
                'text-outline-width': 2
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': '#6c757d',
                'target-arrow-color': '#6c757d',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
              }
            }
          ]
        });
      } else {
        // If the container isn't ready, wait a moment and try again.
        setTimeout(() => this.fetchAndRenderGraph(address), 100);
        return;
      }
    }

    // Now, proceed with fetching data and rendering
    this.threatService.getTransactionFlow(address).subscribe({
      next: (data: TransactionFlow) => {
        const elements = [
          ...data.nodes.map(node => ({ group: 'nodes', data: node })),
          ...data.edges.map(edge => ({ group: 'edges', data: edge }))
        ];

        this.cy.elements().remove();
        this.cy.add(elements);

        this.cy.layout({
          name: 'cose',
          animate: true,
          padding: 50,
          nodeRepulsion: () => 400000,
          idealEdgeLength: () => 100,
        }).run();
        
        // Populate related transactions from the flow data
        this.populateRelatedTransactions(data);
      },
      error: (error) => {
        console.error('Error fetching transaction flow:', error);
      }
    });
  }
  
  populateRelatedTransactions(flowData: TransactionFlow): void {
    // Extract related addresses from nodes
    const relatedAddresses = flowData.nodes
      .filter(node => node.id !== this.searchAddress) // Exclude the main address
      .map(node => ({
        id: node.id,
        type: node.label.includes('Input') ? 'Input' : 'Output',
        riskLevel: this.getRandomRiskLevel()
      }));
      
    // Create transaction history from the related addresses
    this.relatedTransactions = relatedAddresses;
    this.totalRelatedTransactions = relatedAddresses.length;
    
    console.log('Related transactions:', this.relatedTransactions);
  }
  
  getRandomRiskLevel(): string {
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    return levels[Math.floor(Math.random() * levels.length)];
  }
  
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalRelatedTransactions) {
      this.currentPage++;
    }
  }

  loadAlerts() {
    this.threatService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.alerts = [
          {
            id: 1,
            type: 'Critical Alert',
            title: 'Address connected to known ransomware wallet',
            description: 'High-risk transaction detected',
            riskLevel: 'Critical',
            timestamp: '2 hours ago',
            address: '1A2b3C...7x8Y9z'
          },
          {
            id: 2,
            type: 'High Risk Alert',
            title: 'Unusual transaction pattern detected',
            description: 'Multiple small transactions from high-risk addresses',
            riskLevel: 'High',
            timestamp: '5 hours ago'
          },
          {
            id: 3,
            type: 'Medium Risk Alert',
            title: 'Connection to previously flagged address',
            description: 'Transaction linked to monitored wallet',
            riskLevel: 'Medium',
            timestamp: 'Yesterday'
          }
        ];
      }
    });
  }

  /*traceTransaction() {
    if (!this.searchAddress.trim()) return;

    this.isAnalyzing = true;
    this.threatService.analyzeTransaction(this.searchAddress).subscribe({
      next: (analysis) => {
        this.currentAnalysis = analysis;
        this.isAnalyzing = false;
      },
      error: (error) => {
        console.error('Error analyzing transaction:', error);
        this.currentAnalysis = {
          address: this.searchAddress,
          riskScore: 78,
          riskLevel: 'High',
          transactionVolume: 12.45,
          networkConfirmations: 342,
          firstSeen: '2023-05-14 14:32:18 UTC',
          totalReceived: 5.24891,
          totalSent: 5.24891,
          currentBalance: 0.00000,
          numberOfTransactions: 42,
          analysis: 'This address has been associated with multiple high-risk activities including potential money laundering and connections to dark web marketplaces.',
          mixingProbability: 78,
          illicitFundSources: 64,
          darkMarketConnections: 92
        };
        this.isAnalyzing = false;
      }
    });
  }*/

  generateReport() {
    if (!this.currentAnalysis) return;

    this.threatService.generateReport(this.currentAnalysis.address).subscribe({
      next: (response) => {
        window.open(response.reportUrl, '_blank');
      },
      error: (error) => {
        console.error('Error generating report:', error);
      }
    });
  }

  getRiskColor(riskLevel: string): string {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return '#F44336';
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }
}

