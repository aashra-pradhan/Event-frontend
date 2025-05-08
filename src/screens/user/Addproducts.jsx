import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { object, string, number, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { SchemaAddProducts } from "./user.schema";
import axios from "axios";
import Feedback from "../../components/Feedback";
import { FeedbackContext } from "../../context/useFeedbackContext";
import { useContext } from "react";
import apiRequest from "../../api/api_call";
import { toast } from "react-toastify";

const Addproducts = () => {
  const { feedback, setFeedback } = useContext(FeedbackContext);

  const [categories, setCategories] = useState([]);

  const baseUrl = "http://localhost:8000/api";
  const accesstoken = JSON.parse(localStorage.getItem("access_token"));

  // const refreshToken = JSON.parse(localStorage.getItem("refresh_token"));
  // const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("fullName");

  const getCategory = async () => {
    try {
      const response = await axios.get(`${baseUrl}/categories`);
      setCategories(response.data.data);
      // setSelectedCategory(response.data.data[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    watch,

    formState: { errors },
  } = useForm({
    // defaultValues: {productData ? productData : initialData},
    resolver: yupResolver(SchemaAddProducts),
  });
  useEffect(() => {
    console.log(errors, "form errors");
  }, [errors]);
  const onSubmit = async (data) => {
    console.log(data, "sussss");
    console.log("submitted");
    const url = `${baseUrl}/add-product`;
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", userName);

    formData.append("name", data.name);
    // formData.append("quantity", data.quantity);
    formData.append("category", data.category);
    // formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("shortDescription", data.shortDescription);
    formData.append("location", data.location);
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("isPrivate", data.isPrivate);
    formData.append("marketing", data.marketing);
    formData.append("ticketPrice", data.ticketPrice);
    formData.append("quantity", data.quantity);
    formData.append("requirements", data.requirements);
    // formData.append("eventStatus", data.eventStatus);

    // A file <input> element
    // const images = document.getElementsByName("images")[0]; // Get the first element in the collection
    if (data.images && data.images.length) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("productImages", data.images[i]);
      }
    }

    //image pathaunuparyo bhane esari formData.append batai pathaunuparcha aba, simply object banayera mildaina okk, ani last ma tyo
    //fomData bhanne kura lai nai pathaidine
    //eta formData is not a variable hai, it is a concept bro

    // "Bearer token" header object, axios bata pathau, to add product , for authorization

    const config = {
      headers: { Authorization: "Bearer " + accesstoken },
      // not authorized to post bhanne error aairathyo, because accesstoken ta string ma liyrathyam loccal storage bata, because stringify garera store garirathyam local storge ma,,,,tara yaha ta json value mai chahincha bearer sanga so mathi access token lai json.parse garera yo problem solve bhayo
    };
    // axios.interceptors.response.use(
    //   (res) => res,
    //   async (error) => {
    //     console.log(error.response.status, "errorkk");
    //     if (error.response.status === 401) {
    //       const newToken = handleRefreshToken();
    //       console.log(error.config, "config");
    //       return axios({ ...error.config, accessToken });
    //     }
    //     return Promise.reject(error);
    //   }
    // );
    axios
      .post(url, formData, config)
      .then((response) => {
        console.log(response.data);

        if (response.data.status == 200 || response.data.status == 201) {
          toast.success(response.data.message);
        }
        setFeedback({
          success: true,
          message: "Successfully product added!",
        });
      })
      .catch(function (error) {
        console.error(error);
        console.log("Error is recognized!");
        if (error.response) {
          setFeedback({ success: false, message: error.response.data.message });
        } else {
          setFeedback({
            success: false,
            message: "Network error!Try again in some time.",
          });
        }
      });
  };

  // const apiDetails = {
  //   urlEndpoint: "/add-product",
  //   requestMethod: "POST",
  //   authentication: true,
  // };

  // const reqData = formData;
  // // console.log(data, "sss");

  // let data1 = await apiRequest(apiDetails, reqData, null);
  // //yo api_hit ma ki ta response aaucha ki ta error aaucha

  //esari bhanda ni localstorage ma userDetails bhanera object nai banaidera yi details haru tyo object ko bhitra rakhdeko ramro practise
  //ani harek page ma aile hamile localstorage bata get gardai yiniharulai access gariracham ni
  //aba pachi context api(vimp concept) sikepachi, tyo details context api ma store garera pplication bhari use garna sakcham

  // console.log(data1, "check12");

  // if (data1.status == 200 || data1.data.status == 201) {
  //   toast.success(data1.data.message);
  // }
  // console.log("Form Errors:", errors);

  return (
    <>
      <div className="addProducts-form sm:p-0">
        <p className="text-5xl p-5 font-thin text-slate-950 font-serif mb-8 sm:text-3xl sm:p-3 sm:pt-5">
          Add Products
        </p>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="sm:p-2">
            <Input
              labelname={"Event Name"}
              type={"text"}
              register={register}
              errors={errors}
              name={"name"}
            />
          </div>

          {/* <div className="sm:p-2">
            <Input
              labelname={"Quantity"}
              type={"number"}
              register={register}
              errors={errors}
              name={"quantity"}
            />
          </div> */}

          <div className="sm:p-2">
            <label
              className="block text-xl font-serif text-slate-950"
              htmlFor="category"
            >
              Category
            </label>
            <select {...register("category")} name="category">
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="sm:p-2">
            <Input
              labelname={"Price"}
              type={"text"}
              register={register}
              errors={errors}
              name={"price"}
            />
          </div> */}

          <div className="sm:p-2">
            <Input
              labelname={"Event Location"}
              type={"text"}
              register={register}
              errors={errors}
              name={"location"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Event Date"}
              type={"date"}
              register={register}
              errors={errors}
              name={"date"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Event Time"}
              type={"time"}
              register={register}
              errors={errors}
              name={"time"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Short Description"}
              type={"text"}
              register={register}
              errors={errors}
              name={"shortDescription"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Description"}
              type={"text"}
              register={register}
              errors={errors}
              name={"description"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Requirements "}
              type={"text"}
              register={register}
              errors={errors}
              name={"requirements"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Max Attendees"}
              type={"number"}
              register={register}
              errors={errors}
              name={"quantity"}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Ticket Price"}
              type={"number"}
              register={register}
              errors={errors}
              name={"ticketPrice"}
            />
          </div>
          <div className="sm:p-2">
            <label className="block text-xl font-serif text-slate-950 mb-2">
              Enable Marketing?
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("marketing")}
            />
          </div>

          <div className="sm:p-2">
            <label className="block text-xl font-serif text-slate-950 mb-2">
              Make Event Private?
            </label>
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("isPrivate")}
            />
          </div>

          <div className="sm:p-2">
            <Input
              labelname={"Event Image for visibility"}
              type={"file"}
              register={register}
              errors={errors}
              name={"images"}
              multiple
            />
          </div>

          {/* <div className="sm:p-2">
            <label className="text-lg">Event Status</label>
            <select {...register("eventStatus")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}
          <div className="pt-8 sm:flex sm:items-center sm:justify-center sm:p-5">
            <Button type={"submit"} value={"Add Product"} />
          </div>
        </form>
        {/* <Feedback success={feedback.success} message={feedback.message} /> */}
      </div>
    </>
  );
};

export default Addproducts;

// //
// name;
// quantity;
// price;

// get by id
