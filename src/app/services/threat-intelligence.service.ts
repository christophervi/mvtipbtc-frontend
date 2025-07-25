import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TransactionAnalysis {
  address: string;
  riskScore: number;
  riskLevel: string;
  transactionVolume: number;
  networkConfirmations: number;
  firstSeen: string;
  totalReceived: number;
  totalSent: number;
  currentBalance: number;
  numberOfTransactions: number;
  analysis: string;
  mixingProbability: number;
  illicitFundSources: number;
  darkMarketConnections: number;
}

export interface Alert {
  id: number;
  type: string;
  title: string;
  description: string;
  riskLevel: string;
  timestamp: string;
  address?: string;
}

export interface TransactionFlow {
  nodes: any[];
  edges: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ThreatIntelligenceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  analyzeTransaction(address: string): Observable<TransactionAnalysis> {
    return this.http.post<TransactionAnalysis>(
      `${this.apiUrl}/analysis/transaction`,
      { address },
      { headers: this.getHeaders() }
    );
  }

  getTransactionFlow(address: string): Observable<TransactionFlow> {
    return this.http.get<TransactionFlow>(
      `${this.apiUrl}/analysis/flow/${address}`,
      { headers: this.getHeaders() }
    );
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(
      `${this.apiUrl}/alerts`,
      { headers: this.getHeaders() }
    );
  }

  generateReport(address: string): Observable<{ reportUrl: string }> {
    return this.http.post<{ reportUrl: string }>(
      `${this.apiUrl}/reports/generate`,
      { address },
      { headers: this.getHeaders() }
    );
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/reports`,
      { headers: this.getHeaders() }
    );
  }

  getMempoolStats(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/monitoring/stats`,
      { headers: this.getHeaders() }
    );
  }

  /*getRealTimeStats(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/monitoring/stats`,
      { headers: this.getHeaders() }
    );
  }*/

  getReportUrl(filename: string): Observable<string> {
  return this.http.get<{url: string}>(`${this.apiUrl}/reports/${filename}/url`, { headers: this.getHeaders() })
    .pipe(map(response => response.url));
  }
}

