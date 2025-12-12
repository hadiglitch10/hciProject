import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { AdminService, User } from '../admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;
  filteredUsers$!: Observable<User[]>;

  filterControl: FormControl<string | null>;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.filterControl = this.fb.nonNullable.control('');
  }

  ngOnInit(): void {
    this.users$ = this.adminService.users$;

    this.filteredUsers$ = combineLatest([
      this.users$,
      this.filterControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([users, term]) =>
        users.filter((u) =>
          !term ? true : u.name.toLowerCase().includes(term.toLowerCase()) || u.email.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  approve(user: User): void {
    this.adminService.approveUser(user.id);
  }

  deactivate(user: User): void {
    this.adminService.deactivateUser(user.id);
  }

  delete(user: User): void {
    this.adminService.deleteUser(user.id);
  }

  statusClass(status: string): string {
    return status === 'approved'
      ? 'approved'
      : status === 'pending'
      ? 'pending'
      : 'deactivated';
  }
}

