<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index() : array
    {
        return Country::all();
    }

    public function store(Request $request)
    {
        $request->validate(['name'=>'required']);
        $contact = new Country([
            'first_name' => $request->get('first_name'),
            'last_name' => $request->get('last_name'),
            'email' => $request->get('email'),
            'job_title' => $request->get('job_title'),
            'city' => $request->get('city'),
            'country' => $request->get('country')
        ]);
        $contact->save();

        try{
            $user = new Country;
            $user->Country();
        }
        catch(\Exception $e) {
            // do task when error
            echo $e->getMessage();   // insert query
        }

        return Country::all();
    }

    public function show($id)
    {
        return Country::all();
    }

    public function update(Request $request, $id) : void
    {
        //
    }

    public function search(Request $request, $phrase) : array
    {
        return Country::all();
    }

    public function destroy($id) : void
    {

    }
}
