type TypeStyleNestedCSS = Record<"$nest",Record<string,Record<string,string|number>>>;

export function getAnchorCSS(): TypeStyleNestedCSS {
  return {
    $nest: {
      "& a": {
        fontWeight: 600,
        color: "#3275b7",
      },
      "& a:hover": {
        textDecoration: "underline",
        textDecorationThickness: "2px",
      }
    }
  };
}