export class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {
        const buttonWidth = 300;
        const buttonHeight = 100;

        const button = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            buttonWidth,
            buttonHeight,
            0x007acc
        );

        button.setOrigin(0.5);
        button.setStrokeStyle(4, 0xffffff);

        const buttonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "Start game",
            {
                fontSize: "28px",
                color: "#FFFFFF",
                fontStyle: "bold",
            }
        );
        buttonText.setOrigin(0.5);
        button.setInteractive();

        button.on("pointerdown", () => {
            this.scene.start("Arkanoid");
        });
    }
}
