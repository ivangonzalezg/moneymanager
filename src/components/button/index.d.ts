import * as React from "react";
import { TouchableOpacityProps } from "react-native";

declare class ButtonType extends React.Component<ButtonProps, any> {}

interface ButtonProps extends TouchableOpacityProps {}

declare var Button: typeof ButtonType;
export = Button;
