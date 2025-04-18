"use client";

import React, { useState } from "react";
import { shop } from "@/data/dummy";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { RootState } from "@/redux/store";
import type { StaticImageData } from "next/image";
import Tab from "@/components/tabs/page";
import Description from "../../components/description/page";
import AdditionalInformation from "../../components/additionalInformation/page";
import Meta from "../../components/meta/page";
import type { ProductData } from "@/redux/slice/product/productSlice";


interface ShopProps {
    products: ProductData[];
  }

interface UnitPrice {
    id: number;
    price: number;
};

interface MetaInfo {
    id: number;
    title: string;
    ans: string;
};

interface KeyFeatures {
    id: number;
    text: string;
    title: string;
}

interface Product {
    id: number;
    name: string;
    category: string;
    mini_price: number;
    max_price: number;
    unit_price: UnitPrice[];
    img: string | StaticImageData;
    desc?: string;
    reviews?: number;
    key_features?: KeyFeatures[];
    meta_information?: MetaInfo[];
}

const ITEMS_PER_PAGE = 10;

const Shop : React.FC<ShopProps> = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = shop.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(shop.length / ITEMS_PER_PAGE);

    const handlePageChange = (selected: { selected: number }) => {
        dispatch(startLoading());
        setTimeout(() => {
            setCurrentPage(selected.selected);
            dispatch(stopLoading());
        }, 2000);
    };

    const handleBuyNow = (product: Product) => {
        dispatch(startLoading());
        setTimeout(() => {
            setSelectedProduct(product);
            setSelectedPrice(null);
            setQuantity(1);
            dispatch(stopLoading());
        }, 2000);
    };

    const handleBackToShop = () => {
        dispatch(startLoading());
        setTimeout(() => {
            setSelectedProduct(null);
            setSelectedPrice(null);
            setQuantity(1);
            dispatch(stopLoading());
        }, 2000);
    };

    const handleSelectPrice = (price: number) => {
        dispatch(startLoading());
        setTimeout(() => {
            setSelectedPrice(price);
            setQuantity(1);
            dispatch(stopLoading());
        }, 1000)
    };

    const handleQuantityChange = (type: "increase" | "decrease") => {
        setQuantity((prev) => {
            if (type === "increase") return prev + 1;
            return prev > 1 ? prev - 1 : 1;
        });
    };

    return (
        <div className="w-full flex flex-col">
            {selectedProduct ? (
                <div className="w-full">
                    <button className="mb-4 px-4 py-2 bg-primary-1 text-white rounded cursor-pointer" onClick={handleBackToShop}>
                        ← Back to Shop
                    </button>
                    <div className="w-full flex lg:flex-row sm:flex-col items-start gap-5">
                        <div className="lg:w-[50%] sm:w-full">
                            <Image src={selectedProduct.img} alt={selectedProduct.name} width={100} height={100} priority className="object-contain w-full" />
                        </div>
                        <div className="lg:w-[50%] sm:w-full">
                            <h3 className="text-lg font-semibold capitalize">{selectedProduct.name}</h3>
                            <div className="py-5">
                                <hr className="w-full h-0.5 border-none bg-gray-200"/>
                            </div>
                            <p className="text-primary-1 font-bold mt-2">${selectedProduct.mini_price} - ${selectedProduct.max_price}</p>
                            <div className="w-full py-3">
                                <p className="tracking-wider leading-normal text-gray-400">{selectedProduct.desc}</p>
                            </div>
                            
                            <h2 className="font-bold text-sm uppercase text-gray-500 mt-4">Select Price</h2>
                            <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 gap-3">
                                {selectedProduct.unit_price.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`border-2 border-gray-300 py-1 px-0 cursor-pointer text-center uppercase ${selectedPrice === item.price ? "bg-primary-1 text-white" : "hover:bg-primary-1 hover:text-white"}`}
                                        onClick={() => handleSelectPrice(item.price)}
                                    >
                                        {item.price} USD
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col justify-end mt-4">
                                <div className="flex items-center gap-x-2">
                                    <h2>Quantity:</h2>
                                    <div className="flex items-center border-2 border-black w-fit">
                                        <button className="px-4 py-2 hover:bg-primary-1 hover:text-white cursor-pointer" onClick={() => handleQuantityChange("decrease")}>-</button>
                                        <span className="px-4 py-2 border-x-2 border-black">{quantity}</span>
                                        <button className="px-4 py-2 hover:bg-primary-1 hover:text-white cursor-pointer" onClick={() => handleQuantityChange("increase")}>+</button>
                                    </div>
                                </div>
                                <h2 className="flex items-center gap-x-2">
                                    <span>Unit Price:</span>
                                    <span>{selectedPrice ? `$${selectedPrice}` : "Select a price"}</span>
                                </h2>
                                <h2 className="flex items-center gap-x-2">
                                    <span>Amount:</span>
                                    <span>{selectedPrice ? `$${(selectedPrice * quantity).toFixed(2)}` : "N/A"}</span>
                                </h2>
                            </div>
                            <button className="mt-4 w-full px-4 py-2 bg-primary-1 text-white rounded">Confirm Purchase</button>
                            <div className="lg:my-10 sm:my-5 w-full">
                                
                                <Tab
                                    title1="description"
                                    title2="meta information"
                                    title3="additional information"
                                    content1={<Description
                                        desc={selectedProduct?.desc ?? "No description available"}
                                        reviews={selectedProduct?.reviews ?? 0}
                                        key_features={selectedProduct?.key_features ?? []}
                                      />}
                                    content2={<Meta meta={selectedProduct.meta_information} reviews={selectedProduct.reviews}/>}
                                    content3={<AdditionalInformation/>}
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            ) : (
                <>
          {/* Sorting Dropdown */}
          <div className="w-full flex justify-end mb-5">
            <div className="lg:w-[25%] sm:w-full">
              <select className="w-full border-2 border-gray-400 outline-none active:border-primary-1 capitalize p-2 cursor-pointer">
                <option value="">default sorting</option>
                <option value="">sort by popularity</option>
                <option value="">sort by average rating</option>
                <option value="">sort by latest</option>
                <option value="">sort by price: low to high</option>
                <option value="">sort by price: high to low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow-lg relative group transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-contain w-full transition-opacity duration-300"
                  quality={100}
                  priority
                />
                <div className="mt-2 transition-opacity duration-300 group-hover:opacity-100">
                  <h2 className="font-semibold">{item.name}</h2>
                  <h2 className="text-gray-500">{item.category}</h2>
                  <h2 className="flex items-center gap-x-1 text-primary-1 font-bold">
                    <span>${item.mini_price}</span>
                    <span>-</span>
                    <span>${item.max_price}</span>
                  </h2>
                </div>

                {/* Buy Now Button */}
                <button
                  className="text-center text-white bg-primary-1 capitalize lg:px-5 lg:py-2 sm:px-2 sm:py-1 rounded w-full mt-2 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => handleBuyNow(item)}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center cursor-pointer">
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"flex gap-2"}
              previousClassName={"px-3 py-1 bg-gray-300 rounded hover:bg-primary-1 hover:text-white"}
              nextClassName={"px-3 py-1 bg-gray-300 rounded hover:bg-primary-1 hover:text-white"}
              pageClassName={"px-3 py-1 border rounded"}
              activeClassName={"bg-primary-1 text-white"}
            />
          </div>
        </>
            )}
        </div>
    );
};

export default Shop;
