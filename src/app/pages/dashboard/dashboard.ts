import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // studentData: any;
  studentData = signal<any>(null);
  private platformId = inject(PLATFORM_ID);

  constructor(
    private service: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('std_id');
      if (id) {
        this.loadProfile(+id);
      }
    }
  }

  loadProfile(id: number) {
    this.service.getStudentById(id).subscribe({
      next: (response) => {
        // this.studentData = {...response};
        // this.cdr.markForCheck();
        // this.cdr.detectChanges(); // Ensure view updates with new data
        // console.log('Student data loaded:', this.studentData);
        this.studentData.set(response);
        console.log('Student data loaded:', this.studentData());
      },
      error: (error) => {
        console.error('Failed to load student data:', error);
      },
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('stud_name');
    localStorage.removeItem('stud_id');

    this.router.navigate(['/login']);
  }
}
