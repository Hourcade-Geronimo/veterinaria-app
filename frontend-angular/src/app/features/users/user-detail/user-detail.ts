import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, UserDto, UpdateUserDto } from '../../../core/services/user';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetailComponent implements OnInit {
  user: UserDto | null = null;
  dto: UpdateUserDto = { name: '', email: '', type: 'employee' };
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getAll().subscribe({
      next: (users: UserDto[]) => {
        console.log('users loaded:', users);
        this.user = users.find(u => u.id === id) ?? null;
        console.log('user found:', this.user);
        if (this.user) {
          this.dto = {
            name: this.user.name,
            email: this.user.email,
            type: this.user.type,
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('error: ', err);
        this.errorMessage = 'Error al cargar usuario';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
    if (!this.user) return;
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.update(this.user.id, this.dto).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente';
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar usuario';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
