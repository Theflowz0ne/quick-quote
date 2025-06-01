<?php

namespace Tests\Feature;

use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteApiTest extends TestCase
{
    use RefreshDatabase; // Resets the database for each test

    public function test_can_get_all_quotes()
    {
        Quote::factory()->count(3)->create();

        $response = $this->getJson('/api/quotes');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_get_a_single_quote()
    {
        $quote = Quote::factory()->create();

        $response = $this->getJson('/api/quotes/' . $quote->id);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $quote->id,
                'quote' => $quote->quote,
                'author' => $quote->author,
            ]);
    }

    public function test_show_returns_null_for_non_existent_quote()
    {
        $nonExistentId = 999;
        $response = $this->getJson('/api/quotes/' . $nonExistentId);

        $response->assertStatus(200)
            ->assertExactJson([]); // Current behavior
    }

    public function test_can_create_a_quote_with_valid_data()
    {
        $quoteData = [
            'quote' => 'This is a test quote.',
            'author' => 'Test Author',
        ];

        $response = $this->postJson('/api/quotes', $quoteData);

        $response->assertStatus(200)
            ->assertJsonFragment($quoteData);

        $this->assertDatabaseHas('quotes', $quoteData);
    }

    public function test_can_create_a_quote_with_null_author()
    {
        $quoteData = [
            'quote' => 'A quote without an author.',
            'author' => null,
        ];

        $response = $this->postJson('/api/quotes', $quoteData);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'quote' => $quoteData['quote'],
                'author' => null,
            ]);

        $this->assertDatabaseHas('quotes', [
            'quote' => $quoteData['quote'],
            'author' => null,
        ]);
    }

    public function test_can_delete_a_quote()
    {
        $quote = Quote::factory()->create();

        $response = $this->postJson('/api/quotes/' . $quote->id);

        $response->assertStatus(200);

        $this->assertSoftDeleted('quotes', ['id' => $quote->id]);
    }

    public function test_destroy_handles_non_existent_quote()
    {
        $nonExistentId = 999;

        $response = $this->postJson('/api/quotes/' . $nonExistentId);

        $response->assertStatus(404);
    }
}
