var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors');
var multiparty = require("connect-multiparty");
objectId = require("mongodb").ObjectId;

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,          
  optionSuccessStatus:200
}


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());
app.use(cors(corsOptions));
app.use(function(req,res,next){
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,UPDATE"); 
  res.setHeader("Access-Control-Allow-Headers", "content-type"); 
  res.setHeader("Access-Control-Allow-Credentials", true); 
  next();
})


var port = 3001;
app.listen(port);

var db = new mongodb.Db(
  "todolist",
  new mongodb.Server("localhost", 27017, {}),
  {}
);

console.log(`SERVIDOR ONLINE NA PORTA${port}`);


app.get("/", function (req, res) {
  res.send({ msg: "olá" });
});


app.post("/api", function (req, res) {
  var dados = req.body;
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      collection.insert(dados, function (erro, records) {
        if (erro) {
          res.json({ status: "erro" });
        } else {
          res.json({ status: "inclusao realizada com sucesso" });
        }
        mongoclient.close();
      });
    });
  });
});

// get recupera info do banco de daods
app.get("/api", function (req, res) {
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      collection.find().toArray(function (erro, result) {
        if (erro) {
          res.status(400), json(erro);
        } else {
          res.status(200).json(result);
        }
      });
      mongoclient.close();
    });
  });
});

//recuperar dados get by id
app.get("/api/:id", function (req, res) {
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {  
      collection.find(objectId(req.params.id)).toArray(function (erro, result) {
        if (erro) {
          res.status(400), json(erro);
        } else {
          res.status(200).json(result);
        }
      });
      mongoclient.close();
    });
  });
});
// get para busca
app.get("/api/busca/:search", function (req, res) {
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      collection.find({task:{$regex: new RegExp (req.params.search,'i')}}).toArray(function (erro, result) {
        if (erro) {
          res.status(400), json(erro);
        } else {
          res.status(200).json(result);
        }
      });
      mongoclient.close();
    });
  });
});


app.patch("/api/:id", function (req, res) {
  let completed1=req.body.completed;
  let hiden1=req.body.hiden;

db.open(function (err, mongoclient) {
  mongoclient.collection("tarefas", function (erro, collection) {
    let newValues= {}

    if(req.body.description){
      newValues.description=req.body.description;
    }
    if(req.body.dueDate){
      newValues.dueDate=req.body.dueDate;
    }
    if(req.body.completed !==null){
      newValues.completed=completed1;
    }
    if(req.body.hiden!==null){
      newValues.hiden=hiden1;
    }
    console.log(newValues)
    collection.update(
      { _id: objectId(req.params.id) },
      {$set:newValues},
      function (erro, records) {
        if (erro) {
          res.json(erro);
        } else {
          res.json(records);
        }
        mongoclient.close();
      }
    );
  });
});
});



app.delete("/api/:id", function (req, res) {
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      collection.remove(
        { _id: objectId(req.params.id) },
        function (erro, records) {
          if (erro) {
            res.status(400), json(erro);
          } else {
            res.status(200).json(records);
          }
          mongoclient.close();
        }
      );
    });
  });
});
