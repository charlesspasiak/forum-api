const GetThread = require('../GetThread');

describe('GetThread Entity', () => {
  describe('Error Cases', () => {
    it('should throw an error when essential property is missing', () => {
      // Arrange
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2023-12-17',
        username: 'lestrapa',
      };

      // Action & Assert
      expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw an error when data type specification is not met', () => {
      // Arrange
      const payload = {
        id: 'thread-123abc',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2023-12-17',
        username: true,
      };

      // Action & Assert
      expect(() => new GetThread(payload)).toThrow('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  describe('Success Case', () => {
    it('should return a GetThread object with correct properties', () => {
      // Arrange
      const payload = {
        id: 'thread-123abc',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2023-12-19',
        username: 'lestrapa',
      };

      // Action
      const result = new GetThread(payload);

      // Assert
      expect(result.id).toEqual(payload.id);
      expect(result.title).toEqual(payload.title);
      expect(result.body).toEqual(payload.body);
      expect(result.date).toEqual(payload.date);
      expect(result.username).toEqual(payload.username);
    });
  });
});
