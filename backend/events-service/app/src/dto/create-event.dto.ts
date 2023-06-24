export class CreateEventDto {
    name: string;
    description: string;
    location: string;
    owner: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    userId: string; // New property for user ID
  }