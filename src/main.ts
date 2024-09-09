import { init, GameLoop, initKeys, initPointer, keyPressed } from "kontra";
import Map from "./Map.js";
import Tileset from "./Tileset.js";

init();
initPointer();
initKeys();

const LAST_MAP_NUMBER = 5;
let mapNumber = 0;

Tileset.load().then((tileset) => {
  let map: Map | undefined;
  let mapLoading: boolean = false;

  let loop = GameLoop({
    update: function () {
      if (mapLoading) {
        return;
      }

      if (!map || map.levelComplete) {
        mapLoading = true;

        mapNumber = (mapNumber + 1) % LAST_MAP_NUMBER;
        Map.load(mapNumber, tileset).then((m) => {
          map = m;

          mapLoading = false;
        });
        return;
      }

      if (keyPressed(["arrowup", "w"])) {
        map.movePlayer(0, -1);
      }
      if (keyPressed(["arrowdown", "s"])) {
        map.movePlayer(0, 1);
      }
      if (keyPressed(["arrowleft", "a"])) {
        map.movePlayer(-1, 0);
      }
      if (keyPressed(["arrowright", "d"])) {
        map.movePlayer(1, 0);
      }

      map.update();
    },
    render: function () {
      if (!map) {
        return;
      }

      map.render();
    },
  });

  loop.start();
});
