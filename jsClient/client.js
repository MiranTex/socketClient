
const createEvent = ({eventType, data, SenderId}) => {
    return {
        eventType: eventType,
        data: data,
        sender: SenderId
    }
}

const createEventFromResposnse = (data) => createEvent(JSON.parse(data));

function SocketClient(server, subscriptions){
    this.serverConnection = null;
    this.events = {};


    this.init = () => {
        
        this.serverConnection =  new WebSocket(server);

        this.serverConnection.onopen = (e) => {

            const generateUniqueId = () => {
                return Math.random().toString(36).substr(2, 9);
            };            

            this.id = generateUniqueId();

            this.serverConnection.send(JSON.stringify({
                id: this.id,
                type: 'connection',
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
            const event = createEventFromResposnse(e.data)
    
            if(this.events[event.eventType]){
                
                this.events[event.eventType](event);
            }
        }
    }

    this.emit = (eventType, eventMessage={}) =>{
        this.serverConnection.send(JSON.stringify({
            id: this.id,
            type: 'event',
            eventType: eventType,
            eventMessage: eventMessage 
        }));

        return true;
    }

    this.on = (event, callback) =>{
        this.events[event] = callback;
    }

}
