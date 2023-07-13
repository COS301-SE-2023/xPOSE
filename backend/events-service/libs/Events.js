const { v4: uuidv4 } = require('uuid');

function generateUniqueCode() {
    return uuidv4();
}

class EventBuilder {
    constructor(eventData) {
        if(eventData) {
            this.eventData = eventData;
        }
        else {
            this.eventData = {
                title: null,
                description: null,
                latitude: null,
                longitude: null,
                image_url: null,
                owner_id_fk: null,
                privacy_setting: null,
                code: null,
                timestamp: null,
            };
        }
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

    withOwnwerId(ownerId) {
        this.eventData.owner_id_fk = ownerId;
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

module.exports = {
    EventBuilder,
    generateUniqueCode,
};
