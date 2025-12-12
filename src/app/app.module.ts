import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersComponent } from './admin/users/users.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { AssignComponent } from './admin/assign/assign.component';

@NgModule({
  declarations: [AppComponent, UsersComponent, CoursesComponent, AssignComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, RouterModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

