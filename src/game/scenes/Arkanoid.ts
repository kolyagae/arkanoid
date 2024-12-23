import { Scene } from "phaser";
import physicsConstants from "../../constants/physicsConstants";
import ScoreLabel from "../../ui/ScoreLabel";
import LivesLabel from "../../ui/LivesLabel";
import gameConstants from "../../constants/gameConstants";
import LevelLabel from "../../ui/LevelLabel";
import { Button } from "../../ui/Button";

const brickInfo = {
    width: 80,
    height: 27,
    count: {
        row: 4,
        col: 4,
    },
    offset: {
        top: 80,
        left: 80,
    },
};

export class Arkanoid extends Scene {
    private ball: Phaser.Physics.Arcade.Sprite;
    private paddle: Phaser.Physics.Arcade.Sprite;
    private bricks: Phaser.Physics.Arcade.StaticGroup;
    private velocity: number = physicsConstants.baseBallVelocity;
    private scoreLabel: ScoreLabel;
    private livesLabel: LivesLabel;
    private levelLabel: LevelLabel;
    private level: number = 0;
    private ballLaunched: boolean = false;
    private topWall!: Phaser.Physics.Arcade.StaticGroup;
    private maxLevel: number = 5;

    constructor() {
        super("Arkanoid");
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.topWall = this.createTopWall();
        this.paddle = this.createPaddle();
        this.ball = this.createBall();
        this.bricks = this.createBricks(
            brickInfo.count.row,
            brickInfo.count.col
        );

        this.scoreLabel = this.createScoreLabel();
        this.livesLabel = this.createLivesLabel();
        this.levelLabel = this.createLevelLabel();

        this.setupCollisions();

        this.input.on("pointerdown", () => {
            if (!this.ballLaunched) {
                this.setBallInitialDirection();
            }
        });
    }

    private loadAssets() {
        this.load.image("background", "assets/bg.jpg");
        this.load.image("paddle", "assets/paddle.png");
        this.load.image("ball", "assets/ball.png");
        this.load.image("brick", "assets/brick.png");
        this.load.audio("paddleHitSound", "assets/paddleHitSound.mp3");
        this.load.audio("brickHitSound", "assets/brickHitSound.mp3");
    }

    private createTopWall() {
        this.add
            .graphics()
            .fillStyle(0x000000, 1)
            .fillRect(0, 40, this.cameras.main.width, 2);

        const topWall = this.physics.add
            .staticGroup()
            .create(this.cameras.main.centerX, 40, "")
            .setSize(this.cameras.main.width, 1)
            .setVisible(false);

        return topWall;
    }

    private createPaddle() {
        const gameWidth = this.sys.game.config.width as number;
        const gameHeight = this.sys.game.config.height as number;

        const paddle = this.physics.add.sprite(
            gameWidth * 0.5,
            gameHeight - 90,
            "paddle"
        );
        paddle.setOrigin(0.5, 1);
        paddle.setCollideWorldBounds(true);
        paddle.body.immovable = true;

        return paddle;
    }

    private createBall() {
        const ball = this.physics.add
            .sprite(this.paddle.x, this.paddle.y - 20, "ball")
            .setCollideWorldBounds(true)
            .setBounce(1)
            .setVelocity(0, 0);

        ball.body.onWorldBounds = true;
        ball.body.world.on(
            "worldbounds",
            (_: Phaser.Physics.Arcade.Body, __: boolean, down: boolean) => {
                if (down) {
                    const gameOver = this.livesLabel.removeLife();
                    this.resetBallPosition();

                    if (gameOver) {
                        this.handleGameOver();
                    }
                }
            }
        );

        return ball;
    }

    private createBricks(rows: number, cols: number) {
        const totalWidth = cols * brickInfo.width - brickInfo.offset.left;
        const offsetLeft = (this.scale.width - totalWidth) / 2;

        const bricks = this.physics.add.staticGroup();

        for (let column = 0; column < cols; column++) {
            for (let row = 0; row < rows; row++) {
                const brickX = column * brickInfo.width + offsetLeft;
                const brickY = row * brickInfo.height + brickInfo.offset.top;

                bricks.create(brickX, brickY, "brick");
            }
        }

        return bricks;
    }

    private createLabel<T extends Phaser.GameObjects.Text>(
        LabelClass: new (
            scene: Phaser.Scene,
            x: number,
            y: number,
            value: number,
            style: Phaser.Types.GameObjects.Text.TextStyle
        ) => T,
        x: number,
        y: number,
        value: number
    ): T {
        const style = {
            fontSize: "20px",
            fontFamily: "Arial",
            strokeThickness: 0.6,
            fill: "#000",
        };
        const label = new LabelClass(this, x, y, value, style);

        this.add.existing(label);

        return label;
    }

    private createScoreLabel() {
        const label = this.createLabel(ScoreLabel, 8, 8, 0);

        return label;
    }

    private createLevelLabel() {
        const label = this.createLabel(LevelLabel, 360, 8, 0);

        return label;
    }

