var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
  id: 1,
  description: 'meet mum for lunch',
  completed: false,
}, {
  id: 2,
  description: 'go to market',
  completed: false,
},{
  id: 3,
  description: 'complete udemy task',
  completed: true,
}];

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
    var matchToDo;

    todos.forEach(function(todo){
        if (todo.id === todoId) {
          matchToDo = todo;
        }

    });

    if (matchToDo) {
      res.json(matchToDo);
    } else {
      res.status(404).send();
    }
});



app.listen(PORT, function(){
  console.log('Express listening on port : ' + PORT);
});
