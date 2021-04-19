<?php

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

/*
 
Route::get('/songs',   'SongController@getAll');            // paginacja, 
Route::get('/albums',  'AlbumController@getAll');           // paginacja,
Route::get('/artists', 'ArtistController@getAll');          // paginacja,

Route::get('/songs/{id}',   'SongController@getSingle');   
Route::get('/albums/{id}',  'AlbumController@getSingle'); 
Route::get('artists/{id}',  'ArtistController@getSingle');

Route::put('/songs/{id}',   'SongController@update');   
Route::put('/albums/{id}',  'AlbumController@update'); 
Route::put('artists/{id}',  'ArtistController@update');

Route::delete('/songs/{id}',   'SongController@delete');   
Route::delete('/albums/{id}',  'AlbumController@delete'); 
Route::delete('artists/{id}',  'ArtistController@delete');

Route::get('countries', 'CountriesController@getAll');
 
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
