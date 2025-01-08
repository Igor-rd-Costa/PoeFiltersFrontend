import { Component, ElementRef, model, ViewChild } from '@angular/core';
import { DropPlayEffect, IconColor } from '../../../../../../services/FilterService';
import { FilterViewComponent } from '../../../filter-view.component';

@Component({
  selector: 'app-play-effect-input',
  standalone: true,
  imports: [],
  templateUrl: './play-effect-input.component.html',
  styles: `
    :host {
      width: 100%;
    }
  `
})
export class PlayEffectInputComponent {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  playEffect = model.required<DropPlayEffect>();

  SwitchActive() {
    this.playEffect().active = !this.playEffect().active;
  }

  GetSelectedColor() {
    switch (this.playEffect().color) {
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

  ToggleTemp() {
    if (!this.playEffect().active) {
      this.playEffect().active = true;
    }
    this.playEffect().temp = !this.playEffect().temp;
  }

  ShowColorMenu() {
    FilterViewComponent.PlayEffectMenu()?.Show(this.menu.nativeElement, this.playEffect).subscribe(val => {
      if (!this.playEffect().active) {
        this.playEffect().active = true;
      }
      this.playEffect().color = (val as IconColor);
    });
  }
}
