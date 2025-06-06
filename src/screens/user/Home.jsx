import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BannerCarousel from "../../components/BannerCarousel";
import Categorysection from "../../components/Categorysection";
import apiRequest from "../../api/api_call";
import Fallback from "../../components/Fallback";
import { Suspense, lazy } from "react";

const Home = () => {
  const [productInfo, setProductInfo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotionInfo, setPromotionInfo] = useState([]);
  const accesstoken = localStorage.getItem("access_token");
  const name = localStorage.getItem("fullName");
  const initial = name ? name.charAt(0) : ""; //Use ternary operator to conditionally assign initial
  const userId = localStorage.getItem("userId");

  const baseUrl = "http://localhost:8000/api";

  const apiDetails1 = {
    urlEndpoint: `/promotions`,
    requestMethod: "GET",
    authentication: false,
  };

  async function apiGet1() {
    let getPromotions = await apiRequest(apiDetails1, null, null);
    setPromotionInfo(getPromotions.data.data);
  }

  useEffect(() => {
    apiGet1();
  }, []);

  // const getPromotions = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/promotions`);
  //     console.log(response.data.data, "promo");
  //     setPromotionInfo(response.data.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   getPromotions();
  // }, []);
  const apiDetails2 = {
    urlEndpoint: `/categories`,
    requestMethod: "GET",
    authentication: false,
  };

  async function apiGet2() {
    let getCategory = await apiRequest(apiDetails2, null, null);
    console.log(getCategory, "yuuu");
    setCategories(getCategory.data.data);
    // setSelectedCategory(getCategory.data.data[0]._id);
  }

  useEffect(() => {
    apiGet2();
  }, []);

  // const getCategory = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/categories`);
  //     setCategories(response.data.data);
  //     console.log(categories, "vcc");
  //     // setSelectedCategory(response.data.data[0]._id);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getCategory();
  // }, []);
  const BannerCarousel = lazy(() => import("../../components/BannerCarousel"));
  const Categorysection = lazy(() =>
    import("../../components/Categorysection")
  );

  return (
    <>
      {accesstoken ? (
        <Navbar isLoggedIn={true} startingLetter={initial} />
      ) : (
        <Navbar isLoggedIn={false} startingLetter={""} />
      )}
      <Suspense fallback={<Fallback />}>
        <BannerCarousel images={promotionInfo} />
      </Suspense>

      <div className="p-14">
        {categories.map((cat) => {
          return (
            <Suspense fallback={<Fallback />}>
              <Categorysection title={cat.categoryName} categoryId={cat._id} />
            </Suspense>
          );
        })}
      </div>
    </>
  );
};

export default Home;
