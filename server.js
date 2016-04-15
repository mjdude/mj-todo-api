var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('To do api root');
});

// GET /todos
// GET /todos?completed=true
// GET /todos?completed=false
// GET /todos?completed=false?q=work

app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    } else if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }


    console.log(where);

    db.todo.findAll({
        where: where
    }).then(function(todos) {
        if (!!todos) {
            res.json(todos);
        } else {
            res.status(404).send('no todos found');
        }
    }, function(e) {
        res.status(500).send(e);
    });

});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function(todo) {
        // double exclaimation mark checks if truthy or falsy (google !)
        if (!!todo) {
            res.json(todo);
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });

});

// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(404).json(e);
    });
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res) {

    var todoId = parseInt(req.params.id);
    var where = {};

    db.todo.destroy({
      where : {
        id : todoId
      }
    }).then(function(deleteRows){
      if (deleteRows === 0 ) {
        res.status(404).json({
          error: "No todos with id"
        });
      } else {
        res.status(204).send();
      }
    }, function(e){
      res.status(500).send();
    });

    // db.todo.findById(todoId).then(function(todo){
    //   if (!!todo) {
    //     where.id  = todoId;
    //     db.todo.destroy({where : where});
    //     res.json(todo);
    //   } else {
    //      res.status(404).json();
    //   }
    // });

    // var matchedToDo = _.findWhere(todos, {
    //     id: todoId
    // });
    //
    // if (matchedToDo) {
    //     todos = _.without(todos, matchedToDo);
    //     res.json(matchedToDo);
    //     res.status(200).send();
    // } else {
    //     res.status(404).json({
    //         "error": "no todo found with that id"
    //     });
    // }

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedToDo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, "description", "completed");
    var validAttributes = {};

    if (!matchedToDo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedToDo, validAttributes);

    res.json(matchedToDo);

});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port : ' + PORT);
    });
});
