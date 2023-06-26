import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service {

  apiUrl = 'http://localhost:3000/'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }


  CreateEvent(event:any): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}e/events`, event,this.httpOptions)
    .pipe(map(result => result))
  }
}