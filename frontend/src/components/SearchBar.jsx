import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/ui";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [draftSearch, setDraftSearch] = useState(search);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname.includes('collection') && showSearch){
      setVisible(true);
    }
    else{
      setVisible(false);
    }
  }, [location, showSearch])

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(draftSearch), 250);
    return () => window.clearTimeout(timer);
  }, [draftSearch, setSearch]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full">
        <input
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        <img className="w-4" src={assets.search_icon} alt="" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt=""
      />
    </div>
  ) : null;
};

export default SearchBar;
