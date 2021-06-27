/**
 * The APIClient component renders the data received from
 * backend via API call.
 */
import * as React from "react";
import { style } from "typestyle";
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

//#region CSS

const cssFlexContainer = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",

});

const cssFlexItem = style({
  flex: "1 0 auto",
  marginTop: "1rem !important"
});

const cssInputHeader = style({
  display: "block",
  fontSize: "1.3em",
  fontWeight: "bold",
  marginBottom: "0.8em",
  marginTop: "0.4em"
});

const cssWidth = "27ch";

const cssInputFootnote = style({
  marginTop: "1em",
  overflow: "hidden",
  width: cssWidth
});

const cssInput = style({
  width: cssWidth
});

const cssCardMeta = style({
  marginTop: "0.7em"
});

const cssButton = style({
  marginBottom: "0.9em !important",
  marginTop: "1.5em !important"
});

const cssDivider = style({
  marginTop: "2.5em !important"
});

//#endregion

const NameLookupContent: React.FC = _props => {
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

  //#region Render

  return (
    <section>
      <Container text textAlign="justified">
        <Header as="h3">Hello from NameLookup</Header>
        <p>
          <code>NameLookup</code> is used by <code>first.tsx</code> which has been
          set as an 'entry point' of the 'first' script bundle by <code>
          webpack.config.js</code>. Because of that the <code>NameLookup
          </code> component and its dependencies are packaged into the 'first' script
          bundle, except for components under <code>node_modules/</code> separated
          into the 'vendor' bundle.
        </p>
        <p>
          <code>NameLookup</code> asks the backend to perform API calls. The backend
          queries a cloud service: Name Lookup service in this project or Google
          BigQuery in the sibling Crisp BigQuery project. The credentials (if any)
          required to access the cloud service are held by the backend.
        </p>
        <Divider horizontal className={cssDivider}>API</Divider>
        <div className={cssFlexContainer}>
          <Segment compact basic className={cssFlexItem}>
            <div className={cssInputHeader}>Name to lookup</div>
            <Input
              type="text"
              maxLength="32"
              className={cssInput}
              error={!isNameValid(name)}
              onChange={onNameChange}
              ref={inputRef}
            />
            <div className={cssInputFootnote}>
              Type a name e.g. &nbsp; <code>Alice</code>.<br />
              Then click on the button to discover the gender.
          </div>
          </Segment>

          <Segment basic className={cssFlexItem}>
            <Card>
              <Card.Content>
                <Card.Header textAlign="center">API Data</Card.Header>
                <Card.Meta className={cssCardMeta}>
                  {`Probability: ${getProbability()}`}
                </Card.Meta>
                <Card.Description>
                  {`The gender is:  ${getGender() ?? "unknown"}`}
                </Card.Description>
                <Card.Content extra textAlign="center" >
                  <Button
                    className={cssButton}
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
    <BaseComponent leftComponent={Navigation} rightComponent={NameLookupContent} />
  );
};
