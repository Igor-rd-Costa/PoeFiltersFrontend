import { Component, signal } from '@angular/core';
import { DefaultFilter, DefaultFilterService } from '../../../services/DefaultFilterService';
import { FilterStrictness } from '../../../types/FilterTypes';
import { FilterSectionComponent } from '../../../components/filter-section/filter-section.component';

@Component({
  selector: 'app-default-filters-view',
  standalone: true,
  imports: [FilterSectionComponent],
  templateUrl: './default-filters-view.component.html',
  styles: `
    .selected {
      @apply border-mainBright;
      @apply text-mainBright;
    }
  `
})
export class DefaultFiltersViewComponent {
  FilterStrictness = FilterStrictness;
  strictnessElement: HTMLElement|null = null;
  defaultFilter = signal<DefaultFilter|null>(null);

  public constructor(private defaultFilterService: DefaultFilterService) {}

  async SelectStrictness(event: MouseEvent, strictness: FilterStrictness) {
    if (event.currentTarget === null) {
      return;
    }
    const t = event.currentTarget as HTMLElement;
    if (this.strictnessElement !== null) {
      if (this.strictnessElement === t) {
        return;
      }
      this.strictnessElement.classList.remove('selected');
    }
    this.strictnessElement = t;
    t.classList.add('selected');

    const df = await this.defaultFilterService.GetDefaultFilter(strictness);
    console.log("Got", df);
    this.defaultFilter.set(df);
  }

  SaveDefaultFilter() {
    
  }
}
