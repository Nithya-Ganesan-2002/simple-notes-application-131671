import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/*
  Notes App Main UI

  Features:
  - Create, edit, delete, view, and search notes
  - Minimalistic light theme, accent color #ffb300, primary #1976d2, secondary #424242
  - Responsive, accessible, clean design
*/

/** NOT PUBLIC: Utility for unique IDs */
function uuidv4() {
  return "xxxxxxxx".replace(/[x]/g, c =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

// PUBLIC_INTERFACE
function App() {
  // Note object: {id, title, body, edited}
  const [notes, setNotes] = useState(() => [
    // Initial blank state
    {
      id: uuidv4(),
      title: "Welcome to Noted",
      body: "Start taking your notes here.",
      edited: false,
    },
  ]);
  const [search, setSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0].id);
  const [theme] = useState("light"); // Only light theme as required
  const [creatingNew, setCreatingNew] = useState(false);

  // Effect: keep selectedNoteId valid if notes change
  useEffect(() => {
    if (!notes.some((n) => n.id === selectedNoteId) && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  // Effect: set the theme (light)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Search filter
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  // Get selected note
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // PUBLIC_INTERFACE
  function handleNewNote() {
    const newNote = {
      id: uuidv4(),
      title: "",
      body: "",
      edited: false,
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setCreatingNew(true);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(noteId) {
    setNotes(notes.filter((n) => n.id !== noteId));
    if (selectedNoteId === noteId && notes.length > 1) {
      setSelectedNoteId(notes[0].id);
    }
  }

  // PUBLIC_INTERFACE
  function handleUpdateNote(field, value) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? { ...n, [field]: value, edited: true }
          : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleSave() {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, edited: false } : n
      )
    );
    setCreatingNew(false);
  }

  // PUBLIC_INTERFACE
  function handleSelectNote(noteId) {
    setSelectedNoteId(noteId);
    setCreatingNew(false);
  }

  // Enter key to save if editing
  const titleInput = useRef();

  useEffect(() => {
    if (creatingNew && titleInput.current) {
      titleInput.current.focus();
    }
  }, [creatingNew, selectedNoteId]);

  // PUBLIC_INTERFACE
  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === "Enter") {
      handleSave();
    }
  }

  // Get basic colors from Figma spec
  const colors = {
    accent: "#ffb300",
    primary: "#1976d2",
    secondary: "#424242",
    bg: "#fff",
    border: "#e0e0e0",
    text: "#282c34",
    disabled: "#bdbdbd",
  };

  // PUBLIC_INTERFACE
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: "0.01em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: colors.primary,
          color: "#fff",
          padding: "1em 2em",
          fontWeight: "bold",
          fontSize: "1.6em",
          letterSpacing: "0.04em",
          boxShadow: "0 2px 8px #0001",
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span role="img" aria-label="note" style={{ marginRight: 12 }}>
          🗒️
        </span>
        Noted
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.8em",
            fontWeight: "400",
            opacity: 0.85,
            color: "#ffd54f",
          }}
        >
          minimal notes app
        </span>
      </header>

      {/* Main layout: sidebar, divider, main note editing panel */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          minHeight: "0",
          background: "#f8f9fa",
        }}
      >
        {/* Sidebar: Notes list & search */}
        <aside
          style={{
            width: 340,
            minWidth: 200,
            background: "#fff",
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "1.1em 1em 0.5em 1em" }}>
            <button
              onClick={handleNewNote}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "0.5em 1.2em",
                fontWeight: 600,
                borderRadius: "1.2em",
                fontSize: "1em",
                cursor: "pointer",
                marginRight: 8,
                boxShadow: "0 1px 3px #0001",
              }}
              aria-label="Create new note"
            >
              + New Note
            </button>
          </div>
          <input
            style={{
              margin: "0.7em 1em",
              border: `1px solid ${colors.border}`,
              borderRadius: 7,
              padding: "0.5em 0.9em",
              fontSize: "1em",
              width: "calc(100% - 2em)",
              background: "#fafafa",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes"
          />
          <nav
            aria-label="Notes list"
            style={{
              overflowY: "auto",
              flex: 1,
              margin: "0 0.2em",
              paddingBottom: 12,
            }}
          >
            {filteredNotes.length === 0 && (
              <div
                style={{
                  color: colors.disabled,
                  fontSize: "1em",
                  textAlign: "center",
                  padding: "2em 0.5em",
                }}
              >
                No notes found.
              </div>
            )}
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "1em",
              }}
            >
              {filteredNotes.map((note) => (
                <li
                  key={note.id}
                  style={{
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <button
                    onClick={() => handleSelectNote(note.id)}
                    aria-current={note.id === selectedNoteId}
                    className="note-list-item"
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "flex-start",
                      background:
                        note.id === selectedNoteId
                          ? colors.secondary + "15"
                          : "#fff",
                      color:
                        note.id === selectedNoteId
                          ? colors.primary
                          : colors.secondary,
                      border: "none",
                      borderLeft:
                        note.id === selectedNoteId
                          ? `4px solid ${colors.primary}`
                          : "4px solid transparent",
                      borderRadius: "0 6px 6px 0",
                      fontWeight: note.id === selectedNoteId ? 700 : 400,
                      padding: "0.8em 0.6em 0.7em 1em",
                      marginBottom: 3,
                      minHeight: 38,
                      cursor: "pointer",
                      transition: "background 0.14s,color 0.14s,border-color 0.14s",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ flex: "1 1 auto", overflow: "hidden" }}>
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: "1em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: note.id === selectedNoteId ? colors.primary : "#222",
                        }}
                      >
                        {note.title ? note.title : <span style={{ color: colors.disabled }}>[Untitled]</span>}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontWeight: 400,
                          fontSize: "0.9em",
                          opacity: 0.82,
                          color: "#666",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {note.body
                          ? note.body.slice(0, 38) +
                            (note.body.length > 38 ? "..." : "")
                          : ""}
                      </span>
                    </span>
                    <button
                      tabIndex={-1}
                      aria-label="Delete note"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      style={{
                        marginLeft: 10,
                        background: "none",
                        border: "none",
                        color: "#b71c1c",
                        cursor: "pointer",
                        fontSize: "1.2em",
                        opacity: 0.6,
                        transition: "opacity 0.2s",
                      }}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Note editor area */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            background: "#fff",
            padding: "2.5em 2.6em",
            minWidth: 0,
            minHeight: 0,
            boxShadow: "0 0 0 0 #0000",
            transition: "background 0.2s",
          }}
          tabIndex={-1}
        >
          {!selectedNote ? (
            <div
              style={{
                color: colors.disabled,
                fontSize: "1.2em",
                textAlign: "center",
                marginTop: "6em",
              }}
            >
              Select a note to start editing.
            </div>
          ) : (
            <form
              style={{
                maxWidth: 620,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                padding: 0,
                minHeight: "55vh",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onKeyDown={handleKeyDown}
            >
              <label
                htmlFor="note-title"
                style={{
                  fontSize: "1.08em",
                  fontWeight: 600,
                  color: colors.secondary,
                  marginBottom: 5,
                  marginLeft: 1,
                  letterSpacing: "0.01em",
                }}
              >
                Title
              </label>
              <input
                ref={titleInput}
                className="note-title"
                style={{
                  fontWeight: 700,
                  fontSize: "1.21em",
                  marginBottom: 9,
                  border: `1.2px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: "0.65em 0.9em",
                  outline: "none",
                  background: "#fafbfc",
                  color: "#222",
                  transition: "border-color 0.15s",
                }}
                id="note-title"
                aria-label="Note title"
                required
                maxLength={128}
                value={selectedNote.title}
                onChange={(e) => handleUpdateNote("title", e.target.value)}
                placeholder="Untitled note..."
              />
              <label
                htmlFor="note-body"
                style={{
                  fontSize: "1.08em",
                  fontWeight: 600,
                  color: colors.secondary,
                  marginBottom: 5,
                  marginLeft: 1,
                  letterSpacing: "0.01em",
                }}
              >
                Body
              </label>
              <textarea
                className="note-body"
                style={{
                  minHeight: 120,
                  resize: "vertical",
                  marginBottom: 16,
                  border: `1.2px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: "0.7em 0.9em",
                  outline: "none",
                  fontSize: "1em",
                  color: "#222",
                  background: "#fafbfc",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                id="note-body"
                aria-label="Note body"
                value={selectedNote.body}
                onChange={(e) => handleUpdateNote("body", e.target.value)}
                placeholder="Write your note..."
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 3,
                }}
              >
                <button
                  type="submit"
                  style={{
                    background: colors.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "1.2em",
                    padding: "0.45em 1.55em",
                    fontSize: "1em",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 3px #0001",
                    minWidth: 90,
                    transition: "background 0.16s",
                  }}
                  aria-label="Save note"
                  disabled={!selectedNote.title}
                >
                  {selectedNote.edited ? "Save" : "Saved"}
                </button>
                <button
                  type="button"
                  style={{
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: "1.2em",
                    padding: "0.45em 1.4em",
                    fontSize: "1em",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 3px #0001",
                    minWidth: 80,
                    transition: "background 0.18s",
                  }}
                  aria-label="New note"
                  onClick={handleNewNote}
                >
                  New Note
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  style={{
                    color: "#fff",
                    background: "#d32f2f",
                    borderRadius: "1.2em",
                    border: "none",
                    padding: "0.45em 1.4em",
                    fontSize: "1em",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 1px 3px #0001",
                    minWidth: 80,
                  }}
                  aria-label="Delete note"
                >
                  Delete
                </button>
              </div>
              {selectedNote.edited && (
                <div
                  style={{
                    fontSize: "0.93em",
                    color: colors.accent,
                    marginTop: 12,
                  }}
                  aria-live="polite"
                >
                  Unsaved changes (Ctrl+Enter to save)
                </div>
              )}
            </form>
          )}
        </main>
      </div>
      {/* App Footer */}
      <footer
        style={{
          fontSize: "1em",
          color: colors.secondary,
          background: "#f9f9f9",
          textAlign: "center",
          padding: "1.1em 2em 0.8em 2em",
          borderTop: `1px solid ${colors.border}`,
          opacity: 0.9,
        }}
      >
        <span style={{ color: colors.accent, fontWeight: 600 }}>
          Noted
        </span>{" "}
        | powered by React | <a href="https://aakarshna.co/noted" style={{color:colors.primary}} target="_blank" rel="noopener noreferrer">Design: aakarshna</a>
      </footer>
    </div>
  );
}

export default App;
