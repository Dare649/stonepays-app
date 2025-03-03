import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import { nav } from "@/data/dummy";

const TopBar = () => {
  return (
    <div className="w-full bg-black h-20 px-3 py-1.5 gap-x-8 flex items-center">
      <div className="w-[10%]">
        <Image
          src="/image/logo.png"
          alt="stonepay-admin-app"
          width={100}
          height={100}
          className="object-contain w-full"
          quality={100}
          priority
        />
      </div>

      <div className="w-[50%] rounded-sm bg-white flex items-center p-2">
        <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none bg-transparent w-full px-2"
        />
        <button className="bg-black text-white flex items-center justify-center rounded-lg px-3 py-1">
          <IoSearch size={20} />
        </button>
      </div>

      <div className="w-[30%] flex items-center justify-center gap-x-5">
        {
            nav.map((item, id) => (
                <Link
                    href={item.path}
                    className="text-white capitalize"
                    key={id}
                >
                    {item.title}
                </Link>
            ))
        }
      </div>
    </div>
  );
};

export default TopBar;
