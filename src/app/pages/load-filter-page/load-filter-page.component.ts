import { AfterViewInit, Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { FilterData, FilterService } from '../../services/FilterService';
import { AppView, ViewService } from '../../services/ViewService';
import { GetHTMLContentHeight } from '../../utils/helpers';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-load-filter-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './load-filter-page.component.html',
})
export class LoadFilterPageComponent implements AfterViewInit {
  @ViewChild("createWrapper") createWrapper!: ElementRef<HTMLElement>;
  protected isCreateFilterVisible = signal<boolean>(false);
  protected createFilterForm = new FormGroup({
    name: new FormControl("", [Validators.required])
  });
  protected filters: FilterData[] = [];

  constructor(private filterService: FilterService, private viewService: ViewService, protected authService: AuthService) {
    effect(() => {
      const logged = this.authService.IsLogged();
      if (logged) {
        this.filterService.GetFiltersInfo().then(filters => {
          this.filters = filters;
        });
      }
    });
  }
  
  async ngAfterViewInit() {
    
  }

  GetTimeDif(date: Date) {
    const now = new Date(Date.now());
    const zero = new Date(0);
    const dif = new Date(now.getTime() - date.getTime())
    const dDif = ((dif.getUTCFullYear() - zero.getUTCFullYear()) * 365) + ((dif.getUTCMonth() - zero.getUTCMonth()) * 30) + ((dif.getUTCDate() - zero.getUTCDate())); 
    if (dDif > 0) {
      return `${dDif} day${dDif > 1 ? 's' : ''} ago`;
    }
    const hDif = (dif.getUTCHours() - zero.getUTCHours())
    if (hDif > 0) {
      return `${hDif} hour${hDif > 1 ? 's' : ''} ago`;
    }
    let mDif = (dif.getUTCMinutes() - zero.getUTCMinutes());
    if (mDif > 0) {
      return `${hDif} minute${hDif > 1 ? 's' : ''} ago`;
    }
    let sDif = (dif.getUTCSeconds() - zero.getUTCSeconds());
    return `${sDif} second${sDif > 1 ? 's' : ''} ago`;
  }

  ShowCreateFilterForm() {
    if (this.isCreateFilterVisible()) {
      return;
    }
    this.isCreateFilterVisible.set(true);
    const animationDuration = 150;
    const icon = this.createWrapper.nativeElement.querySelector("#filter-create-icon") as HTMLElement|null;
    const form = this.createWrapper.nativeElement.querySelector("#filter-create-form") as HTMLElement|null;
    if (form) {
      form.style.display = "grid";
    }
    const innerH = GetHTMLContentHeight(this.createWrapper.nativeElement);
    this.createWrapper.nativeElement.animate([{height: "6rem"}, {height: innerH + "px"}], {duration: animationDuration});
    icon?.animate([{opacity: "1"}, {opacity: "0"}], {fill: 'forwards', duration: animationDuration}).addEventListener('finish', () => {
      if (icon) {
        icon.style.display = "none";
      }
      this.createWrapper.nativeElement.style.height = "fit-content";
      if (form) {
        form.style.display = "grid"; 
      }
      form?.animate([{opacity: 0}, {opacity: 1}], {fill: 'forwards', duration: animationDuration});
    });
  }

  CancelCreateFilter(event: MouseEvent) {
    event.stopPropagation();
    if (!this.isCreateFilterVisible()) {
      return;
    }
    const animationDuration = 150;
    const icon = this.createWrapper.nativeElement.querySelector("#filter-create-icon") as HTMLElement|null;
    const form = this.createWrapper.nativeElement.querySelector("#filter-create-form") as HTMLElement|null;
    const innerH = GetHTMLContentHeight(this.createWrapper.nativeElement);
    form?.animate([{opacity: 1}, {opacity: 0}], {fill: 'forwards', duration: animationDuration}).addEventListener('finish', () => {
      if (form) {
        form.style.display = "none";
      }
      if (icon) {
        icon.style.display = "block";
      }
      icon?.animate([{opacity: "0"}, {opacity: "1"}], {fill: 'forwards', duration: animationDuration})
      this.createWrapper.nativeElement.animate([{height: innerH + "px"}, {height: "6rem"}], {duration: animationDuration})
      .addEventListener('finish', () => {
        this.createWrapper.nativeElement.style.height = "6rem";
        this.isCreateFilterVisible.set(false);
      });
    
    });
  }

  async CreateFilter(event: SubmitEvent) {
    event.preventDefault();
    if (!this.createFilterForm.valid || !this.authService.IsLogged()) {
      return;
    }
    if (await this.filterService.CreateFilter(this.createFilterForm.controls.name.value!)) {
      this.viewService.SetView(AppView.FILTER_VIEW);
    }
  }

  async LoadFilter(id: string) {
    if (await this.filterService.LoadFilter(id)) {
      this.viewService.SetView(AppView.FILTER_VIEW);
    }
  }

  async DeleteFilter(event: MouseEvent, id: string) {
    event.stopPropagation();
    const result = await this.filterService.DeleteFilter(id);
    if (result) {
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].id === id) {
          this.filters.splice(i, 1);
          break;
        }
      }
    }
  }

  Login() {
    this.authService.Login();
  }
}
