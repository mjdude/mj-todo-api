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
// GET /todos?completed=true
// GET /todos?completed=false

app.get('/todos', function(req, res){
    var queryParams = req.query;
    var filteredTodos = todos;

    console.log(queryParams);
    console.log(queryParams.hasOwnProperty('completed'));

    if ( queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
      filteredTodos = _.where(filteredTodos, { completed : true });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
      filteredTodos = _.where(filteredTodos, { completed : false });
    }

    res.json(filteredTodos);
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
    var body = _.pick(req.body, 'description' , 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
      return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId;
    todos.push(body);
    todoNextId++;

    res.json(body);

});

// DELETE /todos/:id

app.delete('/todos/:id',function(req, res){

    var todoId = parseInt(req.params.id);
    var matchedToDo = _.findWhere(todos, {id: todoId});

    if (matchedToDo) {
      todos = _.without(todos , matchedToDo);
      res.json(matchedToDo);
      res.status(200).send();
    }
    else {
      res.status(404).json({"error" : "no todo found with that id"});
    }

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id);
  var matchedToDo = _.findWhere(todos, {id:todoId});
  var body = _.pick( req.body, "description","completed");
  var validAttributes = {};

  if (!matchedToDo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed) ) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedToDo , validAttributes);

  res.json(matchedToDo);

});


app.listen(PORT, function(){
  console.log('Express listening on port : ' + PORT);
});
