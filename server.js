const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}
app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    let found = false;
    database.users.forEach(user => {
        if (user.email === req.email) {
            bcrypt.compare(req.body.password, user.password, function (err, res) {
                res.json('succcess');
            });
            found = true;
        }
    })
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, null, function(err, hash) {
        database.users.push({
            id: '125',
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        })
    });
    res.json(database.users[database.users.length-1]);
    
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
