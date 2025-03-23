import { AfterViewInit, Component, effect, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FilterGame } from '../../../../types/FilterTypes';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-filter-game-select',
  standalone: true,
  imports: [],
  templateUrl: './filter-game-select.component.html',
  styles: `
    .selected {
      @apply border-mainBright;
      @apply text-mainBright;
    }
  `
})
export class FilterGameSelectComponent implements AfterViewInit {
  @ViewChildren("gameSelectCard") gameSelectCards!: QueryList<ElementRef<HTMLElement>>;
  protected FilterGame = FilterGame;
  private gameElement: HTMLElement|null = null;

  public constructor() {
    effect(() => {
      const game = AppComponent.GetGame();
      this.SelectGameElement(game);
    })
  }

  ngAfterViewInit(): void {
    this.gameSelectCards.changes.subscribe(_ => {
      const game = AppComponent.GetGame();
      this.SelectGameElement(game);
    });
  }

  private SelectGameElement(game: FilterGame) {
    if (!this.gameSelectCards) {
      return;
    }
    if (this.gameElement !== null) {
      this.gameElement.classList.remove("selected");
      this.gameElement = null;
    }

    for (let i = 0; i < this.gameSelectCards.length; i++) {
      const gameStr = this.gameSelectCards.get(i)!.nativeElement.getAttribute("game");
      if (gameStr === null) {
        continue;
      }
      const gameVal: FilterGame = parseInt(gameStr);
      if (gameVal === game) {
        this.gameElement = this.gameSelectCards.get(i)!.nativeElement;
        this.gameElement.classList.add("selected");
      }
    }
  }

  protected SelectGame(event: MouseEvent) {
    if (event.target === null) {
      return;
    }
    event.stopPropagation();
    const t = event.target as HTMLElement;

    const gameStr = t.getAttribute("game");
    if (gameStr === null) {
      return;
    }
    const game: FilterGame = parseInt(gameStr);
    if (isNaN(game)) {
      return;
    }
    AppComponent.SetGame(game);
  }
}
