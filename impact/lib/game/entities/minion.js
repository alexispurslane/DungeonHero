ig.module(
    'game.entities.minion'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityMinion = ig.Entity.extend({
        points: null,
        type: ig.Entity.TYPE.B, // Player friendly group
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,

        // These are our own properties. They are not defined in the base
        // ig.Entity class. We just use them internally for the Player
        tileSize: 32,
        flip: false,
        health: 100,
        targetY: 0,
        targetX: 0,
        direction: null,
        speed: 300,


        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Define properties here so we can use tile size var
            this.size = {
                x: this.tileSize,
                y: this.tileSize
            };
            this.animSheet = new ig.AnimationSheet('media/tilesetd.png', this.tileSize, this.tileSize);

            // Add the animations
            this.addAnim('idle', 1, [131]);
            if (!ig.global.wm && ig.game.lightManager) {
                this.light = ig.game.lightManager.addLight(this, {
                    angle: 0,
                    angleSpread: 380,
                    radius: 50,
                    color: 'rgba(255,255,255,0.1)',
                    useGradients: true,
                    shadowGradientStart: 'rgba(0,0,0,0.1)',
                    shadowGradientStop: 'rgba(0,0,0,0.1)',
                    lightGradientStart: 'rgba(255,0,0,0.1)',
                    lightGradientStop: 'rgba(0,0,0,0.8)',
                    pulseFactor: 1
                });
            }
        },

        draw: function() {
            this.parent()
            // Update animation to current frame
            // Draw current frame
        },
        looseLife: function (n) {
             this.health -= n;
             if (this.health <= 0) {
                 this.kill()
             }
         },
        attack: true,
        health: 50,
        i: 0,
        check: function(other) {
            var hit = (Math.max(Math.random() * 10)) | 0
            other.receiveDamage(Math.max(hit - Math.max(other.defence, 0), 0), this)
            this.receiveDamage(hit + other.attack, other)
            console.log(this.i)
            this.i++
        },
        kill: function () {
            ig.game.lightManager.removeLight(this.light)
            this.parent()
        },
        /**
         * Update Function
         */
        moveTowardsDestination: function(i, node) {
            var node = node[i];

            if (node.x < Math.floor(this.pos.x)) {
                this.vel.x = -20 * 3;
            }

            if (node.x > Math.floor(this.pos.x)) {
                this.vel.x = 20 * 3;
            }

            if (node.y > Math.floor(this.pos.y)) {
                this.vel.y = 20 * 3;
            }

            if (node.y < Math.floor(this.pos.y)) {
                this.vel.y = -20 * 3;
            }

            if (node.x == Math.floor(this.pos.x) && node.y == Math.floor(this.pos.y)) {
                if (node.length > 1) {
                    node.splice(0, 1);
                }
                else {
                    node = null;
                }

            }

        },
        update: function() {
            if (ig.game.player) {
                this.path = new PathFinder(this, ig.game.player);
                this.points = this.path.getPath();
            }
            if (this.points) {
                for (var i=0; i < this.points.length;i++) {
                    this.moveTowardsDestination(i, this.points)
                }
            }
            this.parent();


        },
    });

});