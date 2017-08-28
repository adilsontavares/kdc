import crypto from 'crypto-js'

class Host {

    constructor(name, masterKey) {
        this.name = name
        this.masterKey = masterKey
    }

    encrypt(data, key) {

        key = key || this.masterKey

        try {
            let str = JSON.stringify(data)
            return crypto.AES.encrypt(str, key).toString()
        }
        catch(err) {
            return null
        }
    }

    decrypt(data, key) {

        key = key || this.masterKey

        try {
            let bytes = crypto.AES.decrypt(data, key)
            return JSON.parse(bytes.toString(crypto.enc.Utf8))
        }
        catch(err) {
            return null
        }
    }
}

export default Host