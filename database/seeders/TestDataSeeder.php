<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\ConsentForm;
use App\Models\ConsentResponse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * TestDataSeeder
 * 
 * Creates test users, games, and consent forms for development/testing.
 */
class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main test user
        $mainUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create 4 additional test users
        $testUsers = [];
        for ($i = 1; $i <= 4; $i++) {
            $testUsers[] = User::firstOrCreate(
                ['email' => "test{$i}@example.com"],
                [
                    'name' => "Test User {$i}",
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('✓ Created 5 test users (test@example.com, test1-4@example.com)');
        $this->command->info('  Password for all users: password');

        // Create a test game as the main user (DM)
        $game1 = Game::create([
            'dm_user_id' => $mainUser->id,
            'name' => 'Curse of Strahd - Test Campaign',
            'description' => 'A gothic horror adventure in the land of Barovia. Players will face vampires, werewolves, and other dark creatures.',
            'status' => 'active',
        ]);

        $this->command->info("\n✓ Created game: {$game1->name}");
        $this->command->info("  Game Code: {$game1->game_code}");
        $this->command->info("  DM: {$mainUser->email}");

        // Add first 3 test users as players to game 1
        foreach (array_slice($testUsers, 0, 3) as $user) {
            GamePlayer::create([
                'game_id' => $game1->id,
                'user_id' => $user->id,
                'status' => 'joined',
                'joined_at' => now(),
            ]);
        }

        $this->command->info("  Players: test1@example.com, test2@example.com, test3@example.com");

        // Create consent forms for the first 2 players
        $topics = config('consent_topics');
        unset($topics['movie_ratings']);

        foreach (array_slice($testUsers, 0, 2) as $index => $user) {
            $form = ConsentForm::create([
                'user_id' => $user->id,
                'gm_name' => 'Test DM',
                'player_name' => $user->name,
                'game_theme' => 'Gothic Horror',
                'movie_rating' => 'PG-13',
                'follow_up_response' => 'Looking forward to the campaign!',
            ]);

            // Create responses for all topics (mix of green, yellow, red)
            foreach ($topics as $category => $topicList) {
                foreach ($topicList as $topicIndex => $topic) {
                    // Vary the comfort levels
                    $comfortLevel = match ($topicIndex % 3) {
                        0 => 'green',
                        1 => 'yellow',
                        2 => 'red',
                    };

                    ConsentResponse::create([
                        'consent_form_id' => $form->id,
                        'topic_category' => $category,
                        'topic_name' => $topic,
                        'comfort_level' => $comfortLevel,
                    ]);
                }
            }

            $this->command->info("  ✓ Created consent form for {$user->email}");
        }

        // Create a second game with test user 4 as DM
        $game2 = Game::create([
            'dm_user_id' => $testUsers[3]->id,
            'name' => 'Dragon Heist - City Adventure',
            'description' => 'An urban adventure in Waterdeep. Intrigue, treasure hunts, and faction politics.',
            'status' => 'active',
        ]);

        $this->command->info("\n✓ Created game: {$game2->name}");
        $this->command->info("  Game Code: {$game2->game_code}");
        $this->command->info("  DM: {$testUsers[3]->email}");

        // Add main user as a player to game 2
        GamePlayer::create([
            'game_id' => $game2->id,
            'user_id' => $mainUser->id,
            'status' => 'joined',
            'joined_at' => now(),
        ]);

        $this->command->info("  Players: {$mainUser->email}");

        $this->command->info("\n" . str_repeat('=', 60));
        $this->command->info('Test data created successfully!');
        $this->command->info(str_repeat('=', 60));
        $this->command->info("\nYou can now:");
        $this->command->info("1. Log in as test@example.com (DM of game 1)");
        $this->command->info("2. Log in as test1-3@example.com (players in game 1)");
        $this->command->info("3. Log in as test4@example.com (DM of game 2)");
        $this->command->info("\nAll passwords: password");
    }
}

