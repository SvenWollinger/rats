function loadRat(rat, onSuccess) {
    console.log("Called for " + rat)
    get("/json/rats/" + rat + ".json", (json) => {
        let rat = JSON.parse(json)
        onSuccess(rat)
    })
}

function get(url, onSuccess) {
    let request = new XMLHttpRequest()
    request.open("GET", url)
    request.send()
    request.onreadystatechange = (e) => {
        if(request.readyState === XMLHttpRequest.DONE) {
            if(request.status === 200)
                onSuccess(request.responseText)
        }
    }
}