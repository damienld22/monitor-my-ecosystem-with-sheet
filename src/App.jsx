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
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddItemModal from "./AddItemModal";
import "./App.css";
import { getAllData, indicateUpToDate } from "./requests";

const isElementIsUpToDate = (element) =>
  element.latestVersion === element.latestCheckedVersion;

function App() {
  const { data, isLoading } = useQuery("items", getAllData);
  const usedItems = data?.filter((elt) => elt.sheet === "Using") || [];
  const interestedItems =
    data?.filter((elt) => elt.sheet === "InterestedIn") || [];
  const [addItemOpen, setAddItemOpen] = useState(false);

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
        <div>
          <Text fontSize="4xl" style={{ paddingBottom: 20 }}>
            Using
          </Text>
          <ElementsTable elements={usedItems} />

          <Text fontSize="4xl" style={{ paddingBottom: 20 }}>
            Interested In
          </Text>
          <ElementsTable elements={interestedItems} />
        </div>
      )}

      <AddItemModal
        onClose={() => setAddItemOpen(false)}
        isOpen={addItemOpen}
      />
    </div>
  );
}

function ElementsTable({ elements }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(indicateUpToDate, {
    onSuccess: (result) => {
      queryClient.setQueryData("items", (old) =>
        old.map((elt) => (elt.name === result.name ? result : elt))
      );
    },
  });

  return (
    <TableContainer style={{ paddingBottom: 40 }}>
      <Table variant="striped">
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
                <Link href={elt.link} isExternal>
                  {elt.name}
                </Link>
              </Td>
              <Td>
                <span>{elt.description}</span>
              </Td>
              <Td>
                <Link href={elt.newsLink} isExternal>
                  {elt.name} news
                </Link>
              </Td>
              <Td>
                <span className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}>
                  {isElementIsUpToDate(elt)
                    ? elt.latestVersion
                    : `${elt.latestVersion} (Latest checked : ${
                        elt.latestCheckedVersion || "/"
                      })`}
                </span>
              </Td>
              <Td>
                {isElementIsUpToDate(elt) ? (
                  <span>Up to date !</span>
                ) : (
                  <Button onClick={() => mutation.mutate(elt)}>
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
