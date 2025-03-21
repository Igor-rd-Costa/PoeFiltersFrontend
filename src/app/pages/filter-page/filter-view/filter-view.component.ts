import { AfterViewInit, Component, computed, ViewChild } from '@angular/core';
import { FilterService } from '../../../services/FilterService';
import { ColorPickerMenuComponent } from "./components/color-picker/color-picker.component";
import { IconOptionsMenuComponent } from "./components/icon-options-menu/icon-options-menu.component";
import { SoundMenuComponent } from "./components/sound-menu/sound-menu.component";
import { PlayEffectMenuComponent } from "./components/play-effect-menu/play-effect-menu.component";
import { AuthService } from '../../../services/AuthService';
import { FilterSectionComponent } from '../../../components/filter-section/filter-section.component';


@Component({
  selector: 'app-filter-view',
  standalone: true,
  imports: [FilterSectionComponent, ColorPickerMenuComponent, IconOptionsMenuComponent, SoundMenuComponent, PlayEffectMenuComponent],
  templateUrl: './filter-view.component.html',
})
export class FilterViewComponent implements AfterViewInit {
  @ViewChild(ColorPickerMenuComponent) colorPicker!: ColorPickerMenuComponent;
  @ViewChild(IconOptionsMenuComponent) iconMenu!: IconOptionsMenuComponent;
  @ViewChild(SoundMenuComponent) soundMenu!: SoundMenuComponent;
  @ViewChild(PlayEffectMenuComponent) playEffectMenu!: PlayEffectMenuComponent;
  private static colorPicker: ColorPickerMenuComponent|null = null;
  private static iconMenu: IconOptionsMenuComponent|null = null;
  private static soundMenu: SoundMenuComponent|null = null;
  private static playEffectMenu: PlayEffectMenuComponent|null = null;
  protected sections = computed(() => {
    return this.filterService.Filter()?.sections ?? [];
  });
  constructor(protected filterService: FilterService, protected authService: AuthService) {}

  ngAfterViewInit(): void {
    FilterViewComponent.colorPicker = this.colorPicker;
    FilterViewComponent.iconMenu = this.iconMenu;
    FilterViewComponent.soundMenu = this.soundMenu;
    FilterViewComponent.playEffectMenu = this.playEffectMenu;
  }

  CreateSection() {
    //this.filterService.CreateSection();
  }

  protected GetTemplateRows() {
    return `repeat(${this.sections.length + 1}, auto) 1fr`
  }

  static ColorPicker() {
    return FilterViewComponent.colorPicker;
  }

  static IconMenu() {
    return FilterViewComponent.iconMenu;
  }

  static SoundMenu() {
    return FilterViewComponent.soundMenu;
  }

  static PlayEffectMenu() {
    return FilterViewComponent.playEffectMenu;
  }
}
