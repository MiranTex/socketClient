
const createEvent = ({eventType, data, SenderId}) => {
    return {
        eventType: eventType,
        data: data,
        sender: SenderId
    }
}

const createEventFromResposnse = (data) => createEvent(JSON.parse(data));

function SocketClient(server, subscriptions, publicKey, accessToken) {
    this.serverConnection = null;
    this.events = {};
    
    this.publicKey = publicKey;
    this.accessToken = accessToken;
    


    this.init = () => {
        
        this.serverConnection =  new WebSocket(server);

        this.serverConnection.onopen = (e) => {

            this.serverConnection.send(JSON.stringify({
                id: this.id,
                type: 'connection',
                clusterPublicId: this.publicKey,
                accessToken: this.accessToken,
                subscriptions: subscriptions
            }));

            if(this.tryingInterval != null){
                clearInterval(this.tryingInterval);
            }
        };

        this.serverConnection.onclose = async (e) => {
            await setTimeout(this.init, 5000);
        }

        this.serverConnection.onmessage = (e) =>{

            if(e.data == 'connection'){
                console.log(e.data);
                
                return;
            }
            
            const event = createEventFromResposnse(e.data)
    
            if(this.events[event.eventType]){
                
                this.events[event.eventType](event);
            }
        }

        this.on('connection', (event) => {
            this.id = event.data.id;

            console.log(this.id);
            
        })
    }

    this.emit = (eventType, eventMessage={}) =>{

        if(this.id == null){
            alert('Connection not established');
            return false;
        }

        this.serverConnection.send(JSON.stringify({
            id: this.id,
            type: 'event',
            eventType: eventType,
            eventMessage: eventMessage,
            clusterPublicId: this.publicKey,
            accessToken: this.accessToken,

        }));

        return true;
    }

    this.on = (event, callback) =>{
        this.events[event] = callback;
    }

}
