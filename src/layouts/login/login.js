import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Login = () => {
  let navigate = useNavigate();

  // states and function for the modal
  const [popupContent, setPopupContent] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [page, setPage] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const submitHandlerPage1 = (event) => {
    event.preventDefault();
    const json = { Email: email, Password: password };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };
    axios
      .post("https://grid-server-a1tv.onrender.com/loginW", JSON.stringify(json), config)
      .then(function (response) {
        if (response.data.status === "error") {
          setPopupContent(response.data.message);
          handleShow();
        } else if (response.data.status === "intermediate") {
          //process totp
          window.sessionStorage.setItem("userName", response.data.message.name);
          window.sessionStorage.setItem("userEmail", response.data.message._id);
          window.sessionStorage.setItem("userID", response.data.message.userID);
          window.sessionStorage.setItem("userPage", 1);
          setPage(2);
        } else if (response.data.status === "success") {
          console.log(response.data.message);
          window.sessionStorage.setItem("userName", response.data.message.name);
          window.sessionStorage.setItem("userEmail", response.data.message._id);
          window.sessionStorage.setItem("userID", response.data.message.userID);
          window.sessionStorage.setItem("userPage", 1);
          navigate("/dashboard/" + response.data.message._id);
        } else {
          setPopupContent(response.data.message);
          handleShow();
        }
      })
      .catch(function (error) {
        alert("server offline!");
      });
  };

  const submitHandlerPage2 = (event) => {
    event.preventDefault();
    const json = { Email: email, Token: otp };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };
    axios
      .post("https://grid-server-a1tv.onrender.com/logintotp", JSON.stringify(json), config)
      .then(function (response) {
        if (response.data.status === "success") {
          navigate("/dashboard/" + window.sessionStorage.getItem("userID"));
        } else {
          setPopupContent(response.data.message);
          handleShow();
        }
      })
      .catch(function (error) {
        alert("error from frontend");
      });
  };

  return (
    <div className="fullscreen-login bg-dark">
      <div className="closeButton">
        <button
          className="btn p-0 "
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="https://img.icons8.com/fluency/48/000000/delete-sign.png" />
        </button>
      </div>
      <div className="container mt-4 form-login-1">
        {page === 1 ? (
          <div>
            <h1 className="font-2 text-success text-center">LOGIN</h1>
            <hr />

            <form className="py-2" onSubmit={submitHandlerPage1}>
              <div className="form-group mb-3">
                <label htmlFor="email" className="text-light font-4 fw-normal">
                  Email :
                </label>
                <input
                  type="email"
                  name="email"
                  id="name"
                  required
                  autoFocus
                  className="form-control text-dark fw-bold"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="password"
                  className="text-light font-4 fw-normal"
                >
                  Password :
                </label>
                <input
                  type="password"
                  name="password"
                  id="name"
                  required
                  className="form-control text-dark fw-bold"
                  placeholder="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="btn btn-success font-3 fw-bold my-3 signup-button"
                type="submit"
                style={{ letterSpacing: "4px" }}
              >
                LOGIN
              </button>
              <p className="font-3 text-info fw-bold">
                if you don't have an account &nbsp;
                <a
                  className="text-light fw-bold me-2 font-3"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  register here!
                </a>
              </p>
            </form>
          </div>
        ) : null}
        {page === 2 ? (
          <div className=" p-3 mt-2 text-center">
            <h1 className="font-2 text-primary text-center">LOGIN</h1>
            <p className=" text-light text-center font-4 ">
              Enter the TOTP from the Authenticator App.{" "}
            </p>
            <img
              className="mb-4"
              src="https://img.icons8.com/fluency/150/000000/password-check.png"
            />
            <form onSubmit={submitHandlerPage2}>
              <div className="form-group ">
                <input
                  type="text"
                  name="code"
                  id="code"
                  required
                  autoFocus
                  placeholder="enter your OTP"
                  className="form-control text-secondary fw-bold"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                />
              </div>
              <button
                className="mt-3 py-2 btn btn-success text-light shadow font-3 fw-bold"
                type="submit"
                style={{ letterSpacing: "3px", width: "100%" }}
              >
                Verify
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {/* popup */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <span className="font-1 display-4 text-primary">THE-GRID</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center font-4 fw-bold">{popupContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="px-4 font-3"
            variant="danger"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default React.memo(Login);
