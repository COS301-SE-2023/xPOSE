export interface Event {
    userId: Number;
    eventName: String;
    coverImage: String;
    eventStartDate: Date;
    eventStartTime: Number;
    eventEndDate: Date;
    eventEndTime: Number;
    eventLocation: String;
    eventDescription: String;
    eventPrivacySetting: String;
}