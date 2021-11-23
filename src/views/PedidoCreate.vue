<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Criar Pedido</h1>
                    <b-table striped bordered hover :items="items" :fields="fields">
                        <template v-slot:cell(quantidade)="row">
                            <b-form-input id="`type-${type}`" type="number" value="0" @change="onChange(row.item, $event)"></b-form-input>
                        </template>
                    </b-table>
                    <p>Valor do pedido: R${{valor_total}}</p>
                    <b-button @click="finalizarPedido()" variant="primary">Finalizar pedido</b-button>
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
                { key: "quantidade", label: "Quantidade", class: "text-center" }
            ],
            items: [],
            produtos_escolhidos: [],
            valor_total: 0
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
        onChange(item, quantidade) {
            var rowContent = JSON.parse(JSON.stringify(item, null, 2));
            var item_pedido = {
                id_cliente:  this.$session.get('userid'),
                id_produto: rowContent.id,
                quantidade: quantidade,
                precoUnitario: rowContent.precoUnitario
            }
            for(var i = 0; i < this.produtos_escolhidos.length; i++) {
                var existe = false
                if (this.produtos_escolhidos[i].id_produto == item_pedido.id_produto) {
                    existe = true
                    if (item_pedido.quantidade == 0) {
                        this.produtos_escolhidos.splice(i, 1);
                    }
                    else {
                        this.produtos_escolhidos[i] = item_pedido     
                    }
                    break
                }
            }
            if (!existe) {
                this.produtos_escolhidos = this.produtos_escolhidos.concat(item_pedido)
            }
            this.calculaValorTotal()

        },
        calculaValorTotal() {
            this.valor_total = 0
            for(var i = 0; i < this.produtos_escolhidos.length; i++) {
                this.valor_total += this.produtos_escolhidos[i].quantidade * this.produtos_escolhidos[i].precoUnitario
            }
        },
        finalizarPedido() {
            var dataToSend = []
            for (let index = 0; index < this.items.length; index++) {
                dataToSend[index] = this.items[index];
            }
            axios.post(this.$apiHost + "pedido/createPedido/", this.produtos_escolhidos, {headers: this.$apiHeader}).then(response => {
                console.log(response)
                if (response.data) {
                    alert('Pedido criado');
                } else {
                    alert("Erro: "+response.data.message);
                }
            }).catch(error => {
                console.log(error);
                alert("Erro inesperado. Verifique a conexão.");
            });
        }
    }
};
</script>
<style>
.card.card_background_color {
    background-color: rgba(255, 255, 255, 0.5);
}
</style>