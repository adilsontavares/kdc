import Host from './host'
import SessionKey from './session-key'

class KeyDistributionCenter extends Host {

    constructor(clients) {
        super('KDC')

        this.clients = {}

        for (var i = 0; i < clients.length; ++i) {

            let client = clients[i]
            client.kdc = this

            this.clients[client.id] = client
        }
    }

    sessionKey(from, to, nounce) {

        let sessionKey = `${from}_KEY_TO_${to}`

        let toData = {
            sessionKey,
            from
        }

        let fromData = {
            sessionKey,
            nounce,
            request: {
                from,
                to,
                nounce
            },
            redirect: this.encrypt(toData, this.clients[to].masterKey)
        }

        return this.encrypt(fromData, this.clients[from].masterKey)
    }
}

export default KeyDistributionCenter