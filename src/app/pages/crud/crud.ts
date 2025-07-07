import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Linhas, LinhasService } from '../service/linhas.service';
import { saveAs } from 'file-saver';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
    <p-toolbar styleClass="mb-6">
        <ng-template #start>
            <p-button label="Novo" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
            <p-button severity="secondary" label="Excluir" icon="pi pi-trash" outlined (onClick)="deleteSelectedTelefones()" [disabled]="!selectedTelefones || !selectedTelefones.length" />
        </ng-template>

        <ng-template #end>
            <p-button label="Exportar CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            <p-button label="Exportar VCF" icon="pi pi-upload" severity="secondary" (onClick)="exportVCF()" />
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="telefones()"
        [rows]="10"
        [columns]="cols"
        [paginator]="true"
        [globalFilterFields]="['id', 'Nome', 'Telefone']"
        [tableStyle]="{ 'min-width': '75rem' }"
        [(selection)]="selectedTelefones"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} telefones"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 20, 30, 50, 100, 200, 500, 1000]"
        [sortField]="'Chip'" 
        [sortOrder]="1"
        [customSort]="true"
        (sortFunction)="customSort($event)"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <h5 class="m-0">Editar Contatos</h5>
                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Pesquisar..." />
                </p-iconfield>
            </div>
        </ng-template>

        <ng-template #header>
            <tr>
                <th style="width: 3rem">
                    <p-tableHeaderCheckbox />
                </th>
                <th pSortableColumn="Chip" style="min-width: 8rem"> 
                    Chip
                    <p-sortIcon field="Chip" /> 
                </th>
                <th pSortableColumn="Nome" style="min-width: 16rem">
                    Nome
                    <p-sortIcon field="Nome" />
                </th>
                <th style="min-width: 16rem">Telefone</th>
                <th style="min-width: 12rem"></th>
            </tr>
        </ng-template>

        <ng-template #body let-telefone>
            <tr>
                <td style="width: 3rem">
                    <p-tableCheckbox [value]="telefone" />
                </td>
                <td style="min-width: 8rem">{{ telefone.Chip }}</td> 
                <td style="min-width: 16rem">{{ telefone.Nome }}</td>
                <td style="min-width: 12rem">{{ telefone.Telefone }}</td>
                <td>
                    <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editTelefone(telefone)" />
                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteTelefone(telefone)" />
                </td>
            </tr>
        </ng-template>
    </p-table>

    <p-dialog [(visible)]="telefoneDialog" [style]="{ width: '450px' }" header="Detalhes do Contato" [modal]="true">
        <ng-template #content>
            <div class="flex flex-col gap-6">
                <div>
                    <label for="Nome" class="block font-bold mb-3">Nome</label>
                    <input type="text" pInputText id="Nome" [(ngModel)]="telefone.Nome" required autofocus fluid />
                    <small class="text-red-500" *ngIf="submitted && !telefone.Nome">Nome é obrigatório.</small>
                </div>
                <div>
                    <label for="Telefone" class="block font-bold mb-3">Telefone</label>
                    <input type="text" pInputText id="Telefone" [(ngModel)]="telefone.Telefone" required fluid />
                    <small class="text-red-500" *ngIf="submitted && !telefone.Telefone">Telefone é obrigatório.</small>
                </div>
            </div>
        </ng-template>

        <ng-template #footer>
            <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
            <p-button label="Salvar" icon="pi pi-check" (click)="saveTelefone()" />
        </ng-template>
</p-dialog>


    <p-confirmdialog [style]="{ width: '450px' }" />
`,

    providers: [MessageService, LinhasService, ConfirmationService]
})
export class Crud implements OnInit {
    telefoneDialog: boolean = false;
    telefones = signal<Linhas[]>([]);
    telefone!: Linhas;
    selectedTelefones!: Linhas[] | null;
    submitted: boolean = false;
    @ViewChild('dt') dt!: Table;
    exportColumns!: { title: string; dataKey: string }[];
    cols!: { field: string; header: string; customExportHeader?: string }[];

    constructor(
        private productService: LinhasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getProducts().then((data) => {
            const ordenado = data.map((item, index) => ({ ...item, Chip: index + 1 })); 
            this.telefones.set(ordenado);
        });

        this.cols = [
            { field: 'Chip', header: 'Chip', customExportHeader: 'Linhas Chip' }, 
            { field: 'Telefone', header: 'Telefone', customExportHeader: 'Linhas Telefone' },
            { field: 'Nome', header: 'Nome' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    exportVCF() {
        let vcfContent = this.telefones().map(telefone => {
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${telefone.Nome}\nTEL:${telefone.Telefone}\nEND:VCARD`;
        }).join('\n');

        let blob = new Blob([vcfContent], { type: 'text/vcard' });
        saveAs(blob, 'contatos.vcf');
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.telefone = {};
        this.submitted = false;
        this.telefoneDialog = true;
    }

    editTelefone(telefone: Linhas) {
        this.telefone = { ...telefone };
        this.telefoneDialog = true;
    }

    deleteSelectedTelefones() {
        this.confirmationService.confirm({
            message: 'Tem certeza de que deseja excluir os contatos selecionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deletePromises = this.selectedTelefones!.map(telefone => this.productService.deleteProduct(telefone.id!));
                Promise.all(deletePromises).then(() => {
                    this.loadProducts();
                    this.selectedTelefones = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Telefones Excluídos',
                        life: 3000
                    });
                });
            }
        });
    }

    deleteTelefone(telefone: Linhas) {
        this.confirmationService.confirm({
            message: 'Tem certeza de que deseja excluir ' + telefone.Nome + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(telefone.id!).then(() => {
                    this.loadProducts();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Telefone Excluído',
                        life: 3000
                    });
                });
            }
        });
    }

    hideDialog() {
        this.telefoneDialog = false;
        this.submitted = false;
    }

    saveTelefone() {
        this.submitted = true;

        if (this.telefone.Nome?.trim() && this.telefone.Telefone?.trim()) {
            if (this.telefone.id) {
                this.productService.updateProduct(this.telefone).then(() => {
                    this.loadProducts();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Telefone Atualizado',
                        life: 3000
                    });
                });
            } else {
                this.telefone.Chip = this.telefones().length + 1; 
                this.productService.addProduct(this.telefone).then((newProduct) => {
                    this.telefones.set([...this.telefones(), newProduct]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Telefone Criado',
                        life: 3000
                    });
                });
            }
            this.telefoneDialog = false;
            this.telefone = {};
        }
    }

    customSort(event: any) {
        event.data.sort((data1: Linhas, data2: Linhas) => {
            let value1 = data1.Chip || 0; 
            let value2 = data2.Chip || 0;
            let result = value1 - value2;
            return event.order * result;
        });
    }
}



