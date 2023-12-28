import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/user';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${userId}`;
    return this.http.put<any>(updateUrl, userData);
  }

  deleteUser(userId: string): Observable<any> {
    const deleteUrl = `${this.apiUrl}/${userId}`;
    return this.http.delete<any>(deleteUrl);
  }
}