<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input label="Buscar..." v-model="filtro" />

    <q-editor
      v-if="!modoEdicion"
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Guardar Task',
          icon: 'save',
          label: 'Guardar',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
    <q-editor
      v-else
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Actualizar nota',
          icon: 'save',
          label: 'Actualizar',
          handler: updateWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />
    <q-card
      class="row"
      flat
      bordered
      v-for="(item, index) in arrayFiltrado"
      :key="index"
    >
      <q-card-section
        :class="item.estado ? 'tachar' : ''"
        class="col"
        v-html="item.texto"
      />
      <q-btn flat color="blue" @click="item.estado = !item.estado"
        >Acción</q-btn
      >
      <q-btn flat color="yellow" @click="editar(index, item.id)">Editar</q-btn>
      <q-btn flat color="red" @click="eliminar(index, item.id)">Eliminar</q-btn>
    </q-card>

    <div class="flex flex-center" v-if="tasks.length == 0">
      <h6>Sin Notas</h6>
    </div>
  </div>
</template>

<script>
import { db } from "boot/firebase";
export default {
  data() {
    return {
      editor: "",
      tasks: [],
      index: null,
      modoEdicion: false,
      id: null,
      texto: "",
      arrayFiltrado: []
    };
  },
  computed: {
    filtro: {
      get() {
        return this.texto;
      },
      set(value) {
        value = value.toLowerCase();
        this.arrayFiltrado = this.tasks.filter(
          item => item.texto.toLowerCase().indexOf(value) !== -1
        );
        this.texto = value;
      }
    }
  },
  created() {
    this.listarTareas();
    this.arrayFiltrado = this.tasks;
  },
  methods: {
    async updateWork() {
      try {
        const resDB = await db
          .collection("tareas")
          .doc(this.id)
          .update({
            texto: this.editor
          });
        this.tasks[this.index].texto = this.editor;
        this.$q.notify({
          message: "Tarea Actualizada",
          color: "dark",
          textColor: "white",
          icon: "cloud_done"
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.modoEdicion = false;
        this.index = null;
        this.id = null;
        this.editor = "";
      }
    },

    editar(index, id) {
      this.modoEdicion = true;
      this.index = index;
      this.id = id;
      this.editor = this.tasks[index].texto;
    },

    async listarTareas() {
      try {
        const resDB = await db.collection("tareas").get();
        resDB.forEach(res => {
          // console.log(res.id);
          const tarea = {
            id: res.id,
            texto: res.data().texto,
            estado: res.data().estado
          };
          this.tasks.push(tarea);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async saveWork() {
      try {
        const resDB = await db.collection("tareas").add({
          texto: this.editor,
          estado: false
        });
        this.tasks.push({
          texto: this.editor,
          estado: false,
          id: resDB.id
        });
        this.editor = "";
        this.$q.notify({
          message: "Tarea Guardada",
          color: "green-4",
          textColor: "white",
          icon: "cloud_done"
        });
      } catch (error) {
        console.log(error);
      }
    },
    eliminar(index, id) {
      this.$q
        .dialog({
          title: "Acción Peligrosa",
          message: "Realmente quieres eliminar la Tasks",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          // console.log('>>>> OK')
          try {
            await db
              .collection("tareas")
              .doc(id)
              .delete();
            this.tasks.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        });
    }
  }
};
</script>

<style>
.tachar {
  text-decoration: line-through;
}
</style>
