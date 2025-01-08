import { Component, ElementRef, ModelSignal, signal, ViewChild } from '@angular/core';
import { DropPlayEffect, IconColor, iconColors } from '../../../../../services/FilterService';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-play-effect-menu',
  standalone: true,
  imports: [],
  templateUrl: './play-effect-menu.component.html',
})
export class PlayEffectMenuComponent {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  protected isVisible = signal<boolean>(false);
  protected pos = {x: 0, y: 0};
  protected selected: ModelSignal<DropPlayEffect>|null = null;
  protected subscriber: Subscriber<any>|null = null;
  protected colors = iconColors;

  Show(target: HTMLElement, selected: ModelSignal<DropPlayEffect>) {
    const rect = target.getBoundingClientRect();
    this.pos.x = rect.left;
    this.pos.y = rect.top + rect.height;
    this.selected = selected;
    this.isVisible.set(true);

    const onDocMouseDown = (event: MouseEvent) => {
      if (this.menu.nativeElement.contains(event.target as HTMLElement)) {
        return;
      }
      this.selected = null;
      this.isVisible.set(false);
      this.pos = {x: 0, y: 0};
      document.removeEventListener('mousedown', onDocMouseDown);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return new Observable<IconColor>(subscriber => {
      this.subscriber = subscriber;
    });
  }

  protected SelectColor(color: IconColor) {
    this.subscriber?.next(color);
  }

  protected GetBackgroundColor(color: IconColor) {
    switch (color) {
      case 'Blue': return "#104aa8";
      case 'Green': return "#1b9a13";
      case 'Brown': return "#9b2301";
      case 'Red': return "#fe0d23";
      case 'White': return "#bbcbcf";
      case 'Yellow': return "#ad7a27";
      case 'Cyan': return "#0ea2b7";
      case 'Grey': return "#1d1d1d";
      case 'Orange': return "#f88c00";
      case 'Pink': return "#f36be2";
      case 'Purple': return "#4c0ea2";
    }
  }
}
