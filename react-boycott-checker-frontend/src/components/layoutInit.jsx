import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const LayoutInit = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* <section>
                <div className="flex-grow">
                    {children}
                </div>
            </section> */}

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    )
};

export default LayoutInit;
