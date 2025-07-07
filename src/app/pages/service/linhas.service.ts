import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../main';

export interface Linhas {
    id?: string;
    Telefone?: string;
    Nome?: string;
    Chip?: number; 
}

@Injectable()
export class LinhasService {
    private db: Firestore;

    constructor() {
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }

    // 🔍 Busca todos os produtos com ID real do Firestore
    async getProducts(): Promise<Linhas[]> {
        const querySnapshot = await getDocs(collection(this.db, 'linhas'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Linhas));
    }

    // ➕ Adiciona produto (Firebase gera o ID automaticamente)
    async addProduct(product: Linhas): Promise<Linhas> {
        const { Nome, Telefone, Chip } = product; 
        const docRef = await addDoc(collection(this.db, 'linhas'), { Nome, Telefone, Chip });
        return { id: docRef.id, Nome, Telefone, Chip }; 
    }
    

    // ✏️ Atualiza produto existente com base no ID
    async updateProduct(product: Linhas): Promise<void> {
        const { id, Chip, ...productData } = product; 
        const productDoc = doc(this.db, 'linhas', id!);
        await updateDoc(productDoc, { ...productData, Chip }); 
    }

    // ❌ Exclui produto com base no ID
    async deleteProduct(id: string): Promise<void> {
        const productDoc = doc(this.db, 'linhas', id);
        await deleteDoc(productDoc);
    }
}

