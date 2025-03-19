import { AfterViewInit, Component, ElementRef, EventEmitter, Input, model, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-font-size-input',
  standalone: true,
  imports: [],
  templateUrl: './font-size-input.component.html',
  styles: `
    .active {
      @apply bg-main;
    }
  `
})
export class FontSizeInputComponent implements AfterViewInit {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef<HTMLElement>;
  @Output() fontsizechange = new EventEmitter<number>();
  @Input() fontSize: number = 32;
  offset = signal<number>(0);

  ngAfterViewInit(): void {
    const rect = (this.sliderWrapper.nativeElement).getBoundingClientRect();
    const d = rect.width / 45;
    const offset = this.fontSize * d;
    this.offset.set(offset);
  }

  OnVolumeMouseDown(event: MouseEvent) {
    if (!event.target || !this.menu.nativeElement.contains(event.target as HTMLElement)) {
      return;
    }
    const slider = this.menu.nativeElement.querySelector("#font-size-input-slider");
    if (!slider) {
      return;
    }
    slider.classList.add('active');
    document.body.style.userSelect = 'none';
    const onMove = (event: MouseEvent) => {
      const rect = (this.sliderWrapper.nativeElement).getBoundingClientRect();
      const offset = Math.max(Math.min(event.clientX - rect.left, rect.width), 0);
      this.offset.set(offset);
      const d = 45 / rect.width;
      const fs = Math.min(Math.max(Math.round(d * offset), 1), 45);
      this.fontSize = fs;
      this.fontsizechange.emit(fs)
    }
    const onUp = ()  => {
      document.body.style.userSelect = '';
      slider.classList.remove('active');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);  
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    onMove(event);
  }
}
