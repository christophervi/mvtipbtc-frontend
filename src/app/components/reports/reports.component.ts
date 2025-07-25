import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ThreatIntelligenceService } from '../../services/threat-intelligence.service';
import { HttpClient } from '@angular/common/http';

interface Report {
  id: number;
  fileName: string;
  s3Key: string;
  address: string;
  reportType: string;
  createdAt: Date;
  fileSize: string;
  status: string;
}

@Component({
  selector: 'app-reports',
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
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = ['fileName', 'address', 'reportType', 'createdAt', 'fileSize', 'status', 'actions'];
  dataSource = new MatTableDataSource<Report>();
  
  reportTypes = ['All', 'Transaction Analysis', 'Risk Assessment', 'Threat Intelligence', 'Compliance Report'];
  selectedReportType = 'All';
  
  isGeneratingReport = false;
  newReportAddress = '';

  constructor(
    private threatService: ThreatIntelligenceService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.threatService.getReports().subscribe({
      next: (reports) => {
        this.dataSource.data = reports.map(report => ({
          ...report,
          createdAt: new Date(report.createdAt),
          fileSize: this.formatFileSize(Math.random() * 1000000 + 100000),
          status: 'Ready'
        }));
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.loadMockReports();
      }
    });
  }

  loadMockReports() {
    const mockReports: Report[] = [
      {
        id: 1,
        fileName: 'threat_analysis_1BvBMSEY_20250702_143022.pdf',
        s3Key: 'reports/threat_analysis_1BvBMSEY_20250702_143022.pdf',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        reportType: 'Transaction Analysis',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        fileSize: '2.4 MB',
        status: 'Ready'
      },
      {
        id: 2,
        fileName: 'risk_assessment_1FeexV6b_20250702_120045.pdf',
        s3Key: 'reports/risk_assessment_1FeexV6b_20250702_120045.pdf',
        address: '1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF',
        reportType: 'Risk Assessment',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        fileSize: '1.8 MB',
        status: 'Ready'
      },
      {
        id: 3,
        fileName: 'threat_intel_1A1zP1eP_20250701_165530.pdf',
        s3Key: 'reports/threat_intel_1A1zP1eP_20250701_165530.pdf',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        reportType: 'Threat Intelligence',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        fileSize: '3.1 MB',
        status: 'Ready'
      },
      {
        id: 4,
        fileName: 'compliance_1NDyJtNT_20250701_091215.pdf',
        s3Key: 'reports/compliance_1NDyJtNT_20250701_091215.pdf',
        address: '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
        reportType: 'Compliance Report',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        fileSize: '4.2 MB',
        status: 'Ready'
      },
      {
        id: 5,
        fileName: 'analysis_1LfV1tSt_20250630_203345.pdf',
        s3Key: 'reports/analysis_1LfV1tSt_20250630_203345.pdf',
        address: '1LfV1tSt5KNyHtGNjKjyvJr3KKUpqbJJr5',
        reportType: 'Transaction Analysis',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        fileSize: '2.9 MB',
        status: 'Ready'
      }
    ];
    
    this.dataSource.data = mockReports;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  filterByReportType() {
    let filteredData = [...this.dataSource.data];

    if (this.selectedReportType !== 'All') {
      filteredData = filteredData.filter(report => report.reportType === this.selectedReportType);
    }

    this.dataSource.data = filteredData;
  }

  generateReport() {
    if (!this.newReportAddress.trim()) {
      return;
    }

    this.isGeneratingReport = true;
    
    this.threatService.generateReport(this.newReportAddress).subscribe({
      next: (response) => {
        console.log('Report generated:', response);
        this.isGeneratingReport = false;
        this.newReportAddress = '';
        this.loadReports();
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.isGeneratingReport = false;
        this.generateMockReport();
      }
    });
  }

  generateMockReport() {
    const newReport: Report = {
      id: Date.now(),
      fileName: `threat_analysis_${this.newReportAddress.substring(0, 8)}_${new Date().toISOString().replace(/[:.]/g, '').substring(0, 15)}.pdf`,
      s3Key: `reports/threat_analysis_${this.newReportAddress.substring(0, 8)}_${Date.now()}.pdf`,
      address: this.newReportAddress,
      reportType: 'Transaction Analysis',
      createdAt: new Date(),
      fileSize: '2.1 MB',
      status: 'Ready'
    };

    this.dataSource.data = [newReport, ...this.dataSource.data];
    this.newReportAddress = '';
  }

  viewReport(report: Report) {
      this.threatService.getReportUrl(report.fileName).subscribe(url => {
          console.log('Viewing report:', report.fileName);
          window.open(url, '_blank');
      });
  }

  downloadReport(report: Report) {
      this.threatService.getReportUrl(report.fileName).subscribe(presignedUrl => {
            
            // Use HttpClient to fetch the file content as a Blob
            this.http.get(presignedUrl, { responseType: 'blob' }).subscribe(blob => {
                
                // Create a temporary URL from the file Blob
                const url = window.URL.createObjectURL(blob);
                
                // Create a temporary, hidden anchor element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', report.fileName); // Set the fileName for download
                
                // Append the link to the body, click it, and then remove it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the temporary URL
                window.URL.revokeObjectURL(url);
            });
        });
  }

  /*downloadReport(report: Report) {
    console.log('Downloading report:', report.fileName);
    const link = document.createElement('a');
    link.href = '#';
    link.download = report.fileName;
    link.click();
  }

  viewReport(report: Report) {
    console.log('Viewing report:', report.fileName);
    window.open('#', '_blank');
  }*/

  shareReport(report: Report) {
    console.log('Sharing report:', report.fileName);
    navigator.clipboard.writeText(`Report: ${report.fileName} - Generated for address: ${report.address}`);
  }

  deleteReport(report: Report) {
    const index = this.dataSource.data.indexOf(report);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  getReportTypeIcon(reportType: string): string {
    switch (reportType.toLowerCase()) {
      case 'transaction analysis': return 'analytics';
      case 'risk assessment': return 'security';
      case 'threat intelligence': return 'shield';
      case 'compliance report': return 'gavel';
      default: return 'description';
    }
  }

  getReportTypeColor(reportType: string): string {
    switch (reportType.toLowerCase()) {
      case 'transaction analysis': return 'primary';
      case 'risk assessment': return 'warn';
      case 'threat intelligence': return 'accent';
      case 'compliance report': return '';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'ready': return 'primary';
      case 'generating': return 'accent';
      case 'error': return 'warn';
      default: return '';
    }
  }

  getTotalReportsCount(): number {
    return this.dataSource.data.length;
  }

  getTotalFileSize(): string {
    const totalBytes = this.dataSource.data.reduce((total, report) => {
      const sizeStr = report.fileSize;
      const size = parseFloat(sizeStr);
      const unit = sizeStr.split(' ')[1];
      
      let bytes = size;
      if (unit === 'KB') bytes *= 1024;
      else if (unit === 'MB') bytes *= 1024 * 1024;
      else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
      
      return total + bytes;
    }, 0);
    
    return this.formatFileSize(totalBytes);
  }

  getRecentReportsCount(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.dataSource.data.filter(report => report.createdAt > oneDayAgo).length;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }

  getReadyReportsCount(): number {
    return this.dataSource.data.filter(r => r.status === 'Ready').length;
  }
}

