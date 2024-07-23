import React from "react";
import LayoutInit from "../components/layoutInit";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import ProductScanner from "../pages/productScanner";

export default function baseRoute() {
    return (
        <div>
            <React.Suspense>
                <LayoutInit>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/pindai-produk" element={<ProductScanner />} />
                    </Routes>
                </LayoutInit>
            </React.Suspense>
        </div>
    )
}