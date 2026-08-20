import { Component, EventEmitter, Input, Output, forwardRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-date-picker.html',
  styleUrl: './custom-date-picker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatePickerComponent),
      multi: true
    }
  ]
})
export class CustomDatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'Sun, 19-Dec-2000';
  @Output() dateSelected = new EventEmitter<string>();

  showDatePickerPopover = false;
  pickerView: 'year' | 'month' | 'day' = 'year';
  pickerYear: number = 2000;
  pickerMonth: number = 0; // 0-indexed (Jan)
  pickerDay: number | null = null;
  formattedDobDisplay = '';
  selectedDayName = '';

  weekDaysShortList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDaysFullList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  shortMonthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  yearsList = Array.from({ length: 87 }, (_, i) => 2026 - i); // 2026 down to 1940

  private cdr = inject(ChangeDetectorRef);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        this.pickerYear = parseInt(parts[0], 10);
        this.pickerMonth = parseInt(parts[1], 10) - 1;
        this.pickerDay = parseInt(parts[2], 10);

        const dateObj = new Date(this.pickerYear, this.pickerMonth, this.pickerDay);
        const dayIdx = dateObj.getDay();
        const shortDay = this.weekDaysShortList[dayIdx] || '';
        this.selectedDayName = this.weekDaysFullList[dayIdx] || '';

        const mStr = this.shortMonthsList[this.pickerMonth] || 'Jan';
        const dStr = (this.pickerDay < 10 ? '0' : '') + this.pickerDay;
        this.formattedDobDisplay = `${shortDay}, ${dStr}-${mStr}-${this.pickerYear}`;
      }
    } else {
      this.formattedDobDisplay = '';
      this.selectedDayName = '';
      this.pickerDay = null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDatePickerPopover(): void {
    this.showDatePickerPopover = !this.showDatePickerPopover;
    if (this.showDatePickerPopover && !this.pickerDay) {
      this.pickerView = 'year';
    }
    this.onTouched();
  }

  selectPickerYear(year: number): void {
    this.pickerYear = year;
    this.pickerView = 'month';
  }

  selectPickerMonth(monthIndex: number): void {
    this.pickerMonth = monthIndex;
    this.pickerView = 'day';
  }

  getDaysInMonth(year: number, monthIndex: number): number[] {
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  getFirstDayOffset(year: number, monthIndex: number): number[] {
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0=Sun to 6=Sat
    return Array.from({ length: firstDayOfWeek }, (_, i) => i);
  }

  getDayOfWeekName(day: number): string {
    const d = new Date(this.pickerYear, this.pickerMonth, day);
    return this.weekDaysShortList[d.getDay()];
  }

  selectPickerDay(day: number): void {
    this.pickerDay = day;
    const mStr = (this.pickerMonth + 1 < 10 ? '0' : '') + (this.pickerMonth + 1);
    const dStr = (day < 10 ? '0' : '') + day;
    
    const dateObj = new Date(this.pickerYear, this.pickerMonth, day);
    const dayIdx = dateObj.getDay();
    const shortDay = this.weekDaysShortList[dayIdx];
    this.selectedDayName = this.weekDaysFullList[dayIdx];

    const formattedDate = `${this.pickerYear}-${mStr}-${dStr}`; // YYYY-MM-DD
    this.formattedDobDisplay = `${shortDay}, ${dStr}-${this.shortMonthsList[this.pickerMonth]}-${this.pickerYear}`; // e.g. Tue, 19-Dec-2000
    
    this.onChange(formattedDate);
    this.dateSelected.emit(formattedDate);
    this.showDatePickerPopover = false;
  }
}
