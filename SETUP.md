# RPG Consent Application - Setup Guide

## Overview

This is a web application for managing RPG consent forms based on the RPG Consent Checklist. Players can create digital consent forms indicating their comfort levels with various topics, and Dungeon Masters can view aggregated anonymous consent data from all players in their games.

## Tech Stack

- **Backend**: Laravel 12.37.0 (PHP 8.4.15)
- **Frontend**: React 19.2.0 + Inertia.js 2.1.4
- **Styling**: Tailwind CSS 4.1.12
- **Database**: MySQL
- **Authentication**: Laravel Fortify + Laravel Socialite (Email & Google OAuth)
- **Build Tool**: Vite 7.0.7

## Prerequisites

- PHP 8.4 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+
- Google OAuth credentials (for Google login)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rpgconsent.org
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the following environment variables in `.env`:

```env
APP_NAME="RPG Consent"
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rpgconsent
DB_USERNAME=root
DB_PASSWORD=

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=${APP_URL}/auth/google/callback
```

### 5. Create MySQL Database

Create a new MySQL database:

```sql
CREATE DATABASE rpgconsent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Generate Application Key

```bash
php artisan key:generate
```

### 7. Run Database Migrations

```bash
php artisan migrate
```

This will create the following tables:
- `users` - User accounts
- `consent_forms` - Player consent forms
- `consent_responses` - Individual topic responses
- `games` - DM-created games/campaigns
- `game_players` - Players in games

### 8. Build Frontend Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### 9. Start the Application

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Google OAuth Setup

To enable Google login, you need to create OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback` (for local development)
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret to your `.env` file

## Database Schema

### consent_forms
- Stores player consent form data
- Fields: user_id, gm_name, player_name, game_theme, movie_rating, follow_up_response, is_shared, share_token

### consent_responses
- Individual topic responses with comfort levels
- Fields: consent_form_id, topic_category, topic_name, comfort_level (green/yellow/red)

### games
- DM-created games/campaigns
- Fields: dm_user_id, name, description, game_code (unique), status

### game_players
- Pivot table linking players to games
- Fields: game_id, user_id, consent_form_id, joined_at, status

## Features

### For Players
- Create and manage consent forms
- Fill out comfort levels for various topics (Horror, Mental Health, Relationships, etc.)
- Join games using game codes
- Share consent forms with specific games
- Forms are private by default

### For Dungeon Masters
- Create games and generate unique game codes
- Invite players to games
- View aggregated anonymous consent data once all players have shared
- Aggregated data shows:
  - **Forbidden** (Red): Any player marked as red
  - **Discuss** (Yellow): Any player marked as yellow
  - **Safe** (Green): All players marked as green

## Privacy & Security

- Consent forms are private by default
- Players must explicitly share forms with specific games
- DMs only see aggregated anonymous data, never individual responses
- No attribution to specific players in aggregated view
- Secure tokens for form sharing

## Development

### Running Tests

```bash
php artisan test
```

### Code Structure

- `app/Models/` - Eloquent models (ConsentForm, ConsentResponse, Game, GamePlayer, User)
- `app/Http/Controllers/` - Controllers (ConsentFormController, GameController, SocialiteController)
- `app/Policies/` - Authorization policies
- `resources/js/Pages/` - React page components
- `resources/js/Layouts/` - React layout components
- `config/consent_topics.php` - Default consent topics configuration
- `routes/web.php` - Application routes

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure the database exists

### Build Errors
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Laravel cache: `php artisan cache:clear`

### Google OAuth Not Working
- Verify redirect URI matches exactly in Google Console
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly
- Ensure the Google+ API is enabled in your Google Cloud project

## License

This project is open-sourced software licensed under the MIT license.

