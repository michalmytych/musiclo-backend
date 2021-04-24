<?php


namespace App\Http\Controllers;

use App\Models\Album;
use App\Traits\JsonApiResponsesTrait;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class AlbumController extends Controller
{
    use JsonApiResponsesTrait;

    const PAGINATION_AMOUNT = 10;

    /**
     * Get all albums
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return new JsonResponse(['data' => Album::paginate(self::PAGINATION_AMOUNT)]);
        }
        catch (Exception $e) {
            Log::error('Error while fetching data from database', ['exception' => $e]);
            return $this->jsonHttpInternalErrorResponse();
        }
    }

    /**
     * Store new Album object in the database
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), $this->validationRules());
        if ($validator->fails()) {
            return $this->jsonHttpBadRequestResponse($validator->messages());
        }

        try {
            $fields = $this->getFieldsFromRequest($request);
            $album = new Album($fields);
            $album->save();
            $album->updateSongs($fields['songs_ids']);
            $album->updateArtists($fields['artists_ids']);
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
     * Return single Album object
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id) : JsonResponse
    {
        try
        {
            $song = Album::findOrFail($id);
        }
        catch(ModelNotFoundException $e)
        {
            return $this->jsonHttpNotFoundResponse();
        }

        return new JsonResponse(['data' => $song]);
    }

    /**
     * Update single album record from request data
     * @param \Illuminate\Http\Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id) : JsonResponse
    {
        try
        {
            $album = Album::findOrFail($id);
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
            $fields = $this->getFieldsFromRequest($request);
            $album->update($fields);
            $album->save();
            $album->updateSongs($fields['songs_ids']);
            $album->updateArtists($fields['artists_ids']);
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
     * Delete album resource by id
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id) : JsonResponse
    {
        try
        {
            $album = Album::findOrFail($id);
        }
        catch(ModelNotFoundException $e) {
            return $this->jsonHttpNotFoundResponse();
        }

        try {
            $album->delete();
        }
        catch (Exception $e) {
            Log::error('Error while deleting from database', [
                'exception'   => $e,
                'table'       => 'albums',
                'resource_id' => $id
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpNoContentResponse();
    }

    /**
     * Returns rules of fields validation for Album instance
     * @return array
     */
    private function validationRules() : array
    {
        return [
            'name'         => 'required|max:96',
            'release_date' => 'nullable|date|date_format:Y-m-d',
            'spotify_link' => 'nullable|string|max:160',
            'songs_ids'    => 'nullable|array',
            'artists_ids'  => 'nullable|array'
        ];
    }

    /**
     * Returns fields of Album model from request
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    private function getFieldsFromRequest(Request $request) : array
    {
        return [
            'name'         => $request->get('name'),
            'release_date' => $request->get('release_date'),
            'spotify_link' => $request->get('spotify_link'),
            'songs_ids'    => $request->get('songs_ids'),
            'artists_ids'  => $request->get('artists_ids')
        ];
    }
}

