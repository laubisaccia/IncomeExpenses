//hoc
// a component that take another one as prop and we are going to pass any
// component we want to protect inside this component

import React from "react";
import { useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
  //get token from store
  const { userInfo } = useSelector((state) => state?.users?.userAuth);
  if (!userInfo?.token) {
    window.location.href = "/login";
    return null;
  }
  return <div>{children}</div>;
};

export default AuthRoute;
