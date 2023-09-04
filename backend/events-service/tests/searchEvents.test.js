const { searchEvents } = require('../routes/searchEvents'); // Adjust the import path

// Mocks
jest.mock('../data-access/sequelize', () => {
  return {
    Sequelize: {},
    Event: {
      findAll: jest.fn(),
    },
  };
});

describe('searchEvents', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { uid: 'user-uid', q: 'search-query' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should search events based on the provided query', async () => {
    const mockEvents = [
      { title: 'Event 1', description: 'Description 1', location: 'Location 1' },
      { title: 'Event 2', description: 'Description 2', location: 'Location 2' },
    ];

    // Mock the Event.findAll function to return mockEvents
    Event.findAll.mockResolvedValue(mockEvents);

    await searchEvents(req, res);

    expect(Event.findAll).toHaveBeenCalledWith({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: '%search-query%' } },
          { description: { [Sequelize.Op.like]: '%search-query%' } },
          { location: { [Sequelize.Op.like]: '%search-query%' } },
        ],
      },
    });

    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  it('should handle errors and return a 500 status code', async () => {

    Event.findAll.mockRejectedValue(new Error('Database error'));

    await searchEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to search events' });
  });

  
});
