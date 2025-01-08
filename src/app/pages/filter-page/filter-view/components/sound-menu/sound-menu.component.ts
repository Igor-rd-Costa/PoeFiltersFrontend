import { Component, ElementRef, ModelSignal, signal, ViewChild } from '@angular/core';
import { DropSound, dropSounds } from '../../../../../services/FilterService';
import { Observable, Subscriber } from 'rxjs';

export enum SoundMenuViewMode {
  VOLUME, SOUND
}

@Component({
  selector: 'app-sound-menu',
  standalone: true,
  imports: [],
  templateUrl: './sound-menu.component.html',
})
export class SoundMenuComponent {
  ViewMode = SoundMenuViewMode;
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;
  protected isVisible = signal<boolean>(false);
  protected pos = {x: 0, y: 0};
  protected selected: ModelSignal<DropSound>|null = null;
  protected subscriber: Subscriber<number>|null = null;
  protected volumePos = 0;
  protected sounds = dropSounds; 
  protected view = signal<SoundMenuViewMode>(SoundMenuViewMode.VOLUME);

  Show(target: HTMLElement, view: SoundMenuViewMode, selected: ModelSignal<DropSound>) {
    const rect = target.getBoundingClientRect();
    this.pos.x = rect.left;
    this.pos.y = rect.top + rect.height;
    this.selected = selected;
    this.isVisible.set(true);
    this.view.set(view);

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
    return new Observable<number>(subscriber => {
      this.subscriber = subscriber;
    });
  }

  protected OnVolumeMenuMouseDown(event: MouseEvent) {
    document.body.style.userSelect = 'none';
    this.menu.nativeElement.classList.add("selecting-volume");
    const volBar = this.menu.nativeElement.querySelector("#sound-input-volume-menu-volume-bar");
    const onMove = (event: MouseEvent) => {
      if (!volBar) {
        return;
      }
      const rect = volBar.getBoundingClientRect();
      const w = rect.width;
      const offset = Math.max(Math.min(event.clientX - rect.left, w), 0);
      const vDelta = 300 / w;
      this.subscriber?.next(Math.floor(vDelta * offset));
      this.volumePos = offset;
    };
    const onUp = () => {
      document.body.style.userSelect = '';
      this.menu.nativeElement.classList.remove("selecting-volume");
      this.PlaySelectedSound();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    onMove(event);
  }

  protected SelectSound(sound: number) {
    this.subscriber?.next(sound);
    this.PlaySound(sound - 1);
  }

  protected PlaySelectedSound() {
    console.log("A", this.selected);
    if (this.selected) {
      this.PlaySound(this.selected().sound);
    }
  }

  protected OnPlaySoundClick(event: MouseEvent, sound: number) {
    event.stopPropagation();
    this.PlaySound(sound);
  } 

  private isPlaying: boolean = false;
  PlaySound(sound: number) {
    const soundInfo = dropSounds[sound];
    if (soundInfo && !this.isPlaying) {
      this.isPlaying = true;
      const audio = new Audio('./sounds/'+soundInfo.file+'.mp3');
      audio.addEventListener('ended', (e: Event) => {
        this.isPlaying = false;
      });
      audio.play();
    }
  }
}
