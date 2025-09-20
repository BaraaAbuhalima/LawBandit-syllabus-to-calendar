"use client";
import { CalendarEvent } from "@/types/openAi";
import { useMemo } from "react";
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { format } from "date-fns";

interface EventListProps {
  events: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
  selectedId?: number | null;
}

export default function EventList({
  events,
  onSelect,
  selectedId,
}: EventListProps) {
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => a.date.getTime() - b.date.getTime() || a.id - b.id
      ),
    [events]
  );

  if (!sorted.length) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        mt: 4,
        height: { xs: 480, sm: 520, md: 640 },
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        flexShrink={0}
      >
        <Typography variant="h6" fontWeight={600}>
          Events List
        </Typography>
        <Chip label={`${sorted.length}`} size="small" />
      </Stack>
      <List
        dense
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.25)",
            borderRadius: 3,
          },
        }}
      >
        {sorted.map((evt) => {
          const dateLabel = format(evt.date, "yyyy-MM-dd");
          return (
            <ListItemButton
              key={evt.id}
              selected={evt.id === selectedId}
              onClick={() => onSelect(evt)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemText
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: 12 }}
                primary={`${dateLabel} • ${evt.title}`}
                secondary={evt.keywords}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}
