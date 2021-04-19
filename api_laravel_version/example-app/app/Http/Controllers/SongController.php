<?php


namespace App\Http\Controllers;

use App\Models\Song;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SongController extends Controller
{
    /**
     * Get all songs
     *
     * @return Song[]|\Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return Song::all();
    }

    /**
     * Save new song in database
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        // Validation errors are handled by Laravel
        $request->validate($this->validationRules());

        try {
            $song = new Song($this->getFieldsFromRequest($request));
            $song->save();
        }
        catch (Exception $e) {
            Log::error('Error while storing to database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error',
            ]);
        }

        return new JsonResponse([
            'status'  => Response::HTTP_CREATED,
            'message' => 'Record was successfully created',
        ]);
    }

    public function show($id)
    {
        return Song::where('id', $id);
    }

    public function update(Request $request, $id) : void
    {
        $flight = Song::find(1);

        $flight->name = 'Paris to London';

        $flight->save();
    }

    public function search(Request $request, $phrase) : array
    {
        return Country::all();
    }

    public function destroy($id) : void
    {

    }

    private function validationRules() : array
    {
        return [
            'name' => 'required|max:96',
            'key'  => ['nullable', Rule::in(Song::$MUSIC_KEYS)],
            'explicit' => 'nullable|boolean',
            'album_id' => 'nullable|string|max:36',
            'mode' => 'nullable|boolean',
            'danceability' => 'nullable|between:0,1',
            'energy' => 'nullable|between:0,1',
            'acousticness' => 'nullable|between:0,1',
            'instrumentalness' => 'nullable|between:0,1',
            'valence' => 'nullable|between:0,1',
            'release_date' => 'nullable|date|date_format:Y-m-d',
            'spotify_link' => 'nullable|string|max:160',
        ];
    }

    private function getFieldsFromRequest(Request $request) : array
    {
        return [
            'name'              => $request->get('name'),
            'explicit'          => $request->get('explicit'),
            'album_id'          => $request->get('album_id'),
            'key'               => $request->get('key'),
            'mode'              => $request->get('mode'),
            'danceability'      => $request->get('danceability'),
            'energy'            => $request->get('energy'),
            'acousticness'      => $request->get('acousticness'),
            'instrumentalness'  => $request->get('instrumentalness'),
            'valence'           => $request->get('valence'),
            'release_date'      => $request->get('release_date'),
            'spotify_link'      => $request->get('spotify_link')
        ];
    }
}

