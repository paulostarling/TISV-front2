<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Produtos</h1>
                        <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Buscar por nome do produto"
                        ></b-form-input>
                        <b-button
                            size="sm"
                            @click="openCreateModal($event.target)"
                            class="m-3 float-right" 
                            variant="outline-primary"
                        ><i class="fas fa-plus fa-sm fa-fw mr-1"></i>Adicionar</b-button>
                    <b-table striped :filter="filter" :filter-included-fields="filterOn" bordered hover :items="items" :fields="fields">
                        <template v-slot:cell(opcao)="row">
                            <b-button
                                size="sm"
                                @click="openEditModal(row.item, row.index, $event.target)"
                                class="mr-1"
                                variant="primary"
                            ><i class="fas fa-edit fa-sm fa-fw mr-1"></i></b-button>
                            <b-button
                                size="sm"
                                @click="openDeleteModal(row.item, row.index, $event.target)"
                                class="mr-1"
                                variant="danger"
                            ><i class="fas fa-trash fa-sm fa-fw mr-1"></i></b-button>
                        </template>
                    </b-table>

                    <b-modal :id="infoModal.id" @ok="submitForm($event)" title="Editar usuário">
                        <b-form-group label="Nome:">
                            <b-form-input v-model="infoModal.nome" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Preço Unitário (R$):">
                            <b-form-input v-model="infoModal.precoUnitario" type="number" required></b-form-input>
                        </b-form-group>
                    </b-modal>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import axios from "axios";

export default {
    name: "Produtos",
    data() {
        return {
            fields: [
                { key: "nome",label:"Nome",sortable: true },
                {key: "precoUnitario",label:"Preço",sortable: true,
                formatter: (value, key, item) => value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) },
                { key: "opcao", label: "Opções", class: "text-center" }
            ],
            items: [],
            infoModal: {
                id: "modal-produtos",
                uuid: "",
                nome: "",
                precoUnitario: "",
            },
            modalOpcao: "",
            filter: null,
            filterOn: ['nome'],
        };
    },
    mounted: function () {
        this.listProdutos();
    },
    methods: {
        listProdutos(){
            axios.get(this.$apiHost + "product/getAllProducts/", {}, {headers: this.$apiHeader}).then(response => {
                if (response.data) {
                    this.items = response.data;
                }
            }).catch(error => {
                console.log(error);
            });
        },
        openEditModal(item, index, button) {
            console.log(this.infoModal)
            this.modalOpcao = "edit";
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            this.infoModal.uuid = rowContent.id;
            this.infoModal.nome = rowContent.nome;
            this.infoModal.precoUnitario = rowContent.precoUnitario;
            this.$root.$emit("bv::show::modal", this.infoModal.id, button);
        },

        openDeleteModal(item, index, button) {
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            var dataToSend = { id: rowContent.id };
            console.log(dataToSend);
            axios.post(this.$apiHost + "product/deleteProductById/", dataToSend, {headers: this.$apiHeader}).then(response => {
               alert("Produto "+ dataToSend.id +" pagado com sucesso");
               this.listProdutos();
            }).catch(error => {
                console.log(error);
                alert("Erro inesperado. Verifique a conexão.");
            });
        },

        resetInfoModal() {
            this.infoModal.uuid = "";
            this.infoModal.nome = "";
            this.infoModal.precoUnitario = ""; 
        },

        openCreateModal(button) {
            this.modalOpcao = "create";
            this.resetInfoModal();
            this.$root.$emit("bv::show::modal", this.infoModal.id, button);
        },

        submitForm(e) {
            e.preventDefault();
            console.log(this.infoModal);

            console.log(this.infoModal)
            if (this.modalOpcao == "edit") {
                var preco = parseFloat(this.infoModal.precoUnitario);
                var dataToSend = {
                    id: this.infoModal.uuid,
                    nome: this.infoModal.nome,
                    precoUnitario: preco,
                };
                console.log(dataToSend)
                axios.put(this.$apiHost + "product/updateProduct/", dataToSend, {headers: this.$apiHeader}).then(response => {
                    console.log(response)
                    if (response.data) {
                        alert('Produto atualizado');
                        this.$bvModal.hide(this.infoModal.id);
                        this.listProdutos();
                    } else {
                        alert("Erro: "+response.data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    alert("Erro inesperado. Verifique a conexão.");
                });
            }else{
                var preco = parseFloat(this.infoModal.precoUnitario);
                console.log(preco)
                var dataToSend = {
                    nome: this.infoModal.nome,
                    precoUnitario: preco,
                };
                console.log(dataToSend)
                axios.post(this.$apiHost + "product/createProduct/", dataToSend, {headers: this.$apiHeader}).then(response => {
                    if (response.data) {
                        alert(response.data.message);
                        this.$bvModal.hide(this.infoModal.id);
                        this.listProdutos();
                    } else {
                        alert("Erro: "+response.data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    alert("Erro inesperado. Verifique a conexão.");
                });
            }
        }
    }
};
</script>
