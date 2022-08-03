import React from "react";
import PropTypes from "prop-types";
import { Text, ITextProps } from "native-base";
import emojiData from "emoji-datasource";

export const findByShortName = shortName => {
  const nonColonName = removeColons(shortName);
  const emoji = emojiData.find(_emoji => _emoji.short_name === nonColonName);
  if (!emoji) {
    return undefined;
  }
  return convertFromUtf16(emoji.unified);
};

const removeColons = (string = "") => {
  const index = string.indexOf(":");
  if (index > -1) {
    if (index === string.length - 1) {
      string = string.substring(0, index);
      return removeColons(string);
    } else {
      string = string.substr(index + 1);
      return removeColons(string);
    }
  }
  return string;
};

const convertFromUtf16 = utf16 =>
  String.fromCodePoint(...utf16.split("-").map(u => `0x${u}`));

const Emoji = props => {
  const { shortName, ...rest } = props;

  return <Text {...rest}>{findByShortName(shortName)}</Text>;
};

Emoji.propTypes = {
  ...ITextProps,
  shortName: PropTypes.string.isRequired,
};

export default React.memo(Emoji);
