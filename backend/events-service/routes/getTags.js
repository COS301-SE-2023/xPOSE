const { Sequelize, Tag } = require('../data-access/sequelize');

async function getTags(req, res) {
    try {
        const { q, n } = req.query;
        // let { n } = req.query;

        if (!q) {
            return res.json([]);
        }

        let limit = parseInt(n);

        if (!n) {
            limit = 5;
        }
        else {
            limit = parseInt(n);
            if(isNaN(limit)){
                limit = 5;
            }
        }

        // Query the database for tags that match the provided value (q)
        const tags = await Tag.findAll({
            where: {
                tag_name: {
                    [Sequelize.Op.like]: `%${q}%`, // Use Op.iLike for case-insensitive search
                },
            },
            limit: limit,
        });

        const tagNames = tags.map(tag => tag.tag_name); // Extract the tag_name property of each tag object

        res.json(tagNames);
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch tags');
    }
}

module.exports = getTags;
