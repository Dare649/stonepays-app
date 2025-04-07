'use client';

import { useState, useEffect } from "react";
import DigitalProducts from "./digitalProducts/page";
import Tab from "@/components/tabs/page";
import { getAllCategory } from "@/redux/slice/category/category";
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
  product_category_id: string;
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

  const allCategory = useSelector((state: RootState) =>
    Array.isArray(state.category?.allCategory) ? state.category.allCategory : []
  );

  // State to hold categorized products
  const [categorizedProducts, setCategorizedProducts] = useState<CategorizedProducts>({});
  const [categoryNames, setCategoryNames] = useState<{ [categoryId: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllProduct()).unwrap();
        await dispatch(getAllCategory()).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);

  // Create a mapping of category_id to category_name
  useEffect(() => {
    if (allCategory.length > 0) {
      const categoryMap = allCategory.reduce((acc, category) => {
        acc[category._id] = category.category_name;
        return acc;
      }, {} as { [categoryId: string]: string });

      setCategoryNames(categoryMap);
    }
  }, [allCategory]);

  // Categorize products when allProduct updates
  useEffect(() => {
    if (allProduct.length > 0) {
      const categorized = allProduct.reduce<CategorizedProducts>((acc, product) => {
        const category = product.product_category_id;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(product);
        return acc;
      }, {});

      setCategorizedProducts(categorized);
    }
  }, [allProduct]);

  // Create the tab titles and content dynamically based on categories
  const tabTitles = Object.keys(categorizedProducts).map((categoryId) => categoryNames[categoryId]);
  const tabContents = Object.keys(categorizedProducts).map((categoryId) => (
    <DigitalProducts key={categoryId} products={categorizedProducts[categoryId]} />
  ));

  return (
    <div className='w-full'>
      <section className="hero-section">
        <TopBar/>
        <div className="overlay"></div>
      </section>
      <section className="w-full lg:mt-20 sm:mt-10 lg:px-28 sm:px-5">
        <Tab titles={tabTitles} contents={tabContents} />
      </section>
    </div>
  );
};

export default MarketPlace;
