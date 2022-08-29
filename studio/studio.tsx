import { defineComponent } from "vue";

const Studio = defineComponent({
  name: "studio",
  setup() {
    return () => <div>Studio</div>;
  },
});

const StudioProvider = defineComponent({
  name: "studio-provider",
  setup(props) {
    return () => <Studio />;
  },
});

export default StudioProvider;
