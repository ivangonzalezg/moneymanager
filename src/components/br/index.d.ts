import * as React from "react";

declare class BrType extends React.Component<BrProps, any> {}

interface BrProps {
  size?: number;
  horizontal?: boolean;
}

declare var Br: typeof BrType;
export = Br;
