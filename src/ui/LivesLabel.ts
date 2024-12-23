import Phaser from "phaser";

const formatLives = (lives: number) => `Lives: ${lives}`;

export default class LivesLabel extends Phaser.GameObjects.Text {
    private lives: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        lives: number,
        style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        super(scene, x, y, formatLives(lives), style);
        this.lives = lives;
    }

    setLives(lives: number) {
        this.lives = lives;
        this.updateLivesText();
    }

    removeLife() {
        this.setLives(this.lives - 1);
        if (this.lives < 1) return true;
    }

    updateLivesText() {
        this.setText(formatLives(this.lives));
    }
}
