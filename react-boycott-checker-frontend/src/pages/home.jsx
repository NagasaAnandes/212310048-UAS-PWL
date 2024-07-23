import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../modules/widgets/searchBar';
import ProductCard from '../modules/widgets/productCard';

const Home = () => {
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

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
                product.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, allProducts]);

    return (
        <div className='lg:px-8 px-4'>
            <div className='text-center py-4'>
                <h1><strong>Daftar Boikot</strong></h1>
                <p>Cari produk boikot berdasarkan nama Produk</p>
            </div>

            <SearchBar query={query} setQuery={setQuery} />
            <ProductCard products={filteredProducts} />
        </div>
    );
};

export default Home;
