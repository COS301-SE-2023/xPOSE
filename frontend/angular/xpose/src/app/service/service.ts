import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from "@angular/fire/compat/firestore";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Service {

  apiUrl:string;

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }
    constructor(
      private httpClient: HttpClient,
      private firestore: AngularFirestore
      ) { 
        this.apiUrl = environment.apiUrl;
      }

  CreateEvent(event:any): Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/e/events`, event,this.httpOptions)
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

 async UpdateUserDetails(requestBody:any, uid:string) {  
    try {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const response = await this.httpClient.patch(`${this.apiUrl}/u/users/${uid}`, requestBody, { headers }).toPromise();
      // console.log("Response from server:", response);
      console.log("User profile updated successfully");
      return response;
    } catch (error) {
      // console.log("Error in calling function");
      console.log("Error:", error);
      // console.log("Response body:", error.error);
      return Promise.reject(error);
    }
  }


  async deleteUser(uid:string){
    try {
      const response = await this.httpClient.delete(`${this.apiUrl}/u/users/${uid}`).toPromise();
      console.log("User deleted successfully")
      return response;
    } catch(error){
      console.log("Error deleting user", error);
      return Promise.reject(error);
    }
  }
}



