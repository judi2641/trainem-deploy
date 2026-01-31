import config from "config";
import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { ExerciseModel } from "../endpoints/exercises/ExerciseModel";

let _db: mongoose.Connection | null = null;

const connectionString: string = config.get("db.connectionString");

async function createExercises() {
  const exercises = [
    {
      name: "Kniebeugen (Squats)",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Stärkt Beine & Po. Füße schulterbreit, Po nach hinten, runter bis Oberschenkel etwa parallel, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=Hvzc-yEquAo",
      imageUrl: "",
    },
    {
      name: "Ausfallschritte (Lunges)",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Beine, Po, Balance. Großer Schritt nach vorn, hinteres Knie Richtung Boden, vorderes Knie über Fuß, zurück.",
      videoUrl: "https://www.youtube.com/watch?v=Vkqv4bJcm8o",
      imageUrl: "",
    },
    {
      name: "Jump Squats",
      type: "cardio",
      primaryMuscleGroups: ["legs", "glutes", "cardio"],
      executionInstructions:
        "Explosive Kraft & Cardio. Kniebeuge → explosiv springen, weich landen, direkt nächste Wiederholung.",
      videoUrl: "https://www.youtube.com/watch?v=BRfxI2Es2lE",
      imageUrl: "",
    },
    {
      name: "Sumo Squats",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Innenschenkel & Po. Breiter Stand, Zehen leicht nach außen, tief gehen, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=sqDGkIBYPAk",
      imageUrl: "",
    },
    {
      name: "Wandsitz (Wall Sit)",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Oberschenkel-Burn. Rücken an Wand, Knie 90°, halten, Bauch angespannt.",
      videoUrl: "https://www.youtube.com/watch?v=cWTZ8Am1Ee0",
      imageUrl: "",
    },
    {
      name: "Step-Ups",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Bein- & Po-Kraft. Auf stabile Erhöhung steigen, komplett hochdrücken, langsam absteigen.",
      videoUrl: "https://www.youtube.com/watch?v=9ZknEYboBOQ",
      imageUrl: "",
    },
    {
      name: "Glute Bridge (Beckenheben)",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Po aktivieren. Rückenlage, Füße nah am Po, Hüfte hochdrücken, oben kurz halten.",
      videoUrl: "https://www.youtube.com/watch?v=msfdrPWJ-9o",
      imageUrl: "",
    },
    {
      name: "Einbeinige Glute Bridge",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Po intensiver + Stabilität. Ein Bein strecken, Hüfte hoch, kontrolliert runter.",
      videoUrl: "https://www.youtube.com/watch?v=AVAXhy6pl7o",
      imageUrl: "",
    },
    {
      name: "Seitliche Ausfallschritte",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Innenschenkel & Po. Seitlich Schritt, Hüfte nach hinten, tief gehen, zurück.",
      videoUrl: "https://www.youtube.com/watch?v=xknfLSLSBnA",
      imageUrl: "",
    },
    {
      name: "Wadenheben (Calf Raises)",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Wadenmuskeln. Auf Zehenspitzen hochdrücken, kurz halten, langsam senken.",
      videoUrl: "https://www.youtube.com/watch?v=ZL-IhG4boDs",
      imageUrl: "",
    },
    {
      name: "Hip Thrust",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Po-Kraft. Schultern auf Bank, Füße am Boden, Hüfte hochdrücken bis Oberkörper & Oberschenkel gerade Linie.",
      videoUrl: "https://www.youtube.com/watch?v=LM8XHLYJoYs",
      imageUrl: "",
    },
    {
      name: "Bulgarian Split Squats",
      type: "strength",
      primaryMuscleGroups: ["legs", "glutes"],
      executionInstructions:
        "Intensiver Bein-/Po-Builder. Hinterer Fuß auf Erhöhung, langsam runter, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
      imageUrl: "",
    },
    {
      name: "Side Plank",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Seitlicher Core. Unterarm am Boden, Körper gerade, Hüfte oben halten.",
      videoUrl: "https://www.youtube.com/watch?v=K2VljzCC16g",
      imageUrl: "",
    },
    {
      name: "Plank",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Core Stabilität. Unterarme am Boden, Körper wie Brett, Bauch fest, nicht durchhängen.",
      videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      imageUrl: "",
    },
    {
      name: "Crunches",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Bauch gerade. Rückenlage, Hände an Kopf/Brust, Oberkörper leicht anheben, kontrolliert runter.",
      videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
      imageUrl: "",
    },
    {
      name: "Russian Twists",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Schräge Bauchmuskeln. Sitz, Oberkörper leicht zurück, von Seite zu Seite drehen.",
      videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
      imageUrl: "",
    },
    {
      name: "Leg Raises",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Unterer Bauch. Rückenlage, Beine gestreckt hoch und langsam runter, nicht ins Hohlkreuz.",
      videoUrl: "https://www.youtube.com/watch?v=JB2oyawG9KI",
      imageUrl: "",
    },
    {
      name: "Bicycle Crunches",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Core komplett. Ellenbogen zum gegenüberliegenden Knie, wechselnd wie Radfahren.",
      videoUrl: "https://www.youtube.com/watch?v=9FGilxCbdz8",
      imageUrl: "",
    },
    {
      name: "Mountain Climbers",
      type: "cardio",
      primaryMuscleGroups: ["core", "full body", "cardio"],
      executionInstructions:
        "Core + Cardio. Plank-Position, Knie abwechselnd schnell zur Brust ziehen.",
      videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
      imageUrl: "",
    },
    {
      name: "Dead Bug",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Core-Kontrolle. Rückenlage, Arme/Beine hoch, diagonal Arm + Bein strecken, zurück, wechseln.",
      videoUrl: "https://www.youtube.com/watch?v=4XLEnwUr1d8",
      imageUrl: "",
    },
    {
      name: "Superman",
      type: "strength",
      primaryMuscleGroups: ["core"],
      executionInstructions:
        "Rückenstrecker. Bauchlage, Arme/Beine anheben, kurz halten, kontrolliert senken.",
      videoUrl: "https://www.youtube.com/watch?v=z6PJMT2y8GQ",
      imageUrl: "",
    },
    {
      name: "Liegestütze (Push-Ups)",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Brust/Trizeps/Schulter. Hände unter Schulter, Körper gerade, runter bis Brust nah Boden, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      imageUrl: "",
    },
    {
      name: "Knie-Liegestütze",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Leichtere Push-Up Variante. Knie am Boden, gleiche Bewegung, Rumpf stabil.",
      videoUrl: "https://www.youtube.com/watch?v=wfT4vSv9wLE",
      imageUrl: "",
    },
    {
      name: "Dips (an Stuhl)",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Trizeps/Brust. Hände an Stuhl, Beine nach vorn, Ellenbogen beugen, runter, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=0326dy_-CzM",
      imageUrl: "",
    },
    {
      name: "Pike Push-Ups",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Schulter Fokus. Hüfte hoch wie V, Kopf Richtung Boden, hochdrücken.",
      videoUrl: "https://www.youtube.com/watch?v=srprqb9sKzg",
      imageUrl: "",
    },
    {
      name: "Diamond Push-Ups",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Trizeps intensiv. Hände eng in Diamant-Form, runter, hoch.",
      videoUrl: "https://www.youtube.com/watch?v=J0DnG1_S92I",
      imageUrl: "",
    },
    {
      name: "Schulterdrücken (Dumbbell Press)",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Schultern. Hanteln auf Schulterhöhe, über Kopf drücken, kontrolliert senken.",
      videoUrl: "https://www.youtube.com/watch?v=qEwKCR5JCog",
      imageUrl: "",
    },
    {
      name: "Front Raises",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Vordere Schulter. Hanteln vor Körper anheben bis Schulterhöhe, langsam senken.",
      videoUrl: "https://www.youtube.com/watch?v=-t7fuZ0KhDA",
      imageUrl: "",
    },
    {
      name: "Seitheben (Lateral Raises)",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Seitliche Schulter. Hanteln seitlich anheben bis Schulterhöhe, langsam runter.",
      videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
      imageUrl: "",
    },
    {
      name: "Trizeps Kickbacks",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Trizeps isoliert. Oberkörper leicht vor, Arm strecken nach hinten, kontrolliert zurück.",
      videoUrl: "https://www.youtube.com/watch?v=6SSwq6GQ4C0",
      imageUrl: "",
    },
    {
      name: "Close-Grip Push-Ups",
      type: "strength",
      primaryMuscleGroups: ["chest", "shoulders", "triceps"],
      executionInstructions:
        "Trizeps/Brust. Hände enger als Schulterbreit, runter, hoch.",
      videoUrl: "https://www.youtube.com/watch?v=ZQw3kYdV7HI",
      imageUrl: "",
    },
    {
      name: "Rudern (Dumbbell Row)",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Rücken/Bizeps. Oberkörper leicht vor, Hantel zum Körper ziehen, Schulterblatt aktivieren.",
      videoUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo",
      imageUrl: "",
    },
    {
      name: "Reverse Flys",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Hintere Schulter/Rücken. Oberkörper vor, Arme seitlich öffnen, Schulterblätter zusammen.",
      videoUrl: "https://www.youtube.com/watch?v=6wI1omE3B8w",
      imageUrl: "",
    },
    {
      name: "Superman Pull",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Rücken + Schulterblatt. Superman halten und Arme nach hinten ziehen (wie Rudern).",
      videoUrl: "https://www.youtube.com/watch?v=KJ2eZB7m2co",
      imageUrl: "",
    },
    {
      name: "Bizepscurls",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Bizeps. Hanteln nach oben curlen, Ellenbogen am Körper, langsam ablassen.",
      videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
      imageUrl: "",
    },
    {
      name: "Hammer Curls",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Bizeps/Unterarm. Neutraler Griff, curl hoch, kontrolliert runter.",
      videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
      imageUrl: "",
    },
    {
      name: "Pull-Ups (Klimmzüge)",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Rücken/Bizeps. Am Holm hängen, Kinn über Stange ziehen, langsam runter.",
      videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
      imageUrl: "",
    },
    {
      name: "Inverted Rows",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Rücken. Unter Tisch/Stange hängen, Brust zur Stange ziehen, kontrolliert ablassen.",
      videoUrl: "https://www.youtube.com/watch?v=9J6_bKjKXo8",
      imageUrl: "",
    },
    {
      name: "Face Pulls (mit Band)",
      type: "strength",
      primaryMuscleGroups: ["back", "biceps"],
      executionInstructions:
        "Schultern/Rücken. Band auf Gesichtshöhe ziehen, Ellenbogen hoch, Schulterblätter zusammen.",
      videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
      imageUrl: "",
    },
    {
      name: "Jumping Jacks",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Puls hoch, Ganzkörper. Beine springen auseinander, Arme hoch, zurück.",
      videoUrl: "https://www.youtube.com/watch?v=c4DAnQ6DtF8",
      imageUrl: "",
    },
    {
      name: "High Knees",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Puls + Beine. Auf der Stelle schnell Knie hochziehen, Arme mitnehmen.",
      videoUrl: "https://www.youtube.com/watch?v=OAJ_J3EZkdY",
      imageUrl: "",
    },
    {
      name: "Burpees",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Ganzkörper Cardio. Squat → Hände Boden → Beine zurück (Plank) → optional Push-Up → zurück → Sprung hoch.",
      videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
      imageUrl: "",
    },
    {
      name: "Butt Kicks",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Cardio. Fersen schnell Richtung Po kicken, Tempo halten.",
      videoUrl: "https://www.youtube.com/watch?v=OAJ_J3EZkdY",
      imageUrl: "",
    },
    {
      name: "Jump Rope (ohne Seil)",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Springseil-Bewegung ohne Seil. Kleine Sprünge, Arme rotieren, Rhythmus halten.",
      videoUrl: "https://www.youtube.com/watch?v=1BZMwT4qYTw",
      imageUrl: "",
    },
    {
      name: "Box Jumps",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Explosiv + Cardio. Auf stabile Box springen, weich landen, runtersteigen.",
      videoUrl: "https://www.youtube.com/watch?v=52r_Ul5k03g",
      imageUrl: "",
    },
    {
      name: "Skippings",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Locker Cardio. Kleine Sprünge wie Seilspringen, schneller Wechsel.",
      videoUrl: "https://www.youtube.com/watch?v=AJf9U7qKf9k",
      imageUrl: "",
    },
    {
      name: "Kniehebelauf (Sprint auf der Stelle)",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Schnell + intensiv. Wie High Knees, aber sprintartig, Arme aktiv.",
      videoUrl: "https://www.youtube.com/watch?v=8opcQdC-V-U",
      imageUrl: "",
    },
    {
      name: "Bear Crawls",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Ganzkörper. Vierfüßler, Knie knapp über Boden, vorwärts krabbeln, Rücken stabil.",
      videoUrl: "https://www.youtube.com/watch?v=76bWnpVv2JY",
      imageUrl: "",
    },
    {
      name: "Skater Jumps",
      type: "cardio",
      primaryMuscleGroups: ["full body", "cardio"],
      executionInstructions:
        "Seitliche Power & Cardio. Seitlich springen wie Schlittschuhlauf, Landung stabil.",
      videoUrl: "https://www.youtube.com/watch?v=Xz27DudBfSs",
      imageUrl: "",
    },
  ];


  try {
    await ExerciseModel.insertMany(exercises);
    console.log('10 Exercises wurden erfolgreich erstellt.');
  } catch (error) {
    console.error('Fehler beim Erstellen der Exercises:', error);
  }
}




export async function initDB() {
    if(_db) return;

    try{
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 3000,
        });
        _db = mongoose.connection;
        logger.info("database connected");
        await ExerciseModel.deleteMany({});
        await createExercises();
    }
    catch(error){    
        logger.error("connection to database failed:", error);    
        throw error;    
    }
}