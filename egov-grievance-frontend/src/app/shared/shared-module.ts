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
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';
import { FileUploadComponent } from './components/file-upload/file-upload';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    StatusDisplayPipe,
    RoleDisplayPipe,
    ConfirmDialogComponent,
    FileUploadComponent,
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
    ConfirmDialogComponent,
    FileUploadComponent,
  ],
})
export class SharedModule {}
