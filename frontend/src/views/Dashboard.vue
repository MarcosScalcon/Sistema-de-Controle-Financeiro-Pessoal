<template>
  <v-container>
    <h1 class="text-h3 mb-6">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="blue" dark elevation="4">
          <v-card-title>Saldo Total</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="success" dark elevation="4">
          <v-card-title>Entradas</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="error" dark elevation="4">
          <v-card-title>Saídas</v-card-title>
          <v-card-text class="text-h4">R$ 0,00</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
