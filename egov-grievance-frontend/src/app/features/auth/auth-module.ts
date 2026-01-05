import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ChangePasswordComponent } from './change-password/change-password';

import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ChangePasswordComponent],
  imports: [
    SharedModule, // 🔥 gives Common + Forms + Reactive + Material
    AuthRoutingModule,
  ],
})
export class AuthModule {}
