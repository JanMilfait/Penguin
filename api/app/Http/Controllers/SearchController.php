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

        $page = (int) $request->get('page', 1);
        $limit = (int) $request->get('limit', 5);
        $offset = ($page - 1) * $limit;


        $queryUsers = DB::table('users')
            ->select(['id', 'name', 'avatar_url', 'avatar_name'])
            ->whereRaw(
                strlen($request->get('text')) > 3 ?
                    'MATCH(name) AGAINST("' . DB::connection()->getPdo()->quote($request->input('text')) . '")'
                    :
                    'name LIKE ' . DB::connection()->getPdo()->quote($request->input('text') . '%')
            )
            ->where('id', '!=', auth('sanctum')->user()->id ?? null);

        $usersTotal = $queryUsers->count();
        $users = $queryUsers->limit($limit)->offset($offset)->get();


        if (strlen($request->get('text')) > 3) {
            $queryPosts = DB::table('posts')
                ->select(['id', 'user_id', 'body'])
                ->whereRaw('MATCH(body) AGAINST("' . DB::connection()->getPdo()->quote($request->input('text')) . '")');

            $postsTotal = $queryPosts->count();
            $posts = $queryPosts->limit($limit)->offset($offset)->get();


            foreach ($posts as $post) {
                $post->body = Str::limit($post->body);
                $post->user = User::find($post->user_id)->only(['id', 'name', 'avatar_url', 'avatar_name']);
                unset($post->user_id);
            }
        } else {
            $posts = collect();
            $postsTotal = 0;
        }


        return response()->json([
            'items' => $users->merge($posts),
            'page' => $page,
            'last_page' => ceil(max($usersTotal, $postsTotal) / $limit),
            'limit' => $limit
        ]);
    }
}
