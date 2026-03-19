export const TAG_COLORS: Record<string, string> = {
  Education: "#7B1FA2",
  Music: "#2E7D32",
  Workshop: "#EF6C00",
  Tech: "#1565C0",
  Arts: "#C2185B",
  default: "#1976d2",
};

const GHOST_HUBS = [
  "#00695C",
  "#33691E",
  "#F57F17",
  "#4A148C",
  "#4E342E",
  "#263238",
];

const getHashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const getTagStyle = (tag?: any) => {
  if (!tag) return { main: TAG_COLORS.default, bg: `${TAG_COLORS.default}1A` };

  const tagName = typeof tag === "object" ? tag.name : String(tag);

  const foundKey = Object.keys(TAG_COLORS).find(
    (key) => key.toLowerCase() === tagName.toLowerCase(),
  );

  const color = foundKey
    ? TAG_COLORS[foundKey]
    : GHOST_HUBS[getHashCode(tagName) % GHOST_HUBS.length];

  return {
    main: color,
    bg: `${color}26`,
  };
};


export const eventPropGetter = (event: any) => {
  const { main, bg } = getTagStyle(event.resource?.firstTag);

  return {
    style: {
      backgroundColor: bg,
      color: main,
      border: "none",
      borderLeft: `4px solid ${main}`,
      borderRadius: "4px",
      padding: "2px 8px",
      fontWeight: 600,
      fontSize: "13px",
      display: "block",
    },
  };
};
