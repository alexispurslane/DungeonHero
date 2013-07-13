ig.module(
    'game.entities.levelchange'
)
.requires(
    'impact.entity'
)
.defines(function () {
    EntityLevelchange = ig.Entity.extend({
        _wmScalable : true,
        gameOverTest: false,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba( 0, 0, 255, 0.7 )',
        size: { x: 8, y: 8 },
        level: null,
        checkAgainst: ig.Entity.TYPE.A,
        update: function () {},
         
        check: function ( other ) {
            if ( other instanceof EntityPlayer ) {
                    ig.h = other.health;
                    ig.a = other.attack;
                    ig.d = other.defence;
                    this.nextLevel()
            }
        },
        nextLevel: function () {
            if ( this.level ){
                ig.game.fadeInNow = true
                ig.game.msg = "You went down the dark stairs..."
                var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function (m, l, a, b) {
                    return a.toUpperCase() + b;
                });
                ig.game.loadLevel(ig.global['Level' + levelName]);
                console.log('Level' +levelName);
                ig.game.fadeInNow = false
                ig.game.fadeOutNow = true
            }
        },
         
    });
});