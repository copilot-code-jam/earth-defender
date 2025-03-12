import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        // Load the space background image
        this.load.image('space-background', 'assets/earth.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}