import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { AdminService, Course, User } from '../admin.service';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css'],
})
export class AssignComponent implements OnInit {
  course?: Course;
  students: User[] = [];
  form!: FormGroup;

  get studentsArray(): FormArray {
    return this.form.get('students') as FormArray;
  }

  constructor(private route: ActivatedRoute, private adminService: AdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      students: this.fb.array([]),
    });

    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('courseId'))),
        switchMap((courseId) =>
          combineLatest([
            this.adminService.getCourseById(courseId).pipe(filter((c): c is Course => !!c)),
            this.adminService.getStudents(),
          ]).pipe(map(([course, students]) => ({ course, students, courseId })))
        )
      )
      .subscribe(({ course, students }) => {
        this.course = course;
        this.students = students;
        this.setStudentControls(course.assignedStudentIds);
      });
  }

  private setStudentControls(selectedIds: number[]): void {
    this.studentsArray.clear();
    this.students.forEach((student) => {
      this.studentsArray.push(this.fb.control(selectedIds.includes(student.id)));
    });
  }

  submit(): void {
    if (!this.course) {
      return;
    }
    const selectedIds = this.students
      .map((student, index) => (this.studentsArray.at(index).value ? student.id : null))
      .filter((id): id is number => id !== null);
    this.adminService.assignStudentsToCourse(this.course.id, selectedIds);
  }
}

