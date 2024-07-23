import React from "react";

const SearchBar = ({ query, setQuery }) => {
    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <div className="flex justify-center items-center py-2">
            <div className="md:w-96 md:px-0 w-full">
                <div className="text-center relative flex w-full items-stretch">
                    <input
                        type="search"
                        className="flex-1 rounded-full border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-2 text-base font-normal leading-5 text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-10 focus:border-primary focus:text-neutral-700 focus:shadow-md focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-primary"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1"
                        value={query}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
