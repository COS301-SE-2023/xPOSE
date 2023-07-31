import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class Service {

  apiUrl = 'http://localhost:8000/'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
    constructor(
      private httpClient: HttpClient,
      private firestore: AngularFirestore
      ) { }

  CreateEvent(event:any): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}e/events`, event,this.httpOptions)
    .pipe(map(result => result))
  }

 GetUser(uid: string):Observable<any> {  
  const userDoc: AngularFirestoreDocument<any> = this.firestore.doc<any>(`Users/${uid}`);
    return userDoc.valueChanges().pipe(
      map(userData => {
        if(!userData){
          throw new Error("User not found");
        }
        return userData;
      })
    );
  }
}