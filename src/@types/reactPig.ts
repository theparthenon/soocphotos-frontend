import { z } from "zod";

export const ItemTypeSchema = z.object({
    id: z.string(),
    dominantColor: z.string(),
    isTemp: z.boolean(),
    url: z.string(),
    type: z.string(),
    style: z.object({
        height: z.number(),
        width: z.number(),
        translateX: z.number(),
        translateY: z.number(),
    }),
});

export type ItemType = z.infer<typeof ItemTypeSchema>;

export const SettingsTypeSchema = z.object({
    gridGap: z.number(),
    bgColor: z.string(),
    thumbnailSize: z.number(),
    expandedSize: z.number(),
});

export type SettingsType = z.infer<typeof SettingsTypeSchema>;

export const TileSchema = z.object({
    item: ItemTypeSchema,
    useLqip: z.boolean(),
    containerWidth: z.number(),
    containerOffsetTop: z.number(),
    getUrl: z.function(),
    activeTileUrl: z.string(),
    handleClick: z.function(),
    handleSelection: z.function(),
    selected: z.boolean(),
    selectable: z.boolean(),
    windowHeight: z.number(),
    scrollSpeed: z.string(),
    settings: SettingsTypeSchema,
    toprightoverlay: z.function().nullable(),
    bottomleftoverlay: z.function().nullable(),
});

export type ITile = z.infer<typeof TileSchema>;