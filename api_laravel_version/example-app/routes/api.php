<?php

use App\Http\Controllers\SongController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CountryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/countries', [CountryController::class, 'index']);

Route::group(['prefix' => 'songs'], function () {
    Route::get('/', [SongController::class, 'index']);
    Route::post('/', [SongController::class, 'store']);
    Route::get('/{id}', [SongController::class, 'show']);
    Route::put('/{id}', [SongController::class, 'update']);
    Route::get('/search/{phrase}', [SongController::class, 'search']);
});

/*

// @todo - implement this routes:

Route::group(['prefix' => 'albums'], function () {
    Route::get('/', [AlbumController::class, 'index']);
    Route::post('/', [AlbumController::class, 'store']);
    Route::get('/{id}', [AlbumController::class, 'show']);
    Route::put('/{id}', [AlbumController::class, 'update']);
    Route::get('/search/{phrase}', [AlbumController::class, 'search']);
});

Route::group(['prefix' => 'artists'], function () {
    Route::get('/', [ArtistController::class, 'index']);
    Route::post('/', [ArtistController::class, 'store']);
    Route::get('/{id}', [ArtistController::class, 'show']);
    Route::put('/{id}', [ArtistController::class, 'update']);
    Route::get('/search/{phrase}', [ArtistController::class, 'search']);
});

 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
