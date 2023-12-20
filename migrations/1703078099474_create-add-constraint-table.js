/* eslint-disable camelcase */

const addForeignKey = (pgm, tableName, columnName, referencedTable) => {
  const constraintName = `fk_${tableName}.${columnName}_${referencedTable}.id`;
  const foreignKey = `FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(id) ON DELETE CASCADE`;
  pgm.addConstraint(tableName, constraintName, foreignKey);
};

const dropForeignKey = (pgm, tableName, constraintName) => {
  pgm.dropConstraint(tableName, constraintName);
};

exports.up = (pgm) => {
  addForeignKey(pgm, 'threads', 'user_id', 'users');
  addForeignKey(pgm, 'comments', 'user_id', 'users');
  addForeignKey(pgm, 'comments', 'thread_id', 'threads');
  addForeignKey(pgm, 'replies', 'thread_id', 'threads');
  addForeignKey(pgm, 'replies', 'comment_id', 'comments');
  addForeignKey(pgm, 'replies', 'user_id', 'users');
};

exports.down = (pgm) => {
  dropForeignKey(pgm, 'threads', 'fk_threads.user_id_users.id');
  dropForeignKey(pgm, 'comments', 'fk_comments.user_id_users.id');
  dropForeignKey(pgm, 'comments', 'fk_comments.thread_id_threads.id');
  dropForeignKey(pgm, 'replies', 'fk_replies.thread_id_comments.id');
  dropForeignKey(pgm, 'replies', 'fk_replies.comment_id_comments.id');
  dropForeignKey(pgm, 'replies', 'fk_replies.user_id_users.id');
};
