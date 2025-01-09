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

  Save() {
    return this.filterService.Save();
  }
  
  Download() {
    return this.filterService.Download();
  }

  async SaveAndDownload() {
    await this.Save();
    this.Download();
  }
}
