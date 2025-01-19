import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements AfterViewInit {

  constructor(private authService: AuthService, private router: Router) {
  }

  async ngAfterViewInit() {
    if (await this.authService.IsLogged()) {
      this.router.navigate([''])
    }
  }

  Login() {
    this.authService.Login();
  }
}
