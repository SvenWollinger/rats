class Config {
    rats
}

class Rat {
    name
    thumbnail
    bigPic
    born
    passed
    images
}

document.getElementById("gallery").onclick = (e1, e2) => {
    if(e1.target.id === "gallery") closeGallery()
}

function openGallery(image) {
    setSearchParam("gallery", image)
    document.getElementById("gallery").style.display = "flex"
    document.getElementById("galleryImage").src = image
    document.getElementById("galleryDownloadLink").href = image
}

function closeGallery() {
    clearSearchParam("gallery")
    document.getElementById("gallery").style.display = "none"
}

function loadRat(rat, onSuccess) {
    console.log("Called for " + rat)
    get("/json/rats/" + rat + ".json", (json) => {
        onSuccess(Object.assign(new Rat(), JSON.parse(json)))
    })
}

get("/json/config.json", (json) => {
    let config = Object.assign(new Config(), JSON.parse(json))
    console.log("Config loaded:")
    console.log(config)

    let selectedRat = getParams().get("rat")
    let content = document.getElementById("content")
    if(selectedRat == null) {
        content.innerHTML = `<h1 style="text-align:center;width:100%;">All Rattos:</h1>`
        config.rats.forEach((id) => {
            let card = document.createElement("div")
            content.appendChild(card)

            loadRat(id, (rat) => {
                card.className = "card"
                let cardContent = document.createElement("div")
                cardContent.className = "cardInner"
                card.appendChild(cardContent)

                let ratThumbnail = document.createElement("img")
                ratThumbnail.src = rat.thumbnail
                ratThumbnail.className = "ratThumbnail"
                ratThumbnail.onclick = () => {
                    let newParams = getParams()
                    newParams.set("rat", id)
                    window.location.search = newParams.toString()
                }
                cardContent.appendChild(ratThumbnail)

                let ratTitle = document.createElement("h1")
                ratTitle.innerText = rat.name
                if(rat.passed != null) ratTitle.innerText += " †"
                ratTitle.style.textAlign = "center"
                ratTitle.style.color = "black"
                cardContent.appendChild(ratTitle)

            })
        })
    } else {
        if(config.rats.includes(selectedRat)) {
            loadRat(selectedRat, (rat) => {
                if(getParams().get("gallery") != null) {
                    openGallery(getParams().get("gallery"))
                }

                document.getElementById("galleryRight").onclick = () => {
                    let nextIndex = rat.images.indexOf(getParams().get("gallery")) + 1;
                    if(nextIndex >= rat.images.length) nextIndex = 0

                    setSearchParam("gallery", rat.images[nextIndex])
                    openGallery(rat.images[nextIndex])
                }

                document.getElementById("galleryLeft").onclick = () => {
                    let nextIndex = rat.images.indexOf(getParams().get("gallery")) - 1;
                    if(nextIndex < 0) nextIndex = rat.images.length - 1

                    setSearchParam("gallery", rat.images[nextIndex])
                    openGallery(rat.images[nextIndex])
                }

                let gallery = document.getElementById("selectedRatGallery")
                rat.images.forEach((image) => {
                    console.log(image)
                    let galleryThumb = document.createElement("img")
                    galleryThumb.src = image
                    galleryThumb.style.maxWidth = "15vw"
                    galleryThumb.style.maxHeight = "15vh"
                    galleryThumb.style.padding = "5px"
                    galleryThumb.style.borderRadius = "10px 10px 10px 10px"

                    galleryThumb.className = "pointer"
                    galleryThumb.onclick = () => {
                        openGallery(image)
                    }
                    gallery.appendChild(galleryThumb)
                })
                document.getElementById("selectedRatName").innerText = rat.name
                document.getElementById("selectedRatArea").style.display = "flex"
                document.getElementById("selectedRatBigPic").src = rat.bigPic
                document.getElementById("selectedRatBorn").innerText = rat.born
                if(rat.passed != null)
                    document.getElementById("selectedRatRB").innerText = rat.passed
                else
                    document.getElementById("selectedRatRBParent").style.display = "none"
            })
        } else {
            document.getElementById("content").innerHTML =
                "<div style='text-align:center'><p>Rat not found!</p>" +
                "<a href='/'>Go back?</a></div>"
        }
    }
})