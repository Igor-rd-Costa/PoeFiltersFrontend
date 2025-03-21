import { AfterViewInit, Component, ElementRef, Input, model, signal, ViewChild } from '@angular/core';
import { FilterRuleComponent } from '../filter-rule/filter-rule.component';
import { FilterService } from '../../services/FilterService';
import { GetHTMLContentHeight } from '../../utils/Helpers';
import { AuthService } from '../../services/AuthService';
import { FilterRuleBlockComponent } from "../filter-rule-block/filter-rule-block.component";
import { ItemCategoryService } from '../../services/ItemCategoryService';
import { BlockSettingsFormComponent } from "./block-settings-form/block-settings-form.component";
import { FilterBlock, FilterRuleBlock, FilterRule } from '../../types/FilterTypes';
import FilterHelpers from '../../utils/FilterHelpers';

@Component({
  selector: 'app-filter-block',
  standalone: true,
  imports: [FilterRuleComponent, FilterRuleBlockComponent, BlockSettingsFormComponent],
  templateUrl: './filter-block.component.html',
  styles: `
    :host {
      width: 100%;
    }

    .hovered {
      @apply bg-mainBright;
    }

    .active > div {
      background-color: #AAAF;
    }
  `
})
export class FilterBlockComponent implements AfterViewInit {
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  @Input() editable: boolean = false;
  block = model.required<FilterBlock>();
  protected isExpanded = signal<boolean>(false);
  protected isInEditMode = signal<boolean>(false);

  constructor(private filterService: FilterService, private itemCategoryService: ItemCategoryService, protected authService: AuthService) {}

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
    if (this.wrapper == undefined) {
      return;
    }
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

  CastToRule(rule: FilterRule|FilterRuleBlock) {
    return rule as FilterRule;
  }

  CastToRuleBlock(ruleBlock: FilterRule|FilterRuleBlock) {
    return ruleBlock as FilterRuleBlock;
  }

  OnDragStart() {
    this.filterService.DragDrop(this.block());
  }

  OnDragOver(event: DragEvent) {
    event.preventDefault();
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLElement;
    if (t.id === "filter-rule-drag-target") {
      t.classList.add('active');
    }
  }

  OnMouseLeave(event: MouseEvent) {
    if (!event.target) {
      return;
    }
    const t = event.target as HTMLElement;
    t.classList.remove('active');
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
    this.block().rules.push(FilterHelpers.CreateRule(this.block().rules.length));
  }

  CreateRuleBlock() {
    this.block().rules.push(FilterHelpers.CreateRuleBlock(this.block().rulesType, this.block().rules.length));
  }

  async EditBlock(event: MouseEvent) {
    event.stopPropagation();
    if (!this.isExpanded()) {
      await this.ToggleExpand();
    }
    this.isInEditMode.set(true);
  }

  Delete() {
    //this.filterService.DeleteBlock(this.block().id);
  }

  OnSettingsClose() {
    this.isInEditMode.set(false);
  }
}
