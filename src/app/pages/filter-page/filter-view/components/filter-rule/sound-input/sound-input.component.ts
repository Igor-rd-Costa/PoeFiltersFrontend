import { Component, ElementRef, model, ViewChild } from '@angular/core';
import { DropSound } from '../../../../../../services/FilterService';
import { FilterViewComponent } from '../../../filter-view.component';
import { SoundMenuViewMode } from '../../../components/sound-menu/sound-menu.component';

@Component({
  selector: 'app-sound-input',
  standalone: true,
  imports: [],
  templateUrl: './sound-input.component.html',
  styles: `
    :host {
      width: 100%;
    }

    .selecting-volume #sound-input-volume-menu-volume-button {
      @apply bg-main
    }
  `
})
export class SoundInputComponent {
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  sound = model.required<DropSound>();
  SwitchActive() {
    this.sound().active = !this.sound().active;
  }

  OpenVolumeMenu() {
    FilterViewComponent.SoundMenu()?.Show(this.menu.nativeElement, SoundMenuViewMode.VOLUME, this.sound).subscribe(volume => {
      if (!this.sound().active) {
        this.sound().active = true;
      }
      this.sound().volume = volume;
    });
  }

  OpenSoundMenu() {
    FilterViewComponent.SoundMenu()?.Show(this.menu.nativeElement, SoundMenuViewMode.SOUND, this.sound).subscribe(sound => {
      if (!this.sound().active) {
        this.sound().active = true;
      }
      this.sound().sound = sound;
    });
  }

  PlaySelectedSound() {
    FilterViewComponent.SoundMenu()?.PlaySound(this.sound().sound - 1);
  }
}
