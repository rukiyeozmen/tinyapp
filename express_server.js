const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helper');

app.set('view engine', 'ejs');

// constants 
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
    password: bcrypt.hashSync('1234', 10)
  },
  b: {
    id: "b",
    email: "b@gmail.com",
    password: bcrypt.hashSync('5678', 10)
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['whatever']
}));


// Routes
app.get('/', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    return res.redirect('/login');
  }
  return res.redirect('/urls');
});

//* Get post request for url index
app.get('/urls', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    return res.status(401).send("Please log in or register first.");
  }
  else {
    const userUrls = urlsForUser(user.id, urlDatabase);
    res.render('urls_index', { user: user, urls: userUrls });
  }
});

app.post("/urls", (req, res) => {
  const user = users[req.session.user_id];
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
  res.redirect(`/urls/${shortURL}`);
});

//* Route to create a new url
app.get('/urls/new', (req, res) => {
  const user_id = req.session.user_id;
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

//* Get and Post requist for specific url
app.get('/urls/:id', (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];

  if (!urlDatabase[req.params.id]) {
    return res.status(404).send('<h1>404 Not Found</h1><p>The shortened URL you requested does not exist.</p>');
  }
  if (urlDatabase[req.params.id].userID !== user_id) {
    return res.status(403).send('<h1>403 Forbidden</h1><p>The shortened URL you requested does not not belong to you.</p>');
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };
  res.redirect('/urls');
});

//* Route to delete url
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//* Route to register url
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  res.render('urls_register', templateVars);
});

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
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

//*  Route to login url
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect('/urls');
  } else {
    res.status(403).send('Invalid email or password');
  }
});

//* Route to logout url
app.post('/logout', function(req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});


app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('<h1>404 Not Found</h1><p>The shortened URL you requested does not exist.</p>');
  }
  res.redirect(longURL);
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello !!! <b>World </body></html>");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
