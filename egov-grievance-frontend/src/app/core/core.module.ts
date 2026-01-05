import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { TokenService } from './services/token.service';

// Guards
import { AuthGuard } from './guards/auth-guard.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

@NgModule({
  imports: [CommonModule],
  providers: [AuthService, StorageService, TokenService, AuthGuard, NoAuthGuard],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
