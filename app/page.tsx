'use client';

import { useState, useEffect } from "react";
import DigitalProducts from "./digitalProducts/page";
import Tab from "@/components/tabs/page";
import Shop from "./shop/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { getAllProduct } from "@/redux/slice/product/product";
import TopBar from "@/components/topBar/page";


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
      <section className="hero-section">
        <TopBar/>
        <div className="overlay"></div>
        
      </section>
      <section className="w-full lg:mt-20 sm:mt-10 lg:px-28 sm:px-5">
        <Tab
          title1=""
          content1={<DigitalProducts products={categorizedProducts["digital product"] || []} />}
        />
      </section>
    </div>
  );
};

export default MarketPlace;
