import { Component, ElementRef, ModelSignal, signal, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { iconColors, iconShapes, iconSizes } from '../../../../../services/FilterService';
import { DropIcon, IconColor, IconShape, IconSize } from '../../../../../types/FilterTypes';

export enum IconOptionsMenuViewMode {
  SHAPE, SIZE, COLOR,
}

export type SelectedIcon = {
  shape: IconShape,
  size: IconSize,
  color: IconColor
}

@Component({
  selector: 'app-icon-options-menu',
  standalone: true,
  imports: [],
  templateUrl: './icon-options-menu.component.html',
})
export class IconOptionsMenuComponent {
  ViewMode = IconOptionsMenuViewMode;
  @ViewChild('menu') protected menu!: ElementRef<HTMLElement>;
  protected isVisible = signal<boolean>(false);
  protected viewMode = signal<IconOptionsMenuViewMode>(IconOptionsMenuViewMode.SHAPE);
  protected pos = {x: 0, y: 0};
  protected subscriber: Subscriber<IconShape|IconColor|IconSize>|null = null;
  protected selected: ModelSignal<DropIcon>|null = null;
  protected sizes = iconSizes;
  protected shapes = iconShapes;
  protected colors = iconColors;

  Show(target: HTMLElement, viewMode: IconOptionsMenuViewMode, selected: ModelSignal<DropIcon>) {
    const rect = target.getBoundingClientRect();
    let top = rect.top + 48;
    let left = rect.left;
    this.isVisible.set(true);
    this.selected = selected;
    this.viewMode.set(viewMode);
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
      if (event.target === null || this.menu.nativeElement.contains(event.target as HTMLElement)) {
        return;
      }
      this.isVisible.set(false);
      this.subscriber?.complete();
      this.subscriber = null;
      this.selected = null;
      document.removeEventListener('mousedown', onDocMouseDown);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return new Observable<IconShape|IconColor|IconSize>(subscriber => {
      this.subscriber = subscriber;
    });
  }

  protected SelectShape(shape: IconShape) {
    this.subscriber?.next(shape); 
  }

  protected SelectSize(size: IconSize) {
    this.subscriber?.next(size);
  }

  protected SelectColor(color: IconColor) {
    this.subscriber?.next(color);
  }

  protected GetSelectedIconXPos() {
    if (this.selected === null) {
      return 0;
    }
    let i = 0;
    for (; i < iconColors.length; i++) {
      if (iconColors[i] === this.selected().color) {
        break;
      }
    }
    return (-24 * i);
  }

  protected GetSelectedIconYPos() {
    if (this.selected === null) {
      return 0;
    }
    let i = 0;
    for (; i < iconShapes.length; i++) {
      if (iconShapes[i] === this.selected().shape) {
        break;
      }
    }
    return (-24 * 3 * i);
  }
}
