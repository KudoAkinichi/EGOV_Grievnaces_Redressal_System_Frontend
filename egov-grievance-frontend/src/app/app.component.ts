import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  showLayout = false;
  sidenavOpened = true;

  constructor(
    private router: Router,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showLayout = !event.url.startsWith('/auth');
      });

    this.showLayout = !this.router.url.startsWith('/auth');

    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth < 768) {
        this.sidenavOpened = false;
      }
    }
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
