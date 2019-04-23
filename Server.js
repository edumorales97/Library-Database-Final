const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.static(__dirname + '/public'));

var sqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'HenryPSQL'
});

sqlConnection.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + 'public/index.html')));
app.get('/getAllBooks', getAllBooks);
app.get('/getBookInfo', getBookInfo);
app.get('/search', search);
app.get('/edit', (req, res) => res.sendFile(path.join(__dirname + '/public/editItem.html')));
app.get('/newItem', (req, res) => res.sendFile(path.join(__dirname + '/public/newItem.html')));
app.get('/delete', deleteBook);
app.get('/update', update);
app.get('/insert', insert)
app.get('/getTable', getTable)

function getAllBooks(req, res) {
  console.log(req.url)
  query = `SELECT * FROM (SELECT * FROM (SELECT * FROM (SELECT * FROM (SELECT * FROM 
    (SELECT * FROM Author INNER JOIN Wrote USING (authorNum)) T1
    INNER JOIN Copy USING (bookCode)) T2
    INNER JOIN Book USING (bookCode)) T3
    INNER JOIN Publisher USING (publisherCode)) T4
    INNER JOIN Branch USING (branchNum)) T5
    ORDER BY bookCode ASC;`
  sqlConnection.query(query, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

function getTable(req, res) {
  query = `SELECT * FROM ${req.query.table}`
  sqlConnection.query(query, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

function getBookInfo(req, res) {
  console.log(req.url);
  query = `SELECT * FROM (SELECT * FROM (SELECT * FROM (SELECT * FROM (SELECT * FROM
    (SELECT * FROM Book JOIN Wrote USING (bookCode)) T1
     JOIN Copy USING (bookCode)) T2
     JOIN Author USING (authorNum)) T3
     JOIN Publisher USING (publisherCode)) T4
     JOIN Branch USING (branchNum)) T5 WHERE bookCode = '${req.query.bookCode}'
     AND copyNum = ${req.query.copyNum} AND branchNum = ${req.query.branchNum};`;

  sqlConnection.query(query, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

function insert(req, res) {
  //Insert to Author
  query = `INSERT INTO Author (authorNum, authorFirst, authorLast)
  VALUES(${req.query.authorNum}, '${req.query.authorFirst}', '${req.query.authorLast}');`
  sqlRequest(query)

  //Insert to Book
  query = `INSERT INTO Book (bookCode, title, publisherCode, type, paperback)
  VALUES('${req.query.bookCode}', '${req.query.title}', '${req.query.publisherCode}', '${req.query.type}', '${req.query.paperback}');`
  sqlRequest(query)

  //Insert to Branch
  query = `INSERT INTO Branch (branchNum, branchName, branchLocation)
  VALUES(${req.query.branchNum}, '${req.query.branchName}', '${req.query.branchLocation}');`
  sqlRequest(query)

  //Insert to Copy
  query = `INSERT INTO Copy (bookCode, branchNum, copyNum, quality, price)
  VALUES('${req.query.bookCode}', ${req.query.branchNum}, ${req.query.copyNum}, '${req.query.quality}', ${req.query.price});`
  sqlRequest(query)

  //Insert to Publisher
  query = `INSERT INTO Publisher (publisherCode, publisherName, city)
  VALUES('${req.query.publisherCode}', '${req.query.publisherName}', '${req.query.city}');`
  sqlRequest(query)

  //Insert to Wrote
  query = `INSERT INTO Wrote (bookCode, authorNum, sequence)
  VALUES('${req.query.bookCode}', ${req.query.authorNum}, ${req.query.sequence});`
  sqlRequest(query)

  res.send('If the info was entered correctly, it should now appear on the database!')

}

function deleteBook(req, res) {
  console.log(req.url)
  query = `DELETE FROM Copy WHERE bookCode = '${req.query.bookCode}' AND copyNum = ${req.query.copyNum} AND branchNum = ${req.query.branchNum};`
  sqlRequest(query)
  res.sendFile(path.join(__dirname + '/public/index.html'))
}

function search(req, res) {
  console.log(req.url);
  var query = `
  SELECT * FROM(SELECT * FROM(SELECT * FROM(SELECT * FROM(SELECT * FROM(SELECT * FROM Book JOIN Wrote USING(bookCode)) T1 JOIN Copy USING(bookCode)) T2 JOIN Author USING(authorNum)) T3 JOIN Publisher USING(publisherCode)) T4 JOIN Branch USING(branchNum))
  T5 WHERE Title LIKE '%${req.query.search}%'
  OR bookCode = '${req.query.search}'
  OR authorFirst LIKE '%${req.query.search}%'
  OR authorLast LIKE '%${req.query.search}%'
  OR publisherCode LIKE '%${req.query.search}%'
  OR publisherName LIKE '%${req.query.search}%'
  OR city LIKE '%${req.query.search}%'
  OR branchName LIKE '%${req.query.search}%';`

  sqlConnection.query(query, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
}

function update(req, res) {
  console.log(req.url)
  console.log(req.query)

  //Updating Author Table
  updateAuthor('authorFirst', req.query.authorNum, req.query.authorFirst)
  updateAuthor('authorLast', req.query.authorNum, req.query.authorLast)

  //Updating Book Table
  updateBook('title', req.query.bookCode, req.query.title)
  updateBook('type', req.query.bookCode, req.query.type)
  updateBook('paperback', req.query.bookCode, req.query.paperback)

  //Updating Branch Table
  updateBranch('branchName', req.query.branchNum, req.query.branchName)
  updateBranch('branchLocation', req.query.branchNum, req.query.branchLocation)

  //Updating Copy Table
  updateCopy('quality', req.query.bookCode, req.query.copyNum, req.query.quality)
  updateCopy('price', req.query.bookCode, req.query.copyNum, req.query.price)

  //Updating Publisher Table
  updatePublisher('publisherName', req.query.publisherCode, req.query.publisherName)
  updatePublisher('city', req.query.publisherCode, req.query.city)

  //Updating Wrote Table
  updateWrote('sequence', req.query.authorNum, req.query.sequence)

  res.send('If the info was entered correctly, it should now appear on the database!')
}

function sqlRequest(query) {
  console.log(query)
  sqlConnection.query(query, function (err, result) {
    if (err) console.log(err)
    console.log(result)
  });
}

function updateAuthor(key, authorNum, newName) {
  var query = `
  UPDATE Author SET ${key} = '${newName}' WHERE authorNum = ${authorNum};`
  sqlRequest(query)
}


function updateBook(key, bookCode, value) {
  var query = `UPDATE Book SET ${key} = '${value}' WHERE bookCode = '${bookCode}';`
  sqlRequest(query)
}

function updateBranch(key, branchNum, value) {
  var query = `UPDATE Branch SET ${key} = '${value}' WHERE branchNum = ${branchNum};`
  sqlRequest(query)
}

function updateCopy(key, bookCode, copyNum, value) {
  var query = `
  UPDATE Copy SET ${key} = '${value}' WHERE bookCode = '${bookCode}' AND copyNum = ${copyNum};`
  sqlRequest(query)
}

function updatePublisher(key, publisherCode, value) {
  var query = `UPDATE Publisher SET ${key} = '${value}' WHERE publisherCode = '${publisherCode}';`
  sqlRequest(query)
}

function updateWrote(key, bookCode, value) {
  var query = `
  UPDATE Wrote SET ${key} = '${value}' WHERE bookCode = '${bookCode}';`
  sqlRequest(query)
}


app.listen(PORT, () => console.log(`Server is on PORT ${PORT}`));