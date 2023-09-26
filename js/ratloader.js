class Rat {
    name
    thumbnail
    bigPic
    born
    passed
    images
}

function loadRat(rat, onSuccess) {
    console.log("Called for " + rat)
    get("/json/rats/" + rat + ".json", (json) => {
        onSuccess(Object.assign(new Rat(), JSON.parse(json)))
    })
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