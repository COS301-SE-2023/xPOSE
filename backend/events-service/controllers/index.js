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
};