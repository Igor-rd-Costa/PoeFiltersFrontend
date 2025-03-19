import { Component, ElementRef, EventEmitter, Input, model, ModelSignal, Output, ViewChild } from '@angular/core';
import { Color, ColorRGBA } from '../../../types/FilterTypes';
import { FilterViewComponent } from '../../../pages/filter-page/filter-view/filter-view.component';

@Component({
  selector: 'app-color-input',
  standalone: true,
  imports: [],
  templateUrl: './color-input.component.html',
  styles: `
    :host {
      width: 100%;
    }
  `
})
export class ColorInputComponent {
  @Input({required: true}) heading!: string;
  @Input() disabled = false;
  @Output() change = new EventEmitter<ColorRGBA>();
  @ViewChild("wrapper") wrapper!: ElementRef<HTMLElement>;
  color = model.required<Color|null>();
  value: ColorRGBA = {r: 0, g: 0, b: 0, a: 0}

  SwitchActive() {
    this.color()!.active = !this.color()!.active;
  }

  OpenColorPicker(event: MouseEvent) {
    const color = this.color();
    if (color === null || !color.active) {
      return;
    }
    event.stopPropagation();
    FilterViewComponent.ColorPicker()?.Open(this.wrapper.nativeElement, this.color as ModelSignal<Color>).subscribe({
      next: value => {
        this.value = value;
        this.change.emit(this.value);
      }
    });
  }
}
