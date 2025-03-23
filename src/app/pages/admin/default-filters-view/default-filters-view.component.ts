import { AfterViewInit, Component, signal } from '@angular/core';
import { DefaultFilter, DefaultFilterService } from '../../../services/DefaultFilterService';
import { FilterStrictness } from '../../../types/FilterTypes';
import { FilterSectionComponent } from '../../../components/filter-section/filter-section.component';
import { GetStrictnessString } from '../../../utils/Helpers';
import { parse } from 'uuid';

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
export class DefaultFiltersViewComponent implements AfterViewInit {
  FilterStrictness = FilterStrictness;
  strictnessElement: HTMLElement|null = null;
  availableStrictnesses: FilterStrictness[] = [];
  defaultFilter = signal<DefaultFilter|null>(null);

  public constructor(private defaultFilterService: DefaultFilterService) {}

  async ngAfterViewInit() {
    this.availableStrictnesses = await this.defaultFilterService.GetAvailableStrictnesses();
  }

  async SelectStrictness(event: MouseEvent) {
    if (event.currentTarget === null) {
      return;
    }
    const t = event.currentTarget as HTMLElement;
    const strictnessStr = t.getAttribute("strictness");
    if (strictnessStr === null) {
      return;
    }
    const strictness = parseInt(strictnessStr) as FilterStrictness;
    if (this.strictnessElement !== null) {
      if (this.strictnessElement === t) {
        return;
      }
      this.strictnessElement.classList.remove('selected');
    }
    this.strictnessElement = t;
    t.classList.add('selected');

    const df = await this.defaultFilterService.GetDefaultFilter(strictness);
    this.defaultFilter.set(df);
  }

  SaveDefaultFilter() {
    
  }

  protected GetStrictnesses() {
    const array = new Array<FilterStrictness>(FilterStrictness.MAX_VALUE - 1);
    for (let i = 0; i < FilterStrictness.MAX_VALUE; i++) {
      array[i] = i;
    }
    return array;
  }

  protected GetStrictnessString = GetStrictnessString;
}
