<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Bookable;
use App\Http\Resources\BookableIndexResource;
use App\Http\Resources\BookableShowResource;
use Illuminate\Support\Facades\DB;

class BookableController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search') ?? null;
        $bookables = Bookable::select("*");

        if ($search) {
            $bookables->where("title", "LIKE", "%" . $search . "%");
        }

        return BookableIndexResource::collection($bookables->paginate(10));
    }

    public function show($id)
    {
        return new BookableShowResource(Bookable::findOrFail($id));
    }
}
