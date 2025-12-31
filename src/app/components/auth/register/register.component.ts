import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>Create Account</h2>
          <p>Join our Document Management System</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name"
              class="form-control"
              [class.is-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              placeholder="Enter your full name">
            <div class="invalid-feedback" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
              Name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="form-control"
              [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              placeholder="Enter your email">
            <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
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
              [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              placeholder="Create a password">
            <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              Password must be at least 6 characters
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword"
              class="form-control"
              [class.is-invalid]="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched"
              placeholder="Confirm your password">
            <div class="invalid-feedback" *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">
              Passwords do not match
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary w-100"
            [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
          
          <div class="register-footer">
            <p>Already have an account? <a routerLink="/login" class="text-link">Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .register-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .register-header h2 {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .register-header p {
      color: #6c757d;
      margin: 0;
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
    
    .register-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e1e5eb;
    }
    
    .register-footer p {
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
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}