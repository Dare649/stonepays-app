import Carousel from "@/components/carousel/page";
import Tab from "@/components/tabs/page";
import Shop from "./shop/page";
import DigitalProducts from "./digitalProducts/page";
import PhysicalProducts from "./physicalProducts/page";
import GiftCards from "./giftCards/page";
import Home1 from "./home/page";

const Home = () => {
  return (
    <div className='w-full'>
      <section className="w-full">
        <Carousel/>
      </section>
      <section className="w-full lg:mt-20 sm:mt-10 lg:px-28 ">
        <Tab
          title1="home"
          title2="shop"
          title3="gift cards"
          title4="digital products"
          title5="physical products"
          content1={<Home1/>}
          content2={<Shop/>}
          content3={<GiftCards/>}
          content4={<DigitalProducts/>}
          content5={<PhysicalProducts/>}
        />
      </section>
    </div>
  )
}

export default Home