import * as React from "react";
import { ITextProps } from "native-base/lib/typescript/components/primitives/Text";

declare class EmojiType extends React.Component<EmojiProps, any> {}

interface EmojiProps extends ITextProps {
  shortName: string;
}

declare var Emoji: typeof EmojiType;
export = Emoji;
