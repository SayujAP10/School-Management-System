import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy, AfterViewInit, PLATFORM_ID, signal } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { AdminService } from '../../services/admin-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export type DashboardTab = 
  | 'overview' 
  | 'profile' 
  | 'academic' 
  | 'idcard' 
  | 'schedule' 
  | 'attendance' 
  | 'fees' 
  | 'library' 
  | 'notices' 
  | 'settings'
  | 'classes'
  | 'gradebook'
  | 'admin-students'
  | 'admin-teachers'
  | 'admin-stats';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy, AfterViewInit {
  studentData = signal<any>(null);
  teacherData = signal<any>(null);
  adminStats = signal<any>(null);
  adminStudentsList = signal<any[]>([]);
  adminTeachersList = signal<any[]>([]);

  userRole = signal<'Student' | 'Teacher' | 'Admin'>('Student');
  userName = signal<string>('User');

  stars = signal<any[]>([]);
  isBrowser = false;
  activeTab = signal<DashboardTab>('overview');
  sidebarOpen = signal<boolean>(true);
  isSidebarLoading = signal<boolean>(false);
  loadingTab = signal<DashboardTab | null>(null);
  isTabLoading = signal<boolean>(false);

  // Custom Action Loader & Double Click Prevention
  isTeacherActionLoading = signal<boolean>(false);
  actionLoadingMessage = signal<string>('Processing Action...');

  isWaving = signal<boolean>(false);
  greetingText = signal<string>('Welcome Back');
  currentTime = signal<string>('');
  currentDateStr = signal<string>('');
  idCardFlipped = signal<boolean>(false);

  private clockInterval: any;
  private platformId = inject(PLATFORM_ID);

  // Mock data for student portal
  notices = signal([
    { id: 1, title: 'Annual Sports Meet 2026 Registration Open', date: 'Aug 14, 2026', tag: 'Event', type: 'warning' },
    { id: 2, title: 'Mid-Term Examinations Schedule Published', date: 'Aug 18, 2026', tag: 'Academic', type: 'info' },
    { id: 3, title: 'Digital Library Access Granted for All Students', date: 'Aug 10, 2026', tag: 'Library', type: 'success' },
  ]);

  timetable = signal([
    { time: '09:00 AM - 10:00 AM', monday: 'Mathematics', tuesday: 'Physics', wednesday: 'Chemistry', thursday: 'English', friday: 'Computer Sci' },
    { time: '10:00 AM - 11:00 AM', monday: 'Physics', tuesday: 'Chemistry', wednesday: 'Mathematics', thursday: 'Social Sci', friday: 'Physical Ed' },
    { time: '11:15 AM - 12:15 PM', monday: 'Computer Sci', tuesday: 'English', wednesday: 'Biology', thursday: 'Mathematics', friday: 'Physics Lab' },
    { time: '01:15 PM - 02:15 PM', monday: 'Chemistry Lab', tuesday: 'Social Sci', wednesday: 'English', thursday: 'Computer Sci', friday: 'Library Hour' },
  ]);

  attendanceSummary = signal({
    totalClasses: 120,
    attended: 114,
    percentage: 95.0,
    status: 'Excellent',
    lastUpdated: 'Today'
  });

  feeSummary = signal({
    totalFee: '$1,200',
    paidFee: '$1,200',
    dueFee: '$0',
    status: 'Cleared',
    dueDate: 'N/A'
  });

  // Teacher specific mock data
  teacherClasses = signal([
    { classCode: 'PHYS-101', className: 'Grade 10 Physics', studentsCount: 42, room: 'Lab 2B', schedule: 'Mon, Wed, Fri (09:00 AM)' },
    { classCode: 'PHYS-202', className: 'Grade 11 Advanced Physics', studentsCount: 38, room: 'Room 304', schedule: 'Tue, Thu (11:15 AM)' },
    { classCode: 'PHYS-303', className: 'Grade 12 Applied Mechanics', studentsCount: 35, room: 'Lab 1A', schedule: 'Mon, Thu (01:15 PM)' }
  ]);

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.updateGreeting();
      this.startClock();

      const role = localStorage.getItem('user_role') as 'Student' | 'Teacher' | 'Admin';
      const storedName = localStorage.getItem('user_name') || localStorage.getItem('stud_name') || 'User';
      this.userName.set(storedName);

      if (role === 'Admin') {
        this.userRole.set('Admin');
        this.loadAdminData();
      } else if (role === 'Teacher') {
        this.userRole.set('Teacher');
        const teacherId = localStorage.getItem('user_id');
        if (teacherId) {
          this.loadTeacherProfile(+teacherId);
        }
      } else {
        this.userRole.set('Student');
        const studentId = localStorage.getItem('std_id') || localStorage.getItem('user_id');
        if (studentId) {
          this.loadStudentProfile(+studentId);
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.stars.set(
          Array.from({ length: 45 }, () => ({
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }))
        );
        this.cdr.detectChanges();
      }, 0);
    }
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.currentTime.set(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      this.currentDateStr.set(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  updateGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greetingText.set('Good Morning');
    } else if (hour < 17) {
      this.greetingText.set('Good Afternoon');
    } else {
      this.greetingText.set('Good Evening');
    }
  }

  toggleSidebar() {
    if (this.isSidebarLoading()) return;
    this.isSidebarLoading.set(true);
    setTimeout(() => {
      this.sidebarOpen.update(v => !v);
      this.isSidebarLoading.set(false);
    }, 280);
  }

  setTab(tab: DashboardTab) {
    if (this.isTabLoading() || this.isTeacherActionLoading()) return; // Block double-clicks
    this.loadingTab.set(tab);
    this.isTabLoading.set(true);
    
    setTimeout(() => {
      this.activeTab.set(tab);
      if (this.isBrowser && window.innerWidth < 992 && this.sidebarOpen()) {
        this.sidebarOpen.set(false);
      }
      this.isTabLoading.set(false);
      this.loadingTab.set(null);
    }, 280);
  }

  performTeacherAction(message: string, callback: () => void): void {
    if (this.isTeacherActionLoading()) return; // Block double click
    this.isTeacherActionLoading.set(true);
    this.actionLoadingMessage.set(message);

    setTimeout(() => {
      try {
        callback();
      } finally {
        this.isTeacherActionLoading.set(false);
      }
    }, 700);
  }

  triggerWave() {
    this.isWaving.set(true);
    setTimeout(() => {
      this.isWaving.set(false);
    }, 800);
  }

  toggleIdCardFlip() {
    this.idCardFlipped.update(v => !v);
  }

  loadStudentProfile(id: number) {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        this.studentData.set(response);
        if (response?.std_f_name) {
          this.userName.set(response.std_f_name);
        }
      },
      error: (error) => {
        console.error('Failed to load student data:', error);
      },
    });
  }

  loadTeacherProfile(id: number) {
    this.teacherService.getTeacherById(id).subscribe({
      next: (response) => {
        this.teacherData.set(response);
        if (response?.tch_f_name) {
          this.userName.set(response.tch_f_name);
        }
      },
      error: (error) => {
        console.error('Failed to load teacher data:', error);
      }
    });
  }

  loadAdminData() {
    this.adminService.getAdminStats().subscribe({
      next: (stats) => {
        this.adminStats.set(stats);
      },
      error: (err) => console.error('Failed to load admin stats:', err)
    });

    this.adminService.getAllStudents().subscribe({
      next: (students) => {
        this.adminStudentsList.set(students || []);
      },
      error: (err) => console.error('Failed to load students for admin:', err)
    });

    this.adminService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.adminTeachersList.set(teachers || []);
      },
      error: (err) => console.error('Failed to load teachers for admin:', err)
    });
  }

  logout() {
    if (this.isTeacherActionLoading()) return;
    this.performTeacherAction('Logging out of session...', () => {
      if (this.isBrowser) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('stud_name');
        localStorage.removeItem('std_id');
      }
      this.router.navigate(['/login']);
    });
  }
}
