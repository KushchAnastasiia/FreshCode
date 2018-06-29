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

for_test = [
    {
    id: 1,
    first_name: "hui",
    last_name: "sobaka",
    domain: "loh",
    email: "pidor@gmail.com",
    password: "freshcode-gavno",
    username: "umor",
    last: "nikogda"
    },
    {
    id: 2,
    first_name: "pipirka",
    last_name: "sobaka",
    domain: "aloh",
    email: "pidor@gmail.com",
    password: "freshcode-gavno",
    username: "umor",
    last: "nikogda"
    }          
]

app.get('/', function(req, res){
    // res.render('index')
    //PG Connect

    const client = new pg.Client(connectStr);
    client.connect()

    client.query('SELECT * FROM users', function(err, result){
        if (err){
            return console.error('error running query', err)
        }
        res.render("layout", {users: result.rows})
        // res.render("layout", {users: for_test})
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