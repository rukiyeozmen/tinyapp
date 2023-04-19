// Once the Express instance is created, developers can use it to listen for incoming HTTP requests on a specified port and respond with the appropriate content or data. For example, app.listen(3000, () => console.log("Server running on port 3000")); will start the server on port 3000 and log a message to the console when it's ready to receive requests.
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express(); //creates an instance of the Express framework
const PORT = 8080;
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//for updating
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  console.log("short: ", shortURL);
  console.log("long: ", longURL);
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

//*  login
app.post('/login', (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.get('/u/:id', (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

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
  res.render('urls_new');
});

app.get('/urls/:id', (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
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
