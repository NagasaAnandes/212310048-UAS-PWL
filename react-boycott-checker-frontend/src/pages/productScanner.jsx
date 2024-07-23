import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ObjectDetection from "../modules/widgets/objectDetection";
import ProductCard2 from '../modules/widgets/productCard2';

const ProductScanner = () => {
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [detectedProduct, setDetectedProduct] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [highestPrediction, setHighestPrediction] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/product');
                const productsWithImageURL = response.data.map(product => ({
                    ...product,
                    image: `http://localhost:8000/storage/product/${product.image}`,
                    company_image: `http://localhost:8000/storage/company/${product.company_image}`,
                    boycott: Boolean(product.boycott),
                }));
                setAllProducts(productsWithImageURL);
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            allProducts.filter(product =>
                product.category.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, allProducts]);

    return (
        <div className="lg:px-8 px-4">
            <div>
                <ObjectDetection
                    setDetectedProduct={setDetectedProduct}
                    setCategoryProducts={setCategoryProducts}
                    setHighestPrediction={setHighestPrediction}
                />

                {categoryProducts.length > 0 && (
                    <div className="mt-4">
                        <ProductCard2 products={categoryProducts.filter(product => product.boycott)} title="Produk yang Di Boikot" />
                        <ProductCard2 products={categoryProducts.filter(product => !product.boycott)} title="Produk yang Tidak Di Boikot" />
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProductScanner;
