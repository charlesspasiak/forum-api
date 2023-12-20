const AddThread = require('../AddThread');

describe('AddThread Entities', () => {
  describe('Error Cases', () => {
    it('should throw an error when payload is missing needed property', () => {
      // Arrange
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      // Action & Assert
      expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw an error when payload does not meet data type specification', () => {
      // Arrange
      const payload = {
        title: 'sebuah thread',
        body: true,
        user_id: 'user-123',
      };

      // Action & Assert
      expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw an error when title content exceeds 50 characters', () => {
      // Arrange
      const payload = {
        title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        body: 'sebuah body thread',
        user_id: 'user-123',
      };

      // Action & Assert
      expect(() => new AddThread(payload)).toThrow('ADD_THREAD.TITLE_LIMIT_CHAR');
    });
  });

  describe('Success Case', () => {
    it('should create a new thread object correctly', () => {
      // Arrange
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
        user_id: 'user-123',
      };

      // Action
      const { title, body, user_id } = new AddThread(payload);

      // Assert
      expect(title).toEqual(payload.title);
      expect(body).toEqual(payload.body);
      expect(user_id).toEqual(payload.user_id);
    });
  });
});
