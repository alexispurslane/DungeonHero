ig.module(
    'game.entities.book'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityBook = ig.Entity.extend({
	
	size: {x: 32, y: 32},
	delay: 1,
	delayTimer: null,
	triggerEntity: null,
	type: ig.Entity.TYPE.A, // Player friendly group
    checkAgainst: ig.Entity.TYPE.A,
    getSFX: new ig.Sound('media/coin.ogg'),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
        this.animSheet = new ig.AnimationSheet('media/tilesetd.png', 32, 32)
        this.addAnim('idle', 1, [1494]);
	},
	
	check: function (other) {
        this.getSFX.play()
        this.kill()
        ig.game.player.inventory.push("Book of Arrows")
	},
});

});