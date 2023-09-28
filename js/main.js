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

document.getElementById("gallery").onclick = (e1) => {
    if(e1.target.id === "gallery") closeGallery()
}

function openGallery(image) {
    setSearchParam("gallery", image)
    style("gallery").display = "flex"
    id("galleryImage").src = image
    id("galleryDownloadLink").href = image
}

function closeGallery() {
    clearSearchParam("gallery")
    style("gallery").display = "none"
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
    let content = id("content")
    if(selectedRat == null) {
        content.innerHTML = `<h1 style="text-align:center;width:100%;">All Rattos:</h1>`
        config.rats.forEach((id) => {
            create("div", content,(card) => {
                card.className = "card"

                loadRat(id, (rat) => {
                    create("div", card, (cardContent) => {
                        cardContent.className = "cardInner"

                        create("img", cardContent, (thumbnail) => {
                            thumbnail.src = rat.thumbnail
                            thumbnail.className = "ratThumbnail"
                            thumbnail.onclick = () => {
                                let newParams = getParams()
                                newParams.set("rat", id)
                                window.location.search = newParams.toString()
                            }
                        })


                        create("h1", cardContent, (e) => {
                            e.innerText = rat.name
                            if(rat.passed != null) e.innerText += " †"
                            e.style.textAlign = "center"
                            e.style.color = "black"
                        })
                    })
                })
            })


        })
    } else {
        if(config.rats.includes(selectedRat)) {
            loadRat(selectedRat, (rat) => {
                if(getParams().get("gallery") != null) {
                    openGallery(getParams().get("gallery"))
                }

                id("galleryRight").onclick = () => {
                    let nextIndex = rat.images.indexOf(getParams().get("gallery")) + 1;
                    if(nextIndex >= rat.images.length) nextIndex = 0

                    setSearchParam("gallery", rat.images[nextIndex])
                    openGallery(rat.images[nextIndex])
                }

                id("galleryLeft").onclick = () => {
                    let nextIndex = rat.images.indexOf(getParams().get("gallery")) - 1;
                    if(nextIndex < 0) nextIndex = rat.images.length - 1

                    setSearchParam("gallery", rat.images[nextIndex])
                    openGallery(rat.images[nextIndex])
                }

                rat.images.forEach((image) => {
                    console.log(image)
                    create("img", id("selectedRatGallery"), (thumb) => {
                        thumb.src = image
                        thumb.style.maxWidth = "15vw"
                        thumb.style.maxHeight = "15vh"
                        thumb.style.padding = "5px"
                        thumb.style.borderRadius = "10px 10px 10px 10px"

                        thumb.className = "pointer"
                        thumb.onclick = () => {
                            openGallery(image)
                        }
                    })
                })
                id("selectedRatName").innerText = rat.name
                style("selectedRatArea").display = "flex"
                id("selectedRatBigPic").src = rat.bigPic
                id("selectedRatBorn").innerText = rat.born
                if(rat.passed != null)
                    id("selectedRatRB").innerText = rat.passed
                else
                    style("selectedRatRBParent").display = "none"
            })
        } else {
            document.getElementById("content").innerHTML =
                "<div style='text-align:center'><p>Rat not found!</p>" +
                "<a href='/'>Go back?</a></div>"
        }
    }
})