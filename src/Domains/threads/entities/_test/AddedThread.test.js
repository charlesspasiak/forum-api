const AddedThread = require('../AddedThread');

describe('AddedThread Entities', () => {
  describe('Error Cases', () => {
    it('should throw an error when payload is missing needed property', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        user_id: 'user-123',
      };

      // Action & Assert
      expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw an error when payload does not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 11235,
        user_id: 'user-123',
      };

      // Action & Assert
      expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  describe('Success Case', () => {
    it('should create an AddedThread object correctly', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'sebuah thread',
        user_id: 'user-123',
      };

      // Action
      const { id, title, user_id } = new AddedThread(payload);

      // Assert
      expect(id).toEqual(payload.id);
      expect(title).toEqual(payload.title);
      expect(user_id).toEqual(payload.user_id);
    });
  });
});
