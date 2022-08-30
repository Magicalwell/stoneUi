import * as components from "./stoneComponents";
import create from "./create";

const stoneUI = create({
  components: Object.keys(components).map((key) => {
    console.log(key, components);

    return components[key as keyof typeof components];
  }),
});

export default stoneUI;
export const install = stoneUI.install;
