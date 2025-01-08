import { AfterViewInit, Component, effect, ElementRef, model, signal, ViewChild } from '@angular/core';
import { FilterRuleComponent } from '../filter-rule/filter-rule.component';
import { FilterBlockInfo, FilterService } from '../../../../../services/FilterService';
import { ItemCategory, ItemService } from '../../../../../services/ItemService';
import { GetHTMLContentHeight } from '../../../../../utils/helpers';

@Component({
  selector: 'app-filter-block-wrapper',
  standalone: true,
  imports: [FilterRuleComponent],
  templateUrl: './filter-block-wrapper.component.html',
  styles: `
    :host {
      width: 100%;
    }

    .hovered {
      @apply bg-mainBright;
    }
  `
})
export class FilterBlockWrapperComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  block = model.required<FilterBlockInfo>();
  protected isExpanded = signal<boolean>(false);
  protected isInEditMode = signal<boolean>(false);
  baseTypeCategories: ItemCategory[] = [];

  constructor(private filterService: FilterService, private itemService: ItemService) {
    effect(() => {
      if (this.isInEditMode()) {
        this.GetBaseTypeCategories();
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.isExpanded()) {
      this.ShrinkHeading().then(() => {
        const content = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-content");
        const h = `${GetHTMLContentHeight(content as HTMLElement)}px`;
        content?.animate([{height: "0px"}, {height: h}], {duration: 150}).addEventListener('finish', () => {
          (content as HTMLElement).style.height = "fit-content";
          this.isExpanded.set(true);
        });
      });
    }
  }

  OnHover() {
    const bottom = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-bottom");
    const top = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-top");
    bottom?.classList.add("hovered");
    top?.classList.add("hovered");
  }

  OnLeave(event: MouseEvent) {
    if (event.relatedTarget === null || ((event.relatedTarget as HTMLElement).closest("#filter-block-wrapper-heading-bottom") === null 
    && (event.relatedTarget as HTMLElement).closest("#filter-block-wrapper-heading-top") === null)
    && (event.relatedTarget as HTMLElement).closest("#filter-block-wrapper-heading-content") === null) {
      const bottom = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-bottom");
      const top = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-top");
      bottom?.classList.remove("hovered");
      top?.classList.remove("hovered");
    }
  }

  async ToggleExpand() {
    const content = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-content")
    if (!content) {
      return;
    }
    const expanded = this.isExpanded();
    const h = `${GetHTMLContentHeight(content as HTMLElement)}px`;
    if (!expanded) {
      await this.ShrinkHeading();
      content.animate([{height: "0px"}, {height: h}], {duration: 150}).addEventListener('finish', () => {
        (content as HTMLElement).style.height = "fit-content";
        this.isExpanded.set(true);
      });
    } else {
      if (this.isInEditMode()) {
        return;
      }
      content.animate([{height: h}, {height: "0rem"}], {duration: 150}).addEventListener('finish', async () => {
        (content as HTMLElement).style.height = "0px";
        await this.ExpandHeading();
        this.isExpanded.set(false);
      });
    }
  }

  ShrinkHeading() {
    return new Promise<void>(resolve => {
      const largeHeading = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-content");
      if (!largeHeading) {
        resolve();
        return;
      }
      const image = largeHeading.querySelector("#filter-block-wrapper-heading-image");
      image?.animate([{width: "3.5rem", height: "3.5rem"}, {width: "2rem", height: "2rem"}], {fill: 'forwards', duration: 100})
      largeHeading.animate([{fontSize: "1.8rem", top: "0.5rem"}, {fontSize: "1.1rem", top: "2px"}], {fill: 'forwards', duration: 100}).addEventListener('finish', () => {
      resolve();
      })
    });
  }
  
  ExpandHeading() {
    return new Promise<void>(resolve => {
      const largeHeading = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-heading-content");
      if (!largeHeading) {
        resolve();
        return;
      }
      const image = largeHeading.querySelector("#filter-block-wrapper-heading-image");
      image?.animate([{width: "2rem", height: "2rem"}, {width: "3.5rem", height: "3.5rem"}], {fill: 'forwards', duration: 100})
      largeHeading.animate([{fontSize: "1.1rem", top: "2px"}, {fontSize: "1.8rem", top: "0.5rem"}], {fill: 'forwards', duration: 100}).addEventListener('finish', () => {
        resolve();
      })
    });
  }

  CreateRule() {
    this.filterService.CreateRule(this.block().id);
  }

  async EditBlock(event: MouseEvent) {
    event.stopPropagation();
    if (!this.isExpanded()) {
      await this.ToggleExpand();
    }
    this.isInEditMode.set(true);
  }

  Delete() {
    this.filterService.DeleteBlock(this.block().id);
  }

  CancelEdit(event: MouseEvent) {
    event.stopPropagation();
    this.isInEditMode.set(false);
  }

  SaveBlockInfo(event: SubmitEvent) {
    event.preventDefault();
    const form = this.wrapper.nativeElement.querySelector("#filter-block-wrapper-edit-form") as HTMLElement|null;
    if (!form) {
      return;
    }
    const nameInput = form.querySelector("#filter-block-wrapper-edit-form-name-input") as HTMLInputElement|null;
    const imgInput = form.querySelector("#filter-block-wrapper-edit-form-img-input") as HTMLInputElement|null;

    const nameValue = nameInput?.value ?? this.block().name;
    const imgValue = imgInput?.value ?? this.block().imgSrc;

    this.block().name = nameValue;
    this.block().imgSrc = imgValue;
    this.isInEditMode.set(false);
  }





  //

  IsCategoryIncluded(category: ItemCategory) {
    for (let i = 0; i < this.block().allowedCategories.length; i++) {
      if (this.block().allowedCategories[i] === category.id) {
        return true;
      }
    }
    return false;
  }

  ToggleIncludedCategories(category: ItemCategory) {
    for (let i = 0; i < this.block().allowedCategories.length; i++) {
      if (this.block().allowedCategories[i] === category.id) {
        this.block().allowedCategories.splice(i, 1);
        return;
      }
    }
    this.block().allowedCategories.push(category.id);
  }

  async GetBaseTypeCategories() {
    this.baseTypeCategories = await this.itemService.GetItemCategories(false);
  }
}
