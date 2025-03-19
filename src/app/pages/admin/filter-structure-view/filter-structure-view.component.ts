import { AfterViewInit, Component, signal } from '@angular/core';
import { AppView, ViewService } from '../../../services/ViewService';
import { FilterStructureService } from '../../../services/FilterStructureService';
import { FilterSectionComponent } from '../../../components/filter-section/filter-section.component';
import { FilterBlockStructureComponent } from "../../../components/structure/filter-block-structure/filter-block-structure.component";
import { FilterSectionStructureComponent } from '../../../components/structure/filter-section-structure/filter-section-structure.component';
import { FilterStructure } from '../../../types/FilterStructureTypes';
import { FilterStructureHelpers } from '../../../utils/FilterStructureHelpers';

@Component({
  selector: 'app-filter-structure-view',
  standalone: true,
  imports: [FilterSectionComponent, FilterBlockStructureComponent, FilterSectionStructureComponent],
  templateUrl: './filter-structure-view.component.html',
})
export class FilterStructureViewComponent implements AfterViewInit {
  protected filterStructure = signal<FilterStructure|null>(null);

  public constructor(private filterStructureService: FilterStructureService, private viewService: ViewService) {}

  async ngAfterViewInit() {
    const filterStructure = await this.filterStructureService.FilterStructure();
    if (filterStructure === null) {
      this.viewService.SetView(AppView.USER_FILTERS);
      return;
    }
    this.filterStructure.set(filterStructure);
  }
  
  CreateSection() {
    const fs = this.filterStructure();
    if (!fs) {
      return;
    }
    fs.sections.push(FilterStructureHelpers.CreateSection(fs.sections.length));
  }

  SaveStructure(event: MouseEvent) {
    event.preventDefault();
    const fs = this.filterStructure();
    if (fs === null) {
      return;
    }
    this.filterStructureService.Save(fs);
  }

  TestStructure(event: MouseEvent) {
    event.preventDefault();
    this.filterStructureService.Test();
  }

  ResetStructure(event: MouseEvent) {
    event.preventDefault();
    this.filterStructureService.Reset();
  }


  OnSectionDelete(id: string) {
    const fs = this.filterStructure();
    if (!fs || fs.sections.length === 1) {
      return;
    }
    for (let i = 0; i < fs.sections.length; i++) {
      if (fs.sections[i].id === id) {
        fs.sections.splice(i, 1);
        return;
      }
    }
  }
}
