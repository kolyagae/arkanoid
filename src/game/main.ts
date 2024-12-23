import { Arkanoid } from "./scenes/Arkanoid";
import { AUTO, Game } from "phaser";
import { Menu } from "./scenes/Menu";

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    max: {
        width: 800,
        height: 600,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "game-container",
    scene: [Menu, Arkanoid],
    physics: {
        default: "arcade",
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
