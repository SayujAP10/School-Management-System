import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:5243/api/Admin';

  constructor(private http: HttpClient) {}

  loginAdmin(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token && typeof window !== 'undefined') {
          localStorage.clear();
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user_name', response.adm_full_name || response.adm_username || 'Admin');
          localStorage.setItem('user_id', response.adm_id);
          localStorage.setItem('user_role', 'Admin');
        }
      })
    );
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Stats`);
  }

  getAllStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Students`);
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Teachers`);
  }
}
