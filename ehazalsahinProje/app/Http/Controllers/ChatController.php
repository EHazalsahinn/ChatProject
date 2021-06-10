<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function chat(Request $request){
        $user = $request->user;
        return response($user);
    }
}
