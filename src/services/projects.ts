
// src/services/projects.ts
import { getDb, ensurePersistence } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, type DocumentData, type QueryDocumentSnapshot, getDoc, writeBatch } from 'firebase/firestore';

export interface TeamMember {
  role: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  category: 'Institucional' | 'Social';
  subcategory?: 'CEAP' | 'Parceiros' | 'Outros';
  budget?: number;
  startDate?: string;
  endDate?: string;
  team?: TeamMember[];
}

export type NewProjectData = Omit<Project, 'id' | 'status' | 'progress'>;


const initialProjects: Project[] = [
    {
        id: "proj-1",
        name: "Projeto Social Comunitário",
        description: "Iniciativa para capacitação de jovens em tecnologia e habilidades para o mercado de trabalho.",
        status: "Em Andamento",
        progress: 75,
        category: 'Social',
        subcategory: 'CEAP',
        budget: 25000,
        startDate: '2024-02-01',
        endDate: '2024-08-01',
        team: [
            { role: "Product Owner", name: "Ana Pereira" },
            { role: "Scrum Master", name: "Marcos Viana" },
            { role: "Time de Desenvolvimento", name: "Equipe Interna" },
        ]
    },
    {
        id: "proj-2",
        name: "Campanha de Marketing Digital",
        description: "Campanha para arrecadação de fundos e divulgação da marca da organização.",
        status: "Em Andamento",
        progress: 40,
        category: 'Institucional',
        budget: 10000,
        startDate: '2024-06-01',
        endDate: '2024-09-01',
        team: [
             { role: "Product Owner", name: "Joana Silva" },
        ]
    },
    {
        id: "proj-3",
        name: "Desenvolvimento do Website",
        description: "Criação do novo portal institucional com foco em usabilidade e doações.",
        status: "Aguardando Revisão",
        progress: 90,
        category: 'Institucional',
        budget: 15000,
        startDate: '2024-03-01',
        endDate: '2024-07-30',
        team: []
    },
    {
        id: "proj-4",
        name: "Evento Beneficente Anual",
        description: "Organização da festa julina para arrecadação de fundos e engajamento da comunidade.",
        status: "Planejamento",
        progress: 15,
        category: 'Social',
        subcategory: 'Parceiros',
        budget: 5000,
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        team: []
    }
];

function fromFirestore(doc: QueryDocumentSnapshot<DocumentData> | DocumentData): Project {
    const data = doc.data()!;
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status,
        progress: data.progress,
        category: data.category,
        subcategory: data.subcategory,
        budget: data.budget,
        startDate: data.startDate,
        endDate: data.endDate,
        team: data.team || [],
    };
}

export async function getProjects(): Promise<Project[]> {
  await ensurePersistence();
  const db = getDb();
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    if (querySnapshot.empty) {
        console.warn('No projects found in Firestore. Seeding initial data for demonstration.');
        await seedInitialProjects();
        const seededSnapshot = await getDocs(collection(db, 'projects'));
        return seededSnapshot.docs.map(fromFirestore);
    }
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching projects, will return fallback data:", error);
    // As a fallback in case of firestore error, we can return the local data
    return initialProjects;
  }
}

export async function addProject(projectData: NewProjectData): Promise<Project> {
    await ensurePersistence();
    const db = getDb();
    try {
        const newProject = {
            ...projectData,
            status: 'Planejamento',
            progress: 0,
            team: projectData.team || [],
        };
        const docRef = await addDoc(collection(db, 'projects'), newProject);
        return { id: docRef.id, ...newProject };
    } catch (error) {
        console.error("Error adding project:", error);
        throw new Error("Não foi possível adicionar o projeto.");
    }
}


// --- Seeding function for demonstration purposes ---
async function seedInitialProjects() {
    console.log("Attempting to seed initial projects...");
    await ensurePersistence();
    const db = getDb();
    const batch = writeBatch(db);
    
    for (const project of initialProjects) {
        const docRef = doc(db, "projects", project.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
             const { id, ...data } = project;
             batch.set(docRef, data);
        }
    }

    try {
        await batch.commit();
        console.log("Initial project data seeding process completed.");
    } catch (error) {
        console.error("Error seeding project data:", error);
    }
}
