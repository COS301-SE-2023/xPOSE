export interface Event {
    userId: number;
    eventName: string;
    coverImage: File | null;
    eventStartDate: string;
    eventEndDate: string;
    eventLocation: string;
    eventDescription: string;
    eventPrivacySetting: string;
  }
  