import { AfterViewInit, Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/AuthService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  private static backend = isDevMode() ? "https://localhost:7004/api/" : "";

  constructor(private authService: AuthService) {}

  ngAfterViewInit(): void {
    this.authService.GetUserInfo();
  }

  static Backend() {
    return AppComponent.backend;
  }
}
