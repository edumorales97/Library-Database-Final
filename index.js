class Table {
  constructor(columnNames, books) {
    this.columnNames = columnNames
    this.books = books

    this.getRows = () => {
      var library = []
      for (var book in this.books) {
        var row = []
        for (var column in this.columnNames) {
          var columnName = this.columnNames[column]
          row.push(this.books[book][columnName])
        }
        library.push(row)
      }
      return library
    }
  }
}

window.onload = function () {
  console.log('Loaded window.onload()')
  dbServerRequest('GET', 'getAllBooks', refreshTable, 'All')
}

function search() {
  var searchQuery = document.getElementById('searchTextBox').value
  console.log(searchQuery)
  dbServerRequest('GET', `search?search=${searchQuery}`, refreshTable, 'All')
}

function getTable(table) {
  dbServerRequest('GET', `getTable?table=${table}`, refreshTable, table)
}


function refreshTable(table, jsonResponse) {
  tables = {
    All: ['bookCode', 'copyNum', 'branchNum', 'title', 'authorFirst', 'authorLast', 'type', 'quality', 'paperback', 'price', 'branchName', 'branchLocation', 'city'],
    Author: ['authorNum', 'authorFirst', 'authorLast'],
    Book: ['bookCode', 'title', 'publisherCode', 'type', 'paperback'],
    Branch: ['branchNum', 'branchName', 'branchLocation'],
    Copy: ['bookCode', 'branchNum', 'copyNum', 'quality', 'price'],
    Publisher: ['publisherCode', 'publisherName', 'city'],
    Wrote: ['bookCode', 'authorNum', 'sequence'],
    Inventory: ['bookCode', 'branchNum', 'onHand']
  };

  var obj = JSON.parse(jsonResponse);
  console.log(obj)
  var tableObj = new Table(tables[table], obj);
  var library = tableObj.getRows();

  let columnRef = document.getElementById('columns');
  columnRef.innerHTML = ''

  for (var column in tableObj.columnNames) {
    columnRef.innerHTML += `<th scope="col">${tableObj.columnNames[column]}</th>`
  }
  columnRef.innerHTML += `<th scope="col">${''}</th>`
  columnRef.innerHTML += `<th scope="col">${''}</th>`



  let tableRef = document.getElementById('table');

  tableRef.innerHTML = ''

  for (var row in library) {
    let newRow = tableRef.insertRow(-1);

    for (var column in library[row]) {
      let newCell = newRow.insertCell(-1);
      let newText = document.createTextNode(library[row][column]);
      newCell.appendChild(newText);
    }

    if (table == 'All') {
      createEDITorDEL(newRow, 'EDIT', library[row][0], library[row][1], library[row][2]);
      createEDITorDEL(newRow, 'DEL', library[row][0], library[row][1], library[row][2]);
    }
  }
}

function createEDITorDEL(newRow, type, bookCode, copyNum, branchNum) {
  var api = type === 'DEL' ? 'delete' : 'edit';
  let newCell = newRow.insertCell(-1);
  var link = document.createElement("a");
  link.setAttribute("href", `http://localhost:8080/${api}?bookCode=${bookCode}&copyNum=${copyNum}&branchNum=${branchNum}`)
  var linkText = document.createTextNode(type);
  link.appendChild(linkText);
  newCell.appendChild(link);
}

function reset() {
  dbServerRequest('GET', 'reset', function (result) {
    console.log(result)
  })
}

function dbServerRequest(typeOfRequest, params, func, table) {
  var request = new XMLHttpRequest();
  var url = 'http://localhost:8080/' + params
  console.log(url)

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      func(table, this.responseText)
    }
  };

  request.open(typeOfRequest, url);
  request.send();
}