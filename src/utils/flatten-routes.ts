export type DynamicRecursiveComponentProps = {
  url: string;
  scope: string;
  module: string;
  shouldMemorize?: boolean;
  hasOutLet?: boolean;
  children?: DynamicRecursiveComponentProps[];
};
export type DynamicRecursiveRouteProps = {
  title: string;
  path?: string;
  component?: DynamicRecursiveComponentProps;
  routes?: DynamicRecursiveRouteProps[];
};

export const getFlattenRoutes = (
  routes: DynamicRecursiveRouteProps[]
): DynamicRecursiveRouteProps[] => {
  let children: DynamicRecursiveRouteProps[] = [];

  return routes
    .map((r) => {
      if (r.routes && r.routes.length) {
        children = [...children, ...r.routes];
      }
      return r;
    })
    .concat(children.length ? getFlattenRoutes(children) : children)
    .filter((f) => f.component != null && !f.path?.includes("*"));
};
