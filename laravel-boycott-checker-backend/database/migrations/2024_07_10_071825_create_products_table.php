<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            //id
            $table->id();
            //product name
            $table->string('name');
            //product image
            $table->string('image')->nullable();
            //company name
            $table->string('company_name');
            //company image
            $table->string('company_image')->nullable();
            //category
            $table->string('category');
            //boycott
            $table->boolean('boycott')->default(false);
            //boycott reason
            $table->string('boycott_reason', 1000)->nullable();
            //alternative
            $table->string('alternative', 255)->nullable();
            //update_time
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
