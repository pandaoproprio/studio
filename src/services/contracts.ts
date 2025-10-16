// src/services/contracts.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, type DocumentData, type QueryDocumentSnapshot, setDoc, getDoc } from 'firebase/firestore';

export type ContractStatus = "Ativo" | "Expirado" | "Em Renovação" | "Rascunho";

export interface Contract {
  id: string;
  title: string;
  type: string;
  project: string;
  value: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  fullText?: string;
}

export type NewContractData = Omit<Contract, 'id' | 'status'>;

const initialContracts: Contract[] = [
    {
      id: "CTR-001",
      title: "Contrato de Prestação de Serviços - Soluções Tech",
      type: "Fornecedor",
      project: "Desenvolvimento do Website",
      value: "R$ 25.000,00",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      status: "Ativo",
      fullText: "Este contrato descreve os serviços de desenvolvimento a serem prestados pela Soluções Tech, incluindo prazos, pagamentos e escopo. O prazo final para a entrega do projeto é 01/08/2024."
    },
    {
      id: "CTR-002",
      title: "Acordo de Parceria - Empresa Parceira S.A.",
      type: "Parceria",
      project: "Projeto Social Comunitário",
      value: "N/A",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      status: "Ativo",
      fullText: "Acordo de parceria estratégica para colaboração no Projeto Social Comunitário, válido por um ano."
    },
    {
      id: "CTR-003",
      title: "Termo de Doação - Fundação XYZ",
      type: "Financiamento",
      project: "Campanha de Marketing Digital",
      value: "R$ 50.000,00",
      startDate: "2024-06-01",
      endDate: "2024-12-31",
      status: "Ativo",
      fullText: "Termo de doação da Fundação XYZ no valor de R$ 50.000 para financiar a campanha de marketing. O período de execução vai até o final do ano."
    },
    {
      id: "CTR-004",
      title: "Contrato de Aluguel - Sede",
      type: "Infraestrutura",
      project: "N/A",
      value: "R$ 5.000,00 / mês",
      startDate: "2023-01-01",
      endDate: "2024-09-30", // Data próxima do vencimento para teste da IA
      status: "Em Renovação",
      fullText: "Contrato de locação do imóvel da sede. O contrato vence em 30/09/2024 e necessita de renovação."
    },
    {
      id: "CTR-005",
      title: "Contrato de Catering - Sabor & Cia",
      type: "Fornecedor",
      project: "Evento Beneficente Anual",
      value: "R$ 8.000,00",
      startDate: "2023-05-10",
      endDate: "2023-07-10",
      status: "Expirado",
      fullText: "Contrato para fornecimento de alimentos e bebidas no evento beneficente. O contrato já expirou."
    },
];

export function fromFirestore(doc: QueryDocumentSnapshot<DocumentData> | DocumentData): Contract {
    const data = doc.data()!;
    return {
        id: doc.id,
        title: data.title,
        type: data.type,
        project: data.project,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        fullText: data.fullText,
    };
}

export async function getContracts(): Promise<Contract[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'contracts'));
    if (querySnapshot.empty) {
        console.warn('No contracts found in Firestore. Seeding initial data for demonstration.');
        await seedInitialContracts();
        const seededSnapshot = await getDocs(collection(db, 'contracts'));
        return seededSnapshot.docs.map(fromFirestore);
    }
    return querySnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching contracts, will return fallback data:", error);
    // As a fallback in case of firestore error, we can return the local data
    return initialContracts;
  }
}

export async function addContract(contractData: NewContractData): Promise<Contract> {
    try {
        const id = `CTR-${Date.now()}`;
        const submissionData = {
            ...contractData,
            status: 'Rascunho' as const,
        };
        await setDoc(doc(db, 'contracts', id), submissionData);
        return { id, ...submissionData };
    } catch (error) {
        console.error("Error adding contract:", error);
        throw new Error("Não foi possível adicionar o contrato.");
    }
}

// --- Seeding function for demonstration purposes ---
async function seedInitialContracts() {
    console.log("Attempting to seed initial contracts...");
    const batch = writeBatch(db);
    
    for (const contract of initialContracts) {
        const docRef = doc(db, "contracts", contract.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
             const { id, ...data } = contract;
             batch.set(docRef, data);
        }
    }

    try {
        await batch.commit();
        console.log("Initial contract data seeding process completed.");
    } catch (error) {
        console.error("Error seeding contract data:", error);
    }
}