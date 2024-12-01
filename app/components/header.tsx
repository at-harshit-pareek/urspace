"use client";

import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const handleredirect = () => {
        router.push("/createspace");
    }
  return (

    <div className="flex flex-row justify-evenly">
          <div>Home</div>
          <div>
            <button onClick={handleredirect}>Create Space</button>
          </div>
    </div>
  );
};

export default Header;
