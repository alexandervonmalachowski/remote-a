import React from "react";
import { Link } from "react-router-dom";

import styles from "./_top_navigation.module.css";
export type TopNavItem = {
  path: string;
  title: string;
};

import dynamicHostConfig from "../../../public/host.config.json";
import {
  DynamicRecursiveRouteProps,
  getFlattenRoutes,
} from "../../utils/flatten-routes";

const removeTrailingSlash = (str?: string) => {
  return str ? str.replace(/\/+$/, "") : "";
};

const TopNavigation = (): JSX.Element => {
  const { routes } = dynamicHostConfig as {
    routes: DynamicRecursiveRouteProps[];
  };

  const flattendRoutes = getFlattenRoutes(routes);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <nav className={styles.nav}>
            <Link to={"/"}>Home</Link>
            <Link to={"/remote-vue"}>Remote Vue</Link>
            {flattendRoutes.map((r) => {
              const path =
                r.path === "/" ? r.path : removeTrailingSlash(r.path);
              return (
                <Link key={path} to={path}>
                  {r.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
};

export default TopNavigation;
