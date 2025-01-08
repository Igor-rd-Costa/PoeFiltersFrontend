import { Component } from '@angular/core';
import { FilterService } from '../../../services/FilterService';

@Component({
  selector: 'app-filter-export-view',
  standalone: true,
  imports: [],
  templateUrl: './filter-export-view.component.html',
})
export class FilterExportViewComponent {

  constructor(private filterService: FilterService) {}

  async SaveAndDownload() {
    await this.filterService.Save();
    this.filterService.Download();
  }

  Download() {
    this.filterService.Download();
  }
}
