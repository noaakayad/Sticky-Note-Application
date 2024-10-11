import './App.css';
import { Label, Note } from "./types"; 
import { dummyNotesList } from "./constants"; 
import { useState, useContext, useEffect } from 'react';
import ClickCounter from "./hooksExercise"
import { ThemeContext, themes } from "./ThemeContext";


function App() {
 
  const [likes, setLikes] = useState<number[]>([]);

  const addRemoveLike = (id: number) => {

    if(likes.includes(id)) {
      setLikes(likes.filter(LikeId => LikeId !== id));
    }
    else{
      setLikes([...likes, id]);
    }
  };

  const [currentTheme, setCurrentTheme] = useState(themes.light);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === themes.light ? themes.dark : themes.light);
  };


 const [notes, setNotes] = useState(dummyNotesList); 

 const initialNote = {
   id: -1,
   title: "",
   content: "",
   label: Label.other,
 };
 const [createNote, setCreateNote] = useState(initialNote);


 const createNoteHandler = (event : React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const newNote = {
    ...createNote, id: Math.max(...notes.map(note => note.id)) + 1, 
  };

  setNotes([...notes, newNote]); 
  setCreateNote(initialNote); 
 };

 const deleteNote = (note : Note) => {
  setNotes(notes.filter(noteSup => noteSup.id !== note.id));
 };

 const theme = useContext(ThemeContext); 
 return (
  <ThemeContext.Provider value={currentTheme}>
    <button onClick={() => toggleTheme()}> Toggle Theme </button>
    <div className='app-container' style={{
         background: currentTheme.background,
         color: currentTheme.foreground,
         padding: "20px",
       }}>

       <form className="note-form" onSubmit={createNoteHandler}>
         <div><input placeholder="Note Title"
         value = {createNote.title}
         onChange={(event) =>
         setCreateNote({ ...createNote, title: event.target.value })}
         required>
         </input></div>

         <div><textarea
         value={createNote.content}
         onChange={(event) =>
         setCreateNote({ ...createNote, content: event.target.value })}
         required>
         </textarea></div>

         <div>
          <select
            value={createNote.label}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              const value = event.target.value as Label; 
              setCreateNote({ ...createNote, label: value });
            }}
            required>
            <option value={Label.personal}>Personal</option>
            <option value={Label.study}>Study</option>
            <option value={Label.work}>Work</option>
            <option value={Label.other}>Other</option>
          </select>
         </div>

          <div><button type="submit">Create Note</button></div>
        </form>

       <div className="notes-grid">
          {notes.map((note) => (
          <div
             key={note.id}
             className="note-item"
             style={{ background: currentTheme.background, color: currentTheme.foreground }}>
             <div className="notes-header">
               <button onClick={() => addRemoveLike(note.id)}>
                {likes.includes(note.id) ? '❤️' : '♡'}
             </button>
             <button onClick={() => deleteNote(note)}>x</button>
             </div>
             <h2 contentEditable="true"> {note.title}</h2>
             <p contentEditable="true"> {note.content} </p>
             <select
                value={note.label}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  const newLabel = event.target.value as Label;
                  const updatedNotes = notes.map(n => {
                    if (n.id === note.id) {
                      return {...n, label : newLabel};
                    }
                    else {
                      return n;
                    }
                  });
                  setNotes(updatedNotes);
                }}
              >
                <option value={Label.personal}>Personal</option>
                <option value={Label.study}>Study</option>
                <option value={Label.work}>Work</option>
                <option value={Label.other}>Other</option>
              </select>
          </div>
          ))}
       </div>

       <div>
        <h2>List of favorites:</h2>
        {notes.map((note)=> (
          likes.includes(note.id) ? <h4 key = {note.id}>{note.title}</h4> : null
        ))}
       </div>

    </div>
  </ThemeContext.Provider>

 );
}

export default App;




