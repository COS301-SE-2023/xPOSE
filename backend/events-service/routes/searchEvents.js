const express = require('express');
const router = express.Router();
const { Sequelize, Event, sequelize } = require('../data-access/sequelize');

async function searchEvents(req, res) {
    try {
        const { uid, q } = req.query;
        console.log('uid: ', uid);
        console.log('q: ', q);

        // Query the events based on the provided search query
        const events = await Event.findAll({
            where: {
                [Sequelize.Op.or]: [
                    // Search by title
                    { title: { [Sequelize.Op.like]: `%${q}%` } },
                    // Search by description
                    { description: { [Sequelize.Op.like]: `%${q}%` } },
                    // Search by location
                    { location: { [Sequelize.Op.like]: `%${q}%` } },
                ],
            },
        });

        console.log('events: ', events);
        // Return the matched events
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search events' });
    }
}
  

module.exports = searchEvents;
  