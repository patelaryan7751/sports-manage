"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserSessions", "sport_id", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("UserSessions", {
      fields: ["sport_id"],
      type: "foreign key",
      references: {
        table: "Sports",
        field: "id",
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserSessions", "sport_id");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
