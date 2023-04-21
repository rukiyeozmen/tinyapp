const { assert } = require('chai');

const { getUserByEmail } = require('../helper');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = testUsers["userRandomID"];
    assert.deepEqual(user, expectedOutput);
  });

  it('should return null if email does not exist in database', function() {
    const user = getUserByEmail("no@example.com", testUsers);
    const expectedOutput = null;
    assert.equal(user, expectedOutput);
  });
});
