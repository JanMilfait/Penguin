<?php

namespace Database\Factories\User;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User\Skill>
 */
class SkillFactory extends Factory
{
    private $tags = ['home', 'work', 'hobby', 'sport'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->unique()->paragraph($this->faker->numberBetween(1, 5)),
            'tag' => $this->tags[array_rand($this->tags)],
            'icon_url' => env('APP_URL') . '/storage/skills/images/' . fake()->unique()->numberBetween(0, 50) . '.jpg',
        ];
    }
}
