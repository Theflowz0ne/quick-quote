<?php

use App\Http\Controllers\Api\QuoteController;
use Illuminate\Support\Facades\Route;

Route::get('/quotes', [QuoteController::class, 'index']);
Route::get('/quotes/{id}', [QuoteController::class, 'show']);
Route::post('/quotes', [QuoteController::class, 'store']);
Route::post('/quotes/{ud}', [QuoteController::class, 'destroy']);
