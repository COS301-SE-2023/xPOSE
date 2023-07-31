import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { 
    this.apiUrl = environment.apiUrl;
  }

  createEvent(eventData: any): Observable<any> {
    return new Observable<any>(observer => {
      this.authService.getCurrentUserId().subscribe(uid => {
        if (uid) {
          // Assuming you have modified the API endpoint for create event
          const url = `${this.apiUrl}/e/events?uid=${uid}`;
          this.http.post(url, eventData).subscribe(
            (response: any) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        } else {
          observer.error('No user is currently logged in.');
        }
      });
    });
  }
}
