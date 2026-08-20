import { NotificationService } from '../../services/notification.service';
import { CustomDatePickerComponent } from '../../components/custom-date-picker/custom-date-picker';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit, PLATFORM_ID, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, CustomDatePickerComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, AfterViewInit {
  registerForm: FormGroup;
  isSubmitted = false;
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  selectedRole = signal<'Student' | 'Teacher'>('Student');

  toggleRole(role: 'Student' | 'Teacher'): void {
    this.selectedRole.set(role);
    this.updateValidatorsForRole(role);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  stars = signal<any[]>([]);
  isBrowser = false;
  wavingStudent: string | null = null;

  private platform_id = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      std_f_name: ['', Validators.required],
      std_l_name: ['', Validators.required],
      std_age: [18],
      std_dob: ['', Validators.required],
      std_gender: ['', Validators.required],
      std_email_id: ['', [Validators.required, Validators.email]],
      std_usr_paswrd: ['', [Validators.required, Validators.minLength(6)]],
      std_phno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      qualifications: this.fb.array([]),
      // Teacher specific fields
      tch_department: [''],
      tch_subject_spec: [''],
      tch_qualification: [''],
      tch_experience_yrs: [0]
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platform_id);
    if (this.qualifications.length === 0) {
      this.addQualification();
    }
    this.updateValidatorsForRole(this.selectedRole());
  }

  updateValidatorsForRole(role: 'Student' | 'Teacher'): void {
    const deptControl = this.registerForm.get('tch_department');
    const specControl = this.registerForm.get('tch_subject_spec');
    const qualControl = this.registerForm.get('tch_qualification');
    const qualsArray = this.registerForm.get('qualifications');

    if (role === 'Teacher') {
      deptControl?.setValidators([Validators.required]);
      specControl?.setValidators([Validators.required]);
      qualControl?.setValidators([Validators.required]);
      qualsArray?.disable();
    } else {
      deptControl?.clearValidators();
      specControl?.clearValidators();
      qualControl?.clearValidators();
      qualsArray?.enable();
      if (this.qualifications.length === 0) {
        this.addQualification();
      }
    }

    deptControl?.updateValueAndValidity();
    specControl?.updateValueAndValidity();
    qualControl?.updateValueAndValidity();
    qualsArray?.updateValueAndValidity();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform_id)) {
      setTimeout(() => {
        this.stars.set(
          Array.from({ length: 35 }, () => ({
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
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

  get qualifications() {
    return this.registerForm.get('qualifications') as FormArray;
  }

  addQualification() {
    const qualificationGroup = this.fb.group({
      course_name: ['', Validators.required],
      year_of_pass: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    this.qualifications.push(qualificationGroup);
    this.cdr.detectChanges();
  }

  removeQualification(index: number) {
    this.qualifications.removeAt(index);
    this.cdr.detectChanges();
  }

  onDobSelected(formattedDate: string): void {
    const computedAge = this.calculateAge(formattedDate);
    this.registerForm.get('std_age')?.setValue(computedAge > 0 ? computedAge : 18);
  }

  calculateAge(birthDateString: string): number {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getInvalidFields(): string[] {
    const invalid: string[] = [];
    const controls = this.registerForm.controls;

    if (controls['std_f_name'].invalid) invalid.push('First Name');
    if (controls['std_l_name'].invalid) invalid.push('Last Name');
    if (controls['std_dob'].invalid) invalid.push('Date of Birth');
    if (controls['std_gender'].invalid) invalid.push('Gender');
    if (controls['std_email_id'].invalid) invalid.push('Official Email (must be valid format e.g. user@domain.com)');
    if (controls['std_usr_paswrd'].invalid) invalid.push('Password (minimum 6 characters required)');
    if (controls['std_phno'].invalid) invalid.push('Phone Number (must be exactly 10 digits)');

    if (this.selectedRole() === 'Teacher') {
      if (controls['tch_department'].invalid) invalid.push('Department is required for Teachers');
      if (controls['tch_subject_spec'].invalid) invalid.push('Subject Specialization is required for Teachers');
      if (controls['tch_qualification'].invalid) invalid.push('Highest Qualification is required for Teachers');
    } else {
      this.qualifications.controls.forEach((group, index) => {
        const g = group as FormGroup;
        if (g.controls['course_name']?.invalid) {
          invalid.push(`Qualification #${index + 1}: Course Name is required`);
        }
        if (g.controls['year_of_pass']?.invalid) {
          invalid.push(`Qualification #${index + 1}: 4-digit Passing Year (e.g. 2024) is required`);
        }
        if (g.controls['percentage']?.invalid) {
          invalid.push(`Qualification #${index + 1}: Pass % (0 - 100) is required`);
        }
      });

      if (this.qualifications.length === 0) {
        invalid.push('Please add at least one Academic Qualification course');
      }
    }

    return invalid;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    this.registerForm.get('std_phno')?.setValue(sanitized, { emitEvent: false });
    input.value = sanitized;
  }

  onRegister() {
    this.isSubmitted = true;
    const isTeacher = this.selectedRole() === 'Teacher';
    this.updateValidatorsForRole(this.selectedRole());

    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const rawForm = this.registerForm.getRawValue();

      if (isTeacher) {
        const teacherData = {
          tch_f_name: rawForm.std_f_name,
          tch_l_name: rawForm.std_l_name,
          tch_gender: rawForm.std_gender,
          tch_dob: rawForm.std_dob ? new Date(rawForm.std_dob) : null,
          tch_email_id: rawForm.std_email_id,
          tch_usr_paswrd: rawForm.std_usr_paswrd,
          tch_phno: rawForm.std_phno,
          tch_department: rawForm.tch_department,
          tch_subject_spec: rawForm.tch_subject_spec,
          tch_qualification: rawForm.tch_qualification,
          tch_experience_yrs: Number(rawForm.tch_experience_yrs) || 0
        };

        this.teacherService.registerTeacher(teacherData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.notificationService.showSuccess('Registration Successful!', 'Your Teacher profile has been registered successfully.');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error('Teacher Registration Error:', err);
            const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.title || err.message || 'Error registering teacher.');
            this.notificationService.showError('Registration Failed', errorMsg);
          }
        });
      } else {
        const studentData = {
          ...rawForm,
          qualifications: (rawForm.qualifications || []).map((q: any) => ({
            ...q,
            percentage: q.percentage ? q.percentage.toString() : ''
          }))
        };

        this.studentService.registerSTudent(studentData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.notificationService.showSuccess('Registration Successful!', 'Your student profile has been registered successfully.');
            this.registerForm.reset();
            this.qualifications.clear();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error('Student Registration Error:', err);
            const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.title || err.message || 'Server error occurred during registration.');
            this.notificationService.showError('Registration Failed', errorMsg);
          }
        });
      }
    } else {
      const missing = this.getInvalidFields();
      this.notificationService.showError('Registration Incomplete', missing);
    }
  }

  get f() {
    return this.registerForm.controls;
  }
}
