<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Traits\JsonApiResponsesTrait;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * Class SongController
 * @package App\Http\Controllers
 */
class SongController extends Controller
{
    use JsonApiResponsesTrait;

    const PAGINATION_AMOUNT = 10;
    /**
     * Get all songs
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        /**
         * @todo - implement pagination
         */
        try {
            return new JsonResponse(Song::paginate(self::PAGINATION_AMOUNT));
        }
        catch (Exception $e) {
            Log::error('Error while fetching data from database',
                [ 'exception' => $e]
            );
            return $this->jsonHttpInternalErrorResponse();
        }
    }

    /**
     * Save new song in database
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validationRules());
        if ($validator->fails()) {
            return $this->jsonHttpBadRequestResponse($validator->messages());
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
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpCreatedResponse();
    }

    /**
     * Fetch single song from database by id
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
            return $this->jsonHttpNotFoundResponse();
        }

        return new JsonResponse(['data' => $song]);
    }

    /**
     * Update song resource by id, with validated data
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
            return $this->jsonHttpNotFoundResponse();
        }

        $validator = Validator::make($request->all(), $this->validationRules());
        if ($validator->fails()) {
            return $this->jsonHttpBadRequestResponse($validator->messages());
        }

        try {
            $song->update($this->getFieldsFromRequest($request));
            $song->save();
        }
        catch (Exception $e) {
            Log::error('Error while storing to database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpOkResponse();
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
        /**
         * @todo - implement SearchServiceProvider with:
         * @link https://m.dotdev.co/writing-advanced-eloquent-search-query-filters-de8b6c2598db
         */
    {
        try
        {
            return new JsonResponse(
                Song::where('name', 'like', "%{$phrase}")->get()->paginate(self::PAGINATION_AMOUNT)
            );
        }
        catch(Exception $e)
        {
            Log::error('Error while searching in the database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }
    }

    /**
     * Delete song resource by id
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
            return $this->jsonHttpNotFoundResponse();
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
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpNoContentResponse();
    }

    /**
     * Returns rules of fields validation for Song instance
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

