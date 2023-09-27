const { getTags } = require('../routes/getTags'); // Adjust the path accordingly
const { Tag, EventTag, Event } = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  Tag: {
    findAll: jest.fn(),
  },
  EventTag: {
    findAll: jest.fn(),
  },
  Event: {
    findAll: jest.fn(),
  },
}));

const mockRequest = {
  query: {
    q: 'testTag',
    n: '5',
    a: 'true',
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('getTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve tags based on query parameters', async () => {
    // Mock necessary functions
    const mockEventTag = {
      tag: {
        tag_name: 'testTag',
      },
    };
    EventTag.findAll.mockResolvedValueOnce([mockEventTag]);

    
  });

  it('should retrieve tags based on query parameters without association', async () => {
    // Mock necessary functions
    const mockTag = { tag_name: 'testTag' };
    Tag.findAll.mockResolvedValueOnce([mockTag]);

    
  });

  
});
