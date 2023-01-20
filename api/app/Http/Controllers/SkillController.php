<?php

namespace App\Http\Controllers;

use App\Http\Services\SkillIcon;
use App\Models\User\Skill;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'tag' => ['string', 'max:255', 'required'],
            'name' => ['string', 'max:255', 'required'],
            'description' => ['string', 'max:8000', 'required'],
            'icon' => ['nullable', 'image', 'max:1024', 'dimensions:min_width=80,min_height=80'],
        ], [
            'icon.max' => 'The image may not be greater than 1MB.',
            'icon.dimensions' => 'The image must be at least 80x80 pixels.',
        ]);

        $skill = Skill::create([
            'user_id' => $request->user()->id,
            'name' => $request->input('name'),
            'tag' => $request->input('tag'),
            'description' => $request->input('description'),
        ]);

        if ($request->hasFile('icon')) {
            $response = SkillIcon::save($request->file('icon'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $skill->update([
                'icon_url' => $response['url'],
            ]);
        }

        $request->user()->skills()->attach($skill->id);

        return response()->json(['message' => 'Skill created successfully.']);
    }


    /**
     * Display the specified resource.
     *
     * @param  Skill  $skill
     * @return JsonResponse
     */
    public function show(Skill $skill)
    {
        return response()->json($skill->load('created_by'));
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  Skill  $skill
     * @return JsonResponse
     */
    public function update(Request $request, Skill $skill)
    {
        if ($skill->user_id !== $request->user()->id) {
            return $this->jsonError('You are not authorized to update this skill.', 403);
        }

        $request->validate([
            'tag' => ['string', 'max:255'],
            'name' => ['string', 'max:255'],
            'description' => ['string', 'max:8000'],
            'icon' => ['nullable', 'image', 'max:1024', 'dimensions:min_width=80,min_height=80'],
        ], [
            'icon.max' => 'The image may not be greater than 1MB.',
            'icon.dimensions' => 'The image must be at least 80x80 pixels.',
        ]);

        $skillUpdate = ['name', 'tag', 'description'];
        if ($this->requestHasOne($skillUpdate)) {
            $skill->update($request->only($skillUpdate));
        }

        if ($request->hasFile('icon')) {
            $response = SkillIcon::save($request->file('icon'));

            if (isset($response['error'])) {
                return $this->jsonError($response['error'], 500);
            }

            $skill->icon_url && SkillIcon::delete($skill->icon_url);
            $skill->update([
                'icon_url' => $response['url'],
            ]);
        }

        return response()->json(['message' => 'Skill updated successfully.']);
    }


    /**
     * Search for most used skills.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:84',
        ]);


        $skills = Skill::select(['id', 'name', 'tag'])
            ->where('name', 'like', $request->input('text').'%')
            ->withCount(['users' => function($query){
                $query->select(DB::raw('count(*)'));
            }])
            ->orderBy('users_count', 'desc')
            ->orderBy('name')
            ->limit(50)
            ->get();


        return response()->json($skills);
    }
}
