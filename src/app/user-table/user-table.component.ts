import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})

export class UserTableComponent implements OnInit {
  users: any[] = [];
  editingUser: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  editUser(user: any): void {
    this.editingUser = { ...user };
  }

  saveUser(): void {
    if (this.editingUser) {
      // Отправка запроса на бэкэнд для сохранения изменений
      this.userService.updateUser(this.editingUser._id, this.editingUser).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.editingUser = null;
          this.updateUserList();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } 
  }

  deleteUser(userId: string): void {
    // Отправка запроса на бэкэнд для удаления пользователя
    this.userService.deleteUser(userId).subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
        this.editingUser = null;
        this.updateUserList();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  private updateUserList(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}

