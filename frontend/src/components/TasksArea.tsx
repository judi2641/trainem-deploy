import { useState, type ChangeEvent } from "react";
import { type TaskToCreate } from "../../../shared/types/Task";
import { cn } from "@/lib/utils";
const WEEKDAY_OPTIONS = [
  { value: "Monday", label: "Montag" },
  { value: "Tuesday", label: "Dienstag" },
  { value: "Wednesday", label: "Mittwoch" },
  { value: "Thursday", label: "Donnerstag" },
  { value: "Friday", label: "Freitag" },
  { value: "Saturday", label: "Samstag" },
  { value: "Sunday", label: "Sonntag" },
];
type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export default function TasksArea() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Monday");
  const [user_id, setUserID] = useState("");
  const [day, setDay] = useState<Weekday | "">("");
  const [name, setName] = useState("");

  // funktion um tasks zu bekommen
/*   const getTasks = async (userId:string) =>{
    const res = await fetch(`http://localhost:3000/api/tasks/${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
        credentials: "include",
        });
        if (!res.ok) throw new Error(`GET /tasks failed: ${res.status}`);
        return res.json() as Promise<Array<{ _id:string; name:string; day:string; user_id:string }>>;
    } */
    
  // tasks speicher funktion
  const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task: Partial<TaskToCreate> = {
      user_id: user_id,
      day: day === "" ? undefined : day,
      name: name,
    };

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        console.log("Task erfolgreich erstellt!");
        setIsModalOpen(false);
        setUserID("");
        setName("");
        setDay("");
      } else {
        console.error("Fehler beim Erstellen der Task");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
    }
  };
  return (
    <div className="h-full w-full bg-white shadow-md p-6 rounded-xl  ">
      <div
        className="flex relative rounded-xl w-full shadow-md bg-primary/50 h-full "
        id="tasksAnzeige p-6"
      >
        <div className="w-full">
          <div className="">
            <nav className="flex gap-2" aria-label="Weekday navigation">
              {WEEKDAY_OPTIONS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setActiveTab(day.value)}
                  className={cn(
                    "flex-auto m-2 rounded-xl py-2 text-sm font-medium transition-colors border-2 -mb-px",
                    activeTab === day.value
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary"
                  )}
                  aria-current={activeTab === day.value ? "page" : undefined}>
                  {day.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {WEEKDAY_OPTIONS.map((day) => (
              <div
                key={day.value}
                className={cn(activeTab === day.value ? "block" : "hidden")}
                role="tabpanel"
                aria-labelledby={day.value}
              >
                <h2 className="text-2xl font-semibold mb-4">{day.label}</h2>
                <div className="bg-primary/75 w-full h-15 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
        <div id="createTask" >
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-5 right-5 rounded-xl h-15 w-30 bg-primary hover:bg-primary/50"
          >
            + create Task
          </button>

          {/* --- Das Modal (Popup) --- */}
          {/* Es wird nur angezeigt, wenn isModalOpen true ist */}
          {isModalOpen && (
            <div
              className="fixed top-0 left-0 w-full h-screen 
                        bg-black/50 
                        flex justify-center items-center z-1000"
            >
              <div
                className="bg-white p-6 rounded-xl shadow-lg 
                            w-[90%] max-w-lg z-1001"
              >
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
                    <label
                      htmlFor="day-select"
                      className="block mb-2 font-medium"
                    >
                      Tag:
                    </label>
                    <select
                      id="day-select"
                      value={day}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setDay(e.target.value as Weekday | "")
                      }
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="" disabled>
                        Bitte einen Tag auswählen...
                      </option>
                      {WEEKDAY_OPTIONS.map((dayOption) => (
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
    </div>
  );
}
