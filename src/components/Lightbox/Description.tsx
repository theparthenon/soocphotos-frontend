import { ActionIcon, Badge, Group, Stack, Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconCheck, IconEdit, IconX, IconNote as Note, IconTags as Tags, IconWand as Wand } from "@tabler/icons-react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import { Text as TipTapText } from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { push } from "redux-first-history";

import { generatePhotoIm2txtCaption, savePhotoCaption } from "@/actions/photosActions";
import type { Photo as PhotoType } from "@/@types/photos";
import { useFetchThingsAlbumsQuery } from "@/api/endpoints/albums/things";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fuzzyMatch } from "@/utils/utils";
import suggestion from "./Suggestion";

type Props = Readonly<{
  photoDetail: PhotoType;
}>;

export function Description(props: Props) {
  const dispatch = useAppDispatch();
  const { generatingCaptionIm2txt } = useAppSelector(store => store.photos);

  const { data: thingAlbums } = useFetchThingsAlbumsQuery();

  const { photoDetail } = props;

  const [editMode, setEditMode] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const editor = useEditor({
    editable: editMode,
    extensions: [
      Document,
      Paragraph,
      TipTapText,
      Mention.configure({
        HTMLAttributes: {
          class: "hashtag",
        },
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          items: ({ query }) => {
            if (thingAlbums == null) {
              return [];
            }
            return thingAlbums
              ?.filter(item => fuzzyMatch(query, item.title) && item.thing_type === "hashtag_attribute")
              .map(item => item.title)
              .slice(0, 5)
              .concat(query)
              .reverse();
          },
          char: suggestion.char,
          render: suggestion.render,
        },
      }),
    ],
    content: imageCaption,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onUpdate({ editor }) {
      setImageCaption(editor.getText());
    },
  });

  useEffect(() => {
    if (photoDetail) {
      const currentCaption = photoDetail.captions_json.user_caption ? photoDetail.captions_json.user_caption : "";
      const replacedCaption = currentCaption.replace(/#(\w+)/g, '<span data-type="mention" data-id=$1>#$1</span>');
      editor?.commands.setContent(replacedCaption);
      setImageCaption(currentCaption);
    }
  }, [photoDetail, editor]);

  return (
    <Stack>
      <Stack>
        <Stack>
          <Group>
            <Note />
            <Title order={4}>Caption</Title>
          </Group>
          {photoDetail.captions_json.im2txt &&
            editMode &&
            !imageCaption?.includes(photoDetail.captions_json.im2txt) && (
              <div>
                <Group gap="sm" style={{ paddingBottom: 12 }}>
                  <Wand color="grey" size={20} />
                  <Text size="sm" color="dimmed">
                    Suggestion
                  </Text>
                </Group>
                <UnstyledButton
                    className="lightboxCaptionButton"
                    onClick={() => {
                        editor?.commands.setContent(photoDetail.captions_json.im2txt);
                        setImageCaption(photoDetail.captions_json.im2txt);
                    }}
                >
                  {photoDetail.captions_json.im2txt}
                </UnstyledButton>
                <div style={{ height: 5 }} />
              </div>
            )}
        </Stack>
        <div
          style={{ borderStyle: !editMode ? "none" : "solid", border: "0.0625rem #ced4da", borderRadius: "0.25rem" }}
        >
          <RichTextEditor editor={editor} style={{ borderColor: "none" }}>
            <RichTextEditor.Content style={{ paddingRight: 10 }} />
            {editMode && (
              <ActionIcon
                style={{ position: "absolute", right: 0, top: 0, margin: "5px" }}
                loading={generatingCaptionIm2txt}
                variant="subtle"
                onClick={() => {
                  dispatch(generatePhotoIm2txtCaption(photoDetail.image_hash));
                }}
                disabled={(generatingCaptionIm2txt != null && generatingCaptionIm2txt)}
              >
                <Wand />
              </ActionIcon>
            )}
            {!editMode && (
              <ActionIcon
                style={{ position: "absolute", right: 0, top: 0, margin: "5px" }}
                loading={generatingCaptionIm2txt}
                variant="subtle"
                onClick={() => {
                  setEditMode(true);
                  editor?.setEditable(true);
                }}
                disabled={(generatingCaptionIm2txt != null && generatingCaptionIm2txt)}
              >
                <IconEdit />
              </ActionIcon>
            )}
          </RichTextEditor>
        </div>
        {editMode && (
          <Group justify="center">
            <Tooltip label="Cancel">
              <ActionIcon
                variant="light"
                onClick={() => {
                  setEditMode(false);
                }}
                color="red"
              >
                <IconX />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Submit">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => {
                  dispatch(savePhotoCaption(photoDetail.image_hash, imageCaption));
                  setEditMode(false);
                }}
              >
                <IconCheck />
              </ActionIcon>
            </Tooltip>
          </Group>
        )}
        {photoDetail.captions_json.places365 && (
          <Stack>
            <Group>
              <Tags />
              <Title order={4}>Scene</Title>
            </Group>
            <Text style={{ fontWeight: 700 }}>Attributes</Text>
            <Group>
              {photoDetail.captions_json.places365.attributes.map(nc => (
                <Badge
                  key={`lightbox_attribute_label_${photoDetail.image_hash}_${nc}`}
                  color="blue"
                  onClick={() => {
                    dispatch(push(`/search/${nc}`));
                  }}
                >
                  {nc}
                </Badge>
              ))}
            </Group>

            <Text style={{ fontWeight: 700 }}>Categories</Text>
            <Group>
              {photoDetail.captions_json.places365.categories.map(nc => (
                <Badge
                  key={`lightbox_category_label_${photoDetail.image_hash}_${nc}`}
                  color="teal"
                  onClick={() => {
                    dispatch(push(`/search/${nc}`));
                  }}
                >
                  {nc}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
