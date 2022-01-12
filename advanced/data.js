const dataPool = [
    "t",
    "is",
    "a",
    "long",
    "established",
    "fact",
    "that",
    "a",
    "reader",
    "will",
    "be",
    "distracted",
    "by",
    "the",
    "readable",
    "content",
    "of",
    "a",
    "page",
    "when",
    "looking",
    "at",
    "its",
    "layout"
]

const getRandomData = () => {
    const data = {}
    data.list = []
    
    for(var i = 0; i < 100; i++) {
        data[dataPool[Number.parseInt(''+Math.random()*(dataPool.length-1))]] = dataPool[Number.parseInt(''+Math.random()*(dataPool.length-1))]

        data.list[i] = Math.random()*i
    }

    return data
}

export {
    getRandomData
}