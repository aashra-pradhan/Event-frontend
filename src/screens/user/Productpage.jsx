import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/useCartContext";
import { get, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Feedback from "../../components/Feedback";
import socketIO from "socket.io-client";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { date } from "yup";

const socket = socketIO.connect("https://ecommerce-backend-gr3e.onrender.com");
const Productpage = () => {
  const [edit, setEdit] = useState({ value: false, text: "Edit product" });
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState({
    name: "",
    date: "",
    quantity: 0,
    description: "",
  });
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    date: "",
    quantity: 0,
    description: "",
  });
  const [message, setMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [backendMessages, setBackendMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [quantityCount, setQuantityCount] = useState(1);
  const accesstoken = JSON.parse(localStorage.getItem("access_token"));
  const name = localStorage.getItem("fullName");
  const initial = name ? name.charAt(0) : "";
  const user1Id = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");

  const { products, addToCart, setActiveProduct } = useContext(CartContext);
  let params = useParams();
  const chatListRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState("");

  const baseUrl = "http://localhost:8000/api";
  const url = `${baseUrl}/product/details/${params.userId}/${params.productId}`;
  useEffect(() => {
    if (!socket) return;

    // Join the user's room for real-time messaging
    socket.emit("join", user1Id);

    // Listen for incoming messages
    socket.on("receive message", (msg) => {
      console.log("Received message via socket:", msg);

      // Only add messages relevant to this chat
      if (
        msg.senderId === productInfo?.userId ||
        msg.receiverId === productInfo?.userId
      ) {
        setBackendMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    // Clean up socket listener on unmount
    return () => {
      socket.off("receive message");
    };
  }, [socket, user1Id, productInfo?.userId]);

  // console.log(socket, "socket");

  // // (Socket for receiving message) Runs whenever a socket event is recieved from the server
  // useEffect(() => {
  //   socket.on("receive message", (data) => {
  //     console.log(data, "socketreceive");
  //     // setMessagesReceived((state) => [
  //     //   ...state,
  //     //   {
  //     //     message: data.message,
  //     //     username: data.username,
  //     //     __createdtime__: data.__createdtime__,
  //     //   },
  //     // ]);
  //   });

  //   // Remove event listener on component unmount
  //   return () => socket.off("receive message");
  // }, []);

  //socket for sending msg
  // console.log(productInfo, "ppp");

  const clickSend = () => {
    console.log("clikc");
    socket.emit("send message", {
      senderId: user1Id,
      receiverId: customerId,
      message: chatMessage,
      senderName: localstorageName,
      socketId: socket.id,
    });
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(url);
      console.log(response.data, "etail");
      setProductInfo(response.data.data);
      setEditedProduct(response.data.data);
      console.log(productInfo, "yyyyy ");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const updatedProductInfo = {
    ...productInfo,
    chosenQuantity: quantityCount,
    totalPrice: quantityCount * productInfo.ticketPrice,
  };

  console.log(productInfo, "aaaa");
  const sendMsg = async () => {
    const url = `${baseUrl}/send-message`; // replace with your actual endpoint
    const config = {
      headers: { Authorization: "Bearer " + accesstoken },
    };

    const data = {
      senderId: user1Id,
      receiverId: productInfo.userId,
      message: chatMessage,
      senderUsername: fullName,
    };

    try {
      const response = await axios.post(url, data, config);

      // Emit the message through socket for real-time update
      socket.emit("send message", {
        ...data,
        socketId: socket.id,
      });

      // Optionally add your own message to the UI immediately
      setBackendMessages((prevMessages) => [...prevMessages, data]);

      console.log("Message sent:", response.data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  console.log(socket, "spcket");

  const getMessages = async () => {
    const url = `${baseUrl}/fetch-messages?senderId=${user1Id}&receiverId=${productInfo?.userId}`;
    const config = {
      headers: { Authorization: "Bearer " + accesstoken },
      // not authorized to post bhanne error aairathyo, because accesstoken ta string ma liyrathyam loccal storage bata, because stringify garera store garirathyam local storge ma,,,,tara yaha ta json value mai chahincha bearer sanga so mathi access token lai json.parse garera yo problem solve bhayo
    };
    try {
      const response = await axios.get(url, config);

      console.log(response.data.data, "msggg");
      setBackendMessages(response.data.data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(productInfo, "zzz");
  // useEffect(() => {
  //   // if (productInfo.userId) {
  //   // getMessages();
  //   // }
  //   socket.on("send message", (data) => {
  //     // debugger;
  //     // if (
  //     //   (data.receiverId === user1Id && data.senderId === customerId) ||
  //     //   (data.senderId === user1Id && data.receiverId === customerId)
  //     console.log(customerMessages, "kkk");
  //     getMessages();
  //     setCustomerMessages((prevMessages) => [...prevMessages, data]);
  //     // ) {

  //     // }
  //   });
  // }, [socket]);

  const clickEditDone = async () => {
    const formData = new FormData();
    // formData.append(editedProduct);
    formData.append("userId", user1Id);
    formData.append("name", editedProduct.name);
    formData.append("quantity", editedProduct.quantity);
    formData.append("category", editedProduct.category);
    formData.append("ticketPrice", editedProduct.ticketPrice);
    formData.append("location", editedProduct.location);
    formData.append("date", editedProduct.date);
    formData.append("time", editedProduct.time);
    formData.append("description", editedProduct.description);
    formData.append("requirements", editedProduct.requirements);
    // A file <input> element
    const images = document.getElementsByName("images")[0]; // Get the first element in the collection
    // formData.append("productImages", images.files[0]);

    //image pathaunuparyo bhane esari formData.append batai pathaunuparcha aba, simply object banayera mildaina okk, ani last ma tyo
    //fomData bhanne kura lai nai pathaidine
    //eta formData is not a variable hai, it is a concept bro

    // formData.append("description", productInfo.description);
    formData.append("shortDescription", editedProduct.shortDescription);

    const url = `${baseUrl}/user-product/${params.userId}/${params.productId}`;

    const config = {
      headers: { Authorization: "Bearer " + accesstoken },
      // not authorized to post bhanne error aairathyo, because accesstoken ta string ma liyrathyam loccal storage bata, because stringify garera store garirathyam local storge ma,,,,tara yaha ta json value mai chahincha bearer sanga so mathi access token lai json.parse garera yo problem solve bhayo
    };

    axios
      .put(url, formData, config)
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard/my-products");
        toast.success("Product edited!");
      })
      .catch(function (error) {
        console.error(error);
        console.log("Error is recognized!");
        toast.error("Error!");
      });
  };

  const clickDelete = async () => {
    const url = `${baseUrl}/user-product/${params.userId}/${params.productId}`;
    const config = {
      headers: { Authorization: "Bearer " + accesstoken },
      // not authorized to post bhanne error aairathyo, because accesstoken ta string ma liyrathyam loccal storage bata, because stringify garera store garirathyam local storge ma,,,,tara yaha ta json value mai chahincha bearer sanga so mathi access token lai json.parse garera yo problem solve bhayo
    };

    axios
      .delete(url, config)
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard/my-products");
        toast.success("Product deleted");
      })
      .catch(function (error) {
        console.error(error);
        console.log("Error is recognized!");
        toast.error("Error");
      });
  };

  // useEffect(() => {
  //   socket.on("receive message", (data) => {
  //     console.log(data, "here");
  //     // if (
  //     //   data.senderId === user1Id &&
  //     //   data.receiverId === productInfo?.userId
  //     // ) {
  //     setBackendMessages([...backendMessages, data]);
  //     getMessages();
  //     // }
  //   });
  // }, [socket]);

  //to set the last possible msg as selected chat
  useEffect(() => {
    setSelectedChat(backendMessages[backendMessages.length - 1]?.message);
  }, [backendMessages]);

  useEffect(() => {
    // Scroll to the selected chat when it changes
    if (selectedChat && chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
      // chatListRef.current.scrollTop = chatListRef.current.scrollHeight; sets the scroll position of the chat list to its maximum value, which effectively scrolls it to the bottom. This ensures that the most recent chat message is always visible to the user without needing to manually scroll down.
    }
  }, [selectedChat]);
  return (
    <>
      {accesstoken ? (
        <Navbar isLoggedIn={true} startingLetter={initial} />
      ) : (
        <Navbar isLoggedIn={false} startingLetter={""} />
      )}
      <div className="flex items-center justify-center">
        <div className="productcontainer">
          <div className="productbox">
            {productInfo?.productImages?.length > 0 && (
              <div className="last-min flex items-center w-[800px]	">
                <img
                  className="prod-image h-[600px] w-[500px]"
                  // src={productInfo?.productImages[0]?.url}
                  src={`https://source.unsplash.com/500x600/?${productInfo?.name}`}
                  alt="productImage"
                  loading="lazy"
                />
                {/* <LazyLoadImage
                  className="prod-image h-[600px] w-[500px]"
                  // src={productInfo?.productImages[0]?.url}
                  src={`https://source.unsplash.com/500x600/?${productInfo?.name}`}
                  alt="productImage"
                  loading="lazy"
                /> */}
              </div>
            )}

            <div className="prodinfo">
              <div className="prod-box">
                <p className="prod-title">Event name</p>
                {edit.value ? (
                  <input
                    type="text"
                    className="my-product-edit"
                    value={editedProduct.name}
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        name: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">{productInfo?.name}</p>
                )}
              </div>
              <div className="prod-box">
                <p className="prod-title">Date</p>
                {edit.value ? (
                  <input
                    type="date"
                    className="my-product-edit"
                    value={
                      editedProduct?.date
                        ? new Date(editedProduct.date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        date: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">
                    {new Date(productInfo?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                )}
              </div>

              <div className="prod-box">
                <p className="prod-title">Time</p>
                {edit.value ? (
                  <input
                    type="time"
                    className="my-product-edit"
                    value={
                      editedProduct?.time
                        ? new Date(`1970-01-01T${editedProduct.time}Z`)
                            .toISOString()
                            .slice(11, 16)
                        : ""
                    }
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        time: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">
                    {new Date(
                      `1970-01-01T${productInfo?.time}Z`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                )}
              </div>
              <div className="prod-box">
                <p className="prod-title">Location</p>
                {edit.value ? (
                  <input
                    type="text"
                    className="my-product-edit"
                    value={editedProduct.location}
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        location: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">{productInfo?.location}</p>
                )}
              </div>
              <div className="prod-box">
                <p className="prod-title">Ticket price</p>
                {edit.value ? (
                  <input
                    type="text"
                    className="my-product-edit"
                    value={editedProduct.ticketPrice}
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        ticketPrice: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">Rs. {productInfo?.ticketPrice}</p>
                )}
              </div>
              <div className="prod-box">
                <p className="prod-title">No. of Tickets Available</p>
                {edit.value ? (
                  <input
                    type="number"
                    className="my-product-edit"
                    min="1"
                    value={editedProduct.quantity}
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        quantity: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">{productInfo?.quantity}</p>
                )}
              </div>
              <div className="prod-box">
                <p className="prod-title">Event Description</p>
                {edit.value ? (
                  <input
                    type="text"
                    className="my-product-edit"
                    value={editedProduct.description}
                    onChange={(e) => {
                      setEditedProduct({
                        ...editedProduct,
                        description: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <p className="prod-bhitra">{productInfo?.description}</p>
                )}
              </div>
              {/* {!edit.value ? (
                <>
                  <div className="prod-box">
                    <p className="prod-title">Rating </p>
                    <p className="prod-bhitra">{productInfo?.rating}</p>
                  </div>
                </>
              ) : (
                ""
              )} */}
              {user1Id !== productInfo.userId ? (
                <>
                  <div className="quantity-box">
                    <p className="prod-title">Quantity</p>
                    <button
                      className="rounded w-full border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer counter-button"
                      disabled={quantityCount <= 1}
                      onClick={() => {
                        setQuantityCount((prevCount) => prevCount - 1);
                      }}
                    >
                      -
                    </button>

                    <input
                      className="quantity-input"
                      type="number"
                      min="1"
                      max={productInfo?.quantity}
                      value={quantityCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setQuantityCount(
                          value <= productInfo?.quantity ? value : 1
                        );
                      }}
                    />
                    <button
                      className="rounded w-full border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer counter-button"
                      disabled={quantityCount >= productInfo?.quantity}
                      onClick={() => {
                        setQuantityCount((prevCount) => prevCount + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                  {/* {!edit.value ? (
                    <>
                      <div className="prod-box">
                        <p className="prod-title">
                          Reviews ({productInfo?.numOfRatings})
                        </p>
                        <div className="review-container">
                          {productInfo?.reviews?.map((item) => (
                            <div className="review-messages">
                              {item.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )} */}
                  <div className="button-box">
                    <button
                      type="submit"
                      className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer"
                      onClick={() => {
                        if (accesstoken) {
                          toast.success("Added to cart");
                          addToCart(updatedProductInfo);
                        } else {
                          navigate("/login");
                          toast.error(
                            "User must be logged in to use the cart!"
                          );
                        }
                      }}
                    >
                      Add to Cart
                    </button>

                    <NavLink to={accesstoken ? "/product/purchase" : "/login"}>
                      <button
                        type="submit"
                        className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer"
                        onClick={() => {
                          setActiveProduct([updatedProductInfo]);
                        }}
                      >
                        Buy now
                      </button>
                    </NavLink>

                    <button
                      type="button"
                      className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer"
                      onClick={() => {
                        if (accesstoken) {
                          setIsModalOpen(true);
                          getMessages();
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      Chat with us
                    </button>

                    {isModalOpen && (
                      <div className="modal-container">
                        <div className="modal">
                          {/* Modal content */}
                          {/* Close button */}
                          <div className="msg-navbar">
                            <button onClick={() => setIsModalOpen(false)}>
                              x
                            </button>
                          </div>
                          <div className="seller-name">
                            <h2>
                              Chat with Seller: {productInfo?.sellerUserName}
                            </h2>
                          </div>
                          <div className="msg-container">
                            <div className="chat-area" ref={chatListRef}>
                              {/* <div className="chat-component-seller">
                          <div className="seller-chat">
                            <p>heyyyy</p>
                          </div>
                        </div> */}
                              {backendMessages.map((item) =>
                                user1Id == item.senderId ? (
                                  <div className="chat-component-buyer">
                                    <div className="buyer-chat">
                                      <p>{item.message}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="chat-component-seller">
                                    <div className="seller-chat">
                                      <p>{item.message}</p>
                                    </div>
                                  </div>
                                )
                              )}
                              {/* {chatMessage ? (
                          <>
                            {" "}
                            <div className="chat-component-buyer">
                              <div className="buyer-chat">
                                <p>{chatMessage}</p>
                              </div>
                            </div>
                          </>
                        ) : null} */}
                            </div>
                            <div className="typing-box">
                              <input
                                value={input}
                                type="text"
                                className="typing"
                                onChange={(e) => {
                                  setChatMessage(e.target.value);
                                  setInput(e.target.value);
                                }}
                              />
                              <button
                                type="submit"
                                className="msg-send-button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // setChatMessage(e);
                                  setInput("");
                                  // clickSend();
                                  sendMsg();
                                  clickSend();
                                }}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="button-box2">
                    {edit.value ? (
                      <button
                        className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer"
                        onClick={() => {
                          setEdit({ value: !edit.value });
                          console.log(editedProduct, "editt");
                        }}
                      >
                        Back
                      </button>
                    ) : (
                      <button
                        className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer"
                        onClick={() => {
                          setEdit({ value: !edit.value });
                        }}
                      >
                        Edit item
                      </button>
                    )}
                    {edit.value ? (
                      <button
                        className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer w-auto"
                        onClick={() => {
                          clickEditDone();
                        }}
                      >
                        Done{" "}
                      </button>
                    ) : null}
                    <button
                      className="buy-button rounded border-slate-900 rounded-lg bg-green-100 mt-2 hover:cursor-pointer w-auto"
                      onClick={() => {
                        clickDelete();
                      }}
                    >
                      Delete item
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Productpage;

// fetch-messages?senderId=2133213&receiverId=2313
