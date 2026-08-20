import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.css'
})
export class NotificationModalComponent {
  private notificationService = inject(NotificationService);
  state = this.notificationService.state;

  close(): void {
    this.notificationService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    this.close();
  }
}
