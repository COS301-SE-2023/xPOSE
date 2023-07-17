export interface Event {
    uid: number;
    title: string;
    image: File | null;
    start_date: string;
    end_date: string;
    location: string;
    description: string;
    privacy_setting: string;
    latitude: number;
    longitude: number;
  }
  