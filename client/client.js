
function SocketClient(){
    this.serverConnection = null;
    this.events = {};

    this.init = (server = 'ws://localhost:8080/socket') => {
        
        this.serverConnection =  new WebSocket(server);

        this.serverConnection.onopen = (e) => {

            const generateUniqueId = () => {
                return Math.random().toString(36).substr(2, 9);
            };            

            this.id = generateUniqueId();

            this.serverConnection.send(JSON.stringify({
                id: this.id,
                type: 'connection'
            }));

            if(this.tryingInterval != null){
                clearInterval(this.tryingInterval);
            }
        };

        this.serverConnection.onclose = async (e) => {
            await setTimeout(this.init, 5000);
        }

        this.serverConnection.onmessage = (e) =>{
            if(this.events[e.data]){
                this.events[e.data]();
            }
        }
    }

    this.emit = (event) =>{
        this.serverConnection.send(JSON.stringify({
            id: this.id,
            type: 'event',
            event: event
        }));

        return true;
    }

    this.on = (event, callback) =>{
        this.events[event] = callback;
    }

}
