import React, { useEffect } from "react";
import AccountList from "./AccountList";
import AccountSummary from "./AccountSummary";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "../../redux/slice/users/usersSlice";

const MainDashBoard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);
  //get data from store

  const { profile, error, loading } = useSelector((state) => state?.users);

  return (
    <>
      {loading ? (
        <h2 className="text-center text-green-600 mt-5 text-lg">Loading...</h2>
      ) : error ? (
        <h2 className="text-red-600 text-center mt-5 text-lg">{error}</h2>
      ) : (
        <>
          <AccountSummary profile={profile} />
          <AccountList profile={profile} />
        </>
      )}
    </>
  );
};

export default MainDashBoard;
