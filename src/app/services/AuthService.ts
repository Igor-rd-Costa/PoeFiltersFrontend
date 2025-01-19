import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { AppComponent } from "../app.component";
import { Router } from "@angular/router";

export type User = {
  id: string,
  providerId: string,
  name: string,
  isAdmin: boolean
}

@Injectable()
export class AuthService {
  private backend = AppComponent.Backend()+"auth/";
  private user = signal<User|null>(null);
  public constructor(private http: HttpClient, private router: Router) {
    
  }

  public Login() {
    window.location.href = this.backend+"authorize";
  }

  public User() {
    return this.user();
  }

  public IsAdmin() {
    return this.user()?.isAdmin ?? false;
  }

  public IsLogged() {
    return this.user() !== null;
  }

  public GetUserInfo() {
    return new Promise<User|null>(resolve => {
      this.http.get<User|null>(this.backend+"info", {withCredentials: true}).subscribe({
        next: user => {
          this.user.set(user);
          resolve(user);
        },
        error: err => {
          console.error(err);
          this.user.set(null);
          resolve(null);
        }
      })
    })
  }
}