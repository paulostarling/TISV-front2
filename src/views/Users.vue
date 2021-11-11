<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Usuários</h1>
                        <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Buscar por nome"
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
                        <b-form-group label="CPF:">
                            <b-form-input v-model="infoModal.cpf" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Nome:">
                            <b-form-input v-model="infoModal.nome" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Senha:">
                            <b-form-input v-model="infoModal.password" type="password" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Tipo de usuário:">
                            <b-form-select v-model="infoModal.tipoDeUsuario" :options="options"></b-form-select>
                        </b-form-group>
                        <b-form-group label="Quarto:">
                            <b-form-input v-model="infoModal.quarto" type="number" required></b-form-input>
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
    name: "Users",
    data() {
        return {
            selected: null,
            options: [
                { value: 'Funcionário', text: 'Funcionário' },
                { value: 'Hóspede', text: 'Hóspede' }
            ],
            fields: [
                { key: "nome",label:"Nome",sortable: true },
                "cpf",
                {key: "tipoDeUsuario",label:"Papel",sortable: true },
                { key: "opcao", label: "Opções", class: "text-center" }
            ],
            items: [],
            infoModal: {
                id: "modal-usuarios",
                uuid: "",
                nome: "",
                cpf: "",
                username: "",
                password: "",
                tipoDeUsuario: null
            },
            modalOpcao: "",
            filter: null,
            filterOn: ['nome'],
        };
    },
    mounted: function () {
        this.listUsers();
    },
    methods: {
        listUsers(){
            axios.get(this.$apiHost + "user/getAllUsers/", {}, {headers: this.$apiHeader}).then(response => {
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
            this.infoModal.cpf = rowContent.cpf;
            this.infoModal.nome = rowContent.nome;
            this.infoModal.password = rowContent.password;
            this.infoModal.quarto = rowContent.quarto;
            this.infoModal.tipoDeUsuario = rowContent.tipoDeUsuario;
            this.$root.$emit("bv::show::modal", this.infoModal.id, button);
        },

        openDeleteModal(item, index, button) {
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            var dataToSend = { id: rowContent.id };
            console.log(dataToSend);
            axios.post(this.$apiHost + "user/deleteUserById/", dataToSend, {headers: this.$apiHeader}).then(response => {
               alert("Usuário"+ dataToSend.id +" pagado com sucesso");
               this.listUsers();
            }).catch(error => {
                console.log(error);
                alert("Erro inesperado. Verifique a conexão.");
            });
        },

        resetInfoModal() {
            this.infoModal.uuid = "";
            this.infoModal.cpf = "";
            this.infoModal.nome = "";
            this.infoModal.password = "";
            this.infoModal.quarto = "";
            this.infoModal.tipoDeUsuario = null    
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
                var dataToSend = {
                    id: this.infoModal.uuid,
                    cpf: this.infoModal.cpf,
                    nome: this.infoModal.nome,
                    password: this.infoModal.password,
                    quarto: this.infoModal.quarto
                };
                console.log(dataToSend)
                axios.put(this.$apiHost + "user/updateUser/", dataToSend, {headers: this.$apiHeader}).then(response => {
                    console.log(response)
                    if (response.data) {
                        alert('Usuário atualizado');
                        this.$bvModal.hide(this.infoModal.id);
                        this.listUsers();
                    } else {
                        alert("Erro: "+response.data.message);
                    }
                }).catch(error => {
                    console.log(error);
                    alert("Erro inesperado. Verifique a conexão.");
                });
            }else{
                var dataToSend = {
                    nome: this.infoModal.nome,
                    cpf: this.infoModal.cpf,
                    password: this.infoModal.password,
                    quarto: this.infoModal.quarto,
                    tipoDeUsuario: this.infoModal.tipoDeUsuario
                };
                console.log(dataToSend)
                axios.post(this.$apiHost + "user/create/", dataToSend, {headers: this.$apiHeader}).then(response => {
                    if (response.data) {
                        alert(response.data.message);
                        this.$bvModal.hide(this.infoModal.id);
                        this.listUsers();
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
