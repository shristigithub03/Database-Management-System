import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your Document Management System</p>
        </div>
        
        <!-- Error Message Display -->
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-control"
              [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email">
            <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              class="form-control"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Enter your password">
            <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100"
            [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/register" class="text-link">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .login-header h2 {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .login-header p {
      color: #6c757d;
      margin: 0;
    }
    
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }
    
    .alert-danger {
      background-color: #ffeaea;
      color: #dc3545;
      border: 1px solid #f8d7da;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e1e5eb;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #4361ee;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .btn-primary {
      background: #4361ee;
      border: none;
      padding: 0.875rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.3s;
      cursor: pointer;
      color: white;
      font-size: 1rem;
      width: 100%;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #3a56d4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
    }
    
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e5eb;
    }
    
    .login-footer p {
      color: #6c757d;
      margin: 0;
    }
    
    .text-link {
      color: #4361ee;
      text-decoration: none;
      font-weight: 500;
    }
    
    .text-link:hover {
      text-decoration: underline;
    }
    
    .w-100 {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('LoginComponent: Form submitted', this.loginForm.value);
    
    // For testing: Use mock login first
    // this.authService.loginMock(this.loginForm.value).subscribe({
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('LoginComponent: Full response', response);
        
        // REMOVE the localStorage.setItem calls - AuthService should handle this
        // The AuthService.setAuthData() is already called in the tap() operator
        
        // Check if auth data was stored
        console.log('LoginComponent: Checking storage...');
        console.log('Token:', localStorage.getItem('dms_token'));
        console.log('User:', localStorage.getItem('dms_user'));
        
        // Navigate to dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']).then(success => {
            console.log('LoginComponent: Navigation success?', success);
            if (!success) {
              this.errorMessage = 'Failed to navigate. Please try again.';
              this.loading = false;
            }
          });
        }, 500);
      },
      error: (error) => {
        console.error('LoginComponent: Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        
        this.errorMessage = error.error?.message || 
                           error.error?.error || 
                           error.message || 
                           'Login failed. Please check your credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('LoginComponent: Request complete');
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}
}