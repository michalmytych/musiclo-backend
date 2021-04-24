<?php


namespace App\Http\Controllers;

use App\Models\Artist;
use App\Traits\JsonApiResponsesTrait;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ArtistController extends Controller
{
    use JsonApiResponsesTrait;

    const PAGINATION_AMOUNT = 10;

    /**
     * Get all artists
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            return new JsonResponse(['data' => Artist::paginate(self::PAGINATION_AMOUNT)]);
        } catch (Exception $e) {
            Log::error('Error while fetching data from database', ['exception' => $e]);
            return $this->jsonHttpInternalErrorResponse();
        }
    }

    /**
     * Store new Artist object in the database
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
            $artist = new Artist($fields);
            $artist->save();
            $artist->updateAlbums($fields['albums_ids']);
        } catch (Exception $e) {
            Log::error('Error while storing to database', [
                'exception' => $e,
                'request_data' => $request->json()
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpCreatedResponse();
    }

    /**
     * Return single Artist object
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $song = Artist::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return $this->jsonHttpNotFoundResponse();
        }

        return new JsonResponse(['data' => $song]);
    }

    /**
     * Update single artist record from request data
     * @param \Illuminate\Http\Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $artist = Artist::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return $this->jsonHttpNotFoundResponse();
        }

        $validator = Validator::make($request->all(), $this->validationRules());
        if ($validator->fails()) {
            return $this->jsonHttpBadRequestResponse($validator->messages());
        }

        try {
            $fields = $this->getFieldsFromRequest($request);
            $artist->update($fields);
            $artist->save();
            $artist->updateAlbums($fields['albums_ids']);
        } catch (Exception $e) {
            Log::error('Error while storing to database', [
                'exception' => $e,
                'request_data' => $request->json()
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpOkResponse();
    }

    /**
     * Delete artist resource by id
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $artist = Artist::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return $this->jsonHttpNotFoundResponse();
        }

        try {
            $artist->delete();
        } catch (Exception $e) {
            Log::error('Error while deleting from database', [
                'exception' => $e,
                'table' => 'artists',
                'resource_id' => $id
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpNoContentResponse();
    }

    /**
     * Returns rules of fields validation for Artist instance
     * @return array
     */
    private function validationRules(): array
    {
        return [
            'name' => 'required|max:96',
            'description' => 'nullable|max:1000',
            'spotify_link' => 'nullable|string|max:160',
            'country_id' => 'nullable|string|max:3',   /** @todo - add validating (if in array_of_country_codes_from_country_table) */
            'albums_ids' => 'nullable|array'
        ];
    }

    /**
     * Returns fields of Artist model from request
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    private function getFieldsFromRequest(Request $request): array
    {
        return [
            'name' => $request->get('name'),
            'country_id' => $request->get('country_id'),
            'description' => $request->get('description'),
            'spotify_link' => $request->get('spotify_link'),
            'albums_ids'    => $request->get('albums_ids')
        ];
    }
}


