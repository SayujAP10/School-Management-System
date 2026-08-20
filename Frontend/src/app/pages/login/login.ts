import { NotificationService } from '../../services/notification.service';
import { StudentService } from './../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { AdminService } from '../../services/admin-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit, PLATFORM_ID, ChangeDetectorRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, AfterViewInit {

  loginForm!: FormGroup;
  stars = signal<any[]>([]);
  isBrowser = false;
  wavingStudent: string | null = null;
  hoveredSubject: string | null = null;
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  selectedRole = signal<'Student' | 'Teacher' | 'Admin'>('Student');

  toggleRole(role: 'Student' | 'Teacher' | 'Admin'): void {
    this.selectedRole.set(role);
  }

  subjects = signal([
    { key: 'physics', name: 'Physics', score: 95, color: 'rgba(129,199,132,0.4)', activeColor: 'rgba(129,199,132,0.75)', x: 132, y: 82 },
    { key: 'chemistry', name: 'Chemistry', score: 88, color: 'rgba(100,181,246,0.4)', activeColor: 'rgba(100,181,246,0.75)', x: 219, y: 82 },
    { key: 'maths', name: 'Maths', score: 92, color: 'rgba(255,183,77,0.4)', activeColor: 'rgba(255,183,77,0.75)', x: 306, y: 82 },
    { key: 'english', name: 'English', score: 85, color: 'rgba(206,147,216,0.4)', activeColor: 'rgba(206,147,216,0.75)', x: 132, y: 172 },
    { key: 'biology', name: 'Biology', score: 90, color: 'rgba(77,208,225,0.4)', activeColor: 'rgba(77,208,225,0.75)', x: 219, y: 172 },
    { key: 'computer', name: 'Computer', score: 98, color: 'rgba(240,98,146,0.4)', activeColor: 'rgba(240,98,146,0.75)', x: 306, y: 172 }
  ]);

  onSubjectHover(subjectId: string, isHovering: boolean): void {
    this.hoveredSubject = isHovering ? subjectId : null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  private platform_id = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platform_id);

    this.loginForm = this.fb.group({
      std_email_id:   ['', [Validators.required, Validators.minLength(3)]],
      std_usr_paswrd: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform_id)) {
      setTimeout(() => {
        this.stars.set(
          Array.from({ length: 35 }, () => ({
            width:             `${Math.random() * 3 + 1}px`,
            height:            `${Math.random() * 3 + 1}px`,
            left:              `${Math.random() * 100}%`,
            top:               `${Math.random() * 60}%`,
            animationDelay:    `${Math.random() * 3}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`
          }))
        );
        this.cdr.detectChanges();
      }, 0);
    }
  }

  onStudentClick(studentId: string): void {
    this.wavingStudent = studentId;
    setTimeout(() => {
      this.wavingStudent = null;
    }, 700);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      if (this.selectedRole() === 'Admin') {
        this.adminService.loginAdmin(this.loginForm.value).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading.set(false);
              this.router.navigate(['/dashboard']);
            }, 600);
          },
          error: (error) => {
            this.isLoading.set(false);
            console.error('Admin login failed:', error);
            this.notificationService.showError('Authentication Failed', 'Invalid Admin username or password.');
          }
        });
      } else if (this.selectedRole() === 'Teacher') {
        this.teacherService.loginTeacher(this.loginForm.value).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading.set(false);
              this.router.navigate(['/dashboard']);
            }, 600);
          },
          error: (error) => {
            this.isLoading.set(false);
            console.error('Teacher login failed:', error);
            this.notificationService.showError('Authentication Failed', 'Invalid Teacher email address or password.');
          }
        });
      } else {
        this.studentService.loginStudent(this.loginForm.value).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading.set(false);
              this.router.navigate(['/dashboard']);
            }, 600);
          },
          error: (error) => {
            this.isLoading.set(false);
            console.error('Student login failed:', error);
            this.notificationService.showError('Authentication Failed', 'Invalid Student email address or password.');
          }
        });
      }
    } else {
      this.loginForm.markAllAsTouched();
      this.notificationService.showError('Login Incomplete', 'Please fill in both Email and Password fields.');
    }
  }
}