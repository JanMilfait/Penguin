<?php

namespace App\Http\Middleware;

use Closure;
use DB;
use Illuminate\Http\Request;

class RedirectSlug
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $routeName = $request->route()->getName();
        $routeParameterName = null;
        $redirectsTableName = null;

        switch ($routeName) {
            case 'user.show':
                $routeParameterName = 'user';
                $redirectsTableName = 'users_redirects';
                break;
            case 'post.show':
                $routeParameterName = 'post';
                $redirectsTableName = 'posts_redirects';
                break;
        }

        if ($routeParameterName && $redirectsTableName) {
            $redirect = DB::table($redirectsTableName)->where('old_slug', $request->route($routeParameterName))->first();
            if ($redirect) {
                $i = 0;
                while (true) {
                    $i++;
                    $redirect = DB::table($redirectsTableName)->where('old_slug', $redirect->new_slug)->first();
                    if (!$redirect || $i > 50) {
                        break;
                    }
                    $request->route()->setParameter($routeParameterName, $redirect->new_slug);
                }
            }
        }

        return $next($request);
    }
}
