/**
 * The APIClient component renders the data received from
 * backend via API call.
 */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Button,
  Card,
  Container,
  Divider,
  Header,
  Icon,
  Input,
  InputOnChangeData,
  Message,
  Segment
} from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { StructuredData } from "./StructuredData";
import {
  SampleRetrieval,
  SampleRetrievalData,
  SampleRetrievalResult,
  BackendManager
} from "../api/BackendManager";
import { IBackendRequestData } from "../api/BackendRequest";
import { CustomError } from "../utils/error";
import {
  isError,
  isCustomError,
} from "../utils/typeguards";
import {
  getTitle,
  getCanonical,
  perfEnd
} from "../utils/misc";

//#region CSS

const cssFlexContainer = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",

});

const cssFlexItem = css({
  flex: "1 0 auto",
  marginTop: "1rem !important"
});

const cssInputHeader = css({
  display: "block",
  fontSize: "1.3em",
  fontWeight: "bold",
  marginBottom: "0.8em",
  marginTop: "0.4em"
});

const cssWidth = "27ch";

const cssInputFootnote = css({
  marginTop: "1em",
  overflow: "hidden",
  width: cssWidth
});

const cssInput = css({
  width: cssWidth
});

const cssCardMeta = css({
  marginTop: "0.7em"
});

const cssButton = css({
  marginBottom: "0.9em !important",
  marginTop: "1.5em !important"
});

const cssDivider = css({
  marginTop: "2.5em !important"
});

//#endregion

const NameLookupContent: React.FC = _props => {
  const pageName = "NameLookup";
  const pageDescription = "Sample component called 'NameLookup'";

  // API call is in progress
  const [inFlight, setInFlight] = React.useState<boolean>(false);

  // Name entered by user
  const [name, setName] = React.useState<string | undefined>(undefined);
  const onNameChange = (_evt: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setName(data.value);
  };
  function isNameValid(nameToCheck: string | undefined): boolean {
    // eslint-disable-next-line no-extra-boolean-cast
    return !!nameToCheck ? BackendManager.RegexName.test(nameToCheck) : false;
  }

  // API call outcome
  const [outcome, setOutcome] = React.useState<SampleRetrieval | undefined>(undefined);
  function isOutcomeFailure(): boolean {
    return isError(outcome) || isCustomError(outcome);
  }

  // HTML <input> used to enter a name
  const inputRef = React.useRef<Input>(null);
  React.useEffect(() => { inputRef.current?.focus(); }, []);

  // AbortController
  const [controller, setController] = React.useState<AbortController | undefined>(undefined);
  const abortFetch = () => {
    !!controller && controller.abort();
  };

  // Button click handler
  const onQuery = async () => {
    const apiTimeout = 5000;
    const reqData: IBackendRequestData = { name: name! };

    abortFetch();
    const abortController = new AbortController();
    setController(abortController);

    const backendMgr = new BackendManager(abortController.signal);
    setInFlight(true);
    const ret: boolean = await Promise.race([
      backendMgr.fetch(reqData),
      new Promise<boolean>(resolve => setTimeout(resolve, apiTimeout, false))
    ]);
    setInFlight(false);

    const data = ret ? backendMgr.Data :
      (abortFetch(),
        new CustomError(
          "Could not get data from the backend, it didn't respond in a timely fashion." +
          " If the problem persists please contact Support.",
          "Timeout fetching data")
      );

    setOutcome(data);
    setController(undefined);
  };

  // Helper function
  function getProbability(): string {
    return !outcome || isOutcomeFailure() ?
      "unknown" :
      String((outcome as SampleRetrievalResult).response.probability);
  }

  // Helper function
  function getGender(): SampleRetrievalData["gender"] {
    return !outcome || isOutcomeFailure() ?
      undefined :
      (outcome as SampleRetrievalResult).response.gender;
  }

  React.useEffect(() => {
    !!outcome && !isOutcomeFailure() && perfEnd();
  }, [outcome]);

  //#region Render

  return (
    <section>
      <Helmet>
        <title>{getTitle(pageName)}</title>
        <link rel="canonical" href={getCanonical()} />
      </Helmet>
      <StructuredData
        name={pageName}
        description={pageDescription}
      />
      <Container text textAlign="justified">
        <Header as="h3">Hello from NameLookup component</Header>
        <p>
          <code>NameLookup</code> is used by <code>first.tsx</code> which has been
          set as an 'entry point' of the 'first' script bundle by <code>
          webpack.config.js</code>. Because of that the <code>NameLookup
          </code> component and its dependencies are packaged into the 'first' script
          bundle, except for components under <code>node_modules/</code> separated
          into the 'vendor' bundle.
        </p>
        { !CF_PAGES && <p>
          <code>NameLookup</code> asks the backend to perform API calls. The backend
          queries a cloud service: Name Lookup service in this project or Google
          BigQuery in the sibling Crisp BigQuery project. The credentials (if any)
          required to access the cloud service are held by the backend.
        </p>
        }
        { CF_PAGES && <p>
          Since there is no backend in Jamstack builds, <code>NameLookup</code> has
          to query the API endpoint directly.
        </p>
        }
        <Divider horizontal css={cssDivider}>API</Divider>
        <div css={cssFlexContainer}>
          <Segment compact basic css={cssFlexItem}>
            <div css={cssInputHeader}>Name to lookup</div>
            <Input
              type="text"
              maxLength="32"
              css={cssInput}
              error={!isNameValid(name)}
              onChange={onNameChange}
              ref={inputRef}
            />
            <div css={cssInputFootnote}>
              Type a name e.g. &nbsp; <code>Alice</code>.<br />
              Then click on the button to discover the gender.
          </div>
          </Segment>

          <Segment basic css={cssFlexItem}>
            <Card>
              <Card.Content>
                <Card.Header textAlign="center">API Data</Card.Header>
                <Card.Meta css={cssCardMeta}>
                  {`Probability: ${getProbability()}`}
                </Card.Meta>
                <Card.Description>
                  {`The gender is:  ${getGender() ?? "unknown"}`}
                </Card.Description>
                <Card.Content extra textAlign="center" >
                  <Button
                    css={cssButton}
                    size="tiny"
                    color="blue"
                    disabled={!isNameValid(name) || inFlight}
                    onClick={onQuery}
                    loading={inFlight}
                  >
                    <Icon name="search" />
                    Find gender
                  </Button>
                </Card.Content>
              </Card.Content>
            </Card>
          </Segment>
        </div>
        <p />
        <Message
          hidden={!outcome || !isOutcomeFailure()}
          error={true}
          content={isOutcomeFailure() ? (outcome as Error).message : undefined}
          header="Error"
        />
      </Container>
    </section>
  );

  //#endregion
};

export const NameLookup: React.FC = _props => {
  return (
    <BaseComponent
      leftComponent={Navigation}
      rightComponent={NameLookupContent}
    />
  );
};
