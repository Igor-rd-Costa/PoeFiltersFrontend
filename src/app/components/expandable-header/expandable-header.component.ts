import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { GetHTMLContentHeight } from '../../utils/Helpers';

@Component({
  selector: 'app-expandable-header',
  standalone: true,
  imports: [],
  templateUrl: './expandable-header.component.html',
})
export class ExpandableHeaderComponent {
  @ViewChild('expandIcon') private expandIcon!: ElementRef<HTMLElement>;
  @ViewChild('content') private content!: ElementRef<HTMLElement>;
  protected isExpanded = signal<boolean>(false);
  
  async ToggleExpand() {
    await (this.isExpanded() ? this.Shrink() : this.Expand());
  }

  async Expand() {
    if (this.isExpanded()) {
      return
    }
    await this.ExpandContent();
  }

  async Shrink() {
    if (!this.isExpanded()) {
      return;
    }
    await this.ShrinkContent();
  }
  
  private ExpandContent() {
    return new Promise<void>(resolve => {
      this.expandIcon.nativeElement.animate([{rotate: "0deg"}, {rotate: "90deg"}], {fill: 'forwards', duration: 100});
      this.content.nativeElement.animate([{height: '0px'}, {height: GetHTMLContentHeight(this.content.nativeElement) + 'px'}], {duration: 100}).addEventListener('finish', () => {
        this.isExpanded.set(true);
        resolve();
      });
    });
  }

  private ShrinkContent() {
    return new Promise<void>(resolve => {
      this.expandIcon.nativeElement.animate([{rotate: "90deg"}, {rotate: "0deg"}], {fill: 'forwards', duration: 100})
      this.content.nativeElement.animate([{height: this.content.nativeElement.getBoundingClientRect().height + 'px'}, {height: '0px'}], {duration: 100}).addEventListener('finish', () => {
        this.isExpanded.set(false);
        resolve();
      });
    });
  }
}
