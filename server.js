const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'hifan',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
let database = {
    users: []
}
app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    let found = false;
    let id = 0;
    database.users.forEach(user => {
        if (user.email === req.body.email) {
            found = bcrypt.compareSync(req.body.password, user.password);
            id = user.id
        }
    })

    if (found) {
        res.send(database.users[id - 1]);
    } else {
        res.send('no such user');
    }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    db('users').insert({
      email: email,
      name: name,
      joined: new Date()
    }).then(console.log)
    bcrypt.hash(password, 10, function(err, hash) {
        database.users.push({
            id: database.users.length + 1,
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        });
        res.json(database.users[database.users.length - 1]);
    });
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            res.json(user);
            found = true;
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.put('/image', (req,res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            user.entries++;
            found = true;
            res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})
