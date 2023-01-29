import "../../styles/global.css";

import React, { ReactNode } from "react";

type CssProviderProps = {
  children: ReactNode;
};

const CssProvider = ({ children }: CssProviderProps) => {
  return <>{children}</>;
};

export default CssProvider;
