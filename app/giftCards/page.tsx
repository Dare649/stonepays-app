

'use client'


import React from 'react'
import type { ProductData } from "@/redux/slice/product/productSlice";


interface GiftCardsProps {
    products: ProductData[];
  }

const GiftCards : React.FC<GiftCardsProps> = ({ products }) => {
  return (
    <div>GiftCards</div>
  )
}

export default GiftCards