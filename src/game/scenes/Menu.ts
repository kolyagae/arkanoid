import { Button } from "../../ui/Button";

export class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        new Button(this, centerX, centerY, "Start game", "", () => {
            this.scene.start("Arkanoid");
        });
    }
}
