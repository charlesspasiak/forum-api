/* eslint-disable camelcase */

const addForeignKey = (pgm, tableName, columnName, referencedTable) => {
  const constraintName = `fk_${tableName}.${columnName}_${referencedTable}.id`;
  const foreignKey = `FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(id) ON DELETE CASCADE`;
  pgm.addConstraint(tableName, constraintName, foreignKey);
};

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  addForeignKey(pgm, 'likes', 'thread_id', 'threads');
  addForeignKey(pgm, 'likes', 'comment_id', 'comments');
  addForeignKey(pgm, 'likes', 'user_id', 'users');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
