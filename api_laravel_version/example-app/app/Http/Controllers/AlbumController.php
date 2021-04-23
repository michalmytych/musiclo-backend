<?php


namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Song;
use App\Traits\JsonApiResponsesTrait;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;


class AlbumController extends Controller
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
            return new JsonResponse(['data' => Album::paginate(self::PAGINATION_AMOUNT)]);
        }
        catch (Exception $e) {
            Log::error('Error while fetching data from database', ['exception' => $e]);
            return $this->jsonHttpInternalErrorResponse();
        }
    }

    public function store(Request $request): JsonResponse
    {
        /**
         * @todo - zaimplementuj dodawanie relacji z artystami i piosenkami
         */
        $validator = Validator::make($request->all(), $this->validationRules());
        if ($validator->fails()) {
            return $this->jsonHttpBadRequestResponse($validator->messages());
        }

        try {
            $fields = $this->getFieldsFromRequest($request);
            $album = new Album($fields);
            /**
             * @todo - find a better way to attach existing songs to album
             */
            $album->save();
            $songsToAttach = Song::all()->whereIn('id', $fields['songs_ids']);
            $album->songs()->delete();
            $album->songs()->saveMany($songsToAttach);
            //$album->songs()->sync($songsToAttach->toArray());
            //var_dump(); exit();
            $aritstsToSync = Artist::all()->whereIn('id', $fields['artists_ids']);
            $album->artists()->sync($aritstsToSync);
        }
        catch (Exception $e) {
            echo $e; exit();
            Log::error('Error while storing to database', [
                'exception'     => $e,
                'request_data'  => $request->json()
            ]);
            return $this->jsonHttpInternalErrorResponse();
        }

        return $this->jsonHttpCreatedResponse();
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

