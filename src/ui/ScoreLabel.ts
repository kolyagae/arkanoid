import Phaser from "phaser";

const formatScore = (score: number) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
    private score: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        score: number,
        style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        super(scene, x, y, formatScore(score), style);
        this.score = score;
    }

    setScore(score: number) {
        this.score = score;
        this.updateScoreText();
    }

    add(points: number) {
        const newScore = this.score + points;
        this.setScore(newScore);
    }

    updateScoreText() {
        this.setText(formatScore(this.score));
    }
}
