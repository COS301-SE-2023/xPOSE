// this is an entity class for events that will be stored in the firestore database
// the class has name, description, location, owner firebase id, start date, end date and image url
// the class is exported to be used in other files
// event.interface.ts
export interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    owner: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    userId: string; // New property for user ID
  }