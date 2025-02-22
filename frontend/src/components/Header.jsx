import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  const {userData} = useContext(AppContent);
  return (
    <div className="flex flex-col gap-2 items-center mt-32 text-center text-gray-800">
      <img
        src={assets.img1}
        alt="mail"
        className="w-36 h-56 rounded-full m-[-40px] "
      />
      <h1 className="flex items-center gap-1 text-xl sm:text-3xl font-medium  m-[-20px]">
        Hey {userData ? userData.name : "There"}!
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDByOXY0aW5iMmtyZjdmbWVpdnRzb2h5MWgybDhjZmxxNWE3dGlnMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Q7LHmoFwVP6Yc1swZs/giphy.gif"
          alt="Hand_shake"
          className="w-16 h-16"
        />
      </h1>
      <img src={assets.welcome} alt="" className="w-36 h-36 m-[-50px] p-0" />
      <p className="mb-4 max-w-md">
        lets start with a quick product tour and we will have you running in
        minutes
      </p>
      <button onClick={() => navigate ('/login') } className="border border-gray-500 px-4 py-2 rounded-full hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
