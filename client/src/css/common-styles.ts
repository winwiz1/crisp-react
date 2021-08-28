type CssInJs = Record<string,Record<string,string|number>>;

export function getAnchorCSS(): CssInJs {
  return {
    "& a": {
      fontWeight: 600,
      color: "#3275b7",
    },
    "& a:hover": {
      textDecoration: "underline",
      textDecorationThickness: "2px",
    }
  };
}
