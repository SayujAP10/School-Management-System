import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:5243/api/Teacher';

  constructor(private http: HttpClient) {}

  registerTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Insert`, teacherData);
  }

  loginTeacher(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token && typeof window !== 'undefined') {
          localStorage.clear();
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user_name', response.tch_f_name);
          localStorage.setItem('user_id', response.tch_id);
          localStorage.setItem('user_role', 'Teacher');
        }
      })
    );
  }

  getTeacherById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetById/${id}`);
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAll`);
  }
}
