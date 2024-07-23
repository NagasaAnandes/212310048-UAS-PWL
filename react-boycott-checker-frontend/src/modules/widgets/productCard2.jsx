import React, { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const ProductCard2 = ({ products, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedProduct(null);
    };

    const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="py-3 grid gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {sortedProducts.map(product => (
                    <div key={product.id} className="rounded-lg mb-4 " onClick={() => openModal(product)}>
                        <div className="text-center py-1">
                            <span className="lg:text-md text-xs">{product.name}</span>
                        </div>
                        <div className="flex justify-center items-center lg:h-40 md:h-36 h-28 border rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <img src={product.image} alt={product.name} className="rounded-lg object-contain h-full lg:h-40 md:h-36 lg:w-40 md:w-36 sm:w-24 p-1" />
                        </div>
                    </div>
                ))}
            </div>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-1/4 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className=" pt-3 ">
                            <div className="">
                                <div className="text-center">
                                    <h1 className={selectedProduct.boycott ? "text-red-500" : "text-green-500"}> <strong> {selectedProduct.boycott ? 'Produk ini ada di daftar Boikot!' : 'Produk ini aman untuk saat ini!'} </strong> </h1>
                                </div>
                                <div className="flex justify-center items-center py-3 gap-3">
                                    <div className="flex justify-center items-center lg:h-24 md:h-20 sm:h-16 lg:w-24 md:w-20 sm:w-20 ">
                                        <img src={selectedProduct.image} alt={selectedProduct.name} className="rounded-lg object-contain lg:h-24 md:h-20 h-16 lg:w-24 md:w-20 w-16 p-1" />
                                    </div>
                                    <FaArrowRightArrowLeft className="" size={20} />
                                    <div className="flex justify-center items-center lg:h-24 md:h-20 sm:h-16 lg:w-24 md:w-20 sm:w-20 ">
                                        <img src={selectedProduct.company_image} alt={selectedProduct.company} className="rounded-lg object-contain lg:h-24 md:h-20 h-16 lg:w-24 md:w-20 w-16 p-1" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="lg:text-lg text-xs"><strong>{selectedProduct.name}</strong> Merupakan produk dari Perusahaan <strong>{selectedProduct.company_name}</strong></p>
                                </div>
                            </div>
                            {selectedProduct.boycott && (
                                <div className="mt-2 text-justify">
                                    <p className="py-1"><strong>Alasan Boikot:</strong> {selectedProduct.boycott_reason}</p>
                                    <p className="py-1"><strong>Rekomendasi Produk Pengganti:</strong> {selectedProduct.alternative ? selectedProduct.alternative : 'Tidak ada rekomendasi'}</p>
                                </div>
                            )}
                            <div className="mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={closeModal}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ProductCard2;
