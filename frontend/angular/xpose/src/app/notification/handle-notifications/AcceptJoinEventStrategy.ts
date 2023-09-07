import { NotificationRequestStrategy } from "./notificationRequestStrategy"
import { ApiService } from '../../service/api.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";


export class AcceptJoinEventStrategy implements NotificationRequestStrategy{
    constructor(private api: ApiService,
        private http: HttpClient){

    }
    async execute(user: any): Promise<void> {
        const endpoint = `${this.api.apiUrl}/e/events/`;
         try {
      
          const code = user.values[0].code;
          const invitee_id = user.values[0].invitee_id;
        
        //   console.log("Request body", requestBody);
          
          const formData = new FormData();
          for(let key in user) {
            if(user.hasOwnProperty(key)){
                formData.append(key, user[key])
            }
          }
          formData.append('response', 'accepted'); 

        //   console.log("form data", formData.get('senderId'));

          const response = await this.http.put<any>(`${endpoint}${code}/request?uid=${invitee_id}`, formData).toPromise();
          console.log("Request to join event accepted",response);

         } catch (error){
            console.log("Error:", error);
            throw error;
         }
    }
}