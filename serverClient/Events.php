<?php

namespace App\Modules\SocketClient;

use App\Modules\SocketClient\SocketClient;


//register your events

class Events {

    function __construct()
    {
        $this->socketClient = new SocketClient();
    }
    
    public function register(){
        
        $this->socketClient->on('test', function(){
            dd('testando');
        });




        return $this;
    }

    public function getClient(){
        return $this->socketClient;
    }

}

