import { AfterViewInit, Component, isDevMode, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/AuthService';
import { FilterGame } from './types/FilterTypes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  private static game = signal<FilterGame>(FilterGame.POE2);
  private static backend = isDevMode() ? "https://localhost:7004/api/" : "";

  constructor(private authService: AuthService) {}

  ngAfterViewInit(): void {
    this.authService.GetUserInfo();
  } 

  static Backend() {
    return AppComponent.backend;
  }

  static GetGame() {
    return this.game();
  }
  static SetGame(game: FilterGame) {
    this.game.set(game);
  }

  static GameBackend() {
    return AppComponent.backend + ((this.game() === FilterGame.POE1) ? 'poe1/' : 'poe2/');
  }
}
