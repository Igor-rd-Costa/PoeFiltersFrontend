import { Component, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { GetHTMLContentHeight } from '../../utils/Helpers';

@Component({
  selector: 'app-large-expandable-header',
  standalone: true,
  imports: [],
  templateUrl: './large-expandable-header.component.html',
  styles: `
    .hovered {
      @apply bg-mainBright;
    }

    .active > div {
      background-color: #AAAF;
    }
  `
})
export class LargeExpandableHeaderComponent {
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  @ViewChild('headingTop') headingTop!: ElementRef<HTMLElement>;
  @ViewChild('headingBottom') headingBottom!: ElementRef<HTMLElement>;
  @ViewChild('headingContent') headingContent!: ElementRef<HTMLElement>;
  @ViewChild('content') content!: ElementRef<HTMLElement>;
  isExpanded = signal<boolean>(false);
  
  async Expand() {
    if (this.isExpanded()) {
      return;
    }
    await this.ShrinkHeading();
    await this.ExpandContent();
  }

  async Shrink() {
    if (!this.isExpanded()) {
      return;
    }
    await this.ShrinkContent();
    await this.ExpandHeading();
  }

  protected OnLeave(event: MouseEvent) {
    this.headingTop.nativeElement.classList.remove("hovered");
    this.headingBottom.nativeElement.classList.remove("hovered");
  }

  protected OnDragStart() {

  }

  protected OnHover() {
    this.headingTop.nativeElement.classList.add("hovered");
    this.headingBottom.nativeElement.classList.add("hovered");
  }

  protected ToggleExpand() {
    this.isExpanded() ? this.Shrink() : this.Expand();
  }

  private ShrinkContent() {
    return new Promise<void>(resolve => {
      const content = this.content.nativeElement;
      content.animate([{height: content.getBoundingClientRect().height + 'px'}, {height: 0}], 
      {duration: 100}).addEventListener('finish', () => {
        content.style.height = 0 + 'px';
        resolve();
      });
    });
  }
  
  private ExpandContent() {
    return new Promise<void>(resolve => {
      const content = this.content.nativeElement;
      content.animate([{height: 0}, {height: GetHTMLContentHeight(this.content.nativeElement) + 'px'}], 
      {duration: 100}).addEventListener('finish', () => {
        content.style.height = 'fit-content';
        resolve();
      });
    });
  }

  private ShrinkHeading() {
    return new Promise<void>(resolve => {
      const content = this.headingContent.nativeElement;
      const img = content.querySelector('img');
      if (img) {
        const rect = img.getBoundingClientRect();
        img.animate([{}, {width: rect.width * 0.6 + 'px', height: rect.height * 0.6 + 'px'}], {fill: 'forwards', duration: 100});
      }
      content.animate([{fontSize: '1.8rem', height: '4.5rem'}, {fontSize: '1.1rem', height: '2.25rem'}], {fill: 'forwards', duration: 100})
      .addEventListener('finish', () => {
        this.isExpanded.set(true);
        resolve();
      })
    });
  }
  
  private ExpandHeading() {
    return new Promise<void>(resolve => {
      const content = this.headingContent.nativeElement;
      const img = content.querySelector('img');
      if (img) {
        const rect = img.getBoundingClientRect();
        img.animate([{width: rect.width + 'px', height: rect.height + 'px' }, 
          {width: Math.ceil(rect.width * 1.666666) + 'px', height: Math.ceil(rect.height * 1.666666) + 'px'}], {fill: 'forwards', duration: 100});
      }
      content.animate([{height: '2.25rem', fontSize: '1.1rem'}, {fontSize: '1.8rem', height: '4.5rem'}], {fill: 'forwards', duration: 100})
      .addEventListener('finish', () => {
        this.isExpanded.set(false);
        resolve();
      })
    });
  }
}
