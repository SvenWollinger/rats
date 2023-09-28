function setSearchParam(key, value) {
    let params = getParams()
    params.set(key, value)
    window.history.pushState("", "", "?" + params.toString())
}

function clearSearchParam(key) {
    let params = getParams()
    params.delete(key)
    window.history.pushState("", "", "?" + params.toString())
}

function id(id) {
    return document.getElementById(id)
}

function style(id) {
    return this.id(id).style
}

function create(type, parent, setup) {
    let element = document.createElement(type)
    if(parent != null) parent.appendChild(element)
    if(setup != null) setup(element)
    return element
}

function getParams() {
    return new URLSearchParams(window.location.search)
}

function get(url, onSuccess) {
    let request = new XMLHttpRequest()
    request.open("GET", url)
    request.send()
    request.onreadystatechange = () => {
        if(request.readyState === XMLHttpRequest.DONE) {
            if(request.status === 200)
                onSuccess(request.responseText)
        }
    }
}