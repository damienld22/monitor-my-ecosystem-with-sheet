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
import { AVAILABLE_CATEGORIES } from "./constants";
import { getAllData, indicateUpToDate } from "./requests";

const isElementIsUpToDate = (element) =>
  element.latestVersion === element.latestCheckedVersion;

function App() {
  const { data, isLoading } = useQuery("items", getAllData);
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
        AVAILABLE_CATEGORIES.map((cat) => (
          <ElementsTable
            key={cat}
            name={cat}
            elements={data.filter((elt) => elt.category === cat)}
          />
        ))
      )}

      <AddItemModal
        onClose={() => setAddItemOpen(false)}
        isOpen={addItemOpen}
      />
    </div>
  );
}

function ElementsTable({ elements, name }) {
  const queryClient = useQueryClient();
  const mutation = useMutation(indicateUpToDate, {
    onSuccess: (result) => {
      queryClient.setQueryData("items", (old) =>
        old.map((elt) => (elt.name === result.name ? result : elt))
      );
    },
  });

  return elements.length > 0 ? (
    <div style={{ marginTop: 20, marginBottom: 20 }}>
      <Text fontSize="2xl">{name}</Text>
      <TableContainer style={{ paddingTop: 10, width: "80vw" }}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
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
                  <Link href={elt.newsLink} isExternal>
                    {elt.name} news
                  </Link>
                </Td>
                <Td>
                  <span
                    className={isElementIsUpToDate(elt) ? "" : "NotUpToDate"}
                  >
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
    </div>
  ) : (
    <></>
  );
}

export default App;
