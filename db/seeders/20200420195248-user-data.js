'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const users = await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Demo User',
        email: 'demo@demo.com',
        hashedPassword: '$2a$10$MK9SVERyYTjeeXzLn/dHpupTk0ct7XpexZI/GFuGKq4I74bb.WsNe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Lisa Kang',
        email: 'lisa@lisa.com',
        hashedPassword: '$2y$10$B/Ns.LMUHet69Kn5cVCRSuxH7k4AhPDJrWq6g6Ya54EWtSMBay.He',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Brandon Tsui',
        email: 'b@test.com',
        hashedPassword: '$2y$10$hksjNbesqwdN8GvxK4ogTOmmCjLWg.YmQ/4ra0DePQi5lvzhUriL6',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
      { returning: true }
    );
    const channels = await queryInterface.bulkInsert('Channels', [
      {
        userId: 3,
        name: 'Main',
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        name: ';)',
        isDM: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        name: '🅰️pp 🅰️c🅰️demy',
        isDM: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
      { returning: true }
    );

    const channelUsers = await queryInterface.bulkInsert('ChannelUsers', [
      {
        userId: 1,
        channelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        channelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        channelId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        channelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        channelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        channelId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        channelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        channelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        channelId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
      { returning: true }
    );
    return queryInterface.bulkInsert('Messages', [
      {
        message: "Welcome to the Main Channel!",
        userId: 3,
        channelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: "Hello World!",
        userId: 2,
        channelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: "hey dude",
        userId: 2,
        channelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: "I like poop",
        userId: 3,
        channelId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        message: "Welcome to #🅰️pp 🅰️c🅰️demy",
        userId: 3,
        channelId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Channels", null, {});
    await queryInterface.bulkDelete("ChannelUsers", null, {});
    return queryInterface.bulkDelete("Messages", null, {});
  }
};
