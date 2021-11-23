<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Pedidos</h1>
                        <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            placeholder="Buscar por nome do cliente"
                        ></b-form-input>
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

                    <b-modal :id="infoModal.id" @ok="submitForm($event)" title="Informações do pedido">
                        <h4>{{infoModal.nome}}</h4>
                        <p>Valor total do pedido de R${{infoModal.precoUnitario}}</p>
                        <b-list-group>
                            <b-list-group-item v-for="item in infoModal.items_do_pedido" :key="item.id" class="d-flex justify-content-between align-items-center">
                                {{item.quantidade}}x {{item.produto.nome}}
                                <b-badge variant="primary" pill>R${{item.produto.precoUnitario}}</b-badge>
                            </b-list-group-item>
                        </b-list-group>
                        <b-form-group label="Status do pedido:">
                            <b-form-select v-model="infoModal.status" :options="options"></b-form-select>
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
    name: "PedidoGeral",
    data() {
        return {
            fields: [
                { key: "nome",label:"Nome",sortable: true },
                { key: "criacao",label:"Criado em",sortable: true },
                { key: "status",label:"Status",sortable: true },
                {key: "precoUnitario",label:"Preço",sortable: true,
                formatter: (value, key, item) => value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) },
                { key: "opcao", label: "Opções", class: "text-center" }
            ],
            items: [],
            infoModal: {
                id: "modal-pedidos",
                uuid: "",
                status: "",
                precoUnitario: "",
                items_do_pedido: [],
            },
            modalOpcao: "",
            filter: null,
            filterOn: ['nome'],
            pedidos: [],
            options: [
                { value: 'Criado', text: 'Criado' },
                { value: 'Preparando', text: 'Preparando' },
                { value: 'A caminho', text: 'A caminho'},
                { value: 'Entregue', text: 'Entregue'},
            ],
        };
    },
    mounted: function () {
        this.listPedidos();
    },
    methods: {
        listPedidos(){
            axios.get(this.$apiHost + "pedido/getAllPedidos/", {}, {headers: this.$apiHeader}).then(response => {
                if (response.data) {
                    this.items = []
                    this.pedidos = response.data;
                    for (let i = 0; i < this.pedidos.length; i++) {
                        var pedido = this.pedidos[i];
                        //console.log(pedido)
                        var valor_total = 0;
                        for (let j = 0; j < pedido.items.length; j++) {
                            var item_pedido = pedido.items[j];
                            valor_total += item_pedido.produto.precoUnitario * item_pedido.quantidade
                        }
                        var date = new Date(pedido.createdAt)
                        var date = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                        this.items.push({id: pedido.id, nome: pedido.user.nome, criacao: date, precoUnitario: valor_total, status: pedido.status, items_do_pedido: pedido.items})
                    }
                }
                console.log(this.items)
            }).catch(error => {
                console.log(error);
            });
        },
        openEditModal(item, index, button) {
            this.modalOpcao = "edit";
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            console.log(rowContent)
            this.infoModal.uuid = rowContent.id;
            this.infoModal.nome = rowContent.nome;
            this.infoModal.precoUnitario = rowContent.precoUnitario;
            this.infoModal.items_do_pedido = rowContent.items_do_pedido;
            this.infoModal.status = rowContent.status;
            this.$root.$emit("bv::show::modal", this.infoModal.id, button);
        },

        openDeleteModal(item, index, button) {
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            var dataToSend = { id: rowContent.id };
            console.log(dataToSend);
            axios.post(this.$apiHost + "product/deleteProductById/", dataToSend, {headers: this.$apiHeader}).then(response => {
               alert("Produto "+ dataToSend.id +" pagado com sucesso");
               this.listPedidos();
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

        submitForm(e) {
            e.preventDefault();
            console.log(this.infoModal);

            console.log(this.infoModal)
            if (this.modalOpcao == "edit") {
                var dataToSend = {
                    id: this.infoModal.uuid,
                    status: this.infoModal.status,
                };
                console.log(dataToSend)
                axios.put(this.$apiHost + "pedido/trocarStatus/", dataToSend, {headers: this.$apiHeader}).then(response => {
                    console.log(response)
                    if (response.data) {
                        alert('Status do pedido atualizado');
                        this.$bvModal.hide(this.infoModal.id);
                        this.listPedidos();
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
                        this.listPedidos();
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
