import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentEventDataService {
  event_id: string | null = null;
  event_title: string | null = null;
  event_description: string | null = null;
  code: string | null = null;
  privacy_setting: string | null = null;
  start_date: Date | null = null;
  end_date: Date | null = null;
  location: string | null = null;
  owner_id: string | null = null;
  image_url: string | null = null;
  owner_uid: string | null = null;
  timestamp: Date | null = null;
  
  constructor() { }
}
