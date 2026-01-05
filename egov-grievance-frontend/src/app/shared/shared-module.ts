import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';

// ✅ import components
import { NavbarComponent } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, MainLayoutComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, RouterOutlet],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
  ],
})
export class SharedModule {}
