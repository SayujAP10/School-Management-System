import { StudentService } from '../../services/student-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm : FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router) {
    // Initialize the form with the same names used in your HTML
    this.registerForm = this.fb.group({
      std_f_name: ['', Validators.required],
      std_l_name: ['', Validators.required],
      std_age: ['', [Validators.required,Validators.min(3), Validators.max(100)]],
      std_dob: ['', Validators.required],
      std_gender: ['', Validators.required],
      std_email_id: ['',[Validators.required, Validators.email]],
      std_usr_paswrd: ['', [Validators.required, Validators.minLength(6)]],
      std_phno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assuming a 10-digit phone number 
      qualifications: this.fb.array([]) 
    });
  }
  
  get qualifications() {
    return this.registerForm.get('qualifications') as FormArray;
  }

  addQualification() {
    const qualificationGroup= this.fb.group({
      course_name: ['', Validators.required],
      year_of_pass: ['', [Validators.required,Validators.pattern('^[0-9]{4}$')]], // Assuming a 4-digit year
      percentage :['', [Validators.required,Validators.min(0), Validators.max(100)]]
    });
    this.qualifications.push(qualificationGroup);
  }

  // 4. Function to remove a row
  removeQualification(index: number) {
    this.qualifications.removeAt(index);
  }

  onRegister() {
    this.isSubmitted = true;
    if (this.registerForm.valid && this.qualifications.length > 0) {
      // console.log(this.registerForm.value);
      this.studentService.registerSTudent(this.registerForm.value).subscribe({
        next : (response) => {
          alert('Registration Successful!');
          this.registerForm.reset();
          this.qualifications.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => {
        console.error(err);
        alert('Some error occured.');
      }
      });
    }
  }

  get f() {
    return this.registerForm.controls;
  }
}
