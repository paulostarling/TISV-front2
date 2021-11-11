<template>
    <div id="wrapper">
        <app-sidebar></app-sidebar>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <app-navbar></app-navbar>
                <div class="container-fluid">
                    <h1 class="h3 mb-4 text-gray-800">Pedidos</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import sidebar from '../template/Sidebar';

export default {
    name: "Home",
    data() {
        return {}
    },
    methods: {
        
    },
    mounted: function () {
        var app = document.getElementById("app");
        app.classList.add("");
        var body =    document.body;
        body.classList.remove(["body-login", "app-padding"]);
    },
};
</script>
