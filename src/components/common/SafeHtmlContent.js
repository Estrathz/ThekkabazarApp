import React, {useMemo} from 'react';
import {Text, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import he from 'he';

const normalizeHtml = value => {
  if (value == null) {
    return '';
  }

  const raw = typeof value === 'string' ? value : String(value);
  const trimmed = raw.trim();
  if (!trimmed) {
    return '';
  }

  try {
    return he.decode(trimmed);
  } catch (error) {
    return trimmed;
  }
};

const DEFAULT_EM_SIZE = 14;

const RENDER_ENGINE_PROPS = {
  emSize: DEFAULT_EM_SIZE,
  ignoredDomTags: [],
  ignoredStyles: [],
  tagsStyles: {},
  classesStyles: {},
  enableUserAgentStyles: true,
  enableCSSInlineProcessing: true,
  customHTMLElementModels: {},
};

const SafeHtmlContent = ({
  html,
  baseStyle,
  emptyText = 'No description available',
  emptyStyle,
}) => {
  const {width} = useWindowDimensions();
  const content = useMemo(() => normalizeHtml(html), [html]);
  const engineProps = useMemo(() => {
    const fontSize = baseStyle?.fontSize;
    const emSize =
      typeof fontSize === 'number' ? fontSize : DEFAULT_EM_SIZE;

    return {
      ...RENDER_ENGINE_PROPS,
      emSize,
      baseStyle,
    };
  }, [baseStyle]);

  if (!content) {
    return <Text style={emptyStyle}>{emptyText}</Text>;
  }

  return (
    <RenderHTML
      contentWidth={width}
      source={{html: content}}
      defaultTextProps={{selectable: true}}
      {...engineProps}
    />
  );
};

export default SafeHtmlContent;
