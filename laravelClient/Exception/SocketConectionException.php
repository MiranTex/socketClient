<?php

namespace App\Modules\SocketClient\Exception;

class SocketConectionException extends \Exception
{
    public function __construct($message = "Error while connecting to the socket server", $code = 0, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}