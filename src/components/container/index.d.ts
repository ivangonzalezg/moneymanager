import * as React from "react";

declare class ContainerType extends React.Component<ContainerProps, any> {}

interface ContainerProps {
  children: React.ComponentType<any>;
  /**
   * The default value is `false`.
   */
  noScroll?: boolean;
  /**
   * The default value is `false`.
   */
  noPadding?: boolean;
  /**
   * The default value is `false`.
   */
  disableFeedback?: boolean;
}

declare var Container: typeof ContainerType;
export = Container;
