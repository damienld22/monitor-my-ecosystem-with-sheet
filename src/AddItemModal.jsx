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
import { useMutation, useQueryClient } from "react-query";
import { createNewItem } from "./requests";

export default function AddItemModal({ isOpen = false, onClose }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [newsLink, setNewsLink] = useState("");
  const [npmPackage, setNpmPackage] = useState("");
  const [sheet, setSheet] = useState("Using");
  const mutation = useMutation(createNewItem, {
    onSuccess: (result) => {
      queryClient.setQueryData("items", (old) => [...old, result]);
      toast({ title: "Item created", status: "success", isClosable: true });
    },
    onError: () => {
      toast({
        title: "An error occured",
        status: "error",
        isClosable: true,
      });
    },
  });

  const clear = () => {
    setName("");
    setDescription("");
    setLink("");
    setNewsLink("");
    setNpmPackage("");
    setSheet("Using");
  };
  const onValidate = () => {
    mutation.mutate({
      name,
      description,
      link,
      newsLink,
      npmPackage,
      sheet,
    });
    clear();
    onClose();
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
