import { StudentService } from './../../services/student-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  stars = signal<any[]>([]);        // ✅ use signal instead of plain array
  isBrowser = false;
  wavingStudent: string | null = null;
  hoveredSubject: string | null = null;

  onSubjectHover(subjectId: string, isHovering: boolean): void {
  this.hoveredSubject = isHovering ? subjectId : null;
}

  private platform_id = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);  // ✅ inject ChangeDetectorRef

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
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
    // ✅ generate stars AFTER view is fully initialized
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
        this.cdr.detectChanges(); // ✅ tell Angular to re-check now
      }, 0); // setTimeout(0) pushes to next event loop tick
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
      this.studentService.loginStudent(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid username or password. Please try again.');
        },
      });
    }
  }
}