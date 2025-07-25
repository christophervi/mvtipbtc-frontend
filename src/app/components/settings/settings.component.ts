import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  role: string;
  createdAt: Date;
}

interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  criticalAlerts: boolean;
  highRiskAlerts: boolean;
  mediumRiskAlerts: boolean;
  reportGeneration: boolean;
  weeklyDigest: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', './color-fixes.css']
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  userProfile: UserProfile = {
    id: 1,
    username: 'admin',
    email: 'admin@mvtipbtc.com',
    firstName: 'System',
    lastName: 'Administrator',
    organization: 'Georgia Tech',
    role: 'Administrator',
    createdAt: new Date('2025-01-01')
  };

  notificationSettings: NotificationSettings = {
    emailAlerts: true,
    pushNotifications: true,
    criticalAlerts: true,
    highRiskAlerts: true,
    mediumRiskAlerts: false,
    reportGeneration: true,
    weeklyDigest: true
  };

  securitySettings: SecuritySettings = {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true
  };

  sessionTimeoutOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 480, label: '8 hours' }
  ];

  passwordExpiryOptions = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '180 days' },
    { value: 365, label: '1 year' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required]],
      lastName: [this.userProfile.lastName, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      organization: [this.userProfile.organization],
      role: [this.userProfile.role]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadSettings();
  }

  loadUserProfile() {
    console.log('Loading user profile...');
  }

  loadSettings() {
    console.log('Loading user settings...');
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const updatedProfile = {
        ...this.userProfile,
        ...this.profileForm.value
      };
      
      console.log('Updating profile:', updatedProfile);

      this.userProfile = updatedProfile;
      this.showSnackBar('Profile updated successfully');
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      
      console.log('Changing password...');

      this.passwordForm.reset();
      this.showSnackBar('Password changed successfully');
    }
  }

  updateNotificationSettings() {
    console.log('Updating notification settings:', this.notificationSettings);

    this.showSnackBar('Notification settings updated');
  }

  updateSecuritySettings() {
    console.log('Updating security settings:', this.securitySettings);

    this.showSnackBar('Security settings updated');
  }

  enableTwoFactorAuth() {
    console.log('Enabling two-factor authentication...');

    this.securitySettings.twoFactorAuth = true;
    this.showSnackBar('Two-factor authentication enabled');
  }

  disableTwoFactorAuth() {
    console.log('Disabling two-factor authentication...');
    
    this.securitySettings.twoFactorAuth = false;
    this.showSnackBar('Two-factor authentication disabled');
  }

  exportData() {
    console.log('Exporting user data...');

    this.showSnackBar('Data export initiated. You will receive an email when ready.');
  }

  deleteAccount() {
    console.log('Account deletion requested...');

    this.showSnackBar('Account deletion request submitted');
  }

  testNotifications() {
    console.log('Sending test notification...');
    
    this.showSnackBar('Test notification sent');
  }

  downloadActivityLog() {
    console.log('Downloading activity log...');

    this.showSnackBar('Activity log download started');
  }

  clearCache() {
    console.log('Clearing application cache...');
    
    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();
    
    this.showSnackBar('Application cache cleared');
  }

  resetToDefaults() {
    console.log('Resetting settings to defaults...');
    
    this.notificationSettings = {
      emailAlerts: true,
      pushNotifications: true,
      criticalAlerts: true,
      highRiskAlerts: true,
      mediumRiskAlerts: false,
      reportGeneration: true,
      weeklyDigest: true
    };
    
    this.securitySettings = {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true
    };
    
    this.showSnackBar('Settings reset to defaults');
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  getAccountAge(): string {
    const now = new Date();
    const created = this.userProfile.createdAt;
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }

  getLastLogin(): string {
    return 'Today at 2:30 PM';
  }

  getActiveSessionsCount(): number {
    return 2;
  }
}

