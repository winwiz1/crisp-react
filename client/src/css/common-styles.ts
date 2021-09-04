type CssInJs = Record<string,Record<string,string|number>>;

/*
This function helps to avoid code repetition in .tsx files but
it won't eliminate rule duplication in CSS stylesheet unless an
Atomic CSS-in-JS library is used (see README).

It's a typical CSS-in-JS drawback and in this project it was
deemed to be an acceptable price to pay for CSS-in-JS advantages.
*/
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
