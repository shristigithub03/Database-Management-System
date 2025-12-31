import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Correct import

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html', // Use external template
  styleUrls: ['./header.component.scss'] // Use external styles
})
export class HeaderComponent implements OnInit {
  dropdownOpen = false;
  searchQuery = '';

  constructor(
    private router: Router,
    public authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    this.setupClickOutsideListener();
  }

  // Remove the isAuthenticated, getUserInitials, getUserName, getUserRole methods
  // since they're now in AuthService

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown-menu');
    const userMenu = document.querySelector('.user-menu');

    if (this.dropdownOpen &&
        !dropdown?.contains(target) &&
        !userMenu?.contains(target)) {
      this.closeDropdown();
    }
  }

  private setupClickOutsideListener() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.dropdown-menu');
      const userMenu = document.querySelector('.user-menu');

      if (this.dropdownOpen &&
          !dropdown?.contains(target) &&
          !userMenu?.contains(target)) {
        this.closeDropdown();
      }
    });
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/documents')) return 'Documents';
    if (url.includes('/upload')) return 'Upload Documents';
    if (url.includes('/profile')) return 'Profile';
    if (url.includes('/login')) return 'Login';
    if (url.includes('/register')) return 'Register';
    return 'DMS Pro';
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/documents'], {
        queryParams: { search: this.searchQuery }
      });
      this.searchQuery = '';
    }
  }

  openSettings(): void {
    this.closeDropdown();
    alert('Settings page will be implemented soon!');
  }

  logout(): void {
    this.closeDropdown();
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout(); // Use AuthService logout
      alert('You have been logged out');
    }
  }
}