var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();


// DB CONNECT
var connectStr = "postgress://role:123@localhost/users";

// Assign Dust engine to .dust Files
app.engine('dust', cons.dust);

//set def ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//set public folder
// app.unsubscribe(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var users;

var role = "user";
var logined = "false";
var first_name = "";
var last_name = "";

app.post('/login', function(req, res){
    // res.send(req.body.username + "  " + req.body.password)
    for(var usr in users){
        // res.send(users[usr])
        if(users[usr]["username"].replace(/\s/g, '') == req.body.username && users[usr]["password"].replace(/\s/g, '') == req.body.password){

            role = users[usr]["role"].replace(/\s/g, '');
            first_name = users[usr]["first_name"];
            last_name = users[usr]["last_name"];
            logined = "true";
            // res.send("found  " + for_test[usr]["username"] + "  " + for_test[usr]["password"] + "  " + for_test[usr]["role"]);
            res.redirect('/')
        }
    }
})



app.get('/logout', function(req, res){
    role = "user";
    logined = "false";
    first_name = "";
    last_name = "";
    res.redirect('/')

})

app.get('/', function(req, res){
    // res.render('index')
    //PG Connect
    const client = new pg.Client(connectStr);
    client.connect()

    client.query('SELECT * FROM users', function(err, result){
        if (err){
            return console.error('error running query', err)
        }
        // res.render("layout", {users: result.rows})
        users = result.rows;
        res.render("layout", {
            users: users,
            roleS: role,
            logined: logined,
            firstname: first_name,
            lastname: last_name
        })
        // res.send(result.rows)
        client.end()

    })

})

app.delete('/delete/:id', function(req, res){
    const client = new pg.Client(connectStr);
    client.connect()

    client.query('DELETE FROM users WHERE id = $1', [req.params.id],
        function(err, result){
            if (err){
                return console.error('error running query', err)
            }
            res.send(200)
            client.end()
            
        })
});
app.post('/edit', function(req, res){
    
    const client = new pg.Client(connectStr);
    client.connect()

    client.query('Update users SET first_name = $1, last_name = $2, domain = $3, email = $4, password = $5, username = $6, last = $7 WHERE id = $8',
 [req.body.first_name, req.body.last_name, req.body.domain, req.body.email, req.body.password, req.body.username, req.body.last, req.body.id],
 function(err, result){
        if (err){
            return console.error('error running query', err)
        }
        client.end()
        res.redirect('/')
    })
})
app.post('/add', function(req, res){
        //PG Connect

        const client = new pg.Client(connectStr);
        client.connect()
    
        client.query('INSERT INTO users(first_name, last_name, domain, email, password, username, last) VALUES($1, $2, $3, $4, $5, $6, $7)',
     [req.body.first_name, req.body.last_name, req.body.domain, req.body.email, req.body.password, req.body.username, req.body.last],
     function(err, result){
            if (err){
                return console.error('error running query', err)
            }
            client.end()
            res.redirect('/')
        })
})
//server
app.listen(3000, function(){
    console.log('Server start on 3000')
})