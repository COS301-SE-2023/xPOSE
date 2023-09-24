import { NotificationRequestStrategy } from "./notificationRequestStrategy"
import { ApiService } from '../../service/api.service';
import { AuthService } from "src/app/shared/services/auth.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { HttpClient, HttpHeaders } from "@angular/common/http";


export class ReplyToEventInvitationStrategy implements NotificationRequestStrategy{
    constructor(private api: ApiService,
        private http: HttpClient){
    }

    async execute(message: any): Promise<void> {
        const endpoint = `${this.api.apiUrl}/e/events/`;
        try {
            console.log('Firebase document: ');
            console.log(message);
                // return;
            const code = message.values[0].event_code;
            const inviter_uid = message.values[0].inviter;
            const invitee_uid = message.values[0].invitee;
            
            const formData = new FormData();
            
            formData.append('response', message.response); 
            const response = await this.http.put<any>(`${endpoint}${code}/invite?uid=${inviter_uid}&invitee=${invitee_uid}`, formData)
            .toPromise();
        } catch (error){
           console.log("Error:", error);
           throw error;
        }
    }
}