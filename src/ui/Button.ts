export class Button extends Phaser.GameObjects.Container {
    buttonWidth = 300;
    buttonHeight = 100;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        buttonText: string,
        message: string,
        onClick: () => void
    ) {
        super(scene, x, y);

        const messageText = scene.add
            .text(0, -this.buttonHeight / 2 - 20, message, {
                fontSize: "28px",
                align: "center",
                color: "#000",
            })
            .setOrigin(0.5);

        const button = scene.add.rectangle(
            0,
            0,
            this.buttonWidth,
            this.buttonHeight,
            0x007acc
        );
        button.setOrigin(0.5);
        button.setStrokeStyle(4, 0xffffff);
        button.setInteractive();

        const buttonTextObj = scene.add
            .text(0, 0, buttonText, {
                fontSize: "28px",
                color: "#FFFFFF",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        this.add([messageText, button, buttonTextObj]);
        button.on("pointerdown", onClick);
        scene.add.existing(this);
    }
}
