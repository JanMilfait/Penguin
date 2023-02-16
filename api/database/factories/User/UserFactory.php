<?php

namespace Database\Factories\User;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User\User>
 */
class UserFactory extends Factory
{
    private $visibility = ['private', 'friends', 'public'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $name = $this->faker->unique()->name();

        return [
            'slug' => Str::slug($name . ' ' . Str::random(5)),
            'name' => $name,
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'remember_token' => Str::random(10),
            'is_active' => 0,
            'avatar_name' => $this->faker->unique()->numberBetween(0, 600) . '.jpg',
            'avatar_url' => env('APP_URL') . '/storage/avatars/images/',
            'profile_visibility' => $this->visibility[array_rand($this->visibility)],
        ];
    }


    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }


    public function active()
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => 1,
        ]);
    }


    public function withoutAvatar()
    {
        return $this->state(fn (array $attributes) => [
            'avatar_name' => null,
            'avatar_url' => null,
        ]);
    }

    public function profileVisibility($visibility)
    {
        return $this->state(fn (array $attributes) => [
            'profile_visibility' => $this->visibility[$visibility],
        ]);
    }
}
