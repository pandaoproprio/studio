// src/services/hr.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

export interface Leave {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  description: string;
  status: 'Ativo' | 'Férias' | 'Licença';
  vacation: string;
  documents: Document[];
  leaves: Leave[];
}

function fromFirestore(doc: QueryDocumentSnapshot<DocumentData> | DocumentData): Employee {
    const data = doc.data()!;
    return {
        id: doc.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role,
        description: data.description,
        status: data.status,
        vacation: data.vacation,
        documents: data.documents || [],
        leaves: data.leaves || [],
    };
}


export async function getEmployees(): Promise<Employee[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    if (querySnapshot.empty) {
        console.warn('No employees found in Firestore. Seeding initial data for demonstration.');
        await seedInitialData();
        const seededSnapshot = await getDocs(collection(db, 'employees'));
        return seededSnapshot.docs.map(fromFirestore);
    }
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
    try {
        const docRef = doc(db, 'employees', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return fromFirestore(docSnap);
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching employee by ID:", error);
        return null;
    }
}


// --- Seeding function for demonstration purposes ---
import { writeBatch } from 'firebase/firestore';

async function seedInitialData() {
    const initialEmployees = [
      {
        id: "emp-001",
        name: "Carlos Andrade",
        email: "carlos.andrade@example.com",
        avatar: "https://placehold.co/100x100.png",
        role: "Gerente de Projetos",
        description: "Responsável pelo planejamento e execução dos projetos sociais, liderando equipes multidisciplinares e garantindo a entrega dos objetivos dentro do prazo e orçamento.",
        status: "Ativo",
        vacation: "15/01/2025 - 30/01/2025",
        documents: [
          { id: "doc-1", name: "Curriculum Vitae.pdf", type: "Currículo", size: "2.5MB", uploadDate: "10/01/2023" },
          { id: "doc-2", name: "Contrato de Trabalho.pdf", type: "Contratual", size: "1.2MB", uploadDate: "15/01/2023" },
        ],
        leaves: [
          { id: "leave-1", type: "Férias", startDate: "15/01/2024", endDate: "30/01/2024", status: "Aprovado" },
        ]
      },
      {
        id: "emp-002",
        name: "Beatriz Costa",
        email: "beatriz.costa@example.com",
        avatar: "https://placehold.co/100x100.png",
        role: "Coordenadora de Voluntários",
        description: "Engaja, recruta e coordena a base de voluntários da organização, garantindo seu bem-estar, treinamento e alocação eficaz nos projetos.",
        status: "Ativo",
        vacation: "N/A",
        documents: [
            { id: "doc-3", name: "CV_Beatriz_Costa.pdf", type: "Currículo", size: "800KB", uploadDate: "05/03/2023" },
        ],
        leaves: []
      },
      {
        id: "emp-003",
        name: "Mariana Ferreira",
        email: "mariana.ferreira@example.com",
        avatar: "https://placehold.co/100x100.png",
        role: "Assistente Social",
        description: "Atua na linha de frente, prestando suporte direto aos beneficiários dos projetos e suas famílias, realizando acompanhamento e encaminhamentos.",
        status: "Licença",
        vacation: "N/A",
        documents: [],
        leaves: [
            { id: "leave-2", type: "Licença Médica", startDate: "01/06/2024", endDate: "30/08/2024", status: "Aprovado" },
        ]
      },
      {
        id: "emp-004",
        name: "Ricardo Souza",
        email: "ricardo.souza@example.com",
        avatar: "https://placehold.co/100x100.png",
        role: "Analista Financeiro",
        description: "Cuida da saúde financeira da organização, incluindo orçamentos, relatórios de prestação de contas, controle de fluxo de caixa e conformidade fiscal.",
        status: "Ativo",
        vacation: "01/03/2025 - 15/03/2025",
        documents: [],
        leaves: []
      },
      {
        id: "emp-005",
        name: "Fernanda Lima",
        email: "fernanda.lima@example.com",
        avatar: "https://placehold.co/100x100.png",
        role: "Psicóloga",
        description: "Oferece suporte psicossocial para a equipe interna e para os beneficiários dos programas, conduzindo sessões e desenvolvendo programas de bem-estar.",
        status: "Férias",
        vacation: "20/12/2024 - 10/01/2025",
        documents: [],
        leaves: [
             { id: "leave-3", type: "Férias", startDate: "20/12/2024", endDate: "10/01/2025", status: "Agendado" },
        ]
      },
    ];

    const batch = writeBatch(db);
    initialEmployees.forEach((employee) => {
        const docRef = doc(db, "employees", employee.id);
        const { id, ...data } = employee;
        batch.set(docRef, data);
    });

    await batch.commit();
    console.log("Initial employee data seeded to Firestore.");
}
