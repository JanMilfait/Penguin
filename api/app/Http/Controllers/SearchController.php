<?php

namespace App\Http\Controllers;

use App\Models\User\User;
use DB;
use Illuminate\Http\Request;
use Str;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:84',
        ]);

        $text = DB::connection()->getPdo()->quote($request->input('text'));
        $textLikeRight = DB::connection()->getPdo()->quote($request->input('text') . '%');

        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 5);

        $users = DB::table('users')
            ->select(['id', 'name', 'avatar_url', 'avatar_name'])
            ->whereRaw(
                strlen($text) > 3 ?
                    'MATCH(name) AGAINST("' . $text . '")'
                    :
                    'name LIKE ' . $textLikeRight
            )
            ->where('id', '!=', $request->user()->id)
            ->offset($offset)
            ->limit($limit)
            ->get();

        if (strlen($text) > 3) {
            $posts = DB::table('posts')
                ->select(['id', 'user_id', 'body'])
                ->whereRaw('MATCH(body) AGAINST("' . $text . '")')
                ->offset($offset)
                ->limit($limit)
                ->get();

            foreach ($posts as $post) {
                $post->body = Str::limit($post->body);
                $post->user = User::find($post->user_id)->only(['id', 'name', 'avatar_url', 'avatar_name']);
            }
        }

        $normalized = $this->normalize($users->merge($posts ?? collect()), $offset*2);

        return response()->json([
            'ids' => $normalized['ids'],
            'entities' => $normalized['entities']
        ]);
    }
}
