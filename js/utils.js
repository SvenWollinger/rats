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