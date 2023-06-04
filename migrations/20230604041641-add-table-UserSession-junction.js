"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSession", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add constraints
    await queryInterface.addConstraint("UserSession", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_usersession_userId",
      references: {
        table: "Users",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("UserSession", {
      fields: ["sessionId"],
      type: "foreign key",
      name: "fk_usersession_sessionId",
      references: {
        table: "Sessions",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint(
      "UserSession",
      "fk_usersession_userId"
    );
    await queryInterface.removeConstraint(
      "UserSession",
      "fk_usersession_sessionId"
    );

    // Drop table
    await queryInterface.dropTable("UserSession");
  },
};
