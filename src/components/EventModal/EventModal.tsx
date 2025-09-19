"use client";

import { useState } from "react";
import { CalendarEvent } from "@/types/openAi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";

type EventModalProps = {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSave: (updatedEvent: CalendarEvent) => void;
};

const formatDate = (d: Date) => d.toISOString().split("T")[0];
const EventModal = ({ event, onClose, onDelete, onSave }: EventModalProps) => {
  const [title, setTitle] = useState(event.title);
  const [fullDescription, setFullDescription] = useState(event.fullDescription);
  const [date, setDate] = useState(
    formatDate(new Date(event.date.getTime() + 40000000))
  );

  const handleSave = () =>
    onSave({
      ...event,
      title,
      fullDescription,
      date: new Date(date),
    });

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            {event.shortDescription}
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Full Description"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{
              '& input[type="date"]::-webkit-calendar-picker-indicator': {
                filter:
                  "invert(36%) sepia(98%) saturate(7472%) hue-rotate(203deg) brightness(97%) contrast(101%)",
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="text">
          Cancel
        </Button>
        <Button onClick={() => onDelete(event.id)} color="error">
          Delete
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
