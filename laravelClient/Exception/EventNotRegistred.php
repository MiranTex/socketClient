<?php

namespace App\Modules\SocketClient\Exception;

class EventNotRegistred extends \Exception
{
    public function __construct($message, $code = 0, \Throwable $previous = null)
    {
        parent::__construct("Event not registred: ".$message, $code, $previous);
    }
}