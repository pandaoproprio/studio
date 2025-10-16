// src/services/projects.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

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
}

export type NewProjectData = Omit<Project, 'id' | 'status' | 'progress'>;


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
    };
}


export async function getProjects(): Promise<Project[]> {
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
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function addProject(projectData: NewProjectData): Promise<Project> {
    try {
        const newProject = {
            ...projectData,
            status: 'Planejamento',
            progress: 0,
        };
        const docRef = await addDoc(collection(db, 'projects'), newProject);
        return { id: docRef.id, ...newProject };
    } catch (error) {
        console.error("Error adding project:", error);
        throw new Error("Não foi possível adicionar o projeto.");
    }
}


// --- Seeding function for demonstration purposes ---
import { writeBatch } from 'firebase/firestore';

async function seedInitialProjects() {
    const initialProjects: Omit<Project, 'id'>[] = [
        {
            name: "Projeto Social Comunitário",
            description: "Iniciativa para capacitação de jovens em tecnologia e habilidades para o mercado de trabalho.",
            status: "Em Andamento",
            progress: 75,
            category: 'Social',
            subcategory: 'CEAP',
            budget: 25000,
            startDate: '2024-02-01',
            endDate: '2024-08-01',
        },
        {
            name: "Campanha de Marketing Digital",
            description: "Campanha para arrecadação de fundos e divulgação da marca da organização.",
            status: "Em Andamento",
            progress: 40,
            category: 'Institucional',
            budget: 10000,
            startDate: '2024-06-01',
            endDate: '2024-09-01',
        },
        {
            name: "Desenvolvimento do Website",
            description: "Criação do novo portal institucional com foco em usabilidade e doações.",
            status: "Aguardando Revisão",
            progress: 90,
            category: 'Institucional',
            budget: 15000,
            startDate: '2024-03-01',
            endDate: '2024-07-30',
        },
        {
            name: "Evento Beneficente Anual",
            description: "Organização da festa julina para arrecadação de fundos e engajamento da comunidade.",
            status: "Planejamento",
            progress: 15,
            category: 'Social',
            subcategory: 'Parceiros',
            budget: 5000,
            startDate: '2024-07-01',
            endDate: '2024-07-31',
        }
    ];

    const batch = writeBatch(db);
    initialProjects.forEach((project) => {
        const docRef = doc(collection(db, "projects"));
        batch.set(docRef, project);
    });

    await batch.commit();
    console.log("Initial project data seeded to Firestore.");
}
