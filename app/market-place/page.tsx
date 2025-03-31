'use client';

import { useState, useEffect } from "react";
import Carousel from "@/components/carousel/page";
import Tab from "@/components/tabs/page";
import Shop from "../shop/page";
import DigitalProducts from "../digitalProducts/page";
import PhysicalProducts from "../physicalProducts/page";
import GiftCards from "../giftCards/page";
import Home1 from "../home/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { getAllProduct } from "@/redux/slice/product/product";

// Define a type for the product
interface ProductData {
  _id?: string;
  product_name: string;
  product_category: string;
  product_price: number;
  product_description: string;
  product_img: string;
  product_qty: number;
}

// Define a type for categorized products
type CategorizedProducts = {
  [category: string]: ProductData[];
};

const MarketPlace = () => {
  const dispatch = useDispatch<AppDispatch>();

  const allProduct: ProductData[] = useSelector((state: RootState) =>
    Array.isArray(state.product?.allProduct) ? state.product.allProduct : []
  );

  // State to hold categorized products
  const [categorizedProducts, setCategorizedProducts] = useState<CategorizedProducts>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllProduct()).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);

  // Categorize products when allProduct updates
  useEffect(() => {
    if (allProduct.length > 0) {
      const categorized = allProduct.reduce<CategorizedProducts>((acc, product) => {
        const category = product.product_category;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(product);
        return acc;
      }, {});

      setCategorizedProducts(categorized);
    }
  }, [allProduct]);

  return (
    <div className='w-full'>
      <section className="w-full">
        <Carousel />
      </section>
      <section className="w-full lg:mt-20 sm:mt-10 lg:px-28">
        <Tab
          title1="home"
          title2="shop"
          // title3="gift cards"
          title3="digital products"
          // title5="physical products"
          content1={<Home1 products={allProduct} />}
          content2={<Shop products={allProduct} />}
          // content3={<GiftCards products={categorizedProducts["gift card"] || []} />}
          content3={<DigitalProducts products={categorizedProducts["digital product"] || []} />}
          // content5={<PhysicalProducts products={categorizedProducts["physical product"] || []} />}
        />
      </section>
    </div>
  );
};

export default MarketPlace;
