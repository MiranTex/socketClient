<?php
namespace App\Modules\SocketClient\Routes;

use App\Modules\SocketClient\SocketClient;
use Illuminate\Support\Facades\Route;

class SocketClientRoutes {

    static public function register()
    {
        Route::get('socketClient/{event}', function (SocketClient $client, $event) {

            call_user_func([$client, $event]);
        });
    }
}