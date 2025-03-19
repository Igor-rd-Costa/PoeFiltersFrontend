import { Component, ElementRef, model, ModelSignal, ViewChild } from '@angular/core';
import { DropSound } from '../../../types/FilterTypes';
import { FilterViewComponent } from '../../../pages/filter-page/filter-view/filter-view.component';
import { SoundMenuViewMode } from '../../../pages/filter-page/filter-view/components/sound-menu/sound-menu.component';

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
  sound = model.required<DropSound|null>();
  SwitchActive() {
    this.sound.update(sound => {
      if (sound == null) {
        return {
          active: true,
          volume: 300,
          positional: false,
          sound: 0,
        }
      }
      sound.active = true;
      return sound;
    })
  }

  OpenVolumeMenu() {
    const sound = this.sound();
    if (sound == null) {
      return;
    }
    FilterViewComponent.SoundMenu()?.Show(this.menu.nativeElement, SoundMenuViewMode.VOLUME, this.sound as ModelSignal<DropSound>).subscribe(volume => {
      if (!sound.active) {
        sound.active = true;
      }
      sound.volume = volume;
    });
  }

  OpenSoundMenu() {
    const soundM = this.sound();
    if (soundM == null) {
      return;
    }
    FilterViewComponent.SoundMenu()?.Show(this.menu.nativeElement, SoundMenuViewMode.SOUND, this.sound as ModelSignal<DropSound>).subscribe(sound => {
      if (!soundM.active) {
        soundM.active = true;
      }
      soundM.sound = sound;
    });
  }

  PlaySelectedSound() {
    if (this.sound() == null) {
      return;
    }
    FilterViewComponent.SoundMenu()?.PlaySound(this.sound()!.sound - 1);
  }
}
