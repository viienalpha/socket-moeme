import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppDispatch } from "../../../app/store/rootStore";
import useWebSocket, { ReadyState } from "react-use-websocket";
import * as ptCommand from "../../../constants/ptCommant";
import * as ptGroup from "../../../constants/ptGroup";

import "./login.scss";
import { setLoginLocalStorage } from "../../../utils";
import { login } from "./loginSlice";
import { useSocket } from "../../../hooks/useSocket";
import toast from "react-hot-toast";
import { LastMessageSocket } from "../../../models/socket";

export default function Login() {
  let history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { lastJsonMessage, sendJsonMessage } = useSocket();

  /**
   * Check empty and send param login socket
   * @param e
   */
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (e.target[1].value.length <= 0 || e.target[0].value.length <= 0) {
      toast.error("khong duoc de trong");
    } else {
      let param = {
        ptGroup: ptGroup.LOGIN,
        ptCommand: ptCommand.LOGIN,
        params: {
          userId: e.target[0].value,
          userPassword: e.target[1].value,
          deviceType: "web",
        },
      };
      sendJsonMessage(param);
    }
  };

  const loginSuccess = (data: LastMessageSocket) => {
    if (data.result === "success") {
      dispatch(login(data?.params)); //save infor user into redux
      setLoginLocalStorage(data?.params); // save info (access token) in to localstorage
      history.push("/home");
    } else {
      toast.error(data?.result); // show message error
    }
  };

  useEffect(() => {
    if (lastJsonMessage) {
      switch (lastJsonMessage?.ptCommand) {
        case ptCommand.LOGIN:
          loginSuccess(lastJsonMessage);
          break;
        default:
          break;
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    const isLoggedIn: boolean = localStorage.getItem("userId") ? true : false;
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, []);

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleLogin}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>User ID</label>
            <input
              type="text"
              name="userId"
              className="form-control mt-1"
              placeholder="Enter User Id"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
