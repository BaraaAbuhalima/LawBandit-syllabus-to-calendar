"use client";

import { useState, useCallback } from "react";
import "./Form.css";
import SyllabusCalendar, {
  CalendarDnDArgs,
} from "@/components/SyllabusCalendar/SyllabusCalendar";
import EventModal from "@/components/EventModal/EventModal";
import { CalendarEvent, SyllabusEvent } from "@/types/openAi";
import { syllabusEventsToCalendarEvents } from "@/features/calendar/lib/transform";
import {
  Button,
  CircularProgress,
  Paper,
  Box,
  Stack,
  Typography,
  FormHelperText,
  Chip,
  Divider,
  Fade,
  useTheme,
} from "@mui/material";
import GoogleCalendarSync from "@/components/GoogleCalendarSync";
import EventList from "@/components/EventList/EventList";

const UploadSyllabus = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024;

  const handleFileSelect = useCallback(
    (f: File | undefined) => {
      if (!f) return;
      if (f.size > MAX_BYTES) {
        setFile(null);
        setFileError(
          `File is too large: ${(f.size / (1024 * 1024)).toFixed(
            2
          )} MB. Max allowed is 5.00 MB.`
        );
        return;
      }
      setFileError(null);
      setFile(f);
    },
    [MAX_BYTES]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setFileError("File exceeds 5MB limit.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    let calendarEvents: CalendarEvent[] = [];
    try {
      const response = await fetch("/api/syllabus/extract", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const raw = data.result;
      type RawParsed = {
        date: string;
        shortDescription: string;
        fullDescription: string;
        keywords: string;
      };
      const parsed: SyllabusEvent[] = (JSON.parse(raw) as RawParsed[]).map(
        (e, index: number) => ({
          id: index,
          date: new Date(e.date),
          shortDescription: e.shortDescription,
          fullDescription: e.fullDescription,
          keywords: e.keywords,
        })
      );
      calendarEvents = syllabusEventsToCalendarEvents(parsed);
      setEvents(calendarEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDrop = ({ event, date }: CalendarDnDArgs) => {
    setEvents(events.map((e) => (e.id === event.id ? { ...e, date } : e)));
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  const handleSave = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setSelectedEvent(null);
  };
  return (
    <Box className="upload-wrapper" sx={{ px: { xs: 2, md: 4 }, pt: 3, pb: 6 }}>
      <Paper
        elevation={8}
        className="upload-card"
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: theme.palette.background.paper,
        }}
      >
        <Stack spacing={2} component="form" onSubmit={handleUpload}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Upload Syllabus
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 640 }}
          >
            Provide a syllabus text file. We&apos;ll parse dates and
            assignments, then generate an academic calendar you can edit.
          </Typography>
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={onDrop}
            onClick={() =>
              document.getElementById("file-input-hidden")?.click()
            }
            aria-label="File upload drop zone"
            className={`drop-zone ${dragActive ? "active" : ""}`}
          >
            <input
              id="file-input-hidden"
              type="file"
              style={{ display: "none" }}
              disabled={loading}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              required={!file}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              {file ? "File Selected" : "Drag & Drop your syllabus here"}
            </Typography>
            <Typography
              variant="caption"
              color={fileError ? "error" : "text.secondary"}
            >
              {file
                ? `${file.name} • ${(file.size / 1024).toFixed(1)} KB`
                : "or click to browse"}
            </Typography>
          </Box>
          <FormHelperText sx={{ ml: 0 }} error={!!fileError}>
            {fileError
              ? fileError
              : "All formats supported. It may take ~30–60 seconds to process. (Max file size: 5MB)"}
          </FormHelperText>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !file}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
              sx={{ minWidth: 160 }}
            >
              {loading ? "Processing…" : "Upload & Parse"}
            </Button>
            {file && !loading && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => setFile(null)}
              >
                Remove File
              </Button>
            )}
            {events.length > 0 && (
              <Fade in timeout={400}>
                <Chip
                  label={`${events.length} events`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Fade>
            )}
            {events.length > 0 && (
              <>
                <GoogleCalendarSync events={events} />
              </>
            )}
          </Stack>
        </Stack>
        {events.length > 0 && (
          <Fade in timeout={600}>
            <Divider sx={{ mt: 4 }} />
          </Fade>
        )}
      </Paper>

      {events.length > 0 && (
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={4}
          alignItems="flex-start"
        >
          <Box flex={1} minWidth={0}>
            <SyllabusCalendar
              events={events}
              onEventDrop={handleEventDrop}
              onSelectEvent={setSelectedEvent}
            />
          </Box>
          <Box width={{ xs: "100%", lg: 360 }} flexShrink={0}>
            <EventList
              events={events}
              selectedId={selectedEvent?.id ?? null}
              onSelect={(e) => setSelectedEvent(e)}
            />
          </Box>
        </Stack>
      )}

      {selectedEvent && (
        <>
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={handleDelete}
            onSave={handleSave}
          />
          {/* <GoogleCalendarSync events={events} /> */}
        </>
      )}

      {events.length > 0 && (
        <>
          <GoogleCalendarSync events={events} />
        </>
      )}
    </Box>
  );
};
export default UploadSyllabus;
