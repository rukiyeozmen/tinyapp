// Once the Express instance is created, developers can use it to listen for incoming HTTP requests on a specified port and respond with the appropriate content or data. For example, app.listen(3000, () => console.log("Server running on port 3000")); will start the server on port 3000 and log a message to the console when it's ready to receive requests.
const express = require("express");
const app = express(); //creates an instance of the Express framework
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
