<?php

namespace App\Modules\SocketClient;

use Illuminate\Support\Facades\Http;

class SocketClient{

    protected $host = "localhost:8080";
    public $events = [];


    public function emit($event){
        try{

            Http::get($this->host."/socket/$event");
        }catch(\Exception $e){
            throw new \App\Modules\SocketClient\Exception\SocketConectionException();
        }
    }

    public function setHost($host): SocketClient{

        $this->host = $host;

        return $this;
    }

    public function on($event, $callback){
        $this->events[$event] = $callback;

        return $this;
    }

    public function __call($name, $arguments)
    {
        if(array_key_exists($name, $this->events)){
            return call_user_func($this->events[$name]);
        }

        throw new \App\Modules\SocketClient\Exception\EventNotRegistred($name);
    }

}