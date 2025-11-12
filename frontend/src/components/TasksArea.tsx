import { useState, type ChangeEvent} from 'react'; 
import {type TaskToCreate} from '../../../shared/types/Task'
const WEEKDAY_OPTIONS = [
    { value: "Monday",    label: "Montag" },
    { value: "Tuesday",   label: "Dienstag" },
    { value: "Wednesday", label: "Mittwoch" },
    { value: "Thursday",  label: "Donnerstag" },
    { value: "Friday",    label: "Freitag" },
    { value: "Saturday",  label: "Samstag" },
    { value: "Sunday",    label: "Sonntag" }
];
type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export default function TasksArea(){
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    
    const [user_id, setUserID] = useState("");
    const [day, setDay] = useState<Weekday | "">("");
    const [name, setName] = useState("");
    
    

    // speicher funktion
    const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const task: Partial<TaskToCreate> = {
            user_id: user_id,
            day: day === "" ? undefined : day,
            name: name
        }

        try {
            

            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task), 
            });

            if (response.ok) {
                console.log('Task erfolgreich erstellt!');
                setIsModalOpen(false); 
                setUserID("");
                setName("");
                setDay("");
                
                
            } else {
                console.error('Fehler beim Erstellen der Task');
            }
        } catch (error) {
            console.error('Netzwerkfehler:', error);
        }
    };
    return (
        <div className="h-full w-full bg-white shadow-md p-6 rounded-xl flex ">
            <div id='tasksAnzeige'>

            </div>
            <div id='createTask'>
                <button
                onClick={() => setIsModalOpen(true)} 
                className="rounded-xl h-15 w-30 bg-primary hover:bg-primary/50">
                + create Task
            </button>

            {/* --- Das Modal (Popup) --- */}
            {/* Es wird nur angezeigt, wenn isModalOpen true ist */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-screen 
                        bg-black/50 
                        flex justify-center items-center z-1000">
                    <div className="bg-white p-6 rounded-xl shadow-lg 
                            w-[90%] max-w-lg z-1001"> 
                        <h2 className="text-xl font-bold mb-4">Neue Task erstellen</h2>

                        {/* Formular-Felder */}
                        <form className="flex flex-col gap-4" onSubmit={handleSaveTask}>
                            <input
                                type="text"
                                name="user_id" 
                                placeholder="user_id"
                                onChange={(e) => setUserID(e.target.value.trim())}
                                
                                className="border p-2 rounded"
                            />
                            <div>
                                <label htmlFor="day-select" className="block mb-2 font-medium">Tag:</label>
                                <select
                                    id="day-select"
                                    value={day} 
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setDay(e.target.value as Weekday | "")}
                                    className="border p-2 rounded w-full"
                                    required 
                                >
                                    <option value="" disabled>Bitte einen Tag auswählen...</option>
                                    {WEEKDAY_OPTIONS.map(dayOption => (
                                        <option key={dayOption.value} value={dayOption.value}>
                                            {dayOption.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="text"
                                name="name" 
                                placeholder="Name der Task"
                                onChange={(e) => setName(e.target.value.trim())}
                                
                                className="border p-2 rounded"
                            />

                        

                        {/* Buttons im Modal */}
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit" 
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/50"
                            >
                                Speichern
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            )}

            </div>
        </div>
    );
}