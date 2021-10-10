
import * as React from "react";
import { Helmet } from "react-helmet";

interface IStructuredData {
  name: string;
  description: string;
};

export const StructuredData: React.FC<IStructuredData> = props => {

  // Replace with the structured data that describes the content of your webpages.
  // Possibly replace 'WebPage' with 'Product' or 'Article' etc.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": props.name,
    "description": props.description,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
