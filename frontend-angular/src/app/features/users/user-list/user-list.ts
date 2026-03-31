import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, UserDto } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  displayedColumns = ['id', 'name', 'email', 'type', 'createdAtTime', 'actions'];
  loading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}


  ngOnInit(): void {
    this.loadUsers();
  }

  // loadUsers(): void {
  //   this.loading = true;
  //   this.userService.getAll().subscribe({
  //     next: (users: UserDto[]) => {
  //       this.users = users;
  //       this.loading = false;
  //     },
  //     error: (err: { status?: number }) => {
  //       if (err.status === 401) {
  //         this.authService.logout();
  //         this.router.navigate(['/auth/login']);
  //       } else {
  //         this.errorMessage = 'Error al cargar usuarios';
  //         this.loading = false;
  //       }
  //     },
  //   });
  // }
  //
  loadUsers(): void {
  this.loading = true;
  console.log('loadUsers called');
  this.userService.getAll().subscribe({
    next: (users: UserDto[]) => {
      this.users = users;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err: { status?: number }) => {
      console.log('error called', err);
      if (err.status === 401) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      } else {
        this.errorMessage = 'Error al cargar usuarios';
        this.loading = false;
      }
    },
  });
}

  editUser(user: UserDto): void {
    this.router.navigate(['/users', user.id]);
  }

  deleteUser(user: UserDto): void {
    if (!confirm(`¿Eliminar a ${user.name}?`)) return;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
      },
      error: () => {
        this.errorMessage = 'Error al eliminar usuario';
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


}
