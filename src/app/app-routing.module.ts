import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './admin/users/users.component';
import { CoursesComponent } from './admin/courses/courses.component';
import { AssignComponent } from './admin/assign/assign.component';

const routes: Routes = [
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/courses', component: CoursesComponent },
  { path: 'admin/courses/:id', component: CoursesComponent },
  { path: 'admin/assign/:courseId', component: AssignComponent },
  { path: '', redirectTo: 'admin/users', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/users' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

