import classnames from "classnames";
import React, { ReactNode } from "react";

import styles from "./_layout.module.css";
export type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className={classnames(styles.layout)}>
      <div className={styles.inner}>{children}</div>
    </main>
  );
};

export default Layout;
