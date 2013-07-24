ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'plugins.fog',
    'plugins.lights',
    'game.entities.player',
    'game.levels.level1',
    'plugins.a-star',
    'plugins.screen-fader',
    'game.levels.level2',
    'game.levels.level3',
    'game.levels.level4',
    'game.levels.level5'
)
.defines(function() {

    MainGame = ig.Game.extend({
        // The height and width <in tiles> of the area to be covered by fog
        // You must also provide the tile size in pixels
        mapWidth: 50,
        mapHeight: 50,
        tileSize: 32,
        lightManager: '',
        font: new ig.Font('media/04b03.font.png'),
        init: function() {
            ig.input.bind(ig.KEY.UP_ARROW, 'up')
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left')
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right')
            ig.input.bind(ig.KEY.SPACE, 'pause')
            ig.input.bind(ig.KEY.I, 'inventory')
            ig.input.bind(ig.KEY.ESC, "esc")
            ig.input.bind(ig.KEY.Q, "quaff") /*ig.game.player.health = ig.game.player.health != 100? 100:ig.game.player.health*/
            this.lightManager = new ig.LightManager('rgba(0,0,0,0.8)', [0, 0, 0, 255 * 0.8]);
            this.loadLevel(LevelLevel1)
            this._mapWidth = ig.game.backgroundMaps[0].width * ig.game.backgroundMaps[0].tilesize - (ig.system.width);
            this._mapHeight = ig.game.backgroundMaps[0].height * ig.game.backgroundMaps[0].tilesize - (ig.system.height);
            this.fadeOut = new ig.ScreenFader({
                fade: 'out'
            });
            this.fadeIn = new ig.ScreenFader({
                fade: 'in'
            });
            $(function() {
                //Enable swiping...
                $("#canvas").swipe({
                    //Generic swipe handler for all directions
                    swipe: function(event, direction, distance, duration, fingerCount) {
                        ig.input.actions[direction] = true
                        console.log(ig.input.actions[direction], direction)
                    },
                    //Default is 75px, set to 0 for demo so any distance triggers swipe
                    threshold: 0
                });
                $("#canvas").swipe({
                    pinchIn: function(event, direction, distance, duration, fingerCount, pinchZoom) {
                        ig.input.actions["inventory"] = true
                        ig.input.actions["inventory"] = false
                    },
                    pinchOut: function(event, direction, distance, duration, fingerCount, pinchZoom) {
                        ig.input.actions["esc"] = true
                        ig.input.actions["esc"] = false
                    },
                    fingers: 2,
                    pinchThreshold: 0
                });
            
            });
        },
        go: true,
        matte: new ig.Image('media/matte.png'),
        draw: function() {
            if (this.paused && !this.next) {
                this.font.draw(" - Paused - ", ig.system.width / 2, 232, ig.Font.ALIGN.CENTER);
        
                // Return to stop anything else drawing
                return;
            } else if (this.paused){
                return;
            }
            // To draw fog you must provide a callback function, see below
            this.parent()
            ig.game.lightManager.drawLightMap();    	
	        ig.game.drawEntities();
	        ig.game.lightManager.drawShadowMap();
            if (this.player) {
                this.font.draw('Health:' + this.player.health, 2, 2)
                this.font.draw('Defence:' + this.player.defence, 2, 10)
                this.font.draw('Attack:' + this.player.attack, 2, 18)
                ig.h = this.player.health;
                ig.d = this.player.defence;
                ig.a = this.player.attack;
                ig.inventory = this.player.inventory
            }
            if (this.fadeInNow) {
                this.fadeIn.draw();
            }
            if (this.fadeOutNow) {
                this.fadeOut.draw();
            }
            if (this.next) {
                this.paused = true
                this.matte.draw(0,0)
                this.font.draw('Health:' + ig.h, 2, 2)
                this.font.draw('Defence:' + ig.d, 2, 10)
                this.font.draw('Attack:' + ig.a, 2, 18)
                var b = 2
                for (var i = 0; i < ig.inventory.length; i++) {
                    b += 8
                    if (ig.inventory[i]) {
                        this.font.draw((i + 1) + ':' + ig.inventory[i], ig.system.width / 2, b)
                    }
                }
            }
        },

        // Replace with your own logic to determine if a tile at [x,y] has been viewed
        // A viewed tile is no longer covered by fog
        viewedTile: function(x, y) {
            return true;
        },
        update: function() {
            if (ig.input.state('esc')) {
                this.next = false;
                this.paused = false;
                console.log('esc')
            }
            if (ig.input.state("inventory")) {
                this.next = true
            }
            if (!ig.input.state('pause') && this.pausing) this.pausing = false;
        
            if (ig.input.state("pause")) {
                if (!this.pausing) {
                    this.paused = (this.paused) ? false : true;
                    this.pausing = true;
                };
            };
            if (ig.input.state('quaff')) {
                Array.prototype.removeByValue = function(val) {
                    for (var i = 0; i < this.length; i++) {
                        var c = this[i];
                        if (c == val || (val.equals && val.equals(c))) {
                            this.splice(i, 1);
                            break;
                        }
                    }
                };
                var result = ig.game.player.inventory.removeByValue( "Health Potion" );
                if (result != undefined && result == true) {
                    ig.game.player.health = ig.game.player.health != 100? 100:ig.game.player.health
                    this.font.draw("You quaffed a potion.", ig.system.width / 2, 224, ig.Font.ALIGN.CENTER)
                } else {
                    this.font.draw("You have no potions to quaff.", ig.system.width / 2, 224, ig.Font.ALIGN.CENTER)
                }
            }
            if (this.paused) return;
            this.parent()
            this.player = ig.game.getEntitiesByType(EntityPlayer)[0]
            if (this.player) {
                var player = this.player
                // Add your own, additional update code here
                x = player.pos.x - (ig.system.width / 2);
                y = player.pos.y - (ig.system.height / 2);
                this.screen.x = (x > 0 && x < this._mapWidth) ? x : this.screen.x;
                this.screen.y = (y > 0 && y < this._mapHeight) ? y : this.screen.y;
        
            }
            // update our shadowmap/lightmap state
            this.lightManager.update();
        }
    });
    EndGame = ig.Game.extend({
        img: new ig.Font('media/04b03.font.png'),
        init: function () {
            ig.inventory = [];
            ig.h = 100
            ig.attack = 4
            ig.defence = 2
            console.log('Whoops')
            ig.input.bind(ig.KEY.ESC,'esc')
        },
        draw: function () {
            this.parent()
            this.img.draw("R.I.P", ig.system.width/2, ig.system.height/2, ig.Font.ALIGN.CENTER)
        },
        update: function () {
            if (ig.input.state('esc')) {
                ig.system.setGame(MainGame)
            }
            this.parent()
        }
    });
if( ig.ua.mobile ) {
    ig.Sound.enabled = false;
}

    ig.main('#canvas', MainGame, 60, 320, 240, 2);
});
