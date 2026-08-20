import { Injectable, signal } from '@angular/core';

export interface NotificationState {
  isOpen: boolean;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  errorsList?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  state = signal<NotificationState>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
    errorsList: []
  });

  showError(title: string, errors: string[] | string): void {
    const errorsList = Array.isArray(errors) ? errors : [errors];
    this.state.set({
      isOpen: true,
      type: 'error',
      title,
      errorsList,
      message: ''
    });
  }

  showSuccess(title: string, message: string): void {
    this.state.set({
      isOpen: true,
      type: 'success',
      title,
      message,
      errorsList: []
    });
  }

  showWarning(title: string, message: string): void {
    this.state.set({
      isOpen: true,
      type: 'warning',
      title,
      message,
      errorsList: []
    });
  }

  showInfo(title: string, message: string): void {
    this.state.set({
      isOpen: true,
      type: 'info',
      title,
      message,
      errorsList: []
    });
  }

  close(): void {
    this.state.update(s => ({ ...s, isOpen: false }));
  }
}
