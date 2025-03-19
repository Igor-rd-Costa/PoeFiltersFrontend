import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { FilterStructure } from "../types/FilterStructureTypes";

@Injectable({
  providedIn: 'root'
})
export class FilterStructureService {
  private backend = AppComponent.Backend() + "poe2/filter-structure";
  private structure = signal<FilterStructure|null>(null);
  constructor(private http: HttpClient) {}

  async FilterStructure() {
    let fs = this.structure();
    if (fs !== null) {
      return fs;
    }
    fs = await this.GetFilterStructure();
    this.structure.set(fs);
    return fs;
  }

  private GetFilterStructure() {
    return new Promise<FilterStructure|null>(resolve => {
      this.http.get<FilterStructure>(this.backend, {withCredentials: true}).subscribe({
        next: filterStructure => {
          resolve(filterStructure);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      })
    });
  }

  Save(structure: FilterStructure) {
    return new Promise<void>(resolve => {
      console.log("Saving", structure);
      this.http.post<FilterStructure>(this.backend, structure, {withCredentials: true}).subscribe({
        next: _ => {
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      });
    });
  }

  Reset() {
    return new Promise<void>(resolve => {
      console.log("Reset", this.backend)
      this.http.delete(this.backend, {withCredentials: true}).subscribe({
        next: _ => {
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      });
    });
  }

  Test() {
    return new Promise<void>(resolve => {
      console.log("Reset", this.backend)
      this.http.patch(this.backend, {}, {withCredentials: true}).subscribe({
        next: _ => {
          resolve();
        },
        error: err => {
          console.error(err);
          resolve();
        }
      });
    });
  }
}