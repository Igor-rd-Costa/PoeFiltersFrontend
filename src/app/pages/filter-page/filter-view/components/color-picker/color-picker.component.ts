import { Component, computed, ElementRef, ModelSignal, signal, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { RGBToHSV } from '../../../../../utils/helpers';
import { Color, ColorHSVA, ColorRGBA } from '../../../../../types/FilterTypes';

@Component({
  selector: 'app-color-picker-menu',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styles: `
    #color-picker-gradient {
      background-blend-mode: multiply;
    }

    #color-picker-opacity-slider {
      background: linear-gradient(to right, #CCCF 50%, #111F 50%), linear-gradient(to bottom, #CCCF 50%, #111F 50%);
      background-blend-mode: difference;
      background-size: 10px;
      background-repeat: repeat;
    }

    #color-picker-gradient-slider {
      background: linear-gradient(to bottom, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))
    }
  `
})
export class ColorPickerMenuComponent {
  @ViewChild("menu") private menu!: ElementRef<HTMLElement>;
  @ViewChild("opacitySlider") private opacitySlider!: ElementRef<HTMLElement>;
  @ViewChild("gradientSlider") private gradientSlider!: ElementRef<HTMLElement>;
  protected isColorPickerOpen = signal<boolean>(false); 
  protected pos = {x: 0, y: 0};
  protected selector = {x: 0, y: 0};
  protected opacitySliderPos = 0;
  protected gradientSliderPos = 0;
  protected gradBaseHSV = signal<ColorHSVA>({h: 0, s: 100, v: 50, a: 1})
  private initialColor: Color|null = null;
  private isSelecting = signal<boolean>(false);
  private subscriber: Subscriber<ColorRGBA>|null = null;
  protected value = computed(() => {
    const base = this.gradBaseHSV();
    const h = base.h;
    const s = base.s / 100;
    const v = base.v / 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h <= 360) {
      r = c; g = 0; b = x;
    }

    const rgb: ColorRGBA = {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a: base.a
    };
    this.subscriber?.next(rgb);
    return rgb;
  })

  GetGradColor() {
    return `linear-gradient(to bottom, white, black), linear-gradient(to right, white, hsl(${this.gradBaseHSV().h}, 100%, 50%))`;
  }

  GetOpacityGrad() {
    const c = this.value();
    return `linear-gradient(to right, transparent, rgb(${c.r}, ${c.g}, ${c.b}))`
  }

  GetAlpha() {
    return Math.max(Math.min(255, Math.round(this.value().a * 255)), 0);
  }

  OnRGBAInputKeyDown(event: KeyboardEvent) {
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLInputElement;
    const val = t.value;
    const isValidKey = event.key === 'Delete' || event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
    || event.key === 'ArrowUp' || event.key === 'ArrowDown'
    || (event.key >= '0' && event.key <= '9' && val.length < 3);
    
    if (!isValidKey) {
      event.preventDefault();
      return;
    }
  }
  
  OnRGBInputEvent(event: Event) {
    const rInput = this.menu.nativeElement.querySelector('#color-picker-input-r') as HTMLInputElement | null;
    const gInput = this.menu.nativeElement.querySelector('#color-picker-input-g') as HTMLInputElement | null;
    const bInput = this.menu.nativeElement.querySelector('#color-picker-input-b') as HTMLInputElement | null;
    if (!rInput || !gInput || !bInput) {
      return;
    }
    const r = parseInt(rInput.value.length === 0 ? '0' : rInput.value);
    const g = parseInt(gInput.value.length === 0 ? '0' : gInput.value);
    const b = parseInt(bInput.value.length === 0 ? '0' : bInput.value);
    
    const hsv = RGBToHSV({r, g, b});
    const base = {...this.gradBaseHSV()};
    base.h = hsv.h;
    base.s = hsv.s;
    base.v = hsv.v;
    this.gradBaseHSV.set(base);
    this.SetGradientSelectorPos();
    this.SetGradientSliderPos();
  }

  OnAlphaInputEvent(event: Event) {
    const t = (event.target as HTMLInputElement);
    const a = parseInt(t.value.length === 0 ? '0' : t.value);
    const base = {...this.gradBaseHSV()};
    base.a = Math.max(0, Math.min(255, a)) / 255;
    this.gradBaseHSV.set(base);
    this.SetOpacitySliderPos();
  }

  Open(target: HTMLElement, color: ModelSignal<Color>) {
    const rect = target.getBoundingClientRect();
    let top = rect.top + 48;
    let left = rect.left;
    this.isColorPickerOpen.set(true);
    this.initialColor = color();
    this.gradBaseHSV.set({...RGBToHSV({r: color().r, g: color().g, b: color().b}), a: this.gradBaseHSV().a });
    this.SetOpacitySliderPos();
    this.SetGradientSliderPos();
    this.SetGradientSelectorPos();
    setTimeout(() => {
      const mRect = this.menu.nativeElement.getBoundingClientRect();
      if ((left + mRect.width) > window.innerWidth) {
        left = window.innerWidth - (mRect.width + 48);
      }
      if ((top + mRect.height) > window.innerHeight) {
        top = rect.top - mRect.height;
      }
      this.pos.x = Math.max(left, 0);
      this.pos.y = Math.max(top, 0);
    });
    const onDocMouseDown = (event: MouseEvent) => {
      if (this.isSelecting()) {
        return;
      }
      const t = event.target as HTMLElement | null;
      if (t === null) {
        return;
      }
      if (t.closest("#color-picker-menu") === null) {
        this.Cancel();
        document.removeEventListener('mousedown', onDocMouseDown);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return new Observable<ColorRGBA>(subscriber => {
      this.subscriber = subscriber;
    });
  }

  OnColorGradientMouseDown(event: MouseEvent) {
    document.body.style.userSelect = 'none';
    this.isSelecting.set(true);
    const onMove = (event: MouseEvent) => {
      const gradient = this.menu.nativeElement.querySelector("#color-picker-gradient");
      if (!gradient) {
        return;
      }
      const rect = gradient.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const x = Math.min(Math.max(event.clientX - rect.left, 0), width);
      const y = Math.min(Math.max(event.clientY - rect.top, 0), height);
      this.SetGradient(x, y);
    };
    const onUp = () => {
      document.body.style.userSelect = '';
      this.isSelecting.set(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    onMove(event);
  }

  SetGradient(x: number, y: number) {
    const gradient = this.menu.nativeElement.querySelector("#color-picker-gradient");
      if (!gradient) {
        return;
      }
    const rect = gradient.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const wrG = (1 - (x / width));
    const wbG = (1 - (y / height));

    const c = {...this.gradBaseHSV()};
    c.v = Math.min(Math.max(wbG * 100, 0), 100);
    c.s = Math.min(Math.max(100 - (wrG * 100), 0), 100);
    this.gradBaseHSV.set(c);
    this.selector = {x, y};
  }

  ToRGBA() {
    const c = this.value();
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
  }

  SetOpacitySliderPos() {
    const slider = this.opacitySlider.nativeElement;
    if (!slider) {
      return;
    }
    setTimeout(() => {
      const w = slider.getBoundingClientRect();
      if (this.value) {
        this.opacitySliderPos = this.value().a * w.width;
      }
    })
  }

  SetGradientSliderPos() {
    if (this.value === null) {
      return;
    }
    const h = this.gradBaseHSV().h;
    const height = this.gradientSlider.nativeElement.getBoundingClientRect().height;
    const top = (h / 360) * height;
    this.gradientSliderPos = top;
  }

  SetGradientSelectorPos() {
    setTimeout(() => {
      const gradient = this.menu.nativeElement.querySelector("#color-picker-gradient");
      if (!gradient) {
        return;
      }
      const rect = gradient.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const c = this.gradBaseHSV();
      const x = ((c.s / 100)) * width;
      const y = (1 - (c.v / 100)) * height;
      this.selector = {x, y};
    });
  }

  OnOpacitySliderMouseDown(event: MouseEvent) {
    document.body.style.userSelect = 'none';
    this.isSelecting.set(true);
    const onMove = (event: MouseEvent) => {
      if (!this.value) {
        return;
      }
      const rect = this.opacitySlider.nativeElement.getBoundingClientRect();
      const left = event.clientX;
      const offset = left - rect.left;
      this.opacitySliderPos = Math.min(Math.max(offset, 0), rect.width);
      const base = {...this.gradBaseHSV()}
      base.a = Math.min(Math.max(parseFloat((offset / rect.width).toPrecision(2)), 0), 1);
      this.gradBaseHSV.set(base);
    };
    const onUp = () => {
      document.body.style.userSelect = '';
      this.isSelecting.set(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    onMove(event);
  }

  OnGradientSliderMouseDown(event: MouseEvent) {
    document.body.style.userSelect = 'none';
    this.isSelecting.set(true);
    const onMove = (event: MouseEvent) => {
      const rect = this.gradientSlider.nativeElement.getBoundingClientRect();
      const top = event.clientY;
      const offset = (top - rect.top);
      this.gradientSliderPos = Math.min(Math.max(offset, 0), rect.height);
      const hslDiv =  360 / rect.height;
      const val  = this.gradientSliderPos * hslDiv;
      const base = {...this.gradBaseHSV()}
      base.h = Math.max(Math.min(val, 360), 0);
      this.gradBaseHSV.set(base);
    };
    const onUp = () => {
      document.body.style.userSelect = '';
      this.isSelecting.set(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    onMove(event);
  }

  protected Save() {
    this.subscriber?.next(this.value());
    this.subscriber?.complete();
    this.subscriber = null;
    this.isColorPickerOpen.set(false);
  }

  protected Cancel() {
    if (this.initialColor) {
      this.subscriber?.next(this.initialColor);
    }
    this.subscriber?.complete();
    this.subscriber = null;
    this.initialColor = null;
    this.isColorPickerOpen.set(false);
  }
}
