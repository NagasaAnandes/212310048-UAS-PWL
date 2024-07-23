<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    //index
    public function index(Request $request)
    {
        $query = Product::query();

        // Check if category is provided in the request
        if ($request->has('category')) {
            $category = $request->input('category');
            $query->where('category', $category);
        }

        $products = $query->get();

        return response()->json($products);
    }

    //store
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'image' => 'required|image',
            'company_name' => 'required|string',
            'company_image' => 'required|image',
            'category' => 'required|string',
            'boycott' => 'required|boolean',
            'boycott_reason' => 'nullable|string|max:1000',
            'alternative' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $data = $request->all();


        //check image if available
        $image = $request->file('image');
        if ($image) {
            $fileName = time() . $image->getClientOriginalName();
            $image->storeAs('public/product', $fileName);
            $data['image'] = $fileName;
        }

        $company_image = $request->file('company_image');
        if ($company_image) {
            $fileName = time() . $company_image->getClientOriginalName();
            $company_image->storeAs('public/company', $fileName);
            $data['company_image'] = $fileName;
        }
        $product = Product::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => $product,
        ]);
    }

    //update
    public function update(Request $request, $id)
    {
        $request->validate([
            'boycott' => 'required|boolean',
            'boycott_reason' => 'nullable|string',
            'alternative' => 'nullable|string',
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $data = $request->all();

        $product->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    //destroy
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully',
        ]);
    }
}
