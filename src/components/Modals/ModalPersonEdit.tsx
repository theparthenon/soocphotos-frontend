import {
    Avatar,
    Button,
    Divider,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton,
  } from "@mantine/core";
  import { useMediaQuery } from "@mantine/hooks";
  import React, { useState } from "react";

  import { useFetchPeopleAlbumsQuery } from "@/api/endpoints/albums/people";
  import { api } from "@/api/api";
  import { serverAddress } from "@/api/apiClient";
  import { notification } from "@/services/notifications";
  import { useAppDispatch } from "@/store/store";
  import { fuzzyMatch } from "@/utils/utils";

  type Props = Readonly<{
    isOpen: boolean;
    onRequestClose: () => void;
    resetGroups?: () => void;
    selectedFaces: any[];
  }>;

  export function ModalPersonEdit(props: Props) {
    const [newPersonName, setNewPersonName] = useState("");

    const matches = useMediaQuery("(min-width: 700px)");

    const { data: people } = useFetchPeopleAlbumsQuery();

    const dispatch = useAppDispatch();
    const { isOpen, onRequestClose, selectedFaces, resetGroups } = props;
    let filteredPeopleList = people;

    if (newPersonName.length > 0) {
      filteredPeopleList = people?.filter(el => fuzzyMatch(newPersonName, el.text));
    }

    const selectedImageIDs = selectedFaces.map(face => face.face_url);
    const selectedFaceIDs = selectedFaces.map(face => face.face_id);

    function personExist(name: string) {
      return people?.map(person => person.text.toLowerCase().trim()).includes(name.toLowerCase().trim());
    }

    return (
      <Modal
        zIndex={1500}
        opened={isOpen}
        title={<Title>Label Faces</Title>}
        onClose={() => {
          onRequestClose();
          setNewPersonName("");
        }}
      >
        <Stack>
          <Text color="dimmed">
            Label selected  {selectedFaces.length} face(s) as...
          </Text>
          <ScrollArea style={{ height: 50 }}>
            <Group>
              {selectedImageIDs.map(image => (
                <Avatar key={`selected_image${image}`} size={40} src={`${serverAddress}${image}`} radius="xl" />
              ))}
            </Group>
          </ScrollArea>

          <Divider />
          <Title order={5}>New Person</Title>
          <Group>
            <TextInput
              error={
                personExist(newPersonName) ? "Person " + newPersonName.trim() + " already exists." : ""
              }
              onChange={v => {
                setNewPersonName(v.currentTarget.value);
              }}
              placeholder="Person Name"
            />
            <Button
              onClick={() => {
                dispatch(
                  api.endpoints.setFacesPersonLabel.initiate({
                    faceIds: selectedFaceIDs,
                    personName: newPersonName,
                  })
                );
                notification.addFacesToPerson(newPersonName, selectedFaceIDs.length);
                if (resetGroups) {
                  resetGroups();
                }
                onRequestClose();
                setNewPersonName("");
              }}
              disabled={personExist(newPersonName) || newPersonName.trim().length === 0}
              type="submit"
            >
              Add Person
            </Button>
          </Group>
          <Divider />
          <Stack
            style={{
              height: matches ? "50vh" : "25vh",
              overflowY: "scroll",
            }}
          >
            {filteredPeopleList &&
              filteredPeopleList.length > 0 &&
              filteredPeopleList?.map(item => (
                <UnstyledButton
                  key={item.key}
                  className="modalButton"
                  onClick={() => {
                    dispatch(
                      api.endpoints.setFacesPersonLabel.initiate({
                        faceIds: selectedFaceIDs,
                        personName: item.text,
                      })
                    );
                    notification.addFacesToPerson(item.text, selectedFaceIDs.length);
                    onRequestClose();
                  }}
                >
                  <Group key={item.key}>
                    <Avatar radius="xl" size={60} src={serverAddress + item.face_url} />
                    <div>
                      <Title
                        style={{ width: "250px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                        order={4}
                      >
                        {item.text}
                      </Title>
                      <Text size="sm" color="dimmed">
                        {item.face_count} Photo(s)
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              ))}
          </Stack>
        </Stack>
      </Modal>
    );
  }

  ModalPersonEdit.defaultProps = {
    resetGroups: () => {},
  };
