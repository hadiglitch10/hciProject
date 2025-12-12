import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export type UserStatus = 'approved' | 'pending' | 'deactivated';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: UserStatus;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  archived: boolean;
  assignedStudentIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private usersSubject = new BehaviorSubject<User[]>([
    { id: 1, name: 'Sara Ali', email: 'sara@example.com', role: 'student', status: 'pending' },
    { id: 2, name: 'Mina Farouk', email: 'mina@example.com', role: 'student', status: 'approved' },
    { id: 3, name: 'Omar Said', email: 'omar@example.com', role: 'instructor', status: 'approved' },
    { id: 4, name: 'Layla N.', email: 'layla@example.com', role: 'student', status: 'deactivated' },
    { id: 5, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'approved' },
  ]);

  private coursesSubject = new BehaviorSubject<Course[]>([
    {
      id: 101,
      title: 'Intro to UX',
      description: 'Learn fundamentals of UX design.',
      instructor: 'Omar Said',
      startDate: '2024-09-01',
      archived: false,
      assignedStudentIds: [2],
    },
    {
      id: 102,
      title: 'Angular Foundations',
      description: 'Components, directives, and RxJS.',
      instructor: 'Mina Farouk',
      startDate: '2024-10-10',
      archived: false,
      assignedStudentIds: [],
    },
  ]);

  users$ = this.usersSubject.asObservable();
  courses$ = this.coursesSubject.asObservable();

  approveUser(id: number): void {
    const updated = this.usersSubject.value.map((user) =>
      user.id === id ? { ...user, status: 'approved' as UserStatus } : user
    );
    this.usersSubject.next(updated);
  }

  deactivateUser(id: number): void {
    const updated = this.usersSubject.value.map((user) =>
      user.id === id ? { ...user, status: 'deactivated' as UserStatus } : user
    );
    this.usersSubject.next(updated);
  }

  deleteUser(id: number): void {
    const updated = this.usersSubject.value.filter((user) => user.id !== id);
    this.usersSubject.next(updated);
  }

  addCourse(course: Omit<Course, 'id' | 'archived' | 'assignedStudentIds'>): void {
    const nextId = Math.max(...this.coursesSubject.value.map((c) => c.id), 100) + 1;
    const newCourse: Course = {
      id: nextId,
      archived: false,
      assignedStudentIds: [],
      ...course,
    };
    this.coursesSubject.next([...this.coursesSubject.value, newCourse]);
  }

  editCourse(id: number, changes: Partial<Course>): void {
    const updated = this.coursesSubject.value.map((course) =>
      course.id === id ? { ...course, ...changes } : course
    );
    this.coursesSubject.next(updated);
  }

  archiveCourse(id: number): void {
    const updated = this.coursesSubject.value.map((course) =>
      course.id === id ? { ...course, archived: true } : course
    );
    this.coursesSubject.next(updated);
  }

  assignStudentsToCourse(courseId: number, studentIds: number[]): void {
    const updated = this.coursesSubject.value.map((course) =>
      course.id === courseId ? { ...course, assignedStudentIds: studentIds } : course
    );
    this.coursesSubject.next(updated);
  }

  getCourseById(id: number): Observable<Course | undefined> {
    return this.courses$.pipe(map((courses) => courses.find((c) => c.id === id)));
  }

  getStudents(): Observable<User[]> {
    return this.users$.pipe(map((users) => users.filter((u) => u.role === 'student')));
  }
}

