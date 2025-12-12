import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, switchMap } from 'rxjs';
import { AdminService, Course } from '../admin.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses$!: Observable<Course[]>;
  courseForm!: FormGroup;
  editMode = false;
  currentCourseId?: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courses$ = this.adminService.courses$;
    this.buildForm();
    this.watchRoute();
  }

  private buildForm(): void {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      instructor: ['', Validators.required],
      startDate: ['', Validators.required],
    });
  }

  private watchRoute(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => {
          if (id) {
            this.editMode = true;
            this.currentCourseId = Number(id);
            return this.adminService.getCourseById(Number(id));
          }
          this.editMode = false;
          this.currentCourseId = undefined;
          this.courseForm.reset();
          return [undefined];
        })
      )
      .subscribe((course) => {
        if (course && this.editMode) {
          this.courseForm.patchValue({
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            startDate: course.startDate,
          });
        }
      });
  }

  submit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const value = this.courseForm.value;
    if (this.editMode && this.currentCourseId) {
      this.adminService.editCourse(this.currentCourseId, value);
    } else {
      this.adminService.addCourse(value);
    }
    this.router.navigate(['/admin/courses']);
    this.courseForm.reset();
    this.editMode = false;
    this.currentCourseId = undefined;
  }

  archive(course: Course): void {
    this.adminService.archiveCourse(course.id);
  }
}

