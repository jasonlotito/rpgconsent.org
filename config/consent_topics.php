<?php

/**
 * RPG Consent Topics Configuration
 * 
 * This file contains all the default consent topics from the RPG Consent Checklist.
 * Topics are organized by category and represent common themes that may appear in RPG games.
 * 
 * Each topic can be rated as:
 * - Green: Enthusiastic consent; bring it on!
 * - Yellow: Okay if veiled or offstage; might be okay onstage but requires discussion ahead of time; uncertain
 * - Red: Hard line; do not include
 */

return [
    /**
     * Horror topics - themes related to scary or disturbing content
     */
    'Horror' => [
        'Bugs',
        'Blood',
        'Demons',
        'Eyeballs',
        'Gore',
        'Harm to animals',
        'Harm to children',
        'Rats',
        'Spiders',
    ],

    /**
     * Mental and Physical Health topics - themes related to health, trauma, and violence
     */
    'Mental and Physical Health' => [
        'Cancer',
        'Claustrophobia',
        'Freezing to death',
        'Gaslighting',
        'Genocide',
        'Heatstroke',
        'Natural disasters',
        'Paralysis/physical restraint',
        'Police/police aggression',
        'Pregnancy/miscarriage/abortion',
        'Self-harm',
        'Severe weather',
        'Sexual assault',
        'Starvation',
        'Terrorism',
        'Torture',
        'Thirst',
    ],

    /**
     * Relationships topics - romantic and interpersonal relationships
     */
    'Relationships' => [
        'Romance',
        'Fade to black',
        'Explicit',
        'Between PCs and NPCs',
        'Between PCs',
    ],

    /**
     * Sex topics - sexual content and themes
     */
    'Sex' => [
        'Romance',
        'Fade to black',
        'Explicit',
        'Between PCs and NPCs',
        'Between PCs',
    ],

    /**
     * Social and Cultural Issues - themes related to discrimination and cultural topics
     */
    'Social and Cultural Issues' => [
        'Homophobia',
        'Racism',
        'Real-world religion',
        'Sexism',
        'Specific cultural issues',
    ],

    /**
     * Movie Ratings - available rating options
     */
    'movie_ratings' => [
        'G',
        'PG',
        'PG-13',
        'NC-17',
        'Other',
    ],
];

