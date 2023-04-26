const getUserByEmail = function(email, database) {
  for (let userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// Helper functions
const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

// Generates random string (shorturl)
function generateRandomString() {
  let str = '';
  const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    str += CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
  }
  return str;
}


module.exports = { getUserByEmail, generateRandomString, urlsForUser };