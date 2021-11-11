<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Criar Pedido</h1>
                        <b-table striped :filter="filter" :filter-included-fields="filterOn" bordered hover :items="items" :fields="fields">
                            <template v-slot:cell(opcao)="row">
                                <b-form-input :id="`type-${type}`" :type="type"></b-form-input>
                            </template>
                        </b-table>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import axios from "axios";

export default {
    name: "PedidoCreate",
    data() {
        return {
            fields: [
                { key: "nome",label:"Nome",sortable: true },
                {key: "precoUnitario",label:"Preço",sortable: true,
                formatter: (value, key, item) => value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) },
                { key: "opcao", label: "Opções", class: "text-center" }
            ],
            items: [],
            
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
    }
};
</script>
<style>
.card.card_background_color {
    background-color: rgba(255, 255, 255, 0.5);
}
</style>