import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterDto, AuthResponse } from '../../../core/services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  dto: RegisterDto = { name: '', email: '', password: '', type: 'employee' };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.dto).subscribe({
      next: (response: AuthResponse) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/users']);
      },
      error: (err: { error?: { error?: string } }) => {
        this.errorMessage = err.error?.error ?? 'Registration failed';
        this.loading = false;
      },
    });
  }
}
