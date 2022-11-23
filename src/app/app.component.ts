import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from './user';
import { UserService } from './user-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title(title: any) {
    throw new Error('Method not implemented.');
  }
 public users: User[];
 public editUser: User | null;
 public deleteUser: User | null;


 constructor(private userService: UserService){}
  ngOnInit(){
    this.getUsers();
  }

 public getUsers(): void{
  this.userService.getUsers().subscribe(
    (response: User[])=>{
      this.users=response;
    },
    (error: HttpErrorResponse) =>{
      alert(error.message);
    }
  );
 }
 public onAddUser(addForm: NgForm): void {
  document.getElementById('add-user-form')?.click();
  this.userService.addUser(addForm.value).subscribe(
    (response: User) => {
      console.log(response);
      this.getUsers();
      addForm.reset();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
      addForm.reset();
    }
  );
}
 public onUpdateUser(user: User): void {
  this.userService.updateUser(user).subscribe(
    (response: User) => {
      console.log(response);
      this.getUsers();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public onDeleteUser(userId: number): void {
  this.userService.deleteUser(userId).subscribe(
    (response: void) => {
      console.log(response);
      this.getUsers();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public searchUsers(key: string): void {
  console.log(key);
  const results: User[] = [];
  for (const user of this.users) {
    if (user.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || user.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || user.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || user.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(user);
    }
  }
  this.users = results;
  if (results.length === 0 || !key) {
    this.getUsers();
  }
}
 public onOpenModal(user: User | null, mode: string): void{
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');
  if(mode === 'add'){
    button.setAttribute('data-target','#addUserModal');
  }
  if(mode === 'edit'){
    this.editUser=user;
    button.setAttribute('data-target','#updateUserModal');
  }
  if(mode === 'delete'){
    this.deleteUser=user;
    button.setAttribute('data-target','#deleteUserModal');
  }
  container?.appendChild(button);
  button.click();
 }
}
