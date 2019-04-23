window.onload = function () {
    console.log('Loaded window.onload()')
    console.log(window.location.href)

    params = window.location.href.split('edit?')[1]
    console.log('params' + params)

    console.log(branchNum)

    dbServerRequest('GET', `getBookInfo?${params}`, loadItem)
}

function getParamsLink() {
    params = '?'
    params += 'bookCode=' + document.getElementById('bookCode').value
    params += '&title=' + document.getElementById('bookTitle').value
    params += '&authorFirst=' + document.getElementById('authorFirst').value
    params += '&authorLast=' + document.getElementById('authorLast').value
    params += '&branchName=' + document.getElementById('branchName').value
    params += '&branchLocation=' + document.getElementById('location').value
    params += '&city=' + document.getElementById('city').value
    params += '&price=' + document.getElementById('price').value
    paperback = document.getElementById('paperback').checked ? 'Y' : 'N'
    params += '&paperback=' + paperback
    params += '&sequence=' + document.getElementById('sequence').value
    params += '&publisherCode=' + document.getElementById('publisherCode').value
    params += '&authorNum=' + document.getElementById('authorNum').value
    params += '&copyNum=' + document.getElementById('copyNum').value
    params += '&quality=' + document.getElementById('quality').value
    params += '&branchNum=' + document.getElementById('branchNum').value
    params += '&type=' + document.getElementById('type').value
    params += '&publisherName=' + document.getElementById('publisherName').value

    return params
}

function dbServerRequest(typeOfRequest, params, func) {
    var request = new XMLHttpRequest();
    var url = 'http://localhost:8080/' + params
    console.log(url)

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            func(this.responseText)
        }
    };

    request.open(typeOfRequest, url);
    request.send();
}

function loadItem(itemAsString) {
    var item = JSON.parse(itemAsString)[0];
    console.log(item)

    document.getElementById('bookCode').value = item['bookCode']
    document.getElementById('bookTitle').value = item['title']
    document.getElementById('authorFirst').value = item['authorFirst']
    document.getElementById('authorLast').value = item['authorLast']
    document.getElementById('branchName').value = item['branchName']
    document.getElementById('location').value = item['branchLocation']
    document.getElementById('city').value = item['city']
    document.getElementById('price').value = item['price']
    document.getElementById('paperback').checked = item['paperback'] == 'Y'
    document.getElementById('sequence').value = item['sequence']
    document.getElementById('publisherCode').value = item['publisherCode']
    document.getElementById('authorNum').value = item['authorNum']
    document.getElementById('copyNum').value = item['copyNum']
    document.getElementById('quality').value = item['quality']
    document.getElementById('branchNum').value = item['branchNum']
    document.getElementById('type').value = item['type']
    document.getElementById('publisherName').value = item['publisherName']
}

function submit() {
    params = getParamsLink()
    dbServerRequest('GET', 'update' + params, alert)
}