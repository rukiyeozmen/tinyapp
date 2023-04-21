// Once the Express instance is created, developers can use it to listen for incoming HTTP requests on a specified port and respond with the appropriate content or data. For example, app.listen(3000, () => console.log("Server running on port 3000")); will start the server on port 3000 and log a message to the console when it's ready to receive requests.
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express(); //creates an instance of the Express framework
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");

app.set('view engine', 'ejs');


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  a: {
    id: "a",
    email: "a@gmail.com",
    password: "1234",
  },
  b: {
    id: "b",
    email: "b@gmail.com",
    password: "5678"
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/urls", (req, res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    res.status(401).send('You must be logged in!');
    return;
  }
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL,
    userID: user.id
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/logout', function(req, res) {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//for updating
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[id].longURL;
  console.log("short: ", shortURL);
  console.log("long: ", longURL);
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

//*  login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  console.log("USER: ", user);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(403).send('Invalid email or password');
  }
});

function getUserByEmail(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Email or Password does not exist!');
  } else if (Object.values(users).find((user) => user.email === email)) {
    res.status(400).send('Email already registered');
  } else {
    const id = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[id] = { id, email, password: hashedPassword };
    console.log("USER[id]-----", users[id]);
    res.cookie('user_id', id);
    res.redirect('/urls');
  }
});

app.get("/login", (req, res) => {
  if (req.cookies['user_id']) {
    res.redirect('/urls');
  }
  res.render('urls_login');
});

//*Register
app.get('/register', (req, res) => {
  if (req.cookies['user_id']) {
    res.redirect('/urls');
  }
  res.render('urls_register');
});

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.get('/urls', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  if (!user) {
    return res.status(401).send("Please log in or register first.");
  }
  else {
    const userUrls = urlsForUser(user.id, urlDatabase);
    res.render('urls_index', { user: user, urls: userUrls });
  }
});

const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello !!! <b>World </body></html>");
});

app.get('/urls/new', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  const templateVars = {
    user: user
  };
  if (!user) {
    res.redirect('/login');
    return;
  }
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const user_id = req.cookies.user_id;
  const user = users[user_id];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user
  };
  if (!req.params.id) {
    res.status(404).send('<h1>404 Not Found</h1><p>The shortened URL you requested does not exist.</p>');
  }
  res.render('urls_show', templateVars);
});


function generateRandomString() {
  let str = '';
  const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    str += CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
  }
  return str;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
