import Carousel from "@/components/carousel/page";
import Tab from "@/components/tabs/page";
import Shop from "./shop/page";
import DigitalProducts from "./digitalProducts/page";
import PhysicalProducts from "./physicalProducts/page";
import GiftCards from "./giftCards/page";

const Home = () => {
  return (
    <div className='w-full'>
      <section className="w-full">
        <Carousel/>
      </section>
      <section className="w-full lg:mt-20 sm:mt-10 lg:px-28 ">
        <Tab
          title1="shop"
          title2="gift cards"
          title3="digital products"
          title4="physical products"
          content1={<Shop/>}
          content2={<GiftCards/>}
          content3={<DigitalProducts/>}
          content4={<PhysicalProducts/>}
        />
      </section>
    </div>
  )
}

export default Home