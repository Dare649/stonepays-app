import React from 'react'

const Footer = () => {
  return (
    <div className='w-full'>
        <div className='w-full bg-primary-3 text-primary-4 lg:p-10 sm:p-3 lg:mt-10 sm:mt-5'>
            <div className='w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-10'>
                <div className=''>
                    <h3 className='capitalize text-left font-bold text-xl'>welcome</h3>
                    <div className='w-full mt-5'>
                        <p>StonePays.com is a trusted ecommerce portal owned by STONAK LIMITED.</p>
                        <p>This website is a dependable one-stop shop for all your gift cards, digital products, and physical products as well.</p>
                    </div>
                </div>
                <div className=''>
                    <h3 className='capitalize text-left font-bold text-xl'>connect with us</h3>
                    <div className='w-full mt-5'>
                        <p className='capitalize font-medium'>facebook</p>
                        <p className='capitalize font-medium mt-3'>instagram</p>
                        <p className='capitalize font-medium mt-3'>whatsapp</p>
                    </div>
                </div>
                <div className=''>
                    <h3 className='capitalize text-left font-bold text-xl'>what we sell</h3>
                    <div className='w-full mt-5'>
                        <p className='capitalize font-medium'>gift cards</p>
                        <p className='capitalize font-medium mt-3'>digital products</p>
                        <p className='capitalize font-medium mt-3'>physical products</p>
                    </div>
                </div>
                <div className=''>
                    <h3 className='capitalize text-left font-bold text-xl'>contact details</h3>
                    <div className='w-full mt-5'>
                        <p className='capitalize font-medium'>USA Address: 1229 Chelsea Avenue, Glenside PA 19038</p>
                        <p className='capitalize font-medium mt-3'>UK Address: 23, Servite House 171, Venner Road
                        London SE26 5HX</p>
                        <p className='capitalize font-medium mt-3'>USA Phone Contact: +1 (215) 359-6106</p>
                        <p className='capitalize font-medium mt-3'>E-mail : contact@stonepays.com</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full bg-primary-3 text-primary-4 lg:p-10 sm:p-3 mt-1'>
            <div className='flex justify-center'>
            <p>
               Copyright © {new Date().getFullYear()} Stone Pays. All rights reserved.
            </p>
            </div>
        </div>
    </div>
    
  )
}

export default Footer
