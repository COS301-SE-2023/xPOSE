// import { NotificationRequestStrategy } from "./notificationRequestStrategy"
// import { ApiService } from '../../service/api.service';
// import { AuthService } from "src/app/shared/services/auth.service";
// import { AngularFirestore } from "@angular/fire/compat/firestore";
// import { HttpClient, HttpHeaders } from "@angular/common/http";


// export class AcceptJoinEventStrategy implements NotificationRequestStrategy{
//     constructor(private api: ApiService,
//         private http: HttpClient){

//     }

//     async execute(user: any): Promise<void> {
//         // const endpoint = `${this.api.apiUrl}/u/users/`;
//         // const headers = new HttpHeaders().set('Content-Type', 'application/json');
//         // const requestBody = JSON.stringify(user);
//         //  try {
//         //     const response = await this.http.post<any>(`${endpoint}${user.senderId}/friend-requests/${user.receiverId}/reject`, requestBody, {headers}).toPromise();
//         //     console.log("Friend request rejected",response);
//         //     // this.removeNotification(user);   
//         //  } catch (error){
//         //     console.error("Error:", error);
//         //     throw error;
//         //  }
//     }
// }