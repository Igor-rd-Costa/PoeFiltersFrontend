import { Component, ElementRef, model, ModelSignal, ViewChild } from '@angular/core';
import { DropPlayEffect, IconColor } from '../../../types/FilterTypes';
import { FilterViewComponent } from '../../../pages/filter-page/filter-view/filter-view.component';

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
  playEffect = model.required<DropPlayEffect|null>();

  SwitchActive() {
    this.playEffect.update(playEffect => {
      if (playEffect === null) {
        return {
          active: true,
          color: 'Blue',
          temp: false
        }
      }
      playEffect.active = true;
      return playEffect;
    });
  }

  GetSelectedColor() {
    if (this.playEffect() === null) {
      return '#000';
    }
    switch (this.playEffect()!.color) {
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
    const playEffect = this.playEffect();
    if (playEffect === null) {
      return;
    }
    if (!playEffect.active) {
      playEffect.active = true;
    }
    playEffect.temp = !playEffect.temp;
  }

  ShowColorMenu() {
    const playEffect = this.playEffect();
    if (playEffect === null) {
      return;
    }
    FilterViewComponent.PlayEffectMenu()?.Show(this.menu.nativeElement, this.playEffect as ModelSignal<DropPlayEffect>).subscribe(val => {
      if (!playEffect.active) {
        playEffect.active = true;
      }
      playEffect.color = (val as IconColor);
    });
  }
}
