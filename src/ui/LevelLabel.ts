import Phaser from "phaser";

const formatLevel = (level: number) => `Level: ${level}`;

export default class LevelLabel extends Phaser.GameObjects.Text {
    private level: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        level: number,
        style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        super(scene, x, y, formatLevel(level), style);
        this.level = level;
    }

    setLevel(level: number) {
        this.level = level;
        this.updateLevelText();
    }

    addClear() {
        this.setLevel(this.level + 1);
    }

    updateLevelText() {
        this.setText(formatLevel(this.level));
    }
}
