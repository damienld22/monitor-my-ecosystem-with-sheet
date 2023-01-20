import {
  Button,
  CircularProgress,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AddItemModal from "./AddItemModal";
import "./App.css";
import { getAllData, indicateUpToDate } from "./requests";

const isElementIsUpToDate = (element) =>
  element.latestVersion === element.latestCheckedVersion;

function App() {
  const [usedTech, setUsedTech] = useState([]);
  const [interestedInTech, setInterestedInTech] = useState([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllData().then((data) => {
      setUsedTech(data.filter((elt) => elt.sheet === "Using"));
      setInterestedInTech(data.filter((elt) => elt.sheet === "InterestedIn"));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <Text fontSize="6xl">My ecosystem</Text>

      <Button
        colorScheme="teal"
        variant="outline"
        onClick={() => setAddItemOpen(true)}
      >
        Add new item
      </Button>

      {isLoading ? (
        <CircularProgress style={{ marginTop: "10vh" }} isIndeterminate />
      ) : (
        <div className="Tables">
          <Text fontSize="4xl">Using</Text>
          <ElementsTable
            elements={usedTech}
            onElementUpdated={(eltUpdated) => {
              setUsedTech((prev) =>
                prev.map((elt) =>
                  elt.name === eltUpdated.name ? eltUpdated : elt
                )
              );
            }}
          />

          <Text fontSize="4xl">Interested In</Text>
          <ElementsTable
            elements={interestedInTech}
            onElementUpdated={(eltUpdated) => {
              setInterestedInTech((prev) =>
                prev.map((elt) =>
                  elt.name === eltUpdated.name ? eltUpdated : elt
                )
              );
            }}
          />
        </div>
      )}

      <AddItemModal
        onClose={(element) => {
          if (element?.sheet === "Using") {
            setUsedTech((prev) => [...prev, element]);
          } else if (element?.sheet === "InterestedIn") {
            setInterestedInTech((prev) => [...prev, element]);
          }
          setAddItemOpen(false);
        }}
        isOpen={addItemOpen}
      />
    </div>
  );
}

function ElementsTable({ elements, onElementUpdated }) {
  const indicateElementChecked = (element) => {
    indicateUpToDate(element)
      .then(onElementUpdated)
      .catch(() => console.error("Failed indicate element updated"));
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>News link</Th>
            <Th>Latest version</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {elements.map((elt) => (
            <Tr key={elt.name}>
              <Td>
                <Link
                  className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}
                  href={elt.link}
                  isExternal
                >
                  {elt.name}
                </Link>
              </Td>
              <Td>
                <span className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}>
                  {elt.description}
                </span>
              </Td>
              <Td>
                <Link
                  className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}
                  href={elt.newsLink}
                  isExternal
                >
                  {elt.name} news
                </Link>
              </Td>
              <Td>
                <span className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}>
                  {elt.latestVersion}
                </span>
              </Td>
              <Td>
                {isElementIsUpToDate(elt) ? (
                  <span>Up to date !</span>
                ) : (
                  <Button onClick={() => indicateElementChecked(elt)}>
                    Indicate OK
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default App;
