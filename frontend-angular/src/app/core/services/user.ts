import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  type: 'admin' | 'employee';
  createdAtTime: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  type: 'admin' | 'employee';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUrl);
  }

  update(id: number, dto: UpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
