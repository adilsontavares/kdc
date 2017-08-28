class SessionKey {

    constructor(from, to, nounce) {
        this.from = from
        this.to = to
        this.nounce = nounce
    }

    print() {
        console.log("# SESSION KEY:")
        console.log(`- from:   ${this.from}`)
        console.log(`- to:     ${this.to}`)
        console.log(`- nounce: ${this.nounce}`)
    }
}

export default SessionKey