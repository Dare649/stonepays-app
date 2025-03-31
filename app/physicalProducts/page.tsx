

'use client'

import React from 'react'
import { ProductData}  from "@/redux/slice/product/productSlice";

interface PhysicalProductsProp {
    products: ProductData[];
  }

const PhysicalProducts : React.FC<PhysicalProductsProp> = ({ products }) => {
  return (
    <div>PhysicalProducts</div>
  )
}

export default PhysicalProducts