class EventBuilder {
    constructor() {
        this.eventData = {};
    }
    
    withTitle(title) {
        this.eventData.title = title;
        return this;
    }
    
    withDescription(description) {
        this.eventData.description = description;
        return this;
    }
    
    withLatitude(latitude) {
        this.eventData.latitude = latitude;
        return this;
    }
    
    withLongitude(longitude) {
        this.eventData.longitude = longitude;
        return this;
    }
    
    withImageUrl(imageUrl) {
        this.eventData.image_url = imageUrl;
        return this;
    }
    
    withPrivacySetting(privacySetting) {
        this.eventData.privacy_setting = privacySetting;
        return this;
    }
    
    withCode(code) {
        this.eventData.code = code;
        return this;
    }
    
    withTimestamp(timestamp) {
        this.eventData.timestamp = timestamp;
        return this;
    }
    
    build() {
        return this.eventData;
    }
}