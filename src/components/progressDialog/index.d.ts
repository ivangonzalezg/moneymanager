import * as React from "react";

declare class LocationPickerType extends React.Component<
  LocationPickerProps,
  any
> {}

interface LocationPickerProps {
  visible: boolean;
  /**
   * The default value is "Loading".
   */
  label?: string;
}

declare var LocationPicker: typeof LocationPickerType;
export = LocationPicker;
