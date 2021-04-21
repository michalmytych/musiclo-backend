<?php


namespace App\Http\Controllers;

use App\Models\Song;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * @todo - maybe move whole JsonResponse returning to some trait?
 *
 * Class SongController
 * @package App\Http\Controllers
 */
class SongController extends Controller
{
    const PAGINATION_AMOUNT = 10;
    /**
     * Get all songs
     *
     * @return JsonResponse
     */
    public function index()
    {
        /**
         * @todo - implement pagination
         */
        try {
            return Song::paginate(self::PAGINATION_AMOUNT);
        }
        catch (Exception $e) {
            Log::error('Error while storing to database', [ 'exception' => $e]);
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error'
            ]);
        }
    }

    /**
     * Save new song in database
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        $validator = Validator::make($request->all(), $this->validationRules());

        if ($validator->fails()) {
            $validationErrors = $validator->messages();
            return new JsonResponse([
                'status'  => Response::HTTP_BAD_REQUEST,
                'message' => 'Bad request',
                'errors'  => $validationErrors
            ]);
        }

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
                'message' => 'Internal server error'
            ]);
        }

        return new JsonResponse([
            'status'  => Response::HTTP_CREATED,
            'message' => 'Record was successfully created',
        ]);
    }

    /**
     * Fetch single song from database by id
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id) : JsonResponse
    {
        try
        {
            $song = Song::findOrFail($id);
        }
        catch(ModelNotFoundException $e)
        {
            return new JsonResponse([
                'status'  => Response::HTTP_NOT_FOUND,
                'message' => 'Not found',
            ]);
        }

        return new JsonResponse($song);
    }

    /**
     * Update song resource by id, with validated data
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function update(Request $request, $id) : JsonResponse
    {
        try
        {
            $song = Song::findOrFail($id);
        }
        catch(ModelNotFoundException $e)
        {
            return new JsonResponse([
                'status'  => Response::HTTP_NOT_FOUND,
                'message' => 'Not found',
            ]);
        }
        $request->validate($this->validationRules());
        try {
            $song->update($this->getFieldsFromRequest($request));
            $song->save();
        }
        catch (Exception $e) {
            Log::error('Error while storing to database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error while updating resource',
            ]);
        }

        return new JsonResponse([
            'status'  => Response::HTTP_OK,
            'message' => 'Record was successfully updated',
        ]);
    }

    /**
     * Search songs by phrase
     * @todo - complete method implementation
     * @todo - implement pagination
     * @param Request $request
     * @param $phrase
     * @return JsonResponse
     */
    public function search(Request $request, $phrase) : JsonResponse
    {
        /**
         * @todo - więcej reguł wyszukiwania
         * @todo - dodać wyszukiwanie po nazwie albumu lub artysty
         */
        try
        {
            return Song::where('name', 'like', "%{$phrase}")->get();
        }
        catch(Exception $e)
        {
            Log::error('Error while searching in the database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error'
            ]);
        }
    }

    /**
     * Delete song resource by id
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id) : JsonResponse
    {
        try
        {
            $song = Song::findOrFail($id);
        }
        catch(ModelNotFoundException $e) {
            return new JsonResponse([
                'status'  => Response::HTTP_NOT_FOUND,
                'message' => 'Not found',
            ]);
        }

        try {
            $song->delete();
        }
        catch (Exception $e) {
            Log::error('Error while deleting from database', [
                'exception'   => $e,
                'table'       => 'songs',
                'resource_id' => $id
            ]);
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error while deleting resource',
            ]);
        }

        return new JsonResponse([
            'status'  => Response::HTTP_NO_CONTENT,
            'message' => 'Resource was successfully deleted',
        ]);
    }

    /**
     * Returns rules of fields validation for Song instance
     *
     * @return array
     */
    private function validationRules() : array
    {
        return [
            'name' => 'required|max:96',
            'key'  => ['nullable', Rule::in(Song::$MUSIC_KEYS)],
            'explicit' => 'nullable|boolean',
            'album_id' => 'nullable|string|max:36',
            'mode' => 'nullable|boolean',
            'danceability' => 'nullable|numeric|between:0,1',
            'energy' => 'nullable|numeric|between:0,1',
            'acousticness' => 'nullable|numeric|between:0,1',
            'instrumentalness' => 'nullable|numeric|between:0,1',
            'valence' => 'nullable|numeric|between:0,1',
            'release_date' => 'nullable|date|date_format:Y-m-d',
            'spotify_link' => 'nullable|string|max:160',
        ];
    }

    /**
     * Returns fields of Song model from request
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
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

