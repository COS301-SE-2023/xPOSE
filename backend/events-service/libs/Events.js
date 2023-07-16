const { v4: uuidv4 } = require('uuid');

function generateUniqueCode() {
    return uuidv4();
}

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

    withOwnerId(ownerId) {
        this.eventData.owner_id_fk = ownerId;
        return this;
    }
    
    withPrivacySetting(privacySetting) {
        this.eventData.privacy_setting = privacySetting;
        return this;
    }

    withStartDate(startDate) {
        this.eventData.start_date = startDate;
        return this;
    }

    withEndDate(endDate) {
        this.eventData.end_date = endDate;
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
