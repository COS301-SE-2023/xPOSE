const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  User,
  Event,
  EventParticipant,
  EventInvitation,
  EventJoinRequest,
  Tag,
  EventTag,
} = require('../data-access/sequelize');

// Define your route to get the event feed
async function getEventsFeed(req, res) {
    try {
        console.log('queries: ', req.query);
        const { uid, tags, dates, title, description, status, code, n, owner, participant } = req.query;

        if (!uid) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the user with the provided uid
        const user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        if (!user) {
            const firestoreUserDoc = await admin.firestore().collection('Users').doc(uid).get();

            if (firestoreUserDoc.exists) {
                // Create the user in the Users table
                user = await User.create({ uid: uid });
            } else {
                res.status(400).json({ error: 'Invalid user' });
                return;
            }
        }

        
        // Build a filter object based on query parameters
        const filter = {
            where: {},
            include: [{
                model: User,
                attributes: ['uid'],
                as: 'owner',
            }],
        };
        
        
        if(n && !isNaN(parseInt(n))) {
            filter.limit = parseInt(n);
        }

        if(code) {
            filter.where.code = code;
        }

        // Filter by tags
        if (tags) {
        const tagNames = tags.split(',').map((tagName) => tagName.trim());

        filter.include.push({
            model: Tag,
            where: {
            tag_name: {
                [Op.in]: tagNames,
            },
            },
        });
        }

        // Filter by dates (start_date and end_date)
        if (dates) {
        const dateRanges = dates.split(',').map((dateRange) => dateRange.trim());

        if (dateRanges.length === 2) {
            filter.where.start_date = {
            [Op.gte]: new Date(dateRanges[0]),
            };

            filter.where.end_date = {
            [Op.lte]: new Date(dateRanges[1]),
            };
        }
        }

        // Filter by title (case-insensitive search)
        if (title) {
        filter.where.title = {
            [Op.iLike]: `%${title}%`,
        };
        }

        // Filter by description (case-insensitive search)
        if (description) {
        filter.where.description = {
            [Op.iLike]: `%${description}%`,
        };
        }

        // Filter by status
        if (status) {
        filter.where.status = status;
        }

        // Filter by owner
        if (owner) {
            // Find the user with the provided uid
            const ownerUserObject = await User.findOne({
                where: {
                    uid: owner,
                },
            });

            if(ownerUserObject) {
                filter.where.owner_id_fk = ownerUserObject.id;
            }
            else {
                return res.status(400).json({ error: 'Invalid owner' });
            }
        }

        // Filter by participant
        if (participant) {
            const participantUserObject = await User.findOne({
                where: {
                    uid: participant,
                }
            });
        
            if (participantUserObject) {
                filter.include.push({
                    model: User,
                    as: 'participants', // Use the association alias here
                    where: {
                        id: participantUserObject.id, // Use the foreign key of User
                    },
                });
            } else {
                return res.status(400).json({ error: 'Invalid participant' });
            }
        }
        
        // Find events based on the filter
        const events = await Event.findAll(filter);

        // Transform the events to replace 'owner_id_fk' with 'uid'
        const transformedEvents = [];
        for (let i = 0; i < events.length; i++) {
        const event = events[i];
        // get the tag_names of the current event

        const tag_names = await getTagNamesForEvent(event.id);

        let status = '';
        
        const obj_start_date = new Date(event.start_date);
        const obj_end_date = new Date(event.end_date);
        if (Date.now() < obj_start_date) {
        status = 'upcoming';
        } else if (Date.now() >= obj_start_date && Date.now() <= obj_end_date) {
        status = 'ongoing';
        } else {
        status = 'ended';
        }

        const { owner_id_fk, ...eventData } = event.toJSON();
        eventData.tags = tag_names;
        // Check if user is the owner
        if (user.id === owner_id_fk) {
        eventData.user_event_position = 'owner';
        } else {
        let participant = await EventParticipant.findOne({
        where: {
        user_id_fk: user.id,
        event_id_fk: event.id,
        },
        });

        if (participant) {
        eventData.user_event_position = 'participant';
        } else {
        let joinRequest = await EventJoinRequest.findOne({
        where: {
            user_id_fk: user.id,
            event_id_fk: event.id,
            response: 'pending',
        },
        });

        if (joinRequest) {
        eventData.user_event_position = 'requested';
        } else {
        let invitation = await EventInvitation.findOne({
            where: {
            user_id_fk: user.id,
            event_id_fk: event.id,
            response: 'pending',
            },
        });

        if (invitation) {
            eventData.user_event_position = 'invited';
        } else {
            eventData.user_event_position = 'none';
        }
        }
        }
        }

        eventData.owner = event.owner.uid;
        transformedEvents.push(eventData);
        }
        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
}

// Helper function to calculate event status
function calculateEventStatus(event) {
    const currentDate = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (currentDate < startDate) {
    return 'upcoming';
    } else if (currentDate >= startDate && currentDate <= endDate) {
    return 'ongoing';
    } else {
    return 'ended';
    }
}

async function getTagNamesForEvent(eventId) {
  try {
    const eventTags = await EventTag.findAll({
      where: {
        event_id_fk: eventId,
      },
      include: [
        {
          model: Tag,
          attributes: ['tag_name'],
          as: 'tag',
        },
      ],
    });

    const tagNames = eventTags.map((eventTag) => eventTag.tag.tag_name);
    return tagNames;
  } catch (error) {
    throw new Error(`Failed to fetch tag names for event: ${error.message}`);
  }
}

module.exports = getEventsFeed;
