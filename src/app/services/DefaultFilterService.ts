import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { FilterSection, FilterStrictness } from "../types/FilterTypes";
import { FilterBase } from "../types/FilterBaseTypes";

export type DefaultFilter = FilterBase & {
  strictness: FilterStrictness,
  sections: FilterSection[],
  structureVersion: number,
}

@Injectable({
  providedIn: 'root'
})
export class DefaultFilterService {
  private backend = AppComponent.GameBackend() + 'default-filters/';
  private defaultFilters = signal<DefaultFilter[]>([]);

  public constructor(private http: HttpClient) {}

  public GetDefaultFilter(strictness: FilterStrictness) {
    return new Promise<DefaultFilter|null>(async resolve => {
      const defaultFilters = this.defaultFilters();
      for (let i = 0; i < defaultFilters.length; i++) {
        if (defaultFilters[i].strictness === strictness) {
          let df: DefaultFilter|null = defaultFilters[i];
          const version = await this.GetDefaultFilterVersion(strictness);
          if (df.structureVersion !== version) {
            df = await this.Get(strictness);
            if (df !== null) {
              defaultFilters[i] = df;
            }
            resolve(df);
            return;
          }
          resolve(defaultFilters[i]);
          return;
        }
      }
      const df = await this.Get(strictness);
      if (df !== null) {
        defaultFilters.push(df);
      }
      resolve(df);
    });
  }

  private Get(strictness: FilterStrictness) {
    return new Promise<DefaultFilter|null>(resolve => {
      this.http.get<DefaultFilter|null>(this.backend + `?strictness=${strictness}`, {withCredentials: true}).subscribe({
        next: defaultFilter => {
          if (defaultFilter === null) {
            resolve(null);
            return;
          }
          resolve(defaultFilter);
        },
        error: err => {
          console.error(err);
          resolve(null);
        }
      });
    });
  }

  private GetDefaultFilterVersion(strictness: FilterStrictness) {
    return new Promise<number>(resolve => {
      this.http.get<number>(this.backend + `version?strictness=${strictness}`, {withCredentials: true}).subscribe({
        next: version => {
          resolve(version);
        },
        error: err => {
          console.error(err);
          resolve(0);
        }
      })
    });
  }
}