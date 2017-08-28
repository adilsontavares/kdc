import Host from './host'

class Client extends Host {
    
    constructor(id, name, key) {
        super(name, key)

        this.id = id

        if (!Client.all)
            Client.all = {}

        Client.all[id] = this
    }

    setKDC(kdc) {
        this.kdc = kdc
    }

    requestSessionKey(to) {
        let sessionKey = this.kdc.sessionKey(this.id, to, )
    }

    generateNounce() {
        return Math.floor(Math.random() * 1000)
    }

    connectTo(client) {

        console.log(`${this.name} deseja conectar com ${client.name}.`)
        console.log(`${this.name} envia requisição de chave de sessão para o KDC.`)

        let nounce = this.generateNounce()
        let response = this.kdc.sessionKey(this.id, client.id, nounce)

        console.log(`${this.name} recebe: ${response}.`)
        console.log(`${this.name} descriptografa a mensagem utilizando sua chave mestra.`)

        let json = this.decrypt(response)
        let redirect = json.redirect

        console.log(json)
        
        this.sessionKey = json.sessionKey
        this.connectedTo = client.id

        console.log(`${this.name} envia parte da mensagem para ${client.name}.`)
        client.connectionRequest(redirect)
    }

    connectionRequest(request) {

        console.log(`${this.name} recebe: ${request}`)
        console.log(`${this.name} descriptografa a mensagem utilizando sua chave mestra.`)

        let json = this.decrypt(request)
        console.log(json)

        this.sessionKey = json.sessionKey
        this.connectedTo = json.from

        console.log(`${this.name} agora está conectado com ${Client.all[this.connectedTo].name} com chave de sessão: ${this.sessionKey}.`)
        this.authenticateTo(this.connectedTo)
    }

    authenticateTo(id) {

        console.log(`${this.name} inicia autenticação com ${Client.all[id].name}.`)

        let data = {
            nounce: this.generateNounce()
        }

        let message = this.encrypt(data, this.sessionKey)        
        Client.all[id].authenticationRequest(message)
    }

    authenticationRequest(data) {

        console.log(`${this.name} recebe mensagem: ${data}`)

        let message = this.decrypt(data, this.sessionKey)
        console.log(`${this.name} descriptografa a mensagem utilizandoa chave de sessão.`)
        console.log(message)

        message.nounce += 1

        console.log(`${this.name} incrementa o nounce em 1 e envia novamente para ${Client.all[this.connectedTo].name}.`)
        
        let response = this.encrypt(message, this.sessionKey)
        Client.all[this.connectedTo].authenticationResponse(response)
    }

    authenticationResponse(data) {

        console.log(`${this.name} recebe: ${data}`)
        console.log(`${this.name} descriptografa a mensagem utilizando a chave de sessão.`)

        let json = this.decrypt(data, this.sessionKey)
        console.log(json)

        console.log(`${this.name} e ${Client.all[this.connectedTo].name} agora estão autenticados!`)
    }
}

export default Client