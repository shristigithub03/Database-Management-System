import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Change this to your actual backend URL
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'dms_token';
  private userKey = 'dms_user';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  // Load user data from localStorage
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        console.log('AuthService: User loaded from storage', user);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.clearAuthData();
      }
    } else {
      console.log('AuthService: No user data in storage');
    }
  }

  // Login method - UPDATED to handle auth data storage
  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('AuthService: Sending login request to', `${this.apiUrl}/login`);
    
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('AuthService: Login response received', response);
        
        // Store authentication data after successful login
        if (response && response.token && response.user) {
          this.setAuthData(response.token, response.user);
          console.log('AuthService: Auth data stored successfully');
        } else if (response && response.data) {
          // Handle different response format
          this.setAuthData(response.data.token, response.data.user);
          console.log('AuthService: Auth data stored from data field');
        } else {
          console.warn('AuthService: Login response missing expected fields', response);
        }
      }),
      catchError((error) => {
        console.error('AuthService: Login error', error);
        return throwError(() => error);
      })
    );
  }

  // Alternative: Use this version for testing without backend
  loginMock(credentials: { email: string; password: string }): Observable<any> {
    console.log('AuthService: Using MOCK login with', credentials);
    
    // Mock successful response
    const mockResponse = {
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        role: 'user',
        createdAt: new Date().toISOString()
      }
    };
    
    return new Observable(observer => {
      setTimeout(() => {
        // Store auth data
        this.setAuthData(mockResponse.token, mockResponse.user);
        console.log('AuthService: Mock login complete', mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  // Register method
  register(userData: any): Observable<any> {
    console.log('AuthService: Registering user', userData);
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        console.log('AuthService: Registration response', response);
        // Auto-login after registration if response contains auth data
        if (response && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      }),
      catchError((error) => {
        console.error('AuthService: Registration error', error);
        return throwError(() => error);
      })
    );
  }

  // Store authentication data after successful login
  setAuthData(token: string, user: any): void {
    console.log('AuthService: Storing auth data', { token, user });
    
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Verify storage
    console.log('AuthService: Token stored:', localStorage.getItem(this.tokenKey));
    console.log('AuthService: User stored:', localStorage.getItem(this.userKey));
  }

  // Get current user
  getCurrentUser(): any {
    const user = this.currentUserSubject.value;
    console.log('AuthService: Getting current user', user);
    return user;
  }

  // Get user profile from API
  getProfile(): Promise<any> {
    console.log('AuthService: Fetching user profile');
    return this.http.get(`${this.apiUrl}/profile`).toPromise().then(
      (response: any) => {
        console.log('AuthService: Profile fetched', response);
        if (response && response.user) {
          this.currentUserSubject.next(response.user);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
        return response;
      }
    ).catch(error => {
      console.error('AuthService: Profile fetch error', error);
      throw error;
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem(this.tokenKey);
    console.log('AuthService: Is authenticated?', hasToken);
    return hasToken;
  }

  // Get token
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService: Getting token', token ? 'Found' : 'Not found');
    return token;
  }

  // Logout
  logout(): void {
    console.log('AuthService: Logging out');
    this.clearAuthData();
    this.router.navigate(['/login']).then(() => {
      console.log('AuthService: Redirected to login page');
    });
  }

  // Clear authentication data
  private clearAuthData(): void {
    console.log('AuthService: Clearing auth data');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    console.log('AuthService: Auth data cleared');
  }

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    const hasRole = user?.role === role;
    console.log('AuthService: Has role', role, '?', hasRole);
    return hasRole;
  }

  // Get user initials
  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (user?.name) {
      const initials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      console.log('AuthService: User initials', initials);
      return initials;
    }
    console.log('AuthService: Using default initials');
    return 'JD';
  }

  // Get user name (first name)
  getUserName(): string {
    const user = this.getCurrentUser();
    if (user?.name) {
      const firstName = user.name.split(' ')[0];
      console.log('AuthService: User name', firstName);
      return firstName;
    }
    console.log('AuthService: Using default name');
    return 'John Doe';
  }

  // Get user role
  getUserRole(): string {
    const user = this.getCurrentUser();
    const role = user?.role || 'User';
    console.log('AuthService: User role', role);
    return role;
  }

  // Check localStorage status (for debugging)
  debugStorage(): void {
    console.log('=== AuthService Debug ===');
    console.log('Token:', localStorage.getItem(this.tokenKey));
    console.log('User:', localStorage.getItem(this.userKey));
    console.log('Current User Subject:', this.currentUserSubject.value);
    console.log('Is Authenticated:', this.isAuthenticated());
    console.log('=========================');
  }
}
