import { Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private static backend = isDevMode() ? "https://localhost:7004/api/" : "";

  static Backend() {
    return AppComponent.backend;
  }
}
