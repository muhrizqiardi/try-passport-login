const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.set("view engine", 'ejs')

app.get('/', (req, res) => {
    res.render('index', {name: 'Bebek', })
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
})
