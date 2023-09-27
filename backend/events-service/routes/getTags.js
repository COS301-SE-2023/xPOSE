const { Sequelize, Tag, Event, EventTag } = require('../data-access/sequelize');

async function getTags(req, res) {
    try {
        const { q, n, a } = req.query;
        let query = q;

        if (!q) {
            query = '';
        }

        let limit = parseInt(n);

        if (!n) {
            limit = 5;
        } else {
            limit = parseInt(n);
            if (isNaN(limit)) {
                limit = 5;
            }
        }

        if (a) {
            // Query from the EventTag table and join with the Tag table
            const tags = await EventTag.findAll({
                attributes: [],
                include: [
                    {
                        model: Tag,
                        attributes: ['tag_name'],
                        as: 'tag',
                    },
                    {
                        model: Event,
                        attributes: [],
                        where: {
                            title: {
                                [Sequelize.Op.like]: `%${query}%`,
                            },
                        },
                        as: 'event',
                    },
                ],
                limit: limit,
            });

            const tagNames = tags.map((eventTag) => eventTag.tag.tag_name);

            res.json(tagNames);
            return;
        }

        // Query the database for tags that match the provided value (q)
        const tags = await Tag.findAll({
            where: {
                tag_name: {
                    [Sequelize.Op.like]: `%${query}%`,
                },
            },
            limit: limit,
        });

        const tagNames = tags.map((tag) => tag.tag_name);

        res.json(tagNames);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
        throw new Error('Failed to fetch tags');
    }
}

module.exports = getTags;

