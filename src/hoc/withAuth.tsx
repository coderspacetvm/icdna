"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React, { ComponentType, useEffect } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("authToken");
      if (!token) {
        router.push("/sign-in");
      }
    }, [router]);

    const token = Cookies.get("authToken");
    if (!token) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
};

export default withAuth;
