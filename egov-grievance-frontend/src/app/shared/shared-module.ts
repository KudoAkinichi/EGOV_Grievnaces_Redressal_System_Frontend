import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

// Components
import { NavbarComponent } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';

// Pipes
import { StatusDisplayPipe } from './pipes/status-display-pipe';
import { RoleDisplayPipe } from './pipes/role-display-pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    StatusDisplayPipe,
    RoleDisplayPipe,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    StatusDisplayPipe,
    RoleDisplayPipe,
  ],
})
export class SharedModule {}
