<?php

namespace App\Http\Controllers;

use App\Models\Country;;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CountryController extends Controller
{
    /**
     * Returns collection of country objects
     *
     * @return Country[]|\Illuminate\Database\Eloquent\Collection|JsonResponse
     */
    public function index()
    {
        try {
            return Country::all();
        }
        catch (Exception $e) {
            Log::error('Error while fetching data from database',
                [ 'exception' => $e]
            );
            return new JsonResponse([
                'status'  => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Internal server error'
            ]);
        }
    }

}
