import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'https://localhost:7179/api/Student';

  constructor(private http: HttpClient) {}
  registerSTudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insert`, studentData);
  }

  loginStudent(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        // Handle successful login, e.g., store token or user info
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('stud_name', response.std_f_name);
          localStorage.setItem('stud_id', response.std_id);
        }
      })
    );
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

  getStudentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetById/${id}`);
  }
}
