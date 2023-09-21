(async () => {
  const express = require('express');
  const dotenv = require('dotenv');
  dotenv.config();

  const bodyParser = require('body-parser');
  const mysql = require('mysql2');
  const app = express();

  app.use(bodyParser.json());

  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER2,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  app.get('/api/items', (req, res) => {
    const sql = 'SELECT * FROM items';
    const query = connection.query(sql, (err, results) => {
      if (err) throw err;

      res.send(apiResponse(results));
    });
  });

  app.post('/api/items', (req, res) => {
    const data = { title: req.body.title, body: req.body.body };

    const sql = `INSERT INTO items SET?`;
    const query = connection.query(sql, data, (err, results) => {
      if (err) throw err;

      res.send(apiResponse(results));
    });
  });

  app.get('/api/items/:id', (req, res) => {
    const sql = 'SELECT * FROM items WHERE id=' + req.params.id;
    const query = connection.query(sql, (err, results) => {
      if (err) throw err;

      res.send(apiResponse(results));
    });
  });

  app.put('/api/items/:id', (req, res) => {
    const sql =
      "UPDATE items SET title='" +
      req.body.title +
      "', body='" +
      req.body.body +
      "'WHERE id=" +
      req.params.id;
    const query = connection.query(sql, (err, results) => {
      if (err) throw err;

      res.send(apiResponse(results));
    });
  });

  app.delete('/api/items/:id', (req, res) => {
    const sql = 'DELETE FROM items WHERE id=' + req.params.id + '';
    const query = connection.query(sql, (err, results) => {
      if (err) throw err;

      res.send(apiResponse(results));
    });
  });

  function apiResponse(results) {
    return JSON.stringify({
      status: 200,
      error: null,
      response: results,
    });
  }

  app.listen(process.env.PORT, () => {
    console.log('Server started...');
    if (connection.config.host) {
      console.log('Database Connected...');
    }
  });
  module.exports = app;
})();
