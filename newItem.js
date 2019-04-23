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

function submit() {
    params = getParamsLink()
    dbServerRequest('GET', 'insert' + params, alert)
}