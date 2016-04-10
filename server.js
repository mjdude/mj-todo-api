var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('To do api root');
});

// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos, {id:todoId});

    if (matchedToDo) {
      res.json(matchedToDo);
    } else {
      res.status(404).send();
    }
});

// POST /todos
app.post('/todos', function(req, res){
    var body = req.body;
    console.log('description: ' + body.description);

    body.id = todoNextId;
    todos.push(body);
    todoNextId++;

    res.json(body);




});

app.listen(PORT, function(){
  console.log('Express listening on port : ' + PORT);
});