    private createLivesLabel() {
        const label = this.createLabel(
            LivesLabel,
            725,
            8,
            gameConstants.startingLives
        );

        return label;
    }

    setBallInitialDirection() {
        const directions = [
            { x: 150, y: -this.velocity },
            { x: -150, y: -this.velocity },
            { x: 250, y: -this.velocity },
            { x: -250, y: -this.velocity },
        ];

        const randomIndex = Phaser.Math.Between(0, directions.length - 1);
        const direction = directions[randomIndex];
        this.ball.setVelocity(direction.x, direction.y);
        this.ballLaunched = true;
    }

    updateBallVelocity() {
        const multiplier =
            this.level > 0
                ? Math.pow(physicsConstants.speedMultiplier, this.level)
                : 1;
        this.velocity *= multiplier;

        this.ball.setVelocity(this.velocity, -this.velocity);
    }

    resetBallPosition() {
        this.ball.setVelocity(0, 0);
        this.ballLaunched = false;
    }

    private handleGameOver() {
        this.bricks.clear(true, true);
        this.paddle.destroy();
        this.ball.destroy();
        this.showGameCompleteMessage("You lost!");
    }

    ballHitPaddle(
        ball:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Physics.Arcade.Body
            | Phaser.Tilemaps.Tile,
        paddle:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Physics.Arcade.Body
            | Phaser.Tilemaps.Tile
    ) {
        if (this.ballLaunched) {
            if (paddle instanceof Phaser.Physics.Arcade.Sprite && paddle.body) {
                const paddleVelocityX = paddle.body.velocity.x;

                if (ball instanceof Phaser.Physics.Arcade.Sprite && ball.body) {
                    if (paddleVelocityX < 0) {
                        ball.setVelocityX(-Math.abs(ball.body.velocity.x));
                    } else if (paddleVelocityX > 0) {
                        ball.setVelocityX(Math.abs(ball.body.velocity.x));
                    }
                }
            }
            this.sound.play("paddleHitSound");
        }
    }

    ballHitBrick(
        _:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Physics.Arcade.Body
            | Phaser.Tilemaps.Tile,
        brick:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Physics.Arcade.Body
            | Phaser.Tilemaps.Tile
    ) {
        if (brick instanceof Phaser.Physics.Arcade.Sprite) {
            this.sound.play("brickHitSound");
            brick.destroy();
            const multiplier =
                this.level > 0 ? gameConstants.clearMultiplier * this.level : 1;
            const pointValue = gameConstants.basePoints * multiplier;
            this.scoreLabel.add(pointValue);

            if (this.bricks.countActive(true) === 0) {
                this.resetLevel();
            }
        }
    }

    private resetLevel() {
        this.levelLabel.addClear();
        this.level += 1;

        if (this.level >= this.maxLevel) {
            this.paddle.destroy();
            this.ball.destroy();

            this.showGameCompleteMessage("You won!");
        } else {
            this.updateBallVelocity();
            this.resetBallPosition();
            this.repopulateBricks();
        }
    }

    private showGameCompleteMessage(message: string) {
        new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "Play Again",
            message,
            () => this.restartGame()
        );
    }

    private restartGame() {
        this.level = 0;
        this.ballLaunched = false;
        brickInfo.count.row = 4;
        brickInfo.count.col = 4;
        this.scene.restart();
    }

    private repopulateBricks(): void {
        const newRows = brickInfo.count.row + 1;
        const newCols = brickInfo.count.col + 1;

        if (this.bricks) {
            this.bricks.clear(true, true);
        }

        this.bricks = this.createBricks(newRows, newCols);

        brickInfo.count.row = newRows;
        brickInfo.count.col = newCols;
        this.setupBrickCollisions();
    }

    private setupPaddleCollisions() {
        this.physics.add.collider(
            this.ball,
            this.paddle,
            this.ballHitPaddle,
            undefined,
            this
        );
    }

    private setupBrickCollisions() {
        this.physics.add.collider(
            this.ball,
            this.bricks,
            this.ballHitBrick,
            undefined,
            this
        );
    }

    private setupCollisions() {
        this.setupPaddleCollisions();
        this.setupBrickCollisions();
        this.physics.add.collider(this.ball, this.topWall);
    }

    update() {
        this.updatePaddlePosition();

        if (!this.ballLaunched) {
            this.ball.setPosition(
                this.paddle.x,
                this.paddle.y -
                    this.paddle.height * 0.5 -
                    this.ball.height * 0.8
            );
        }
    }

    private updatePaddlePosition() {
        const paddleWidth = this.paddle.width;
        const canvasWidth = this.sys.canvas.width;

        if (this.input.activePointer.x) {
            this.paddle.x = Phaser.Math.Clamp(
                this.input.activePointer.x,
                paddleWidth / 2,
                canvasWidth - paddleWidth / 2
            );
        }

        this.paddle.x = Phaser.Math.Clamp(
            this.paddle.x,
            paddleWidth / 2,
            canvasWidth - paddleWidth / 2
        );
    }
}
