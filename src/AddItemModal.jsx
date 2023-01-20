import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createNewItem } from "./requests";

export default function AddItemModal({ isOpen = false, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const [npmPackage, setNpmPackage] = useState("");
  const [sheet, setSheet] = useState("Using");
  const toast = useToast();

  const clear = () => {
    setName("");
    setDescription("");
    setLink("");
    setNewsLink("");
    setNpmPackage("");
    setSheet("Using");
  };

  const onValidate = () => {
    createNewItem({
      name,
      description,
      link,
      newsLink,
      npmPackage,
      sheet,
    })
      .then((createdElement) => {
        toast({
          title: "Item created",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        clear();
        onClose(createdElement);
      })
      .catch(() => {
        toast({
          title: "Failed to create item",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            style={{ marginTop: 10 }}
            placeholder="Name"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
          <Input
            style={{ marginTop: 10 }}
            placeholder="Description"
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
          />
          <Input
            style={{ marginTop: 10 }}
            placeholder="Link"
            value={link}
            onChange={(evt) => setLink(evt.target.value)}
          />
          <Input
            style={{ marginTop: 10 }}
            placeholder="News link"
            value={newsLink}
            onChange={(evt) => setNewsLink(evt.target.value)}
          />
          <Input
            style={{ marginTop: 10 }}
            placeholder="NPM package name"
            value={npmPackage}
            onChange={(evt) => setNpmPackage(evt.target.value)}
          />
          <Select
            style={{ marginTop: 10 }}
            value={sheet}
            onChange={(evt) => setSheet(evt.target.value)}
            placeholder="Select sheet"
          >
            <option value="Using">Using</option>
            <option value="InterestedIn">Interested In</option>
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={onValidate}>
            Validate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
