var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var multiparty = require("connect-multiparty");
objectId = require("mongodb").ObjectId;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());

var port = 8080;
app.listen(port);

var db = new mongodb.Db(
  "todolist",
  new mongodb.Server("localhost", 27017, {}),
  {}
);

console.log("SERVIDOR ONLINE NA PORTA 8080");

app.get("/", function (req, res) {
  res.send({ msg: "olá" });
});

//metodo post
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

//metodo put by id  para update
app.put("/api/:id", function (req, res) {
  db.open(function (err, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      console.log("passou por aqui", erro);
      collection.update(
        { _id: objectId(req.params.id) },
        {
          $set: { descricao: req.body.descricao },
          $set: { data: req.body.data },
          $set: { complete: req.body.complete },
        },
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

//metodo delete by id  para update

app.delete("/api/:id", function (req, res) {
  db.open(function (erro, mongoclient) {
    mongoclient.collection("tarefas", function (erro, collection) {
      console.log("passou por aqui", erro);
      collection.remove(
        { _id: objectId(req.params.id) },
        function (erro, records) {
          if (erro) {
            res.status(400), json(erro);
          } else {
            // deleta todos os arquivos naquele id especifico
            res.status(200).json(records);
          }
          mongoclient.close();
        }
      );
    });
  });
});
