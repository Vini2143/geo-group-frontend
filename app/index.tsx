import { Redirect } from "expo-router";
import React from "react";
import { useCheckAuth } from "../hooks/useCheckAuth";

export default function Index() {
  const isAuth = useCheckAuth()

  if (isAuth) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }

}