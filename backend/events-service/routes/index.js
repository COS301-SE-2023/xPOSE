const createEvent = require('./createEvent');
const deleteEvent = require('./deleteEvent');
const getEvent = require('./getEvent');
const getEvents = require('./getEvents');
const inviteUserToEvent = require('./inviteUserToEvent');
const removeUserFromEvent = require('./removeUserFromEvent');
const responseToEventInvite = require('./responseToEventInvite');
const responseToEventJoinRequest = require('./responseToEventJoinRequest');
const updateEvent = require('./updateEvent');
const userRequestToJoinEvent = require('./userRequestToJoinEvent');
const joinEvent = require('./joinEvent');
const getEventParticipants = require('./getEventParticipants');
const searchEvents = require('./searchEvents');
const getTags = require('./getTags');
const getEventsFeed = require('./getEventsFeed');

// export all 
module.exports = {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    inviteUserToEvent,
    removeUserFromEvent,
    responseToEventInvite,
    responseToEventJoinRequest,
    updateEvent,
    userRequestToJoinEvent,
    joinEvent,
    getEventParticipants,
    searchEvents,
    getTags,
    getEventsFeed
};