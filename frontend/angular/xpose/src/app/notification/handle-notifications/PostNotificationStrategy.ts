import { NotificationRequestStrategy } from "./notificationRequestStrategy"
import { ApiService } from '../../service/api.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";


export class PostNotificationStrategy implements NotificationRequestStrategy {
    constructor(private api: ApiService,
        private http: HttpClient){

    }
    
    async execute(user: any): Promise<void> {
        // Code for Notification of posts goes here
    }
}